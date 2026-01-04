// ==UserScript==
// @name        YouTube: remove huge ">> 10 seconds" skip indicators
// @description Removes the massive skip indicators on YouTube (">> 10 seconds")
// @version     1.1.1
// @grant       none
// @namespace   com.youtube.annoying.timeskips
// @author      https://greasyfork.org/en/users/728793-keyboard-shortcuts
// @match       https://youtube.com/*
// @match       https://*.youtube.com/*
// @icon        https://www.google.com/s2/favicons?sz=128&domain=youtube.com
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/430036/YouTube%3A%20remove%20huge%20%22%3E%3E%2010%20seconds%22%20skip%20indicators.user.js
// @updateURL https://update.greasyfork.org/scripts/430036/YouTube%3A%20remove%20huge%20%22%3E%3E%2010%20seconds%22%20skip%20indicators.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function() {
    function removeSkipIndicators() {
        const selectors = ['div.ytp-doubletap-ui', 'div.ytp-doubletap-ui-legacy']; // these are selectors for a container around the skip indicators
        selectors.map(selector => document.querySelector(selector)) // find them and for each one...
            .filter(element => element !== null) // if it was found...
            .forEach(element => element.remove()); // simply remove the element from the DOM
    }
    removeSkipIndicators(); // run once when the page loads
    setInterval(removeSkipIndicators, 1000); // and then run every second in case they're added later
})();