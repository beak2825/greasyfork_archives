// ==UserScript==
// @name         UFA | Скрипт для KФ
// @namespace    https://greasyfork.org/ru/users/1032828-crystalby
// @version      1.111
// @description  Скрипт для упрощения работы КФ
// @author       Debi_Worobei
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @icon         https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @grant        none
// @license 	 none
// @downloadURL https://update.greasyfork.org/scripts/481624/UFA%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20K%D0%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/481624/UFA%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20K%D0%A4.meta.js
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
            title: '---------------------------------------------------------------> By Debi_Worobei <---------------------------------------------------------------',
        },
        {
            title: 'Салам',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая)  {{ user.name }}.[/FONT][/CENTER]<br><br>"+
            "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url][/CENTER]<br>"+
            "[CENTER][FONT=Verdana] текст [/FONT][/CENTER]<br>"+
            "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url][/CENTER]<br>"+
            "[CENTER][FONT=Verdana] текст [/FONT][/CENTER]",
        },
        {
            title: 'Смотрю',
            content:
            "[CENTER][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/CENTER]<br>"+
            "[CENTER][B][SIZE=5][FONT=Verdana][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[B][SIZE=5][ICODE]Ваша жалоба взята на рассмотрение.[/SIZE]<br>"+
            "[SIZE=5]Просьба ожидать ответа и не создавать дубликаты данной темы.[/ICODE][/SIZE][/B]<br>"+
            "[CENTER][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/CENTER]<br>"+
            '[B][SIZE=5][ICODE]На рассмотрении..[/ICODE][/SIZE][/B][/FONT][/CENTER]',
            prefix: PIN_PREFIX,
            status: true,
        },
        {
            title: 'Накажу',
            content:
            "[CENTER][B][SIZE=5][FONT=Verdana][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[CENTER][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/CENTER]<br>"+
            "[B][SIZE=5][ICODE]Игрок будет наказан.[/ICODE]<br>"+
           "[CENTER][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/CENTER]<br>"+
            '[B][SIZE=5][ICODE]Одобрено, закрыто.[/ICODE][/SIZE][/B][/FONT][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Нихуя он не сделал',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "[B][SIZE=5][ICODE]Нарушений со стороны данного игрока не было найдено.[/ICODE]<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[B][SIZE=5][ICODE]Отказано, Закрыто.[/ICODE][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
         {
            title: 'Недостаток',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "[B][SIZE=5][ICODE]Недостаточно доказательств на нарушение от данного игрока.[/ICODE]<br>"+
            "[ICODE]Доказательства должны быть предоставлены в хорошем качестве и с полным процессом сделки или нарушения от какого-либо игрока.[/ICODE][/SIZE][/B]<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[B][SIZE=5][ICODE]Отказано, Закрыто.[/ICODE][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
         {
            title: 'От 3 лица',
            content:
           "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "[B][SIZE=5][ICODE]Жалобы от 3-их лиц не принимаются.[/ICODE]<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[B][SIZE=5][ICODE]Отказано, Закрыто.[/ICODE][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Ермакову',
            content:
            "[CENTER][FONT=Verdana][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "[B][SIZE=5][ICODE]Ваша жалоба передана Основному заместителю Главного Администратора.[/ICODE]<br>"+
            "[ICODE]Ожидайте ответа в данной теме, не нужно создавать копии этой темы.[/ICODE]<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[B][SIZE=5][ICODE]На рассмотрении[/ICODE][/CENTER]',
            prefix: PIN_PREFIX,
            status: true,
        },
         {
            title: 'Доки не робят',
            content:
            "[CENTER][FONT=Verdana][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "[B][SIZE=5][ICODE]Ваши доказательства не рабочие/обрезанные, перезалейте их правильно и без обрезаний.[/ICODE]<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[B][SIZE=5][ICODE]Отказано, Закрыто.[/ICODE][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: '---------------------------------------------------------------> Для ОЧСПшника Ранеля. <---------------------------------------------------------------',
        },
      ];

    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

        // Добавление кнопок при загрузке страницы
        addButton('Меню', 'selectAnswer');
        addButton('Одобрить', 'accepted');
        addButton('Отказать', 'unaccept');
        addButton('На рассмотрение', 'pin');
        addButton('Рассмотрено', 'watched');
        addButton('Закрыть', 'closed');
        addButton('КП', 'teamProject');
        addButton ('Спецу', 'specialAdmin');
        addButton ('ГА', 'mainAdmin');


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