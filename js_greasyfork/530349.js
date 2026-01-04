// ==UserScript==
// @name         Hide Videos by Title or Text
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license      DizayeurCorp
// @description  Masque les vidéos contenant des mots interdits dans le titre ou le texte
// @author       dizayeur
// @match        *://www.youtube.com/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530349/Hide%20Videos%20by%20Title%20or%20Text.user.js
// @updateURL https://update.greasyfork.org/scripts/530349/Hide%20Videos%20by%20Title%20or%20Text.meta.js
// ==/UserScript==

(function hideVideosByTitleOrText() {
    const bannedWords = ["pokemon", "fortnite", "minecraft"]; // Liste des mots interdits

    function normalizeText(text) {
        return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    }

    function filterVideos() {
        document.querySelectorAll("a").forEach(link => {
            const text = normalizeText(link.innerText); // Texte affiché normalisé
            const title = link.getAttribute("title") ? normalizeText(link.getAttribute("title")) : ""; // Titre normalisé

            if (bannedWords.some(word => text.includes(word) || title.includes(word))) {
                let parentDiv = link.closest("#dismissible"); // Trouve la div parent avec l'ID "dismissible"
                if (parentDiv) {
                    parentDiv.remove(); // Supprime complètement la div parent
                }
            }
        });
    }

    // Exécuter une première fois après le chargement initial
    filterVideos();

    // Observer les changements dans le DOM (pour les nouvelles vidéos chargées dynamiquement)
    const observer = new MutationObserver(filterVideos);
    observer.observe(document.body, { childList: true, subtree: true });

})();