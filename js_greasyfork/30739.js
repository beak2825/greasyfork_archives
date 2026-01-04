// ==UserScript==
// @name         Earnhoney watch auto
// @namespace    http://tampermonkey.net/
// @version      0.5.2
// @description  Earnhoney main offers to the watch website auto
// @author       Bboy tech
// @include      http://www.earnhoney.com/en/Main/Offers
// @include      http://www.earnhoney.com/en/videos
// @include      http://www.earnhoney.com/en/videos/video/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30739/Earnhoney%20watch%20auto.user.js
// @updateURL https://update.greasyfork.org/scripts/30739/Earnhoney%20watch%20auto.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);

(function() {
    var fastForwardTimer = setInterval (function() {fastForward(); }, Math.floor(Math.random() * 3000) + 7000);
    var resetTImer = setInterval (function() {reset(); }, Math.floor(Math.random() * 2700000) + 3600000);

    if (window.location.href == "http://www.earnhoney.com/en/Main/Offers")
    {
        document.getElementById('optWatch').click();
    }
    if (window.location.href == "http://www.earnhoney.com/en/videos")
    {
        document.getElementsByClassName("play-container")[0].click();
    }
    function fastForward ()
    {
        var duration = jwplayer().getDuration();
        var targetPos = duration - (Math.random()+ Math.random());

        jwplayer().seek(targetPos);
    }
    function reset ()
    {
        var x = Math.floor((Math.random() * 2) + 1);
            if (x == 1)
            {
                window.open("http://www.earnhoney.com/en/Main/Offers","_self");
            }
            else if (x == 2)
            {
                window.open("http://www.earnhoney.com/en/videos","_self");
            }
    }
})();