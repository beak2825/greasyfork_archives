// ==UserScript==
// @name         BigBlueButton script pour l'appel
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Fuck l'appel
// @author       Ali
// @match        https://*.chooseyourlab.fr/*
// @match        https://demo1.bigbluebutton.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401496/BigBlueButton%20script%20pour%20l%27appel.user.js
// @updateURL https://update.greasyfork.org/scripts/401496/BigBlueButton%20script%20pour%20l%27appel.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var t = setInterval(function () {
        var btn = document.querySelector("button[aria-label='Oui']");
        if ( btn ) {
            btn.click();
            console.log("Bouton cliqué");
        }
        var btn_endsession = document.querySelector("button[aria-label='OK']");
        if ( btn_endsession ) {
            btn_endsession.click();
            console.log("Session quitée");
        }
        var btn_connection = document.querySelector("button.join-form");
        if ( btn_connection ) {
            btn_connection.click();
            console.log("Session rejoins");
        }
        var btn_ecoute = document.querySelector("button[aria-label='Écoute seule']");
        if ( btn_ecoute ) {
            btn_ecoute.click();
            console.log("Session rejoins via l'écoute");
        }
        var btn_valider = document.querySelector("button[aria-label='Lecture audio']");
        if ( btn_valider ) {
            btn_valider.click();
            console.log("Session validée");
        }
    }, 2000);
    
})();