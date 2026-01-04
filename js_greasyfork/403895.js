// ==UserScript==
// @name            SteamGifts.com Giveaway Entry
// @version         1.0.4
// @author          Dillon Regimbal
// @namespace       https://dillonr.com
// @description     Easily enter all visible giveaways. Pairs well with ESGST (https://github.com/rafaelgssa/esgst)
// @match           *://www.steamgifts.com/*
// @match           *://steamgifts.com/*
// @run-at          document-idle
// @grant           GM_addStyle
// @grant           GM_xmlhttpRequest
// @icon            https://store.steampowered.com/favicon.ico
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/403895/SteamGiftscom%20Giveaway%20Entry.user.js
// @updateURL https://update.greasyfork.org/scripts/403895/SteamGiftscom%20Giveaway%20Entry.meta.js
// ==/UserScript==
// Since 2020-05-21
// https://greasyfork.org/en/scripts/403895-steamgifts-com-giveaway-entry
// https://github.com/dregimbal/UserScripts/blob/master/SteamGiveawayEntry.user.js

(function () {
    'use strict'

    // #region Config

    let giveaway_selector = 'div.giveaway__row-outer-wrap:not(.esgst-hidden) a.giveaway__heading__name'
    let no_giveaways_text = 'Find Giveaways!'
    let button_background_colour = '#4F7A26'
    let button_foreground_colour = '#FFFFFF'
    let button_font_size = '18px'

    // The delay in milliseconds between each giveaway entry
    // Setting it too low may cause SteamGifts to give you a soft-ban of a few days
    let entry_submission_delay_ms = 200

    // Whether the script should click the ESGST "Enter" buttons to enter the giveaways
    let esgst_entry_style = false

    // If the script should click the ESGST "Refresh all pages" button after entering the giveaways
    let esgst_refresh_pages_after_entry = false

    // If the script should attempt to close the ESGST modals after entering the giveaways
    let esgst_close_modals_after_entry = false

    let esgst_submit_button_selector = '.esgst-elgb-button .form__submit-button'
    let esgst_refresh_button_id = 'esgst-esRefreshAll'
    let esgst_modal_close_button_selector = '.esgst-popup-close'

    // #endregion

    // #region Styles

    let fira_code = window.document.createElement('link')
    fira_code.rel = 'stylesheet'
    fira_code.type = 'text/css'
    fira_code.href = 'https://cdn.jsdelivr.net/gh/tonsky/FiraCode@4/distr/fira_code.css'
    document.getElementsByTagName('HEAD')[0].appendChild(fira_code)

    GM_addStyle(`
        code { font-family: 'Fira Code', monospace; }
        @supports (font-variation-settings: normal) {
            code { font-family: 'Fira Code VF', monospace; }
        }
        @keyframes show {
            from {opacity: 0;}
            to {opacity: 1;}
        }
        @keyframes hide {
            from {opacity: 1;}
            to {opacity: 0;}
        }
        #enterAllBtn {
            background-color: ${button_background_colour};
            position: fixed;
            left: 20px;
            bottom: 20px;
            z-index: 69;
            border-radius: 2px;
            padding: 5px 10px;
            display: inline-block;
            cursor: pointer;
            text-align: center;
            visibility: hidden;
            opacity: 0;
        }
        #enterAllBtn a {
            font-family: 'Fira Code';
            text-decoration: none !important;
            cursor: pointer;
            color: ${button_foreground_colour} !important;
            font-size: ${button_font_size};
            font-weight: 400;
        }
        #enterAllBtn.visible {
            visibility: visible !important;
            animation-name: show;
            animation-delay: 1s;
            animation-duration: 2s;
            animation-iteration-count: 1;
            animation-timing-function: ease-in-out;
            animation-fill-mode: forwards;
        }
        `)

    // #endregion

    // #region Global variables

    // ESGST "Enter" buttons
    let esgst_Giveaways = []

    // Giveaway IDS to enter
    let giveawayIDs = []

    // Points that can be used to enter giveaways
    // Updates when a request to SteamGifts is made
    let entryPoints = 400

    // #endregion

    function enterGiveaway() {
        if (giveawayIDs.length > 0) {
            GM_xmlhttpRequest(
                {
                    method: 'POST',
                    url: 'https://www.steamgifts.com/ajax.php',
                    data: `xsrf_token=${document.getElementsByName('xsrf_token')[0].value}&do=entry_insert&code=${giveawayIDs.pop()}`,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    onload: function (response) {
                        let e = JSON.parse(response.responseText)
                        if (typeof e.points !== 'undefined') {
                            entryPoints = e.points
                        }
                        if (e.type === 'success') {
                            enterBtnA.textContent = `Entry Count: ${e.entry_count}, Points: ${e.points}`
                        } else {
                            console.warn(e)
                        }

                        if (giveawayIDs.length <= 0) {
                            // All giveaways entered
                            enterBtnA.textContent = no_giveaways_text
                            finishedEnteringGiveaways()
                        } else if (entryPoints <= 0) {
                            // No more points
                            enterBtnA.textContent = `You have ${entryPoints} points`
                            finishedEnteringGiveaways()
                        } else {
                            // Continue entering giveaways
                            setTimeout(enterGiveaway, entry_submission_delay_ms)
                        }
                    }
                })
        } else {
            console.warn('Trying to enter a giveaway, but there are none to enter')
        }
    }

    function finishedEnteringGiveaways() {
        if (esgst_refresh_pages_after_entry) {
            document.getElementById(esgst_refresh_button_id).click()
        }
        if (esgst_close_modals_after_entry) {
            setTimeout(esgst_ClearModal, 300)
        }
    }

    function esgst_FindGiveaways() {
        esgst_Giveaways = []
        document.querySelectorAll(esgst_submit_button_selector)
            .forEach(giveaway => {
                esgst_Giveaways.push(giveaway)
            })

        enterBtnA.textContent = `Enter ${esgst_Giveaways.length} Giveaways!`
    }

    function esgst_SubmitGiveaway() {
        if (esgst_Giveaways.length > 0) {
            enterBtnA.textContent = `${esgst_Giveaways.length} Giveaways Remaining!`
            let giveaway = esgst_Giveaways.pop()
            giveaway.click()
            // Continue entering giveaways
            setTimeout(esgst_SubmitGiveaway, entry_submission_delay_ms)
        } else {
            enterBtnA.textContent = no_giveaways_text
            finishedEnteringGiveaways()
        }
    }

    function esgst_ClearModal() {
        document.querySelectorAll(esgst_modal_close_button_selector)
            .forEach(closeButton => {
                closeButton.click()
            })
    }

    function submitGiveaways() {
        divButton.removeEventListener('click', submitGiveaways)
        divButton.addEventListener('click', findGiveaways)
        if (esgst_entry_style) {
            enterBtnA.textContent = `Entering ${esgst_Giveaways.length} Giveaways!`
            esgst_SubmitGiveaway()
        } else {
            enterBtnA.textContent = `Entering ${giveawayIDs.length} Giveaways!`
            enterGiveaway()
        }
    }

    function findGiveaways() {
        if (esgst_entry_style) {
            esgst_FindGiveaways()
        } else {
            giveawayIDs = []
            document.querySelectorAll(giveaway_selector)
                .forEach(giveaway => {
                    let id = giveaway.href.replace('https://www.steamgifts.com', '').replace('/giveaway/', '').split('/')[0]
                    if (!giveawayIDs.includes(id)) {
                        giveawayIDs.push(id)
                    }
                })

            enterBtnA.textContent = `Enter ${giveawayIDs.length} Giveaways!`
        }
        divButton.removeEventListener('click', findGiveaways)
        divButton.addEventListener('click', submitGiveaways)
    }

    let divButton = document.createElement('div')
    divButton.id = 'enterAllBtn'

    let enterBtnA = document.createElement('a')
    enterBtnA.setAttribute('onclick', 'return false;')
    enterBtnA.textContent = no_giveaways_text

    divButton.appendChild(enterBtnA)
    document.body.appendChild(divButton)
    divButton.addEventListener('click', findGiveaways)
    setTimeout(() => {
        divButton.classList.add('visible')
    }, 3000)
}())
