// ==UserScript==
// @name         Instagram Custom Button
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Ajoute un bouton en haut à droite sur les profils Instagram
// @match        https://www.instagram.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514845/Instagram%20Custom%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/514845/Instagram%20Custom%20Button.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Fonction pour ajouter le bouton
    function addCustomButton() {
        const profileHeader = document.querySelector("header");

        // Vérifie si le bouton est déjà présent
        if (profileHeader && !document.getElementById("custom-profile-button")) {
            const customButton = document.createElement("button");
            customButton.id = "custom-profile-button";
            customButton.innerText = "Mon Bouton";
            customButton.style.position = "absolute";
            customButton.style.top = "10px";
            customButton.style.right = "10px";
            customButton.style.padding = "10px";
            customButton.style.backgroundColor = "#0095f6";
            customButton.style.color = "#fff";
            customButton.style.border = "none";
            customButton.style.borderRadius = "5px";
            customButton.style.cursor = "pointer";
            customButton.style.zIndex = "1000";

            // Action lors du clic sur le bouton
            customButton.addEventListener("click", () => {
                alert("Bouton cliqué !");
            });

            // Ajoute le bouton au header
            profileHeader.appendChild(customButton);
        }
    }

    // Utilisation d'un observer pour surveiller les changements de page et ajouter le bouton sur les profils
    const observer = new MutationObserver(() => {
        if (window.location.pathname.split("/").length === 2) { // Vérifie si on est sur une page de profil
            addCustomButton();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
