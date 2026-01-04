// ==UserScript==
// @name         GLOBO -> BLANK
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Redirect from globo to blank
// @author       Lukáš Malec
// @match        https://ge.globo.com/*/*/*/*/*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/506422/GLOBO%20-%3E%20BLANK.user.js
// @updateURL https://update.greasyfork.org/scripts/506422/GLOBO%20-%3E%20BLANK.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Current URL
    let currentUrl = window.location.href;

    // Replace "https://ge.globo.com/" with "https://blank.org/#https://ge.globo.com/" in the hostname
    let newUrl = currentUrl.replace("https://ge.globo.com/", "https://blank.org/#https://ge.globo.com/");

    // Redirect to the new URL if it is different from the current URL
    if (newUrl !== currentUrl) {
        window.location.replace(newUrl);
    }
})();