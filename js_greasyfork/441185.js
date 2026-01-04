// ==UserScript==
// @name         Wanikani: Overall Progress Bars
// @namespace    http://tampermonkey.net/
// @version      1.4.2
// @description  Creates a progress bar on the dashboard for every level
// @author       Kumirei
// @include      /^https://(www|preview).wanikani.com/(dashboard)?$/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441185/Wanikani%3A%20Overall%20Progress%20Bars.user.js
// @updateURL https://update.greasyfork.org/scripts/441185/Wanikani%3A%20Overall%20Progress%20Bars.meta.js
// ==/UserScript==

;(async () => {
    const { wkof, $ } = window

    // Script info
    const script_name = 'Overall Progress Bars'
    const script_id = 'overall_progress_bar'

    // Constants
    srs_names = {
        '-1': 'Locked',
        0: 'In lessons',
        1: 'Apprentice 1',
        2: 'Apprentice 2',
        3: 'Apprentice 3',
        4: 'Apprentice 4',
        5: 'Guru 1',
        6: 'Guru 2',
        7: 'Master',
        8: 'Enlightened',
        9: 'Burned',
    }
    const positions = [
        () => $('.progress-and-forecast'),
        () => $('.srs-progress'),
        () => $('.recent-unlocks').closest('.row'),
        () => $('.forum-topics-list').closest('.row'),
    ]

    // Init
    confirm_wkof()
    wkof.include('Menu,Settings,ItemData')
    await wkof.ready('Menu,Settings,ItemData').then(load_settings).then(install_menu)

    const settings = wkof.settings[script_id]
    let color

    // Get items by level
    const items = await wkof.ItemData.get_items('assignments')
    const items_by_level = wkof.ItemData.get_index(items, 'level')

    // Get counts per SRS level per level
    const counts_by_level_and_srs = {}
    for (let [level, items] of Object.entries(items_by_level)) {
        counts_by_level_and_srs[level] = Object.fromEntries(
            Object.entries(wkof.ItemData.get_index(items, 'srs_stage')).map(([srs, items]) => [srs, items.length]),
        )
    }
    display()

    function display() {
        set_color_theme()
        injectCss()
        $('.srs-level-graph').remove()
        positions[settings.position]().before(
            `<section class="srs-level-graph">${Object.entries(counts_by_level_and_srs)
                .filter(([level]) => {
                    if (level > settings.max_level) return false
                    if (settings.hide_locked && level > wkof.user.level) return false
                    return true
                })
                .map(get_level)
                .join('')}</section`,
        )
    }

    function set_color_theme() {
        color = {
            '-1': settings.theme === 'breeze' ? '#31363B' : '#aaaaaa',
            0: settings.theme === 'breeze' ? '#31363B' : '#aaaaaa',
            1: settings.theme === 'breeze' ? '#3fbbf3' : '#ff00bb',
            2: settings.theme === 'breeze' ? '#2eaaf4' : '#ee00aa',
            3: settings.theme === 'breeze' ? '#1d99f3' : '#dd0099',
            4: settings.theme === 'breeze' ? '#0c88e2' : '#cc0088',
            5: settings.theme === 'breeze' ? '#1cdc9a' : '#9339aa',
            6: settings.theme === 'breeze' ? '#1cdc9a' : '#882d9e',
            7: settings.theme === 'breeze' ? '#c9ce3b' : '#294ddb',
            8: settings.theme === 'breeze' ? '#f67400' : '#0093dd',
            9: settings.theme === 'breeze' ? '#da4453' : '#FAAF0E',
        }
    }

    function get_level([level, counts_by_srs]) {
        const total = Object.values(counts_by_srs).reduce((sum, val) => sum + val, 0)
        const bars = Object.entries(counts_by_srs)
            .map((item) => get_bar(...item, total))
            .join('')
        return `<div class="level"><div class="bars" style="background: ${get_color(
            counts_by_srs,
        )};">${bars}</div><div class="lbl" title="Level ${level}">${level}</div></div>`
    }

    function get_bar(srs_level, count, total) {
        const percent = Math.round((count / total) * 100)
        return `<div class="srs" data-srs="${srs_level}" title="${srs_names[srs_level]}: ${count} / ${total} items (${percent}%)" style="flex-grow: ${count}"></div>`
    }

    function get_color(counts_by_srs) {
        if (!['blend', 'avg_srs'].includes(settings.display)) return ''
        const srs_levels = Object.entries(counts_by_srs).reduce(
            (srs_items, [srs_level, count]) => srs_items.concat(new Array(count).fill(srs_level < 0 ? 0 : srs_level)),
            [],
        )
        const avg_srs = srs_levels.reduce((sum, val) => sum + Number(val), 0) / srs_levels.length
        if (settings.display === 'blend') {
            return averageColors(srs_levels)
        } else if (settings.display === 'avg_srs') {
            return interpolate_color(color[Math.floor(avg_srs)], color[Math.ceil(avg_srs)], avg_srs % 1)
        }
        return ''
    }

    function averageColors(levelItems) {
        let itemValues = [0, 0, 0]
        let averageColor = '#'

        // For each level, a mean average is taken of each item's color
        for (let i = 0; i < levelItems.length; i++) {
            for (let j = 0; j < 3; j++) {
                itemValues[j] += parseInt('0x0' + color[levelItems[i]].slice(2 * j + 1, 2 * j + 3), 16)
            }
        }

        // Divide by the total to get the means for RGB
        for (let k = 0; k < itemValues.length; k++) {
            itemValues[k] = itemValues[k] / levelItems.length
            itemValues[k] = Math.round(itemValues[k])
        }

        // Convert back into hex
        averageColor = '#' + itemValues.map((a) => `00${parseInt(a, 10).toString(16)}`.slice(-2)).join('')

        return averageColor
    }

    function interpolate_color(a, b, amount) {
        var ah = parseInt(a.replace(/#/g, ''), 16),
            ar = ah >> 16,
            ag = (ah >> 8) & 0xff,
            ab = ah & 0xff,
            bh = parseInt(b.replace(/#/g, ''), 16),
            br = bh >> 16,
            bg = (bh >> 8) & 0xff,
            bb = bh & 0xff,
            rr = ar + amount * (br - ar),
            rg = ag + amount * (bg - ag),
            rb = ab + amount * (bb - ab)

        return '#' + (((1 << 24) + (rr << 16) + (rg << 8) + rb) | 0).toString(16).slice(1)
    }

    function injectCss() {
        let srs_css = ''
        for (let i = -1; i < 10; i++) {
            srs_css += `
.srs-level-graph .srs[data-srs="${i}"] {
    background-color: ${color[i]};
    ${settings.display !== 'bars' ? 'width: 100' : 'height: ' + (i + 1) * 10}%;
}`
        }

        const css = `.srs-level-graph {
    justify-content: space-evenly;
    gap: 0.2em;
    padding: 16px 12px 12px;
    background-color: ${settings.theme === 'breeze' ? '#232629' : '#f4f4f4'};
    border-radius: 5px;
    margin: 0 0 30px 0 !important;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(16px, 1fr));
    grid-auto-rows: 3em;
}

.srs-level-graph .level {
    width: 100%;
    display: flex;
    flex-direction: column;
}

.srs-level-graph .bars {
    display: flex;
    align-items: flex-end;
    flex-grow: 1;
    flex-direction: ${settings.display !== 'bars' ? 'column' : 'row-reverse'};
}

.srs-level-graph .lbl {
    font-size: 0.75em;
    line-height: 1.5em;
    text-align: center;
    vertical-align: bottom;
}

.srs-level-graph .srs {
    ${['blend', 'avg_srs'].includes(settings.display) ? 'display:none;' : ''}
    ${settings.display !== 'bars' ? '' : 'border-radius: 0.1em 0.1em 0 0;'}
}

.srs-level-graph .srs[data-srs="-1"] {
    order: -1;
}

${srs_css}`

        $(`#overall-progress-bars-css`).remove()
        $('head').append(`<style id="overall-progress-bars-css">${css}</style>`)
    }

    /* ----------------------------------------------------------*/
    // WKOF setup
    /* ----------------------------------------------------------*/

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
            return
        }
    }

    // Load WKOF settings
    function load_settings() {
        const defaults = {
            display: 'stack',
            max_level: 60,
            hide_locked: false,
            theme: 'default',
            position: 0,
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
        let config = {
            script_id: script_id,
            title: script_name,
            on_save: display,
            content: {
                display: {
                    type: 'dropdown',
                    label: 'Display as',
                    default: 'stack',
                    hover_tip: 'Changes how the bars look',
                    content: {
                        stack: 'Stack',
                        bars: 'Bars',
                        avg_srs: 'Single Color (average SRS)',
                        blend: 'Single Color (blend)',
                    },
                },
                max_level: {
                    type: 'number',
                    label: 'Max Level',
                    hover_tip: 'The highest level to display',
                    max: 60,
                    min: 1,
                },
                hide_locked: {
                    type: 'checkbox',
                    default: false,
                    label: 'Hide Locked Levels',
                    hover_tip: 'Do not display bars above your current level',
                },
                theme: {
                    type: 'dropdown',
                    label: 'Theme',
                    default: 0,
                    hover_tip: 'Changes the colors of the bars',
                    content: { default: 'Default', breeze: 'Breeze Dark' },
                },
                position: {
                    type: 'dropdown',
                    label: 'Position',
                    default: 0,
                    hover_tip: 'Changes the colors of the bars',
                    content: ['Top', 'Above SRS Counts', 'Above Panels', 'Above Recent Topics'],
                },
            },
        }
        let dialog = new wkof.Settings(config)
        dialog.open()
    }
})()
