// ==UserScript==
// @name         小报童复制
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  解除 Xiaobot.net 上的文本选择和复制限制
// @author       Keniu
// @match        https://xiaobot.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xiaobot.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/524700/%E5%B0%8F%E6%8A%A5%E7%AB%A5%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/524700/%E5%B0%8F%E6%8A%A5%E7%AB%A5%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Function to unlock text selection and copying restrictions
    function unlockTextSelection() {
        try {
            // Unlock the body element
            document.body.style.userSelect = 'auto';
            document.body.onmousedown = null;
            document.body.onselectstart = null;

            // Unlock all elements
            document.querySelectorAll('*').forEach(element => {
                element.style.userSelect = 'auto';
                element.onmousedown = null;
                element.onselectstart = null;
            });

            console.log('Text selection and copying unlocked.');
        } catch (error) {
            console.error('Error unlocking text selection:', error);
        }
    }

    // Wait for the DOM to fully load before executing
    if (document.readyState === 'complete') {
        unlockTextSelection();
    } else {
        window.addEventListener('load', unlockTextSelection);
    }
})();