// This code from: https://gist.githubusercontent.com/zachhardesty7/ea61364567ce66b94edb81f922efecef/raw/c23ba499828992d632266194384c72ff28dfad6e/onElementReady.js
// ==UserScript==
// @name            Library | onElementReady ES6
// @namespace       de.sidneys.userscripts
// @homepage        https://gist.githubusercontent.com/zachhardesty7/b19c33e4b2cec8861d55df10be0ce162/raw/
// @version         0.6.0
// @description     Detect any new DOM Element by its CSS Selector, then trigger a function. Includes Promise- & Callback interface. Based on ES6 MutationObserver. Ships legacy waitForKeyElements interface, too.
// @author          sidneys
// @icon            https://i.imgur.com/nmbtzlX.png
// @include         *://*/*
// ==/UserScript==

/**
 * ESLint
 * @exports
 */
/* exported onElementReady */
/* exported waitForKeyElements */


/**
 * @private
 *
 * Query for new DOM nodes matching a specified selector.
 *
 * @param {String} selector - CSS Selector
 * @param {{ findFirst: boolean, findOnce: boolean }} options - Stop querying after first successful pass, find each el only a single time
 * @param {function=} callback - Callback
 */
let queryForElements = (selector, options = { findFirst: false, findOnce: true }, callback) => {
    // Remember already-found elements via this attribute
    const attributeName = 'was-queried'

    // Search for elements by selector
    let elementList = document.querySelectorAll(selector) || []    
    elementList.forEach((element) => {
        if (element.hasAttribute(attributeName)) { return }
        element.setAttribute(attributeName, 'true')
        callback(element)
        
        // run reset after 2 seconds
        if (!options.findOnce) {
            setTimeout(() => {
                element.removeAttribute(attributeName)
            }, 2000)
        }
    })
}

/**
 * @public
 *
 * Wait for Elements with a given CSS selector to enter the DOM.
 * Returns a Promise resolving with new Elements, and triggers a callback for every Element.
 *
 * @param {String} selector - CSS Selector
 * @param {{ findFirst: boolean, findOnce: boolean }} options - Stop querying after first successful pass, find each el only a single time
 * @param {function=} callback - Callback with Element
 * @returns {Promise<Element>} - Resolves with Element
 */
let onElementReady = (selector, options = { findFirst: false, findOnce: true }, callback = () => {}) => {
    return new Promise((resolve) => {
        // Initial Query
        queryForElements(selector, options, (element) => {
            resolve(element)
            callback(element)
        })

        // Continuous Query
        const observer = new MutationObserver(() => {
            // DOM Changes detected
            queryForElements(selector, options, (element) => {
                resolve(element)
                callback(element)
            })

            if (options.findFirst) { observer.disconnect() }
        })

        // Observe DOM Changes
        observer.observe(document.documentElement, {
            attributes: false,
            childList: true,
            subtree: true
        })
    })
}

/**
 * @public
 * @deprecated
 *
 * waitForKeyElements Polyfill
 *
 * @param {String} selector - CSS selector of elements to search / monitor ('.comment')
 * @param {function} callback - Callback executed on element detection (called with element as argument)
 * @param {{ findFirst: boolean, findOnce: boolean }} options - Stop querying after first successful pass, find each el only a single time
 * @returns {Promise<Element>} - Element
 */
let waitForKeyElements = (selector, callback, options) => onElementReady(selector, options, callback)