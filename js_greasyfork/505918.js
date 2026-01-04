// ==UserScript==
// @name         Dreamborn - Export missing cards
// @namespace    http://tampermonkey.net/
// @version      2024-08-26.3
// @description  Export missing cards
// @author       Yehr59
// @license      MIT 
// @match        https://dreamborn.ink/*/decks/*
// @match        https://dreamborn.ink/decks/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505918/Dreamborn%20-%20Export%20missing%20cards.user.js
// @updateURL https://update.greasyfork.org/scripts/505918/Dreamborn%20-%20Export%20missing%20cards.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Fonction pour extraire les noms de carte et les quantités manquantes
    function extractMissingCards() {
        const highlightSwitch = document.querySelector('#headlessui-switch-5');
        if (!highlightSwitch || highlightSwitch.getAttribute('aria-checked') !== 'true') {
            alert('Veuillez activer le mode "Highlight" avant d\'exporter la collection.');
            return;
        }

        const cardElements = document.querySelectorAll('.grid.items-center'); // Sélecteur générique pour les cartes
        let missingCards = '';

        cardElements.forEach(cardElement => {
            // Extraire le nom de la carte
            const cardName = cardElement.querySelector('button')?.textContent.trim() || '';

            // Extraire les quantités manquantes
            const quantityInfo = cardElement.querySelector('.shrink-0.bg-red-700')?.textContent.trim() || '';
            const [collected, total] = quantityInfo.split('/').map(Number);
            const missingQuantity = total - collected;

            // Ajouter la carte au résultat si elle est incomplète
            if (missingQuantity > 0) {
                missingCards += `${missingQuantity} ${cardName}\n`;
            }
        });

        // Afficher les résultats dans la modal
        document.getElementById('missing-cards-textarea').value = missingCards.trim();
        document.getElementById('missingCardsModal').style.display = 'block';
    }

    // Fonction pour copier le contenu du textarea dans le presse-papier
    function copyToClipboard() {
        const textarea = document.getElementById('missing-cards-textarea');
        textarea.select();
        document.execCommand('copy');
        alert('Le contenu a été copié dans le presse-papier.');
    }

    // Créer la modal pour afficher les cartes manquantes
    function createModal() {
        const modalHtml = `
            <div id="missingCardsModal" style="display:none; position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); background-color:rgb(17 24 39/var(--tw-bg-opacity)); padding:20px; border-radius:8px; box-shadow:0 4px 8px rgba(0,0,0,0.2); z-index:1001;">
                <h2>Cartes manquantes</h2>
                <textarea id="missing-cards-textarea" style="width:100%; height:150px; margin-top:10px; background-color:rgb(17 24 39/var(--tw-bg-opacity));"></textarea>
                <button id="copy-button" style="margin-top:10px; padding:10px 20px; background-color:#4CAF50; color:white; border:none; border-radius:5px; cursor:pointer;">Copier</button>
                <button id="close-modal" style="margin-top:10px; padding:10px 20px; background-color:#f44336; color:white; border:none; border-radius:5px; cursor:pointer;">Fermer</button>
            </div>
        `;
        const modalDiv = document.createElement('div');
        modalDiv.innerHTML = modalHtml;
        document.body.appendChild(modalDiv);

        document.getElementById('copy-button').addEventListener('click', copyToClipboard);
        document.getElementById('close-modal').addEventListener('click', function() {
            document.getElementById('missingCardsModal').style.display = 'none';
        });
    }

    // Créer un bouton "Export missing cards"
    const button = document.createElement('button');
    button.textContent = 'Export missing cards';
    button.style.position = 'absolute';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.padding = '10px 20px';
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.zIndex = '1000';

    // Ajouter l'événement de clic pour le bouton
    button.addEventListener('click', extractMissingCards);

    // Ajouter le bouton au corps du document
    document.body.appendChild(button);
    createModal();
})();