// ==UserScript==
// @name         F-list inverted color theme with auto-detection.
// @license      MIT
// @namespace    https://www.f-list.net
// @version      2025-02-24
// @description  Depends on "light" theme being the default one in f-list. Adds two buttons to TamperMonkey menu itself to switch and auto-detect light/dark.
// @author       Me
// @match        https://www.f-list.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=f-list.net
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue

// @downloadURL https://update.greasyfork.org/scripts/527941/F-list%20inverted%20color%20theme%20with%20auto-detection.user.js
// @updateURL https://update.greasyfork.org/scripts/527941/F-list%20inverted%20color%20theme%20with%20auto-detection.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CSS overrides. Note: the colors here are the inverse of what you want.
    const cssCustomDarkOverrides = `
    /* core changes - hue is for a more pleasant shade of background-image elements. */
    html {
        filter: invert(1) hue-rotate(180deg);
    }
    /* invert images again to return them to the original color and hue */
    .inverted-img {
       filter: invert(1) hue-rotate(180deg);
    }
    /* special cases where the core changes above don't work well */
    .messages-both .message-ad {
        background-color: #ccd !important;
    }
    .ads-text-box, .ads-text-box:focus {
        background-color: #ccd !important;
    }
    `;

    // For auto-detection.
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Current dark mode state and mutation observer reference.
    let isDarkModeEnabled = false;
    let observer = null;

    // Saved dark mode states.
    const DarkModeStates = Object.freeze({
        AUTO:       "auto",
        MANUAL_ON:  "manual_on",
        MANUAL_OFF: "manual_off"
    });
    let darkModeState = GM_getValue('darkModeState', DarkModeStates.MANUAL_OFF);

    // Hold the menu command IDs so we can update their labels.
    let darkModeCommandId;
    let autoDetectCommandId;

    // Insert custom CSS overrides using jQuery.
    function enableCustomOverrides() {
        if ($('#customOverridesStyle').length === 0) {
            const $styleEl = $('<style>', { id: 'customOverridesStyle', type: 'text/css' }).text(cssCustomDarkOverrides);
            $('head').append($styleEl);
        }
    }

    // Remove custom CSS overrides.
    function disableCustomOverrides() {
        $('#customOverridesStyle').remove();
    }

    // Update GM menu commands with dynamic text based on current state.
    function updateMenuCommands() {
        if (typeof GM_unregisterMenuCommand === 'function') {
            if (darkModeCommandId) { GM_unregisterMenuCommand(darkModeCommandId); }
            if (autoDetectCommandId) { GM_unregisterMenuCommand(autoDetectCommandId); }
        }
        darkModeCommandId = GM_registerMenuCommand(
            darkModeState === DarkModeStates.MANUAL_ON ? "Disable Dark Mode" : "Enable Dark Mode",
            toggleDarkMode
        );
        autoDetectCommandId = GM_registerMenuCommand(
            darkModeState === DarkModeStates.AUTO ? "Disable Auto-Detection" : "Enable Auto-Detection",
            toggleAutoDetection
        );
    }

    // Use jQuery to add the inverted class to images, picture, and video elements.
    function addInvertedClassToNode(node) {
        const $node = $(node);
        if ($node.is('img, picture, video') && !$node.hasClass('inverted-img')) {
            $node.addClass('inverted-img');
        }
        $node.find('img, picture, video').not('.inverted-img').addClass('inverted-img');
    }

    // Enable dark mode: add custom CSS and observe the DOM for new elements.
    function enableDarkMode() {
        enableCustomOverrides();

        observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        addInvertedClassToNode(node);
                    }
                });
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
        $('img, picture, video').not('.inverted-img').addClass('inverted-img');
        isDarkModeEnabled = true;
    }

    // Disable dark mode: remove custom CSS and stop DOM observation.
    function disableDarkMode() {
        disableCustomOverrides();
        if (observer) {
            observer.disconnect();
            observer = null;
        }
        $('img, picture, video').removeClass('inverted-img');
        isDarkModeEnabled = false;
    }

    // Toggle dark mode manually.
    function toggleDarkMode() {
        if (isDarkModeEnabled) {
            darkModeState = DarkModeStates.MANUAL_OFF;
            disableDarkMode();
        } else {
            darkModeState = DarkModeStates.MANUAL_ON;
            enableDarkMode();
        }
        GM_setValue('darkModeState', darkModeState);
        updateMenuCommands();
    }

    // When system dark mode preference changes.
    function handleColorSchemeChange(event) {
        console.log(`Browser changed its preference. Should we use dark mode now? ${event.matches}`);
        event.matches ? enableDarkMode() : disableDarkMode();
    }

    // Update media query listener safely.
    function updateMediaQueryListener() {
        darkModeMediaQuery.removeEventListener('change', handleColorSchemeChange);
        if (darkModeState === DarkModeStates.AUTO) {
            darkModeMediaQuery.addEventListener('change', handleColorSchemeChange);
        }
    }

    // Apply auto-detection or manual override.
    function autoDetectNow() {
        updateMediaQueryListener();
        if (darkModeState === DarkModeStates.AUTO) {
            console.log(`Autodetection active; system preference is dark? ${darkModeMediaQuery.matches}`);
            darkModeMediaQuery.matches ? enableDarkMode() : disableDarkMode();
        } else {
            const manualOn = (darkModeState === DarkModeStates.MANUAL_ON);
            console.log(`Autodetection disabled. Manual override? ${manualOn}`);
            manualOn ? enableDarkMode() : disableDarkMode();
        }
    }

    // Toggle auto-detection.
    function toggleAutoDetection() {
        darkModeState = darkModeState === DarkModeStates.AUTO ? DarkModeStates.MANUAL_OFF : DarkModeStates.AUTO;
        GM_setValue('darkModeState', darkModeState);
        autoDetectNow();
        updateMenuCommands();
    }

    // Initialize.
    autoDetectNow();
    updateMenuCommands();

})();