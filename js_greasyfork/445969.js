// ==UserScript==
// @name Пробный скрипт 
// @namespace https://forum.blackrussia.online
// @version 1.3
// @description Внимательнее прочтите инструкцию.
// @author Коля Груз
// @match https://forum.blackrussia.online/index.php?threads/*
// @include https://forum.blackrussia.online/index.php?threads/
// @grant none
// @license MIT
// @icon 
// @downloadURL https://update.greasyfork.org/scripts/445969/%D0%9F%D1%80%D0%BE%D0%B1%D0%BD%D1%8B%D0%B9%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82.user.js
// @updateURL https://update.greasyfork.org/scripts/445969/%D0%9F%D1%80%D0%BE%D0%B1%D0%BD%D1%8B%D0%B9%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82.meta.js
// ==/UserScript==

(function () {
'use strict';
const UNACCСEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCСEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem
const PINN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const SPECY_PREFIX = 11;
const TEXY_PREFIX = 13;
const OTKAZBIO_PREFIX = 4;
const ODOBRENOBIO_PREFIX = 8;
const NARASSMOTRENIIBIO_PREFIX = 2;
const OTKAZRP_PREFIX = 4;
const ODOBRENORP_PREFIX = 8;
const NARASSMOTRENIIRP_PREFIX = 2;
const OTKAZORG_PREFIX = 4;
const ODOBRENOORG_PREFIX = 8;
const NARASSMOTRENIIORG_PREFIX = 2;
const buttons = [
{
title: 'Приветствую, Отказано, закрыто',
content: '[Color=Red][CENTER]Приветствую ,отказано, закрыто.[/CENTER][/color]' + '[CENTER] [/CENTER]',
},
{
title: 'Одобрено, закрыто',
content: '[Color=Green][CENTER]Приветствую, одобрено, закрыто.[/CENTER][/color]' + '[CENTER] [/CENTER]',
},
{
title: 'На рассмотрении...',
content: '[Color=Orange][font=georgia][i][CENTER]Приветстсвую , На рассмотрении...[/CENTER][/font][/i][/color]' + '[CENTER] [/CENTER]',
},

{
title: 'Наказание верно ',
content:
'[Color=violet][FONT=times new roman][CENTER][I]Приветствую.[/color][/CENTER]<br>' +
"[CENTER][FONT=georgia][I][B]Наказание выдано верно [/FONT][/I][/B][/CENTER] " +
'[Color=Green][CENTER]Закрыто.[/I][/CENTER][/color][/FONT]',
prefix: RESHENO_PREFIX,
status: false,
},
{
title: 'Ошибка бана ',
content:
'[Color=violet][FONT=times new roman][CENTER][I]Приветствую.[/color][/CENTER]<br>' +
"[CENTER] Ваш аккаунт будет разблокирован [/CENTER]<br>" +
'[Color=Green][CENTER]Закрыто.[/I][/CENTER][/color][/FONT]',
prefix:RESHENO_PREFIX,
status: false,
},
{
title: 'Беседа с адм ',
content:
'[Color=violet][FONT=times new roman][CENTER][I]Приветствую.[/color][/CENTER]<br>' +
"[CENTER]С администратором будет проведена беседа [/CENTER]<br>" +
'[Color=Green][CENTER]Закрыто.[/I][/CENTER][/color][/FONT]',
prefix: RESHENO_PREFIX,
status: false,
},
{
title: 'Работа с адм ',
content:
'[Color=violet][FONT=times new roman][CENTER][I]Приветствую.[/color][/CENTER]<br>' +
"[CENTER]С администратором будет проведена беседа [/CENTER]<br>" +
'[Color=Green][CENTER]Закрыто.[/I][/CENTER][/color][/FONT]',
prefix: RESHENO_PREFIX,
status: false,
},
{
title: 'Беседа с кф (жалоба на игрока) ',
content:
'[Color=violet][FONT=times new roman][CENTER][I]Приветствую.[/color][/CENTER]<br>' +
"[CENTER]С куратором форума будет проведена беседа, жалоба пересмотрена [/CENTER]<br>" +
'[Color=Green][CENTER]Закрыто.[/I][/CENTER][/color][/FONT]',
prefix: RESHENO_PREFIX,
status: false,
},
{
title: 'Наказание снято ',
content:
'[Color=violet][FONT=times new roman][CENTER][I]Приветствую.[/color][/CENTER]<br>' +
"[CENTER]Ваше наказание будет снято[/CENTER]<br>" +
'[Color=Green][CENTER] Закрыто.[/I][/CENTER][/color][/FONT]',
prefix: RESHENO_PREFIX,
status: false,
},
{
title: 'кф (рп био) ',
content:
'[Color=violet][FONT=times new roman][CENTER][I]Приветствую.[/color][/CENTER]<br>' +
"[CENTER]С куратором форума будет проведена беседа, рп биография будет пересмотрена [/CENTER]<br>" +
'[Color=Green][CENTER]Закрыто.[/I][/CENTER][/color][/FONT]',
prefix: RESHENO_PREFIX,
status: false,
},

{
title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Обжалования ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
},
{
title: 'Одобрено ',
content:
'[Color=violet][FONT=times new roman][CENTER][I]Приветствую.[/color][/CENTER]<br>'+
"[CENTER]Наказание будет снижено до минимальных мер.[/CENTER]<br>" +
'[Color=Green][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
prefix: ACCСEPT_PREFIX,
status: false,
},
{
title: 'Отказ',
content:
'[Color=violet][FONT=times new roman][CENTER][I], Приветствую.[/color][/CENTER]<br>' +
"[CENTER]В обжаловании отказано, в данный момент мы не уверены что вы осознали свой поступок.[/CENTER]<br>" +
'[Color=Green][CENTER]Закрыто.[/I][/CENTER][/color][/FONT]',
prefix: OTKAZORG_PREFIX ,
status: false,
},
{
title: 'На рассмотрение ',
content:
'[Color=violet][FONT=times new roman][CENTER][I]Приветствую.[/color][/CENTER]<br>' +
"[CENTER]На рассмотрении [/CENTER]<br>" +
'[Color=Green][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
prefix: ACCСEPT_PREFIX,
status: false,
},
];

$(document).ready(() => {
// Загрузка скрипта для обработки шаблонов
$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

// Добавление кнопок при загрузке страницы
addButton('На рассмотрение', 'pin');
addButton('КП', 'teamProject');
addButton('Га', 'Ga');
addButton('Спецу', 'Spec');
addButton('Одобрено', 'accepted');
addButton('Отказано', 'unaccept');
addButton('Тех. Специалисту', 'Texy');
addButton('Решено', 'Resheno');
addButton('Закрыто', 'Zakrito');
addButton('Ответы', 'selectAnswer');

// Поиск информации о теме
const threadData = getThreadData();

$('button#pin').click(() => editThreadData(PINN_PREFIX, true));
$('button#accepted').click(() => editThreadData(ACCСEPT_PREFIX, false));
$('button#Ga').click(() => editThreadData(GA_PREFIX, true));
$('button#Spec').click(() => editThreadData(SPECY_PREFIX, true));
$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
$('button#unaccept').click(() => editThreadData(UNACCСEPT_PREFIX, false));
$('button#Texy').click(() => editThreadData(TEXY_PREFIX, false));
$('button#Resheno').click(() => editThreadData(RESHENO_PREFIX, false));
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
_xfToken: XF.config.csrf,
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