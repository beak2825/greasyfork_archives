// ==UserScript==
// @name         Labs Navigation Item
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Add Labs button to JPDB's navigation bar
// @author       JawGBoi
// @license      GPL-3.0
// @match        https://jpdb.io/settings
// @match        https://jpdb.io/learn
// @match        https://jpdb.io/prebuilt_decks
// @match        https://jpdb.io/changelog
// @match        https://jpdb.io/faq
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jpdb.io
// @downloadURL https://update.greasyfork.org/scripts/470408/Labs%20Navigation%20Item.user.js
// @updateURL https://update.greasyfork.org/scripts/470408/Labs%20Navigation%20Item.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Specify the nav-item you want the "Labs" button to be added after
    const navItemToInsertAfter = 'Settings'; // Can be either 'Built-in decks', 'Stats', 'Settings', or 'Logout'

    let labsNavItem = document.createElement("a");
    labsNavItem.classList.add("nav-item");
    labsNavItem.href = "/labs";
    labsNavItem.textContent = "Labs";

    let navMenu = document.querySelector(".menu");
    let specifiedNavItem = Array.from(navMenu.children)
                           .find(child => child.textContent === navItemToInsertAfter);

    if (specifiedNavItem)
    {
        navMenu.insertBefore(labsNavItem, specifiedNavItem.nextSibling);
    }
    else
    {
        navMenu.appendChild(labsNavItem);
    }
})();
