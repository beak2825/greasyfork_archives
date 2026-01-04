// ==UserScript==
// @name         Tema Preto Roxo
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Aplica um tema preto e roxo ao site do Kogama
// @author       eminent
// @match        https://kogama.com.br/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/498978/Tema%20Preto%20Roxo.user.js
// @updateURL https://update.greasyfork.org/scripts/498978/Tema%20Preto%20Roxo.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const customThemeCSS = `
        body {
            background: linear-gradient(to bottom, #1c1c1c, #000000) !important;
            color: #dcdcdc !important;
        }

        footer {
            background-color: #0d0d0d !important;
            color: #dcdcdc !important;
        }

        .links-container {
            color: #dcdcdc !important;
        }

        .links-container a {
            color: #FFFFFF !important;
        }

        .links-container a i {
            color: inherit !important;
        }

        .icon-gamepad,
        .icon-cubes,
        .icon-basket,
        .icon-news,
        .icon-crown {
            color: #AC26EE !important;
        }

        #mobile-page-content,
        #content-container {
            background: linear-gradient(to bottom, #1c1c1c, #000000) !important;
            color: #dcdcdc !important;
        }

        #footer-header,
        #footer-company,
        #footer-about,
        #footer-links {
            background-color: #0d0d0d !important;
            color: #FFFFF !important;
        }

        #pageheader {
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .pageheader-inner {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
        }
        #nav-menu {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-grow: 1;
        }
        #nav-menu ol {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0;
            margin: 0;
            list-style: none;
        }
        #nav-menu li {
            margin: 0 10px;
        }
        #header-xp-level {
            visibility: hidden;
        }

        .data.tool-tip .icon-gamepad {
            color: #E3E1D3 !important;
        }
    `;

    GM_addStyle(customThemeCSS);
})();
