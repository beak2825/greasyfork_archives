// ==UserScript==
// @name         J-Sound
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Adds the 'j' shortcut from lesson and review pages to the vocab pages.
// @author       Nuke
// @match        http*://www.wanikani.com/vocabulary/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18388/J-Sound.user.js
// @updateURL https://update.greasyfork.org/scripts/18388/J-Sound.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

document.addEventListener('keydown', function(event) {
    if (event.keyCode == 74/*'j'*/) {
        console.log("J-sound");

        // If the search input field has focus do nothing
        var activeElement = document.activeElement;
        if (activeElement instanceof HTMLInputElement)
           return;

        // Else find the button and simulate a click
        var audioButton = document.getElementsByClassName('vocabulary-reading')[0].getElementsByClassName('audio-btn')[0];
        audioButton.click();
    }
}, false);