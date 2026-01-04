// ==UserScript==
// @name         LookMovie.ag Anti-AdBlockDetection
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Just sets the class back to blank when AdBlock is detected
// @author       LethalLuck
// @match        https://lookmovie.ag/*
// @match        https://lookmovie.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/413015/LookMovieag%20Anti-AdBlockDetection.user.js
// @updateURL https://update.greasyfork.org/scripts/413015/LookMovieag%20Anti-AdBlockDetection.meta.js
// ==/UserScript==

(function() {
    'use strict';
document.body.className = '';
    // Your code here...
})();