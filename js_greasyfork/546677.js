// ==UserScript==
// @name         Babasokucu - Düzeltilmiş
// @namespace    http://tampermonkey.net/
// @version      3.7 - DÜZELTMELER YAPILDI
// @description  Gartic.io'da Google Görseller'de arama yapıp ilk resmi gösterir.
// @author       Ferres - Düzeltmeler
// @match        https://gartic.io/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      googleapis.com
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/546677/Babasokucu%20-%20D%C3%BCzeltilmi%C5%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/546677/Babasokucu%20-%20D%C3%BCzeltilmi%C5%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === API BİLGİLERİ BURADA HAZIR, DOKUNMA ===
    const API_KEY = "AIzaSyBP6U28ngnKhCKYoYgkExWXNxHT_-MCJvQ";
    const SEARCH_ENGINE_ID = "d3a4fb1c91a394ccd";
    // ==========================================

    // Sayfa tam yüklendikten sonra çalıştır
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScript);
    } else {
        initScript();
    }

    function initScript() {
        console.log('Babasokucu başlatılıyor...');

        // Panel ve içeriği için gerekli CSS stillerini ekle
        GM_addStyle(`
            #babaSokucuPanel {
                position: fixed !important;
                top: 50px !important;
                left: 50px !important;
                width: 320px !important;
                background-color: #f1f1f1 !important;
                border: 2px solid #888 !important;
                border-radius: 8px !important;
                z-index: 999999 !important;
                display: none !important;
                flex-direction: column !important;
                box-shadow: 0 4px 8px rgba(0,0,0,0.3) !important;
                font-family: Arial, sans-serif !important;
            }
            #babaSokucuPanel.show {
                display: flex !important;
            }
            #babaSokucuHeader {
                padding: 10px !important;
                cursor: move !important;
                z-index: 1000000 !important;
                background-color: #c0392b !important;
                color: white !important;
                border-top-left-radius: 6px !important;
                border-top-right-radius: 6px !important;
                text-align: center !important;
                font-weight: bold !important;
                user-select: none !important;
            }
            #babaSokucuContent {
                padding: 15px !important;
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                background-color: #f1f1f1 !important;
            }
            #flagSearchInput {
                width: 95% !important;
                padding: 8px !important;
                margin-bottom: 10px !important;
                border: 1px solid #ccc !important;
                border-radius: 4px !important;
                font-size: 14px !important;
                box-sizing: border-box !important;
            }
            #flagImageContainer {
                width: 95% !important;
                height: 180px !important;
                border: 1px dashed #ccc !important;
                background-color: #fff !important;
                margin-top: 5px !important;
                position: relative !important;
                box-sizing: border-box !important;
                overflow: hidden !important;
            }
            #flagImage {
                width: 100% !important;
                height: 100% !important;
                object-fit: contain !important;
                display: none !important;
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                z-index: 10 !important;
                background: white !important;
            }
            #flagImage.show-image {
                display: block !important;
            }
            #infoText {
                color: #555 !important;
                text-align: center !important;
                font-size: 14px !important;
                position: absolute !important;
                top: 50% !important;
                left: 50% !important;
                transform: translate(-50%, -50%) !important;
                z-index: 5 !important;
                background: white !important;
                padding: 10px !important;
            }
            #infoText.hide-text {
                display: none !important;
            }
        `);

        // Paneli oluştur
        const panel = document.createElement('div');
        panel.id = 'babaSokucuPanel';
        panel.innerHTML = `
            <div id="babaSokucuHeader">babasokucu</div>
            <div id="babaSokucuContent">
                <input type="text" id="flagSearchInput" placeholder="Ülke adını yazıp Enter'a basın...">
                <div id="flagImageContainer">
                    <img id="flagImage" src="" alt="Resim">
                    <span id="infoText">Ülke bayrakları burada görünecek.</span>
                </div>
            </div>
        `;

        // Paneli body'ye ekle
        document.body.appendChild(panel);
        console.log('Panel eklendi');

        // Elementleri al
        const flagSearchInput = document.getElementById('flagSearchInput');
        const flagImage = document.getElementById('flagImage');
        const infoText = document.getElementById('infoText');

        // Google Images arama fonksiyonu
        function searchGoogleImages(query) {
            if (!query) return;

            console.log('Google API ile arama yapılıyor:', query);
            
            // Önceki sınıfları temizle
            flagImage.classList.remove('show-image');
            infoText.classList.remove('hide-text');
            
            // Loading durumu
            infoText.textContent = "Aranıyor...";
            console.log('Loading durumu ayarlandı');

            const finalQuery = `${query} flag`;
            const apiUrl = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${encodeURIComponent(finalQuery)}&searchType=image&num=10&safe=off`;

            console.log('API URL:', apiUrl);

            GM_xmlhttpRequest({
                method: "GET",
                url: apiUrl,
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                },
                onload: function(response) {
                    console.log('API Response Status:', response.status);

                    try {
                        const data = JSON.parse(response.responseText);

                        if (data.error) {
                            console.error("Google API Hatası:", data.error);
                            flagImage.classList.remove('show-image');
                            infoText.classList.remove('hide-text');
                            
                            if (data.error.code === 429) {
                                infoText.textContent = 'Günlük API limiti aşıldı!';
                            } else if (data.error.code === 403) {
                                infoText.textContent = 'API anahtarı problemi!';
                            } else if (data.error.code === 400) {
                                infoText.textContent = 'Geçersiz arama parametresi!';
                            } else {
                                infoText.textContent = `API Hatası: ${data.error.message}`;
                            }
                            return;
                        }

                        if (data.items && data.items.length > 0) {
                            console.log('Bulunan resim sayısı:', data.items.length);
                            console.log('İlk resim URL:', data.items[0].link);

                            let imageLoaded = false;

                            function tryLoadImage(index) {
                                if (index >= data.items.length) {
                                    console.log('Hiçbir resim yüklenemedi');
                                    infoText.textContent = 'Hiçbir resim yüklenemedi.';
                                    flagImage.classList.remove('show-image');
                                    infoText.classList.remove('hide-text');
                                    return;
                                }

                                console.log(`Resim deneniyor (${index + 1}/${data.items.length}):`, data.items[index].link);

                                const img = new Image();
                                
                                img.onload = function() {
                                    if (!imageLoaded) {
                                        imageLoaded = true;
                                        console.log('Resim başarıyla yüklendi!');
                                        
                                        // Info text'i gizle
                                        infoText.classList.add('hide-text');
                                        
                                        // Resmi ayarla ve göster
                                        flagImage.src = data.items[index].link;
                                        flagImage.classList.add('show-image');
                                        
                                        console.log('Resim DOM\'a eklendi ve gösterildi');
                                        console.log('flagImage display style:', window.getComputedStyle(flagImage).display);
                                        console.log('flagImage src:', flagImage.src);
                                    }
                                };

                                img.onerror = function() {
                                    console.log('Resim yüklenemedi, bir sonrakini dene...');
                                    tryLoadImage(index + 1);
                                };

                                // Timeout ekle
                                setTimeout(() => {
                                    if (!imageLoaded) {
                                        console.log('Resim yüklenme süresi aşıldı, bir sonrakini dene...');
                                        img.onerror();
                                    }
                                }, 5000);

                                img.src = data.items[index].link;
                            }

                            tryLoadImage(0);
                        } else {
                            console.log('API response items boş');
                            infoText.textContent = `"${query}" için bayrak bulunamadı.`;
                            flagImage.classList.remove('show-image');
                            infoText.classList.remove('hide-text');
                        }
                    } catch (e) {
                        console.error('JSON parse hatası:', e);
                        console.error('Response text:', response.responseText);
                        infoText.textContent = 'Veri işleme hatası!';
                        flagImage.classList.remove('show-image');
                        infoText.classList.remove('hide-text');
                    }
                },
                onerror: function(error) {
                    console.error("Bağlantı Hatası:", error);
                    infoText.textContent = "Google'a bağlanamıyor!";
                    flagImage.classList.remove('show-image');
                    infoText.classList.remove('hide-text');
                }
            });
        }

        // Klavye olayları
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Insert') {
                e.preventDefault();
                const isVisible = panel.classList.contains('show');
                if (isVisible) {
                    panel.classList.remove('show');
                    console.log('Panel gizlendi');
                } else {
                    panel.classList.add('show');
                    console.log('Panel gösterildi');
                    setTimeout(() => flagSearchInput.focus(), 100);
                }
            }
        });

        // Enter tuşu ile arama
        flagSearchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                const query = flagSearchInput.value.trim();
                if (query) {
                    console.log('Arama başlatılıyor:', query);
                    searchGoogleImages(query);
                }
            }
        });

        // Drag fonksiyonu - düzeltilmiş versiyon
        dragElement(panel);

        function dragElement(elmnt) {
            let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
            const header = document.getElementById('babaSokucuHeader');

            if (header) {
                header.addEventListener('mousedown', dragMouseDown);
            }

            function dragMouseDown(e) {
                e.preventDefault();
                e.stopPropagation();
                
                pos3 = e.clientX;
                pos4 = e.clientY;
                
                document.addEventListener('mouseup', closeDragElement);
                document.addEventListener('mousemove', elementDrag);
                
                console.log('Drag başladı');
            }

            function elementDrag(e) {
                e.preventDefault();
                
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;

                let newTop = elmnt.offsetTop - pos2;
                let newLeft = elmnt.offsetLeft - pos1;

                // Ekran sınırlarını kontrol et
                if (newTop < 0) newTop = 0;
                if (newLeft < -160) newLeft = -160;
                if (newTop > window.innerHeight - 100) newTop = window.innerHeight - 100;
                if (newLeft > window.innerWidth - 160) newLeft = window.innerWidth - 160;

                elmnt.style.top = newTop + "px";
                elmnt.style.left = newLeft + "px";
            }

            function closeDragElement() {
                document.removeEventListener('mouseup', closeDragElement);
                document.removeEventListener('mousemove', elementDrag);
                console.log('Drag bitti');
            }
        }

        console.log('Babasokucu yüklendi! Insert tuşuna basarak açın.');
        console.log('Test için: Insert tuşu -> "turkey" yaz -> Enter');
    }
})();