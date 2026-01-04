// ==UserScript==
// @name         Reload Twitch
// @version      0.46
// @description  Reloads a Twitch page to check if stream is live, time settings are UTC and set for the FACEIT London 2018 CS:GO Major start times.
// @author       LaminatedSteel
// @include      https://www.twitch.tv/*
// @run-at       document-idle
// @noframes
// @grant        window.reload
// @namespace https://greasyfork.org/users/141414
// @downloadURL https://update.greasyfork.org/scripts/31509/Reload%20Twitch.user.js
// @updateURL https://update.greasyfork.org/scripts/31509/Reload%20Twitch.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function() {
        reloadTwitch(9, 5);
        reloadTwitch(9, 6);
        reloadTwitch(9, 7);
        reloadTwitch(9, 8);
        reloadTwitch(9, 9);
        reloadTwitch(9, 12);
        reloadTwitch(9, 13);
        reloadTwitch(9, 14);
        reloadTwitch(9, 15);
        reloadTwitch(9, 16);
        reloadTwitch(14, 20);
        reloadTwitch(15, 21);
        reloadTwitch(15, 22);
        reloadTwitch(17, 23);
    }, 300000);
})();

function reloadTwitch(utcHours, utcDayOfMonth) {
    //If for some reason the player itself hasn't loaded, refresh the page
    if (!document.getElementsByClassName('video-player__container')[0]) {
        window.location.reload(true);
    }

    //If there is an error on the player, refresh the page
    //if (document.getElementsByClassName('video-player__container')[0].getAttribute('data-screen') == "error") {
    //    window.location.reload(true);
    //}

    var now = new Date();
    var isAfterStartTimeOnCorrectDay = (now.getUTCDate() == utcDayOfMonth && now.getUTCHours() >= utcHours);
    
    if (isAfterStartTimeOnCorrectDay && (document.getElementsByClassName('player-streamstatus__label').length == 0 || document.getElementsByClassName('player-streamstatus__label')[0].innerHTML != "Live" || document.getElementsByClassName('player-tip--aleft')[0].attributes[1].value == "Play")) {
        window.location.reload(true);
    }
}
