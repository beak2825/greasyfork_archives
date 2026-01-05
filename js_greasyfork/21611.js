// ==UserScript==
// @name         Change Discord User Colour
// @namespace    pxgamer
// @version      0.1
// @description  Change colour of a username in Discord.
// @author       pxgamer
// @include      *discordapp.com/channels/*
// @require      https://code.jquery.com/jquery-3.1.0.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21611/Change%20Discord%20User%20Colour.user.js
// @updateURL https://update.greasyfork.org/scripts/21611/Change%20Discord%20User%20Colour.meta.js
// ==/UserScript==
/*jshint multistr: true */

(function() {
    'use strict';

    var username = 'pxgamer'; // Username
    var colour   = 'aqua';    // Colour to set the users name to.
    var timetowait = 5;       // Time to wait in seconds, depends on your internet speed.

    setTimeout(function() {

        $('.user-name:contains("'+username+'")').each(function(){$(this).css('color',colour);});
        console.log('Complete');
    }, timetowait*1000);
})();
