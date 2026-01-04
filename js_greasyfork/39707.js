// ==UserScript==
// @name         廖雪峰官网去广告
// @namespace    a23187.cn
// @version      1.0.2
// @description  去掉廖雪峰官网【www.liaoxuefeng.com】上的广告
// @author       A23187
// @match        https://www.liaoxuefeng.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/39707/%E5%BB%96%E9%9B%AA%E5%B3%B0%E5%AE%98%E7%BD%91%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/39707/%E5%BB%96%E9%9B%AA%E5%B3%B0%E5%AE%98%E7%BD%91%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById('sponsor-b').outerHTML = '';
    document.getElementById('x-content-bottom').outerHTML = '';
})();