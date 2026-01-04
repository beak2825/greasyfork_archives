// ==UserScript==
// @name         Canvas Dark Mode for VT
// @namespace    https://your-namespace-here.com
// @version      1.1
// @description  A dark mode theme for canvas.vt.edu
// @author       Your Name
// @match        *://canvas.vt.edu/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/500720/Canvas%20Dark%20Mode%20for%20VT.user.js
// @updateURL https://update.greasyfork.org/scripts/500720/Canvas%20Dark%20Mode%20for%20VT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const darkModeCSS = `
        body, .ic-app-header, .ic-app-nav-toggle-and-crumbs, .ic-nav-global, .ic-nav-global__menu-list, .ic-app-nav-toggle-and-crumbs__icon, .ic-app-header__main-navigation, .ic-app-header__secondary-navigation, .ic-app-header__main-navigation a, .ic-app-header__main-navigation span, .ic-NavMenu-list-item, .ic-NavMenu-list-item__text, .ic-NavMenu-list-item__badge, .ic-notification, .ic-notification__icon, .ic-notification__text, .ic-notification__content, input, select, textarea, button, .Button, .btn, a, .ui-widget-content {
            background-color: #2c2c2c !important;
            color: #cfcfcf !important;
        }
        .ic-app-header__main-navigation, .ic-app-header__secondary-navigation, .ic-nav-global__menu-list, .ic-app-nav-toggle-and-crumbs, .ic-notification {
            background-color: #1a1a1a !important;
        }
        .ic-app-header__main-navigation a:hover, .ic-app-nav-toggle-and-crumbs__icon:hover, .ic-NavMenu-list-item__text:hover, .ic-NavMenu-list-item__badge:hover, .ic-notification:hover, button:hover, .Button:hover, .btn:hover, a:hover {
            color: #fff !important;
        }
        input, select, textarea {
            background-color: #1a1a1a !important;
            border: 1px solid #444 !important;
        }
        input:focus, select:focus, textarea:focus {
            border-color: #666 !important;
            outline: none !important;
        }
        button, .Button, .btn {
            background-color: #444 !important;
            border: none !important;
        }
        .ic-NavMenu-list-item {
            background-color: #1a1a1a !important;
        }
        .ic-NavMenu-list-item:hover {
            background-color: #333 !important;
        }
        .ui-widget-content {
            background: #2c2c2c !important;
        }
        .ic-app-header__main-navigation a, .ic-app-header__main-navigation span, .ic-nav-global__menu-list a {
            color: #cfcfcf !important;
        }
        .ic-nav-global__menu-list a:hover {
            color: #fff !important;
        }
        .ic-app-header__main-navigation a:hover {
            color: #fff !important;
        }
    `;

    const style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(darkModeCSS));

    document.head.appendChild(style);
})();
