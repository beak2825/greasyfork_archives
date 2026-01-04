// ==UserScript==
// @name         Un-white the Navbar
// @namespace    http://www.ancestry.com
// @version      0.1.2
// @description  Undoes more terrible decisions by Ancestry
// @author       Thadius Wynter
// @match        https://www.ancestry.com/*
// @match        https://www.ancestry.com.au/*
// @match        https://www.ancestry.co.uk/*
// @match        https://www.ancestry.ca/*
// @match        https://www.ancestry.de/*
// @match        https://www.ancestry.it/*
// @match        https://www.ancestry.fr/*
// @match        https://www.ancestry.se/*
// @match        https://www.ancestry.mx/*
// @icon64URL    https://i.imgur.com/hoNlFrW.png
// @grant        GM_addStyle
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/477302/Un-white%20the%20Navbar.user.js
// @updateURL https://update.greasyfork.org/scripts/477302/Un-white%20the%20Navbar.meta.js
// ==/UserScript==

(function() {
    'use strict';

  // This is your new navbar background color.
    GM_addStyle ( `
    #HeaderRegion {
        background-color: #000000 !important;
    }
` );

  // This is your new navbar text color.
     GM_addStyle ( `
    .navLink.navLink {
        color: #FFFFFF !important;
    }
` );

  // This is your new navbar text color.
     GM_addStyle ( `
    body {
        background-color: #C5C2C0 !important;
    }
` );

  // This is your new navbar text color.
     GM_addStyle ( `
    .bodyBkgAlt {
        background-color: #F6F3F0 !important;
    }
` );

  // This is your new navbar text color.
     GM_addStyle ( `
    .card:not([class*="bgColor"]):not(.cardEmpty) {
        background-color: #F6F3F0 !important;
    }
` );

  // This is your new navbar text color.
     GM_addStyle ( `
    #footerSitesSelect {
        background-color: #F6F3F0 !important;
    }
` );

  // This is your new navbar text color.
     GM_addStyle ( `
    #FooterRegion {
        background-color: #C5C2C0 !important;
    }
` );

  // This is your new navbar text color.
     GM_addStyle ( `
    .hintCard.con {
	    background-color: #F6F3F0;
    }
` );

  // This is your new navbar text color.
     GM_addStyle ( `
    #navNotificationsCount {
	    display: none !important;
    }
` );

  // This is your new navbar text color.
     GM_addStyle ( `
    #FooterRegion {
	    visibility: hidden !important;
    }
` );

  // This is your new navbar text color.
     GM_addStyle ( `
    .allHints .collectionTitle .hintCard {
	    background: #F6F3F0;
    }
` );

})();