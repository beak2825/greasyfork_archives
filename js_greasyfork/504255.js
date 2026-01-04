// ==UserScript==
// @name         Discord "science" API endpoint blocker
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Prevents POST requests to discord science api
// @author       Zombiebattler
// @author       https://github.com/Zombiebattler
// @match        https://discord.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504255/Discord%20%22science%22%20API%20endpoint%20blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/504255/Discord%20%22science%22%20API%20endpoint%20blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const blockedUrlPatterns = [
        /https:\/\/discord\.com\/api\/v\d+\/science/
    ];

    // Override the XMLHttpRequest send method
    const originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function(body) {
        for (let pattern of blockedUrlPatterns) {
            if (pattern.test(this._url) && this._method === "POST") {
                console.log("POST request to " + this._url + " has been blocked.");
                return;
            }
        }
        originalSend.call(this, body);
    };

    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
        this._method = method;
        this._url = url;
        originalOpen.call(this, method, url, async, user, password);
    };
})();
