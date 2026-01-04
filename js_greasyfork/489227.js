// ==UserScript==
// @name Для тестеров
// @namespace https://forum.blackrussia.online
// @version 1.2.2
// @description Скрипт для тестировщиков BlackRussia
// @author Breife Stoyn
// @match https://forum.blackrussia.online/index.php?threads/*
// @include https://forum.blackrussia.online/index.php?threads/
// @grant none
// @license MIT
// @collaborator 
// @icon https://icons.iconarchive.com/icons/thesquid.ink/free-flat-sample/128/support-icon.png
// @downloadURL https://update.greasyfork.org/scripts/489227/%D0%94%D0%BB%D1%8F%20%D1%82%D0%B5%D1%81%D1%82%D0%B5%D1%80%D0%BE%D0%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/489227/%D0%94%D0%BB%D1%8F%20%D1%82%D0%B5%D1%81%D1%82%D0%B5%D1%80%D0%BE%D0%B2.meta.js
// ==/UserScript==
 
(function () {
'use strict';
const UNACCEPT_PREFIX = 4; // префикс отказано
const ACCEPT_PREFIX = 8; // префикс одобрено
const PIN_PREFIX = 2; //  префикс закрепить
const COMMAND_PREFIX = 10; // команде проекта
const TECHADM_PREFIX = 13 // теху администратору
const buttons = [
{
	title: 'Приветствие, пишем самому',
	content:
	'[SIZE=9][FONT=Georgia][CENTER] {{ greeting }},  Уважаемый {{ user.mention }}![/CENTER][/FONT][/SIZE]<br><br>' + 
	'[CENTER]  													[/CENTER][/FONT][/SIZE]',
},
{
	title: 'Взял на рассмотрение',
	content:
	'[SIZE=12][FONT=Georgia][CENTER]Уважаемый {{ user.mention }}![/CENTER][/FONT][/SIZE]<br><br>' + 
	"[CENTER][FONT=georgia][SIZE=12]Беру вашу тему на рассмотрение, ожидайте [COLOR=rgb(0, 255, 0)]вердикта.[/COLOR]<br>" +
	'[COLOR=rgb(255, 255, 0)]На рассмотрении[/COLOR][/FONT][/SIZE].',
	prefix: PIN_PREFIX,
	status: true,
},
{
	title: 'Баг выявлен',
	content:
	'[SIZE=12][FONT=Georgia][CENTER]Уважаемый {{ user.mention }}![/CENTER][/FONT][/SIZE]<br><br>' + 
	"[CENTER][FONT=georgia][SIZE=12] Ваша тема была рассмотрена и в ходе проверок, ошибка/недоработка/баг действительно был выявлен. [/FONT][/SIZE]<br>" +
	"[CENTER][FONT=georgia][SIZE=12]Спасибо вам за бдительность.[/FONT][/SIZE]<br>" +
	'[CENTER][FONT=georgia][SIZE=12][COLOR=rgb(0, 255, 0)] Баг будет исправлен[/COLOR][/FONT][/SIZE].',
	prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: 'Баг не выявлен',
	content: 
	'[SIZE=12][FONT=Georgia][CENTER]Уважаемый {{ user.mention }}![/CENTER][/FONT][/SIZE]<br><br>' +
	"[CENTER][FONT=georgia][SIZE=12] ваша темы была рассмотрена и в ходе проверок ошибка/недоработка/баг был не выявлен.[/FONT][/SIZE]<br>" +
	'[CENTER][FONT=georgia][SIZE=12][COLOR=rgb(0, 255, 0)]Спасибо вам за тему[/COLOR][/FONT][/SIZE].',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Помощи от КП',
	content: 
	'[SIZE=12][FONT=Georgia][CENTER]Уважаемый {{ user.mention }}![/CENTER][/FONT][/SIZE]<br><br>' +
	'[CENTER][FONT=georgia][SIZE=12]Тема находится на рассмотрении и ожидается помощь от [COLOR=rgb(255, 255, 0)]Команды Проекта[/COLOR]',
	prefix: COMMAND_PREFIX,
	status: true,
},
{ 
	title: 'Передано Тех.Специалисту',
	content:
	'[SIZE=12][FONT=Georgia][CENTER]Уважаемый {{ user.mention }}![/CENTER][/FONT][/SIZE]<br><br>' + 
	"[CENTER][FONT=georgia][SIZE=12]Тема передана [COLOR=rgb(0, 255, 255)]Тех. Специалисту [/FONT][/SIZE].<br>" + 
	'[CENTER][FONT=georgia][SIZE=12]Следующие решения последуют от него.[/COLOR][/FONT][/SIZE]<br>',
	prefix: TECHADM_PREFIX,
	status: true,
},
{
	title: 'Не хватает док-вы',
	content: 
	'[SIZE=12][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER][/FONT][/SIZE]<br><br>' +
	"[CENTER][FONT=georgia][SIZE=12] В данной тебе [COLOR=rgb(255, 0, 0)]мало доказательств[/COLOR], для тщательного рассмотрения данной темы. [/FONT][/SIZE]<br>" +
	"[CENTER][FONT=georgia][SIZE=12][U]У вас 24 часа на предоставление дополнительных доказательств[/U], которые помогут нам справиться с решением проблемы. [/FONT][/SIZE]<br>" +
	'[CENTER][FONT=georgia][SIZE=12]Если в течении 24 часов ответа не получим, теме будет[COLOR=rgb(255, 0, 0)] отказано[/COLOR].[/SIZE][/FONT][/CENTER]',
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
addButton('Отказано', 'unaccept');
addButton('Одобрено', 'accepted');
addButton('Закрыто', 'closed');
addButton('Техническому спецалисту', 'techspec');
addButton('Ответы', 'selectAnswer');
 
// Поиск информации о теме
const threadData = getThreadData();
 
$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
$('button#closed').click(() => editThreadData(CLOSE_PREFIX, false));
$('button#techspec').click(() => editThreadData(TECHADM_PREFIX, true));
 
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
 
if (pin == false) {
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
if (pin == true) {
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