// ==UserScript==
// @name         Orenburg | Скрипт для Кураторов Администрации
// @namespace    https://greasyfork.org/ru/users/1032828-crystalby
// @version      0.1
// @description  Скрипт для Кураторов администрации.
// @author       M.Tenside <3
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @icon         https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @grant        none
// @license 	 none
// @downloadURL https://update.greasyfork.org/scripts/503425/Orenburg%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%90%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/503425/Orenburg%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%90%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D0%B8.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const UNACCEPT_PREFIX = 4; // Префикс "Отказано"
    const ACCEPT_PREFIX = 8; // Префикс "Одобрено"
    const RESHENO_PREFIX = 6; // Префикс "Решено"
    const PIN_PREFIX = 2; // Префикс "На рассмотрении"
    const GA_PREFIX = 12; // Префикс "Главному Администратору"
    const COMMAND_PREFIX = 10; // Префикс "Команде Проекта"
    const WATCHED_PREFIX = 9; // Префикс "Рассмотрено"
    const CLOSE_PREFIX = 7; // Префикс "Закрыто"
    const SPECIAL_PREFIX = 11; // Префикс "Специальному Администратору"
    const buttons = [
        {
            title: '---------------------------------------------------------------> Раздел Жалоб <---------------------------------------------------------------',
        },
        {
            title: 'Приветствие',
            content:
            "[CENTER][COLOR=rgb(255, 255, 0)][FONT=georgia]Доброго времени суток, уважаемый игрок!<br><br>"+
            "[url=https://i.postimg.cc/fTh4W2B3/RLwzo.png][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br><br>"+
            "[/COLOR][/FONT][/CENTER]",
        },
        {
            title: 'На рассмотрение',
            content:
            "[CENTER][COLOR=rgb(255, 255, 0)][FONT=georgia]Доброго времени суток, уважаемый игрок!<br><br>"+
            "[url=https://i.postimg.cc/fTh4W2B3/RLwzo.png][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br><br>"+
            "Запросил доказательства у администратора.<br>"+
            "Ожидайте ответа в данной теме, не нужно создавать копии этой темы.[/COLOR]<br><br>"+
            "[url=https://i.postimg.cc/fTh4W2B3/RLwzo.png][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br><br>"+
            '[COLOR=rgb(255, 165, 0)]На рассмотрении.[/COLOR][/FONT][/CENTER]',
            prefix: PIN_PREFIX,
            status: true,
        },
        {
            title: 'Не по форме',
            content:
            "[CENTER][COLOR=rgb(255, 255, 0)][FONT=georgia]Доброго времени суток, уважаемый игрок!<br><br>"+
            "[url=https://i.postimg.cc/fTh4W2B3/RLwzo.png][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br><br>"+
            "Ваша жалоба составлена не по форме, ознакомьтесь с правилами подачи жалоб : [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.2639611/']*Кликабельно*[/URL][/COLOR]<br><br>"+
            "[url=https://i.postimg.cc/fTh4W2B3/RLwzo.png][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br><br>"+
            '[COLOR=rgb(255, 0, 0)]Отказано[/COLOR],[COLOR=rgb(255, 255, 0)] Закрыто.[/COLOR][/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Не является адм',
            content:
            "[CENTER][COLOR=rgb(255, 255, 0)][FONT=georgia]Доброго времени суток, уважаемый игрок!<br><br>"+
            "[url=https://i.postimg.cc/fTh4W2B3/RLwzo.png][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br><br>"+
            "Данный игрок не является администратором.[/COLOR]<br><br>"+
            "[url=https://i.postimg.cc/fTh4W2B3/RLwzo.png][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br><br>"+
            '[COLOR=rgb(255, 255, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        
    ];

    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

        // Добавление кнопок при загрузке страницы
        addButton('Меню', 'selectAnswer');
        


        // Поиск информации о теме
        const threadData = getThreadData();

        $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
        $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
        $(`button#teamProject`).click(() => editThreadData(COMMAND_PREFIX, true));
        $(`button#watched`).click(() => editThreadData(WATCHED_PREFIX, false));
        $(`button#unaccept`).click(() => editThreadData(UNACCEPT_PREFIX, false));
        $(`button#mainAdmin`).click(() => editThreadData(GA_PREFIX, true));

        $(`button#specialAdmin`).click(() => editThreadData(SPECIAL_PREFIX, true));

        $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));

        $(`button#selectAnswer`).click(() => {
            XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
            buttons.forEach((btn, id) => {
                if(id > 1) {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
                } else {
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
            `rippleButton" style="margin:5px"><span class="button-text">${btn.title}</span></button>`,
        )
            .join('')}</div>`;
    }

    function pasteContent(id, data = {}, send = false) {
        const template = Handlebars.compile(buttons[id].content);
        if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

        $('span.fr-placeholder').empty();
        $('div.fr-element.fr-view p').append(template(data));
        $('a.overlay-titleCloser').trigger('click');

        if(send == true){
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
            4 < hours && hours <= 11
            ? 'Доброе утро'
            : 11 < hours && hours <= 15
            ? 'Добрый день'
            : 15 < hours && hours <= 21
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
    }

    function getFormData(data) {
        const formData = new FormData();
        Object.entries(data).forEach(i => formData.append(i[0], i[1]));
        return formData;
    }
})();