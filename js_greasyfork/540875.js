// ==UserScript==
// @name         BAND Dark Mode
// @namespace    http://band.us/themeDark
// @version      1.0
// @description  Apply dark mode to BAND while keeping the green theme accents
// @match        https://www.band.us/*
// @grant        GM_addStyle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=band.us
// @license      mit
// @downloadURL https://update.greasyfork.org/scripts/540875/BAND%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/540875/BAND%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
    document.body.classList.add("themeDark");
    GM_addStyle(`
        :root .skin10 {
            /* Darker green for better contrast in dark mode */
            --themeGreenTextColor: #009f33 !important;
            --themeGreenColor: #009f33 !important;
            --themeGreenColor-rgb: 0, 159, 51 !important;
            --themeGreenColor-rgba: rgba(var(--themeGreenColor-rgb), var(--skinBgOpacity)) !important;
            /* Gradient stops also darkened */
            --themeBandGradient: linear-gradient(
                290.55deg,
                #009f33 5.3%,
                #009c80 100%
            ) !important;
        }

        :root {
            --tier1PrimaryPrimary:           #0A9F50 !important; /* darkened from #0DCB67 */
            --tier1PrimaryOnPrimaryContainer: #0A9F50 !important; /* text-on-primary-container if used */
        }
    `);
})();
