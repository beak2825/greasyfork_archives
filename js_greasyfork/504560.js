// @license 0x88
// ==UserScript==
// @name         стрелка
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Enhance forum UI with animations and effects
// @match        https://lolz.live/*
// @match        https://zelenka.guru/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/504560/%D1%81%D1%82%D1%80%D0%B5%D0%BB%D0%BA%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/504560/%D1%81%D1%82%D1%80%D0%B5%D0%BB%D0%BA%D0%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isEnabled = JSON.parse(localStorage.getItem('greenArrowEnabled')) || true;

    // CSS для зеленой стрелки
    const style = document.createElement('style');
    style.innerHTML = `
        .green-arrow {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 16px;
            color: rgb(34, 142, 93);
            opacity: 0;
            transition: opacity 0.2s ease-in-out;
        }
        .discussionListItem:hover .green-arrow {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);

    // Функция для добавления зеленой стрелки
    function addGreenArrow(element) {
        const arrow = document.createElement('i');
        arrow.classList.add('green-arrow', 'fas', 'fa-arrow-left');
        element.appendChild(arrow);
    }

    // Функция для удаления зеленой стрелки
    function removeGreenArrow(element) {
        const arrow = element.querySelector('.green-arrow');
        if (arrow) {
            arrow.remove();
        }
    }

    // Найти все элементы с классом .discussionListItem и добавить или удалить зеленые стрелки в зависимости от состояния
    function updateArrows() {
        const discussionListItems = document.querySelectorAll('.discussionListItem');
        discussionListItems.forEach(discussionListItem => {
            if (isEnabled) {
                addGreenArrow(discussionListItem);
            } else {
                removeGreenArrow(discussionListItem);
            }
        });
    }

    // Обработчик события нажатия клавиш
    document.addEventListener('keydown', function(event) {
        if (event.shiftKey && (event.key === 'K' || event.key === 'Л')) {
            isEnabled = !isEnabled;
            localStorage.setItem('greenArrowEnabled', JSON.stringify(isEnabled));
            updateArrows();
        }
    });

    // Инициализация
    updateArrows();

    // Обновление стрелок при загрузке страницы
    window.addEventListener('DOMContentLoaded', updateArrows);
    // Функция для замены текста плейсхолдера
    function replacePlaceholderText() {
        const searchInput = document.querySelector('#searchBar .textCtrl.QuickSearchQuery');
        if (searchInput) {
            searchInput.placeholder = "Что будем искать?";
        }
    }

    })();