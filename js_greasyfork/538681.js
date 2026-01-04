// ==UserScript==
// @name         BazNav
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  An enhanced Torn City bazaar navigator with customization options to make this tool YOURS
// @author       J4C
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/538681/BazNav.user.js
// @updateURL https://update.greasyfork.org/scripts/538681/BazNav.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const defaultSettings = {
        // UI Colors
        gradientStart: '#000000', gradientEnd: '#ffffff',
        textColor: '#ffffff', fontFamily: 'Arial, sans-serif',
        fontSize: 14, opacity: 1, width: 200,
        borderRadius: 8, borderWidth: 1, borderColor: '#000000',
        shadowBlur: 5, shadowColor: 'rgba(0,0,0,0.2)',

        // Buttons
        buttonBgColor: '#ffffff', buttonTextColor: '#000000',
        buttonBorderColor: '#000000', buttonBorderWidth: 1,
        buttonHoverColor: '#8F4729',

        // Counter
        counterBgColor: '#252525', counterTextColor: '#fff',
        counterBorderColor: '#fff',

        // Settings Panel
        panelBgColor: '#ffffff', panelTextColor: '#000',
        panelBorderColor: '#cccccc',

        // Loading Bar
        loadingBarColor: '#8F4729'
    };

    if (window.bazNavInitialized) {
        console.warn('BazNav is already initialized!');
        return;
    }
    window.bazNavInitialized = true;

    // User IDs
    const userIds = [
        1010587, 3199521, 1281694, 1286142, 1601153, 1821105, 1826175, 1853324, 1927218, 1962806, 2018311,
        2018693, 2029519, 2093595, 2144418, 2145030, 2150517, 2157199, 2163550, 2176411, 2202548,
        2203576, 2214797, 2215721, 2256247, 2263400, 2271357, 2321305, 2327316, 2329817, 2332873,
        2334174, 2349680, 2352900, 2373781, 2418443, 2459465, 2462160, 2466069, 2470308, 2515770,
        2531848, 2541678, 2557282, 2561006, 2570451, 2587064, 2596546, 2599031, 2601828, 2631792,
        2637146, 2649236, 2656557, 2658357, 2659552, 2664822, 2668560, 2675624, 2676295, 2693254,
        2693850, 2700933, 2706250, 2718606, 2733754, 2746056, 2749015, 2759415, 2768219, 2769269,
        2810688, 2812113, 2821007, 2855343, 2858099, 286232, 2865837, 2871891, 2905897, 2930086,
        2954100, 2954103, 2962007, 3025664, 3050251, 3060802, 3108759, 3118416, 3145984, 3146495,
        3152626, 3166857, 3169682, 3170980, 3181495, 3182441, 3185895, 3186599, 3186796, 3187167,
        3187441, 3192720, 3198458, 3200247, 3218273, 3220837, 3237207, 3244939, 3248078,
        3249592, 3253085, 3253836, 3256697, 3259246, 3272175, 3276048, 3284969, 3303003, 3304611,
        3304959, 3306975, 3325064, 3325774, 3327900, 333493, 3338586, 3340959, 3347008, 3348231,
        3351015, 3355475, 3357431, 3369647, 3372209, 3384244, 3385583, 3388276, 3390097, 3392180,
        3394866, 3399085, 3400186, 3405216, 3407522, 3409934, 3424078, 3443006, 3444185, 3445243,
        3447101, 3452004, 3455398, 3455607, 3455822, 3462112, 3465149, 3466754, 3468210, 3469314,
        3474044, 3476656, 3480404, 3484482, 3484674, 3485561, 3488406, 3492821, 3493798, 3499388,
        3504237, 3506751, 3528214, 3532145, 3532830, 3535815, 3546645, 3552837, 3554441, 3555668,
        3561791, 3562619, 3570456, 3571449, 3582325, 3584826, 3588663, 3595133, 3602729, 360330,
        3603393, 3615849, 3617287, 3621114, 3625719, 3626448, 3626655, 3653078, 3657829, 3661330,
        3665796, 3676143, 3738196, 830027, 1145056, 1403609, 1441750, 1496324, 1636350
];

const uniqueUserIds = [...new Set(userIds)];
const originalLinks = uniqueUserIds.map(id => `https://www.torn.com/bazaar.php?userId=${id}`);

