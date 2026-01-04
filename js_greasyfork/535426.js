// ==UserScript==
// @name         Fetch to cURL Logger
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Intercepts all fetch requests and logs them as curl commands on the page
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535426/Fetch%20to%20cURL%20Logger.user.js
// @updateURL https://update.greasyfork.org/scripts/535426/Fetch%20to%20cURL%20Logger.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 로그 출력 레이어 생성
    const logContainer = document.createElement('div');
    Object.assign(logContainer.style, {
        position: 'fixed',
        top: '0',
        right: '0',
        maxHeight: '50%',
        width: '500px',
        overflowY: 'auto',
        backgroundColor: '#000',
        color: '#0f0',
        fontSize: '12px',
        zIndex: 99999,
        padding: '10px',
        whiteSpace: 'pre-wrap'
    });
    document.body.appendChild(logContainer);

    // fetch 가로채기
    const originalFetch = window.fetch;
    window.fetch = async function (input, init = {}) {
        const method = init.method || 'GET';
        const headers = new Headers(init.headers || {});
        const body = init.body;

        let url = typeof input === 'string' ? input : input.url;

        // curl 문자열 생성
        let curl = `curl '${url}' \\\n  -X ${method}`;
        headers.forEach((value, key) => {
            curl += ` \\\n  -H '${key}: ${value}'`;
        });

        if (body) {
            curl += ` \\\n  --data-raw '${body}'`;
        }

        logContainer.textContent += `[${new Date().toISOString()}] curl:\n${curl}\n\n`;

        return originalFetch.apply(this, arguments);
    };
})();