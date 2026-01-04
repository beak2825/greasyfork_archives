// ==UserScript==
// @name         DC City Redux
// @namespace    http://tampermonkey.net/
// @version      0.1.7
// @description  Amélioration graphique de la ville de Dreadcast
// @author       M0lly
// @match        https://www.dreadcast.net/Main
// @grant        none
// @license      A definir
// @downloadURL https://update.greasyfork.org/scripts/511773/DC%20City%20Redux.user.js
// @updateURL https://update.greasyfork.org/scripts/511773/DC%20City%20Redux.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // URL des fichiers .gif avec les bâtiments personnalisés
    const newBuildingGif = 'https://dc-buldings.netlify.app/carte_batiments.gif';
    const newRoadGif = 'https://dc-buldings.netlify.app/carte_rues_s1.png';

    //Fonction updateImages() pour remplacer à la fois les lignes avec la classe .case_map (pour les batiments) et la div avec l'url de la map des rues du S1
    const updateImages = () => {
        document.querySelectorAll('.case_map').forEach(el => {
            el.style.backgroundImage = `url(${newBuildingGif})`;
        });
        document.querySelectorAll('div[style*="images/carte/carte_rues_s1.png"]').forEach(div => {
            div.style.backgroundImage = `url(${newRoadGif})`;
        });
    };

    // Initialisaton de l'update des images au lancement du script.
    updateImages();
    
    // Observer pour vérifier si au moins une mutation a ajouté des nœuds. 
    // Si la const 'shouldUpdate = true' alors on relance la fonction updateImages() pour refresh les images. (utile lors des entrées/sorties de batiments.)
    const observer = new MutationObserver(mutations => {
        const shouldUpdate = mutations.some(mutation => mutation.addedNodes.length > 0);     
        if (shouldUpdate) updateImages();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();