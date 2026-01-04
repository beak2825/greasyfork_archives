// ==UserScript==
// @name         TEJ Activer boutons désactivés
// @namespace    https://tej.finances.gov.tn/
// @version      1.0
// @description  Remplace class "disabled" par "enabled" et retire l'attribut "disabled" sur les boutons
// @author       Maher Zghal
// @match        https://tej.finances.gov.tn/tax-file*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/536053/TEJ%20Activer%20boutons%20d%C3%A9sactiv%C3%A9s.user.js
// @updateURL https://update.greasyfork.org/scripts/536053/TEJ%20Activer%20boutons%20d%C3%A9sactiv%C3%A9s.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function activateButtons() {
        // Sélectionner tous les boutons désactivés
        const buttons = document.querySelectorAll('button.disabled, button[disabled]');
        buttons.forEach(button => {
            // Remplacer la classe 'disabled' par 'enabled'
            button.classList.remove('disabled');
            button.classList.add('enabled');

            // Retirer l'attribut 'disabled'
            button.removeAttribute('disabled');

            // Optionnel : restaurer le style visuel du bouton
            button.style.pointerEvents = 'auto';
            button.style.opacity = '1';
        });
    }

    // Appeler la fonction après chargement
    window.addEventListener('load', () => {
        setTimeout(activateButtons, 1000); // délai pour s'assurer que tout est chargé
    });

    // Observer les changements DOM si la page charge dynamiquement des éléments
    const observer = new MutationObserver(() => {
        activateButtons();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();