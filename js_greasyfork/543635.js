// ==UserScript==
// @name         Gartic harita v4 - Google Maps Mobil Dum (TR/EN)
// @namespace    http://tampermonkey.net/
// @version      1.4 - MOBİL VERSIYON
// @description  Gartic.io için mobil optimize harita widget'ı - Sadece Google Maps, Türkçe/İngilizce
// @author       Ferres
// @match        https://gartic.io/*
// @match        https://gartic.com.br/*
// @grant        none
// @require      https://unpkg.com/leaflet@1.9.4/dist/leaflet.js
// @resource     LEAFLET_CSS https://unpkg.com/leaflet@1.9.4/dist/leaflet.css
// @downloadURL https://update.greasyfork.org/scripts/543635/Gartic%20harita%20v4%20-%20Google%20Maps%20Mobil%20Dum%20%28TREN%29.user.js
// @updateURL https://update.greasyfork.org/scripts/543635/Gartic%20harita%20v4%20-%20Google%20Maps%20Mobil%20Dum%20%28TREN%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Mobil cihaz kontrolü
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // Leaflet CSS'ini ekle
    const leafletCSS = document.createElement('link');
    leafletCSS.rel = 'stylesheet';
    leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(leafletCSS);

    // Widget CSS'lerini ekle - Mobil optimize
    const style = document.createElement('style');
    style.textContent = `
        #gartic-maps-widget {
            position: fixed;
            top: ${isMobile ? '10px' : '20px'};
            right: ${isMobile ? '10px' : '20px'};
            width: ${isMobile ? '90vw' : '250px'};
            height: ${isMobile ? '60vh' : '200px'};
            max-width: ${isMobile ? '380px' : '250px'};
            max-height: ${isMobile ? '500px' : '200px'};
            min-width: ${isMobile ? '280px' : '200px'};
            min-height: ${isMobile ? '200px' : '150px'};
            background: white;
            border-radius: ${isMobile ? '16px' : '12px'};
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            z-index: 999999;
            transition: none;
            overflow: hidden;
            border: 2px solid #e0e0e0;
            font-family: Arial, sans-serif;
            resize: none;
            ${isMobile ? 'touch-action: none;' : ''}
        }

        .gmw-header {
            background: linear-gradient(135deg, #4285f4, #34a853);
            color: white;
            padding: ${isMobile ? '15px' : '10px 15px'};
            display: flex;
            align-items: center;
            justify-content: space-between;
            cursor: ${isMobile ? 'grab' : 'move'};
            user-select: none;
            -webkit-user-select: none;
            font-size: ${isMobile ? '16px' : '14px'};
            height: ${isMobile ? '30px' : '25px'};
            box-sizing: border-box;
        }

        .gmw-title {
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .gmw-controls {
            display: flex;
            gap: ${isMobile ? '10px' : '8px'};
        }

        .gmw-control-btn {
            width: ${isMobile ? '32px' : '24px'};
            height: ${isMobile ? '32px' : '24px'};
            border: none;
            border-radius: ${isMobile ? '6px' : '4px'};
            background: rgba(255,255,255,0.2);
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: ${isMobile ? '16px' : '12px'};
            font-weight: bold;
            transition: background 0.2s;
            touch-action: manipulation;
        }

        .gmw-control-btn:active {
            background: rgba(255,255,255,0.4);
        }

        .gmw-map-controls {
            position: absolute;
            top: ${isMobile ? '15px' : '10px'};
            left: ${isMobile ? '15px' : '10px'};
            display: flex;
            gap: ${isMobile ? '8px' : '5px'};
            z-index: 1001;
            flex-direction: ${isMobile ? 'column' : 'row'};
        }

        .gmw-map-switch, .gmw-lang-switch {
            background: white;
            border: 1px solid #ccc;
            border-radius: ${isMobile ? '6px' : '4px'};
            padding: ${isMobile ? '8px' : '5px'};
            font-size: ${isMobile ? '13px' : '11px'};
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }

        .gmw-map-switch select, .gmw-lang-switch select {
            border: none;
            background: transparent;
            font-size: ${isMobile ? '13px' : '11px'};
            cursor: pointer;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            padding-right: ${isMobile ? '20px' : '15px'};
        }

        .gmw-search {
            padding: ${isMobile ? '15px' : '10px'};
            border-bottom: 1px solid #e0e0e0;
            position: relative;
            height: ${isMobile ? '60px' : '50px'};
            box-sizing: border-box;
        }

        .gmw-search-input {
            width: 100%;
            padding: ${isMobile ? '12px 45px 12px 15px' : '8px 35px 8px 12px'};
            border: 1px solid #ddd;
            border-radius: ${isMobile ? '8px' : '6px'};
            font-size: ${isMobile ? '16px' : '14px'};
            box-sizing: border-box;
            outline: none;
            -webkit-appearance: none;
        }

        .gmw-search-input:focus {
            border-color: #4285f4;
            box-shadow: 0 0 0 2px rgba(66,133,244,0.1);
        }

        .gmw-search-btn {
            position: absolute;
            right: ${isMobile ? '20px' : '15px'};
            top: 50%;
            transform: translateY(-50%);
            border: none;
            background: #4285f4;
            color: white;
            border-radius: ${isMobile ? '6px' : '4px'};
            width: ${isMobile ? '32px' : '24px'};
            height: ${isMobile ? '32px' : '24px'};
            cursor: pointer;
            font-size: ${isMobile ? '14px' : '12px'};
            display: flex;
            align-items: center;
            justify-content: center;
            touch-action: manipulation;
        }

        .gmw-search-btn:active {
            background: #3367d6;
        }

        .gmw-autocomplete {
            position: absolute;
            top: 100%;
            left: ${isMobile ? '15px' : '10px'};
            right: ${isMobile ? '15px' : '10px'};
            background: white;
            border: 1px solid #ddd;
            border-top: none;
            border-radius: 0 0 ${isMobile ? '8px' : '6px'} ${isMobile ? '8px' : '6px'};
            max-height: ${isMobile ? '250px' : '200px'};
            overflow-y: auto;
            z-index: 1002;
            display: none;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .gmw-autocomplete-item {
            padding: ${isMobile ? '15px' : '10px 12px'};
            cursor: pointer;
            border-bottom: 1px solid #f0f0f0;
            font-size: ${isMobile ? '15px' : '13px'};
            line-height: 1.4;
            transition: background-color 0.2s;
            touch-action: manipulation;
        }

        .gmw-autocomplete-item:hover,
        .gmw-autocomplete-item.selected,
        .gmw-autocomplete-item:active {
            background-color: #f8f9fa;
        }

        .gmw-autocomplete-item:last-child {
            border-bottom: none;
        }

        .gmw-autocomplete-item .place-name {
            font-weight: 500;
            color: #333;
        }

        .gmw-autocomplete-item .place-details {
            color: #666;
            font-size: ${isMobile ? '13px' : '12px'};
            margin-top: 2px;
        }

        .gmw-map-container {
            height: calc(100% - ${isMobile ? '105px' : '95px'});
            position: relative;
        }

        #gartic-map {
            width: 100%;
            height: 100%;
        }

        .gmw-zoom-controls {
            position: absolute;
            bottom: ${isMobile ? '15px' : '10px'};
            right: ${isMobile ? '15px' : '10px'};
            display: flex;
            flex-direction: column;
            gap: ${isMobile ? '5px' : '2px'};
            z-index: 1001;
        }

        .gmw-zoom-btn {
            width: ${isMobile ? '40px' : '30px'};
            height: ${isMobile ? '40px' : '30px'};
            background: white;
            border: 1px solid #ccc;
            border-radius: ${isMobile ? '6px' : '4px'};
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: ${isMobile ? '20px' : '16px'};
            font-weight: bold;
            color: #666;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            transition: background-color 0.2s;
            touch-action: manipulation;
        }

        .gmw-zoom-btn:active {
            background: #f5f5f5;
        }

        .gmw-dragging {
            opacity: 0.8;
        }

        .gmw-map-icon {
            width: ${isMobile ? '18px' : '16px'};
            height: ${isMobile ? '18px' : '16px'};
            fill: currentColor;
        }

        .gmw-minimized .gmw-map-container,
        .gmw-minimized .gmw-search {
            display: none;
        }

        .gmw-minimized {
            height: ${isMobile ? '60px' : '45px'} !important;
        }

        /* Mobil için toggle butonu */
        #gmw-mobile-toggle {
            position: fixed;
            bottom: ${isMobile ? '80px' : '60px'};
            right: ${isMobile ? '20px' : '15px'};
            width: ${isMobile ? '60px' : '50px'};
            height: ${isMobile ? '60px' : '50px'};
            background: linear-gradient(135deg, #4285f4, #34a853);
            color: white;
            border: none;
            border-radius: 50%;
            font-size: ${isMobile ? '12px' : '10px'};
            font-weight: bold;
            cursor: pointer;
            z-index: 999998;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            user-select: none;
            -webkit-user-select: none;
            touch-action: manipulation;
            line-height: 1.2;
        }

        #gmw-mobile-toggle:active {
            transform: scale(0.95);
        }

        /* Resize Handle'ları - Sadece desktop için */
        .gmw-resize-handle {
            position: absolute;
            background: transparent;
            z-index: 1003;
            display: ${isMobile ? 'none' : 'block'};
        }

        .gmw-resize-handle:hover {
            background: rgba(66, 133, 244, 0.3);
        }

        .gmw-resize-se {
            bottom: 0;
            right: 0;
            width: 15px;
            height: 15px;
            cursor: se-resize;
        }

        .gmw-resize-s {
            bottom: 0;
            left: 15px;
            right: 15px;
            height: 5px;
            cursor: s-resize;
        }

        .gmw-resize-e {
            right: 0;
            top: ${isMobile ? '60px' : '45px'};
            bottom: 15px;
            width: 5px;
            cursor: e-resize;
        }

        .gmw-resize-sw {
            bottom: 0;
            left: 0;
            width: 15px;
            height: 15px;
            cursor: sw-resize;
        }

        .gmw-resize-w {
            left: 0;
            top: ${isMobile ? '60px' : '45px'};
            bottom: 15px;
            width: 5px;
            cursor: w-resize;
        }

        .gmw-resize-ne {
            top: ${isMobile ? '60px' : '45px'};
            right: 0;
            width: 15px;
            height: 15px;
            cursor: ne-resize;
        }

        .gmw-resize-n {
            top: ${isMobile ? '60px' : '45px'};
            left: 15px;
            right: 15px;
            height: 5px;
            cursor: n-resize;
        }

        .gmw-resize-nw {
            top: ${isMobile ? '60px' : '45px'};
            left: 0;
            width: 15px;
            height: 15px;
            cursor: nw-resize;
        }

        .gmw-resize-corner {
            position: absolute;
            bottom: 2px;
            right: 2px;
            width: 10px;
            height: 10px;
            background: linear-gradient(-45deg, transparent 45%, #ccc 45%, #ccc 55%, transparent 55%),
                        linear-gradient(45deg, transparent 45%, #ccc 45%, #ccc 55%, transparent 55%);
            pointer-events: none;
            display: ${isMobile ? 'none' : 'block'};
        }

        .gmw-resizing {
            transition: none !important;
        }

        .gmw-resizing * {
            transition: none !important;
        }

        /* Mobil için tam ekran modu */
        .gmw-fullscreen {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            max-width: none !important;
            max-height: none !important;
            border-radius: 0 !important;
            z-index: 999999;
        }

        .gmw-fullscreen .gmw-map-container {
            height: calc(100% - ${isMobile ? '105px' : '95px'});
        }

        /* Tam ekran butonu */
        .gmw-fullscreen-btn {
            display: ${isMobile ? 'block' : 'none'};
        }

        /* Leaflet kontrol butonlarını mobil için büyüt */
        .leaflet-control-zoom a {
            width: ${isMobile ? '35px' : '26px'} !important;
            height: ${isMobile ? '35px' : '26px'} !important;
            line-height: ${isMobile ? '35px' : '26px'} !important;
            font-size: ${isMobile ? '18px' : '14px'} !important;
        }

        /* Leaflet popup'ları mobil için optimize et */
        .leaflet-popup-content-wrapper {
            border-radius: ${isMobile ? '12px' : '8px'} !important;
            padding: ${isMobile ? '8px' : '4px'} !important;
        }

        .leaflet-popup-content {
            margin: ${isMobile ? '15px 20px' : '13px 19px'} !important;
            font-size: ${isMobile ? '14px' : '12px'} !important;
            line-height: 1.4 !important;
        }

        /* Touch scrolling için */
        .gmw-autocomplete {
            -webkit-overflow-scrolling: touch;
        }
    `;
    document.head.appendChild(style);

    // Widget HTML'ini oluştur
    const widget = document.createElement('div');
    widget.id = 'gartic-maps-widget';
    widget.innerHTML = `
        <div class="gmw-header" id="gmw-header">
            <div class="gmw-title">
                <svg class="gmw-map-icon" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                Google Maps
            </div>
            <div class="gmw-controls">
                ${isMobile ? '<button class="gmw-control-btn gmw-fullscreen-btn" id="gmw-fullscreen-btn" title="Tam Ekran">⛶</button>' : ''}
                <button class="gmw-control-btn" id="gmw-minimize-btn" title="Küçült">−</button>
                <button class="gmw-control-btn" id="gmw-close-btn" title="Kapat">×</button>
            </div>
        </div>
        <div class="gmw-search">
            <input type="text" class="gmw-search-input" id="gmw-search-input" placeholder="Dünya çapında konum ara...">
            <button class="gmw-search-btn" id="gmw-search-btn">🔍</button>
            <div class="gmw-autocomplete" id="gmw-autocomplete"></div>
        </div>
        <div class="gmw-map-container">
            <div class="gmw-map-controls">
                <div class="gmw-map-switch">
                    <select id="gmw-map-type">
                        <option value="roadmap">Yol Haritası</option>
                        <option value="satellite">Uydu</option>
                        <option value="hybrid">Hibrit</option>
                    </select>
                </div>
                <div class="gmw-lang-switch">
                    <select id="gmw-language">
                        <option value="tr">🇹🇷 Türkçe</option>
                        <option value="en">🇺🇸 English</option>
                    </select>
                </div>
            </div>
            <div id="gartic-map"></div>
            <div class="gmw-zoom-controls">
                <button class="gmw-zoom-btn" id="gmw-zoom-in">+</button>
                <button class="gmw-zoom-btn" id="gmw-zoom-out">−</button>
            </div>
        </div>

        <!-- Resize Handles - Sadece desktop için -->
        ${!isMobile ? `
        <div class="gmw-resize-handle gmw-resize-n"></div>
        <div class="gmw-resize-handle gmw-resize-ne"></div>
        <div class="gmw-resize-handle gmw-resize-e"></div>
        <div class="gmw-resize-handle gmw-resize-se"></div>
        <div class="gmw-resize-handle gmw-resize-s"></div>
        <div class="gmw-resize-handle gmw-resize-sw"></div>
        <div class="gmw-resize-handle gmw-resize-w"></div>
        <div class="gmw-resize-handle gmw-resize-nw"></div>
        <div class="gmw-resize-corner"></div>
        ` : ''}
    `;

    // Mobil toggle butonu
    const mobileToggle = document.createElement('button');
    mobileToggle.id = 'gmw-mobile-toggle';
    mobileToggle.innerHTML = '🗺️<br>MAP';
    mobileToggle.style.display = isMobile ? 'flex' : 'none';

    // Widget'ı sayfaya ekle
    document.body.appendChild(widget);
    if (isMobile) {
        document.body.appendChild(mobileToggle);
    }

    // Başlangıçta widget'ı gizle (mobilde)
    if (isMobile) {
        widget.style.display = 'none';
    }

    // Değişkenler
    let map;
    let currentMarker;
    let currentTileLayer;
    let isDragging = false;
    let isMinimized = false;
    let isResizing = false;
    let isFullscreen = false;
    let resizeType = '';
    let startX, startY, startLeft, startTop, startWidth, startHeight;
    let searchTimeout;
    let selectedIndex = -1;
    let autocompleteResults = [];
    let currentLanguage = 'tr';

    // Google Maps katmanları
    function getGoogleMapLayers(language = 'tr') {
        const langParam = `&hl=${language}`;
        return {
            'roadmap': {
                url: `https://mt1.google.com/vt/lyrs=m${langParam}&x={x}&y={y}&z={z}`,
                options: {
                    attribution: '© Google Maps',
                    maxZoom: 20,
                    subdomains: []
                }
            },
            'satellite': {
                url: `https://mt1.google.com/vt/lyrs=s${langParam}&x={x}&y={y}&z={z}`,
                options: {
                    attribution: '© Google Maps',
                    maxZoom: 20,
                    subdomains: []
                }
            },
            'hybrid': {
                url: `https://mt1.google.com/vt/lyrs=y${langParam}&x={x}&y={y}&z={z}`,
                options: {
                    attribution: '© Google Maps',
                    maxZoom: 20,
                    subdomains: []
                }
            }
        };
    }

    // Widget'ı başlat
    function initWidget() {
        // Haritayı başlat
        setTimeout(() => {
            try {
                map = L.map('gartic-map').setView([41.0082, 28.9784], 6);

                // Varsayılan olarak Google Roadmap kullan
                switchMapLayer('roadmap');

                // İstanbul'a marker ekle
                currentMarker = L.marker([41.0082, 28.9784])
                    .addTo(map)
                    .bindPopup('İstanbul, Türkiye - Başlangıç konumu')
                    .openPopup();

                console.log('🗺️ Gartic.io Google Maps Widget (Mobile) yüklendi! (TR/EN)');
            } catch (error) {
                console.error('Harita yükleme hatası:', error);
            }
        }, 500);

        // Event listener'ları kur
        setupEventListeners();
    }

    // Harita katmanını değiştir
    function switchMapLayer(layerType) {
        if (currentTileLayer) {
            map.removeLayer(currentTileLayer);
        }

        const layers = getGoogleMapLayers(currentLanguage);
        const layer = layers[layerType];
        currentTileLayer = L.tileLayer(layer.url, layer.options);
        currentTileLayer.addTo(map);
    }

    // Dili değiştir
    function changeLanguage(newLanguage) {
        currentLanguage = newLanguage;
        const currentMapType = document.getElementById('gmw-map-type').value;
        switchMapLayer(currentMapType);

        // Placeholder'ı güncelle
        const searchInput = document.getElementById('gmw-search-input');
        searchInput.placeholder = newLanguage === 'tr' ?
            'Dünya çapında konum ara...' :
            'Search location worldwide...';
    }

    // Tam ekran toggle
    function toggleFullscreen() {
        isFullscreen = !isFullscreen;
        widget.classList.toggle('gmw-fullscreen', isFullscreen);
        
        const fullscreenBtn = document.getElementById('gmw-fullscreen-btn');
        if (fullscreenBtn) {
            fullscreenBtn.innerHTML = isFullscreen ? '⊗' : '⛶';
            fullscreenBtn.title = isFullscreen ? 'Çık' : 'Tam Ekran';
        }

        // Harita boyutunu güncelle
        setTimeout(() => {
            if (map && !isMinimized) {
                map.invalidateSize();
            }
        }, 300);
    }

    // Event listener'ları kur
    function setupEventListeners() {
        const minimizeBtn = document.getElementById('gmw-minimize-btn');
        const closeBtn = document.getElementById('gmw-close-btn');
        const fullscreenBtn = document.getElementById('gmw-fullscreen-btn');
        const searchInput = document.getElementById('gmw-search-input');
        const searchBtn = document.getElementById('gmw-search-btn');
        const zoomInBtn = document.getElementById('gmw-zoom-in');
        const zoomOutBtn = document.getElementById('gmw-zoom-out');
        const header = document.getElementById('gmw-header');
        const mapTypeSelect = document.getElementById('gmw-map-type');
        const languageSelect = document.getElementById('gmw-language');

        // Mobil toggle butonu
        if (mobileToggle) {
            mobileToggle.addEventListener('click', () => {
                const isVisible = widget.style.display !== 'none';
                widget.style.display = isVisible ? 'none' : 'block';
            });
        }

        // Harita tipi değiştir
        mapTypeSelect.addEventListener('change', (e) => {
            switchMapLayer(e.target.value);
        });

        // Dil değiştir
        languageSelect.addEventListener('change', (e) => {
            changeLanguage(e.target.value);
        });

        // Tam ekran (sadece mobil)
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleFullscreen();
            });
        }

        // Küçült/büyüt
        minimizeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMinimize();
        });

        // Kapat
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            widget.style.display = 'none';
        });

        // Arama input
        searchInput.addEventListener('input', handleSearchInput);
        searchInput.addEventListener('keydown', handleSearchKeydown);

        // Arama butonu
        searchBtn.addEventListener('click', () => {
            const query = searchInput.value.trim();
            if (query) {
                searchLocation(query);
            }
        });

        // Dışarı tıklayınca autocomplete'i kapat
        document.addEventListener('click', (e) => {
            if (!widget.contains(e.target)) {
                hideAutocomplete();
            }
        });

        // Zoom kontrolleri
        zoomInBtn.addEventListener('click', () => {
            if (map) map.zoomIn();
        });

        zoomOutBtn.addEventListener('click', () => {
            if (map) map.zoomOut();
        });

        // Sürükleme - hem mouse hem touch
        if (isMobile) {
            header.addEventListener('touchstart', startDragTouch, { passive: false });
        } else {
            header.addEventListener('mousedown', startDrag);
            setupResizeHandles();
        }

        // Global events
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd);

        // Klavye kısayolu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'm' || e.key === 'M') {
                if (widget.style.display === 'none') {
                    widget.style.display = 'block';
                }
            }
        });
    }

    // Touch sürükleme başlat
    function startDragTouch(e) {
        if (isResizing || isFullscreen) return;

        isDragging = true;
        widget.classList.add('gmw-dragging');

        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        const rect = widget.getBoundingClientRect();
        startLeft = rect.left;
        startTop = rect.top;

        e.preventDefault();
    }

    // Touch move handler
    function handleTouchMove(e) {
        if (isDragging && !isFullscreen) {
            const touch = e.touches[0];
            const deltaX = touch.clientX - startX;
            const deltaY = touch.clientY - startY;

            let newLeft = startLeft + deltaX;
            let newTop = startTop + deltaY;

            // Ekran sınırları kontrolü
            const maxLeft = window.innerWidth - widget.offsetWidth;
            const maxTop = window.innerHeight - widget.offsetHeight;

            newLeft = Math.max(0, Math.min(maxLeft, newLeft));
            newTop = Math.max(0, Math.min(maxTop, newTop));

            widget.style.left = newLeft + 'px';
            widget.style.top = newTop + 'px';
            widget.style.right = 'auto';

            e.preventDefault();
        }
    }

    // Touch end handler
    function handleTouchEnd(e) {
        if (isDragging) {
            isDragging = false;
            widget.classList.remove('gmw-dragging');
        }
    }

    // Resize handle'ları ayarla (sadece desktop)
    function setupResizeHandles() {
        if (isMobile) return;

        const handles = widget.querySelectorAll('.gmw-resize-handle');

        handles.forEach(handle => {
            handle.addEventListener('mousedown', (e) => {
                e.preventDefault();
                e.stopPropagation();
                startResize(e, handle.classList[1].replace('gmw-resize-', ''));
            });
        });
    }

    // Resize başlat
    function startResize(e, type) {
        if (isMobile) return;

        isResizing = true;
        resizeType = type;
        widget.classList.add('gmw-resizing');

        startX = e.clientX;
        startY = e.clientY;
        const rect = widget.getBoundingClientRect();
        startLeft = rect.left;
        startTop = rect.top;
        startWidth = rect.width;
        startHeight = rect.height;

        document.body.style.cursor = e.target.style.cursor;
        e.preventDefault();
    }

    // Küçült/büyüt
    function toggleMinimize() {
        isMinimized = !isMinimized;
        widget.classList.toggle('gmw-minimized', isMinimized);

        const minimizeBtn = document.getElementById('gmw-minimize-btn');
        minimizeBtn.textContent = isMinimized ? '+' : '−';

        if (!isMinimized) {
            setTimeout(() => {
                if (map) map.invalidateSize();
            }, 300);
        }
    }

    // Arama input handler
    function handleSearchInput(e) {
        const query = e.target.value.trim();

        clearTimeout(searchTimeout);

        if (query.length >= 2) {
            searchTimeout = setTimeout(() => {
                searchAutocomplete(query);
            }, 300);
        } else {
            hideAutocomplete();
        }
    }

    // Arama klavye handler
    function handleSearchKeydown(e) {
        const autocompleteDiv = document.getElementById('gmw-autocomplete');
        const items = autocompleteDiv.querySelectorAll('.gmw-autocomplete-item');

        switch(e.key) {
            case 'ArrowDown':
                e.preventDefault();
                selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
                updateSelection(items);
                break;

            case 'ArrowUp':
                e.preventDefault();
                selectedIndex = Math.max(selectedIndex - 1, -1);
                updateSelection(items);
                break;

            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0 && autocompleteResults[selectedIndex]) {
                    selectLocation(autocompleteResults[selectedIndex]);
                } else {
                    searchLocation(e.target.value);
                }
                break;

            case 'Escape':
                hideAutocomplete();
                break;
        }
    }

    // Auto-complete arama
    function searchAutocomplete(query) {
        const language = currentLanguage === 'tr' ? 'tr' : 'en';
        const searchUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=8&addressdetails=1&accept-language=${language}&namedetails=1`;

        fetch(searchUrl)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    autocompleteResults = data;
                    showAutocomplete(data);
                } else {
                    hideAutocomplete();
                }
            })
            .catch(error => {
                console.error('Autocomplete hatası:', error);
                hideAutocomplete();
            });
    }

    // Manuel arama
    function searchLocation(query) {
        if (!query.trim()) return;

        hideAutocomplete();

        const language = currentLanguage === 'tr' ? 'tr' : 'en';
        const searchUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&addressdetails=1&accept-language=${language}&namedetails=1`;

        fetch(searchUrl)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    selectLocation(data[0]);
                } else {
                    const notFoundMsg = currentLanguage === 'tr' ? 'Konum bulunamadı!' : 'Location not found!';
                    alert(notFoundMsg);
                }
            })
            .catch(error => {
                console.error('Arama hatası:', error);
                const errorMsg = currentLanguage === 'tr' ? 'Arama hatası oluştu!' : 'Search error occurred!';
                alert(errorMsg);
            });
    }

    // Autocomplete sonuçlarını göster
    function showAutocomplete(results) {
        const autocompleteDiv = document.getElementById('gmw-autocomplete');
        autocompleteDiv.innerHTML = '';
        selectedIndex = -1;

        results.forEach((result, index) => {
            const item = document.createElement('div');
            item.className = 'gmw-autocomplete-item';

            // Dil göre ismi seç
            const placeName = getLocalizedName(result);
            const placeDetails = result.display_name.split(',').slice(1, 3).join(',').trim();

            item.innerHTML = `
                <div class="place-name">${placeName}</div>
                <div class="place-details">${placeDetails}</div>
            `;

            // Touch ve click event'leri
            item.addEventListener('click', () => selectLocation(result));
            if (isMobile) {
                item.addEventListener('touchstart', () => selectLocation(result), { passive: true });
            } else {
                item.addEventListener('mouseenter', () => {
                    selectedIndex = index;
                    updateSelection(autocompleteDiv.querySelectorAll('.gmw-autocomplete-item'));
                });
            }

            autocompleteDiv.appendChild(item);
        });

        autocompleteDiv.style.display = 'block';
    }

    // Yerelleştirilmiş isim al
    function getLocalizedName(result) {
        // Önce seçili dile göre namedetails'ten kontrol et
        if (result.namedetails) {
            const langKey = `name:${currentLanguage}`;
            if (result.namedetails[langKey]) {
                return result.namedetails[langKey];
            }
        }

        // Yoksa display_name'in ilk kısmını al
        return result.display_name.split(',')[0];
    }

    // Autocomplete'i gizle
    function hideAutocomplete() {
        const autocompleteDiv = document.getElementById('gmw-autocomplete');
        autocompleteDiv.style.display = 'none';
        selectedIndex = -1;
        autocompleteResults = [];
    }

    // Seçim güncelle
    function updateSelection(items) {
        items.forEach((item, index) => {
            item.classList.toggle('selected', index === selectedIndex);
        });
    }

    // Konum seç
    function selectLocation(result) {
        const lat = parseFloat(result.lat);
        const lon = parseFloat(result.lon);

        if (isNaN(lat) || isNaN(lon)) {
            console.error('Geçersiz koordinatlar:', result);
            return;
        }

        // Input'u temizle ve autocomplete'i gizle
        document.getElementById('gmw-search-input').value = '';
        hideAutocomplete();

        // Haritayı konuma odakla
        if (map) {
            map.setView([lat, lon], 13);

            // Eski marker'ı kaldır
            if (currentMarker) {
                map.removeLayer(currentMarker);
            }

            // Yerelleştirilmiş isim al
            const displayName = getLocalizedName(result);
            const details = result.display_name.split(',').slice(1, 3).join(',').trim();

            // Yeni marker ekle
            currentMarker = L.marker([lat, lon])
                .addTo(map)
                .bindPopup(`
                    <strong>${displayName}</strong><br>
                    <small>${details}</small><br>
                    <small>📍 ${lat.toFixed(4)}, ${lon.toFixed(4)}</small>
                `)
                .openPopup();
        }
    }

    // Sürükleme başlat
    function startDrag(e) {
        if (isResizing || isFullscreen) return;

        isDragging = true;
        widget.classList.add('gmw-dragging');

        startX = e.clientX;
        startY = e.clientY;
        const rect = widget.getBoundingClientRect();
        startLeft = rect.left;
        startTop = rect.top;

        e.preventDefault();
    }

    // Mouse move handler
    function handleMouseMove(e) {
        if (isDragging && !isFullscreen) {
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;

            let newLeft = startLeft + deltaX;
            let newTop = startTop + deltaY;

            // Ekran sınırları kontrolü
            const maxLeft = window.innerWidth - widget.offsetWidth;
            const maxTop = window.innerHeight - widget.offsetHeight;

            newLeft = Math.max(0, Math.min(maxLeft, newLeft));
            newTop = Math.max(0, Math.min(maxTop, newTop));

            widget.style.left = newLeft + 'px';
            widget.style.top = newTop + 'px';
            widget.style.right = 'auto';
        } else if (isResizing && !isMobile) {
            handleResize(e);
        }
    }

    // Resize handler (sadece desktop)
    function handleResize(e) {
        if (isMobile) return;

        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        let newWidth = startWidth;
        let newHeight = startHeight;
        let newLeft = startLeft;
        let newTop = startTop;

        // Minimum boyutlar
        const minWidth = 200;
        const minHeight = 150;
        const maxWidth = window.innerWidth;
        const maxHeight = window.innerHeight;

        // Resize tipine göre boyut hesapla
        switch(resizeType) {
            case 'se':
                newWidth = Math.max(minWidth, Math.min(maxWidth - startLeft, startWidth + deltaX));
                newHeight = Math.max(minHeight, Math.min(maxHeight - startTop, startHeight + deltaY));
                break;
            case 's':
                newHeight = Math.max(minHeight, Math.min(maxHeight - startTop, startHeight + deltaY));
                break;
            case 'e':
                newWidth = Math.max(minWidth, Math.min(maxWidth - startLeft, startWidth + deltaX));
                break;
            case 'sw':
                newWidth = Math.max(minWidth, startWidth - deltaX);
                newHeight = Math.max(minHeight, Math.min(maxHeight - startTop, startHeight + deltaY));
                newLeft = startLeft + (startWidth - newWidth);
                break;
            case 'w':
                newWidth = Math.max(minWidth, startWidth - deltaX);
                newLeft = startLeft + (startWidth - newWidth);
                break;
            case 'ne':
                newWidth = Math.max(minWidth, Math.min(maxWidth - startLeft, startWidth + deltaX));
                newHeight = Math.max(minHeight, startHeight - deltaY);
                newTop = startTop + (startHeight - newHeight);
                break;
            case 'n':
                newHeight = Math.max(minHeight, startHeight - deltaY);
                newTop = startTop + (startHeight - newHeight);
                break;
            case 'nw':
                newWidth = Math.max(minWidth, startWidth - deltaX);
                newHeight = Math.max(minHeight, startHeight - deltaY);
                newLeft = startLeft + (startWidth - newWidth);
                newTop = startTop + (startHeight - newHeight);
                break;
        }

        // Ekran sınırları kontrolü
        if (newLeft < 0) {
            newWidth += newLeft;
            newLeft = 0;
        }
        if (newTop < 0) {
            newHeight += newTop;
            newTop = 0;
        }
        if (newLeft + newWidth > maxWidth) {
            newWidth = maxWidth - newLeft;
        }
        if (newTop + newHeight > maxHeight) {
            newHeight = maxHeight - newTop;
        }

        // Boyutları uygula
        widget.style.width = newWidth + 'px';
        widget.style.height = newHeight + 'px';
        widget.style.left = newLeft + 'px';
        widget.style.top = newTop + 'px';
        widget.style.right = 'auto';
        widget.style.bottom = 'auto';
    }

    // Mouse up handler
    function handleMouseUp(e) {
        if (isDragging) {
            isDragging = false;
            widget.classList.remove('gmw-dragging');
        }

        if (isResizing) {
            isResizing = false;
            resizeType = '';
            widget.classList.remove('gmw-resizing');
            document.body.style.cursor = '';

            // Harita boyutunu güncelle
            setTimeout(() => {
                if (map && !isMinimized) {
                    map.invalidateSize();
                }
            }, 100);
        }
    }

    // Sayfa yüklendiğinde widget'ı başlat
    function waitForPageLoad() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initWidget);
        } else {
            initWidget();
        }
    }

    // Widget'ı yeniden konumlandır (ekran boyutu değiştiğinde)
    function repositionWidget() {
        if (isFullscreen) return;

        const rect = widget.getBoundingClientRect();
        const maxLeft = window.innerWidth - rect.width;
        const maxTop = window.innerHeight - rect.height;

        let newLeft = rect.left;
        let newTop = rect.top;

        if (rect.left > maxLeft) {
            newLeft = Math.max(0, maxLeft);
        }
        if (rect.top > maxTop) {
            newTop = Math.max(0, maxTop);
        }

        if (newLeft !== rect.left || newTop !== rect.top) {
            widget.style.left = newLeft + 'px';
            widget.style.top = newTop + 'px';
            widget.style.right = 'auto';
            widget.style.bottom = 'auto';
        }
    }

    // Ekran boyutu değiştiğinde widget'ı yeniden konumlandır
    window.addEventListener('resize', repositionWidget);

    // Orientasyon değişikliği (mobil için)
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            repositionWidget();
            if (map && !isMinimized) {
                map.invalidateSize();
            }
        }, 500);
    });

    // Konsol komutları (geliştirici için)
    window.garticMapsCommands = {
        show: () => {
            widget.style.display = 'block';
            console.log('🗺️ Gartic Maps widget gösterildi');
        },
        hide: () => {
            widget.style.display = 'none';
            console.log('🗺️ Gartic Maps widget gizlendi');
        },
        toggleMinimize: () => {
            toggleMinimize();
            console.log('🗺️ Gartic Maps widget küçültüldü/büyütüldü');
        },
        toggleFullscreen: () => {
            if (isMobile) {
                toggleFullscreen();
                console.log('🗺️ Gartic Maps widget tam ekran değiştirildi');
            }
        },
        reset: () => {
            widget.style.left = '';
            widget.style.top = '';
            widget.style.right = isMobile ? '10px' : '20px';
            widget.style.bottom = '';
            widget.style.width = isMobile ? '90vw' : '250px';
            widget.style.height = isMobile ? '60vh' : '200px';
            widget.classList.remove('gmw-fullscreen');
            isFullscreen = false;
            console.log('🗺️ Gartic Maps widget konumu sıfırlandı');
        },
        goto: (lat, lng, zoom = 13) => {
            if (map) {
                map.setView([lat, lng], zoom);
                if (currentMarker) map.removeLayer(currentMarker);
                currentMarker = L.marker([lat, lng]).addTo(map)
                    .bindPopup(`📍 ${lat.toFixed(4)}, ${lng.toFixed(4)}`).openPopup();
                console.log(`🗺️ Harita ${lat}, ${lng} konumuna odaklandı`);
            }
        },
        changeLanguage: (lang) => {
            if (lang === 'tr' || lang === 'en') {
                document.getElementById('gmw-language').value = lang;
                changeLanguage(lang);
                console.log(`🗺️ Dil ${lang} olarak değiştirildi`);
            }
        }
    };

    // Debug bilgisi
    console.log('🗺️ Gartic.io Google Maps Widget v4 (Mobile) yükleniyor...');
    console.log(`📱 Platform: ${isMobile ? 'Mobil' : 'Desktop'}`);
    if (isMobile) {
        console.log('📍 Kullanım: Sağ alttaki MAP butonuna tıklayın veya M tuşu');
    } else {
        console.log('📍 Kullanım: M tuşu ile göster/gizle');
    }
    console.log('🔧 Komutlar: garticMapsCommands.show(), .hide(), .reset(), .goto(lat, lng), .changeLanguage(tr/en)');

    // Klavye kısayolu bilgisi (sayfa yüklendikten 5 saniye sonra)
    setTimeout(() => {
        if (isMobile) {
            if (currentLanguage === 'tr') {
                console.log('📱 İpucu: Sağ alttaki MAP butonuna tıklayarak haritayı açabilirsiniz');
            } else {
                console.log('📱 Tip: Tap the MAP button at bottom right to open the map');
            }
        } else {
            if (currentLanguage === 'tr') {
                console.log('⌨️  İpucu: Widget\'ı göstermek/gizlemek için M tuşuna basın');
            } else {
                console.log('⌨️  Tip: Press M key to show/hide the widget');
            }
        }
    }, 5000);

    // Widget'ı başlat
    waitForPageLoad();

    // Sayfa değişikliklerini izle (SPA için)
    let currentUrl = location.href;
    new MutationObserver(() => {
        if (location.href !== currentUrl) {
            currentUrl = location.href;
            setTimeout(() => {
                if (!document.getElementById('gartic-maps-widget')) {
                    document.body.appendChild(widget);
                    if (isMobile && !document.getElementById('gmw-mobile-toggle')) {
                        document.body.appendChild(mobileToggle);
                    }
                    console.log('🗺️ Widget sayfa değişikliği sonrası yeniden eklendi');
                }
            }, 1000);
        }
    }).observe(document, {subtree: true, childList: true});

})();