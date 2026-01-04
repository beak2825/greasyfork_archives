// ==UserScript==
// @name         Wanikani: Back to back
// @namespace    http://tampermonkey.net/
// @version      1.3.19
// @description  Makes reading and meaning appear back to back in reviews and lessons
// @author       Kumirei
// @match        https://www.wanikani.com/*
// @match        https://preview.wanikani.com/*
// @exclude      https://www.wanikani.com/subject-lessons/*
// @require      https://greasyfork.org/scripts/462049-wanikani-queue-manipulator/code/WaniKani%20Queue%20Manipulator.user.js?version=1426722
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439837/Wanikani%3A%20Back%20to%20back.user.js
// @updateURL https://update.greasyfork.org/scripts/439837/Wanikani%3A%20Back%20to%20back.meta.js
// ==/UserScript==

;(function () {
    // Globals
    const { wkof, wkQueue } = window

    // Script info
    const script_name = 'Back 2 Back'
    const script_id = 'back2back'

    // Make sure WKOF is installed
    confirm_wkof(script_name).then(start)

    // Listen for page changes
    window.addEventListener(`turbo:before-render`, start)

    // Startup
    function start() {
        wkof.include('Menu,Settings')
        wkof.ready('Menu,Settings').then(load_settings).then(install)
    }

    // Installs script functions on page
    function install() {
        install_menu()
        run()
    }

    function run() {
        const settings = wkof.settings[script_id]
        if (settings.behavior !== 'none') settings.behavior = 'always' // Map unavailable behavior modes to "always"
        if (settings.behavior === 'always') wkQueue.completeSubjectsInOrder = true
        if (settings.prioritize !== 'none') wkQueue.questionOrder = `${settings.prioritize}First`
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
            prioritize: 'none',
            behavior: 'always',
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
            on_save: run,
            content: {
                behavior: {
                    type: 'dropdown',
                    default: 'always',
                    label: 'Behavior',
                    hover_tip:
                        "Choose whether to:\n1. Keep repeating the same question until you get it right\n2. Disable any reordering, falling back to WaniKani's default behavior",
                    // hover_tip:
                    //     "Choose whether to:\n1. Keep repeating the same question until you get it right\n2. Only keep the item if you answered the first question correctly\n3. Make it so that you have to answer both questions correctly back to back\n4. Disable any reordering, falling back to WaniKani's default behavior",
                    content: {
                        always: 'Repeat until correct',
                        // correct: 'Shuffle incorrect',
                        // true: 'True Back To Back',
                        disabled: 'Disabled',
                    },
                },
                prioritize: {
                    type: 'dropdown',
                    label: 'Prioritize',
                    default: 'reading',
                    content: { none: 'None', reading: 'Reading', meaning: 'Meaning' },
                },
            },
        }
        let dialog = new wkof.Settings(config)
        dialog.open()
    }
})()
