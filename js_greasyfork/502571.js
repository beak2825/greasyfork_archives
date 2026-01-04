// ==UserScript==
// @name         Remove Yandere javascript-hide class
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Remove Yandere 'javascript-hide' class from elements
// @author       grays
// @match        https://yande.re/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yande.re
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502571/Remove%20Yandere%20javascript-hide%20class.user.js
// @updateURL https://update.greasyfork.org/scripts/502571/Remove%20Yandere%20javascript-hide%20class.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 获取所有带有 'javascript-hide' 类的元素
    var elements = document.querySelectorAll('.javascript-hide');
    // 遍历这些元素并移除 'javascript-hide' 类
    elements.forEach(function(element) {
        element.classList.remove('javascript-hide');
        element.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
    });
})();
