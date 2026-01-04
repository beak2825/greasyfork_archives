// ==UserScript==
// @name         Made_in_China
// @namespace    https://openuserjs.org/users/Kingston007
// @version      1.5
// @description  my skills
// @author       DK
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @icon         https://icons.iconarchive.com/icons/aha-soft/iron-man/48/Ironman-Mask-3-Old-icon.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450851/Made_in_China.user.js
// @updateURL https://update.greasyfork.org/scripts/450851/Made_in_China.meta.js
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
                `[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/SIZE][/CENTER]<br>`,
        },
         {
            title: `Открытия заявок`,
            content:
            `[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(209, 213, 216)]Открыты заявления на лидерский пост организации - [/COLOR][COLOR=rgb(44, 130, 201)]"  "[/COLOR][COLOR=rgb(209, 213, 216)].[/COLOR][/SIZE][/FONT]<br><br>`+
          `[SIZE=4][FONT=courier new][COLOR=rgb(209, 213, 216)]Подавать заявления строго по форме, предоставленной ниже, игнорирование данного сообщения - [/COLOR][COLOR=rgb(255, 0, 0)]ОТКАЗ[/COLOR][COLOR=rgb(209, 213, 216)] в лидерском посту.[/COLOR]<br><br>`+
        `[COLOR=rgb(255, 0, 0)]Требования к кандидату[/COLOR] <br>`+
          `[COLOR=rgb(209, 213, 216)]- Иметь Discord и исправно работающий микрофон. <br>`+
           ` - Быть в возрасте 15 лет. <br>`+
           ` - Не иметь действующих варнов/банов. <br>`+
           ` - Иметь никнейм формата Имя_Фамилия. <br>`+
           ` - Игровой уровень персонажа 10 <br><br>`+
           ` - Быть ознакомленным с правилами сервера/лидеров/государственных организаций.[/COLOR] <br><br>`+


         ` [COLOR=rgb(255, 0, 0)]Форма подачи заявки:[/COLOR]<br>`+

            `[COLOR=rgb(209, 213, 216)]1. Никнейм: <br>`+
            `2. Игровой уровень: <br>`+
            `3. Скриншот статистики аккаунта с /time: <br>`+
            `4.Средний ежедневный онлайн: <br>`+
            `5. Были ли варны /баны (если да, то за что): <br>`+
            `6. Есть ли у вас твинк аккаунты (если да, то написать никнеймы)?:<br>`+
            `7. Почему именно вы должны занять пост лидера?:<br><br>`+
            `8. Имеется ли опыт в данной организации?:<br>`+
            `9. Были ли вы лидером любой другой организации?:<br>`+
            `10. Ваш часовой пояс:<br>`+
            `11. Ссылка на страницу во вконтакте:<br>`+
            `12. Логин Discord аккаунта:<br>`+
            `13. Ваше реальное имя:<br>`+
            `14. Ваш реальный возраст:<br>`+
            `15. Город, в котором проживаете:<br>`+
            `16. Ссылка на РП Биографию:[/COLOR][/FONT][/SIZE]<br>`+

            `[FONT=courier new][SIZE=4][COLOR=rgb(251, 160, 38)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]На обзвоне будет спрашиваться 3 ваших улучшения. Прежде чем подать заявку, подумайте, нужен ли вам данный пост и сможете вы справится с организацией[/COLOR][/SIZE][/FONT][/CENTER]!`,

        },
        {
            title: `Закрытие заявок`,
            content :  `[SIZE=5][FONT=georgia][CENTER] ${greeting}, уважаемые игроки.<br>`+
            `[CENTER] В данной теме вы узнаете список [color=lightgreen] одобренных [/color] и [[COLOR=red] отказанных [/color] игроков на должность Лидера Фракции «  »<br>`+
            `[CENTER] В случае если вы не согласны с решениям Старшей Администрации то составьте свою претензию в раздел «Жалобы на Администрацию».<br><br>`+
            `[CENTER][I][SIZE=4][FONT=times new roman][COLOR=rgb(209, 213, 216)]До обзвона допущены:[/COLOR][/FONT][/SIZE][/I]`+
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

            `[SIZE=4][I][COLOR=rgb(209, 213, 216)]До обзвона не допущены:[/COLOR][/I][/SIZE]<br>`+
             `[CENTER] [LIST]
             [*]  — [[COLOR=red] Причина отказа: [/color]
             [*]  — [[COLOR=red] Причина отказа: [/color]
             [*]  — [[COLOR=red] Причина отказа: [/color]
             [*]  — [[COLOR=red] Причина отказа: [/color]
             [*]  — [[COLOR=red] Причина отказа: [/color]
             [*]  — [[COLOR=red] Причина отказа: [/color]
             [*]  — [[COLOR=red] Причина отказа: [/color]
             [*]  — [[COLOR=red] Причина отказа: [/color]
             [*]  — [[COLOR=red] Причина отказа: [/color]
             [*]  — [[COLOR=red] Причина отказа: [/color]
             [*]  — [[COLOR=red] Причина отказа: [/color]
            [/LIST]<br><br>`+
            `[CENTER] [SIZE=6] Обзвон пройдет в XX:XX!<br><br>`+
            `[CENTER] Всем одобренным кандидатам, желаю удачи на обзвоне! Не забудьте почитать правила до обзвона😝`,
            },




        {
            title: `Блять, придется посмотреть👺`,
            content: `[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}![/CENTER]<br>` +
                `[CENTER] Ваша жалоба закреплена и находится на рассмотрении.<br><br>` +
                `Пожалуйста ожидайте ответа.<br>` +
                `[COLOR=orange]На рассмотрение.[/color] [/CENTER][/FONT][/SIZE]`,
            prefix: PIN_PREFIX,
            status: true,
        },
        {
            title: `Ищю опру🤯`,
            content: `[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR]${user.mention}![/CENTER]<br>` +
                `[CENTER] Запрошу доказательства на увольнение.<br><br>` +
                `Пожалуйста ожидайте ответа.<br>` +
                `[COLOR=orange]На рассмотрение.[/color] [/CENTER][/SIZE]`,
            prefix: PIN_PREFIX,
            status: true,
        },
        {
            title: `Мозговой штурм🧠`,
            content: `[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}!<br>` +
                ` Благодарим за ваше обращение!<br>` +
                ` С лидером будет проведена профилактическая беседа.<br>` +
                ` [COLOR=lightgreen]Одобрено[/color],закрыто [/CENTER][/SIZE]`,
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Пизда лидеру👹`,
            content: `[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}!<br>` +
                `Благодарим за ваше обращение!<br>` +
                `Лидер получит соответствующие наказание` +
                `[COLOR=lightgreen]Одобрено[/color],закрыто [/CENTER][/SIZE]`,
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Даун, форму заполни🤬`,
            content:
                `[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/CENTER]<br><br>` +
                "[CENTER]Жалоба составлена не по форме. Внимательно прочитайте правила составления жалобы, которые закреплены в этом разделе. <br><br>" +
                `[CENTER][[COLOR=red] Отказано[/color], закрыто.[/CENTER][/SIZE]`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `Работа Глебу😅`,
            content: `[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}![/CENTER]<br>` +
                `[CENTER] Ваша жалоба передана на рассмотрение Главному Администратору или его непосредственным заместителям.<br><br>` +
                `Пожалуйста ожидайте ответа.<br>` +
                `[COLOR=orange]На рассмотрение.[/color] [/CENTER][/SIZE]`,
            prefix: 12,
            status: true,
        },
        {
            title: `ПИДАРАСИНА, не туда подал😠`,
            content: `[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/CENTER]<br><br>` +
                `[CENTER]Ошиблись разделом,пожалуйста напишите свою жалобу в раздел «Жалобы на сотрудников»<br>` +
                `[CENTER] [[COLOR=red] Отказано[/color],закрыто[/CENTER][/SIZE]`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `Ебать ты даун, он еще не ЛД👍🏻`,
            content: `[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/CENTER]<br><br>` +
                `[CENTER]Данный игрок не являеться лидером.<br>` +
                `[CENTER][COLOR=red] Отказано[/color],закрыто.[/CENTER][/SIZE]`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `Поздравляю, слившик хуев🤤`,
            content: `[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/CENTER]<br><br>` +
                ` [CENTER] Благодарим за ваше обращение!<br>` +
                ` [CENTER] Лидер снят со своего поста. <br>` +
                ` [CENTER]  [COLOR=lightgreen]Одобрено[/color],закрыто.[/CENTER][/SIZE]`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `ЛОХ, ищи док-ву😼`,
            content:`[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/CENTER]<br><br>` +
            `[CENTER] Недостаточно доказательств, которые потверждают нарушение лидера.<br>`+
            ` [CENTER][[COLOR=red] Отказано[/color],закрыто.[/CENTER][/SIZE]`,
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: `УРА, ЛД не косячат🥳`,
            content:`[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/CENTER]<br><br>` +
            `[CENTER] Исходя из выше приложенных доказательств,нарушение со стороны лидера - не имееться!<br>`+
            `[CENTER] [COLOR=red] Отказано,[/color] закрыто.[/CENTER][/SIZE]`,
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: `СУКА. вот это я лох😖`,
            content: `[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}!<br>` +
                `Ваша жалоба была пересмотрена!<br>` +
                `Лидер получит соответствующие наказание` +
                `[COLOR=lightgreen]Одобрено[/color],закрыто [/CENTER][/SIZE]`,
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
        title: `ДОЛОЙ СОЦ СЕТИ🚫`,
        content:`[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention} <br><br>`+
        "Пожалуйста внимательно прочитайте тему «[URL=`https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.193340/`]Правила подачи жалоб на администрацию[/URL][SIZE=5][B]»<br><br>"+
        `И обратите своё внимание, на данный пункт правил —[/B][/SIZE][/FONT][/SIZE][SIZE=4][FONT=georgia][QUOTE]3.6. Прикрепление доказательств обязательно.Примечание: загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/QUOTE][/FONT][QUOTE][/quote][/SIZE][QUOTE][/QUOTE]`+
        `[SIZE=4][FONT=georgia][COLOR=red] Отказано[/color],[S] закрыто.[/S][/SIZE]`,
        prefix: UNACCEPT_PREFIX,
        status: false,

    },
        {
            title: `Правила раздела📗`,
            content:`[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/CENTER]<br><br>` +
            `[CENTER]Пожалуйста, убедительная просьба, ознакомится с назначением данного раздела в котором Вы создали тему, так как ваш запрос никоим образом не относится к предназначению данного раздела.[/CENTER]`+
		    `[CENTER][COLOR=red] Отказано[/color], закрыто.[/SIZE][/CENTER]<br><br>`,
            prefix: UNACCEPT_PREFIX,
            status:false,
        },
    ];








    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $(`body`).append(`<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`);

        // Добавление кнопок при загрузке страницы
        addButton(`На рассмотрение`, `pin`);
        addButton(`Рассмотрено`, `watched`);
        addButton(`Одобрено`, `accepted`);
        addButton(`Отказано`, `unaccept`);
        addButton(`Ответы`, `selectAnswer`);


        // Поиск информации о теме
        const threadData = getThreadData();

        $(`button#pin`).click(() => editThreadData(PIN_PREFIX, true));
        $(`button#watched`).click(() => editThreadData(WATCHED_PREFIX, true));
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