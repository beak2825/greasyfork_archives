// ==UserScript==
// @name         AITL noir, texte rouge (paragraphe, texte, titre, liens) et boutons rouges
// @namespace    http://tampermonkey.net/
// @version      1.10
// @description  AITL doux pour les yeux : conteneurs sombres, textes (paragraphe, texte, titre, liens) en rouge, boutons en rouge avec texte noir
// @match        *://www.dreadcast.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530978/AITL%20noir%2C%20texte%20rouge%20%28paragraphe%2C%20texte%2C%20titre%2C%20liens%29%20et%20boutons%20rouges.user.js
// @updateURL https://update.greasyfork.org/scripts/530978/AITL%20noir%2C%20texte%20rouge%20%28paragraphe%2C%20texte%2C%20titre%2C%20liens%29%20et%20boutons%20rouges.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function overrideStyles() {
        // Cibler précisément #zone_dataBox .aitl pour modifier son fond
        const aitlElement = document.querySelector('#zone_dataBox .aitl');
        if (aitlElement) {
            // Désactiver complètement l'image de fond et définir la couleur de fond
            aitlElement.style.setProperty('background', 'rgba(15, 13, 13, 1)', 'important');
            aitlElement.style.setProperty('border-radius', '100px', 'important');
            aitlElement.style.setProperty('background-image', 'none', 'important'); // Suppression explicite de l'image de fond
            aitlElement.style.setProperty('box-sizing', 'border-box', 'important'); // Préserver la mise en page
        }

        // Modification des conteneurs généraux de l'AITL, sauf celui ciblé précédemment
        document.querySelectorAll('#zone_dataBox .aitl .actions, #zone_dataBox .aitl .navigation, #zone_dataBox .aitl .principal').forEach(el => {
            el.style.setProperty('border-radius', '1rem', 'important');
            el.style.setProperty('background-color', '#1e1a1a', 'important'); // Nouvelle couleur de fond sans image
            el.style.setProperty('box-shadow', 'inset 0 0 5px -2px', 'important');
            el.style.setProperty('z-index', '5', 'important');
            el.style.setProperty('opacity', '1', 'important'); // Supprimer la transparence
            el.style.setProperty('background-image', 'none', 'important'); // Suppression explicite de l'image de fond
        });

        // Appliquer la couleur rouge aux textes contenus dans les div "paragraphe", "texte" et "titre" de l'AITL
        document.querySelectorAll('#zone_dataBox .aitl .paragraphe, #zone_dataBox .aitl .texte, #zone_dataBox .aitl .titre, #zone_dataBox .aitl td.type1').forEach(el => {
            el.style.setProperty('color', 'red', 'important');
        });

        // Appliquer la couleur rouge aux hyperliens en <td> et <span> avec classes "link couleur2" dans l'AITL
        document.querySelectorAll('#zone_dataBox .aitl td.link.couleur2, #zone_dataBox .aitl span.link.couleur2').forEach(el => {
            el.style.setProperty('color', 'red', 'important');
        });

        // Modification spécifique pour les boutons "Canaux Officiels" et "Éteindre"
        document.querySelectorAll('.navigation.hcancel .menu').forEach(el => {
            el.style.setProperty('background-color', 'red', 'important');
            el.style.setProperty('color', 'black', 'important');
        });

        // Modification spécifique pour le bouton "Rédiger une annonce"
        document.querySelectorAll('#zone_dataBox .aitl .menu.menu1.last.transition3s').forEach(el => {
            el.style.setProperty('background-color', 'red', 'important');
            el.style.setProperty('color', 'black', 'important');
        });
    }

    // Observer les modifications dans le DOM pour appliquer les styles dynamiquement
    new MutationObserver(overrideStyles).observe(document.body, { childList: true, subtree: true });

    // Appliquer les styles après le chargement complet de la page (avec un léger délai)
    window.addEventListener('load', () => setTimeout(overrideStyles, 2000));
})();
