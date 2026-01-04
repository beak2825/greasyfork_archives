// ==UserScript==
// @name         Vimm: Download Button
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Ajoute un bouton Download sur les page Nintendo
// @author       Ares
// @match        https://vimm.net/vault/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532510/Vimm%3A%20Download%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/532510/Vimm%3A%20Download%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Fonction pour ajouter le bouton s'il n'existe pas
    function addSubmitButton(form) {
        // Vérifie si un élément de type submit existe dans le formulaire
        const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
        if (!submitButton) {
            // Créer un nouveau bouton
            const newButton = document.createElement("button");
            newButton.type = "submit";
            newButton.style.width = "100%";
            newButton.textContent = "Download";

            // Ajouter le bouton au formulaire (par exemple, à la fin)
            form.appendChild(newButton);
            console.log("Bouton 'Download' ajouté au formulaire:", form);
        } else {
            console.log("Le formulaire contient déjà un bouton de type submit:", form);
        }
    }

    // Sélectionne tous les formulaires ayant l'id "dl_form"
    const forms = document.querySelectorAll('form#dl_form');
    if (forms.length > 0) {
        forms.forEach(form => addSubmitButton(form));
    } else {
        console.log("Aucun formulaire avec l'id 'dl_form' trouvé sur cette page.");
    }
})();