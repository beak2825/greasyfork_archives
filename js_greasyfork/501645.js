// ==UserScript==
// @name         Torn UI Elements (for Developers)
// @namespace    http://tampermonkey.net/
// @version      beta-0.1
// @description  Develop Torn Scripts Faster
// @author       Jayam Patel
// @match        https://www.torn.com/*
// @match        https://yata.yt/*
// @icon         https://raw.githubusercontent.com/jayam04/torn-scripts/master/tornSpotlightSearch/icon.png
// @license      Apache License 2.0
// @grant        none
// ==/UserScript==

/**
 * Adds icon to Status Icons for quick navigation.
 *
 * @param {string} href - The href of the link to be added.
 * @param {string} iconURL - The URL of the icon to be added.
 *
 * @returns {number} - 0 if successful, 1 if unsuccessful.
 */
function addIconInStatusIcons(href, iconURL) {
    const statusIconsLinks = document.querySelector('[class^="status-icons"]');
    if (statusIconsLinks.length == 0) return 1;

    const iconItem = document.createElement("li");
    const iconHref = document.createElement("a");
    iconHref.href = href;
    iconHref.ariaLabel = "Spotlight Settings";
    iconItem.appendChild(iconHref);
    iconItem.style.backgroundImage = `url("${iconURL}")`;
    iconItem.style.backgroundSize = "100%";
    statusIconsLinks.appendChild(iconItem);
    return 0;
}
