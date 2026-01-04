// ==UserScript==
// @name         JWPub Fix
// @version      1.0
// @description  Fix JWPub Timeout Error and Redirect to Login
// @author       wichael
// @match        https://mail.jwpub.org/ecp/auth/TimeoutLogout.aspx*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jwpub.org
// @license      MIT
// @namespace https://greasyfork.org/users/1052524
// @downloadURL https://update.greasyfork.org/scripts/463177/JWPub%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/463177/JWPub%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    window.location = 'https://mail.jwpub.org'
})();