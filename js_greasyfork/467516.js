// ==UserScript==
// @name         Unblastify Redgifs
// @namespace    http://www.redgifs.com/
// @version      1.1
// @license      GPLv3
// @description  Reduce volume on Redgifs
// @author       xdpirate
// @match        https://www.redgifs.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=redgifs.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467516/Unblastify%20Redgifs.user.js
// @updateURL https://update.greasyfork.org/scripts/467516/Unblastify%20Redgifs.meta.js
// ==/UserScript==

// Set your desired default volume level here. Range: 0-1, default is 0.3 (30%).
let volumeLevel = 0.3;

function adjustVolume() {
    let videoElements = document.querySelectorAll("video");
    if(videoElements !== null && videoElements !== undefined) {
        for(let i = 0; i < videoElements.length; i++) {
            videoElements[i].volume = volumeLevel;
        }
    }
}

let observerOptions = {subtree: true, childList: true};
let mObserver = new MutationObserver(function() { adjustVolume(); });
mObserver.observe(document, observerOptions);
