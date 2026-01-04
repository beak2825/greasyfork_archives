(function() {
// ==UserScript==
// @name         KURSK | Скрипт для ГС ГОСС && ГС ОПГ
// @namespace    https://openuserjs.org/users/King73
// @version      1.1
// @description  кринж созданный моими руками
// @author       Artem_Tankov
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/threads/
// @icon         https://cdn-icons-png.flaticon.com/128/6062/6062646.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500977/KURSK%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%A1%20%D0%93%D0%9E%D0%A1%D0%A1%20%20%D0%93%D0%A1%20%D0%9E%D0%9F%D0%93.user.js
// @updateURL https://update.greasyfork.org/scripts/500977/KURSK%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%A1%20%D0%93%D0%9E%D0%A1%D0%A1%20%20%D0%93%D0%A1%20%D0%9E%D0%9F%D0%93.meta.js
// ==/UserScript==

(async function () {
    `use strict`;
    const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
    const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
    const PIN_PREFIX = 2; // Prefix that will be set when thread pins
    const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
    const WATCHED_PREFIX = 9;
    const CLOSE_PREFIX = 7;
    const GA_PREFIX = 12;
    const TEX_PREFIX = 13;
    const SPEC_PREFIX = 11;
    const data = await getThreadData(),
        greeting = data.greeting,
        user = data.user;
    const buttons = [
        {
            title: `свой текст`,
            content:
            `[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.<br><br>`+
            'ответ',
        },
        {
            title: `Одобрено`,
            content:
            `[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте уважаемый игрок.[/SIZE][/FONT][/COLOR]<br><br>` +
            "[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]С лидером будет проведена работа.[/SIZE][/FONT][/COLOR]<br><br>" +
            "[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], закрыто[/SIZE][/FONT][/COLOR]",

            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `отказано`,
            content:
            `[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте уважаемый игрок.[/SIZE][/FONT][/COLOR]<br><br>` +
            "[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Нарушение со стороны лидера нету.[/SIZE][/FONT][/COLOR]<br><br>" +
            "[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4][COLOR=rgb(0, 255, 0)]Отказано[/COLOR], закрыто[/SIZE][/FONT][/COLOR]",

            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: `На рассмотрении`,
            content:
            `[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте уважаемый игрок.[/SIZE][/FONT][/COLOR]<br><br>` +
            "[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Ваша жалоба взята на [color=rgb(0, 255, 255)]рассмотрение[/color], ожидайте ответа в этой теме.[/SIZE][/FONT][/COLOR]<br><br>",

            prefix: PIN_PREFIX,
            status: true,
        },
        {
            title: `Лидер снят`,
            content:
            `[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте уважаемый игрок.[/SIZE][/FONT][/COLOR]<br><br>` +
            "[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Ваша жалоба взята на рассмотрение, ожидайте ответа в этой теме.[/SIZE][/FONT][/COLOR]<br><br>" +
            "[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4][COLOR=rgb(255, 0, 0)]Отказано[/COLOR], закрыто[/SIZE][/FONT][/COLOR]",


            prefix: PIN_PREFIX,
            status: false,
        },
        {
            title: `Игрок не является лидером`,
            content:
            `[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте уважаемый игрок.[/SIZE][/FONT][/COLOR]<br><br>` +
            "[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Данный игрок не является лидером.[/SIZE][/FONT][/COLOR]<br><br>" +
            "[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4][COLOR=rgb(255, 0, 0)]Отказано[/COLOR], закрыто[/SIZE][/FONT][/COLOR]",

            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: `в жб на СС`,
            content:
            `[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте уважаемый игрок.[/SIZE][/FONT][/COLOR]<br><br>` +
            "[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Вы ошиблись разделом, обратитесь в раздел \"Жалобы на Старший Состав\"[/SIZE][/FONT][/COLOR]<br><br>" +
            "[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4][COLOR=rgb(255, 0, 0)]Отказано[/COLOR], закрыто[/SIZE][/FONT][/COLOR]",

            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: `в жб на мл состав`,
            content:
            `[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте уважаемый игрок.[/SIZE][/FONT][/COLOR]<br><br>` +
            "[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Вы ошиблись разделом, обратитесь в раздел \"Жалобы на Младший Состав\"[/SIZE][/FONT][/COLOR]<br><br>" +
            "[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4][COLOR=rgb(255, 0, 0)]Отказано[/COLOR], закрыто[/SIZE][/FONT][/COLOR]",

            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Недостаточно доков`,
            content:
            `[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте уважаемый игрок.[/SIZE][/FONT][/COLOR]<br><br>` +
            "[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]У вас недостаточно доказательства для корректного рассмотрения жалобы[/SIZE][/FONT][/COLOR]<br>" +
            "[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Если у вас имеется больше доказательств, то прикрепите их в новой жалобе.[/SIZE][/FONT][/COLOR]<br><br>" +
            "[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4][COLOR=rgb(255, 0, 0)]Отказано[/COLOR], закрыто[/SIZE][/FONT][/COLOR]",

            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: `доки не работают`,
            content:
            `[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте уважаемый игрок.[/SIZE][/FONT][/COLOR]<br><br>` +
            "[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Предоставленные доказательства не работают.[/SIZE][/FONT][/COLOR]<br><br>" +
            "[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4][COLOR=rgb(255, 0, 0)]Отказано[/COLOR], закрыто[/SIZE][/FONT][/COLOR]",

            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Ответ был дан в прошлой теме`,
            content:
            `[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте уважаемый игрок.[/SIZE][/FONT][/COLOR]<br><br>` +
            "[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Ответ был дан в прошлой теме.<br>" +
            "Просьба не создавать темы с данным нарушением.[/SIZE][/FONT][/COLOR]<br><br>" +
            "[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4][COLOR=rgb(255, 0, 0)]Отказано[/COLOR], закрыто[/SIZE][/FONT][/COLOR]",

            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: `не по форме`,
            content:
            `[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте уважаемый игрок.[/SIZE][/FONT][/COLOR]<br><br>` +
            "[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Жалоба составлена не по форме.<br>" +
            "Ознакомьтесь с правилами подачи \"Жалобы на Лидеров\".[/SIZE][/FONT][/COLOR]<br><br>" +
            "[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4][COLOR=rgb(255, 0, 0)]Отказано[/COLOR], закрыто[/SIZE][/FONT][/COLOR]",

            prefix: UNACCEPT_PREFIX,
            status: false,
        },
           ];

    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $(`body`).append(`<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`);

        // Добавление кнопок при загрузке страницы
       addButton(`На рассмотрение`, `pin`)
       $("button#pin").css("background-color", "#3A3B3C");
        $("button#pin").css("border", "2px solid #eeff01")
        $("button#pin").css("border-radius", "15px")
        addButton(`Одобрено`, `accepted`);
        $("button#accepted").css("background-color", "#3A3B3C");
        $("button#accepted").css("border", "2px solid #4AA02C")
        $("button#accepted").css("border-radius", "15px")
        addButton(`Отказано`, `unaccept`);
        $("button#unaccept").css("background-color", "#3A3B3C");
        $("button#unaccept").css("border", "2px solid #E42217")
        $("button#unaccept").css("border-radius", "15px")
        addButton(`Ответы`, `selectAnswer`);
       $("button#pin, button#accepted, button#unaccept").css("margin-right", "5px");

       /*$("body").css("background-image", "url('https://i.artfile.ru/1920x1280_1076217_[www.ArtFile.ru].jpg')");
       $("body").css("background-size", "100%");
       $("body").css("background-repeat", "no-repeat");
       $("body").css("background-attachment", "fixed");
       $("div .p-body-pageContent").css("opacity", "0.6");*/


        // Поиск информации о теме
        const threadData = getThreadData();

        $(`button#pin`).click(() => editThreadData(PIN_PREFIX, true));
        $(`button#accepted`).click(() => editThreadData(ACCEPT_PREFIX, false));
        $(`button#teamProject`).click(() => editThreadData(COMMAND_PREFIX, true));
        $(`button#unaccept`).click(() => editThreadData(UNACCEPT_PREFIX, false));
       $(`button#selectAnswer`).click(() => {
            XF.alert(buttonsMarkup(buttons), null, `Выберите ответ:`);
            buttons.forEach((btn, id) => {
                 if (id != 0 && id != 100) {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));}
                 else {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
                }
            });
        });
    });

    function addButton(name, id) {
        $(`.button--icon--reply`).before(
            `<button type="button" class="button rippleButton" id="${id}" style="margin: 3px;">${name}</button>`,
        );
    }

    function buttonsMarkup(buttons) {

        return `<div class="select_answer">${buttons
            .map(
                (btn, i) =>
                    `<button id="answers-${i}" class="button--primary button ` +
                    `rippleButton" style="margin:5px"><span class="button-text">${btn.title}</span></button>`,
            )
            .join(``)}</div>`;
    }

    function pasteContent(id, data = {}, send = false) {
        const template = Handlebars.compile(buttons[id].content);
        if ($(`.fr-element.fr-view p`).text() === ``) $(`.fr-element.fr-view p`).empty();

        $(`span.fr-placeholder`).empty();
        $(`div.fr-element.fr-view p`).append(template(data));
        $(`a.overlay-titleCloser`).trigger(`click`);

        if (send == true) {
            editThreadData(buttons[id].prefix, buttons[id].status);
            $(`.button--icon.button--icon--reply.rippleButton`).trigger(`click`);
        }
    }

    async function getThreadData() {
        const authorID = $(`a.username`)[0].attributes[`data-user-id`].nodeValue;
        const authorName = $(`a.username`).html();
        const hours = new Date().getHours();
        const greeting = 4 < hours && hours <= 11
            ? `Доброе утро`
            : 11 < hours && hours <= 15
                ? `Добрый день`
                : 15 < hours && hours <= 21
                    ? `Добрый вечер`
                    : `Доброй ночи`

        return {
            user: {
                id: authorID,
                name: authorName,
                mention: `[USER=${authorID}]${authorName}[/USER]`,
            },
            greeting: greeting
        };
    }

    function editThreadData(prefix, pin = false) {
        // Получаем заголовок темы, так как он необходим при запросе
        const threadTitle = $(`.p-title-value`)[0].lastChild.textContent;

        if (pin == false) {
            fetch(`${document.URL}edit`, {
                method: `POST`,
                body: getFormData({
                    prefix_id: prefix,
                    title: threadTitle,
                    _xfToken: XF.config.csrf,
                    _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                    _xfWithData: 1,
                    _xfResponseType: `json`,
                }),
            }).then(() => location.reload());
        }
        if (pin == true) {
            fetch(`${document.URL}edit`, {
                method: `POST`,
                body: getFormData({
                    prefix_id: prefix,
                    title: threadTitle,
                    sticky: 1,
                    _xfToken: XF.config.csrf,
                    _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                    _xfWithData: 1,
                    _xfResponseType: `json`,
                }),
            }).then(() => location.reload());
        }
    }

    function getFormData(data) {
        const formData = new FormData();
        Object.entries(data).forEach(i => formData.append(i[0], i[1]));
        return formData;
    }

})();})();
