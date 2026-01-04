// ==UserScript==
// @name         Black Russia Script Заместителя ГА
// @namespace    https://forum.blackrussia.online
// @version      0.1
// @description  По вопросам и недочетам скрипта обращаться - https://vk.com/derzett
// @author       Yuki Kalashnikov [ЗГА 21]
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @icon         https://icons.iconarchive.com/icons/aha-soft/iron-man/48/Ironman-Mask-3-Old-icon.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/452534/Black%20Russia%20Script%20%D0%97%D0%B0%D0%BC%D0%B5%D1%81%D1%82%D0%B8%D1%82%D0%B5%D0%BB%D1%8F%20%D0%93%D0%90.user.js
// @updateURL https://update.greasyfork.org/scripts/452534/Black%20Russia%20Script%20%D0%97%D0%B0%D0%BC%D0%B5%D1%81%D1%82%D0%B8%D1%82%D0%B5%D0%BB%D1%8F%20%D0%93%D0%90.meta.js
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

            title: `Нету нарушение`,
            content:`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER] Исходя из выше приложенных доказательств, нарушений со стороны администратора - не имеется!<br>`+
            `[CENTER] Отказано,закрыто. [/CENTER][/FONT][/SIZE]`,
            prefix: UNACCEPT_PREFIX,
            status: false,
	},
         {
	  title: `ЖБ от 3 лица`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Жалоба создана от третьего лица.[/CENTER]<br><br>" +
		`[CENTER]Жалоба не подлежит рассмотрению.<br><br>`+
        `Закрыто. [/CENTER][/FONT][/SIZE]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: `Отправить на рассмотрение`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Ваша жалоба взята на рассмотрение. Ожидайте, пожалуйста, ответа от администрации и не нужно создавать копии этой темы.[/CENTER]<br><br>" +
		`[CENTER]На рассмотрении.[/CENTER][/FONT][/SIZE]`,
	  prefix: PIN_PREFIX,
	  status: true,
	},
         {
            title: `Недостаточно док-вы`,
            content:`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER] Недостаточно доказательств, которые подтверждают нарушение администратора.<br>`+
            ` [CENTER] Закрыто.[/CENTER][/FONT][/SIZE]`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
  {
            title: `Нету док-вы`,
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER] Пожалуйста, прикрепите доказательства к жалобе, которые подтверждают нарушение администратора.<br>`+
            `[CENTER] Закрыто.`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
     {
            title: `Не работает док-ва`,
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER] В вашей жалобе не работают доказательства. Пересоздайте тему с рабочими доказательствами в этот же раздел.<br>`+
            `[CENTER] Закрыто.`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
         {
            title: `Ошиблись разделом`,
            content:`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER]Пожалуйста, убедительная просьба, ознакомится с назначением данного раздела в котором Вы создали тему, так как ваш запрос никоим образом не относится к предназначению данного раздела.[/CENTER]` +
		    `[CENTER]Отказано, закрыто.[/CENTER][/FONT]`,
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Окно бана`,
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER]Зайдите в игру и сделайте скрин окна с баном после чего, заново напишите жалобу.<br>` +
            `[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]<br><br>`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
{
            title: `Взлом`,
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER]Вы подвергли свой аккаунт мошенникам. На форуме стоит защита, где указано "Не переходите по незнакомым ссылкам и не вводите туда данные от аккаунта. Если Вы ввели данные, у Вас есть время чтобы восстановить аккаунт через бота Вконтакте, или через Вашу почту..<br>` +
            `[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]<br><br>`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
	{
	  title: `Одобрено, беседа`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Ваша жалоба была одобрена и будет проведена беседа с администратором.<br>Ваше наказание будет снято.[/CENTER]" ,
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
 {
	  title: `Беседа`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Ваша жалоба была одобрена, с администратором будет проведена беседа.<br>[/CENTER]" ,
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
{
	  title: `Неверный вердикт`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Ваша жалоба была одобрена, с администратором будет проведена беседа. Ваша жалоба будет пересмотрена. <br>[/CENTER]" ,
      prefix: ACCEPT_PREFIX,
	  status: false,
	},
{
	  title: `Неверный вердикт/Наказание`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Ваша жалоба была одобрена, администратор получит наказание. Ваша жалоба будет пересмотрена. <br>[/CENTER]" ,
      prefix: ACCEPT_PREFIX,
	  status: false,
	},
  {
	  title: `Строгая Беседа`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Ваша жалоба была одобрена, с администратором будет проведена строгая беседа.<br>[/CENTER]" ,
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
 {
	  title: `Одобрено, наказание`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Ваша жалоба была одобрена, администратор получит соответствующее наказание.<br>Ваше наказание будет снято.[/CENTER]" ,
      prefix: ACCEPT_PREFIX,
	  status: false,
	},

	{
	  title: `Админ прав`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Проверив доказательства администратора, было принято решение, что наказание выдано верно.[/CENTER]<br><br>" +
		`[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: `Жалоба не по форме`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Жалоба составлена не по форме. Внимательно прочитайте правила составления жалобы, которые закреплены в этом разделе. <br><br>" +
		`[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]`,
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
 {
	  title: `Не указан никнейм администратора`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Жалоба составлена не по форме. Внимательно прочитайте правила составления жалобы, которые закреплены в этом разделе. Не указан Nickname администратора.<br><br>" +
		`[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
 {
	  title: `Не указан никнейм игрока`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Жалоба составлена не по форме. Внимательно прочитайте правила составления жалобы, которые закреплены в этом разделе. Не указан Ваш Nickname.<br><br>" +
		`[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
 {
	  title: `Отсутствует /time`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]В вашей жалобе отсутствует /time на скриншоте о выдаче наказания.<br><br>" +
		`[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]`,
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
 {
	  title: `Нужна ссылка на жалобу`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Нужна ссылка, пожалуйста предоставьте ссылку на данную жалобу.<br><br>" +
		`[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
 {
	  title: `Жалоба не по правилам`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Если Вы хотите, чтобы Вашу жалобу рассмотрели, напишите ее соответствующее с правилам, закрепленными в данном разделе..<br><br>" +
		`[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
 {
	  title: `Нужен /myreports`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Нужен /myreports. Без данной команды жалоба не будет рассмотрена.<br><br>" +
		`[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: `В раздел обжалование`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Обратитесь в раздел обжалование наказаний.<br><br>" +
		`[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: `Передано ГА`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Ваша жалоба передана [COLOR=red] Главному администратору.<br><br>"+
        `[COLOR=orange] На рассмотрении.`,

     prefix: GA_PREFIX,
	 status: true,
	},
  {
	  title: `Передано ЗГА`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Ваша жалоба передана [COLOR=red] Зам. главного администратора.<br><br>"+
        `[COLOR=orange] На рассмотрении.`,

     prefix: PIN_PREFIX,
	 status: true,
	},
{
	  title: `Передано КП`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Ваша жалоба передана [COLOR=Yellow] Команде проекта.<br><br>"+
        `[COLOR=orange] На рассмотрении.`,

     prefix: COMMAND_PREFIX,
	 status: true,
	},
  {
        title: `Наказание по ошибке`,
        content: ` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
        "В следствие беседы с администратором, было выяснено, наказание было выдано по ошибке. С администратором будет проведена профилактическая беседа. Наказание будет снято.[/FONT][/SIZE] <br><br>"+
        `[COLOR=rgb(65, 168, 95)][SIZE=5][FONT=georgia]Одобрено,[/FONT][/SIZE][/COLOR][COLOR=rgb(209, 72, 65)][SIZE=5][FONT=georgia][S]закрыто.[/S][/FONT][/SIZE][/COLOR][/CENTER]`,
        prefix: ACCEPT_PREFIX,
        status:false,
    },
    {
        title: `Опра в соц. сети`,
        content:` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
        "Пожалуйста внимательно прочитайте тему «Правила подачи жалоб на администрацию» <br><br>"+
        "И обратите своё внимание, на данный пункт правил — [/FONT][/SIZE][SIZE=4][FONT=georgia][QUOTE] [COLOR=red] 3.6.[COLOR=red] [COLOR=white] Прикрепление доказательств обязательно.Примечание: загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/QUOTE][/FONT][QUOTE][/quote][/SIZE][QUOTE][/QUOTE]"+
        `[SIZE=4][FONT=georgia]Отказано,[S] закрыто.[/S][/FONT][/SIZE]`,
        prefix: UNACCEPT_PREFIX,
        status: false,

    },
    {
        title: ` Срок подачи жалобы `,
        content: `[CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
       " С момента выдачи наказание прошло более 48-ми часов, жалоба не подлежит рассмотрению.<br><br>"+
        `Закрыто.[/FONT][/SIZE][/CENTER]<br><br>`,
        prefix: CLOSE_PREFIX,
        status: false,
    },
    {
        title:`Спец. админу`,
        content: `[CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
        "Ваша жалоба передана - [COLOR=red] Специальному администратору[COLOR=red].[/FONT] [COLOR=rgb(251, 160, 38)][FONT=georgia]<br>"+
        `На рассмотрение. [/FONT][/COLOR][/SIZE][/CENTER]<br><br>`,
        prefix: SPECIAL_PREFIX,
        status: true,
    },
  {
        title: `Проинструктировать`,
        content:` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
        `[SIZE=4][FONT=georgia]Благодарим за ваше обращение! Администратор будет проинструктирован.<br><br>`+
        `Одобрено,закрыто.[/FONT][/SIZE]`,
        prefix: ACCEPT_PREFIX,
        status: false,
    },
{ 
            title: `Наказание`,
            content:` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
            `[CENTER] Администратор получит наказание.<br>`+
            `[CENTER] Благодарим за ваше обращение<br>`+
          `[CENTER] Одобрено,закрыто.<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=red] Приятной игры и времяпровождение  на сервере CHILLI (21)[/COLOR][/FONT][/SIZE][/CENTER]`,
              prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: `Techinal Specialist`,
        content: `[CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
        `Ваша жалоба была передана техническому специалисту сервера.<br><br>`+
        ` Ожидайте ответа<br><br>`+
        ` На рассмотрение.`,
        prefix: TECH_PREFIX,
        status:true,
    },
    {
        title: `Дублирование`,
        content:` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
        `Напоминаю, за дублирование тем ваш форумный аккаунт может быть заблокирован. Ваша жалоба не подлежит рассмотрению.<br><br>`+
        `Отказано,закрыто.`,
        prefix: UNACCEPT_PREFIX,
        status:false,
    },
  {
        title: `Ответ уже был дан`,
        content:` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
        `Ответ на Вашу жалобу был дан в прошлой вашей теме, прочитайте вердикт более внимательнее.<br><br>`+
        `Закрыто.`,
        prefix: CLOSE_PREFIX,
        status:false,
    },
    {  
      title: `ЖБ на техов`,
      content: ` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
       `[CENTER] Ошиблись разделом!<br>`+
         `[CENTER] Напишите свою жалобу в раздел — [URL='https://forum.blackrussia.online/index.php?forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9621-chilli.1202/']Жалобы на технических специалистов.(кликабельно)[/URL].<br><br>`+
 `[CENTER]Закрыто.`,
        prefix: CLOSE_PREFIX,
        status: false,

    },
     {
            title: `В тех раздел`,
            content:  ` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
            `[CENTER] Пожалуйста составьте свою жалобу в "Техническом Разделе сервера"[URL='https://forum.blackrussia.online/index.php?forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-chilli.1007/'][SIZE=4][FONT=georgia](кликабельно)[/URL]<br><br>`+
            `[CENTER]Закрыто.`,
             prefix: CLOSE_PREFIX,
        status: false,
     },
 {
            title: `Админ ПСЖ`,
            content:` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
            `[CENTER] Администратор был снят по собстевенному желанию.<br>`+
            `[CENTER] Ваше наказание будет снято.<br><br>`+
             `[CENTER] Рассмотрено.`,
            prefix: WATCHED_PREFIX,
            status:false,
        },
     {
            title: `Админ снят`,
            content:` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
            `[CENTER] Администратор был снят с своего поста.<br>`+
            `[CENTER] Ваше наказание будет снято.<br><br>`+
             `[CENTER] Рассмотрено.`,
            prefix: WATCHED_PREFIX,
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
        addButton(`Команде проекта`, `teamProject`);
        addButton(`Рассмотрено`, `watched`);
        addButton(`Закрыто`, `closed`);
        addButton (`Спецу`, `specialAdmin`);
        addButton (`ГА`, `mainAdmin`);
         addButton(`Тех.Спец`, `techspec`);
         addButton(`Ответы`, `selectAnswer`);
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