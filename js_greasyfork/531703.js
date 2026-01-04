// ==UserScript==
// @name         Style Quantité
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Change la couleur (blanc) et augmente la taille (+2px)
// @author       Laïn
// @match        https://www.dreadcast.eu/Main
// @match        https://www.dreadcast.net/Main
// @match        https://dreadcast.net/Main*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/531703/Style%20Quantit%C3%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/531703/Style%20Quantit%C3%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONTAINER_ID = 'stocks_mise_en_vente';
    const DATA_MARKER = 'styledByQuantScriptMev';

    function applyCustomStyles(element) {
        // Pas besoin de console.log en production
        element.style.setProperty('color', 'white', 'important');
        try {
            const computedStyle = window.getComputedStyle(element);
            const currentFontSize = computedStyle.fontSize;
            if (currentFontSize.endsWith('px')) {
                const currentSizePx = parseInt(currentFontSize, 10);
                if (!isNaN(currentSizePx)) {
                    const newSize = currentSizePx + 2;
                    element.style.fontSize = newSize + 'px';
                }
            }
        } catch (error) {
            // Ignore errors silently
        }
        element.dataset[DATA_MARKER] = 'true';
    }

    // Fonction pour vérifier si un élément est à l'intérieur du conteneur cible ACTUELLEMENT DANS LE DOM
    function isInsideTargetContainer(element) {
        const container = document.getElementById(CONTAINER_ID);
        // Vérifie si le conteneur existe ET si l'élément est DANS ce conteneur
        return container && container.contains(element);
    }

    // Fonction qui traite les nœuds ajoutés n'importe où dans le body
    function processPotentialNodes(nodes) {
        nodes.forEach(node => {
            // Ne traiter que les nœuds éléments
            if (node.nodeType === Node.ELEMENT_NODE) {

                // 1. Vérifier si le nœud ajouté EST lui-même un .quantite DANS le conteneur
                if (node.matches('.quantite') && !node.dataset[DATA_MARKER] && isInsideTargetContainer(node)) {
                    applyCustomStyles(node);
                }

                // 2. Vérifier si le nœud ajouté CONTIENT des .quantite DANS le conteneur
                // Important car la div #stocks_mise_en_vente peut être ajoutée elle-même
                const quantityDescendants = node.querySelectorAll(`.quantite:not([data-${DATA_MARKER.toLowerCase()}="true"])`);
                quantityDescendants.forEach(descendant => {
                    // Re-vérifier la présence dans le conteneur pour chaque descendant trouvé
                    if (!descendant.dataset[DATA_MARKER] && isInsideTargetContainer(descendant)) {
                        applyCustomStyles(descendant);
                    }
                });
            }
        });
    }

    // --- Observer TOUT le body ---
    const observerOptions = { childList: true, subtree: true };

    // Callback pour l'observer attaché au body
    const bodyObserverCallback = function(mutationsList, observer) {
        for(const mutation of mutationsList) {
            // On ne s'intéresse qu'aux nœuds ajoutés
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // La fonction processPotentialNodes vérifiera si les nœuds ajoutés
                // sont ou contiennent ce qui nous intéresse DANS le bon conteneur
                processPotentialNodes(mutation.addedNodes);
            }
        }
    };

    // Créer et démarrer l'observer sur le body
    const bodyObserver = new MutationObserver(bodyObserverCallback);
    bodyObserver.observe(document.body, observerOptions);

    // --- Style Initial (Au cas où la fenêtre est déjà ouverte au chargement) ---
    function runInitialStyling() {
         const container = document.getElementById(CONTAINER_ID);
         if (container) {
              const initialElements = container.querySelectorAll(`.quantite:not([data-${DATA_MARKER.toLowerCase()}="true"])`);
              // processPotentialNodes fonctionne aussi pour le style initial,
              // car il vérifie si les éléments sont bien dans le conteneur
              processPotentialNodes(initialElements);
         }
         // Pas besoin de réessayer ici, l'observer du body s'en chargera si le conteneur apparaît plus tard
    }

    // Exécuter le style initial après un court délai pour laisser la page se stabiliser
    setTimeout(runInitialStyling, 200); // Augmenté légèrement le délai par sécurité

})();