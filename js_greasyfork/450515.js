// ==UserScript==
// @name        Jira Comment Sorter
// @description Custom sort order for comments in Jira issues.
// @author      Daniel Niccoli
// @version     1.0
// @namespace   https://github.com/danielniccoli/userscripts
// @homepageURL https://github.com/danielniccoli/userscripts
// @supportURL  https://github.com/danielniccoli/userscripts/issues
// @license     https://github.com/danielniccoli/userscripts/blob/main/LICENSE
// @match       https://jira.atlassian.com/browse/*
// @downloadURL https://update.greasyfork.org/scripts/450515/Jira%20Comment%20Sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/450515/Jira%20Comment%20Sorter.meta.js
// ==/UserScript==

/**
 * OPTIONS
 */

// Sort order. Valid values are "asc" (oldest first) or "desc" (newest first).
const order = "desc"

// If `true`, debug logs are printed to console.
const isDebug = false

/**
 * LOGIC
 */

const debug = (msg) => isDebug && console.debug(msg)

debug(`[${GM_info.script.name}] UserScript loaded.`)

/**
 * Selector for the element that needs to be clicked to change the comment sort order.
 * @type {string}
 */
const targetElementSelector = "a.issue-activity-sort-link"

/**
 * Takes an Element and locates the sort button and - if present - clicks it.
 * @param {Element} parentElement - An element under whose children the target element may be found.
 * @returns {boolean} - Returns `true` is targetElement was found and sort order was changed to user preference.
 */
function clickTargetElement(parentElement) {
    const targetElement = parentElement.querySelector(targetElementSelector)
    if (targetElement) {
        debug(`[${GM_info.script.name}] Element "${targetElementSelector}" found.`)
        if (targetElement.dataset["order"] != order) {
            debug(`[${GM_info.script.name}] Sort order already as preferred.`)
        } else {
            debug(
                `[${GM_info.script.name}] Changing sort order to preferrence: clicking "${targetElementSelector}" element.`
            )
            targetElement.click()
        }
        return true
    } else {
        return false
    }
}

/**
 * Takes a mutation list from the Mutation Observer and calls clickTargetElement for each item in the mutation list.
 * @param {MutationRecord[]} mutationList - An array of mutation records.
 * @returns {undefined}
 */
function callback(mutationList) {
    // Call `clickTargetElement()` for every mutation.
    mutationList.every((mutation) => {
        // Stop iterating if `clickTargetElement()` returns true.
        return !clickTargetElement(mutation.target)
    })
}

// Call `clickTargetElement()` once, in case it is already in the DOM and the MutationObserver will not see it.
debug(`[${GM_info.script.name}] One-time attempt to click "${targetElementSelector}" element.`)
clickTargetElement(document.body)

// Create and connect to MutationObserver
debug(`[${GM_info.script.name}] Create and connect to MutationObserver.`)
const observer = new MutationObserver(callback)
observer.observe(document.body, {
    attributes: false,
    childList: true,
    subtree: true,
})
