// ==UserScript==
// @name         TYT - AEM Component Sorter
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Tri des composants dans l'éditeur AEM par ordre alphabétique.
// @author       You
// @match        https://aem-author-prod.toyota.eu/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/508695/TYT%20-%20AEM%20Component%20Sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/508695/TYT%20-%20AEM%20Component%20Sorter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function sortComponents() {
        // Sélectionne tous les éléments contenant les items
        const allColumnContents = document.querySelectorAll('coral-columnview-column-content');

        // Pour chaque liste trouvée
        allColumnContents.forEach(columnContent => {
            // Récupère tous les items (coral-columnview-item) de la liste actuelle
            const items = Array.from(columnContent.querySelectorAll('coral-columnview-item'));

            // Sépare les items en deux catégories : avec titre et sans titre
            const itemsWithTitle = [];
            const itemsWithoutTitle = [];

            items.forEach(item => {
                const titleElement = item.querySelector('.foundation-collection-item-title');
                const title = titleElement ? titleElement.textContent.trim() : '';

                if (title) {
                    itemsWithTitle.push(item);
                } else {
                    itemsWithoutTitle.push(item);
                }
            });

            // Trie les items qui ont un titre par ordre alphabétique
            itemsWithTitle.sort((a, b) => {
                const titleA = a.querySelector('.foundation-collection-item-title').textContent.trim();
                const titleB = b.querySelector('.foundation-collection-item-title').textContent.trim();
                return titleA.localeCompare(titleB);
            });

            // Supprime les items actuels du DOM de la liste actuelle
            items.forEach(item => columnContent.removeChild(item));

            // Ajoute les items triés avec titre, puis ceux sans titre à la fin
            itemsWithTitle.forEach(item => columnContent.appendChild(item));
            itemsWithoutTitle.forEach(item => columnContent.appendChild(item));
        });
    }

    function addSortButton() {
        // Créer un bouton "Sort"
        const buttonSort = document.createElement('button');
        buttonSort.innerHTML = 'Sort';
        buttonSort.id = 'Sort-button';
        buttonSort.style.position = 'fixed';
        buttonSort.style.bottom = '20px';
        buttonSort.style.left = '60px';
        buttonSort.style.zIndex = '99999';

        document.body.appendChild(buttonSort);

        buttonSort.addEventListener('click', sortComponents);
    }

    // Initialiser le bouton de tri
    if (window.location.origin === 'https://aem-author-prod.toyota.eu') {
        addSortButton();
    }

})();
