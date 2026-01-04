// ==UserScript==
// @name         Tema Krypta
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Aplica um tema com cores da Krypta ao site do Kogama
// @author       eminent
// @match        https://kogama.com.br/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/498568/Tema%20Krypta.user.js
// @updateURL https://update.greasyfork.org/scripts/498568/Tema%20Krypta.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const newLogoURL = 'https://cdn.discordapp.com/attachments/1236439431574065162/1253841882463866912/krypta.png?ex=667752c0&is=66760140&hm=33ea6f0df57cb049c7cf29620f3b783deafcb148e51cea4a14107c962c5962d9&';

    const logoCSS = `
        .logo .logo-image {
            background-image: url('${newLogoURL}') !important;
            background-size: contain !important;
            background-repeat: no-repeat !important;
            width: 100px;
            height: 50px;
        }
    `;

    const darkThemeCSS = `
        #game-index, #profile-page {
            background: linear-gradient(to bottom, #004d00, #004d00) !important;
            color: #e0e0e0 !important;
        }

        footer.authenticated {
            background-color: #000000 !important;
            color: #e0e0e0 !important;
        }

        .links-container {
            color: #000000 !important;
        }

        .links-container a {
            color: #000000 !important;
        }

        .links-container a i {
            color: inherit !important;
        }

        .icon-gamepad,
        .icon-cubes,
        .icon-basket,
        .icon-news,
        .icon-crown {
            color: #2C6E2E !important;
        }

        #mobile-page-content,
        #content-container {
            background: linear-gradient(to bottom, #004d00, #004d00) !important;
            color: #e0e0e0 !important;
        }

        .vKjpS {
            color: #ffffff !important;
        }

        ._1uoCS {
            fill: #39FF14 !important;
        }

        ._2ZFY8 {
            color: #39FF14 !important;
        }

        .pageheader-inner {
            background: linear-gradient(to bottom, #003500, #000000) !important;
            color: #e0e0e0 !important;
        }

        #footer-header,
        #footer-company,
        #footer-about,
        #footer-links {
            background-color: #0E2302 !important;
            color: #e0e0e0 !important;
        }
    `;

    GM_addStyle(logoCSS + darkThemeCSS);
})();
