// ==UserScript==
// @name        StartPage - Move ads to the sidebar bottom
// @namespace   https://startpage.com/
// @match       *://*startpage.com/*
// @icon        https://www.startpage.com/sp/cdn/favicons/favicon-32x32-gradient.png
// @version     202408100
// @author      Lukas ThyWalls
// @license     CC0
// @description It moves ads to the sidebar, avoiding unwanted clicks on them, including the AdBlock banner. Also removes those annoying Startpage promo banner.
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/496455/StartPage%20-%20Move%20ads%20to%20the%20sidebar%20bottom.user.js
// @updateURL https://update.greasyfork.org/scripts/496455/StartPage%20-%20Move%20ads%20to%20the%20sidebar%20bottom.meta.js
// ==/UserScript==

// Run Check Function at every DOM change.
(new MutationObserver(check)).observe(document, {childList: true, subtree: true});

function check(changes, observer) {
    // If all Sidebar Block AND both Ads Block (top and bottom) are found/loaded...
    if(document.querySelector('#sidebar') &&
       (document.querySelector('#gcsa-top > iframe') && document.querySelector('#gcsa-bottom > iframe')) ||
       document.querySelector('.css-mtj8kd'))
    {
        // ... then stop checking ...
        observer.disconnect();
        // ... and move both Ads Blocks to the bottom of the sidebar.
        document.querySelector("#sidebar").appendChild(document.querySelector("#gcsa-top"));
        document.querySelector("#sidebar").appendChild(document.querySelector("#gcsa-bottom"));
        document.querySelector("#sidebar").appendChild(document.querySelector('div > .css-mtj8kd'));
    }
    // Check Sidebar Block and StartPage promo banner
    if(document.querySelector('#sidebar') &&
        document.querySelector(".serp-sidebar-app-promo-widget"))
    {
        // ... delete StartPage promo banner
        document.querySelector(".serp-sidebar-app-promo-widget").remove();
    }
    // Check bottom StartPage mobile promo banner
    if(document.querySelector('.serp-toast-container'))
    {
        // ... delete StartPage mobile promo banner
        document.querySelector('.serp-toast-container').remove();
    }
}
