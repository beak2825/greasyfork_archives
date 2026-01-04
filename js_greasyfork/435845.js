// ==UserScript==
// @name         DVTV free cracked player
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Nemusite si platit predplatne pokud na nej nemate :D.
// @author       sirluky
// @match        https://www.dvtv.cz/video/*
// @icon         https://www.google.com/s2/favicons?domain=dvtv.cz
// @grant        none
// @license      GPL v3.0
// @downloadURL https://update.greasyfork.org/scripts/435845/DVTV%20free%20cracked%20player.user.js
// @updateURL https://update.greasyfork.org/scripts/435845/DVTV%20free%20cracked%20player.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(_=>{
        const videoContent = document.querySelector("iframe")
        const video = videoContent.outerHTML;

        const container = videoContent.parentElement.innerHTML = video;
    },1000)
})();