// ==UserScript==
// @name         Wanikani: True Level
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Don't level up until you finish all lessons from previous levels
// @author       Kumirei
// @include      /^https://(www|preview).wanikani.com/(dashboard)?/
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449490/Wanikani%3A%20True%20Level.user.js
// @updateURL https://update.greasyfork.org/scripts/449490/Wanikani%3A%20True%20Level.meta.js
// ==/UserScript==

;(async (wkof) => {
    // Script info
    const script_id = 'true_level'
    const script_name = 'True Level'

    // Initiate WKOF
    await confirm_wkof()
    wkof.include('ItemData')
    wkof.ready('ItemData').then(install_filter).then(update_counts)

    // Global variable
    let lowestLessonLevel = 99

    function install_filter() {
        wkof.ItemData.registry.sources.wk_items.filters.lowest_level_lessons = {
            type: 'checkbox',
            default: true,
            label: 'Lowest Level Lessons',
            filter_func: (filter_value, item) =>
                !filter_value ||
                (item.data.level === lowestLessonLevel &&
                    item.assignments?.srs_stage === 0 &&
                    item.assignments.unlocked_at),
            hover_tip: 'Get only lessons from the lowest available level',
            set_options: (options) => {
                options.assignments = true
            },
        }
    }

    async function update_counts() {
        const items = await wkof.ItemData.get_items('assignments')
        let lessons = items.filter((item) => item.assignments?.srs_stage === 0 && item.assignments.unlocked_at)
        lowestLessonLevel = lessons.reduce((lowest, item) => Math.min(lowest, item.data.level), lowestLessonLevel)
        const count = lessons.filter((item) => item.data.level === lowestLessonLevel).length
        // Update counts
        const counts = [
            '.navigation-shortcut--lessons span',
            '#lessons-summary #lesson-queue-count',
            '.lessons-and-reviews__lessons-button span',
        ]
        counts
            .map((selector) => document.querySelector('.navigation-shortcut--lessons span'))
            .filter((a) => a)
            .forEach((elem) => (elem.textContent = count))
        document.querySelector('.navigation-shortcut--lessons')?.setAttribute('data-count', count)
        document.querySelector('.lessons-and-reviews__lessons-button')?.setAttribute('class', getClass(count))
        // Update level
        const levelElem = document.querySelector('.user-summary__attributes > li:first-child a')
        if (levelElem) levelElem.textContent = `Level ${lowestLessonLevel}`
        // TODO: Update progress
        //$('.dashboard-progress .progress-component h1').text(`Level ${lowestLessonLevel} Progress`)
        setTimeout(update_counts, (60 - new Date().getMinutes()) * 1000 * 60 + 1000) // Update counts within a minute of top of the hour
    }

    function getClass(count) {
        const threshhold = [500, 250, 100, 50, 25, 1, 0].filter((t) => t <= count)[0]
        return `lessons-and-reviews__button lessons-and-reviews__lessons-button lessons-and-reviews__lessons-button--${threshhold}`
    }

    // Makes sure that WKOF is installed
    async function confirm_wkof() {
        if (!wkof) {
            let response = confirm(
                `${script_name} requires WaniKani Open Framework.\nClick "OK" to be forwarded to installation instructions.`,
            )
            if (response) {
                window.location.href =
                    'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549'
            }
        }
    }
})(window.wkof)
