// ==UserScript==
// @name            Trololoh
// @name:ru         Трололох
// @description     Unlock maximum quality and rewind live streaming
// @description:ru  Разблокирует максимальное качество и перемотку прямой трансляции
// @icon            https://cdn.betterttv.net/emote/5c4dfbebb14f31753f94a74e/1x
// @icon64          https://cdn.betterttv.net/emote/5c4dfbebb14f31753f94a74e/3x
// @namespace       trololoh.user.js
// @license         WTFPL
// @author          -
// @match           https://trovo.live/*
// @grant           unsafeWindow
// @version         1.0.0
// @compatible      chrome     Violentmonkey 2.13.0
// @compatible      firefox    Tampermonkey 4.16.6160
// @homepageURL     https://greasyfork.org/ru/scripts/443137-trololoh
// @supportURL      https://greasyfork.org/ru/scripts/443137-trololoh/feedback
// @run-at          document-start
// @downloadURL https://update.greasyfork.org/scripts/443137/Trololoh.user.js
// @updateURL https://update.greasyfork.org/scripts/443137/Trololoh.meta.js
// ==/UserScript==

((root, console) => {
  'use strict';

  const OPERATIONS = [
    'live_LiveReaderService_GetLiveInfo',
    'commerce_SubscribeService_GetSubscribedUserStatus',
  ];
  const TEMPLATE = new RegExp(OPERATIONS.join('|'));

  const last = (arr) => arr[arr.length - 1];

  const stringify = (obj) =>
    typeof obj === 'string' ? obj : JSON.stringify(obj);

  const contains = (str, pattern) => pattern.test(stringify(str));

  const replace = (array, expected) => {
    const output = [];
    for (const obj of array) {
      const element = contains(obj, TEMPLATE) ? expected : obj;
      output.push(element);
    }
    return output;
  };

  const seek = (operations) => {
    for (const oper of operations) {
      if (contains(oper, TEMPLATE)) return oper;
    }
    return null;
  };

  const resolvep = (p) => p.then((x) => x.json()).catch(null);

  const scaffold = (method) => (params) =>
    new Promise((resolve, reject) => {
      const url = `https://function.ebnem.workers.dev/api/${method}`; // `http://127.0.0.1:1337/${method}`;
      console.debug('Fetch: %s, %O', url, params);
      root
        .fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json; charset=UTF-8' },
          body: JSON.stringify(params),
        })
        .then((response) => {
          const { status } = response;
          if (status === 200) {
            resolve(response);
            return;
          }
          reject(new Error(`HTTP Status Code: ${status}`));
        })
        .catch((error) => {
          console.debug('Failed call to the api: %o', error);
          reject(null);
        });
    });

  const buildAPI = (methods) => {
    const api = Object.create(null);
    for (const method of methods) {
      api[method] = scaffold(method);
    }
    return api;
  };

  const proxy = (target, callback) => {
    const instance = new Proxy(target, {
      apply: callback,
    });
    return instance;
  };

  const filter = (field) => {
    if (field === undefined || !contains(field, TEMPLATE)) throw 'skip';
    return null;
  };

  const interceptor = (...args) => {
    const output = Reflect.apply(...args);
    const { body } = last(last(args));
    try {
      filter(body);
    } catch (_) {
      return output;
    }
    const operation = seek(JSON.parse(body));
    if (operation === null) return output;
    console.debug('Seek: %O', operation);
    const { operationName, variables } = operation;
    const func = root.api[operationName];
    if (func === undefined) return output;
    const source = resolvep(output);
    const patch = resolvep(func(variables.params));
    return Promise.all([source, patch]).then(
      ([src, pat]) => {
        const patched = replace(src, pat);
        return new Response(stringify(patched), output);
      },
      (error) => {
        console.debug('Failed to patch api: %o', error);
        return Reflect.apply(...args);
      }
    );
  };

  root.api = buildAPI(OPERATIONS);
  root.fetch = proxy(root.fetch, interceptor);
})((W = unsafeWindow || window), Object.assign({}, W.console));
