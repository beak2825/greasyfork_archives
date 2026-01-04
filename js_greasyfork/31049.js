// ==UserScript==
// @name         earnhoney - buzz tv auto
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  earnhoney - buzz tv auto (server)
// @author       BBoy tech
// @match        http://www.miimd.com/
// @include      http://www.miimd.com/videos/video/*
// @include      http://www.matchedcars.com/
// @include      http://www.matchedcars.com/videos/video/*
// @include      http://www.tvglee.com/*
// @include      http://www.tvglee.com/videos/video/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31049/earnhoney%20-%20buzz%20tv%20auto.user.js
// @updateURL https://update.greasyfork.org/scripts/31049/earnhoney%20-%20buzz%20tv%20auto.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var fastForwardTimer = setInterval (function() {fastForward(); }, Math.floor(Math.random() * 15000) + 20000);
    if (window.location.href == "http://www.miimd.com/")
    {
        document.getElementById('header').click();
    }
    if (window.location.href == "http://www.matchedcars.com/")
    {
        document.getElementById('header').click();
    }
    if (window.location.href == "http://www.tvglee.com/Home/Index")
    {
        document.getElementById('header').click();
    }
    if (window.location.href == "http://www.tvglee.com/")
    {
        document.getElementById('header').click();
    }
    function fastForward ()
    {
        var duration = jwplayer().getDuration();
        var targetPos = duration - (Math.random()+ Math.random());

        jwplayer().seek(targetPos);
    }

    // Your code here...
})();