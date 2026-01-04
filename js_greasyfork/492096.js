// ==UserScript==
// @name         Палитра1
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Палитра для фона в админе
// @author       You
// @match        *://*/Admin/CompareBag/EditBag/*
// @match        *://*//Admin/CompareBag/EditBag/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=triplenext.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492096/%D0%9F%D0%B0%D0%BB%D0%B8%D1%82%D1%80%D0%B01.user.js
// @updateURL https://update.greasyfork.org/scripts/492096/%D0%9F%D0%B0%D0%BB%D0%B8%D1%82%D1%80%D0%B01.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
function createColorPalette(appendTo, targetElement) {
    var colorPalette = document.createElement("input");
    colorPalette.type = "color"; // Это поле выбора цвета
 
    // Применяем начальный градиентный фон к палитре
    colorPalette.style.background = "linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)";
 
    // Устанавливаем стили для элемента выбора цвета
    colorPalette.style.display = "block";
    colorPalette.style.position = "relative";
    colorPalette.style.bottom = "29px";
    colorPalette.style.left = "101px";
    colorPalette.style.width = "80px";
    colorPalette.style.height = "24px";
    colorPalette.style.padding = "0";
 
    colorPalette.addEventListener("input", function() {
        var selectedColor = colorPalette.value;
        targetElement.style.backgroundColor = selectedColor;
 
        // Сохраняем выбранный цвет в локальном хранилище
        localStorage.setItem("selectedColor", selectedColor);
    });
 
    // Проверяем, есть ли выбранный цвет в локальном хранилище
    var savedColor = localStorage.getItem("selectedColor");
    if (savedColor) {
        colorPalette.value = savedColor;
        targetElement.style.backgroundColor = savedColor;
    }
 
    appendTo.appendChild(colorPalette);
}
 
// Добавляем первую палитру для #custom-color-picker
var customColorPicker = document.querySelector("#custom-color-picker");
createColorPalette(customColorPicker, document.querySelector("#svgRed"));
 
// Добавляем вторую палитру для #simple-color-picker
var simpleColorPicker = document.querySelector("#simple-color-picker");
createColorPalette(simpleColorPicker, document.querySelector("#preview > span > a"));
})();