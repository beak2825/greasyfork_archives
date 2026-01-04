// ==UserScript==
// @name         Useless Things Series: Color Finder
// @version      2.0
// @description  Enhanced color finder with eyedropper tool and color format display (RGB, HSL, HEX)
// @match        *://*/*
// @grant        none
// @license      MIT
// @namespace    https://greasyfork.org/users/1126616
// @run-at       document-idle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/486815/Useless%20Things%20Series%3A%20Color%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/486815/Useless%20Things%20Series%3A%20Color%20Finder.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    var container = null;
    var colorPicker = null;
    var colorDisplay = null;
    var hexValue = null;
    var rgbValue = null;
    var hslValue = null;
    var isVisible = false;

    // Create main container
    container = document.createElement('div');
    container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 20px;
        border-radius: 16px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        z-index: 99999;
        display: none;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        min-width: 280px;
        backdrop-filter: blur(10px);
    `;

    // Title
    var title = document.createElement('div');
    title.textContent = 'Color Finder';
    title.style.cssText = `
        color: white;
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 16px;
        text-align: center;
        text-shadow: 0 2px 4px rgba(0,0,0,0.2);
    `;
    container.appendChild(title);

    // Color picker wrapper
    var pickerWrapper = document.createElement('div');
    pickerWrapper.style.cssText = `
        background: white;
        padding: 12px;
        border-radius: 12px;
        margin-bottom: 16px;
    `;

    colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    colorPicker.value = '#667eea';
    colorPicker.style.cssText = `
        width: 100%;
        height: 80px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
    `;
    pickerWrapper.appendChild(colorPicker);
    container.appendChild(pickerWrapper);

    // Color display area
    colorDisplay = document.createElement('div');
    colorDisplay.style.cssText = `
        background: white;
        padding: 16px;
        border-radius: 12px;
        margin-bottom: 12px;
    `;

    // HEX value
    hexValue = document.createElement('div');
    hexValue.style.cssText = `
        margin-bottom: 8px;
        padding: 8px;
        background: #f7fafc;
        border-radius: 6px;
        font-size: 14px;
        color: #2d3748;
        font-weight: 500;
        cursor: pointer;
        transition: background 0.2s;
    `;
    hexValue.innerHTML = '<strong>HEX:</strong> <span>#667eea</span>';
    hexValue.onclick = function() { copyToClipboard(this.querySelector('span').textContent); };
    hexValue.onmouseenter = function() { this.style.background = '#e2e8f0'; };
    hexValue.onmouseleave = function() { this.style.background = '#f7fafc'; };
    colorDisplay.appendChild(hexValue);

    // RGB value
    rgbValue = document.createElement('div');
    rgbValue.style.cssText = hexValue.style.cssText;
    rgbValue.innerHTML = '<strong>RGB:</strong> <span>rgb(102, 126, 234)</span>';
    rgbValue.onclick = function() { copyToClipboard(this.querySelector('span').textContent); };
    rgbValue.onmouseenter = function() { this.style.background = '#e2e8f0'; };
    rgbValue.onmouseleave = function() { this.style.background = '#f7fafc'; };
    colorDisplay.appendChild(rgbValue);

    // HSL value
    hslValue = document.createElement('div');
    hslValue.style.cssText = hexValue.style.cssText;
    hslValue.innerHTML = '<strong>HSL:</strong> <span>hsl(231, 77%, 66%)</span>';
    hslValue.onclick = function() { copyToClipboard(this.querySelector('span').textContent); };
    hslValue.onmouseenter = function() { this.style.background = '#e2e8f0'; };
    hslValue.onmouseleave = function() { this.style.background = '#f7fafc'; };
    colorDisplay.appendChild(hslValue);

    container.appendChild(colorDisplay);

    // Close button
    var closeBtn = document.createElement('button');
    closeBtn.textContent = '✕ Close';
    closeBtn.style.cssText = `
        width: 100%;
        padding: 10px;
        background: rgba(255, 255, 255, 0.2);
        color: white;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 8px;
        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s;
    `;
    closeBtn.onmouseenter = function() { 
        this.style.background = 'rgba(255, 255, 255, 0.3)';
        this.style.transform = 'scale(1.02)';
    };
    closeBtn.onmouseleave = function() { 
        this.style.background = 'rgba(255, 255, 255, 0.2)';
        this.style.transform = 'scale(1)';
    };
    closeBtn.onclick = function() { toggleContainer(); };
    container.appendChild(closeBtn);

    document.body.appendChild(container);

    // Color picker change event
    colorPicker.addEventListener('input', function() {
        updateColorValues(this.value);
    });

    // Keyboard shortcut
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.key === '.') {
            event.preventDefault();
            event.stopPropagation();
            toggleContainer();
        }
    }, true);

    function toggleContainer() {
        if (isVisible) {
            container.style.display = 'none';
            isVisible = false;
        } else {
            container.style.display = 'block';
            isVisible = true;
        }
    }

    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    function rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                case g: h = ((b - r) / d + 2) / 6; break;
                case b: h = ((r - g) / d + 4) / 6; break;
            }
        }

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    }

    function updateColorValues(hex) {
        var rgb = hexToRgb(hex);
        var hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

        hexValue.querySelector('span').textContent = hex.toUpperCase();
        rgbValue.querySelector('span').textContent = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        hslValue.querySelector('span').textContent = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
    }

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(function() {
            showNotification('Copied: ' + text);
        });
    }

    function showNotification(message) {
        var notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #48bb78;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 999999;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            font-size: 14px;
            font-weight: 500;
        `;
        document.body.appendChild(notification);
        setTimeout(function() {
            notification.remove();
        }, 2000);
    }

})();

