// ==UserScript==
// @name         Toggle improver
// @namespace    http://tampermonkey.net/
// @version      2024-11-05
// @description  Add functionalities to toggl
// @author       Morgan Schaefer
// @match        https://track.toggl.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=toggl.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/515937/Toggle%20improver.user.js
// @updateURL https://update.greasyfork.org/scripts/515937/Toggle%20improver.meta.js
// ==/UserScript==


(function() {
    'use strict';

function delayedFunction() {
    // Sélection de l'élément contenant le texte à extraire
    const projectElement = document.querySelector('[aria-label="Add a project"] span:nth-of-type(2)');

    if (projectElement) {
        // Extraction initiale du texte et affichage
        let lastText = projectElement.textContent.trim();
        console.log(lastText);

        // Création d'un observateur pour détecter les changements de texte
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'characterData' || mutation.type === 'childList') {
                    const newText = projectElement.textContent.trim();
                    if (newText !== lastText) {
                        console.log(newText);
                        lastText = newText; // Mise à jour du dernier texte connu
                    }
                }
            });
        });

        // Configuration de l'observateur pour surveiller les changements de texte et de structure de l'élément
        const config = { characterData: true, childList: true, subtree: true };
        observer.observe(projectElement, config);

        // Création du bouton pour copier le texte
        const copyButton = document.createElement('button');
        copyButton.innerText = 'Copier';
        copyButton.style.position = 'absolute';
        copyButton.style.top = '0';
        copyButton.style.right = '0';
        copyButton.style.zIndex = '1000';

        // Ajout d'un gestionnaire de clic pour copier le texte dans le presse-papiers
        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText("Toggl : " + projectElement.textContent.trim())
                .then(() => console.log('Texte copié dans le presse-papiers!'))
                .catch(err => console.error('Erreur de la copie:', err));
        });

        // Ajout du bouton au parent de l'élément
        const parentElement = projectElement.parentNode.parentNode.parentNode.parentNode;
        parentElement.style.position = 'relative'; // Assure que le bouton peut être positionné correctement
        parentElement.appendChild(copyButton);
    } else {
        console.log('Élément non trouvé');
    }
}

// Exécution de la fonction delayedFunction après un délai de 5000 millisecondes (5 secondes)
setTimeout(delayedFunction, 5000);
})();