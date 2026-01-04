// ==UserScript==
// @name         Neopets Super Shop Wizard Buy Now!
// @namespace    neopets.com
// @version      2.0
// @description  Whenever you run a SSW search, this will automatically open the first result in a tab for you! Designed to work on beta and old pages alike. Note this script does not run on your shop page, as you are likely pricing your shop if you are using the wizard on that page, not actually intending to buy. You can change this setting by removing the @exclude line below.
// @author       darknstormy
// @exclude      http*://www.neopets.com/market.phtml?type=your*
// @match        http*://*.neopets.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/509083/Neopets%20Super%20Shop%20Wizard%20Buy%20Now%21.user.js
// @updateURL https://update.greasyfork.org/scripts/509083/Neopets%20Super%20Shop%20Wizard%20Buy%20Now%21.meta.js
// ==/UserScript==

// Hello Neopian! For best results, I recommend changing your browser setting to allow tabs
// to be loaded in the background. You can do this by entering:
// `about:config` (without the ``)
// in your toolbar of your browser. Then set browser.tabs.loadDivertedInBackground to "true".
// For Firefox, you'll also want to go to Settings -> General -> Tabs, and make sure to turn off the setting that says "When you open a link, image or media in a new tab, switch to it immediately"

const isBeta = $("[class^='nav-pet-menu-icon']").length > 0

var resultsSelector = null

if (isBeta) {
   resultsSelector = ".ssw-results-grid"
} else {
   resultsSelector = "#ssw-tabs-2 #results_table"
}

// Initialize our visibility with the current state (this will virtually always be false, but it doesn't hurt to check)
var resultsVisible = $(resultsSelector).is(":visible")

if (resultsVisible) {
    clickFirstResult(selector)
}

observeVisibilityChanges(resultsSelector, onVisibilityChange, getSelectorVisible)


function onVisibilityChange(selector, isVisible) {
    resultsVisible = isVisible

    if (isVisible) {
        clickFirstResult(selector)
    }
}

function clickFirstResult(resultsSelector) {
    $(resultsSelector).find("a:first")[0].click()
}

function getSelectorVisible() {
    return resultsVisible
}

// This is a bit of a strange way to check for new results, but basically anytime a new search is performed the results table is hidden
// until the search returns new results. So there's a moment where the results go from not visible (searching or awaiting a search to be submitted)
// to visible (results have been returned). So what I'm doing is watching for the change from not visible to visible to then click the first result.
function observeVisibilityChanges(selector, onVisibilityChange, getSelectorVisible) {
    const observer = new MutationObserver(mutations => {
        let selectorVisible = $(selector).is(":visible")
        if (selectorVisible !== getSelectorVisible()) {
            onVisibilityChange(selector, selectorVisible)
        }
    })

    observer.observe(document.body, {
        childList: true,
        subtree: true
    })
}