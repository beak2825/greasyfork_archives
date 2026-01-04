// ==UserScript==
// @name         Clics Automatique expedition/preparation
// @namespace    http://tampermonkey.net/
// @version      2024-01-17
// @description  Permet de faire des préparations plus rapidement !
// @author       Maxime DOMPSIN
// @match        https://a3edi.agena3000.com/fr/Efi/ExpeditionPreparation/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license Apache 2.0
// @downloadURL https://update.greasyfork.org/scripts/485163/Clics%20Automatique%20expeditionpreparation.user.js
// @updateURL https://update.greasyfork.org/scripts/485163/Clics%20Automatique%20expeditionpreparation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Variable de suivi pour s'assurer que le bloc 1 n'est exécuté qu'une fois
    var block1Executed = false;

    // Fonction pour effectuer les actions dans chaque bloc
    function performActions(selectors, optionIndex) {
        selectors.forEach(function(selector) {
            var element = document.querySelector(selector);
            if (element) {
                element.click();
            }
        });

        // Si la liste déroulante est incluse dans les sélecteurs, effectuez la sélection
        if (selectors.includes('#filter_type_typeUniteExpedition')) {
            performDropdownSelection('#filter_type_typeUniteExpedition', optionIndex);
        }
    }

    // Fonction pour effectuer la sélection dans la liste déroulante
    function performDropdownSelection(dropdownSelector, optionIndex) {
        var dropdown = document.querySelector(dropdownSelector);

        // Vérifiez si la liste déroulante existe
        if (dropdown) {
            // Vérifiez si l'option à l'index spécifié existe
            if (optionIndex < dropdown.options.length) {
                // Sélectionnez l'option en modifiant la propriété selectedIndex
                dropdown.selectedIndex = optionIndex;

                // Déclenchez un événement de changement pour simuler la sélection
                var changeEvent = new Event('change', { bubbles: true });
                dropdown.dispatchEvent(changeEvent);
            } else {
                console.error("L'index spécifié dépasse le nombre d'options dans la liste déroulante.");
            }
        }
    }

    // Fonction principale pour automatiser les actions
    function automateActions() {
        // Bloc 1: Clic sur le bouton
        var block1Button = '#palettisation > div.table-responsive.auto-data-label > table > tbody > tr > th.center > span > a';
        var block1Selectors = [block1Button];

        // Si le bloc 1 n'a pas encore été exécuté, effectuez les actions
        if (!block1Executed) {
            performActions(block1Selectors);
            block1Executed = true;
        }

        // Bloc 2: Sélection dans la liste déroulante
        var block2Selectors = ['#filter_type_typeUniteExpedition'];
        var block2OptionIndex = 3; // Index de l'option à sélectionner dans la liste déroulante
        performActions(block2Selectors, block2OptionIndex);

        // Bloc 3: Clic sur le bouton "Accepter"
        var block3Selectors = ['#modalPalettisation > div > div > div.modal-footer > button.btn.btn-save'];
        performActions(block3Selectors);

        // Ajout d'un délai de 3 secondes avant le bloc 4
        setTimeout(function() {
            // Bloc 4: Clic sur l'affection
            var block4Selectors = ['#palettisation > div.table-responsive.auto-data-label > table > tbody > tr:nth-child(2) > td:nth-child(1) > a'];
            performActions(block4Selectors);

            // Ajout d'un délai de 3 secondes avant le bloc 5
            setTimeout(function() {
                // Bloc 5: Clic sur l'affection automatique
                var block5Selectors = ['#formFooter > a.btn.btn-warning.pull-right > i'];
                performActions(block5Selectors);

                // Ajout d'un délai de 1 seconde avant le bloc 6
                setTimeout(function() {
                    // Bloc 6: Clic sur le bouton "Enregistrer"
                    var block6Selectors = ['#formFooter > a.btn.btn-save > i'];
                    performActions(block6Selectors);
                }, 1000);

                // Ajout d'un délai de 1 seconde avant le bloc 7
                setTimeout(function() {
                    // Bloc 7: Clic sur le bouton "Retour"
                    var block7Selectors = ['#formFooter > a.btn.btn-secondary'];
                    performActions(block7Selectors);
                }, 1000);

            }, 3000);

        }, 3000);

        // Nouveau bloc 8: Clic sur le bouton "Retour" (ajouté selon votre demande)
        var block8Selectors = ['#modalPalettisation > div > div > div.modal-footer > button.btn.btn-secondary'];
        performActions(block8Selectors);
    }

    // Appelez les fonctions pour effectuer les actions après le chargement de la page
    window.addEventListener('load', function() {
        automateActions();
    });

})();