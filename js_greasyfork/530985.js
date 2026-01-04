// ==UserScript==
// @name         Sapping
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  sappe
// @author       Bleh
// @match        https://www.dreadcast.eu/Main
// @match        https://www.dreadcast.net/Main
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530985/Sapping.user.js
// @updateURL https://update.greasyfork.org/scripts/530985/Sapping.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Crée un conteneur fixe en haut à droite avec un z-index très élevé
    const container = document.createElement('div');
    container.style.position = "fixed";
    container.style.top = "400px";
    container.style.right = "1280px";
    container.style.zIndex = "99999999";
    container.style.background = "rgba(255,255,255,0.8)";
    container.style.padding = "0px";
    container.style.borderRadius = "1px";
    document.body.appendChild(container);

    let lastOriginal = null;
    let cloneButton = null;

    // Fonction de création ou de mise à jour du clone
    function updateClone() {
        const original = document.getElementById("action_perso_attaque");
        if (!original) return;

        // Si le bouton original a changé ou n'a pas encore été cloné, on recrée le clone
        if (original !== lastOriginal) {
            lastOriginal = original;
            container.innerHTML = "";

            // Clone visuel de l'original
            cloneButton = original.cloneNode(true);
            cloneButton.removeAttribute("id");

            // Appliquer le style classique générique avec le fond #006d49 et sans bordure
            cloneButton.style.backgroundColor = "#006d49"; // couleur de fond modifiée
            cloneButton.style.color = "#fff";
            cloneButton.style.border = "none";
            cloneButton.style.borderRadius = "4px";
            cloneButton.style.padding = "20px 30px";
            cloneButton.style.fontSize = "14px";
            cloneButton.style.cursor = "pointer";
            cloneButton.style.textAlign = "center";
            cloneButton.style.textDecoration = "none";
            cloneButton.style.display = "inline-block";

            // Lorsqu'on clique sur le clone, déclenche l'action d'attaque sur l'original
            cloneButton.addEventListener("click", (e) => {
                e.stopPropagation();
                e.preventDefault();
                original.click();
            });

            container.appendChild(cloneButton);
        }
    }

    // Observer le DOM pour détecter l'apparition ou la modification du bouton original
    const observer = new MutationObserver(() => {
        updateClone();
    });
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    // Vérification périodique en cas de changements rapides
    setInterval(updateClone, 1000);

    // Ajout d'un écouteur clavier pour "$" qui déclenche un clic sur le clone
    document.addEventListener("keydown", function(e) {
        if (e.key === "$") {
            if (cloneButton) {
                cloneButton.click();
            }
        }
    });
})();
