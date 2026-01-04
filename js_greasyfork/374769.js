// ==UserScript==
// @name            Die WELT Online | Artikelkommentare Automatisch Einblenden
// @namespace       de.sidneys.userscripts
// @homepage        https://gist.githubusercontent.com/sidneys/4392fdde27a0cf60cb12ada20c95fb81/raw/
// @version         4.0.0
// @description     Alle Antworten zu Artikeln bei WELT.DE immer einblenden (Always automatically expand all WELT.DE article comments)
// @author          sidneys
// @icon            https://www.welt.de/favicon.ico
// @noframes
// @include         https://www.welt.de/*article*
// @require         https://greasyfork.org/scripts/38888-greasemonkey-color-log/code/Greasemonkey%20%7C%20Color%20Log.js
// @require         https://greasyfork.org/scripts/375023-library-queryselectorinterval/code/Library%20%7C%20querySelectorInterval.js
// @grant           GM.addStyle
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/374769/Die%20WELT%20Online%20%7C%20Artikelkommentare%20Automatisch%20Einblenden.user.js
// @updateURL https://update.greasyfork.org/scripts/374769/Die%20WELT%20Online%20%7C%20Artikelkommentare%20Automatisch%20Einblenden.meta.js
// ==/UserScript==

/**
 * ESLint
 * @global
 */
/* global querySelectorInterval */
/* global clearQuerySelectorInterval */
Debug = false


/**
 * Minimum Delay between Lookups
 * @default
 * @constant
 */
const minimumLookupIntervalDuration = 1000


/**
 * CSS Selector for "Alle Einblenden" Button
 * @constant
 */
const cssSelector = 'div.c-content-container:nth-child(1) > div:nth-child(4) > div:nth-child(4) > div:nth-child(1) > div > div:nth-child(3) > div:nth-child(2) > a:nth-child(1)'

/**
 * Inject Stylesheet
 */
let injectStylesheet = () => {
    console.debug('injectStylesheet')

    GM.addStyle(`
        /* .busy
           ========================================================================== */

        .busy,
        .busy *
        {
            cursor: wait !important;
        }
    `)
}

/**
 * Busy mode
 * @param {Boolean} isBusy - Yes/No
 */
let setBusy = (isBusy) => {
    console.debug('setBusy')

    if (isBusy) {
        document.querySelector('html').classList.add('busy')
    } else {
        document.querySelector('html').classList.remove('busy')
    }
}

/**a
 * Look for & Trigger "Antworten Einblenden"
 */
let enableAutoLoadCommentThreads = () => {
    console.debug('enableAutoLoadCommentThreads')

    // Click "Load More" / Show entire Playlist
    querySelectorInterval(document.documentElement, cssSelector, (element) => {
        // Show Spinner
        setBusy(true)

        // Click!
        element.click()

        // Hide Spinner
        const timeout = setTimeout(() => {
            setBusy(false)
            clearTimeout(timeout)
        }, 3000)
    })
}


/**
 * Init
 */
let init = () => {
    console.info('init')

    // Add Stylesheet
    injectStylesheet()

    // Enable Auto-Loading Comments
    enableAutoLoadCommentThreads()
}


/**
 * @listens window:Event#load
 */
window.addEventListener('load', () => {
    console.debug('window#load')

    init()
})
