// ==UserScript==
// @name         CSDN 开启游客复制
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  解除CSDN对游客的选中限制
// @author       wanyi00
// @match        http*://blog.csdn.net/*
// @icon         https://g.csdnimg.cn/static/logo/favicon32.ico
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447786/CSDN%20%E5%BC%80%E5%90%AF%E6%B8%B8%E5%AE%A2%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/447786/CSDN%20%E5%BC%80%E5%90%AF%E6%B8%B8%E5%AE%A2%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let style = document.createElement('style');
    style.innerHTML = 'main *{user-select:text !important;}';
    document.head.append(style);
})();
