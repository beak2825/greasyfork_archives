// ==UserScript==
// @name         Allociné Jackett Integration
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Ajoute un logo Jackett cliquable à côté des titres sur Allociné
// @author       claude.ai
// @match        https://www.allocine.fr/*
// @icon         https://raw.githubusercontent.com/Jackett/Jackett/master/src/Jackett.Common/Content/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547399/Allocin%C3%A9%20Jackett%20Integration.user.js
// @updateURL https://update.greasyfork.org/scripts/547399/Allocin%C3%A9%20Jackett%20Integration.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const JACKETT_LOGO_URL = 'https://raw.githubusercontent.com/Jackett/Jackett/master/src/Jackett.Common/Content/favicon.ico';

    // URL de Jackett (Changer IP:PORT)
    const JACKETT_BASE_URL = 'https://IP:PORT/jackett/UI/Dashboard#search=';

    // Fonction pour extraire le titre original du film/série
    function getOriginalTitle() {
        // Chercher le titre original en cherchant d'abord les patterns "Titre original"
        const textContent = document.body.textContent || document.body.innerText;

        // Pattern pour "Titre original : Title" ou "Titre original Title"
        const originalTitlePattern = /Titre original\s*:?\s*([^\n\r]+)/i;
        const match = textContent.match(originalTitlePattern);

        if (match && match[1]) {
            let originalTitle = match[1].trim();

            // Nettoyer le titre (enlever les caractères parasites)
            originalTitle = originalTitle.replace(/^\s*:\s*/, ''); // Enlever : en début
            originalTitle = originalTitle.split(/\s{2,}|[\n\r]/)[0]; // Prendre seulement la première partie avant les espaces multiples ou retours ligne
            originalTitle = originalTitle.replace(/\s*\([^)]*\)$/, ''); // Enlever les parenthèses finales (année, etc.)

            if (originalTitle && originalTitle.length > 1 &&
                !originalTitle.match(/^\d{4}$/) && // Pas juste une année
                !originalTitle.match(/De\s+/i) && // Pas un réalisateur
                !originalTitle.includes('min')) { // Pas une durée
                return originalTitle;
            }
        }

        // Fallback: chercher dans les métadonnées structurées
        const metaSelectors = [
            '.meta-body .that span:last-child',
            '.originalTitle',
            'p.meta-body .that',
            '.meta .that span',
            '[class*="original"]',
            'span[style*="italic"]',
        ];

        for (const selector of metaSelectors) {
            const elements = document.querySelectorAll(selector);
            for (const element of elements) {
                let text = element.textContent.trim();

                // Nettoyer le texte si il contient "Titre original"
                if (text.toLowerCase().includes('titre original')) {
                    text = text.replace(/.*titre original\s*:?\s*/i, '').trim();
                }

                if (text &&
                    text.length > 1 &&
                    !text.match(/^\d{4}$/) &&
                    !text.match(/^\d+\s?(min|h)/) &&
                    !text.includes('De ') &&
                    !text.includes('Avec ')) {
                    return text;
                }
            }
        }

        return null;
    }

    // Fonction pour extraire le nom du film/série (français en fallback)
    function getMovieTitle() {
        // D'abord essayer d'obtenir le titre original
        const originalTitle = getOriginalTitle();
        if (originalTitle) {
            return originalTitle;
        }

        // Sinon, utiliser le titre français
        const selectors = [
            '.titlebar-title', // Page principale de film/série
            '.content-title', // Autre format de titre
            'h1[data-testid="title"]', // Nouveau format
            'h1.title', // Format classique
            '.movie-title',
            '.series-title',
            'h1', // Fallback général
        ];

        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent.trim()) {
                return element.textContent.trim();
            }
        }

        // Si aucun titre trouvé, essayer d'extraire depuis le titre de la page
        const pageTitle = document.title;
        const match = pageTitle.match(/^([^-]+)/);
        return match ? match[1].trim() : 'Film';
    }

    // Fonction pour créer et insérer le logo Jackett
    function createJackettLogo() {
        const movieTitle = getMovieTitle();

        // Créer l'élément du logo
        const logoElement = document.createElement('a');
        logoElement.href = JACKETT_BASE_URL + encodeURIComponent(movieTitle) + '&filter=all';
        logoElement.target = '_blank';
        logoElement.style.cssText = `
            display: inline-flex;
            margin-right: 10px;
            margin-left: 5px;
            vertical-align: middle;
            transition: opacity 0.3s ease;
            text-decoration: none;
        `;

        const logoImg = document.createElement('img');
        logoImg.src = JACKETT_LOGO_URL;
        logoImg.alt = 'Rechercher sur Jackett';
        logoImg.title = `Rechercher "${movieTitle}" sur Jackett`;
        logoImg.style.cssText = `
            width: 32px;
            height: 32px;
            border-radius: 4px;
            cursor: pointer;
        `;

        // Effet hover
        logoElement.addEventListener('mouseenter', () => {
            logoImg.style.opacity = '0.7';
        });
        logoElement.addEventListener('mouseleave', () => {
            logoImg.style.opacity = '1';
        });

        logoElement.appendChild(logoImg);
        return logoElement;
    }

    // Fonction pour insérer le logo à côté du titre
    function insertJackettLogo() {
        // Sélecteurs pour trouver les titres sur différents types de pages
        const titleSelectors = [
            '.titlebar-title',
            '.content-title',
            'h1[data-testid="title"]',
            'h1.title',
            '.movie-title',
            '.series-title'
        ];

        for (const selector of titleSelectors) {
            const titleElement = document.querySelector(selector);
            if (titleElement && !titleElement.querySelector('.jackett-logo')) {
                const logo = createJackettLogo();
                logo.classList.add('jackett-logo'); // Marquer pour éviter les doublons

                // Insérer le logo au début du titre
                titleElement.insertBefore(logo, titleElement.firstChild);
                console.log('Logo Jackett ajouté pour:', getMovieTitle());
                return true;
            }
        }
        return false;
    }

    // Fonction d'initialisation
    function init() {
        // Attendre que la page soit chargée
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        // Essayer d'insérer le logo immédiatement
        if (!insertJackettLogo()) {
            // Si pas trouvé, observer les changements DOM (pour les pages AJAX)
            const observer = new MutationObserver(() => {
                insertJackettLogo();
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            // Arrêter l'observation après 10 secondes pour économiser les ressources
            setTimeout(() => {
                observer.disconnect();
            }, 10000);
        }
    }

    // Démarrer le script
    init();

    // Pour les sites avec navigation AJAX, réessayer lors des changements d'URL
    let currentUrl = window.location.href;
    setInterval(() => {
        if (window.location.href !== currentUrl) {
            currentUrl = window.location.href;
            setTimeout(insertJackettLogo, 1000); // Délai pour laisser le temps à la page de se charger
        }
    }, 1000);

})();