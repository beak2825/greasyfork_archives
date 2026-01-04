// ==UserScript==
// @name         Add Magnet Link to Polskie Torrenty
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a magnet link to torrents on polskie-torrenty.eu
// @author       Miro
// @match        https://polskie-torrenty.eu/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/510733/Add%20Magnet%20Link%20to%20Polskie%20Torrenty.user.js
// @updateURL https://update.greasyfork.org/scripts/510733/Add%20Magnet%20Link%20to%20Polskie%20Torrenty.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Funkcja dodająca magnet link
    function addMagnetLink() {
        // Szukamy wszystkich elementów z klasą 'pole'
        const torrents = document.querySelectorAll('.pole');

        torrents.forEach(torrent => {
            // Znajdź ID torrenta w linku pobierania
            const downloadLink = torrent.querySelector('a[href*="download.php"]');
            if (downloadLink) {
                const torrentIdMatch = downloadLink.href.match(/id=(\w+)/);
                if (torrentIdMatch) {
                    const torrentId = torrentIdMatch[1];

                    // Tworzymy magnet link
                    const magnetLink = document.createElement('a');
                    magnetLink.href = `magnet:?xt=urn:btih:${torrentId}`; // Użyj odpowiedniego hash
                    magnetLink.textContent = 'Pobierz Magnet Link';
                    magnetLink.style.color = 'blue';
                    magnetLink.style.fontWeight = 'bold';
                    magnetLink.style.display = 'block';
                    magnetLink.style.marginTop = '10px';

                    // Dodaj magnet link do elementu torrenta
                    torrent.appendChild(magnetLink);
                }
            }
        });
    }

    // Uruchom funkcję po załadowaniu strony
    window.addEventListener('load', addMagnetLink);
})();
