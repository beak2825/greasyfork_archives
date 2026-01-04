// ==UserScript==
// @name         Google Earth Web Compass
// @name:tr      Google Earth Web Pusula
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Google Earth Compass
// @description:tr Google Earth Compass
// @author       davidoff26
// @match        https://earth.google.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523583/Google%20Earth%20Web%20Compass.user.js
// @updateURL https://update.greasyfork.org/scripts/523583/Google%20Earth%20Web%20Compass.meta.js
// ==/UserScript==

/* MIT License
 * 
 * Copyright (c) 2025 davidoff26
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

(function() {
    'use strict';

    // Pusula elementini oluştur
    function createCompass() {
        const compass = document.createElement('div');
        compass.id = 'ge-compass';
        compass.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 120px;
            height: 120px;
            background: rgba(0, 0, 0, 0.7);
            border-radius: 50%;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: Arial, sans-serif;
            z-index: 9999;
            cursor: move;
            user-select: none;
            transition: background 0.3s;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
        `;

        // Hover efekti
        compass.addEventListener('mouseenter', () => {
            compass.style.background = 'rgba(0, 0, 0, 0.8)';
        });
        compass.addEventListener('mouseleave', () => {
            compass.style.background = 'rgba(0, 0, 0, 0.7)';
        });

        // Dış çember (yön harfleri için)
        const outerRing = document.createElement('div');
        outerRing.style.cssText = `
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50%;
        `;

        // Yön harflerinin pozisyonlarını ve stillerini ayarla
        const directions = [
            { text: 'N', top: '8px', left: '50%', translateX: '-50%', translateY: '0' },
            { text: 'E', top: '50%', right: '8px', translateX: '0', translateY: '-50%' },
            { text: 'S', bottom: '8px', left: '50%', translateX: '-50%', translateY: '0' },
            { text: 'W', top: '50%', left: '8px', translateX: '0', translateY: '-50%' }
        ];

        directions.forEach(dir => {
            const direction = document.createElement('div');
            direction.textContent = dir.text;
            direction.style.cssText = `
                position: absolute;
                font-size: 14px;
                font-weight: bold;
                transform: translate(${dir.translateX}, ${dir.translateY});
                color: white;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
            `;

            // Pozisyonları ayarla
            if (dir.top) direction.style.top = dir.top;
            if (dir.bottom) direction.style.bottom = dir.bottom;
            if (dir.left) direction.style.left = dir.left;
            if (dir.right) direction.style.right = dir.right;

            outerRing.appendChild(direction);
        });

        // İbre - KIRMIZI-BEYAZ OLARAK DÜZELTİLDİ
        const needleContainer = document.createElement('div');
        needleContainer.id = 'ge-compass-needle-container';
        needleContainer.style.cssText = `
            position: absolute;
            width: 4px;
            height: 50px;
            transform-origin: bottom center;
            top: 15px;
            transition: transform 0.3s ease-out;
        `;

        // Kırmızı üst kısım (Kuzey)
        const redPart = document.createElement('div');
        redPart.style.cssText = `
            width: 100%;
            height: 50%;
            background-color: red;
        `;

        // Beyaz alt kısım (Güney)
        const whitePart = document.createElement('div');
        whitePart.style.cssText = `
            width: 100%;
            height: 50%;
            background-color: white;
        `;

        needleContainer.appendChild(redPart);
        needleContainer.appendChild(whitePart);

        // Derece göstergesi
        const degree = document.createElement('div');
        degree.id = 'ge-compass-degree';
        degree.style.cssText = `
            position: absolute;
            bottom: 35px;
            font-size: 16px;
            font-weight: bold;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
            background: rgba(0, 0, 0, 0.5);
            padding: 2px 6px;
            border-radius: 10px;
            transform: translateX(-50%);
            left: 50%;
        `;
        degree.textContent = '0°';

        compass.appendChild(outerRing);
        compass.appendChild(needleContainer);
        compass.appendChild(degree);
        document.body.appendChild(compass);

        // Sürüklenebilirlik için gerekli değişkenler
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;

        // Sürükleme fonksiyonları
        compass.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        function dragStart(e) {
            initialX = e.clientX - compass.offsetLeft;
            initialY = e.clientY - compass.offsetTop;
            isDragging = true;
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;

                // Ekran sınırları içinde tutma
                const maxX = window.innerWidth - compass.offsetWidth;
                const maxY = window.innerHeight - compass.offsetHeight;

                currentX = Math.max(0, Math.min(currentX, maxX));
                currentY = Math.max(0, Math.min(currentY, maxY));

                compass.style.left = currentX + 'px';
                compass.style.top = currentY + 'px';
                compass.style.right = 'auto';
                compass.style.bottom = 'auto';
            }
        }

        function dragEnd() {
            isDragging = false;
        }

        return {
            needle: needleContainer,
            degree,
            compass
        };
    }

    // URL'den açı değerini çıkar
    function extractAngleFromUrl(url) {
        // h parametresini yakala (derece cinsinden heading)
        const match = url.match(/([-]?\d+\.?\d*)h/);
        if (!match) return 0;
        
        let degrees = parseFloat(match[1]);
        
        // 0-360 aralığına normalize et
        degrees = degrees % 360;
        if (degrees < 0) degrees += 360;
        
        return degrees;
    }

    // Kamera açısını izle ve pusulayı güncelle
    function watchCameraAngle() {
        const { needle, degree, compass } = createCompass();
        let lastAngle = 0;

        // URL değişikliklerini izle
        let lastUrl = '';

        // İlk yükleme
        updateCompass();

        setInterval(() => {
            const currentUrl = window.location.href;
            if (currentUrl !== lastUrl) {
                lastUrl = currentUrl;
                updateCompass();
            }
        }, 100);

        // History API'sini dinle
        const pushState = history.pushState;
        history.pushState = function() {
            pushState.apply(history, arguments);
            updateCompass();
        };

        // PopState eventi için listener ekle
        window.addEventListener('popstate', updateCompass);

        function updateCompass() {
            const newAngle = extractAngleFromUrl(window.location.href);
            
            // Açı değişimini en kısa yoldan yap
            let angleDiff = newAngle - lastAngle;
            if (Math.abs(angleDiff) > 180) {
                angleDiff = angleDiff > 0 ? angleDiff - 360 : angleDiff + 360;
            }
            lastAngle = newAngle;

            // Pusula iğnesini döndür
            needle.style.transform = `rotate(${newAngle}deg)`;
            
            // Dereceyi güncelle - ondalık hassasiyet 2 basamak
            const displayAngle = newAngle.toFixed(2);
            degree.textContent = `${displayAngle}°`;
        }
    }

    // Sayfanın tam olarak yüklenmesini bekle
    window.addEventListener('load', () => {
        // Biraz gecikme ekle, uygulamanın tam olarak yüklenmesi için
        setTimeout(watchCameraAngle, 2000);
    });
    
    // Google Earth'ün asenkron yüklenme durumları için ek bir kontrol
    if (document.readyState === 'complete') {
        setTimeout(watchCameraAngle, 2000);
    }
})();