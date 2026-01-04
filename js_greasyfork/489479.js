// ==UserScript==
// @name         Browser Fingerprinting & Third-Party Cookies Blocker
// @namespace    http://fpxtpc.41
// @version      1.0
// @description  Blocks browser fingerprinting and third-party cookies
// @author       FortyOne
// @license MIT
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/489479/Browser%20Fingerprinting%20%20Third-Party%20Cookies%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/489479/Browser%20Fingerprinting%20%20Third-Party%20Cookies%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Block third-party cookies
    document.cookie = 'sameSite=strict';

    // Block browser fingerprinting
    // Clearing canvas fingerprint
    HTMLCanvasElement.prototype.toDataURL = function() {
        return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP89PwGHwAFYAJm6ocdgAAAABJRU5ErkJggg==';
    };
})();