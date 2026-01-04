// ==UserScript==
// @name         扩大屏幕阅读范围-廖雪峰
// @version      0.1
// @description  删掉侧边栏
// @match        https://www.liaoxuefeng.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=liaoxuefeng.com
// @grant        none
// @namespace https://greasyfork.org/users/237658
// @downloadURL https://update.greasyfork.org/scripts/455936/%E6%89%A9%E5%A4%A7%E5%B1%8F%E5%B9%95%E9%98%85%E8%AF%BB%E8%8C%83%E5%9B%B4-%E5%BB%96%E9%9B%AA%E5%B3%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/455936/%E6%89%A9%E5%A4%A7%E5%B1%8F%E5%B9%95%E9%98%85%E8%AF%BB%E8%8C%83%E5%9B%B4-%E5%BB%96%E9%9B%AA%E5%B3%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementsByClassName('uk-flex-item-none x-sidebar-left')[0].remove();
})();