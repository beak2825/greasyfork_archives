// ==UserScript==
// @name         Unfuck the Navbar
// @namespace    http://www.ancestry.com
// @version      0.1
// @description  Gets rid of alert (bell) and hint (leaf) counters and removes the "Hire an Expert" link
// @author       Thadius Wynter
// @match        https://www.ancestry.com/*
// @match        https://www.ancestry.com.au/family-tree/tree/*
// @match        https://www.ancestry.co.uk/family-tree/tree/*
// @match        https://www.ancestry.ca/family-tree/tree/*
// @match        https://www.ancestry.de/family-tree/tree/*
// @match        https://www.ancestry.it/family-tree/tree/*
// @match        https://www.ancestry.fr/family-tree/tree/*
// @match        https://www.ancestry.se/family-tree/tree/*
// @match        https://www.ancestry.mx/family-tree/tree/*
// @icon64URL    https://i.imgur.com/hoNlFrW.png
// @grant        GM_addStyle
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/485480/Unfuck%20the%20Navbar.user.js
// @updateURL https://update.greasyfork.org/scripts/485480/Unfuck%20the%20Navbar.meta.js
// ==/UserScript==

(
    function myfunc() {
    'use strict';

    // Don't display the alert counter
    GM_addStyle ( `
    .badge.badgePositioned.badgeColor2 {
        display: none;
    }
` );

    // Remove extra margin reserved for the alert counter
    GM_addStyle ( `
    .navLink.link.navNotifications.hasNotification {
        margin-right: unset;
    }
` );

    // Don't display the red dot on the leaf (hints) icon
    GM_addStyle ( `
    .badge.badgePositioned.lightRedDot {
        display: none;
    }
` );

    // Don't display the "Hire an Expert" link
    GM_addStyle ( `
    li#navSubscriptionOptions {
        display: none;
    }
` );

    //document.getElementbyID('navAccountUsername').innerHTML = "You";

})();