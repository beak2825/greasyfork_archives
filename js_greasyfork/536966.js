// ==UserScript==
// @name         Teams Gifs Ctrl + E Toggle
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Masquer les liens Giphy et afficher les images correspondantes avec Ctrl + E
// @match       https://teams.microsoft.com/v2/*
// @grant       none
// @author      Thomas X gpt
// @description 16/05/2025 08:18:01
// @downloadURL https://update.greasyfork.org/scripts/536966/Teams%20Gifs%20Ctrl%20%2B%20E%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/536966/Teams%20Gifs%20Ctrl%20%2B%20E%20Toggle.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Fonction pour créer et afficher l'image
    function showImage(link) {
        const img = document.createElement('img');
        img.src = link.href; // Utiliser le href du lien
        img.style.display = 'block'; // Afficher l'image
        // img.style.maxWidth = '300px'; // Limiter la largeur de l'image
        // img.style.marginTop = '10px'; // Ajouter un peu d'espace au-dessus
        link.parentNode.insertBefore(img, link.nextSibling); // Insérer l'image après le lien
        return img;
    }
    // Fonction pour créer une info box
    function createInfoBox() {
        const infoBox = document.createElement('div');
        infoBox.textContent = 'Ctrl + E pour afficher ou masquer les gifs';
        infoBox.style.position = 'fixed';
        infoBox.style.top = '10px';
        infoBox.style.right = '10px';
        infoBox.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        infoBox.style.color = 'white';
        infoBox.style.padding = '10px';
        infoBox.style.borderRadius = '5px';
        infoBox.style.zIndex = '1000';

        // Bouton de fermeture
        const closeButton = document.createElement('button');
        closeButton.textContent = 'X';
        closeButton.style.marginLeft = '10px';
        closeButton.style.backgroundColor = 'transparent';
        closeButton.style.color = 'white';
        closeButton.style.border = 'none';
        closeButton.style.cursor = 'pointer';

        closeButton.addEventListener('click', function() {
            infoBox.remove(); // Supprimer l'info box
        });

        infoBox.appendChild(closeButton);
        document.body.appendChild(infoBox);
    }

    createInfoBox(); // Créer l'info box au chargement
    let isEnabled = false; // État pour activer/désactiver le script

    // Écouteur d'événements pour les touches
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.key === 'e') { // quand j'appuie sur Ctrl + E
            isEnabled = !isEnabled; // Inverser l'état

            if (isEnabled) {
                // Masquer les liens et afficher les images
                const links = document.querySelectorAll('a[href*="giphy.com"]');
                links.forEach(link => {
                    const img = showImage(link);
                    link.style.display = 'none'; // Masquer le lien
                    link.dataset.imgId = img.src; // Stocker l'ID de l'image pour la réafficher plus tard
                });
            } else {
                // Afficher les liens et masquer les images
                const images = document.querySelectorAll('img');
                images.forEach(img => {
                    const link = Array.from(document.querySelectorAll('a[href*="giphy.com"]')).find(l => l.dataset.imgId === img.src);
                    if (link) {
                        link.style.display = 'inline'; // Afficher le lien
                        img.remove(); // Supprimer l'image
                    }
                });
            }
        }
    });
})();