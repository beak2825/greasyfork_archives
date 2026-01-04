// ==UserScript==
// @name         Clics Automatique palettisation
// @namespace    http://tampermonkey.net/
// @version      2024-01-17
// @description  Permet de faire des préparations plus rapidement !
// @author       Maxime DOMPSIN
// @match        https://a3edi.agena3000.com/fr/Efi/palettisation/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license Apache 2.0
// @downloadURL https://update.greasyfork.org/scripts/485166/Clics%20Automatique%20palettisation.user.js
// @updateURL https://update.greasyfork.org/scripts/485166/Clics%20Automatique%20palettisation.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Fonction pour effectuer les actions dans chaque bloc
    function performActions(selectors) {
        selectors.forEach(function(selector) {
            var element = document.querySelector(selector);
            if (element) {
                element.click();
            }
        });
    }

    // Bloc 5: Clic sur l'affection automatique
    var block5Selectors = ['#formFooter > a.btn.btn-warning.pull-right'];
    performActions(block5Selectors);

    // Ajout d'un délai de 1 seconde avant le bloc 6
    setTimeout(function() {
        // Bloc 6: Clic sur le bouton "Enregistrer"
        var block6Selectors = ['#formFooter > a.btn.btn-save'];
        performActions(block6Selectors);

        // Ajout d'un délai de 1 seconde avant le bloc 7
        setTimeout(function() {
            // Bloc 7: Clic sur le bouton "Retour"
            var block7Selectors = ['#formFooter > a.btn.btn-secondary'];
            performActions(block7Selectors);
        }, 1000);

    }, 1000);

})();