const links = new Proxy(originalLinks, {
    get(target, prop) {
        if (prop === 'length') {
            console.log('Links array length accessed:', target.length);
        } else if (prop === 'map') {
            return function(...args) {
                console.log('Links array map called, length:', target.length);
                return Array.prototype.map.apply(target, args);
            };
        }
        return target[prop];
    },
    set() {
        console.error('Attempted to modify frozen links array! Stack:', new Error().stack);
        return false; // Prevent modifications
    }
});

console.log(`Total User IDs before deduplication: ${userIds.length}`);
console.log(`Total Unique User IDs: ${uniqueUserIds.length}`);
console.log(`Total Links: ${links.length}`);
console.log('Links array created at:', new Error().stack);

let index = Math.min(+localStorage.getItem('bazaarLinkIndex') || 0, links.length - 1);

const settings = JSON.parse(localStorage.getItem('bazaarNavSettings')) || defaultSettings;

    // Initialize GM.addStyle if not available
    if (typeof GM === 'undefined') window.GM = {};
    GM.addStyle ||= css => document.head.appendChild(Object.assign(document.createElement('style'), {textContent: css}));

    // Create UI elements
    const container = document.createElement('div');
    container.id = 'bazaarNavFloat';

    const counter = document.createElement('div');
    counter.id = 'bazaarCounter';
    counter.textContent = `${index + 1} / ${links.length}`;
console.log('Initial links length when creating counter:', links.length);
    const cogIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    cogIcon.setAttribute("id", "cogIcon");
    cogIcon.setAttribute("viewBox", "0 0 24 24");
    cogIcon.setAttribute("aria-label", "Settings");
    cogIcon.setAttribute("role", "button");
    cogIcon.setAttribute("tabindex", "0");
    cogIcon.innerHTML = `<path d="M19.14 12.94c.04-.31.06-.63.06-.94s-.02-.63-.06-.94l2.03-1.58a.5.5 0 00.12-.63l-1.92-3.32a.5.5 0 00-.6-.22l-2.39.96a7.027 7.027 0 00-1.63-.94l-.36-2.54a.5.5 0 00-.5-.42h-3.84a.5.5 0 00-.5.42l-.36 2.54a6.94 6.94 0 00-1.63.94l-2.39-.96a.5.5 0 00-.6.22l-1.92 3.32a.5.5 0 00.12.63l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58a.5.5 0 00-.12.63l1.92 3.32a.5.5 0 00.6.22l2.39-.96c.5.38 1.04.7 1.63.94l.36 2.54a.5.5 0 00.5.42h3.84a.5.5 0 00.5-.42l.36-2.54c.59-.24 1.13-.56 1.63-.94l2.39.96a.5.5 0 00.6-.22l1.92-3.32a.5.5 0 00-.12-.63l-2.03-1.58zM12 15.5a3.5 3.5 0 110-7 3.5 3.5 0 010 7z"/>`;

    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next Bazaar';
    const backToFirstBtn = document.createElement('button');
    backToFirstBtn.textContent = 'Back to First';
    const settingsPanel = document.createElement('div');
    settingsPanel.id = 'settingsPanel';

    // Resize handle
    const resizeHandle = document.createElement('div');
    resizeHandle.id = 'resizeHandle';
    resizeHandle.innerHTML = '↔';
    resizeHandle.title = "Drag to resize";

    // Build UI
    counter.appendChild(cogIcon);
    [counter, nextBtn, backToFirstBtn, settingsPanel, resizeHandle].forEach(el => container.appendChild(el));
    document.body.appendChild(container);

    const savedPos = JSON.parse(localStorage.getItem('bazaarNavPosition'));
    if (savedPos?.x !== undefined && savedPos?.y !== undefined) {
        container.style.left = `${savedPos.x}px`;
        container.style.top = `${savedPos.y}px`;
    }

    const updateStyles = () => {
        GM.addStyle(`
            #bazaarNavFloat {
                z-index: 999999; position: fixed; top: 120px; left: 10px; display: flex;
                flex-direction: column; align-items: center; font-weight: bold;
                overflow: hidden; user-select: none; cursor: grab;
                background: linear-gradient(135deg, ${settings.gradientStart}, ${settings.gradientEnd});
                color: ${settings.textColor}; font-family: ${settings.fontFamily};
                font-size: ${settings.fontSize}px; border-radius: ${settings.borderRadius}px;
                border: ${settings.borderWidth}px solid ${settings.borderColor};
                box-shadow: 0 2px ${settings.shadowBlur}px ${settings.shadowColor};
                opacity: ${settings.opacity}; width: ${settings.width}px;
            }
            #bazaarNavFloat button {
                background: ${settings.buttonBgColor}; color: ${settings.buttonTextColor};
                border: ${settings.buttonBorderWidth}px solid ${settings.buttonBorderColor};
                padding: 8px 16px; cursor: pointer; font-weight: bold;
                font-size: ${settings.fontSize}px; width: calc(100% - 16px);
                text-shadow: 0 1px 1px #fff; border-radius: ${settings.borderRadius}px;
                transition: background 0.3s; margin: 4px 8px 0;
            }
            #bazaarNavFloat button:hover { background: ${settings.buttonHoverColor}; }
            #bazaarCounter {
                padding: 10px 14px; background: ${settings.counterBgColor};
                color: ${settings.counterTextColor}; width: calc(100% - 28px);
                text-align: center; border-bottom: 1px solid ${settings.counterBorderColor};
                position: relative; user-select: none; display: flex;
                align-items: center; justify-content: center; gap: 6px;
            }
            #bazaarCounter.loading::after {
                content: ''; position: absolute; bottom: 0; left: 0; height: 3px; width: 100%;
                background: ${settings.loadingBarColor}; animation: loadingBar 3s linear forwards;
                border-radius: 0 0 ${settings.borderRadius}px ${settings.borderRadius}px;
            }
            @keyframes loadingBar { from { width: 0; } to { width: 100%; } }
            #settingsPanel {
                display: none; background: ${settings.panelBgColor};
                color: ${settings.panelTextColor}; width: calc(100% - 16px);
                padding: 8px; box-sizing: border-box; border-top: 1px solid ${settings.panelBorderColor};
                font-size: 12px; max-height: 240px; overflow-y: auto; margin: 0 8px;
            }
            #settingsPanel label { display: block; margin: 8px 0 2px; font-weight: bold; }
            #settingsPanel input, #settingsPanel select {
                width: 100%; padding: 2px 4px; box-sizing: border-box; font-size: 13px;
                border-radius: 4px; border: 1px solid #ccc;
            }
            #settingsPanel .section {
                margin: 10px 0; padding-bottom: 10px;
                border-bottom: 1px dashed #ddd;
            }
            #settingsPanel .section-title {
                font-weight: bold; margin-bottom: 8px; color: #555;
            }
            #cogIcon {
                cursor: pointer; width: 18px; height: 18px; fill: ${settings.textColor};
                user-select: none; flex-shrink: 0;
            }
            #resizeHandle {
                position: absolute; right: 0; bottom: 0; width: 16px; height: 16px;
                background: rgba(0,0,0,0.1); cursor: nwse-resize; display: flex;
                align-items: center; justify-content: center; font-size: 12px;
                border-radius: 4px 0 0 0;
            }
            #resizeHandle:hover { background: rgba(0,0,0,0.2); }
            @media screen and (max-width: 1000px) {
                #bazaarNavFloat { top: 140px; }
            }
        `);
    };

    updateStyles();
    container.style.width = `${settings.width}px`;
