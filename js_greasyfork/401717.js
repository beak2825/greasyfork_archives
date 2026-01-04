// ==UserScript==
// @name         Frøs Sparkasse Netbank - Autologout Preventer
// @namespace    JKL.Froes
// @version      1.0.1
// @description  Regularly checks if prompt for inactivity, is displayed and if it is, clicks it to keep the session alive.
// @author       Jacob Kamp Lund
// @match        https://www.portalbank.dk/9740/privat/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401717/Fr%C3%B8s%20Sparkasse%20Netbank%20-%20Autologout%20Preventer.user.js
// @updateURL https://update.greasyfork.org/scripts/401717/Fr%C3%B8s%20Sparkasse%20Netbank%20-%20Autologout%20Preventer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Holder øje med Auto Logoff Prompt");
    var popup = document.getElementById("autologoffpromptarticlebox");
    if (!popup) {
        console.error("Element \"autologoffpromptarticlebox\" ikke fundet");
        return;
    }

    setInterval(function() {
        if (window.getComputedStyle(popup).display == "block") {
            var button = popup.getElementsByTagName("input");
            if (button.length == 1) {
                button[0].click();
                console.log("Klikkede på knappen for dig!");
            }
        }
    }, 250);

})();