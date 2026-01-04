// ==UserScript==
// @name         Coffee Shop Youtube Theme
// @namespace    https://www.example.com/
// @version      1.0
// @description  Custom Coffee Shop theme for YouTube
// @author       Sheraru
// @match        https://www.youtube.com/*
// @match        https://www.youtube.com/*
// @match        https://apis.google.com/u/0/_/hovercard*
// @grant        GM_addStyle
// @license      NONE
// @downloadURL https://update.greasyfork.org/scripts/516397/Coffee%20Shop%20Youtube%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/516397/Coffee%20Shop%20Youtube%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add the Coffee Shop theme styles
    GM_addStyle(`
        /* General body background */
        html:not(#⁠), body>div, body>table, [role="navigation"], [role="dialog"], #body-container>div, 
        [aria-expanded="true"]:not(.ytp-button), [class*="tooltip"]:not(.ytp-tooltip-duration):not(.ytp-tooltip-bg):not(.ytp-tooltip-text-wrapper):not([class*="arrow"]):not(button), 
        [role="menu"], .ytp-popup, .videoAdUiPreSkipButton, .videoAdUiAdInfoPopup {
            background: url(https://cdn.discordapp.com/attachments/792737262597177374/1115037037372907600/Coffee_shop.gif) fixed #000!important;
            background-size: cover!important;
        }

        /* Search bar border */
        #masthead-search-terms, form.channels-search:not(#​) {
            border: 1px solid #993333!important;
        }

        #masthead-search-terms.gsfe_a {
            border: 1px solid #A0A0A0!important;
        }

        #masthead-search-terms.gsfe_b {
            border: 1px solid #4D90FE!important;
        }

        /* Text shadow for all text elements */
        :not(textarea):not(input):not([contenteditable]) {
            text-shadow: 0 0.05em rgba(0,0,0,.5), 0 -0.05em rgba(0,0,0,.5), 0.05em 0 rgba(0,0,0,.5), -0.05em 0 rgba(0,0,0,.5)!important;
        }

        /* Make most elements transparent and white text */
        :not([class*="video-extras-sparkbar"]):not([class^="ytp-"]):not(.sidebar):not(.video-time):not([class^="html5-"]):not(.yt-uix-button-primary):not(label):not(.toggle):not(.branding-context-container-inner):not(.iv-drawer) {
            background-color: transparent!important;
            color: #FFFFFF!important;
        }

        /* Load more button */
        .load-more-button {
            background: 1px solid #993333!important;
        }

        /* Alert and content-region */
        [role="alert"], .content-region, .yt-uix-checkbox-on-off .checked:before {
            display: solid!important;
            color: #993333!important;
        }

        /* Links colors */
        :not(#​) :link {
            color: #cc0000!important;
        }

        :not(#​) :visited {
            color: #660000!important;
        }

        /* Select elements background */
        :not(#​) select {
            background: black!important;
        }

        /* Invert YouTube logo and other icons */
        [href="/"][id*="logo"], :not(.ytp-volume-slider-handle):not(.yt-uix-playlistlike):before, .yt-uix-button-icon-material-upload, .yt-uix-button-icon-bell, 
        .yt-uix-button-icon-wrapper>.yt-sprite, .autoplay-info-icon, .search-button>.yt-uix-button-content, 
        #appbar-guide-button .yt-uix-button-icon-wrapper, .yt-uix-button-shelf-slider-pager {
            -webkit-filter: invert(1)hue-rotate(180deg);
            filter: invert(1)hue-rotate(180deg);
        }

        /* Remove background images for certain elements */
        .yt-uix-form-input-select, [class$="container"], #yt-comments-paginator {
            background-image: none!important;
        }

        /* Remove border on certain elements */
        :not(h2):not(button):not(.comment-simplebox-renderer-collapsed-content), #footer-container button, .yt-uix-button-shelf-slider-pager {
            border: none!important;
        }

        /* Box shadow on certain elements */
        textarea, [contenteditable="true"], [type="text"]:not(#masthead-search-term), [role="menu"]:not(.guide-user-links):not(.ytp-panel-menu), 
        #footer-container .yt-uix-button-default, .yt-uix-clickcard-card-visible, #watch-appbar-playlist, .comment-simplebox-frame, body>table {
            box-shadow: inset 0px 0px 0px 1px rgba(102,51,0)!important;
        }

        /* Remove search box shadow */
        #masthead-search-terms {
            box-shadow: none!important;
        }
    `);

    // Custom style for Google's hovercard
    if (window.location.href.match("https://apis.google.com/u/0/_/hovercard.*")) {
        GM_addStyle(`
            * {
                background-color: #000!important;
                color: #fff!important;
                border-color: #000!important;
            }
        `);
    }
})();
