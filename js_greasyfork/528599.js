// ==UserScript==
// @name         知乎去掉标题里的私信
// @namespace    qtqz
// @version      0.3
// @description  烦人
// @author       qtqz
// @match        https://www.zhihu.com/*
// @icon         https://static.zhihu.com/heifetz/favicon.ico
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528599/%E7%9F%A5%E4%B9%8E%E5%8E%BB%E6%8E%89%E6%A0%87%E9%A2%98%E9%87%8C%E7%9A%84%E7%A7%81%E4%BF%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/528599/%E7%9F%A5%E4%B9%8E%E5%8E%BB%E6%8E%89%E6%A0%87%E9%A2%98%E9%87%8C%E7%9A%84%E7%A7%81%E4%BF%A1.meta.js
// ==/UserScript==
// 2025-02-19 created

(function() {
    'use strict';
    let t2 = setTimeout(() => {
      document.title = document.title.replace(/^\(.*?\) /,'')
    }, 2000);
    let t = setInterval(() => {
      document.title = document.title.replace(/^\(.*?\) /,'')
    }, 10000);//它老是又弹出来
})();