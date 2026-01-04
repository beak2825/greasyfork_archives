// ==UserScript==
// @name        Wanikani: Random voice actor
// @description Randomizes the preferred voice actor
// @match       https://www.wanikani.com/*
// @match       https://preview.wanikani.com/*
// @require     https://greasyfork.org/scripts/462049-wanikani-queue-manipulator/code/WaniKani%20Queue%20Manipulator.user.js?version=1340063
// @version     1.2.4
// @author      Kumirei
// @license     MIT; http://opensource.org/licenses/MIT
// @grant       none
// @namespace   https://greasyfork.org/users/105717
// @downloadURL https://update.greasyfork.org/scripts/390446/Wanikani%3A%20Random%20voice%20actor.user.js
// @updateURL https://update.greasyfork.org/scripts/390446/Wanikani%3A%20Random%20voice%20actor.meta.js
// ==/UserScript==

;(function () {
    // Set up randomized voice actor
    window.wkQueue.addPostprocessing((queue) => {
        for (let item of queue) {
            if (!('readings' in item.subject)) continue // Only vocab items
            for (let reading of item.subject.readings || []) {
                if (!reading.pronunciations.length) continue // Only items with audio
                // Pick random pronunciation and then set all actors' audio to be that pronunciation
                const random_index = Math.floor(Math.random() * reading.pronunciations.length)
                const sources = reading.pronunciations[random_index]?.sources
                if (!sources.length) continue
                for (let pronunciation of reading.pronunciations) pronunciation.sources = sources
            }
        }
    })
})()
