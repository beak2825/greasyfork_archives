// ==UserScript==
// @name         link cleaner: Taobao
// @description  移除淘寶與天貓商品網址的追蹤碼
// @match        https://item.taobao.com/*
// @match        https://detail.tmall.com/*
// @grant        none
// @license      MIT
// @version 0.0.1.20230328050354
// @namespace https://greasyfork.org/users/1044461
// @downloadURL https://update.greasyfork.org/scripts/462111/link%20cleaner%3A%20Taobao.user.js
// @updateURL https://update.greasyfork.org/scripts/462111/link%20cleaner%3A%20Taobao.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const cU = window.location.href;
    const itemId = cU.match(/id=\d+(?=&|$)/)[0];
    const newUrl = cU.split('?')[0] + '?' + itemId;
    window.history.replaceState(null, '', newUrl);
})();
