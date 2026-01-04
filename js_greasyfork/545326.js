// ==UserScript==
// @name         Gartic.io OpenTogetherTube Embedder
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  OpenTogetherTube penceresi
// @author       You
// @match        https://gartic.io/*
// @match        http://gartic.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545326/Garticio%20OpenTogetherTube%20Embedder.user.js
// @updateURL https://update.greasyfork.org/scripts/545326/Garticio%20OpenTogetherTube%20Embedder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let iframe;
    let container;

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
        // Ana container
        container = document.createElement('div');
        container.id = 'ott-container';
        container.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 480px;
            height: 350px;
            background: #1e1e1e;
            border: 2px solid #ff6b35;
            border-radius: 15px;
            z-index: 9999;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            resize: both;
            overflow: hidden;
            min-width: 350px;
            min-height: 250px;
            max-width: 1000px;
            max-height: 800px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        `;

        // Header
        const header = document.createElement('div');
        header.style.cssText = `
            background: linear-gradient(135deg, #ff6b35, #f39c12);
            color: white;
            padding: 12px 15px;
            font-size: 13px;
            cursor: move;
            display: flex;
            justify-content: space-between;
            align-items: center;
            user-select: none;
            font-weight: 600;
        `;

        header.innerHTML = `
            <span>🎵 OpenTogetherTube</span>
            <div>
                <button id="minimize-btn" style="background: #666; border: none; color: white; padding: 5px 10px; border-radius: 6px; cursor: pointer;">−</button>
            </div>
        `;

        // Content area
        const content = document.createElement('div');
        content.id = 'ott-content';
        content.style.cssText = `
            width: 100%;
            height: calc(100% - 55px);
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
        `;

        overlay.innerHTML = `
            <div style="font-size: 60px; margin-bottom: 20px; animation: bounce 2s infinite;">🎵</div>
            <div style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">OpenTogetherTube'u Başlat</div>
            <div style="font-size: 14px; opacity: 0.9; margin-bottom: 20px;">Video izlemek için tıklayın</div>
            <div style="padding: 12px 24px; background: rgba(255,255,255,0.2); border-radius: 25px; font-size: 14px; font-weight: 600;">BAŞLAT</div>
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
        
        showNotification('OpenTogetherTube hazır! Başlatmak için pencereye tıklayın.', 'info');
    }

    function setupEventListeners() {
        // Ana aktivasyon
        document.getElementById('activation-overlay').addEventListener('click', function() {
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
        // Sürükleme
        const header = container.querySelector('div');
        let isDragging = false;
        let dragOffset = { x: 0, y: 0 };

        header.addEventListener('mousedown', function(e) {
            if (e.target.tagName === 'BUTTON') return;
            isDragging = true;
            dragOffset.x = e.clientX - container.offsetLeft;
            dragOffset.y = e.clientY - container.offsetTop;
            document.body.style.userSelect = 'none';
            e.preventDefault();
        });

        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            
            const newLeft = Math.max(0, Math.min(window.innerWidth - container.offsetWidth, e.clientX - dragOffset.x));
            const newTop = Math.max(0, Math.min(window.innerHeight - container.offsetHeight, e.clientY - dragOffset.y));
            
            container.style.left = newLeft + 'px';
            container.style.top = newTop + 'px';
        });

        document.addEventListener('mouseup', function() {
            isDragging = false;
            document.body.style.userSelect = '';
        });

        // Minimize/Maximize
        let isMinimized = false;
        document.getElementById('minimize-btn').addEventListener('click', function() {
            const content = document.getElementById('ott-content');
            if (isMinimized) {
                content.style.display = 'block';
                container.style.height = '350px';
                this.textContent = '−';
                isMinimized = false;
            } else {
                content.style.display = 'none';
                container.style.height = '55px';
                this.textContent = '+';
                isMinimized = true;
            }
        });
    }

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 10px;
            color: white;
            font-family: 'Segoe UI', sans-serif;
            font-size: 13px;
            font-weight: 500;
            z-index: 10001;
            max-width: 300px;
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
    `;
    document.head.appendChild(style);

    console.log('Gartic.io OpenTogetherTube Script yüklendi!');

})();