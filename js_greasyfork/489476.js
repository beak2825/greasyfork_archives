// ==UserScript==
// @name         Age Restriction Bypass
// @namespace    http://agexdnt.41
// @version      1.0
// @description  Adds simple age no limiter and Do not track.
// @author       FortyOne
// @match        *://*/*
// @grant        none
// @noframes
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/489476/Age%20Restriction%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/489476/Age%20Restriction%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeAgeRestriction() {}

    window.addEventListener('load', removeAgeRestriction);
    
    if (navigator.doNotTrack === '1') {
        console.log('Do Not Track is enabled');
    }
})();