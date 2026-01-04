// ==UserScript==
// @name         Stremio Custom Styles (Updated)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Apply updated custom styles to the Stremio web player
// @author       You
// @match        https://web.stremio.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/514075/Stremio%20Custom%20Styles%20%28Updated%29.user.js
// @updateURL https://update.greasyfork.org/scripts/514075/Stremio%20Custom%20Styles%20%28Updated%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .seek-bar-I7WeY .track-jWhBI {
            background-color: #555555 !important;
            height: 5px !important;
        }
        .seek-bar-I7WeY .track-after-iD0ee {
            background-color: #ffffff !important;
            height: 5px !important;
        }
        .seek-bar-I7WeY .thumb-tfDk6 {
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.2s ease, visibility 0.2s ease;
            width: 15px !important;
            height: 15px !important;
        }
        .seek-bar-I7WeY:hover .thumb-tfDk6 {
            opacity: 1;
            visibility: visible;
        }
        .seek-bar-container-JGGTa .slider-hBDOf .thumb-tfDk6:after {
            border-radius: 100%;
            bottom: 0;
            box-shadow: 0 0 0 0.25rem rgba(0, 0, 0, 0);
            content: "";
            filter: brightness(100%);
            left: 0;
            position: absolute;
            right: 0;
            top: 0;
            background-color: transparent;
        }
        .control-bar-buttons-menu-container-M6L0_ .control-bar-button-FQUsj:nth-of-type(1) {
            display: none;
        }
        .control-bar-buttons-menu-container-M6L0_ .control-bar-button-FQUsj:nth-of-type(2) {
            display: none;
        }
        .control-bar-buttons-menu-container-M6L0_ .control-bar-button-FQUsj:nth-of-type(3) {
            display: none;
        }
        .control-bar-buttons-menu-container-M6L0_ .control-bar-button-FQUsj:nth-of-type(4) {
            display: none;
        }
        .volume-slider-U9jfo {
            display: none;
        }
        .title-_UxXH {
            position: fixed;
            bottom: 95% !important;
            left: 50%;
            transform: translateX(-50%);
            text-align: center;
            padding: 10px;
            border-radius: 5px;
        }
        nav.layer-qalDW, nav.layer-qalDW * {
            filter: none !important;
            z-index: 9999 !important;
        }
        .toasts-container-oKECy > * {
            display: none;
        }
        :root {
            --secondary-background-color: #111111;
            --primary-accent-color: #dcdcdc;
            --secondary-accent-color: #dcdcdc;
            --quaternary-accent-color: #dcdcdc;
            --modal-background-color: #111111;
            --outer-glow: 0px 0px 30px rgba(0, 0, 0, .37);
        }
        .progress-bar-layer-r81Qx .progress-bar-E3QY9 {
            background-color: #dcdcdc !important;
        }
        .control-bar-button-FQUsj:nth-of-type(5) {
            order: 3;
        }
        .control-bar-button-FQUsj:nth-of-type(6) {
            order: 2;
        }
        .control-bar-button-FQUsj:nth-of-type(7) {
            order: 4;
        }
    `);
})();

