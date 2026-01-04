// ==UserScript==
// @name         Capture Bearer Token
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Fetch and display Bearer tokens from all sites
// @author       ForestArmy
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531823/Capture%20Bearer%20Token.user.js
// @updateURL https://update.greasyfork.org/scripts/531823/Capture%20Bearer%20Token.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function displayToken(token) {
        console.log("Captured Bearer Token:", token);

        let existing = document.getElementById("token-box");
        if (existing) return; // Prevent multiple displays

        let div = document.createElement("div");
        div.id = "token-box";
        div.style.position = "fixed";
        div.style.top = "10px";
        div.style.right = "10px";
        div.style.background = "black";
        div.style.color = "white";
        div.style.padding = "10px";
        div.style.borderRadius = "5px";
        div.style.zIndex = "9999";
        div.style.whiteSpace = "pre-wrap";
        div.style.maxWidth = "90vw";
        div.style.overflowX = "auto";
        div.innerText = "Bearer Token: " + token;
        document.body.appendChild(div);
    }

    // Hook Fetch API
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        return originalFetch(...args).then(response => {
            let requestHeaders = args[1]?.headers;
            if (requestHeaders) {
                for (let header of Object.keys(requestHeaders)) {
                    if (header.toLowerCase() === "authorization" && requestHeaders[header].startsWith("Bearer ")) {
                        displayToken(requestHeaders[header]);
                    }
                }
            }
            return response;
        });
    };

    // Hook XMLHttpRequest
    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
        this.addEventListener("readystatechange", function() {
            if (this.readyState === 4) {
                let authHeader = this.getResponseHeader("Authorization");
                if (authHeader && authHeader.startsWith("Bearer ")) {
                    displayToken(authHeader);
                }
            }
        });
        return originalXHROpen.apply(this, arguments);
    };

    // Hook Fetch Headers (Works for sites using new Header() API)
    const originalHeaders = window.Headers;
    window.Headers = function(init) {
        if (init) {
            for (let [key, value] of Object.entries(init)) {
                if (key.toLowerCase() === "authorization" && value.startsWith("Bearer ")) {
                    displayToken(value);
                }
            }
        }
        return new originalHeaders(init);
    };

    // Hook WebSockets (Experimental)
    const originalWebSocket = window.WebSocket;
    window.WebSocket = function(...args) {
        let ws = new originalWebSocket(...args);
        ws.addEventListener("message", function(event) {
            let data = event.data;
            if (typeof data === "string" && data.includes("Bearer ")) {
                let match = data.match(/Bearer\s+([A-Za-z0-9._-]+)/);
                if (match) {
                    displayToken(match[0]);
                }
            }
        });
        return ws;
    };
})();