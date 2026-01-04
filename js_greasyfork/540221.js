// ==UserScript==
// @name         Drawaria Texture changer by 𝘣𝘢𝘳𝘴𝘪𝘬 𝘴𝘯𝘰𝘴𝘦𝘳
// @namespace    https://greasyfork.org/
// @version      1.4
// @description  Adds a draggable rainbow panel to drawaria.online with texture changer and XY position sliders
// @author       𝘣𝘢𝘳𝘴𝘪𝘬 𝘩𝘢𝘤𝘬𝘦𝘳
// @match        https://drawaria.online/*
// @icon         https://drawaria.online/favicon.ico
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540221/Drawaria%20Texture%20changer%20by%20%F0%9D%98%A3%F0%9D%98%A2%F0%9D%98%B3%F0%9D%98%B4%F0%9D%98%AA%F0%9D%98%AC%20%F0%9D%98%B4%F0%9D%98%AF%F0%9D%98%B0%F0%9D%98%B4%F0%9D%98%A6%F0%9D%98%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/540221/Drawaria%20Texture%20changer%20by%20%F0%9D%98%A3%F0%9D%98%A2%F0%9D%98%B3%F0%9D%98%B4%F0%9D%98%AA%F0%9D%98%AC%20%F0%9D%98%B4%F0%9D%98%AF%F0%9D%98%B0%F0%9D%98%B4%F0%9D%98%A6%F0%9D%98%B3.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Panel HTML
    const panel = document.createElement('div');
    panel.id = 'drawaria-ui-panel';
    panel.innerHTML = `
        <div id="drawaria-ui-header">Texture Replacer</div>
        <div id="drawaria-spinner"></div>
        <div class="content" style="display: none;">
            <label>Target CSS Selector:</label><br>
            <input type="text" id="texture-selector" value="canvas, body"><br><br>
            <label>Select Image File:</label><br>
            <input type="file" id="texture-file" accept="image/*"><br><br>
            <button id="apply-texture-button">Apply Texture</button><br><br>
            <button id="reset-texture-button">Reset Texture</button><br><br>
            <label for="x-slider">X координата:</label><br>
            <input type="range" id="x-slider" min="0" max="2000" value="0"><br>
            <label for="y-slider">Y координата:</label><br>
            <input type="range" id="y-slider" min="0" max="2000" value="0"><br>
        </div>
    `;
    document.body.appendChild(panel);

    // CSS Styles
    GM_addStyle(`
        #drawaria-ui-panel {
            position: fixed;
            top: 100px;
            right: 30px;
            width: 260px;
            background: linear-gradient(270deg, #ff0000, #ff9900, #ffff00, #00ff00, #00ccff, #3300ff, #cc00ff);
            background-size: 1500% 1500%;
            animation: rainbow 10s ease infinite;
            border: 2px solid #333;
            border-radius: 12px;
            z-index: 10000;
            font-family: Arial, sans-serif;
            color: white;
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.85);
        }

        @keyframes rainbow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }

        #drawaria-ui-header {
            padding: 12px;
            font-weight: bold;
            font-size: 16px;
            text-align: center;
            background: rgba(0, 0, 0, 0.4);
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
            cursor: move;
        }

        #drawaria-ui-panel .content {
            padding: 12px;
            opacity: 0;
            animation: fadeIn 1s ease-out forwards;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        #drawaria-ui-panel input[type="text"],
        #drawaria-ui-panel input[type="file"],
        #drawaria-ui-panel input[type="range"] {
            width: 100%;
            padding: 6px;
            border-radius: 6px;
            border: 1px solid #aaa;
            background: #1e1e1e;
            color: white;
            margin-bottom: 8px;
        }

        #apply-texture-button,
        #reset-texture-button {
            width: 100%;
            padding: 8px;
            margin-top: 6px;
            background-color: #222;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
        }

        #apply-texture-button:hover,
        #reset-texture-button:hover {
            background-color: #444;
        }

        #drawaria-spinner {
            width: 40px;
            height: 40px;
            border: 5px solid rgba(255,255,255,0.3);
            border-top: 5px solid #ffffff;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 30px auto;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `);

    // Fade in panel after loading
    setTimeout(() => {
        const spinner = document.getElementById('drawaria-spinner');
        const content = panel.querySelector('.content');
        spinner.remove();
        content.style.display = 'block';
    }, 3000);

    // Drag support
    const header = document.getElementById('drawaria-ui-header');
    let offsetX = 0, offsetY = 0, isDragging = false;

    header.addEventListener('mousedown', function (e) {
        isDragging = true;
        offsetX = e.clientX - panel.offsetLeft;
        offsetY = e.clientY - panel.offsetTop;
        document.body.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', function (e) {
        if (isDragging) {
            panel.style.left = (e.clientX - offsetX) + 'px';
            panel.style.top = (e.clientY - offsetY) + 'px';
            panel.style.right = 'auto';
        }
    });

    document.addEventListener('mouseup', function () {
        isDragging = false;
        document.body.style.userSelect = '';
    });

    // Apply texture
    document.getElementById('apply-texture-button').addEventListener('click', function () {
        const fileInput = document.getElementById('texture-file');
        const selector = document.getElementById('texture-selector').value;
        const file = fileInput.files[0];

        if (!file) {
            alert('Please select an image file.');
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            const imageDataUrl = e.target.result;
            document.querySelectorAll(selector).forEach(el => {
                el.style.backgroundImage = `url(${imageDataUrl})`;
                el.style.backgroundSize = 'cover';
                el.style.backgroundRepeat = 'no-repeat';
            });
        };
        reader.readAsDataURL(file);
    });

    // Reset texture
    document.getElementById('reset-texture-button').addEventListener('click', function () {
        const selector = document.getElementById('texture-selector').value;
        document.querySelectorAll(selector).forEach(el => {
            el.style.backgroundImage = '';
            el.style.backgroundSize = '';
            el.style.backgroundRepeat = '';
        });
    });

    // X/Y координаты игрока
    const xSlider = document.getElementById('x-slider');
    const ySlider = document.getElementById('y-slider');

    function updatePlayerPosition() {
        if (window.player) {
            window.player.x = parseInt(xSlider.value);
            window.player.y = parseInt(ySlider.value);
        }
    }

    xSlider.addEventListener('input', updatePlayerPosition);
    ySlider.addEventListener('input', updatePlayerPosition);

    // Автообновление слайдеров по положению игрока
    setInterval(() => {
        if (window.player) {
            xSlider.value = Math.floor(window.player.x);
            ySlider.value = Math.floor(window.player.y);
        }
    }, 500);
})();
