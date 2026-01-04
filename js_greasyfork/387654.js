// ==UserScript==
// @name         edX More Video Speeds
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  Adds more speed options to the edX video player
// @author       Lex
// @match        https://courses.edx.org/courses/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387654/edX%20More%20Video%20Speeds.user.js
// @updateURL https://update.greasyfork.org/scripts/387654/edX%20More%20Video%20Speeds.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var RATE_OPTIONS = ["1.75", "2.0", "2.2", "2.4", "2.6", "2.8", "3.0", "3.2"];

    // Add the speeds to the menu
    if (document.querySelector(".video-speeds") !== null) {
        RATE_OPTIONS.forEach(function(speed) {
            let el = document.querySelector(".video-speeds.menu li").cloneNode(true);
            el.setAttribute("data-speed", speed);
            el.removeAttribute("class");
            el.childNodes[0].innerText = speed + "x";
            document.querySelector(".video-speeds.menu").prepend(el);
        });
    }
})();
