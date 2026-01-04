// ==UserScript==
// @name        YouTube Shorts Remover // Youtube Anti-Shorts
// @name:en     YouTube Shorts Remover
// @name:fr     Youtube Anti-Shorts
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/*
// @grant       none
// @version     1.6.1
// @contributionURL https://www.paypal.com/donate/?cmd=_donations&business=boiskarine59960@gmail.com&item_name=Greasy+Fork+donation
// @author      TrouveMe
// @description Remove Shorts videos from YouTube
// @description:fr Supprimer les vidéos Shorts de YouTube
// @description:en Remove Shorts videos from YouTube
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/488898/Youtube%20Anti-Shorts.user.js
// @updateURL https://update.greasyfork.org/scripts/488898/Youtube%20Anti-Shorts.meta.js
// ==/UserScript==

// Fonction pour supprimer les éléments indésirables
(function() {
    'use strict';

    // Fonction pour supprimer les éléments Shorts
    function removeShorts() {
        // Sélectionner et supprimer les vidéos Shorts dans les sections principales
        const videoSelectors = [
            'ytd-grid-video-renderer',
            'ytd-video-renderer',
            'ytd-rich-item-renderer'
        ];

        videoSelectors.forEach(selector => {
            const videos = document.querySelectorAll(selector);
            videos.forEach(video => {
                const badge = video.querySelector('ytd-badge-supported-renderer[text*="Shorts"]');
                const link = video.querySelector('a[href*="/shorts/"]');
                const title = video.querySelector('#video-title');

              if (badge || link || 
                 (title && (
                     title.textContent.toLowerCase().includes('#short') ||
                     title.textContent.toLowerCase().includes('#shorts')
                 ))) {
                 video.remove();
              }
            });
        });

        // Supprimer les vidéos Shorts dans les suggestions latérales
        const suggestionSelectors = [
            'ytd-compact-video-renderer',
            'ytd-compact-radio-renderer'
        ];

        suggestionSelectors.forEach(selector => {
            const suggestions = document.querySelectorAll(selector);
            suggestions.forEach(suggestion => {
                const badge = suggestion.querySelector('ytd-badge-supported-renderer[text*="Shorts"]');
                const hastag = suggestion.querySelector('yt-formatted-string[text*="#shorts"]');
                if (badge || hastag) {
                    suggestion.remove();
                }
            });
        });

        // Supprimer les onglets et les liens de Shorts dans la barre de navigation
        const tabsSelectors = [
            'tp-yt-paper-tab a[title="Shorts"]',
            'tp-yt-paper-tab[aria-label="Shorts"]',
            '#endpoint[title="Shorts"]',
            'ytd-guide-entry-renderer a[title="Shorts"]'
        ];

        tabsSelectors.forEach(selector => {
            const tabs = document.querySelectorAll(selector);
            tabs.forEach(tab => {
                tab.parentNode.removeChild(tab);
            });
        });

        // Supprimer les filtres 'short' dans yt-chip-cloud-chip-renderer
        const chipFilters = document.querySelectorAll('yt-chip-cloud-chip-renderer');
        chipFilters.forEach(chip => {
            const chipText = chip.textContent.trim().toLowerCase();
            if (chipText.includes('short')) {
                chip.remove();
            }
        });

        // Supprimer les vidéos Shorts dans ytd-reel-shelf-renderer
        const reelShelf = document.querySelectorAll('ytd-reel-shelf-renderer');
        reelShelf.forEach(shelf => {
            const shelfText = shelf.textContent.trim().toLowerCase();
            if (shelfText.includes('short')) {
                shelf.remove();
            }
        });
    }

    // Exécuter la fonction pour supprimer les Shorts une première fois
    removeShorts();

    // Surveiller les changements dans le DOM pour supprimer les Shorts dynamiquement chargés
    const observer = new MutationObserver(removeShorts);
    observer.observe(document.body, { childList: true, subtree: true });

    // Optionnel: Afficher un message pour confirmer la suppression dans la console
    console.log("Tous les éléments Shorts ont été supprimés.");
})();
