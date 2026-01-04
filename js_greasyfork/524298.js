// ==UserScript==
// @name         PCloud Gallery View
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hide sidebars and minimize spacing around thumbnails
// @match        https://*.pcloud.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/524298/PCloud%20Gallery%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/524298/PCloud%20Gallery%20View.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        /* Hide left menu, top bars, any other unwanted sidebars */
        .left,
        .menu,
        .pcloud-nav,
        #content-top-bar,
        #breadcrumb,
        #uploadProgressSection,
        .UploadButton__Container-sc-nky7rg-0,
        .SearchBar__Wrapper-sc-102gxux-0,
        .NotificationsBell-sc-1m7z84q-0,
        .LeftMenuContainer__MainTabsPannel-sc-17ugxf1-16 {
            display: none !important;
        }

        /* Remove any extra margin/padding from the main area */
        .main,
        #content-wrapper {
            margin: 0 !important;
            padding: 0 !important;
        }

        /*
          Zero out margin/padding on pCloud's grid cells.
          (Often has classes like .Style__GridCellWrapper-sc-hbvz67-35)
        */
        .Style__GridCellWrapper-sc-hbvz67-35 {
            margin: 0 !important;
            padding: 0 !important;
        }

        /* Remove any leftover gap in the parent flex/wrapper if you see it */
        .Style__FlexWrapper-sc-hbvz67-1 {
            gap: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
        }

        /* Also kill margin/padding inside the fileIcon wrapper */
        .fileIconWrapper,
        .fileIconWrapper .iconwrap {
            margin: 0 !important;
            padding: 0 !important;
        }

        /* Ensure images fill their cell with no extra space */
        .iconwrap img {
            display: block !important;
            width: 100% !important;
            height: auto !important;
        }
    `);

    console.log("Minimal PCloud gallery tweak active.");
})();
