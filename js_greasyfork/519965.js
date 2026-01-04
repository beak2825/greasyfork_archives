// ==UserScript==
// @name         Screen to GIF
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Screenshot to GIF
// @author       You
// @match        https://cdn.tangiblee.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tangiblee.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519965/Screen%20to%20GIF.user.js
// @updateURL https://update.greasyfork.org/scripts/519965/Screen%20to%20GIF.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Проверка, что скрипт выполняется не внутри iframe
    if (window.top !== window.self) {
        console.log("Script is running inside an iframe. Exiting...");
        return; // Прекращаем выполнение скрипта
    }

    // Динамическое подключение gif.js
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.js';
    script.onload = () => {
        console.log('Библиотека gif.js успешно загружена!');
    };
    script.onerror = () => {
        console.error('Не удалось загрузить библиотеку gif.js.');
    };
    document.head.appendChild(script);

    let screenshotCounter = 0; // Счётчик для всех скриншотов
    const MAX_SCREENSHOTS = 2; // Максимум два скриншота

    // Проверка текущего состояния параметров в URL
    function isVisualEffectsOn() {
        const params = ['force-product-shadow-occlusion', 'force-product-brightness', 'force-product-shadow-adjustment'];
        const urlParams = new URLSearchParams(window.location.search);
        return params.every(param => urlParams.get(param) === '1');
    }

    let visualEffectsOn = isVisualEffectsOn(); // Инициализация состояния кнопки

    // Функция для изменения цвета и текста кнопки
    function updateToggleButton(button) {
        if (visualEffectsOn) {
            button.innerText = 'Visual Effects On';
            button.style.backgroundColor = '#28a745';
            button.style.border = '1px solid #27a243';
        } else {
            button.innerText = 'Visual Effects Off';
            button.style.border = '1px solid #dddddd';
            button.style.backgroundColor = '#f0f0f0';
            button.style.color = '#202020';
        }
    }

    // Функция для изменения параметров в URL и обновления страницы
    function toggleVisualEffects() {
        const params = ['force-product-shadow-occlusion', 'force-product-brightness', 'force-product-shadow-adjustment'];
        const currentUrl = new URL(window.location.href);

        // Переключение параметров между 0 и 1
        params.forEach(param => {
            const currentValue = currentUrl.searchParams.get(param);
            currentUrl.searchParams.set(param, currentValue === '1' ? '0' : '1');
        });

        // Переключаем состояние кнопки
        visualEffectsOn = !visualEffectsOn;

        // Обновляем текст и цвет кнопки
        const visualEffectsButton = document.getElementById('visualEffectsButton');
        updateToggleButton(visualEffectsButton);

        // Обновляем URL и перезагружаем страницу
        window.history.replaceState({}, '', currentUrl);
        location.reload();
    }


    // Функция для создания элементов UI
    function createUIElement(type, attributes = {}, styles = {}, parent = document.body) {
        const element = document.createElement(type);
        Object.entries(attributes).forEach(([key, value]) => {
            element[key] = value;
        });
        Object.entries(styles).forEach(([key, value]) => {
            element.style[key] = value;
        });
        parent.appendChild(element);
        return element;
    }

    // Функция для удаления старейших скриншотов, если лимит превышен
    function enforceStorageLimit() {
        const keys = Object.keys(sessionStorage).filter(key => key.startsWith('Screenshot_'));
        if (keys.length > MAX_SCREENSHOTS) {
            const oldestKey = keys.sort()[0]; // Самый старый ключ
            sessionStorage.removeItem(oldestKey);
            console.log(`Старый скриншот "${oldestKey}" удалён из sessionStorage.`);
        }
    }

    // Функция для создания одиночного скриншота и сохранения в sessionStorage
    async function singleScreenshot(customName, effectText = null) {
        screenshotCounter++;
        console.log(`Создание скриншота ${customName}...`);

        const wrapper = document.querySelector('.ar-image-panel__wrapper');
        if (!wrapper) {
            console.error('Элемент .ar-image-panel__wrapper не найден.');
            return;
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        const wrapperRect = wrapper.getBoundingClientRect();
        canvas.width = wrapperRect.width;
        canvas.height = wrapperRect.height;

        // Отрисовка фона
        const backgroundStyle = window.getComputedStyle(wrapper.querySelector('div'));
        const backgroundImage = backgroundStyle.backgroundImage.match(/url\("(data:image\/.+;base64,.*?)"\)/);
        if (!backgroundImage) {
            console.error('Не удалось извлечь background-image.');
            return;
        }
        const backgroundSrc = backgroundImage[1];
        const background = await loadImage(backgroundSrc);
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        console.log('Фон отрисован.');

        // Найти контейнеры продуктов
        const draggableItems = Array.from(wrapper.querySelectorAll('.draggable'));
        for (const draggable of draggableItems) {
            const draggableRect = draggable.getBoundingClientRect();

            const offsetX = draggableRect.left - wrapperRect.left;
            const offsetY = draggableRect.top - wrapperRect.top;

            const productImages = Array.from(draggable.querySelectorAll('img.item__canvas--margin'));

            // Сначала обрабатываем тень (z-index: -1)
            for (const imgElement of productImages) {
                const imgStyle = window.getComputedStyle(imgElement);
                if (imgStyle.zIndex === "-1") {
                    await drawImageOnCanvas(imgElement, ctx, draggableRect, offsetX, offsetY, "Тень");
                }
            }

            // Затем обрабатываем продукт
            for (const imgElement of productImages) {
                const imgStyle = window.getComputedStyle(imgElement);
                if (imgStyle.zIndex !== "-1") {
                    await drawImageOnCanvas(imgElement, ctx, draggableRect, offsetX, offsetY, "Продукт");
                }
            }
        }

        if (effectText) {
            ctx.font = 'bold 60px Arial';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.shadowColor = 'black';
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            ctx.shadowBlur = 5;
            ctx.fillText(effectText, canvas.width / 2, canvas.height - 20);
        }

        const screenshotName = customName;
        const screenshotData = canvas.toDataURL();
        sessionStorage.setItem(screenshotName, screenshotData);

        enforceStorageLimit();
        console.log(`Скриншот "${screenshotName}" сохранён в sessionStorage`);
        updateScreenshotStatus();
    }

    // Функция загрузки изображения
    function loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }

    // Функция для отрисовки изображения с учётом масштабов и положения
    async function drawImageOnCanvas(imgElement, ctx, draggableRect, offsetX, offsetY, label) {
        const img = await loadImage(imgElement.src);

        // Получаем реальные размеры изображения
        const naturalWidth = img.naturalWidth;
        const naturalHeight = img.naturalHeight;

        // Получаем CSS-стили для масштабирования и трансформаций
        const imgStyle = window.getComputedStyle(imgElement);
        const imgRect = imgElement.getBoundingClientRect();

        const imgOffsetX = imgRect.left - draggableRect.left;
        const imgOffsetY = imgRect.top - draggableRect.top;

        const scaleX = imgRect.width / naturalWidth;
        const scaleY = imgRect.height / naturalHeight;

        // Применяем масштаб и позицию
        ctx.save();
        ctx.translate(offsetX + imgOffsetX, offsetY + imgOffsetY);
        ctx.scale(scaleX, scaleY);
        ctx.globalAlpha = parseFloat(imgStyle.opacity) || 1;

        ctx.drawImage(img, 0, 0, naturalWidth, naturalHeight);
        ctx.restore();

        console.log(`${label} отрисован. Масштаб: [${scaleX}, ${scaleY}].`);
    }


    // Функция для получения имени и текста для "Effect Screen"
    function getEffectNameAndText() {
        const urlParams = new URLSearchParams(window.location.search);
        const params = ['force-product-shadow-occlusion', 'force-product-brightness', 'force-product-shadow-adjustment'];
        const effectStatus = params.some(param => urlParams.get(param) === '1') ? 'On' : 'Off';
        return { name: `Screenshot_${screenshotCounter}_${effectStatus}`, text: effectStatus.toUpperCase() };
    }

    // Функция для обновления статуса скриншотов в UI
    function updateScreenshotStatus() {
        const statusContainer = document.getElementById('screenshotStatus');
        statusContainer.innerHTML = '';

        const keys = Object.keys(sessionStorage).filter(key => key.startsWith('Screenshot_') && sessionStorage.getItem(key).startsWith('data:image/'));
        keys.sort().forEach((key) => {
            const screenshotData = sessionStorage.getItem(key);
            const previewContainer = document.createElement('div');
            previewContainer.style.display = 'inline-block';
            previewContainer.style.margin = '10px';
            previewContainer.style.textAlign = 'center';

            const img = document.createElement('img');
            img.src = screenshotData;
            img.width = 100;
            img.style.border = '1px solid #ccc';
            img.style.borderRadius = '5px';
            img.alt = key;

            const label = document.createElement('div');
            label.innerText = key;

            previewContainer.appendChild(img);
            previewContainer.appendChild(label);
            statusContainer.appendChild(previewContainer);
        });
    }








    let gifInterval = 1000; // Значение по умолчанию (1 секунда)

    // Встроенный воркер gif.worker.js через Blob
    const workerBlob = new Blob(
        [
            `(${function () {
                // Весь код из gif.worker.js
                importScripts('https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.worker.js');
            }.toString()})()`
        ],
        { type: 'application/javascript' }
    );

    // Генерация URL для Blob воркера
    const workerBlobURL = URL.createObjectURL(workerBlob);

    // Функция создания GIF
    async function createGIFWithGifJS() {
        const keys = Object.keys(sessionStorage)
        .filter(key => key.startsWith('Screenshot_') && sessionStorage.getItem(key).startsWith('data:image/'))
        .sort();

        if (keys.length < 2) {
            alert('Недостаточно скриншотов для создания GIF (требуется минимум 2).');
            return;
        }

        // Получение задержки из поля ввода
        const delayInput = document.getElementById('gifDelayInput');
        const delay = delayInput ? parseInt(delayInput.value, 10) || 1000 : 1000; // Значение по умолчанию 100 мс

        const latestScreenshots = keys.map(key => sessionStorage.getItem(key));
        console.log('Кадры для создания GIF:', latestScreenshots);

        const images = await Promise.all(latestScreenshots.map(src => loadImage(src)));

        const width = images[0].width;
        const height = images[0].height;

        const gif = new GIF({
            workers: 2, // Количество воркеров
            quality: 1, // Качество GIF
            dither: 'Atkinson',
            workerScript: workerBlobURL, // Используем наш встроенный воркер
            width: width,
            height: height,
        });

        images.forEach((image, index) => {
            gif.addFrame(image, { delay }); // Используем задержку из поля
            console.log(`Кадр ${index + 1} добавлен.`);
        });

        gif.on('finished', function (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'animation.gif';
            link.click();
            console.log('GIF успешно создан!');
        });

        gif.render();
        console.log('Начат рендеринг GIF...');
    }

    // Функция загрузки изображения
    function loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }
















    // Функция для скачивания всех скриншотов
    function downloadAllScreenshots() {
        const keys = Object.keys(sessionStorage).filter(key => key.startsWith('Screenshot_'));
        keys.forEach((key) => {
            const screenshotData = sessionStorage.getItem(key);
            if (screenshotData) {
                const link = document.createElement('a');
                link.download = `${key}.png`;
                link.href = screenshotData;
                link.click();
            }
        });
    }

    // Функция для очистки всех сохранённых скриншотов
    function clearScreenshots() {
        Object.keys(sessionStorage).forEach((key) => {
            if (key.startsWith('Screenshot_')) {
                sessionStorage.removeItem(key);
            }
        });
        screenshotCounter = 0; // Сброс счётчика
        updateScreenshotStatus();
    }

    // Создание основного контейнера
    const container = createUIElement('div', {}, { position: 'fixed', top: '10px', right: '10px', zIndex: '10000', backgroundColor: '#fff', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', width: '300px' });

    // Новый блок с кнопкой "Visual Effects On/Off"
    const toggleButton = createUIElement('button', {
        id: 'visualEffectsButton',
        onclick: () => toggleVisualEffects()
    }, {
        width: '100%',
        padding: '10px',
        marginBottom: '10px',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        textAlign: 'center'
    }, container);

    // Установить начальное состояние текста и цвета кнопки
    updateToggleButton(toggleButton);


    // Существующий блок с кнопками скриншотов
    const buttonRow = createUIElement('div', {}, { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }, container);

    createUIElement(
        'button',
        {
            id: 'emptyScreenButton',
            title: 'Empty Screen',
            onclick: () => singleScreenshot(`Screenshot_${screenshotCounter}`),
        },
        {
            width: '40px',
            height: '40px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f0f0f0',
        },
        buttonRow
    ).innerHTML = `<svg width="18" height="18" viewBox="0 -2 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>camera</title> <desc>Created with Sketch Beta.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage"> <g id="Icon-Set" sketch:type="MSLayerGroup" transform="translate(-256.000000, -465.000000)" fill="#202020"> <path d="M272,487 C268.687,487 266,484.313 266,481 C266,477.687 268.687,475 272,475 C275.313,475 278,477.687 278,481 C278,484.313 275.313,487 272,487 L272,487 Z M272,473 C267.582,473 264,476.582 264,481 C264,485.418 267.582,489 272,489 C276.418,489 280,485.418 280,481 C280,476.582 276.418,473 272,473 L272,473 Z M286,489 C286,490.104 285.104,491 284,491 L260,491 C258.896,491 258,490.104 258,489 L258,473 C258,471.896 258.896,471 260,471 L264,471 L265,469 C265.707,467.837 265.896,467 267,467 L277,467 C278.104,467 278.293,467.837 279,469 L280,471 L284,471 C285.104,471 286,471.896 286,473 L286,489 L286,489 Z M284,469 L281,469 L280,467 C279.411,465.837 279.104,465 278,465 L266,465 C264.896,465 264.53,465.954 264,467 L263,469 L260,469 C257.791,469 256,470.791 256,473 L256,489 C256,491.209 257.791,493 260,493 L284,493 C286.209,493 288,491.209 288,489 L288,473 C288,470.791 286.209,469 284,469 L284,469 Z" id="camera" sketch:type="MSShapeGroup"> </path> </g> </g> </g></svg>`;


    createUIElement('button', { innerText: 'Effect Screen', onclick: () => {
        const { name, text } = getEffectNameAndText();
        singleScreenshot(name, text);
    } }, {
        flexGrow: '1',
        marginLeft: '10px',
        padding: '10px',
        backgroundColor: '#f0f0f0',
        border: '1px solid #ddd',
        color: '#202020',
        borderRadius: '5px',
        cursor: 'pointer'
    }, buttonRow);

    // Второй ряд: превью
    createUIElement('div', { id: 'screenshotStatus' }, { display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }, container);

    // Третий ряд кнопок с обновлённым дизайном
    const actionRow = createUIElement(
        'div',
        {},
        {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '10px',
        },
        container
    );

    // Добавляем поле ввода для задержки (в существующий UI)
    const delayInput = createUIElement('input', {
        id: 'gifDelayInput',
        type: 'number',
        placeholder: '1000 мс', // значение по умолчанию
        title: 'Введите задержку в миллисекундах между кадрами',
    }, {
        flexGrow: '1',
        marginRight: '10px',
        padding: '5px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        width: '20px',
        height: '40px',
    }, actionRow);

    // Использование существующей кнопки "to GIF"
    createUIElement(
        'button',
        { innerText: 'TO GIF', onclick: createGIFWithGifJS },
        {
            title: 'Download All',
            flexGrow: '1',
            padding: '10px',
            backgroundColor: '#007bff',
            border: '1px solid #0279f8',
            color: '#fff',
            borderRadius: '5px',
            cursor: 'pointer',
            textAlign: 'center',
            height: '40px',
        },
        actionRow
    );

    // Кнопка "Download All" с квадратным дизайном и лайновой иконкой
    createUIElement(
        'button',
        {
            title: 'Download All',
            onclick: downloadAllScreenshots,
        },
        {
            width: '40px',
            height: '40px',
            marginLeft: '10px',
            backgroundColor: '#007bff',
            border: '1px solid #0279f8',
            color: '#fff',
            borderRadius: '5px',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        actionRow
    ).innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-download">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
</svg>`;

    // Кнопка "Clear Screens" с квадратным дизайном и лайновой иконкой
    createUIElement(
        'button',
        {
            title: 'Clear Screens',
            onclick: clearScreenshots,
        },
        {
            width: '40px',
            height: '40px',
            marginLeft: '10px',
            backgroundColor: '#DC3545',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        actionRow
    ).innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
</svg>`;



    updateScreenshotStatus();
})();