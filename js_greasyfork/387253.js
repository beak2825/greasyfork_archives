// ==UserScript==
// @name         KissAdblock
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  allow adblock plus to run
// @author       You
// @include      *://kissasian.*/Drama/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387253/KissAdblock.user.js
// @updateURL https://update.greasyfork.org/scripts/387253/KissAdblock.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function() {
        // Old method of blocking adblock
        window.alb = false;
        console.log("Setting to false");
        console.log("alb:", window.alb);

        // New method 7/19
        var fakeFix = document.createElement("div");
        fakeFix.id = "FjPXsULMrJon";
        console.log("Creating fake div");
        document.body.appendChild(fakeFix);
    }, 15000);
})();