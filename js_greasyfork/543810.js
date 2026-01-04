// ==UserScript==
// @name         Drawaria.online Ultimate Matrix Theme
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  Transforms Drawaria.online with realistic Matrix code rain, glowing UI and a master toggle button.
// @author       Infinite & YouTubeDrawaria
// @match        https://drawaria.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        GM_addStyle
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/543810/Drawariaonline%20Ultimate%20Matrix%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/543810/Drawariaonline%20Ultimate%20Matrix%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Global variables to hold theme elements for easy removal ---
    let matrixCanvas = null;
    let matrixAnimationFrame = null; // To store the animation frame ID
    let matrixStyleElement = null;
    let musicToggleButton = null;
    let chatObserver = null; // Variable to hold the chat observer
    let isThemeActive = false;

    // --- 1. THEME ACTIVATION FUNCTION ---
    function activateTheme() {
        if (isThemeActive) return; // Prevent re-activation

        // A. Setup Canvas Rain
        setupMatrixRain();

        // B. Inject CSS Styles
        matrixStyleElement = GM_addStyle(`
            /* Base Body and HTML */
            html, body {
                height: 100%;
                background: transparent !important; /* Changed from #000 to transparent */
                overflow-x: hidden !important; /* Prevent horizontal scrollbar */
                overflow-y: auto !important; /* Allow vertical scrollbar only when needed */
                scrollbar-width: auto; /* Firefox */
                scrollbar-color: #454545 #000; /* Firefox */
            }
            body::before, body::after { content: none !important; }

            /* Allow scrolling on homepage */
            body:has(#main) {
                overflow: auto !important;
            }

            /* Global Text Color and Shadow for Matrix Glow */
            body, #main, #leftbar, #rightbar, .loginbox, .btn, .playerlist-row, .roomlist-item,
            .chatbox_messages, .bubble, .modal-content, .form-control, .input-group-text,
            h1, h2, h3, h4, h5, h6, span, a, div:not(.pcr-current-color), td {
                color: #0F0 !important;
                text-shadow: 0 0 5px rgba(0, 255, 0, 0.7), 0 0 10px rgba(0, 255, 0, 0.5);
                font-family: 'Consolas', 'Monaco', 'Lucida Console', monospace !important;
            }

            /* Set black text for roomlist-item and its children */
            .roomlist-item, .roomlist-playercount, .roomlist-descr, .roomlist-mostlang {
                color: #fff !important;
                text-shadow: none !important;
            }

            /* Apply styles to all #roomlist descendants except .roomlist-highlight and .roomlist-preview with its descendants */
            #roomlist *:not(.roomlist-highlight):not(.roomlist-preview, .roomlist-preview *) {
                scrollbar-width: auto; /* Firefox */
                scrollbar-color: #454545 #000; /* Firefox */
                background: #000000 !important;
            }
            #roomlist *:active {
                scrollbar-color: #333333 #000 !important; /* Firefox: light black thumb on click */
            }

            /* Add green border to the bottom of roomlist-groupheader */
            .roomlist-groupheader {
                border-bottom: 1px solid #0F0 !important;
            }

            /* Change background of the outer div with padding:1em to transparent, fallback to black */
            div[style*="padding:1em"] {
                background: transparent !important;
                background-color: #000 !important; /* Fallback if transparent doesn't work */
            }

            /* Make the Mobile App span background transparent */
            span[style*="margin-bottom: 0.5em; margin-left: 0.5em; background: #0087ff; border-radius: 0.2em; padding: 0 0.5em"] {
                background: none !important;
                background-color: transparent !important;
            }

            /* Make avatarcontainer and avatarcookieswarning background transparent, fallback to black */
            #avatarcontainer, #avatarcookieswarning {
                background: transparent !important;
                background-color: #000 !important; /* Fallback if transparent doesn't work */
            }

            /* Make playerlist-row background transparent, fallback to black */
            .playerlist-row {
                background: transparent !important;
                background-color: #000 !important; /* Fallback if transparent doesn't work */
            }

            /* Change playerlist-row separators (borders) to green */
            #playerlist .playerlist-row {
                border-bottom: 1px solid #0F0 !important;
            }
            #playerlist .page-item:last-child {
                border-bottom: none !important;
            }
            .bubble {
                background: #000000 !important;
            }

            /* Target the spawnedavatar-bubble to set a black background */
            .spawnedavatar-bubble {
                background-color: #000 !important;
            }

            .bubble::before {
                background: #000000 !important;
            }

            div.progress-bar.bg-warning {
                background: #003300 !important;
            }
            .form-control {
                background: #003300 !important;
                border: solid 1px #00cc00 !important;
            }

            /* Style the toggle button background (pseudo-element ::before) */
            .custom-control-label::before {
                background: #004400 !important; /* Green background */
                border: 1px solid #0F0 !important; /* Green border */
                box-shadow: 0 0 5px rgba(0, 255, 0, 0.7) !important; /* Subtle glow */
                transition: all 0.3s ease-in-out !important; /* Smooth transition */
            }
            /* Style when the toggle is checked */
            .custom-control-input:checked ~ .custom-control-label::before {
                background: #00cc00 !important; /* Darker green when checked */
                box-shadow: 0 0 10px rgba(0, 255, 0, 0.9) !important; /* Brighter glow */
            }
            /* Hover state for interactivity */
            .custom-control-label:hover::before {
                box-shadow: 0 0 15px rgba(0, 255, 0, 0.9) !important; /* Enhanced glow on hover */
            }

            .brushcursor {
                background: #000000 !important;
            }
            .playerlist-row {
                background: #000000 !important;
            }

            /* Target the playerlist-row with pgdrawallow to make stripes thinner and more frequent */
            .playerlist-row.playerlist-pgdrawallow {
                background: repeating-linear-gradient(
                    45deg,
                    #006400 0,
                    #006400 5px,
                    transparent 5px,
                    transparent 10px
                ) !important;
            }

            /* Target non-logged-in players (guests) to set green text without glow */
            .playerlist-row:not(.playerlist-name-loggedin) a:not(.playerlist-name-self a) {
                color: #00FF7F !important;
                text-shadow: none !important;
            }

            /* Make popover-body background transparent, fallback to black */
            .popover-body {
                background: transparent !important;
                background-color: #000 !important; /* Fallback if transparent doesn't work */
            }

            /* Make modal-body background transparent, fallback to black */
            .modal-body {
                background: transparent !important;
                background-color: #000 !important; /* Fallback if transparent doesn't work */
            }

            /* Make palettechooser-row background transparent, fallback to black */
            .palettechooser-row {
                background: transparent !important;
                background-color: #000 !important; /* Fallback if transparent doesn't work */
            }

            /* Set background for .palettelist and its children */
            .palettelist {
                background: transparent !important;
                background-color: #000 !important; /* Fallback if transparent doesn't work */
            }

            /* Set background for .page-item.disabled and its children */
            li.page-item.disabled {
                background: transparent !important;
                background-color: #000 !important; /* Fallback if transparent doesn't work */
            }
            li.page-item.disabled .page-link {
                background: transparent !important;
                background-color: #000 !important; /* Fallback if transparent doesn't work */
            }
            li.page-item.disabled .page-link span {
                background: transparent !important;
                background-color: #000 !important; /* Fallback if transparent doesn't work */
            }

            /* Set background for .page-item and its children (and similar elements) */
            li.page-item {
                background: transparent !important;
                background-color: #000 !important; /* Fallback if transparent doesn't work */
            }
            li.page-item .page-link {
                background: transparent !important;
                background-color: #000 !important; /* Fallback if transparent doesn't work */
            }

            /* Make dropdown-menu background transparent, fallback to black */
            .dropdown-menu {
                background: transparent !important;
                background-color: #000 !important; /* Fallback if transparent doesn't work */
            }

            /* Make div with style 'color: gray; padding: 1em; font-size: 0.9em;' background transparent, fallback to black */
            div[style*="color: gray; padding: 1em; font-size: 0.9em"] {
                background: transparent !important;
                background-color: #000 !important; /* Fallback if transparent doesn't work */
            }

            /* Make rowitem background transparent, fallback to black */
            .rowitem {
                background: transparent !important;
                background-color: #000 !important; /* Fallback if transparent doesn't work */
            }

            /* Make pagination-nav background transparent, fallback to black */
            .pagination-nav {
                background: transparent !important;
                background-color: #000 !important; /* Fallback if transparent doesn't work */
            }

            /* Set background for .List.Library and its children */
            .List.Library {
                background: #000 !important; /* Black background */
                background-color: transparent !important; /* Fallback to transparent if black conflicts */
            }
            .List.Library ul {
                background: #000 !important; /* Ensure the ul inherits black */
                background-color: transparent !important; /* Fallback to transparent */
            }
            .List.Library li {
                background: #000 !important; /* Apply black to li elements */
                background-color: transparent !important; /* Fallback to transparent */
            }

            /* Set background for .Canvas and its canvas */
            .Canvas {
                background: #000 !important; /* Black background */
                background-color: transparent !important; /* Fallback to transparent if black conflicts */
            }
            .Canvas canvas {
                background: #000 !important; /* Ensure the canvas inherits black */
                background-color: transparent !important; /* Fallback to transparent */
            }

            /* Set background for .Button elements in header */
            header .Button {
                background: #000 !important; /* Black background */
            }
            /* Target the Button class to add a green border */
            .Button {
                background: #000 !important;
                border: 2px solid #0F0 !important;
                border-radius: 0.25rem !important;
            }

            /* Set background for .Panel and its children */
            .Panel {
                background: #000 !important; /* Black background */
                background-color: transparent !important; /* Fallback to transparent if black conflicts */
                scrollbar-width: auto; /* Firefox */
                scrollbar-color: #454545 #000; /* Firefox */
            }
            .Panel:active {
                scrollbar-color: #333333 #000 !important; /* Firefox: light black thumb on click */
            }
            .Panel .List.Layers {
                background: #000 !important; /* Ensure the List Layers inherits black */
                background-color: transparent !important; /* Fallback to transparent */
            }
            .Panel .List.Layers ul {
                background: #000 !important; /* Ensure the ul inherits black */
                background-color: transparent !important; /* Fallback to transparent */
            }
            .Panel .List.Layers li {
                background: #000 !important; /* Apply black to li elements */
                background-color: transparent !important; /* Fallback to transparent */
            }
            .Panel .primary {
                background: transparent !important;
                background-color: #000 !important; /* Fallback if transparent doesn't work */
            }
            .Panel .primary img, .Panel .primary span, .Panel .primary a {
                background: #000 !important; /* Apply black to child elements */
                background-color: transparent !important; /* Fallback to transparent */
            }
            .Panel footer {
                background: #000 !important; /* Apply black to footer */
                background-color: transparent !important; /* Fallback to transparent */
            }

            /* Set background for .nav-item and its children */
            .nav-item {
                background: transparent !important;
                background-color: #000 !important; /* Fallback if transparent doesn't work */
            }
            .nav-item .nav-link {
                background: transparent !important;
                background-color: #000 !important; /* Fallback if transparent doesn't work */
            }

            /* Set background for .tab-content and its children */
            .tab-content {
                background: transparent !important;
                background-color: #000 !important; /* Fallback if transparent doesn't work */
            }
            .tab-content .tab-pane {
                background: transparent !important;
                background-color: #000 !important; /* Fallback if transparent doesn't work */
            }
            .tab-content .loginbutton, .tab-content .emailbutton, .tab-content .btn {
                background: transparent !important;
                background-color: #000 !important; /* Fallback if transparent doesn't work */
            }
            .tab-content .emailcontainer {
                background: transparent !important;
                background-color: #000 !important; /* Fallback if transparent doesn't work */
            }
            .tab-content .emailcontainer-header {
                background: transparent !important;
                background-color: #000 !important; /* Fallback if transparent doesn't work */
            }
            .tab-content form {
                background: transparent !important;
                background-color: #000 !important; /* Fallback if transparent doesn't work */
            }
            .tab-content .form-group {
                background: transparent !important;
                background-color: #000 !important; /* Fallback if transparent doesn't work */
            }
            .tab-content .form-control, .tab-content .input-group-text {
                background: transparent !important;
                background-color: #000 !important; /* Fallback if transparent doesn't work */
            }

            /* Set background for .logincol and its children */
            .logincol {
                background: transparent !important;
                background-color: #000 !important; /* Fallback if transparent doesn't work */
            }

            /* Set background for .loginbutton-icon and its children */
            .loginbutton-icon {
                background: transparent !important;
                background-color: #000 !important; /* Fallback if transparent doesn't work */
            }

            /* Set background and color for .drawcontrols-button and its children (and similar elements) */
            .drawcontrols-button i {
                color: #000 !important; /* Revert to black */
                background: transparent !important;
            }

            .drawcontrols-settingscontainer {
                background: transparent !important;
                background-color: #000 !important; /* Fallback if transparent doesn't work */
            }

            /* Set background for the div with specific inline styles */
            div[style*="margin-top: 60px; text-align: right; color: white; font-size: 25px; padding: 20px; background: cornflowerblue; margin-bottom: 20px; padding-right: 100px;"] {
                background: #000 !important;
            }
            div[style*="margin-top: 60px; text-align: right; color: white; font-size: 25px; padding: 20px; background: cornflowerblue; margin-bottom: 20px; padding-right: 100px;"] div {
                background: #000 !important;
            }
            div[style*="margin-top: 60px; text-align: right; color: white; font-size: 25px; padding: 20px; background: cornflowerblue; margin-bottom: 20px; padding-right: 100px;"] a {
                background: #000 !important;
            }

            /* Set background to black for specified elements */
            div[style*="padding: 1em; background: aliceblue; border-radius: 0.3em;"] {
                background: #000 !important;
            }
            ul.nav.nav-tabs {
                background: #000 !important;
            }
            li.nav-item {
                background: #000 !important;
            }
            li.nav-item a.nav-link {
                background: #000 !important;
            }
            a.nav-link.active[href="/scoreboards/mostscore/"] {
                background: #000 !important;
            }
            a.nav-link.active[href="/scoreboards/moststars/"] {
                background: #000 !important;
            }
            a.nav-link.active[href="/scoreboards/mostwins/"] {
                background: #000 !important;
            }
            /* Set white border and dark green background on active state, with green hover */
            ul.nav.nav-pills[style*="margin-bottom: 0.5em; margin-top: 0"] li.nav-item:hover {
                background: #006400 !important;
            }
            ul.nav.nav-pills[style*="margin-bottom: 0.5em; margin-top: 0"] li.nav-item:hover a.nav-link {
                background: #006400 !important;
                color: #fff !important; /* Ensure text remains readable */
            }
            ul.nav.nav-pills[style*="margin-bottom: 0.5em; margin-top: 0"] li.nav-item a.nav-link.active {
                background: #006400 !important;
                color: #fff !important; /* Ensure text remains readable */
            }
            div[style*="padding: 0.5em; background: aliceblue; border-bottom: 1px solid #dee2e6!important; border-left: 1px solid #dee2e6!important; border-right: 1px solid #dee2e6!important;"] {
                background: #000 !important;
            }
            ul.nav.nav-pills {
                background: #000 !important;
            }
            div.table-responsive {
                background: #000 !important;
            }
            table.table.border {
                background: #000 !important;
            }
            thead tr {
                background: #000 !important;
            }
            th {
                background: #000 !important;
            }
            tbody tr {
                background: #000 !important;
            }
            td {
                background: #000 !important;
            }
            nav.pagination-nav {
                background: #000 !important;
            }
            ul.pagination.justify-content-center.m-0 {
                background: #000 !important;
            }
            li.page-item {
                background: #000 !important;
            }
            li.page-item a.page-link {
                background: #000 !important;
            }

            /* Set background for the container div with specific inline style */
            div.container[style*="max-width: calc(4 * 300px + (4 * 300px) * (0.02 * 3));"] {
                background: transparent !important;
                background-color: #000 !important; /* Fallback if transparent doesn't work */
            }
            /* Style for active nav-link buttons with green border and green glowing text */
            ul.nav.nav-pills[style*="margin-top: 0;"] li.nav-item a.nav-link.active {
                border: 1px solid #006400 !important;
                color: #90EE90 !important;
                text-shadow: 0 0 5px #90EE90, 0 0 10px #006400 !important; /* Green glowing effect */
            }
            /* Style for nav-link buttons with green glowing text and transparent/black background */
            ul.navbar-nav.mr-auto.mt-2.mt-lg-0 li.nav-item a.nav-link {
                color: #90EE90 !important;
                text-shadow: 0 0 5px #90EE90, 0 0 10px #90EE90 !important; /* Green glowing effect */
            }

            /* Set black background for all grid-item galleryimage divs with the specified style */
            div.grid-item.galleryimage[style*="position: absolute;"] .info {
                background: #000 !important;
            }

            /* Set glowing green effect for buttons within List Layers */
            div.List.Layers ul li a.Button {
                background: #90EE90 !important;
            }
            img.asset[draggable="false"] {
                background: #90EE90 !important;
            }

            /* Set transparent or black background for commentlist div */
            div.commentlist {
                background: transparent !important;
                background-color: #000 !important; /* Fallback if transparent fails */
            }

            /* Set #00000099 background for the specified div and h1 elements */
            div[style*="padding: 2px; background: #005abb6e;"] {
                background-color: #000 !important;
            }
            h1[style*="text-align: center; color: white; margin: 0; background: #ffffff52; padding: 10px; border-radius: 3px;"] {
                background-color: #000 !important;
            }

            /* Set #0000007F background for all elements within the container */
            div.container[style*="margin-bottom: 20px; color:#000000;"] * {
                background: #0000007F !important;
            }
            div.container[style*="margin-bottom: 20px; color:#000000; max-width: calc(4 * 300px + (4 * 300px) * (0.02 * 3)); padding: 0; background: none;"] {
                background: #0000007F !important;
            }

            /* Set black background for the specific container and its descendants, excluding friendscontainer */
            .container > .row.justify-content-center.no-gutters:not(#friendscontainer > .row.justify-content-center.no-gutters) {
                background-color: #000000 !important;
            }
            .container > .row.justify-content-center.no-gutters:not(#friendscontainer > .row.justify-content-center.no-gutters) * {
                background-color: #000000 !important;
            }

            .colorset {
                border: 1px solid #00cc00 !important;
            }

            /* Set green background for social sharing buttons */
            .a2a_kit .a2a_svg {
                background-color: #006400 !important;
            }
            .a2a_kit a:hover .a2a_svg {
                background-color: #006400 !important;
            }
            .a2a_kit a:hover {
                background-color: #006400 !important;
            }

            /* Set black background for the row within friendscontainer */
            #friendscontainer .row.justify-content-center.no-gutters {
                background-color: #000000 !important;
            }

            /* Add green background to child elements of the row within friendscontainer */
            #friendscontainer .row.justify-content-center.no-gutters > * {
                background-color: #003300 !important;
            }

            /* Replace white border with green border around each page-item and its link */
            .pagination-nav .page-item {
                border: 2px solid #006400 !important;
            }
            .pagination-nav .page-item .page-link:hover {
                background-color: #006400 !important;
            }
            .pagination-nav .page-item .page-link {
                border: none !important; /* Remove any border on the link to avoid stacking */
            }
            .pagination-nav .page-item.active .page-link {
                background-color: #003300 !important;
            }

            /* Set green color for dropdown-divider */
            .dropdown-divider {
                border-color: #00cc00 !important;
                background-color: #00cc00 !important;
            }

            /* Set green color for the text of the loginbox-alloptionslink */
            .dropdown-item.loginbox-alloptionslink {
                color: #00cc00 !important;
            }
            /* Change hover background to darker green for dropdown items */
            .dropdown-menu .dropdown-item:hover {
                background-color: #003300 !important;
            }

            /* Change stroke color to green for the specified SVG path */
            svg[viewBox="0 0 1 1"] path[stroke="#673ab7"] {
                stroke: #00cc00 !important;
            }

            /* Set box-shadow to 0 0 30px #00cc00 for the levelbar div */
            div[style*="position: absolute;"] {
                box-shadow: 0 0 30px #00cc00 !important;
            }

            div[style*="border-top: #00b7ff solid 1px; margin-top: 1em; padding: 0.5em; padding-bottom: 0;"] {
                border-top: #00cc00 solid 1px !important;
                }

            /* Add green border around the turnresults-avatar image */
            .turnresults-avatar {
                border: 2px solid #006400 !important;
            }

            div.playerlist-avatar-spawned {
                background: #003300 !important;
            }

            /* --- NEW: Fix chat message background to black --- */
            .chatmessage:nth-child(odd) {
                background: #000 !important;
            }
            .chatmessage:nth-child(even) {
                background: transparent !important;
            }
            .chatmessage.playerchatmessage-highlighted {
                background: #006500 !important;
                box-shadow: none !important; /* Remove any shadow mimicking a border */
            }
            #chatbox_messages .chatmessage.playerchatmessage-highlighted {
                border-bottom: 1px solid #0F0 !important; /* Apply green border */
            }
            /* --- NEW: Change border-top color to green --- */
            #rightbar div[style*="border-top: 1px solid #cde5ff;"] {
                border-top: 1px solid #0F0 !important;
            }
            /* --- NEW: Apply black backgrounds to specific timer classes --- */
            .timer-bg {
                background-color: #000 !important;
            }
            .timer-face {
                background-color: #000 !important;
            }
            .timer-bar {
               background: #006400 !important;
            }

            /* --- NEW: Customize scrollbar for chatbox_messages --- */
            #chatbox_messages {
                scrollbar-width: auto; /* Firefox */
                scrollbar-color: #454545 #000; /* Firefox */
            }
             #chatbox_messages:active {
                scrollbar-color: #333333 #000 !important; /* Firefox: light black thumb on click */
            }
            #chatbox_messages::-webkit-scrollbar {
                width: 8px; /* Width of the scrollbar */
                background-color: #000; /* Track background */
            }
            #chatbox_messages::-webkit-scrollbar-thumb {
                background-color: #0F0; /* Thumb color (green for contrast) */
                border-radius: 4px; /* Rounded edges */
            }
            #chatbox_messages::-webkit-scrollbar-track {
                background-color: #000; /* Track background */
            }

            /* Apply red color to your name and chat message */
            .playerchatmessage-selfname {
                color: #7FFFD4 !important;
            }
            .playerchatmessage-selfname ~ .playerchatmessage-text {
                color: #7FFFD4 !important;
            }

            /* --- NEW: Add green background to specific gesturespicker items --- */
            .gesturespicker-item.gesturespicker-spawnedavataritem.gesturespicker-spawnedavataritem-sep,
            .gesturespicker-item.gesturespicker-spawnedavataritem {
                background-color: #003300 !important;
                border-color: #00cc00;
            }

            /* --- NEW: Change color of playerlist-exp-bar span to green --- */
            .playerlist-exp-bar {
                background:#006400;
            }
            .playerlist-exp-bar span {
                background-color: #00cc00 !important;
            }
            .playerlist-avatar {
                border: 1px solid #00cc00 !important;
                background: transparent !important;
            }

            /* --- NEW: Style for drawcontrols-popupbutton with hover and active --- */
            .drawcontrols-button {
                background: #006500;
            }
            .drawcontrols-popupbutton {
                background: #003300;
                border-color: #00cc00 !important;
                outline: #00cc00 !important;
            }
            .drawcontrols-popupbutton:hover {
                background: #006500;
            }
            .drawcontrols-popupbutton.drawcontrols-popupbutton-active {
                background: #001100 !important;
                box-shadow: none !important; /* Remove any shadow */
            }

            /* --- NEW: Add green border to palettechooser-row and descendants --- */
            .palettechooser-row {
                border: 1px solid #0F0 !important;
            }
            .palettechooser-row .palettechooser-colorset {
                border: 1px solid #0F0 !important;
            }

            /* Target the pcr-app input to change the background to green */
            .pcr-app {
                background: #003300 !important;
            }
            .pcr-result:focus {
                border: 2px solid #0F0 !important;
                box-shadow: none !important;
                border-radius: 0.25rem !important;
            }
            .pcr-type {
                color: #0F0 !important;
                background-color: rgba(0, 50, 0, 0.9) !important;
                border: 2px solid #0F0 !important;
                box-shadow: none !important;
            }
            .pcr-type:focus {
                background: #006400 !important;
            }
            .pcr-type.active {
                background-color: #006400 !important;
            }

            /* Target the inventorydlg-leftpanel to change the right border to green */
            .inventorydlg-leftpanel {
                border-right: 2px solid #0F0 !important;
            }
            .inventorydlg-rightpanel {
                scrollbar-width: auto; /* Firefox */
                scrollbar-color: #454545 #000; /* Firefox */
            }
             .inventorydlg-rightpanel:active {
                scrollbar-color: #333333 #000 !important; /* Firefox: light black thumb on click */
            }

            /* Target the accountbox for green hover effect */
            #accountbox:hover * {
                background: #006400 !important;
            }
            /* Target the avatarcontainer for green hover effect */
            #avatarcontainer:hover * {
                background: #83f28f !important;
            }

            /* Target the dtrTranslatorContainer for green background */
            #dtrTranslatorContainer {
                background-color: #002200 !important;
                scrollbar-width: auto; /* Firefox */
                scrollbar-color: #454545 #000; /* Firefox */
            }
            .dtr-header {
                border-bottom: 1px solid #0F0 !important;
            }
            #dtrSelectedLanguageDisplay {
                background: #003300 !important;
                border: 1px solid #00cc00 !important;
            }
            #dtrDropdownPanel {
                background: #003300 !important;
            }
            #dtrDropdownPanel:active {
                scrollbar-color: #333333 #000 !important; /* Firefox: light black thumb on click */
            }
            #dtrTranslateButton:active, #dtrTranslateButton:focus,
            #dtrSendButton:active, #dtrSendButton:focus, #dtrDropdownPanel {
                border: 2px solid #0F0 !important;
                outline: none !important; /* Remove default outline if present */
            }
            #dtrDropdownPanel .dtr-lang-item:hover {
                background-color: #006400 !important;
            }

            /* Target the number inputs of the cheat-container to set a green background */
            .cheat-row input[type="number"] {
                background-color: #003300 !important;
                color: #00cc00 !important;
            }

            /* Style scrollbar for chatbox_textinput with light black on click */
            #chatbox_textinput {
                scrollbar-width: auto; /* Firefox */
                scrollbar-color: #454545 #000; /* Firefox: thumb/track default */
            }
            #chatbox_textinput:active {
                scrollbar-color: #333333 #000 !important; /* Firefox: light black thumb on click */
            }


            /* --- NEW: Specific Drawaria Color Overrides --- */
            .playerlist-drawerhighlight {
                background-color: rgba(0, 255, 0, 0.4) !important;
                box-shadow: 0 0 25px rgba(0, 255, 0, 1), inset 0 0 15px rgba(150, 255, 150, 0.7) !important;
            }
            .playerchatmessage-highlightable:hover, .playerchatmessage-highlighted,
            .customvotingbox-highlighted, #roomlist, .roomlist-highlight {
                background-color: rgba(0, 255, 0, 0.2) !important;
            }
            .playerlist-name-self a, .playerlist-name-self a:hover { color: #5eff5e !important; text-shadow: 0 0 10px #5eff5e !important; }
            .playerlist-rank-first { color: #9dff9d !important; }
            .systemchatmessage1, .systemchatmessage2, .systemchatmessage3, .systemchatmessage4, .systemchatmessage5,
            .systemchatmessage6, .systemchatmessage7, .systemchatmessage8, .systemchatmessage9 {
                background: none !important;
                color: #9dff9d !important;
                font-style: italic;
            }
            #continueautosaved-run, #continueautosaved-clear, .discordlink {
                background-color: rgba(0, 100, 0, 0.7) !important;
            }
            #continueautosaved-run:hover, #continueautosaved-clear:hover, .discordlink:hover {
                background-color: rgba(0, 150, 0, 0.9) !important;
            }
            /* Remove background from .invbox */
            .invbox {
                background: none !important;
            }

            /* Interface Enhancements & Animations */
            .modal-content, .card-body { background-color: rgba(0, 0, 0, 0.95) !important; }
            .modal-header, .modal-footer { background-color: rgba(0, 50, 0, 0.5) !important; border-color: rgba(0, 255, 0, 0.3) !important; box-shadow: none !important; }
            #leftbar, #rightbar, .loginbox, .roomlist-item, .modal-dialog .modal-content,
            .topbox-content, .accountbox-coins, .playerlist-infobox-notlogged, .chatbox_messages,
            .playerlist-medal, .playerlist-star, .tokenicon,
            #customvotingbox, .accountbox-exp-progress-bg, .accountbox-exp-progress-bar,
            .accountbox-itemscontainer-slot, .inventorydlg-groupview, .inventorydlg-shoplist,
            .inventorydlg-addcoinsview, .musictracks-newtrackbox, .playerlist-turnscore {
                background-color: rgba(0, 50, 0, 0.4) !important;
                border: 1px solid #0F0 !important;
                box-shadow: 0 0 10px rgba(0, 255, 0, 0.5), inset 0 0 5px rgba(0, 255, 0, 0.3) !important;
                border-radius: 8px !important;
                transition: all 0.3s ease-in-out;
            }
            #leftbar, #rightbar, .loginbox { background-color: rgba(0, 50, 0, 0.6) !important; }
            #roomlist, #roomlist .roomlist-header { background: rgba(0, 0, 0, 0.9) !important; border-color: #0F0 !important; box-shadow: 0 0 10px rgba(0, 255, 0, 0.5) !important; }
            .btn, button:not(.pcr-app button), input[type="submit"] { background-color: rgba(0, 100, 0, 0.7) !important; border-color: #0F0 !important; color: #0F0 !important; text-shadow: 0 0 5px rgba(0, 255, 0, 0.8) !important; box-shadow: 0 0 8px rgba(0, 255, 0, 0.6) !important; transition: all 0.3s ease-in-out; }
            .btn:hover, button:not(.pcr-app button):hover, input[type="submit"]:hover { background-color: rgba(0, 150, 0, 0.9) !important; box-shadow: 0 0 15px rgba(0, 255, 0, 0.9), inset 0 0 7px rgba(0, 255, 0, 0.5) !important; transform: translateY(-2px); }
            .btn:active, button:not(.pcr-app button):active, input[type="submit"]:active { background-color: rgba(0, 200, 0, 1) !important; box-shadow: 0 0 20px rgba(0, 255, 0, 1), inset 0 0 10px rgba(0, 255, 0, 0.7) !important; transform: translateY(0); }
            input[type="text"], textarea, select { background-color: rgba(0, 20, 0, 0.8) !important; border: 1px solid #0F0 !important; color: #0F0 !important; text-shadow: 0 0 3px rgba(0, 255, 0, 0.7); box-shadow: inset 0 0 5px rgba(0, 255, 0, 0.5); transition: all 0.3s ease-in-out; }
            input[type="text"]:focus, textarea:focus, select:focus { outline: none !important; box-shadow: inset 0 0 10px rgba(0, 255, 0, 0.9), 0 0 15px rgba(0, 255, 0, 0.7); }
            .sitelogo img {
                filter: brightness(1) hue-rotate(100deg) saturate(2);
                transition: filter 0.5s ease-in-out;
            }
            .navbar-brand img {
                /* Usado para mantener consistencia, ajusta hue-rotate según necesites */
                filter: brightness(1) hue-rotate(100deg) saturate(2);
                transition: filter 0.5s ease-in-out;
            }
            .sitelogo img:hover {
                filter: brightness(1) hue-rotate(120deg) saturate(2);
            }
            .navbar-brand img:hover {
                /* Ajusta hue-rotate para verde más puro, sube saturate si necesitas más intensidad */
                filter: brightness(1) hue-rotate(120deg) saturate(2);
            }

            /* Hide original backgrounds that conflict */
            body[style*="background:url(/img/pattern.png)"], [style*="background:#f1f9f5"], [style*="background:#0087ff"], [style*="background:#00b7ff"], [style*="background:rgba(0,183,255,.3)"], [style*="background:#e1e1e1"], [style*="background:rgba(255,255,255,0.2)"], [style*="background:beige"], [style*="background:#ffffe5"], [style*="background:#ffeb3b"] { background: none !important; background-color: transparent !important; box-shadow: none !important; border-color: transparent !important; }

            /* Particles for a subtle glow effect */
            .matrix-particle { position: absolute; background: rgba(0, 255, 0, 0.7); border-radius: 50%; opacity: 0; pointer-events: none; box-shadow: 0 0 10px rgba(0, 255, 0, 0.9); animation: particleFade 2s forwards infinite; width: 5px; height: 5px; transform: translate(-50%, -50%); }
            @keyframes particleFade { 0% { transform: scale(0.1); opacity: 0; } 50% { transform: scale(1); opacity: 0.7; } 100% { transform: scale(0.1); opacity: 0; } }
        `);

        // C. Add Particles to UI Elements
        addParticles();

        // D. Create and show the Music Toggle Button
        createMusicButton();

        // E. Activate Chat Auto-Scroller with conditional logic
        activateChatScroller();

        isThemeActive = true;
    }

    // --- 2. THEME DEACTIVATION FUNCTION ---
    function deactivateTheme() {
        if (!isThemeActive) return;

        // A. Remove Canvas and stop animation
        if (matrixCanvas) {
            if (matrixAnimationFrame) {
                cancelAnimationFrame(matrixAnimationFrame);
                matrixAnimationFrame = null;
            }
            matrixCanvas.remove();
            matrixCanvas = null;
        }

        // B. Remove Injected Stylesheet
        if (matrixStyleElement) {
            matrixStyleElement.remove();
            matrixStyleElement = null;
        }

        // C. Remove all added particles
        document.querySelectorAll('.matrix-particle').forEach(p => p.remove());

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

        // F. Stop music if playing
        if (audio.backgroundMusic) {
            audio.backgroundMusic.pause();
        }

        isThemeActive = false;
    }

    // --- 3. HELPER FUNCTIONS ---
    // Matrix Rain Logic
    function setupMatrixRain() {
        matrixCanvas = document.createElement('canvas');
        matrixCanvas.id = 'matrixBackgroundCanvas';
        matrixCanvas.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -100;';
        document.body.appendChild(matrixCanvas);

        const ctx = matrixCanvas.getContext('2d');
        let W, H;
        let streams = [];
        const fontSize = 16;
        const characters = '0123456789アァカサタナハマヤラ0123456789ワガザダバパイィキシ0123456789チニヒミリヰギジヂビ0123456789ピウゥクスツヌフムユ0123456789ルグズヅブプエェケセ0123456789テネヘメレヱゲゼデベ0123456789ペオォコソトノホモヨ0123456789ロヲゴゾドボポヴッン';

        class Stream {
            constructor(x) { this.x = x; this.y = Math.random() * -H; this.speed = Math.random() * 5 + 2; this.length = Math.floor(Math.random() * 20) + 10; this.symbols = []; }
            generateSymbols() { this.symbols = []; for (let i = 0; i < this.length; i++) { this.symbols.push(characters.charAt(Math.floor(Math.random() * characters.length))); } }
            draw() {
                this.symbols.forEach((symbol, index) => {
                    if (index === 0) { ctx.fillStyle = '#cfffc1'; ctx.shadowBlur = 10; ctx.shadowColor = 'rgba(200, 255, 200, 0.9)'; }
                    else { const opacity = 1 - (index / this.length) * 0.9; ctx.fillStyle = `rgba(0, 255, 0, ${opacity})`; ctx.shadowBlur = 5; ctx.shadowColor = `rgba(0, 255, 0, ${opacity * 0.7})`; }
                    ctx.fillText(symbol, this.x, this.y - index * fontSize);
                });
                ctx.shadowBlur = 0; ctx.shadowColor = 'transparent'; this.update();
            }
            update() { this.y += this.speed; if (this.y - this.length * fontSize > H) { this.y = Math.random() * -H * 0.5; this.speed = Math.random() * 2 + 1; this.length = Math.floor(Math.random() * 20) + 10; this.generateSymbols(); } }
        }

        function initialize() {
            W = matrixCanvas.width = window.innerWidth; H = matrixCanvas.height = window.innerHeight;
            let columns = Math.floor(W / fontSize); streams = [];
            for (let i = 0; i < columns; i++) { const stream = new Stream(i * fontSize); stream.generateSymbols(); streams.push(stream); }
            ctx.font = `${fontSize}px monospace`;
        }
        window.addEventListener('resize', initialize); initialize();

        function animate() {
            if (!matrixCanvas) return; // Stop animation if canvas is removed
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; ctx.fillRect(0, 0, W, H);
            streams.forEach(stream => stream.draw());
            matrixAnimationFrame = requestAnimationFrame(animate);
        }
        matrixAnimationFrame = requestAnimationFrame(animate);
    }

    // Particle creation logic
    function addParticles() {
        const elementsForGlow = document.querySelectorAll('body, #quickplay, #createroom, #joinplayground, .btn, #login-midcol, #login-rightcol, #rightbar, .roomlist-item');
        elementsForGlow.forEach(el => {
            if (window.getComputedStyle(el).position === 'static') { el.style.position = 'relative'; }
            // Removed overflow: hidden to allow scrolling
            for (let i = 0; i < 3; i++) {
                const particle = document.createElement('div');
                particle.className = 'matrix-particle';
                particle.style.left = `${Math.random() * 100}%`;
                particle.style.top = `${Math.random() * 100}%`;
                particle.style.animationDelay = `${Math.random() * 2}s`;
                el.appendChild(particle);
            }
        });
    }

    // Music button creation
    function createMusicButton() {
        musicToggleButton = document.createElement('button');
        musicToggleButton.innerHTML = 'PM';
        musicToggleButton.style.cssText = `position: fixed; bottom: 7px; right: 227px; z-index: 10000; background-color: rgba(0, 100, 0, 0.8) !important; color: #0F0 !important; border: 1px solid #0F0 !important; padding: 5px; border-radius: 5px; cursor: pointer; text-shadow: 0 0 5px rgba(0, 255, 0, 0.7);`;
        document.body.appendChild(musicToggleButton);

        musicToggleButton.addEventListener('click', () => {
            if (audio.backgroundMusic) {
                if (!audio.backgroundMusic.paused) {
                    audio.backgroundMusic.pause(); musicToggleButton.textContent = 'PM';
                } else {
                    playMusic(); musicToggleButton.textContent = 'SM';
                }
            }
        });
    }

    // Chat Auto-Scroller function with conditional scrolling
    function activateChatScroller() {
        const chatBox = document.getElementById('chatbox_messages');
        if (!chatBox) return;

        const scrollToBottomIfAtBottom = () => {
            const isAtBottom = chatBox.scrollHeight - chatBox.scrollTop === chatBox.clientHeight;
            if (isAtBottom) {
                chatBox.scrollTop = chatBox.scrollHeight;
            }
        };

        scrollToBottomIfAtBottom();

        chatObserver = new MutationObserver(scrollToBottomIfAtBottom);
        chatObserver.observe(chatBox, { childList: true });
    }

    // --- 4. Music and Sound Effects Framework ---
    const audio = { backgroundMusic: null, soundEffect: null };
    function loadAudio() {
        audio.backgroundMusic = new Audio('https://www.myinstants.com/media/sounds/matrix-new.mp3'); // Old music theme: https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3
        audio.backgroundMusic.loop = true; audio.backgroundMusic.volume = 0.2;
        audio.soundEffect = new Audio('https://freesound.org/data/previews/387/387222_3879201-lq.mp3');
        audio.soundEffect.volume = 0.5;
    }
    function playMusic() { if (audio.backgroundMusic && audio.backgroundMusic.paused) { audio.backgroundMusic.play().catch(e => console.log("Music play failed:", e)); } }
    function playSound() { if (audio.soundEffect) { audio.soundEffect.currentTime = 0; audio.soundEffect.play().catch(e => console.log("Sound effect play failed:", e)); } }

    // --- 5. INITIALIZATION ---
    window.addEventListener('load', () => {
        const masterToggleButton = document.createElement('button');
        masterToggleButton.id = 'theme-toggle-button';
        masterToggleButton.style.cssText = `position: fixed; bottom: 7px; right: 10px; z-index: 10001; background-color: #000 !important; color: #0F0 !important; border: 2px solid #0F0 !important; padding: 5px; border-radius: 8px; cursor: pointer; font-family: monospace; font-weight: bold; text-shadow: 0 0 8px #0F0;`;
        document.body.appendChild(masterToggleButton);

        masterToggleButton.addEventListener('click', () => {
            if (isThemeActive) {
                deactivateTheme();
                masterToggleButton.textContent = 'Activate Matrix Theme';
            } else {
                activateTheme();
                masterToggleButton.textContent = 'Deactivate Matrix Theme';
            }
        });

        loadAudio();
        //activateTheme(); // Removed automatic theme activation
        masterToggleButton.textContent = 'Activate Matrix Theme';

        console.log('Drawaria.online Ultimate Matrix Theme v3.2 Activated!');

        // --- NEW: Update SVG stroke color to green ---
        const updateTimerStroke = () => {
            const timerPath = document.querySelector('.timer-bar svg path');
            if (timerPath) {
                timerPath.setAttribute('stroke', '#0F0');
            }
        };
        updateTimerStroke(); // Initial update
        //setInterval(updateTimerStroke, 1000); // Check every second
        //const observer = new MutationObserver(updateTimerStroke);
        //observer.observe(document.body, { childList: true, subtree: true }); // Watch for DOM changes
    });
})();
