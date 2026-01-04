// ==UserScript==
// @name         Hide Watch2Gether Playlist
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hides the Watch2Gether playlist
// @author       sengetoey
// @match        https://www.watch2gether.com/*
// @grant        none
//
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/399316/Hide%20Watch2Gether%20Playlist.user.js
// @updateURL https://update.greasyfork.org/scripts/399316/Hide%20Watch2Gether%20Playlist.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var $ = window.jQuery;

    var unwantedSidebar = $(".w2g-main-right");

    unwantedSidebar.hide();
})();