// ==UserScript==
// @name        Universal Dark Mode 2 (Chrome-like)
// @match       *://*/*
// @grant       none
// @version     1.5
// @author      almahmud & gpt
// @homepageURL    https://github.com/almahmudbd/universal-dark-mode
// @description Chrome-like dark mode with adjusted colors for better readability.
// @license     GPL-2.0
// @run-at      document-start
// @namespace https://greasyfork.org/users/1238578
// @downloadURL https://update.greasyfork.org/scripts/512895/Universal%20Dark%20Mode%202%20%28Chrome-like%29.user.js
// @updateURL https://update.greasyfork.org/scripts/512895/Universal%20Dark%20Mode%202%20%28Chrome-like%29.meta.js
// ==/UserScript==

const setDarkModeCookie = (value) => {
    document.cookie = `darkMode=${value}; path=/; max-age=2592000`; // 1 month expiration
};

const getDarkModeCookie = () => {
    const match = document.cookie.match(/darkMode=([^;]+)/);
    return match ? match[1] === 'true' : false; // Default to false
};

const isDarkMode = getDarkModeCookie();

// Set a base background color to prevent flash
document.documentElement.style.backgroundColor = "#263238"; // Dark grey-blue color for background

const applyDarkModeStyles = () => {
    const elements = document.querySelectorAll("*");
    elements.forEach((element) => {
        const computedStyle = window.getComputedStyle(element);
        const backgroundColor = computedStyle.backgroundColor;

        // Apply dark background to all elements except images and videos
        if (!backgroundColor.includes("rgba") && !backgroundColor.includes("transparent")) {
            element.style.backgroundColor = "#263238";
        }

        // Change text color to white
        element.style.color = "#ffffff"; 
    });
};

// Apply dark mode immediately if cookie is set
if (isDarkMode) {
    applyDarkModeStyles();
}

// Adjust colors function
const adjustColors = () => {
    const elements = document.querySelectorAll("*");
    elements.forEach((element) => {
        const computedStyle = window.getComputedStyle(element);
        
        if (computedStyle.backgroundColor !== "rgba(0, 0, 0, 0)" && 
            computedStyle.backgroundColor !== "transparent") {
            element.style.backgroundColor = "#263238"; // Dark grey-blue for background
        }
        
        element.style.color = "#ffffff"; // White text color
    });
};

// Adjust colors when the document is ready
document.onreadystatechange = () => {
    if (isDarkMode) {
        adjustColors();
    }
};

// Observe changes in the DOM
new MutationObserver(adjustColors).observe(document.body, { subtree: true, childList: true });
