// ==UserScript==
// @name         Dinzer Lite
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Protect Your Website!
// @author       ChessDevx
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/530449/Dinzer%20Lite.user.js
// @updateURL https://update.greasyfork.org/scripts/530449/Dinzer%20Lite.meta.js
// ==/UserScript==

(function() {
    'use strict';
 
    const settings = {
        adBlocker: GM_getValue('adBlocker', true),
        popupBlocker: GM_getValue('popupBlocker', true),
        darkMode: GM_getValue('darkMode', false),
        speedBoost: GM_getValue('speedBoost', true)
    };
 
    function saveSettings() {
        for (const key in settings) {
            GM_setValue(key, settings[key]);
        }
    }
 
    function blockAds() {
        if (!settings.adBlocker) return;
 
        const adSelectors = [
            'div[id*="banner"]',
            'div[id*="ad-"]',
            'div[class*="ad-"]',
            'div[class*="ads"]',
            'div[id*="ads"]',
            'iframe[src*="doubleclick"]',
            'iframe[src*="ads"]',
            '.adsbygoogle',
            'div[class*="sponsor"]',
            'div[id*="sponsor"]',
            'div[class*="promoted"]',
            'div[id*="promoted"]',
            'div[class*="advertisement"]',
            'div[id*="advertisement"]',
            'iframe[src*="adservice"]',
            'iframe[src*="googlesyndication"]',
            'iframe[src*="popads"]',
            'div[class*="popup-ad"]',
            'div[class*="ad-container"]',
            'div[class*="ad-slot"]',
            'div[class*="ad-placeholder"]',
            'div[id*="ad-container"]',
            'div[id*="ad-slot"]',
            'div[id*="ad-placeholder"]',
            'div[class*="sponsored-content"]',
            'div[id*="sponsored-content"]',
            'div[class*="google-ad"]',
            'div[id*="google-ad"]',
            'iframe[src*="adtech"]',
            'iframe[src*="adserver"]',
            'div[class*="video-ad"]',
            'div[id*="video-ad"]',
            'div[class*="overlay-ad"]',
            'div[id*="overlay-ad"]'
        ];
 
        function hideAds() {
            adSelectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    el.style.display = 'none';
                });
            });
        }
 
        hideAds();
 
        const observer = new MutationObserver(hideAds);
        observer.observe(document.body, { childList: true, subtree: true });
    }
 
    function blockPopups() {
        if (!settings.popupBlocker) return;
 
        const originalOpen = window.open;
        window.open = function() {
            if (arguments[1] && arguments[1].includes('_blank')) {
                arguments[1] = '_self';
            }
            return originalOpen.apply(this, arguments);
        };
 
        function processLinks() {
            document.querySelectorAll('a[target="_blank"]').forEach(link => {
                link.setAttribute('target', '_self');
            });
        }
 
        processLinks();
        const observer = new MutationObserver(processLinks);
        observer.observe(document.body, { childList: true, subtree: true });
    }
 
    function applyDarkMode() {
        if (!settings.darkMode) {
            if (document.getElementById('webProtectorDarkMode')) {
                document.getElementById('webProtectorDarkMode').disabled = true;
            }
            return;
        }
 
        const darkModeCSS = `
            html {
                filter: invert(90%) hue-rotate(180deg) !important;
                background: #fefefe !important;
            }
            
            img, video, canvas, picture, svg, [style*="background-image"] {
                filter: invert(100%) hue-rotate(180deg) !important;
            }
            
            [style*="background-color"], [style*="background:#"], [style*="background: #"] {
                filter: invert(100%) hue-rotate(180deg) !important;
            }
            
            :root {
                --darkreader-neutral-background: #d4cec9 !important;
                --darkreader-neutral-text: #121010 !important;
                --darkreader-selection-background: #88d8f8 !important;
                --darkreader-selection-text: #000 !important;
            }
            
            ::selection {
                background-color: var(--darkreader-selection-background) !important;
                color: var(--darkreader-selection-text) !important;
            }
            
            input, textarea, select, button {
                background-color: #333 !important;
                color: #eee !important;
                border-color: #666 !important;
                filter: invert(100%) hue-rotate(180deg) !important;
            }
            
            iframe {
                filter: invert(100%) hue-rotate(180deg) brightness(0.8) !important;
            }
            
            * {
                text-shadow: none !important;
                box-shadow: none !important;
            }
            
            pre, code, pre *, code * {
                filter: invert(100%) hue-rotate(180deg) !important;
                background-color: #222 !important;
                color: #eee !important;
            }
            
            #webProtectorUI, #webProtectorUI * {
                filter: invert(100%) hue-rotate(180deg) !important;
            }
        `;
 
        if (!document.getElementById('webProtectorDarkMode')) {
            const style = document.createElement('style');
            style.id = 'webProtectorDarkMode';
            style.textContent = darkModeCSS;
            document.head.appendChild(style);
        } else {
            document.getElementById('webProtectorDarkMode').disabled = false;
        }
    }
 
    function applySpeedBoost() {
        if (!settings.speedBoost) return;
        
        document.querySelectorAll('img').forEach(img => {
            if (img.loading === 'lazy' && isElementInViewport(img)) {
                img.loading = 'eager';
            }
 
            if (img.getAttribute('data-src') && isElementInViewport(img)) {
                img.src = img.getAttribute('data-src');
            }
        });
 
        document.querySelectorAll('iframe:not([src*="youtube"]):not([src*="vimeo"])').forEach(iframe => {
            if (!isElementInViewport(iframe)) {
                iframe.setAttribute('data-src', iframe.src);
                iframe.removeAttribute('src');
            }
        });
        
        // Add preconnect for common domains
        const commonDomains = ['www.google-analytics.com', 'fonts.googleapis.com', 'fonts.gstatic.com'];
        commonDomains.forEach(domain => {
            if (document.querySelector(`link[href*="${domain}"]`)) {
                const link = document.createElement('link');
                link.rel = 'preconnect';
                link.href = `https://${domain}`;
                document.head.appendChild(link);
            }
        });
    }
 
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
 
    function createUI() {
        const container = document.createElement('div');
        container.id = 'webProtectorUI';
 
        GM_addStyle(`
            #webProtectorUI {
                position: fixed;
                left: 20px;
                bottom: 20px;
                background: rgba(40, 44, 52, 0.9);
                color: white;
                padding: 10px;
                border-radius: 8px;
                font-family: Arial, sans-serif;
                z-index: 9999999;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
                width: 200px;
                transition: all 0.3s ease;
                font-size: 14px;
            }
 
            #webProtectorUI.collapsed {
                width: auto;
                height: auto;
            }
 
            #webProtectorUI .header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
                cursor: move;
            }
 
            #webProtectorUI .toggle-btn {
                cursor: pointer;
                user-select: none;
            }
 
            #webProtectorUI .options {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
 
            #webProtectorUI .option {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
 
            #webProtectorUI .switch {
                position: relative;
                display: inline-block;
                width: 40px;
                height: 20px;
            }
 
            #webProtectorUI .switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }
 
            #webProtectorUI .slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #ccc;
                transition: .3s;
                border-radius: 20px;
            }
 
            #webProtectorUI .slider:before {
                position: absolute;
                content: "";
                height: 16px;
                width: 16px;
                left: 2px;
                bottom: 2px;
                background-color: white;
                transition: .3s;
                border-radius: 50%;
            }
 
            #webProtectorUI input:checked + .slider {
                background-color: #4cd964;
            }
 
            #webProtectorUI input:checked + .slider:before {
                transform: translateX(20px);
            }
        `);
 
        container.innerHTML = `
            <div class="header">
                <span>Web Protector</span>
                <span class="toggle-btn">➖</span>
            </div>
            <div class="options">
                <div class="option">
                    <span>Ad Blocker</span>
                    <label class="switch">
                        <input type="checkbox" id="adBlocker" ${settings.adBlocker ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="option">
                    <span>Popup Blocker</span>
                    <label class="switch">
                        <input type="checkbox" id="popupBlocker" ${settings.popupBlocker ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="option">
                    <span>Dark Mode</span>
                    <label class="switch">
                        <input type="checkbox" id="darkMode" ${settings.darkMode ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="option">
                    <span>Speed Boost</span>
                    <label class="switch">
                        <input type="checkbox" id="speedBoost" ${settings.speedBoost ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                </div>
            </div>
        `;
 
        document.body.appendChild(container);
 
        const toggleBtn = container.querySelector('.toggle-btn');
        const options = container.querySelector('.options');
        let isCollapsed = false;
 
        toggleBtn.addEventListener('click', () => {
            isCollapsed = !isCollapsed;
            if (isCollapsed) {
                options.style.display = 'none';
                toggleBtn.textContent = '➕';
                container.classList.add('collapsed');
            } else {
                options.style.display = 'flex';
                toggleBtn.textContent = '➖';
                container.classList.remove('collapsed');
            }
        });
 
        container.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                settings[this.id] = this.checked;
                saveSettings();
 
                if (this.id === 'adBlocker') blockAds();
                if (this.id === 'popupBlocker') blockPopups();
                if (this.id === 'darkMode') applyDarkMode();
                if (this.id === 'speedBoost') applySpeedBoost();
            });
        });
 
        makeElementDraggable(container, container.querySelector('.header'));
    }
 
    function makeElementDraggable(element, handle) {
        let isDragging = false;
        let offsetX, offsetY;
 
        handle.addEventListener('mousedown', function(e) {
            isDragging = true;
            offsetX = e.clientX - element.getBoundingClientRect().left;
            offsetY = e.clientY - element.getBoundingClientRect().top;
            e.preventDefault();
        });
 
        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
 
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
 
            const maxX = window.innerWidth - element.offsetWidth;
            const maxY = window.innerHeight - element.offsetHeight;
 
            element.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
            element.style.top = Math.max(0, Math.min(y, maxY)) + 'px';
            element.style.bottom = 'auto';
        });
 
        document.addEventListener('mouseup', function() {
            isDragging = false;
        });
    }
 
    function initialize() {
        setTimeout(() => {
            blockAds();
            blockPopups();
            applyDarkMode();
            applySpeedBoost();
            createUI();
        }, 100);
    }
 
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();