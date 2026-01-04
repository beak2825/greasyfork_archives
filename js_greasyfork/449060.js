// ==UserScript==
// @name         Wanikani: Spread Review Intervals Display
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Extends the SRS interval by a random amount by filtering out items that are not within the interval.
// @author       Kumirei
// @include      /^https://(www|preview).wanikani.com/(dashboard)?/
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449060/Wanikani%3A%20Spread%20Review%20Intervals%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/449060/Wanikani%3A%20Spread%20Review%20Intervals%20Display.meta.js
// ==/UserScript==

;(async (wkof, $) => {
    // Script info
    const script_id = 'spread_review_intervals_display'
    const script_name = 'Spread Review Intervals Display'

    // Initiate WKOF
    await confirm_wkof()
    wkof.include('ItemData,Menu,Settings')
    wkof.ready('Settings,Menu').then(load_settings).then(install_menu)
    wkof.ready('ItemData').then(update_counts)

    async function update_counts() {
        const interval = wkof.settings[script_id].spread
        const items = await wkof.ItemData.get_items('assignments')
        const count = items.filter((item) => {
            if (!item?.assignments?.available_at) return false
            const overdue = calculate_overdue(item)
            const spread = (seeded_prng(item.assignments.available_at + item.id) * interval) / 100
            return overdue > spread
        }).length
        $('.navigation-shortcut--reviews span').text(String(count))
        $('.lessons-and-reviews__reviews-button span').text(String(count))
        $('#reviews-summary #review-queue-count').text(String(count))
        setTimeout(update_counts, (60 - new Date().getMinutes()) * 1000 * 60 + 1000) // Update counts within a minute of top of the hour
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

    // Calculate how overdue an item is based on its available_at date and SRS stage
    function calculate_overdue(item) {
        const SRS_DURATIONS = [4, 8, 23, 47, 167, 335, 719, 2879, Infinity].map((time) => time * 3600000)
        // Items without assignments or due dates, and burned items, are not overdue
        if (!item.assignments || !item.assignments.available_at || item.assignments.srs_stage == 9) return -1
        const dueMsAgo = Date.now() - Date.parse(item.assignments.available_at)
        return dueMsAgo / SRS_DURATIONS[item.assignments.srs_stage - 1]
    }

    // Creates a new PRNG
    function seeded_prng(seed) {
        return mulberry32(xmur3(seed)())()
    }

    // Seed generator for PRNG
    function xmur3(str) {
        for (var i = 0, h = 1779033703 ^ str.length; i < str.length; i++)
            (h = Math.imul(h ^ str.charCodeAt(i), 3432918353)), (h = (h << 13) | (h >>> 19))
        return function () {
            h = Math.imul(h ^ (h >>> 16), 2246822507)
            h = Math.imul(h ^ (h >>> 13), 3266489909)
            return (h ^= h >>> 16) >>> 0
        }
    }

    // Seedable PRNG
    function mulberry32(a) {
        return function () {
            var t = (a += 0x6d2b79f5)
            t = Math.imul(t ^ (t >>> 15), t | 1)
            t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296
        }
    }

    // Load WKOF settings
    function load_settings() {
        const defaults = {
            spread: 10,
        }
        return wkof.Settings.load(script_id, defaults)
    }

    // Installs the options button in the menu
    function install_menu() {
        const config = {
            name: script_id,
            submenu: 'Settings',
            title: script_name,
            on_click: open_settings,
        }
        wkof.Menu.insert_script_link(config)
    }

    // Opens settings dialogue when button is pressed
    function open_settings() {
        const config = {
            script_id,
            title: script_name,
            on_save: update_counts,
            content: {
                spread: {
                    type: 'number',
                    default: 10,
                    label: 'Spread Interval (%)',
                    hover_tip:
                        'The maximum percentage to spread the interval by. For example, if this is set to 10, then the interval will be extended by a random amount between 0% and 10%.',
                },
            },
        }
        new wkof.Settings(config).open()
    }
})(window.wkof, window.jQuery)
