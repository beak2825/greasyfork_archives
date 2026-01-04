// ==UserScript==
// @name         SWDR attached Nav Bar
// @namespace    zordem.com
// @version      2024-08-04
// @description  Attaches the Nav element to the top and adds a spacer to the content
// @author       zordem
// @grant        none
// @match        https://rj.td2.info.pl/*
// @match        https://rjdev.td2.info.pl/*
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/502597/SWDR%20attached%20Nav%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/502597/SWDR%20attached%20Nav%20Bar.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var fixedNav = document.querySelector("nav");
    var contentWrapper = document.querySelector(".content-wrapper");

    // Function to apply styles when nav becomes visible
    function applyStyles() {
        // CSS styles to make the nav fixed at the top
        fixedNav.style.position = "fixed";
        fixedNav.style.top = "0";
        fixedNav.style.left = "0";
        fixedNav.style.width = "auto";
        fixedNav.style.right = "0";
    }

    applyStyles();

    // Function to create and insert the nav-spacer element
    function createNavSpacer() {
        var navSpacer = document.createElement('div');
        navSpacer.className = 'nav-spacer';
        navSpacer.style.height = '0'; // Initially zero height
        navSpacer.style.width = '100%';
        contentWrapper.parentNode.insertBefore(navSpacer, contentWrapper);
        return navSpacer;
    }

    // Function to update the height of the nav-spacer
    function updateNavSpacerHeight(navSpacer) {
        var navHeight = fixedNav.getBoundingClientRect().height;
        navSpacer.style.height = navHeight + 'px';
    }

    // Create and insert the nav-spacer element
    var navSpacer = createNavSpacer();

    // Create a ResizeObserver instance to observe changes in nav's size
    var resizeObserver = new ResizeObserver(function(entries) {
        for (let entry of entries) {
            if (entry.target === fixedNav) {
                updateNavSpacerHeight(navSpacer);
            }
        }
    });

    // Start observing the nav element for size changes
    resizeObserver.observe(fixedNav);

    // Apply initial height to nav-spacer
    updateNavSpacerHeight(navSpacer);
})();