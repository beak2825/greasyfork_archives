// ==UserScript==
// @name        Aeronautica.fi edit note button
// @namespace   Violentmonkey Scripts
// @match       https://book.aeronautica.fi/customer-bookings*
// @grant       none
// @version     1.0
// @author      buq2 / Matti Jukola
// @description When booking more than ~10 slots, you can't see all bookings under "My bookings" which
//              is only place with the edit button for notes. This script adds edit button under
//              "Customer bookings" page which can display all your bookings.
// @source      https://github.com/buq2/UserScripts/aeronautica.fi-add-missing-note-edit-button.user.js
// @license     MIT
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/531899/Aeronauticafi%20edit%20note%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/531899/Aeronauticafi%20edit%20note%20button.meta.js
// ==/UserScript==


/**
 * A utility function for userscripts that detects and handles AJAXed content.
 *
 * @example
 * waitForKeyElements("div.comments", (element) => {
 *   element.innerHTML = "This text inserted by waitForKeyElements().";
 * });
 *
 * waitForKeyElements(() => {
 *   const iframe = document.querySelector('iframe');
 *   if (iframe) {
 *     const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
 *     return iframeDoc.querySelectorAll("div.comments");
 *   }
 *   return null;
 * }, callbackFunc);
 *
 * @param {(string|function)} selectorOrFunction - The selector string or function.
 * @param {function}          callback           - The callback function; takes a single DOM element as parameter.
 *                                                 If returns true, element will be processed again on subsequent iterations.
 * @param {boolean}           [waitOnce=true]    - Whether to stop after the first elements are found.
 * @param {number}            [interval=300]     - The time (ms) to wait between iterations.
 * @param {number}            [maxIntervals=-1]  - The max number of intervals to run (negative number for unlimited).
 */
function waitForKeyElements(selectorOrFunction, callback, waitOnce, interval, maxIntervals) {
    if (typeof waitOnce === "undefined") {
        waitOnce = true;
    }
    if (typeof interval === "undefined") {
        interval = 300;
    }
    if (typeof maxIntervals === "undefined") {
        maxIntervals = -1;
    }
    if (typeof waitForKeyElements.namespace === "undefined") {
        waitForKeyElements.namespace = Date.now().toString();
    }
    var targetNodes = (typeof selectorOrFunction === "function")
        ? selectorOrFunction()
        : document.querySelectorAll(selectorOrFunction);

    var targetsFound = targetNodes && targetNodes.length > 0;
    if (targetsFound) {
        targetNodes.forEach(function (targetNode) {
            var attrAlreadyFound = `data-userscript-${waitForKeyElements.namespace}-alreadyFound`;
            var alreadyFound = targetNode.getAttribute(attrAlreadyFound) || false;
            if (!alreadyFound) {
                var cancelFound = callback(targetNode);
                if (cancelFound) {
                    targetsFound = false;
                }
                else {
                    targetNode.setAttribute(attrAlreadyFound, true);
                }
            }
        });
    }

    if (maxIntervals !== 0 && !(targetsFound && waitOnce)) {
        maxIntervals -= 1;
        setTimeout(function () {
            waitForKeyElements(selectorOrFunction, callback, waitOnce, interval, maxIntervals);
        }, interval);
    }
}

/**
 * Extracts the booking ID from the 'unbook' button's href attribute.
 * 
 * @param {HTMLElement} button - The 'unbook' button element.
 * @returns {string} - The booking ID extracted from the button's href.
 */
function getBookingIdFromButton(button) {
    const unbookLink = button.getAttribute('href');
    const match = /booking_id=(\d+)/.exec(unbookLink);
    return match ? match[1] : null;  // Return null if booking ID is not found.
}

/**
 * Retrieves all 'Unbook' buttons on the page.
 * 
 * @returns {HTMLElement[]} - Array of 'Unbook' button elements.
 */
function getUnbookButtons() {
    return Array.from(document.querySelectorAll('.btn')).filter(el => el.textContent.trim() === 'Unbook');
}

/**
 * Creates an "Edit Note" button next to the provided 'Unbook' button.
 * 
 * @param {HTMLElement} unbookButton - The 'Unbook' button to base the new button on.
 */
function createEditNoteButton(unbookButton) {
    const bookingId = getBookingIdFromButton(unbookButton);
    if (!bookingId) {
        console.error('Booking ID not found.');
        return;  // Prevent creating button if booking ID is missing.
    }

    const parent = unbookButton.parentElement;
    const editNoteButton = unbookButton.cloneNode(true);
    editNoteButton.setAttribute('onClick', `popupBookingNote(${bookingId})`);
    editNoteButton.removeAttribute('href'); // Prevent redirect on click.
    editNoteButton.textContent = "Note"; // Change text to "Note".
    parent.appendChild(editNoteButton); // Append the new button.
}

// Call `waitForKeyElements` to wait for the unbook buttons and create "Edit Note" buttons for them.
waitForKeyElements(getUnbookButtons, createEditNoteButton);