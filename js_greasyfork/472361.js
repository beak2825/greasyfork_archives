// ==UserScript==
// @name         Скриптеше для еблана ЗГА
// @namespace    https://forum.blackrussia.online
// @version      1.0
// @description  Scrips
// @author       Lucasic
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @icon         https://icons.iconarchive.com/icons/aha-soft/iron-man/48/Ironman-Mask-3-Old-icon.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472361/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%D0%B5%D1%88%D0%B5%20%D0%B4%D0%BB%D1%8F%20%D0%B5%D0%B1%D0%BB%D0%B0%D0%BD%D0%B0%20%D0%97%D0%93%D0%90.user.js
// @updateURL https://update.greasyfork.org/scripts/472361/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%D0%B5%D1%88%D0%B5%20%D0%B4%D0%BB%D1%8F%20%D0%B5%D0%B1%D0%BB%D0%B0%D0%BD%D0%B0%20%D0%97%D0%93%D0%90.meta.js
// ==/UserScript==

(async function () {
    `use strict`;
    const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
    const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
    const PIN_PREFIX = 2; // Prefix that will be set when thread pins
    const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
    const WATCHED_PREFIX = 9;
    const CLOSE_PREFIX = 7;
    const SPECIAL_PREFIX = 11;
    const GA_PREFIX = 12;
     const TECH_PREFIX = 13;
    const data = await getThreadData(),
        greeting = data.greeting,
        user = data.user;
    const buttons = [
         {
            title: `У дауна нет слов `,
            content:
                `[SIZE=4][FONT=georgia][CENTER] ${greeting}, уважаемый ${user.mention}![/CENTER]<br>` +
                `[CENTER]      [/CENTER][/FONT][/SIZE]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,

        },
            {

            title: `Нету нарушение`,
            content:
                `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER] Исходя из выше приложенных доказательств,нарушение со стороны администратора - не имеется!<br>`+
            `[CENTER][color=red] Отказано[/color],закрыто. [/CENTER][/FONT][/SIZE]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,

            prefix: UNACCEPT_PREFIX,
            status: false,
	},
        {
            title: `Недостаточно док-вы`,
            content:`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER] Недостаточно доказательств, которые потверждают нарушение администратора.<br>`+
            ` [CENTER][color=red] Отказано[/color],закрыто.[/CENTER][/FONT][/SIZE]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
         {
	  title: `От 3 лица`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Жалоба создана от третьего лица.[/CENTER]<br><br>" +
		`[CENTER]Жалоба не подлежит рассмотрению.<br><br>`+
        `[color=red]Отказано[/color],закрыто! [/CENTER][/FONT][/SIZE]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: `На рассмотрение`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Ваша жалоба взята на рассмотрение. Ожидайте, пожалуйста, пока администратор предоставит мне доказательства и не нужно создавать копии этой темы.[/CENTER]<br><br>" +
		`[CENTER][color=orange]На рассмотрении[/color].[/CENTER][/FONT][/SIZE]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: PIN_PREFIX,
	  status: true,
	},
         {
            title: `Нету док-вы`,
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER] Пожалуйста, прикрепите доказательства к жалобе, которые подтверждают нарушение администратора.<br>`+
            `[CENTER] [color=red]Закрыто[/color]<br>`+
`[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
 prefix: UNACCEPT_PREFIX,
            status:false,
        },
         {
            title: `Окно бана`,
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER]Зайдите в игру и сделайте скрин окна с баном после чего, заново напишите жалобу.<br>`+
            `[CENTER][color=red] Отказано[/color],закрыто[/CENTER][/FONT][/SIZE]<br><br>`+
            `[SIZE=5][FONT=georgia]Пример: [URL='https://yapx.ru/v/PnPvS'](Кликабельно)[/URL][/FONT][/SIZE]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
            prefix: UNACCEPT_PREFIX,
            status:false,
        },
        {
	  title: `Админ прав`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Проверив доказательства администратора, было принято решение, что наказание выдано верно.[/CENTER]<br><br>" +
		`[CENTER][color=red]Закрыто[/color].[/CENTER][/FONT][/SIZE]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: `Жалоба не по форме`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Жалоба составлена не по форме. Внимательно прочитайте правила составления жалобы, которые закреплены в этом разделе. <br><br>" +
		`[CENTER][color=red]Отказано[/color], закрыто.[/CENTER][/FONT][/SIZE]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
        {
	  title: `Передано ГА`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Ваша жалоба передана Главному Администратору —  @Joseph Stoyn  <br><br>"+
        `[color=orange]На рассмотрении[/color]. <br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: GA_PREFIX,
	  status: true,
	},
         {
	  title: `Наказание по ошибке`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]В следствие беседы с администратором, было выяснено, наказание было выдано по ошибке.<br>С администратором будет проведена профилактическая беседа.<br>Ваше наказание будет снято. <br><br>" +
		`[CENTER][color=green]Одобрено[/color], закрыто.[CENTER][FONT=georgia][SIZE=15]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: `Бан IP`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Смените wi-fi соединение или же ip адресс на тот с которого вы играли раньше, дело именно в нем.<br>Перезагрузите ваш роутер или используйте VPN. <br><br>" +
		`[CENTER][color=red]Закрыто[/color].[CENTER][FONT=georgia][SIZE=15]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
        title: `Опра в соц.сети`,
        content:` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
        "Пожалуйста внимательно прочитайте тему «[URL=`https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.193340/`]Правила подачи жалоб на администрацию[/URL][SIZE=5][B]»<br><br>"+
        "И обратите своё внимание, на данный пункт правил —[/B][/SIZE][/FONT][/SIZE][SIZE=4][FONT=georgia][QUOTE]3.6. Прикрепление доказательств обязательно.Примечание: загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/QUOTE][/FONT][QUOTE][/quote][/SIZE][QUOTE][/QUOTE]"+
        `[SIZE=4][FONT=georgia][color=red]Отказано[/color],[S] закрыто.[/S][/FONT][/SIZE]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: UNACCEPT_PREFIX,
        status: false,

    },
    {
        title: ` 48 ч `,
        content: `[CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
       " С момента выдачи наказание прошло более 48 часов, жалоба не подлежит рассмотрению.<br><br>"+
        `[color=red]Отказано[/color], закрыто.[/FONT][/SIZE][/CENTER]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: `Проинструктировать`,
        content:` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
        `[SIZE=4][FONT=georgia]Благодарим за ваше обращение!  Администратор будет проинструктирован.<br><br>`+
        `[color=green]Одобрено[/color],закрыто.[/FONT][/SIZE]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: ACCEPT_PREFIX,
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
            title: `Выговор`,
            content:` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
            `[CENTER] Администратор получит выговор.<br>`+
            `[CENTER] Благодарим за ваше обращение<br>`+
          `[CENTER][color=green]Одобрено[/color],закрыто<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
              prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: `Дублирование`,
        content:` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
        `Напоминаю, за дублирование тем ваш форумный аккаунт может быть заблокирован<br><br>`+
        `[color=red]Отказано[/color],закрыто<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: UNACCEPT_PREFIX,
        status:false,
    },
    {
      title: `ЖБ на техов`,
      content: ` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
       `[CENTER] Ошиблись разделом!<br>`+
       `[CENTER] Напишите свою жалобу в раздел — Жалобы на технических специалистов<br><br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: UNACCEPT_PREFIX,
        status: false,

    },
        {
            title: `Админ ПСЖ`,
            content:` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
            `[CENTER] Администратор был снят/ушел по собстевенному желанию.<br>`+
            `[CENTER] Ваше наказание будет снято.<br><br>`+
             `[CENTER][color=green] Рассмотрено[/color]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
            prefix: WATCHED_PREFIX,
            status:false,
        },
         {
            title: `Админ снят`,
           content:`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[center] Администратор будет снят с поста администратора. Просим прощение за неудобство. <br>` +
             `[color=rgb(0, 255, 0)]Рассмотрено[/color],[color=red]Закрыто.[/color] [/FONT][/SIZE][/CENTER]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: WATCHED_PREFIX,
        status:  false,
                                                                                         },
        {
            title: `Таймкоды`,
            content: `[center][size=5][font=georgia]${greeting},уважаемый ${user.mention} <br><br>`+
            "Ваше видео длится  более 3-х минут, укажите тайм-коды. <br><br>"+
            `[size=5][QUOTE]3.7. Доказательства должны быть в первоначальном виде.

<p>
[color=red]Примечание[/color]: видеодоказательства, которые были отредактированы и на которых присутствует посторонняя музыка, неадекватная речь, нецензурные слова или выражения, могут быть не рассмотрены в качестве доказательств. Если видеодоказательство длится более 3 минут, Вы должны указать тайм-коды нарушений.[/QUOTE][/size]
<p>
<br><br>`+
          `[color=red]Отказано[/color],Закрыто.[/font][/size][/center]  <br><br>`+
 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: UNACCEPT_PREFIX,
        status: false,
            },
          {
        title: ` Не обжалуется даун  `,
        content: `[CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
       " Данное наказание не подлежит обжалованию.<br><br>"+
        `[color=red]Отказано[/color], закрыто.[/FONT][/SIZE][/CENTER]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
         {
        title: ` Нахуй пошел с обж отказано `,
        content: `[CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
       " В Вашем обжаловании было отказано. Срок наказания не будет снижен.<br><br>"+
        `[color=red]Отказано[/color], закрыто.[/FONT][/SIZE][/CENTER]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
         {
        title: ` Повезло пидарас,одобрено `,
        content: `[CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
       " Ваше обжалование было рассмотрено и принято решение о сокращении вашего наказания до минимальных мер.<br><br>"+
        `[color=red]Закрыто.[/color], [/FONT][/SIZE][/CENTER]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: WATCHED_PREFIX,
        status:  false,
    },
        {
	  title: `Не вернешь ебланов будешь`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]У вас есть 24 часа чтобы прикрепить доказательство о передаче обманутому игроку деньги/имущество на которое вы обманули игрока.​[/CENTER]<br><br>" +
		`[CENTER][color=orange]На рассмотрении[/color].[/CENTER][/FONT][/SIZE]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: PIN_PREFIX,
	  status: true,
	},
         {
        title: `Соси хуй не по форме `,
        content: `[CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
       " Обжалование составлена не по форме. Внимательно прочитайте правила составления обжалований, которые закреплены в этом разделе.<br><br>"+
        `[color=red]Отказано[/color], закрыто.[/FONT][/SIZE][/CENTER]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: UNACCEPT_PREFIX,
        status: false,


    },




    ];

    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $(`body`).append(`<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`);

        // Добавление кнопок при загрузке страницы

       addButton(`На рассмотрение`, `pin`);
        addButton(`Повезло`, `accepted`);
        addButton(`Лох соси`, `unaccept`);
        addButton(`Соси хуй`, `closed`);
        addButton (`Спецу`, `specialAdmin`);
        addButton (`ГА`, `mainAdmin`);
         addButton(`Далбаеб`, `selectAnswer`);
        // Поиск информации о теме
        const threadData = getThreadData();

     $(`button#pin`).click(() => editThreadData(PIN_PREFIX, true));
        $(`button#accepted`).click(() => editThreadData(ACCEPT_PREFIX, false));
        $(`button#teamProject`).click(() => editThreadData(COMMAND_PREFIX, true));
        $(`button#unaccept`).click(() => editThreadData(UNACCEPT_PREFIX, false));
        $(`button#watched`).click(() => editThreadData(WATCHED_PREFIX, false));
$(`button#closed`).click(() => editThreadData(CLOSE_PREFIX, false));
         $(`button#specialAdmin`).click(() => editThreadData(SPECIAL_PREFIX, true));
$(`button#mainAdmin`).click(() => editThreadData(GA_PREFIX, true));
$(`button#techspec`).click(() => editThreadData( TECH_PREFIX , true));


        $(`button#selectAnswer`).click(() => {
            XF.alert(buttonsMarkup(buttons), null, `Выберите ответ:`);
            buttons.forEach((btn, id) => {
              if (id > 0 ) {
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