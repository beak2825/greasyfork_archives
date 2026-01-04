// ==UserScript==
// @name         TagPro Deciseconds
// @description  Show tenths of seconds in the timer, optionally only near the end of the game.
// @author       Ko
// @version      1.1
// @supportURL   https://www.reddit.com/message/compose/?to=Wilcooo
// @website      https://redd.it/7xatec
// @include      http://tagpro-*.koalabeast.com:*
// @include      http://tangent.jukejuice.com:*
// @include      http://*.newcompte.fr:*
// @include      http://tagpro-*.koalabeast.com/game
// @include      http://tangent.jukejuice.com/game
// @include      http://*.newcompte.fr/game
// @namespace https://greasyfork.org/users/152992
// @downloadURL https://update.greasyfork.org/scripts/38426/TagPro%20Deciseconds.user.js
// @updateURL https://update.greasyfork.org/scripts/38426/TagPro%20Deciseconds.meta.js
// ==/UserScript==



// This script is inspired by the 'TagPro Milliseconds' script by 'Some Ball -1' (which didn't seem to work anymore)
// It is compatible with the 'End of Game Timer' by 'Some Ball -1', and should be compatible with any aesthetic script.



// OPTIONS:

const startTime = 0; // The gametime (in seconds) when to start showing deciseconds.
                     // Set it to 0 to always show the exact time

const leadingZero = true;  // By default, TagPro shows the time like this:        03:09
                           // Change this option to 'false' to make it look like:  3:09



tagpro.ready(function(){

    var org_timer = tagpro.ui.timer;

    tagpro.ui.timer = function( con, pos, size, text ) {

        if (tagpro.state == 1) {

            var time = tagpro.gameEndsAt - Date.now();

            var minut = ( (leadingZero ? "00" : "") + Math.floor(time/6e4) ).slice(-2),
                secon = ( "00" + Math.floor(time%6e4/1e3) ).slice(-2);

            if ( startTime <= 0 || time < startTime * 1e3 ) {
                var decis = Math.floor(time % 1e3 / 1e2);
                text = [minut, secon, decis].join(':');
            }

            else text = [minut, secon].join(':');
        }

        return org_timer(...arguments);
    };
});
