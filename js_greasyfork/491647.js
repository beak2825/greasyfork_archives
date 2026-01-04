// ==UserScript==
// @name         Auto Swap With Inner Video
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Swaps the website video player with the native browser video player using the same video source
// @author       You
// @match        https://www.twitch.tv/*/clip/*
// @match        https://www.reddit.com/r/LivestreamFail/*
// @match        https://clips.twitch.tv/embed*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?domain=earth.google.com/web/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491647/Auto%20Swap%20With%20Inner%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/491647/Auto%20Swap%20With%20Inner%20Video.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    function runWhenReady(readySelector, callback) {
        var numAttempts = 0;
        var tryNow = function() {
            var elem = document.querySelector(readySelector);
            if (elem) {
                callback(elem);
            } else {
                numAttempts++;
                if (numAttempts >= 15) {
                    console.warn('Giving up after 15 attempts. Could not find: ' + readySelector);
                } else {
                    setTimeout(tryNow, 1000 * Math.pow(1.1, numAttempts));
                }
            }
        };
        tryNow();
    }

    var getSrc = () => {
        let video = document.querySelector("video");
        let src = video.src ? video.src : video.childNodes[0]?.src
        console.log(src)
        if (src ) {
            return src
        }
        else {
            console.log("You need to click on the video so that the src loads")
        }
        return "NonValidLink"
    }

    
    runWhenReady ('video', async function (ele) {
        await new Promise((r) => setTimeout(r, 2300))
        let src = getSrc()
        let player = document.querySelector(".video-player__container")
        let body = document.body
        let defaultPlayer = document.createElement("video")
        defaultPlayer.src = src
        defaultPlayer.controls = true
        defaultPlayer.style.maxHeight = 400
        await new Promise((r) => setTimeout(r, 800))
        if (src.startsWith("http")) {
            player.parentNode.replaceChild(defaultPlayer, player)
        }
    })
})();