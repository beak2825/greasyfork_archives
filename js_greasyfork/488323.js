// ==UserScript==
// @name Script for kurators admins
// @namespace https://forum.blackrussia.online
// @version  2.3
// @description Специально для BlackRussia Curator Admins
// @author M.Woody and L.Zaya
// @match https://forum.blackrussia.online/threads/*
// @include https://forum.blackrussia.online/threads/
// @grant none
// @license MIT
// @collaborator none
// @icon https://icons.iconarchive.com/icons/google/noto-emoji-people-bodyparts/256/11960-victory-hand-light-skin-tone-icon.png
// @downloadURL https://update.greasyfork.org/scripts/488323/Script%20for%20kurators%20admins.user.js
// @updateURL https://update.greasyfork.org/scripts/488323/Script%20for%20kurators%20admins.meta.js
// ==/UserScript==

(function () {
'use strict';
'esversion 6' ;
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7; // Prefix that will be set when thread closes.
const TEX_PREFIX = 13;
const GA_PREFIX = 12;
const V_PREFIX = 1;
const buttons = [
{
title: '------------------------------На рассмотрение---------------------------------------------------',
},
{
title: 'На рассмотрении',
content:
'[COLOR=rgb(255, 128,  64)][FONT=times new roman][SIZE=4][I] Здравствуйте уважаемый(ая) ${user.name} [/I][/SIZE][/FONT][/COLOR]<br><br>' +
"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба находится на рассмотрении, просьба не создавать дубликаты данной темы[/SIZE][/FONT][/COLOR][/I]<br><br>" +
"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
'[COLOR=rgb(253, 208, 23)][FONT=times new roman][SIZE=4][I]На рассмотрении.[/I][/SIZE][/FONT][/COLOR]',
prefix: PIN_PREFIX,
status: false,
},

{
title: 'Передать ЗГА',
content:
'[COLOR=rgb(255, 128,  64)][FONT=times new roman][SIZE=4][I] Здравствуйте уважаемый игрок.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба передана Заместителю Главного Администратора[/SIZE][/FONT][/COLOR][/I]<br><br>" +
"[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=book antiqua]Просьба не создавать  дубликаты данной темы.[/FONT][/SIZE][/COLOR]<br><br>" +
"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
'[COLOR=rgb(253, 208, 23)][FONT=times new roman][SIZE=4][I]На рассмотрении.[/I][/SIZE][/FONT][/COLOR]',
prefix: PIN_PREFIX,
status: false,
},
{
title: 'Передать ГА',
content:
'[COLOR=rgb(255, 128,  64)][FONT=times new roman][SIZE=4][I] Здравствуйте уважаемый игрок.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба передана  Главному Администратору[/SIZE][/FONT][/COLOR][/I]<br><br>" +
"[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=book antiqua]Просьба не создавать  дубликаты данной темы.[/FONT][/SIZE][/COLOR]<br><br>" +
"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
'[COLOR=rgb(253, 208, 23)][FONT=times new roman][SIZE=4][I]На рассмотрении.[/I][/SIZE][/FONT][/COLOR]',
prefix: GA_PREFIX,
status: false,
},
{
title: '------------------------------Отказы------------------------------------------------------',
},
{
title: 'НЕТ ДОКВ',
content:
'[COLOR=rgb(255, 128,  64)][FONT=times new roman][SIZE=4][I] Здравствуйте уважаемый игрок.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Прикрепите скриншот вашего наказания[/SIZE][/FONT][/COLOR][/I]<br><br>" +
"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
'[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'НЕ ПО ФОРМЕ',
content:
'[COLOR=rgb(255, 128,  64)][FONT=times new roman][SIZE=4][I] Здравствуйте уважаемый игрок.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба составлена не по форме [/SIZE][/FONT][/COLOR][/I]<br><br>" +
"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
'[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '72 часа',
content:
'[COLOR=rgb(255, 128,  64)][FONT=times new roman][SIZE=4][I] Здравствуйте уважаемый игрок.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]С момента получения наказания прошло более 72-х часов.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
"[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=book antiqua]Просьба не создавать  дубликаты данной темы.[/FONT][/SIZE][/COLOR]<br><br>" +
"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
'[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title:
'Наказание Выдано Верно (Посл. рассмотр.)',
content:
'[COLOR=rgb(255, 128,  64)][FONT=times new roman][SIZE=4][I] Уважаемый игрок.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Наказание выдано верно.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
"[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=book antiqua]Просьба не создавать  дубликаты данной темы.[/FONT][/SIZE][/COLOR]<br><br>" +
"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
'[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title:
'Наказание Выдано Верно (Сразу)',
content:
'[COLOR=rgb(255, 128,  64)][FONT=times new roman][SIZE=4][I] Здравствуйте уважаемый игрок.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Наказание выдано верно.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
"[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman]Просьба не создавать  дубликаты данной темы.[/FONT][/SIZE][/COLOR]<br><br>" +
"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
'[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title:
'Ответ в Прошлой теме',
content:
'[COLOR=rgb(255, 128,  64)][FONT=times new roman][SIZE=4][I] Здравствуйте уважаемый игрок.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ответ был дан в прошлой теме.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
"[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=book antiqua]Просьба не создавать  дубликаты данной темы иначе ваш форумный аккаунт может быть заблокирован.[/FONT][/SIZE][/COLOR]<br><br>" +
"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
'[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title:
'Доква отредактированы',
content:
'[COLOR=rgb(255, 128,  64)][FONT=times new roman][SIZE=4][I] Здравствуйте уважаемый игрок.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваши доказательства отредактированы.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
"[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=book antiqua]Просьба не создавать  дубликаты данной темы.[/FONT][/SIZE][/COLOR]<br><br>" +
"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
'[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title:
'Нет time',
content:
'[COLOR=rgb(255, 128,  64)][FONT=times new roman][SIZE=4][I] Здравствуйте уважаемый игрок.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4] В предоставленных доказательств отсутствует время (/time), не подлежит рассмотрению. [/SIZE][/FONT][/COLOR][/I]<br><br>" +
"[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=book antiqua]Просьба не создавать  дубликаты данной темы.[/FONT][/SIZE][/COLOR]<br><br>" +
"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
'[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title:
'Жб на Техов',
content:
'[COLOR=rgb(255, 128,  64)][FONT=times new roman][SIZE=4][I] Здравствуйте уважаемый игрок.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4] Обратитесь в раздел «Жалобы на технических специалистов»[/SIZE][/FONT][/COLOR][/I]<br><br>" +
"[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=book antiqua]Просьба не создавать  дубликаты данной темы.[/FONT][/SIZE][/COLOR]<br><br>" +
"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
'[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '------------------------------Одобрения-------------------------------------------------',
},
{
title: 'Одобрено (после расмотр.)',
content:
'[COLOR=rgb(255, 128,  64)][FONT=times new roman][SIZE=4][I] Уважаемый игрок.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]С администратором будет проведена беседа.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
"[I][COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman]Приносим извинения за предоставленные неудобства [/FONT][/SIZE][/COLOR]<br><br>" +
"[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA  [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
'[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Одобрено (сразу)',
content:
'[COLOR=rgb(255, 128,  64)][FONT=times new roman][SIZE=4][I] Здравствуйте уважаемый игрок.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]С администратором будет проведена беседа.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
"[I][COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman]Приносим извинения за предоставленные неудобства [/FONT][/SIZE][/COLOR]<br><br>" +
"[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA  [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
'[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
prefix: ACCEPT_PREFIX,
status: false,
},

{
title: '------------------------------Запасная вкладка------------------------------------------------'
},
{
title: 'Сделано с любовью<3'
},

];


$(document).ready(() => {
// Загрузка скрипта для обработки шаблонов
$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

// Добавление кнопок при загрузке страницы
addButton('На рассмотрение', 'pin');
addButton('Одобрено', 'accepted');
addButton('Отказано', 'unaccept');
addButton('Ответы', 'selectAnswer');

// Поиск информации о теме
const threadData = getThreadData();

$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
$('button#Ga').click(() => editThreadData(GA_PREFIX, true));
$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
$('button#Texy').click(() => editThreadData(TEX_PREFIX, false));
$('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));

$(`button#selectAnswer`).click(() => {
XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
buttons.forEach((btn, id) => {
if (id > 0) {
$(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
}
else {
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
 6 < hours && hours <= 10
      ? 'Доброе утро'
      : 10 < hours && hours <= 18
      ? 'Добрый день'
      : 18 < hours && hours <= 6
      ? 'Добрый вечер'
      : 'Доброй ночи',
};
}

function editThreadData(prefix, pin = false) {
// Получаем заголовок темы, так как он необходим при запросе
const threadTitle = $('.p-title-value')[0].lastChild.textContent;

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
} else {
fetch(`${document.URL}edit`, {
method: 'POST',
body: getFormData({
prefix_id: prefix,
title: threadTitle,
pin: 1,
_xfToken:
XF.config.csrf,
_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
_xfWithData: 1,
_xfResponseType: 'json',
}),
}).then(() => location.reload());
}




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
} else {
fetch(`${document.URL}edit`, {
method: 'POST',
body: getFormData({
prefix_id: prefix,
title: threadTitle,
pin: 1,
_xfToken: XF.config.csrf,
_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
_xfWithData: 1,
_xfResponseType: 'json',
}),
}).then(() => location.reload());
}


function moveThread(prefix, type) {
// Получаем заголовок темы, так как он необходим при запросе
const threadTitle = $('.p-title-value')[0].lastChild.textContent;

fetch(`${document.URL}move`, {
method: 'POST',
body: getFormData({
prefix_id: prefix,
title: threadTitle,
target_node_id: type,
redirect_type: 'none',
notify_watchers: 1,
starter_alert: 1,
starter_alert_reason: "",
_xfToken: XF.config.csrf,
_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
_xfWithData: 1,
_xfResponseType: 'json',
}),
}).then(() => location.reload());
}

function getFormData(data) {
const formData = new FormData();
Object.entries(data).forEach(i => formData.append(i[0], i[1]));
return formData;
}
}
})();