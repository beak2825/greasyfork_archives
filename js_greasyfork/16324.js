// ==UserScript==
// @name        Niconico Live Auto Enter
// @description 開場したら自動で入場します
// @version     0.2.4
// @include     https://live.nicovideo.jp/watch/*
// @grant       GM_xmlhttpRequest
// @author      xulapp
// @namespace   https://twitter.com/xulapp
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/16324/Niconico%20Live%20Auto%20Enter.user.js
// @updateURL https://update.greasyfork.org/scripts/16324/Niconico%20Live%20Auto%20Enter.meta.js
// ==/UserScript==
/* eslint-env browser, greasemonkey */
'use strict';

function atLeast(promises, num) {
  return new Promise((resolve, reject) => {
    const resolved = [];
    const rejected = [];

    function ok(arg) {
      resolved.push(arg);
      added();
    }

    function ng(err) {
      rejected.push(err);
      added();
    }

    function added() {
      if (resolved.length + rejected.length < promises.length)
        return;

      if (resolved.length < num)
        reject(rejected);

      else
        resolve(resolved);
    }

    for (let p of promises)
      Promise.resolve(p).then(ok, ng);
  });
}

const getJST = (() => {
  const servers = [
    '//ntp-a1.nict.go.jp/cgi-bin/json',
    '//ntp-b1.nict.go.jp/cgi-bin/json',
  ];

  let diff = 0;

  function getJST() {
    return Date.now() + diff;
  }

  function get(options) {
    if (typeof options === 'string')
      options = {url: options};

    return new Promise((onload, onerror) => {
      GM_xmlhttpRequest(Object.assign({}, options, {onload, onerror}));
    });
  }

  function getJSON(...args) {
    return get(...args).then(res => JSON.parse(res.responseText));
  }

  function fetchDiff(server) {
    return getJSON(`${server}?${Date.now() / 1000}`).then(res => {
      const rt = Date.now() / 1000;
      const {it, st} = res;

      return (st - (it + rt) / 2) * 1000;
    });
  }

  function onload(arr) {
    if (arr.length)
      diff = arr.reduce((a, b) => a + b) / arr.length | 0;

    console.log(`時差を取得しました [${diff < 0 ? '' : '+'}${diff}ms]`);

    return diff;
  }

  function onerror(err) {
    console.log('時差の取得に失敗しました');

    for (let res of err)
      if (res instanceof Error)
        console.log(res.message);

      else
        console.log(`  ${res.status} ${res.statusText} ${res.finalUrl}`);

    return null;
  }

  getJST.ready = atLeast(servers.map(fetchDiff), 1).then(onload, onerror);

  return getJST;
})();

getJST.ready.then(() => {
  const notificationTitle = 'Niconico Live Auto Enter';
  const notificationDefaults = {
    icon: (document.querySelector('meta[itemprop="thumbnail"]') || 0).content,
    tag: 'niconico-live-auto-enter',
    autoClose: 5000,
  };

  const programTitle = (document.querySelector('.program-title[itemprop="name"]') || 0).textContent;
  const published = Date.parse((document.querySelector('.kaijo meta[itemprop="datePublished"]') || 0).content);
  const notified = {};

  if (!published || getRemaining() <= 0)
    return;

  const timer = () => {
    const remaining = getRemaining();

    if (remaining <= 0) {
      notifyEnter();
      enter();
      return;
    }

    const sec = getRemainingSeconds();
    const wait = sec < 1 ? 0 : sec < 10 ? 100 : sec < 3600 ? 1000 : 10000;

    setTimeout(timer, wait);

    const target = roundRemaining(remaining);

    if (target in notified)
      return;

    notifyRemaining(remaining);
    notified[target] = true;
  };

  timer();

  function getRemainingSeconds() {
    return (published - getJST()) / 1000;
  }

  function getRemaining() {
    return Math.ceil(getRemainingSeconds() / 60);
  }

  function roundRemaining(remaining) {
    for (let m of [0, 1, 3, 5, 10, 20, 30])
      if (remaining <= m)
        return m;

    return Math.ceil(remaining / 60) * 60;
  }

  function notify(body, options) {
    options = Object.assign({body}, notificationDefaults, options);

    return new Promise((resolve, reject) => {
      Notification.requestPermission(status => {
        if (status !== 'granted') {
          reject(status);
          return;
        }

        const n = new Notification(notificationTitle, options);

        if (options.autoClose)
          setTimeout(() => n.close(), options.autoClose);

        resolve(n);
      });
    });
  }

  function notifyRemaining(remaining) {
    const minutes = remaining % 60;
    const hours = remaining / 60 % 24 | 0;
    const days = remaining / 60 / 24 | 0;

    const timeStr = [];

    if (days)
      timeStr.push(`${days} 日`);

    if (hours)
      timeStr.push(`${hours} 時間`);

    if (minutes || !timeStr.length)
      timeStr.push(`${minutes} 分`);

    notify(`${programTitle}\n\n開場まで、あと ${timeStr.join(' ')} です。`);
  }

  function notifyEnter() {
    notify('入場します！');
  }

  function enter() {
    location.reload(true);
  }
});
