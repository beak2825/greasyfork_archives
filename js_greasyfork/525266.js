// ==UserScript==
// @name         Network Sniffer 🌐
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Logs XHR, Fetch, WebSocket, and Service Worker requests
// @author       Manu OVG
// @match        *://*/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/525266/Network%20Sniffer%20%F0%9F%8C%90.user.js
// @updateURL https://update.greasyfork.org/scripts/525266/Network%20Sniffer%20%F0%9F%8C%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 🌍 UI Creation
    let panel = document.createElement('div');
    panel.innerHTML = `
        <style>
            .sniffer-ui {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 400px;
                max-height: 500px;
                background: rgba(30, 30, 30, 0.95);
                color: white;
                font-family: Arial, sans-serif;
                font-size: 12px;
                border-radius: 8px;
                padding: 10px;
                box-shadow: 0 4px 10px rgba(0,0,0,0.3);
                overflow: hidden;
                z-index: 9999;
            }
            .sniffer-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding-bottom: 5px;
                border-bottom: 1px solid #555;
            }
            .sniffer-title { font-weight: bold; }
            .sniffer-close { cursor: pointer; color: red; font-weight: bold; }
            .sniffer-body {
                max-height: 400px;
                overflow-y: auto;
                padding-top: 5px;
            }
            .sniffer-item {
                padding: 5px;
                border-bottom: 1px solid #444;
                word-wrap: break-word;
            }
            .sniffer-get { color: #4CAF50; }  /* Green */
            .sniffer-post { color: #FFC107; } /* Yellow */
            .sniffer-fetch { color: #03A9F4; } /* Blue */
            .sniffer-websocket { color: #FF5722; } /* Red */
            .sniffer-copy {
                background: #008CBA;
                color: white;
                padding: 4px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 10px;
                margin-top: 5px;
            }
            .sniffer-counter {
                font-size: 14px;
                font-weight: bold;
                color: #FFD700;
            }
        </style>
        <div class="sniffer-ui">
            <div class="sniffer-header">
                <span class="sniffer-title">🌐 Network Sniffer (<span class="sniffer-counter">0</span>)</span>
                <span class="sniffer-close">✖</span>
            </div>
            <div class="sniffer-body"></div>
        </div>
    `;

    document.body.appendChild(panel);
    
    let snifferBody = panel.querySelector('.sniffer-body');
    let closeBtn = panel.querySelector('.sniffer-close');
    let counter = panel.querySelector('.sniffer-counter');
    let requestCount = 0;

    // ✖ Close UI on click
    closeBtn.onclick = () => panel.style.display = 'none';

    // 🔥 Function to log requests in UI
    function logRequest(type, method, url) {
        requestCount++;
        counter.innerText = requestCount; // Update request counter
        let colorClass = type === 'GET' ? 'sniffer-get' : type === 'POST' ? 'sniffer-post' : type === 'WebSocket' ? 'sniffer-websocket' : 'sniffer-fetch';
        let requestItem = document.createElement('div');
        requestItem.classList.add('sniffer-item', colorClass);
        requestItem.innerHTML = `
            <b>${type} | ${method}</b> → ${url}
            <button class="sniffer-copy">📋 Copy</button>
        `;

        snifferBody.prepend(requestItem);

        // 📋 Copy URL on click
        requestItem.querySelector('.sniffer-copy').onclick = () => {
            GM_setClipboard(url);
            alert("URL copied!");
        };
    }

    // 🕵️ Intercept XHR requests
    (function(open) {
        XMLHttpRequest.prototype.open = function(method, url) {
            this.addEventListener("load", function() {
                logRequest("XHR", method, url);
            });
            open.apply(this, arguments);
        };
    })(XMLHttpRequest.prototype.open);

    // 🕵️ Intercept Fetch requests
    (function(fetch) {
        window.fetch = function() {
            let url = arguments[0];
            let method = arguments[1] && arguments[1].method ? arguments[1].method.toUpperCase() : 'GET';
            logRequest("Fetch", method, url);
            return fetch.apply(this, arguments);
        };
    })(window.fetch);

    // 🕵️ Capture WebSocket requests
    let originalWebSocket = window.WebSocket;
    window.WebSocket = function(url, protocols) {
        let ws = new originalWebSocket(url, protocols);
        logRequest("WebSocket", "CONNECT", url);
        ws.addEventListener('message', function(event) {
            console.log("WebSocket Message: ", event.data);
        });
        return ws;
    };

    // 🕵️ Capture Service Worker requests
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('message', function(event) {
            logRequest("ServiceWorker", event.data.method, event.data.url);
        });
    }
})();
