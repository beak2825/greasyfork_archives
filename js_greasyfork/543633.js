// ==UserScript==
// @name         Babasokucu
// @namespace    http://tampermonkey.net/
// @version      3.3 - TEMIZ KURULUM
// @description  Gartic.io'da Google Görseller'de arama yapıp ilk resmi gösterir.
// @author       Ferres
// @match        https://gartic.io/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      googleapis.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543633/Babasokucu.user.js
// @updateURL https://update.greasyfork.org/scripts/543633/Babasokucu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === API BİLGİLERİ BURADA HAZIR, DOKUNMA ===
    const API_KEY = "AIzaSyBP6U28ngnKhCKYoYgkExWXNxHT_-MCJvQ";
    const SEARCH_ENGINE_ID = "d3a4fb1c91a394ccd";
    // ==========================================


    // Panel ve içeriği için gerekli CSS stillerini ekle
    GM_addStyle(`
        #babaSokucuPanel {
            position: fixed; top: 10px; left: 50%; transform: translateX(-50%); width: 320px;
            background-color: #f1f1f1; border: 2px solid #888; border-radius: 8px; z-index: 9999;
            display: none; flex-direction: column; box-shadow: 0 4px 8px rgba(0,0,0,0.2); font-family: Arial, sans-serif;
        }
        #babaSokucuHeader {
            padding: 10px; cursor: move; z-index: 10000; background-color: #c0392b; /* Koyu kırmızı */
            color: white; border-top-left-radius: 6px; border-top-right-radius: 6px; text-align: center; font-weight: bold;
        }
        #babaSokucuContent {
            padding: 15px; display: flex; flex-direction: column; align-items: center;
        }
        #flagSearchInput {
            width: 95%; padding: 8px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 4px;
        }
        #flagImageContainer {
            width: 100%; height: 180px; border: 1px dashed #ccc; display: flex; justify-content: center;
            align-items: center; background-color: #fff; margin-top: 5px; overflow: hidden;
        }
        #flagImage {
            max-width: 100%; max-height: 100%; display: none;
        }
        #infoText {
            color: #555; text-align: center;
        }
    `);

    const panel = document.createElement('div');
    panel.id = 'babaSokucuPanel';
    panel.innerHTML = `
        <div id="babaSokucuHeader">babasokucu (Google)</div>
        <div id="babaSokucuContent">
            <input type="text" id="flagSearchInput" placeholder="Kelimeyi yazıp Enter'a basın...">
            <div id="flagImageContainer">
                <img id="flagImage" src="" alt="Resim">
                <span id="infoText">Google'daki ilk resim burada görünecek.</span>
            </div>
        </div>
    `;
    document.body.appendChild(panel);

    const flagSearchInput = document.getElementById('flagSearchInput');
    const flagImage = document.getElementById('flagImage');
    const infoText = document.getElementById('infoText');

    function searchGoogleImages(query) {
        if (!query) return;
        infoText.textContent = "Aranıyor...";
        infoText.style.display = 'block';
        flagImage.style.display = 'none';
        const finalQuery = `${query} flag`;
        const apiUrl = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${encodeURIComponent(finalQuery)}&searchType=image`;

        GM_xmlhttpRequest({
            method: "GET",
            url: apiUrl,
            onload: function(response) {
                const data = JSON.parse(response.responseText);
                if (data.error) {
                    console.error("Google API Hatası:", data.error.message);
                    infoText.textContent = `API Hatası! Detaylar için F12 > Konsol'a bakın.`;
                    return;
                }
                if (data.items && data.items.length > 0) {
                    flagImage.src = data.items[0].link;
                    flagImage.style.display = 'block';
                    infoText.style.display = 'none';
                } else {
                    infoText.textContent = `"${query}" için Google'da resim bulunamadı.`;
                }
            },
            onerror: function(error) {
                console.error("Bağlantı Hatası:", error);
                infoText.textContent = "Bağlantı hatası! İnternetini veya F12 > Konsol'u kontrol et.";
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Insert') {
            panel.style.display = (panel.style.display === 'none' || panel.style.display === '') ? 'flex' : 'none';
        }
    });
    flagSearchInput.addEventListener('keyup', (e) => { if (e.key === 'Enter') { searchGoogleImages(flagSearchInput.value.trim()); } });
    dragElement(panel);
    function dragElement(elmnt) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const header = document.getElementById('babaSokucuHeader');
        if (header) { header.onmousedown = dragMouseDown; }
        function dragMouseDown(e) { e.preventDefault(); pos3 = e.clientX; pos4 = e.clientY; document.onmouseup = closeDragElement; document.onmousemove = elementDrag; }
        function elementDrag(e) { e.preventDefault(); pos1 = pos3 - e.clientX; pos2 = pos4 - e.clientY; pos3 = e.clientX; pos4 = e.clientY; elmnt.style.top = (elmnt.offsetTop - pos2) + "px"; elmnt.style.left = (elmnt.offsetLeft - pos1) + "px"; }
        function closeDragElement() { document.onmouseup = null; document.onmousemove = null; }
    }
})();