// ==UserScript==
// @name         New α版の改良
// @namespace    http://tampermonkey.net/
// @version      2.04
// @description  テンプレ画像をリストから選んで追加できるように新たなボタンを追加。画像拡大機能とその設定機能を歯車としてページ右下に追加。
// @license      MIT
// @match        https://starlight.plusnao.co.jp/goods/image/edit/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502552/New%20%CE%B1%E7%89%88%E3%81%AE%E6%94%B9%E8%89%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/502552/New%20%CE%B1%E7%89%88%E3%81%AE%E6%94%B9%E8%89%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const css = `
        .zoomed-image {
            position: absolute;
            border: 7px solid #191919;
            z-index: 10000;
            pointer-events: none;
            display: none;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            transition: opacity 0.3s;
        }

        .settings-icon {
            position: fixed;
            right: 20px;
            bottom: 20px;
            font-size: 24px;
            cursor: pointer;
            z-index: 1001;
        }

        .settings-menu {
            position: fixed;
            right: 20px;
            bottom: 60px;
            border: 1px solid #ccc;
            background: white;
            padding: 10px;
            box-shadow: 0px 0px 5px rgba(0,0,0,0.5);
            display: none;
            z-index: 1002;
            max-width: 300px;
        }

        .settings-label {
            margin-bottom: 10px;
            font-weight: bold;
        }

        .settings-input-label {
            font-weight: normal;
            margin-right: 10px;
            white-space: nowrap;
        }

        .settings-input-label.shift-right {
            margin-right: 18.5px;
        }

        .settings-input {
            width: 80px;
            padding: 5px;
            margin-bottom: 10px;
            border: 1px solid #ccc;
            vertical-align: middle;
        }

        .mode-option {
            cursor: pointer;
            padding: 5px;
            border: 1px solid #ccc;
            margin-bottom: 5px;
            text-align: center;
            background: #fff;
            color: black;
            transition: background 0.3s;
        }

        .mode-option.hover {
            background: #f1f1f1;
        }

        .mode-option.selected {
            background: #007bff;
            color: white;
        }

        .zoom-position-option {
            cursor: pointer;
            padding: 5px;
            border: 1px solid #ccc;
            margin-bottom: 5px;
            text-align: center;
            background: #fff;
            color: black;
            transition: background 0.3s;
        }

        .zoom-position-option.hover {
            background: #f1f1f1;
        }

        .zoom-position-option.selected {
            background: #007bff;
            color: white;
        }

        .settings-input {
            width: 60px;
            padding: 5px;
            margin-bottom: 10px;
            border: 1px solid #ccc;
            margin-right: 5px;
        }

        .settings-input-label {
            font-weight: normal;
            margin-right: 20px;
        }

        .transparency-slider {
            width: 100%;
            margin-top: 10px;
        }

        .reset-button {
            cursor: pointer;
            padding: 10px;
            border: 1px solid;
            background: #4CAF50;
            color: white;
            text-align: center;
            margin-top: 10px;
            transition: background 0.3s, border 0.3s;
        }

        .reset-button:hover {
            background: #45a049;
            border-color: #45a049;
        }

        .reset-button.disabled {
            background: #e0e0e0;
            border-color: #bbb;
            color: #555;
            cursor: default;
        }

        .reset-button.enabled {
            background: #4CAF50;
            border-color: #4CAF50;
        }

    `;

    const style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);

    //タブタイトル変更
    let path = window.location.pathname;
    let productID = path.split('/').pop();
    document.title = `${productID} / Plusnao Web System`;

    // テンプレ画像機能
    var newButton = document.createElement('button');
    newButton.type = 'button';
    newButton.className = 'btn btn-sm btn-default';
    newButton.innerHTML = '<i class="fa fa-new-icon"></i>テンプレート画像';

    var defaultStyles = {
        webkitTextSizeAdjust: '100%',
        webkitTapHighlightColor: 'rgba(0,0,0,0)',
        boxSizing: 'border-box',
        margin: '0 5px',
        font: 'inherit',
        overflow: 'visible',
        textTransform: 'none',
        webkitAppearance: 'button',
        fontFamily: 'inherit',
        display: 'inline-block',
        marginBottom: '0',
        fontWeight: '400',
        textAlign: 'center',
        whiteSpace: 'nowrap',
        verticalAlign: 'middle',
        touchAction: 'manipulation',
        cursor: 'pointer',
        userSelect: 'none',
        backgroundImage: 'none',
        border: '1px solid transparent',
        color: '#333',
        backgroundColor: '#fff',
        borderColor: '#ccc',
        padding: '5px 10px',
        fontSize: '12px',
        lineHeight: '1.5',
        borderRadius: '3px',
        outline: 'none'
    };

    var pressedStyles = {
        backgroundColor: '#e6e6e6',
        borderColor: '#adadad',
        outline: '5px auto -webkit-focus-ring-color',
        outlineOffset: '-2px'
    };

    function applyStyles(element, styles) {
        for (var property in styles) {
            if (styles.hasOwnProperty(property)) {
                element.style[property] = styles[property];
            }
        }
    }

    function handleEscKey(event) {
        if (event.key === 'Escape') {
            var existingModal = document.querySelector('#image-modal');
            if (existingModal) {
                document.body.removeChild(existingModal);
                applyStyles(newButton, defaultStyles);
            }
        }
    }

    function showModalWithImages(imageUrls) {
        var existingModal = document.querySelector('#image-modal');
        if (existingModal) {
            document.body.removeChild(existingModal);
            applyStyles(newButton, defaultStyles);
            return;
        }

        var modal = document.createElement('div');
        modal.id = 'image-modal';
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.right = '10px';
        modal.style.transform = 'translateY(-50%)';
        modal.style.width = '400px';
        modal.style.backgroundColor = '#fff';
        modal.style.padding = '20px';
        modal.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
        modal.style.zIndex = '1000';
        modal.style.borderRadius = '5px';
        modal.style.overflowY = 'auto';
        modal.style.maxHeight = '90%';
        modal.style.display = 'grid';
        modal.style.gridTemplateColumns = 'repeat(4, 1fr)';
        modal.style.gap = '10px';
        modal.style.border = '2px solid #ccc';

        imageUrls.forEach(function(url) {
            var img = document.createElement('img');
            img.src = url;
            img.draggable = true;
            img.className = 'w80 img-thumbnail';
            img.title = '';
            img.style.display = 'block';
            img.style.marginBottom = '10px';
            img.style.cursor = 'pointer';
            modal.appendChild(img);

            img.addEventListener('dblclick', function() {
                var uploadArea = document.querySelector('#uploadArea');
                if (uploadArea) {
                    fetch(url)
                        .then(res => res.blob())
                        .then(blob => {
                        var file = new File([blob], url.split('/').pop(), { type: blob.type });

                        var dataTransfer = new DataTransfer();
                        dataTransfer.items.add(file);

                        ['dragenter', 'dragover', 'drop'].forEach(eventType => {
                            var event = new DragEvent(eventType, {
                                bubbles: true,
                                cancelable: true,
                                dataTransfer: dataTransfer
                            });
                            uploadArea.dispatchEvent(event);
                        });
                    });
                }
            });
        });

        var closeButton = document.createElement('button');
        closeButton.innerText = 'Close';
        closeButton.style.gridColumn = 'span 4';
        closeButton.style.marginTop = '10px';
        closeButton.style.padding = '5px 10px';
        closeButton.style.border = 'none';
        closeButton.style.backgroundColor = '#c9302c';
        closeButton.style.color = '#fff';
        closeButton.style.borderRadius = '3px';
        closeButton.style.cursor = 'pointer';

        closeButton.addEventListener('click', function() {
            document.body.removeChild(modal);
            applyStyles(newButton, defaultStyles);
        });

        modal.appendChild(closeButton);
        document.body.appendChild(modal);
        applyStyles(newButton, pressedStyles);

        window.addEventListener('keydown', handleEscKey);
    }

    newButton.addEventListener('click', function() {
        var existingModal = document.querySelector('#image-modal');
        if (existingModal) {
            document.body.removeChild(existingModal);
            applyStyles(newButton, defaultStyles);
            return;
        }

        var repoOwner = 'NEL227';
        var repoName = 'my-data-repo';
        var directoryPath = 'images';

        fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${directoryPath}`)
            .then(response => response.json())
            .then(data => {
            var imageUrls = data.filter(file => file.type === 'file' && file.name.match(/\.jpg$/i))
            .map(file => file.download_url);
            showModalWithImages(imageUrls);
        });
    });

    var uploadSpan = document.querySelector('.panel-heading .clearfix .pull-left.inputHeight');
    uploadSpan.parentNode.insertBefore(newButton, uploadSpan.nextSibling);

    //画像拡大機能
    let zoomMode = localStorage.getItem('zoomMode') || 'ctrlHover';
    let zoomPosition = localStorage.getItem('zoomPosition') || 'mouse';
    let maxWidth = localStorage.getItem('maxWidth') || 600;
    let maxHeight = localStorage.getItem('maxHeight') || 600;
    let zoomOpacity = localStorage.getItem('zoomOpacity') || 100;
    let delay = localStorage.getItem('delay') || 350;
    const defaultWidth = 600;
    const defaultHeight = 600;
    const defaultOpacity = 100;
    let ctrlPressed = false;
    let hoveredImage = null;
    let lastMouseEvent = null;
    let zoomTimeout = null;
    let mouseOnImage = false;
    let currentImage = null;
    let lastImage = null;
    let clickHandled = false;
    let clickDuringDelay = false;
    let firstZoom = false;

    const zoomedImage = document.createElement('img');
    zoomedImage.className = 'zoomed-image';
    zoomedImage.style.opacity = zoomOpacity / 100;
    document.body.appendChild(zoomedImage);

    function createSettingsMenu() {
        const settingsIcon = document.createElement('div');
        settingsIcon.innerHTML = '⚙️';
        settingsIcon.className = 'settings-icon';
        document.body.appendChild(settingsIcon);

        const settingsMenu = document.createElement('div');
        settingsMenu.className = 'settings-menu';
        settingsMenu.style.display = 'none';
        document.body.appendChild(settingsMenu);

        const zoomModeLabel = document.createElement('div');
        zoomModeLabel.innerText = '拡大モード';
        zoomModeLabel.className = 'settings-label';
        settingsMenu.appendChild(zoomModeLabel);

        const modes = [
            { id: 'always', text: '常に拡大（Ctrlやクリックで非表示）' },
            { id: 'ctrlHover', text: 'Ctrlを押しながら拡大' },
            { id: 'noZoom', text: '拡大しない' }
        ];

        modes.forEach(mode => {
            const modeOption = document.createElement('div');
            modeOption.innerText = mode.text;
            modeOption.className = 'mode-option';
            modeOption.dataset.mode = mode.id;

            if (mode.id === zoomMode) {
                modeOption.classList.add('selected');
            }

            modeOption.onmouseover = () => {
                modeOption.classList.add('hover');
            };

            modeOption.onmouseout = () => {
                modeOption.classList.remove('hover');
            };

            modeOption.onclick = () => {
                zoomMode = mode.id;
                localStorage.setItem('zoomMode', zoomMode);
                updateZoomMode();
                updateSelectedOptions();
            };

            settingsMenu.appendChild(modeOption);
        });

        const zoomPositionLabel = document.createElement('div');
        zoomPositionLabel.innerText = '拡大画像の表示位置';
        zoomPositionLabel.className = 'settings-label';
        zoomPositionLabel.style.marginTop = '10px';
        zoomPositionLabel.style.marginBottom = '10px';
        settingsMenu.appendChild(zoomPositionLabel);

        const positions = [
            { id: 'mouse', text: 'カーソル' },
            { id: 'right', text: '画面隅' }
        ];

        positions.forEach(position => {
            const positionOption = document.createElement('div');
            positionOption.innerText = position.text;
            positionOption.className = 'zoom-position-option';
            positionOption.dataset.position = position.id;

            if (position.id === zoomPosition) {
                positionOption.classList.add('selected');
            }

            positionOption.onmouseover = () => {
                positionOption.classList.add('hover');
            };

            positionOption.onmouseout = () => {
                positionOption.classList.remove('hover');
            };

            positionOption.onclick = () => {
                zoomPosition = position.id;
                localStorage.setItem('zoomPosition', zoomPosition);
                updateSelectedOptions();
            };

            settingsMenu.appendChild(positionOption);
        });

        const maxSizeLabel = document.createElement('div');
        maxSizeLabel.innerText = '拡大サイズ（最大）';
        maxSizeLabel.className = 'settings-label';
        maxSizeLabel.style.marginTop = '10px';
        settingsMenu.appendChild(maxSizeLabel);

        const sizeContainer = document.createElement('div');
        sizeContainer.style.display = 'flex';
        sizeContainer.style.marginTop = '10px';

        const maxWidthLabel = document.createElement('span');
        maxWidthLabel.innerText = '横：';
        maxWidthLabel.className = 'settings-input-label';
        maxWidthLabel.style.paddingTop = '6px';
        sizeContainer.appendChild(maxWidthLabel);

        const maxWidthInput = document.createElement('input');
        maxWidthInput.type = 'number';
        maxWidthInput.value = maxWidth;
        maxWidthInput.className = 'settings-input';
        maxWidthInput.min = '50';
        maxWidthInput.max = '3000';
        maxWidthInput.step = '50';
        maxWidthInput.addEventListener('input', () => {
            maxWidth = maxWidthInput.value;
            localStorage.setItem('maxWidth', maxWidth);
            updateZoomSize();
            zoomedImage.style.display = 'none';
        });
        sizeContainer.appendChild(maxWidthInput);

        const maxHeightLabel = document.createElement('span');
        maxHeightLabel.innerText = '縦：';
        maxHeightLabel.className = 'settings-input-label';
        maxHeightLabel.style.paddingTop = '6px';
        maxHeightLabel.style.marginLeft = '13px';
        sizeContainer.appendChild(maxHeightLabel);

        const maxHeightInput = document.createElement('input');
        maxHeightInput.type = 'number';
        maxHeightInput.value = maxHeight;
        maxHeightInput.className = 'settings-input';
        maxHeightInput.min = '50';
        maxHeightInput.max = '3000';
        maxHeightInput.step = '50';
        maxHeightInput.addEventListener('input', () => {
            maxHeight = maxHeightInput.value;
            localStorage.setItem('maxHeight', maxHeight);
            updateZoomSize();
            zoomedImage.style.display = 'none';
        });
        sizeContainer.appendChild(maxHeightInput);

        settingsMenu.appendChild(sizeContainer);

        const delayContainer = document.createElement('div');
        delayContainer.style.display = 'flex';
        delayContainer.style.marginTop = '10px';
        const delayLabel = document.createElement('span');
        delayLabel.innerText = '拡大までの遅延（ms）：';
        delayLabel.style.fontWeight = 'bold';
        delayLabel.className = 'settings-input-label';
        delayLabel.style.paddingTop = '6px';
        delayContainer.appendChild(delayLabel);

        const delayInput = document.createElement('input');
        delayInput.type = 'number';
        delayInput.value = delay;
        delayInput.className = 'settings-input';
        delayInput.min = '0';
        delayInput.max = '5000';
        delayInput.step = '50';
        delayInput.addEventListener('input', () => {
            delay = delayInput.value;
            localStorage.setItem('delay', delay);
        });
        delayContainer.appendChild(delayInput);

        settingsMenu.appendChild(delayContainer);

        const transparencyLabel = document.createElement('div');
        transparencyLabel.innerText = '拡大画像の不透明度';
        transparencyLabel.className = 'settings-label';
        transparencyLabel.style.marginTop = '10px';
        settingsMenu.appendChild(transparencyLabel);

        const transparencySlider = document.createElement('input');
        transparencySlider.type = 'range';
        transparencySlider.className = 'transparency-slider';
        transparencySlider.min = '0';
        transparencySlider.max = '100';
        transparencySlider.value = zoomOpacity;

        const tooltip = document.createElement('div');
        tooltip.className = 'slider-tooltip';
        tooltip.style.position = 'absolute';
        tooltip.style.background = 'rgba(0, 0, 0, 0.7)';
        tooltip.style.color = 'white';
        tooltip.style.padding = '2px 5px';
        tooltip.style.borderRadius = '4px';
        tooltip.style.fontSize = '12px';
        tooltip.style.pointerEvents = 'none';
        tooltip.style.display = 'none';
        tooltip.style.zIndex = '10000';
        document.body.appendChild(tooltip);

        transparencySlider.addEventListener('input', (event) => {
            zoomOpacity = transparencySlider.value;
            localStorage.setItem('zoomOpacity', zoomOpacity);
            zoomedImage.style.opacity = zoomOpacity / 100;

            const rect = transparencySlider.getBoundingClientRect();
            tooltip.style.left = `${rect.left + window.scrollX + (transparencySlider.value / transparencySlider.max) * rect.width - 15}px`;
            tooltip.style.top = `${rect.top + window.scrollY - 25}px`;
            tooltip.innerText = `${zoomOpacity}%`;
            tooltip.style.display = 'block';
        });

        transparencySlider.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none';
        });

        settingsMenu.appendChild(transparencySlider);

        const defaultWidth = 600;
        const defaultHeight = 600;
        const defaultDelay = 350;

        const resetButton = document.createElement('div');
        resetButton.innerText = '拡大サイズと遅延をデフォルトに戻す';
        resetButton.className = 'reset-button';

        function updateResetButtonState() {
            const currentWidth = parseInt(maxWidthInput.value, 10);
            const currentHeight = parseInt(maxHeightInput.value, 10);
            const currentDelay = parseInt(delayInput.value, 10);

            if (currentWidth !== defaultWidth || currentHeight !== defaultHeight || currentDelay !== defaultDelay) {
                resetButton.classList.remove('disabled');
                resetButton.classList.add('enabled');
            } else {
                resetButton.classList.remove('enabled');
                resetButton.classList.add('disabled');
            }
        }

        resetButton.onclick = () => {
            maxWidth = defaultWidth;
            maxHeight = defaultHeight;
            delay = defaultDelay;
            localStorage.setItem('maxWidth', maxWidth);
            localStorage.setItem('maxHeight', maxHeight);
            localStorage.setItem('delay', delay);
            maxWidthInput.value = maxWidth;
            maxHeightInput.value = maxHeight;
            delayInput.value = delay;
            updateZoomSize();
            zoomedImage.style.opacity = zoomOpacity / 100;
            updateResetButtonState();
        };

        maxWidthInput.addEventListener('input', updateResetButtonState);
        maxHeightInput.addEventListener('input', updateResetButtonState);
        delayInput.addEventListener('input', updateResetButtonState);

        settingsMenu.appendChild(resetButton);
        updateResetButtonState();

        updateSelectedOptions();
        settingsIcon.onclick = () => {
            settingsMenu.style.display = settingsMenu.style.display === 'none' ? 'block' : 'none';
        };

        document.addEventListener('mouseenter', () => {
            if (zoomMode === 'always') {
                zoomTimeout = setTimeout(() => {
                    if (!clickDuringDelay) {
                        zoomedImage.style.display = 'block';
                    }
                }, delay);
            }
        });

        document.addEventListener('mousedown', (event) => {
            if (zoomMode === 'always' && event.button === 0) {
                clearTimeout(zoomTimeout);
                clickDuringDelay = true;

                zoomedImage.style.display = 'none';
            }
        });

        document.addEventListener('mouseup', (event) => {
            if (zoomMode === 'always' && event.button === 0) {
                zoomedImage.style.display = 'none';
            }
        });

        document.addEventListener('mouseleave', () => {
            clearTimeout(zoomTimeout);
            clickDuringDelay = false;
            zoomedImage.style.display = 'none';
        });

        document.addEventListener('mousemove', () => {
            if (clickDuringDelay) {
                clickDuringDelay = false;
            }
        });

        document.addEventListener('mousedown', onMouseDown);
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);
        document.addEventListener('mouseout', onMouseOut);
    }

    function updateZoomMode() {
        if (zoomMode === 'noZoom') {
            zoomedImage.style.display = 'none';
        } else {
            zoomedImage.style.display = 'block';
        }
    }

    function updateZoomSize() {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        const maxAllowedWidth = windowWidth * 0.9;
        const maxAllowedHeight = windowHeight * 0.98;

        const finalWidth = Math.min(maxWidth, maxAllowedWidth);
        const finalHeight = Math.min(maxHeight, maxAllowedHeight);

        zoomedImage.style.maxWidth = finalWidth + 'px';
        zoomedImage.style.maxHeight = finalHeight + 'px';
    }

    function updateSelectedOptions() {
        const modeOptions = document.querySelectorAll('.mode-option');
        modeOptions.forEach(option => {
            if (option.dataset.mode === zoomMode) {
                option.classList.add('selected');
            } else {
                option.classList.remove('selected');
            }
        });

        const inputs = document.querySelectorAll('.settings-input, .settings-label, .transparency-slider, .reset-button');
        const positionOptions = document.querySelectorAll('.zoom-position-option');
        positionOptions.forEach(option => {
            if (option.dataset.position === zoomPosition) {
                option.classList.add('selected');
            } else {
                option.classList.remove('selected');
            }
        });

        const labels = document.querySelectorAll('.settings-input-label');
        let delayLabel, delayInput;

        labels.forEach(label => {
            if (label.textContent.includes('拡大までの遅延（ms）：')) {
                delayLabel = label;
                delayInput = label.nextElementSibling;
            }
        });

        if (zoomMode === 'noZoom') {
            labels.forEach(label => {
                if (label.innerText !== '拡大モード') {
                    label.style.display = 'none';
                }
            });

            positionOptions.forEach(option => {
                option.style.display = 'none';
            });

            inputs.forEach(input => {
                input.style.display = 'none';
            });

        } else {
            labels.forEach(label => {
                label.style.display = 'block';
            });

            positionOptions.forEach(option => {
                option.style.display = 'block';
            });

            inputs.forEach(input => {
                input.style.display = 'block';
            });

            if (zoomMode === 'ctrlHover') {
                labels.forEach(label => {
                    if (label.textContent.includes('拡大までの遅延（ms）：')) {
                        label.style.display = 'none';
                        label.nextElementSibling.style.display = 'none';
                    }
                });
            }
        }

        updateZoomMode();
        updateZoomPosition();

        zoomedImage.style.display = 'none';
    }

    function onMouseMove(event) {
        lastMouseEvent = event;

        if (zoomMode === 'always') {
            if (ctrlPressed || event.buttons !== 0) {
                clearTimeout(zoomTimeout);
                zoomedImage.style.display = 'none';
                if (currentImage) {
                    currentImage.style.opacity = '';
                }
                currentImage = null;
                return;
            }

            if (!firstZoom) {
                clearTimeout(zoomTimeout);
                if (event.target.tagName === 'IMG') {
                    currentImage = event.target;
                    hoveredImage = event.target;
                    zoomedImage.src = event.target.src;
                    event.target.style.opacity = '0.5';

                    zoomTimeout = setTimeout(() => {
                        zoomedImage.style.display = 'block';
                        updateZoomPosition();
                        if (zoomPosition === 'mouse') {
                            adjustZoomPosition(event);
                        }
                        currentImage.style.opacity = '';
                        firstZoom = true;
                    }, delay);
                } else {
                    zoomedImage.style.display = 'none';
                    if (currentImage) {
                        currentImage.style.opacity = '';
                    }
                    currentImage = null;
                }
            } else {
                if (event.target.tagName === 'IMG') {
                    currentImage = event.target;
                    hoveredImage = event.target;
                    zoomedImage.src = event.target.src;
                    zoomedImage.style.display = 'block';
                    updateZoomPosition();
                    if (zoomPosition === 'mouse') {
                        adjustZoomPosition(event);
                    }
                    currentImage.style.opacity = '';
                } else {
                    zoomedImage.style.display = 'none';
                    if (currentImage) {
                        currentImage.style.opacity = '';
                    }
                    currentImage = null;
                }
            }
            return;
        }

        if (zoomMode === 'ctrlHover' && ctrlPressed) {
            if (event.target.tagName === 'IMG') {
                clearTimeout(zoomTimeout);
                currentImage = event.target;
                hoveredImage = event.target;
                zoomedImage.src = event.target.src;
                event.target.style.opacity = '0.5';

                zoomedImage.style.display = 'block';
                updateZoomPosition();
                if (zoomPosition === 'mouse') {
                    adjustZoomPosition(event);
                }
                currentImage.style.opacity = '';
            } else {
                zoomedImage.style.display = 'none';
                if (currentImage) {
                    currentImage.style.opacity = '';
                }
                currentImage = null;
            }
            return;
        }

        if (zoomMode === 'ctrlHover' && !ctrlPressed) {
            clearTimeout(zoomTimeout);
            zoomedImage.style.display = 'none';
            if (currentImage) {
                currentImage.style.opacity = '';
            }
            currentImage = null;
            return;
        }

        if (zoomMode === 'always' || (zoomMode === 'ctrlHover' && ctrlPressed)) {
            if (event.target.tagName === 'IMG') {
                if (clickHandled) {
                    if (lastImage !== event.target) {
                        clearTimeout(zoomTimeout);
                        currentImage = event.target;
                        hoveredImage = event.target;
                        zoomedImage.src = event.target.src;
                        event.target.style.opacity = '0.5';

                        zoomTimeout = setTimeout(() => {
                            zoomedImage.style.display = 'block';
                            updateZoomPosition();
                            if (zoomPosition === 'mouse') {
                                adjustZoomPosition(event);
                            }
                            currentImage.style.opacity = '';
                            lastImage = event.target;
                            clickHandled = false;
                            firstZoom = false;
                        }, firstZoom ? delay : 0);

                    }
                } else {
                    if (currentImage !== event.target) {
                        clearTimeout(zoomTimeout);
                        currentImage = event.target;
                        hoveredImage = event.target;
                        zoomedImage.src = event.target.src;
                        event.target.style.opacity = '0.5';

                        zoomTimeout = setTimeout(() => {
                            zoomedImage.style.display = 'block';
                            updateZoomPosition();
                            if (zoomPosition === 'mouse') {
                                adjustZoomPosition(event);
                            }
                            currentImage.style.opacity = '';
                        }, firstZoom ? delay : 0);
                    } else {
                        if (zoomMode === 'always' && !ctrlPressed && event.buttons === 0) {
                            mouseOnImage = true;
                            clearTimeout(zoomTimeout);
                            zoomTimeout = setTimeout(() => {
                                zoomedImage.style.display = 'block';
                                updateZoomPosition();
                                if (zoomPosition === 'mouse') {
                                    adjustZoomPosition(event);
                                }
                                currentImage.style.opacity = '';
                            }, firstZoom ? delay : 0);
                        } else if (zoomMode === 'ctrlHover' && ctrlPressed) {
                            zoomedImage.style.display = 'block';
                            updateZoomPosition();
                            if (zoomPosition === 'mouse') {
                                adjustZoomPosition(event);
                            }
                            currentImage.style.opacity = '';
                        }
                    }
                }
            } else {
                clearTimeout(zoomTimeout);
                zoomedImage.style.display = 'none';
                if (currentImage) {
                    currentImage.style.opacity = '';
                }
                currentImage = null;
                mouseOnImage = false;
            }

            if (ctrlPressed && zoomMode === 'always' && currentImage) {
                currentImage.style.opacity = '';
            }

            if (zoomedImage.style.display === 'block') {
                updateZoomPosition();
                if (zoomPosition === 'mouse') {
                    adjustZoomPosition(event);
                }
            }
        } else {
            clearTimeout(zoomTimeout);
            zoomedImage.style.display = 'none';
            if (currentImage) {
                currentImage.style.opacity = '';
            }
            currentImage = null;
            mouseOnImage = false;
        }
    }

    function adjustZoomPosition(event) {
        if (zoomPosition === 'right') {
            return;
        }

        const zoomWidth = zoomedImage.clientWidth;
        const zoomHeight = zoomedImage.clientHeight;

        let top = event.pageY + 15;
        let left = event.pageX + 25;

        const maxTop = window.innerHeight - zoomHeight - 20;
        const maxLeft = window.innerWidth - zoomWidth - 20;

        if (left + zoomWidth > window.innerWidth) {
            left = event.pageX - zoomWidth - 25;
        }

        if (top > maxTop) {
            top = maxTop;
        }
        if (top < 0) {
            top = 0;
        }
        if (left > maxLeft) {
            left = maxLeft;
        }
        if (left < 0) {
            left = 0;
        }

        zoomedImage.style.top = top + 'px';
        zoomedImage.style.left = left + 'px';
        zoomedImage.style.right = 'auto';
    }

    const imageModal = document.getElementById('image-modal');

    let isMouseOverModal = false;

    const observer = new MutationObserver((mutationsList) => {
        mutationsList.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.id === 'image-modal') {
                    setupImageModalEvents(node);
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    function setupImageModalEvents(imageModal) {
        imageModal.addEventListener('mouseenter', () => {
            isMouseOverModal = true;
            updateZoomPosition();
        });

        imageModal.addEventListener('mouseleave', () => {
            isMouseOverModal = false;
            updateZoomPosition();
        });
    }

    function updateZoomPosition() {
        if (zoomPosition === 'right') {
            if (isMouseOverModal) {
                zoomedImage.style.left = '10px';
                zoomedImage.style.right = 'auto';
                zoomedImage.style.top = '10px';
                zoomedImage.style.bottom = 'auto';
            } else {
                zoomedImage.style.left = 'auto';
                zoomedImage.style.right = '10px';
                zoomedImage.style.top = '10px';
                zoomedImage.style.bottom = 'auto';
            }
        } else if (zoomPosition === 'mouse') {
            zoomedImage.style.left = '0';
            zoomedImage.style.right = 'auto';
            zoomedImage.style.top = 'auto';
            zoomedImage.style.bottom = 'auto';
        }
    }

    function onMouseDown(event) {
        if (zoomMode === 'always') {
            firstZoom = false;
            event.target.style.opacity = '';
        }
    }

    function onMouseOut(event) {
        if (event.target.tagName === 'IMG') {
            event.target.style.opacity = '';
            clearTimeout(zoomTimeout);
            zoomedImage.style.display = 'none';
        }
    }

    function onKeyDown(event) {
        if (event.key === 'Control') {
            ctrlPressed = true;
            if (zoomMode === 'always') {
                zoomedImage.style.display = 'none';
                clearTimeout(zoomTimeout);
            } else if (zoomMode === 'ctrlHover' && lastMouseEvent && lastMouseEvent.target.tagName === 'IMG') {
                onMouseMove(lastMouseEvent);
            }
        }
    }

    function onKeyUp(event) {
        if (event.key === 'Control') {
            ctrlPressed = false;
            if (zoomMode === 'always' && hoveredImage) {
                zoomedImage.src = hoveredImage.src;
                zoomedImage.style.display = 'block';
                if (lastMouseEvent) {
                    onMouseMove(lastMouseEvent);
                }
            } else if (zoomMode === 'ctrlHover') {
                zoomedImage.style.display = 'none';
            }
        }
    }

    createSettingsMenu();
    updateZoomMode();
    updateZoomSize();
    updateZoomPosition();

})();