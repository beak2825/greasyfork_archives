// ==UserScript==
// @name         Tema Flamengo
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Aplica um tema vermelho e preto ao site do Kogama
// @author       eminent
// @match        https://kogama.com.br/*
// @grant        GM_addStyle
// @license      Krypta
// @downloadURL https://update.greasyfork.org/scripts/498982/Tema%20Flamengo.user.js
// @updateURL https://update.greasyfork.org/scripts/498982/Tema%20Flamengo.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const customThemeCSS = `
        body {
            background: linear-gradient(135deg, #2B0000 25%, #4B0000 50%, #8B0000 75%, #B22222 100%) !important;
            color: #FFFFFF !important;
        }

        footer {
            background-color: #2B0000 !important;
            color: #FFFFFF !important;
        }

        .links-container {
            color: #FFFFFF !important;
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
            color: #FF0000 !important;
        }

        #mobile-page-content,
        #content-container {
            background: linear-gradient(135deg, #2B0000 25%, #4B0000 50%, #8B0000 75%, #B22222 100%) !important;
            color: #FFFFFF !important;
        }

        .logo-image {
            background-image: url('https://cdn.discordapp.com/attachments/1245554054613041268/1255555671349526528/6eefef244382fab016f75de0a0c29b3d-removebg-preview.png?ex=667d8ed7&is=667c3d57&hm=67054c5425b7827cc86cf2de830156379ac015afeedd415f726f48ca6642f5bc&') !important;
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
        }

        #footer-header,
        #footer-company,
        #footer-about,
        #footer-links {
            background-color: #2B0000 !important;
            color: #FFFFFF !important;
        }

        .data.tool-tip .icon-gamepad {
            color: #FFFFFF !important;
        }
    `;

    GM_addStyle(customThemeCSS);
})();