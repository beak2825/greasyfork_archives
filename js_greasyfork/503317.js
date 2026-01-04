// ==UserScript==
// @name         Pink | Скрипт для ГС/ЗГС
// @namespace    https://greasyfork.org/ru/users/1118525-pistenkov
// @version      1.0
// @description  Скрипт для ГС/ЗГС ГОСС/ОПГ
// @author       Stas_Pavlinov
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @icon         https://icons.iconarchive.com/icons/custom-icon-design/flatastic-7/256/Highlightmarker-blue-icon.png
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/503317/Pink%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%A1%D0%97%D0%93%D0%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/503317/Pink%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%A1%D0%97%D0%93%D0%A1.meta.js
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
            title: `Приветствие`,
            content:
            `[SIZE=4][FONT=georgia][CENTER] ${greeting}, уважаемый(ая) ${user.mention}.<br>` +
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            `[/CENTER] текст [/FONT][/SIZE]`,
        },
        {
            title: `На рассмотрении`,
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый(ая) ${user.mention}.<br>` +
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            `Ваша жалоба взята на рассмотрение.<br>` +
            `Пожалуйста, ожидайте ответа.<br>`+
            `[COLOR=orange]На рассмотрении...[/color][/CENTER][/FONT][/SIZE]`,
            prefix: PIN_PREFIX,
            status: true,
        },
        {
            title: `На рассмотрении в ВК`,
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый(ая) ${user.mention}.<br>` +
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            `Ваша жалоба взята на рассмотрение.<br>` +
            `Отпишите мне в личные сообщения во Вконтакте - https://vk.com/artem_krassnov <br>`+
            `[COLOR=orange]На рассмотрении...[/color][/CENTER][/FONT][/SIZE]`,
            prefix: PIN_PREFIX,
            status: true,
        },
        {
            title: `Проведена беседа`,
            content: ` [SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый(ая) ${user.mention}.<br>` +
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            `С лидером будет проведена профилактическая беседа.<br>` +
            `[COLOR=green]Одобрено[/color], закрыто.[/CENTER][/FONT][/SIZE]`,
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Получит наказание`,
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый(ая) ${user.mention}.<br>` +
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            `Лидер получит соответствующее наказание<br>` +
            `[COLOR=green]Одобрено[/color], закрыто.[/CENTER][/FONT][/SIZE]`,
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Жалоба не по форме`,
            content:
            `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый(ая) ${user.mention}.<br><br>` +
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Жалоба составлена не по форме. Внимательно прочитайте правила составления жалобы, которые закреплены в этом разделе. <br><br>" +
            `[COLOR=red]Отказано[/color], закрыто.[/CENTER][/FONT][/SIZE]`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
title: `В доквах нет нарушения `,
            content:
            `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый(ая) ${user.mention}.<br><br>` +
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Проверив доказательства Лидера нарушений нет. <br><br>" +
            `[COLOR=red]Отказано[/color], закрыто.[/CENTER][/FONT][/SIZE]`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `В раздел ЖБ на сотрудников`,
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый(ая) ${user.mention}.<br><br>` +
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            `Вы ошиблись разделом,пожалуйста напишите свою жалобу в раздел «Жалобы на сотрудников»<br>` +
            `[COLOR=red]Отказано[/color], закрыто.[/CENTER][/FONT][/SIZE]`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: ` Не является ЛД`,
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый(ая) ${user.mention}.<br><br>` +
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            `Данный игрок не является лидером фракции.<br>` +
            `[COLOR=red]Отказано[/color], закрыто.[/CENTER][/FONT][/SIZE]`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `Лидер будет снят`,
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый(ая) ${user.mention}.<br><br>` +
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            `Лидер будет снят со своего поста.<br>` +
            `[COLOR=green]Одобрено[/color], закрыто.[/CENTER][/FONT][/SIZE]`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `Недостаточно доков`,
            content:`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый(ая) ${user.mention}.<br><br>` +
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            `Недостаточно доказательств, которые потверждают нарушение.<br>`+
            `Если у вас есть дополнительные доказательства, которые могут помочь в рассмотрении жалобы - создайте новую тему, прикрепив их.<br>`+
            `[COLOR=red]Отказано[/color], закрыто.[/CENTER][/FONT][/SIZE]`,
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Нет нарушения ЛД`,
            content:`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый(ая) ${user.mention}.<br><br>` +
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            `Исходя из выше приложенных доказательств, нарушений со стороны лидера нет.<br>`+
            `Если у вас есть дополнительные доказательства, которые могут помочь в рассмотрении жалобы - создайте новую тему, прикрепив данные док-ва.<br>`+
            `[COLOR=red] Отказано[/color],закрыто. [/CENTER][/FONT][/SIZE]`,
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Опра вне фотохостинга`,
            content:`[CENTER][SIZE=4][FONT=georgia]${greeting}, уважаемый(ая) ${user.mention}.<br><br>`+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Внимательно прочитайте тему «[URL=`https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-лидеров.2639616/`]Правила подачи жалоб на лидеров[/URL]»<br><br>"+
            "Также следует обратить внимание на данный пункт правил:[QUOTE]3.6 Прикрепление доказательств обязательно.Примечание: загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/QUOTE]"+
            `[COLOR=red]Отказано[/color], закрыто.[/FONT][/SIZE][/CENTER]`,
            prefix: UNACCEPT_PREFIX,
            status: false,
 
        },
        {
            title: `Ошибка разделом`,
            content:`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый(ая) ${user.mention}.<br><br>` +
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            `Ваше обращение не имеет отношения к данному форумному разделу.<br>`+
            `Возможно, вы ошиблись форумным разделом.<br>`+
            `[COLOR=red]Отказано[/color], закрыто.[/CENTER][/FONT]<br><br>`,
            prefix: UNACCEPT_PREFIX,
            status:false,
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
})(
);