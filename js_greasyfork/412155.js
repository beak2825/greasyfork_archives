// ==UserScript==
// @name         teams style
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  styling teams according to the connected account
// @author       CoStiC
// @match        https://teams.microsoft.com/*
// @grant        none
// @require https://greasyfork.org/scripts/394721-w84kel/code/w84Kel.js?version=763614
// @downloadURL https://update.greasyfork.org/scripts/412155/teams%20style.user.js
// @updateURL https://update.greasyfork.org/scripts/412155/teams%20style.meta.js
// ==/UserScript==

(function() {
    'use strict';

    waitForKeyElements("#personDropdown", item => getUser(item))
})();

function getUser() {
    let userContainer = arguments[0].querySelector("[upn]");
    let user = userContainer.getAttribute("upn");
    teamsStyling(user);
}

function teamsStyling(user) {
    let hbar = document.querySelectorAll(".app-header-bar")[0],
        navbar = document.querySelector("app-bar");;
    switch (user) {
        case "pierre.mars-prestataire@poste-immo.fr":
            hbar.style.background = "#009aa3";
            navbar.style.background = "#007076";
            break;
        case "pierre.mars-prestataire@laposte.fr":
            hbar.style.background = "#ffc928";
            navbar.style.background = "#003da5";
            break;
        case "pierre.mars@soprasteria.com" :
            hbar.style.background = "#de1823";
            navbar.style.background = "#f67200";
            break;
    }
}