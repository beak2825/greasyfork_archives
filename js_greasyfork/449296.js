// ==UserScript==
// @name         Nitro Type - Disable Closing Shutters
// @version      0.1.0
// @description  Disable the closing shutter animation effect at the finish line.
// @author       Toonidy
// @match        *://*.nitrotype.com/race
// @match        *://*.nitrotype.com/race/*
// @icon         https://i.ibb.co/YRs06pc/toonidy-userscript.png
// @grant        none
// @license      MIT
// @namespace    https://greasyfork.org/users/858426
// @downloadURL https://update.greasyfork.org/scripts/449296/Nitro%20Type%20-%20Disable%20Closing%20Shutters.user.js
// @updateURL https://update.greasyfork.org/scripts/449296/Nitro%20Type%20-%20Disable%20Closing%20Shutters.meta.js
// ==/UserScript==

const dash = document.querySelector("#raceContainer .dash-content")
if (!dash) {
    console.error("Unable to find race container")
    return
}

const shutterObserver = new MutationObserver((mutationList) => {
    for (const m of mutationList) {
        for (const newNode of m.addedNodes) {
            if (newNode.classList.contains("dashShield") && newNode.classList.contains("is-closing")) {
                shutterObserver.disconnect()
                newNode.remove()
                return
            }
        }
    }
})

shutterObserver.observe(dash, { childList: true })
