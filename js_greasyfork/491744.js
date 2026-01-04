// ==UserScript==
// @name         Show Twitter Censored Media
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Modifies the CSS classes to automatically show all censored media on Twitter / X in desktop mode and adjusts specific elements based on class, while ignoring certain popups.
// @author       Xaikyre
// @match        https://twitter.com/*
// @match        https://x.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491744/Show%20Twitter%20Censored%20Media.user.js
// @updateURL https://update.greasyfork.org/scripts/491744/Show%20Twitter%20Censored%20Media.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to check if specific popup is open
    function isPopupOpen() {
        return !!document.querySelector('.css-175oi2r.r-sdzlij.r-1phboty.r-rs99b7.r-lrvibr.r-136ojw6.r-2yi16.r-1qi8awa.r-1loqt21.r-o7ynqc.r-6416eg.r-1ny4l3l');
    }

    // Function to modify classes of children for specific parent divs
    function modifyChildClasses() {
        if (isPopupOpen()) return; // Skip modifications if popup is open
        const parentDivs = document.querySelectorAll('.css-175oi2r.r-18u37iz.r-9aw3ui.r-4amgru.r-14gqq1x');
        parentDivs.forEach(parentDiv => {
            const children = parentDiv.querySelectorAll('.css-175oi2r.r-1udh08x, .css-175oi2r.r-yfv4eo');
            children.forEach(child => {
                child.className = 'css-175oi2r r-1adg3ll r-1ny4l3l';
            });
        });
    }

    // Function to remove specific divs by a complex class string
    function removeSpecificDivs() {
        if (isPopupOpen()) return; // Skip removal if popup is open
        const elements = document.querySelectorAll('.css-175oi2r.r-1awozwy.r-1p0dtai.r-zchlnj.r-1cmwbt1.r-1777fci.r-edyy15.r-u8s1d.r-1d2f490.r-ipm5af');
        elements.forEach(element => element.remove());
    }

    // Additional modifications based on new requirements
    function additionalModifications() {
        if (isPopupOpen()) return; // Skip modifications if popup is open
        const targetParentDivs = document.querySelectorAll('.css-175oi2r');
        targetParentDivs.forEach(parentDiv => {
            // Modify specific child div classes
            const modifiableDivs = parentDiv.querySelectorAll('.css-175oi2r.r-l3hqri.r-1udh08x.r-1867qdf.r-16y2uox, .css-175oi2r.r-yfv4eo.r-16y2uox');
            modifiableDivs.forEach(div => {
                if (div.classList.contains('r-l3hqri')) {
                    div.className = 'css-175oi2r r-1867qdf r-16y2uox';
                } else if (div.classList.contains('r-yfv4eo')) {
                    div.className = 'css-175oi2r r-16y2uox';
                }
            });
            // Remove specific div
            const removableDivs = parentDiv.querySelectorAll('.css-175oi2r.r-drfeu3.r-1p0dtai.r-eqz5dr.r-16y2uox.r-1777fci.r-1d2f490.r-ymttw5.r-1f1sjgu.r-u8s1d.r-zchlnj.r-ipm5af.r-1867qdf');
            removableDivs.forEach(div => div.remove());
        });
    }

    // MutationObserver for dynamic content handling
    const observer = new MutationObserver(mutations => {
        mutations.forEach(() => {
            if (!isPopupOpen()) { // Only run modifications if the popup is not open
                modifyChildClasses();
                removeSpecificDivs();
                additionalModifications();
            }
        });
    });

    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);

    // Initial call to functions
    modifyChildClasses();
    removeSpecificDivs();
    additionalModifications();
})();
