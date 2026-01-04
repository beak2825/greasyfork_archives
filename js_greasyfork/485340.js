// ==UserScript==
// @name        Kleinanzeigen - Sponsored Products remover
// @namespace   https://greasyfork.org/en/users/2755-robotoilinc
// @author      RobotOilInc
// @version     0.1.3
// @license     MIT
// @description Removes all the sponsored products/banners/suggested searches/etc from Kleinanzeigen.de
// @match       http*://www.kleinanzeigen.de/*
// @icon        https://i.imgur.com/DvzUwwS.png
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/485340/Kleinanzeigen%20-%20Sponsored%20Products%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/485340/Kleinanzeigen%20-%20Sponsored%20Products%20remover.meta.js
// ==/UserScript==

// Function to remove elements based on a selector
const removeElements = (selector) => {
    document.querySelectorAll(selector).forEach((element) => {
        element.remove();
    });
};

// Observer to watch for mutations in the DOM
new MutationObserver((mutationList, observer) => {
    // Remove skyscraper
    removeElements('[id*="-sky-atf-"]');

    // Remove "Billboard"
    removeElements('[id$="-billboard"]');

    // Remove "Gallery"
    removeElements('[id="home-gallery"]');

    // Remove "Umfrage"
    removeElements('[id="store-gallery"]');

    // Remove "Top" ads
    removeElements('.badge-topad.is-topad');

    // Remove "Unternehmensseiten"
    removeElements('[id="measure-emotions-survey"]');

    // Remove top cities
    removeElements('[id="home-topcitybx"]');

    // Remove top-banner messages
    removeElements('[id="my_messages-top-banner"]');

    // Remove all ads without a picture (useless)
    removeElements('[src="https://img.kleinanzeigen.de/api/v1/prod-static/images/placeholder/nachbarschaftshilfe?rule=$_35.JPG"]');

    // Remove pointless tag list
    removeElements('[id="srchrslt-shngls"]');

    // Remove banner on user page
    removeElements('[id="pstrads-atf-728x90"]');

    // Remove all "Pro" ads and highlighted ads
    document.querySelectorAll('.j-action.j-dont-follow-vip, li.ad-listitem.is-highlight').forEach((element) => {
        const parent = element.closest('li.ad-listitem');
        if (parent) parent.remove();
    });

    // Remove weird dividers that are now left
    document.querySelectorAll('.ad-listitem, .followuser-listitem, .savedsearch-listitem').forEach((element) => {
        element.style.border = 0;
    });
}).observe(document.documentElement, { childList: true, subtree: true });
