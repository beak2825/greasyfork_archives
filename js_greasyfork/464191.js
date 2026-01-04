// ==UserScript==
// @name         Wanikani: Detailed SRS Popups
// @namespace    http://tampermonkey.net/
// @version      1.0.7
// @description  Changes apprentice and guru popups to say their respective numbers. E.G. Apprentice 1 or Guru 2
// @author       Kumirei
// @match        https://www.wanikani.com/*
// @match        https://preview.wanikani.com/*
// @require      https://greasyfork.org/scripts/462049-wanikani-queue-manipulator/code/WaniKani%20Queue%20Manipulator.user.js?version=1340063
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464191/Wanikani%3A%20Detailed%20SRS%20Popups.user.js
// @updateURL https://update.greasyfork.org/scripts/464191/Wanikani%3A%20Detailed%20SRS%20Popups.meta.js
// ==/UserScript==

;(function () {
    const srs_stages = [
        'Initiate',
        'Apprentice 1',
        'Apprentice 2',
        'Apprentice 3',
        'Apprentice 4',
        'Guru 1',
        'Guru 2',
        'Master',
        'Enlighten',
        'Burn',
    ]

    let item_data = {}
    wkQueue.on('review').addPostprocessing(update_item_srs)
    window.addEventListener('didAnswerQuestion', update_stats)
    window.addEventListener('didChangeSRS', change_srs_name)

    // Get latest item SRS info
    function update_item_srs(queue) {
        for (let item of queue) {
            item_data[item.id] = { srs: item.srs, stats: {} }
        }
    }

    // Keep track of the stats of the most recent item
    let last_item
    function update_stats(event) {
        const id = event.detail.subjectWithStats.subject.id
        item_data[id].stats = event.detail.subjectWithStats.stats

        last_item = item_data[id]
    }

    // Change the name in the popup
    function change_srs_name(event) {
        if (!last_item || event.detail.source === 'Detailed SRS Popups') return
        const new_srs = calculate_resulting_srs(last_item)

        const modified_event = new CustomEvent('didChangeSRS', {
            detail: {
                wentUp: event.detail.wentUp,
                newLevelText: srs_stages[new_srs],
                source: 'Detailed SRS Popups',
            },
        })

        event.stopImmediatePropagation()
        window.dispatchEvent(modified_event)
    }

    // Calculate resulting SRS based on current SRS level and number of mistakes made
    function calculate_resulting_srs(item) {
        const incorrect = item.stats.meaning.incorrect + item.stats.reading.incorrect
        if (incorrect === 0) return item.srs + 1

        const incorrect_adjustment = Math.ceil(incorrect / 2)
        const penalty = item.srs >= 5 ? 2 : 1
        const new_srs = item.srs - incorrect_adjustment * penalty

        return new_srs < 1 ? 1 : new_srs
    }
})()
