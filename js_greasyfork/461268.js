// ==UserScript==
// @name         cleanW3SchoolsAds
// @namespace    http://tampermonkey.net/
// @version      0.19
// @description  clean w3schools.com ads,there is no ads , no right side bar , no bottom guide bar, and no ads in page, just the information you need 
// @author       mooring@codernotes.club
// @match        https://*.w3schools.com/*
// @match        http://*.w3schools.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=w3schools.com
// @grant        none
// @license      MIT
// @run-at       document.body
// @downloadURL https://update.greasyfork.org/scripts/461268/cleanW3SchoolsAds.user.js
// @updateURL https://update.greasyfork.org/scripts/461268/cleanW3SchoolsAds.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let css=`
        [data-google-query-id],
        [class*="showcase"],.showcasebackend,.showcasebootcamp,.showcasesubs,
        #right,#internalCourses,#mainLeaderboard,#skyscraper,#tryitLeaderboard,
        #midcontentadcontainer,#footer,#getdiploma,.ga-featured
    {
        display:none!important;width:0!important;height:0!important;
        min-width:0!important;min-height:0!important;
        transform:scale(0.0001) translate3d(-99999px,-9999px,0px);
    }
    .w3-col.l10{width:98%!important}
    .trytopnav{top:0!important}
    #container{top:48px!important}
    `
    var style = document.createElement('style'); style.innerText = css;
    document.body.appendChild(style)
    // Your code here...
})();