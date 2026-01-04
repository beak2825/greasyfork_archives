// ==UserScript==
// @name         Скрипт | Фон форума
// @namespace    https://forum.blackrussia.online
// @version      0.3
// @description  Фон можно ставить через f4.
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @author       - Arman (@xapanskiy)
// @grant        none
// @license      MIT
// @icon         https://i.pinimg.com/736x/00/47/3a/00473a6c4c03c4695fff67e4d5f2cb30.jpg
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/539386/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%7C%20%D0%A4%D0%BE%D0%BD%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/539386/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%7C%20%D0%A4%D0%BE%D0%BD%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0.meta.js
// ==/UserScript==

$(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    // Восстанавливаем фон из localStorage, если он существует
    const savedBackground = localStorage.getItem('backgroundImage');
    if (savedBackground) {
        $('body').css({
            'background-image': `url(${savedBackground})`,
            'background-size': 'cover',
            'background-position': 'center',
            'background-attachment': 'fixed'  // Фиксация фона
        });
    }

    // Функция для получения данных о теме
    function getThreadData() {
        const authorElement = $('a.username')[0];
        const authorID = authorElement ? authorElement.attributes['data-user-id'].nodeValue : null;
        const authorName = authorElement ? $(authorElement).html() : 'Гость';
        const hours = new Date().getHours();
        return {
            user: {
                id: authorID,
                name: authorName,
                mention: authorID ? `[USER=${authorID}]${authorName}[/USER]` : '',
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

    const threadData = getThreadData();
    const buttons = [/* Здесь добавьте нужные кнопки */];
    const buttonsMarkup = (buttons) => {
        // Возвращает разметку для кнопок, добавьте логику здесь
    };

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

    // Обработчик для нажатия клавиши F4
    $(document).keydown((event) => {
        if (event.key === 'F4') {
            const url = prompt('Введите URL для нового фона:');
            if (url) {
                $('body').css({
                    'background-image': `url(${url})`,
                    'background-size': 'cover',
                    'background-position': 'center',
                    'background-attachment': 'fixed'
                });
                localStorage.setItem('backgroundImage', url);
            }
        }
    });

    // Обработчик для изменения фона
    $('button#changeBackground').click(() => {
        const url = prompt('Введите URL для нового фона:');
        if (url) {
            $('body').css({
                'background-image': `url(${url})`,
                'background-size': 'cover',
                'background-position': 'center',
                'background-attachment': 'fixed'
            });
            localStorage.setItem('backgroundImage', url);
        }
    });

    // Синхронизация фона между вкладками
    window.addEventListener('storage', (event) => {
        if (event.key === 'backgroundImage' && event.newValue) {
            $('body').css({
                'background-image': `url(${event.newValue})`,
                'background-size': 'cover',
                'background-position': 'center',
                'background-attachment': 'fixed'
            });
        }
    });

    // CSS для кнопок и прозрачного фона
    const css = `
    <style>
        .button {
            transition: background-color 0.3s, transform 0.3s;
            border: 1px solid #ddd;
            border-radius: 5px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        .button:hover {
            background-color: #0056b3;
            transform: scale(1.05);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
        }
        .rippleButton {
            position: relative;
            overflow: hidden;
        }
        .rippleButton:after {
            content: '';
            position: absolute;
            background: rgba(255, 255, 255, 0.7);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
        }
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        .animated-button .text {
            animation: textGlowFade 1.5s infinite alternate;
        }
        @keyframes textGlowFade {
            0% {
                color: #ffffff;
                text-shadow: 0 0 25px #ffffff, 0 0 35px #ffffff, 0 0 50px #ffffff;
            }
            100% {
                color: transparent;
                text-shadow: none;
            }
        }
        /* Полностью прозрачные фоны */
        .block-container,
        .node-body,
        .node--depth2:nth-child(even) .node-body,
        .p-nav,
        .block-footer,
        .block-filterBar,
        .input,
        .fr-box.fr-basic,
        .inputGroup.inputGroup--joined .inputGroup-text,
        .block-minorHeader.uix_threadListSeparator,
        .structItem:nth-child(even),
        .p-sectionLinks,
        .p-header,
        .p-nav-list .p-navEl.is-selected,
        .p-staffBar,
        .message-responseRow,
        .memberH1eader-main,
        .p-footer-copyrightRow,
        .p-footer-inner,
        .pageNav-jump,
        .pageNav-page,
        body .uix_searchBar .uix_searchBarInner .uix_searchForm,
        .bbCodeBlock,
        .bbCodeBlock .bbCodeBlock-title,
        .bbCodeBlock .bbCodeBlock-expandLink {
            background: rgba(0, 0, 0, 0) !important;
            transition: background 0.3s;
        }
        .block--messages.block .message,
        .js-quickReply.block .message,
        .block--messages .block-row,
        .js-quickReply .block-row,
        .uix_extendedFooter,
        .message-cell.message-cell--user,
        .message-cell.message-cell--action,
        .fr-box.fr-basic,
        .blockStatus {
            background: rgba(0, 0, 0, 0) !important;
        }
        .block--messages.block .message:hover,
        .js-quickReply.block .message:hover,
        .block--messages .block-row:hover,
        .js-quickReply .block-row:hover,
        .uix_extendedFooter:hover,
        .message-cell.message-cell--user:hover,
        .message-cell.message-cell--action:hover {
            background: rgb(58 56 56 / 96%) !important;
        }
    </style>
    `;
    $('head').append(css); // Добавление стилей в head
});
