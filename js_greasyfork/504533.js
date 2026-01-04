// ==UserScript==
// @name         ChatGPT Enhanced Customizer
// @namespace    https://github.com/elixirsneededx/ChatGPT-Enhanced-Customizer-TamperMonkey-
// @version      3.0
// @description  Customize ChatGPT with advanced background, UI styling, text controls, and presets
// @license      MIT
// @copyright    2024, elixirsneededx (https://github.com/elixirsneededx) @elixirsneededx on discord.
// @author       @elixirsneededx on discord
// @match        http*://chat.openai.com/*
// @match        http*://chatgpt.com/*
// @connect      https://greasyfork.org
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/504533/ChatGPT%20Enhanced%20Customizer.user.js
// @updateURL https://update.greasyfork.org/scripts/504533/ChatGPT%20Enhanced%20Customizer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Custom Styles
    GM_addStyle(`
        #customization-gui {
            position: fixed;
            top: 10px;
            right: 10px;
            background: black;
            padding: 15px;
            border-radius: 10px;
            z-index: 10000;
            font-family: Arial, sans-serif;
            color: white;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        #customization-gui h1, #customization-gui p {
            margin: 0;
        }
        #customization-gui h1 {
            font-size: 20px;
            color: #ff00ff;
        }
        #customization-gui p {
            font-size: 14px;
            color: #ff00ff;
        }
        #customization-gui label {
            margin-bottom: 5px;
        }
        #customization-gui select, #customization-gui input[type="color"], #customization-gui input[type="file"] {
            width: 100%;
            padding: 5px;
            border-radius: 4px;
            background-color: black;
            color: white;
            border: 1px solid #ffffff;
        }
        .custom-bg-image, .reopen-gui {
            width: 40px;
            height: 40px;
            background-size: cover;
            background-position: center;
            cursor: pointer;
            position: fixed;
            bottom: 10px;
            right: 10px;
            z-index: 10000;
        }
        .reopen-gui {
            display: none;
            background-image: url('https://static.vecteezy.com/system/resources/thumbnails/023/060/823/small_2x/chatgpt-concept-artificial-intelligence-chatbot-neon-logo-on-black-background-free-vector.jpg');
        }
        .row {
            display: flex;
            flex-direction: row;
            gap: 10px;
        }
        .column {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        #close-button {
            position: absolute;
            top: 5px;
            right: 5px;
            background: red;
            border: none;
            color: white;
            padding: 2px 6px;
            border-radius: 4px;
            cursor: pointer;
        }
    `);

    // Create and append the GUI
    const gui = document.createElement('div');
    gui.id = 'customization-gui';
    gui.innerHTML = `
        <button id="close-button">X</button>
        <h1>ChatGPTEnhancer3.0</h1>
        <div class="column">
            <div class="row">
                <label for="bgColorPicker">Background Color:</label>
                <input type="color" id="bgColorPicker" value="#ffffff" />
            </div>
            <div class="row">
                <label for="headerColorPicker">Header Color:</label>
                <input type="color" id="headerColorPicker" value="#f0f0f0" />
            </div>
            <div class="row">
                <label for="sidebarColorPicker">Sidebar Color:</label>
                <input type="color" id="sidebarColorPicker" value="#ffffff" />
            </div>
        </div>
        <div class="column">
            <label for="fontSelect">Font:</label>
            <select id="fontSelect">
                <option value="Arial">Arial</option>
                <option value="Courier New">Courier New</option>
                <option value="Georgia">Georgia</option>
                <option value="Tahoma">Tahoma</option>
                <option value="Verdana">Verdana</option>
                <option value="Comic Sans MS">Comic Sans MS</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Trebuchet MS">Trebuchet MS</option>
                <option value="Lucida Console">Lucida Console</option>
                <option value="Algerian">Algerian</option>
            </select>
            <label for="fileInput">Custom Background:</label>
            <input type="file" id="fileInput" accept=".mp4,.mp3,.gif,.png,.jpeg,.jpg" />
        </div>
        <div class="column">
            <label for="presetSelect">Presets:</label>
            <select id="presetSelect">
                <option value="default">Select a preset...</option>
                <option value="Anime Style">Anime Style</option>
                <option value="Slinky Style">Slinky Style</option>
                <option value="Bluematrix Style">Bluematrix Style</option>
            </select>
        </div>
        <p> @elixirsneededx on Discord - main developer</p>
        <p> @jokeysalt on Discord - presets/designer</p>
        <p> vital/@sacrificialmvp on Discord - motivation/design</p>
    `;
    document.body.appendChild(gui);

    // Handle closing and reopening the GUI
    const closeButton = document.getElementById('close-button');
    const reopenGuiButton = document.createElement('div');
    reopenGuiButton.classList.add('reopen-gui');
    document.body.appendChild(reopenGuiButton);

    closeButton.addEventListener('click', () => {
        gui.style.display = 'none';
        reopenGuiButton.style.display = 'block';
    });

    reopenGuiButton.addEventListener('click', () => {
        gui.style.display = 'flex';
        reopenGuiButton.style.display = 'none';
    });

    // Handle background color changes
    const bgColorPicker = document.getElementById('bgColorPicker');
    bgColorPicker.addEventListener('input', () => {
        document.body.style.backgroundColor = bgColorPicker.value;
        localStorage.setItem('bgColor', bgColorPicker.value);
    });
    const savedBgColor = localStorage.getItem('bgColor');
    if (savedBgColor) {
        bgColorPicker.value = savedBgColor;
        document.body.style.backgroundColor = savedBgColor;
    }

    // Handle header color changes
    const headerColorPicker = document.getElementById('headerColorPicker');
    headerColorPicker.addEventListener('input', () => {
        const header = document.querySelector('.sticky.top-0.z-10');
        if (header) {
            header.style.backgroundColor = headerColorPicker.value;
            localStorage.setItem('headerColor', headerColorPicker.value);
        }
    });
    const savedHeaderColor = localStorage.getItem('headerColor');
    if (savedHeaderColor) {
        headerColorPicker.value = savedHeaderColor;
        const header = document.querySelector('.sticky.top-0.z-10');
        if (header) {
            header.style.backgroundColor = savedHeaderColor;
        }
    }

    // Handle sidebar color changes
    const sidebarColorPicker = document.getElementById('sidebarColorPicker');
    sidebarColorPicker.addEventListener('input', () => {
        const color = sidebarColorPicker.value;
        GM_addStyle(`
            .bg-token-sidebar-surface-primary {
                background-color: ${color} !important;
            }
        `);
        localStorage.setItem('sidebarColor', color);
    });
    const savedSidebarColor = localStorage.getItem('sidebarColor');
    if (savedSidebarColor) {
        sidebarColorPicker.value = savedSidebarColor;
        GM_addStyle(`
            .bg-token-sidebar-surface-primary {
                background-color: ${savedSidebarColor} !important;
            }
        `);
    }

    // Handle font changes
    const fontSelect = document.getElementById('fontSelect');
    fontSelect.addEventListener('change', () => {
        document.body.style.fontFamily = fontSelect.value;
        localStorage.setItem('fontFamily', fontSelect.value);
    });
    const savedFontFamily = localStorage.getItem('fontFamily');
    if (savedFontFamily) {
        fontSelect.value = savedFontFamily;
        document.body.style.fontFamily = savedFontFamily;
    }

    // Handle custom background uploads
    const fileInput = document.getElementById('fileInput');
    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (file) {
            applyCustomBackground(file);
            localStorage.setItem('customBackground', URL.createObjectURL(file));
            localStorage.setItem('customBackgroundType', file.type);
        }
    });
    const savedCustomBackground = localStorage.getItem('customBackground');
    const savedCustomBackgroundType = localStorage.getItem('customBackgroundType');
    if (savedCustomBackground && savedCustomBackgroundType) {
        applyCustomBackground({ type: savedCustomBackgroundType, src: savedCustomBackground });
    }

    function applyCustomBackground(file) {
        const chatArea = document.querySelector('main');
        if (!chatArea) return;

        const fileURL = file.src || URL.createObjectURL(file);

        if (file.type.includes('video') || file.type.includes('audio')) {
            chatArea.innerHTML = `<video autoplay loop muted style="position: absolute; width: 100%; height: 100%; object-fit: cover;"><source src="${fileURL}" type="${file.type}"></video>`;
        } else if (file.type.includes('image')) {
            chatArea.style.backgroundImage = `url(${fileURL})`;
            chatArea.style.backgroundSize = 'cover';
            chatArea.style.backgroundPosition = 'center';
        }
    }

    // Handle preset changes
    const presetSelect = document.getElementById('presetSelect');
    presetSelect.addEventListener('change', () => {
        applyPreset(presetSelect.value);
    });

    function applyPreset(name) {
        if (name === 'Anime Style') {
            document.body.style.backgroundImage = 'url(https://raw.githubusercontent.com/elixirsneededx/ChatGPT-Enhanced-Customizer-TamperMonkey-/main/anime-preset.jpg)';
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
            bgColorPicker.value = '#ff1493';
            fontSelect.value = 'Algerian';
            document.body.style.fontFamily = 'Algerian';
            localStorage.setItem('preset', 'Anime Style');
        } else if (name === 'Slinky Style') {
            document.body.style.backgroundImage = 'url(https://raw.githubusercontent.com/elixirsneededx/ChatGPT-Enhanced-Customizer-TamperMonkey-/main/slinky-preset.gif)';
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
            bgColorPicker.value = '#00ffff';
            fontSelect.value = 'Comic Sans MS';
            document.body.style.fontFamily = 'Comic Sans MS';
            localStorage.setItem('preset', 'Slinky Style');
        } else if (name === 'Bluematrix Style') {
            document.body.style.backgroundImage = 'url(https://raw.githubusercontent.com/elixirsneededx/ChatGPT-Enhanced-Customizer-TamperMonkey-/main/bluematrix-preset.gif)';
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
            bgColorPicker.value = '#00008b';
            fontSelect.value = 'Times New Roman';
            document.body.style.fontFamily = 'Times New Roman';
            localStorage.setItem('preset', 'Bluematrix Style');
        } else if (name === 'default') {
            localStorage.removeItem('preset');
            window.location.reload();
        }
    }

    // Load preset on page load
    const savedPreset = localStorage.getItem('preset');
    if (savedPreset) {
        presetSelect.value = savedPreset;
        applyPreset(savedPreset);
    }

})();
