// ==UserScript==
// @name         Оливер
// @namespace    https://openuserjs.org/users/Kingston007
// @version      2.2
// @description  my 
// @author       rei
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @icon         https://icons.iconarchive.com/icons/aha-soft/iron-man/48/Ironman-Mask-3-Old-icon.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/447862/%D0%9E%D0%BB%D0%B8%D0%B2%D0%B5%D1%80.user.js
// @updateURL https://update.greasyfork.org/scripts/447862/%D0%9E%D0%BB%D0%B8%D0%B2%D0%B5%D1%80.meta.js
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
                `[SIZE=4][FONT=georgia][CENTER] ${greeting}, уважаемый ${user.mention}![/CENTER]<br>` +
                `[CENTER]      [/CENTER][/FONT][/SIZE]`,
        },
        {
            title: `Открытия заявок`,
            content:
            `[CENTER][SIZE=5][FONT=times new roman][COLOR=lightgreen] Открыты заявления на лидерский пост организации "Фракция"
Подавать заявления строго по форме предоставленной ниже, игнорирование данного сообщения - отказ в лидерском посту. [/COLOR]<br><br>`+
         `[SIZE=6][FONT=times new roman][[COLOR=red] Требования к кандидату: [/COLOR][/FONT][/SIZE].<br>`+

  `  Иметь Discord и исправно работающий микрофон.<br>`+
  `  Быть в возрасте 15 лет.<br>`+
  `  Не иметь действующих варнов/банов.<br>`+
  `  Иметь никнейм формата Имя_Фамилия.<br>`+
  `  Игровой уровень персонажа для ОПГ - 8-й, для ГОС - 10-й лвл.<br>`+
  `  Быть ознакомленным с правилами сервера/лидеров/государственных организаций/ОПГ.<br>`+

       `[SIZE=6][FONT=times new roman][[COLOR=red] Примечания: [/COLOR][/FONT][/SIZE].<br>`+

        `    ● Запрещено подавать заявки на несколько лидерок сразу, только на одну. <br>`+
 `  ● Скриншот статистики игрового аккаунта с /time принимается только в том случае, если он сделан после открытия заявок.<br>`+
 `  ● Бывшим администраторам, что были сняты менее месяца назад запрещено занимать лидерский пост.<br>`+

            `[SIZE=6][FONT=times new roman][[COLOR=red] Форма подачи заявления: [/COLOR][/FONT][/SIZE].<br>`+

           `   1. Никнейм: Текст.<br>`+
  ` 2. Игровой уровень: Текст.<br>`+
  ` 3. Скриншот статистики аккаунта с /time: Ссылка.<br>`+
  ` 4. Средний ежедневный онлайн: Текст.<br>`+
  ` 5. Были ли варны/баны (если да, то за что): Текст.<br>`+
  ` 6. Есть ли у вас твинк аккаунты (если да, то написать никнеймы)?: Текст.<br>`+
  ` 7. Почему именно вы должны занять пост лидера?: Текст.<br>`+
  ` 8. Имеется ли опыт в данной организации?: Текст<br>`+
  ` 9. (NEW) Короткая RP биография персонажа (3-5 предложений. Если же у вас есть одобренная Rp биография,то можете прекрепить ссылку на данную биографию): Текст.<br>`+
  ` 10. Были ли вы лидером любой другой организации?: Текст.<br>`+
  ` 11. Ваш часовой пояс: Текст.<br>`+
  ` 12. Ссылка на страницу ВКонтакте: Ссылка.<br>`+
  ` 13. Логин Discord аккаунта: Текст.<br>`+
  ` 14. Ваше реальное имя: Текст.<br>`+
  ` 15. Ваш реальный возраст: Текст.<br>`+
  ` 16. Город, в котором проживаете: Текст.`,
         },

        {
            title: `Закрытие заявок`,
            content :  `[SIZE=5][FONT=georgia][CENTER] ${greeting}, уважаемые игроки.<br>`+
            `[CENTER] В данной теме вы узнаете список [color=lightgreen] одобренных [/color] и [[COLOR=red] отказанных [/color] игроков на должность Лидера Фракции «  »<br>`+
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
             [*]  — [COLOR=red] Причина отказа: [/color]
             [*]  — [COLOR=red] Причина отказа: [/color]
            [/LIST]<br><br>`+
            `[CENTER] [SIZE=6] [COLOR=red] Примечание: [/COLOR] После одобрение, с вами свяжится Главный Следящий,либо его Заместитель.<br>`+
            `[CENTER] [SIZE=6] Никто из состава администрации не будет просить у вас все различные пароли, пин-коды, информация о привязках и так далее. Не ведитесь на обманы!<br><br>`+
            `[CENTER] Всем одобренным кандидатам, желаю удачи на обзвоне! Не забудьте почитать правила до обзвона😝`,
            prefix: WATCHED_PREFIX
            },





        {
            title: `Запрос док-вы у лидера`,
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}![/CENTER]<br>` +
                `[CENTER] Запрошу доказательства у лидера.<br><br>` +
                `Пожалуйста ожидайте ответа.<br>` +
                `[COLOR=orange]На рассмотрение.[/color] [/CENTER][/FONT][/SIZE]`,
            prefix: PIN_PREFIX,
            status: true,
        },
        {
            title: `Проведена беседа`,
            content: ` [SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}!<br>` +
                ` Благодарим за ваше обращение!<br>` +
                ` С лидером / заместителем будет проведена профилактическая беседа.<br>` +
                ` [COLOR=lightgreen]Одобрено[/color],закрыто [/CENTER][/FONT][/SIZE]`,
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Получит наказание`,
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}!<br>` +
                `Благодарим за ваше обращение!<br>` +
                `Лидер получит соответствующие наказание` +
                ` [COLOR=lightgreen]Одобрено[/color],закрыто [/CENTER][/FONT][/SIZE]`,
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Жалоба не по форме`,
            content:
                `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
                "[CENTER]Жалоба составлена не по форме. Внимательно прочитайте правила составления жалобы, которые закреплены в этом разделе. <br><br>" +
                `[CENTER][[COLOR=red] Отказано[/color], закрыто.[/CENTER][/FONT][/SIZE]`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
{
title: 'НАЗВАНИЕ ТЕМЫ',
content:
		'[CENTER][B]{{ greeting }}![/B][/CENTER]<br><br>' +
        '[CENTER]В названии вашей жалобы отсутствует NickName технического специалиста.<br>' +
		"[CENTER]В названии вашей жалобы отсутствует NickName лидера. 一 [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.193368/'][I]кликабельно[/I][/URL]. <br><br>" +
		'[CENTER][I]Отказано[/I]. :( [/CENTER]',
	prefix: UNACCEPT_PREFIX,
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
                `[CENTER]Данный игрок больше не являеться лидером.<br>` +
                `[CENTER] [COLOR=red] Отказано[/color],закрыто.[/CENTER][/FONT][/SIZE]`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `Лидер был снят`,
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
                ` [CENTER] Благодарим за ваше обращение!<br>` +
                ` [CENTER]  [COLOR=lightgreen]Одобрено[/color],закрыто.[/CENTER][/FONT][/SIZE]`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `Недостаточно док-вы`,
            content:`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER] Недостаточно доказательств, которые потверждают нарушение лидера.<br>`+
            ` [CENTER][[COLOR=red] Отказано[/color],закрыто.[/CENTER][/FONT][/SIZE]`,
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Нету нарушение`,
            content:`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER] Исходя из выше приложенных доказательств,нарушение со стороны лидера - не имееться!<br>`+
            `[CENTER] [COLOR=red] Отказано[/color],закрыто. [/CENTER][/FONT][/SIZE]`,
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Правила раздела`,
            content:`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER]Пожалуйста, убедительная просьба, ознакомится с назначением данного раздела в котором Вы создали тему, так как ваш запрос никоим образом не относится к предназначению данного раздела.[/CENTER]`+
		    `[CENTER][COLOR=red] Отказано[/color], закрыто.[/CENTER][/FONT]<br><br>`,
            prefix: UNACCEPT_PREFIX,
            status:false,
         },

        {
            title: `Есть док-ва`,
            content:`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER] Лидер / заместитель предоставил доказательства вашего нарушения,наказание было выдано верно!!<br>`+
            `[CENTER] [COLOR=red] Отказано[/color],закрыто. [/CENTER][/FONT][/SIZE]`,
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
  {
            title: `Доква соц сети`,
            content:`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER] Доказательства в социальных сетях и т.д. не принимаются.<br>`+
 `[CENTER] Загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx и так далее.<br>`+
            `[CENTER] [COLOR=red] Отказано[/color],закрыто. [/CENTER][/FONT][/SIZE]`,
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
         {
            title: `Возврат должности`,
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}!<br>` +
                `Благодарим за ваше обращение!<br>` +
                `Лидер / заместитель будет наказан,должность вам вернут обратно` +
                ` [COLOR=lightgreen]Одобрено[/color],закрыто [/CENTER][/FONT][/SIZE]`,
            prefix: ACCEPT_PREFIX,
            status: false,
        },

         {
            title: `Снятие наказания`,
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}!<br>` +
                `Благодарим за ваше обращение!<br><br>` +
                `Проверив доказательства лидера / заместителя было принято решение то что вам снимут наказание.` +
                ` [COLOR=lightgreen]Одобрено[/color],закрыто [/CENTER][/FONT][/SIZE]`,
            prefix: ACCEPT_PREFIX,
            status: false,
        },

        {
            title: `Заявления на рассмотрении`,
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемые игроки![/CENTER]<br>` +
                `[CENTER] Закрываю заявление на пост лидера на рассмотрение.<br><br>` +
                `Пожалуйста ожидайте результатов.<br><br>` +
                `[COLOR=orange]На рассмотрение.[/color] [/CENTER][/FONT][/SIZE]`,
            prefix: PIN_PREFIX,
            status: true,
        },

        {
            title: `Запрос док-вы у заместителя`,
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}![/CENTER]<br>` +
                `[CENTER] Запрошу доказательства у заместителя.<br><br>` +
                `Пожалуйста ожидайте ответа.<br>` +
                `[COLOR=orange]На рассмотрение.[/color] [/CENTER][/FONT][/SIZE]`,
            prefix: PIN_PREFIX,
            status: true,
        },

         {
            title: `Заместитель получит наказание`,
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}!<br>` +
                `Благодарим за ваше обращение!<br>` +
                `Заместитель получит соответствующие наказание <br><br>` +
                ` [COLOR=lightgreen]Одобрено[/color],закрыто [/CENTER][/FONT][/SIZE]`,
            prefix: ACCEPT_PREFIX,
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
})();// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://forum.blackrussia.online/index.php?members/leroy-wilson.111704/#latest-activity
// @icon         https://www.google.com/s2/favicons?sz=64&domain=blackrussia.online
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();