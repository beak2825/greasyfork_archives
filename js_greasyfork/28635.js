// ==UserScript==
// @name         Mega Lookback Button
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Adds a button for the Mega Lookback event to the announcements bar.
// @author       Duckbug
// @match        https://pokefarm.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28635/Mega%20Lookback%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/28635/Mega%20Lookback%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var now = window.serverTime;
    var end = Date.UTC(2018, 1, 0);
    var sec_until = (end - now)/1000;
    var until;
    if ( sec_until > 60*60*24*28 ) {
        until = Math.floor(sec_until / (60*60*24*28)) + "mo";
    } else if ( sec_until > 60*60*24 ) {
        until = Math.floor(sec_until / (60*60*24)) + "d";
    } else if ( sec_until > 60*60 ) {
        until = Math.floor(sec_until / (60*60)) + "h";
    } else if ( sec_until > 60 ) {
        until = Math.floor(sec_until / (60)) + "m";
    } else { until = Math.floor(sec_until) + "s"; }
    var event_mega = `<li><a href="/event_mega"><img src="//pfq-static.com/img/items/keystone.png" />` + until + `</a></li>`;
    if ( now < end ) {
        $(event_mega).insertBefore( $('li').has('a[href="/hypermode"]') );
    }
})();