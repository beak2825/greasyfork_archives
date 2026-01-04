// ==UserScript==
// @name         Счетчик тем для форума || BR
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Счетчик тем для форума
// @author       хубабубу
// @match        https://forum.blackrussia.online/*
// @icon         https://cdn.icon-icons.com/icons2/4159/PNG/512/ui_app_application_computer_program_software_legacy_icon_261654.png
// @grant        none
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/537950/%D0%A1%D1%87%D0%B5%D1%82%D1%87%D0%B8%D0%BA%20%D1%82%D0%B5%D0%BC%20%D0%B4%D0%BB%D1%8F%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%7C%7C%20BR.user.js
// @updateURL https://update.greasyfork.org/scripts/537950/%D0%A1%D1%87%D0%B5%D1%82%D1%87%D0%B8%D0%BA%20%D1%82%D0%B5%D0%BC%20%D0%B4%D0%BB%D1%8F%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%7C%7C%20BR.meta.js
// ==/UserScript==
// Функция для создания элемента с подсчетом
function countElements() {
  // Получаем все элементы с классом 'structItem structItem--thread is-prefix14'
  var elements1 = document.querySelectorAll('.structItem.structItem--thread.is-prefix14');
  // Получаем все элементы с классом 'structItem structItem--thread is-prefix2'
  var elements2 = document.querySelectorAll('.structItem.structItem--thread.is-prefix2');

  // Подсчитываем количество найденных элементов
  var count1 = elements1.length;
  var count2 = elements2.length;

  // Находим элемент с классом 'filterBar'
  var filterBar = document.querySelector('.filterBar');

  // Проверяем, существует ли элемент 'filterBar'
  if (filterBar) {
    // Создаем новый элемент для отображения количества элементов с классом 'structItem structItem--thread is-prefix14'
    var countElement1 = document.createElement('div');
    // Устанавливаем класс для нового элемента, чтобы стилизовать его
    countElement1.className = 'count-element';
    // Записываем количество в новый элемент
    countElement1.textContent = 'Темы в ожидании: ' + count1;
    // Применяем стили к новому элементу
    countElement1.style.fontFamily = 'Arial';
    countElement1.style.fontSize = '16px';
    countElement1.style.color = '#0fbfff';

    // Добавляем новый элемент перед элементом 'filterBar'
    filterBar.insertAdjacentElement('beforebegin', countElement1);

    // Создаем новый элемент для отображения количества элементов с классом 'structItem structItem--thread is-prefix2'
    var countElement2 = document.createElement('div');
    // Устанавливаем класс для нового элемента, чтобы стилизовать его
    countElement2.className = 'count-element';
    // Записываем количество в новый элемент
    countElement2.textContent = 'Темы на рассмотрении: ' + count2;
    // Применяем стили к новому элементу
    countElement2.style.fontFamily = 'Arial';
    countElement2.style.fontSize = '16px';
    countElement2.style.color = '#ff2400';

    // Добавляем новый элемент перед элементом 'filterBar'
    filterBar.insertAdjacentElement('beforebegin', countElement2);
  } else {
    console.log('Элемент с классом "filterBar" не найден.');
  }
}

// Вызываем функцию при загрузке страницы
window.onload = function() {
  countElements();
};