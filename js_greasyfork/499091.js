// ==UserScript==
// @name         自动展开“安娜的档案”外部下载列表
// @namespace    http://tampermonkey.net/
// @version      1.61
// @description  自动点击书籍页面中的 "show external downloads"（Automatically click "show external downloads" on Anna's Archive pages）
// @author       GPT-4o
// @match        https://*.annas-archive.*/md5/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499091/%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E2%80%9C%E5%AE%89%E5%A8%9C%E7%9A%84%E6%A1%A3%E6%A1%88%E2%80%9D%E5%A4%96%E9%83%A8%E4%B8%8B%E8%BD%BD%E5%88%97%E8%A1%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/499091/%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E2%80%9C%E5%AE%89%E5%A8%9C%E7%9A%84%E6%A1%A3%E6%A1%88%E2%80%9D%E5%A4%96%E9%83%A8%E4%B8%8B%E8%BD%BD%E5%88%97%E8%A1%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to click the "show external downloads" button
    function clickShowExternalDownloads() {
        let button = document.querySelector('a.js-show-external-button');
        if (!button) {
            const buttons = document.querySelectorAll('a');
            buttons.forEach(btn => {
                if (btn.textContent.trim() === 'show external downloads') {
                    button = btn;
                }
            });
        }

        if (button) {
            button.click();
        } else {
            console.log('Button not found.');
        }
    }

    // Retry mechanism to ensure the button is clicked even if the page takes time to load
    function retryClick(retries, delay) {
        if (retries <= 0) return;
        setTimeout(function() {
            clickShowExternalDownloads();
            retryClick(retries - 1, delay);
        }, delay);
    }

    // Wait for the page to load completely before executing the function
    window.addEventListener('load', function() {
        retryClick(20, 1000);  // Try 20 times with a 1-second interval
    });
})();