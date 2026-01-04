// ==UserScript==
// @name         Better Youtube Theatre Mode
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Enlarges the media player to fill the entire screen with theatre mode.
// @author       shanish_ @discord
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/436667/Better%20Youtube%20Theatre%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/436667/Better%20Youtube%20Theatre%20Mode.meta.js
// ==/UserScript==


/**

A simple script to fix youtube's CSS to set the containers height to 100vh - navbar height

**/

// Injects CSS into the header of the document.
function addStyle(styleText){
    let s = document.createElement('style')
    s.setAttribute("id", "youtubetheater");
    s.appendChild(document.createTextNode(styleText))
    document.getElementsByTagName('head')[0].appendChild(s)
}

// I do not like this but youtube is a single page app and they may delete the style sheet after it in injected.
// To ensure it stays, it will check every second but this is nothing to performance.
setInterval(
loadCss,1000)

function loadCss() {
    'use strict';
    if(document.getElementById("youtubetheater")){return;}

        // Applys css to the page to resize the media player to the entire screen.
    addStyle(`


:fullscreen #player-full-bleed-container,:fullscreen #full-bleed-container {
max-height: calc(100vh) !important;
}
:has([is-theater-mode]) #player-full-bleed-container,:has([is-theater-mode]) #full-bleed-container{
    max-height:calc(100vh - 52px)!important;
    height:100vh!important;
}

   `)
};