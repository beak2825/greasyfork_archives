// ==UserScript==
// @name         Geoguessr Finder Tel vers
// @namespace    http://tampermonkey.net/
// @version      80.0
// @description  dum
// @author       Ferres
// @match        https://www.geoguessr.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/543341/Geoguessr%20Finder%20Tel%20vers.user.js
// @updateURL https://update.greasyfork.org/scripts/543341/Geoguessr%20Finder%20Tel%20vers.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Değişkenler ---
    let currentRoundCoordinates = { lat: null, lng: null };
    let mapInitialized = false;

    // --- EN SAĞLAM KONUM BULMA MANTIĞI (DOKUNULMADI) ---
    var originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        if (method.toUpperCase() === 'POST' &&
            (url.startsWith('https://maps.googleapis.com/$rpc/google.internal.maps.mapsjs.v1.MapsJsInternalService/GetMetadata') ||
             url.startsWith('https://maps.googleapis.com/$rpc/google.internal.maps.mapsjs.v1.MapsJsInternalService/SingleImageSearch'))) {

            this.addEventListener('load', function () {
                try {
                    const pattern = /-?\d+\.\d+,-?\d+\.\d+/g;
                    const match = this.responseText.match(pattern);
                    if (match && match.length > 0) {
                        const coords = match[0].split(",");
                        const lat = Number.parseFloat(coords[0]);
                        const lng = Number.parseFloat(coords[1]);

                        // Eğer konum değiştiyse, yeni konumu kaydet VE haritayı OTOMATİK GÖSTER.
                        if (lat !== currentRoundCoordinates.lat || lng !== currentRoundCoordinates.lng) {
                            currentRoundCoordinates = { lat: lat, lng: lng };
                            
                            // Haritanın hazır olduğundan emin ol ve otomatik olarak göster/güncelle
                            if (!mapInitialized) {
                                setupMapOnce();
                            }
                            showLocation(true); // 'true' parametresi haritanın zorla açılmasını sağlar
                        }
                    }
                } catch(e) {}
            });
        }
        return originalOpen.apply(this, arguments);
    };

    // --- TELEFON İÇİN YENİLENMİŞ ARAYÜZ VE KONTROLLER ---

    // Haritayı aç/kapat fonksiyonu
    function toggleMap() {
        if (!mapInitialized) return;
        const { mapContainer } = window.geoguessrMapInfo;
        mapContainer.style.display = mapContainer.style.display === 'none' ? 'block' : 'none';
    }

    // Konumu haritada gösteren fonksiyon
    function showLocation(forceShow = false) {
        if (!mapInitialized) return;
        const { iframe, mapContainer } = window.geoguessrMapInfo;
        if (currentRoundCoordinates.lat !== null) {
            const { lat, lng } = currentRoundCoordinates;
            const zoomOffset = 5.0; // Mobil için biraz daha geniş bir zoom
            iframe.src = `https://www.openstreetmap.org/export/embed.html?bbox=${lng-zoomOffset},${lat-zoomOffset},${lng+zoomOffset},${lat+zoomOffset}&layer=mapnik&marker=${lat},${lng}`;
            
            // Eğer 'forceShow' true ise, haritayı görünür yap.
            if (forceShow) {
                mapContainer.style.display = 'block';
            }
        }
    }

    // Arayüzü ilk seferde kuran fonksiyon
    function setupMapOnce() {
        if (mapInitialized) return;
        mapInitialized = true;
        GM_addStyle(`
            #ferres-map-container { 
                position: fixed; 
                top: 5%; 
                left: 5%; 
                width: 90%; 
                height: 50%; 
                z-index: 20000; 
                background-color: #f0f0f0; 
                border: 3px solid #5a009c; 
                border-radius: 10px; 
                box-shadow: 0 0 15px rgba(0,0,0,0.5); 
                display: none; 
                font-family: sans-serif;
            }
            #ferres-map-header { 
                width: 100%; 
                padding: 10px 0; 
                background-color: #5a009c;
                color: white;
                text-align: center; 
                font-size: 1.1em;
                font-weight: bold;
                cursor: move; 
                user-select: none;
                border-top-left-radius: 6px; 
                border-top-right-radius: 6px;
            }
            #location-iframe { 
                width: 100%; 
                height: calc(100% - 41px); 
                border: none; 
            }
            #ferres-toggle-button {
                position: fixed;
                bottom: 15px;
                right: 15px;
                z-index: 20001;
                width: 50px;
                height: 50px;
                background-color: #5a009c;
                color: white;
                border: 2px solid white;
                border-radius: 50%;
                font-size: 24px;
                text-align: center;
                line-height: 48px;
                cursor: pointer;
                box-shadow: 0 2px 5px rgba(0,0,0,0.4);
            }
        `);
        // Harita Konteyneri
        const mapContainer = document.createElement('div'); mapContainer.id = 'ferres-map-container';
        const header = document.createElement('div'); header.id = 'ferres-map-header'; header.textContent = 'Konum Haritası';
        const iframe = document.createElement('iframe'); iframe.id = 'location-iframe';
        mapContainer.appendChild(header); mapContainer.appendChild(iframe); document.body.appendChild(mapContainer);

        // Haritayı Aç/Kapat Butonu
        const toggleButton = document.createElement('div');
        toggleButton.id = 'ferres-toggle-button';
        toggleButton.textContent = '🗺️';
        toggleButton.addEventListener('click', toggleMap);
        document.body.appendChild(toggleButton);

        window.geoguessrMapInfo = { mapContainer, iframe };
        dragElement(mapContainer, header);
    }
    
    // Sürükleme fonksiyonu (dokunmatik cihazlarda da çalışır)
    function dragElement(elmnt, header) {
        let pos1=0, pos2=0, pos3=0, pos4=0;
        const dragMouseDown = (e) => {
            e.preventDefault();
            pos3 = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
            pos4 = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
            document.onmouseup = closeDragElement;
            document.ontouchend = closeDragElement;
            document.onmousemove = elementDrag;
            document.ontouchmove = elementDrag;
        };
        const elementDrag = (e) => {
            e.preventDefault();
            let clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
            let clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
            pos1 = pos3 - clientX;
            pos2 = pos4 - clientY;
            pos3 = clientX;
            pos4 = clientY;
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        };
        const closeDragElement = () => {
            document.onmouseup = null;
            document.onmousemove = null;
            document.ontouchend = null;
            document.ontouchmove = null;
        };
        header.onmousedown = dragMouseDown;
        header.ontouchstart = dragMouseDown;
    }

})();