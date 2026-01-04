// ==UserScript==
// @name         Wanikani: Review Queue SRS Breakdown
// @namespace    http://tampermonkey.net/
// @version      1.0.8
// @description  Adds a display showing how many items of each SRS stage there are in your queue
// @author       Kumirei
// @match        https://www.wanikani.com/*
// @match        https://preview.wanikani.com/*
// @require      https://greasyfork.org/scripts/462049-wanikani-queue-manipulator/code/WaniKani%20Queue%20Manipulator.user.js?version=1340063
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/413984/Wanikani%3A%20Review%20Queue%20SRS%20Breakdown.user.js
// @updateURL https://update.greasyfork.org/scripts/413984/Wanikani%3A%20Review%20Queue%20SRS%20Breakdown.meta.js
// ==/UserScript==

;(function () {
    wkQueue.on('review').addPostprocessing(update)
    window.addEventListener('didCompleteSubject', async () => update(await wkQueue.currentReviewQueue()))

    function update(queue) {
        const counts = get_counts(queue)
        const text = `[${counts.slice(1, 5).join(', ')}][${counts.slice(5, 7).join(', ')}][${counts[7]}][${counts[8]}]`
        document.querySelector('#srs_breakdown')?.remove()

        const elem = `<div id="srs_breakdown" style="position: absolute; top: 2em; right: 24px;">${text}</div>`
        document.querySelector('.character-header__menu-statistics').insertAdjacentHTML('beforeend', elem)
    }

    function get_counts(queue) {
        return queue
            .map((item) => item.srs)
            .reduce((counts, srs) => {
                counts[srs]++
                return counts
            }, new Array(9).fill(0))
    }
})()
