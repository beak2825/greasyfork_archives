// ==UserScript==
// @name         удаление системы
// @namespace    drawaria.logout
// @version      1.7
// @description  Кнопка удаления системы позволяет узнать, как будет выглядеть игра при удалении системы.
// @author       Minish
// @match        https://*.drawaria.online/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521665/%D1%83%D0%B4%D0%B0%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%81%D0%B8%D1%81%D1%82%D0%B5%D0%BC%D1%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/521665/%D1%83%D0%B4%D0%B0%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%81%D0%B8%D1%81%D1%82%D0%B5%D0%BC%D1%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Создание кнопки "удалить систему"
    const logoutButton = document.createElement('button');
    logoutButton.innerText = 'Выйти из системы';
    logoutButton.style.position = 'fixed';
    logoutButton.style.top = '10px';
    logoutButton.style.right = '10px';
    logoutButton.style.zIndex = '1000';
    logoutButton.style.padding = '10px 20px';
    logoutButton.style.fontSize = '16px';
    logoutButton.style.backgroundColor = 'red';
    logoutButton.style.color = 'white';
    logoutButton.style.border = 'none';
    logoutButton.style.borderRadius = '5px';
    logoutButton.style.cursor = 'pointer';
    document.body.appendChild(logoutButton);

    // Функция для создания сильных лагов и искажений
    function startLagEffect() {
        // Искажение всех элементов на странице
        const gameElements = document.querySelectorAll('canvas, #playerlist, #chatbox_messages, #votingbox, #passturnbutton, .playerlist-row, #roomcontrols, #chatbox_textinput, #gesturespickerbutton');

        gameElements.forEach((element) => {
            const distort = () => {
                element.style.transition = 'transform 0.1s, opacity 0.1s';
                element.style.transform = `scale(${Math.random() * 2 + 0.5}) rotate(${Math.random() * 720}deg)`;
                element.style.opacity = Math.random();
                setTimeout(() => {
                    element.style.transform = 'none';
                    element.style.opacity = '1';
                }, 100);
            };

            // Искажение каждые 100 миллисекунд
            setInterval(distort, 100);
        });

        // Движение всех элементов
        const moveElements = () => {
            // Движение элементов с черным фоном и кнопки друзей
            const blackElements = document.querySelectorAll('*[style*="background: black"], .invbox, .drawcontrols-button, .button-friends');
            blackElements.forEach((element) => {
                element.style.position = 'absolute';
                element.style.left = `${Math.random() * window.innerWidth}px`;
                element.style.top = `${Math.random() * window.innerHeight}px`;
            });

            // Движение остальных игровых элементов
            gameElements.forEach((element) => {
                element.style.position = 'absolute';
                element.style.left = `${Math.random() * window.innerWidth}px`;
                element.style.top = `${Math.random() * window.innerHeight}px`;
            });
        };

        // Движение каждые 200 миллисекунд
        setInterval(moveElements, 200);
    }

    // Функция для изменения цвета элементов
    function changeColors() {
        // Изменение цвета для элементов с классом "invbox"
        const invitationBox = document.querySelector('.invbox');
        if (invitationBox) {
            invitationBox.style.background = 'black'; // Изменение цвета фона на черный
            invitationBox.querySelector('span').style.color = 'white'; // Изменение цвета текста на белый
        }

        // Изменение цвета для элементов с классом "drawcontrols-button"
        const drawControlsButtons = document.querySelectorAll('.drawcontrols-button');
        drawControlsButtons.forEach((button) => {
            button.style.background = 'black'; // Изменение цвета фона на черный
            button.style.color = 'white'; // Изменение цвета текста на белый
        });

        // Изменение цвета для кнопки друзей
        const friendsButton = document.querySelector('.button-friends');
        if (friendsButton) {
            friendsButton.style.background = 'black'; // Изменение цвета фона на черный
            friendsButton.style.color = 'white'; // Изменение цвета текста на белый
        }
    }

    // Добавление обработчика события для кнопки
    logoutButton.addEventListener('click', () => {
        startLagEffect();
        changeColors(); // Вызов функции изменения цвета
    });
})();
