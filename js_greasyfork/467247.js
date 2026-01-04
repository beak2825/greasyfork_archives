// ==UserScript==
// @name         Stop hurting my ears
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  On websites with video players - set a user cookie whenever volume is changed, ensure all video players save that volume
// @author       Scorpia
// @license MIT
// @match        https://twitter.com/*
// @match        https://tweetdeck.twitter.com/*
// @match        https://*.tumblr.com/*
// @grant GM.setValue
// @grant GM.getValue
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/467247/Stop%20hurting%20my%20ears.user.js
// @updateURL https://update.greasyfork.org/scripts/467247/Stop%20hurting%20my%20ears.meta.js
// ==/UserScript==

(async () => {
    'use strict';

    async function getVolume() {
        return await GM.getValue("volume", 0.5)
    }

    async function setVolume(newVolume) {
        return await GM.setValue("volume", newVolume)
    }

    async function observeAllVideosVolume() {
        const allVideos = Array.from(document.getElementsByTagName("video"))
        allVideos.map(x => {
            x.onvolumechange = (event) => {
                event.stopPropagation()
                const newVolume = event.target.volume
                setVolume(newVolume)
            };
        })
    }

    async function setAllVideoVolumes() {
        var volume = await getVolume()
        Array.from(document.getElementsByTagName("video")).map(x => {
            x.volume=volume
            return x
        })
    }

    console.log("'Stop hurting my ears' plugin started")
    console.log("(Current) volume for twitter/tumblr will be...")
    console.log(await getVolume())

    document.addEventListener("DOMContentLoaded", function(){
        setAllVideoVolumes()
    });

    const pageChangeCallback = (mutationList, observer) => {
        setAllVideoVolumes()
        observeAllVideosVolume()
    };

    const observer = new MutationObserver(pageChangeCallback);
    observer.observe( document.documentElement, { attributes: true, childList: true, subtree: true });
    observeAllVideosVolume();

})();