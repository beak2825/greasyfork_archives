// ==UserScript==
// @name         Holodex Music Better Media Keys
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Support for media previous and media next keys for Holodex Music
// @author       creeperkafasipw
// @include      https://holodex.net/*
// @include      https://staging.holodex.net/*
// @match        https://www.youtube.com/embed/*
// @icon         https://holodex.net/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429491/Holodex%20Music%20Better%20Media%20Keys.user.js
// @updateURL https://update.greasyfork.org/scripts/429491/Holodex%20Music%20Better%20Media%20Keys.meta.js
// ==/UserScript==

/*jshint esversion: 6 */

const updateFreq = 500

const MSG_PREFIX = GM_info.script.name + '\n';

function postTopMessage(msg){
    top.postMessage(msg,"https://holodex.net");
    top.postMessage(msg,"https://staging.holodex.net");
    // top origin can't be both https://holodex.net and https://staging.holodex.net so it should be okay to leave it like this
}

if (window === top) {
    window.addEventListener("message", (event) => {
        if (event.origin.includes("youtube.com") && event.data.startsWith(MSG_PREFIX)){
            const action = event.data.split(MSG_PREFIX)[1];
            switch(action){
                case "ytMediaPreviousTrack":
                    document.querySelector(".player-controls button:nth-child(1)").click();
                    break;
                case "ytMediaNextTrack":
                    document.querySelector(".player-controls button:nth-child(3)").click();
                    break;

            }
        }
    });

} else if (location.hostname.includes('youtube')) {
    // The mediaSession doesn't load instantly, might change this later
    setInterval(()=>{
        window.navigator.mediaSession.setActionHandler("previoustrack",()=>{postTopMessage(MSG_PREFIX + "ytMediaPreviousTrack");});
        window.navigator.mediaSession.setActionHandler("nexttrack",()=>{postTopMessage(MSG_PREFIX + "ytMediaNextTrack");});
    },updateFreq);
}