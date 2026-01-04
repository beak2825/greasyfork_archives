// ==UserScript==
// @name         IMVU Darkmode
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Makes IMVU almost entirely dark mode with readable text
// @author       Pythius
// @match        https://www.imvu.com/*
// @match        https://support.imvu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=imvu.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540428/IMVU%20Darkmode.user.js
// @updateURL https://update.greasyfork.org/scripts/540428/IMVU%20Darkmode.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const background1 = '#121212';
    const background2 = '#1e1e1e';
    const text = '#0d9200';
    const highlight = '#a7e08e';
    const hover = '#3e3e3e';
    const lightBg = '#191919';

    const baseStyle = `
        body, .content, .bd, .message-panel-presenter, .conversation-list-container,
        #ft, .pagenav.top, #products, .navline,
        #general-info.panel-content.clear.panel-open,
        #profile-content.panel-content.clear.panel-open,
        #panel-content.clear.panel-open,
        #bottom-inner.bottom-inner2.newsdiv,
        #left-column.main-box, .widget-product-wide, .credits-line,
        .inventory_holder, #product-details,
        #container-fluid.px-0.fw-nav-wrapper.fixed-top,
        .imvu-nav-box.shade, #imvu-body.yui-u.first,
        #narrow.imvu-nav-box.shade, #sidebar, #updates_sumamry,
        #imvu-search-form.shade, #imvu-search-form.shade table,
        .yui-b {
            background-color: ${background2} !important;
            color: ${text} !important;
        }

        h1, h2, h3, h4, h5, h6, a {
            color: ${text} !important;
        }

        a {
            text-decoration: none !important;
        }

        input[type="text"], input[type="password"], textarea, select {
            background-color: ${background2} !important;
            color: ${text} !important;
            border: 1px solid ${text} !important;
        }

        button, input[type="button"], input[type="submit"] {
            background-color: #2e2e2e !important;
            color: ${text} !important;
            border: 1px solid ${text} !important;
            transition: background-color 0.2s ease !important;
        }

        button:hover, input[type="button"]:hover, input[type="submit"]:hover {
            background-color: ${hover} !important;
        }

        table, table th, table td {
            background-color: ${background2} !important;
            color: ${text} !important;
            border-color: ${text} !important;
        }

        table td {
            background-color: ${lightBg} !important;
            color: ${highlight} !important;
        }

        .credits-line {
            color: ${background2} !important;
        }

        .price span[style*="text-decoration:line-through"],
        .notranslate.text span[style*="text-decoration:line-through"] {
            color: ${text} !important;
        }

        #narrow.imvu-nav-box.shade .widget_title {
            color: ${text} !important;
        }
    `;

    const tierStyle = `
        .tier table:first-child {
            margin-top: 32px !important;
        }

        .tier table {
            margin-bottom: 16px !important;
            border: 1px solid ${text} !important;
            border-spacing: 1px !important;
            border-collapse: collapse !important;
        }

        .tier .headercell,
        .tier th {
            font-weight: bold !important;
            background-color: ${background2} !important;
            color: ${text} !important;
        }

        .tier .headercell { font-size: 12pt !important; padding: 8px 4px !important; }
        .tier th { font-size: 10pt !important; padding: 4px 2px !important; }

        .tier td {
            padding: 2px !important;
            margin: 1px !important;
            color: ${highlight} !important;
        }

        .tier tr.accent-row {
            background-color: ${lightBg} !important;
            border-top: 1px solid ${text} !important;
            border-bottom: 1px solid ${text} !important;
        }

        .tier tr:not(.accent-row) {
            background-color: ${background1} !important;
        }

        .tier td:first-child {
            width: 260px !important;
        }

        .tier th:nth-child(n+2):nth-child(-n+5),
        .tier td:nth-child(n+2):nth-child(-n+5) {
            width: 140px !important;
            text-align: center !important;
        }

        .tier td:last-child,
        .tier tr:last-child td {
            font-weight: bold !important;
        }

        .tier tr:last-child td {
            font-size: 11pt !important;
            background-color: ${background2} !important;
            padding: 8px 2px !important;
            color: ${text} !important;
        }

        .tier > h3 {
            font-weight: bold !important;
            font-size: 16pt !important;
            color: ${text} !important;
        }
    `;

    const style = document.createElement('style');
    style.textContent = baseStyle + tierStyle;
    document.head.appendChild(style);

})();
