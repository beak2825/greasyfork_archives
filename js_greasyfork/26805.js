// ==UserScript==
// @name         Earn Honey Watch Automator
// @namespace    Earn Honey Watch Automator
// @include      *earnhoney.com/*
// @version      0.1
// @description  This script does things like refreshing the page and fast forwarding videos so you can have an Earnhoney Watch server!
// @author       Byte11
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26805/Earn%20Honey%20Watch%20Automator.user.js
// @updateURL https://update.greasyfork.org/scripts/26805/Earn%20Honey%20Watch%20Automator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var bufferTimes = 0;

    var multiplierTimer = setInterval (function() {multiplier(); }, Math.floor(Math.random() * 3000));
    var fastForwardTimer = setInterval (function() {fastForward(); }, Math.floor(Math.random() * 3000) + 4000);
    var bufferCheckTimer = setInterval (function() {bufferCheck(); }, Math.floor(Math.random() * 3000));
    var refreshPageTimer = setInterval (function() {refreshPage(); }, Math.floor(Math.random() * 900000));

    function multiplier () {
        if(document.getElementById("callcaptcha").style.display != "none") {
            document.getElementById("callcaptcha").click();
        }
    }

    function fastForward () {
        var duration = jwplayer().getDuration();
        var targetPos = duration - (Math.random() + 1);

        jwplayer().seek(targetPos);
    }

    function bufferCheck () {
        if(jwplayer().getBuffer() === 0) {
            bufferTimes++;
        }
        console.log(bufferTimes);
        if(bufferTimes >= 20) {
            bufferTimes = 0;
            location.href = "http://www.earnhoney.com/en/videos/video/snowden_movie_trailer_p1";
        }
    }

    function refreshPage(){
        location.href = "http://www.earnhoney.com/en/videos/video/snowden_movie_trailer_p1";
    }
})();