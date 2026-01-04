// ==UserScript==
// @name            Library: querySelectorInterval
// @namespace       org.sidneys.userscripts
// @homepage        https://gist.githubusercontent.com/sidneys/c6b91437cb89346281bb2f739c1d6ae2/raw/
// @version         0.7.4
// @description     Use document.querySelector() to continuously look for an Element. Call a function when found. Powered by requestAnimationFrame.
// @author          sidneys
// @icon            https://i.imgur.com/nmbtzlX.png
// @match           *://*/*
// ==/UserScript==


/**
 * ESLint
 * @exports
 */
/* exported querySelectorInterval, clearQuerySelectorInterval */


/**
 * Unique identifier returned by querySelectorInterval().
 * @typedef {Number} intervalHandle
 */

/**
 * This callback is displayed as a global member.
 * @callback intervalCallback
 * @param {Element} Element found by document.querySelector()
 */

/**
 * Repeatedly try to find (using a optional time delay) the first element
 * that is a descendant of a base element, and matches the selectors.
 * Call a callback with the found element as argument when successful.
 * Returns an identifier for removal via clearQuerySelectorInterval().
 * @param {Element} element - Base Element
 * @param {String} selectors - DOMString containing one or more selectors to match against
 * @param {intervalCallback=} callback - The callback that is called when an Element was found
 * @param {Number=} delay - Duration (ms) the timer should wait between executions
 * @return {intervalHandle} - Unique interval handle
 * @global
 */
let querySelectorInterval = (element, selectors, callback = () => {}, delay = 0) => {
    // console.debug('querySelectorInterval')

    // requestAnimationFrame identifier
    let requestId

    // Initial timestamp
    let lastTimestamp = new Date().getTime()

    // Lookup Logic
    let lookup = () => {
        // Get current timestamp
        const currentTimestamp = new Date().getTime()

        // Get elapsed time (between timestamps)
        const elapsedDuration = currentTimestamp - lastTimestamp

        // Elapsed time larger than delay?
        if (elapsedDuration >= delay) {
            // Test if selectors finds a descendant beneath element
            const foundElement = element.querySelector(selectors)

            // Element found
            if (foundElement) {
                callback(foundElement)
            }

            // Update last timestamp
            lastTimestamp = new Date().getTime()
        }

        // Rerun Lookup
        requestId = window.requestAnimationFrame(lookup)
    }

    // Initial lookup
    requestId = window.requestAnimationFrame(lookup)

    return requestId
}

/**
 * Cancels intervals scheduled via querySelectorInterval().
 * @param {intervalHandle} handle - Unique interval handle
 * @global
 */
let clearQuerySelectorInterval = (handle) => {
    // console.debug('clearQuerySelectorInterval')

    // Cancel interval
    window.cancelAnimationFrame(handle)
}
