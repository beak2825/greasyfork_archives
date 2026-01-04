// ==UserScript==
// @name         Legacy Twitter
// @namespace    Azzu
// @version      1.0.1
// @description  Switches all twitter to legacy twitter.
// @author       Azzu
// @match        https://twitter.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369801/Legacy%20Twitter.user.js
// @updateURL https://update.greasyfork.org/scripts/369801/Legacy%20Twitter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (location.hostname !=='mobile.twitter.com') {
        location.hostname = 'mobile.twitter.com';
    }
})();