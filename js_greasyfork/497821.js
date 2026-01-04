// ==UserScript==
// @name         Cacher les Tweets basés sur des mots-clés et des drapeaux
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Cache automatiquement les tweets des utilisateurs basés sur des mots-clés spécifiques et des drapeaux dans leur nom d'utilisateur sur x.com (anciennement Twitter)
// @author       Narsouu
// @match        https://x.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497821/Cacher%20les%20Tweets%20bas%C3%A9s%20sur%20des%20mots-cl%C3%A9s%20et%20des%20drapeaux.user.js
// @updateURL https://update.greasyfork.org/scripts/497821/Cacher%20les%20Tweets%20bas%C3%A9s%20sur%20des%20mots-cl%C3%A9s%20et%20des%20drapeaux.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Liste des mots-clés et des drapeaux à cacher
    const keywordsToHide = []; // Ajouter des mots-clés et des drapeaux

    // Fonction pour cacher les tweets basés sur les mots-clés et les drapeaux
    function hideTweets() {

        if (keywordsToHide.length === 0) {
            return;
        }

        // Sélectionner tous les tweets
        const tweets = document.querySelectorAll('article[role="article"]');
        tweets.forEach(tweet => {
            const usernameElements = tweet.querySelectorAll('div[data-testid="User-Name"] span, div[data-testid="User-Name"] img');
            let hide = false;
            usernameElements.forEach(element => {
                const text = element.alt || element.innerText;
                if (keywordsToHide.some(keyword => text.includes(keyword))) {
                    hide = true;
                }
            });
            if (hide) {
                tweet.style.display = 'none';
            }
        });
    }

    // Observer pour surveiller les nouvelles entrées dans le flux de tweets
    const observer = new MutationObserver(hideTweets);
    observer.observe(document, { childList: true, subtree: true });

    // Cacher les tweets au chargement initial
    hideTweets();
})();