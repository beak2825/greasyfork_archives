// ==UserScript==
// @name         Weibo Keepalive
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  保持微博账号登录，避免烦人的跳转。
// @author       lujjjh
// @license      MIT
// @match        https://weibo.com/*
// @match        https://www.weibo.com/*
// @match        https://s.weibo.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=weibo.com
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/461685/Weibo%20Keepalive.user.js
// @updateURL https://update.greasyfork.org/scripts/461685/Weibo%20Keepalive.meta.js
// ==/UserScript==

{
  let keepalive = () => {
    const iframe = document.createElement('iframe');
    Object.assign(iframe.style, {
      position: 'absolute',
      left: '-1000px',
      top: '0',
      width: '1px',
      height: '1px'
    });
    iframe.src = `https://login.sina.com.cn/sso/login.php?url=https%3A%2F%2Fweibo.com%2Flogin.php`;
    document.body.append(iframe);
    setTimeout(() => void iframe.remove(), 10e3);
  };
  setInterval(keepalive, 300e3);
  keepalive();
}
