// ==UserScript==
// @name         美化ResearchGate
// @namespace    http://tampermonkey.net/
// @version      2024-02-02 v0.002
// @description  让ResearchGate的页面变宽
// @author       Ben MA
// @match        https://www.researchgate.net/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=researchgate.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486267/%E7%BE%8E%E5%8C%96ResearchGate.user.js
// @updateURL https://update.greasyfork.org/scripts/486267/%E7%BE%8E%E5%8C%96ResearchGate.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
// 查找要改变宽度的选择器，并设置宽度
    var selector = document.querySelector('.c-col-content');
    if (selector) {
        selector.style.width = '90%';
        selector.style.margin = '0 auto';
    }
    selector = document.querySelector('.c-content');
    if (selector) {
        selector.style.width = '102%';
        selector.style.margin = '0 auto';
    }
    //查询页
    selector = document.querySelector('.search-box.search-box--tabs');
    if (selector) {
        selector.style.width = '200%';
        selector.style.margin = '0 auto';
    }
    selector = document.querySelector('.search-container__content-promo-container');
    if (selector) {
        selector.style.display = 'none';
    }
})();