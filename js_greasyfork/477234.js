// ==UserScript==
// @name         Automatisation Forum
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatisation pour remplir un champ de texte et cliquer sur un bouton
// @author       Vous
// @match        https://onche.org/topic/*
// @grant        none
// @license      GNU
// @downloadURL https://update.greasyfork.org/scripts/477234/Automatisation%20Forum.user.js
// @updateURL https://update.greasyfork.org/scripts/477234/Automatisation%20Forum.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Fonction pour générer "post" ou "cancer" au hasard
    function getRandomText() {
        const options = ["post", "cancer"];
        return options[Math.floor(Math.random() * options.length)];
    }

    // Fonction pour remplir le champ de texte et cliquer sur le bouton
    function fillTextareaAndClickButton() {
        const textarea = document.querySelector('.textarea');
        const button = document.querySelector('.button.medium.filled.right');

        if (textarea && button) {
            textarea.value = getRandomText();
            button.click();
        }
    }

    // Utilisation de MutationObserver pour détecter les changements
    const observer = new MutationObserver(function(mutationsList) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                fillTextareaAndClickButton();
            }
        }
    });

    // Observer le corps de la page
    observer.observe(document.body, { childList: true, subtree: true });
})();
