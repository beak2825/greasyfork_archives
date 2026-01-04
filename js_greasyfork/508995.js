// ==UserScript==
// @name         TYT - Global Cache Parameters for Links
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a cache parameter to all links based on the current URL's cache parameter.
// @author       You
// @match        https://aem-author-prod.toyota.eu/*
// @match        https://*.toyota.be/*
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
// @match        https://be-nl.dxp-prod-preview.toyota.eu/*
// @match        https://be-fr.dxp-prod-preview.toyota.eu/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/508995/TYT%20-%20Global%20Cache%20Parameters%20for%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/508995/TYT%20-%20Global%20Cache%20Parameters%20for%20Links.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Récupérer l'URL actuelle et les paramètres de recherche
    const url = new URL(window.location.href);
    const searchParams = url.searchParams;

    // Vérifier si le paramètre de cache est présent
    if (searchParams.has('cache')) {
        const cacheValue = searchParams.get('cache');

        // Sélectionner tous les liens de la page
        const links = document.querySelectorAll('a');

        // Parcourir chaque lien et ajouter le paramètre de cache
        links.forEach(link => {
            try {
                // Construire une nouvelle URL basée sur le lien actuel
                const linkUrl = new URL(link.href, window.location.origin);
                linkUrl.searchParams.set('cache', cacheValue);
                link.href = linkUrl.href;
            } catch (e) {
                console.error('Erreur lors de la modification du lien:', link.href, e.message);
            }
        });
    } else {
        console.log('Aucun paramètre de cache n\'est présent dans l\'URL actuelle.');
    }
})();
