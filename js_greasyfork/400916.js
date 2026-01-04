// ==UserScript==
// @name         TOTM Debug =1
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  enabling totmdebug without adding the parameter
// @author       You
// @match        htt*://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400916/TOTM%20Debug%20%3D1.user.js
// @updateURL https://update.greasyfork.org/scripts/400916/TOTM%20Debug%20%3D1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.totmdbg = true;
})();