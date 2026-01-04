// ==UserScript==
// @name         Dim the Whole Website Periodically
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Periodically ensure the whole website is dimmed to 50%
// @author       lemures
// @match        https://www.geoguessr.com/
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483822/Dim%20the%20Whole%20Website%20Periodically.user.js
// @updateURL https://update.greasyfork.org/scripts/483822/Dim%20the%20Whole%20Website%20Periodically.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var isDimmed = false;

    function dimWebsite() {
        if (!isDimmed) {
            document.body.style.filter = 'brightness(70%)';
            isDimmed = true;
        }
    }

    setInterval(dimWebsite, 1); // 100 milliseconds = 0.1 seconds
})();
