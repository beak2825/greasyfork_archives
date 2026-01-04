// ==UserScript==
// @name         EcoleDirecte-SaisieCompFacile
// @namespace    http://tampermonkey.net/
// @version      2024-11-23
// @description  facilite la saisie des compétences en passant automatiquement à la compétence suivante (plus besoin d'appuyer sur la fleche droite)
// @author       Alcor
// @match        https://www.ecoledirecte.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ecoledirecte.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528375/EcoleDirecte-SaisieCompFacile.user.js
// @updateURL https://update.greasyfork.org/scripts/528375/EcoleDirecte-SaisieCompFacile.meta.js
// ==/UserScript==

(function() {
    'use strict';


    function simulateKeyPress(key) {
        const event = new KeyboardEvent("keydown", {
            key: key,
            code: key === "ArrowRight" ? "ArrowRight" : "",
            keyCode: key === "ArrowRight" ? 39 : 0, // Compatibilité pour les anciens navigateurs
            bubbles: true, // Permet que l'événement remonte dans le DOM
            cancelable: true
        });

        document.dispatchEvent(event);
    }

    function autoSwitch(event){
        let actual_comp = document.querySelector('#table-saisie-competences .focused')
        if (event.key in ["1", "2", "3", "4", "0"] && actual_comp){
            simulateKeyPress("ArrowRight");
        }
    }


    let head = document.querySelector('head')
    let style = document.createElement('style')
    style.innerHTML='#table-saisie-competences .focused {background: #0f8fd1 !important;}'+
        'button#btn-bas-enregistrer {position: fixed; z-index: 10000; top: 300px; right: 200px;}'
    head.append(style)


    document.body.addEventListener("keyup", autoSwitch)


})();