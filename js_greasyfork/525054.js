// ==UserScript==
// @name         Информация о темах
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  для форума BR
// @author       kalibr Stoyn
// @match        https://forum.blackrussia.online/*
// @icon         https://i.postimg.cc/RFg3d5zr/photo-2024-07-07-18-38-42.jpg
// @grant        none
// @license MIT
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/525054/%D0%98%D0%BD%D1%84%D0%BE%D1%80%D0%BC%D0%B0%D1%86%D0%B8%D1%8F%20%D0%BE%20%D1%82%D0%B5%D0%BC%D0%B0%D1%85.user.js
// @updateURL https://update.greasyfork.org/scripts/525054/%D0%98%D0%BD%D1%84%D0%BE%D1%80%D0%BC%D0%B0%D1%86%D0%B8%D1%8F%20%D0%BE%20%D1%82%D0%B5%D0%BC%D0%B0%D1%85.meta.js
// ==/UserScript==


(function() {
    'use strict';

   // Функция для подсчета элементов с классами 'structItem structItem--thread is-prefix14' и 'structItem structItem--thread is-prefix2'
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
    countElement1.textContent = 'ТЕМЫ НА ОЖИДАНИИ: ' + count1;
    // Применяем стили к новому элементу
    countElement1.style.fontFamily = 'Arial';
    countElement1.style.fontSize = '16px';
    countElement1.style.color = 'red';

    // Добавляем новый элемент перед элементом 'filterBar'
    filterBar.insertAdjacentElement('beforebegin', countElement1);

    // Создаем новый элемент для отображения количества элементов с классом 'structItem structItem--thread is-prefix2'
    var countElement2 = document.createElement('div');
    // Устанавливаем класс для нового элемента, чтобы стилизовать его
    countElement2.className = 'count-element';
    // Записываем количество в новый элемент
    countElement2.textContent = 'ТЕМЫ НА РАССМОТРЕНИИ: ' + count2;
    // Применяем стили к новому элементу
    countElement2.style.fontFamily = 'Arial';
    countElement2.style.fontSize = '16px';
    countElement2.style.color = 'red';

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
})();