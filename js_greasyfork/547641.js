// ==UserScript==
// @name         NovelAI Image Helper
// @name:zh-CN   NovelAI 局部放大重绘
// @version      3.1
// @description  Adds a floating image toolkit on novelai.net for cropping and splicing images with specific constraints.
// @description:zh-CN 在 novelai.net 网站上添加一个浮动的图片工具箱，用于按特定规则裁剪和拼接图片。
// @author       axing
// @match        https://novelai.net/*
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.1/cropper.min.js
// @namespace https://greasyfork.org/users/1285713
// @downloadURL https://update.greasyfork.org/scripts/547641/NovelAI%20Image%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/547641/NovelAI%20Image%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 注入 Cropper.js 的 CSS
    const cropperCSS = document.createElement('link');
    cropperCSS.rel = 'stylesheet';
    cropperCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.1/cropper.min.css';
    document.head.appendChild(cropperCSS);

    // 2. 创建 HTML 结构
    const panel = document.createElement('div');
    panel.id = 'nai-helper-panel';
    panel.innerHTML = `
        <div id="nai-helper-header">
            🖼️ 图片助手 (可拖动)
            <button id="nai-helper-btn-minimize" title="最小化">_</button>
        </div>
        <div id="nai-helper-content">
            <div class="nai-helper-image-container" id="nai-helper-container-a">
                <p>图片A (原图): 将图片拖拽至此</p>
                <img id="nai-helper-image-a" style="display:none; max-width: 100%;">
                <canvas id="nai-helper-canvas-a" style="display:none;"></canvas>
            </div>
            <div id="nai-helper-status-bar">请先将图片A拖拽至上方区域</div>
            <div class="nai-helper-controls">
                <div class="nai-helper-control-group">
                    <label for="nai-helper-scale-input">缩放倍率:</label>
                    <input type="number" id="nai-helper-scale-input" value="1.5" step="0.1" min="0.1">
                    <button id="nai-helper-btn-crop">✂️ 裁剪</button>
                </div>
                 <div class="nai-helper-control-group">
                    <button id="nai-helper-btn-splice">🧩 拼接</button>
                    <button id="nai-helper-btn-download" style="display:none;">📥 下载结果</button>
                 </div>
            </div>
            <div class="nai-helper-image-row">
                <div class="nai-helper-image-container-small" id="nai-helper-container-b">
                    <p>图片B (自行复制粘贴)</p>
                    <canvas id="nai-helper-canvas-b"></canvas>
                </div>
                <div class="nai-helper-image-container-small" id="nai-helper-container-c">
                    <p>图片C (拼接目标)</p>
                    <img id="nai-helper-image-c" style="display:none; max-width: 100%;">
                    <input type="file" id="nai-helper-file-c" class="nai-helper-file-input" accept="image/*">
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(panel);

    const restoreBtn = document.createElement('button');
    restoreBtn.id = 'nai-helper-restore-btn';
    restoreBtn.title = '展开图片助手';
    restoreBtn.textContent = '🖼️';
    document.body.appendChild(restoreBtn);

    // 3. 添加 CSS 样式
    GM_addStyle(`
        #nai-helper-panel {
            position: fixed; width: 420px;
            background-color: #2c2c2c; border: 1px solid #555; border-radius: 8px;
            z-index: 99999; color: #eee; font-family: sans-serif; box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        }
        #nai-helper-restore-btn {
            position: fixed;
            width: 48px; height: 48px;
            background-color: rgba(60, 70, 90, 0.9); border: 2px solid rgba(255, 255, 255, 0.4);
            border-radius: 50%; z-index: 99999; color: #eee;
            font-size: 24px; line-height: 44px; text-align: center;
            cursor: move; display: none;
            box-shadow: 0 3px 10px rgba(0,0,0,0.4);
            transition: transform 0.2s ease, background-color 0.2s ease;
        }
        #nai-helper-restore-btn:hover {
            background-color: rgba(80, 90, 110, 0.95);
            transform: scale(1.1);
        }
        #nai-helper-header {
            position: relative; padding: 10px; cursor: move; background-color: #3a3a3a;
            border-bottom: 1px solid #555; border-radius: 8px 8px 0 0; text-align: center; font-weight: bold;
        }
        #nai-helper-btn-minimize {
            position: absolute; top: 50%; left: 10px; /* <-- 修改处 */
            transform: translateY(-50%);
            width: 24px; height: 24px; background: #505050; border: 1px solid #666;
            color: #ddd; font-weight: bold; line-height: 22px; text-align: center; cursor: pointer; border-radius: 4px;
        }
        #nai-helper-btn-minimize:hover { background: #656565; }
        #nai-helper-content {
            padding: 15px; display: flex; flex-direction: column; gap: 15px;
        }
        .nai-helper-image-container, .nai-helper-image-container-small {
            background-color: #1e1e1e; border: 2px dashed #444; border-radius: 5px; padding: 10px;
            text-align: center; position: relative; min-height: 100px; display: flex;
            align-items: center; justify-content: center; flex-direction: column; transition: border-color 0.2s;
        }
        .nai-helper-image-container p, .nai-helper-image-container-small p { color: #888; margin-bottom: 5px; }
        .nai-helper-image-container-small { min-height: 80px; }
        .nai-helper-image-row { display: flex; gap: 10px; }
        .nai-helper-image-row > div { flex: 1; }
        #nai-helper-panel img, #nai-helper-panel canvas { max-width: 100%; border-radius: 4px; }
        .nai-helper-file-input {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer;
        }
        .nai-helper-controls { display: flex; flex-direction: column; gap: 10px; }
        .nai-helper-control-group { display: flex; align-items: center; gap: 10px; }
        .nai-helper-control-group label { flex-shrink: 0; }
        #nai-helper-panel button {
            padding: 0; height: 30px; border: none; background-color: #5a5a5a; color: white;
            border-radius: 5px; cursor: pointer; flex-grow: 1;
        }
        #nai-helper-panel button:hover { background-color: #6a6a6a; }
        #nai-helper-panel input[type="number"] {
            width: 60px; padding: 5px; background-color: #1e1e1e; border: 1px solid #555;
            color: white; border-radius: 3px;
        }
        #nai-helper-status-bar {
            background-color: #1a1a1a; padding: 8px; text-align: center;
            border-radius: 4px; font-size: 0.9em; color: #aaa;
        }
        .cropper-view-box { outline-color: rgba(0, 173, 255, 0.75); }
    `);

    // 4. 变量和状态管理
    const header = document.getElementById('nai-helper-header');
    const btnMinimize = document.getElementById('nai-helper-btn-minimize');
    const imgA = document.getElementById('nai-helper-image-a');
    const canvasA = document.getElementById('nai-helper-canvas-a');
    const containerA = document.getElementById('nai-helper-container-a');
    const canvasB = document.getElementById('nai-helper-canvas-b');
    const ctxB = canvasB.getContext('2d');
    const imgC = document.getElementById('nai-helper-image-c');
    const fileC = document.getElementById('nai-helper-file-c');
    const containerC = document.getElementById('nai-helper-container-c');
    const btnCrop = document.getElementById('nai-helper-btn-crop');
    const btnSplice = document.getElementById('nai-helper-btn-splice');
    const btnDownload = document.getElementById('nai-helper-btn-download');
    const scaleInput = document.getElementById('nai-helper-scale-input');
    const statusBar = document.getElementById('nai-helper-status-bar');

    let cropper = null; let originalA_URL = null; let cropData = null;
    const roundTo64 = (num) => Math.round(num / 64) * 64;

    // 5. 功能实现

    // 计算并设置初始位置
    const initialTop = 50;
    const initialRight = 20;
    const initialLeft = window.innerWidth - panel.offsetWidth - initialRight;
    panel.style.top = `${initialTop}px`;
    panel.style.left = `${initialLeft}px`;
    restoreBtn.style.top = `${initialTop}px`;
    restoreBtn.style.left = `${initialLeft}px`;

    // 设置初始状态为最小化
    panel.style.display = 'none';
    restoreBtn.style.display = 'block';

    makeDraggable(panel, header);
    makeDraggable(restoreBtn);

    btnMinimize.addEventListener('click', (e) => {
        e.stopPropagation();
        const panelRect = panel.getBoundingClientRect();
        restoreBtn.style.top = `${panelRect.top}px`;
        restoreBtn.style.left = `${panelRect.left}px`;
        panel.style.display = 'none';
        restoreBtn.style.display = 'block';
    });

    restoreBtn.addEventListener('click', () => {
        const iconRect = restoreBtn.getBoundingClientRect();
        panel.style.top = `${iconRect.top}px`;
        panel.style.left = `${iconRect.left}px`;
        panel.style.display = 'block';
        restoreBtn.style.display = 'none';
    });

    setupImageLoader(containerA, null, (imgElement, dataURL) => {
        if (cropper) cropper.destroy();
        imgA.src = dataURL; originalA_URL = dataURL;
        imgA.style.display = 'block'; canvasA.style.display = 'none'; btnDownload.style.display = 'none';
        imgA.onload = () => {
            cropper = new Cropper(imgA, {
                viewMode: 1, dragMode: 'move', background: false, autoCropArea: 0.8,
                crop() {
                    let data = cropper.getData(true);
                    let snappedWidth = roundTo64(data.width); let snappedHeight = roundTo64(data.height);
                    if (snappedWidth < 64) snappedWidth = 64; if (snappedHeight < 64) snappedHeight = 64;
                    statusBar.textContent = `选区尺寸: ${snappedWidth} x ${snappedHeight}`;
                },
                cropend() {
                    let data = cropper.getData(true);
                    let newX = roundTo64(data.x); let newY = roundTo64(data.y);
                    let newWidth = roundTo64(data.width); let newHeight = roundTo64(data.height);
                    if (newWidth < 64) newWidth = 64; if (newHeight < 64) newHeight = 64;
                    cropper.setData({ x: newX, y: newY, width: newWidth, height: newHeight });
                },
            });
        };
    });

    setupImageLoader(containerC, fileC, (imgElement, dataURL) => {
        imgC.src = dataURL; imgC.style.display = 'block';
        statusBar.textContent = "图片C已加载。可以进行 [拼接] 操作";
    });

    btnCrop.addEventListener('click', () => {
        if (!cropper) return alert("请先加载图片A。");
        cropData = cropper.getData(true);
        const scale = parseFloat(scaleInput.value) || 1.0;
        if (cropData.width === 0 || cropData.height === 0) return alert("裁剪区域无效。");
        const croppedCanvas = cropper.getCroppedCanvas({ width: cropData.width, height: cropData.height });
        const scaledWidth = roundTo64(cropData.width * scale); const scaledHeight = roundTo64(cropData.height * scale);
        canvasB.width = scaledWidth; canvasB.height = scaledHeight;
        ctxB.clearRect(0, 0, scaledWidth, scaledHeight);
        ctxB.drawImage(croppedCanvas, 0, 0, scaledWidth, scaledHeight);
        statusBar.textContent = `裁剪成功! 原尺寸: ${cropData.width}x${cropData.height}, 缩放后: ${scaledWidth}x${scaledHeight}`;
    });

    btnSplice.addEventListener('click', () => {
        if (!originalA_URL || !cropData || !imgC.src) return alert("请确保图片A、B、C都已就绪。");
        const originalImage = new Image();
        originalImage.onload = () => {
            canvasA.width = originalImage.naturalWidth; canvasA.height = originalImage.naturalHeight;
            const ctxA = canvasA.getContext('2d');
            ctxA.drawImage(originalImage, 0, 0);
            const tempCanvasC = document.createElement('canvas');
            tempCanvasC.width = canvasB.width; tempCanvasC.height = canvasB.height;
            tempCanvasC.getContext('2d').drawImage(imgC, 0, 0, canvasB.width, canvasB.height);
            ctxA.drawImage(tempCanvasC, cropData.x, cropData.y, cropData.width, cropData.height);
            imgA.style.display = 'none';
            if (cropper) cropper.destroy();
            cropper = null; canvasA.style.display = 'block'; btnDownload.style.display = 'inline-block';
            statusBar.textContent = "拼接完成！可以下载结果。";
        };
        originalImage.src = originalA_URL;
    });

    btnDownload.addEventListener('click', () => {
        if (canvasA.style.display === 'none') return alert("没有可下载的拼接结果。");
        const link = document.createElement('a');
        link.download = 'spliced_image.png'; link.href = canvasA.toDataURL('image/png');
        link.click();
    });

    function makeDraggable(element, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const dragHandle = handle || element;

        dragHandle.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            if (handle && e.target.id === 'nai-helper-btn-minimize') return; // Don't drag if clicking the minimize button
            e.preventDefault();
            e.stopPropagation();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e.preventDefault();
            e.stopPropagation();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = `${element.offsetTop - pos2}px`;
            element.style.left = `${element.offsetLeft - pos1}px`;
            element.style.right = 'auto';
        }

        function closeDragElement() {
            document.onmouseup = null; document.onmousemove = null;
        }
    }

    function setupImageLoader(container, fileInput, callback) {
        const dropZoneText = container.querySelector('p');
        const handleFile = (file) => {
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const imgElement = container.querySelector('img');
                    callback(imgElement, e.target.result);
                    if (container.id !== 'nai-helper-container-c' && dropZoneText) {
                        dropZoneText.style.display = 'none';
                    }
                };
                reader.readAsDataURL(file);
            }
        };
        container.addEventListener('dragover', (e) => { e.preventDefault(); e.stopPropagation(); container.style.borderColor = '#00adff'; });
        container.addEventListener('dragleave', (e) => { e.stopPropagation(); container.style.borderColor = '#444'; });
        container.addEventListener('drop', (e) => {
            e.preventDefault(); e.stopPropagation(); container.style.borderColor = '#444';
            if (e.dataTransfer.files.length > 0) handleFile(e.dataTransfer.files[0]);
        });
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) handleFile(e.target.files[0]);
            });
        }
    }
})();