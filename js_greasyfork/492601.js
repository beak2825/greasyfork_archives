// ==UserScript==
// @name         52
// @namespace    https://forum.blackrussia.online/
// @version      2.41
// @description  Скрипт для га орёл
// @author       Pavel_Moroznik <3
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @icon https://freepngimg.com/thumb/eagle/20-eagle-black-siluet-png-image-download-thumb.png
// @downloadURL https://update.greasyfork.org/scripts/492601/52.user.js
// @updateURL https://update.greasyfork.org/scripts/492601/52.meta.js
// ==/UserScript==

(function () {
'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const GA_PREFIX = 12;
const CLOSE_PREFIX = 7;
const buttons = [
    {
	  title: '------------------------------------------------------------  Обжалования  ------------------------------------------------------------',
	},
	{
	  title: 'Приветствие',
	  content:
		'[SIZE=3][FONT=georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' + '[CENTER]                       [/CENTER][/FONT][/SIZE]',
	},
    {
	  title: 'Отправить на рассмотрение',
	  content:
		'[SIZE=3][FONT=georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Ваше обжалование взято на рассмотрение. Ожидайте, пожалуйста, ответа от администрации и не нужно создавать копии этой темы.[/CENTER]<br><br>" +
		'[CENTER][Color=Orange]Ожидайте ответа.[/CENTER][/FONT][/SIZE][/color]',
	  prefix: PIN_PREFIX,
	  status: true,
	},
    {
	  title: 'Обжалование ник',
	  content:
		'[SIZE=3][FONT=georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Ваш аккаунт будет разблокирован ровно на 24 часа, если в течении 24 часа Вы не смените свой никнейм, то Вы будете заново заблокированы. Доказательства предоставлять сюда.<br><br>" +
		'[CENTER][Color=Orange]Ожидаю вашего ответа.[/CENTER][/FONT][/SIZE][/color]',
	  prefix: PIN_PREFIX,
	  status: true,
	},
	{
	  title: 'Запрос ссылки вк',
	  content:
		'[SIZE=3][FONT=georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Прикрепите ссылку на Ваш Вконтакте.<br><br>" +
		'[CENTER][Color=Orange]Ожидаю вашего ответа.[/CENTER][/FONT][/SIZE][/color]',
	  prefix: PIN_PREFIX,
	  status: true,
	},
 {
	  title: 'Не осознали вину',
	  content:
		'[SIZE=3][FONT=georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]В обжалование отказано, в данный момент мы не уверены что Вы осознали свой поступок.<br><br>" +
		'[CENTER] Закрыто.  С Уважением [color=red]Главный Администратор[/CENTER][/FONT][/SIZE][/color]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	 {
	  title: 'Не готовы пойти на встречу',
	  content:
		'[SIZE=5][FONT=georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]В обжалование отказано, в данный момент мы не готовы пойти на встречу и амнистировать ваше наказание.<br><br>" +
		'[CENTER] Закрыто.  С Уважением [color=red]Главный Администратор [/CENTER][/FONT][/SIZE][/color]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Обжалованию не подлежит',
	  content:
        '[SIZE=3][FONT=georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Мы рады что Вы поняли свой поступок и хотите обжаловать своё наказание, но данное наказание не подлежит обжалованию.<br><br>" +
		'[CENTER] Закрыто.  С Уважением [color=red]Главный Администратор[/CENTER][/FONT][/SIZE][/color]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Одобрить обжалование',
	  content:
		'[SIZE=3][FONT=georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Ваше обжалование одобрено и Ваше наказание будет полностью снято/заменено.<br><br>" +
		'[CENTER] Закрыто.  С Уважением [color=red]Главный Администратор[/CENTER][/FONT][/SIZE][/color]<br><br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Отказать обжалование',
	  content:
		'[SIZE=3][FONT=georgia][CENTER] {{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]В обжаловании отказано.<br><br>" +
		'[CENTER] Закрыто.  С Уважением [color=red]Главный Администратор[/CENTER][/FONT][/SIZE][/color]',
	   prefix: CLOSE_PREFIX,
	  status: false,
	},
     {
	  title: 'Отстутствуют доказательства',
	  content:
		'[SIZE=3][FONT=georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
	"[CENTER]В Вашем обжаловании отсутствуют доказательства.<br><br>" +
		'[CENTER] Закрыто.  С Уважением [color=red]Главный Администратор[/CENTER][/FONT][/SIZE][/color]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
     {
	  title: 'Отстутствует скрин окна бана',
	  content:
		'[SIZE=5][FONT=georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Зайдите в игру и сделайте скриншот окна блокировки и приложите в следующей теме. Пример -  [URL='https://imgur.com/mdaW2tO']Кликабельно.[/URL] <br><br>" +
		'[CENTER] Закрыто.  С Уважением [color=red]Главный Администратор[/CENTER][/FONT][/SIZE][/color]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Дублирование тем',
	  content:
		'[SIZE=3][FONT=georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Если Вы дальше будете дублировать темы в данном разделе, то Ваш форумный аккаунт будет заблокирован.<br><br>" +
		'[CENTER] Закрыто.  С Уважением [color=red]Главный Администратор[/CENTER][/FONT][/SIZE][/color]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Обжалование не по форме',
	  content:
		'[SIZE=3][FONT=georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Обжалование составлено не по форме. Внимательно прочитайте правила составления обжалования по этой ссылке - [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.3429398/']Кликабельно.[/URL].<br><br>" +
		'[CENTER] Закрыто.  С Уважением [color=red]Главный Администратор[/CENTER][/FONT][/SIZE][/color]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Направить в раздел жб на адм',
	  content:
		'[SIZE=3][FONT=georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Если Вы не согласны с выданным наказанием, то Вам нужно обраться в раздел жалоб на администрацию - [URL='https://forum.blackrussia.online/forums/Жалобы-на-администрацию.2893/']Кликабельно.[/URL]<br><br>" +
		'[CENTER] Закрыто.  С Уважением [color=red]Главный Администратор[/CENTER][/FONT][/color][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
        title: 'Направить в раздел жб на тех',
	  content:
		'[SIZE=3][FONT=georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Внимательно ознакомившись с Вашим обжалованием, было решено, что вам нужно обратиться в раздел жалоб на технических специалистов - [URL='https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-orel.2875/']Кликабельно.[/URL] <br><br>" +
		'[CENTER] Закрыто.  С Уважением [color=red]Главный Администратор[/CENTER][/FONT][/SIZE][/color]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Доказательство в соц сети',
	  content:
		'[SIZE=3][FONT=georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur). <br><br>" +
		'[CENTER] Закрыто.  С Уважением [color=red] Заместитель Главного Администратора.[/CENTER][/FONT][/SIZE][/color]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'NRP обман 24 часа',
	  content:
		'[SIZE=3][FONT=georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Аккаунт будет разблокирован. если в течении 24-ех часов ущерб не будет возмещён владельцу согласно вашей договоренности акканут будет заблокирован навсегда.[/CENTER]<br><br>" +
		'[CENTER]Вы должны прислать видео доказательство возврата имущества в данную тему.[/CENTER][/FONT][/SIZE]',
	  prefix: PIN_PREFIX,
	  status: true,
	},
    {
	  title: 'Игрок вернул ущерб',
	  content:
		'[SIZE=3][FONT=georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Спасибо за содействие, впредь не повтряйте данных ошибок ведь шанса на обжалование больше не будет.[/CENTER]<br><br>" +
		'[CENTER] Закрыто.  С Уважением [color=red]Главный Администратор[/CENTER][/FONT][/SIZE][/color]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
     {
      title: 'Обжалование оффтоп',
	  content:
		'[SIZE=3][FONT=georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Ваша тема никак не отностится к разделу обжалования наказаний. <br><br>" +
		'[CENTER] Закрыто.  С Уважением [color=red]Главный Администратор[/CENTER][/FONT][/SIZE][/color]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
     {
	  title: 'Передать СА',
	  content:
		'[SIZE=3][FONT=book antiqua][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Ваше обжалование передано Специальной администрации.[/CENTER]<br><br>" +
		'[CENTER][Color=#ED7014]Ожидайте ответа.[/CENTER][/FONT][/SIZE][/color]',
	  prefix: PIN_PREFIX,
	  status: true,
     },

];

$(document).ready(() => {
// Загрузка скрипта для обработки шаблонов
$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

// Добавление кнопок при загрузке страницы
addButton('На рассмотрение', 'pin');
addButton('КП', 'teamProject');
addButton('Одобрено', 'accepted');
addButton('Отказано', 'unaccept');
addButton('Закрыто', 'close');
addButton('Ответы', 'selectAnswer');

// Поиск информации о теме
const threadData = getThreadData();

$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
$('button#close').click(() => editThreadData(CLOSE_PREFIX, false));
$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));

$(`button#selectAnswer`).click(() => {
XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
buttons.forEach((btn, id) => {
if(id > 0) {
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

if(send == true){
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
4 < hours && hours <= 11
? 'Доброе утро'
: 11 < hours && hours <= 15
? 'Добрый день'
: 15 < hours && hours <= 21
? 'Добрый вечер'
: 'Доброй ночи',
};
}

function editThreadData(prefix, pin = false) {
// Получаем заголовок темы, так как он необходим при запросе
const threadTitle =
$('.p-title-value')[0].lastChild.textContent;

if(pin == false){
fetch(`${document.URL}edit`, {
method: 'POST',
body: getFormData({
prefix_id: prefix,
title: threadTitle,
_xfToken: XF.config.csrf,
_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
_xfWithData: 1,
_xfResponseType: 'json',
}),
}).then(() => location.reload());
}
if(pin == true){
fetch(`${document.URL}edit`, {
method: 'POST',
body: getFormData({
prefix_id: prefix,
title: threadTitle,
sticky: 1,
_xfToken: XF.config.csrf,
_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
_xfWithData: 1,
_xfResponseType: 'json',
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