// ==UserScript==
// @name         JJWXC Font Size Increaser
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Increase font size on www.jjwxc.com by 1.82 times
// @author       林涂
// @match        *://www.jjwxc.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503792/JJWXC%20Font%20Size%20Increaser.user.js
// @updateURL https://update.greasyfork.org/scripts/503792/JJWXC%20Font%20Size%20Increaser.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 选择所有可能的文本元素，这里使用了一些常见的文本容器元素
    var textElements = document.querySelectorAll('body p, body div, body span, body li, body h1, body h2, body h3, body h4, body h5, body h6, body a');

    // 遍历所有元素，并增加字体大小
    textElements.forEach(function(element) {
        // 确保元素有fontSize属性可以修改
        if (window.getComputedStyle(element).fontSize !== '0px' && window.getComputedStyle(element).display !== 'none') {
            // 读取当前的fontSize（可能是相对单位如em, rem, %等），但这里我们假设它是px单位进行简化
            // 实际上，你可能需要更复杂的逻辑来处理不同的单位
            var currentFontSize = parseFloat(window.getComputedStyle(element).fontSize);
            if (!isNaN(currentFontSize)) {
                // 增加字体大小为原来的1.82倍
                element.style.fontSize = (currentFontSize * 1.82) + 'px';
            }
        }
    });
})();