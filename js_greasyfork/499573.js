// ==UserScript==
// @name          Black Russia | Скрипт для CX
// @namespace     https://forum.blackrussia.online
// @version       1.0
// @description   Скрипт для СХ
// @author        Dreamy Crazy
// @match         https://forum.blackrussia.online/threads/*
// @include       https://forum.blackrussia.online/threads/
// @icon          https://icons.iconarchive.com/icons/google/noto-emoji-food-drink/256/32343-watermelon-icon.png
// @grant         none
// @license       none
// @downloadURL https://update.greasyfork.org/scripts/499573/Black%20Russia%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20CX.user.js
// @updateURL https://update.greasyfork.org/scripts/499573/Black%20Russia%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20CX.meta.js
// ==/UserScript==

(function () {
    'use strict';
    'esversion 6' ;
    const UNACCEPT_PREFIX = 4; // Префикс "Отказано"
    const ACCEPT_PREFIX = 8; //  Префикс "Одобрено"
    const PIN_PREFIX = 2;  //  Префикс "На рассмотрении"
    const WATCHED_PREFIX = 9; // Префикс "Рассмотрено"
    const CLOSE_PREFIX = 7; // Префикс "Закрыто"
    const TEX_PREFIX = 13; // Префикс "Техническому специалисту"
    const GA_PREFIX = 12; // Префикс "Главному Администратору"
    const V_PREFIX = 1;
    const NULL_PREFIX = 15;
    const buttons = [
        {
            title: '-----------------------------------------------------------------------Раздел неактив---------------------------------------------------------------',
        },
        {
            title: 'Одобрено',
            content:
           
            "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][center]Ваша заявка на неактив получает статус:[/center][/SIZE][/FONT][/COLOR][/I]<br><br>" +
            '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I][center]Одобрено.[/center][/I][/SIZE][/FONT][/COLOR]',
            status: false,
        },
        {
            title: 'Отказано',
            content:

            "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][center]Ваша заявка на неактив получает статус:[/center][/SIZE][/FONT][/COLOR][/I]<br><br>" +
            '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I][center]Отказано.[/center][/I][/SIZE][/FONT][/COLOR]',
            status: false,
        },
        {
            title: '-----------------------------------------------------------------------Доп баллы---------------------------------------------------------------',
        },
        {
            title: 'Одобрено',
            content:

            "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][center]Ваша заявка на доп. баллы получает статус:[/center][/SIZE][/FONT][/COLOR][/I]<br><br>" +
            '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I][center]Одобрено.[/center][/I][/SIZE][/FONT][/COLOR]',
            status: false,
        },
        {
            title: 'Отказано',
            content:

            "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][center]Ваша заявка на доп. баллы получает статус:[/center][/SIZE][/FONT][/COLOR][/I]<br><br>" +
            '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I][center]Отказано.[/center][/I][/SIZE][/FONT][/COLOR]',
            status: false,
        },
        {
            title: '-----------------------------------------------------------------------Пропуск собрания---------------------------------------------------------------',
        },
        {
            title: 'Одобрено',
            content:

            "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][center]Ваша заявка на пропуск собрания получает статус:[/center][/SIZE][/FONT][/COLOR][/I]<br><br>" +
            '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I][center]Одобрено.[/center][/I][/SIZE][/FONT][/COLOR]',
            status: false,
        },
        {
            title: 'Отказано',
            content:

            "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][center]Ваша заявка на пропуск собрания получает статус:[/center][/SIZE][/FONT][/COLOR][/I]<br><br>" +
            '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I][center]Отказано.[/center][/I][/SIZE][/FONT][/COLOR]',
            status: false,
        },
         {
            title: '-----------------------------------------------------------------------Снятие наказаний---------------------------------------------------------------',
        },
        {
            title: 'Одобрено пред',
            content:

            "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][center]Ваша заявка на снятие предупреждения получает статус:[/center][/SIZE][/FONT][/COLOR][/I]<br><br>" +
            '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I][center]Одобрено.[/center][/I][/SIZE][/FONT][/COLOR]',
            status: false,
        },
        {
            title: 'Отказано пред',
            content:

            "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][center]Ваша заявка на снятие предупреждения получает статус:[/center][/SIZE][/FONT][/COLOR][/I]<br><br>" +
            '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I][center]Отказано.[/center][/I][/SIZE][/FONT][/COLOR]',
            status: false,
        },
        {
            title: 'Одобрено выг',
            content:

            "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][center]Ваша заявка на снятие выговора получает статус:[/center][/SIZE][/FONT][/COLOR][/I]<br><br>" +
            '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I][center]Одобрено.[/center][/I][/SIZE][/FONT][/COLOR]',
            status: false,
        },
        {
            title: 'Отказано выг',
            content:

            "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][center]Ваша заявка на снятие выговора получает статус:[/center][/SIZE][/FONT][/COLOR][/I]<br><br>" +
            '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I][center]Отказано.[/center][/I][/SIZE][/FONT][/COLOR]',
            status: false,
        },
        {
            title: '-----------------------------------------------------------------------Жалобы АП---------------------------------------------------------------',
        },
        {
            title: 'Одобрено',
            content:

            "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][center]Ваша жалоба была расмотрена.[/center][/SIZE][/FONT][/COLOR][/I]<br><br>" +
            "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][center]В сторону Агента поддержки будут предприняты меры.[/center][/SIZE][/FONT][/COLOR][/I]<br><br>" +
            '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I][center]Одобрено.[/center][/I][/SIZE][/FONT][/COLOR]',
            status: false,
        },
        {
            title: 'Отказано',
            content:

            "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][center]Ваша жалоба была расмотрена.[/center][/SIZE][/FONT][/COLOR][/I]<br><br>" +
            "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][center]Со стороны Агента поддержки небыло замечено нарушений.[/center][/SIZE][/FONT][/COLOR][/I]<br><br>" +
            '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I][center]Отказано.[/center][/I][/SIZE][/FONT][/COLOR]',
            status: false,
        },
    ];


    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

        // Добавление кнопок при загрузке страницы

        addButton('Ответ СХ', 'selectAnswer');
        

        // Поиск информации о теме
        const threadData = getThreadData();

        $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
        $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
        $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
        $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
        $('button#Texy').click(() => editThreadData(TEX_PREFIX, true));
        $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));
        $('button#zakroi').click(() => editThreadData(NULL_PREFIX, false));

        $(`button#selectAnswer`).click(() => {
            XF.alert(buttonsMarkup(buttons), null, 'Выберите ваш ответ:');
            buttons.forEach((btn, id) => {
                if (id > 0) {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
                }
                else {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
                }
            });
        });
    });

    function addButton(name, id) {
        $('.button--icon--reply').before(
            `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 30px; margin-right: 7px;">${name}</button>`,
        );
    }

    function buttonsMarkup(buttons) {
        return `<div class="select_answer">${buttons
            .map(
            (btn, i) =>
            `<button id="answers-${i}" class="button--primary button ` +
            `rippleButton" style="margin:4px"><span class="button-text">${btn.title}</span></button>`,
        )
            .join('')}</div>`;
    }

    function pasteContent(id, data = {}, send = false) {
        const template = Handlebars.compile(buttons[id].content);
        if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

        $('span.fr-placeholder').empty();
        $('div.fr-element.fr-view p').append(template(data));
        $('a.overlay-titleCloser').trigger('click');

        if (send == true) {
            editThreadData(buttons[id].prefix, buttons[id].status);
            $('.button--icon.button--icon--reply.rippleButton').trigger('click');
        }
    }

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
            6 < hours && hours <= 10
            ? 'Доброе утро'
            : 10 < hours && hours <= 18
            ? 'Добрый день'
            : 18 < hours && hours <= 6
            ? 'Добрый вечер'
            : 'Доброй ночи',
        };
    }

    function editThreadData(prefix, pin = false) {
        // Получаем заголовок темы, так как он необходим при запросе
        const threadTitle = $('.p-title-value')[0].lastChild.textContent;

        if(pin == false){
            fetch(`${document.URL}edit`, {
                method: 'POST',
                body: getFormData({
                    prefix_id: prefix,
                    title: threadTitle,
                    _xfToken: XF.config.csrf,
                    _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                    _xfWithData: 1,
                    _xfResponseType: 'json',
                }),
            }).then(() => location.reload());
        }
        if(pin == true){
            fetch(`${document.URL}edit`, {
                method: 'POST',
                body: getFormData({
                    prefix_id: prefix,
                    title: threadTitle,
                    sticky: 1,
                    _xfToken: XF.config.csrf,
                    _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                    _xfWithData: 1,
                    _xfResponseType: 'json',
                }),
            }).then(() => location.reload());
        }


        function moveThread(prefix, type) {
            // Получаем заголовок темы, так как он необходим при запросе
            const threadTitle = $('.p-title-value')[0].lastChild.textContent;

            fetch(`${document.URL}move`, {
                method: 'POST',
                body: getFormData({
                    prefix_id: prefix,
                    title: threadTitle,
                    target_node_id: type,
                    redirect_type: 'none',
                    notify_watchers: 1,
                    starter_alert: 1,
                    starter_alert_reason: "",
                    _xfToken: XF.config.csrf,
                    _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                    _xfWithData: 1,
                    _xfResponseType: 'json',
                }),
            }).then(() => location.reload());
        }

        function getFormData(data) {
            const formData = new FormData();
            Object.entries(data).forEach(i => formData.append(i[0], i[1]));
            return formData;
        }
    }
})();