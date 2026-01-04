// ==UserScript==
// @name VK Скорость Музыки
// @name:en VK Playback Rate
// @namespace VKPLAYRATE
// @description Добавляет на vk.com регулировку скорости воспроизведения музыки в левом нижнем углу страницы. На даблклик по слайдеру возвращает исходное значение скорости.
// @description:en Adds music playback speed controls to vk.com(the bottom left corner of the page). A double-click on the slider returns the original speed value.
// @include *://vk.com/*
// @include *://m.vk.com/*
// @grant none
// @version 1.15
// @author alphatoaster
// @author alexshiry1
// @supportURL alphatoaster@cock.li
// @downloadURL https://update.greasyfork.org/scripts/457488/VK%20%D0%A1%D0%BA%D0%BE%D1%80%D0%BE%D1%81%D1%82%D1%8C%20%D0%9C%D1%83%D0%B7%D1%8B%D0%BA%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/457488/VK%20%D0%A1%D0%BA%D0%BE%D1%80%D0%BE%D1%81%D1%82%D1%8C%20%D0%9C%D1%83%D0%B7%D1%8B%D0%BA%D0%B8.meta.js
// ==/UserScript==

var allowsetval = false;
var mousedownID = -1;

range = document.createElement("span"); //Создание элемента span
range.innerHTML = '&nbsp;Playback rate:&nbsp;\
<span class="pl_rateval">1</span>x\
<br>\
<input type=range min=0.5 max=2 step=0.01 class="pl_rate">'; //Присваивание основных компонентов
range.style.position = 'fixed'; // Стили
range.id = "pl_rate_container";
range.style.bottom = '0';
range.style.left = '0';
range.style.zIndex = '99999999';
if (location.href.search(/widget/) == -1) { // Если не виджет
    document.body.append(range); // Добавление в конец body
}

function onPageLoad(event) { // Событие на полную загрузку страницы
    if (localStorage.getItem('plrate') !== undefined) {
        range.querySelector('input').value = parseFloat(localStorage.getItem('plrate')); // Восстановление значения из localstorage
    } else {
        range.querySelector('input').value = 1; // Если нет значения, то значение по умолчанию 1 (нормальная скорость)
    }
    allowsetval = true;
};

function updatePlayerRate() { // Установить скорость воспроизведения
    if (allowsetval === true) {
        try {
            if (getAudioPlayer()._impl._currentAudioEl.playbackRate != range.querySelector('input').value) { // Если скорость в аудиоплеере не совпадает со скоростью ползунка
                getAudioPlayer()._impl._currentAudioEl.playbackRate = range.querySelector('input').value; // Присвоить новую скорость
                localStorage.setItem('plrate', range.querySelector('input').value); // Сохранить новую скорость в localstorage
                document.querySelector('.pl_rateval').innerText = range.querySelector('input').value; // Отобразить значение скорости рядом с ползунком
            }
        } catch (e) {} // Подавление ошибки
    }
}

function sliderMouseDoubleClick(event) { // Событие на даблклик по слайдеру
    range.querySelector('input').value = 1;
    updatePlayerRate();
};

function sliderMouseDown(event) { // Событие при нажатии кнопки мыши по слайдеру
    if (mousedownID == -1)
        mousedownID = setInterval(updatePlayerRate, 100);
};

function sliderMouseUp(event) { // Событие при разжатии кнопки мыши по слайдеру
    if (mousedownID != -1) {
        clearInterval(mousedownID);
        mousedownID = -1;
    }
};


// Добавить "прослушку" необходимых событий для всех функций
window.addEventListener('load', onPageLoad);
document.getElementById('pl_rate_container').addEventListener("dblclick", sliderMouseDoubleClick);
document.querySelector('.pl_rate').addEventListener("mousedown", sliderMouseDown);
document.querySelector('.pl_rate').addEventListener("mouseup", sliderMouseUp);
document.querySelector('.pl_rate').addEventListener("mouseout", sliderMouseUp);