// ==UserScript==
// @name         Счетчик ЖБ ожидание
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Счетчик тем для форума
// @author       Botir_Soliev
// @match        https://forum.blackrussia.online/*
// @icon         https://cdn.icon-icons.com/icons2/4159/PNG/512/ui_app_application_computer_program_software_legacy_icon_261654.png
// @grant        none
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/509569/%D0%A1%D1%87%D0%B5%D1%82%D1%87%D0%B8%D0%BA%20%D0%96%D0%91%20%D0%BE%D0%B6%D0%B8%D0%B4%D0%B0%D0%BD%D0%B8%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/509569/%D0%A1%D1%87%D0%B5%D1%82%D1%87%D0%B8%D0%BA%20%D0%96%D0%91%20%D0%BE%D0%B6%D0%B8%D0%B4%D0%B0%D0%BD%D0%B8%D0%B5.meta.js
// ==/UserScript==
// Функция для создания элемента с подсчетом
function createCountElement(className, count, text) {
  // Создаем новый элемент для отображения количества
  var countElement = document.createElement('div');
  // Устанавливаем класс для нового элемента
  countElement.className = 'count-element';
  // Записываем количество в новый элемент
  countElement.textContent = text + ': ' + count;
  // Применяем стили к новому элементу
  countElement.style.fontFamily = 'Times New Roman';
  countElement.style.fontSize = '15px';
  countElement.style.color = 'Lime';

  return countElement;
}

// Функция для подсчета элементов и отображения их количества
function countElements() {
  // Получаем все элементы с классом 'structItem structItem--thread is-prefix14'
  var elements1 = document.querySelectorAll('.structItem.structItem--thread.is-prefix14');
  // Получаем все элементы с классом 'structItem structItem--thread is-prefix2'
  var elements2 = document.querySelectorAll('.structItem.structItem--thread.is-prefix2');
  // Получаем все элементы с классом 'structItem structItem--thread is-prefix8'
//  var elements3 = document.querySelectorAll('.structItem.structItem--thread.is-prefix8');
      // Получаем все элементы с классом 'structItem structItem--thread is-prefix8'
//  var elements4 = document.querySelectorAll('.structItem.structItem--thread.is-prefix4');
      // Получаем все элементы с классом 'structItem structItem--thread is-prefix8'
//  var elements5 = document.querySelectorAll('.structItem.structItem--thread.is-prefix7');

  // Подсчитываем количество найденных элементов
  var count1 = elements1.length;
  var count2 = elements2.length;
//  var count3 = elements3.length;
//  var count4 = elements4.length;
//  var count5 = elements5.length;

  // Находим элемент с классом 'filterBar'
  var filterBar = document.querySelector('.filterBar');

  // Проверяем, существует ли элемент 'filterBar'
  if (filterBar) {
    // Добавляем новый элемент перед элементом 'filterBar'
      filterBar.insertAdjacentElement('beforebegin', createCountElement('.structItem.structItem--thread.is-prefix14', count1,'ОЖИДАНИИ'));
      filterBar.insertAdjacentElement('beforebegin', createCountElement('.structItem.structItem--thread.is-prefix2', count2, 'РАССМОТРЕНИИ'));

//    filterBar.insertAdjacentElement('beforebegin', createCountElement('.structItem.structItem--thread.is-prefix8', count3, 'ОДОБРЕНО'));
//    filterBar.insertAdjacentElement('beforebegin', createCountElement('.structItem.structItem--thread.is-prefix4', count4, 'ОТКАЗАНО'));
//    filterBar.insertAdjacentElement('beforebegin', createCountElement('.structItem.structItem--thread.is-prefix7', count5, 'ЗАКРЫТО'));
  } else {
    console.log('Элемент с классом "filterBar" не найден.');
  }

}

// Вызываем функцию при загрузке страницы
window.onload = function() {
  countElements();
};


