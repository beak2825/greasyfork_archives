// ==UserScript==
// @name         YouTube Skip 15 Seconds Rewind Buttons Forward/Backward
// @namespace    https://greasyfork.org/
// @version      1.3
// @description  Adds Rewind Buttons forward and backward 15 seconds buttons to the YouTube player
// @author       ezzdev
// @license      MIT
// @match        *://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514137/YouTube%20Skip%2015%20Seconds%20Rewind%20Buttons%20ForwardBackward.user.js
// @updateURL https://update.greasyfork.org/scripts/514137/YouTube%20Skip%2015%20Seconds%20Rewind%20Buttons%20ForwardBackward.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function addSkipButtons() {
        if (document.querySelector("#skip-backward") && document.querySelector("#skip-forward")) return;

        const controlBar = document.querySelector(".ytp-volume-area");
        if (!controlBar) return;

        const backwardButton = document.createElement("button");
        backwardButton.id = "skip-backward";
        backwardButton.className = "ytp-button";
        backwardButton.appendChild(document.createTextNode("⏪"));
        backwardButton.style.fontSize = "24px";
        backwardButton.style.textAlign = "center";
        backwardButton.style.fontWeight = "bold";
        backwardButton.style.filter = "grayscale(100%) brightness(100%)";
        backwardButton.title = "Skip backward 15 seconds";
        backwardButton.style.display = "inline-flex";
        backwardButton.style.alignItems = "center";
        backwardButton.style.justifyContent = "center";
        backwardButton.style.verticalAlign = "middle";
        backwardButton.style.lineHeight = "1";
        backwardButton.style.padding = "0";
        backwardButton.onclick = () => {
            const video = document.querySelector("video");
            if (video) video.currentTime = Math.max(0, video.currentTime - 15);
        };

        const forwardButton = document.createElement("button");
        forwardButton.id = "skip-forward";
        forwardButton.className = "ytp-button";
        forwardButton.appendChild(document.createTextNode("⏩"));
        forwardButton.style.fontSize = "24px";
        forwardButton.style.textAlign = "center";
        forwardButton.style.fontWeight = "bold";
        forwardButton.style.filter = "grayscale(100%) brightness(100%)";
        forwardButton.title = "Skip forward 15 seconds";
        forwardButton.style.display = "inline-flex";
        forwardButton.style.alignItems = "center";
        forwardButton.style.justifyContent = "center";
        forwardButton.style.verticalAlign = "middle";
        forwardButton.style.lineHeight = "1";
        forwardButton.style.padding = "0";
        forwardButton.onclick = () => {
            const video = document.querySelector("video");
            if (video) video.currentTime = Math.min(video.duration, video.currentTime + 15);
        };


        controlBar.insertBefore(forwardButton, controlBar.firstChild);
        controlBar.insertBefore(backwardButton, controlBar.firstChild);
    }

    const observer = new MutationObserver(addSkipButtons);
    observer.observe(document, { childList: true, subtree: true });
})();