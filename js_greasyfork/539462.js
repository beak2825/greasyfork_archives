// ==UserScript==
// @name         Enazo最大文字输入数限拓展
// @namespace    http://tampermonkey.net/
// @version      2025-06-15
// @description  Extend The Message Length Limit In Enazo's Chat Box.
// @author       Noa
// @match        https://enazo.cn/r/*
// @icon         https://enazo.cn/favicon.ico
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/539462/Enazo%E6%9C%80%E5%A4%A7%E6%96%87%E5%AD%97%E8%BE%93%E5%85%A5%E6%95%B0%E9%99%90%E6%8B%93%E5%B1%95.user.js
// @updateURL https://update.greasyfork.org/scripts/539462/Enazo%E6%9C%80%E5%A4%A7%E6%96%87%E5%AD%97%E8%BE%93%E5%85%A5%E6%95%B0%E9%99%90%E6%8B%93%E5%B1%95.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function modifyInputMaxLength() {
        const input = document.querySelector('.draw-message-form .message-input');
        if (input && input.maxLength === 40) {
            input.maxLength = 140;
        }
    }

    const observer = new MutationObserver((mutationsList, observer) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList' || mutation.type === 'attributes') {
                if (document.querySelector('.draw-message-form .message-input')) {
                    modifyInputMaxLength();
                    observer.disconnect();
                    break;
                }
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true, attributes: true });
    modifyInputMaxLength();

})();