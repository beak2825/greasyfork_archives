// ==UserScript==
// @name         BypassYoutubePub
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Bypass YouTube publicity (French Version) and handle multiple languages
// @author       MeGaBOuSsOl
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431110/BypassYoutubePub.user.js
// @updateURL https://update.greasyfork.org/scripts/431110/BypassYoutubePub.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Liste des textes de boutons "Skip" ou "Ignorer" dans différentes langues
    const skipButtonTexts = [
        "Ignorer l'annonce", // Français
        "Skip Ad",           // Anglais
        "Anzeige überspringen", // Allemand
        "Saltar anuncio",    // Espagnol
        "Salta annuncio",    // Italien
        "広告をスキップ",     // Japonais
        "跳过广告",           // Chinois
        "광고 건너뛰기",      // Coréen
        "Пропустить рекламу" // Russe
    ];

    // Fonction pour détecter et cliquer sur le bouton "Skip" ou "Ignorer"
    function skipAd() {
        // Rechercher tous les boutons possibles
        const buttons = document.querySelectorAll('.ytp-ad-skip-button, .ytp-ad-skip-button-icon, .ytp-skip-ad-button');

        buttons.forEach(button => {
            if (skipButtonTexts.some(text => button.textContent.includes(text))) {
                button.click();
                console.log('Publicité skippée !');
                clearInterval(checkInterval); // Arrêter l'intervalle une fois l'action effectuée
            }
        });
    }

    // Fonction pour fermer les bannières publicitaires
    function closeBannerAds() {
        const closeButtons = document.querySelectorAll('.ytp-ad-overlay-close-button, .ytp-ad-preview-text, .ytp-ad-skip-button');

        closeButtons.forEach(button => {
            button.click();
            console.log('Bannière publicitaire fermée !');
        });
    }

    // Vérifier toutes les secondes
    const checkInterval = setInterval(() => {
        skipAd();
        closeBannerAds();
    }, 1000);

    // Arrêter l'intervalle après 5 minutes pour éviter une utilisation excessive du CPU
    setTimeout(() => {
        clearInterval(checkInterval);
        console.log('Arrêt du script après 5 minutes.');
    }, 300000); // 5 minutes
})();