// ==UserScript==
// @name         scriptyoy
// @namespace    https://forum.blackrussia.online/
// @version      3.1.2
// @description  da
// @author       p.moroznik
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @icon https://freepngimg.com/thumb/eagle/20-eagle-black-siluet-png-image-download-thumb.png
// @downloadURL https://update.greasyfork.org/scripts/529636/scriptyoy.user.js
// @updateURL https://update.greasyfork.org/scripts/529636/scriptyoy.meta.js
// ==/UserScript==

(function () {
'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const WATCHED_PREFIX = 9;
const SPEC_PREFIX = 11;
const KP_PREFIX = 10;
const CLOSE_PREFIX = 7;
const buttons = [
{
title: '----------------------------------------------------------------------------- ОБЖ ------------------------------------------------------------------------- ',
    },

{
title: 'отказано',
content:
'[SIZE=4][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]В Вашем обжаловании отказано. [/CENTER]",
prefix: CLOSE_PREFIX,
status: false,
},

{
title: 'одобрено.',
content:
'[SIZE=4][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ваше обжалование было одобрено и наказание будет снято в течении некоторого времени. Учтите, что руководство пошло к Вам на встречу и советует выучить правила, иначе второго шанса может не быть. [/CENTER]",
prefix: ACCEPT_PREFIX,
status: false,
},
    {
title: 'на рассмотрение.',
content:
'[SIZE=4][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]' +
"[CENTER]Ваше обжалование было взято на рассмотрение. Пожалуйста, ожидайте ответа в данной теме и не создавайте её дубликатов.[/CENTER]",
prefix: PIN_PREFIX,
status: true,
},
    {
title: 'на рассмотрение(ссылка вк).',
content:
'[SIZE=4][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Предоставьте ссылку на Ваш ВКонтакте[/CENTER]",
prefix: PIN_PREFIX,
status: true,
},
        {
title: 'одобрено(чс).',
content:
'[SIZE=4][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ваше обжалование было одобрено и черный список был снят. Ожидаем Вас на должностях нашего сервера![/CENTER]",
prefix: ACCEPT_PREFIX,
status: false,
},
            {
title: 'не по форме.',
content:
'[SIZE=4][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ваше обжалование было составлено не по форме.[/CENTER]",
prefix: CLOSE_PREFIX,
status: false,
},
                {
title: 'нет скрин бана.',
content:
'[SIZE=4][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]В Вашем обжаловании отсутствует скриншот окна блокировки.[/CENTER]",
prefix: CLOSE_PREFIX,
status: false,
},
                {
title: 'nrp обман',
content:
'[SIZE=4][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Что бы обжаловать Ваше наказание Вы должны найти пострадавшую сторону и договориться с ней о возврате имущества, а потом пострадавшая сторона должна написать обжалование с скриншотом договора.[/CENTER]",
prefix: CLOSE_PREFIX,
status: false,
},
                {
title: 'Кузе',
content:
'[SIZE=4][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ваше обращение было передано Руководителю Модерации на рассмотрение. Пожалуйста, ожидайте ответа в данной теме и не создавайте её дубликатов.[/CENTER]",
prefix: KP_PREFIX,
status: true,
},
                    {
title: 'Спецам',
content:
'[SIZE=4][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ваше обращение было передано Специальной администрации на рассмотрение. Пожалуйста, ожидайте ответа в данной теме и не создавайте её дубликатов.[/CENTER]",
prefix: SPEC_PREFIX,
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