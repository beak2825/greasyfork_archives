// ==UserScript==
// @name         Drawaria.online Hatsune Miku Theme
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Transforms Drawaria.online with a vibrant Hatsune Miku aesthetic, featuring custom backgrounds, a futuristic UI, digital effects, and Miku-themed sounds.
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @icon         https://www.favicon.cc/favicon/377/140/favicon.png
// @grant        GM_addStyle
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/544232/Drawariaonline%20Hatsune%20Miku%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/544232/Drawariaonline%20Hatsune%20Miku%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Global variables to hold theme elements for easy removal ---
    let mikuStyleElement = null;
    let musicToggleButton = null;
    let chatObserver = null;
    let isThemeActive = false;
    let clickSoundHandler = null;
    let logoInterval = null; // To handle logo replacement until found
    let fontLinkElement = null; // To hold the font link element for removal

    // --- Hatsune Miku Theme Colors and Resources ---
    const mikuColors = {
        // Miku inspired colors
        mikuTeal: 'rgb(0, 192, 204)',        // Primary Miku hair/accent color
        mikuCyan: 'rgb(0, 224, 255)',        // Lighter, brighter Miku cyan for highlights/glows
        mikuDarkBlue: 'rgb(0, 100, 120)',    // Darker blue for borders/shadows
        mikuLightGray: 'rgb(220, 240, 255)', // Light text on dark backgrounds
        mikuDarkGray: 'rgb(30, 30, 35)',     // Dark text/shadows
        mikuBlack: 'rgb(10, 10, 15)',        // Deepest black for backgrounds/borders
        mikuAccentPink: 'rgb(255, 105, 180)',// Occasional accent color (e.g., for user messages)

        // UI Panel backgrounds
        mikuPanelBgMain: 'rgba(20, 20, 25, 0.95)',       // Main panels (leftbar, rightbar, modal content)
        mikuPanelBgSecondary: 'rgba(35, 35, 40, 0.95)',  // Selected list items, deeper nested panels
        mikuPanelBorder: 'rgb(0, 120, 140)',             // Stronger border for panels
        mikuPanelBoxShadow: '0 0 8px rgba(0, 192, 204, 0.6)', // Subtle teal glow for panels

        // Button colors
        mikuButtonBg: 'rgb(30, 30, 35)',        // Default button background
        mikuButtonBgHover: 'rgb(0, 60, 70)',    // Button background on hover (darker tealish)
        mikuButtonBgActive: 'rgb(0, 80, 90)',   // Button background on active/pressed
        mikuButtonBorder: 'rgb(0, 150, 170)',   // Teal border for buttons
        mikuButtonBoxShadow: '0 0 5px rgba(0, 224, 255, 0.5)', // Brighter cyan glow for buttons

        // Progress bars and highlights
        mikuProgressBar: 'rgb(0, 224, 255)',    // Bright cyan for progress bars
        mikuHighlight: 'rgba(0, 224, 255, 0.4)',// Bright cyan highlight for selected/drawer

        // Room List specific colors
        mikuRoomListGridBg: 'rgba(15, 15, 20, 0.9)', // Background for the entire #roomlist grid
        mikuRoomItemBg: 'rgba(25, 25, 30, 0.9)',     // Background for individual .roomlist-item
        mikuRoomItemBorder: 'rgb(0, 110, 130)',     // Border for individual .roomlist-item

        // Background and Logo
        backgroundTexture: 'https://pixelz.cc/wp-content/uploads/2018/10/hatsune-miku-wqhd-1440p-wallpaper.jpg',
        logoUrl: 'https://i.ibb.co/GjrfXVR/cooltext487705359269815.png',
        backgroundMusicUrl: 'https://www.myinstants.com/media/sounds/loituma-ievan-polkka-zeki-erdemir-trap-remix-0s-14.mp3',
        clickSoundUrl: 'https://www.myinstants.com/media/sounds/pisseim-mund-online-audio-converter.mp3'
    };

    // --- 1. THEME ACTIVATION FUNCTION ---
    function activateTheme() {
        if (isThemeActive) return; // Prevent re-activation

        // A. Load Google Font (Electrolize for futuristic digital feel)
        fontLinkElement = document.createElement('link');
        fontLinkElement.href = 'https://fonts.googleapis.com/css2?family=Electrolize&display=swap';
        fontLinkElement.rel = 'stylesheet';
        document.head.appendChild(fontLinkElement);

        // B. Inject CSS Styles
        mikuStyleElement = GM_addStyle(`
            /* Global Resets and Hatsune Miku Aesthetic Defaults */
            html, body {
                height: 100%;
                background: url('${mikuColors.backgroundTexture}') no-repeat center center fixed !important;
                background-size: cover !important;
                background-color: ${mikuColors.mikuBlack} !important; /* Fallback for background */
                overflow-x: hidden !important; /* Prevent horizontal scrollbar */
                overflow-y: auto !important; /* Allow vertical scrollbar only when needed */
                scrollbar-width: auto; /* Firefox */
                scrollbar-color: ${mikuColors.mikuButtonBorder} ${mikuColors.mikuPanelBgSecondary}; /* Firefox */
                image-rendering: auto; /* Allow smooth images by default */
            }
            body::before, body::after { content: none !important; }

            /* Allow scrolling on homepage */
            body:has(#main) {
                overflow: auto !important;
            }

            /* Global Text Styling for Miku Look */
            body, #main, #leftbar, #rightbar, .loginbox, .btn, .playerlist-row, .roomlist-item,
            .chatbox_messages, .bubble, .modal-content, .form-control, .input-group-text,
            h1, h2, h3, h4, h5, h6, span, a, div:not(.pcr-current-color), td {
                color: ${mikuColors.mikuLightGray} !important; /* Default text to light gray */
                text-shadow: 0 0 3px ${mikuColors.mikuTeal}; /* Subtle teal glow */
                font-family: 'Electrolize', sans-serif !important; /* Updated font-family */
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


            /* Specific text colors for better readability / Miku accents */
            .roomlist-item, .roomlist-playercount, .roomlist-descr, .roomlist-mostlang,
            .dropdown-item.loginbox-alloptionslink,
            div[style*="color: gray; padding: 1em; font-size: 0.9em"], /* specific gray text div */
            .playerlist-row:not(.playerlist-name-loggedin) a:not(.playerlist-name-self a),
            .playerlist-name a, .playerlist-rank-first {
                color: ${mikuColors.mikuLightGray} !important;
                text-shadow: 0 0 3px ${mikuColors.mikuTeal} !important;
            }
            .playerchatmessage-selfname, .playerchatmessage-selfname ~ .playerchatmessage-text,
            .systemchatmessage1, .systemchatmessage2, .systemchatmessage3, .systemchatmessage4, .systemchatmessage5,
            .systemchatmessage6, .systemchatmessage7, .systemchatmessage8, .systemchatmessage9 {
                color: ${mikuColors.mikuCyan} !important; /* Bright cyan accent for self/system messages */
                text-shadow: 0 0 5px ${mikuColors.mikuCyan}, 0 0 10px ${mikuColors.mikuCyan}; /* Stronger glow */
                font-style: normal !important; /* Remove italic from system messages */
            }

            /* Main UI Panels and Containers - Futuristic, Semi-transparent Look */
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
                background-color: ${mikuColors.mikuPanelBgMain} !important;
                border: 2px solid ${mikuColors.mikuPanelBorder} !important;
                box-shadow: ${mikuColors.mikuPanelBoxShadow} !important; /* Miku teal glow */
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
                background-color: ${mikuColors.mikuPanelBgSecondary} !important;
                border: 1px solid ${mikuColors.mikuPanelBorder} !important;
                border-radius: 5px !important;
                box-shadow: inset 0 0 5px rgba(0, 192, 204, 0.4) !important; /* Inner glow for depth */
            }

            /* Room List and Room Items (Miku Aesthetic) */
            #roomlist {
                background-color: ${mikuColors.mikuRoomListGridBg} !important;
                border: 2px solid ${mikuColors.mikuRoomItemBorder} !important;
                border-radius: 5px !important;
                box-shadow: ${mikuColors.mikuPanelBoxShadow} !important;
            }
            .roomlist-item {
                background-color: ${mikuColors.mikuRoomItemBg} !important;
                border: 1px solid ${mikuColors.mikuRoomItemBorder} !important;
                border-radius: 5px !important;
                box-shadow: 0 0 3px rgba(0, 192, 204, 0.3) !important;
                transition: transform 0.2s ease, box-shadow 0.2s ease;
            }
            .roomlist-item:hover {
                transform: translateY(-2px);
                box-shadow: 0 0 8px rgba(0, 224, 255, 0.7) !important;
            }
            .roomlist-preview {
                background: transparent !important;
            }
            .roomlist-groupheader {
                border-bottom: 1px solid ${mikuColors.mikuPanelBorder} !important;
                color: ${mikuColors.mikuLightGray} !important;
                text-shadow: 0 0 4px ${mikuColors.mikuTeal};
            }


            /* --- ALL BUTTONS (GENERAL MIKU DIGITAL STYLE) --- */
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
                background-color: ${mikuColors.mikuButtonBg} !important;
                border: 2px solid ${mikuColors.mikuButtonBorder} !important;
                color: ${mikuColors.mikuLightGray} !important;
                text-shadow: 0 0 4px ${mikuColors.mikuCyan} !important; /* Brighter glow for button text */
                box-shadow: ${mikuColors.mikuButtonBoxShadow} !important;
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
                background-color: ${mikuColors.mikuButtonBgHover} !important;
                border-color: ${mikuColors.mikuCyan} !important;
                box-shadow: 0 0 10px ${mikuColors.mikuCyan}, 0 0 20px ${mikuColors.mikuCyan} !important; /* Stronger glow on hover */
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
                background-color: ${mikuColors.mikuButtonBgActive} !important;
                border-color: ${mikuColors.mikuTeal} !important;
                box-shadow: inset 0 0 5px ${mikuColors.mikuTeal} !important; /* Inset glow */
                transform: translateY(1px); /* Slight shift down */
            }

            /* --- DRAW CONTROLS: COLOR SWATCHES (Keep original color, apply digital border/glow) --- */
            .drawcontrols-button.drawcontrols-color {
                border: 2px solid ${mikuColors.mikuButtonBorder} !important;
                border-radius: 5px !important;
                box-shadow: 0 0 5px rgba(0, 192, 204, 0.5) !important;
                transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
            }
            .drawcontrols-button.drawcontrols-color:hover {
                border-color: ${mikuColors.mikuCyan} !important;
                box-shadow: 0 0 10px ${mikuColors.mikuCyan} !important;
                transform: translateY(-1px);
            }
            .drawcontrols-button.drawcontrols-color:active {
                border-color: ${mikuColors.mikuTeal} !important;
                box-shadow: inset 0 0 5px ${mikuColors.mikuTeal} !important;
                transform: translateY(1px);
            }
            .drawcontrols-button.drawcontrols-color i,
            .drawcontrols-button.drawcontrols-color span {
                color: ${mikuColors.mikuLightGray} !important;
                text-shadow: 0 0 3px ${mikuColors.mikuTeal};
            }
            /* Specific fix for drawcontrols-circle inside drawcontrols-button for brush sizes, etc. */
            .drawcontrols-button .drawcontrols-circle {
                background-color: transparent !important;
                border: 1px solid ${mikuColors.mikuButtonBorder} !important;
                border-radius: 50% !important; /* Keep circle shape for brush size */
                image-rendering: auto;
            }


            /* Specific elements that need the "selected" darker panel background */
            ul.nav.nav-pills li.nav-item a.nav-link.active,
            .drawcontrols-popupbutton.drawcontrols-popupbutton-active,
            .custom-control-input:checked ~ .custom-control-label::before,
            .pagination-nav .page-item.active .page-link {
                background-color: ${mikuColors.mikuButtonBgActive} !important;
                border: 2px solid ${mikuColors.mikuCyan} !important; /* Brighter border for active */
                box-shadow: 0 0 8px ${mikuColors.mikuCyan} !important;
                color: ${mikuColors.mikuLightGray} !important;
            }
            /* Specific Highlight for Playerlist Drawer */
            .playerlist-drawerhighlight {
                background-color: ${mikuColors.mikuHighlight} !important;
                border-radius: 5px !important;
            }


            /* Input fields and Textareas */
            input[type="text"], input[type="number"], textarea, select, .form-control, .input-group-text {
                background-color: ${mikuColors.mikuPanelBgSecondary} !important;
                border: 1px solid ${mikuColors.mikuPanelBorder} !important;
                color: ${mikuColors.mikuLightGray} !important;
                text-shadow: none !important; /* No shadow on inputs */
                box-shadow: inset 0 0 3px rgba(0, 192, 204, 0.3) !important;
                border-radius: 5px !important;
                -webkit-font-smoothing: antialiased;
                font-smoothing: antialiased;
            }
            input[type="text"]:focus, input[type="number"]:focus, textarea:focus, select:focus, .form-control:focus {
                outline: none !important;
                box-shadow: 0 0 0 3px ${mikuColors.mikuProgressBar} !important; /* Cyan glow on focus */
                border-color: ${mikuColors.mikuProgressBar} !important;
            }

            /* Timer elements */
            .timer-bg, .timer-face {
                background-color: ${mikuColors.mikuPanelBgSecondary} !important;
                border: 2px solid ${mikuColors.mikuPanelBorder} !important;
                border-radius: 5px !important;
                box-shadow: inset 0 0 5px rgba(0, 192, 204, 0.4) !important;
            }
            .timer-bar {
               background: ${mikuColors.mikuProgressBar} !important;
               box-shadow: 0 0 8px ${mikuColors.mikuProgressBar} !important;
            }
            svg[viewBox="0 0 1 1"] path[stroke="#673ab7"] { /* Timer SVG stroke */
                stroke: ${mikuColors.mikuProgressBar} !important;
            }

            /* Draw controls and palette */
            .palettechooser-row, .palettechooser-row .palettechooser-colorset, .colorset {
                border: 1px solid ${mikuColors.mikuPanelBorder} !important;
                border-radius: 5px !important;
                box-shadow: inset 0 0 3px rgba(0, 192, 204, 0.3) !important;
            }
            .pcr-app {
                 background-color: ${mikuColors.mikuPanelBgSecondary} !important;
                 border: 1px solid ${mikuColors.mikuPanelBorder} !important;
                 border-radius: 5px !important;
                 box-shadow: inset 0 0 5px rgba(0, 192, 204, 0.4) !important;
            }
            .pcr-type {
                background-color: ${mikuColors.mikuButtonBg} !important;
                border: 1px solid ${mikuColors.mikuButtonBorder} !important;
                color: ${mikuColors.mikuLightGray} !important;
                border-radius: 3px !important;
                box-shadow: ${mikuColors.mikuButtonBoxShadow} !important;
            }
            .pcr-type.active, .pcr-type:focus {
                background-color: ${mikuColors.mikuProgressBar} !important;
                border-color: ${mikuColors.mikuProgressBar} !important;
                box-shadow: 0 0 8px ${mikuColors.mikuProgressBar} !important;
            }
            .pcr-result:focus {
                border: 2px solid ${mikuColors.mikuProgressBar} !important;
            }

            /* Images and Icons - smooth rendering, circular avatars */
            img, .sitelogo img, .navbar-brand img, .asset[draggable="false"],
            .turnresults-avatar, .tokenicon, .playerlist-medal, .playerlist-star,
            .loginbutton-icon img, .a2a_svg {
                image-rendering: auto; /* Ensure smooth rendering */
            }
            .playerlist-avatar {
                border: 2px solid ${mikuColors.mikuPanelBorder} !important;
                border-radius: 50% !important; /* Circular avatars */
                background: transparent !important;
                box-shadow: 0 0 8px rgba(0, 192, 204, 0.6) !important; /* Miku glow for avatars */
            }
            .turnresults-avatar {
                border: 2px solid ${mikuColors.mikuPanelBorder} !important;
                border-radius: 50% !important;
                box-shadow: 0 0 8px rgba(0, 192, 204, 0.6) !important;
            }
            .a2a_kit .a2a_svg {
                background-color: ${mikuColors.mikuProgressBar} !important;
                border-radius: 50% !important; /* Circular share icons */
                box-shadow: 0 0 5px ${mikuColors.mikuProgressBar} !important;
            }
            .a2a_kit a:hover .a2a_svg {
                background-color: ${mikuColors.mikuCyan} !important;
                box-shadow: 0 0 10px ${mikuColors.mikuCyan} !important;
            }

            /* Scrollbars */
            ::-webkit-scrollbar {
                width: 12px; /* Slightly wider */
                height: 12px;
                background-color: ${mikuColors.mikuPanelBgSecondary};
            }
            ::-webkit-scrollbar-thumb {
                background-color: ${mikuColors.mikuButtonBorder};
                border: 1px solid ${mikuColors.mikuDarkBlue};
                border-radius: 6px; /* More rounded scroll thumb */
                box-shadow: 0 0 5px rgba(0, 192, 204, 0.5) inset;
            }
            ::-webkit-scrollbar-thumb:hover {
                background-color: ${mikuColors.mikuButtonBgHover};
                box-shadow: 0 0 8px rgba(0, 224, 255, 0.7) inset;
            }
            ::-webkit-scrollbar-corner {
                background-color: ${mikuColors.mikuPanelBgSecondary};
            }
            /* Firefox scrollbar (defined globally and specifically where needed) */
            * {
                scrollbar-width: thin;
                scrollbar-color: ${mikuColors.mikuButtonBorder} ${mikuColors.mikuPanelBgSecondary};
            }
            *:active {
                scrollbar-color: ${mikuColors.mikuButtonBgHover} ${mikuColors.mikuPanelBgSecondary} !important;
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
                background: ${mikuColors.mikuPanelBgMain} !important;
                border-radius: 5px !important;
                border: 2px solid ${mikuColors.mikuPanelBorder} !important;
                box-shadow: ${mikuColors.mikuPanelBoxShadow} !important;
            }
            #avatarcontainer { /* Specific styling for avatar container */
                background-color: ${mikuColors.mikuPanelBgSecondary} !important;
                border: 1px solid ${mikuColors.mikuPanelBorder} !important;
                border-radius: 5px !important;
                box-shadow: inset 0 0 5px rgba(0, 192, 204, 0.4) !important;
            }
            #login-leftcol div:first-child { /* Specific div with inline background */
                background: transparent !important;
            }
            div[style*="margin-top: 60px; text-align: right; color: white; font-size: 25px; padding: 20px; background: cornflowerblue; margin-bottom: 20px; padding-right: 100px;"] {
                background: ${mikuColors.mikuPanelBgMain} !important;
                border-radius: 5px !important;
                box-shadow: ${mikuColors.mikuPanelBoxShadow} !important;
            }
            div[style*="border-top: #00b7ff solid 1px; margin-top: 1em; padding: 0.5em; padding-bottom: 0;"] {
                border-top: 1px solid ${mikuColors.mikuPanelBorder} !important;
            }
            /* Modal Header/Footer backgrounds */
            .modal-header, .modal-footer {
                background-color: ${mikuColors.mikuPanelBgSecondary} !important;
                border-color: ${mikuColors.mikuPanelBorder} !important;
                border-radius: 0px !important; /* No default rounded corners for header/footer */
            }
            .popover-body, .dropdown-menu {
                background-color: ${mikuColors.mikuPanelBgMain} !important;
                border: 1px solid ${mikuColors.mikuPanelBorder} !important;
                border-radius: 5px !important;
                box-shadow: ${mikuColors.mikuPanelBoxShadow} !important;
            }
            .dropdown-divider {
                border-color: ${mikuColors.mikuPanelBorder} !important;
                background-color: ${mikuColors.mikuPanelBorder} !important;
            }
            /* Remove box-shadow from levelbar div */
            div[style*="position: absolute;"] {
                box-shadow: none !important;
            }
            .playerlist-exp-bar span {
                background-color: ${mikuColors.mikuProgressBar} !important;
                box-shadow: 0 0 5px ${mikuColors.mikuProgressBar} !important;
            }
            #accountbox:hover *, #avatarcontainer:hover * { /* Consistent hover for account/avatar */
                background: ${mikuColors.mikuButtonBgHover} !important;
                box-shadow: 0 0 10px ${mikuColors.mikuCyan} !important;
            }
            #chatbox_textinput { /* Override aqua border from OCR */
                border: 1px solid ${mikuColors.mikuPanelBorder} !important;
            }
            .invbox { /* Remove background from inventory box */
                background: none !important;
            }
            /* Scoreboard/Table cells (td) in the account settings box */
            #accountbox table.table td {
                background-color: ${mikuColors.mikuPanelBgMain} !important; /* Ensure opaque background for table cells */
                border: none !important; /* Remove internal cell borders */
            }
            #accountbox table.table tr {
                border-bottom: 1px solid ${mikuColors.mikuPanelBorder} !important; /* Add row separators */
            }
            #accountbox table.table tr:last-child {
                border-bottom: none !important;
            }
        `);

        // B. Replace Logo (using JS for direct src change and precise sizing)
        replaceLogo();

        // C. Create and show the Music Toggle Button
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
        if (mikuStyleElement) {
            mikuStyleElement.remove();
            mikuStyleElement = null;
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
                sitelogo.src = mikuColors.logoUrl;
                sitelogo.style.width = 'auto';
                sitelogo.style.height = '160px'; // Set preferred height to 160px
                sitelogo.style.maxWidth = '100%';
                sitelogo.style.objectFit = 'contain';
                sitelogo.style.imageRendering = 'auto'; // Ensure smooth rendering
            }
            if (navbarBrand) {
                navbarBrand.src = mikuColors.logoUrl;
                navbarBrand.style.width = 'auto';
                navbarBrand.style.height = '160px'; // Set preferred height to 160px
                navbarBrand.style.maxWidth = '100%';
                navbarBrand.style.objectFit = 'contain';
                navbarBrand.style.imageRendering = 'auto'; // Ensure smooth rendering
            }

            if (sitelogo || navbarBrand) {
                console.log('Drawaria logo replaced with Miku logo.');
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

    // Music button creation
    function createMusicButton() {
        musicToggleButton = document.createElement('button');
        musicToggleButton.innerHTML = 'Music Off'; // Initial text
        musicToggleButton.style.cssText = `
            position: fixed; bottom: 7px; right: 200px; z-index: 10000;
            background-color: ${mikuColors.mikuButtonBg} !important;
            color: ${mikuColors.mikuLightGray} !important;
            border: 2px solid ${mikuColors.mikuButtonBorder} !important;
            padding: 5px 10px; border-radius: 5px; cursor: pointer;
            font-family: 'Electrolize', sans-serif; font-weight: bold;
            text-shadow: 0 0 4px ${mikuColors.mikuCyan};
            box-shadow: ${mikuColors.mikuButtonBoxShadow};
            transition: background-color 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        `;
        musicToggleButton.onmouseover = function() {
            this.style.backgroundColor = mikuColors.mikuButtonBgHover;
            this.style.borderColor = mikuColors.mikuCyan;
            this.style.boxShadow = `0 0 10px ${mikuColors.mikuCyan}, 0 0 20px ${mikuColors.mikuCyan}`;
            this.style.transform = 'translateY(-1px)';
        };
        musicToggleButton.onmouseout = function() {
            this.style.backgroundColor = mikuColors.mikuButtonBg;
            this.style.borderColor = mikuColors.mikuButtonBorder;
            this.style.boxShadow = mikuColors.mikuButtonBoxShadow;
            this.style.transform = 'none';
        };
        musicToggleButton.onmousedown = function() {
            this.style.backgroundColor = mikuColors.mikuButtonBgActive;
            this.style.borderColor = mikuColors.mikuTeal;
            this.style.boxShadow = `inset 0 0 5px ${mikuColors.mikuTeal}`;
            this.style.transform = 'translateY(1px)';
        };
        musicToggleButton.onmouseup = function() {
            this.style.backgroundColor = mikuColors.mikuButtonBgHover; // Return to hover state
            this.style.borderColor = mikuColors.mikuCyan;
            this.style.boxShadow = `0 0 10px ${mikuColors.mikuCyan}, 0 0 20px ${mikuColors.mikuCyan}`;
            this.style.transform = 'translateY(-1px)';
        };


        document.body.appendChild(musicToggleButton);

        musicToggleButton.addEventListener('click', () => {
            if (audio.backgroundMusic) {
                if (!audio.backgroundMusic.paused) {
                    audio.backgroundMusic.pause();
                    musicToggleButton.textContent = 'Music Off';
                } else {
                    playMusic();
                    musicToggleButton.textContent = 'Music On';
                }
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

    // Add Miku click sound to ALL clickable elements (more robust)
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

    // Remove Miku click sound listener
    function removeClickSound() {
        if (clickSoundHandler) {
            document.body.removeEventListener('click', clickSoundHandler, true);
            clickSoundHandler = null;
        }
    }

    // --- 4. Music and Sound Effects Framework ---
    const audio = { backgroundMusic: null, soundEffect: null };
    function loadAudio() {
        audio.backgroundMusic = new Audio(mikuColors.backgroundMusicUrl);
        audio.backgroundMusic.loop = true;
        audio.backgroundMusic.volume = 0.35; // Slightly louder volume

        audio.soundEffect = new Audio(mikuColors.clickSoundUrl);
        audio.soundEffect.volume = 0.7; // Slightly louder volume
    }
    function playMusic() { if (audio.backgroundMusic && audio.backgroundMusic.paused) { audio.backgroundMusic.play().catch(e => console.log("Music play failed:", e)); } }
    function playSound() { if (audio.soundEffect) { audio.soundEffect.currentTime = 0; audio.soundEffect.play().catch(e => console.log("Sound effect play failed:", e)); } }

    // --- 5. INITIALIZATION ---
    window.addEventListener('load', () => {
        const masterToggleButton = document.createElement('button');
        masterToggleButton.id = 'theme-toggle-button';
        masterToggleButton.style.cssText = `
            position: fixed; bottom: 7px; right: 10px; z-index: 10001;
            background-color: ${mikuColors.mikuButtonBg} !important;
            color: ${mikuColors.mikuLightGray} !important;
            border: 2px solid ${mikuColors.mikuButtonBorder} !important;
            padding: 5px 10px; border-radius: 5px; cursor: pointer;
            font-family: 'Electrolize', sans-serif; font-weight: bold;
            text-shadow: 0 0 4px ${mikuColors.mikuCyan};
            box-shadow: ${mikuColors.mikuButtonBoxShadow};
            transition: background-color 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        `;
        masterToggleButton.onmouseover = function() {
            this.style.backgroundColor = mikuColors.mikuButtonBgHover;
            this.style.borderColor = mikuColors.mikuCyan;
            this.style.boxShadow = `0 0 10px ${mikuColors.mikuCyan}, 0 0 20px ${mikuColors.mikuCyan}`;
            this.style.transform = 'translateY(-1px)';
        };
        masterToggleButton.onmouseout = function() {
            this.style.backgroundColor = mikuColors.mikuButtonBg;
            this.style.borderColor = mikuColors.mikuButtonBorder;
            this.style.boxShadow = mikuColors.mikuButtonBoxShadow;
            this.style.transform = 'none';
        };
        masterToggleButton.onmousedown = function() {
            this.style.backgroundColor = mikuColors.mikuButtonBgActive;
            this.style.borderColor = mikuColors.mikuTeal;
            this.style.boxShadow = `inset 0 0 5px ${mikuColors.mikuTeal}`;
            this.style.transform = 'translateY(1px)';
        };
        masterToggleButton.onmouseup = function() {
            this.style.backgroundColor = mikuColors.mikuButtonBgHover; // Return to hover state
            this.style.borderColor = mikuColors.mikuCyan;
            this.style.boxShadow = `0 0 10px ${mikuColors.mikuCyan}, 0 0 20px ${mikuColors.mikuCyan}`;
            this.style.transform = 'translateY(-1px)';
        };

        document.body.appendChild(masterToggleButton);

        masterToggleButton.addEventListener('click', () => {
            if (isThemeActive) {
                deactivateTheme();
                masterToggleButton.textContent = 'Activate Miku Theme';
            } else {
                activateTheme();
                masterToggleButton.textContent = 'Deactivate Miku Theme';
            }
        });

        loadAudio();
        activateTheme(); // Activate theme by default
        masterToggleButton.textContent = 'Deactivate Miku Theme'; // Set initial text

        console.log('Drawaria.online Hatsune Miku Theme v1.0 Initialized!');

        // Update SVG stroke color to Miku cyan on load and dynamically
        const updateTimerStroke = () => {
            const timerPath = document.querySelector('.timer-bar svg path');
            if (timerPath) {
                timerPath.setAttribute('stroke', mikuColors.mikuProgressBar);
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