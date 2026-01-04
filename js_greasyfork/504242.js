// ==UserScript==
// @name          WHITE | Скрипт для Виталия Барбаро by Jefferson
// @namespace     https://forum.blackrussia.online
// @version       1.0
// @description   Скрипт для Виталия
// @author        Tadeo_Jefferson
// @match         https://forum.blackrussia.online/threads/*
// @include       https://forum.blackrussia.online/threads/
// @icon          https://icons.iconarchive.com/icons/google/noto-emoji-food-drink/256/32343-watermelon-icon.png
// @grant         none
// @license       none
// @downloadURL https://update.greasyfork.org/scripts/504242/WHITE%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%92%D0%B8%D1%82%D0%B0%D0%BB%D0%B8%D1%8F%20%D0%91%D0%B0%D1%80%D0%B1%D0%B0%D1%80%D0%BE%20by%20Jefferson.user.js
// @updateURL https://update.greasyfork.org/scripts/504242/WHITE%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%92%D0%B8%D1%82%D0%B0%D0%BB%D0%B8%D1%8F%20%D0%91%D0%B0%D1%80%D0%B1%D0%B0%D1%80%D0%BE%20by%20Jefferson.meta.js
// ==/UserScript==

(function () {
    'use strict';
    'esversion 6' ;
    const UNACCEPT_PREFIX = 4; // Префикс "Отказано"
    const ACCEPT_PREFIX = 8; //  Префикс "Одобрено"
    const PIN_PREFIX = 2; //  Префикс "На рассмотрении"
    const WATCHED_PREFIX = 9; // Префикс "Рассмотрено"
    const CLOSE_PREFIX = 7; // Префикс "Закрыто"
    const TEX_PREFIX = 13; // Префикс "Техническому специалисту"
    const GA_PREFIX = 12; // Префикс "Главному Администратору"
    const WAIT_PREFIX = 14;
    const V_PREFIX = 1;
    const NULL_PREFIX = 15;
    const buttons = [
        {
            title: '-----------------------------------------------------------------------Жалобы | Обжалования---------------------------------------------------------------',
        },
        {
            title: 'Запрос доказательств',
            content:
            '[CENTER][COLOR=rgb(255, 255, 255)][FONT=times new roman][SIZE=5][I]Здравствуйте, уважаемый игрок![/I][/SIZE][/FONT]<br><br>' +
            "[SIZE=5][FONT=book antiqua][I]Запрошу доказательства у администратора, Ожидайте ответа.[/I][/FONT][/SIZE]<br><br>" +
            '[FONT=times new roman][SIZE=5][I]На рассмотрении.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
            prefix: PIN_PREFIX,
            status: true,
        },
        {
            title: 'В раздел Обжалования',
            content:
            '[CENTER][COLOR=rgb(255, 255, 255)][FONT=times new roman][SIZE=5][I]Здравствуйте, уважаемый игрок![/I][/SIZE][/FONT]<br><br>' +
            "[SIZE=5][FONT=book antiqua][I]Вам в раздел Обжалования наказаний[/I][/FONT][/SIZE]<br><br>" +
            '[FONT=times new roman][SIZE=5][I]Закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Проведу беседу',
            content:
            '[CENTER][COLOR=rgb(255, 255, 255)][FONT=times new roman][SIZE=5][I]Здравствуйте, уважаемый игрок![/I][/SIZE][/FONT]<br><br>' +
            "[SIZE=5][FONT=book antiqua][I]С администратором будет проведена беседа, спасибо за обращение.[/I][/FONT][/SIZE]<br><br>" +
            '[FONT=times new roman][SIZE=5][I]Одобрено, закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Предоставил докву',
            content:
            '[CENTER][COLOR=rgb(255, 255, 255)][FONT=times new roman][SIZE=5][I]Здравствуйте, уважаемый игрок![/I][/SIZE][/FONT]<br><br>' +
            "[SIZE=5][FONT=book antiqua][I]Администратор предоставил доказательства, выношу вердикт что наказание выдано верно.[/I][/FONT][/SIZE]<br><br>" +
            '[FONT=times new roman][SIZE=5][I]Закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Жб на форуме',
            content:
            '[CENTER][COLOR=rgb(255, 255, 255)][FONT=times new roman][SIZE=5][I]Здравствуйте, уважаемый игрок![/I][/SIZE][/FONT]<br><br>' +
            "[SIZE=5][FONT=book antiqua][I]Администратор предоставил доказательства, на вас была написана жалоба - наказание выдано верно.[/I][/FONT][/SIZE]<br><br>" +
            '[FONT=times new roman][SIZE=5][I]Отказано, закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Передача ГА',
            content:
            '[CENTER][COLOR=rgb(255, 255, 255)][FONT=times new roman][SIZE=5][I]Здравствуйте, уважаемый игрок![/I][/SIZE][/FONT]<br><br>' +
            "[SIZE=5][FONT=book antiqua][I]Ваша жалоба передана на рассмотрение руководству сервера.[/I][/FONT][/SIZE]<br><br>" +
            '[FONT=times new roman][SIZE=5][I]Ожидайте ответа, просьба не создавать копии данной темы.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
            prefix: GA_PREFIX,
            status: true,
        },
        {
            title: 'Передача ЗГА',
            content:
            '[CENTER][COLOR=rgb(255, 255, 255)][FONT=times new roman][SIZE=5][I]Здравствуйте, уважаемый игрок![/I][/SIZE][/FONT]<br><br>' +
            "[SIZE=5][FONT=book antiqua][I]Ваша жалоба передана на рассмотрение руководству сервера.[/I][/FONT][/SIZE]<br><br>" +
            '[FONT=times new roman][SIZE=5][I]Ожидайте ответа, просьба не создавать копии данной темы.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
            prefix: V_PREFIX,
            status: true,
        },
        {
            title: 'Не по форме',
            content:
            '[CENTER][COLOR=rgb(255, 255, 255)][FONT=times new roman][SIZE=5][I]Здравствуйте, уважаемый игрок![/I][/SIZE][/FONT]<br><br>' +
            "[SIZE=5][FONT=book antiqua][I]Ваша жалоба составлена не по форме, рассмотрению не подлежит.[/I][/FONT][/SIZE]<br><br>" +
            '[FONT=times new roman][SIZE=5][I]Отказано, закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Раздел тех',
            content:
            '[CENTER][COLOR=rgb(255, 255, 255)][FONT=times new roman][SIZE=5][I]Здравствуйте, уважаемый игрок![/I][/SIZE][/FONT]<br><br>' +
            "[SIZE=5][FONT=book antiqua][I]Ваша жалоба относится к разделу Жалобы на технических специалистов, обратитесь в более правильный раздел.[/I][/FONT][/SIZE]<br><br>" +
            '[FONT=times new roman][SIZE=5][I]Закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Ответ был',
            content:
            '[CENTER][COLOR=rgb(255, 255, 255)][FONT=times new roman][SIZE=5][I]Здравствуйте, уважаемый игрок![/I][/SIZE][/FONT]<br><br>' +
            "[SIZE=5][FONT=book antiqua][I]Ответ был дан в прошлой жалобе, просьба не создавать копии, иначе ваш форумный аккаунт будет заблокирован.[/I][/FONT][/SIZE]<br><br>" +
            '[FONT=times new roman][SIZE=5][I]Закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
    ];


    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

        // Добавление кнопок при загрузке страницы
        addButton('На рассмотрение', 'pin');
        addButton('Меню', 'selectAnswer');


        // Поиск информации о теме
        const threadData = getThreadData();
        $('button#pin').click(() => editThreadData(PIN_PREFIX, true));


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