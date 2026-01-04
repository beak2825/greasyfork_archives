// ==UserScript==
// @name         Youtube Redirect Music
// @namespace    https://youtube.com/
// @version      1.0
// @description  Redirects youtube.com to youtube.com/feed/music.
// @author       Simon
// @match        https://*.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395266/Youtube%20Redirect%20Music.user.js
// @updateURL https://update.greasyfork.org/scripts/395266/Youtube%20Redirect%20Music.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if(window.location.href == "https://www.youtube.com/"){
        location.href = "https://www.youtube.com/feed/music"
    }
})();