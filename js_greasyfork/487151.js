// ==UserScript==
// @license      MIT
// @name         OfftopikNext
// @namespace    http://tampermonkey.net/
// @version      2024-02-12
// @description  next button
// @author       You
// @match        https://zelenka.guru/threads/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487151/OfftopikNext.user.js
// @updateURL https://update.greasyfork.org/scripts/487151/OfftopikNext.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // Функция для получения ID страницы из URL
    function getPageId() {
        var url = window.location.href;
        var matches = url.match(/\/threads\/(\d+)\//);
        if (matches && matches.length > 1) {
            return parseInt(matches[1]);
        }
        return null;
    }

    // Функция для выполнения запроса на страницу с более большим идентификатором
    function goToNextPage() {
        var currentPageId = getPageId();
        if (currentPageId !== null) {
            fetch('https://zelenka.guru/forums/8/')
                .then(response => response.text())
                .then(data => {
                var matches = data.match(/threads\/(\d+)\//g);
                var len = matches.length
                for (var i = 0; i < len; i++) {
                    matches[i] = parseInt(matches[i].match(/\d+/)[0]);
                }
                for (var j = 0; j < len; j++) {
                    var minNextPageId = Math.min(...matches);
                    if (minNextPageId > currentPageId) {
                        window.location.href = 'https://zelenka.guru/threads/' + minNextPageId + '/';
                        return; // Выход из функции после перенаправления
                    } else {
                        // Если минимальный айдишник не больше текущей страницы, удаляем его из массива
                        var index = matches.indexOf(minNextPageId);
                        console.log(index, matches.length, j);
                        matches.splice(index, 1);
                        console.log(matches);
                    }
                }
            })
                .catch(error => {
                console.error('Ошибка при выполнении запроса:', error);
            });
        } else {
            alert('Не удалось получить ID текущей страницы');
        }
    }

    // Создаем кнопку и добавляем обработчик события
    function addButton() {
        var myButton = document.createElement('button');
        myButton.innerHTML = 'некст';
        myButton.className = 'btn-new'; // Добавляем класс для стилей

        // Устанавливаем размер и цвет кнопки
        myButton.style.width = '150px'; // Замените на желаемый размер
        myButton.style.height = '40px'; // Замените на желаемый размер
        myButton.style.backgroundColor = 'rgb(34,142,93)'; // Замените на желаемый цвет

        // Устанавливаем стили кнопки
        myButton.style.border = 'none';
        myButton.style.borderRadius = '10px';
        myButton.style.textDecoration = 'none';
        myButton.style.color = 'white';
        myButton.style.boxShadow = '0 5px 0 #003CC5';
        myButton.style.float = 'right'

        // Назначаем обработчик события на наведение
        myButton.addEventListener('click', function() {
            myButton.style.boxShadow = 'none';
            myButton.style.position = 'relative';
            myButton.style.top = '5px';
        });

        // Назначаем обработчик события на убирание курсора
        myButton.addEventListener('mouseout', function() {
            myButton.style.position = 'initial';
            myButton.style.top = 'initial';
        });

    // Проверяем наличие элемента, указывающего на нужную страницу
        var offTopicLink = document.querySelector('a[href="forums/8/"]');
        if (offTopicLink) {
            // Если элемент найден, создаем кнопку и добавляем обработчик события
            myButton.addEventListener('click', goToNextPage);
            var container = document.querySelector('.pageWidth'); // Замените '.some-container' на селектор вашего контейнера
            container.appendChild(myButton);
        } else {
            console.log('На данной странице не найден элемент "Оффтопик", кнопка не будет добавлена.');

        }
    }

// Вызываем функцию для добавления кнопки при загрузке страницы
    addButton();
})();