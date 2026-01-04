// ==UserScript==
// @name         Babasokucu tel
// @namespace    http://tampermonkey.net/
// @version      3.3 - MOBİL VERSIYON
// @description  Gartic.io'da Google Görseller'de arama yapıp ilk resmi gösterir tel
// @author       Ferres
// @match        https://gartic.io/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      googleapis.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543634/Babasokucu%20tel.user.js
// @updateURL https://update.greasyfork.org/scripts/543634/Babasokucu%20tel.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === API BİLGİLERİ BURADA HAZIR, DOKUNMA ===
    const API_KEY = "AIzaSyBP6U28ngnKhCKYoYgkExWXNxHT_-MCJvQ";
    const SEARCH_ENGINE_ID = "d3a4fb1c91a394ccd";
    // ==========================================

    // Mobil cihaz kontrolü
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // Panel ve içeriği için mobil optimize CSS stilleri
    GM_addStyle(`
        #babaSokucuPanel {
            position: fixed; 
            top: ${isMobile ? '5px' : '10px'}; 
            left: 50%; 
            transform: translateX(-50%); 
            width: ${isMobile ? '95vw' : '320px'};
            max-width: ${isMobile ? '350px' : '320px'};
            background-color: #f1f1f1; 
            border: 2px solid #888; 
            border-radius: 8px; 
            z-index: 9999;
            display: none; 
            flex-direction: column; 
            box-shadow: 0 4px 8px rgba(0,0,0,0.2); 
            font-family: Arial, sans-serif;
            ${isMobile ? 'touch-action: none;' : ''}
        }
        #babaSokucuHeader {
            padding: ${isMobile ? '15px 10px' : '10px'}; 
            cursor: ${isMobile ? 'grab' : 'move'}; 
            z-index: 10000; 
            background-color: #c0392b;
            color: white; 
            border-top-left-radius: 6px; 
            border-top-right-radius: 6px; 
            text-align: center; 
            font-weight: bold;
            font-size: ${isMobile ? '16px' : '14px'};
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
        }
        #babaSokucuContent {
            padding: ${isMobile ? '20px 15px' : '15px'}; 
            display: flex; 
            flex-direction: column; 
            align-items: center;
        }
        #flagSearchInput {
            width: 95%; 
            padding: ${isMobile ? '12px 8px' : '8px'}; 
            margin-bottom: ${isMobile ? '15px' : '10px'}; 
            border: 1px solid #ccc; 
            border-radius: 4px;
            font-size: ${isMobile ? '16px' : '14px'};
            -webkit-appearance: none;
        }
        #flagImageContainer {
            width: 100%; 
            height: ${isMobile ? '200px' : '180px'}; 
            border: 1px dashed #ccc; 
            display: flex; 
            justify-content: center;
            align-items: center; 
            background-color: #fff; 
            margin-top: 5px; 
            overflow: hidden;
        }
        #flagImage {
            max-width: 100%; 
            max-height: 100%; 
            display: none;
        }
        #infoText {
            color: #555; 
            text-align: center;
            font-size: ${isMobile ? '14px' : '12px'};
            padding: 10px;
        }
        #mobileToggleBtn {
            position: fixed;
            bottom: ${isMobile ? '20px' : '10px'};
            right: ${isMobile ? '20px' : '10px'};
            width: ${isMobile ? '60px' : '50px'};
            height: ${isMobile ? '60px' : '50px'};
            background-color: #c0392b;
            color: white;
            border: none;
            border-radius: 50%;
            font-size: ${isMobile ? '14px' : '12px'};
            font-weight: bold;
            cursor: pointer;
            z-index: 9998;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            user-select: none;
            -webkit-user-select: none;
            touch-action: manipulation;
        }
        #searchButton {
            width: 100%;
            padding: ${isMobile ? '12px' : '8px'};
            background-color: #c0392b;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: ${isMobile ? '16px' : '14px'};
            font-weight: bold;
            cursor: pointer;
            margin-top: 10px;
            touch-action: manipulation;
        }
        #searchButton:active {
            background-color: #a93226;
        }
    `);

    // Panel oluştur
    const panel = document.createElement('div');
    panel.id = 'babaSokucuPanel';
    panel.innerHTML = `
        <div id="babaSokucuHeader">📱 babasokucu (Google)</div>
        <div id="babaSokucuContent">
            <input type="text" id="flagSearchInput" placeholder="Kelimeyi yazın...">
            <button id="searchButton">🔍 ARA</button>
            <div id="flagImageContainer">
                <img id="flagImage" src="" alt="Resim">
                <span id="infoText">Google'daki ilk resim burada görünecek.</span>
            </div>
        </div>
    `;

    // Mobil için toggle butonu
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'mobileToggleBtn';
    toggleBtn.innerHTML = '🔍<br>BABA';
    toggleBtn.onclick = function() {
        panel.style.display = (panel.style.display === 'none' || panel.style.display === '') ? 'flex' : 'none';
    };

    document.body.appendChild(panel);
    document.body.appendChild(toggleBtn);

    const flagSearchInput = document.getElementById('flagSearchInput');
    const flagImage = document.getElementById('flagImage');
    const infoText = document.getElementById('infoText');
    const searchButton = document.getElementById('searchButton');

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
                    infoText.textContent = `API Hatası! Konsol'u kontrol edin.`;
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
                infoText.textContent = "Bağlantı hatası! İnterneti kontrol edin.";
            }
        });
    }

    // Event listener'lar
    if (isMobile) {
        // Mobil cihaz için touch event'leri
        searchButton.addEventListener('click', () => {
            searchGoogleImages(flagSearchInput.value.trim());
        });
        
        flagSearchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter' || e.keyCode === 13) {
                searchGoogleImages(flagSearchInput.value.trim());
            }
        });
    } else {
        // Desktop için klavye kısayolları
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Insert') {
                panel.style.display = (panel.style.display === 'none' || panel.style.display === '') ? 'flex' : 'none';
            }
        });
        
        searchButton.addEventListener('click', () => {
            searchGoogleImages(flagSearchInput.value.trim());
        });
        
        flagSearchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                searchGoogleImages(flagSearchInput.value.trim());
            }
        });
    }

    // Sürükleme fonksiyonu (hem mouse hem touch destekli)
    dragElement(panel);

    function dragElement(elmnt) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const header = document.getElementById('babaSokucuHeader');
        
        if (header) {
            // Mouse events
            header.onmousedown = dragMouseDown;
            
            // Touch events for mobile
            if (isMobile) {
                header.ontouchstart = dragTouchStart;
            }
        }

        function dragMouseDown(e) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
            header.style.cursor = 'grabbing';
        }

        function dragTouchStart(e) {
            e.preventDefault();
            const touch = e.touches[0];
            pos3 = touch.clientX;
            pos4 = touch.clientY;
            document.ontouchend = closeDragElement;
            document.ontouchmove = elementDragTouch;
            header.style.cursor = 'grabbing';
        }

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            updatePosition();
        }

        function elementDragTouch(e) {
            e.preventDefault();
            const touch = e.touches[0];
            pos1 = pos3 - touch.clientX;
            pos2 = pos4 - touch.clientY;
            pos3 = touch.clientX;
            pos4 = touch.clientY;
            updatePosition();
        }

        function updatePosition() {
            let newTop = elmnt.offsetTop - pos2;
            let newLeft = elmnt.offsetLeft - pos1;
            
            // Ekran sınırları kontrolü
            const maxTop = window.innerHeight - elmnt.offsetHeight;
            const maxLeft = window.innerWidth - elmnt.offsetWidth;
            
            newTop = Math.max(0, Math.min(newTop, maxTop));
            newLeft = Math.max(0, Math.min(newLeft, maxLeft));
            
            elmnt.style.top = newTop + "px";
            elmnt.style.left = newLeft + "px";
            elmnt.style.transform = 'none'; // Transform'u sıfırla
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
            document.ontouchend = null;
            document.ontouchmove = null;
            header.style.cursor = isMobile ? 'grab' : 'move';
        }
    }

    // Sayfa yüklendiğinde toggle butonunu göster
    window.addEventListener('load', () => {
        if (isMobile) {
            console.log('Babasokucu Mobile yüklendi! Sağ alttaki butona tıklayın.');
        } else {
            console.log('Babasokucu yüklendi! Insert tuşuna basın.');
        }
    });

})();