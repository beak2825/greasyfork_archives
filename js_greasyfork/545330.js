// ==UserScript==
// @name         Gartic.io OpenTogetherTube dum
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  OpenTogetherTube penceresi - Mobil uyumlu
// @author       You
// @match        https://gartic.io/*
// @match        http://gartic.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545330/Garticio%20OpenTogetherTube%20dum.user.js
// @updateURL https://update.greasyfork.org/scripts/545330/Garticio%20OpenTogetherTube%20dum.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let iframe;
    let container;
    let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // Sayfa yüklendiğinde başlat
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeScript);
    } else {
        initializeScript();
    }

    function initializeScript() {
        // Hemen pencereyi oluştur
        createFloatingWindow();
    }

    function createFloatingWindow() {
        // Ana container - mobil ve desktop için farklı boyutlar
        container = document.createElement('div');
        container.id = 'ott-container';
        
        const mobileStyles = isMobile ? `
            width: 90vw;
            height: 50vh;
            left: 5vw;
            bottom: 10px;
            min-width: 280px;
            min-height: 200px;
            max-width: 95vw;
            max-height: 80vh;
        ` : `
            width: 480px;
            height: 350px;
            left: 20px;
            bottom: 20px;
            min-width: 350px;
            min-height: 250px;
            max-width: 1000px;
            max-height: 800px;
        `;

        container.style.cssText = `
            position: fixed;
            ${mobileStyles}
            background: #1e1e1e;
            border: 2px solid #ff6b35;
            border-radius: 15px;
            z-index: 9999;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            resize: ${isMobile ? 'none' : 'both'};
            overflow: hidden;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            touch-action: none;
        `;

        // Header
        const header = document.createElement('div');
        header.style.cssText = `
            background: linear-gradient(135deg, #ff6b35, #f39c12);
            color: white;
            padding: ${isMobile ? '15px' : '12px 15px'};
            font-size: ${isMobile ? '14px' : '13px'};
            cursor: ${isMobile ? 'grab' : 'move'};
            display: flex;
            justify-content: space-between;
            align-items: center;
            user-select: none;
            font-weight: 600;
            touch-action: none;
        `;

        header.innerHTML = `
            <span>🎵 OpenTogetherTube</span>
            <div>
                <button id="minimize-btn" style="background: #666; border: none; color: white; padding: ${isMobile ? '8px 12px' : '5px 10px'}; border-radius: 6px; cursor: pointer; font-size: ${isMobile ? '16px' : '14px'}; touch-action: manipulation;">−</button>
            </div>
        `;

        // Content area
        const content = document.createElement('div');
        content.id = 'ott-content';
        content.style.cssText = `
            width: 100%;
            height: calc(100% - ${isMobile ? '63px' : '55px'});
            position: relative;
            background: #2c2c2c;
            overflow: hidden;
        `;

        // Activation overlay
        const overlay = document.createElement('div');
        overlay.id = 'activation-overlay';
        overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(255,107,53,0.9), rgba(231,76,60,0.9));
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 10;
            color: white;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            touch-action: manipulation;
        `;

        overlay.innerHTML = `
            <div style="font-size: ${isMobile ? '80px' : '60px'}; margin-bottom: ${isMobile ? '30px' : '20px'}; animation: bounce 2s infinite;">🎵</div>
            <div style="font-size: ${isMobile ? '20px' : '18px'}; font-weight: bold; margin-bottom: ${isMobile ? '15px' : '10px'};">OpenTogetherTube'u Başlat</div>
            <div style="font-size: ${isMobile ? '16px' : '14px'}; opacity: 0.9; margin-bottom: ${isMobile ? '30px' : '20px'};">Video izlemek için dokunun</div>
            <div style="padding: ${isMobile ? '15px 30px' : '12px 24px'}; background: rgba(255,255,255,0.2); border-radius: 25px; font-size: ${isMobile ? '16px' : '14px'}; font-weight: 600;">BAŞLAT</div>
        `;

        // İframe oluştur
        iframe = document.createElement('iframe');
        iframe.style.cssText = `
            width: 100%;
            height: 100%;
            border: none;
            border-radius: 0 0 15px 15px;
            background: #000;
        `;
        
        iframe.setAttribute('allow', 'autoplay; fullscreen; microphone; camera; midi; encrypted-media; payment; clipboard-read; clipboard-write; web-share; picture-in-picture');
        iframe.setAttribute('allowfullscreen', 'true');

        // Elementleri birleştir
        content.appendChild(overlay);
        content.appendChild(iframe);
        container.appendChild(header);
        container.appendChild(content);
        document.body.appendChild(container);

        setupEventListeners();
        
        showNotification('OpenTogetherTube hazır! Başlatmak için pencereye dokunun.', 'info');
    }

    function setupEventListeners() {
        // Ana aktivasyon
        document.getElementById('activation-overlay').addEventListener('click', function() {
            activatePlayer();
        });

        // Touch için de ekle
        document.getElementById('activation-overlay').addEventListener('touchend', function(e) {
            e.preventDefault();
            activatePlayer();
        });

        setupWindowControls();
    }

    function activatePlayer() {
        const overlay = document.getElementById('activation-overlay');
        overlay.style.opacity = '0';
        
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 300);

        // 3131 odasına bağlan
        const fullUrl = 'https://opentogethertube.com/room/3131';
        iframe.src = fullUrl;

        showNotification('OpenTogetherTube yükleniyor...', 'info');
    }

    function setupWindowControls() {
        const header = container.querySelector('div');
        let isDragging = false;
        let dragOffset = { x: 0, y: 0 };

        // Mouse events (Desktop)
        header.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);

        // Touch events (Mobile)
        header.addEventListener('touchstart', startDragTouch);
        document.addEventListener('touchmove', dragTouch);
        document.addEventListener('touchend', stopDrag);

        function startDrag(e) {
            if (e.target.tagName === 'BUTTON') return;
            isDragging = true;
            dragOffset.x = e.clientX - container.offsetLeft;
            dragOffset.y = e.clientY - container.offsetTop;
            document.body.style.userSelect = 'none';
            header.style.cursor = 'grabbing';
            e.preventDefault();
        }

        function startDragTouch(e) {
            if (e.target.tagName === 'BUTTON') return;
            isDragging = true;
            const touch = e.touches[0];
            dragOffset.x = touch.clientX - container.offsetLeft;
            dragOffset.y = touch.clientY - container.offsetTop;
            document.body.style.userSelect = 'none';
            header.style.cursor = 'grabbing';
            e.preventDefault();
        }

        function drag(e) {
            if (!isDragging) return;
            
            const newLeft = Math.max(0, Math.min(window.innerWidth - container.offsetWidth, e.clientX - dragOffset.x));
            const newTop = Math.max(0, Math.min(window.innerHeight - container.offsetHeight, e.clientY - dragOffset.y));
            
            container.style.left = newLeft + 'px';
            container.style.top = newTop + 'px';
        }

        function dragTouch(e) {
            if (!isDragging) return;
            
            const touch = e.touches[0];
            const newLeft = Math.max(0, Math.min(window.innerWidth - container.offsetWidth, touch.clientX - dragOffset.x));
            const newTop = Math.max(0, Math.min(window.innerHeight - container.offsetHeight, touch.clientY - dragOffset.y));
            
            container.style.left = newLeft + 'px';
            container.style.top = newTop + 'px';
            e.preventDefault();
        }

        function stopDrag() {
            isDragging = false;
            document.body.style.userSelect = '';
            header.style.cursor = isMobile ? 'grab' : 'move';
        }

        // Minimize/Maximize
        let isMinimized = false;
        document.getElementById('minimize-btn').addEventListener('click', function() {
            const content = document.getElementById('ott-content');
            if (isMinimized) {
                content.style.display = 'block';
                container.style.height = isMobile ? '50vh' : '350px';
                this.textContent = '−';
                isMinimized = false;
            } else {
                content.style.display = 'none';
                container.style.height = isMobile ? '63px' : '55px';
                this.textContent = '+';
                isMinimized = true;
            }
        });

        // Touch için minimize butonu
        document.getElementById('minimize-btn').addEventListener('touchend', function(e) {
            e.preventDefault();
            this.click();
        });
    }

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        
        const mobileNotificationStyles = isMobile ? `
            top: 10px;
            left: 5vw;
            right: 5vw;
            width: auto;
            font-size: 14px;
            padding: 18px 20px;
        ` : `
            top: 20px;
            left: 20px;
            max-width: 300px;
            font-size: 13px;
            padding: 15px 20px;
        `;

        notification.style.cssText = `
            position: fixed;
            ${mobileNotificationStyles}
            border-radius: 10px;
            color: white;
            font-family: 'Segoe UI', sans-serif;
            font-weight: 500;
            z-index: 10001;
            box-shadow: 0 8px 25px rgba(0,0,0,0.3);
            opacity: 0;
            transform: translateY(-20px);
            transition: all 0.3s ease;
        `;

        const colors = {
            success: '#27ae60',
            warning: '#f39c12',
            error: '#e74c3c',
            info: '#3498db'
        };

        notification.style.background = colors[type] || colors.info;
        notification.textContent = message;
        document.body.appendChild(notification);

        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        });

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    // CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-20px); }
            60% { transform: translateY(-10px); }
        }

        #ott-container button {
            transition: all 0.2s ease;
        }

        #ott-container button:hover {
            opacity: 0.85;
            transform: scale(1.05);
        }

        #activation-overlay:hover {
            transform: scale(1.02);
        }

        #ott-container {
            backdrop-filter: blur(10px);
        }

        /* Mobil için özel stiller */
        @media (max-width: 768px) {
            #ott-container {
                border-width: 3px;
            }
            
            #ott-container button:active {
                transform: scale(0.95);
                opacity: 0.7;
            }
            
            #activation-overlay:active {
                transform: scale(0.98);
            }
        }

        /* Touch cihazları için scroll engelleyici */
        body.dragging {
            overflow: hidden;
            -webkit-overflow-scrolling: none;
        }
    `;
    document.head.appendChild(style);

    // Mobil cihazlarda scroll engellemek için
    if (isMobile) {
        header.addEventListener('touchstart', () => {
            document.body.classList.add('dragging');
        });
        
        document.addEventListener('touchend', () => {
            document.body.classList.remove('dragging');
        });
    }

    console.log(`Gartic.io OpenTogetherTube Script yüklendi! (${isMobile ? 'Mobil' : 'Desktop'} Mod)`);

})();