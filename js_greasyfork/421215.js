// ==UserScript==
// @name         Wanikani: Mnemonic Trigger Filter
// @namespace    mnemonic_trigger_filter
// @version      1.0.1
// @description  Hides mnemonics containing certain words of phrases
// @author       Kumirei
// @include      /^https://(www|preview).wanikani.com/(review/session|dashboard)?$/
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/421215/Wanikani%3A%20Mnemonic%20Trigger%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/421215/Wanikani%3A%20Mnemonic%20Trigger%20Filter.meta.js
// ==/UserScript==

;(function ($, wkof) {
    // Make sure WKOF is installed
    let script_id = 'mnemonic_trigger_filter'
    let script_name = 'Mnemonic Trigger Filter'
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

    // Wait until modules are ready then initiate script
    wkof.include('Menu,Settings')
    wkof.ready('Menu,Settings').then(load_settings).then(install_menu).then(initiate)

    // Load settings from WKOF
    function load_settings() {
        let defaults = { words: '' }
        return wkof.Settings.load(script_id, defaults)
    }

    // Installs the settings button in the menu
    function install_menu() {
        let config = {
            name: script_id,
            submenu: 'Settings',
            title: script_name,
            on_click: open_settings,
        }
        wkof.Menu.insert_script_link(config)
    }

    // Open the settings dialog
    function open_settings() {
        let config = {
            script_id: script_id,
            title: script_name,
            content: {
                words: {
                    type: 'text',
                    label: 'Words',
                    hover_tip: 'Comma separated words and/or phrases',
                    placeholder: 'Comma-separated words/phrases',
                },
            },
        }
        let dialog = new wkof.Settings(config)
        dialog.open()
    }

    function initiate() {
        if (window.location.href === 'https://www.wanikani.com/review/session') {
            const target = document.getElementById('information')
            const config = { attributes: false, childList: true, subtree: true }
            const observer = new MutationObserver(mutation_handler)
            observer.observe(target, config)
        }
    }

    function mutation_handler(mutation_list, observer) {
        for (const mutation of mutation_list) {
            if (mutation.target.id === 'item-info-col2' && mutation.addedNodes.length === 5) {
                ;[0, 2].forEach((i) => {
                    const elem = mutation.addedNodes[i].children[1]
                    const text = elem.innerText.toLowerCase()
                    for (const word of wkof.settings[script_id].words.split(',')) {
                        if (text.includes(word.trim().toLowerCase())) {
                            elem.innerText = 'Mnemonic hidden by trigger filter'
                            break
                        }
                    }
                })
            }
        }
    }
})(window.jQuery, window.wkof)
