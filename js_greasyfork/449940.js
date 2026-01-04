// ==UserScript==
// @name         SAMARA ADMINS | Форумный скрипт для ГА/ЗГА/Кураторов
// @namespace    https://forum.blackrussia.online
// @version      3.0
// @description  Для настоящих флудеров форума, кстати Патрик Джексон 0
// @author       Yaroslav Raskalov
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @icon         https://sun9-north.userapi.com/sun9-77/s/v1/ig2/Lohf-LtTWGHW-LEWy6MADHf1UI9D5EPksuxlLaBz3TVGYI1autKvZjrynnUghlEukgBuAWQDyK8etU5tIwf_B4Ll.jpg?size=1075x1080&quality=95&type=album
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449940/SAMARA%20ADMINS%20%7C%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%BD%D1%8B%D0%B9%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%90%D0%97%D0%93%D0%90%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/449940/SAMARA%20ADMINS%20%7C%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%BD%D1%8B%D0%B9%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%90%D0%97%D0%93%D0%90%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2.meta.js
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
            title: `Приветствие`,
            content:
                `[SIZE=4][FONT=georgia][CENTER] ${greeting}, уважаемый ${user.mention}![/CENTER]<br>` +
                `[CENTER]      [/CENTER][/FONT][/SIZE]`,
        },
        {

            title: `Нарушений от администратора на док-вах нет`,
            content:`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER] Проверив выше предоставленные доказательства, могу сказать, что нарушений со стороны администратора не наблюдается!<br>`+
            `[CENTER] Отказано,закрыто. [/CENTER][/FONT][/SIZE]`,
            prefix: UNACCEPT_PREFIX,
            status: false,
	},
         {
	  title: `Жалоба от 3-го лица`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Жалоба создана от третьего лица.[/CENTER]<br><br>" +
        `Отказано,закрыто! [/CENTER][/FONT][/SIZE]`,
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: `На рассмотрении - запросить опру у администратора`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Ожидайте, пожалуйста, ответа от курации администрации и не нужно создавать копии этой темы.[/CENTER]<br><br>" +
		`[CENTER]На рассмотрении.[/CENTER][/FONT][/SIZE]`,
	  prefix: PIN_PREFIX,
	  status: true,
	},
         {
            title: `Недостаточно доказательств нарушения`,
            content:`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER] Недостаточно доказательств, которые потверждают нарушение администратора.<br>`+
            ` [CENTER] Отказано,закрыто.[/CENTER][/FONT][/SIZE]`,
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
  {
            title: `Нет доказательств нарушения`,
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER] Пожалуйста, прикрепите доказательства к жалобе, которые подтверждают нарушение администратора.<br>`+
            `[CENTER] Закрыто`,
 prefix: UNACCEPT_PREFIX,
            status:false,
        },
         {
            title: `Ознакомить с правилами`,
            content:`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER]Пожалуйста, убедительная просьба, ознакомится с назначением данного раздела в котором Вы создали тему, так как ваш запрос никоим образом не относится к предназначению данного раздела.[/CENTER]`+
		    `[CENTER]Отказано, закрыто.[/CENTER][/FONT]`,
            prefix: UNACCEPT_PREFIX,
            status:false,
        },
        {
            title: `Скриншот окна бана`,
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER]Зайдите в игру и сделайте скриншот окна с баном, после чего заново напишите жалобу.<br>`+
            `[CENTER] Отказано, закрыто[/CENTER][/FONT][/SIZE]<br><br>`+
            `[SIZE=5][FONT=georgia]Пример: [URL='https://yapx.ru/v/PnPvS'](Кликабельно)[/URL][/FONT][/SIZE]`,
            prefix: UNACCEPT_PREFIX,
            status:false,
        },
	{
	  title: `Администратор получит наказание`,
            content:` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
            `[CENTER] Администратор получит строгое наказание.<br>`+
            `[CENTER] Благодарим за ваше обращение<br>`+
          `[CENTER] Одобрено,закрыто<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере SAMARA[28] [/COLOR][/FONT][/SIZE][/CENTER]`,
              prefix: ACCEPT_PREFIX,
        status: false,
	},
	{
	  title: `Администратор получит строгое наказание`,
            content:` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
            `[CENTER] Администратор получит строгое наказание.<br>`+
            `[CENTER] Благодарим за ваше обращение<br>`+
          `[CENTER] Одобрено,закрыто<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере SAMARA[28] [/COLOR][/FONT][/SIZE][/CENTER]`,
              prefix: ACCEPT_PREFIX,
        status: false,
	},
	{
	  title: `Наказание выдано верно`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Запросив, а после проверив доказательства администратора, было принято решение, что наказание выдано верно.[/CENTER]<br><br>" +
		`[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: `Жалоба составлена не по форме`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Жалоба составлена не по форме. Внимательно прочитайте правила составления жалобы, которые закреплены в этом разделе. <br><br>" +
		`[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: `Жалоба передана Специальному Администратору`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Ваша жалоба передана Специальному администратору @Sander_Kligan/<br><br>",
	  prefix: SPECIAL_PREFIX,
	  status: false,
	},
	{
	  title: `Жалоба передана Главному Администратору`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Ваша жалоба передана Главному Администратору —  @James Bruno  <br><br>"+
        `На рассмотрении. `,
	  prefix: GA_PREFIX,
	  status: true,
	},
	{
	  title: `Наказание обжалованию не подлежит`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Данное наказание не подлежит обжалованию.<br><br>" +
		`[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: `Обжалование - Наказание полностью снято`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Ваше обжалование одобрено и ваше наказание будет полностью снято.<br><br>" +
		`[CENTER]Закрыто.[/CENTER][/FONT][/SIZE`,
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: `Обжалование - Наказание снижено до минималки`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Ваше обжалование было рассмотрено и принято решение о сокращении вашего наказания до минимальных мер.<br><br>" +
		`[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]`,
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: `Обжалование - Уже минимальное наказание`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Вам и так выдано минимальное наказание за нарушение.<br><br>" +
		`[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: `Обжалование составлено не по форме`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]x[/CENTER]<br><br>` +
		"[CENTER]Обжалование составлено не по форме. Внимательно прочитайте правила составления обжалования, которые закреплены в этом разделе.<br><br>" +
		`[CENTER]Закрыто.[/CENTER][/FONT][/SIZE`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: `Перенаправить в жалобы на администрацию`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Вам стоит обратиться в раздел жалоб на администрацию.<br><br>" +
		`[CENTER]Отказано.[/CENTER][/FONT][/SIZE]`,
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
        title: `Наказание выдано по ошибке`,
        content: ` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
        "Наказание было выдано по ошибке. С администратором будет проведена профилактическая беседа. Наказание будет снято.[/FONT][/SIZE] <br><br>"+
        `[COLOR=rgb(65, 168, 95)][SIZE=5][FONT=georgia]Одобрено,[/FONT][/SIZE][/COLOR][COLOR=rgb(209, 72, 65)][SIZE=5][FONT=georgia][S]закрыто.[/S][/FONT][/SIZE][/COLOR][/CENTER]`,
        prefix:ACCEPT_PREFIX,
        status:false,
    },
    {
        title: `Док-ва в соц.сетях`,
        content:` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
        "Пожалуйста внимательно прочитайте тему «[URL=`https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-администрацию.2639611/`]Правила подачи жалоб на администрацию[/URL][SIZE=5][B]»<br><br>"+
        "И обратите своё внимание, на данный пункт правил —[/B][/SIZE][/FONT][/SIZE][SIZE=4][FONT=georgia][QUOTE]3.6. Прикрепление доказательств обязательно.Примечание: загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/QUOTE][/FONT][QUOTE][/quote][/SIZE][QUOTE][/QUOTE]"+
        `[SIZE=4][FONT=georgia]Отказано,[S] закрыто.[/S][/FONT][/SIZE]`,
        prefix: UNACCEPT_PREFIX,
        status: false,

    },
    {
        title: `Прошло более 48-и часов`,
        content: `[CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
       "С момента выдачи наказание прошло более 48-и часов, жалоба не подлежит рассмотрению.<br><br>"+
        `Отказано, закрыто.[/FONT][/SIZE][/CENTER]<br><br>`,
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title:`Передано Специальному Администратору`,
        content: `[CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
        "Ваша жалоба передана - Специальному Администратору. @Sander_Kligan [/FONT] [COLOR=rgb(251, 160, 38)][FONT=georgia]<br>"+
        `На рассмотрение. Ожидайте ответа, это может занять больше 3-х дней. [/FONT][/COLOR][/SIZE][/CENTER]<br><br>`,
        prefix: SPECIAL_PREFIX,
        status: true,
    },
    {
        title:`Передано команде проекта`,
        content: `[CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
        "Ваша жалоба передана - Команде Проекта. [/FONT] [COLOR=rgb(251, 160, 38)][FONT=georgia]<br>"+
        `На рассмотрение. Ожидайте ответа, это может занять больше 3-х дней. [/FONT][/COLOR][/SIZE][/CENTER]<br><br>`,
        prefix: SPECIAL_PREFIX,
        status: true,
    },
    {
        title:`Обжалование - Наказание сокращено на половину`,
        content: ` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
        "[CENTER]Ваше обжалование было рассмотрено и принято решение о сокращении вашего наказания на половину.<br><br>" +
        `[SIZE=4][FONT=georgia][CENTER] Закрыто`,
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: `Проинструктировать`,
        content:` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
        `[SIZE=4][FONT=georgia]Благодарим за ваше обращение!  Администратор будет проинструктирован.<br><br>`+
        `Одобрено,закрыто.[/FONT][/SIZE]`,
        prefix: ACCEPT_PREFIX,
        status: false,
    },
{
            title: `Администратор получит выговор`,
            content:` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
            `[CENTER] Администратор получит выговор.<br>`+
            `[CENTER] Благодарим за ваше обращение<br>`+
          `[CENTER] Одобрено,закрыто<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере SAMARA[28] [/COLOR][/FONT][/SIZE][/CENTER]`,
              prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: `Передано Тех.Специалисту`,
        content: `[CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
        `Ваша жалоба была передана техническому специалисту сервера<br><br>`+
        ` Ожидайте ответа<br><br>`+
        ` На рассмотрение`,
        prefix: TECH_PREFIX,
        status:true,
    },
    {
        title: `Дублирование темы`,
        content:` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
        `Ответ был дан в предыдущей теме.<br><br>`+
        `Отказано,закрыто`,
        prefix: UNACCEPT_PREFIX,
        status:false,
    },
    {
      title: `Перенапраить в жалобы на Тех.Специалистов`,
      content: ` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
       `[CENTER] Ошиблись разделом!<br>`+
         `[CENTER] Напишите свою жалобу в раздел — [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2.490/']Жалобы на технических специалистов.(кликабельно)[/URL].<br><br>`+
 `[CENTER] Отказано,закрыто!`,
        prefix: UNACCEPT_PREFIX,
        status: false,

    },
 {
            title: `Администратор снят/псж`,
            content:` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
            `[CENTER] Администратор был снят/ушел по собстевенному желанию.<br>`+
            `[CENTER] Ваше наказание будет снято.<br><br>`+
             `[CENTER] Рассмотрено`,
            prefix: WATCHED_PREFIX,
            status:false,
},
	{
	  title: `Жалоба передана ЗГА ГОСС & ОПГ`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Ваша жалоба передана - ЗГА ГОСС & ОПГ. @Aleksandr_Dremin[/CENTER]<br><br>" +
		`[CENTER]На рассмотрении.[/CENTER][/FONT][/SIZE]`,
	  prefix: PIN_PREFIX,
	  status: true,
},

    ];

    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $(`body`).append(`<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`);

        // Добавление кнопок при загрузке страницы
        addButton(`На рассмотрение`, `pin`);
        addButton(`Одобрено`, `accepted`);
        addButton(`Отказано`, `unaccept`);
        addButton(`Команде Проекта`, `teamProject`);
        addButton(`Рассмотрено`, `watched`);
        addButton(`Закрыто`, `closed`);
        addButton (`Специальному Администратору`, `specialAdmin`);
        addButton (`Главному Администратору`, `mainAdmin`);
         addButton(`Тех.Специалисту`, `techspec`);
         addButton(`Ответы`, `selectAnswer`);
         addButton(`✨Script by Yaroslav Raskalov✨`, `owner`);
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
            XF.alert(buttonsMarkup(buttons), null, `✨Script by Yaroslav Raskalov✨`);
            buttons.forEach((btn, id) => {
                if (id > 0) {
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