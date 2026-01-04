// ==UserScript==
// @name         Fake Balance & Level (Persistent Visual)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Modifie visuellement la balance et le niveau (persistant après refresh)
// @match        *://*.rbxgold.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 🔧 Configuration (tu peux changer ces valeurs)
    const fakeBalance = "9999";
    const fakeLevel = "99";

    // 🔒 Sauvegarde dans le localStorage
    localStorage.setItem('fake_balance', fakeBalance);
    localStorage.setItem('fake_level', fakeLevel);

    // 🔁 Fonction qui applique les changements visuels
    function applyFakeValues() {
        // Trouve l'élément de balance (ajuste si besoin)
        const balanceEl = document.querySelector('div:has(svg)'); // à ajuster selon ton HTML exact
        if (balanceEl && balanceEl.innerText.match(/^\d+$/)) {
            balanceEl.innerText = localStorage.getItem('fake_balance');
        }

        // Exemple pour le niveau (si affiché quelque part)
        const levelEl = document.querySelector('.user-level'); // remplace avec le vrai sélecteur
        if (levelEl) {
            levelEl.innerText = "Level " + localStorage.getItem('fake_level');
        }
    }

    // 📌 Appliquer les changements après chargement
    window.addEventListener('load', () => {
        setTimeout(applyFakeValues, 1000); // petit délai pour s'assurer que tout est chargé
    });
})();