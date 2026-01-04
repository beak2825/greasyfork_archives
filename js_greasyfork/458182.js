// ==UserScript==
// @name         9GAG comments by default
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically opens 9GAG comments instead of related posts.
// @author       DaimonFrey
// @match        https://9gag.com/gag/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=9gag.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458182/9GAG%20comments%20by%20default.user.js
// @updateURL https://update.greasyfork.org/scripts/458182/9GAG%20comments%20by%20default.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (!document.location.hash) {
        document.location.hash = 'comment';
    }
})();