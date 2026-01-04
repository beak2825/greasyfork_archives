// ==UserScript==
// @name         Openguessr Location Hack (WORKING 2025)
// @namespace    https://openguessr.com/
// @version      17.2
// @description  𝕺𝖕𝖊𝖓𝖘 𝖆𝖓𝖉 𝕮𝖑𝖔𝖘𝖊 𝖜𝖎𝖙𝖍 "𝖎𝖓𝖘𝖊𝖗𝖙". 𝖎𝖋 𝖙𝖍𝖊 𝖑𝖔𝖈𝖆𝖙𝖎𝖔𝖓 𝖈𝖍𝖆𝖓𝖌𝖊 𝖎𝖙 𝖜𝖎𝖑𝖑 𝖚𝖕𝖉𝖆𝖙𝖊 𝖆𝖚𝖙𝖔𝖒𝖆𝖙𝖎𝖈𝖆𝖑𝖑𝖞
// @author       Kakoncheater
// @license      MIT
// @match        https://openguessr.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/529484/Openguessr%20Location%20Hack%20%28WORKING%202025%29.user.js
// @updateURL https://update.greasyfork.org/scripts/529484/Openguessr%20Location%20Hack%20%28WORKING%202025%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    GM_log('OpenGuessr loaded. Hotkey: Insert. have fun');

    const settingsIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41h-3.84c-0.24,0-0.44,0.17-0.48,0.41L9.12,4.84C8.53,5.08,8,5.4,7.5,5.78L5.11,4.82c-0.22-0.08-0.47,0-0.59,0.22L2.6,8.36c-0.11,0.2-0.06,0.47,0.12,0.61l2.03,1.58C4.72,11.36,4.7,11.68,4.7,12s0.02,0.64,0.07,0.94l-2.03,1.58c-0.18,0.14,0.23-0.41,0.12-0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.48,2.03c0.04,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.48-0.41l0.48-2.03c0.59-0.24,1.12-0.56,1.62-0.94l2.39,0.96c0.22,0.08,0.47,0-0.59-0.22l1.92-3.32c0.11-0.2,0.06-0.47-0.12-0.61L19.14,12.94zM12,15.6c-1.98,0-3.6-1.62-3.6-3.6s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/></svg>`;

    GM_addStyle(`
        :root {
            --og-bg-color: rgba(255, 255, 255, 0.95); --og-header-bg-color-glass: rgba(255, 255, 255, 0.5); --og-popup-bg-color-glass: rgba(240, 240, 240, 0.7);
            --og-text-color: #121212; --og-border-color: rgba(0, 0, 0, 0.1); --og-shadow-color: rgba(0, 0, 0, 0.2);
            --og-accent-color: #a100c2; --og-button-close-bg: #e74c3c; --og-font: 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif;
        }
        .og-dark-mode, .og-dark-mode #og-settings-popup {
            --og-bg-color: rgba(30, 30, 30, 0.95); --og-header-bg-color-glass: rgba(44, 47, 51, 0.5); --og-popup-bg-color-glass: rgba(54, 57, 63, 0.7);
            --og-text-color: #f0f0f0; --og-border-color: rgba(255, 255, 255, 0.1); --og-shadow-color: rgba(0, 0, 0, 0.5); --og-button-close-bg: #c0392b;
        }

        @keyframes og-animated-gradient { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes og-glow { from { text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px var(--og-accent-color), 0 0 20px var(--og-accent-color); } to { text-shadow: 0 0 10px #fff, 0 0 20px #e0aaff, 0 0 30px #e0aaff; } }
        #og-startup-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: linear-gradient(-45deg, #121212, #1c0f20, #0f1a20, #121212); background-size: 400% 400%; animation: og-animated-gradient 15s ease infinite; z-index: 99999; opacity: 0; transition: opacity 0.5s ease; pointer-events: none; }
        #og-startup-text { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); display: flex; z-index: 100000; opacity: 0; transition: opacity 0.5s ease-out; pointer-events: none; text-align: center; }
        #og-startup-text > span { display: inline-block; font-size: 2em; font-weight: bold; color: #fff; opacity: 0; transform: scale(0.5); transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        #og-startup-text.visible > span { opacity: 1; transform: scale(1); animation: og-glow 1.5s infinite alternate ease-in-out; }

        #og-container { position: fixed; bottom: 20px; left: 20px; width: 600px; height: 400px; display: none; flex-direction: column; background-color: var(--og-bg-color); border: 1px solid var(--og-border-color); box-shadow: 0 8px 32px 0 var(--og-shadow-color); z-index: 10000; border-radius: 12px; overflow: hidden; font-family: var(--og-font); opacity: 0; transform: scale(0.98) translateY(10px); transition: opacity 0.3s ease, transform 0.3s ease; }
        #og-container.visible { opacity: 1; transform: scale(1) translateY(0); }
        .og-header { height: 40px; background-color: var(--og-header-bg-color-glass); -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px); padding: 0 15px; cursor: grab; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--og-border-color); flex-shrink: 0; }
        .og-header span { color: var(--og-text-color); font-weight: 600; font-size: 0.9em; }
        .og-controls { display: flex; align-items: center; }
        .og-close-btn { background: var(--og-button-close-bg); color: white; border: none; width: 28px; height: 28px; border-radius: 50%; cursor: pointer; font-weight: bold; line-height: 28px; text-align: center; transition: all 0.2s; order: 2; }
        .og-settings-btn { width: 28px; height: 28px; cursor: pointer; border-radius: 50%; background-color: var(--og-accent-color); background-image: url("data:image/svg+xml,${encodeURIComponent(settingsIconSvg)}"); background-size: 18px; background-position: center; background-repeat: no-repeat; border: none; transition: transform 0.4s ease, filter 0.2s; margin-right: 10px; order: 1; }
        .og-iframe { flex-grow: 1; width: 100%; border: none; }
        #og-settings-popup { position: fixed; display: none; width: 280px; z-index: 10001; background-color: var(--og-popup-bg-color-glass); -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px); border: 1px solid var(--og-border-color); border-radius: 10px; padding: 15px; box-shadow: 0 4px 20px rgba(0,0,0,0.25); color: var(--og-text-color); font-family: var(--og-font); opacity: 0; transform: translateX(-20px); transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1); }
        #og-settings-popup.active { opacity: 1; transform: translateX(0); }
    `);

    let ogContainer, ogSettingsPopup, currentLocation;
    let isDragging = false, dragOffsetX = 0, dragOffsetY = 0, isResizing = false;

    const getMapUrl = (loc) => `https://maps.google.com/maps?q=${loc}&ll=${loc}&t=m&z=3&output=embed`;
    const extractLocation = () => { try { for (const f of document.querySelectorAll('iframe[src*="google.com/maps"]')) { const u = new URL(f.src); if (u.searchParams.has('pb')) { const m = u.searchParams.get('pb').match(/!3d(-?[\d.]+)!4d(-?[\d.]+)/); if (m) return `${m[1]},${m[2]}`; } if (u.searchParams.has('location')) return u.searchParams.get('location'); } return null; } catch (e) { return null; } };
    const applyTheme = (isDark) => { [ogContainer, ogSettingsPopup].filter(Boolean).forEach(el => el.classList.toggle('og-dark-mode', isDark)); if(ogSettingsPopup) ogSettingsPopup.querySelector('.og-dark-mode-btn').textContent = isDark ? 'Light Mode' : 'Dark Mode'; };
    const toggleDarkMode = () => { const isDark = !GM_getValue('og_dark_mode', false); GM_setValue('og_dark_mode', isDark); applyTheme(isDark); };
    const positionSettingsPopup = () => { if (!ogContainer || !ogSettingsPopup) return; const rect = ogContainer.getBoundingClientRect(); ogSettingsPopup.style.left = `${rect.right + 10}px`; ogSettingsPopup.style.top = `${rect.top}px`; };
    const showStartupAnimation = () => { const o = document.createElement('div'), t = document.createElement('div'); o.id = 'og-startup-overlay'; t.id = 'og-startup-text'; const txt = "Openguessr script by Kakoncheater"; txt.split('').forEach((c, i) => { const s = document.createElement('span'); s.textContent = (c === ' ') ? '\u00A0' : c; s.style.transitionDelay = `${i * 60}ms`; s.style.animationDelay = `${i * 60}ms`; t.appendChild(s); }); document.body.append(o, t); setTimeout(() => { o.style.opacity = '1'; }, 50); setTimeout(() => { t.style.opacity = '1'; t.classList.add('visible'); }, 500); setTimeout(() => { t.style.transition = 'opacity 0.5s ease-in'; t.style.opacity = '0'; }, 3800); setTimeout(() => { o.style.opacity = '0'; }, 4200); setTimeout(() => { o.remove(); t.remove(); }, 4700); };

    const createElements = () => {
        if (ogContainer) return;
        ogContainer = document.createElement('div');
        ogContainer.id = 'og-container';
        ogContainer.innerHTML = `<div class="og-header"><span>Thx for using my script. Love Kakoncheater</span><div class="og-controls"><button class="og-settings-btn" title="Settings"></button><button class="og-close-btn" title="Close">X</button></div></div><iframe class="og-iframe"></iframe>`;
        document.body.appendChild(ogContainer);
        ogSettingsPopup = document.createElement('div');
        ogSettingsPopup.id = 'og-settings-popup';
        ogSettingsPopup.innerHTML = `<h4>Settings</h4><div class="slider-container"><label style="width:60px">Width</label><input type="range" id="og-width-slider" min="280" max="1500"></div><div class="slider-container"><label style="width:60px">Height</label><input type="range" id="og-height-slider" min="220" max="1000"></div><button class="og-dark-mode-btn" style="width:100%;margin-top:10px;padding:8px;border:none;border-radius:5px;font-weight:bold;cursor:pointer"></button>`;
        document.body.appendChild(ogSettingsPopup);

        ogContainer.querySelector('.og-header').addEventListener('mousedown', (e) => { if(e.target.closest('button') || isResizing) return; isDragging = true; dragOffsetX = e.clientX - ogContainer.offsetLeft; dragOffsetY = e.clientY - ogContainer.offsetTop; });
        ogContainer.querySelector('.og-close-btn').addEventListener('click', closeLocationFrame);
        ogContainer.querySelector('.og-settings-btn').addEventListener('click', (e) => { e.stopPropagation(); const isActive = ogSettingsPopup.classList.toggle('active'); if (isActive) positionSettingsPopup(); });

        const widthSlider = ogSettingsPopup.querySelector('#og-width-slider'), heightSlider = ogSettingsPopup.querySelector('#og-height-slider');
        widthSlider.addEventListener('input', () => { ogContainer.style.width = `${widthSlider.value}px`; });
        heightSlider.addEventListener('input', () => { ogContainer.style.height = `${heightSlider.value}px`; });
        const startResize = () => { isResizing = true; };
        const endResize = () => { if (!isResizing) return; isResizing = false; positionSettingsPopup(); };
        [widthSlider, heightSlider].forEach(slider => { slider.addEventListener('mousedown', startResize); slider.addEventListener('mouseup', endResize); });
        ogSettingsPopup.querySelector('.og-dark-mode-btn').addEventListener('click', toggleDarkMode);
    };

    const openLocationFrame = (loc) => { if (!loc) return; createElements(); ogContainer.style.display = 'flex'; setTimeout(() => ogContainer.classList.add('visible'), 10); ogContainer.querySelector('.og-iframe').src = getMapUrl(loc); ogSettingsPopup.style.display = 'block'; ogSettingsPopup.querySelector('#og-width-slider').value = ogContainer.offsetWidth; ogSettingsPopup.querySelector('#og-height-slider').value = ogContainer.offsetHeight; currentLocation = loc; applyTheme(GM_getValue('og_dark_mode', false)); };
    const closeLocationFrame = () => { if (!ogContainer) return; ogContainer.classList.remove('visible'); if (ogSettingsPopup) ogSettingsPopup.classList.remove('active'); setTimeout(() => { if (ogContainer) { ogContainer.style.display = 'none'; ogSettingsPopup.style.display = 'none'; }}, 300); };

    document.addEventListener('mouseup', () => { isDragging = false; });
    document.addEventListener('mousemove', (e) => { if (isDragging && !isResizing) { ogContainer.style.left = `${e.clientX - dragOffsetX}px`; ogContainer.style.top = `${e.clientY - dragOffsetY}px`; positionSettingsPopup(); }});
    document.addEventListener('keydown', (e) => { if (e.key === 'Insert') { (ogContainer && ogContainer.classList.contains('visible')) ? closeLocationFrame() : openLocationFrame(extractLocation()); } });

    if (!sessionStorage.getItem('og_animation_played')) {
        sessionStorage.setItem('og_animation_played', 'true');
        showStartupAnimation();
        setTimeout(() => openLocationFrame(extractLocation()), 5200);
    } else {
        openLocationFrame(extractLocation());
    }

    setInterval(() => {
        if (!ogContainer || ogContainer.style.display === 'none') return;
        const l = extractLocation();
        if (l && l !== currentLocation) {
            ogContainer.querySelector('.og-iframe').src = getMapUrl(l);
            currentLocation = l;
        }
    }, 1500);

})();