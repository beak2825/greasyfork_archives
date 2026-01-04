// ==UserScript==
// @name         Скрипт для ГС/ЗГС
// @namespace    https://forum.blackrussia.online/
// @version      1.1
// @description  Author Screamz
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @icon https://freepngimg.com/thumb/eagle/20-eagle-black-siluet-png-image-download-thumb.png
// @downloadURL https://update.greasyfork.org/scripts/493847/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%A1%D0%97%D0%93%D0%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/493847/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%A1%D0%97%D0%93%D0%A1.meta.js
// ==/UserScript==

(function () {
'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const buttons = [
{
title: 'Салам ',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' + '[CENTER] [/CENTER][/FONT][/SIZE]',
},
{
title: 'Запросил док-ва у лд',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Запрошу доказательства у Лидера.[/CENTER]<br><br>" +
"[CENTER]Ожидайте ответа в данной теме, не нужно создавать копии этой темы.[/CENTER]<br><br>"+
"[CENTER][COLOR=orange][FONT=courier new]На рассмотрении...[/COLOR].[/CENTER]<br><br>",
prefix: PIN_PREFIX,
status: true,
},
{
title: 'Лд прав',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Проверив предоставленные доказательства Лидера, был вынесен вердикт, что с его стороны нарушений не обнаружено.[/CENTER]<br><br>" +
"[CENTER][COLOR=RED][FONT=courier new]Закрыто.[/CENTER]<br><br>",
            prefix: CLOSE_PREFIX,
            status: false,
},
{
title: 'Косяк лд',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Лидер допустил ошибку, с ним будет проведена соответствующая работа.[/CENTER]<br><br>" +
"[CENTER]Приносим извинения за доставленные неудобства.<br><br>" +
"[CENTER][COLOR=#40ff00][FONT=courier new]Одобрено.[/CENTER]<br><br>",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Нет /time',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]В вашей жалобе отсутствует /time.<br><br>" +
"[CENTER][COLOR=RED][FONT=courier new]Закрыто.[/CENTER]<br><br>",
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Отстутствуют доказательств',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]В вашей жалобе отсутствуют доказательства.<br><br>" +
"[CENTER]Прикрепите доказательсва в хорошем качестве на разрешенных платформах.(Yapx/Imgur/YouTube/ImgBB).<br><br>" +
"[CENTER][COLOR=RED][FONT=courier new]Закрыто.[/CENTER]<br><br>",
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Более 48 часов(нарушения)',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]С момента нарушения прошло более 48 часов.[/CENTER]<br><br>" +
"[CENTER]Жалоба рассмотрению не подлежит.[/CENTER]<br><br>" +
"[CENTER][COLOR=RED][FONT=courier new]Закрыто.[/CENTER]<br><br>",
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Более 48 часов(наказания)',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]С момента выдачи наказания прошло более 48 часов.[/CENTER]<br><br>" +
"[CENTER]Жалоба рассмотрению не подлежит.[/CENTER]<br><br>" +
"[CENTER][COLOR=RED][FONT=courier new]Закрыто.[/CENTER]<br><br>",
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Дублирование темы ',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ответ вам уже был дан в предыдущей теме. Напоминаю, за дублирование тем ваш форумный аккаунт может быть заблокирован[/CENTER]<br><br>" +
'[CENTER][COLOR=RED]Отказано, закрыто.[/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'В раздел жб на сотрудников ',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Обратитесь в раздел жалоб на сотрудников.[/CENTER]<br><br>" +
'[CENTER][COLOR=RED][FONT=courier new]Отказано, закрыто.[/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'В раздел жб на адм ',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Обратитесь в раздел жалоб на администрацию.[/CENTER]<br><br>" +
'[CENTER][COLOR=RED][FONT=courier new]Отказано, закрыто.[/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},

    {
title: 'Не тот сервер ',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Вы обшились сервером. Обраитесь в раздел нужного Вам сревера.[/CENTER]<br><br>" +
'[CENTER][COLOR=RED][FONT=courier new]Отказано, закрыто.[/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
];

$(document).ready(() => {
// Загрузка скрипта для обработки шаблонов
$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

// Добавление кнопок при загрузке страницы
addButton('На рассмотрение', 'pin');
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