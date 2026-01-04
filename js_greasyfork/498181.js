// ==UserScript==
// @name         апрув
// @namespace    http://tampermonkey.net/
// @version      2024-03-25
// @description  кнопка апрув
// @author       You
// @match        *://*/Admin/CompareBag/EditBag/*
// @match        *://*//Admin/CompareBag/EditBag/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498181/%D0%B0%D0%BF%D1%80%D1%83%D0%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/498181/%D0%B0%D0%BF%D1%80%D1%83%D0%B2.meta.js
// ==/UserScript==

(function() {
'use strict';

// Функция для выполнения действий при выборе опции
function selectOptionAndClick() {
  var select = document.getElementById("StatusId");
  var optionValue = ""; // Значение выбранной опции

  // Проверяем выбранное значение в выпадающем списке
  if (select.value === "9") {
    optionValue = "12"; // Выбираем ModerationComplete
  } else {
    optionValue = "2"; // Выбираем значение по умолчанию
  }

  // Проходим по опциям и выбираем соответствующее значение
  for (var i = 0; i < select.options.length; i++) {
    if (select.options[i].value === optionValue) {
      select.selectedIndex = i;
      break;
    }
  }

  // Вызываем событие клика на кнопке Save⇒Preview
  document.getElementById("btn-save-and-preview").click();
}

// Функция для обработки нажатия клавиши
function hotkeyHandler(event) {
  // Проверяем, была ли нажата клавиша A и не зажат ли при этом Ctrl, Alt или Shift
  if (event.key === 'A' && !event.ctrlKey && !event.altKey && !event.shiftKey) {
    // Вызываем функцию для выполнения действий при выборе опции
    selectOptionAndClick();
  }
}

// Проверяем наличие кнопки "Reprocess background removal"
if (!document.querySelector('a.btn.btn-primary[href*="/Admin/CompareBag/ReprocessBackgroundRemoval"]')) {
  // Создаем кнопку
  var button = document.createElement("button");
  button.innerHTML = "Approval";
  button.id = "selectApprovedBtn";
  button.type = "button";

  // Добавляем обработчик события на клик кнопки
  button.addEventListener("click", selectOptionAndClick);

  // Добавляем стили
  button.style.height = "32px";
  button.style.backgroundColor = "white";
  button.style.color = "red";
  button.style.borderRadius = "4px"; // Добавляем радиус границ
  button.style.borderColor = "#e3e3e3"; // Добавляем цвет границ
  button.style.borderWidth = "1px";
  button.style.marginRight = "5px";

  // Указываем родительский элемент, куда мы хотим вставить кнопку
  var parentElement = document.querySelector('input[name="button"]').parentNode;

  // Вставляем кнопку перед элементом <input>
  parentElement.insertBefore(button, document.querySelector('input[name="button"]'));

  // Добавляем обработчик события нажатия клавиши к документу
  document.addEventListener('keydown', hotkeyHandler);
}


})();