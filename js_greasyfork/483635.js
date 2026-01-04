// ==UserScript==
// @name         Tuxun Fun Static Color Changer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Change the background color of specific elements on Tuxun Fun to #696969 and make all card-top-right elements' background transparent
// @author       Your Name
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483635/Tuxun%20Fun%20Static%20Color%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/483635/Tuxun%20Fun%20Static%20Color%20Changer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待元素可用
    const waitForElements = () => {
        // 选择所有目标元素
        var elements = document.querySelectorAll('.container .grid_main .card[data-v-366c24ce]');

        if (elements.length > 0) {
            // 为每个元素设置背景色
            elements.forEach(function(element) {
                element.style.backgroundColor = '#696969';
            });

            // 选择所有.card-top-right元素并设置背景为透明
            var cardTopRightElements = document.querySelectorAll('#tuxun .card-top-right');
            cardTopRightElements.forEach(function(element) {
                element.style.backgroundColor = 'transparent';
            });
        } else {
            // 如果元素还未出现，稍后重试
            setTimeout(waitForElements, 500);
        }
    };

    // 开始等待元素
    waitForElements();
})();
