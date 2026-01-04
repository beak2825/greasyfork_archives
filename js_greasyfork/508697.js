// ==UserScript==
// @name         TYT - Toyota AEM - Edit Page & Cache Management
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Ajout d'un bouton pour éditer la page et rafraîchir le cache sur Toyota AEM
// @author       You
// @match        https://*.toyota.be/*
// @match        https://*.toyota.eu/*
// @match        https://*.toyota.lu/*
// @match        https://*.toyota.de/*
// @match        https://*.toyota.nl/*
// @match        https://*.toyota.fr/*
// @match        https://*.lexus.be/*
// @match        https://*.lexus.eu/*
// @match        https://*.lexus.de/*
// @match        https://*.lexus.lu/*
// @match        https://*.lexus.fr/*
// @match        https://*.lexus.nl/*
// @match        https://*.lexus.be/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=toyota.eu
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/508697/TYT%20-%20Toyota%20AEM%20-%20Edit%20Page%20%20Cache%20Management.user.js
// @updateURL https://update.greasyfork.org/scripts/508697/TYT%20-%20Toyota%20AEM%20-%20Edit%20Page%20%20Cache%20Management.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Sélectionner l'élément avec la classe "search-results"
    var element = document.querySelector('.search-results');

    // Vérifier si l'élément a l'attribut "data-root"
    if (element && element.hasAttribute('data-root')) {
        // Récupérer la valeur de l'attribut "data-root"
        var dataRootValue = 'https://aem-author-prod.toyota.eu/editor.html' + element.getAttribute('data-root') + '.html';
        console.log(dataRootValue); // Affiche la valeur dans la console

        // Créer un lien "Edit Page"
        var editLink = document.createElement('a');
        editLink.innerHTML = 'Edit Page';
        editLink.href = dataRootValue;
        editLink.target = '_self';
        editLink.style.position = 'fixed';
        editLink.style.bottom = '60px'; // pour ne pas chevaucher les autres boutons
        editLink.style.left = '20px';
        editLink.style.zIndex = '99999';
        editLink.style.backgroundColor = 'rgba(255, 255, 255, .25)';

        document.body.appendChild(editLink);

        // Fonction pour ajouter le bouton de rafraîchissement du cache
        function addRefreshCacheButton() {
            // Créer un bouton "Refresh Cache"
            var button = document.createElement('button');
            button.innerHTML = 'Refresh Cache';
            button.id = 'refresh-cache-button';
            button.style.position = 'fixed';
            button.style.bottom = '100px'; // ajuster la position pour éviter de chevaucher les autres boutons
            button.style.left = '20px';
            button.style.zIndex = '99999';
            button.style.backgroundColor = 'rgba(255, 255, 255, .25)';

            document.body.appendChild(button);

            // Ajouter l'écouteur d'événements pour rafraîchir le cache
            button.addEventListener('click', function () {
                // Récupérer l'URL actuelle sans paramètres de cache
                var url = new URL(window.location.href);
                var searchParams = url.searchParams;

                // Supprimer les paramètres de cache existants
                searchParams.delete('cache');

                // Ajouter un nouveau paramètre de cache avec la date et l'heure actuelle
                var dateHeure = new Date().getTime();
                searchParams.set('cache', dateHeure);

                // Recharger la page avec les nouveaux paramètres de cache
                window.location.href = url.href;
            });
        }

        // Ajouter le bouton pour rafraîchir le cache
        addRefreshCacheButton();
    }
})();
