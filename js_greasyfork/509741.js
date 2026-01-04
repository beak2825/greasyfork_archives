// ==UserScript==
// @name         Modify Accept-Language Header
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Force Accept-Language header to include en-US and zh-CN
// @author       You
// @match        *://*/*
// @grant        none
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/509741/Modify%20Accept-Language%20Header.user.js
// @updateURL https://update.greasyfork.org/scripts/509741/Modify%20Accept-Language%20Header.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Intercept and modify XMLHttpRequest to change headers
    var open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        this.addEventListener('readystatechange', function() {
            if (this.readyState === 4) {
                // Set both en-US and zh-CN in the Accept-Language header
                this.setRequestHeader('Accept-Language', 'en-US,en;q=0.9,zh-CN,zh;q=0.8');
            }
        });
        open.apply(this, arguments);
    };

    // Intercept fetch to modify headers
    var originalFetch = window.fetch;
    window.fetch = function() {
        arguments[1] = arguments[1] || {};
        arguments[1].headers = arguments[1].headers || {};
        // Set both en-US and zh-CN in the Accept-Language header
        arguments[1].headers['Accept-Language'] = 'en-US,en;q=0.9,zh-CN,zh;q=0.8';
        return originalFetch.apply(this, arguments);
    };
})();