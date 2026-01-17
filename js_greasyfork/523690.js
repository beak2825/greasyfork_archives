// ==UserScript==
// @name         Dark Mode Auto Toggle
// @version      0.2.7
// @description  Enable eye-friendly dark mode with a toggle button and automatically based on location
// @namespace    https://greasyfork.org/en/users/28298
// @author       https://greasyfork.org/en/users/28298
// @license      MIT
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM.xmlHttpRequest
// @connect      api.zippopotam.us
// @connect      api.sunrise-sunset.org
// @homepage     https://greasyfork.org/en/scripts/523690
// @downloadURL https://update.greasyfork.org/scripts/523690/Dark%20Mode%20Auto%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/523690/Dark%20Mode%20Auto%20Toggle.meta.js
// ==/UserScript==

// @grant        none
// original author: Michael Wang https://greasyfork.org/en/scripts/472251-dark-mode/code
// with help of claude ai

(function() {
    'use strict';

    const CURRENT_ZIPCODE = '61920'; // empty or a US zipcode?

    //////////////////////////////////////////////////////////////////////////
    // manually tell domain's original mode, because auto detection would fail
    const domainModes = {
        'claude.ai'       : 'dark',
        'chat.openai.com' : 'dark',
        'deepseek.com'    : 'dark',
        'perplexity.ai'   : 'dark',
        'cloud.microsoft' : 'dark',
        'linux.do'        : 'dark',
        'duckduckgo.com'  : 'dark',
        'www.google.com'  : 'dark',
        'youtube.com'     : 'dark',
        'greasyfork.org'  : 'dark',
        'web.telegram.org': 'dark',
        '192.168.1.1'     : 'dark',
        '192.168.1.2'     : 'dark',
        '192.168.1.3'     : 'dark',
        '127.0.0.1'       : 'dark',
    };
    /////////////////////////////////////////////////////////////////////////

    // Create style element for eye-friendly dark mode (for light sites)
    const darkStyle = document.createElement('style');
    darkStyle.textContent = `
        html {
            /* Warmer, softer dark mode with reduced blue light */
            filter: invert(0.95) hue-rotate(180deg) contrast(0.85) brightness(0.95) saturate(0.9);
        }

        /* Exclude media elements so they retain original colors */
        /* We apply the same filter again to reverse the effect on these specific elements */
        img, video, picture, canvas, iframe, embed, object, svg image {
            filter: invert(1) hue-rotate(180deg) contrast(1.15) brightness(1.05) saturate(1.1) !important;
        }
    `;

    // Create style element for already-dark sites (custom filter)
    const darkSiteStyle = document.createElement('style');
    darkSiteStyle.textContent = `
        html {
            /* Adjust already-dark sites - reduce brightness and blue light */
            filter: brightness(0.85) contrast(0.95) saturate(0.85) sepia(0.15);
        }

        /* Media elements get slightly adjusted */
        img, video, picture, canvas, iframe, embed, object, svg image {
            filter: brightness(1.1) contrast(1.05) saturate(1.1) !important;
        }
    `;

    // Initialize based on page's current state
    let darkMode = false; // Start with no filter

    // Function to detect if page is already dark
    function isPageDark() {
        const url = window.location.hostname;
        // Check if domain is in our list
        for (const domain in domainModes) {
            if (url.includes(domain)) {
                return domainModes[domain] === 'dark';
            }
        }

        // auto detection
        function checkDarkModeClasses() {
            const html = document.documentElement;
            const body = document.body;

            const darkClasses = ['dark', 'dark-mode', 'dark-theme', 'theme-dark'];
            return darkClasses.some(className =>
                html.classList.contains(className) || body.classList.contains(className)
            );
        }
        function checkDarkModeAttributes() {
            const html = document.documentElement;

            return html.getAttribute('data-theme') === 'dark' ||
                html.getAttribute('data-color-mode') === 'dark';
        }

        // Check computed colors
        // Check classes and attributes
        const isDarkByClass = checkDarkModeClasses();
        const isDarkByAttribute = checkDarkModeAttributes();
        // Site is likely in dark mode if any of these are true

        return isDarkByClass || isDarkByAttribute;
    }

    // Initialize darkMode based on stored preference or page state
    const pageIsDark = isPageDark();

    // Create toggle button
    const button = document.createElement('button');
    button.innerHTML = pageIsDark ? '🌙' : '🌛';
    button.style.position = 'fixed';
    button.style.top = '45px';
    button.style.right = '10px';
    button.style.zIndex = '1000';
    button.style.background = 'none';
    button.style.border = 'none';
    button.style.fontSize = '24px';
    button.style.cursor = 'pointer';
    button.style.color = 'inherit';

    // // Function to get sunrise/sunset times
    // async function getSunTimes() {
    //     // approximate times
    //     const now = new Date();
    //     return {
    //         sunrise: new Date(now.setHours(8, 0, 0, 0)),
    //         sunset: new Date(now.setHours(18, 0, 0, 0))
    //     };
    // }

    // Function to get sunrise/sunset times based on ZIP code
    async function getSunTimes(zipCode) {
        // Try to get real sun times if ZIP code is provided
        if (zipCode) {
            try {
                // Convert ZIP code to coordinates using Zippopotam.us API
                const geoData = await new Promise((resolve, reject) => {
                    GM.xmlHttpRequest({
                        method: 'GET',
                        url: `https://api.zippopotam.us/us/${zipCode}`,
                        onload: (response) => {
                            if (response.status === 200) {
                                resolve(JSON.parse(response.responseText));
                            } else {
                                reject(new Error('Invalid ZIP code'));
                            }
                        },
                        onerror: reject
                    });
                });

                const latitude = geoData.places[0].latitude;
                const longitude = geoData.places[0].longitude;

                // Fetch sun times from API
                const sunData = await new Promise((resolve, reject) => {
                    GM.xmlHttpRequest({
                        method: 'GET',
                        url: `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&formatted=0`,
                        onload: (response) => {
                            if (response.status === 200) {
                                resolve(JSON.parse(response.responseText));
                            } else {
                                reject(new Error('Sun API failed'));
                            }
                        },
                        onerror: reject
                    });
                });

                if (sunData.status === 'OK') {
                    return {
                        sunrise: new Date(sunData.results.sunrise),
                        sunset: new Date(sunData.results.sunset)
                    };
                }
            } catch (error) {
                console.log('Could not get sun times for ZIP code, using defaults:', error.message);
            }
        } else {
            console.log('No ZIP code provided, using default times');
        }

        // Fallback: Use defaults (8 AM, 6 PM)
        const now = new Date();
        const sunrise = new Date(now);
        sunrise.setHours(8, 0, 0, 0);

        const sunset = new Date(now);
        sunset.setHours(18, 0, 0, 0);

        return { sunrise, sunset };
    }

    // Function to toggle dark mode
    function toggleDarkMode(forceDark) {
        if (forceDark !== undefined) {
            // Auto dark mode (sunrise/sunset)
            darkMode = forceDark;
        } else {
            // Manual toggle - always allow regardless of pageIsDark
            darkMode = !darkMode;
        }

        if (darkMode) {
            if (pageIsDark) {
                // Apply custom filter for already-dark sites
                document.head.appendChild(darkSiteStyle);
                button.innerHTML = '🌙';
            } else {
                // Apply invert filter for light sites
                document.head.appendChild(darkStyle);
                button.innerHTML = '☀️';
            }
        } else {
            // Remove both filters
            if (darkStyle.parentNode) {
                document.head.removeChild(darkStyle);
            }
            if (darkSiteStyle.parentNode) {
                document.head.removeChild(darkSiteStyle);
            }
            button.innerHTML = pageIsDark ? '☀️' : '🌛';
        }
    }

    // Function to check and update dark mode based on time
    async function updateDarkMode() {
        const sunTimes = await getSunTimes(CURRENT_ZIPCODE);
        const now = new Date();
        const isDark = now < sunTimes.sunrise || now > sunTimes.sunset;
        toggleDarkMode(isDark);
    }

    // Add settings button
    const settingsButton = document.createElement('button');
    settingsButton.innerHTML = '⚙';
    settingsButton.style.position = 'fixed';
    settingsButton.style.top = '40px';
    settingsButton.style.right = '15px';
    settingsButton.style.zIndex = '1000';
    settingsButton.style.background = 'none';
    settingsButton.style.border = 'none';
    settingsButton.style.fontSize = '12px';
    settingsButton.style.cursor = 'pointer';
    settingsButton.style.color = 'inherit';

    // Settings panel to reset location
    settingsButton.addEventListener('click', () => {
        if (confirm('Reset location settings?')) {
            GM_setValue('userLocation', null);
            location.reload();
        }
    });

    // Initial update
    updateDarkMode();

    // Update every half hour
    setInterval(updateDarkMode, 1800000);

    // Manual toggle still works
    button.addEventListener('click', () => toggleDarkMode());

    // Add buttons to page
    document.body.appendChild(button);
})();