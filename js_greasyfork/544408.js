// ==UserScript==
// @name         Drawaria.online Doggie Theme
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Transforms Drawaria.online with a cute Doggie aesthetic, featuring custom backgrounds, a friendly UI, and sounds.
// @author       YouTubeDrawaria & Doggie
// @match        https://drawaria.online/*
// @icon         https://drawaria.online/avatar/cache/7b2d11b0-e39b-11ec-9fd3-c3a00b129da4.jpg
// @grant        GM_addStyle
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/544408/Drawariaonline%20Doggie%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/544408/Drawariaonline%20Doggie%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Global variables to hold theme elements for easy removal ---
    let doggieStyleElement = null;
    let musicToggleButton = null; // Renamed for consistency, though music might be removed
    let chatObserver = null;
    let isThemeActive = false;
    let clickSoundHandler = null;
    let logoInterval = null; // To handle logo replacement until found
    let fontLinkElement = null; // To hold the font link element for removal

    // --- Doggie Theme Colors and Resources ---
    const doggieColors = {
        // Doggie inspired colors (Pale yellow/cream, light brown, bright red accents)
        doggieCream: 'rgb(255, 238, 193)',        // Primary pale cream for backgrounds
        doggieLightBrown: 'rgb(210, 105, 30)',    // Light brown for accents, borders
        doggieDarkBrown: 'rgb(160, 80, 20)',      // Darker brown for deeper elements
        doggieRed: 'rgb(255, 50, 50)',            // Bright red for nose/accents/highlights
        doggieBlack: 'rgb(30, 30, 30)',           // Dark text/shadows
        doggieLightGray: 'rgb(240, 240, 240)',    // Light text on dark backgrounds

        // UI Panel backgrounds
        doggiePanelBgMain: 'rgba(255, 238, 193, 0.95)',       // Main panels (leftbar, rightbar, modal content) - Cream
        doggiePanelBgSecondary: 'rgba(250, 230, 180, 0.95)',  // Selected list items, deeper nested panels - Slightly darker cream
        doggiePanelBorder: 'rgb(210, 105, 30)',             // Stronger border for panels - Light Brown
        doggiePanelBoxShadow: '0 0 8px rgba(255, 50, 50, 0.6)', // Subtle red/orange glow for panels

        // Button colors
        doggieButtonBg: 'rgb(210, 105, 30)',        // Default button background - Light Brown
        doggieButtonBgHover: 'rgb(160, 80, 20)',    // Button background on hover (darker brown)
        doggieButtonBgActive: 'rgb(120, 60, 10)',   // Button background on active/pressed (even darker brown)
        doggieButtonBorder: 'rgb(255, 50, 50)',   // Red border for buttons
        doggieButtonBoxShadow: '0 0 5px rgba(255, 50, 50, 0.5)', // Brighter red glow for buttons

        // Progress bars and highlights
        doggieProgressBar: 'rgb(255, 50, 50)',    // Bright red for progress bars
        doggieHighlight: 'rgba(255, 50, 50, 0.4)',// Red highlight for selected/drawer

        // Room List specific colors
        doggieRoomListGridBg: 'rgba(255, 238, 193, 0.9)', // Background for the entire #roomlist grid - Lighter cream
        doggieRoomItemBg: 'rgba(250, 230, 180, 0.9)',     // Background for individual .roomlist-item - Slightly darker cream
        doggieRoomItemBorder: 'rgb(210, 105, 30)',     // Border for individual .roomlist-item - Light brown

        // Background and Logo
        // backgroundTexture is removed, relying on background-color.
        logoUrl: 'https://i.ibb.co/cSjxzprg/Cool-Text-Doggie-487820721921018.png', // Doggie avatar as logo
        // backgroundMusicUrl is removed for simplicity, user can add their own
        clickSoundUrl: 'https://www.myinstants.com/media/sounds/pisseim-mund-online-audio-converter.mp3' // Example dog bark sound [2]
    };

    // --- 1. THEME ACTIVATION FUNCTION ---
    function activateTheme() {
        if (isThemeActive) return; // Prevent re-activation

        // A. Load Google Font (Electrolize kept for digital feel, can be changed)
        fontLinkElement = document.createElement('link');
        fontLinkElement.href = 'https://fonts.googleapis.com/css2?family=Electrolize&display=swap';
        fontLinkElement.rel = 'stylesheet';
        document.head.appendChild(fontLinkElement);

        // B. Inject CSS Styles
        doggieStyleElement = GM_addStyle(`
            /* Global Resets and Doggie Aesthetic Defaults */
            html, body {
                height: 100%;
                background: none !important; /* Remove any previous background */
                background-color: ${doggieColors.doggieCream} !important; /* Plain cream background [USER_SUGGESTION] */
                background-size: cover !important;
                overflow-x: hidden !important; /* Prevent horizontal scrollbar */
                overflow-y: auto !important; /* Allow vertical scrollbar only when needed */
                scrollbar-width: auto; /* Firefox */
                scrollbar-color: ${doggieColors.doggieButtonBorder} ${doggieColors.doggiePanelBgSecondary}; /* Firefox */
                image-rendering: auto; /* Allow smooth images by default */
            }
            body::before, body::after { content: none !important; }

            /* Allow scrolling on homepage */
            body:has(#main) {
                overflow: auto !important;
            }

            /* Global Text Styling for Doggie Look */
            body, #main, #leftbar, #rightbar, .loginbox, .btn, .playerlist-row, .roomlist-item,
            .chatbox_messages, .bubble, .modal-content, .form-control, .input-group-text,
            h1, h2, h3, h4, h5, h6, span, a, div:not(.pcr-current-color), td {
                color: ${doggieColors.doggieLightGray} !important; /* Default text to light gray */
                text-shadow: 0 0 3px ${doggieColors.doggieDarkBrown}; /* Subtle brown shadow */
                font-family: 'Electrolize', sans-serif !important; /* Kept font-family */
                -webkit-font-smoothing: antialiased; /* Enable anti-aliasing for smooth text */
                font-smoothing: antialiased;
                font-size: 13px !important; /* Base font size */
            }

            /* Adjust specific font sizes */
            h1 { font-size: 24px !important; }
            h2 { font-size: 20px !important; }
            h3 { font-size: 18px !important; }
            h4 { font-size: 16px !important; }
            h5 { font-size: 14px !important; }
            h6 { font-size: 13px !important; }
            .btn, button, input[type="submit"] { font-size: 14px !important; }
            .form-control, .input-group-text, select, textarea { font-size: 13px !important; }
            .playerlist-row, .roomlist-item { font-size: 13px !important; }
            .chatbox_messages .chatmessage { font-size: 13px !important; }
            .bubble { font-size: 12px !important; }
            .dropdown-menu .dropdown-item { font-size: 13px !important; }
            .playerchatmessage-selfname, .playerchatmessage-selfname ~ .playerchatmessage-text { font-size: 13px !important; }
            .systemchatmessage1, .systemchatmessage2, .systemchatmessage3, .systemchatmessage4, .systemchatmessage5,
            .systemchatmessage6, .systemchatmessage7, .systemchatmessage8, .systemchatmessage9 { font-size: 12px !important; }


            /* Specific text colors for better readability / Doggie accents */
            .roomlist-item, .roomlist-playercount, .roomlist-descr, .roomlist-mostlang,
            .dropdown-item.loginbox-alloptionslink,
            div[style*="color: gray; padding: 1em; font-size: 0.9em"], /* specific gray text div */
            .playerlist-row:not(.playerlist-name-loggedin) a:not(.playerlist-name-self a),
            .playerlist-name a, .playerlist-rank-first {
                color: ${doggieColors.doggieLightGray} !important;
                text-shadow: 0 0 3px ${doggieColors.doggieDarkBrown} !important;
            }
            .playerchatmessage-selfname, .playerchatmessage-selfname ~ .playerchatmessage-text,
            .systemchatmessage1, .systemchatmessage2, .systemchatmessage3, .systemchatmessage4, .systemchatmessage5,
            .systemchatmessage6, .systemchatmessage7, .systemchatmessage8, .systemchatmessage9 {
                color: ${doggieColors.doggieRed} !important; /* Bright red accent for self/system messages */
                text-shadow: 0 0 5px ${doggieColors.doggieRed}, 0 0 10px ${doggieColors.doggieRed}; /* Stronger glow */
                font-style: normal !important; /* Remove italic from system messages */
            }

            /* Main UI Panels and Containers - Friendly, Semi-transparent Look */
            #leftbar, #rightbar, .loginbox, .modal-dialog .modal-content,
            .topbox-content, .accountbox-coins, .playerlist-infobox-notlogged,
            #customvotingbox, .accountbox-exp-progress-bg, .accountbox-itemscontainer-slot,
            .inventorydlg-groupview, .inventorydlg-shoplist, .inventorydlg-addcoinsview,
            .musictracks-newtrackbox, .playerlist-turnscore,
            .modal-content, .card-body,
            ul.nav.nav-tabs, div.table-responsive, table.table.border, thead tr, th, tbody tr, td,
            nav.pagination-nav, ul.pagination.justify-content-center.m-0,
            div[style*="max-width: calc(4 * 300px + (4 * 300px) * (0.02 * 3));"], /* Gallery container */
            div.grid-item.galleryimage[style*="position: absolute;"] .info,
            div.commentlist,
            div[style*="padding: 2px; background: #005abb6e;"], /* Specific header div */
            h1[style*="text-align: center; color: white; margin: 0; background: #ffffff52; padding: 10px; border-radius: 3px;"], /* Specific H1 */
            div.container[style*="margin-bottom: 20px; color:#000000;"] *, /* Global container elements */
            .container > .row.justify-content-center.no-gutters:not(#friendscontainer > .row.justify-content-center.no-gutters),
            #friendscontainer .row.justify-content-center.no-gutters,
            .playerlist-drawerhighlight {
                background-color: ${doggieColors.doggiePanelBgMain} !important;
                border: 2px solid ${doggieColors.doggiePanelBorder} !important;
                box-shadow: ${doggieColors.doggiePanelBoxShadow} !important; /* Doggie red/orange glow */
                border-radius: 5px !important; /* Slightly rounded corners */
                backdrop-filter: blur(3px) !important; /* Subtle blur for futuristic feel */
            }
            /* Elements that appear 'deeper' or more contained - Secondary panel background color */
            .chatbox_messages, .Panel,
            .tab-content, .tab-content .tab-pane, .tab-content form, .tab-content .form-group,
            .logincol, .loginbutton-icon,
            div[style*="padding: 1em; background: aliceblue; border-radius: 0.3em;"], /* Another specific div */
            .List.Library, .List.Library ul, .List.Library li,
            .Canvas, .Canvas canvas,
            .Panel .List.Layers, .Panel .List.Layers ul, .Panel .List.Layers li,
            .drawcontrols-settingscontainer,
            .pcr-app, .inventorydlg-leftpanel, #dtrTranslatorContainer, #dtrDropdownPanel,
            .chatmessage:nth-child(odd), /* Odd chat messages */
            .playerlist-avatar-spawned, /* Player spawned avatar bg */
            .playerlist-exp-bar, /* Exp bar background */
            .cheat-row input[type="number"], /* Cheat inputs */
            #dtrSelectedLanguageDisplay, #dtrDropdownPanel .dtr-lang-item {
                background-color: ${doggieColors.doggiePanelBgSecondary} !important;
                border: 1px solid ${doggieColors.doggiePanelBorder} !important;
                border-radius: 5px !important;
                box-shadow: inset 0 0 5px rgba(255, 50, 50, 0.4) !important; /* Inner glow for depth */
            }

            /* Room List and Room Items (Doggie Aesthetic) */
            #roomlist {
                background-color: ${doggieColors.doggieRoomListGridBg} !important;
                border: 2px solid ${doggieColors.doggieRoomItemBorder} !important;
                border-radius: 5px !important;
                box-shadow: ${doggieColors.doggiePanelBoxShadow} !important;
            }
            .roomlist-item {
                background-color: ${doggieColors.doggieRoomItemBg} !important;
                border: 1px solid ${doggieColors.doggieRoomItemBorder} !important;
                border-radius: 5px !important;
                box-shadow: 0 0 3px rgba(255, 50, 50, 0.3) !important;
                transition: transform 0.2s ease, box-shadow 0.2s ease;
            }
            .roomlist-item:hover {
                transform: translateY(-2px);
                box-shadow: 0 0 8px rgba(255, 50, 50, 0.7) !important;
            }
            .roomlist-preview {
                background: transparent !important;
            }
            .roomlist-groupheader {
                border-bottom: 1px solid ${doggieColors.doggiePanelBorder} !important;
                color: ${doggieColors.doggieLightGray} !important;
                text-shadow: 0 0 4px ${doggieColors.doggieDarkBrown};
            }


            /* --- ALL BUTTONS (GENERAL DOGGIE STYLE) --- */
            .btn, button:not(.pcr-app button), input[type="submit"],
            li.page-item .page-link,
            ul.nav.nav-pills li.nav-item a.nav-link,
            .dropdown-menu .dropdown-item,
            .drawcontrols-popupbutton,
            .gesturespicker-item, .gesturespicker-item.gesturespicker-spawnedavataritem-sep,
            .gesturespicker-item.gesturespicker-spawnedavataritem,
            #musictracks-addnew, #musictracks-search,
            .pagination-nav .page-item,
            #continueautosaved-run, #continueautosaved-clear, .discordlink,
            .drawcontrols-button:not(.drawcontrols-color) {
                background-color: ${doggieColors.doggieButtonBg} !important;
                border: 2px solid ${doggieColors.doggieButtonBorder} !important;
                color: ${doggieColors.doggieLightGray} !important;
                text-shadow: 0 0 4px ${doggieColors.doggieRed} !important; /* Brighter glow for button text */
                box-shadow: ${doggieColors.doggieButtonBoxShadow} !important;
                border-radius: 5px !important;
                transition: background-color 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
            }
            /* Button Hover State */
            .btn:hover, button:not(.pcr-app button):hover, input[type="submit"]:hover,
            li.page-item .page-link:hover,
            ul.nav.nav-pills li.nav-item a.nav-link:hover,
            .dropdown-menu .dropdown-item:hover,
            .drawcontrols-popupbutton:hover,
            .gesturespicker-item:hover,
            .pagination-nav .page-item:hover,
            #continueautosaved-run:hover, #continueautosaved-clear:hover, .discordlink:hover,
            .drawcontrols-button:not(.drawcontrols-color):hover {
                background-color: ${doggieColors.doggieButtonBgHover} !important;
                border-color: ${doggieColors.doggieRed} !important;
                box-shadow: 0 0 10px ${doggieColors.doggieRed}, 0 0 20px ${doggieColors.doggieRed} !important; /* Stronger glow on hover */
                transform: translateY(-1px); /* Slight lift */
            }
            /* Button Active/Pressed State */
            .btn:active, button:not(.pcr-app button):active, input[type="submit"]:active,
            li.page-item .page-link:active,
            ul.nav.nav-pills li.nav-item a.nav-link:active,
            .dropdown-menu .dropdown-item:active,
            .drawcontrols-popupbutton:active,
            .gesturespicker-item:active,
            #continueautosaved-run:active, #continueautosaved-clear:active, .discordlink:active,
            .drawcontrols-button:not(.drawcontrols-color):active {
                background-color: ${doggieColors.doggieButtonBgActive} !important;
                border-color: ${doggieColors.doggieDarkBrown} !important;
                box-shadow: inset 0 0 5px ${doggieColors.doggieDarkBrown} !important; /* Inset glow */
                transform: translateY(1px); /* Slight shift down */
            }

            /* --- DRAW CONTROLS: COLOR SWATCHES (Keep original color, apply digital border/glow) --- */
            .drawcontrols-button.drawcontrols-color {
                border: 2px solid ${doggieColors.doggieButtonBorder} !important;
                border-radius: 5px !important;
                box-shadow: 0 0 5px rgba(255, 50, 50, 0.5) !important;
                transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
            }
            .drawcontrols-button.drawcontrols-color:hover {
                border-color: ${doggieColors.doggieRed} !important;
                box-shadow: 0 0 10px ${doggieColors.doggieRed} !important;
                transform: translateY(-1px);
            }
            .drawcontrols-button.drawcontrols-color:active {
                border-color: ${doggieColors.doggieDarkBrown} !important;
                box-shadow: inset 0 0 5px ${doggieColors.doggieDarkBrown} !important;
                transform: translateY(1px);
            }
            .drawcontrols-button.drawcontrols-color i,
            .drawcontrols-button.drawcontrols-color span {
                color: ${doggieColors.doggieLightGray} !important;
                text-shadow: 0 0 3px ${doggieColors.doggieDarkBrown};
            }
            /* Specific fix for drawcontrols-circle inside drawcontrols-button for brush sizes, etc. */
            .drawcontrols-button .drawcontrols-circle {
                background-color: transparent !important;
                border: 1px solid ${doggieColors.doggieButtonBorder} !important;
                border-radius: 50% !important; /* Keep circle shape for brush size */
                image-rendering: auto;
            }


            /* Specific elements that need the "selected" darker panel background */
            ul.nav.nav-pills li.nav-item a.nav-link.active,
            .drawcontrols-popupbutton.drawcontrols-popupbutton-active,
            .custom-control-input:checked ~ .custom-control-label::before,
            .pagination-nav .page-item.active .page-link {
                background-color: ${doggieColors.doggieButtonBgActive} !important;
                border: 2px solid ${doggieColors.doggieRed} !important; /* Brighter border for active */
                box-shadow: 0 0 8px ${doggieColors.doggieRed} !important;
                color: ${doggieColors.doggieLightGray} !important;
            }
            /* Specific Highlight for Playerlist Drawer */
            .playerlist-drawerhighlight {
                background-color: ${doggieColors.doggieHighlight} !important;
                border-radius: 5px !important;
            }


            /* Input fields and Textareas */
            input[type="text"], input[type="number"], textarea, select, .form-control, .input-group-text {
                background-color: ${doggieColors.doggiePanelBgSecondary} !important;
                border: 1px solid ${doggieColors.doggiePanelBorder} !important;
                color: ${doggieColors.doggieLightGray} !important;
                text-shadow: none !important; /* No shadow on inputs */
                box-shadow: inset 0 0 3px rgba(255, 50, 50, 0.3) !important;
                border-radius: 5px !important;
                -webkit-font-smoothing: antialiased;
                font-smoothing: antialiased;
            }
            input[type="text"]:focus, input[type="number"]:focus, textarea:focus, select:focus, .form-control:focus {
                outline: none !important;
                box-shadow: 0 0 0 3px ${doggieColors.doggieProgressBar} !important; /* Red glow on focus */
                border-color: ${doggieColors.doggieProgressBar} !important;
            }

            /* Timer elements */
            .timer-bg, .timer-face {
                background-color: ${doggieColors.doggiePanelBgSecondary} !important;
                border: 2px solid ${doggieColors.doggiePanelBorder} !important;
                border-radius: 5px !important;
                box-shadow: inset 0 0 5px rgba(255, 50, 50, 0.4) !important;
            }
            .timer-bar {
               background: ${doggieColors.doggieProgressBar} !important;
               box-shadow: 0 0 8px ${doggieColors.doggieProgressBar} !important;
            }
            svg[viewBox="0 0 1 1"] path[stroke="#673ab7"] { /* Timer SVG stroke */
                stroke: ${doggieColors.doggieProgressBar} !important;
            }

            /* Draw controls and palette */
            .palettechooser-row, .palettechooser-row .palettechooser-colorset, .colorset {
                border: 1px solid ${doggieColors.doggiePanelBorder} !important;
                border-radius: 5px !important;
                box-shadow: inset 0 0 3px rgba(255, 50, 50, 0.3) !important;
            }
            .pcr-app {
                 background-color: ${doggieColors.doggiePanelBgSecondary} !important;
                 border: 1px solid ${doggieColors.doggiePanelBorder} !important;
                 border-radius: 5px !important;
                 box-shadow: inset 0 0 5px rgba(255, 50, 50, 0.4) !important;
            }
            .pcr-type {
                background-color: ${doggieColors.doggieButtonBg} !important;
                border: 1px solid ${doggieColors.doggieButtonBorder} !important;
                color: ${doggieColors.doggieLightGray} !important;
                border-radius: 3px !important;
                box-shadow: ${doggieColors.doggieButtonBoxShadow} !important;
            }
            .pcr-type.active, .pcr-type:focus {
                background-color: ${doggieColors.doggieProgressBar} !important;
                border-color: ${doggieColors.doggieProgressBar} !important;
                box-shadow: 0 0 8px ${doggieColors.doggieProgressBar} !important;
            }
            .pcr-result:focus {
                border: 2px solid ${doggieColors.doggieProgressBar} !important;
            }

            /* Images and Icons - smooth rendering, circular avatars */
            img, .sitelogo img, .navbar-brand img, .asset[draggable="false"],
            .turnresults-avatar, .tokenicon, .playerlist-medal, .playerlist-star,
            .loginbutton-icon img, .a2a_svg {
                image-rendering: auto; /* Ensure smooth rendering */
            }
            .playerlist-avatar {
                border: 2px solid ${doggieColors.doggiePanelBorder} !important;
                border-radius: 50% !important; /* Circular avatars */
                background: transparent !important;
                box-shadow: 0 0 8px rgba(255, 50, 50, 0.6) !important; /* Doggie glow for avatars */
            }
            .turnresults-avatar {
                border: 2px solid ${doggieColors.doggiePanelBorder} !important;
                border-radius: 50% !important;
                box-shadow: 0 0 8px rgba(255, 50, 50, 0.6) !important;
            }
            .a2a_kit .a2a_svg {
                background-color: ${doggieColors.doggieProgressBar} !important;
                border-radius: 50% !important; /* Circular share icons */
                box-shadow: 0 0 5px ${doggieColors.doggieProgressBar} !important;
            }
            .a2a_kit a:hover .a2a_svg {
                background-color: ${doggieColors.doggieRed} !important;
                box-shadow: 0 0 10px ${doggieColors.doggieRed} !important;
            }

            /* Scrollbars */
            ::-webkit-scrollbar {
                width: 12px; /* Slightly wider */
                height: 12px;
                background-color: ${doggieColors.doggiePanelBgSecondary};
            }
            ::-webkit-scrollbar-thumb {
                background-color: ${doggieColors.doggieButtonBorder};
                border: 1px solid ${doggieColors.doggieDarkBrown};
                border-radius: 6px; /* More rounded scroll thumb */
                box-shadow: 0 0 5px rgba(255, 50, 50, 0.5) inset;
            }
            ::-webkit-scrollbar-thumb:hover {
                background-color: ${doggieColors.doggieButtonBgHover};
                box-shadow: 0 0 8px rgba(255, 50, 50, 0.7) inset;
            }
            ::-webkit-scrollbar-corner {
                background-color: ${doggieColors.doggiePanelBgSecondary};
            }
            /* Firefox scrollbar (defined globally and specifically where needed) */
            * {
                scrollbar-width: thin;
                scrollbar-color: ${doggieColors.doggieButtonBorder} ${doggieColors.doggiePanelBgSecondary};
            }
            *:active {
                scrollbar-color: ${doggieColors.doggieButtonBgHover} ${doggieColors.doggiePanelBgSecondary} !important;
            }

            /* Remove specified elements */
            .extimages, .discordlink, #howtoplaybox, #socbuttons {
                display: none !important;
            }

            /* Specific Overrides for Existing Drawaria Styles */
            body[style*="background:url(/img/pattern.png)"], [style*="background:#f1f9f5"], [style*="background:#0087ff"], [style*="background:#00b7ff"], [style*="background:rgba(0,183,255,.3)"], [style*="background:#e1e1e1"], [style*="background:rgba(255,255,255,0.2)"], [style*="background:beige"], [style*="background:#ffffe5"], [style*="background:#ffeb3b"] {
                background: none !important;
                background-color: transparent !important;
                box-shadow: none !important;
                border-color: transparent !important;
            }
            #login-midcol { /* Make login-midcol invisible */
                background: transparent !important;
            }
            #login-rightcol .loginbox { /* Override loginbox background */
                background: ${doggieColors.doggiePanelBgMain} !important;
                border-radius: 5px !important;
                border: 2px solid ${doggieColors.doggiePanelBorder} !important;
                box-shadow: ${doggieColors.doggiePanelBoxShadow} !important;
            }
            #avatarcontainer { /* Specific styling for avatar container */
                background-color: ${doggieColors.doggiePanelBgSecondary} !important;
                border: 1px solid ${doggieColors.doggiePanelBorder} !important;
                border-radius: 5px !important;
                box-shadow: inset 0 0 5px rgba(255, 50, 50, 0.4) !important;
            }
            #login-leftcol div:first-child { /* Specific div with inline background */
                background: transparent !important;
            }
            div[style*="margin-top: 60px; text-align: right; color: white; font-size: 25px; padding: 20px; background: cornflowerblue; margin-bottom: 20px; padding-right: 100px;"] {
                background: ${doggieColors.doggiePanelBgMain} !important;
                border-radius: 5px !important;
                box-shadow: ${doggieColors.doggiePanelBoxShadow} !important;
            }
            div[style*="border-top: #00b7ff solid 1px; margin-top: 1em; padding: 0.5em; padding-bottom: 0;"] {
                border-top: 1px solid ${doggieColors.doggiePanelBorder} !important;
            }
            /* Modal Header/Footer backgrounds */
            .modal-header, .modal-footer {
                background-color: ${doggieColors.doggiePanelBgSecondary} !important;
                border-color: ${doggieColors.doggiePanelBorder} !important;
                border-radius: 0px !important; /* No default rounded corners for header/footer */
            }
            .popover-body, .dropdown-menu {
                background-color: ${doggieColors.doggiePanelBgMain} !important;
                border: 1px solid ${doggieColors.doggiePanelBorder} !important;
                border-radius: 5px !important;
                box-shadow: ${doggieColors.doggiePanelBoxShadow} !important;
            }
            .dropdown-divider {
                border-color: ${doggieColors.doggiePanelBorder} !important;
                background-color: ${doggieColors.doggiePanelBorder} !important;
            }
            /* Remove box-shadow from levelbar div */
            div[style*="position: absolute;"] {
                box-shadow: none !important;
            }
            .playerlist-exp-bar span {
                background-color: ${doggieColors.doggieProgressBar} !important;
                box-shadow: 0 0 5px ${doggieColors.doggieProgressBar} !important;
            }
            #accountbox:hover *, #avatarcontainer:hover * { /* Consistent hover for account/avatar */
                background: ${doggieColors.doggieButtonBgHover} !important;
                box-shadow: 0 0 10px ${doggieColors.doggieRed} !important;
            }
            #chatbox_textinput { /* Override aqua border from OCR */
                border: 1px solid ${doggieColors.doggiePanelBorder} !important;
            }
            .invbox { /* Remove background from inventory box */
                background: none !important;
            }
            /* Scoreboard/Table cells (td) in the account settings box */
            #accountbox table.table td {
                background-color: ${doggieColors.doggiePanelBgMain} !important; /* Ensure opaque background for table cells */
                border: none !important; /* Remove internal cell borders */
            }
            #accountbox table.table tr {
                border-bottom: 1px solid ${doggieColors.doggiePanelBorder} !important; /* Add row separators */
            }
            #accountbox table.table tr:last-child {
                border-bottom: none !important;
            }
        `);

        // B. Replace Logo (using JS for direct src change and precise sizing)
        replaceLogo();

        // C. Create and show the Music Toggle Button (will manage background music if added by user)
        createMusicButton();

        // D. Activate Chat Auto-Scroller with conditional logic
        activateChatScroller();

        // E. Add click sound effect to buttons
        addClickSound();

        isThemeActive = true;
    }

    // --- 2. THEME DEACTIVATION FUNCTION ---
    function deactivateTheme() {
        if (!isThemeActive) return;

        // A. Remove Injected Stylesheet
        if (doggieStyleElement) {
            doggieStyleElement.remove();
            doggieStyleElement = null;
        }

        // B. Remove Google Font Link
        if (fontLinkElement && fontLinkElement.parentNode) {
            fontLinkElement.parentNode.removeChild(fontLinkElement);
            fontLinkElement = null;
        }

        // C. Restore original logo (best effort)
        restoreLogo();
        if (logoInterval) {
            clearInterval(logoInterval);
            logoInterval = null;
        }

        // D. Remove Music Toggle Button
        if (musicToggleButton) {
            musicToggleButton.remove();
            musicToggleButton = null;
        }

        // E. Deactivate Chat Scroller
        if (chatObserver) {
            chatObserver.disconnect();
            chatObserver = null;
        }

        // F. Remove click sound effect listener
        removeClickSound();

        // G. Stop music if playing
        if (audio.backgroundMusic) {
            audio.backgroundMusic.pause();
        }

        isThemeActive = false;
    }

    // --- 3. HELPER FUNCTIONS ---
    // Logo replacement logic
    function replaceLogo() {
        const attemptReplaceLogo = () => {
            const sitelogo = document.querySelector('.sitelogo img');
            const navbarBrand = document.querySelector('.navbar-brand img'); // For secondary logo if present

            if (sitelogo) {
                sitelogo.src = doggieColors.logoUrl;
                sitelogo.style.width = 'auto';
                sitelogo.style.height = '160px'; // Set preferred height to 160px
                sitelogo.style.maxWidth = '100%';
                sitelogo.style.objectFit = 'contain';
                sitelogo.style.imageRendering = 'auto'; // Ensure smooth rendering
            }
            if (navbarBrand) {
                navbarBrand.src = doggieColors.logoUrl;
                navbarBrand.style.width = 'auto';
                navbarBrand.style.height = '160px'; // Set preferred height to 160px
                navbarBrand.style.maxWidth = '100%';
                navbarBrand.style.objectFit = 'contain';
                navbarBrand.style.imageRendering = 'auto'; // Ensure smooth rendering
            }

            if (sitelogo || navbarBrand) {
                console.log('Drawaria logo replaced with Doggie logo.');
                if (logoInterval) {
                    clearInterval(logoInterval);
                    logoInterval = null;
                }
            }
        };

        // Attempt immediately, then set interval for dynamic loading
        attemptReplaceLogo();
        if (!logoInterval) {
            logoInterval = setInterval(attemptReplaceLogo, 500); // Check every half second
        }
    }

    function restoreLogo() {
        // This is a best-effort restoration. Original src would ideally be stored.
        const sitelogo = document.querySelector('.sitelogo img');
        const navbarBrand = document.querySelector('.navbar-brand img');
        if (sitelogo) {
            sitelogo.removeAttribute('src'); // Removes our custom logo
            sitelogo.style = ''; // Clear inline styles
        }
        if (navbarBrand) {
            navbarBrand.removeAttribute('src'); // Removes our custom logo
            navbarBrand.style = ''; // Clear inline styles
        }
        console.log('Attempted to restore Drawaria logo.');
    }

    // Music button creation (Modified to reflect no default background music)
    function createMusicButton() {
        musicToggleButton = document.createElement('button');
        musicToggleButton.innerHTML = 'Music Off (Add your own!)'; // Initial text and hint
        musicToggleButton.style.cssText = `
            position: fixed; bottom: 7px; right: 200px; z-index: 10000;
            background-color: ${doggieColors.doggieButtonBg} !important;
            color: ${doggieColors.doggieLightGray} !important;
            border: 2px solid ${doggieColors.doggieButtonBorder} !important;
            padding: 5px 10px; border-radius: 5px; cursor: pointer;
            font-family: 'Electrolize', sans-serif; font-weight: bold;
            text-shadow: 0 0 4px ${doggieColors.doggieRed};
            box-shadow: ${doggieColors.doggieButtonBoxShadow};
            transition: background-color 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        `;
        musicToggleButton.onmouseover = function() {
            this.style.backgroundColor = doggieColors.doggieButtonBgHover;
            this.style.borderColor = doggieColors.doggieRed;
            this.style.boxShadow = `0 0 10px ${doggieColors.doggieRed}, 0 0 20px ${doggieColors.doggieRed}`;
            this.style.transform = 'translateY(-1px)';
        };
        musicToggleButton.onmouseout = function() {
            this.style.backgroundColor = doggieColors.doggieButtonBg;
            this.style.borderColor = doggieColors.doggieButtonBorder;
            this.style.boxShadow = doggieColors.doggieButtonBoxShadow;
            this.style.transform = 'none';
        };
        musicToggleButton.onmousedown = function() {
            this.style.backgroundColor = doggieColors.doggieButtonBgActive;
            this.style.borderColor = doggieColors.doggieDarkBrown;
            this.style.boxShadow = `inset 0 0 5px ${doggieColors.doggieDarkBrown}`;
            this.style.transform = 'translateY(1px)';
        };
        musicToggleButton.onmouseup = function() {
            this.style.backgroundColor = doggieColors.doggieButtonBgHover; // Return to hover state
            this.style.borderColor = doggieColors.doggieRed;
            this.style.boxShadow = `0 0 10px ${doggieColors.doggieRed}, 0 0 20px ${doggieColors.doggieRed}`;
            this.style.transform = 'translateY(-1px)';
        };

        document.body.appendChild(musicToggleButton);

        musicToggleButton.addEventListener('click', () => {
            // User needs to define audio.backgroundMusic if they want music
            if (audio.backgroundMusic) {
                if (!audio.backgroundMusic.paused) {
                    audio.backgroundMusic.pause();
                    musicToggleButton.textContent = 'Music Off';
                } else {
                    playMusic();
                    musicToggleButton.textContent = 'Music On';
                }
            } else {
                alert('No background music URL defined. Please update the script if you want music!');
            }
        });
    }

    // Chat Auto-Scroller function with conditional scrolling
    function activateChatScroller() {
        const chatBox = document.getElementById('chatbox_messages');
        if (!chatBox) return;

        const scrollToBottomIfAtBottom = () => {
            // Check if user is near the bottom (within 20px of scrollHeight)
            const isAtBottom = (chatBox.scrollHeight - chatBox.scrollTop - chatBox.clientHeight) < 20;
            if (isAtBottom) {
                chatBox.scrollTop = chatBox.scrollHeight;
            }
        };

        // Scroll immediately if already at bottom (on load or theme activation)
        chatBox.scrollTop = chatBox.scrollHeight;

        chatObserver = new MutationObserver(scrollToBottomIfAtBottom);
        chatObserver.observe(chatBox, { childList: true });
    }

    // Add Doggie click sound to ALL clickable elements (more robust)
    function addClickSound() {
        const clickableSelectors =
            'a, button, input:not([type="range"]), select, textarea, label, ' +
            '[role="button"], [role="link"], [role="checkbox"], [role="radio"], ' +
            '[onclick], ' +
            '[tabindex]:not([tabindex="-1"]), ' +
            '.btn, .nav-link, .page-link, .custom-control-label, ' +
            '.playerlist-row, .roomlist-item, .drawcontrols-button, .gesturespicker-item, ' +
            '.dropdown-item, .modal-header, .modal-footer, .popover-header, ' +
            '.palettechooser-row, .colorset, .pcr-type, ' +
            '[data-toggle], [data-target], [data-dismiss], ' +
            '.accountbox-inventorybutton, ' +
            '.turnresults-avatar, .playerlist-avatar, .playerlist-drawerhighlight';

        clickSoundHandler = (event) => {
            const interactiveElement = event.target.closest(clickableSelectors);

            if (interactiveElement) {
                if (interactiveElement.tagName === 'INPUT' && interactiveElement.type === 'range') {
                    return;
                }
                if (!interactiveElement.disabled) {
                    playSound();
                }
            }
        };
        document.body.addEventListener('click', clickSoundHandler, true);
    }

    // Remove Doggie click sound listener
    function removeClickSound() {
        if (clickSoundHandler) {
            document.body.removeEventListener('click', clickSoundHandler, true);
            clickSoundHandler = null;
        }
    }

    // --- 4. Music and Sound Effects Framework ---
    const audio = { backgroundMusic: null, soundEffect: null };
    function loadAudio() {

        audio.backgroundMusic = new Audio('https://www.myinstants.com/media/sounds/doggie-theme.mp3');
        audio.backgroundMusic.loop = true;
        audio.backgroundMusic.volume = 1;

        audio.soundEffect = new Audio(doggieColors.clickSoundUrl);
        audio.soundEffect.volume = 0.7; // Slightly louder volume
    }
    // Only play music if it's defined
    function playMusic() { if (audio.backgroundMusic && audio.backgroundMusic.paused) { audio.backgroundMusic.play().catch(e => console.log("Music play failed:", e)); } }
    function playSound() { if (audio.soundEffect) { audio.soundEffect.currentTime = 0; audio.soundEffect.play().catch(e => console.log("Sound effect play failed:", e)); } }

    // --- 5. INITIALIZATION ---
    window.addEventListener('load', () => {
        const masterToggleButton = document.createElement('button');
        masterToggleButton.id = 'theme-toggle-button';
        masterToggleButton.style.cssText = `
            position: fixed; bottom: 7px; right: 10px; z-index: 10001;
            background-color: ${doggieColors.doggieButtonBg} !important;
            color: ${doggieColors.doggieLightGray} !important;
            border: 2px solid ${doggieColors.doggieButtonBorder} !important;
            padding: 5px 10px; border-radius: 5px; cursor: pointer;
            font-family: 'Electrolize', sans-serif; font-weight: bold;
            text-shadow: 0 0 4px ${doggieColors.doggieRed};
            box-shadow: ${doggieColors.doggieButtonBoxShadow};
            transition: background-color 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        `;
        masterToggleButton.onmouseover = function() {
            this.style.backgroundColor = doggieColors.doggieButtonBgHover;
            this.style.borderColor = doggieColors.doggieRed;
            this.style.boxShadow = `0 0 10px ${doggieColors.doggieRed}, 0 0 20px ${doggieColors.doggieRed}`;
            this.style.transform = 'translateY(-1px)';
        };
        masterToggleButton.onmouseout = function() {
            this.style.backgroundColor = doggieColors.doggieButtonBg;
            this.style.borderColor = doggieColors.doggieButtonBorder;
            this.style.boxShadow = doggieColors.doggieButtonBoxShadow;
            this.style.transform = 'none';
        };
        masterToggleButton.onmousedown = function() {
            this.style.backgroundColor = doggieColors.doggieButtonBgActive;
            this.style.borderColor = doggieColors.doggieDarkBrown;
            this.style.boxShadow = `inset 0 0 5px ${doggieColors.doggieDarkBrown}`;
            this.style.transform = 'translateY(1px)';
        };
        masterToggleButton.onmouseup = function() {
            this.style.backgroundColor = doggieColors.doggieButtonBgHover; // Return to hover state
            this.style.borderColor = doggieColors.doggieRed;
            this.style.boxShadow = `0 0 10px ${doggieColors.doggieRed}, 0 0 20px ${doggieColors.doggieRed}`;
            this.style.transform = 'translateY(-1px)';
        };

        document.body.appendChild(masterToggleButton);

        masterToggleButton.addEventListener('click', () => {
            if (isThemeActive) {
                deactivateTheme();
                masterToggleButton.textContent = 'Activate Doggie Theme';
            } else {
                activateTheme();
                masterToggleButton.textContent = 'Deactivate Doggie Theme';
            }
        });

        loadAudio();
        activateTheme(); // Activate theme by default
        masterToggleButton.textContent = 'Deactivate Doggie Theme'; // Set initial text

        console.log('Drawaria.online Doggie Theme v1.0 Initialized!');

        // Update SVG stroke color to Doggie red on load and dynamically
        const updateTimerStroke = () => {
            const timerPath = document.querySelector('.timer-bar svg path');
            if (timerPath) {
                timerPath.setAttribute('stroke', doggieColors.doggieProgressBar);
            }
        };
        updateTimerStroke();
        // Use a MutationObserver for more robust SVG update if it's dynamically added/changed
        const timerBar = document.querySelector('.timer-bar');
        if (timerBar) {
            const observer = new MutationObserver((mutationsList, obs) => {
                for(const mutation of mutationsList) {
                    if (mutation.type === 'childList' && mutation.target.classList.contains('timer-bar')) {
                        updateTimerStroke();
                    }
                }
            });
            observer.observe(timerBar, { childList: true, subtree: true });
        }
    });
})();