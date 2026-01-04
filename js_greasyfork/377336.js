// ==UserScript==
// @name         Wanikani Heatmap
// @namespace    http://tampermonkey.net/
// @version      3.1.11
// @description  Adds review and lesson heatmaps to the dashboard.
// @author       Kumirei
// @include      /^https://(www|preview).wanikani.com/(dashboard)?$/
// @match        https://www.wanikani.com/*
// @match        https://preview.wanikani.com/*
// @require      https://greasyfork.org/scripts/489759-wk-custom-icons/code/CustomIcons.js?version=1417568
// @require      https://greasyfork.org/scripts/410909-wanikani-review-cache/code/Wanikani:%20Review%20Cache.js?version=1193344
// @require      https://greasyfork.org/scripts/410910-heatmap/code/Heatmap.js?version=1251299
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377336/Wanikani%20Heatmap.user.js
// @updateURL https://update.greasyfork.org/scripts/377336/Wanikani%20Heatmap.meta.js
// ==/UserScript==

;(function (wkof, review_cache, Heatmap, Icons) {
    const CSS_COMMIT = '61a780cee6f08eb3a4f8f37068c1e6ce29762e96'
    let script_id = 'heatmap3'
    let script_name = 'Wanikani Heatmap'
    let msh = 60 * 60 * 1000,
        msd = 24 * msh // Milliseconds in hour and day

    Icons.addCustomIcons([
        [
            'trophy',
            'M400 0H176c-26.5 0-48.1 21.8-47.1 48.2c.2 5.3 .4 10.6 .7 15.8H24C10.7 64 0 74.7 0 88c0 92.6 33.5 157 78.5 200.7c44.3 43.1 98.3 64.8 138.1 75.8c23.4 6.5 39.4 26 39.4 45.6c0 20.9-17 37.9-37.9 37.9H192c-17.7 0-32 14.3-32 32s14.3 32 32 32H384c17.7 0 32-14.3 32-32s-14.3-32-32-32H357.9C337 448 320 431 320 410.1c0-19.6 15.9-39.2 39.4-45.6c39.9-11 93.9-32.7 138.2-75.8C542.5 245 576 180.6 576 88c0-13.3-10.7-24-24-24H446.4c.3-5.2 .5-10.4 .7-15.8C448.1 21.8 426.5 0 400 0zM48.9 112h84.4c9.1 90.1 29.2 150.3 51.9 190.6c-24.9-11-50.8-26.5-73.2-48.3c-32-31.1-58-76-63-142.3zM464.1 254.3c-22.4 21.8-48.3 37.3-73.2 48.3c22.7-40.3 42.8-100.5 51.9-190.6h84.4c-5.1 66.3-31.1 111.2-63 142.3z',
            576,
        ],
        [
            'inbox',
            'M121 32C91.6 32 66 52 58.9 80.5L1.9 308.4C.6 313.5 0 318.7 0 323.9V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V323.9c0-5.2-.6-10.4-1.9-15.5l-57-227.9C446 52 420.4 32 391 32H121zm0 64H391l48 192H387.8c-12.1 0-23.2 6.8-28.6 17.7l-14.3 28.6c-5.4 10.8-16.5 17.7-28.6 17.7H195.8c-12.1 0-23.2-6.8-28.6-17.7l-14.3-28.6c-5.4-10.8-16.5-17.7-28.6-17.7H73L121 96z',
        ],
    ])

    /*-------------------------------------------------------------------------------------------------------------------------------*/

    var reload // Function to reload the heatmap
    // Temporary measure to track reviews while the /reviews endpoint is unavailable
    function main() {
        if (/www.wanikani.com\/(dashboard)?#?$/.test(window.location.href)) {
            // Wait until modules are ready then initiate script
            confirm_wkof()
            wkof.include('Menu,Settings,ItemData,Apiv2')
            wkof.ready('Menu,Settings,ItemData,Apiv2')
                .then(load_settings)
                .then(load_css)
                .then(install_menu)
                .then(initiate)

            window.addEventListener('turbo:load', async (e) => {
                setTimeout(main, 0)
            })
        }
    }

    main()

    // Fetch necessary data then install the heatmap
    async function initiate() {
        review_cache.subscribe(do_stuff)

        async function do_stuff(reviews) {
            reviews ??= []
            // Fetch data
            let items = await wkof.ItemData.get_items('assignments,include_hidden')
            let [forecast, lessons] = get_forecast_and_lessons(items)
            if (wkof.settings[script_id].lessons.recover_lessons) {
                let recovered_lessons = await get_recovered_lessons(items, reviews, lessons)
                lessons = lessons.concat(recovered_lessons).sort((a, b) => (a[0] < b[0] ? -1 : 1))
            }
            // Create heatmap
            reload = function (new_reviews = false) {
                // If start date is invalid, set it to the default
                if (isNaN(Date.parse(wkof.settings[script_id].general.start_date)))
                    wkof.settings[script_id].general.start_date = '2012-01-01'
                // Get a timestamp for the start date
                wkof.settings[script_id].general.start_day =
                    new Date(wkof.settings[script_id].general.start_date) -
                    -new Date(wkof.settings[script_id].general.start_date).getTimezoneOffset() * 60 * 1000
                setTimeout(() => {
                    // Make settings dialog respond immediately
                    let stats = {
                        reviews: calculate_stats('reviews', reviews),
                        lessons: calculate_stats('lessons', lessons),
                    }
                    auto_range(stats, forecast)
                    install_heatmap(reviews, forecast, lessons, stats, items)
                }, 0)
            }
            reload()
        }
    }

    /*-------------------------------------------------------------------------------------------------------------------------------*/

    function confirm_wkof() {
        if (!wkof) {
            let response = confirm(
                script_name +
                    ' requires WaniKani Open Framework.\n Click "OK" to be forwarded to installation instructions.',
            )
            if (response)
                window.location.href =
                    'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549'
            return
        }
    }

    // Load settings from WKOF
    function load_settings() {
        let defaults = {
            general: {
                start_date: '2012-01-01',
                week_start: 0,
                day_start: 0,
                reverse_years: false,
                segment_years: true,
                zero_gap: false,
                month_labels: 'all',
                day_labels: true,
                session_limit: 10,
                now_indicator: true,
                color_now_indicator: '#ff0000',
                level_indicator: true,
                color_level_indicator: '#ffffff',
                position: 2,
                theme: 'dark',
            },
            reviews: {
                gradient: false,
                auto_range: true,
            },
            lessons: {
                gradient: false,
                auto_range: true,
                count_zeros: false,
                recover_lessons: false,
            },
            forecast: {
                gradient: false,
                auto_range: true,
            },
            other: {
                visible_years: { reviews: {}, lessons: {} },
                visible_map: 'reviews',
                times_popped: 0,
                times_dragged: 0,
                ported: false,
            },
        }
        return wkof.Settings.load(script_id, defaults).then((settings) => {
            // Workaround for defaults modifying existing settings
            if (!settings.reviews.colors?.length)
                settings.reviews.colors = [
                    [0, '#747474'],
                    [1, '#ade4ff'],
                    [100, '#82c5e6'],
                    [200, '#57a5cc'],
                    [300, '#2b86b3'],
                    [400, '#006699'],
                ]
            if (!settings.lessons.colors?.length)
                settings.lessons.colors = [
                    [0, '#747474'],
                    [1, '#ff8aa1'],
                    [100, '#e46e9e'],
                    [200, '#c8539a'],
                    [300, '#ad3797'],
                    [400, '#911b93'],
                ]
            if (!settings.forecast.colors?.length)
                settings.forecast.colors = [
                    [0, '#747474'],
                    [1, '#aaaaaa'],
                    [100, '#bfbfbf'],
                    [200, '#d5d5d5'],
                    [300, '#eaeaea'],
                    [400, '#ffffff'],
                ]
            // Load settings from old script if possible
            if (!settings.other.ported) port_settings(settings)
            migrate_settings(settings)

            // Make sure current year is visible
            for (let type of ['reviews', 'lessons']) {
                wkof.settings[script_id].other.visible_years[type][new Date().getFullYear()] = true
            }
            wkof.Settings.save(script_id)
            return settings
        })
    }

    // Loads heatmap and jQuery datepicker CSS
    function load_css() {
        // Heatmap CSS
        const heatmapRepo = `//raw.githubusercontent.com/Kumirei/Userscripts/${CSS_COMMIT}/Wanikani/Heatmap`
        wkof.load_css(`${heatmapRepo}/Heatmap/Heatmap.css`, true)
        wkof.load_css(`${heatmapRepo}/heatmap3.css`, true)
    }

    // Installs the settings button in the menu
    function install_menu() {
        let config = {
            name: script_id,
            submenu: 'Settings',
            title: 'Heatmap',
            on_click: open_settings,
        }
        wkof.Menu.insert_script_link(config)
    }

    // Add stuff to the settings dialog before opening
    let applied // Keeps track of whether the settings have been applied
    function modify_settings(dialog) {
        // Make start-date a jQuery datepicker
        //window.jQuery(dialog[0].querySelector('#'+script_id+'_start_date')).datepicker({dateFormat: "yy-mm-dd",changeYear: true,yearRange: "2012:+0"});
        // Add apply button
        applied = false
        let apply = create_elem({
            type: 'button',
            class: 'ui-button ui-corner-all ui-widget',
            child: 'Apply',
            onclick: (e) => {
                applied = true
                reload()
            },
        })
        dialog[0].nextElementSibling
            .getElementsByClassName('ui-dialog-buttonset')[0]
            .insertAdjacentElement('afterbegin', apply)
        // Updates the color labels with new hex values
        let update_label = function (input) {
            if (!input.nextElementSibling)
                input.insertAdjacentElement(
                    'afterend',
                    create_elem({ type: 'div', class: 'color-label', child: input.value }),
                )
            else input.nextElementSibling.innerText = input.value
            if (!Math.round(hex_to_rgb(input.value).reduce((a, b) => a + b / 3, 0) / 255 - 0.15))
                input.nextElementSibling.classList.remove('light-color')
            else input.nextElementSibling.classList.add('light-color')
        }
        // Add color settings
        dialog[0]
            .querySelectorAll('#' + script_id + '_general ~ div .wkof_group > div:nth-of-type(2)')
            .forEach((elem, i) => {
                let type = ['reviews', 'lessons', 'forecast'][i]
                // Update the settings object with data from the settings dialog
                let update_color_settings = (_) => {
                    wkof.settings[script_id][type].colors = []
                    Array.from(elem.nextElementSibling.children[1].children).forEach((child, i) => {
                        wkof.settings[script_id][type].colors.push([
                            child.children[0].children[0].value,
                            child.children[1].children[0].value,
                        ])
                    })
                }
                // Creates a new interval setting
                let create_row = (value, color) => {
                    return create_elem({
                        type: 'div',
                        class: 'row',
                        children: [
                            create_elem({
                                type: 'div',
                                class: 'text',
                                child: create_elem({ type: 'input', input: 'number', value: value }),
                            }),
                            create_elem({
                                type: 'div',
                                class: 'color',
                                child: create_elem({
                                    type: 'input',
                                    input: 'color',
                                    value: color,
                                    callback: (e) => e.addEventListener('change', (_) => update_label(e)),
                                }),
                                callback: (e) => update_label(e.children[0]),
                            }),
                            create_elem({
                                type: 'div',
                                class: 'delete',
                                child: create_elem({
                                    type: 'button',
                                    onclick: (e) => {
                                        e.target.closest('.row').remove()
                                        update_color_settings()
                                    },
                                    child: Icons.customIcon('trash'),
                                }),
                            }),
                        ],
                    })
                }
                // Creates the interface for color settings
                let panel = create_elem({
                    type: 'div',
                    class: 'right',
                    children: [
                        create_elem({
                            type: 'button',
                            class: 'adder',
                            onclick: (e) => {
                                e.target.nextElementSibling.append(create_row(0, '#ffffff'))
                                update_color_settings()
                            },
                            child: 'Add interval',
                        }),
                        create_elem({ type: 'div', class: 'row panel' }),
                    ],
                })
                // Update the settings when they change
                panel.addEventListener('change', update_color_settings)
                // Add the existing settings
                for (let [value, color] of wkof.settings[script_id][type].colors)
                    panel.children[1].append(create_row(value, color))
                // Make sure that reviews and forecast have the same zero-color
                if (i == 0 || i == 2)
                    panel.children[1].children[0].addEventListener('change', (e) => {
                        let input = e.target
                            .closest('#' + script_id + '_tabs')
                            .querySelector(
                                '#' +
                                    script_id +
                                    '_' +
                                    (i == 0 ? 'forecast' : 'reviews') +
                                    ' .panel > .row:first-child .color input',
                            )
                        if (input.value != e.target.value) {
                            input.value = e.target.value
                            input.dispatchEvent(new Event('change'))
                            wkof.settings[script_id][i == 0 ? 'forecast' : 'reviews'].colors[0][1] = e.target.value
                        }
                    })
                // Install
                elem.insertAdjacentElement('afterend', panel)
            })
        // Disable the first interval's bound input so that it can't be changed from 0
        dialog[0]
            .querySelectorAll('#' + script_id + '_general ~ div .panel .row:first-child .text input')
            .forEach((elem) => (elem.disabled = true))
        // Add labels to all color inputs
        dialog[0].querySelectorAll('#' + script_id + '_general input[type="color"]').forEach((input) => {
            input.addEventListener('change', () => update_label(input))
            update_label(input)
        })
        // Add functionality to review inserter
        dialog[0].querySelector('#insert_reviews_button').addEventListener('click', (event) => {
            const date = dialog[0].querySelector('#insert_reviews_date').value
            const count = Number(dialog[0].querySelector('#insert_reviews_count').value)
            const spr = Number(dialog[0].querySelector('#insert_reviews_time').value) || 0 // Seconds per review
            if (!date || !count) return

            const mspr = spr * 1000 // MS per review
            const dayStart = wkof.settings[script_id].general.day_start
            const startHour = Math.floor(dayStart)
            const startMin = Math.floor((dayStart % 1) * 60)
            const time = Date.parse(date + `T${String(startHour).padStart(2, 0)}:${String(startMin).padStart(2, 0)}`)
            const reviews = new Array(count).fill(null).map((_, i) => [time + i * mspr, 1, 1, 0, 0])
            review_cache.insert(reviews)
        })
    }

    // Open the settings dialog
    function open_settings() {
        let config = {
            script_id: script_id,
            title: 'Heatmap',
            on_save: (_) => (applied = true),
            on_close: reload_on_change,
            content: {
                tabs: {
                    type: 'tabset',
                    content: {
                        general: {
                            type: 'page',
                            label: 'General',
                            hover_tip: 'Settings pertaining to the general functions of the script',
                            content: {
                                control: {
                                    type: 'group',
                                    label: 'Control',
                                    content: {
                                        position: {
                                            type: 'dropdown',
                                            label: 'Position',
                                            default: 2,
                                            hover_tip: 'Where on the dashboard to install the heatmap',
                                            content: {
                                                0: 'Top',
                                                1: 'Below forecast',
                                                2: 'Below SRS',
                                                3: 'Below panels',
                                                4: 'Bottom',
                                            },
                                            path: '@general.position',
                                        },
                                        start_date: {
                                            type: 'input',
                                            subtype: 'date',
                                            label: 'Start date',
                                            default: '2012-01-01',
                                            hover_tip: 'All data before this date will be ignored',
                                            path: '@general.start_date',
                                        },
                                        week_start: {
                                            type: 'dropdown',
                                            label: 'First day of the week',
                                            default: 0,
                                            hover_tip: 'Determines which day of the week is at the top of the heatmaps',
                                            content: {
                                                0: 'Monday',
                                                1: 'Tuesday',
                                                2: 'Wednesday',
                                                3: 'Thursday',
                                                4: 'Friday',
                                                5: 'Saturday',
                                                6: 'Sunday',
                                            },
                                            path: '@general.week_start',
                                        },
                                        day_start: {
                                            type: 'number',
                                            label: 'New day starts at',
                                            default: 0,
                                            placeholder: '(hours after midnight)',
                                            hover_tip:
                                                'Offset for those who tend to stay up after midnight. If you want the new day to start at 4 AM, input 4.',
                                            path: '@general.day_start',
                                        },
                                        session_limit: {
                                            type: 'number',
                                            label: 'Session time limit (minutes)',
                                            default: 10,
                                            placeholder: '(minutes)',
                                            hover_tip:
                                                'Max number of minutes between review/lesson items to still count within the same session',
                                            path: '@general.session_limit',
                                        },
                                        theme: {
                                            type: 'dropdown',
                                            label: 'Theme',
                                            default: 'dark',
                                            hover_tip: 'Changes the background color and other things',
                                            content: { light: 'Light', dark: 'Dark', 'breeze-dark': 'Breeze Dark' },
                                            path: '@general.theme',
                                        },
                                    },
                                },
                                layout: {
                                    type: 'group',
                                    label: 'Layout',
                                    content: {
                                        reverse_years: {
                                            type: 'checkbox',
                                            label: 'Reverse year order',
                                            default: false,
                                            hover_tip: 'Puts the most recent years on the bottom instead of the top',
                                            path: '@general.reverse_years',
                                        },
                                        segment_years: {
                                            type: 'checkbox',
                                            label: 'Segment year',
                                            default: true,
                                            hover_tip: 'Put a gap between months',
                                            path: '@general.segment_years',
                                        },
                                        zero_gap: {
                                            type: 'checkbox',
                                            label: 'No gap',
                                            default: false,
                                            hover_tip: `Don't display any gap between days`,
                                            path: '@general.zero_gap',
                                        },
                                        day_labels: {
                                            type: 'dropdown',
                                            label: 'Day of week labels',
                                            default: 'english',
                                            hover_tip:
                                                'Adds letters to the left of the heatmaps indicating which row represents which weekday',
                                            content: { none: 'None', english: 'English', kanji: 'Kanji' },
                                            path: '@general.day_labels',
                                        },
                                        month_labels: {
                                            type: 'dropdown',
                                            label: 'Month labels',
                                            default: 'all',
                                            hover_tip: 'Display month labels above each month',
                                            content: { all: 'All', top: 'Only at the top', none: 'None' },
                                            path: '@general.month_labels',
                                        },
                                    },
                                },
                                indicators: {
                                    type: 'group',
                                    label: 'Indicators',
                                    content: {
                                        now_indicator: {
                                            type: 'checkbox',
                                            label: 'Current day indicator',
                                            default: true,
                                            hover_tip: 'Puts a border around the current day',
                                            path: '@general.now_indicator',
                                        },
                                        level_indicator: {
                                            type: 'checkbox',
                                            label: 'Level-up indicators',
                                            default: true,
                                            hover_tip: 'Puts borders around the days on which you leveled up',
                                            path: '@general.level_indicator',
                                        },
                                        color_now_indicator: {
                                            type: 'color',
                                            label: 'Color for current day',
                                            hover_tip: 'The border around the current day will have this color',
                                            default: '#ff0000',
                                            path: '@general.color_now_indicator',
                                        },
                                        color_level_indicator: {
                                            type: 'color',
                                            label: 'Color for level-ups',
                                            hover_tip: 'The borders around level-ups will have this color',
                                            default: '#ffffff',
                                            path: '@general.color_level_indicator',
                                        },
                                    },
                                },
                            },
                        },
                        reviews: {
                            type: 'page',
                            label: 'Reviews',
                            hover_tip: 'Settings pertaining to the review heatmaps',
                            content: {
                                reviews_settings: {
                                    type: 'group',
                                    label: 'Review Settings',
                                    content: {
                                        reviews_section: { type: 'section', label: 'Intervals' },
                                        reviews_auto_range: {
                                            type: 'checkbox',
                                            label: 'Auto range intervals',
                                            default: true,
                                            hover_tip: 'Automatically decide what the intervals should be',
                                            path: '@reviews.auto_range',
                                        },
                                        reviews_gradient: {
                                            type: 'checkbox',
                                            label: 'Use gradients',
                                            default: false,
                                            hover_tip:
                                                'Interpolate colors based on the exact number of items on that day',
                                            path: '@reviews.gradient',
                                        },
                                        reviews_generate: {
                                            type: 'button',
                                            label: 'Generate colors',
                                            text: 'Generate',
                                            hover_tip: 'Generate new colors from the first and last non-zero interval',
                                            on_click: generate_colors,
                                        },
                                        add_reviews_section: { type: 'section', label: 'Manually Register Reviews' },
                                        reviews_insert: {
                                            type: 'html',
                                            html: `
                                            <div>
                                                <div><label>Date <input id="insert_reviews_date" type="date"/></label></div>
                                                <div><label>Count <input id="insert_reviews_count" type="number" min="0" placeholder="Number of reviews" /></label></div>
                                                <div><label>Seconds Per Review <input id="insert_reviews_time" type="number" min="0" placeholder="seconds" value=10 /></label></div>
                                                <div style="display: flex; justify-content: flex-end;"><button id="insert_reviews_button">Register</button></div>
                                            </div>
                                            `,
                                        },
                                        // reviews_section2: { type: 'section', label: 'Other' },
                                        // reload_button: {
                                        //     type: 'button',
                                        //     label: 'Reload review data',
                                        //     text: 'Reload',
                                        //     hover_tip: 'Deletes review cache and starts a new fetch',
                                        //     on_click: () => review_cache.reload().then((reviews) => reload(reviews)),
                                        // },
                                    },
                                },
                            },
                        },
                        lessons: {
                            type: 'page',
                            label: 'Lessons',
                            hover_tip: 'Settings pertaining to the lesson heatmaps',
                            content: {
                                lessons_settings: {
                                    type: 'group',
                                    label: 'Lesson Settings',
                                    content: {
                                        lessons_section: { type: 'section', label: 'Intervals' },
                                        lessons_auto_range: {
                                            type: 'checkbox',
                                            label: 'Auto range intervals',
                                            default: true,
                                            hover_tip: 'Automatically decide what the intervals should be',
                                            path: '@lessons.auto_range',
                                        },
                                        lessons_gradient: {
                                            type: 'checkbox',
                                            label: 'Use gradients',
                                            default: false,
                                            hover_tip:
                                                'Interpolate colors based on the exact number of items on that day',
                                            path: '@lessons.gradient',
                                        },
                                        lessons_generate: {
                                            type: 'button',
                                            label: 'Generate colors',
                                            text: 'Generate',
                                            hover_tip: 'Generate new colors from the first and last non-zero interval',
                                            on_click: generate_colors,
                                        },
                                        lessons_section2: { type: 'section', label: 'Other' },
                                        lessons_count_zeros: {
                                            type: 'checkbox',
                                            label: 'Include zeros in streak',
                                            default: false,
                                            hover_tip: 'Counts days with no lessons available towards the streak',
                                            path: '@lessons.count_zeros',
                                        },
                                        recover_lessons: {
                                            type: 'checkbox',
                                            label: 'Recover reset lessons',
                                            default: false,
                                            hover_tip:
                                                'Allow the Heatmap to guess when you did lessons for items that have been reset',
                                            path: '@lessons.recover_lessons',
                                        },
                                    },
                                },
                            },
                        },
                        forecast: {
                            type: 'page',
                            label: 'Review Forecast',
                            hover_tip: 'Settings pertaining to the forecast',
                            content: {
                                forecast_settings: {
                                    type: 'group',
                                    label: 'Forecast Settings',
                                    content: {
                                        forecast_section: { type: 'section', label: 'Intervals' },
                                        forecast_auto_range: {
                                            type: 'checkbox',
                                            label: 'Auto range intervals',
                                            default: true,
                                            hover_tip: 'Automatically decide what the intervals should be',
                                            path: '@forecast.auto_range',
                                        },
                                        forecast_gradient: {
                                            type: 'checkbox',
                                            label: 'Use gradients',
                                            default: false,
                                            hover_tip:
                                                'Interpolate colors based on the exact number of items on that day',
                                            path: '@forecast.gradient',
                                        },
                                        forecast_generate: {
                                            type: 'button',
                                            label: 'Generate colors',
                                            text: 'Generate',
                                            hover_tip: 'Generate new colors from the first and last non-zero interval',
                                            on_click: generate_colors,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        }
        let dialog = new wkof.Settings(config)
        config.pre_open = (elem) => {
            dialog.refresh()
            modify_settings(elem)
        } // Refresh to populate settings before modifying
        delete wkof.settings[script_id].wkofs_active_tabs // Make settings dialog always open in first tab because it is so much taller
        dialog.open()
    }

    // Fetches user's v2 settings if they exist
    async function port_settings(settings) {
        if (wkof.file_cache.dir['wkof.settings.wanikani_heatmap']) {
            let old = await wkof.file_cache.load('wkof.settings.wanikani_heatmap')
            settings.general.start_date = old.general.start_date
            settings.general.week_start = old.general.week_start ? 0 : 6
            settings.general.day_start = old.general.hours_offset
            settings.general.reverse_years = old.general.reverse_years
            settings.general.segment_years = old.general.segment_years
            settings.general.day_labels = old.general.day_labels
            settings.general.now_indicator = old.general.today
            settings.general.color_now_indicator = old.general.today_color
            settings.general.level_indicator = old.general.level_ups
            settings.general.color_level_indicator = old.general.level_ups_color
            settings.reviews.auto_range = old.reviews.auto_range
            settings.reviews.colors = [
                [0, '#747474'],
                [1, old.reviews.color1],
                [old.reviews.interval1, old.reviews.color2],
                [old.reviews.interval2, old.reviews.color3],
                [old.reviews.interval3, old.reviews.color4],
                [old.reviews.interval4, old.reviews.color5],
            ]
            settings.forecast.colors = [
                [0, '#747474'],
                [1, old.reviews.forecast_color1],
                [old.reviews.interval1, old.reviews.forecast_color2],
                [old.reviews.interval2, old.reviews.forecast_color3],
                [old.reviews.interval3, old.reviews.forecast_color4],
                [old.reviews.interval4, old.reviews.forecast_color5],
            ]
            settings.forecast.auto_range = old.reviews.auto_range
            settings.lessons.colors = [
                [0, '#747474'],
                [1, old.lessons.color1],
                [old.lessons.interval1, old.lessons.color2],
                [old.lessons.interval2, old.lessons.color3],
                [old.lessons.interval3, old.lessons.color4],
                [old.lessons.interval4, old.lessons.color5],
            ]
            settings.lessons.auto_range = old.lessons.auto_range
            settings.lessons.count_zeros = old.lessons.count_zeros
        }
        settings.other.ported = true
    }

    // Updates settings if someone has outdated settings
    function migrate_settings(settings) {
        // Changed day labels from checkbox to dropdown
        if (typeof settings.general.day_labels === 'boolean')
            settings.general.day_labels = settings.general.day_labels ? 'english' : 'none'
    }

    // Reload the heatmap if settings have been changed
    function reload_on_change(settings) {
        if (applied) reload()
    }

    // Generates new colors for the intervals in the settings dialog
    function generate_colors(setting_name) {
        // Find the intervals
        let type = setting_name.split('_')[0]
        let panel = document.getElementById(script_id + '_' + type + '_settings').querySelector('.panel')
        let colors = wkof.settings[script_id][type].colors
        // Interpolate between first and last non-zero interval
        let first = colors[1]
        let last = colors[colors.length - 1]
        for (let i = 2; i < colors.length; i++) {
            colors[i][1] = interpolate_color(first[1], last[1], (i - 1) / (colors.length - 2))
        }
        // Refresh settings
        panel.querySelectorAll('.color input').forEach((input, i) => {
            input.value = colors[i][1]
            input.dispatchEvent(new Event('change'))
        })
    }

    /*-------------------------------------------------------------------------------------------------------------------------------*/

    // Extract upcoming reviews and completed lessons from the WKOF cache
    function get_forecast_and_lessons(data) {
        let forecast = [],
            lessons = []
        let time_now = Date.now()
        let vacation_offset = time_now - new Date(wkof.user.current_vacation_started_at || time_now)
        for (let item of data) {
            if (item.assignments?.started_at && item.assignments.unlocked_at) {
                // If the assignment has been started add a lesson containing staring date, id, level, and unlock date
                lessons.push([
                    Date.parse(item.assignments.started_at),
                    item.id,
                    item.data.level,
                    Date.parse(item.assignments.unlocked_at),
                ])
                // If item is in the future and it is not hidden by Wanikani, add the item to the forecast array
                if (
                    item.assignments.available_at &&
                    Date.parse(item.assignments.available_at) > time_now &&
                    item.data.hidden_at === null
                ) {
                    // If the assignment is scheduled add a forecast item ready for sending to the heatmap module
                    let forecast_item = [
                        Date.parse(item.assignments.available_at) + vacation_offset,
                        { forecast: 1 },
                        { 'forecast-ids': item.id },
                    ]
                    forecast_item[1]['forecast-srs1-' + item.assignments.srs_stage] = 1
                    forecast.push(forecast_item)
                }
            }
        }
        // Sort lessons by started_at for easy extraction of chronological info
        lessons.sort((a, b) => (a[0] < b[0] ? -1 : 1))
        return [forecast, lessons]
    }

    // Fetch recovered lessons from storage or recover lessons then return them
    async function get_recovered_lessons(items, reviews, real_lessons) {
        if (!wkof.file_cache.dir.recovered_lessons) {
            let recovered_lessons = await recover_lessons(items, reviews, real_lessons)
            wkof.file_cache.save('recovered_lessons', recovered_lessons)
            return recovered_lessons
        } else return await wkof.file_cache.load('recovered_lessons')
    }

    // Use review data to guess when the lesson was done for all reset items
    async function recover_lessons(items, reviews, real_lessons) {
        // Fetch and prepare data
        let resets = await wkof.Apiv2.get_endpoint('resets')
        let items_id = wkof.ItemData.get_index(items, 'subject_id')
        let delay = 4 * msh
        let app1_reviews = reviews
            .filter((a) => a[2] == 1)
            .map((item) => [item[0] - delay, item[1], items_id[item[1]].data.level, item[0] - delay])
        // Check reviews based on reset intervals
        let last_date = 0,
            recovered_lessons = []
        Object.values(resets)
            .sort((a, b) => (a.data.confirmed_at < b.data.confirmed_at ? -1 : 1))
            .forEach((reset) => {
                let ids = {},
                    date = Date.parse(reset.data.confirmed_at)
                // Filter out items not belonging to the current reset period
                let reset_reviews = app1_reviews.filter((a) => a[0] > last_date && a[0] < date)
                // Choose the earliest App1 review
                reset_reviews.forEach((item) => {
                    if (!ids[item[1]] || ids[item[1]][0] > item[0]) ids[item[1]] = item
                })
                // Remove items that still have lesson data
                real_lessons.filter((a) => a[0] < date).forEach((item) => delete ids[item[1]])
                // Save recovered lessons to array
                Object.values(ids).forEach((item) => recovered_lessons.push(item))
                last_date = date
            })
        return recovered_lessons
    }

    // Calculate overall stats for lessons and reviews
    function calculate_stats(type, data) {
        let settings = wkof.settings[script_id]
        let streaks = get_streaks(type, data)
        let longest_streak = Math.max(...Object.values(streaks))
        let current_streak = streaks[new Date(Date.now() - msh * settings.general.day_start).toDateString()]
        let stats = {
            total: [0, 0, 0, 0, 0, 0], // [total, year, month, week, day, today]
            days_studied: [0, 0], // [days studied, percentage]
            average: [0, 0, 0], // [average, per studied, standard deviation]
            streak: [longest_streak, current_streak], // [longest streak, current streak]
            sessions: 0, // Number of sessions
            time: [0, 0, 0, 0, 0, 0], // [total, year, month, week, day, today]
            days: 0, // Number of days since first review
            max_done: [0, 0], // Max done in one day [count, date]
            streaks, // Streaks object
        }
        let last_day = new Date(0) // Last item's date
        let today = new Date() // Today
        let d = new Date(Date.now() - msd) // 24 hours ago
        let week = new Date(Date.now() - 7 * msd) // 7 days ago
        let month = new Date(Date.now() - 30 * msd) // 30 days ago
        let year = new Date(Date.now() - 365 * msd) // 365 days ago
        let last_time = 0 // Last item's timestamp
        let done_day = 0 // Total done on the date of the item
        let done_days = [] // List of total done on each day
        let start_date = new Date(settings.general.start_day) // User's start date
        for (let item of data) {
            let day = new Date(item[0] - msh * settings.general.day_start)
            if (day < start_date) continue // If item is before start, discard it
            // If it's a new day
            if (last_day.toDateString() != day.toDateString()) {
                stats.days_studied[0]++
                done_days.push(done_day)
                done_day = 0
            }
            // Update done this day
            done_day++
            if (done_day > stats.max_done[0]) stats.max_done = [done_day, day.toDateString().replace(/... /, '')]
            let minutes = (item[0] - last_time) / 60000
            // Update sessions
            if (minutes > settings.general.session_limit) {
                stats.sessions++
                minutes = 0
            }
            // Update totals
            stats.total[0]++
            stats.time[0] += minutes
            // Done in the last year
            if (year < day) {
                stats.total[1]++
                stats.time[1] += minutes
            }
            // Done in the last month
            if (month < day) {
                stats.total[2]++
                stats.time[2] += minutes
            }
            // Done in the last week
            if (week < day) {
                stats.total[3]++
                stats.time[3] += minutes
            }
            // Done in the last 24 hours
            if (d < day) {
                stats.total[4]++
                stats.time[4] += minutes
            }
            // Done today
            if (today.toDateString() == day.toDateString()) {
                stats.total[5]++
                stats.time[5] += minutes
            }
            // Store values for next item
            last_day = day
            last_time = item[0]
        }
        // Update averages
        done_days.push(done_day)
        const day_start_adjust = msh * settings.general.day_start // Adjust for the user's start of day setting
        const first_date = data?.[0]?.[0] || day_start_adjust
        stats.days =
            Math.round(
                (Date.parse(new Date().toDateString()) -
                    Math.max(
                        Date.parse(new Date(first_date).toDateString()),
                        new Date(settings.general.start_day).getTime(),
                    )) /
                    msd,
            ) + 1
        stats.days_studied[1] = Math.round((stats.days_studied[0] / stats.days) * 100)
        stats.average[0] = Math.round(stats.total[0] / stats.days)
        stats.average[1] = Math.round(stats.total[0] / stats.days_studied[0])
        stats.average[2] = Math.sqrt(
            (1 / stats.days_studied[0]) *
                done_days.map((x) => Math.pow(x - stats.average[1], 2)).reduce((a, b) => a + b, 0),
        )
        return stats
    }

    // Finds streaks
    function get_streaks(type, data) {
        let settings = wkof.settings[script_id]
        let day_start_adjust = msh * settings.general.day_start // Adjust for the user's start of day setting
        // Initiate dates
        let streaks = {},
            zeros = {}
        const first_date = data?.[0]?.[0] || day_start_adjust
        for (
            let day = new Date(Math.max(first_date - day_start_adjust, new Date(settings.general.start_day).getTime()));
            day <= new Date();
            day.setDate(day.getDate() + 1)
        ) {
            streaks[day.toDateString()] = 0
            zeros[day.toDateString()] = true
        }
        // For all dates where something was done, set streak to 1
        for (let [date] of data)
            if (new Date(date) > new Date(settings.general.start_day))
                streaks[new Date(date - day_start_adjust).toDateString()] = 1
        // If user wants to count days where no lessons were available, set those streaks to 1 as well
        if (type === 'lessons' && settings.lessons.count_zeros) {
            // Delete dates where lessons were available
            for (let [started_at, id, level, unlocked_at] of data) {
                for (
                    let day = new Date(unlocked_at - day_start_adjust);
                    day <= new Date(started_at - day_start_adjust);
                    day.setDate(day.getDate() + 1)
                ) {
                    delete zeros[day.toDateString()]
                }
            }
            // Set all remaining dates to streak 1
            for (let date of Object.keys(zeros)) streaks[date] = 1
        }
        // Cumulate streaks
        let streak = 0
        for (
            let day = new Date(Math.max(first_date - day_start_adjust, new Date(settings.general.start_day).getTime()));
            day <= new Date().setHours(24);
            day.setDate(day.getDate() + 1)
        ) {
            if (streaks[day.toDateString()] === 1) streak++
            else streak = 0
            streaks[day.toDateString()] = streak
        }
        if (streaks[new Date().toDateString()] == 0)
            streaks[new Date().toDateString()] = streaks[new Date(new Date().setHours(-12)).toDateString()] || 0
        return streaks
    }

    // Get level up dates from API and lesson history
    async function get_level_ups(items) {
        let level_progressions = await wkof.Apiv2.get_endpoint('level_progressions')
        let first_recorded_date = level_progressions[Math.min(...Object.keys(level_progressions))].data.unlocked_at
        // Find indefinite level ups by looking at lesson history
        let levels = {}
        // Sort lessons by level then unlocked date
        items.forEach((item) => {
            if (
                item.object !== 'kanji' ||
                !item.assignments ||
                !item.assignments.unlocked_at ||
                item.assignments.unlocked_at >= first_recorded_date
            )
                return
            let date = new Date(item.assignments.unlocked_at).toDateString()
            if (!levels[item.data.level]) levels[item.data.level] = {}
            if (!levels[item.data.level][date]) levels[item.data.level][date] = 1
            else levels[item.data.level][date]++
        })
        // Discard dates with less than 10 unlocked
        // then discard levels with no dates
        // then keep earliest date for each level
        for (let [level, data] of Object.entries(levels)) {
            for (let [date, count] of Object.entries(data)) {
                if (count < 10) delete data[date]
            }
            if (Object.keys(levels[level]).length == 0) {
                delete levels[level]
                continue
            }
            levels[level] = Object.keys(data).reduce((low, curr) => (low < curr ? low : curr), Date.now())
        }
        // Map to array of [[level0, date0], [level1, date1], ...] Format
        levels = Object.entries(levels).map(([level, date]) => [Number(level), date])
        // Add definite level ups from API
        Object.values(level_progressions).forEach((level) =>
            levels.push([level.data.level, new Date(level.data.unlocked_at).toDateString()]),
        )
        return levels
    }

    /*-------------------------------------------------------------------------------------------------------------------------------*/

    // Create and install the heatmap
    async function install_heatmap(reviews, forecast, lessons, stats, items) {
        let settings = wkof.settings[script_id]
        // Create elements
        let heatmap =
            document.getElementById('heatmap') ||
            create_elem({
                type: 'section',
                id: 'heatmap',
                class: 'heatmap ' + (settings.other.visible_map === 'reviews' ? 'reviews' : ''),
                position: settings.general.position,
                onclick: day_click({ reviews, forecast, lessons }),
            })
        let buttons = create_buttons()
        let views = create_elem({ type: 'div', class: 'views' })
        heatmap.onmousedown = heatmap.onmouseup = heatmap.onmouseover = click_and_drag({ reviews, forecast, lessons })
        heatmap.setAttribute('theme', settings.general.theme)
        heatmap.style.setProperty(
            '--color-now',
            settings.general.now_indicator ? settings.general.color_now_indicator : 'transparent',
        )
        heatmap.style.setProperty(
            '--color-level',
            settings.general.level_indicator ? settings.general.color_level_indicator : 'transparent',
        )
        // Create heatmaps
        let cooked_reviews = cook_data('reviews', reviews)
        let cooked_lessons = cook_data('lessons', lessons)
        let level_ups = await get_level_ups(items)
        let reviews_view = create_view(
            'reviews',
            stats,
            level_ups,
            reviews?.[0]?.[0] || Date.now(),
            forecast.reduce((max, a) => (max > a[0] ? max : a[0]), 0),
            cooked_reviews.concat(forecast),
        )
        let lessons_view = create_view(
            'lessons',
            stats,
            level_ups,
            lessons?.[0]?.[0] || Date.now(),
            lessons.reduce((max, a) => (max > a[0] ? max : a[0]), 0),
            cooked_lessons,
        )
        let popper = create_popper({ reviews: cooked_reviews, forecast, lessons: cooked_lessons })
        views.append(reviews_view, lessons_view, popper)
        // Install
        heatmap.innerHTML = ''
        heatmap.append(buttons, views)
        let position = [
            ['.dashboard__content', 'beforebegin'],
            ['.dashboard__srs-progress', 'afterbegin'],
            ['.srs-progress', 'afterend'],
            ['.dashboard__item-lists', 'beforeend'],
            ['.dashboard__content', 'afterend'],
        ][settings.general.position]
        if (!document.getElementById('heatmap') || heatmap.getAttribute('position') != settings.general.position)
            document.querySelector(position[0]).insertAdjacentElement(position[1], heatmap)
        heatmap.setAttribute('position', settings.general.position)
        // Fire event to let people know it's finished loading
        fire_event('heatmap-loaded', heatmap)
    }

    // Creates the buttons at the top of the heatmap
    function create_buttons() {
        let buttons = create_elem({ type: 'div', class: 'buttons' })
        add_transitions(buttons)
        const leftButtons = create_elem({ type: 'div', class: 'left' })
        let settings_button = create_elem({
            type: 'button',
            class: 'settings-button hover-wrapper-target button',
            'aria-label': 'Settings',
            children: [
                create_elem({ type: 'div', class: 'hover-wrapper above', child: 'Settings' }),
                Icons.customIcon('settings'),
            ],
            onclick: open_settings,
        })
        let helpButton = create_elem({
            type: 'a',
            class: 'help-button hover-wrapper-target button',
            'aria-label': 'Settings',
            href: 'https://community.wanikani.com/t/userscript-wanikani-heatmap',
            target: '_blank',
            children: [
                create_elem({ type: 'div', class: 'hover-wrapper above', child: 'Help' }),
                Icons.customIcon('circle-question'),
            ],
        })
        let infoButton = create_elem({
            type: 'a',
            class: 'info-button hover-wrapper-target button',
            'aria-label': 'Settings',
            href: 'https://community.wanikani.com/t/api-changes-get-all-reviews/61617',
            target: '_blank',
            children: [
                create_elem({ type: 'div', class: 'hover-wrapper above', child: 'Why you might be missing reviews' }),
                Icons.customIcon('warning'),
            ],
        })
        leftButtons.append(settings_button, helpButton, infoButton)

        let toggle_button = create_elem({
            type: 'button',
            class: 'toggle-button hover-wrapper-target button',
            'aria-label': 'Toggle between reviews and lessons',
            children: [
                create_elem({ type: 'div', class: 'hover-wrapper above', child: 'Toggle view' }),
                Icons.customIcon('inbox'),
            ],
            onclick: toggle_visible_map,
        })
        buttons.append(leftButtons, toggle_button)
        return buttons
    }

    // Prepares data for the heatmap
    function cook_data(type, data) {
        if (type === 'reviews') {
            let ans = (srs, err) => {
                let srs2 = srs - Math.ceil(err / 2) * (srs < 5 ? 1 : 2) + (err == 0 ? 1 : 0)
                return srs2 < 1 ? 1 : srs2
            }
            return data.map((item) => {
                let cooked = [
                    item[0],
                    { reviews: 1, pass: item[3] + item[4] == 0 ? 1 : 0, incorrect: item[3] + item[4], streak: item[5] },
                    { 'reviews-ids': item[1] },
                ]
                cooked[1][type + '-srs1-' + item[2]] = 1
                cooked[1][type + '-srs2-' + ans(item[2], item[3] + item[4])] = 1
                return cooked
            })
        } else if (type === 'lessons')
            return data.map((item) => [item[0], { lessons: 1, streak: item[4] }, { 'lessons-ids': item[1] }])
        else if (type === 'forecast') return data
    }

    // Create heatmaps and peripherals such as stats
    function create_view(type, stats, level_ups, first_date, last_date, data) {
        let settings = wkof.settings[script_id]
        let level_marks = level_ups.map(([level, date]) => [date, 'level-up' + (level == 60 ? ' level-60' : '')])
        // New heatmap instance
        let heatmap = new Heatmap(
            {
                type: 'year',
                id: type,
                week_start: settings.general.week_start,
                day_start: settings.general.day_start,
                first_date:
                    Math.max(new Date(settings.general.start_day).getTime(), first_date) -
                    settings.general.day_start * msh,
                last_date: last_date,
                segment_years: settings.general.segment_years,
                zero_gap: settings.general.zero_gap,
                markings: [[new Date(Date.now() - msh * settings.general.day_start), 'today'], ...level_marks],
                day_labels: settings.general.day_labels === 'kanji' && ['月', '火', '水', '木', '金', '土', '日'],
                day_hover_callback: (date, day_data) => {
                    let type2 = type
                    let time = new Date(date[0], date[1] - 1, date[2], 0, 0).getTime()
                    if (
                        type2 === 'reviews' &&
                        time > Date.now() - msh * settings.general.day_start &&
                        day_data.counts.forecast
                    )
                        type2 = 'forecast'
                    let string = `${(day_data.counts[type2] || 0).toLocaleString()} ${
                        type2 === 'forecast'
                            ? 'reviews upcoming'
                            : day_data.counts[type2] === 1
                            ? type2.slice(0, -1)
                            : type2
                    } on ${
                        new Date(time).toDateString().replace(/... /, '') + ' ' + kanji_day(new Date(time).getDay())
                    }`
                    if (time >= new Date(settings.general.start_day).getTime() && time > first_date) {
                        string += `\nDay ${(
                            Math.round(
                                (time -
                                    Date.parse(
                                        new Date(
                                            Math.max(data[0]?.[0] || 0, new Date(settings.general.start_day).getTime()),
                                        ).toDateString(),
                                    )) /
                                    msd,
                            ) + 1
                        ).toLocaleString()}`
                    }
                    if (
                        time < Date.now() &&
                        time >= new Date(settings.general.start_day).getTime() &&
                        time > first_date
                    )
                        string += `, Streak ${stats[type].streaks[new Date(time).toDateString()] || 0}`
                    string += '\n'
                    if (
                        type2 === 'reviews' &&
                        day_data.counts.forecast &&
                        new Date(time).toDateString() == new Date().toDateString()
                    ) {
                        string += `\n${day_data.counts.forecast} more reviews upcoming`
                    }
                    if (type2 !== 'lessons' && day_data.counts[type2 + '-srs' + (type2 === 'reviews' ? '2-9' : '1-8')])
                        string += '\nBurns ' + day_data.counts[type2 + '-srs' + (type2 === 'reviews' ? '2-9' : '1-8')]
                    let level = (level_ups.find((a) => a[1] == new Date(time).toDateString()) || [undefined])[0]
                    if (level) string += '\nYou reached level ' + level + '!'
                    if (wkof.settings[script_id].other.times_popped < 5 && Object.keys(day_data.counts).length !== 0)
                        string += '\nClick for details!'
                    if (
                        wkof.settings[script_id].other.times_popped >= 5 &&
                        wkof.settings[script_id].other.times_dragged < 3 &&
                        Object.keys(day_data.counts).length !== 0
                    )
                        string += '\nDid you know that you can click and drag, too?'
                    return [string]
                },
                color_callback: (date, day_data) => color_picker(type, date, day_data),
            },
            data,
        )
        modify_heatmap(type, heatmap)
        // Create layout
        let view = create_elem({ type: 'div', class: type + ' view' })
        let title = create_elem({ type: 'div', class: 'title', child: type.toProper() })
        let [head_stats, foot_stats] = create_stats_elements(type, stats[type])
        let years = create_elem({ type: 'div', class: 'years' + (settings.general.reverse_years ? ' reverse' : '') })
        if (Math.max(...Object.keys(heatmap.maps)) > new Date().getFullYear()) {
            if (settings.other.visible_years[type][new Date().getFullYear() + 1] !== false)
                years.classList.add('visible-future')
            years.classList.add('has-future')
        }
        years.setAttribute('month-labels', settings.general.month_labels)
        years.setAttribute('day-labels', settings.general.day_labels)
        for (let year of Object.values(heatmap.maps).reverse()) years.prepend(year)
        view.append(title, head_stats, years, foot_stats)
        return view
    }

    // Make changes to the heatmap object before it is displayed
    function modify_heatmap(type, heatmap) {
        for (let [year, map] of Object.entries(heatmap.maps)) {
            let target = map.querySelector('.year-labels')
            let up = create_elem({
                type: 'div',
                class: 'toggle-year up hover-wrapper-target',
                onclick: toggle_year,
                children: [
                    create_elem({
                        type: 'div',
                        class: 'hover-wrapper above',
                        child: create_elem({
                            type: 'div',
                            child:
                                'Click to ' + (year == new Date().getFullYear() ? 'show next' : 'hide this') + ' year',
                        }),
                    }),
                    Icons.customIcon('chevron-up'),
                ],
            })
            let down = create_elem({
                type: 'div',
                class: 'toggle-year down hover-wrapper-target',
                onclick: toggle_year,
                children: [
                    create_elem({
                        type: 'div',
                        class: 'hover-wrapper below',
                        child: create_elem({
                            type: 'div',
                            child:
                                'Click to ' +
                                (year <= new Date().getFullYear() ? 'show previous' : 'hide this') +
                                ' year',
                        }),
                    }),
                    Icons.customIcon('chevron-down'),
                ],
            })
            target.append(up, down)
            if (wkof.settings[script_id].other.visible_years[type][year] === false) map.classList.add('hidden')
        }
    }

    // Create the header and footer stats for a view
    function create_stats_elements(type, stats) {
        // Create an single stat element complete with hover info
        let create_stat_element = (label, value, hover) => {
            return create_elem({
                type: 'div',
                class: 'stat hover-wrapper-target',
                children: [
                    create_elem({ type: 'div', class: 'hover-wrapper above', child: hover }),
                    create_elem({ type: 'span', class: 'stat-label', child: label }),
                    create_elem({ type: 'span', class: 'value', child: value }),
                ],
            })
        }
        // Create the elements
        let head_stats = create_elem({
            type: 'div',
            class: 'head-stats stats',
            children: [
                create_stat_element(
                    'Days Studied',
                    stats.days_studied[1] + '%',
                    stats.days_studied[0].toLocaleString() + ' out of ' + stats.days.toLocaleString(),
                ),
                create_stat_element(
                    'Done Daily',
                    stats.average[0] + ' / ' + (stats.average[1] || 0),
                    'Per Day / Days studied\nMax: ' + stats.max_done[0].toLocaleString() + ' on ' + stats.max_done[1],
                ),
                create_stat_element('Streak', stats.streak[1] + ' / ' + stats.streak[0], 'Current / Longest'),
            ],
        })
        let foot_stats = create_elem({
            type: 'div',
            class: 'foot-stats stats',
            children: [
                create_stat_element(
                    'Sessions',
                    stats.sessions.toLocaleString(),
                    (Math.floor(stats.total[0] / stats.sessions) || 0) + ' per session',
                ),
                create_stat_element(
                    type.toProper(),
                    stats.total[0].toLocaleString(),
                    create_table('left', [
                        ['Year', stats.total[1].toLocaleString()],
                        ['Month', stats.total[2].toLocaleString()],
                        ['Week', stats.total[3].toLocaleString()],
                        ['24h', stats.total[4].toLocaleString()],
                    ]),
                ),
                create_stat_element(
                    'Time',
                    m_to_hm(stats.time[0]),
                    create_table('left', [
                        ['Year', m_to_hm(stats.time[1])],
                        ['Month', m_to_hm(stats.time[2])],
                        ['Week', m_to_hm(stats.time[3])],
                        ['24h', m_to_hm(stats.time[4])],
                    ]),
                ),
            ],
        })
        add_transitions(head_stats)
        add_transitions(foot_stats)
        return [head_stats, foot_stats]
    }

    // Add hover transition
    function add_transitions(elem) {
        elem.addEventListener('mouseover', (event) => {
            const elem = event.target.closest('.hover-wrapper-target')
            if (!elem) return
            elem.classList.add('heatmap-transition')
            setTimeout((_) => elem.classList.remove('heatmap-transition'), 20)
        })
    }

    // Initiates the popper element
    function create_popper(data) {
        // Create layout
        let popper = create_elem({ type: 'div', id: 'popper' })
        let header = create_elem({ type: 'div', class: 'header' })
        let minimap = create_elem({
            type: 'div',
            class: 'minimap',
            children: [
                create_elem({ type: 'span', class: 'minimap-label', child: 'Hours minimap' }),
                create_elem({ type: 'div', class: 'hours-map' }),
            ],
        })
        let stats = create_elem({ type: 'div', class: 'stats' })
        let items = create_elem({ type: 'div', class: 'items' })
        popper.append(header, minimap, stats, items)
        document.addEventListener('click', (event) => {
            if (!event.composedPath().find((a) => a === popper || (a.classList && a.classList.contains('years'))))
                popper.classList.remove('popped')
        })
        // Create header
        header.append(
            create_elem({
                type: 'div',
                class: 'clear hover-wrapper-target',
                children: [
                    create_elem({
                        type: 'div',
                        class: 'hover-wrapper above',
                        child: 'Clear all reviews from this day',
                    }),
                    create_elem({ type: 'button', id: 'clear_reviews', child: Icons.customIcon('trash') }),
                ],
            }),
            create_elem({ type: 'div', class: 'date' }),
            create_elem({
                type: 'div',
                class: 'subheader',
                children: [create_elem({ type: 'span', class: 'count' }), create_elem({ type: 'span', class: 'time' })],
            }),
            create_elem({
                type: 'div',
                class: 'score hover-wrapper-target',
                children: [
                    create_elem({ type: 'div', class: 'hover-wrapper above', child: 'Net progress of SRS levels' }),
                    create_elem({ type: 'span' }),
                ],
            }),
        )
        header.querySelector('#clear_reviews').addEventListener('click', async () => {
            let [start, end] = header
                .querySelector('.date')
                .textContent.split('-')
                .map((d) => new Date(d.replace(/\s*.\s*$/, '')))
            if (!end) end = start
            end = new Date(end.getFullYear(), end.getMonth(), end.getDate() + 1).getTime() // Include end of interval

            const reviews = await review_cache.get_reviews()
            const newReviews = reviews.filter((review) => review[0] < start || review[0] >= end) // Omit reviews
            await review_cache.reload() // Since API returns empty array this clears cache
            await review_cache.insert(newReviews)
        })
        // Create minimap and stats
        stats.append(
            create_table(
                'left',
                [['Levels'], [' 1-10', 0], ['11-20', 0], ['21-30', 0], ['31-40', 0], ['41-50', 0], ['51-60', 0]],
                { class: 'levels' },
                true,
            ),
            create_table(
                'left',
                [
                    ['SRS'],
                    ['Before / After'],
                    ['App', 0, 0],
                    ['Gur', 0, 0],
                    ['Mas', 0, 0],
                    ['Enl', 0, 0],
                    ['Bur', 0, 0],
                ],
                {
                    class: 'srs hover-wrapper-target',
                    child: create_elem({
                        type: 'div',
                        class: 'hover-wrapper below',
                        child: create_elem({ type: 'table' }),
                    }),
                },
            ),
            create_table('left', [['Type'], ['Rad', 0], ['Kan', 0], ['Voc', 0]], { class: 'type' }),
            create_table('left', [['Summary'], ['Pass', 0], ['Fail', 0], ['Acc', 0]], { class: 'summary' }),
            create_table('left', [['Answers'], ['Right', 0], ['Wrong', 0], ['Acc', 0]], {
                class: 'answers hover-wrapper-target',
                child: create_elem({
                    type: 'div',
                    class: 'hover-wrapper above',
                    child: 'The total number of correct and incorrect answers',
                }),
            }),
        )
        return popper
    }

    // Creates a new minimap for the popper
    function create_minimap(type, data) {
        let settings = wkof.settings[script_id]
        let multiplier = 2
        return new Heatmap(
            {
                type: 'day',
                id: 'hours-map',
                first_date: Date.parse(new Date(data[0][0] - settings.general.day_start * msh).toDateString()),
                last_date: Date.parse(new Date(data[0][0] + msd - settings.general.day_start * msh).toDateString()),
                day_start: settings.general.day_start,
                day_hover_callback: (date, day_data) => {
                    let type2 = type
                    if (type2 === 'reviews' && Date.parse(date.join('-')) > Date.now() && day_data.counts.forecast)
                        type2 = 'forecast'
                    let string = [
                        `${(day_data.counts[type2] || 0).toLocaleString()} ${
                            type2 === 'forecast'
                                ? 'reviews upcoming'
                                : day_data.counts[type2] === 1
                                ? type2.slice(0, -1)
                                : type2
                        } at ${date[3]}:00`,
                    ]
                    if (type2 !== 'lessons' && day_data.counts[type2 + '-srs' + (type2 === 'reviews' ? '2-9' : '1-8')])
                        string += '\nBurns ' + day_data.counts[type2 + '-srs' + (type2 === 'reviews' ? '2-9' : '1-8')]
                    return string
                },
                color_callback: (date, day_data) => color_picker(type, date, day_data, 2),
            },
            data,
        )
    }

    /*-------------------------------------------------------------------------------------------------------------------------------*/

    // Automatically determines what the user's interval bounds should be using quantiles
    function auto_range(stats, forecast_items) {
        let settings = wkof.settings[script_id]
        // Forecast needs to have some calculations done
        let forecast_days = {}
        for (let [date] of Object.values(forecast_items)) {
            let string = new Date(date).toDateString()
            if (!forecast_days[string]) forecast_days[string] = 1
            else forecast_days[string]++
        }
        let forecast_mean = forecast_items.length / Object.keys(forecast_days).length
        let forecast_sd =
            Math.sqrt(
                (1 / (forecast_items.length / forecast_mean)) *
                    Object.values(forecast_days)
                        .map((x) => Math.pow(x - forecast_mean, 2))
                        .reduce((a, b) => a + b, 0),
            ) || 1
        // Get intervals
        let range = (length, gradient, mean, sd) => [
            1,
            ...Array((length < 2 ? 2 : length) - 2)
                .fill(null)
                .map(
                    (_, i) =>
                        Math.round(ifcdf(((gradient ? 0.9 : 1) * (i + 1)) / (length - (gradient ? 1 : 0)), mean, sd)) ||
                        1,
                ),
        ]
        let reviews = range(
            settings.reviews.colors.length,
            settings.reviews.gradient,
            stats.reviews.average[1],
            stats.reviews.average[2],
        )
        let lessons = range(
            settings.lessons.colors.length,
            settings.lessons.gradient,
            stats.lessons.average[1],
            stats.lessons.average[2],
        )
        let forecast = range(settings.forecast.colors.length, settings.forecast.gradient, forecast_mean, forecast_sd)
        if (settings.reviews.auto_range)
            for (let i = 1; i < settings.reviews.colors.length; i++) settings.reviews.colors[i][0] = reviews[i - 1]
        if (settings.lessons.auto_range)
            for (let i = 1; i < settings.lessons.colors.length; i++) settings.lessons.colors[i][0] = lessons[i - 1]
        if (settings.forecast.auto_range)
            for (let i = 1; i < settings.forecast.colors.length; i++) settings.forecast.colors[i][0] = forecast[i - 1]
        wkof.Settings.save(script_id)
    }

    // Picks colors for the heatmap days
    function color_picker(type, date, day_data, multiplier = 1) {
        let settings = wkof.settings[script_id]
        let type2 = type
        if (
            type2 === 'reviews' &&
            new Date(date[0], date[1] - 1, date[2], 0, 0).getTime() > Date.now() - msh * settings.general.day_start &&
            day_data.counts.forecast
        )
            type2 = 'forecast'
        let colors = settings[type2].colors
        // If gradients are not enabled, use intervals
        if (!settings[type2].gradient) {
            for (let [bound, color] of colors.slice().reverse()) {
                if (day_data.counts[type2] * multiplier >= bound) {
                    return color
                }
            }
            return colors[0][1]
            // If gradients are enabled, interpolate colors
        } else {
            // Multiplier is used for minimap to get better ranges
            if (!day_data.counts[type2] * multiplier) return colors[0][1]
            if (day_data.counts[type2] * multiplier >= colors[colors.length - 1][0]) return colors[colors.length - 1][1]
            for (let i = 2; i < colors.length; i++) {
                if (day_data.counts[type2] * multiplier <= colors[i][0]) {
                    let percentage =
                        (day_data.counts[type2] * multiplier - colors[i - 1][0]) / (colors[i][0] - colors[i - 1][0])
                    return interpolate_color(colors[i - 1][1], colors[i][1], percentage)
                }
            }
        }
    }

    // Toggles between lessons and reviews
    function toggle_visible_map() {
        let heatmap = document.getElementById('heatmap')
        heatmap.classList.toggle('reviews')
        wkof.settings[script_id].other.visible_map = heatmap.classList.contains('reviews') ? 'reviews' : 'lessons'
        wkof.Settings.save(script_id)
    }

    // Toggles the visibility of the years
    function toggle_year(event) {
        let visible_years = wkof.settings[script_id].other.visible_years
        let year_elem = event.target.closest('.year')
        let up = event.target.closest('.toggle-year').classList.contains('up')
        let year = Number(year_elem.getAttribute('data-year'))
        let future = year > new Date().getFullYear()
        let type = year_elem.classList.contains('reviews') ? 'reviews' : 'lessons'
        if (up || (!up && future)) {
            if (year == new Date().getFullYear()) {
                visible_years[type][year + 1] = true
                year_elem.nextElementSibling.classList.remove('hidden')
                year_elem.parentElement.classList.add('visible-future')
            } else {
                visible_years[type][year] = false
                year_elem.classList.add('hidden')
                if (!up && future) year_elem.parentElement.classList.remove('visible-future')
            }
        } else {
            visible_years[type][year - 1] = true
            year_elem.previousElementSibling.classList.remove('hidden')
        }
        // Make sure at least one year is visible
        if (!Object.values(visible_years[type]).find((a) => a == true)) {
            visible_years[type][year] = true
        }
        wkof.Settings.save(script_id)
    }

    // Updates the popper with new info
    async function update_popper(event, type, title, info, minimap_data, burns, time) {
        let items_id = await wkof.ItemData.get_index(await wkof.ItemData.get_items('include_hidden'), 'subject_id')
        let popper = document.getElementById('popper')
        // Get info
        let levels = new Array(61).fill(0)
        levels[0] = new Array(6).fill(0)
        let item_types = { rad: 0, kan: 0, voc: 0 }
        for (let id of info.lists[type + '-ids']) {
            let item = items_id[id]
            if (!item) continue
            levels[0][Math.floor((item.data.level - 1) / 10)]++
            levels[item.data.level]++
            const type = item.object === 'kana_vocabulary' ? 'voc' : item.object.slice(0, 3)
            item_types[type]++
        }
        let srs = new Array(10).fill(null).map((_) => [0, 0])
        for (let i = 1; i < 10; i++) {
            srs[i][0] = info.counts[type + '-srs1-' + i] || 0
            srs[i][1] = info.counts[type + '-srs2-' + i] || 0
        }
        let srs_counter = (index, start, end) =>
            srs.map((a, i) => (i >= start ? (i <= end ? a[index] : 0) : 0)).reduce((a, b) => a + b, 0)
        srs[0] = [
            [srs_counter(0, 1, 4), srs_counter(1, 1, 4)],
            [srs_counter(0, 5, 6), srs_counter(1, 5, 6)],
            srs[7],
            srs[8],
            srs[9],
        ]
        let srs_diff = Object.entries(srs.slice(1)).reduce((a, b) => a + b[0] * (b[1][1] - b[1][0]), 0)
        let pass = [
            info.counts.pass,
            info.counts.reviews - info.counts.pass,
            Math.floor((info.counts.pass / info.counts.reviews) * 100),
        ]
        let answers = [
            info.counts.reviews * 2 - item_types.rad,
            info.counts.incorrect,
            Math.floor(
                ((info.counts.reviews * 2 - item_types.rad) /
                    (info.counts.incorrect + info.counts.reviews * 2 - item_types.rad)) *
                    100,
            ),
        ]
        let item_elems = []
        const ids = [...new Set(info.lists[type + '-ids'])]
        const svgs = {}
        const svgPromises = []
        for (const id of ids) {
            if (!items_id[id] || items_id[id]?.data?.characters) continue
            svgPromises.push(
                wkof
                    .load_file(
                        items_id[id].data.character_images.find(
                            (a) => a.content_type == 'image/svg+xml' && a.metadata.inline_styles,
                        ).url,
                    )
                    .then((svg) => {
                        let svgElem = document.createElement('span')
                        svgElem.innerHTML = svg.replace(/<svg /, `<svg class="radical-svg" `)
                        svgs[id] = svgElem.firstChild
                    }),
            )
        }
        await Promise.allSettled(svgPromises)
        for (let id of ids) {
            let item = items_id[id]
            if (!item) continue
            let burn = burns.includes(id)
            const type = item.object === 'kana_vocabulary' ? 'vocabulary' : item.object
            item_elems.push(
                create_elem({
                    type: 'a',
                    class: 'item ' + type + ' hover-wrapper-target' + (burn ? ' burn' : ''),
                    href: item.data.document_url,
                    children: [
                        create_elem({
                            type: 'div',
                            class: 'hover-wrapper above',
                            children: [
                                create_elem({
                                    type: 'a',
                                    class: 'characters',
                                    href: item.data.document_url,
                                    child: item.data.characters || svgs[id].cloneNode(true),
                                }),
                                create_table(
                                    'left',
                                    [
                                        ['Meanings', item.data.meanings.map((i) => i.meaning).join(', ')],
                                        [
                                            'Readings',
                                            item.data.readings
                                                ? item.data.readings.map((i) => i.reading).join('、 ')
                                                : '-',
                                        ],
                                        ['Level', item.data.level],
                                    ],
                                    { class: 'info' },
                                ),
                            ],
                        }),
                        create_elem({
                            type: 'a',
                            class: 'characters',
                            child: item.data.characters || svgs[id].cloneNode(true),
                        }),
                    ],
                }),
            )
        }
        let time_str = ms_to_hms(time)
        let count = info.lists[type + '-ids'].length
        let count_str =
            (type === 'forecast' ? 'upcoming review' : type.slice(0, type.length - 1)) + (count === 1 ? '' : 's')
        // Populate popper
        popper.className = type
        popper.querySelector('.date').innerText = title
        popper.querySelector('.count').innerText = count.toLocaleString() + ' ' + count_str
        popper.querySelector('.time').innerText = type == 'forecast' ? '' : time_str ? ' (' + time_str + ')' : ''
        popper.querySelector('.score > span').innerText = (srs_diff < 0 ? '' : '+') + srs_diff.toLocaleString()
        popper.querySelectorAll('.levels .hover-wrapper > *').forEach((e) => e.remove())
        popper.querySelectorAll('.levels > tr > td').forEach((e, i) => {
            e.innerText = levels[0][i].toLocaleString()
            e.parentElement.setAttribute('data-count', levels[0][i])
            e.parentElement.children[0].append(
                create_table(
                    'left',
                    levels
                        .slice(1)
                        .map((a, j) => [j + 1, a.toLocaleString()])
                        .filter((a) => Math.floor((a[0] - 1) / 10) == i && a[1] != 0),
                ),
            )
        })
        popper.querySelectorAll('.srs > tr > td').forEach((e, i) => {
            e.innerText = srs[0][Math.floor(i / 2)][i % 2].toLocaleString()
        })
        popper
            .querySelector('.srs .hover-wrapper table')
            .replaceWith(
                create_table('left', [
                    ['SRS'],
                    ['Before / After'],
                    ...srs
                        .slice(1)
                        .map((a, i) => [
                            ['App 1', 'App 2', 'App 3', 'App 4', 'Gur 1', 'Gur 2', 'Mas', 'Enl', 'Bur'][i],
                            ...a.map((_) => _.toLocaleString()),
                        ]),
                ]),
            )
        popper.querySelectorAll('.type td').forEach((e, i) => {
            e.innerText = item_types[['rad', 'kan', 'voc'][i]].toLocaleString()
        })
        popper.querySelectorAll('.summary td').forEach((e, i) => {
            e.innerText = (pass[i] || 0).toLocaleString()
        })
        popper.querySelectorAll('.answers td').forEach((e, i) => {
            e.innerText = (answers[i] || 0).toLocaleString()
        })
        popper.querySelector('.items').replaceWith(create_elem({ type: 'div', class: 'items', children: item_elems }))
        popper.querySelector('.minimap > .hours-map').replaceWith(create_minimap(type, minimap_data).maps.day)
        popper.style.top = event.pageY + 50 + 'px'
        popper.classList.add('popped')
        wkof.settings[script_id].other.times_popped++
        wkof.Settings.save(script_id)
    }

    /*-------------------------------------------------------------------------------------------------------------------------------*/

    // Returns the function that handles clicks on days. Wrapped for data storage
    function day_click(data) {
        function event_handler(event) {
            let settings = wkof.settings[script_id]
            let elem = event.target
            if (elem.classList.contains('day')) {
                let date = elem.getAttribute('data-date').split('-')
                date = new Date(date[0], date[1] - 1, date[2], 0, 0)
                let type = elem.closest('.view').classList.contains('reviews')
                    ? date < new Date()
                        ? 'reviews'
                        : 'forecast'
                    : 'lessons'
                if (Object.keys(elem.info.lists).length) {
                    let title = `${date.toDateString().slice(4)} ${kanji_day(date.getDay())}`
                    let today = new Date(new Date().toDateString()).getTime()
                    let offset = wkof.settings[script_id].general.day_start * msh
                    let day_data = data[type].filter(
                        (a) => a[0] >= date.getTime() + offset && a[0] < date.getTime() + msd + offset,
                    )
                    let minimap_data = cook_data(type, day_data)
                    let burns = day_data
                        .filter((item) => item[2] === 8 && item[3] + item[4] === 0)
                        .map((item) => item[1])
                    let time = minimap_data
                        .map((a, i) => a[0] - (minimap_data[i - 1] || [0])[0])
                        .filter((a) => a < settings.general.session_limit * 60 * 1000)
                        .reduce((a, b) => a + b, 0)
                    update_popper(event, type, title, elem.info, minimap_data, burns, time)
                }
            }
        }
        return event_handler
    }

    // Returns the function that handles click and drag. Wrapped for data storage
    function click_and_drag(data) {
        let down,
            first_day,
            first_date,
            marked = []
        function event_handler(event) {
            let elem = event.target
            // If event concerns a day element, proceed
            if (elem.classList.contains('day')) {
                let date = elem.getAttribute('data-date').split('-')
                date = new Date(date[0], date[1] - 1, date[2], 0, 0)
                let type = elem.closest('.view').classList.contains('reviews')
                    ? date < new Date()
                        ? 'reviews'
                        : 'forecast'
                    : 'lessons'
                // Start selection
                if (event.type === 'mousedown') {
                    event.preventDefault()
                    down = true
                    first_day = elem
                    first_date = new Date(elem.getAttribute('data-date'))
                }
                // End selection
                if (event.type === 'mouseup') {
                    if (first_day !== elem) {
                        // Gather the data then update popper
                        let second_date = new Date(elem.getAttribute('data-date'))
                        let start_date = first_date < second_date ? first_date : second_date
                        let end_date = first_date < second_date ? second_date : first_date
                        type = elem.closest('.view').classList.contains('reviews')
                            ? start_date < new Date()
                                ? 'reviews'
                                : 'forecast'
                            : 'lessons'
                        let title = `${start_date.toDateString().slice(4)} ${kanji_day(
                            start_date.getDay(),
                        )} - ${end_date.toDateString().slice(4)} ${kanji_day(end_date.getDay())}`
                        let today = new Date(new Date().toDateString()).getTime()
                        let offset = wkof.settings[script_id].general.day_start * msh
                        let day_data = data[type].filter(
                            (a) => a[0] > start_date.getTime() + offset && a[0] < end_date.getTime() + msd + offset,
                        )
                        let mapped_day_data = day_data.map((a) => [
                            today + new Date(a[0]).getHours() * msh + wkof.settings[script_id].general.day_start * msh,
                            ...a.slice(1),
                        ])
                        let minimap_data = cook_data(type, mapped_day_data)
                        let popper_info = { counts: {}, lists: {} }
                        for (let item of minimap_data) {
                            for (let [key, value] of Object.entries(item[1])) {
                                if (!popper_info.counts[key]) popper_info.counts[key] = 0
                                popper_info.counts[key] += value
                            }
                            for (let [key, value] of Object.entries(item[2])) {
                                if (!popper_info.lists[key]) popper_info.lists[key] = []
                                popper_info.lists[key].push(value)
                            }
                        }
                        let burns = day_data
                            .filter((item) => item[2] === 8 && item[3] + item[4] === 0)
                            .map((item) => item[1])
                        let time = day_data
                            .map((a, i) => Math.floor((a[0] - (day_data[i - 1] || [0])[0]) / (60 * 1000)))
                            .filter((a) => a < 10)
                            .reduce((a, b) => a + b, 0)
                        update_popper(event, type, title, popper_info, minimap_data, burns, time)
                        wkof.settings[script_id].other.times_dragged++
                    }
                }
                // Update selection
                if (event.type === 'mouseover' && down) {
                    let view = document.querySelector('#heatmap .view.' + (type === 'forecast' ? 'reviews' : type))
                    if (!view) return
                    for (let m of marked) {
                        m.classList.remove('selected')
                    }
                    marked = []
                    elem.classList.add('selected')
                    marked.push(elem)
                    let d = new Date(first_date.getTime())
                    while (d.toDateString() !== date.toDateString()) {
                        let e = view.querySelector(
                            `.day[data-date="${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}"]`,
                        )
                        e.classList.add('selected')
                        marked.push(e)
                        d.setDate(d.getDate() + (d < date ? 1 : -1))
                    }
                }
            }
            // If mouse is let go, remove selection
            if (event.type === 'mouseup') {
                down = false
                for (let m of marked) {
                    m.classList.remove('selected')
                }
                marked = []
            }
        }
        return event_handler
    }

    /*-------------------------------------------------------------------------------------------------------------------------------*/

    // Shorthand for creating new elements. Keys that do not have a special function will be added as attributes
    function create_elem(config) {
        let div = document.createElement(config.type)
        for (let [attr, value] of Object.entries(config)) {
            if (attr === 'type') continue
            else if (attr === 'child') div.append(value)
            else if (attr === 'children') div.append(...value)
            else if (attr === 'value') div.value = value
            else if (attr === 'input') div.setAttribute('type', value)
            else if (attr === 'onclick') div.onclick = value
            else if (attr === 'callback') continue
            else div.setAttribute(attr, value)
        }
        if (config.callback) config.callback(div)
        return div
    }

    // Creates a table from a matrix
    function create_table(header, data, table_attr, tr_hover) {
        let table = create_elem(Object.assign({ type: 'table' }, table_attr))
        for (let [i, row] of Object.entries(data)) {
            let tr_config = { type: 'tr' }
            if (tr_hover) {
                tr_config.class = 'hover-wrapper-target'
                tr_config.child = create_elem({ type: 'div', class: 'hover-wrapper below' })
            }
            let tr = create_elem(tr_config)
            for (let [j, cell] of Object.entries(row)) {
                let cell_type = (header == 'top' && i == 0) || (header == 'left' && j == 0) ? 'th' : 'td'
                tr.append(create_elem({ type: cell_type, child: cell }))
            }
            table.append(tr)
        }
        return table
    }

    // Returns the kanij for the day
    function kanji_day(day) {
        return ['日', '月', '火', '水', '木', '金', '土'][day]
    }
    // Converts minutes to a timestamp string "#h #m"
    function m_to_hm(minutes) {
        return Math.floor(minutes / 60) + 'h ' + Math.floor(minutes % 60) + 'm'
    }
    // Converts ms to a timestamp string "#h #m #s" where only the first two non-zero values are included
    function ms_to_hms(ms) {
        const hms = [
            [ms + 1, msh, 'h'],
            [msh, 60 * 1000, 'm'],
            [60 * 1000, 1000, 's'],
        ]
        return hms
            .map((a) => Math.floor((ms % a[0]) / a[1]) + a[2])
            .filter((a) => a[0] !== '0')
            .slice(0, 2)
            .join(' ')
    }

    // Capitalizes the first character in a string. "proper" → "Proper"
    String.prototype.toProper = function () {
        return this.slice(0, 1).toUpperCase() + this.slice(1)
    }
    // Returns a hex color between the left and right hex colors
    function interpolate_color(left, right, index) {
        if (isNaN(index)) return left
        left = hex_to_rgb(left)
        right = hex_to_rgb(right)
        let result = [0, 0, 0]
        for (let i = 0; i < 3; i++) result[i] = Math.round(left[i] + index * (right[i] - left[i]))
        return rgb_to_hex(result)
    }
    // Converts a hex color to rgb
    function hex_to_rgb(hex) {
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    }
    // Converts an rgb color to hex
    function rgb_to_hex(cols) {
        let rgb = cols[2] | (cols[1] << 8) | (cols[0] << 16)
        return '#' + (0x1000000 + rgb).toString(16).slice(1)
    }
    // Crude approximation of inverse folded cumulative distribution function
    // Used for the quantiles in auto-ranging
    function ifcdf(p, m, sd) {
        // Folded cumulative distribution function
        function fcdf(x, mean, sd) {
            // Error function
            function erf(x) {
                let sign = x >= 0 ? 1 : -1
                x = Math.abs(x)
                let a1 = 0.254829592,
                    a2 = -0.284496736
                let a3 = 1.421413741,
                    a4 = -1.453152027
                let a5 = 1.061405429,
                    p = 0.3275911
                let t = 1 / (1 + p * x)
                let y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x)
                return sign * y
            }
            return 0.5 * (erf((x + mean) / (sd * Math.sqrt(2))) + erf((x - mean) / (sd * Math.sqrt(2))))
        }
        let p2 = 0,
            items = 0,
            step = Math.ceil(sd / 10)
        while (p2 < p) {
            items += step
            p2 = fcdf(items, m, sd)
        }
        return items
    }

    // Fires a custom event on an element
    function fire_event(event_name, elem) {
        const event = document.createEvent('Event')
        event.initEvent(event_name, true, true)
        elem.dispatchEvent(event)
    }
})(window.wkof, window.review_cache, window.Heatmap, window.Icons)
