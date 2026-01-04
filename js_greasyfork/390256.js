// ==UserScript==
// @name         VirginRadio Reducer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Removes unnecessary parts from virginradio.it
// @author       Christian Castelli <voodoo81people@gmail.com>
// @match        https://www.virginradio.it/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390256/VirginRadio%20Reducer.user.js
// @updateURL https://update.greasyfork.org/scripts/390256/VirginRadio%20Reducer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Turning background to black
    document.querySelector("body").style.background = "black"
    document.querySelector("body").style.backgroundSize = "auto"
    console.log("VRR: background style modified")

    // Removing analytics scripts
    let totFramesRemoved = 0
    const interval = setInterval(function() {
        console.log("VRR: waiting for iframes remotion...")
        const frames = document.querySelectorAll("iframe")

        if (frames.length > 1) {
            frames.forEach(function (node) {
                // filters out RadioCommando
                if (node.getAttribute("class") !== "futuri-engage-iframe") {
                    node.remove()
                }
            })
            totFramesRemoved += frames.length
        } else {
            console.log(`Removed ${totFramesRemoved} frames`)
            clearInterval(interval)

            // Lifting up the content
            document.querySelector("div[class^='cont_banner']").remove()
            console.log("VRR: header banner removed")

            // Removing GoogleAds containers
            document.querySelectorAll("div[id^='google_ads'").forEach (function (ad) { ad.remove() })
            document.getElementById("contenitore-sito-x-adv").remove()
            console.log("VRR: GoogleAds containers removed")

            // Automatically open last songs played box
            document.querySelector("div[class*='button_latest_song'] a").click()
        }
    }, 3000)
})();