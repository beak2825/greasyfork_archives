// ==UserScript==
// @name         Crunchyroll Skip Intro/Outro Multilingual
// @namespace    https://static.crunchyroll.com/
// @version      0.4
// @description  Skip intro and credits buttons on Crunchyroll iframe in 20+ languages
// @author       Yanis GANGNANT
// @match        https://static.crunchyroll.com/*
// @run-at       document-end
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532472/Crunchyroll%20Skip%20IntroOutro%20Multilingual.user.js
// @updateURL https://update.greasyfork.org/scripts/532472/Crunchyroll%20Skip%20IntroOutro%20Multilingual.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Liste des traductions courantes de "Skip Intro" et "Skip Credits" dans les principales langues
    const skipIntroLabels = [
        "Passer l'intro",   // Français
        "Skip Intro",       // Anglais
        "Saltar introducción", // Espagnol
        "Intro überspringen",  // Allemand
        "Introdurre salta",   // Italien (approx)
        "Salt de introducció",// Catalan
        "跳过片头",           // Chinois simplifié
        "イントロをスキップ",     // Japonais
        "인트로 건너뛰기",      // Coréen
        "Pular introdução",  // Portugais
        "Пропустить начало", // Russe
        "Atlaa intro",       // Finlandais
        "Uvod preskoči",     // Croate
        "Пропустить вступление", // Ukrainien alternative
        "Intro überspringen", // Suisse allemand (comme allemande)
        "Passer l’intro",    // Variation avec apostrophe typographique
        "Saltā ievads",      // Letton
        "Skip inleiding",    // Néerlandais
        "Skip Introducción", // Espagnol variation majuscule
        "Ignorer l'intro"    // Français alternatif
    ];

    const skipCreditsLabels = [
        "Passer les crédits",
        "Skip Credits",
        "Saltar créditos",
        "Credits überspringen",
        "Saltare i titoli di coda",
        "Saltar crèdits",
        "跳过片尾",
        "エンドクレジットをスキップ",
        "크레딧 건너뛰기",
        "Pular créditos",
        "Пропустить титры",
        "Ohita lopputekstit",
        "Preskoči završne špice",
        "Пропустить финальные титры",
        "Credits überspringen",
        "Passer les crédits",
        "Izlaist titrus",
        "Skip aftiteling",
        "Skip Créditos",
        "Ignorer les crédits"
    ];

    // Sélecteur générique des boutons avec aria-label
    function clickSkipButtons() {
        const allButtons = document.querySelectorAll('div[role="button"][aria-label]');
        allButtons.forEach(button => {
            const label = button.getAttribute('aria-label');
            if (!label) return;

            if (skipIntroLabels.includes(label) && button.offsetParent !== null) {
                button.click();
                console.log('Skip Intro cliqué:', label);
            }

            if (skipCreditsLabels.includes(label) && button.offsetParent !== null) {
                button.click();
                console.log('Skip Credits cliqué:', label);
            }
        });
    }

    setInterval(clickSkipButtons, 1000);
})();
