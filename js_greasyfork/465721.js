// ==UserScript==
// @name         TubiTv 5s Seek
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Changes arrows to seek 5s
// @author       Konstinople
// @match        https://tubitv.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tubitv.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465721/TubiTv%205s%20Seek.user.js
// @updateURL https://update.greasyfork.org/scripts/465721/TubiTv%205s%20Seek.meta.js
// ==/UserScript==

window.addEventListener("load", function() {
    'use strict';

    let attach
    let video
    let lastTime

    attach = function() {
        video = document.querySelector("video");
        lastTime = video.currentTime;

        video.addEventListener("timeupdate", (e) => {
            lastTime = video.currentTime;
        });
    };

    attach()

    window.addEventListener("keydown", (e) => {
        setTimeout(() => {
            switch (e.key) {
                case "ArrowLeft":
                    video.currentTime = lastTime - 5;
                    break;
                case "ArrowRight":
                    video.currentTime = lastTime + 5;
                    break;
            }
        }, 0)
    });

    const observer = new MutationObserver((mutationList) => {
        for (const mutation of mutationList) {
            for (const node of mutation.removedNodes) {
                if (node.contains(video)) {
                    attach()
                    break;
                }
            }
        }
    })

    observer.observe(document.body, { subtree: true, childList: true })
});