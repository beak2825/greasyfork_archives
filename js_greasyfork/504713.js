// ==UserScript==
// @name         Dark mode på Radio IIII
// @namespace    https://greasyfork.org/da/users/1356217-nuclearboyscout
// @version      1.1.0
// @license      MIT
// @description  A dark mode style script for Radio IIII
// @author       NuclearBoyScout
// @match        https://radio4.dk/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/504713/Dark%20mode%20p%C3%A5%20Radio%20IIII.user.js
// @updateURL https://update.greasyfork.org/scripts/504713/Dark%20mode%20p%C3%A5%20Radio%20IIII.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Funktion til at anvende stilen
    function applyStyles() {
        GM_addStyle(`

            body {
                background: #212121 !important;
                color: #cccccc !important;
            }

            footer {
                background-color: #171717 !important;
            }
            div.main.excluded.addSpotlightSeparation, div.main.excluded.spotlightBackground, div.main.excluded.spotlightStyle, div.spotlightPress.spotlightPressSquareImage.addSpacing.center, div.main.excluded {
                background-color: #2f2f2f !important;
            }


            input[type="search"] {
                background-color: #2f2f2f !important;
                color: #9b9b9b !important;
            }

            div.card.rounded {
                background-color: #444 !important;
            }

            div.card.isLive.liveCard.rounded {
                background-color: #555 !important;
            }

            div.content.center.wide {
                background: linear-gradient(90deg, #2b2a33 22%, #3a3a3a 60.5%, #4a4a4a) !important;
                color: #cccccc !important;
            }

            div.content.center.wide div.duration {
                color: #cccccc !important;
            }

            div.search {
                background-color: #2f2f2f !important;
            }

            a.router-link-active.router-link-exact-active.headerLink {
                color: #cccccc !important;
            }

            a.router-link-active.router-link-exact-active.headerLink::before {
                color: #cccccc !important;
                background-color: #2b2a33 !important;
            }

            /* Ændre farven på det første path (cirklen) */
            button.pulse svg path:first-of-type {
                fill: #171717 !important; /* Mørkere baggrund for cirklen */
            }

            /* Ændre farven på det andet path (pilen eller stop-symbol) */
            button.pulse svg path:last-of-type {
                fill: #cccccc !important; /* Lysere farve til symbolet */
            }

            /* Ændre farven på play-knappen når den er aktiv */
            button.pulse:active svg path:first-of-type {
                fill: #323232 !important; /* Mørkere baggrund for cirklen når aktiv */
            }

            button.pulse:active svg path:last-of-type {
                fill: #323232 !important;
            }

            /* Ændre farven på SVG-ikoner i knapper uden klasser */
            button:not([class]) svg path {
                fill: #cccccc !important; /* Den ønskede farve til SVG-ikoner */
            }

        `);
    }

    window.addEventListener('load', applyStyles);

    const observer = new MutationObserver(applyStyles);
    observer.observe(document.body, { childList: true, subtree: true });
})();