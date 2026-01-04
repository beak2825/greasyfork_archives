// ==UserScript==
// @name         Wanikani: Levels by SRS
// @namespace    http://tampermonkey.net/
// @version      1.1.7
// @description  Displays your level for each SRS stage.
// @author       Kumirei
// @match        https://www.wanikani.com/dashboard
// @match        https://www.wanikani.com
// @include      *preview.wanikani.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387250/Wanikani%3A%20Levels%20by%20SRS.user.js
// @updateURL https://update.greasyfork.org/scripts/387250/Wanikani%3A%20Levels%20by%20SRS.meta.js
// ==/UserScript==
/*jshint esversion: 8 */

;(function () {
    //check that the Wanikani Framework is installed
    var script_name = 'Levels By SRS'
    if (!window.wkof) {
        if (
            confirm(
                script_name +
                    ' requires Wanikani Open Framework.\nDo you want to be forwarded to the installation instructions?',
            )
        )
            window.location.href =
                'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549'
        return
    }
    //if it's installed then do the stuffs
    else {
        wkof.include('Menu,Settings,ItemData')
        wkof.ready('Menu,Settings,ItemData').then(load_settings).then(install_menu).then(add_css).then(fetch_and_update)
    }

    // Fetches items and updates display
    function fetch_and_update() {
        fetch_items().then(process_items).then(update_display)
    }

    // Fetches the relevant items
    function fetch_items() {
        var [promise, resolve] = new_promise()
        var config = {
            wk_items: {
                options: { assignments: true },
                filters: { level: '1..+0' },
            },
        }
        wkof.ItemData.get_items(config).then(resolve)
        return promise
    }

    // Retreives the levels by srs
    function process_items(data) {
        // Sort by level
        var levels = {}
        let item
        for (var i = 0; i < data.length; i++) {
            item = data[i]
            var level = item.data.level
            if (!levels[level]) levels[level] = []
            levels[level].push(item)
        }
        // Go through items level by level
        var srs_levels = {
            Ini: [0, 0, 0],
            App: [0, 0, 0],
            Gur: [0, 0, 0],
            Mas: [0, 0, 0],
            Enl: [0, 0, 0],
            Bur: [0, 0, 0],
        }
        for (i = 1; i < wkof.user.level + 1; i++) {
            // Get counts for level
            var by_srs = { Ini: 0, App: 0, Gur: 0, Mas: 0, Enl: 0, Bur: 0, total: 0 }
            for (var j = 0; j < levels[i].length; j++) {
                item = levels[i][j]
                if (item.assignments)
                    by_srs[
                        ['Ini', 'App', 'App', 'App', 'App', 'Gur', 'Gur', 'Mas', 'Enl', 'Bur'][
                            item.assignments.srs_stage
                        ]
                    ]++
                else by_srs.Ini++
                by_srs.total++
            }
            // Check if srs_level should be increased
            var types = ['Ini', 'App', 'Gur', 'Mas', 'Enl', 'Bur']
            var cumulative = 0
            for (j = 0; j < types.length; j++) {
                var count = by_srs[types[j]]
                if (
                    1 - cumulative / by_srs.total >= wkof.settings.levels_by_srs.threshold / 100 &&
                    i == srs_levels[types[j]][0] + 1
                ) {
                    srs_levels[types[j]][0]++
                } else if (
                    1 - cumulative / by_srs.total <= wkof.settings.levels_by_srs.threshold / 100 &&
                    i == srs_levels[types[j]][0] + 1
                ) {
                    srs_levels[types[j]][1] = 1 - cumulative / by_srs.total
                    srs_levels[types[j]][2] = by_srs.total
                }
                cumulative += count
            }
        }
        return srs_levels
    }

    // Updates the display element
    function update_display(srs_levels) {
        var types = ['App', 'Gur', 'Mas', 'Enl', 'Bur']
        // If the element doesn't already exist, create it
        var display = $('#levels_by_srs')
        if (!display.length) {
            display = $('<div id="levels_by_srs"' + (is_dark_theme() ? ' class="dark_theme"' : '') + '></div>')
            for (var i = 0; i < types.length; i++)
                display.append(
                    '<div class="' +
                        types[i] +
                        '"><span class="level_label">Level: </span><span class="value"></span></div>',
                )
            $('.srs-progress').append(display)
        }
        // Update
        for (let i = 0; i < types.length; i++) {
            var elem = $(display).find('.' + types[i] + ' span.value')[0]
            elem.innerText = srs_levels[types[i]][0]
            elem.parentElement.setAttribute(
                'title',
                Math.floor(srs_levels[types[i]][1] * 100) +
                    '% to level ' +
                    (srs_levels[types[i]][0] + 1) +
                    ' (' +
                    Math.round(srs_levels[types[i]][1] * srs_levels[types[i]][2]) +
                    ' of ' +
                    srs_levels[types[i]][2] +
                    ')',
            )
        }
    }

    // Load stored settings or set defaults
    function load_settings() {
        var defaults = { threshold: 90 }
        return wkof.Settings.load('levels_by_srs', defaults)
    }

    // Installs the options button in the menu
    function install_menu() {
        var config = {
            name: 'levels_by_srs',
            submenu: 'Settings',
            title: 'Levels By SRS',
            on_click: open_settings,
        }
        wkof.Menu.insert_script_link(config)
    }

    // Create the options
    function open_settings(items) {
        var config = {
            script_id: 'levels_by_srs',
            title: 'Levels By SRS',
            on_save: fetch_and_update,
            content: {
                threshold: {
                    type: 'number',
                    label: 'Threshold',
                    hover_tip: 'Percentage to consider level done',
                    default: 90,
                },
            },
        }
        var dialog = new wkof.Settings(config)
        dialog.open()
    }

    // Adds the script's CSS to the page
    function add_css() {
        $('head').append(`<style id="levels_by_srs_CSS">
        #levels_by_srs {
            background: #434343;
            border-radius: 0 0 3px 3px;
            height: 30px;
            line-height: 30px;
            color: rgb(240, 240, 240);
            display: flex;
            justify-content: space-around;
        }
        #levels_by_srs > div {
            display: flex;
            flex: 1;
            justify-content: center;
        }
        #levels_by_srs .level_label {
            font-size: 16px;
            margin-right: 5px;
        }
        #levels_by_srs .value {
            font-size: 16px;
            font-weight: normal;
        }
        #levels_by_srs.dark_theme {
            background: #232629;
        }
        #levels_by_srs.dark_theme > div:not(:last-child) {
            border-right: 1px solid #31363b;
            margin-right: 5px;
        }
        #levels_by_srs.dark_theme > div:last-child {
            border-right: 1px solid transparent;
        }
        .srs-progress > ul > li {
            border-radius: 0 !important;
        }
        </style>`)
    }

    // Returns a promise and a resolve function
    function new_promise() {
        var resolve,
            promise = new Promise((res, rej) => {
                resolve = res
            })
        return [promise, resolve]
    }

    // Handy little function that rfindley wrote. Checks whether the theme is dark.
    function is_dark_theme() {
        // Grab the <html> background color, average the RGB.  If less than 50% bright, it's dark theme.
        return (
            $('body')
                .css('background-color')
                .match(/\((.*)\)/)[1]
                .split(',')
                .slice(0, 3)
                .map((str) => Number(str))
                .reduce((a, i) => a + i) /
                (255 * 3) <
            0.5
        )
    }
})()
