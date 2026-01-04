// ==UserScript==
// @name         DarkMode
// @namespace    http://tampermonkey.net/
// @version      2025-04-20
// @description  Enable dark mode for CSKH-Game page
// @author       phuchai.huynh & ChatGPT
// @match        http://game-cskh.ved.com.vn/index.php?page=ticket_web_detail&ticket_web_id=*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533616/DarkMode.user.js
// @updateURL https://update.greasyfork.org/scripts/533616/DarkMode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const darkModeCSS = `
    body, html {
    background-color: #1e1e1e !important;
    color: #e3e3e3 !important;
    }

    .field_label_css {
    color: #e3e3e3 !important;
    }

    header, nav, footer, section, div, article, aside, main, td.page_body {
    background-color: #2c2c2c !important;
    color: #e3e3e3 !important;
    }

    input, textarea, select, button, div.input_css {
    background-color: #3b3b3b !important;
    color: #e3e3e3 !important;
    border: 1px solid #666 !important;
    }

    ::placeholder {
    color: #bbbbbb !important;
    }

    * {
    border-color: #444 !important;
    }

    div.list_holder {
    background-color: #2b2b2b !important;
    color: #e3e3e3 !important;
    }

    div.list_holder table {
    width: 100%;
    border-collapse: collapse;
    background-color: #2f2f2f !important;
    color: #e3e3e3 !important;
    }

    div.list_holder th,
    div.list_holder td {
    border: 1px solid #444 !important;
    }

    div.list_holder th {
    background-color: #3a3a3a !important;
    font-weight: bold;
    }

    div.list_holder tr:nth-child(even) {
    background-color: #333 !important;
    }

    div.list_holder tr:nth-child(odd) {
    background-color: #2e2e2e !important;
    }

    div.list_holder tr:hover {
    background-color: #444 !important;
    }

    div.footer, td.list_header {
    border: 1px solid #444 !important;
    background: #222 !important;
    color: #eee;
    font-weight: bold;
    }

    div.bright_blue_body a,
    #customer_info_detail_form a {
    background: #808080 !important;
    color: black !important;
    }

    div.bright_blue_body a.current,
    #customer_info_detail_form a.current {
    background: #efefef !important;
    }

    div.bright_blue_body a:hover,
    #customer_info_detail_form a:hover {
    background: #b0b0b0 !important;
    }

    #ticket_request_panel fieldset {
    background: #360000 !important;
    }
    `;

    GM_addStyle(darkModeCSS);
})();