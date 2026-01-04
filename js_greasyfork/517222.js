// ==UserScript==
// @name         Danbooru Strip
// @description  Strip Danbooru images with your mouse
// @version      0.1.4
// @namespace    https://github.com/andre-atgit/danbooru-strip/
// @match        *://danbooru.donmai.us/posts/*
// @icon         https://danbooru.donmai.us/favicon.svg
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/517222/Danbooru%20Strip.user.js
// @updateURL https://update.greasyfork.org/scripts/517222/Danbooru%20Strip.meta.js
// ==/UserScript==

/* jshint esversion: 8 */

(function() {
    'use strict';

    const strip = { isLoaded: false };
    appendStripOnPageLoad();

    function appendStripOnPageLoad() {
        const parentNotice = document.getElementsByClassName('post-notice-parent');
        const childNotice = document.getElementsByClassName('post-notice-child');
        if (!parentNotice.length && !childNotice.length) return;

        const currentPost = document.getElementsByClassName('current-post');
        const intervalId = setInterval(() => {
            if (currentPost.length) {
                appendCss();
                appendStripTags();
                clearInterval(intervalId);
            }
        }, 100);
    }

    function appendCss() {
        const style = document.createElement('style');
        document.head.appendChild(style);
        style.innerHTML = `
        .strip-preview-tag {
            border-radius: 0px 0px 5px 5px;
            color: white;
            text-align: center;
        }

        .post-status-has-children .strip-preview-tag {
            background-color: var(--preview-has-children-color);
        }

        .post-status-has-parent .strip-preview-tag {
            background-color: var(--preview-has-parent-color);
        }

        #strip-canvas-container {
            position: relative;
            width: fit-content;
        }

        #strip-full-view-container {
            display: none;
            position: fixed;
            z-index: 1;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: #0E0E0E;
        }

        #strip-canvas-container .fit {
            max-width: 100%;
            height: auto !important
        }

        #strip-full-view-container .fit {
            max-height: 100%;
            max-width: 100%;
            position: fixed !important;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }

        #strip-drawing-layer {
            position: absolute;
            z-index: 1;
        }

        #strip-cursor-layer {
            position: relative;
            z-index: 2;
        }`;
    }

    function appendStripTags() {
        const previewElements = document.getElementsByClassName('post-preview-container');
        if (!previewElements || previewElements.length < 2) return;

        for (const previewElement of previewElements) {
            const previewLinkElem = previewElement.getElementsByClassName('post-preview-link')[0];
            const apiLink = previewLinkElem.href.split('?')[0] + '.json';

            const p = document.createElement('p');
            p.classList.add('strip-preview-tag', 'cursor-pointer');
            previewElement.after(p);

            if (previewElement.parentElement.classList.contains('current-post')) {
                p.innerHTML = 'Current';
                strip.topImageApiLink = apiLink;
            } else {
                p.innerHTML = '<a>Strip!</a>';
                p.onclick = (evt) => {
                    const currentlySelected = document.getElementById('strip-selected');
                    if (currentlySelected) currentlySelected.parentElement.innerHTML = '<a>Strip!</a>';
                    evt.currentTarget.innerHTML = '<span id="strip-selected">Selected</span>';

                    strip.bottomImageLink = apiLink;
                    initCanvas();
                };
            }
        }
    }

    async function initCanvas() {
        if (strip.isLoaded) {
            await fetchData();
            loadImgs();
            return;
        }

        strip.isLoaded = true;
        strip.lineWidth = 100;
        strip.isDrawing = false;

        strip.undoHistory = [];
        strip.redoHistory = [];

        strip.prevX = null;
        strip.prevY = null;
        strip.currentX = null;
        strip.currentY = null;

        appendCanvas();
        appendOptions();
        await fetchData();
        loadImgs();
        addEvents();
        addHotkeys();
    }

    function appendCanvas() {
        const content = document.createElement('div');
        content.innerHTML = `
        <div id="strip-canvas-container">
            <canvas id="strip-drawing-layer" class="fit"></canvas>
            <canvas id="strip-cursor-layer" oncontextmenu="return false" onselectstart="return false" class="fit"> </canvas>
        </div>
        <div id="strip-full-view-container"></div>`;

        const containers = content.children;
        strip.canvasContainer = containers[0];
        strip.fullViewContainer = containers[1];
        strip.fullViewContainer.onmousedown = (evt) => (evt.target === strip.fullViewContainer) && toggleFullView();

        const canvases = content.getElementsByTagName('canvas');
        strip.drawingLayer = canvases[0];
        strip.cursorLayer = canvases[1];

        strip.drawingCtx = strip.drawingLayer.getContext('2d');
        strip.cursorCtx = strip.cursorLayer.getContext('2d');

        const resizeNotice = document.getElementById('image-resize-notice');
        if (resizeNotice) resizeNotice.style.display = 'none';

        const image = document.getElementById('image');
        const imageSection = image.closest('section');
        for (const child of imageSection.children) {
            child.style.display = 'none';
        }

        imageSection.appendChild(strip.canvasContainer);
        imageSection.appendChild(strip.fullViewContainer);
    }

    function appendOptions() {
        const stripOptions = document.createElement('section');
        stripOptions.innerHTML = `
        <h2>Strip</h2>
        <ul>
            <li><a class="cursor-pointer" title="Shortcut is esc">Toggle full view</a></li>
            <li><a class="cursor-pointer" title="Ctrl + z">Undo</a></li>
            <li><a class="cursor-pointer" title="Ctrl + y">Redo</a></li>
            <li><a class="cursor-pointer">Download strip</a></li>
            <li><a class="cursor-pointer" title="Shortcut is + and -">Brush width</a></li>
            <li><input type="range" min="1" max="400" value="100"></li>
        </ul>`;

        const options = stripOptions.getElementsByTagName('a');
        options[0].onclick = () => toggleFullView();
        options[1].onclick = () => undo();
        options[2].onclick = () => redo();
        options[3].onclick = () => download();

        strip.lineWidthInput = stripOptions.getElementsByTagName('input')[0];
        strip.lineWidthInput.onchange = (evt) => setLineWidth(Number(evt.target.value));

        const sidebar = document.getElementById('sidebar');
        sidebar.appendChild(stripOptions);
    }

    async function fetchData() {
        const topImageRequest = fetch(strip.topImageApiLink).then((res) => res.json());
        const bottomImageRequest = fetch(strip.bottomImageLink).then((res) => res.json());

        const [topImageData, bottomImageData] = await Promise.all([topImageRequest, bottomImageRequest]);
        const image = document.getElementById('image');

        const topVariant = topImageData.media_asset.variants.find((variant) => variant.width === image.naturalWidth);
        const bottomVariant = bottomImageData.media_asset.variants.find((variant) => variant.width === image.naturalWidth);

        strip.topImageUrl = topVariant ? topVariant.url : topImageData.file_url;
        strip.bottomImageUrl = bottomVariant ? bottomVariant.url : bottomImageData.file_url;
    }

    function loadImgs() {
        const topImg = new Image();
        const bottomImg = new Image();

        topImg.crossOrigin = 'anonymous';
        topImg.src = strip.topImageUrl;

        bottomImg.crossOrigin = 'anonymous';
        bottomImg.src = strip.bottomImageUrl;

        topImg.onload = () => {
            strip.topImage = topImg;
            if (strip.bottomImage) drawImgs();
        };

        bottomImg.onload = () => {
            strip.bottomImage = bottomImg;
            if (strip.topImage) drawImgs();
        };
    }

    function drawImgs() {
        strip.cursorLayer.width = strip.drawingLayer.width = strip.topImage.width;
        strip.cursorLayer.height = strip.drawingLayer.height = strip.topImage.height;
        strip.drawingCtx.drawImage(strip.undoHistory.at(-1) || strip.topImage, 0, 0);
    }

    function addEvents() {
        strip.cursorLayer.addEventListener('pointerenter', (evt) => {
            strip.prevX = strip.currentX = evt.offsetX;
            strip.prevY = strip.currentY = evt.offsetY;

            if (evt.pressure) {
                strip.isDrawing = true;
            }

            if (!evt.pressure && strip.isDrawing) {
                strip.isDrawing = false;
                addStrokeToHistory();
            }
        });

        strip.cursorLayer.addEventListener('pointermove', (evt) => {
            strip.prevX = strip.currentX;
            strip.prevY = strip.currentY;
            strip.currentX = evt.offsetX;
            strip.currentY = evt.offsetY;
            drawCursor(strip.currentX, strip.currentY);

            if (evt.buttons & 1) {
                strip.isDrawing = true;
                drawLine(strip.prevX, strip.prevY, strip.currentX, strip.currentY, strip.bottomImage);
            }
            else if (evt.buttons & 2) {
                strip.isDrawing = true;
                drawLine(strip.prevX, strip.prevY, strip.currentX, strip.currentY, strip.topImage);
            }
        });

        strip.cursorLayer.addEventListener('pointerleave', (evt) => {
            strip.currentX = null;
            strip.currentY = null;
            clearCursor();
        });

        strip.cursorLayer.addEventListener('pointerdown', (evt) => {
            drawCursor(strip.currentX, strip.currentY);

            if (evt.buttons & 1) {
                strip.isDrawing = true;
                drawArc(evt.offsetX, evt.offsetY, strip.bottomImage);
            }
            else if (evt.buttons & 2) {
                strip.isDrawing = true;
                drawArc(evt.offsetX, evt.offsetY, strip.topImage);
            }
        });

        strip.cursorLayer.addEventListener('pointerup', (evt) => {
            strip.isDrawing = false;
            addStrokeToHistory();
        });

        strip.cursorLayer.addEventListener('touchmove', (evt) => {
            if (evt.changedTouches.length === 1) evt.preventDefault();
        });
    }

    function addHotkeys() {
        document.addEventListener('keydown', (evt) => {
            if (document.activeElement.value !== undefined) return;
            switch (evt.key) {
                case '+':
                    setLineWidth(strip.lineWidth + 1);
                    break;
                case '-':
                    setLineWidth(Math.max(strip.lineWidth - 1, 1));
                    break;
                case 'Escape':
                    evt.preventDefault();
                    toggleFullView();
                    break;
                case 'z':
                    if (evt.ctrlKey && undo()) {
                        evt.preventDefault();
                    }
                    break;
                case 'y':
                    if (evt.ctrlKey && redo()) {
                        evt.preventDefault();
                    }
                    break;
            }
        });
    }

    function drawArc(x, y, overlay) {
        const scale = getScale();
        strip.drawingCtx.globalCompositeOperation = 'destination-out';
        strip.drawingCtx.beginPath();
        strip.drawingCtx.arc(x / scale, y / scale, strip.lineWidth / 2, 0, Math.PI * 2);
        strip.drawingCtx.fill();

        strip.drawingCtx.globalCompositeOperation = 'destination-over';
        strip.drawingCtx.drawImage(overlay, 0, 0);
    }

    function drawLine(x1, y1, x2, y2, overlay) {
        const scale = getScale();
        strip.drawingCtx.globalCompositeOperation = 'destination-out';
        strip.drawingCtx.beginPath();
        strip.drawingCtx.lineWidth = strip.lineWidth;
        strip.drawingCtx.lineJoin = 'round';
        strip.drawingCtx.moveTo(x1 / scale, y1 / scale);
        strip.drawingCtx.lineTo(x2 / scale, y2 / scale);
        strip.drawingCtx.closePath();
        strip.drawingCtx.stroke();

        strip.drawingCtx.globalCompositeOperation = 'destination-over';
        strip.drawingCtx.drawImage(overlay, 0, 0);
    }

    function drawCursor(x, y) {
        const scale = getScale();
        strip.cursorCtx.clearRect(0, 0, strip.cursorLayer.width, strip.cursorLayer.height);
        strip.cursorCtx.beginPath();
        strip.cursorCtx.arc(x / scale, y / scale, strip.lineWidth / 2, 0, Math.PI * 2);
        strip.cursorCtx.lineWidth = 1;
        strip.cursorCtx.strokeStyle = 'black';
        strip.cursorCtx.fillStyle = 'transparent';
        strip.cursorCtx.stroke();
    }

    function clearCursor() {
        strip.cursorCtx.clearRect(0, 0, strip.cursorLayer.width, strip.cursorLayer.height);
    }

    function getScale() {
        return strip.cursorLayer.getBoundingClientRect().width / strip.cursorLayer.width;
    }

    function setLineWidth(width) {
        strip.lineWidth = width;
        strip.lineWidthInput.value = strip.lineWidth;
        if (strip.currentX !== null) drawCursor(strip.currentX, strip.currentY);
    }

    function addStrokeToHistory() {
        const historyEntry = document.createElement('canvas');
        historyEntry.width = strip.drawingLayer.width;
        historyEntry.height  = strip.drawingLayer.height;

        const context = historyEntry.getContext('2d');
        context.drawImage(strip.drawingLayer, 0, 0);

        strip.redoHistory = [];
        strip.undoHistory.push(historyEntry);
    }

    function undo() {
        if (strip.isDrawing) {
            strip.isDrawing = false;
            addStrokeToHistory();
        }

        if (!strip.undoHistory.length) return false;
        strip.redoHistory.push(strip.undoHistory.pop());

        strip.drawingCtx.globalCompositeOperation = 'source-over';
        strip.drawingCtx.drawImage(strip.undoHistory.at(-1) || strip.topImage, 0, 0);
        return true;
    }

    function redo() {
        if (strip.isDrawing) {
            strip.isDrawing = false;
            addStrokeToHistory();
        }

        if (!strip.redoHistory.length) return false;
        strip.undoHistory.push(strip.redoHistory.pop());

        strip.drawingCtx.globalCompositeOperation = 'source-over';
        strip.drawingCtx.drawImage(strip.undoHistory.at(-1), 0, 0);
        return true;
    }

    function download() {
        const link = document.createElement('a');
        link.href = strip.drawingLayer.toDataURL('image/png');
        link.download = 'strip.png';
        link.click();
    }

    function toggleFullView() {
        if (strip.fullViewContainer.style.display !== 'block') {
            strip.fullViewContainer.style.display = 'block';
            while (strip.canvasContainer.firstChild) {
                strip.fullViewContainer.appendChild(strip.canvasContainer.firstChild);
            }
        } else {
            strip.fullViewContainer.style.display = 'none';
            while (strip.fullViewContainer.firstChild) {
                strip.canvasContainer.appendChild(strip.fullViewContainer.firstChild);
            }
        }
    }
})();
