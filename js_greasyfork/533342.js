// ==UserScript==
// @name         Gartic.io Cookie Cleaner
// @name:tr      Gartic.io Çerez Temizleyici
// @namespace    http://tampermonkey.net/
// @version      2025-04-19
// @description  Deletes specific cookies when the exit button is clicked on Gartic.io
// @description:tr  Gartic.io'da çıkış düğmesine tıklandığında belirli çerezleri siler
// @author       anonimbiri
// @match        *://gartic.io/*
// @icon         https://raw.githubusercontent.com/Gartic-Developers/Kawaii-Helper/refs/heads/main/Assets/kawaii-logo.png
// @grant        GM_cookie
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/533342/Garticio%20Cookie%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/533342/Garticio%20Cookie%20Cleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Havalı neon-mor konsol log stili
    const cyberAnimeLog = (message, isError = false) => {
        const style = `
            background: linear-gradient(90deg, #6a00ff, #ff00ff);
            color: ${isError ? '#ff4d4d' : '#e0e0ff'};
            padding: 10px 15px;
            border-radius: 5px;
            font-family: 'Courier New', monospace;
            font-size: 13px;
            font-weight: bold;
            text-shadow: 0 0 8px #ff00ff, 0 0 12px #6a00ff;
            box-shadow: 0 0 15px #ff00ff;
            border: 1px solid #ff00ff;
        `;
        console.log(`%c🌌 ${message} ⚡️`, style);
    };

    // Function to delete a cookie
    function deleteCookie(name) {
        GM_cookie.delete({ name: name }, function(error) {
            if (error) {
                cyberAnimeLog(`✖ ${name} çerezi silinirken hata oluştu!`, true);
            } else {
                cyberAnimeLog(`✔ ${name} çerezi başarıyla silindi!`);
            }
        });
    }

    // Exit butonunu bul ve click event ekle
    function setupExitButton() {
        const exitButton = document.getElementById('exit');
        if (exitButton) {
            exitButton.addEventListener('click', function() {
                cyberAnimeLog('Çerez avı başladı! 🔫');
                deleteCookie('garticio');
                deleteCookie('cf_clearance');
            });
            cyberAnimeLog('Exit butonu bulundu ve hazır! 🎮');
            return true;
        }
        return false;
    }

    // İlk deneme
    if (!setupExitButton()) {
        cyberAnimeLog('Exit butonu henüz yüklenmedi, gözetliyorum... 👾', true);

        // MutationObserver ile butonun yüklenmesini izle
        const observer = new MutationObserver((mutations, obs) => {
            if (setupExitButton()) {
                obs.disconnect(); // Buton bulundu, izlemeyi bırak
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    deleteCookie('garticio');
    deleteCookie('cf_clearance');
})();