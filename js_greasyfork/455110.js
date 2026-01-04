// ==UserScript==
// @name         Wanikani: WKOF Recently Failed Filter
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Adds filters for recently failed items
// @author       Kumirei
// @include      /^https://(www|preview).wanikani.com/.*/
// @require      https://greasyfork.org/scripts/410909-wanikani-review-cache/code/Wanikani:%20Review%20Cache.js?version=1182852
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/455110/Wanikani%3A%20WKOF%20Recently%20Failed%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/455110/Wanikani%3A%20WKOF%20Recently%20Failed%20Filter.meta.js
// ==/UserScript==

;(async (wkof, review_cache) => {
    // Script info
    const script_id = 'recently_failed_filter'
    const script_name = 'WKOF Recently Failed Filter'

    // Initiate WKOF
    await confirm_wkof()
    wkof.include('ItemData')
    wkof.ready('ItemData').then(install_failed_within_x_hours).then(install_x_last_failed)

    // Load reviews from the review cache
    const reviews = (await review_cache.get_reviews()).reverse() // Most recent reviews in front

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

    function install_failed_within_x_hours() {
        wkof.ItemData.registry.sources.wk_items.filters.failed_last_x_hours = {
            type: 'number',
            default: 0,
            label: 'Failed Within X Hours',
            hover_tip: 'Reviews that you have answered incorrectly in the last X hours',
            filter_func: (failed, item) => failed.has(item.id),
            filter_value_map: (hours) => {
                const failed = new Set() // Contains ids of failed reviews
                const startTime = Date.now() - hours * 60 * 60 * 1000
                for (let review of reviews) {
                    const [date, id, srs, mi, ri] = review
                    if (date < startTime) break // Only check last x hours
                    if (mi + ri !== 0) failed.add(id)
                }
                return failed
            },
        }
    }

    function install_x_last_failed() {
        wkof.ItemData.registry.sources.wk_items.filters.x_last_failed = {
            type: 'number',
            default: 0,
            label: 'Last X Failed',
            hover_tip: 'The X most recent reviews you answered incorrectly',
            filter_func: (failed, item) => failed.has(item.id),
            filter_value_map: (count) => {
                const failed = new Set() // Contains ids of failed reviews
                let found = 0
                for (let review of reviews) {
                    const [date, id, srs, mi, ri] = review
                    if (mi + ri !== 0 && !failed.has(id)) {
                        failed.add(id)
                        found++
                        if (found == count) break
                    }
                }
                return failed
            },
        }
    }
})(window.wkof, window.review_cache)
