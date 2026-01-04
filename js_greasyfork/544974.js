// ==UserScript==

// @name         C.AI Theme & Background Customizer v3.2

// @namespace    http://tampermonkey.net/

// @version      3.2

// @description  Customize Character.AI theme with hex colors, background thumbnails, and palette previews.

// @author       Jira

// @match        https://character.ai/*

// @grant        GM_addStyle

// @downloadURL https://update.greasyfork.org/scripts/544974/CAI%20Theme%20%20Background%20Customizer%20v32.user.js
// @updateURL https://update.greasyfork.org/scripts/544974/CAI%20Theme%20%20Background%20Customizer%20v32.meta.js
// ==/UserScript==

(function () {

    'use strict';

    const defaultColors = {

        background: '#181818',

        foreground: '#f8fafc',

        primary: '#ffffff',

        secondary: '#cacfd3',

        accent: '#f8fafc'

    };

    function saveToStorage(key, value) {

        localStorage.setItem(key, JSON.stringify(value));

    }

    function loadFromStorage(key, defaultValue) {

        const stored = localStorage.getItem(key);

        return stored ? JSON.parse(stored) : defaultValue;

    }

    function applyColors(colors, bgImageBase64 = null) {

        const root = document.documentElement;

        for (const [varName, color] of Object.entries(colors)) {

            root.style.setProperty(`--${varName}`, color);

        }

        if (bgImageBase64) {

            document.body.style.backgroundImage = `url(${bgImageBase64})`;

            document.body.style.backgroundSize = 'cover';

            document.body.style.backgroundPosition = 'center center';

        } else {

            document.body.style.backgroundImage = '';

        }

    }

    const savedColors = loadFromStorage('caiColors', defaultColors);

    const savedBgImage = loadFromStorage('caiBgImage', null);

    applyColors(savedColors, savedBgImage);

    // Toggle Button

    const toggleBtn = document.createElement('button');

    toggleBtn.textContent = '✨️';

    toggleBtn.style = `

        position:fixed;
        top:20px; right:20px;
        width:25px; height:25px;

        padding:0; background:#333;color:#fff;

        border:none;border-radius:50%;cursor:grab;

        font-size:16px;
    z-index:10000;
    line-height:20px

    `;

    document.body.appendChild(toggleBtn);

    let offsetX, offsetY, dragging = false;

    toggleBtn.onmousedown = e => {

        dragging = true;

        offsetX = e.offsetX;

        offsetY = e.offsetY;

    };

    document.onmousemove = e => {

        if (dragging) {

            toggleBtn.style.left = `${e.pageX - offsetX}px`;

            toggleBtn.style.top = `${e.pageY - offsetY}px`;

            toggleBtn.style.right = 'auto';

        }

    };

    document.onmouseup = () => dragging = false;

    const panel = document.createElement('div');

    panel.id = 'themeCustomizer';

    panel.style = `

        position:fixed;top:60px;right:20px;z-index:9999;

        padding:10px;background:#222;color:#fff;

        font-size:14px;border-radius:8px;border:1px solid #888;

        display:none;max-width:270px;

    `;

    document.body.appendChild(panel);

    toggleBtn.onclick = () => {

        panel.style.display = (panel.style.display === 'none') ? 'block' : 'none';

        updatePaletteList();

    };

    const colorFields = ['background', 'foreground', 'primary', 'secondary', 'accent'];

    function updateThemeFromInputs() {

        const colors = {};

        colorFields.forEach(field => {

            colors[field] = document.getElementById(`${field}Color`).value;

        });

        applyColors(colors, loadFromStorage('caiBgImage', null));

        saveToStorage('caiColors', colors);

    }

    function getPalettes() {

        return loadFromStorage("caiPalettesV3", {});

    }

    function savePalette(name, colors, bgImage = null) {

        const palettes = getPalettes();

        palettes[name] = { colors, bgImage };

        saveToStorage("caiPalettesV3", palettes);

        updatePaletteList();

    }

    function deletePalette(name) {

        const palettes = getPalettes();

        delete palettes[name];

        saveToStorage("caiPalettesV3", palettes);

        updatePaletteList();

    }

    function updatePaletteList() {

        const container = document.getElementById("palettePreviewContainer");

        container.innerHTML = '';

        const palettes = getPalettes();

        for (const name in palettes) {

            const p = palettes[name];

            const div = document.createElement('div');

            div.style = `margin:5px;padding:5px;border:1px solid #555;border-radius:6px;display:flex;align-items:center;gap:5px;cursor:pointer;background:#333;`;

            div.innerHTML = `

                <div style="width:40px;height:40px;background-image:url('${p.bgImage || ''}');background-size:cover;border-radius:4px;"></div>

                <div style="flex:1;">

                    <b style="color:#f0f0f0">${name}</b><br>

                    <button data-apply="${name}" style="font-size:11px;margin-top:2px;">Apply</button>

                    <button data-delete="${name}" style="font-size:11px;margin-left:4px;">Delete</button>

                </div>

            `;

            container.appendChild(div);

        }

        container.querySelectorAll('button[data-apply]').forEach(btn => {

            btn.onclick = () => {

                const palette = getPalettes()[btn.dataset.apply];

                applyColors(palette.colors, palette.bgImage);

                saveToStorage('caiColors', palette.colors);

                saveToStorage('caiBgImage', palette.bgImage || null);

                colorFields.forEach(f => {

                    document.getElementById(`${f}Color`).value = palette.colors[f];

                    document.getElementById(`${f}Hex`).value = palette.colors[f];

                });

            };

        });

        container.querySelectorAll('button[data-delete]').forEach(btn => {

            btn.onclick = () => {

                deletePalette(btn.dataset.delete);

            };

        });

    }

    // Inject HTML UI

    panel.innerHTML = `

        <b>Theme Customizer</b><br><br>

        ${colorFields.map(c =>

            `<label>${c.charAt(0).toUpperCase() + c.slice(1)}:</label>

             <input type="color" id="${c}Color">

             <input type="text" id="${c}Hex" size="7" maxlength="7"><br>`

        ).join('')}

        <br>

        <label>Upload Background:</label>

        <input type="file" id="bgImage" accept="image/*"><br>

        <label>Palette Name:</label><input type="text" id="paletteName"><br>

        <button id="savePalette">Save</button>

        <button id="resetToDefault">Reset to Site Default</button><br><br>

        <div id="palettePreviewContainer" style="max-height:200px;overflow-y:auto;"></div>

    `;

    // Sync inputs

    colorFields.forEach(field => {

        const colorInput = document.getElementById(`${field}Color`);

        const hexInput = document.getElementById(`${field}Hex`);

        colorInput.value = savedColors[field];

        hexInput.value = savedColors[field];

        colorInput.oninput = () => {

            hexInput.value = colorInput.value;

            updateThemeFromInputs();

        };

        hexInput.oninput = () => {

            if (/^#([0-9A-F]{3}){1,2}$/i.test(hexInput.value)) {

                colorInput.value = hexInput.value;

                updateThemeFromInputs();

            }

        };

    });

    document.getElementById("savePalette").onclick = () => {

        const name = document.getElementById("paletteName").value.trim();

        if (!name) return alert("Name your palette!");

        const colors = {};

        colorFields.forEach(f => colors[f] = document.getElementById(`${f}Color`).value);

        const bgImage = loadFromStorage('caiBgImage', null);

        savePalette(name, colors, bgImage);

    };

    document.getElementById("resetToDefault").onclick = () => {

        document.body.style.backgroundImage = '';

        applyColors({}, null);

        localStorage.removeItem('caiColors');

        localStorage.removeItem('caiBgImage');

        colorFields.forEach(f => {

            document.getElementById(`${f}Color`).value = '';

            document.getElementById(`${f}Hex`).value = '';

        });

        alert("Theme reset to Character.AI's original style.");

    };

    document.getElementById("bgImage").addEventListener('change', function (e) {

        const file = e.target.files[0];

        if (!file || !file.type.startsWith('image/')) return;

        const reader = new FileReader();

        reader.onload = function (event) {

            const imageBase64 = event.target.result;

            saveToStorage('caiBgImage', imageBase64);

            updateThemeFromInputs();

        };

        reader.readAsDataURL(file);

    });

    updatePaletteList();

})();
