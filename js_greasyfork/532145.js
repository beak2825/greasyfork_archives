// ==UserScript==
// @name         Claude Sidebar Toggle
// @namespace    https://github.com/Maoyeedy
// @version      1.0
// @description  Toggle Claude sidebar with a keyboard shortcut
// @author       Maoyeedy
// @match        https://claude.ai/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532145/Claude%20Sidebar%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/532145/Claude%20Sidebar%20Toggle.meta.js
// ==/UserScript==

(function () {
    'use strict'

    // CUSTOMIZE YOUR SHORTCUT HERE
    const TOGGLE_SHORTCUT = {
        key: '\\',      // Default to Backslash key
        ctrlKey: true,  // Default true for Ctrl
        altKey: false,  // Default false for Alt
    }

    // Toggle sidebar function
    function toggleSidebar () {
        const pinButton = document.querySelector('button[data-testid="pin-sidebar-toggle"]')
        if (pinButton) {
            pinButton.click()
        } else {
            console.log('[Claude Sidebar Toggle] No toggle button found')
        }
    }

    // Keyboard listener
    document.addEventListener('keydown', function (event) {
        if (event.key === TOGGLE_SHORTCUT.key &&
            event.ctrlKey === TOGGLE_SHORTCUT.ctrlKey &&
            event.altKey === TOGGLE_SHORTCUT.altKey &&
            !event.repeat) {
            event.preventDefault()
            toggleSidebar()
        }
    })
})()