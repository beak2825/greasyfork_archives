// ==UserScript==
// @name         PrefilterPictures
// @namespace    http://tampermonkey.net/
// @version      1
// @description  PrefilterPictures open
// @author       You
// @match        *://*/Admin/PrefilterPictures*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=triplenext.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/525541/PrefilterPictures.user.js
// @updateURL https://update.greasyfork.org/scripts/525541/PrefilterPictures.meta.js
// ==/UserScript==

(function() {
    'use strict';
// Контейнер для изображений
const imageContainer = document.createElement('div');
imageContainer.style.position = 'fixed';
imageContainer.style.top = '0';
imageContainer.style.left = '0';
imageContainer.style.width = '100vw';
imageContainer.style.height = '100vh';
imageContainer.style.zIndex = '10000';
imageContainer.style.pointerEvents = 'none'; // Позволяет кликать сквозь контейнер
document.body.appendChild(imageContainer);

// Переменная для управления z-index
let highestZIndex = 10000;

// Функция обработки клика по изображению
function handleImageClick(event, img) {
    if (!img) return;
    event.stopPropagation();

    let imageUrl = img.getAttribute('baseurl') || img.src;

    if (imageUrl.includes('ResizeImage')) {
        const urlParams = new URLSearchParams(imageUrl.split('?')[1]);
        imageUrl = decodeURIComponent(urlParams.get('sourceUrl'));
    }

    // Создаём контейнер для изображения
    const imgWrapper = document.createElement('div');
    Object.assign(imgWrapper.style, {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        padding: '0px',
        borderRadius: '0px',
        boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
        backgroundImage: `
            linear-gradient(45deg, #666 25%, transparent 25%, transparent 75%, #666 75%, #666),
            linear-gradient(45deg, #666 25%, black 25%, black 75%, #666 75%, #666)
        `,
        backgroundSize: '20px 20px',
        backgroundPosition: '0 0, 10px 10px',
        zIndex: highestZIndex++,
        cursor: 'pointer',
        pointerEvents: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'transform 0.1s',
    });

    // Крестик закрытия
    const closeButton = document.createElement('div');
    Object.assign(closeButton.style, {
        position: 'absolute',
        top: '5px',
        right: '5px',
        width: '25px',
        height: '25px',
        backgroundColor: '#42ace9',
        color: 'white',
        fontSize: '18px',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        cursor: 'pointer',
    });
    closeButton.innerText = '×';
    closeButton.addEventListener('click', () => imgWrapper.remove());

    // Создаём изображение
    const imgTag = document.createElement('img');
    imgTag.src = imageUrl;
    Object.assign(imgTag.style, {
        maxWidth: '90vw',
        maxHeight: '90vh',
        borderRadius: '0px',
        cursor: 'grab',
    });

    // Перетаскивание контейнера
    let isDragging = false;
    let offsetX = 0, offsetY = 0;

    imgWrapper.addEventListener('mousedown', (e) => {
        e.preventDefault();
        isDragging = true;
        offsetX = e.clientX - imgWrapper.offsetLeft;
        offsetY = e.clientY - imgWrapper.offsetTop;
        imgWrapper.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        imgWrapper.style.left = `${e.clientX - offsetX}px`;
        imgWrapper.style.top = `${e.clientY - offsetY}px`;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        imgWrapper.style.cursor = 'pointer';
    });

    // Переключение z-index по клику
    imgWrapper.addEventListener('mousedown', () => {
        imgWrapper.style.zIndex = highestZIndex++;
    });

    // ЗУМИРОВАНИЕ ВСЕГО КОНТЕЙНЕРА
    let scale = 1;
    imgWrapper.addEventListener('wheel', (event) => {
        event.preventDefault();
        scale += event.deltaY * -0.0015;
        scale = Math.min(Math.max(0.5, scale), 3); // Ограничиваем зум от 50% до 300%
        imgWrapper.style.transform = `translate(-50%, -50%) scale(${scale})`;
    });

    // Добавляем элементы в контейнер
    imgWrapper.appendChild(imgTag);
    imgWrapper.appendChild(closeButton);
    imageContainer.appendChild(imgWrapper);
}

// Обработчик кликов для <img>
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('click', function (event) {
        handleImageClick(event, img);
    });
});

document.querySelectorAll('li').forEach(li => {
    li.addEventListener('click', function (event) {
        // Проверяем, был ли клик на <div>, <a> с классом или <button> с классом
        const div = li.querySelector('div');
        const a = li.querySelectorAll('a');
        const button = li.querySelectorAll('button');

        // Проверяем, был ли клик на элементе <div>, <a> или <button>
        if (
            (div && div.contains(event.target)) ||  // Клик внутри <div>
            [...a].some(anchor => anchor.contains(event.target)) ||  // Клик внутри <a>
            [...button].some(btn => btn.contains(event.target)) // Клик внутри <button>
        ) {
            return; // Если клик был на этих элементах, не открываем изображение
        }

        // Если клик не был внутри <div>, <a> или <button>, ищем картинку и вызываем handleImageClick
        const img = li.querySelector('img');
        if (img) {
            handleImageClick(event, img);
        }
    });
});





})();