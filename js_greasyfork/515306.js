// ==UserScript==
// @name         猴子都会用的Bangumi bbcode辅助工具
// @namespace    https://github.com/wakabayu
// @version      1.5
// @description  在 Bangumi 文本框工具栏中添加对齐按钮、渐变生成器和图片尺寸调整功能（带预览）
// @include      /^https?:\/\/(bgm\.tv|chii\.in|bangumi\.tv)\/.*/
// @grant        none
// @author       wataame
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/515306/%E7%8C%B4%E5%AD%90%E9%83%BD%E4%BC%9A%E7%94%A8%E7%9A%84Bangumi%20bbcode%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/515306/%E7%8C%B4%E5%AD%90%E9%83%BD%E4%BC%9A%E7%94%A8%E7%9A%84Bangumi%20bbcode%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let previewWindow = null;
    let lastSelectedText = '';

    // 防抖函数
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // 安全执行函数
    function safelyExecute(func, errorMessage) {
        try {
            return func();
        } catch (error) {
            console.error(error);
            alert(errorMessage || '操作失败，请重试');
            return null;
        }
    }

    // 添加对齐和渐变按钮
    function addToolbarButtons() {
        document.querySelectorAll('.markItUpHeader').forEach(toolbar => {
            if (toolbar.querySelector('.alignmentButton') || toolbar.querySelector('.gradientButton')) return;
            const textarea = toolbar.closest('.markItUpContainer').querySelector('textarea');
            if (!textarea) return;
            const alignments = [
                { label: '◧L', bbcode: 'left', title: '左对齐 [left]' },
                { label: '▣C', bbcode: 'center', title: '居中对齐 [center]' },
                { label: '◨R', bbcode: 'right', title: '右对齐 [right]' }
            ];
            alignments.forEach(alignment => addButton(toolbar, alignment.label, alignment.title, () => applyBBCode(textarea, alignment.bbcode)));
            addButton(toolbar, '渐变', '生成渐变文字', () => {
                const selectedText = getSelectedText(textarea);
                if (!selectedText) return alert('请先选中需要应用渐变的文字');
                openColorPicker(selectedText, textarea);
            });
        });
    }

    function addButton(toolbar, label, title, onClick) {
        const button = document.createElement('a');
        button.href = 'javascript:void(0);';
        button.className = `${title.includes('对齐') ? 'alignmentButton' : 'gradientButton'}`;
        button.title = title;
        button.innerHTML = `<span style="font-weight: bold; margin: 0 8px;">${label}</span>`;
        button.onclick = onClick;
        button.style.margin = '0 6px';
        toolbar.appendChild(button);
    }

    function applyBBCode(textarea, bbcode) {
        const selectedText = getSelectedText(textarea);
        const wrappedText = `[${bbcode}]${selectedText}[/${bbcode}]`;
        replaceSelectedText(textarea, wrappedText);
    }

    function getSelectedText(textarea) {
        return textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
    }

    function replaceSelectedText(textarea, newText) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        textarea.setRangeText(newText, start, end, 'end');
    }

    // 创建通用弹窗
    function createPopup(id, content) {
        const popup = document.createElement('div');
        popup.id = id;
        popup.style = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #fff;
            padding: 20px;
            border: 1px solid #ccc;
            z-index: 9999;
            box-shadow: 0 0 10px rgba(0,0,0,0.1)
        `;
        popup.innerHTML = content;
        return popup;
    }

    // 颜色选择器相关函数
    function openColorPicker(selectedText, textarea) {
        if (document.getElementById('colorPickerContainer')) return;
        const colorPickerContainer = createPopup('colorPickerContainer', `
            <label>选择起始颜色：<input type="color" value="#0ebeff" id="startColor"></label><br>
            <label>选择结束颜色：<input type="color" value="#5e95e6" id="endColor"></label><br>
            <label>输入步数：<input type="number" min="1" value="${selectedText.length}" id="steps"></label><br>
            <button id="generate">生成</button> <button id="cancel">取消</button><br>
            <div id="historyContainer" style="margin-top: 10px;"><strong>最近使用的方案:</strong><br></div>
        `);
        document.body.appendChild(colorPickerContainer);
        loadGradientHistory();

        document.querySelector('#generate').onclick = () => {
            const startColor = document.querySelector('#startColor').value;
            const endColor = document.querySelector('#endColor').value;
            const steps = parseInt(document.querySelector('#steps').value);
            if (isNaN(steps) || steps <= 0) return alert('请输入有效的步数');
            const gradientText = generateGradientText(selectedText, startColor, endColor, steps);
            replaceSelectedText(textarea, gradientText);
            saveGradientHistory(startColor, endColor);
            closePopup(colorPickerContainer);
        };

        document.querySelector('#cancel').onclick = () => closePopup(colorPickerContainer);
    }

    function generateGradientText(text, startColor, endColor, steps) {
        const startRGB = hexToRgb(startColor), endRGB = hexToRgb(endColor);
        const segmentLength = Math.ceil(text.length / steps);
        return Array.from({ length: steps }, (_, i) => {
            const ratio = i / (steps - 1);
            const color = `#${rgbToHex(interpolate(startRGB.r, endRGB.r, ratio))}${rgbToHex(interpolate(startRGB.g, endRGB.g, ratio))}${rgbToHex(interpolate(startRGB.b, endRGB.b, ratio))}`;
            return `[color=${color}]${text.slice(i * segmentLength, (i + 1) * segmentLength)}[/color]`;
        }).join('');
    }

    function interpolate(start, end, ratio) {
        return clamp(Math.round(start + ratio * (end - start)));
    }

    const clamp = value => Math.max(0, Math.min(255, value));
    const hexToRgb = hex => ({ r: parseInt(hex.slice(1, 3), 16), g: parseInt(hex.slice(3, 5), 16), b: parseInt(hex.slice(5, 7), 16) });
    const rgbToHex = value => value.toString(16).padStart(2, '0');

    function closePopup(container) {
        document.body.removeChild(container);
    }

    function saveGradientHistory(startColor, endColor) {
        const history = JSON.parse(localStorage.getItem('gradientHistory') || '[]');
        const newEntry = { start: startColor, end: endColor };
        if (!history.some(entry => entry.start === startColor && entry.end === endColor)) {
            history.unshift(newEntry);
            if (history.length > 5) history.pop();
            localStorage.setItem('gradientHistory', JSON.stringify(history));
        }
    }

    function loadGradientHistory() {
        const historyContainer = document.querySelector('#historyContainer');
        const history = JSON.parse(localStorage.getItem('gradientHistory') || '[]');
        historyContainer.innerHTML = '<strong>最近方案:</strong><br>';
        history.forEach((entry, index) => {
            const historyButton = document.createElement('button');
            historyButton.style = `background: linear-gradient(to right, ${entry.start}, ${entry.end}); border: none; color: #fff; padding: 5px; margin: 2px; cursor: pointer;`;
            historyButton.innerText = `方案 ${index + 1}`;
            historyButton.onclick = () => {
                document.querySelector('#startColor').value = entry.start;
                document.querySelector('#endColor').value = entry.end;
            };
            historyContainer.appendChild(historyButton);
        });
    }

    // 图片尺寸调整相关函数
    function createOrUpdatePreviewWindow(selectedText, textarea) {
        if (previewWindow) previewWindow.remove();
        previewWindow = createPopup('imgSizeSelector', `
            <div style="text-align: center; margin-bottom: 15px;">
                <strong>调整图片尺寸</strong>
            </div>
            <div id="previewArea" style="
                margin: 10px auto;
                text-align: center;
                max-height: 300px;
                overflow: auto;
                border: 1px solid #ddd;
                padding: 10px;
            ">
                <img id="previewImage" style="max-width: 100%; height: auto;" />
            </div>
            <div id="sizeInfo" style="margin: 10px 0; text-align: center; font-size: 14px;"></div>
            <div style="display: flex; justify-content: center; gap: 10px; margin: 15px 0;">
                <div id="presetButtons" style="display: flex; gap: 5px;"></div>
            </div>
            <div style="display: flex; justify-content: center; gap: 10px; margin: 15px 0;">
                <input type="number" id="customWidth" placeholder="宽度" style="width: 80px; padding: 5px;">
                <span style="line-height: 30px;">×</span>
                <input type="number" id="customHeight" placeholder="高度" style="width: 80px; padding: 5px;">
                <button id="lockRatio" style="padding: 0 8px;" title="锁定宽高比">🔒</button>
            </div>
            <div style="text-align: center; margin-top: 15px;">
                <button id="applySize" style="margin-right: 10px; padding: 5px 15px;">应用</button>
                <button id="closeWindow" style="padding: 5px 15px;">关闭</button>
            </div>
        `);
        document.body.appendChild(previewWindow);

        // 获取元素引用
        const sizeInfo = previewWindow.querySelector('#sizeInfo');
        const presetButtons = previewWindow.querySelector('#presetButtons');
        const customWidth = previewWindow.querySelector('#customWidth');
        const customHeight = previewWindow.querySelector('#customHeight');
        const lockRatioBtn = previewWindow.querySelector('#lockRatio');
        const applyButton = previewWindow.querySelector('#applySize');
        const closeButton = previewWindow.querySelector('#closeWindow');
        const previewImage = previewWindow.querySelector('#previewImage');
        const previewArea = previewWindow.querySelector('#previewArea');

        // 状态变量
        let originalWidth = 0;
        let originalHeight = 0;
        let selectedWidth = 0;
        let selectedHeight = 0;
        let isRatioLocked = true;
        let aspectRatio = 1;

        // 预设尺寸按钮
        const presets = [
            { label: '25%', value: 0.25 },
            { label: '50%', value: 0.5 },
            { label: '75%', value: 0.75 },
            { label: '100%', value: 1 }
        ];

        // 创建预设按钮
        presets.forEach(preset => {
            const button = document.createElement('button');
            button.innerText = preset.label;
            button.style = `
                padding: 5px 10px;
                cursor: pointer;
                border: 1px solid #ccc;
                border-radius: 4px;
                background: #f0f0f0;
            `;
            button.onclick = () => {
                selectedWidth = Math.round(originalWidth * preset.value);
                selectedHeight = Math.round(originalHeight * preset.value);
                updateInputs();
                highlightButton(button);
            };
            presetButtons.appendChild(button);
        });

        // 锁定比例按钮
        lockRatioBtn.style.background = isRatioLocked ? '#4a4a4a' : '#f0f0f0';
        lockRatioBtn.style.color = isRatioLocked ? '#fff' : '#000';
        lockRatioBtn.onclick = () => {
            isRatioLocked = !isRatioLocked;
            lockRatioBtn.style.background = isRatioLocked ? '#4a4a4a' : '#f0f0f0';
            lockRatioBtn.style.color = isRatioLocked ? '#fff' : '#000';
        };

        function updateInputs() {
            customWidth.value = selectedWidth;
            customHeight.value = selectedHeight;
            updateSizeInfo();
            updatePreview();
        }

        function updateSizeInfo() {
            const widthPercent = Math.round((selectedWidth / originalWidth) * 100);
            const heightPercent = Math.round((selectedHeight / originalHeight) * 100);
            sizeInfo.textContent = `当前: ${selectedWidth} × ${selectedHeight} (${widthPercent}%)
                               原始: ${originalWidth} × ${originalHeight}`;
        }

        function updatePreview() {
            if (previewImage) {
                // 添加加载提示
                previewImage.style.opacity = '0.3';
                previewImage.style.transition = 'opacity 0.3s';

                previewImage.onload = () => {
                    previewImage.style.opacity = '1';
                };

                previewImage.style.width = `${selectedWidth}px`;
                previewImage.style.height = `${selectedHeight}px`;

                // 调整预览区域的大小
                const maxPreviewWidth = Math.min(selectedWidth, window.innerWidth * 0.8);
                const maxPreviewHeight = Math.min(selectedHeight, 300);
                previewArea.style.width = `${maxPreviewWidth}px`;
                previewArea.style.height = `${maxPreviewHeight}px`;

                // 如果图片尺寸超过预览区域，添加提示
                if (selectedWidth > maxPreviewWidth || selectedHeight > maxPreviewHeight) {
                    previewArea.title = '图片已按比例缩放以适应预览窗口';
                } else {
                    previewArea.title = '';
                }
            }
        }

        function highlightButton(activeButton) {
            presetButtons.querySelectorAll('button').forEach(btn => {
                btn.style.background = '#f0f0f0';
                btn.style.color = '#000';
            });
            activeButton.style.background = '#4a4a4a';
            activeButton.style.color = '#fff';
        }

        function clearButtonHighlight() {
            presetButtons.querySelectorAll('button').forEach(btn => {
                btn.style.background = '#f0f0f0';
                btn.style.color = '#000';
            });
        }

        // 添加拖动调整大小功能
        function addResizeDrag(previewImage) {
            let isResizing = false;
            let startX, startY, startWidth, startHeight;

            previewImage.style.cursor = 'se-resize';

            previewImage.addEventListener('mousedown', (e) => {
                isResizing = true;
                startX = e.clientX;
                startY = e.clientY;
                startWidth = selectedWidth;
                startHeight = selectedHeight;

                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', () => {
                    isResizing = false;
                    document.removeEventListener('mousemove', handleMouseMove);
                }, { once: true });
            });

            function handleMouseMove(e) {
                if (!isResizing) return;

                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;

                if (isRatioLocked) {
                    // 保持宽高比
                    const ratio = Math.abs(deltaX) > Math.abs(deltaY) ? deltaX / startWidth : deltaY / startHeight;
                    selectedWidth = Math.max(10, Math.round(startWidth * (1 + ratio)));
                    selectedHeight = Math.max(10, Math.round(startHeight * (1 + ratio)));
                } else {
                    selectedWidth = Math.max(10, startWidth + deltaX);
                    selectedHeight = Math.max(10, startHeight + deltaY);
                }

                updateInputs();
            }
        }

        // 输入框事件处理
        customWidth.oninput = () => {
            const width = parseInt(customWidth.value);
            if (width > 0) {
                selectedWidth = width;
                if (isRatioLocked) {
                    selectedHeight = Math.round(width / aspectRatio);
                    customHeight.value = selectedHeight;
                }
                updateSizeInfo();
                updatePreview();
                clearButtonHighlight();
            }
        };

        customHeight.oninput = () => {
            const height = parseInt(customHeight.value);
            if (height > 0) {
                selectedHeight = height;
                if (isRatioLocked) {
                    selectedWidth = Math.round(height * aspectRatio);
                    customWidth.value = selectedWidth;
                }
                updateSizeInfo();
                updatePreview();
                clearButtonHighlight();
            }
        };

        // 按钮事件处理
        closeButton.onclick = () => {
            previewWindow.remove();
            lastSelectedText = '';
        };

        applyButton.onclick = () => {
            if (selectedWidth && selectedHeight) {
                const imgTagRegex = /\[img(?:=(\d+),(\d+))?\](https?:\/\/[^\s]+)\[\/img\]/;
                const match = selectedText.match(imgTagRegex);
                if (match) {
                    const imgURL = match[3];
                    const newCode = `[img=${selectedWidth},${selectedHeight}]${imgURL}[/img]`;
                    textarea.value = textarea.value.replace(selectedText, newCode);
                }
            }
            previewWindow.remove();
            lastSelectedText = '';
        };

        // 解析当前BBCode并获取图片信息
        const imgTagRegex = /\[img(?:=(\d+),(\d+))?\](https?:\/\/[^\s]+)\[\/img\]/;
        const match = selectedText.match(imgTagRegex);
        if (!match) {
            previewWindow.remove();
            return;
        }

        const initialWidth = match[1] ? parseInt(match[1], 10) : null;
        const initialHeight = match[2] ? parseInt(match[2], 10) : null;
        const imgURL = match[3];

        // 获取图片原始尺寸
        const tempImg = new Image();
        tempImg.onload = () => {
            originalWidth = tempImg.naturalWidth;
            originalHeight = tempImg.naturalHeight;
            aspectRatio = originalWidth / originalHeight;

            // 设置预览图片的源
            previewImage.src = tempImg.src;

            // 添加拖动调整大小功能
            addResizeDrag(previewImage);

            if (initialWidth && initialHeight) {
                selectedWidth = initialWidth;
                selectedHeight = initialHeight;
                const scale = initialWidth / originalWidth;
                const percentage = Math.round(scale * 100);
                updateInputs();
                // 选中对应预设按钮
                presetButtons.querySelectorAll('button').forEach((btn, index) => {
                    if (percentage === presets[index].value * 100) {
                        highlightButton(btn);
                    }
                });
            } else {
                selectedWidth = originalWidth;
                selectedHeight = originalHeight;
                updateInputs();
                highlightButton(presetButtons.lastElementChild); // 100%
            }
        };
        tempImg.src = imgURL;
    }

    // 监听文本选择变化
    const debouncedHandleSelectionChange = debounce(handleSelectionChange, 250);
    document.addEventListener('selectionchange', debouncedHandleSelectionChange);

    function handleSelectionChange() {
        const textarea = document.activeElement;
        if (textarea && textarea.tagName === 'TEXTAREA') {
            const selectedText = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd).trim();
            if (selectedText !== lastSelectedText && selectedText.match(/\[img(?:=(\d+),(\d+))?\]https?:\/\/[^\s]+\[\/img\]/)) {
                createOrUpdatePreviewWindow(selectedText, textarea);
                lastSelectedText = selectedText;
            }
        }
    }

    // 初始化
    const observer = new MutationObserver(() => addToolbarButtons());
    observer.observe(document.body, { childList: true, subtree: true });
})();