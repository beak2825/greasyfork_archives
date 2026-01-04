// ==UserScript==
// @name         ARZAMAS | Скрипт для ГС/ЗГС
// @version      0.17
// @description  Скрипт для ГС/ЗГС ГОСС/ОПГ
// @author       Albert_Trench
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      none
// @namespace https://greasyfork.org/ru/users/1118525-pistenkov
// @downloadURL https://update.greasyfork.org/scripts/487257/ARZAMAS%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%A1%D0%97%D0%93%D0%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/487257/ARZAMAS%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%A1%D0%97%D0%93%D0%A1.meta.js
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
            title: `На рассмотрении`,
            content:
`[CENTER][B][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>`+
            `Ваша тема взята на рассмотрение, ожидайте ответа в ближайшее время.<br>`+
             `Часто рассмотрение темы может занять определенное время.<br>`+
            ` [COLOR=rgb(243, 121, 52)]На рассмотрении.[/COLOR][/B][/CENTER]`,
            prefix: PIN_PREFIX,
            status: true,
 
        },
        {
        	title: `Запрос доказательств`,
        content:
        `[CENTER][B][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>`+
        `Запрошу доказательства у лидера.<br><br>`+
        `[COLOR=rgb(243, 121, 52)]На рассмотрении.[/COLOR][/B][/CENTER]`,
            prefix: PIN_PREFIX,
            status: true,
        },
        {
            title: `Проведена беседа`,
            content: 
`[CENTER][B][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>`+
            `С лидером будет проведена профилактическая беседа.<br><br>` +
    ` [COLOR=rgb(97, 189, 109)]Одобрено.[/COLOR][/B][/CENTER]`,
            prefix: ACCEPT_PREFIX,
            status: false,
        },
              {
            title: 'Дублирование',
            content:
               `[CENTER][B][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>`+
               `Данная тема является дубликатом вашей предыдущей темы.<br><br>`+
               `[COLOR=rgb(209, 72, 65)]Закрыто.[/COLOR][/B][/CENTER]`,
            prefix: UNACCEPT_PREFIX,
            status: false,
              },
        {
            title: `Получит наказание`,
            content: 
           `[CENTER][B][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>`+
            `Лидер получит соответствующее наказание<br><br>` +
          ` [COLOR=rgb(97, 189, 109)]Одобрено.[/COLOR][/B][/CENTER]`,
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Жалоба не по форме`,
            content:
            `[CENTER][B][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>`+
            `Жалоба составлена не по форме. Внимательно прочитайте правила составления жалобы, которые закреплены в этом разделе.<br><br>` +
            `[COLOR=rgb(209, 72, 65)]Закрыто.[/COLOR][/B][/CENTER]`,

            prefix: CLOSE_PREFIX,
            status: false,
        },

        {
            title: `В раздел ЖБ на сотрудников`,
            content: 
`[CENTER][B][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>`+
            `Вы ошиблись разделом, пожалуйста напишите свою жалобу в раздел «Жалобы на сотрудников»<br><br>` +
`[COLOR=rgb(209, 72, 65)]Закрыто.[/COLOR][/B][/CENTER]`,

            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: ` Не является ЛД`,
            content: 
`[CENTER][B][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>`+
            `Данный игрок не является лидером фракции.<br><br>` +
     `[COLOR=rgb(209, 72, 65)]Закрыто.[/COLOR][/B][/CENTER]`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `Лидер будет снят`,
            content:
`[CENTER][B][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>`+
            `Лидер будет снят со своего поста.<br><br>` +
`[COLOR=rgb(97, 189, 109)]Одобрено.[/COLOR][/B][/CENTER]`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `Недостаточно доков`,
            content:
`[CENTER][B][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>`+
            `Недостаточно доказательств, которые подтверждают нарушение.<br>`+
            `Если у вас есть дополнительные доказательства, которые могут помочь в рассмотрении жалобы - создайте новую тему, прикрепив их.<br><br>`+
`[COLOR=rgb(209, 72, 65)]Закрыто.[/COLOR][/B][/CENTER]`,
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Нет нарушения ЛД`,
            content:
`[CENTER][B][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>`+
            `Нет нарушений со стороны лидера.<br><br>`+
`[COLOR=rgb(209, 72, 65)]Закрыто.[/COLOR][/B][/CENTER]`,
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
             {
            title: `Снятие наказания`,
            content: 
`[CENTER][B][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>`+
                `Наказание будет снято.<br><br>` +
`[COLOR=rgb(97, 189, 109)]Одобрено.[/COLOR][/B][/CENTER]`,
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Опра вне фотохостинга`,
            content:
`[CENTER][B][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>`+
            "Внимательно прочитайте тему «[URL=`https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-лидеров.2639616/`]Правила подачи жалоб на лидеров[/URL]»<br><br>"+
            "Также следует обратить внимание на данный пункт правил:[QUOTE]3.6 Прикрепление доказательств обязательно.\n Примечание: загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/QUOTE]"+
`[COLOR=rgb(209, 72, 65)]Закрыто.[/COLOR][/B][/CENTER]`,
            prefix: UNACCEPT_PREFIX,
            status: false,

        },
        {
            title: `Ошибка разделом`,
            content:
`[CENTER][B][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>`+
            `Ваше обращение не имеет отношения к данному форумному разделу.<br><br>`+
`[COLOR=rgb(209, 72, 65)]Закрыто.[/COLOR][/B][/CENTER]`,
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
               {
            title: `48ч на заполнение форума`,
            content:
`[CENTER][B][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>`+
                `[CENTER]На заполнение форумного раздела даётся около 48 часов.<br><br>` +
        `[COLOR=rgb(209, 72, 65)]Закрыто.[/COLOR][/B][/CENTER]`,

            prefix: CLOSE_PREFIX,
            status: false,
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
            `<button type="button" class="button rippleButton" id="${id}" color="blue" style="margin: 3px;">${name}</button>`,
        );
    }

    function buttonsMarkup(buttons) {

        return `<div class="select_answer">${buttons
            .map(
            (btn, i) =>
            `<button id="answers-${i}" class="button--primary button ` +
            `rippleButton" color="blue" style="margin:3px"><span class="button-text">${btn.title}</span></button>`,
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
        const greeting = 6 < hours && hours <= 11
        ? `Доброе утро`
        : 12 < hours && hours <= 17
        ? `Добрый день`
        : 18 < hours && hours <= 23
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