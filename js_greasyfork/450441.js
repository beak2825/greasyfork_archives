// ==UserScript==
// @name         Nitro Type - Disable Auto Next Race
// @version      0.1.0
// @description  Disable the auto next race feature by auto clicking "cancel".
// @author       Toonidy
// @match        *://*.nitrotype.com/race
// @match        *://*.nitrotype.com/race/*
// @icon         https://i.ibb.co/YRs06pc/toonidy-userscript.png
// @grant        none
// @license      MIT
// @namespace    https://greasyfork.org/users/858426
// @downloadURL https://update.greasyfork.org/scripts/450441/Nitro%20Type%20-%20Disable%20Auto%20Next%20Race.user.js
// @updateURL https://update.greasyfork.org/scripts/450441/Nitro%20Type%20-%20Disable%20Auto%20Next%20Race.meta.js
// ==/UserScript==

const raceContainer = document.querySelector("#raceContainer")
if (!raceContainer) {
    console.error("Unable to find race container")
    return
}

const autoNextCancelObserver = new MutationObserver((mutationList) => {
    for (const m of mutationList) {
        for (const newNode of m.addedNodes) {
            if (newNode.classList?.contains("race-results")) {
                autoNextCancelObserver.disconnect()
                const cancelAutoNextRaceNode = newNode.querySelector(".race-results--countdown--cancel")
                if (cancelAutoNextRaceNode) {
                    cancelAutoNextRaceNode.click()
                    console.log("Cancelled Auto Next Race", m)
                } else {
                    console.error("Failed to find cancel auto race", m)
                }
                return
            }
        }
    }
})

autoNextCancelObserver.observe(raceContainer, { childList: true })
