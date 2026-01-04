// ==UserScript==
// @author         @shitchell
// @namespace      https://github.com/shitchell
// @license        wtfpl
// @name           adblockblockblock
// @version        0.0.5
// @description    Remove anti-adblock
// @match          *://*/*
// @exclude-match  *://*.google.com/*
// @exclude-match  *://*.youtube.com/*
// @grant          none
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/461150/adblockblockblock.user.js
// @updateURL https://update.greasyfork.org/scripts/461150/adblockblockblock.meta.js
// ==/UserScript==

// This script is under active development. I will update this with more class names
// used by modals I come across used to block the page. Warning: this script MIGHT
// break some pages. It basically searches for any elements which contain a certain
// string in their class names and then follows their parent tree up to see if that
// matching element or any of its parents have a z-index > 50. I might increase that
// z-index if 50 is too low and accidentally removes intentional, desired elements,
// and I might have to implement more sophisticated logic than the above if it ends
// up destroying many elements we'd rather keep. Please drop a comment with the link
// to any page this breaks (although hopefully that number is tiny to nil)!

var DEBUG = false;
var VERIFIED_ELEMENTS = [];
var TRIGGER_ZINDEX = 5000;
var REMOVED_ELEMENTS = 0;

function debug(...message) {
    if (DEBUG) {
        let timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        let prefix = `[adblockblockblock] ${timestamp} --`;
        console.log(prefix, ...message);
    }
}

function removeAdblockblock() {
    'use strict';
    debug("Running...");

    //
    /// Search for the following common classes used by modals that block the page
    ////
    let pageBlockerClasses = [
        'overlay' // this definitely needs to be updated with more classes........
    ];
    let pageBlockerStyles = [
        'z-index'
    ]
    debug("Searching for page blockers...", pageBlockerClasses, pageBlockerStyles);
    let blockerCandidateElements = [];
    for (const pageBlockerClass of pageBlockerClasses) {
        // Find all elements which contain the class name
        let candidateElementsContainingClass = document.querySelectorAll(`[class*="${pageBlockerClass}"]`);
        candidateElementsContainingClass.forEach(pageBlockerElement => {
            // Add the element to the list of page blocker elements
            blockerCandidateElements.push(pageBlockerElement);
        });
    }
    for (const pageBlockerStyle of pageBlockerStyles) {
        // Find all elements which contain the style
        let candidateElementsContainingStyle = document.querySelectorAll(`[style*="${pageBlockerStyle}"]`);
        candidateElementsContainingStyle.forEach(pageBlockerElement => {
            // Add the element to the list of page blocker elements
            blockerCandidateElements.push(pageBlockerElement);
        });
    }
    debug("Found candidate blockers", blockerCandidateElements);
    for (let blockerCandidateElement of blockerCandidateElements) {
        debug(`Checking element "${blockerCandidateElement.tagName}" with class "${blockerCandidateElement.className}"`, blockerCandidateElement);

        // Store the original element so that we can cache/skip it if we've already verified it
        const originalBlockerCandidateElement = blockerCandidateElement;
        let blockerCandidateVerified = true;

        // Check if we've already verified this element
        if (VERIFIED_ELEMENTS.includes(originalBlockerCandidateElement)) {
            debug(`Element "${blockerCandidateElement.tagName}" with class "${blockerCandidateElement.className}" has already been verified`, blockerCandidateElement);
            continue;
        }

        // Check the z-index and position of the element and its parents
        while (blockerCandidateElement) {
            if (
                blockerCandidateElement.tagName === 'BODY'
                || blockerCandidateElement.tagName === 'HTML') {
                // If we get to the top, the element is not blocking the page
                break;
            }

            // Check the z-index and position
            let computedStyle = window.getComputedStyle(blockerCandidateElement);
            let position = computedStyle.getPropertyValue('position');
            let zIndex = computedStyle.getPropertyValue('z-index');
            if (
                (position === 'fixed' || position === 'absolute' || position === 'sticky')
                && zIndex !== 'auto' && zIndex > TRIGGER_ZINDEX
            ) {
                // If the element has a position and z-index that would block the page, remove it
                debug(`Removing element "${blockerCandidateElement.tagName}" with class "${blockerCandidateElement.className}" and z-index "${zIndex}"`, blockerCandidateElement);
                blockerCandidateElement.remove();
                blockerCandidateVerified = false;
                REMOVED_ELEMENTS++;
                break;
            }

            // Move on up the DOM tree
            blockerCandidateElement = blockerCandidateElement.parentElement;
        }

        // Cache the element if it was verified
        if (blockerCandidateVerified) {
            debug(`Element "${originalBlockerCandidateElement.tagName}" with class "${originalBlockerCandidateElement.className}" has been verified`, originalBlockerCandidateElement);
            VERIFIED_ELEMENTS.push(originalBlockerCandidateElement);
        }
    }

    //
    /// Double check the html, body, and content elements to ensure content is not hidden
    ////
    // only check if we removed elements to help ensure that overflow isn't
    // meant to be hidden on the page for normal functionality
    if (REMOVED_ELEMENTS > 0) {
        let overflowHiddenElements = document.querySelectorAll('html, body, #content, main, section');
        for (const overflowHiddenElement of overflowHiddenElements) {
            let computedStyle = window.getComputedStyle(overflowHiddenElement);
            let overflow = computedStyle.getPropertyValue('overflow');
            debug(`Overflow of element "${overflowHiddenElement.tagName}" with class "${overflowHiddenElement.className}" is "${overflow}"`, overflowHiddenElement);
            if (overflow.indexOf('hidden') !== -1) {
                debug("Setting overflow to 'initial !important'...", overflowHiddenElement);
                overflowHiddenElement.style.setProperty('overflow', 'initial', 'important');
            }
        }
    }

    debug("Done");
}

(function() {
    'use strict';

    // Remove the adblockblock
    removeAdblockblock();

    // Remove the adblockblock if the page changes
    let observer = new MutationObserver(removeAdblockblock);
    observer.observe(document, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style'] });
})();
