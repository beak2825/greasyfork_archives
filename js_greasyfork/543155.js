// ==UserScript==
// @name         Смена фона на форуме
// @namespace    https://forum.blackrussia.online
// @version      2.3
// @description  Изменение фона на форуме Black Russia
// @author       ensemble mansory
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/

// @grant        none
// @license 	 MIT// @collaborator Quenk269
// @icon https://i.postimg.cc/s2LH4FPV/photo-2025-03-19-22-56-32.jpg
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/543155/%D0%A1%D0%BC%D0%B5%D0%BD%D0%B0%20%D1%84%D0%BE%D0%BD%D0%B0%20%D0%BD%D0%B0%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/543155/%D0%A1%D0%BC%D0%B5%D0%BD%D0%B0%20%D1%84%D0%BE%D0%BD%D0%B0%20%D0%BD%D0%B0%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B5.meta.js
// ==/UserScript==
(function () {
  'use strict';

const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const TEX_PREFIX = 13;
const CLOSE_PREFIX = 7;
const WAITING_PREFIX = 14;
const SPECIAL_PREFIX = 8; // prefix that will be set when thread seng to sa
const buttons = [

];
$(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    // Восстанавливаем фон из localStorage, если он существует
    const savedBackground = localStorage.getItem('backgroundImage');
    if (savedBackground) {
        $('body').css('background-image', `url(${savedBackground})`); // Устанавливаем сохраненный фон
        $('body').css('background-size', 'cover'); // Устанавливаем размер фона
    }

    addButton('Изменить фон', 'changeBackground'); // Добавлена кнопка для изменения фона

    // Поиск информации о теме
    const threadData = getThreadData();

    $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
    $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
    $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
    $('button#GA_PREFIX').click(() => editThreadData(GA_PREFIX, true));
    $('button#WAITING_PREFIX').click(() => editThreadData(WAITING_PREFIX, true));
    $('button#TEX_PREFIX').click(() => editThreadData(TEX_PREFIX, true));
    $('button#SPECIAL_PREFIX').click(() => editThreadData(SPECIAL_PREFIX, true));
    $('button#CLOSE_PREFIX').click(() => editThreadData(CLOSE_PREFIX, false));
    $('button#RESHENO_PREFIX').click(() => editThreadData(RESHENO_PREFIX, false));

    $(`button#selectAnswer`).click(() => {
        XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
        buttons.forEach((btn, id) => {
            if (id > 0) {
                $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
            } else {
                $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
            }
        });
    });

    // Обработчик для изменения фона
    $('button#changeBackground').click(() => {
        const url = prompt('Введите URL для нового фона:'); // Запрашиваем URL
        if (url) {
            $('body').css('background-image', `url(${url})`); // Устанавливаем новый фон
            $('body').css('background-size', 'cover'); // Устанавливаем размер фона
            localStorage.setItem('backgroundImage', url); // Сохраняем URL в localStorage
        }
    });

    // Синхронизация фона между вкладками
    window.addEventListener('storage', (event) => {
        if (event.key === 'backgroundImage' && event.newValue) {
            $('body').css('background-image', `url(${event.newValue})`);
            $('body').css('background-size', 'cover');
        }
    });

    // Анимация кнопок
    const css = `
    <style>
        button {
    position: relative;
    transition: background-color 0.3s, transform 0.3s;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    overflow: hidden;
}
.button:hover {
    background-color: #0056b3;
    transform: scale(1.05);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}
.button::before {
    top: -20px;
    left: 20%;
    animation: snowFall 4s linear infinite, moveLeftToRight 3s linear infinite;
}
.button::after {
    top: -30px;
    left: 50%;
    animation: snowFall 3s linear infinite, moveRightToLeft 4s linear infinite;
}
.button .snowflake1 {
    top: -40px;
    left: 70%;
    font-size: 10px; /* Немного больше, чтобы была разнообразие */
    animation: snowFall 5s linear infinite, moveBottomLeftToRight 4s linear infinite;
}
@keyframes snowFall {
    0% {
        top: -20px;
        opacity: 0.4; /* Прозрачность уменьшена */
        transform: translate(-50%, rotate(0deg));
    }
    50% {
        opacity: 0.6; /* Прозрачность на полпути */
    }
    100% {
        top: 100%;
        opacity: 0;
        transform: translate(-50%, rotate(360deg));
    }
}
@keyframes moveLeftToRight {
    0% { left: 20%; }
    50% { left: 40%; }
    100% { left: 20%; }
}
@keyframes moveRightToLeft {
    0% { left: 50%; }
    50% { left: 60%; }
    100% { left: 50%; }
}
@keyframes moveBottomLeftToRight {
    0% { left: 70%; }
    50% { left: 50%; }
    100% { left: 70%; }
}
@keyframes moveBottomRightToLeft {
    0% { left: 30%; }
    50% { left: 10%; }
    100% { left: 30%; }
}
    </style>`;
    $('head').append(css);
});

// Функция добавления кнопки
function addButton(name, id, animated = false) {
    $('.button--icon--reply').before(
        `<button type="button" class="button rippleButton ${animated ? 'animated-button' : ''}" id="${id}" style="margin: 3px;">
            <span class="text">${name}</span>
        </button>`
    );
}

// Функция анимации текста
function animateText() {
    const button = $('#exit .text');
    button.css('animation', 'textGlowFade 1.5s infinite alternate');
    let toggle = true;

    setInterval(() => {
        button.text(toggle ? 'by B.Wayne' : 'by B.Wayne');
        toggle = !toggle;
    }, 1500);
}

// Разметка кнопок
function buttonsMarkup(buttons) {
    return `<div class="select_answer">${buttons
        .map(
            (btn, i) =>
                `<button id="answers-${i}" class="button--primary button rippleButton" style="margin:5px">
                <span class="button-text">${btn.title}</span></button>`
        )
        .join('')}</div>`;
}

// Функция вставки содержимого
function pasteContent(id, data = {}, send = false) {
    const template = Handlebars.compile(buttons[id].content);
    if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

    $('span.fr-placeholder').empty();
    $('div.fr-element.fr-view p').append(template(data));
    $('a.overlay-titleCloser').trigger('click');

    if (send) {
        editThreadData(buttons[id].prefix, buttons[id].status);
        $('.button--icon.button--icon--reply.rippleButton').trigger('click');
    }
}

// Получение данных о теме
function getThreadData() {
    const authorID = $('a.username')[0].attributes['data-user-id'].nodeValue;
    const authorName = $('a.username').html();
    const hours = new Date().getHours();
    return {
        user: {
            id: authorID,
            name: authorName,
            mention: `[USER=${authorID}]${authorName}[/USER]`,
        },
        greeting: () =>
            4 < hours && hours <= 11
                ? 'Доброе утро'
                : 11 < hours && hours <= 15
                ? 'Добрый день'
                : 15 < hours && hours <= 21
                ? 'Добрый вечер'
                : 'Доброй ночи',
    };
}

// Функция редактирования данных темы
function editThreadData(prefix, pin = false) {
    const threadTitle = $('.p-title-value')[0].lastChild.textContent;

    fetch(`${document.URL}edit`, {
        method: 'POST',
        body: getFormData({
            prefix_id: prefix,
            title: threadTitle,
            sticky: pin ? 1 : 0,
            _xfToken: XF.config.csrf,
            _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
            _xfWithData: 1,
            _xfResponseType: 'json',
        }),
    }).then(() => location.reload());
}

// Функция получения данных формы
function getFormData(data) {
    const formData = new FormData();
    Object.entries(data).forEach(i => formData.append(i[0], i[1]));
    return formData;
}

$('head').append(css); // Добавление стилей в head
})();