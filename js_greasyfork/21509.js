// ==UserScript==
// @name         Planets.nu Feedblock Script
// @namespace    https://greasyfork.org/users/2984
// @version      1.0
// @description  Block the feed
// @author       Dotman
// @copyright	  2016, Dotman
// @license       CC BY-NC-ND 4.0 (http://creativecommons.org/licenses/by-nc-nd/4.0/)
// @include       http://planets.nu/#/*
// @include       http://planets.nu/*

// @downloadURL https://update.greasyfork.org/scripts/21509/Planetsnu%20Feedblock%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/21509/Planetsnu%20Feedblock%20Script.meta.js
// ==/UserScript==

var hideFeed = function() {
     $('div#eactivitycol').remove();
     $('div#eactivityfooter').remove();
    hideFeed.cnt = hideFeed.cnt + 1;
    if (hideFeed.cnt < 100) {
        setTimeout(hideFeed,100);
    }
};

(function() {
    'use strict';
 $(document).ready(function() {
     hideFeed.cnt = 0;
     setTimeout(hideFeed, 100);
 });
})();