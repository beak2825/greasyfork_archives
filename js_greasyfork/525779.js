// ==UserScript==
// @name         Пипетка
// @namespace    awaw https://lolz.live/andrey
// @version      2.0
// @description  Пипетка с автокопи и перемещением окна + возможность изменения цвета текста
// @match        https://lolz.live/*
// @match        https://zelenka.guru/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525779/%D0%9F%D0%B8%D0%BF%D0%B5%D1%82%D0%BA%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/525779/%D0%9F%D0%B8%D0%BF%D0%B5%D1%82%D0%BA%D0%B0.meta.js
// ==/UserScript==
(function () {
    'use strict';

    function addColorPickerButton() {
        const toolbar = document.querySelector('.fr-toolbar');
        if (!toolbar) return;

        // Кнопка пипетки
        const pickerButton = document.createElement('button');
        pickerButton.className = 'color-picker-button fr-command fr-btn';
        pickerButton.innerHTML = '<i class="fas fa-eye-dropper"></i>';
        pickerButton.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            openColorPicker();
        });
        toolbar.appendChild(pickerButton);
    }

    function openColorPicker() {
        if (document.getElementById('colorPickerWindow')) return;

        const pickerWindow = document.createElement('div');
        pickerWindow.id = 'colorPickerWindow';
        pickerWindow.style.cssText = `
            position: fixed;
            top: 100px;
            left: 100px;
            background: #2d2d2d;
            color: #ffffff;
            border: 1px solid #444;
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
            z-index: 9999;
            cursor: default;
            border-radius: 8px;
            padding: 10px;
            width: 500px;
            height: 400px;
            max-height: 90vh;
            overflow: hidden;
            resize: both;
            min-width: 300px;
            min-height: 200px;
            display: flex;
            flex-direction: column;
        `;
        pickerWindow.innerHTML = `
<button id="closePicker" style="position: absolute; top: 10px; right: 10px; background: red; color: white; border: none; width: 25px; height: 25px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 18px; font-family: Arial, sans-serif;">
    X
</button>
            <button id="uploadScreenshot" style="margin: 10px auto; padding: 5px 10px; background: #007bff; color: white; border: none; border-radius: 4px; font-size: 14px; display: flex; align-items: center; gap: 5px;">
                <i class="fas fa-upload"></i> Загрузить
            </button>
            <input type="file" id="screenshotInput" accept="image/*" style="display: none;">
            <div id="imageContainer" style="flex-grow: 1; display: flex; justify-content: center; align-items: center; overflow: hidden;"></div>
            <div style="margin-top: 10px; text-align: center; display: flex; align-items: center; justify-content: center; gap: 10px;">
                <div id="selectedColorPreview" style="width: 30px; height: 30px; border: 2px solid #fff; border-radius: 4px; background: transparent;"></div>
                <div id="colorPreview" style="width: 30px; height: 30px; border: 2px solid #fff; border-radius: 4px;"></div>
                <input type="text" id="hexColor" readonly style="width: 80px; text-align: center;">
                <button id="copyHexButton" style="background: #4CAF50; color: white; border: none; padding: 5px; border-radius: 4px; font-size: 16px; display: flex; align-items: center; justify-content: center;">
                    <i class="fas fa-copy"></i>
                </button>
            </div>
        `;
        document.body.appendChild(pickerWindow);

        // Перемещение главного окна
        let isDraggingWindow = false;
        let windowOffsetX = 0, windowOffsetY = 0;
        pickerWindow.addEventListener('mousedown', (event) => {
            const rect = pickerWindow.getBoundingClientRect();
            if (event.clientY - rect.top <= 30) { // Высота заголовка ~30px
                isDraggingWindow = true;
                windowOffsetX = event.clientX - rect.left;
                windowOffsetY = event.clientY - rect.top;
                pickerWindow.style.cursor = 'grabbing';
            }
        });
        document.addEventListener('mousemove', (event) => {
            if (isDraggingWindow) {
                let newLeft = event.clientX - windowOffsetX;
                let newTop = event.clientY - windowOffsetY;
                newTop = Math.max(newTop, 0);
                newLeft = Math.max(newLeft, 0);
                const windowWidth = window.innerWidth - pickerWindow.offsetWidth;
                newLeft = Math.min(newLeft, windowWidth);
                const windowHeight = window.innerHeight - pickerWindow.offsetHeight;
                newTop = Math.min(newTop, windowHeight);
                pickerWindow.style.left = `${newLeft}px`;
                pickerWindow.style.top = `${newTop}px`;
            }
        });
        document.addEventListener('mouseup', () => {
            isDraggingWindow = false;
            pickerWindow.style.cursor = 'default';
        });

        let img = null;
        let scale = 1;
        let posX = 0, posY = 0;
        let isPanning = false, startX = 0, startY = 0;

        function loadAndDisplayImage(imageUrl) {
            img = new Image();
            img.src = imageUrl;
            img.style.cursor = 'grab';
            img.style.position = 'absolute';
            img.style.transformOrigin = 'center';
            img.style.maxWidth = '100%';
            img.style.maxHeight = '100%';
            const imgWrapper = document.createElement('div');
            imgWrapper.style.position = 'relative';
            imgWrapper.style.width = '100%';
            imgWrapper.style.height = '100%';
            imgWrapper.style.overflow = 'hidden';
            imgWrapper.appendChild(img);
            const container = document.getElementById('imageContainer');
            container.innerHTML = '';
            container.appendChild(imgWrapper);
            let colorUpdateTimeout;
            img.addEventListener('mousemove', (event) => {
                clearTimeout(colorUpdateTimeout);
                colorUpdateTimeout = setTimeout(() => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = img.naturalWidth;
                    canvas.height = img.naturalHeight;
                    ctx.drawImage(img, 0, 0);
                    const rect = img.getBoundingClientRect();
                    const x = (event.clientX - rect.left) * (canvas.width / rect.width);
                    const y = (event.clientY - rect.top) * (canvas.height / rect.height);
                    const pixel = ctx.getImageData(x, y, 1, 1).data;
                    const hex = `${pixel[0].toString(16).padStart(2, '0')}${pixel[1].toString(16).padStart(2, '0')}${pixel[2].toString(16).padStart(2, '0')}`;
                    document.getElementById('colorPreview').style.backgroundColor = `#${hex}`;
                }, 10);
            });
            img.addEventListener('mouseleave', () => {
                document.getElementById('colorPreview').style.backgroundColor = 'transparent';
            });
            img.addEventListener('wheel', (event) => {
                event.preventDefault();
                let delta = event.deltaY > 0 ? -0.1 : 0.1;
                scale = Math.min(Math.max(0.5, scale + delta), 10);
                img.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
            });
            img.addEventListener('mousedown', (event) => {
                isPanning = true;
                startX = event.clientX - posX;
                startY = event.clientY - posY;
                img.style.cursor = 'grabbing';
            });
            document.addEventListener('mousemove', (event) => {
                if (!isPanning) return;
                posX = event.clientX - startX;
                posY = event.clientY - startY;
                img.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
            });
            document.addEventListener('mouseup', () => {
                isPanning = false;
                img.style.cursor = 'grab';
            });
            img.addEventListener('click', (event) => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                ctx.drawImage(img, 0, 0);
                const rect = img.getBoundingClientRect();
                const x = (event.clientX - rect.left) * (canvas.width / rect.width);
                const y = (event.clientY - rect.top) * (canvas.height / rect.height);
                const pixel = ctx.getImageData(x, y, 1, 1).data;
                const hex = `${pixel[0].toString(16).padStart(2, '0')}${pixel[1].toString(16).padStart(2, '0')}${pixel[2].toString(16).padStart(2, '0')}`;
                document.getElementById('hexColor').value = `#${hex}`;
                document.getElementById('selectedColorPreview').style.backgroundColor = `#${hex}`;
                applyTextColor(`#${hex}`); // Применение цвета к тексту
            });
        }

        document.getElementById('uploadScreenshot').addEventListener('click', () => {
            document.getElementById('screenshotInput').click();
        });
        document.getElementById('screenshotInput').addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const imageUrl = e.target.result;
                    loadAndDisplayImage(imageUrl);
                    localStorage.setItem('lastImage', imageUrl);
                };
                reader.readAsDataURL(file);
            }
        });

        const savedImageUrl = localStorage.getItem('lastImage');
        if (savedImageUrl) {
            loadAndDisplayImage(savedImageUrl);
        }

        document.getElementById('closePicker').addEventListener('click', () => {
            pickerWindow.remove();
        });

        // Добавляем функционал для кнопки "Копировать"
        document.getElementById('copyHexButton').addEventListener('click', () => {
            const hexColor = document.getElementById('hexColor').value.trim();
            if (hexColor) {
                navigator.clipboard.writeText(hexColor).then(() => {
                    console.log(`HEX-код скопирован: ${hexColor}`);
                }).catch(err => {
                    console.error('Не удалось скопировать HEX-код:', err);
                });
            }
        });
    }

    function applyTextColor(hexColor) {
        const selection = window.getSelection();
        if (selection.rangeCount === 0 || selection.toString().trim() === '') return;

        for (let i = 0; i < selection.rangeCount; i++) {
            const range = selection.getRangeAt(i);
            const fragments = Array.from(range.cloneContents().childNodes);

            const newContent = document.createDocumentFragment();

            fragments.forEach(fragment => {
                if (fragment.nodeType === Node.TEXT_NODE) {
                    const span = document.createElement('span');
                    span.style.color = hexColor;
                    span.textContent = fragment.textContent;
                    newContent.appendChild(span);
                } else if (fragment.nodeType === Node.ELEMENT_NODE && fragment.tagName === 'SPAN') {
                    fragment.style.color = hexColor;
                    newContent.appendChild(fragment.cloneNode(true));
                } else {
                    newContent.appendChild(fragment.cloneNode(true));
                }
            });

            range.deleteContents();
            range.insertNode(newContent);
        }
    }

    window.addEventListener('load', addColorPickerButton);
})();