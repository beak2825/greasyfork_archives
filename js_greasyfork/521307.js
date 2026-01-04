// ==UserScript==
// @name         Unified 3D FX
// @namespace    http://your.namespace.here/
// @version      4.2
// @description  Unified 3D/image filter toggle with media control panel (button-based controls).
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/521307/Unified%203D%20FX.user.js
// @updateURL https://update.greasyfork.org/scripts/521307/Unified%203D%20FX.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const hostKey = `filters_${location.hostname}`;
    const globalKey = `filters_global`;

    let settings = {
        is3D: false,
        scaleImages: false,
        brightness: 0,
        contrast: 0,
        saturation: 0,
        clarityBoost: false,
        lazyEnhance: true,
        showImages: true,
        showVideos: true,
        include: '',
        exclude: ''
    };

    const saved = JSON.parse(localStorage.getItem(hostKey) || localStorage.getItem(globalKey));
    if (saved) Object.assign(settings, saved);

    const controlToggleButton = document.createElement('button');
    controlToggleButton.textContent = '✨';
    controlToggleButton.className = 'control-toggle-btn';
    controlToggleButton.style.cssText = `
        position: fixed; bottom: 10px; right: 10px;
        background-color: #333; color: white;
        border: none; padding: 6px 8px;
        font-size: 14px; z-index: 2147483647;
        border-radius: 5px; cursor: pointer;
    `;
    document.body.appendChild(controlToggleButton);

    const controlPanel = document.createElement('div');
    controlPanel.className = 'control-panel';
    controlPanel.style.cssText = `
        position: fixed; bottom: 38px; right: 10px;
        background: rgba(0,0,0,0.95); color: white;
        padding: 8px; width: 110px;
        font-family: Arial, sans-serif;
        display: none; z-index: 2147483646;
        border-radius: 10px; max-height: 90vh; overflow-y: auto;
        font-size: 11px;
    `;
    document.body.appendChild(controlPanel);

    controlToggleButton.addEventListener('click', () => {
        controlPanel.style.display = controlPanel.style.display === 'none' ? 'block' : 'none';
    });

    function addToggle(label, key, colorOn, callback) {
        const btn = document.createElement('button');
        btn.textContent = settings[key] ? `❌ ${label}` : `✔️ ${label}`;
        btn.style.cssText = `
            width: 100%; background-color: ${settings[key] ? colorOn : '#444'};
            color: white; border: none; padding: 5px;
            border-radius: 5px; cursor: pointer; margin-bottom: 6px;
            font-size: 11px;
        `;
        btn.addEventListener('click', () => {
            settings[key] = !settings[key];
            btn.textContent = settings[key] ? `❌ ${label}` : `✔️ ${label}`;
            btn.style.backgroundColor = settings[key] ? colorOn : '#444';
            if (callback) callback();
            reObserve();
        });
        controlPanel.appendChild(btn);
    }

    function addFilterControl(label, key, min, max, step) {
        const wrapper = document.createElement('div');
        wrapper.style.cssText = `margin-bottom: 6px;`;

        const lbl = document.createElement('div');
        lbl.textContent = `${label}: ${settings[key].toFixed(1)}`;
        lbl.style.marginBottom = '2px';
        wrapper.appendChild(lbl);

        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.justifyContent = 'space-between';

        const btnDec = document.createElement('button');
        btnDec.textContent = '−';
        btnDec.style.cssText = baseBtnStyle;
        btnDec.onclick = () => {
            settings[key] = Math.max(min, settings[key] - step);
            lbl.textContent = `${label}: ${settings[key].toFixed(1)}`;
            reObserve();
        };

        const btnInc = document.createElement('button');
        btnInc.textContent = '+';
        btnInc.style.cssText = baseBtnStyle;
        btnInc.onclick = () => {
            settings[key] = Math.min(max, settings[key] + step);
            lbl.textContent = `${label}: ${settings[key].toFixed(1)}`;
            reObserve();
        };

        row.appendChild(btnDec);
        row.appendChild(btnInc);
        wrapper.appendChild(row);
        controlPanel.appendChild(wrapper);
    }

    const baseBtnStyle = `
        width: 45%; padding: 3px 0;
        font-size: 12px; background: #555;
        border: none; color: white; border-radius: 4px;
        cursor: pointer;
    `;

    // Toggles
    addToggle('3D FX', 'is3D', '#d9534f');
    addToggle('Upscale', 'scaleImages', '#5bc0de');
    addToggle('Clarity', 'clarityBoost', '#1abc9c');
    addToggle('Lazy Mode', 'lazyEnhance', '#5cb85c');
    addToggle('Show Images', 'showImages', '#337ab7');
    addToggle('Show Videos', 'showVideos', '#8e44ad');

    // Filters (Button-based)
    addFilterControl('Brightness', 'brightness', -1, 1, 0.1);
    addFilterControl('Contrast', 'contrast', -1, 1, 0.1);
    addFilterControl('Saturation', 'saturation', -1, 2, 0.1);

    // Save & Reset
    const scopeSection = document.createElement('div');
    scopeSection.style.marginTop = '8px';
    scopeSection.innerHTML = `
        <button id="saveDomain" style="width:100%; margin-bottom:4px;">💾 Save Site</button>
        <button id="saveGlobal" style="width:100%; margin-bottom:4px;">🌐 Save All</button>
        <button id="resetAll" style="width:100%; background-color:#c9302c;">⛔ Reset</button>
    `;
    controlPanel.appendChild(scopeSection);

    document.getElementById('saveDomain').onclick = () => {
        localStorage.setItem(hostKey, JSON.stringify(settings));
        alert('Saved for site.');
    };
    document.getElementById('saveGlobal').onclick = () => {
        localStorage.setItem(globalKey, JSON.stringify(settings));
        alert('Saved globally.');
    };
    document.getElementById('resetAll').onclick = () => {
        localStorage.removeItem(hostKey);
        localStorage.removeItem(globalKey);
        Object.assign(settings, {
            is3D: false, scaleImages: false, clarityBoost: false,
            brightness: 0, contrast: 0, saturation: 0,
            lazyEnhance: true, showImages: true, showVideos: true,
            include: '', exclude: ''
        });
        reObserve();
        alert('Reset done. Reload to clear display.');
    };

    function applyMediaEffects(el) {
        const tag = el.tagName.toLowerCase();
        if ((tag === 'img' && !settings.showImages) || (tag === 'video' && !settings.showVideos)) return;

        const src = el.currentSrc || el.src || el.poster || '';
        if (settings.include && !src.includes(settings.include)) return;
        if (settings.exclude && src.includes(settings.exclude)) return;

        let filters = [
            `brightness(${Math.max(0, 1 + settings.brightness)})`,
            `contrast(${Math.max(0, 1 + settings.contrast)})`,
            `saturate(${Math.max(0, 1 + settings.saturation)})`
        ];

        if (settings.clarityBoost) {
            filters.push('contrast(1.0)', 'brightness(1.03)', 'drop-shadow(0 0 4px white)');
        }

        el.style.filter = filters.join(' ');

        let transform = '';
        if (settings.scaleImages) {
            transform += ' scale(1.30)';
            el.style.maxWidth = 'none';
            el.style.maxHeight = 'none';
            el.style.objectFit = 'contain';
        }
        if (settings.is3D) {
            transform += 'perspective(1400px) translateZ(50px) rotateX(25deg) rotateY(25deg)';
            el.style.transformStyle = 'preserve-3d';
            el.style.backfaceVisibility = 'hidden';
        }

        el.style.transform = transform.trim();
    }

    function enhanceAll() {
        document.querySelectorAll('img, video').forEach(applyMediaEffects);
    }

    function reObserve() {
        observer.disconnect();
        enhanceAll();
        observeNewMedia();
    }

    function observeNewMedia() {
        observer.observe(document.body, { childList: true, subtree: true });
    }

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (!(node instanceof HTMLElement)) return;
                const media = node.matches?.('img, video') ? [node] : [...node.querySelectorAll?.('img, video') || []];
                media.forEach(el => {
                    if (settings.lazyEnhance) {
                        requestIdleCallback(() => applyMediaEffects(el));
                    } else {
                        applyMediaEffects(el);
                    }
                });
            });
        });
    });

    enhanceAll();
    observeNewMedia();
})();