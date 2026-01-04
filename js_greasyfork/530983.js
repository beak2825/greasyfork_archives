// ==UserScript==
// @name         Digicode reseau 
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  S
// @author       VotreNom
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530983/Digicode%20reseau.user.js
// @updateURL https://update.greasyfork.org/scripts/530983/Digicode%20reseau.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let running = false; // Variable pour suivre l'état du script
    let timeoutID; // Stocke l'ID du setTimeout pour l'arrêter proprement

    function sendRequest() {
        if (!running) return; // Si le script est arrêté, ne rien faire

        let randomValue = Math.floor(Math.random() * 9) + 1; // Génère un chiffre entre 1 et 9
        let formData = new URLSearchParams();
        formData.append("id_materiel", "29152");
        formData.append("valeur", randomValue);

        fetch("https://www.dreadcast.net/Item/Update/Digicode", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "X-Requested-With": "XMLHttpRequest"
            },
            body: formData
        });

        // Délai aléatoire entre 300 et 750 ms avant la prochaine requête
        let delay = Math.random() * (750 - 300) + 300;
        timeoutID = setTimeout(sendRequest, delay);
    }

    document.addEventListener("keydown", function(event) {
        if (event.key === "5") {
            if (!running) {
                running = true;
                sendRequest();
            }
        } else if (event.key === "6") {
            running = false;
            clearTimeout(timeoutID);
        }
    });

})();