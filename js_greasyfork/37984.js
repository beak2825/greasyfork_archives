// ==UserScript==
// @name         廖雪峰的官方网站 阅读体验优化调节
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://www.liaoxuefeng.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37984/%E5%BB%96%E9%9B%AA%E5%B3%B0%E7%9A%84%E5%AE%98%E6%96%B9%E7%BD%91%E7%AB%99%20%E9%98%85%E8%AF%BB%E4%BD%93%E9%AA%8C%E4%BC%98%E5%8C%96%E8%B0%83%E8%8A%82.user.js
// @updateURL https://update.greasyfork.org/scripts/37984/%E5%BB%96%E9%9B%AA%E5%B3%B0%E7%9A%84%E5%AE%98%E6%96%B9%E7%BD%91%E7%AB%99%20%E9%98%85%E8%AF%BB%E4%BD%93%E9%AA%8C%E4%BC%98%E5%8C%96%E8%B0%83%E8%8A%82.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var oCent = document.querySelector('.x-content .x-main-content');
    oCent.style['font-size'] = '20px';
    oCent.style['line-height'] = '30px';
})();