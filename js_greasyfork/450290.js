// ==UserScript==
// @name         скрипт для анапы
// @namespace    https://forum.blackrussia.online
// @version      1.21
// @description  Always remember who you are!
// @author       Kalashnikov
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @grant        none
// @license    MIT
// @collaborator Kalashnikov
// @icon https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @downloadURL https://update.greasyfork.org/scripts/450290/%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%B0%D0%BD%D0%B0%D0%BF%D1%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/450290/%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%B0%D0%BD%D0%B0%D0%BF%D1%8B.meta.js
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
                 '[CENTER] [COLOR=rgb(255, 0, 0)] Доброе время суток, уважаемый[/COLOR] {{ user.mention }} [/CENTER]<br>' +
                `[CENTER]      [/CENTER][/FONT][/SIZE]`,
        },
        {
 
            title: `Нету нарушение`,
            content:
           '[CENTER] [COLOR=rgb(255, 0, 0)] Доброе время суток, уважаемый[/COLOR] {{ user.mention }} [/CENTER]<br><br>' +
            `[CENTER][COLOR=#C0C0C0] Исходя из выше приложенных доказательств,нарушение со стороны администратора - не имеется.[/COLOR].[/CENTER]<br>`+
          '[Color=#FF0000][CENTER] Закрыто.[/CENTER][/color]',
            prefix: UNACCEPT_PREFIX,
            status: false,
	},
         {
	  title: `ЖБ от 3 лица`,
	  content:
		 '[CENTER] [COLOR=rgb(255, 0, 0)] Доброе время суток, уважаемый[/COLOR] {{ user.mention }} [/CENTER]<br><br>' +
		`[CENTER][COLOR=#C0C0C0] Жалоба создана от третьего лица.[/COLOR].[/CENTER]<br>`+
		`[CENTER][COLOR=#C0C0C0] Жалоба не подлежит рассмотрению.[/COLOR].[/CENTER]<br>`+
       '[Color=#FF0000][CENTER] Закрыто.[/CENTER][/color]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: `На рассмотрение`,
	  content:
		 '[CENTER] [COLOR=rgb(255, 0, 0)] Доброе время суток, уважаемый[/COLOR] {{ user.mention }} [/CENTER]<br><br>' +
		"[CENTER][COLOR=#C0C0C0] Ваша жалоба взята на рассмотрение. Ожидайте, пожалуйста, ответа от администрации и не нужно создавать копии этой темы.[/COLOR].[/CENTER]<br>" +
		`[CENTER]На рассмотрении.[/CENTER]`,
	  prefix: PIN_PREFIX,
	  status: true,
	},
         {
            title: `Недостаточно док-вы`,
            content: '[CENTER] [COLOR=rgb(255, 0, 0)] Доброе время суток, уважаемый[/COLOR] {{ user.mention }} [/CENTER]<br><br>' +
           `[CENTER][COLOR=#C0C0C0] Недостаточно доказательств, которые потверждают нарушение администратора.[/COLOR].[/CENTER]<br>`+
            '[Color=#FF0000][CENTER] Закрыто.[/CENTER][/color]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
  {
            title: `Нету док-вы`,
            content:  '[CENTER] [COLOR=rgb(255, 0, 0)] Доброе время суток, уважаемый[/COLOR] {{ user.mention }} [/CENTER]<br><br>' +
             `[CENTER][COLOR=#C0C0C0] Пожалуйста, прикрепите доказательства к жалобе, которые подтверждают нарушение администратора.[/COLOR].[/CENTER]<br>`+
            '[Color=#FF0000][CENTER] Закрыто.[/CENTER][/color]',
 prefix: UNACCEPT_PREFIX,
            status:false,    
        },
         {
            title: `Правила раздела`,
           content:  '[CENTER] [COLOR=rgb(255, 0, 0)] Доброе время суток, уважаемый[/COLOR] {{ user.mention }} [/CENTER]<br><br>' +
            `[CENTER][COLOR=#C0C0C0] Пожалуйста, убедительная просьба, ознакомится с назначением данного раздела в котором Вы создали тему, так как ваш запрос никоим образом не относится к предназначению данного раздела.[/COLOR].[/CENTER]<br>`+
		   '[Color=#FF0000][CENTER] Закрыто.[/CENTER][/color]',
            prefix: UNACCEPT_PREFIX,
            status:false,
        },
        {
            title: `Окно бана`,
           content:  '[CENTER] [COLOR=rgb(255, 0, 0)] Доброе время суток, уважаемый[/COLOR] {{ user.mention }} [/CENTER]<br><br>' +
            `[CENTER][COLOR=#C0C0C0] В вашей жалобе отсутствует скриншот блокировки вашего аккаунта. Зайдите в игру и сделайте скриншот блокировки вашего аккаунта.[/COLOR].[/CENTER]<br>`+
		   '[Color=#FF0000][CENTER] Закрыто.[/CENTER][/color]',
            prefix: UNACCEPT_PREFIX,
            status:false,
        },
	{
	  title: `Нет опры`,
	  content:
		 '[CENTER] [COLOR=rgb(255, 0, 0)] Доброе время суток, уважаемый[/COLOR] {{ user.mention }} [/CENTER]<br><br>' +
		`[CENTER][COLOR=#C0C0C0] Ваша жалоба была одобрена, наказание будет снято в ближайшие 24 часа.<br>С администратором будет проведена беседа.[/COLOR].[/CENTER]<br>`,
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: `Админ прав`,
	  content:
		 '[CENTER] [COLOR=rgb(255, 0, 0)] Доброе время суток, уважаемый[/COLOR] {{ user.mention }} [/CENTER]<br><br>' +
		`[CENTER][COLOR=#C0C0C0] Проверив доказательства администратора, было принято решение, что наказание выдано верно.[/COLOR].[/CENTER]<br>`+
		'[Color=#FF0000][CENTER] Закрыто.[/CENTER][/color]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: `Жалоба не по форме`,
	  content:
		 '[CENTER] [COLOR=rgb(255, 0, 0)] Доброе время суток, уважаемый[/COLOR] {{ user.mention }} [/CENTER]<br><br>' +
		"[CENTER][COLOR=#C0C0C0] Жалоба составлена не по форме. Внимательно прочитайте правила составления жалобы, которые закреплены в этом разделе. [/COLOR].[/CENTER]<br>" +
		'[Color=#FF0000][CENTER] Закрыто.[/CENTER][/color]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: `Передано ГА`,
	  content:
		 '[CENTER] [COLOR=rgb(255, 0, 0)] Доброе время суток, уважаемый[/COLOR] {{ user.mention }} [/CENTER]<br><br>' +
		`[CENTER][COLOR=#C0C0C0] Ваша жалоба передана Главной Администрации.[/COLOR].[/CENTER]<br>`+
        `На рассмотрении. `,
      prefix: GA_PREFIX,
	  status: true,
	},
    {
        title: `Наказание по ошибке`,
        content: 
         '[CENTER] [COLOR=rgb(255, 0, 0)] Доброе время суток, уважаемый[/COLOR] {{ user.mention }} [/CENTER]<br><br>' +
        `[CENTER][COLOR=#C0C0C0] В следствие беседы с администратором, было выяснено, наказание было выдано по ошибке. С администратором будет проведена профилактическая беседа. Наказание будет снято.[/COLOR].[/CENTER]<br>`+
        `[SIZE=5][FONT=georgia][COLOR=#00FF00] Одобрено, закрыто.[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix:ACCEPT_PREFIX,
        status:false,
    },
   {
title: 'Док-ва в соц. сетях',
      content:
         '[CENTER] [COLOR=rgb(255, 0, 0)] Доброе время суток, уважаемый[/COLOR] {{ user.mention }} [/CENTER]<br><br>' +
        "[CENTER][COLOR=#C0C0C0][SIZE=4][FONT=times new roman][I]Доказательства в социальных сетях и т.д. не принимаются. Загрузите доказательства на фото-видео хостинги YouTube,Imgur, Yapx и так далее.[/I][/FONT][/SIZE][/COLOR]<br>" +
        "[FONT=times new roman][COLOR=#C0C0C0][SIZE=4][I]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br>" +
        "[I][COLOR=#C0C0C0][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA RolePlay.[/SIZE][/FONT][/COLOR]<br>" +
        '[Color=#ff0000][CENTER] Закрыто.[/CENTER][/color]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
        title: ` 24 часа `,
        content:  '[CENTER] [COLOR=rgb(255, 0, 0)] Доброе время суток, уважаемый[/COLOR] {{ user.mention }} [/CENTER]<br><br>' +
       "[CENTER][COLOR=#C0C0C0] С момента выдачи наказание прошло более 24х часов, жалоба не подлежит рассмотрению.[/COLOR][/CENTER]<br><br>"+
      '[Color=#ff0000][CENTER] Закрыто.[/CENTER][/color]',
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title:`Special ADMIN`,
        content:  '[CENTER] [COLOR=rgb(255, 0, 0)] Доброе время суток, уважаемый[/COLOR] {{ user.mention }} [/CENTER]<br><br>' +
       "[CENTER][COLOR=#C0C0C0] Ваша жалоба передана - Специальному Администратору или же Заместителю. [/COLOR][/CENTER]<br><br>"+
        `На рассмотрение. [/FONT][/COLOR][/SIZE][/CENTER]<br><br>`,
        prefix: SPECIAL_PREFIX,
        status: true,
    },
    {
        title: `Проинструктировать`,
        content: '[CENTER] [COLOR=rgb(255, 0, 0)] Доброе время суток, уважаемый[/COLOR] {{ user.mention }} [/CENTER]<br><br>' +
        "[CENTER][COLOR=#C0C0C0]Благодарим за ваше обращение!  Администратор будет проинструктирован.[/COLOR][/CENTER]<br><br>"+
        `[SIZE=5][FONT=georgia][COLOR=#00FF00] Одобрено, закрыто.[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: ACCEPT_PREFIX,
        status: false,
    },
{ 
            title: `Выговор`,
            content: '[CENTER] [COLOR=rgb(255, 0, 0)] Доброе время суток, уважаемый[/COLOR] {{ user.mention }} [/CENTER]<br><br>' +
           "[CENTER][COLOR=#C0C0C0] Администратор получит выговор.[/COLOR][/CENTER]<br>"+
           "[CENTER][COLOR=#C0C0C0] Благодарим за ваше обращение[/COLOR][/CENTER]<br>"+
           `[SIZE=5][FONT=georgia][COLOR=#00FF00] Одобрено, закрыто.[/COLOR][/FONT][/SIZE][/CENTER]`,
              prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: `Techinal Specialist`,
        content:  '[CENTER] [COLOR=rgb(255, 0, 0)] Доброе время суток, уважаемый[/COLOR] {{ user.mention }} [/CENTER]<br><br>' +
        "[CENTER][COLOR=#C0C0C0] Ваша жалоба была передана техническому специалисту сервера.[/COLOR][/CENTER]<br>"+
       "[CENTER][COLOR=#C0C0C0] Ожидайте ответа[/COLOR][/CENTER]<br>"+
        `На рассмотрение`,
        prefix: TECH_PREFIX,
        status:true,
    },
    {
        title: `Дублирование`,
        content: '[CENTER] [COLOR=rgb(255, 0, 0)] Доброе время суток, уважаемый[/COLOR] {{ user.mention }} [/CENTER]<br><br>' +
        `Напоминаю, за дублирование тем ваш форумный аккаунт может быть заблокирован<br><br>`+
        `Отказано, закрыто`,
        prefix: UNACCEPT_PREFIX,
        status:false,
    },
    {  
      title: `ЖБ на техов`,
      content:  '[CENTER] [COLOR=rgb(255, 0, 0)] Доброе время суток, уважаемый[/COLOR] {{ user.mention }} [/CENTER]<br><br>' +
       `[CENTER] Ошиблись разделом!<br>`+
         `[CENTER] Напишите свою жалобу в раздел — [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2.490/']Жалобы на технических специалистов.(кликабельно)[/URL].<br><br>`+
 `[CENTER] Отказано, закрыто.`,
        prefix: UNACCEPT_PREFIX,
        status: false,
 
    },
 {
            title: `Админ ПСЖ`,
            content: '[CENTER] [COLOR=rgb(255, 0, 0)] Доброе время суток, уважаемый[/COLOR] {{ user.mention }} [/CENTER]<br><br>' +
            `[CENTER] Администратор был снят/ушел по собстевенному желанию.<br>`+
            `[CENTER] Ваше наказание будет снято.<br><br>`+
             `[CENTER] Рассмотрено`,
            prefix: WATCHED_PREFIX,
            status:false,
        },
 {
            title: `FastConnect`,
            content:  '[CENTER] [COLOR=rgb(255, 0, 0)] Доброе время суток, уважаемый[/COLOR] {{ user.mention }} [/CENTER]<br><br>' +
            `[CENTER] Администратор прав.<br>`+
            `[CENTER]Вы должны предоставить какие-то зацепки, которые подтверждают ваши слова.<br>`+
            `[CENTER] Отказано, закрыто.`,
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
        addButton(`КП`, `teamProject`);
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
$('.button--icon--reply').before(
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
.join('')}</div>`;
}

function pasteContent(id, data = {}, send = false) {
const template = Handlebars.compile(buttons[id].content);
if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

$('span.fr-placeholder').empty();
$('div.fr-element.fr-view p').append(template(data));
$('a.overlay-titleCloser').trigger('click');

if (send == true) {
editThreadData(buttons[id].prefix, buttons[id].status);
$('.button--icon.button--icon--reply.rippleButton').trigger('click');
}
}

function getThreadData() {
const authorID = $('a.username')[0].attributes['data-user-id'].nodeValue;
const authorName = $('a.username').html();
const hours = new Date().getHours();
return {
user: {
id: authorID,
name: authorName,
mention: `[USER=${authorID}]${authorName}[/USER]`,
},
greeting: () =>
4 < hours && hours <= 11 ?
'Доброе утро' :
11 < hours && hours <= 15 ?
'Добрый день' :
15 < hours && hours <= 21 ?
'Добрый вечер' :
'Доброй ночи',
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
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();