container.style.opacity = settings.opacity;

    // Dragging function
    let isDragging = false, dragStartX, dragStartY, elemStartX, elemStartY;
    container.addEventListener('mousedown', e => {
        if (e.target.closest('#settingsPanel, #cogIcon, #resizeHandle')) return;
        isDragging = true;
        [dragStartX, dragStartY] = [e.clientX, e.clientY];
        const rect = container.getBoundingClientRect();
        [elemStartX, elemStartY] = [rect.left, rect.top];
        container.style.cursor = 'grabbing';
        e.preventDefault();
    });

    // Resize function
    let isResizing = false, startWidth, startX;
    resizeHandle.addEventListener('mousedown', e => {
        isResizing = true;
        startWidth = container.offsetWidth;
        startX = e.clientX;
        e.preventDefault();
        e.stopPropagation();
    });

    const handleMove = e => {
        if (isDragging) {
            let newX = Math.max(0, Math.min(window.innerWidth - container.offsetWidth, elemStartX + e.clientX - dragStartX));
            let newY = Math.max(0, Math.min(window.innerHeight - container.offsetHeight, elemStartY + e.clientY - dragStartY));
            container.style.left = `${newX}px`;
            container.style.top = `${newY}px`;
        } else if (isResizing) {
            const newWidth = Math.max(120, Math.min(400, startWidth + (e.clientX - startX)));
            settings.width = newWidth;
            container.style.width = `${newWidth}px`;
            saveSettings();
        }
    };

    const handleUp = () => {
        if (isDragging) {
            isDragging = false;
            container.style.cursor = 'grab';
            const rect = container.getBoundingClientRect();
            localStorage.setItem('bazaarNavPosition', JSON.stringify({x: rect.left, y: rect.top}));
        } else if (isResizing) {
            isResizing = false;
        }
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);

    // Navigation function
   const openLinkAtIndex = i => {
    console.log('openLinkAtIndex - links length:', links.length, 'index:', i);
    if (i < 0 || i >= links.length) {
        console.error('Invalid index or links array is empty');
        return;
    }
    index = i;
    localStorage.setItem('bazaarLinkIndex', index);
    counter.textContent = `${index + 1} / ${links.length}`;
    counter.appendChild(cogIcon);
    window.location.href = links[index];
};

    nextBtn.addEventListener('click', () => openLinkAtIndex((index + 1) % links.length));
    backToFirstBtn.addEventListener('click', () => openLinkAtIndex(0));

    // Settings management
    const saveSettings = () => {
        localStorage.setItem('bazaarNavSettings', JSON.stringify(settings));
        updateStyles();
    };

    const resetToDefaults = () => {
        Object.assign(settings, defaultSettings);
        saveSettings();
        populateSettingsPanel();
    };

    // Settings panel
    const populateSettingsPanel = () => {
        settingsPanel.innerHTML = `
            <div class="section">
                <div class="section-title">Presets</div>
                <button id="defaultPreset" style="width:100%;margin:4px 0;padding:4px">Default</button>
                <button id="darkPreset" style="width:100%;margin:4px 0;padding:4px">Dark Theme</button>
                <button id="lightPreset" style="width:100%;margin:4px 0;padding:4px">Light Theme</button>
                <button id="resetDefaults" style="width:100%;margin:4px 0;padding:4px">Reset All to Defaults</button>
            </div>

            <div class="section">
                <div class="section-title">Container</div>
                <label for="widthInput">Width:</label>
                <input type="range" id="widthInput" min="120" max="400" step="1" value="${settings.width}">

                <label for="opacityInput">Opacity:</label>
                <input type="range" id="opacityInput" min="0.5" max="1" step="0.05" value="${settings.opacity}">

                <label for="gradientStart">Gradient Start:</label>
                <input type="color" id="gradientStart" value="${settings.gradientStart}">

                <label for="gradientEnd">Gradient End:</label>
                <input type="color" id="gradientEnd" value="${settings.gradientEnd}">

                <label for="borderRadius">Border Radius:</label>
                <input type="number" id="borderRadius" min="0" max="50" value="${settings.borderRadius}">

                <label for="borderWidth">Border Width:</label>
                <input type="number" id="borderWidth" min="0" max="10" value="${settings.borderWidth}">

                <label for="borderColor">Border Color:</label>
                <input type="color" id="borderColor" value="${settings.borderColor}">

                <label for="shadowColor">Shadow Color:</label>
                <input type="color" id="shadowColor" value="${settings.shadowColor}">

                <label for="shadowBlur">Shadow Blur:</label>
                <input type="number" id="shadowBlur" min="0" max="20" value="${settings.shadowBlur}">
            </div>

            <div class="section">
                <div class="section-title">Text</div>
                <label for="textColor">Text Color:</label>
                <input type="color" id="textColor" value="${settings.textColor}">

                <label for="fontFamily">Font Family:</label>
                <select id="fontFamily">
                    <option value="Arial, sans-serif">Arial</option>
                    <option value="'Segoe UI', Tahoma, Geneva, Verdana, sans-serif">Segoe UI</option>
                    <option value="'Courier New', Courier, monospace">Courier New</option>
                    <option value="'Georgia', serif">Georgia</option>
                    <option value="'Comic Sans MS', cursive, sans-serif">Comic Sans MS</option>
                    <option value="'Trebuchet MS', sans-serif">Trebuchet MS</option>
                </select>

                <label for="fontSize">Font Size:</label>
                <input type="number" id="fontSize" min="10" max="20" value="${settings.fontSize}">
            </div>

            <div class="section">
                <div class="section-title">Buttons</div>
                <label for="buttonBgColor">Background:</label>
                <input type="color" id="buttonBgColor" value="${settings.buttonBgColor}">

                <label for="buttonTextColor">Text Color:</label>
                <input type="color" id="buttonTextColor" value="${settings.buttonTextColor}">

                <label for="buttonHoverColor">Hover Color:</label>
                <input type="color" id="buttonHoverColor" value="${settings.buttonHoverColor}">

                <label for="buttonBorderColor">Border Color:</label>
                <input type="color" id="buttonBorderColor" value="${settings.buttonBorderColor}">

                <label for="buttonBorderWidth">Border Width:</label>
                <input type="number" id="buttonBorderWidth" min="0" max="5" value="${settings.buttonBorderWidth}">
            </div>

            <div class="section">
                <div class="section-title">Counter</div>
                <label for="counterBgColor">Background:</label>
                <input type="color" id="counterBgColor" value="${settings.counterBgColor}">

                <label for="counterTextColor">Text Color:</label>
                <input type="color" id="counterTextColor" value="${settings.counterTextColor}">

                <label for="counterBorderColor">Border Color:</label>
                <input type="color" id="counterBorderColor" value="${settings.counterBorderColor}">

                <label for="loadingBarColor">Loading Bar Color:</label>
                <input type="color" id="loadingBarColor" value="${settings.loadingBarColor}">
            </div>

            <div class="section">
                <div class="section-title">Settings Panel</div>
                <label for="panelBgColor">Background:</label>
                <input type="color" id="panelBgColor" value="${settings.panelBgColor}">

                <label for="panelTextColor">Text Color:</label>
                <input type="color" id="panelTextColor" value="${settings.panelTextColor}">

                <label for="panelBorderColor">Border Color:</label>
                <input type="color" id="panelBorderColor" value="${settings.panelBorderColor}">
            </div>
        `;

        settingsPanel.querySelectorAll('input, select').forEach(el => {
    el.addEventListener('input', () => {
        if (el.id === 'widthInput') {
            settings.width = parseInt(el.value);
            container.style.width = `${settings.width}px`;
        } else if (el.id === 'opacityInput') {
            settings.opacity = parseFloat(el.value);
            container.style.opacity = settings.opacity;
        } else if (el.type === 'color') {
            settings[el.id] = el.value;
        } else if (el.type === 'number' || el.type === 'range') {
            settings[el.id] = parseInt(el.value);
        } else {
            settings[el.id] = el.value;
        }
        saveSettings();
    });
});

        // Preset buttons
        settingsPanel.querySelector('#defaultPreset').addEventListener('click', () => {
            Object.assign(settings, defaultSettings);
            saveSettings();
            populateSettingsPanel();
        });

        settingsPanel.querySelector('#darkPreset').addEventListener('click', () => {
            Object.assign(settings, {
                gradientStart: '#2d2d2d', gradientEnd: '#1a1a1a',
                textColor: '#e0e0e0', fontFamily: 'Arial, sans-serif',
                buttonBgColor: '#444444', buttonTextColor: '#000000',
                buttonHoverColor: '#666666', counterBgColor: '#333333',
                counterTextColor: '#ffffff', panelBgColor: '#222222',
                panelTextColor: '#dddddd', borderColor: '#444444',
                panelBorderColor: '#444444', counterBorderColor: '#555555',
                buttonBorderColor: '#666666', loadingBarColor: '#4a90e2'
            });
            saveSettings();
            populateSettingsPanel();
        });

        settingsPanel.querySelector('#lightPreset').addEventListener('click', () => {
            Object.assign(settings, {
                gradientStart: '#f5f5f5', gradientEnd: '#e0e0e0',
                textColor: '#000000', fontFamily: 'Arial, sans-serif',
                buttonBgColor: '#ffffff', buttonTextColor: '#000000',
                buttonHoverColor: '#8F4729', counterBgColor: '#f0f0f0',
                counterTextColor: '#000000', panelBgColor: '#ffffff',
                panelTextColor: '#000000',
                borderColor: '#000000',      // Border color
                borderWidth: 2,              // Border thickness (in pixels)
                panelBorderColor: '#000000',
                counterBorderColor: '#000000',
                buttonBorderColor: '#000000',
                buttonBorderWidth: 2,        // Button border thickness
                loadingBarColor: '#8F4729'
            });
            saveSettings();
            populateSettingsPanel();
        });

        settingsPanel.querySelector('#resetDefaults').addEventListener('click', resetToDefaults);
    };

    populateSettingsPanel();

    // Toggle settings panel
    cogIcon.addEventListener('click', () => settingsPanel.style.display = settingsPanel.style.display === 'block' ? 'none' : 'block');
    cogIcon.addEventListener('keydown', e => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), cogIcon.click()));
})();