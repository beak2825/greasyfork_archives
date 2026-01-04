// ==UserScript==
// @name         ImageChoice1
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Масштаб картинки ImageChoice
// @author       You
// @match        *://*/Admin/MyCurrentTask/ChooseImage*
// @match        *://*//Admin/MyCurrentTask/ChooseImage*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492097/ImageChoice1.user.js
// @updateURL https://update.greasyfork.org/scripts/492097/ImageChoice1.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
// Находим элемент с изображением
const imageElement = document.querySelector('.inner.header-text img');
// Находим родительский элемент кнопок
const buttonsContainer = document.querySelector('.buttons');
 
// Устанавливаем начальные значения для перемещения
let isDragging = false;
let startX, startY, offsetX = 0, offsetY = 0;
 
// Устанавливаем начальный масштаб
let scale = 1;
 
// Функция для обработки события прокрутки колесика мыши
function handleWheel(event) {
    // Определяем направление прокрутки
    const delta = Math.sign(event.deltaY);
    // Изменяем масштаб в зависимости от направления прокрутки
    scale += delta * 0.1;
    // Ограничиваем минимальный и максимальный масштаб
    scale = Math.max(0.1, Math.min(scale, 3));
    // Применяем трансформацию масштабирования к изображению
    imageElement.style.transform = `scale(${scale}) translate(${offsetX}px, ${offsetY}px)`;
    // Предотвращаем стандартное поведение прокрутки страницы
    event.preventDefault();
}
 
// Функция для начала перемещения изображения
function startDrag(event) {
    isDragging = true;
    startX = event.clientX - offsetX;
    startY = event.clientY - offsetY;
}
 
// Функция для окончания перемещения изображения
function endDrag() {
    isDragging = false;
}
 
// Функция для перемещения изображения
function drag(event) {
    if (isDragging) {
        offsetX = event.clientX - startX;
        offsetY = event.clientY - startY;
        imageElement.style.transform = `scale(${scale}) translate(${offsetX}px, ${offsetY}px)`;
    }
}
 
// Функция для сброса масштаба до 100%
function resetScale() {
    scale = 1;
    offsetX = 0;
    offsetY = 0;
    imageElement.style.transform = `scale(${scale}) translate(${offsetX}px, ${offsetY}px)`;
}
 
// Добавляем обработчик события двойного клика мыши
imageElement.addEventListener('dblclick', resetScale);
 
 
// Добавляем обработчики событий мыши для перемещения изображения
imageElement.addEventListener('mousedown', startDrag);
imageElement.addEventListener('mouseup', endDrag);
imageElement.addEventListener('mousemove', drag);
 
// Добавляем обработчик события прокрутки колесика мыши
imageElement.addEventListener('wheel', handleWheel);
 
// Добавляем обработчик события нажатия клавиши
document.addEventListener('keydown', event => {
    // Проверяем, была ли нажата клавиша "0"
    if (event.key === '0') {
        resetScale();
    }
});
 
// Добавляем обработчик события изменения размеров окна браузера
window.addEventListener('resize', () => {
    // Пересчитываем положение кнопок относительно изображения
    const imageRect = imageElement.getBoundingClientRect();
    buttonsContainer.style.top = `${imageRect.top + imageRect.height}px`;
    buttonsContainer.style.left = `${imageRect.left}px`;
 
});
 
 
 
})();