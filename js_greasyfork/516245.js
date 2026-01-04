// ==UserScript==
// @name         Moodle Autologin (Cookie Clicker)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Auto-clicks the SSO button if cookies are present.
// @author       You
// @match        https://your.moodle.login.page
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/516245/Moodle%20Autologin%20%28Cookie%20Clicker%29.user.js
// @updateURL https://update.greasyfork.org/scripts/516245/Moodle%20Autologin%20%28Cookie%20Clicker%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Find the SSO button by its class name
    const ssoButton = document.querySelector('.login-identityprovider-btn');

    if (ssoButton) {
        // Click the button to initiate login.
        ssoButton.click();
    }
})();