// ==UserScript==
// @name         Disable YouTube Mobile Auto-Pause
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://m.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/380663/Disable%20YouTube%20Mobile%20Auto-Pause.user.js
// @updateURL https://update.greasyfork.org/scripts/380663/Disable%20YouTube%20Mobile%20Auto-Pause.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onblur = function() { document.getElementsByClassName('html5-video-container')[0].click(); }
})();