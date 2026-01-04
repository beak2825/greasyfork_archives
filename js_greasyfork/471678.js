// ==UserScript==
// @name         Custom YouTube Theme
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Replaces YouTube Home button, background, and colors with custom content.
// @author       You
// @match        https://www.youtube.com/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471678/Custom%20YouTube%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/471678/Custom%20YouTube%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Replace YouTube Home button with a custom image URL
    const customHomeButtonURL = 'https://i.pinimg.com/originals/62/28/5a/62285a5f6ce177bb4fb752bb294bc649.gif';
    const youtubeHomeButtonSelector = 'ytd-topbar-logo-renderer a#logo[href="/"]'; // Target the Home button
    const youtubeHomeButton = document.querySelector(youtubeHomeButtonSelector);
    if (youtubeHomeButton) {
        youtubeHomeButton.style.backgroundImage = `url(${customHomeButtonURL})`;
        youtubeHomeButton.style.backgroundSize = '90px 40px'; // Stretch the image to fit 90x40
        youtubeHomeButton.style.backgroundPosition = 'right center';
        youtubeHomeButton.style.backgroundRepeat = 'no-repeat';
        youtubeHomeButton.style.width = '90px'; // Set the width to 90px
        youtubeHomeButton.style.height = '40px'; // Set the height to 40px
    }

    // Replace YouTube background with a custom image URL
    const customBackgroundURL = 'https://i.imgur.com/ACIxGyB.jpg';
    const youtubeBackgroundSelector = '#page-manager';
    const youtubeBackground = document.querySelector(youtubeBackgroundSelector);
    if (youtubeBackground) {
        youtubeBackground.style.backgroundImage = `url(${customBackgroundURL})`;
        youtubeBackground.style.backgroundSize = '100% auto';
        youtubeBackground.style.backgroundPosition = 'center';
        youtubeBackground.style.opacity = '1';
        youtubeBackground.style.animation = 'fadeIn 15s infinite alternate';
    }

    // Replace YouTube text color with custom colors
    const customTextColor = '#A8415B';
    const youtubeTextColor = `
        :root {
            --yt-text-color: ${customTextColor};
            --yt-left-area-color: #CC6666; /* Custom color for the left 1/10 area */
            --yt-sidebar-text-color: #B22C2C; /* Custom color for the sidebar text */
        }

        /* Apply custom text color to all elements */
        * {
            color: var(--yt-text-color) !important;
        }

        /* Apply custom color to elements within the left 1/10 area */
        ytd-rich-item-renderer:nth-child(-n+10) #video-title,
        ytd-rich-grid-media:nth-child(-n+10) #video-title-link,
        ytd-compact-video-renderer:nth-child(-n+10) #video-title,
        ytd-video-renderer:nth-child(-n+10) #video-title,
        ytd-grid-video-renderer:nth-child(-n+10) #video-title,
        ytd-compact-radio-renderer:nth-child(-n+10) #video-title {
            color: var(--yt-left-area-color) !important;
        }
    `;

    const style = document.createElement('style');
    style.textContent = youtubeTextColor;
    document.head.appendChild(style);

    // Apply custom font
    const customFontLink = 'https://fonts.googleapis.com/css2?family=Gantari:ital,wght@1,300&display=swap';
    const fontLinkElement = document.createElement('link');
    fontLinkElement.href = customFontLink;
    fontLinkElement.rel = 'stylesheet';
    document.head.appendChild(fontLinkElement);

    // Apply custom font family
    document.documentElement.style.fontFamily = "'Gantari', sans-serif";
})();

// Custom CSS for the sidebar text color
const sidebarTextColor = `
    #items ytd-mini-guide-entry-renderer,
    #items ytd-guide-entry-renderer,
    #items ytd-shelf-renderer ytd-expandable-item-renderer,
    #items ytd-shelf-renderer #items ytd-compact-link-renderer,
    #items ytd-grid-renderer ytd-grid-channel-renderer {
        color: var(--yt-sidebar-text-color) !important;
    }
`;

const sidebarStyle = document.createElement('style');
sidebarStyle.textContent = sidebarTextColor;
document.head.appendChild(sidebarStyle);
