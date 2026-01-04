// ==UserScript==
// @name         YouTube Redirect
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Ever procrastinated by watching youtube videos? This userscript will redirect it to google, it's parent site. Cause I can't find a way to consistanly close the window.
// @author       lifavo
// @match        https://*.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427980/YouTube%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/427980/YouTube%20Redirect.meta.js
// ==/UserScript==

var do_redirect=true;
(function() {
    'use strict';
    if(do_redirect){
    window.location.replace("http://google.com");
    }
})();