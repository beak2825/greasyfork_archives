// ==UserScript==
// @name         FIX IT Panel- themes and pop-up blocker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  pop-up blocker and 3 different themes for any website
// @author       Abhiyanshu priyadrshi
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540203/FIX%20IT%20Panel-%20themes%20and%20pop-up%20blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/540203/FIX%20IT%20Panel-%20themes%20and%20pop-up%20blocker.meta.js
// ==/UserScript==

/*
MIT License

Copyright (c) [2025] [Abhiyanshu priyadrshi]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function () {
    'use strict';

    const isEnabled = key => localStorage.getItem(key) !== 'false';
    const setEnabled = (key, value) => localStorage.setItem(key, value);

    const themes = {
        dark: {
            name: 'Dark',
            css: `* { background-color: #111 !important; color: #eee !important; border-color: #333 !important; transition: all 0.7s ease !important; }`
        },
        grey: {
            name: 'Grey',
            css: `* { background-color: #2a2f36 !important; color: #e0e0e0 !important; border-color: #444 !important; transition: all 0.7s ease !important; }`
        },
        white: {
            name: 'White',
            css: `* { background-color: #fff !important; color: #111 !important; border-color: #ccc !important; transition: all 0.7s ease !important; }`
        }
    };

    let currentTheme = localStorage.getItem('customTheme') || 'dark';
    const styleTag = document.createElement('style');
    styleTag.id = 'theme-style';
    document.head.appendChild(styleTag);

    const applyTheme = (theme) => {
        overlay.style.opacity = 1;
        setTimeout(() => {
            styleTag.textContent = themes[theme].css;
            localStorage.setItem('customTheme', theme);
            setTimeout(() => overlay.style.opacity = 0, 500);
        }, 300);
    };

    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        background: 'rgba(0,0,0,0.6)', zIndex: '99997', pointerEvents: 'none',
        transition: 'opacity 0.5s ease', opacity: 0, display: 'flex',
        alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: '#fff', fontFamily: 'monospace'
    });
    overlay.innerText = '🌗 Applying Theme...';
    document.body.appendChild(overlay);

    let popupBlockedCount = 0;
    const popupBlockerEnabled = () => isEnabled('popupBlocker');

    const tryBlockPopups = () => {
        if (!popupBlockerEnabled()) return;
        const elements = document.querySelectorAll('[id*="popup"], [class*="popup"], [id*="cookie"], [class*="cookie"], [id*="consent"], [class*="consent"], .modal, .overlay, .backdrop');
        elements.forEach(el => {
            el.remove();
            popupBlockedCount++;
            updatePopupCounter();
        });
        document.querySelectorAll('button, a').forEach(el => {
            if (/accept|agree|close|allow/i.test(el.textContent)) {
                try {
                    el.click();
                    popupBlockedCount++;
                    updatePopupCounter();
                } catch {}
            }
        });
    };
    setInterval(tryBlockPopups, 2000);

    const popupCounter = document.createElement('div');
    popupCounter.textContent = `🛡️ Blocked: 0`;
    Object.assign(popupCounter.style, {
        position: 'fixed', bottom: '100px', right: '20px',
        background: '#000', color: '#fff', padding: '5px 12px',
        borderRadius: '12px', fontSize: '13px', fontFamily: 'monospace',
        zIndex: 99999, boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
        transition: 'transform 0.3s ease, opacity 0.3s ease'
    });
    const updatePopupCounter = () => {
        popupCounter.textContent = `🛡️ Blocked: ${popupBlockedCount}`;
        popupCounter.style.transform = 'scale(1.15)';
        setTimeout(() => popupCounter.style.transform = 'scale(1)', 300);
    };
    document.body.appendChild(popupCounter);

    const panel = document.createElement('div');
    panel.id = 'fixit-panel';
    panel.innerHTML = `
        <h4 style="margin:0 0 10px">🛠️ Fix It Panel</h4>
        <label style="display:flex;align-items:center;margin-bottom:6px">
            <span style="margin-right:6px">🔐</span>
            <input type="checkbox" id="toggle-popup"> Popup Blocker
        </label>
        <label style="display:flex;align-items:center;margin-bottom:6px">
            Theme:
            <button id="theme-btn" style="margin-left:10px">🌙</button>
        </label>
        <button id="hide-panel">🙈 Hide Panel</button>
    `;
    Object.assign(panel.style, {
        position: 'fixed', bottom: '20px', right: '20px', background: '#222',
        color: '#fff', padding: '14px', borderRadius: '16px', fontSize: '13px',
        fontFamily: 'Segoe UI', zIndex: 99998,
        boxShadow: '0 0 20px rgba(0,0,0,0.7)', border: '4px solid #888',
        minWidth: '210px', textAlign: 'left', cursor: 'move'
    });
    document.body.appendChild(panel);

    let offsetX = 0, offsetY = 0, isDragging = false;
    panel.addEventListener('mousedown', e => {
        isDragging = true;
        offsetX = e.clientX - panel.getBoundingClientRect().left;
        offsetY = e.clientY - panel.getBoundingClientRect().top;
    });
    document.addEventListener('mousemove', e => {
        if (!isDragging) return;
        panel.style.left = (e.clientX - offsetX) + 'px';
        panel.style.top = (e.clientY - offsetY) + 'px';
        panel.style.bottom = 'unset';
        panel.style.right = 'unset';
    });
    document.addEventListener('mouseup', () => isDragging = false);

    document.getElementById('toggle-popup').checked = popupBlockerEnabled();
    document.getElementById('toggle-popup').onchange = e => {
        setEnabled('popupBlocker', e.target.checked);
    };

    const themeCycle = ['dark', 'grey', 'white'];
    let themeIndex = themeCycle.indexOf(currentTheme);
    const themeBtn = document.getElementById('theme-btn');
    themeBtn.onclick = () => {
        themeIndex = (themeIndex + 1) % themeCycle.length;
        currentTheme = themeCycle[themeIndex];
        applyTheme(currentTheme);
        themeBtn.textContent = currentTheme === 'dark' ? '🌙' : currentTheme === 'white' ? '☀️' : '🌀';
    };
    themeBtn.textContent = currentTheme === 'dark' ? '🌙' : currentTheme === 'white' ? '☀️' : '🌀';

    document.getElementById('hide-panel').onclick = () => {
        panel.style.display = 'none';
        popupCounter.style.display = 'none';
    };

    window.addEventListener('load', () => {
        setTimeout(() => applyTheme(currentTheme), 500);
    });
})();
