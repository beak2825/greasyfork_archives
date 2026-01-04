// ==UserScript==
// @name         Aternos 24/7 Open (Ad Anti-Anti) - Improved
// @namespace    https://github.com/bylordwz/Aternos-24-7-Open-Ad-Anti-Anti
// @version      1.2
// @description  Automatic server start for Aternos + bypasses anti-adblock checks - Improved version
// @author       Warden Zone Studio
// @copyright    2025, Warden Zone Studio
// @match        https://aternos.org/*
// @icon         https://aternos.org/favicon.ico
// @grant        none
// @run-at       document-idle
// @license      Copyright
// @homepage     https://github.com/bylordwz/Aternos-24-7-Open-Ad-Anti-Anti
// @downloadURL https://update.greasyfork.org/scripts/537259/Aternos%20247%20Open%20%28Ad%20Anti-Anti%29%20-%20Improved.user.js
// @updateURL https://update.greasyfork.org/scripts/537259/Aternos%20247%20Open%20%28Ad%20Anti-Anti%29%20-%20Improved.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let autoMode = false;
    let lastExtendClick = 0;
    let controlsAdded = false;

    // CSS stillerini ekle
    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .auto-control-div {
                display: inline-block !important;
                margin-left: 10px !important;
                visibility: visible !important;
                opacity: 1 !important;
                position: relative !important;
                z-index: 9999 !important;
            }
            
            .auto-control-btn {
                background-color: #ffc107 !important;
                border: 1px solid #e0a800 !important;
                color: #212529 !important;
                padding: 8px 16px !important;
                font-size: 14px !important;
                border-radius: 4px !important;
                cursor: pointer !important;
                transition: all 0.2s !important;
                display: inline-block !important;
                text-decoration: none !important;
                font-weight: 500 !important;
                line-height: 1.5 !important;
                text-align: center !important;
                vertical-align: middle !important;
                user-select: none !important;
                min-width: 140px !important;
            }
            
            .auto-control-btn:hover {
                background-color: #e0a800 !important;
                border-color: #d39e00 !important;
                transform: translateY(-1px) !important;
            }
            
            .auto-control-btn.btn-success {
                background-color: #28a745 !important;
                border-color: #1e7e34 !important;
                color: white !important;
            }
            
            .auto-control-btn.btn-success:hover {
                background-color: #218838 !important;
                border-color: #1e7e34 !important;
            }
            
            .auto-control-btn i {
                margin-right: 5px !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Kontrol butonlarını ekle - geliştirilmiş versiyon
    function addControls() {
        if (controlsAdded) return;
        
        // Farklı seçiciler dene
        const selectors = [
            '#restart',
            '.btn-restart',
            '[data-page="restart"]',
            '.server-restart',
            '.restart-button'
        ];
        
        let restartButton = null;
        for (const selector of selectors) {
            restartButton = document.querySelector(selector);
            if (restartButton) break;
        }
        
        // Eğer restart buton yoksa, start butonunu ara
        if (!restartButton) {
            const startSelectors = [
                '#start',
                '.btn-start',
                '[data-page="start"]',
                '.server-start',
                '.start-button'
            ];
            
            for (const selector of startSelectors) {
                restartButton = document.querySelector(selector);
                if (restartButton) break;
            }
        }
        
        // Eğer hala buton yoksa, server kontrollerini ara
        if (!restartButton) {
            const serverControls = document.querySelector('.server-controls, .server-status, .status-controls');
            if (serverControls) {
                restartButton = serverControls;
            }
        }
        
        if (!restartButton) {
            console.log('Restart/Start button not found, retrying...');
            return;
        }

        const controlDiv = document.createElement('div');
        controlDiv.className = 'auto-control-div';

        const autoButton = document.createElement('button');
        autoButton.innerHTML = '<i class="fas fa-robot"></i> Auto Mode: OFF';
        autoButton.className = 'auto-control-btn btn-warning';
        autoButton.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleAuto(autoButton);
        };

        controlDiv.appendChild(autoButton);
        
        // Butonu farklı yerlere eklemeyi dene
        try {
            if (restartButton.parentNode) {
                restartButton.parentNode.insertBefore(controlDiv, restartButton.nextSibling);
            } else {
                document.body.appendChild(controlDiv);
            }
            controlsAdded = true;
            console.log('Auto control button added successfully');
        } catch (e) {
            console.error('Error adding control button:', e);
        }
    }

    function toggleAuto(button) {
        autoMode = !autoMode;
        button.innerHTML = `<i class="fas fa-robot"></i> Auto Mode: ${autoMode ? 'ON' : 'OFF'}`;
        button.className = `auto-control-btn ${autoMode ? 'btn-success' : 'btn-warning'}`;
        console.log(`Auto mode ${autoMode ? 'enabled' : 'disabled'}`);
    }

    // Geliştirilmiş server kontrol mantığı
    function controlServer() {
        if (!autoMode) return;

        // Farklı status seçiciler dene
        const statusSelectors = [
            '.status',
            '.server-status',
            '[data-status]',
            '.status-indicator',
            '.server-state'
        ];
        
        let status = null;
        for (const selector of statusSelectors) {
            status = document.querySelector(selector);
            if (status) break;
        }
        
        if (!status) return;

        // Loading durumunu kontrol et
        if (status.classList.contains('loading') || 
            status.classList.contains('starting') ||
            status.classList.contains('stopping')) {
            return;
        }

        // Offline durumunda start butonuna bas
        if (status.classList.contains('offline') || 
            status.textContent.toLowerCase().includes('offline') ||
            status.textContent.toLowerCase().includes('kapalı')) {
            
            const startSelectors = [
                '#start',
                '.btn-start',
                '[data-action="start"]',
                '.server-start',
                '.start-button'
            ];
            
            for (const selector of startSelectors) {
                const startButton = document.querySelector(selector);
                if (startButton && startButton.offsetParent !== null) {
                    startButton.click();
                    console.log('Server start button clicked');
                    break;
                }
            }
        }
        
        // Online durumunda extend butonuna bas
        else if (status.classList.contains('online') || 
                 status.textContent.toLowerCase().includes('online') ||
                 status.textContent.toLowerCase().includes('açık')) {
            
            const extendSelectors = [
                '.server-extend-end',
                '.extend-button',
                '[data-action="extend"]',
                '.btn-extend',
                '.server-extend'
            ];
            
            const now = Date.now();
            
            for (const selector of extendSelectors) {
                const extendButton = document.querySelector(selector);
                if (extendButton && 
                    extendButton.offsetParent !== null && 
                    now - lastExtendClick > 5000) {
                    
                    extendButton.click();
                    lastExtendClick = now;
                    console.log('Server extend button clicked');
                    break;
                }
            }
        }
    }

    // Geliştirilmiş reklam bypass mantığı
    function bypassAd() {
        // Türkçe metin için
        const turkishText = "Yine de reklam engelleyiciyle devam et";
        // İngilizce metin için
        const englishText = "Continue with ad blocker anyway";
        
        const buttonSelectors = [
            'div.btn.btn-white.wZDWEUqRUPDi',
            '.btn-white',
            '.ad-blocker-continue',
            '[data-action="continue"]',
            '.continue-button'
        ];
        
        for (const selector of buttonSelectors) {
            const buttons = document.querySelectorAll(selector);
            for (const btn of buttons) {
                const text = btn.innerText.trim();
                if (text === turkishText || text === englishText) {
                    console.log('Ad blocker continue button found, clicking...');
                    btn.click();
                    console.log('Ad blocker warning bypassed');
                    return;
                }
            }
        }
        
        // Overlay'i kapat
        const overlays = document.querySelectorAll('.modal, .overlay, .popup, [class*="adblock"]');
        for (const overlay of overlays) {
            if (overlay.style.display !== 'none' && overlay.offsetParent !== null) {
                const closeBtn = overlay.querySelector('.close, .btn-close, [data-dismiss]');
                if (closeBtn) {
                    closeBtn.click();
                    console.log('Overlay closed');
                }
            }
        }
    }

    // Sayfa yüklendikten sonra başlat
    function initialize() {
        addStyles();
        
        // Kontrolleri eklemek için birkaç kez dene
        let attempts = 0;
        const addControlsInterval = setInterval(() => {
            attempts++;
            addControls();
            if (controlsAdded || attempts > 10) {
                clearInterval(addControlsInterval);
            }
        }, 1000);
        
        // Ana döngüyü başlat
        startMainLoop();
    }

    // Ana döngü - performans optimizasyonu ile
    function startMainLoop() {
        let lastCheck = 0;
        
        function mainLoop(timestamp) {
            // Her saniye kontrol et
            if (timestamp - lastCheck >= 1000) {
                try {
                    bypassAd();
                    controlServer();
                    
                    // Eğer kontroller eklenmemişse tekrar dene
                    if (!controlsAdded) {
                        addControls();
                    }
                } catch (e) {
                    console.error('Error in main loop:', e);
                }
                lastCheck = timestamp;
            }
            requestAnimationFrame(mainLoop);
        }
        
        requestAnimationFrame(mainLoop);
    }

    // Sayfa tam yüklendikten sonra başlat
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
    // Sayfa değişiklikleri için observer
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && !controlsAdded) {
                setTimeout(addControls, 500);
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();