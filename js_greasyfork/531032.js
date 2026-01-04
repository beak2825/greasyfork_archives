// ==UserScript==
// @name         Tribal Wars Ping Gecikme Ölçer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  www.klanlar.org sunucusuna ping atarak gecikmeyi ölçer ve arayüzde gösterir
// @author       berigel
// @match        *://*.klanlar.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531032/Tribal%20Wars%20Ping%20Gecikme%20%C3%96l%C3%A7er.user.js
// @updateURL https://update.greasyfork.org/scripts/531032/Tribal%20Wars%20Ping%20Gecikme%20%C3%96l%C3%A7er.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Arayüzü oluştur
    function createUI() {
        if (document.getElementById('pingUI')) return;

        const ui = document.createElement('div');
        ui.id = 'pingUI';
        ui.style.position = 'fixed';
        ui.style.top = '10px';
        ui.style.left = '10px';
        ui.style.background = '#fff';
        ui.style.border = '2px solid #000';
        ui.style.padding = '10px';
        ui.style.zIndex = '1000';
        ui.style.fontFamily = 'Arial, sans-serif';
        ui.style.fontSize = '14px';
        ui.style.boxShadow = '3px 3px 10px rgba(0,0,0,0.2)';

        ui.innerHTML = `
            <h3 style="margin: 0; font-size: 16px;">Ping Gecikmesi</h3>
            <p id="pingValue" style="font-weight: bold; font-size: 18px; color: black;">Ölçülüyor...</p>
            <button id="pingButton">Ping Testi Yap</button>
        `;

        document.body.appendChild(ui);

        // Butona tıklanınca manuel ping testi başlat
        document.getElementById('pingButton').addEventListener('click', measurePing);
    }

    // Ping ölçüm fonksiyonu
    async function measurePing() {
        const url = 'https://www.klanlar.org/favicon.ico'; // Küçük dosya ile ping ölçme
        const startTime = performance.now();

        try {
            await fetch(url, { method: 'HEAD', cache: 'no-store' });
            const endTime = performance.now();
            const pingTime = Math.round(endTime - startTime);

            updatePingDisplay(pingTime);
        } catch (error) {
            document.getElementById('pingValue').innerText = "Bağlantı Hatası!";
            document.getElementById('pingValue').style.color = "red";
        }
    }

    // Ping değerini ekrana yazdır
    function updatePingDisplay(ping) {
        const pingDisplay = document.getElementById('pingValue');

        if (ping < 200) {
            pingDisplay.style.color = "green";
            pingDisplay.innerText = `🟢 ${ping} ms (Mükemmel)`;
        } else if (ping < 500) {
            pingDisplay.style.color = "orange";
            pingDisplay.innerText = `🟡 ${ping} ms (Orta Seviye)`;
        } else {
            pingDisplay.style.color = "red";
            pingDisplay.innerText = `🔴 ${ping} ms (Gecikme Yüksek!)`;
        }
    }

    // Başlat
    createUI();
    measurePing();
    setInterval(measurePing, 5000); // Her 5 saniyede bir ping ölç
})();
// ==UserScript==
// @name        New script klanlar.org
// @namespace   Violentmonkey Scripts
// @match       https://tr93.klanlar.org/game.php*
// @grant       none
// @version     1.0
// @author      -
// @description 27.03.2025 17:52:11
// ==/UserScript==
