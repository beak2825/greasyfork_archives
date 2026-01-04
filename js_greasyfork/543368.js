// ==UserScript==
// @name         Kimi K2 converted to Haiku 3.5
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Websim kimi k2 to haiku 3.5
// @author       @1robots123
// @license      MIT
// @supportURL   https://www.websim.com
// @match        *://websim.com/*
// @match        *://*.websim.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543368/Kimi%20K2%20converted%20to%20Haiku%2035.user.js
// @updateURL https://update.greasyfork.org/scripts/543368/Kimi%20K2%20converted%20to%20Haiku%2035.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // change the model if you want, this one is haiku 3.5
    const CUSTOM_MODEL = "haiku";

    // Intercept fetch requests
    const originalFetch = window.fetch;
    window.fetch = async function(resource, init) {
        if (init && init.body && typeof init.body === "string" && init.body.includes("kimi-k2")) {
            init.body = init.body.replace(/kimi-k2/g, CUSTOM_MODEL);
        }
        return originalFetch.apply(this, arguments);
    };

    //XMLHttpRequest
    const originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function(body) {
        if (body && typeof body === "string" && body.includes("kimi-k2")) {
            body = body.replace(/kimi-k2/g, CUSTOM_MODEL);
        }
        return originalSend.call(this, body);
    };
})();
