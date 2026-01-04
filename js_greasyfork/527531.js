// ==UserScript==
// @name         Ouvrir les liens externes dans un nouvel onglet avec watcher
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Ouvre dans un nouvel onglet les liens qui mènent à un domaine différent et surveille les changements du DOM
// @author       Morgan
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527531/Ouvrir%20les%20liens%20externes%20dans%20un%20nouvel%20onglet%20avec%20watcher.user.js
// @updateURL https://update.greasyfork.org/scripts/527531/Ouvrir%20les%20liens%20externes%20dans%20un%20nouvel%20onglet%20avec%20watcher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Fonction pour vérifier si un lien mène à un domaine différent
    function isExternalLink(link) {
        try {
            const linkURL = new URL(link.href, document.baseURI);
            return linkURL.hostname !== window.location.hostname;
        } catch (e) {
            return false;
        }
    }

    // Fonction pour vérifier si un lien est un lien JavaScript
    function isJavaScriptLink(link) {
        const href = link.getAttribute('href');
        return href.startsWith('javascript:') || href === '#';
    }

    // Fonction pour mettre à jour les liens
    function updateLinks(root = document) {
        const links = root.querySelectorAll('a[href]');
        links.forEach(link => {
            if (!isJavaScriptLink(link) && isExternalLink(link)) {
                link.setAttribute('target', '_blank');
            }
        });
    }

    // Mettre à jour les liens au chargement de la page
    updateLinks();

    // Configurer un observateur de mutations pour surveiller les modifications du DOM
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        updateLinks(node);
                    }
                });
            }
        });
    });

    // Configuration de l'observateur pour observer les ajouts d'enfants dans le DOM
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();