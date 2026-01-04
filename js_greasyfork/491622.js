// ==UserScript==
// @name         新东方雅思阻止浏览器右键弹窗
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在模考内阻止默认的浏览器右键弹窗，避免影响网站自带的高亮功能
// @author       ZZW
// @match        *://liuxue.koolearn.com/ielts/mock/test/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=koolearn.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491622/%E6%96%B0%E4%B8%9C%E6%96%B9%E9%9B%85%E6%80%9D%E9%98%BB%E6%AD%A2%E6%B5%8F%E8%A7%88%E5%99%A8%E5%8F%B3%E9%94%AE%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/491622/%E6%96%B0%E4%B8%9C%E6%96%B9%E9%9B%85%E6%80%9D%E9%98%BB%E6%AD%A2%E6%B5%8F%E8%A7%88%E5%99%A8%E5%8F%B3%E9%94%AE%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('contextmenu', function(event) {
        event.preventDefault();
    });

})();