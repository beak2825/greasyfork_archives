// ==UserScript==
// @name         PixelPlace Overlay Tool 
// @namespace    http://tampermonkey.net/
// @version      4.2
// @description  Pixel-perfect image overlay for PixelPlace 
// @author       Ghost
// @match        https://pixelplace.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503456/PixelPlace%20Overlay%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/503456/PixelPlace%20Overlay%20Tool.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const img = new Image();
    img.style.position = 'absolute';
    img.style.pointerEvents = 'none';
    img.style.imageRendering = 'pixelated';
    img.style.opacity = '0.5';
    img.style.zIndex = '1000';
    img.style.transformOrigin = 'top left';

    let offsetX = 0;
    let offsetY = 0;
    let scale = 100;
    let imageUrl = '';
    let isLocked = false;
    let originalOpacity = 0.5;
    let ctrlHeld = false;

    let canvas, canvasParent;

    function waitForCanvas() {
        const interval = setInterval(() => {
            canvas = document.getElementById('canvas');
            canvasParent = document.getElementById('painting-move');
            if (canvas && canvasParent) {
                clearInterval(interval);
                initOverlay();
            }
        }, 500);
    }

    function updatePosition() {
        img.style.left = `${offsetX}px`;
        img.style.top = `${offsetY}px`;
        img.style.transform = `scale(${scale / 100})`;
    }

    function updateOpacity(value) {
        originalOpacity = parseFloat(value);
        if (!ctrlHeld) {
            img.style.opacity = originalOpacity;
        }
    }

    function initOverlay() {
        canvasParent.appendChild(img);
        updatePosition();
        createUI();
        appendGhostCredit();

        document.addEventListener('mousedown', (e) => {
            if (!e.shiftKey || !imageUrl || e.button !== 0 || isLocked) return;
            const coordDiv = document.getElementById('coordinates');
            if (!coordDiv || !coordDiv.textContent.includes(',')) return;

            const [x, y] = coordDiv.textContent.split(',').map(n => parseInt(n.trim()));
            if (isNaN(x) || isNaN(y)) return;

            offsetX = x;
            offsetY = y;
            updatePosition();

            document.querySelector('.overlay-x').value = offsetX;
            document.querySelector('.overlay-y').value = offsetY;
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Control' && !ctrlHeld) {
                ctrlHeld = true;
                img.style.opacity = originalOpacity / 2;
            }
        });

        document.addEventListener('keyup', (e) => {
            if (e.key === 'Control') {
                ctrlHeld = false;
                img.style.opacity = originalOpacity;
            }
        });
    }

    function createUI() {
        const panel = document.createElement('div');
        panel.className = 'overlay-panel';
        panel.style.cssText = `
            position: fixed;
            top: 100px;
            left: 20px;
            z-index: 1001;
            background: rgba(30,30,30,0.95);
            padding: 10px;
            border: 1px solid #666;
            border-radius: 8px;
            color: white;
            font-family: monospace;
            font-size: 13px;
            user-select: none;
            resize: both;
            overflow: auto;
            width: 220px;
            min-width: 180px;
            min-height: 120px;
        `;

        panel.innerHTML = `
            <div class="overlay-header" style="font-weight: bold; cursor: grab; display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span>Overlay Panel</span>
                <span class="overlay-collapse" style="cursor:pointer;">▲</span>
            </div>
            <div class="overlay-content">
                <label class="overlay-upload" style="cursor:pointer; color:#4ab3f4; display:inline-block; margin-bottom:6px;">
                    Choose File
                    <input type="file" class="overlay-file" accept="image/*" style="display:none;">
                </label><br>
                X: <input type="number" class="overlay-x" style="width:50px;" value="0">
                Y: <input type="number" class="overlay-y" style="width:50px;" value="0"><br>
                Scale %: <input type="number" class="overlay-scale" style="width:50px;" value="100"><br>
                Opacity: <input type="range" class="overlay-opacity" min="0" max="1" step="0.01" value="0.5"><br>
                <label style="font-size:12px;"><input type="checkbox" class="overlay-lock"> Lock Shift+Click</label>
                <div class="overlay-tip" style="margin-top:6px; font-size:11px; color:#aaa;">
                    Shift + Click to move image • Hold Ctrl to halve opacity
                </div>
            </div>
        `;

        document.body.appendChild(panel);

        const fileInput = panel.querySelector('.overlay-file');
        const xInput = panel.querySelector('.overlay-x');
        const yInput = panel.querySelector('.overlay-y');
        const scaleInput = panel.querySelector('.overlay-scale');
        const opacityInput = panel.querySelector('.overlay-opacity');
        const collapseBtn = panel.querySelector('.overlay-collapse');
        const content = panel.querySelector('.overlay-content');
        const lockCheckbox = panel.querySelector('.overlay-lock');
        const header = panel.querySelector('.overlay-header');

        // Upload
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function(evt) {
                imageUrl = evt.target.result;
                img.src = imageUrl;
                updatePosition();
            };
            reader.readAsDataURL(file);
        });

        // Inputs
        xInput.addEventListener('input', () => {
            offsetX = parseInt(xInput.value) || 0;
            updatePosition();
        });
        yInput.addEventListener('input', () => {
            offsetY = parseInt(yInput.value) || 0;
            updatePosition();
        });
        scaleInput.addEventListener('input', () => {
            scale = parseInt(scaleInput.value) || 100;
            updatePosition();
        });
        opacityInput.addEventListener('input', () => {
            updateOpacity(opacityInput.value);
        });

        lockCheckbox.addEventListener('change', () => {
            isLocked = lockCheckbox.checked;
        });

        // Collapse toggle
        let collapsed = false;
        collapseBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // prevent drag
            collapsed = !collapsed;
            content.style.display = collapsed ? 'none' : 'block';
            collapseBtn.textContent = collapsed ? '▼' : '▲';
        });

        // Dragging only from header
        let isDragging = false, dragOffsetX = 0, dragOffsetY = 0;
        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            header.style.cursor = 'grabbing';
            dragOffsetX = e.clientX - panel.offsetLeft;
            dragOffsetY = e.clientY - panel.offsetTop;
            e.preventDefault();
        });
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            panel.style.left = `${e.clientX - dragOffsetX}px`;
            panel.style.top = `${e.clientY - dragOffsetY}px`;
        });
        document.addEventListener('mouseup', () => {
            isDragging = false;
            header.style.cursor = 'grab';
        });
    }

    function appendGhostCredit() {
        const el = document.getElementById('copyright');
        if (el && !el.textContent.includes('Ghost')) {
            const span = document.createElement('span');
            span.textContent = ' | Overlay Tool by Ghost';
            span.style.color = '#4ab3f4';
            span.style.marginLeft = '6px';
            el.appendChild(span);
        }
    }

    waitForCanvas();
})();
