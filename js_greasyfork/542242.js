// ==UserScript==
// @name         Project Bunnycloak
// @namespace    https://yourdomain.com
// @version      1.3 - Jet Black Stealth Mode
// @description  Removes location data from websites to help protect VTubers and streamers from doxxing, now with toggleable stealth UI and live redaction log.
// @author       Flatline
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542242/Project%20Bunnycloak.user.js
// @updateURL https://update.greasyfork.org/scripts/542242/Project%20Bunnycloak.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const locationWords = [
        "illinois", "california", "texas", "new york", "japan", "kyoto", "tokyo",
        "lat", "long", "latitude", "longitude", "IP", "ISP", "GeoIP", "timezone",
        "zip code", "area code", "your location", "based in", "gps", "hometown", "city of", "from"
    ];

    const settings = {
        watermarkMode: localStorage.getItem('bunnycloak-watermark-mode') || 'visible',
        logVisible: localStorage.getItem('bunnycloak-log-visible') === 'true'
    };

    function redactText(text) {
        let changed = false;
        locationWords.forEach(word => {
            const regex = new RegExp(`\\b${word}\\b`, 'gi');
            if (regex.test(text)) {
                logRedaction(word);
                text = text.replace(regex, '[REDACTED]');
                changed = true;
            }
        });
        return text;
    }

    function scrubNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const newText = redactText(node.textContent);
            if (newText !== node.textContent) node.textContent = newText;
        } else {
            node.childNodes.forEach(scrubNode);
        }
    }

    function scanPage() {
        scrubNode(document.body);
    }

    // MutationObserver
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    scrubNode(node);
                }
            });
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });
    setInterval(scanPage, 5000); // fallback

    // --- UI Elements ---
    function initUI() {
        const style = document.createElement('style');
        style.innerHTML = `
            #bunnycloak-watermark {
                position: fixed;
                bottom: 10px;
                right: 10px;
                background: rgba(20, 20, 20, 0.8);
                color: white;
                font-family: monospace;
                padding: 6px 12px;
                font-size: 12px;
                border-radius: 8px;
                z-index: 999999;
                pointer-events: none;
                transition: opacity 0.3s ease;
            }
            #bunnycloak-gear {
                position: fixed;
                bottom: 10px;
                right: 10px;
                width: 28px;
                height: 28px;
                font-size: 16px;
                background: #111;
                color: #ff69b4;
                border: 1px solid #333;
                border-radius: 50%;
                z-index: 1000000;
                cursor: pointer;
                text-align: center;
                line-height: 28px;
                font-weight: bold;
                font-family: monospace;
            }
            #bunnycloak-menu {
                position: fixed;
                bottom: 50px;
                right: 10px;
                background: #111;
                color: white;
                padding: 8px;
                font-size: 13px;
                border: 1px solid #444;
                border-radius: 6px;
                z-index: 999999;
                display: none;
                font-family: monospace;
            }
            #bunnycloak-log {
                position: fixed;
                bottom: 10px;
                left: 10px;
                background: rgba(0,0,0,0.8);
                color: white;
                max-height: 150px;
                overflow-y: auto;
                padding: 8px;
                font-size: 11px;
                font-family: monospace;
                border-radius: 6px;
                z-index: 999999;
                display: ${settings.logVisible ? 'block' : 'none'};
            }
        `;
        document.head.appendChild(style);

        const watermark = document.createElement('div');
        watermark.id = 'bunnycloak-watermark';
        watermark.innerText = '🐰 Cloaked by Flatline';
        document.body.appendChild(watermark);

        const gear = document.createElement('div');
        gear.id = 'bunnycloak-gear';
        gear.innerText = '⚙️';
        document.body.appendChild(gear);

        const menu = document.createElement('div');
        menu.id = 'bunnycloak-menu';
        menu.innerHTML = `
            <div><b>Bunnycloak Settings</b></div>
            <button id="toggle-watermark">Toggle Watermark</button><br/>
            <button id="toggle-log">Toggle Redaction Log</button>
        `;
        document.body.appendChild(menu);

        const log = document.createElement('div');
        log.id = 'bunnycloak-log';
        document.body.appendChild(log);

        applyWatermarkMode();

        // Event Listeners
        gear.addEventListener('click', () => {
            menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
        });

        document.getElementById('toggle-watermark').addEventListener('click', () => {
            toggleWatermark();
        });

        document.getElementById('toggle-log').addEventListener('click', () => {
            settings.logVisible = !settings.logVisible;
            localStorage.setItem('bunnycloak-log-visible', settings.logVisible);
            log.style.display = settings.logVisible ? 'block' : 'none';
        });
    }

    function toggleWatermark() {
        const modes = ['visible', 'transparent', 'hidden'];
        const currentIndex = modes.indexOf(settings.watermarkMode);
        settings.watermarkMode = modes[(currentIndex + 1) % modes.length];
        localStorage.setItem('bunnycloak-watermark-mode', settings.watermarkMode);
        applyWatermarkMode();
    }

    function applyWatermarkMode() {
        const watermark = document.getElementById('bunnycloak-watermark');
        if (!watermark) return;

        if (settings.watermarkMode === 'visible') {
            watermark.style.opacity = '1';
            watermark.style.display = 'block';
        } else if (settings.watermarkMode === 'transparent') {
            watermark.style.opacity = '0.1';
            watermark.style.display = 'block';
        } else if (settings.watermarkMode === 'hidden') {
            watermark.style.display = 'none';
        }
    }

    function logRedaction(word) {
        if (!settings.logVisible) return;
        const log = document.getElementById('bunnycloak-log');
        if (log) {
            const line = document.createElement('div');
            line.textContent = `Redacted: "${word}"`;
            log.appendChild(line);
            if (log.children.length > 20) {
                log.removeChild(log.children[0]);
            }
        }
    }

    // --- INIT ---
    window.addEventListener('load', () => {
        scanPage();
        initUI();
    });

})();