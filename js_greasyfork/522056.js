// ==UserScript==
// @name         网页加载分析
// @version      1.08
// @description  测试网页加载延迟，显示延迟最高的三个域名。Test the webpage loading speed and display the domain names of the three slowest loading URLs.
// @match        *://*/*
// @run-at       document-start
// @author         yzcjd
// @author2       Lama AI 辅助
// @namespace    https://greasyfork.org/users/1171320
// @exclude      *://*.cloudflare.com/*
// @exclude      *://*.recaptcha.net/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522056/%E7%BD%91%E9%A1%B5%E5%8A%A0%E8%BD%BD%E5%88%86%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/522056/%E7%BD%91%E9%A1%B5%E5%8A%A0%E8%BD%BD%E5%88%86%E6%9E%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const loadTimeElement = document.createElement('div');
    loadTimeElement.id = 'loadTimeDisplay';
    loadTimeElement.style.cssText = `
            position: fixed;
            top: 90%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: grey;
            padding: 5px;
            border-radius: 8px;
            box-shadow: 0 0 15px rgba(0,0,0,0.3);
            white-space: nowrap;
            width: 400px;
            z-index: 9999;
            background-color: #f5f5f5;
            color: black;
    `;

    const startTime = performance.now();
    let slowestRequests = [];

    const networkObserver = new PerformanceObserver((list, observer) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
            slowestRequests.push({ name: entry.name, duration: entry.duration });
            slowestRequests.sort((a, b) => b.duration - a.duration);
            slowestRequests = slowestRequests.slice(0, 3);
        });
    });

    networkObserver.observe({ entryTypes: ['resource'] });

    window.addEventListener('load', () => {
        const endTime = performance.now();
        const timeElapsed = endTime - startTime;

        let networkInfo = '';
        if (slowestRequests.length > 0) {
            networkInfo = slowestRequests.map(req => {
                try {
                    const url = new URL(req.name);
                    return `slow: ${url.hostname} (${req.duration.toFixed(2)}ms)<br>`;
                } catch (error) {
                    return `slow: Invalid URL (${req.duration.toFixed(2)}ms)<br>`;
                }
            }).join('');
        } else {
            networkInfo = '[none]';
        }

        loadTimeElement.innerHTML = `
            <h2>Time: ${timeElapsed.toFixed(2)}ms</h2>
            ${networkInfo}
        `;

        document.body.appendChild(loadTimeElement);

        setTimeout(() => {
            loadTimeElement.remove();
        }, 5000);
    });
})();