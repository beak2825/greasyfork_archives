// ==UserScript==
// @name         Bing to Google
// @namespace    https://github.com/randomstuff69/
// @version      1.0
// @description  uses bing instead of google while still working on microsoft rewards
// @author       randomstuff69
// @match        *
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528805/Bing%20to%20Google.user.js
// @updateURL https://update.greasyfork.org/scripts/528805/Bing%20to%20Google.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.hostname.includes('bing.com')) {
        window.location.href = window.location.href.replace('bing.com', 'google.com');
    }
})();