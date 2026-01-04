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
// @connect      serpapi.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543638/Babasokucu.user.js
// @updateURL https://update.greasyfork.org/scripts/543638/Babasokucu.meta.js
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

        // SerpApi kullanarak Google Images araması (daha güvenilir)
        const serpApiUrl = `https://serpapi.com/search.json?engine=google_images&q=${encodeURIComponent(finalQuery)}&api_key=demo`;

        // Önce SerpApi'yi dene
        GM_xmlhttpRequest({
            method: "GET",
            url: serpApiUrl,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data.images_results && data.images_results.length > 0) {
                        flagImage.src = data.images_results[0].original;
                        flagImage.style.display = 'block';
                        infoText.style.display = 'none';
                        return;
                    }
                } catch (e) {
                    console.log("SerpApi başarısız, Google API deneniyor...");
                }

                // SerpApi başarısızsa Google Custom Search API'yi dene
                const googleApiUrl = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${encodeURIComponent(finalQuery)}&searchType=image&num=1`;

                GM_xmlhttpRequest({
                    method: "GET",
                    url: googleApiUrl,
                    onload: function(response) {
                        try {
                            const data = JSON.parse(response.responseText);
                            if (data.error) {
                                console.error("Google API Hatası:", data.error.message);
                                // Alternatif çözüm: Unsplash
                                tryUnsplashFallback(query);
                                return;
                            }
                            if (data.items && data.items.length > 0) {
                                flagImage.src = data.items[0].link;
                                flagImage.style.display = 'block';
                                infoText.style.display = 'none';
                            } else {
                                tryUnsplashFallback(query);
                            }
                        } catch (error) {
                            console.error("Parse hatası:", error);
                            tryUnsplashFallback(query);
                        }
                    },
                    onerror: function(error) {
                        console.error("Google API Bağlantı Hatası:", error);
                        tryUnsplashFallback(query);
                    }
                });
            },
            onerror: function(error) {
                console.log("SerpApi bağlantı hatası, Google API deneniyor...");
                // Google API'yi dene
                const googleApiUrl = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${encodeURIComponent(finalQuery)}&searchType=image&num=1`;

                GM_xmlhttpRequest({
                    method: "GET",
                    url: googleApiUrl,
                    onload: function(response) {
                        try {
                            const data = JSON.parse(response.responseText);
                            if (data.error) {
                                tryUnsplashFallback(query);
                                return;
                            }
                            if (data.items && data.items.length > 0) {
                                flagImage.src = data.items[0].link;
                                flagImage.style.display = 'block';
                                infoText.style.display = 'none';
                            } else {
                                tryUnsplashFallback(query);
                            }
                        } catch (error) {
                            tryUnsplashFallback(query);
                        }
                    },
                    onerror: function(error) {
                        tryUnsplashFallback(query);
                    }
                });
            }
        });
    }

    // Yedek çözüm olarak Unsplash
    function tryUnsplashFallback(query) {
        const unsplashUrl = `https://source.unsplash.com/400x300/?${encodeURIComponent(query + ' flag')}`;

        flagImage.onload = function() {
            flagImage.style.display = 'block';
            infoText.style.display = 'none';
        };

        flagImage.onerror = function() {
            infoText.textContent = `"${query}" için resim bulunamadı.`;
        };

        flagImage.src = unsplashUrl;
    }

    flagSearchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            searchGoogleImages(flagSearchInput.value.trim());
        }
    });

    dragElement(panel);

    function dragElement(elmnt) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const header = document.getElementById('babaSokucuHeader');
        if (header) { header.onmousedown = dragMouseDown; }
        function dragMouseDown(e) { e.preventDefault(); pos3 = e.clientX; pos4 = e.clientY; document.onmouseup = closeDragElement; document.onmousemove = elementDrag; }
        function elementDrag(e) { e.preventDefault(); pos1 = pos3 - e.clientX; pos2 = pos4 - e.clientY; pos3 = e.clientX; pos4 = e.clientY; elmnt.style.top = (elmnt.offsetTop - pos2) + "px"; elmnt.style.left = (elmnt.offsetLeft - pos1) + "px"; }
        function closeDragElement() { document.onmouseup = null; document.onmousemove = null; }
    }

    // Paneli göster (Insert tuşu olmadan)
    panel.style.display = 'flex';
})();