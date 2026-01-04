// ==UserScript==
// @name         Wanikani: Dashboard Apprentice
// @namespace    http://tampermonkey.net/
// @version      1.2.4
// @description  Displays all your apprentice items on the dashboard
// @author       Kumirei
// @match        https://www.wanikani.com
// @match        https://www.wanikani.com/dashboard*
// @match        https://preview.wanikani.com
// @match        https://preview.wanikani.com/dashboard*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388113/Wanikani%3A%20Dashboard%20Apprentice.user.js
// @updateURL https://update.greasyfork.org/scripts/388113/Wanikani%3A%20Dashboard%20Apprentice.meta.js
// ==/UserScript==
/*jshint esversion: 8 */

;(function (wkof, $) {
    // Make sure WKOF is installed
    let script_id = 'dashboard_apprentice'
    if (!wkof) {
        var script_name = 'Wanikani: Dashboard Apprentice'
        var response = confirm(
            script_name +
                ' requires WaniKani Open Framework.\n Click "OK" to be forwarded to installation instructions.',
        )
        if (response) {
            window.location.href =
                'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549'
        }
        return
    }
    // Ready to go
    else {
        wkof.include('Menu,Settings,ItemData')
        wkof.ready('Menu,Settings,ItemData')
            .then(load_settings)
            .then(install_menu)
            .then(add_css)
            .then(fetch_items)
            .then(display)
    }

    function install_menu() {
        let config = {
            name: script_id,
            submenu: 'Settings',
            title: 'Dashboard Apprentice',
            on_click: open_settings,
        }
        wkof.Menu.insert_script_link(config)
    }
    function open_settings() {
        var config = {
            script_id: script_id,
            title: 'Dashboard Apprentice',
            content: {
                theme: {
                    type: 'dropdown',
                    label: 'Theme',
                    default: 0,
                    hover_tip: 'Changes the colors of the items',
                    content: { 0: 'Default', 1: 'Breeze Dark' },
                },
                srs_start: {
                    type: 'number',
                    label: 'First SRS stage',
                    default: 1,
                    hover_tip:
                        'First SRS stage to display.\n-1: Locked items\n0: Items in your lessons\n1-4: Apprentice\n5-6: Guru\n7: Master\n8: Enlightened\n9: Burned',
                },
                srs_end: {
                    type: 'number',
                    label: 'Last SRS stage',
                    default: 4,
                    hover_tip:
                        'Last SRS stage to display.\n-1: Locked items\n0: Items in your lessons\n1-4: Apprentice\n5-6: Guru\n7: Master\n8: Enlightened\n9: Burned',
                },
                types: {
                    type: 'list',
                    label: 'Item types',
                    multi: true,
                    hover_tip: 'Which items you want to display',
                    default: { rad: true, kan: true, voc: true },
                    content: { rad: 'Radicals', kan: 'Kanji', voc: 'Vocabulary', kana_voc: 'Kana Vocabulary' },
                },
            },
        }
        let dialog = new wkof.Settings(config)
        dialog.open()
    }

    function load_settings() {
        let defaults = {
            theme: 0,
            srs_start: 1,
            srs_end: 4,
            types: { rad: true, kan: true, voc: true, kana_voc: true },
        }
        return wkof.Settings.load(script_id, defaults)
    }

    // Fetches the items
    async function fetch_items() {
        let types = Object.entries(wkof.settings[script_id].types)
            .filter((a) => a[1])
            .map((a) => a[0])
        return wkof.ItemData.get_index(
            await wkof.ItemData.get_items({
                wk_items: { options: { assignments: true }, filters: { item_type: types } },
            }),
            'srs_stage',
        )
    }

    // Puts the information on the dashboard
    async function display(data) {
        let names = {
            '-1': 'Locked',
            0: 'Lessons',
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
        var elem = $('<section id="wkda_items"></section>')[0]
        if (is_dark_theme()) elem.className = 'dark'
        let settings = wkof.settings[script_id]
        for (var i = settings.srs_start; i <= settings.srs_end; i++) {
            if (!data[i]) continue
            var srs_elem = $('<div class="apprentice_' + i + '"></div>')[0]
            var title = $('<span>' + names[i] + ' </span>')[0]
            var items = $('<div class="items"></div>')[0]
            srs_elem.appendChild(title)
            srs_elem.appendChild(items)
            for (var j = 0; j < data[i].length; j++) {
                var item = data[i][j]
                var info = {
                    type: item.object,
                    characters:
                        item.data.characters !== null
                            ? item.data.characters
                            : await wkof.load_file(
                                  item.data.character_images.find((c) => c.content_type === 'image/svg+xml').url,
                                  true,
                              ),
                    meanings: [],
                    readings: [],
                    level: item.data.level,
                    url: item.data.document_url,
                    available:
                        i == -1
                            ? 'Locked'
                            : i == 0
                            ? 'In lesson queue'
                            : item.assignments.srs_stage == 9
                            ? 'Burned'
                            : Date.parse(item.assignments.available_at) < Date.now()
                            ? 'Now'
                            : s_to_dhm((Date.parse(item.assignments.available_at) - Date.now()) / 1000),
                }
                for (let k = 0; k < item.data.meanings.length; k++) {
                    info.meanings.push(item.data.meanings[k].meaning)
                }
                if (item.data.readings) {
                    for (let k = 0; k < item.data.readings.length; k++) {
                        info.readings.push(item.data.readings[k].reading)
                    }
                }
                var item_elem = $(
                    '<div class="item ' +
                        info.type +
                        '"' +
                        '>' +
                        '<div class="hover_elem">' +
                        '<div class="left">' +
                        '<a class="' +
                        info.type +
                        '" href="' +
                        info.url +
                        '">' +
                        info.characters +
                        '</a>' +
                        '</div>' +
                        '<div class="right">' +
                        '<table>' +
                        '<tr><td>Meanings</td><td>' +
                        info.meanings.join(', ') +
                        '</td></tr>' +
                        '<tr><td>Readings</td><td>' +
                        info.readings.join('、') +
                        '</td></tr>' +
                        '<tr><td>Level</td><td>' +
                        info.level +
                        '</td></tr>' +
                        '<tr><td>Available</td><td>' +
                        info.available +
                        '</td></tr>' +
                        '</table>' +
                        '</div>' +
                        '</div>' +
                        '<a class="' +
                        info.type +
                        '" href="' +
                        info.url +
                        '">' +
                        info.characters +
                        '</a>' +
                        '</div>',
                )[0]
                items.appendChild(item_elem)
            }
            elem.appendChild(srs_elem)
        }
        let target = document.querySelector('.span12 > .row')
        target.parentElement.insertBefore(elem, target)
    }

    // Adds the CSS to the page
    function add_css() {
        let theme = wkof.settings[script_id].theme
        $('head').append(
            `<style id="wkda_css">
                #wkda_items {
                    background-color: #f4f4f4;
                    border-radius: 5px;
                    padding: 16px 24px 12px;
                    --color-text: ${['rgb(240, 240, 240)', 'black'][theme]} !important;
                }
                #wkda_items.dark {
                    background-color: #232629;
                }
                #wkda_items > div {
                    margin-bottom: 10px;
                }
                #wkda_items {
                    font-size: 16px;
                }
                #wkda_items .items {
                    position: relative;
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                    justify-content: flex-start;
                    margin-left: -2px;
                }
                #wkda_items .items .item {
                    display: inline-block;
                    padding: 0 3px;
                    margin: 1.5px;
                    border-radius: 3px;
                    position: relative;
                }
                #wkda_items .items .radical {
                    background: ${['#0096e7', '#3daee9'][theme]};
                    order: 0;
                    width: 14px;
                }
                #wkda_items .items .kanji {
                    background: ${['#ff00aa', '#fdbc4b'][theme]};
                    order: 1;
                }
                #wkda_items .items .vocabulary {
                    background: ${['#9800e8', '#2ecc71'][theme]};
                    order: 3;
                }
                #wkda_items .items .kana_vocabulary {
                    background: ${['#9800e8', '#2ecc71'][theme]};
                    order: 2;
                }
                #wkda_items .hover_elem {
                    visibility: hidden;
                    position: absolute;
                    background-color: rgba(0, 0, 0, 0.9);
                    z-index: 2;
                    padding: 5px;
                    border-radius: 3px;
                    width: max-content;
                    transform: translate(-50%, calc(0px - 100% - 5px));
                    left: 50%;
                }
                #wkda_items .item:hover .hover_elem {
                    visibility: visible; 
                }
                #wkda_items .hover_elem::after {
                    visibility: hidden;
                    position: absolute;
                    width: 0;
                    border-top: 5px solid rgba(0, 0, 0, 0.9);
                    border-right: 5px solid transparent;
                    border-left: 5px solid transparent;
                    content: " ";
                    font-size: 0;
                    line-height: 0;
                    left: 50%;
                    bottom: -5px;
                    transform: translateX(-50%);
                }
                #wkda_items .item:hover .hover_elem::after {
                    visibility: visible;
                }
                #wkda_items .hover_elem > div {
                    display: inline-block;
                }
                #wkda_items .item.vocabulary .hover_elem > div {
                    display: block;
                }
                #wkda_items .left {
                    vertical-align: top;
                }
                #wkda_items .item.vocabulary .hover_elem .left {
                    margin-bottom: 5px;
                }
                #wkda_items .left a {
                    font-size: 74px;
                    line-height: 73px;
                    min-width: 73px;
                    display: block;
                    padding: 5px;
                    border-radius: 3px;
                    margin: 3px 10px 0 3px;
                }
                #wkda_items .item.vocabulary .left a {
                    margin-right: 3px;
                    text-align: center;
                }
                #wkda_items .items .radical svg {
                    height: 14px;
                    stroke: currentColor;
                    fill: none;
                    stroke-linecap: square;
                    stroke-width: 68;
                }
                #wkda_items .items .radical svg g {
                    clip-path: none;
                }
                #wkda_items .items .radical .hover_elem svg {
                    height: 74px;
                    width: 1em;
                }
                #wkda_items .right table td:first-child {
                    padding-right: 10px;
                    font-weight: bold;
                }
                #wkda_items .items table td {
                    color: rgb(240, 240, 240);
                }
                #wkda_items .items > div a {
                    color: ${['rgb(240, 240, 240)', 'black'][theme]} !important;
                }
                #wkda_items .item.vocabulary .hover_elem {
                	max-width: 320px;
                }
                </style>`,
        )
    }

    // Converts seconds to days, hours, and minutes
    function s_to_dhm(s) {
        var d = Math.floor(s / 60 / 60 / 24)
        var h = Math.floor((s % (60 * 60 * 24)) / 60 / 60)
        var m = Math.ceil(((s % (60 * 60 * 24)) % (60 * 60)) / 60)
        return (d > 0 ? d + 'd ' : '') + (h > 0 ? h + 'h ' : '') + (m > 0 ? m + 'm' : '1m')
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
})(window.wkof, window.$)
