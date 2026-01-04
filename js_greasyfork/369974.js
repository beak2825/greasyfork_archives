// ==UserScript==
// @name         PLAY MONEY
// @version      1.0
// @description  Skidded code that i edited in hopes of it bypassing engage, should work in theory, not tested.
// @description  I hold no responsibility in you getting banned.
// @author       pop
// @include	       http://*.engageme.tv/*
// @include	       http://engageme.tv/*
// @include	       https://engageme.tv/*
// @namespace https://greasyfork.org/users/194105
// @downloadURL https://update.greasyfork.org/scripts/369974/PLAY%20MONEY.user.js
// @updateURL https://update.greasyfork.org/scripts/369974/PLAY%20MONEY.meta.js
// ==/UserScript==
setInterval(function() {
    var adsearch = document.getElementsByClassName('jw-flag-ads');
    if (!adsearch.length > 0)
    {
        jwplayer().seek(60);
    }
    yesiam();
}, Math.floor(Math.random() * (30000 - 21000)) + 21000);