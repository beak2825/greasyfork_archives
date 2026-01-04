// ==UserScript==
// @name         bilibili增强
// @namespace    http://tampermonkey.net/
// @version      2024-05-30
// @description  :zh-cn
// @author       zyieng
// @match        https://www.bilibili.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495944/bilibili%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/495944/bilibili%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function calculatePercentage() {
        const curPageElement = document.querySelector('.cur-page');
        if (curPageElement) {
            const content = curPageElement.textContent.trim();
            const match = content.match(/(\d+)\/(\d+)/);
            if (match) {
                const current = parseInt(match[1], 10);
                const total = parseInt(match[2], 10);
                const progress = (current / total) * 100;

                let progressElement = curPageElement.parentNode.querySelector('.progress-percentage');
                if (!progressElement) {
                    progressElement = document.createElement('span');
                    progressElement.className = 'progress-percentage';
                    progressElement.style.marginLeft = '10px';
                    progressElement.style.color = 'green';
                    curPageElement.parentNode.appendChild(progressElement);
                }

                progressElement.textContent = `(${progress.toFixed(2)}%)`;
            }
        } else {
            console.error('Element with selector ".cur-page" not found.');
        }
    }

    function onDocumentReady() {
        if (document.readyState === 'complete') {
            setTimeout(calculatePercentage, 5000); // 延迟5秒执行
        } else {
            window.addEventListener('load', function() {
                setTimeout(calculatePercentage, 5000); // 延迟5秒执行
            });
        }
    }

    onDocumentReady();

    function observeInnerHTMLChange(selector, callback) {
        const targetElement = document.querySelector(selector);
        if (targetElement) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList' || mutation.type === 'characterData') {
                        callback();
                    }
                });
            });

            const config = { childList: true, characterData: true, subtree: true };
            observer.observe(targetElement, config);
        } else {
            console.error(`Element with selector "${selector}" not found for MutationObserver.`);
        }
    }

    observeInnerHTMLChange('.cur-page', calculatePercentage);

})();