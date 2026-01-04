// ==UserScript==
// @name         BLACK | Скрипт ГС/ЗГС L.King
// @namespace    https://openuserjs.org/users/King73
// @version      2.1
// @description  my skills
// @author       King
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @icon         https://icons.iconarchive.com/icons/aha-soft/iron-man/48/Ironman-Mask-3-Old-icon.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/471604/BLACK%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%93%D0%A1%D0%97%D0%93%D0%A1%20LKing.user.js
// @updateURL https://update.greasyfork.org/scripts/471604/BLACK%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%93%D0%A1%D0%97%D0%93%D0%A1%20LKing.meta.js
// ==/UserScript==

(async function () {
    `use strict`;
    const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
    const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
    const PIN_PREFIX = 2; // Prefix that will be set when thread pins
    const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
    const WATCHED_PREFIX = 9;
    const CLOSE_PREFIX = 7;
    const data = await getThreadData(),
        greeting = data.greeting,
        user = data.user;
    const buttons = [

        {
            title: `Приветствие`,
            content:
                `[SIZE=5][FONT=georgia][CENTER] ${greeting}, уважаемый ${user.mention}![/CENTER]<br>` +
                `[CENTER]      [/CENTER][/FONT][/SIZE]<br><br>`+
                        `[SIZE=5][FONT=georgia][CENTER][COLOR=rgb(138, 43, 226)] Приятной игры и времяпровождение на сервере[/color] [COLOR=black]BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,

        },
        {
            title: `Закрытие заявок`,
            content :  `[SIZE=5][FONT=georgia][CENTER] ${greeting}, уважаемые игроки.<br>`+
            `[CENTER] В данной теме вы узнаете список [color=lightgreen] одобренных [/color] и[[COLOR=red] отказанных [/color] игроков на должность Лидера Фракции «  »<br>`+
            `[CENTER] В случае если вы не согласны с решениям Старшей Администрации то составьте свою претензию в раздел «Жалобы на Администрацию».<br><br>`+
            `[SIZE=6] [CENTER] [color=lightgreen] Список одобренных кандидат;[/color]<br>`+
            `[CENTER] [LIST=1]
             [*]
             [*]
             [*]
             [*]
             [*]
             [*]
             [*]
             [*]
             [*]
             [*]
             [*]
            [/LIST]<br><br>`+
            `[SIZE=6] [CENTER] [COLOR=red] Список отказанных игроков;[/color]<br>`+
             `[CENTER] [LIST]
             [*]  — [COLOR=red] Причина отказа: [/color]
             [*]  — [COLOR=red] Причина отказа: [/color]
             [*]  — [COLOR=red] Причина отказа: [/color]
             [*]  — [COLOR=red] Причина отказа: [/color]
             [*]  — [COLOR=red] Причина отказа: [/color]
             [*]  — [COLOR=red] Причина отказа: [/color]
             [*]  — [COLOR=red] Причина отказа: [/color]
             [*]  — [COLOR=red] Причина отказа: [/color]
             [*]  — [COLOR=red] Причина отказа: [/color]
             [*]  — [COLOR=red] Причина отказа: [/color]
             [*]  — [COLOR=red] Причина отказа: [/color]
            [/LIST]<br><br>`+
            `[CENTER] [SIZE=6] [[COLOR=red] Примечание: [/COLOR] После одобрение, с вами свяжится Старшая Администрация. Вам будет необходимо добавить представителя старшей администрации в друзья, после вас добавят в специальную беседу.<br>`+
            `[CENTER] [SIZE=6] Никто из состава администрации не будет просить у вас все различные пароли, пин-коды, информация о привязках и так далее. Не ведитесь на обманы!<br><br>`+
            `[CENTER] Всем одобренным кандидатам, желаю удачи на обзвоне! Не забудьте почитать правила до обзвона😝`,
            },
{
                title: `Лидер снят/чс`,
                content: `[size=5][font=georgia][CENTER] ${greeting}, уважаемый ${user.mention}![/CENTER]<br>`+ 
                `[center]Лидер будет снят со своей должности[/center]<br>`+
                `[center]Чс будет выдан на<br>`+
                `[color=green]Одобрено[/color],[color=red]Закрыто[/color][/center][/font][/size]<br><br>`+
                `[SIZE=5][FONT=georgia][CENTER][COLOR=rgb(138, 43, 226)] Приятной игры и времяпровождение на сервере[/color] [COLOR=black]BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
            },





        {
            title: `На рассмотрении`,
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}![/CENTER]<br>` +
                `[CENTER] Ваша жалоба взята на рассмотрение.<br><br>` +
                `Пожалуйста ожидайте ответа.<br>` +
                `[COLOR=orange]На рассмотрение.[/color] [/CENTER][/FONT][/SIZE]<br><br>`+
                        `[SIZE=5][FONT=georgia][CENTER][COLOR=rgb(138, 43, 226)] Приятной игры и времяпровождение на сервере[/color] [COLOR=black]BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,

            prefix: PIN_PREFIX,
            status: true,
        },
        {
            title: `Проведена беседа`,
            content: ` [SIZE=5][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}!<br>` +
                ` Благодарим за ваше обращение!<br>` +
                ` С лидером будет проведена профилактическая беседа.<br>` +
                ` [CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/color],закрыто [/CENTER][/FONT][/SIZE]<br><br>`+
            `[SIZE=5][FONT=georgia][CENTER][COLOR=rgb(138, 43, 226)] Приятной игры и времяпровождение на сервере[/color] [COLOR=black]BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Получит наказание`,
            content: `[SIZE=5][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}!<br>` +
                `Благодарим за ваше обращение!<br>` +
                `Лидер получит соответствующие наказание` +
                ` [COLOR=rgb(0, 255, 0)]Одобрено[/color],закрыто [/CENTER][/FONT][/SIZE]<br><br>`+
                        `[SIZE=5][FONT=georgia][CENTER][COLOR=rgb(138, 43, 226)] Приятной игры и времяпровождение на сервере[/color] [COLOR=black]BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,

            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Жалоба не по форме`,
            content:
                `[SIZE=5][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
                "[CENTER]Жалоба составлена не по форме. Внимательно прочитайте правила составления жалобы, которые закреплены в этом разделе. <br><br>" +
                `[CENTER][COLOR=red] Отказано[/color], закрыто.[/CENTER][/FONT][/SIZE]<br><br>`+
                        `[SIZE=5][FONT=georgia][CENTER][COLOR=rgb(138, 43, 226)] Приятной игры и времяпровождение на сервере[/color] [COLOR=black]BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,

            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `В раздел ЖБ на сотрудников`,
            content: `[SIZE=5][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
                `[CENTER]Ошиблись разделом,пожалуйста напишите свою жалобу в раздел «Жалобы на сотрудников»<br>` +
                `[CENTER] [COLOR=red] Отказано[/color],закрыто[/CENTER][/FONT][/SIZE]<br><br>`+
                        `[SIZE=5][FONT=georgia][CENTER][COLOR=rgb(138, 43, 226)] Приятной игры и времяпровождение на сервере[/color] [COLOR=black]BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,

            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: ` Не являеться ЛД`,
            content: `[SIZE=5][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
                `[CENTER]Данный игрок больше не являеться лидером.<br>` +
                `[CENTER] [COLOR=red] Отказано[/color],закрыто.[/CENTER][/FONT][/SIZE]<br><br>`+
                        `[SIZE=5][FONT=georgia][CENTER][COLOR=rgb(138, 43, 226)] Приятной игры и времяпровождение на сервере[/color] [COLOR=black]BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,

            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `Лидер был снят`,
            content: `[SIZE=5][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
                ` [CENTER] Благодарим за ваше обращение!<br>` +
                ` [CENTER]  [COLOR=rgb(0, 255, 0)]Одобрено[/color],закрыто.[/CENTER][/FONT][/SIZE]<br><br>`+
                        `[SIZE=5][FONT=georgia][CENTER][COLOR=rgb(138, 43, 226)] Приятной игры и времяпровождение на сервере[/color] [COLOR=black]BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,

            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `Недостаточно док-вы`,
            content:`[SIZE=5][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER] Недостаточно доказательств, которые потверждают нарушение лидера.<br>`+
            ` [CENTER][COLOR=red] Отказано[/color],закрыто.[/CENTER][/FONT][/SIZE]<br><br>`+
                        `[SIZE=5][FONT=georgia][CENTER][COLOR=rgb(138, 43, 226)] Приятной игры и времяпровождение на сервере[/color] [COLOR=black]BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,

            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Нету нарушение`,
            content:`[SIZE=5][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER] Исходя из выше приложенных доказательств,нарушение со стороны лидера - не имееться!<br>`+
            `[CENTER] [COLOR=red] Отказано[/color],закрыто. [/CENTER][/FONT][/SIZE]<br><br>`+
                        `[SIZE=5][FONT=georgia][CENTER][COLOR=rgb(138, 43, 226)] Приятной игры и времяпровождение на сервере[/color] [COLOR=black]BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,

            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
        title: `Опра в соц.сети`,
        content:` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
        "Пожалуйста внимательно прочитайте тему «[URL=`https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.193340/`]Правила подачи жалоб на администрацию[/URL][SIZE=5][B]»<br><br>"+
        "И обратите своё внимание, на данный пункт правил —[/B][/SIZE][/FONT][/SIZE][SIZE=4][FONT=georgia][QUOTE]3.6. Прикрепление доказательств обязательно.Примечание: загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/QUOTE][/FONT][QUOTE][/quote][/SIZE][QUOTE][/QUOTE]"+
        `[SIZE=4][FONT=georgia][COLOR=red] Отказано[/color],[S] закрыто.[/S][/FONT][/SIZE]<br><br>`+
                        `[SIZE=5][FONT=georgia][CENTER][COLOR=rgb(138, 43, 226)] Приятной игры и времяпровождение на сервере[/color] [COLOR=black]BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,

        prefix: UNACCEPT_PREFIX,
        status: false,

    },
        {
            title: `Правила раздела`,
            content:`[SIZE=5][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER]Пожалуйста, убедительная просьба, ознакомится с назначением данного раздела в котором Вы создали тему, так как ваш запрос никоим образом не относится к предназначению данного раздела.[/CENTER]`+
		    `[CENTER][COLOR=red] Отказано[/color], закрыто.[/CENTER][/FONT]<br><br>`+
                        `[SIZE=5][FONT=georgia][CENTER][COLOR=rgb(138, 43, 226)] Приятной игры и времяпровождение на сервере[/color] [COLOR=black]BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,

            prefix: UNACCEPT_PREFIX,
            status:false,
        },
    {
        title: `Жалобы на игрока`,
        content:` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
        "Напишите данную жалобу в раздел: «[URL=`https://forum.blackrussia.online/index.php?forums/Жалобы-на-игроков.470/`]Жалобы на игрока[/URL][SIZE=5][B]»<br><br>"+
        `[SIZE=4][FONT=georgia][COLOR=red] Отказано[/color],[S] закрыто.[/S][/FONT][/SIZE]<br><br>`+
                    `[SIZE=5][FONT=georgia][CENTER][COLOR=rgb(138, 43, 226)] Приятной игры и времяпровождение на сервере[/color] [COLOR=black]BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,

        prefix: UNACCEPT_PREFIX,
        status: false,

    },
         {
            title: `На рассмотрение`,
            content: `[SIZE=5][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}![/CENTER]<br>` +
                `[CENTER] Запросил доказательсва у лидера.<br><br>` +
                `Пожалуйста ожидайте ответа.<br>` +
                `[COLOR=orange]На рассмотрение.[/color] [/CENTER][/FONT][/SIZE]<br><br>`+
                         `[SIZE=5][FONT=georgia][CENTER][COLOR=rgb(138, 43, 226)] Приятной игры и времяпровождение на сервере[/color] [COLOR=black]BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,

            prefix: PIN_PREFIX,
            status: true,
        },
 {
            title: `Проинструктировать`,
            content: `[SIZE=5][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}!<br>` +
                `Лидер не предоставил доказательства вашего нарушения!<br>` +
                `Лидер получит соответствующие наказание` +
                ` [COLOR=rgb(0, 255, 0)]Одобрено[/color],закрыто [/CENTER][/FONT][/SIZE]<br><br>`+
                 `[SIZE=5][FONT=georgia][CENTER][COLOR=rgb(138, 43, 226)] Приятной игры и времяпровождение на сервере[/color] [COLOR=black]BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,

            prefix: ACCEPT_PREFIX,
            status: false,
        },
 {
            title: `Лидер прав `,
            content: `[SIZE=5][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
                `[CENTER]Лидер предоставил доказательтво вашего нарушения.<br>` +
                `[CENTER] [COLOR=red] Отказано[/color],закрыто.[/CENTER][/FONT][/SIZE]<br><br>`+
                 `[SIZE=5][FONT=georgia][CENTER][COLOR=rgb(138, 43, 226)] Приятной игры и времяпровождение на сервере[/color] [COLOR=black]BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,

            prefix: CLOSE_PREFIX,
            status: false,
        },
{
                title: `В жб на игроков`,
                content: `[size=5][font=georgia][CENTER] ${greeting}, уважаемый ${user.mention}![/CENTER]<br>`+ 
                `[center]Напишите жалобу в раздел [url=https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.470/]"Жалобы на игроков"[/url]<br>`+
                `[color=red]Закрыто[/color]<br>`+
                `[SIZE=5][FONT=georgia][CENTER][COLOR=rgb(138, 43, 226)] Приятной игры и времяпровождение на сервере[/color] [COLOR=black]BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
                prefix:CLOSE_PREFIX,
                status: false,
            },

         {
            title: `48ч на заполнение форума`,
            content: `[SIZE=5][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
                `[CENTER]На заполнение форумного раздела даётся около 48 часов.<br>` +
                `[CENTER] [COLOR=red] Отказано[/color],закрыто.[/CENTER][/FONT][/SIZE]<br><br>`+
                         `[SIZE=5][FONT=georgia][CENTER][COLOR=rgb(138, 43, 226)] Приятной игры и времяпровождение на сервере[/color] [COLOR=black]BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,

            prefix: CLOSE_PREFIX,
            status: false,
        },
        ];










    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $(`body`).append(`<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`);

        // Добавление кнопок при загрузке страницы
       addButton(`На рассмотрение`, `pin`);
        addButton(`Одобрено`, `accepted`);
        addButton(`Отказано`, `unaccept`);
        addButton (`Закрыто`,`closed`)
        addButton(`Ответы`, `selectAnswer`);


        // Поиск информации о теме
        const threadData = getThreadData();

        $(`button#pin`).click(() => editThreadData(PIN_PREFIX, true));
        $(`button#accepted`).click(() => editThreadData(ACCEPT_PREFIX, false));
        $(`button#closed`).click(() => editThreadData(CLOSE_PREFIX, false));
        $(`button#teamProject`).click(() => editThreadData(COMMAND_PREFIX, true));
        $(`button#unaccept`).click(() => editThreadData(UNACCEPT_PREFIX, false));
       $(`button#selectAnswer`).click(() => {
            XF.alert(buttonsMarkup(buttons), null, `Выберите ответ:`);
            buttons.forEach((btn, id) => {
                if (id > 2 ) {
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