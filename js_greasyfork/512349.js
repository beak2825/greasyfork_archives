// ==UserScript==
// @name         No Globe Button
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Completely removes the GlobeButton button from the DOM.
// @author       Pixel Berg
// @match        https://pixelplanet.fun/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512349/No%20Globe%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/512349/No%20Globe%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // GlobeButton'ı tamamen DOM'dan kaldıran fonksiyon
    const removeGlobeButton = () => {
        const globeButton = document.getElementById('globebutton');
        if (globeButton) {
            globeButton.remove(); // GlobeButton'ı tamamen DOM'dan kaldır
            console.log('GlobeButton DOM\'dan kaldırıldı.');
        }
    };

    // Sayfa yüklendiğinde butonu kaldır
    window.addEventListener('load', () => {
        // Butonu hemen kaldır
        removeGlobeButton();

        // Dinamik içerik için DOM değişikliklerini izle
        const observer = new MutationObserver(removeGlobeButton);
        observer.observe(document.body, { childList: true, subtree: true });
    });
})();