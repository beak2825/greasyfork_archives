// ==UserScript==
// @name         Zoho Assist Custom Dark Theme
// @namespace    urn:assist-espi-custom-dark-theme
// @version      1.4.1
// @description  A Userscript to style Zoho Assist dark mode to match Zoho Desk dark mode
// @author       You
// @match        https://assist.espi.net/*
// @match        https://assist.zoho.eu/*
// @homepageURL  https://github.com/jake-greygoose/Zoho-Assist-User-Script
// @supportURL   https://github.com/jake-greygoose/Zoho-Assist-User-Script/issues
// @license      MIT
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/533834/Zoho%20Assist%20Custom%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/533834/Zoho%20Assist%20Custom%20Dark%20Theme.meta.js
// ==/UserScript==




(function() {
    'use strict';

    // CSS definition includes .night-mode overrides and hides the toolbar
    const customThemeCSS = `

/* ============================================= */
/* === Overrides for .night-mode (Main Page) === */
/* ============================================= */

:root {
    --selected-color: #262626 !important;
    --shade-middlepane-color: #212121 !important; /* Use Content BG shade */
}

.night-mode {

/* --- Text Colors (Mostly Unchanged) --- */

  --text-color-default: #e2e4e7 !important;
  --text-color-v2: #ffffff !important;
  --text-color-v3: #ffffff !important;
  --text-color-v4: #e4e6e9 !important;
  --text-color-v5: #e2e4e7 !important;
  --text-color-v6: #e2e4e7 !important;
  --text-color-v7: #e4e6e9 !important;
  --text-color-v9: #000000 !important;
  --text-color-v8: #737373 !important;
  --text-color-v10: #e2e4e7 !important;
  --text-color-v11: #e2e4e7 !important;
  --text-color-red: #ff5f5f !important;
  --text-color-limit: #BCC0C7 !important;
  --text-color-green: #55AC7C !important; /* Keep Accent */
  --text-color-orange: #FF7A33 !important; /* Keep Accent */
  --place-holder-text: #e3e5e8 !important;
  --placeholder-error: #FF5F5F !important;
  --notification-text-color: #e3e5e8 !important;
  --dashboard-no-data: #e2e4e7 !important;
  --label-name: #BCC0C7 !important;
  --button-disabled-text: #DEEFFF !important; /* Keep related to primary blue */
  --secondary-button-disabled-text: #237dd4 !important; /* Keep related to primary blue */
  --chart-font-color: #e2e4e7 !important;
  --filter-title-color: #eb9c3f !important; /* Keep Accent */


  /* --- Backgrounds & Shades (Mapped + Greys) --- */

  --background-main-container: #262626 !important; /* <-- MAPPED */
  --nav-background:  #171717 !important; /* <-- MAPPED */
  --left-pane-color: #171717 !important; /* <-- MAPPED */
  --sideBar-middlePane-color: #232b38 !important; /* Use Content BG shade */
  --background-white-dark-variant: #171717 !important; /* Use Nav BG shade */
  --background-onHover-color:  #262626 !important; /* Use Source Line Grey */
  --background-onHover-color1: #262626 !important; /* Use Source Line Grey */
  --background-onHover-color2: #262626 !important; /* Use Source Line Grey */
  --background-onHover-color3: #262626 !important; /* Use Source Line Grey */
  --background-onHover-color4: #262626 !important; /* Use Source Line Grey */
  --background-hover-sideBarPane: #262626 !important; /* Use Source Line Grey */
  --email-suggestion-hover: #383f55 !important; /* Use Source Line Grey */
  --li-hover-or-selected-bg: #383f55 !important; /* Use Source Line Grey */
  --background-selected-color: #414963 !important; /* Use Lighter Source Line Grey */
  --background-selected-sideBar: #414963 !important; /* Use Lighter Source Line Grey */
  --background-selected-varient3: #2d3748 !important; /* Use Source Border Grey */
  --background-selected-varient4: #414963 !important; /* Use Lighter Source Line Grey */
  --background-selected-varient5: #99caee !important; /* Keep original light blue selection for now */
  --shade-popup-color: #2d3748 !important; /* Use Source Border Grey */
  --shade-middlepane-color: #212121 !important;
  --shade-variant1-color: #212121 !important; /* Use Content BG shade */
  --shade-variant2-color: #2d3748 !important; /* Use Source Border Grey */
  --shade-variant3-color: #383f55 !important; /* Use Source Line Grey */
  --shade-variant4-color: #383f55 !important; /* Use Source Line Grey */
  --shade-variant5-color: #414963 !important; /* Use Lighter Source Line Grey */
  --shade-variant6-color: #2d3748 !important; /* Use Source Border Grey */
  --shade-variant7-color: #414963 !important; /* Use Lighter Source Line Grey */
  --shade-table-header: #2d3748 !important; /* Use Source Border Grey */
  --shade-table-header2: #2d3748 !important; /* Use Source Border Grey */
  --shade-table-header3: #2d3748 !important; /* Use Source Border Grey */
  --background-sideBar-collapser: #212121 !important; /* Use Source Border Grey */
  --session-notification-background: #383f55 !important; /* Use Source Line Grey */
  --info-card-background: #2d3748 !important; /* Use Source Border Grey */
  --assist-box-title: #232b38 !important; /* Use Content BG shade */
  --info-box-blue: #2d3748 !important; /* Use Source Border Grey */
  --announcement-bar: linear-gradient(to right, #2d3748, #383f55) !important; /* Use Grey Gradient */
  --shortcut-key-bg: rgba(255, 255, 255, 0.4) !important; /* Keep */
  --page-nav-bg: #383f55 !important; /* Use Source Line Grey */
  --tags-bg-color: #414963 !important; /* Use Lighter Source Line Grey */
  --transparent-bg: transparent !important; /* Keep */
  --billing-getting-started: #171717 !important; /* Use Nav BG shade */
  --popup-background: #2d3748 !important; /* Use Source Border Grey */
  --keyPoints-background: #2d3748 !important; /* Use Source Border Grey */
  --disable-placeholder: #ffffff0a !important; /* Keep */
  --date-in-range: #383f55 !important; /* Use Source Line Grey */
  --shade-input-color: #2d3748 !important; /* Use Source Border Grey */
  --input-search-container: #383f55 !important; /* Use Source Line Grey */
  --drop-down-bg-color: #2d3748 !important; /* Use Source Border Grey */
  --drop-down-hover: #383f55 !important; /* Use Source Line Grey */
  --drop-down-header-bg: #383f55 !important; /* Use Source Line Grey */
  --drop-down-selected: #414963 !important; /* Use Lighter Source Line Grey */
  --shade-dropdown-varient1: #2d3748 !important; /* Use Source Border Grey */
  --shade-hover-dropdown: #383f55 !important; /* Use Source Line Grey */
  --a11y-bg: #2d3748 !important; /* Use Source Border Grey */
  --a11y-subContainer: #232b38 !important; /* Use Content BG shade */
  --a11y-keySet-bg: #232b38 !important; /* Use Content BG shade */
  --a11y-mainContianer-header: #2d3748 !important; /* Use Source Border Grey */
  --deployment-modal-background: #232b38 !important; /* Use Content BG shade */
  --filter-header: #2d3748 !important; /* Use Source Border Grey */
  --filter-selected-tags-bg: #419AF30F !important; /* Keep original blueish */
  --chart-selected-bg: #414963 !important; /* Use Lighter Source Line Grey */
  --table-row-hover: #262626 !important; /* <<<< NEW: Override for table row hover */
  --table-header-row: #212121 !important;
  --shade-hover-dropdown: #262626 !important;

  /* --- Borders (Mapped + Greys) --- */
  --border-box-variant1: #636363 !important; /* Keep original light grey */
  --border-box-dark-null-variant: none !important; /* Keep */
  --border-box-variant2: #2d3748 !important; /* <-- MAPPED */
  --border-box-variant3: none !important; /* Keep */
  --border-box-variant4: #383f55 !important; /* Use Source Line Grey */
  --border-box-variant5: #383f55 !important; /* Use Source Line Grey */
  --border-ddd-to-fade: #383f55 !important; /* Use Source Line Grey */
  --search-box-border: #383f55 !important; /* Use Source Line Grey */
  --disable-placeholder-border: #383f55 !important; /* Use Source Line Grey */
  --error-input-border: #df666d !important; /* Keep Error */
  --input-search-container-ccc-to-dark: #383f55 !important; /* Use Source Line Grey */
  --drop-down-border: #383f55 !important; /* Use Source Line Grey */
  --dropdown-border-color: #383f55 !important; /* Use Source Line Grey */
  --dropdown-border: #383f55 !important; /* Use Source Line Grey */
  --a11y-subContainer-border: #383f55 !important; /* Use Source Line Grey */
  --a11y-input-border: #383f55 !important; /* Use Source Line Grey */
  --deployment-card-border: #383f55 !important; /* Use Source Line Grey */
  --filter-selected-tags-border: #286ce5 !important; /* Keep primary blue */
  --chart-border-line: #383f55 !important; /* Use Source Line Grey */
  --chart-grid-color: #383f55 !important; /* Use Source Line Grey */

  /* --- Buttons & Interactions (Keep Primary Blues/Accents) --- */
  --primary-button: #286ce5 !important;
  --primary-button-hover: #2b72f2 !important;
  --secondary-bluebtn-hover: #286ce512 !important;
  --link-and-tertiary-button: #cecfce !important;
  --button-onhover-fill: #2b72f2 !important;
  --primary-redbutton: #CF4334 !important;
  --primary-redbutton-hover: #BA3425 !important;
  --secondary-redbtn-hover: #DF666D1A !important;
  --cancel-button: #AFAFAF !important;
  --cancel-button-hover: #AFAFAF0D !important;
  --toggle-button-enabled-bg-fill: #286ce5 !important;
  --toggle-button-disabled-bg-fill: #414963 !important; /* Use Lighter Source Line Grey */
  --toggle-inactive-bg: #414963 !important; /* Use Lighter Source Line Grey */
  --secondary-button: transparent !important;
  --button-disabled-fill: #0C458C !important; /* Keep related to primary blue */
  --close-dialog-button: #383f55 !important; /* Use Source Line Grey */
  --blue-color: #286ce5 !important;
  --deployment-text-primary: #286ce5 !important;

  /* --- Tooltips (Greys) --- */
  --tooltip-color-variant1: #e2e4e7 !important; /* Use default text color */
  --tooltip-bg: #414963 !important; /* Use Lighter Source Line Grey */

  /* --- Box Shadows (Keep Original) --- */
  --box-shadow-color: #00000033 !important;
  --box-shadow-varient1: none !important;
  --box-shadow-varient2: none !important;

  /* --- Deployment Specific (Greys) --- */
  --deployment-calender-header: #2d3748 !important; /* Use Source Border Grey */
  --deployment-link-hover: #70c1ff !important; /* Keep original light blue */
  --deployment-card-border-hover: #414963 !important; /* Use Lighter Source Line Grey */

  /* --- Chart Specific (Keep accents for clarity) --- */
  --chart-color-selected: #E3E5E8 !important; /* Keep */
  --chart-color-unselected: #5474BD !important; /* Keep original blueish for chart */

  /* --- Misc (Greys) --- */
  --search-box-onhover: #babcc1 !important; /* Keep light grey */
  --error-msg-color: #FF5F5F !important; /* Keep Error */
  --ico-color1: #da7c0e !important; /* Keep Accent */
  --calender-disabled: rgba(228, 230, 233, 0.5) !important; /* Keep */
  --arrow-green: #59AF00 !important; /* Keep Accent */
  --arrow-red: #EF7D00 !important; /* Keep Accent */
}

  /* =========================================== */
  /* === Specific Overrides === */
  /* =========================================== */

  /* Style selected sidebar item using stable attribute selector */
  #left-pane-contain a[class*="sidebar-module__selected__"] {
      background-color: #262626 !important;
      border-left: 4px solid #3d7bc3; !important;
      color: #3d7bc3 !important;
  }

#left-pane-contain a[class*="sidebar-module__selected__"] > span:first-of-type {
    opacity: 1 !important; /* Make selected icon fully opaque */
    filter: invert(51%) sepia(18%) saturate(2899%) hue-rotate(182deg) brightness(91%) contrast(86%) !important;
}

/* =========================================== */
/* === Hide #wmstoolbar (Chat Widget) === */
/* =========================================== */

#wmstoolbar {
    display: none !important;
}

*/

    `; // End of customThemeCSS template literal

    // Inject the CSS into the page
    GM_addStyle(customThemeCSS);

    console.log('Custom Dark Theme applied (Toolbar Hidden, Table Hover Fixed) with !important override.');

})();
