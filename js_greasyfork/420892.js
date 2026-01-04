// ==UserScript==
// @name         Wanikani: Review Queue Sizer
// @namespace    http://tampermonkey.net/
// @version      1.0.6
// @description  Lets you choose the size of your review session
// @author       Kumirei
// @match        https://www.wanikani.com/*
// @match        https://preview.wanikani.com/*
// @require      https://greasyfork.org/scripts/462049-wanikani-queue-manipulator/code/WaniKani%20Queue%20Manipulator.user.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420892/Wanikani%3A%20Review%20Queue%20Sizer.user.js
// @updateURL https://update.greasyfork.org/scripts/420892/Wanikani%3A%20Review%20Queue%20Sizer.meta.js
// ==/UserScript==

;(async function (wkof, $) {
    let script_name = 'Wanikani: Review Queue Sizer'
    let script_title = 'Review Queue Sizer'
    let script_id = 'review_queue_sizer'
    let settings

    confirm_wkof()
    await init()
    window.addEventListener(`turbo:render`, init)
    window.wkQueue.addFilter((queue) => {
        if (!settings?.qsize) return queue
        return queue.slice(0, settings.qsize)
    })

    function confirm_wkof() {
        // Make sure WKOF is installed
        if (!wkof) {
            let response = confirm(
                script_name +
                    ' requires WaniKani Open Framework.\n Click "OK" to be forwarded to installation instructions.',
            )
            if (response) {
                window.location.href =
                    'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549'
            }
            return
        }
    }

    async function init() {
        wkof.include('Menu,Settings,Jquery')
        await wkof.ready('Menu,Settings,Jquery')
        await load_settings()
        install_menu()
        return
    }

    // Load WKOF settings
    async function load_settings() {
        let defaults = { qsize: 0 }
        settings = await wkof.Settings.load(script_id, defaults)
        return
    }

    // Installs the options button in the menu
    function install_menu() {
        let config = {
            name: script_id,
            submenu: 'Settings',
            title: script_title,
            on_click: open_settings,
        }
        wkof.Menu.insert_script_link(config)
    }

    function open_settings() {
        var config = {
            script_id: script_id,
            title: script_title,
            on_save: settings_on_save,
            content: {
                qsize: {
                    type: 'number',
                    label: 'Queue size',
                    default: 0,
                    hover_tip: '0 means unlimited',
                },
            },
        }
        let dialog = new wkof.Settings(config)
        dialog.open()
    }

    function settings_on_save(settings) {
        window.wkQueue.refresh()
    }
})(window.wkof)
