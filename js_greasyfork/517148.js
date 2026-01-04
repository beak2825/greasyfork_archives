// ==UserScript==
// @name         Image Ratio Labeler
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  Add ratio labels to images on web pages
// @include      *
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/517148/Image%20Ratio%20Labeler.user.js
// @updateURL https://update.greasyfork.org/scripts/517148/Image%20Ratio%20Labeler.meta.js
// ==/UserScript==

(function() {
    'use strict';


    let isLabelingActive = false; // Variable pour activer/désactiver le labelling

    // Fonction pour trouver le plus grand diviseur commun
    function gcd(a, b) {
      return (b == 0) ? a : gcd(b, a % b);
    }

    // Fonction pour ajouter des labels aux images
    function addLabelsToImages(image) {
        if (!isLabelingActive) return; // Ne rien faire si le labelling n'est pas activé

        // Utiliser un délai avant d'ajouter le label
        setTimeout(function() {
            // Créer un élément de label
            const label = document.createElement('div');

            // Calculer le plus grand diviseur commun entre la largeur et la hauteur
            const divisor = gcd(image.naturalWidth, image.naturalHeight);

            // Calculer le ratio réduit
            const ratioWidth = image.naturalWidth / divisor;
            const ratioHeight = image.naturalHeight / divisor;

            // Définir le contenu du label avec le ratio réduit
            label.textContent = `Ratio: ${ratioWidth}x${ratioHeight}`;

            // Ajouter des styles au label pour le rendre visible
            label.style.position = 'absolute';
            label.style.bottom = '0';
            label.style.left = '0';
            label.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            label.style.color = 'white';
            label.style.padding = '5px';
            label.style.fontSize = '12px';
            label.style.zIndex = '1000';

            // Ajouter le label à l'image
            image.parentNode.insertBefore(label, image.nextSibling);
        }, 500); // Délai de 500 millisecondes
    }

    // Observer les mutations (ajouts d'éléments) dans le DOM
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.tagName === 'IMG') {
                        node.onload = function() {
                            addLabelsToImages(node);
                        };
                        if (node.complete) {
                            addLabelsToImages(node);
                        }
                    }
                });
            }
        });
    });

    // Configuration de l'observer
    const config = { childList: true, subtree: true };

    // Démarrer l'observation
    observer.observe(document.body, config);

    // Ajouter des labels aux images déjà présentes sur la page
    document.querySelectorAll('img').forEach(image => {
        image.onload = function() {
            addLabelsToImages(image);
        };
        if (image.complete) {
            addLabelsToImages(image);
        }
    });
    // Créer le bouton d'activation
    const activationButton = document.createElement('button');
    activationButton.textContent = 'Activate Labeling';
    activationButton.style.position = 'fixed';
    activationButton.style.top = '10px';
    activationButton.style.left = '10px';
    activationButton.style.zIndex = '9999';

    // Ajouter un gestionnaire d'événements pour activer/désactiver le labelling
    activationButton.addEventListener('click', () => {
        isLabelingActive = !isLabelingActive; // Basculer l'état actif/inactif
        activationButton.textContent = isLabelingActive ? 'Deactivate Labeling' : 'Activate Labeling';
        if (isLabelingActive) {
            // Ajouter des labels aux images déjà présentes sur la page
            document.querySelectorAll('img').forEach(image => {
                if (image.complete) {
                    addLabelsToImages(image);
                }
            });
        } else {
            // Retirer les labels existants
            document.querySelectorAll('img').forEach(image => {
                const label = image.parentNode.querySelector('div');
                if (label) {
                    label.remove();
                }
            });
        }
    });

    // Ajouter le bouton à la page
    document.body.appendChild(activationButton);
})();