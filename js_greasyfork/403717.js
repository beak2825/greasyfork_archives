// ==UserScript==
// @name            VK: Check Online
// @name:ru         ВК: Проверка онлайна
// @description     Checks the last online on page user and in dialog
// @description:ru  Проверяет последний онлайн пользователя на странице и в диалогe
// @namespace       vk-check-online.user.js
// @license         MIT
// @author          askornot
// @version         1.5.2
// @match           https://vk.com/*
// @connect         vk.com
// @compatible      chrome     Violentmonkey 2.18.0
// @compatible      firefox    Violentmonkey 2.13.3
// @compatible      firefox    Tampermonkey 4.18.1
// @homepageURL     https://greasyfork.org/en/scripts/403717-vk-check-online
// @supportURL      https://greasyfork.org/en/scripts/403717-vk-check-online/feedback
// @run-at          document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/403717/VK%3A%20Check%20Online.user.js
// @updateURL https://update.greasyfork.org/scripts/403717/VK%3A%20Check%20Online.meta.js
// ==/UserScript==

(function (W) {
  'use strict';

  const IM_ID = 'payload,1,1,0,id';
  const IM_ONLINE = 'payload,1,0,last_seen';
  const PROFILE_ID = 'response,users.get,0,id';
  const PROFILE_ONLINE = 'response,users.get,0,online_info';

  const IM_INFO = {
    can_see: 1,
    platform: 0,
    time: 0,
    mobile: 0,
  };

  const PROFILE_INFO = {
    visible: true,
    last_seen: 0,
    app_id: 0,
    is_online: false,
    is_mobile: false,
  };

  const last = (arr) => arr[arr.length - 1];

  const match = (s) => /online_info|a_start/.test(s);

  const getByPath = (data, dataPath) => {
    const path = dataPath.split(',');
    let object = data;
    for (const name of path) {
      const next = object[name];
      if (next === null || next === undefined) return next;
      object = next;
    }
    return object;
  };

  const setByPath = (data, dataPath, value) => {
    const path = dataPath.split(',');
    const len = path.length;
    let obj = data;
    let i = 0;
    let next, prop;
    for (;;) {
      if (typeof obj !== 'object') return false;
      prop = path[i];
      if (i === len - 1) {
        obj[prop] = value;
        return true;
      }
      next = obj[prop];
      if (next === undefined || next === null) {
        next = {};
        obj[prop] = next;
      }
      obj = next;
      i++;
    }
  };

  const parse = (text) => {
    const parser = new DOMParser();
    const body = parser.parseFromString(text, 'text/html');
    const [element] = body.getElementsByTagName('ya:lastloggedin');
    if (!element) return 0;
    const date = element.getAttribute('dc:date');
    return Date.parse(date) / 1000;
  };

  const request = (url, callback) => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === xhr.DONE) {
        if (xhr.status === 0 || xhr.status === 200) {
          callback(xhr.responseText);
        }
      }
    };
    xhr.open('GET', url, true);
    xhr.send();
  };

  const foaf = (id) => `https://vk.com/foaf.php?id=${id}`;

  const profile = (data) => {
    const info = getByPath(data, PROFILE_ONLINE);
    if (info && info.visible === true) return Promise.resolve(data);
    const id = getByPath(data, PROFILE_ID);
    if (id === undefined) return Promise.resolve(data);
    return fetch(foaf(id))
      .then((res) => res.text())
      .then(parse)
      .then((time) => {
        setByPath(data, PROFILE_ONLINE, { ...PROFILE_INFO, last_seen: time });
        return data;
      });
  };

  const im = (data, callback) => {
    const info = getByPath(data, IM_ONLINE);
    if (info && info.can_see === 1) return callback();
    const id = getByPath(data, IM_ID);
    if (id === undefined) return callback();
    request(foaf(id), (text) => {
      const time = parse(text);
      setByPath(data, IM_ONLINE, { ...IM_INFO, time });
      callback();
    });
  };

  const queries = new WeakSet();

  const xhr = W.XMLHttpRequest && W.XMLHttpRequest.prototype;

  const onreadystatechange = (self) => {
    self.onreadystatechange = new Proxy(self.onreadystatechange, {
      apply(...args) {
        if (self.readyState === xhr.DONE) {
          const data = JSON.parse(self.responseText);
          im(data, () => {
            Object.defineProperty(self, 'responseText', {
              value: JSON.stringify(data),
              writable: true,
            });
            return Reflect.apply(...args);
          });
        }
      },
    });
  };

  xhr.open = new Proxy(xhr.open, {
    apply(target, self, argumentsList) {
      const url = argumentsList[1];
      if (match(url)) queries.add(self);
      return Reflect.apply(target, self, argumentsList);
    },
  });

  xhr.send = new Proxy(xhr.send, {
    apply(target, self, argumentsList) {
      if (queries.has(self)) onreadystatechange(self);
      return Reflect.apply(target, self, argumentsList);
    },
  });

  W.fetch = new Proxy(W.fetch, {
    apply(...args) {
      const promise = Reflect.apply(...args);
      const argumentsList = last(args);
      const { body } = last(argumentsList);
      if (!match(body)) return promise;
      return promise
        .then((res) => res.clone())
        .then((res) => res.json())
        .then(profile)
        .then((patched) => new Response(JSON.stringify(patched), promise))
        .catch(() => promise);
    },
  });

  const patch = () => {
    W.extend = new Proxy(W.extend, {
      apply(target, self, argumentsList) {
        const object = argumentsList[0];
        const { apiPrefetchCache } = last(argumentsList);
        if (!apiPrefetchCache) return Reflect.apply(target, self, argumentsList);
        const filtered = apiPrefetchCache.filter(
          ({ method }) => method !== 'users.get',
        );
        return Reflect.apply(target, self, [
          object,
          { apiPrefetchCache: filtered },
        ]);
      },
    });
  };

  new MutationObserver((_, observer) => {
    try {
      patch();
      observer.disconnect();
    } catch {}
  }).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})(unsafeWindow || window);
