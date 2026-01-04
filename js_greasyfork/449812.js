// ==UserScript==

// @name Скрипт для рассмотрения Жалоб на Администрацию

// @namespace https://forum.blackrussia.online

// @version 4.5

// @description A script for Curation Administration 

// @author Maxim Akhmatovich and Vladimir Tenigin (VK: @max.beteille & @gel1oss02)

// @match https://forum.blackrussia.online/index.php?threads/*

// @include https://forum.blackrussia.online/index.php?threads/

// @grant none

// @license MIT

// @collaborator none

// @icon https://postimg.cc/qtBP6pVH

// @copyright 2023,

// @downloadURL https://update.greasyfork.org/scripts/449812/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%80%D0%B0%D1%81%D1%81%D0%BC%D0%BE%D1%82%D1%80%D0%B5%D0%BD%D0%B8%D1%8F%20%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%20%D0%BD%D0%B0%20%D0%90%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/449812/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%80%D0%B0%D1%81%D1%81%D0%BC%D0%BE%D1%82%D1%80%D0%B5%D0%BD%D0%B8%D1%8F%20%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%20%D0%BD%D0%B0%20%D0%90%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.meta.js
// ==/UserScript==

(function () {

'use strict';

const FAIL_PREFIX = 4;

const OKAY_PREFIX = 8;

const WAIT_PREFIX = 2;

const TECH_PREFIX = 13;

const WATCH_PREFIX = 9;

const CLOSE_PREFIX = 7;

const GA_PREFIX = 12;

const SA_PREFIX = 11;

const CP_PREFIX = 10;

const buttons = [

{
title: '---Свой текст---',
content:
'[SIZE=3][FONT=Georgia][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Текст[/CENTER]<br><br>" +
'[CENTER]Статус[/CENTER][/FONT][/SIZE]',
},
{
    title: '-----------------Закрепить------------------',
},
{
title: 'На рассмотрение',
content:
'[SIZE=3][FONT=Georgia][CENTER]Здравствуйте.[/CENTER]<br><br>' +

"[CENTER]Ваша жалоба взята на рассмотрение.[/CENTER]<br><br>" +

'[CENTER]Ожидайте ответа.[/CENTER][/FONT][/SIZE]',
prefix: WAIT_PREFIX,
status: true,
},
{
title: 'Запросить доки',
content:
'[SIZE=3][FONT=Georgia][CENTER]Здраствуйте.[/CENTER]<br><br>' +
"[CENTER]Запрошу доказательства у администратора.[/CENTER]<br><br>" +
'[CENTER]Ожидайте ответа.[/CENTER][/FONT][/SIZE]',
prefix: WAIT_PREFIX,
status: true,
},
{
title: 'Передать ГА',

content:

'[SIZE=3][FONT=Georgia][CENTER]Здравствуйте.[/CENTER]<br><br>' +

"[CENTER]Ваша жалоба передана Главному Администратору.[/CENTER]<br><br>" +

'[CENTER]Ожидайте ответа.[/CENTER][/FONT][/SIZE]',

prefix: GA_PREFIX,

status: true ,

},

{

title: 'Передать Спец. Адм.',

content:

'[SIZE=3][FONT=Georgia][CENTER]Здравствуйте.[/CENTER]<br><br>' +

"[CENTER]Ваша жалоба передана Специальному Администратору.[/CENTER]<br><br>" +

'[CENTER]Ожидайте ответа.[/CENTER][/FONT][/SIZE]',

prefix: SA_PREFIX,

status: true,

},

{

title: 'Передать Команде Проекта',

content:

'[SIZE=3][FONT=Georgia][CENTER]Здравствуйте.[/CENTER]<br><br>' +

"[CENTER]Ваша жалоба передана Команде Проекта.[/CENTER]<br><br>" +

'[CENTER]Ожидайте ответа.[/CENTER][/FONT][/SIZE]',

prefix: CP_PREFIX,

status: true,

},

{

title: '------------------Отказать------------------',
},
{

title: 'Нет нарушения от адм',

content:'[SIZE=3][FONT=Georgia][CENTER]Здравствуйте.[/CENTER]<br><br>' +

'[CENTER]Нарушения со стороны администратора не выявлено.[/CENTER]<br><br>' +

'[CENTER]Отказано.[/CENTER][/FONT][/SIZE]',

prefix: FAIL_PREFIX,

status: false,

},
{
title: 'В тех. раздел',
content:
'[SIZE=3][FONT=Georgia][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Обратитесь в технический раздел.<br><br>"+
'[CENTER]Отказано.[/CENTER][/FONT][/SIZE]',
prefix: FAIL_PREFIX,
status: false,
},
{
title: 'Направить в ОБЖ',
content:
'[SIZE=3][FONT=Georgia][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Обратитесь в раздел Обжалование накзааний.<br><br>" +
'[CENTER]Отказано.[/CENTER][/FONT][/SIZE]',
prefix: FAIL_PREFIX,
status: false,
},
{

title: 'ЖБ от 3 лица',

content:

'[SIZE=3][FONT=Georgia][CENTER]Здравствуйте.[/CENTER]<br><br>' +

"[CENTER]Жалоба создана от третьего лица.[/CENTER]<br><br>" +

"[CENTER]Жалоба не подлежит рассмотрению.[/CENTER]<br><br>" +

'[CENTER]Отказано.[/CENTER][/FONT][/SIZE]',

prefix: FAIL_PREFIX,

status: false,

},

{

title: 'Недостаточно док-вы',

content:'[SIZE=3][FONT=Georgia][CENTER]Здравствуйте.[/CENTER]<br><br>' +

"[CENTER]Недостаточно доказательств, которые потверждают нарушение администратора.[/CENTER]<br><br>" +

'[CENTER]Отказано.[/CENTER][/FONT][/SIZE]',

prefix: FAIL_PREFIX,

status: false

}, 

{

title: 'Админ прав',

content:

'[SIZE=3][FONT=Georgia][CENTER]Здравствуйте.[/CENTER]<br><br>' +

"[CENTER]Проверив доказательства у администратора, было принято решение, что наказание выдано верно.[/CENTER]<br><br>" +

'[CENTER]Отказано.[/CENTER][/FONT][/SIZE]',

prefix: FAIL_PREFIX,

status: false,

},

{

title: 'Жалоба не по форме',

content:

'[SIZE=3][FONT=Georgia][CENTER]Здравствуйте.[/CENTER]<br><br>' +

"[CENTER]Ваша жалоба составлена не по форме, ознакомьтесь с правилами подачи жалоб на администрацию.[/CENTER]<br><br>" +

'[CENTER]Отказано.[/CENTER][/FONT][/SIZE]',

prefix: FAIL_PREFIX,

status: false,

}, 

{
title: 'Дубликат',

content:

'[SIZE=3][FONT=Georgia][CENTER]Здравствуйте.[/CENTER]<br><br>' +

"[CENTER]Ваша жалоба дублирована, рассмотрению не подлежит. [/CENTER]<br><br>" +

'[CENTER]Отказано.[/CENTER][/FONT][/SIZE]',

prefix: FAIL_PREFIX,

status: false,

}, 

{

title: '48 часов',

content: 

'[SIZE=3][FONT=Georgia][CENTER]Здравствуйте.[/CENTER]<br><br>' +

"[CENTER]С момента выдачи наказание прошло более 48-и часов, жалоба не подлежит рассмотрению.[/CENTER]<br><br>" +

'[CENTER]Отказано.[/FONT][/SIZE][/CENTER]',

prefix: FAIL_PREFIX,

status: false,

},

{

title: '------------------Одобрить------------------',
}, 
{

title: 'Наказание по ошибке',

content: 

'[SIZE=3][FONT=Georgia][CENTER]Здравствуйте.[/CENTER]<br><br>' +

"[CENTER]С администратором проведена беседа, Ваше наказание будет снято.[/CENTER]<br><br>" +

'[CENTER]Одобрено.[/CENTER][/FONT][/SIZE]',

prefix:OKAY_PREFIX,

status:false,

},

{

title: 'Админ СНЯТ/ПСЖ, наказание снято',

content:'[SIZE=3][FONT=Georgia][CENTER]Здравствуйте.[/CENTER]<br><br>' +

"[CENTER]Администратор снят, Ваше наказание будет снято.[/CENTER]<br><br>" +

'[CENTER]Одобрено.[/CENTER][/FONT][/SIZE]',

prefix: OKAY_PREFIX,

status:false,

},

{

title: 'Беседа с адм',

content:

'[SIZE=3][FONT=Georgia][CENTER]Здравствуйте.[/CENTER]<br><br>' +

"[CENTER]С администратором будет проведена работа.[/CENTER]<br><br>" +

'[CENTER]Одобрено.[/CENTER][/FONT][/SIZE]',

prefix: OKAY_PREFIX,

status: false,

},

{

title: '=| Приятной работы на форуме ;) =|',

},
];

$(document).ready(() => {

$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

addButton('На рассмотрение', 'pin');

addButton('Одобрено', 'accepted');

addButton('Отказано', 'unaccept');

addButton('Рассмотрено', 'watch');

addButton('Закрыто', 'close');

addButton('|•|', '');

addButton('Меню ответов', 'selectAnswer');

addButton('|•|', '');

const threadData = getThreadData(); 
$('button#pin').click(() => editThreadData(WAIT_PREFIX, true)); 
$('button#accepted').click(() => editThreadData(OKAY_PREFIX, false)); 
$('button#watch').click(() => editThreadData(WATCH_PREFIX, false)); 
$('button#close').click(() => editThreadData(CLOSE_PREFIX, false));
$('button#unaccept').click(() => editThreadData(FAIL_PREFIX, false)); 
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
