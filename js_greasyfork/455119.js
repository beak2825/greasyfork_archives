// ==UserScript==
// @name         Bring back red subscribe button
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  What have you done Suzan!?
// @author       Haddle
// @match        *://www.youtube.com/*\
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455119/Bring%20back%20red%20subscribe%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/455119/Bring%20back%20red%20subscribe%20button.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var changeColour = function(){
        var feedback_buttons= document.getElementsByClassName("yt-spec-button-shape-next yt-spec-button-shape-next--filled yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m");
        var feedback_text = document.getElementsByClassName("yt-core-attributed-string yt-core-attributed-string--white-space-no-wrap");
        for(var i=0;i<feedback_buttons.length;i++){feedback_buttons[i].style="background-color:#f00"};
        for(i=0;i<feedback_text.length;i++){feedback_text[i].style="color:#fff"};
        console.log("[Red Sub Button]: changed")
    }
    window.onload = changeColour
})();