// ==UserScript==
// @name         Force Bing Dark Mode
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically selects dark mode in Bing settings
// @author       Henry Suen
// @match        *://*.bing.com/*
// @grant        none
// @license MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/532056/Force%20Bing%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/532056/Force%20Bing%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Save the dark mode preference in cookies and localStorage
    function saveDarkModePreference() {
        // Set cookie with dark mode preference (expires in 365 days)
        document.cookie = "_UR=QS=0&TQS=0&ThemeID=dark; path=/; domain=.bing.com; max-age=" + 60*60*24*365;

        // Also save to localStorage
        if (localStorage) {
            localStorage.setItem('_UR', '{"TQS":"0","QS":"0","ThemeID":"dark"}');
        }
    }

    // Click the dark mode radio button if it exists and isn't already selected
    function selectDarkMode() {
        // Find the dark mode radio button by its specific ID
        const darkRadio = document.querySelector('#rdiodark');

        if (darkRadio && !darkRadio.checked) {
            console.log('Bing Force Dark Mode: Found dark mode option, clicking it');
            darkRadio.click();
            return true;
        }

        // Alternative selector using the value and name attributes
        const darkRadioAlt = document.querySelector('input[type="radio"][name="da_rdio"][value="1"]');

        if (darkRadioAlt && !darkRadioAlt.checked) {
            console.log('Bing Force Dark Mode: Found dark mode option (alt method), clicking it');
            darkRadioAlt.click();
            return true;
        }

        return false;
    }

    // Attempt to find the appearance section and expand it if needed
    function findAndExpandAppearanceSection() {
        // Look for the appearance section by its class and content
        const appearanceSection = document.querySelector('div[class*="hb_section hb_top_sec hb_expanded"][aria-controls="hbradiobtn"]');

        if (!appearanceSection) {
            // If not expanded, find the appearance dropdown
            const appearanceDropdown = document.querySelector('div.hb_title_col:contains("Appearance")') ||
                                      document.querySelector('div:contains("Appearance")').closest('.hb_titlerow');

            if (appearanceDropdown) {
                const expandButton = appearanceDropdown.closest('[aria-expanded="false"]');
                if (expandButton) {
                    console.log('Bing Force Dark Mode: Expanding appearance section');
                    expandButton.click();
                    return true;
                }
            }
        } else {
            // Appearance section is already expanded
            return true;
        }

        return false;
    }

    // Main function to force dark mode
    function forceDarkMode() {
        // First save the preference
        saveDarkModePreference();

        // Try direct selection
        if (selectDarkMode()) {
            console.log('Bing Force Dark Mode: Successfully applied dark mode');
            return;
        }

        // If we couldn't find the dark mode option directly, try to open the appearance section
        if (findAndExpandAppearanceSection()) {
            // Wait for the section to expand
            setTimeout(() => {
                if (selectDarkMode()) {
                    console.log('Bing Force Dark Mode: Successfully applied dark mode after expanding section');
                }
            }, 300);
        }
    }

    // Settings menu may load dynamically, so we'll set up a MutationObserver
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                // Look for settings dropdown being added to the DOM
                const settingsElements = document.querySelectorAll('div[class*="hb_section hb_top_sec"]');
                if (settingsElements.length > 0) {
                    forceDarkMode();
                    // Once we've found and processed the settings, we can disconnect the observer
                    observer.disconnect();
                    break;
                }
            }
        }
    });

    // Start observing for the settings panel
    observer.observe(document.body, { childList: true, subtree: true });

    // Also run after the page has loaded
    window.addEventListener('load', () => {
        setTimeout(forceDarkMode, 1000);
    });

    // Run immediately too in case the page is already loaded
    saveDarkModePreference();
    setTimeout(forceDarkMode, 500);
})();