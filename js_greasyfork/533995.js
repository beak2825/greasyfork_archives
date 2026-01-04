// ==UserScript==
// @name         Pwzz Mod Menu - Wormax2.io Zoom Hack
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Wormax2.io için havalı bir mod menüsü ile zoom hack! Pwzz ile zoom seviyesini slider ile ayarla.
// @author       mf
// @license pwzz and mf ai
// @match        https://wormax2.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533995/Pwzz%20Mod%20Menu%20-%20Wormax2io%20Zoom%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/533995/Pwzz%20Mod%20Menu%20-%20Wormax2io%20Zoom%20Hack.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[Pwzz] Mod Menüsü ve Zoom Hack Başlatılıyor...');

    // Debug log fonksiyonu
    function log(message) {
        console.log(`[Pwzz] ${message}`);
    }

    // Global değişkenler
    window.pwzz = window.pwzz || {}; // Global bir namespace oluştur
    window.pwzz.targetCamera = window.pwzz.targetCamera || null; // Kamerayı saklamak için
    window.pwzz.cameraControllerInstance = window.pwzz.cameraControllerInstance || null; // CameraController instance’ını saklamak için
    window.pwzz.isCameraFound = window.pwzz.isCameraFound || false; // Kameranın bulunup bulunmadığını takip et
    window.pwzz.desiredZoom = 2; // Slider’dan alınacak istenen zoom değeri (varsayılan 2x)

    // Derin nesne tarama fonksiyonu (recursive)
    function deepSearch(obj, targetKey, depth = 0, maxDepth = 5) {
        if (depth > maxDepth) return null;
        if (!obj || typeof obj !== 'object') return null;

        for (let key in obj) {
            if (key === targetKey) {
                log(`Hedef bulundu: ${key} (derinlik: ${depth})`);
                return obj[key];
            }
            if (typeof obj[key] === 'object') {
                const result = deepSearch(obj[key], targetKey, depth + 1, maxDepth);
                if (result) {
                    log(`Derin tarama sonucu bulundu: ${key}.${targetKey}`);
                    return result;
                }
            }
        }
        return null;
    }

    // Kamerayı bir kez bul ve global olarak sakla
    function findCameraOnce() {
        if (window.pwzz.isCameraFound) {
            log('Kamera nesnesi zaten global olarak saklandı, tekrar aranmıyor.');
            return true;
        }

        log('Kamera nesnesi aranıyor...');

        const namespaces = [window, window.SnakeGame, window.cggl, window.nescc, window.nescg2];
        for (let ns of namespaces) {
            if (!ns) continue;

            // PlayerCameraController’ı ara
            let cameraController = deepSearch(ns, 'PlayerCameraController');
            if (cameraController) {
                try {
                    // Prototip üzerinden kamera bul
                    if (cameraController.prototype && cameraController.prototype.camera) {
                        window.pwzz.targetCamera = cameraController.prototype.camera;
                        window.pwzz.targetCamera.zoom = window.pwzz.desiredZoom; // Varsayılan zoom
                        log('PlayerCameraController zoom bulundu (prototip).');
                        overrideAct1(cameraController);
                        window.pwzz.isCameraFound = true;
                        return true;
                    }
                    // Instance tarama
                    for (let key in cameraController) {
                        if (cameraController[key] && cameraController[key].camera && typeof cameraController[key].camera.zoom === 'number') {
                            window.pwzz.targetCamera = cameraController[key].camera;
                            window.pwzz.cameraControllerInstance = cameraController[key];
                            window.pwzz.targetCamera.zoom = window.pwzz.desiredZoom; // Varsayılan zoom
                            log('PlayerCameraController instance zoom bulundu.');
                            overrideAct1(cameraController);
                            window.pwzz.isCameraFound = true;
                            return true;
                        }
                    }
                } catch (e) {
                    log('PlayerCameraController zoom hatası: ' + e);
                }
            }

            // Genel kamera nesnesi ara
            let camera = deepSearch(ns, 'camera');
            if (camera && typeof camera.zoom === 'number') {
                window.pwzz.targetCamera = camera;
                window.pwzz.targetCamera.zoom = window.pwzz.desiredZoom; // Varsayılan zoom
                log('Genel kamera nesnesi bulundu.');
                window.pwzz.isCameraFound = true;
                return true;
            }
        }

        log('Kamera nesnesi bulunamadı.');
        return false;
    }

    // act_1 fonksiyonunu override et (sunucu kontrolünü devre dışı bırak)
    function overrideAct1(cameraController) {
        try {
            // Prototip üzerinden override
            if (cameraController.prototype && cameraController.prototype.act_1) {
                cameraController.prototype.act_1 = function() {
                    if (this.camera) {
                        this.camera.zoom = window.pwzz.desiredZoom; // Dinamik zoom
                        const snakeView = this.gameView.getPlayerSnakeView();
                        if (snakeView && this.follow) {
                            this.camera.position_0.set_30(snakeView.getX_0(), snakeView.getY_0(), 0);
                        }
                        log('act_1 override (prototip): Zoom dinamik olarak ayarlandı.');
                    }
                };
                log('act_1 fonksiyonu (prototip) override edildi.');
            }

            // Instance üzerinden override
            if (window.pwzz.cameraControllerInstance && window.pwzz.cameraControllerInstance.act_1) {
                window.pwzz.cameraControllerInstance.act_1 = function() {
                    if (this.camera) {
                        this.camera.zoom = window.pwzz.desiredZoom; // Dinamik zoom
                        const snakeView = this.gameView.getPlayerSnakeView();
                        if (snakeView && this.follow) {
                            this.camera.position_0.set_30(snakeView.getX_0(), snakeView.getY_0(), 0);
                        }
                        log('act_1 override (instance): Zoom dinamik olarak ayarlandı.');
                    }
                };
                log('act_1 fonksiyonu (instance) override edildi.');
            }
        } catch (e) {
            log('act_1 override hatası: ' + e);
        }
    }

    // Zoom seviyesini her 5 ms’de bir sabitle (sunucu sıfırlamasına karşı)
    function keepZoomFixed() {
        if (window.pwzz.targetCamera) {
            const interval = setInterval(() => {
                if (window.pwzz.targetCamera.zoom !== window.pwzz.desiredZoom) {
                    window.pwzz.targetCamera.zoom = window.pwzz.desiredZoom;
                    log(`Zoom sıfırlanmaya çalışıldı, tekrar ${window.pwzz.desiredZoom}x’e sabitlendi.`);
                }
            }, 5); // 5 ms’de bir kontrol
            log('Sürekli zoom güncelleme aktif (5 ms).');
        }
    }

    // Havalı mod menüsü oluştur
    function createModMenu() {
        // Mevcut bir menü varsa kaldır
        const existingMenu = document.querySelector('.pwzz-menu');
        if (existingMenu) {
            existingMenu.remove();
            log('Eski mod menüsü kaldırıldı.');
        }

        // CSS stilleri
        const styles = `
            .pwzz-menu {
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #1e1e2f 0%, #2a2a4e 100%);
                border: 2px solid #00ffcc;
                border-radius: 15px;
                padding: 15px;
                box-shadow: 0 0 20px rgba(0, 255, 204, 0.5);
                z-index: 9999;
                font-family: 'Orbitron', sans-serif;
                color: #00ffcc;
                transition: all 0.3s ease;
            }
            .pwzz-menu h2 {
                margin: 0 0 10px 0;
                font-size: 24px;
                text-shadow: 0 0 10px #00ffcc;
                text-align: center;
            }
            .pwzz-menu label {
                display: block;
                margin-bottom: 5px;
                font-size: 14px;
                text-shadow: 0 0 5px #00ffcc;
            }
            .pwzz-menu input[type="range"] {
                width: 100%;
                -webkit-appearance: none;
                height: 8px;
                background: linear-gradient(90deg, #00ffcc 0%, #ff00cc 100%);
                border-radius: 5px;
                outline: none;
                box-shadow: 0 0 10px rgba(0, 255, 204, 0.5);
            }
            .pwzz-menu input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 20px;
                height: 20px;
                background: #1e1e2f;
                border: 2px solid #00ffcc;
                border-radius: 50%;
                cursor: pointer;
                box-shadow: 0 0 10px #00ffcc;
            }
            .pwzz-menu .zoom-value {
                text-align: center;
                margin-top: 5px;
                font-size: 12px;
                text-shadow: 0 0 5px #00ffcc;
            }
        `;

        // Stil elementini ekle
        const existingStyles = document.querySelector('style[pwzz-styles]');
        if (existingStyles) {
            existingStyles.remove();
        }
        const styleSheet = document.createElement('style');
        styleSheet.setAttribute('pwzz-styles', 'true');
        styleSheet.type = 'text/css';
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
        log('Mod menüsü stilleri eklendi.');

        // Google Fonts’tan Orbitron fontunu ekle
        const existingFont = document.querySelector('link[pwzz-font]');
        if (!existingFont) {
            const fontLink = document.createElement('link');
            fontLink.setAttribute('pwzz-font', 'true');
            fontLink.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap';
            fontLink.rel = 'stylesheet';
            document.head.appendChild(fontLink);
            log('Orbitron fontu eklendi.');
        }

        // Mod menüsü HTML’i
        const menu = document.createElement('div');
        menu.className = 'pwzz-menu';
        menu.innerHTML = `
            <h2>Pwzz Mod Menu</h2>
            <label>Zoom Seviyesi (1x - 5x)</label>
            <input type="range" id="zoomSlider" min="1" max="5" step="0.1" value="2">
            <div class="zoom-value">Zoom: 2x</div>
        `;
        document.body.appendChild(menu);
        log('Mod menüsü HTML’i eklendi.');

        // Slider olay dinleyicisi
        const zoomSlider = document.getElementById('zoomSlider');
        const zoomValueDisplay = menu.querySelector('.zoom-value');
        if (zoomSlider && zoomValueDisplay) {
            zoomSlider.addEventListener('input', (e) => {
                const zoomValue = parseFloat(e.target.value);
                window.pwzz.desiredZoom = zoomValue; // İstenen zoom değerini güncelle
                if (window.pwzz.targetCamera) {
                    window.pwzz.targetCamera.zoom = zoomValue;
                    log(`Zoom seviyesi slider ile değiştirildi: ${zoomValue}x`);
                }
                zoomValueDisplay.textContent = `Zoom: ${zoomValue}x`;
            });
            log('Zoom slider’ı aktif.');
        } else {
            log('Zoom slider veya zoom değeri elementi bulunamadı.');
        }
    }

    // Ana yürütme
    let attempts = 0;
    const maxAttempts = 30;
    const interval = setInterval(() => {
        attempts++;
        log(`Deneme ${attempts}/${maxAttempts}`);

        if (findCameraOnce()) {
            log('Zoom başarılı! Pwzz Mod Menüsü yükleniyor...');
            createModMenu();
            keepZoomFixed(); // Sürekli zoom güncellemesini başlat
            clearInterval(interval);
            return;
        }

        if (attempts >= maxAttempts) {
            log('Denemeler bitti, kamera nesnesi bulunamadı.');
            clearInterval(interval);
        }
    }, 500);
})();