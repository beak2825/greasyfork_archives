// ==UserScript==
// @name         Скрипт для ГС - ЗГС
// @namespace    https://forum.blackrussia.online
// @version      5
// @description  Скрипт 
// @author       Danya
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license 	 MIT
// @collaborator Quenk269
// @icon https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @downloadURL https://update.greasyfork.org/scripts/453128/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%A1%20-%20%D0%97%D0%93%D0%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/453128/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%A1%20-%20%D0%97%D0%93%D0%A1.meta.js
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
const buttons = [
{
            title: `Приветствие`,
            content:
                `[SIZE=4][FONT=georgia][CENTER] ${greeting}, уважаемый ${user.mention}![/CENTER]<br>` +
                `[CENTER]  Текст    [/CENTER][/FONT][/SIZE]`,
        },



        {
            title: `На рассмотрении`,
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}![/CENTER]<br>` +
                `[CENTER] Ваша жалоба взята на рассмотрение.<br><br>` +
                `Пожалуйста ожидайте ответа.<br>` +
                `[COLOR=orange]На рассмотрение.[/color] [/CENTER][/FONT][/SIZE]`,
            prefix: PIN_PREFIX,
            status: true,
        },
        {
            title: `Проведена беседа ЛД`,
            content: ` [SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}!<br>` +
                ` Благодарим за ваше обращение!<br>` +
                ` С лидером будет проведена профилактическая беседа.<br>` +
                ` [COLOR=lightgreen]Одобрено[/color],закрыто [/CENTER][/FONT][/SIZE]`,
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Проведена беседа АП`,
            content: ` [SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}!<br>` +
                ` Благодарим за ваше обращение!<br>` +
                ` С Агентом Поддержки будет проведена профилактическая беседа.<br>` +
                ` [COLOR=lightgreen]Одобрено[/color],закрыто [/CENTER][/FONT][/SIZE]`,
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Получит наказание ЛД`,
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}!<br>` +
                `Благодарим за ваше обращение!<br>` +
                `Лидер получит соответствующие наказание` +
                ` [COLOR=lightgreen]Одобрено[/color],закрыто [/CENTER][/FONT][/SIZE]`,
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Получит наказание ЛД`,
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}!<br>` +
                `Благодарим за ваше обращение!<br>` +
                `Лидер получит соответствующие наказание` +
                ` [COLOR=lightgreen]Одобрено[/color],закрыто [/CENTER][/FONT][/SIZE]`,
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Получит наказание АП`,
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}!<br>` +
                `Благодарим за ваше обращение!<br>` +
                `Агент Поддержки получит соответствующие наказание` +
                ` [COLOR=lightgreen]Одобрено[/color],закрыто [/CENTER][/FONT][/SIZE]`,
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Жалоба не по форме`,
            content:
                `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
                "[CENTER]Жалоба составлена не по форме. Внимательно прочитайте правила составления жалобы, которые закреплены в этом разделе. <br><br>" +
                `[CENTER][[COLOR=red] Отказано, закрыто.[/CENTER][/FONT][/SIZE]`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `В раздел ЖБ на сотрудников`,
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
                `[CENTER]Ошиблись разделом,пожалуйста напишите свою жалобу в раздел «Жалобы на сотрудников»<br>` +
                `[CENTER] [[COLOR=red] Отказано[/color],закрыто[/CENTER][/FONT][/SIZE]`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: ` Не являеться ЛД`,
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
                `[CENTER]Данный игрок больше не являеться лидером или им не является , на данный момент времени.<br>` +
                `[CENTER] [COLOR=red] Отказано[/color],закрыто.[/CENTER][/FONT][/SIZE]`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: ` Не являеться АП`,
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
                `[CENTER]Данный игрок больше не являеться агентом поддержки или им не является, на данный момент времени.<br>` +
                `[CENTER] [COLOR=red] Отказано[/color],закрыто.[/CENTER][/FONT][/SIZE]`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `Лидер будет снят`,
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
                ` [CENTER] Благодарим за ваше обращение!<br>` +
               ` [CENTER] Лидер будет снят!<br>` +
                ` [CENTER]  [COLOR=lightgreen]Одобрено[/color],закрыто.[/CENTER][/FONT][/SIZE]`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `АП будет снят`,
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
                ` [CENTER] Благодарим за ваше обращение!<br>` +
               ` [CENTER] Агент Поддержки будет снят!<br>` +
                ` [CENTER]  [COLOR=lightgreen]Одобрено[/color],закрыто.[/CENTER][/FONT][/SIZE]`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `Недостаточно док-вы`,
            content:`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER] Недостаточно доказательств, которые потверждают нарушение.<br>`+
            ` [CENTER][[COLOR=red] Отказано[/color],закрыто.[/CENTER][/FONT][/SIZE]`,
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Нет нарушения ЛД`,
            content:`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER] Исходя из выше приложенных доказательств,нарушение со стороны лидера - не имееться!<br>`+
            `[CENTER] [COLOR=red] Отказано[/color],закрыто. [/CENTER][/FONT][/SIZE]`,
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Нет нарушения АП`,
            content:`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER] Исходя из выше приложенных доказательств,нарушение со стороны хелпера - не имееться!<br>`+
            `[CENTER] [COLOR=red] Отказано[/color],закрыто. [/CENTER][/FONT][/SIZE]`,
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
        title: `Опра в соц.сети ЛД`,
        content:` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
        "Пожалуйста внимательно прочитайте тему «[URL=`https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-лидеров.2639616/`]Правила подачи жалоб на администрацию[/URL][SIZE=5][B]»<br><br>"+
        "И обратите своё внимание, на данный пункт правил —[/B][/SIZE][/FONT][/SIZE][SIZE=4][FONT=georgia][QUOTE]3.6. Прикрепление доказательств обязательно.Примечание: загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/QUOTE][/FONT][QUOTE][/quote][/SIZE][QUOTE][/QUOTE]"+
        `[SIZE=4][FONT=georgia][COLOR=red] Отказано[/color],[S] закрыто.[/S][/FONT][/SIZE]`,
        prefix: UNACCEPT_PREFIX,
        status: false,

    },
        {
            title: `Ошибка разделом`,
            content:`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER]Пожалуйста, убедительная просьба, ознакомится с назначением данного раздела в котором Вы создали тему, так как ваш запрос никоим образом не относится к предназначению данного раздела.[/CENTER]`+
		    `[CENTER][COLOR=red] Отказано[/color], закрыто.[/CENTER][/FONT]<br><br>`,
            prefix: UNACCEPT_PREFIX,
            status:false,
        },
    ];








    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
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
        $(`button#teamProject`).click(() => editThreadData(COMMAND_PREFIX, true));
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