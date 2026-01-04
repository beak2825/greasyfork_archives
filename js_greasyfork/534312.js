// ==UserScript==
// @name         ROSTOV | Скрипт для ГС/ЗГС edit D.Hold
// @namespace    https://greasyfork.org/ru/users/1118525-pistenkov
// @version      0.5
// @description  Скрипт для ГС/ЗГС ГОСС/ОПГ 
// @author       M.Pistenkov D.Hold
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @icon         https://icons.iconarchive.com/icons/custom-icon-design/flatastic-7/256/Highlightmarker-blue-icon.png
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/534312/ROSTOV%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%A1%D0%97%D0%93%D0%A1%20edit%20DHold.user.js
// @updateURL https://update.greasyfork.org/scripts/534312/ROSTOV%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%A1%D0%97%D0%93%D0%A1%20edit%20DHold.meta.js
// ==/UserScript==

(async function () {
    `use strict`;
    const UNACCEPT_PREFIX = 4; // Префикс отказана
    const ACCEPT_PREFIX = 8; // Префикс одобрено
    const PIN_PREFIX = 2; // Префикс закрепляет
    const WATCHED_PREFIX = 9;
    const CLOSE_PREFIX = 7;
    const data = await getThreadData(),
          greeting = data.greeting,
          user = data.user;
    const buttons = [

        {
            title: `Пустышка`,
            content:"[CENTER]${greeting}, уважаймый(ая) ${user.mention}.\n"+
            `[SIZE=4][FONT=georgia][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL]\n`+
            `текст\n`
            `\n`
            `Ваш [COLOR=rgb(255, 0, 0)]Заместитель главного следящего[/COLOR] [COLOR=rgb(250, 197, 28)]ОПГ[/COLOR]/n`+
            `[COLOR=rgb(0, 0, 0)]Dark [/COLOR]Hold[/FONT][/SIZE][/CENTER]`,
        },

    ];

    $(document).ready(() => {
        // Загрузка скрипта для работы шаблонов
        $(`body`).append(`<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`);

        // Добавление кнопок при загрузке страницы
        addButton(`На рассмотрение`, `pin`);
        addButton(`Одобрено`, `accepted`);
        addButton(`Отказано`, `unaccept`);
        addButton(`Ответы`, `selectAnswer`);


        // Поиск информации о теме
        const threadData = getThreadData();

        $(`button#pin`).click(() => editThreadData(PIN_PREFIX, true));
        $(`button#accepted`).click(() => editThreadData(ACCEPT_PREFIX, false));
        $(`button#unaccept`).click(() => editThreadData(UNACCEPT_PREFIX, false));
        $(`button#selectAnswer`).click(() => {
            XF.alert(buttonsMarkup(buttons), null, `Выберите ответ:`);
            buttons.forEach((btn, id) => {
                if (id > 2) {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
                } else {
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
})();