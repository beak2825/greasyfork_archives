// ==UserScript==
// @name         X-Ray Mode V2
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  X-RAY mode for custom editor
// @author       Nikita Nikitin
// @match        *://*/Admin/CompareBag/EditBag/*
// @match        *://*//Admin/CompareBag/EditBag/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=triplenext.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490746/X-Ray%20Mode%20V2.user.js
// @updateURL https://update.greasyfork.org/scripts/490746/X-Ray%20Mode%20V2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Находим элемент <head> для добавления стилей
    const head = document.head;
    const style = document.createElement('style');
    head.appendChild(style);

    // Добавляем CSS правила
    style.textContent = `
    #x-ray-mode-toggle {
        padding: 3px 12px;
        cursor: pointer;
        border: 1px solid #93adc1;
        background: #e4eff5;
        color: #7793a9;
        position: absolute;
        top: -31px;
        right: 0;
        font-weight: 700;
        font-style: Italic;
    }
    #x-ray-mode-toggle:hover {
        background: #b9dff3;
    }
    .x-ray-active {
        background: #ff6347 !important;
        color: #ffffff !important;
    }
    .x-ray-active:hover {
        background: #ef3d3d  !important;
        color: #ffffff !important;
    }
    .x-ray-svgRed::before {
        content: '';
        position: absolute;
        border: 6px dashed red;
        box-sizing: border-box;
        width: 100%;
        height: 100%;
    }
`;

    // Создаем и добавляем кнопку
    const customColorPicker = document.querySelector('#custom-color-picker');
    if (customColorPicker) {
        const button = document.createElement('button');
        button.id = 'x-ray-mode-toggle';
        button.type = 'button';
        button.textContent = 'X-Ray';

        // Добавляем кнопку в DOM
        customColorPicker.parentNode.insertBefore(button, customColorPicker.nextSibling);

        button.addEventListener('click', toggleXRayMode);
    }

    function toggleXRayMode() {
        const button = document.getElementById('x-ray-mode-toggle');
        if (button) {
            button.classList.toggle('x-ray-active');
            // Инвертируем значение isActivated
            isActivated = !button.classList.contains('x-ray-active');
            checkAndToggleElements();
        }
    }

    // Переменная для отслеживания состояния активации
    let isActivated = false;

    function checkHotSpotMarkerAndInitPosition() {
        // Находим элемент с классом hot-spot-marker
        const hotSpotMarker = document.querySelector('.hot-spot-marker');
        if (hotSpotMarker && !hotSpotMarker.getAttribute('style')) {
            // Если у hot-spot-marker нет атрибута style или он пустой
            const btnUsePositionEditor = document.getElementById('btn-use-position-editor');
            const btnUseCustomEditor = document.getElementById('btn-use-custom-editor');
            if (btnUsePositionEditor && btnUseCustomEditor) {
                btnUsePositionEditor.click(); // Клик для перехода в position editor
                setTimeout(() => btnUseCustomEditor.click(), 100); // Задержка и возвращение обратно
            }
        }
    }

    function checkAndToggleElements() {
        checkHotSpotMarkerAndInitPosition();
        // Обновляем флаг активации
        isActivated = !isActivated;

        const rectangleEditor = document.getElementById('background-rectangle-editor');
        const rectangleEditorWrapper = document.getElementById('background-rectangle-editor-wrapper');
        const markerWrapper = document.getElementById('background-marker-wrapper');
        const bgUniqMaskImageData = document.getElementById('Textures_Front__BgUniqMaskImageData');
        const positionEditorWrapper = document.getElementById('position-editor-wrapper');
        const svgRedContent = document.getElementById('svgRed_Content');
        const svgRed = document.getElementById('svgRed'); // Элемент, после которого нужно вставить position-editor-wrapper
        const previewArea = document.getElementById('preview-area');

        // Задачи для выполнения (клики по кнопкам)
        const tasks = [];

        // Добавляем задачи только если X-Ray активируется
        if (isActivated) {
            if (!rectangleEditor || rectangleEditor.innerHTML.trim() === '') {
                tasks.push(document.querySelector('a.switch-editor-button i.tng-layers-icon')?.parentNode);
            }
            if (bgUniqMaskImageData && bgUniqMaskImageData.value === '') {
                tasks.push(document.querySelector('a.switch-editor-button i.tng-draw-set-icon')?.parentNode);
            }
            tasks.push(document.querySelector('a.switch-editor-button i.tng-ruler-icon')?.parentNode); // Всегда переключаемся на "Ruler"
        }

        // Выполнение задач
        tasks.forEach((button, index) => setTimeout(() => button && button.click(), 100 * index));

        // Управление оверлеем, видимостью элементов и перемещением position-editor-wrapper после выполнения всех задач
        setTimeout(() => {
            if (isActivated) {
                rectangleEditorWrapper.style.display = 'block';
                markerWrapper.style.display = 'block';

                // Перемещаем markerWrapper, чтобы он был визуально поверх rectangleEditorWrapper
                const parent = rectangleEditorWrapper.parentNode;
                parent.appendChild(markerWrapper);
                svgRed.classList.add('x-ray-svgRed');
                previewArea.style.opacity = '0';

                if (positionEditorWrapper && svgRedContent) {
                    // Применяем новые стили и перемещаем position-editor-wrapper
                    positionEditorWrapper.style.position = 'absolute';
                    positionEditorWrapper.style.display = 'block';
                    positionEditorWrapper.style.left = '-644px';
                    positionEditorWrapper.style.top = '0';
                    positionEditorWrapper.style.background = 'white';
                    positionEditorWrapper.style.zIndex = '100';
                    positionEditorWrapper.style.border = '6px dashed #ff6347';
                    positionEditorWrapper.style.boxSizing = 'border-box';
                    svgRedContent.appendChild(positionEditorWrapper); // Перемещаем в конец svgRed_Content
                }
            } else {
                rectangleEditorWrapper.style.display = 'none';
                markerWrapper.style.display = 'none';
                svgRed.classList.remove('x-ray-svgRed');
                previewArea.style.opacity = '1';

                if (positionEditorWrapper && svgRed) {
                    // Возвращаем position-editor-wrapper непосредственно после svgRed
                    svgRed.insertAdjacentElement('afterend', positionEditorWrapper);
                    // Сбрасываем стили
                    positionEditorWrapper.style.position = '';
                    positionEditorWrapper.style.display = '';
                    positionEditorWrapper.style.left = '';
                    positionEditorWrapper.style.top = '';
                    positionEditorWrapper.style.background = '';
                    positionEditorWrapper.style.zIndex = '';
                    positionEditorWrapper.style.border = '';
                    positionEditorWrapper.style.boxSizing = '';
                }
            }

        }, 100 * tasks.length);
    }

    // Обработчик события для горячих клавиш
    document.addEventListener('keydown', function(event) {
        // Проверяем, что фокус не находится на элементе ввода
        if (event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA' && event.target.tagName !== 'SELECT') {
            // Проверяем, что нажата клавиша X без модификаторов
            if (event.keyCode === 88 && !event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey) {
                toggleXRayMode();
            }
        }
    })
})();