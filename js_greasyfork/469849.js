// ==UserScript==
// @name         ADMIN HELPER
// @namespace    https://admin.matrp.ru
// @version      1.1
// @description  Кликер для админ-сайта.
// @author       Suslov
// @match        https://admin.matrp.ru/*
// @icon         https://admin.matrp.ru/assets/images/logo-mini.svg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469849/ADMIN%20HELPER.user.js
// @updateURL https://update.greasyfork.org/scripts/469849/ADMIN%20HELPER.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var scriptId = '469849';
var currentVersion = GM_info.script.version; // Текущая версия скрипта

function checkForUpdates() {
  var apiURL = `https://greasyfork.org/en/scripts/469849.json`;

  fetch(apiURL)
    .then(response => response.json())
    .then(scriptInfo => {
      var latestVersion = scriptInfo.version;

      if (latestVersion > currentVersion) {
        var confirmUpdate = confirm('Вышло новое обновление скрипта! Хотите обновить его прямо сейчас?');

        if (confirmUpdate) {
          redirectToGreasyFork();
        }
      }
    })
    .catch(error => {
      console.error('Ошибка при проверке обновлений:', error);
    });
}

function redirectToGreasyFork() {
  window.location.href = `https://greasyfork.org/ru/scripts/469849-admin-helper-beta`;
}

// Проверяем наличие новых обновлений
checkForUpdates();

    // Функция, которая будет вызываться при нажатии на кнопку "Ввести кол-во"
    function handleClick() {
        var input = prompt('Введите количество кликов:');
        var clickCount = parseInt(input, 10);
        if (!isNaN(clickCount) && clickCount > 0) {
            clickButton(clickCount);
        } else {
            alert('Некорректное количество кликов. Попробуйте снова.');
        }
    }

    // Функция, которая инициирует нажатие на кнопку заданное количество раз с интервалом
function clickButton(count) {
    var button = document.querySelector('html body div#layout-wrapper div.main-content div.page-content div.container-fluid div.row div.col-12 div.card div.card-body div.row.mb-2.align-items-center div.col-sm-auto.mb-2 a button.btn.btn-primary.w-md.loadMoreRows');
    var loader = document.querySelector('.bx-loader');
    var interval = 2700; // Интервал между нажатиями в миллисекундах

    var i = 0;
    var intervalId = setInterval(function() {
        button.click();
        loader.style.display = 'block';
        i++;

        if (i === count) {
            clearInterval(intervalId);
            showSuccessDialog(); // Вызов функции для отображения диалогового окна
        }
    }, interval);
}
    // Функция для отображения диалогового окна "Успешно выполнено"
function showSuccessDialog() {
    alert('Успешно выполнено');
}

    // Создаем кнопку "Ввести кол-во" и добавляем обработчик клика
    var enterButton = document.createElement('button');
    enterButton.textContent = 'Ввести кол-во';
    enterButton.style.position = 'fixed';
    enterButton.style.left = '1400px';
    enterButton.style.bottom = '500px';

    var targetButton = document.querySelector('html body div#layout-wrapper div.main-content div.page-content div.container-fluid div.row div.col-12 div.card div.card-body div.row.mb-2.align-items-center div.col-sm-auto.mb-2 a button.btn.btn-primary.w-md.loadMoreRows');
    var targetButtonStyles = getComputedStyle(targetButton);

    enterButton.style.color = targetButtonStyles.color;
    enterButton.style.backgroundColor = targetButtonStyles.backgroundColor;
    enterButton.style.border = targetButtonStyles.border;
    enterButton.style.padding = targetButtonStyles.padding;
    enterButton.style.fontFamily = targetButtonStyles.fontFamily;
    enterButton.style.fontSize = targetButtonStyles.fontSize;
    enterButton.style.fontWeight = targetButtonStyles.fontWeight;

    var targetButtonContainer = targetButton.parentNode.parentNode; // Получаем контейнер родительского элемента указанной кнопки
    targetButtonContainer.appendChild(enterButton); // Добавляем кнопку "Ввести кол-во" в контейнер

    enterButton.addEventListener('click', handleClick);
})();