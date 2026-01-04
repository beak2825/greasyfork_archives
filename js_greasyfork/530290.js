// ==UserScript==
// @name         Tinkercad Basic shapes only
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Hide all but Basic shapes menu and togle sidepanel with F12. 
// @match        *://www.tinkercad.com/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530290/Tinkercad%20Basic%20shapes%20only.user.js
// @updateURL https://update.greasyfork.org/scripts/530290/Tinkercad%20Basic%20shapes%20only.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Voeg CSS toe direct bij het laden
    GM_addStyle(`
        .selectbox-container,
        .search-btn {
            display: none !important;
        }
    `);

    // Functie om de sidebar in/uit te schakelen
    function toggleSidebar() {
        let sidebarButton = document.getElementById("sidebar-collapse-button");
        if (sidebarButton) {
            sidebarButton.click(); // Simuleer een klik op de knop
        }
    }

    // Luister naar de F12-toets om de sidebar te toggelen
    document.addEventListener("keydown", function(event) {
        if (event.key === "F12") {
            console.log("F12 is ingedrukt");
            event.preventDefault(); // Voorkom standaard F12 gedrag
            toggleSidebar();
        }
    });
})();
