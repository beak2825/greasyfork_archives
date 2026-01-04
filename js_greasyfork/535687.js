// ==UserScript==
// @name         Black Russia Skript
// @namespace    https://forum.blackrussia.online/
// @version      1.2
// @description  Ok
// @author       Artemy
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @icon 
// @downloadURL https://update.greasyfork.org/scripts/535687/Black%20Russia%20Skript.user.js
// @updateURL https://update.greasyfork.org/scripts/535687/Black%20Russia%20Skript.meta.js
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
title: 'Приветствие ',
content:
'[SIZE=4][COLOR=rgb(221,160,221)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER][/COLOR]<br>' +
    '[CENTER] [/CENTER][/FONT][/SIZE]',
},
{
title: 'На рассмотрение',
content:
'[SIZE=4][COLOR=rgb(221,160,221)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER][/COLOR]<br><br>' +
"[CENTER]Ваша жалоба взята [COLOR=rgb(255,255,0)]на рассмотрение.[/COLOR][/CENTER]<br><br>" +
"[CENTER]Ожидайте ответа.[/CENTER]<br><br>" +
'[CENTER]Приятной игры на 39 сервере [COLOR=rgb(220,20,60)] Volgograd [/COLOR].[/CENTER][/FONT][/SIZE]',
prefix: PIN_PREFIX,
status: true,
},
{
title: 'Бан по IP',
content:
'[SIZE=4][COLOR=rgb(221,160,221)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER][/COLOR]<br><br>' +
"[CENTER]Попробуйте изменить подключение на вашем устройстве. Пример: зайти в игру с подключением к Wi-Fi, мобильным интернетом или с сервисом VPN [/CENTER]<br><br>" +
'[CENTER] Рассмотрено, закрыто.[/CENTER][/FONT][/SIZE]',
prefix: WATCHED_PREFIX,
status: false,
},
    {
title: 'жб будут пересмотрены',
content:
'[SIZE=4][COLOR=rgb(221,160,221)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER][/COLOR]<br><br>' +
"[CENTER] С администратором будет проведена беседа, жалобы будут пересмотрены. Благодарим за обращение." +
'[CENTER] Одобрено, закрыто.[/CENTER][/FONT][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Жб одобрена (Беседа с адм)',
content:
'[SIZE=4][COLOR=rgb(221,160,221)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER][/COLOR]<br><br>' +
"[CENTER]С администратором будет проведена беседа.<br>Ваше наказание будет снято в течении 24 часов.[/CENTER]<br><br>" +
'[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
     {
title: 'жб будет пересмотрены',
content:
'[SIZE=4][COLOR=rgb(221,160,221)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER][/COLOR]<br><br>' +
"[CENTER] С администратором будет проведена беседа, жалоба будет пересмотрена. Благодарим за обращение." +
'[CENTER] Одобрено, закрыто.[/CENTER][/FONT][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'адм ошибся',
content:
'[SIZE=4][COLOR=rgb(221,160,221)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER][/COLOR]<br><br>' +
"[CENTER]Администратор допустил ошибку, приносим свои извинения. Наказание будет снято в течении 24х часов.[/CENTER]<br><br>" +
'[CENTER] Одобрено, закрыто.[/CENTER][/FONT][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Дублирование темы ',
content:
'[SIZE=4][COLOR=rgb(221,160,221)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER][/COLOR]<br><br>' +
"[CENTER]Если вы дальше будете дублировать темы, то ваш форумный аккаунт будет заблокирован на 3 дня и более.[/CENTER]<br><br>" +
'[CENTER][COLOR=rgb(255,0,0)]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Ответ в прошлой жалобе ',
content:
'[SIZE=4][COLOR=rgb(221,160,221)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER][/COLOR]<br><br>' +
"[CENTER]Ответ был дан в прошлой теме. [/CENTER]<br><br>" +
'[CENTER][COLOR=rgb(255,0,0)]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Беседа с админом',
content:
'[SIZE=4][COLOR=rgb(221,160,221)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER][/COLOR]<br><br>' +
"[CENTER]С администратором будет проведена беседа.Благодарим за информацию.[/CENTER]<br><br>" +
'[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Ошиблись сервером',
content:
'[SIZE=4][COLOR=rgb(221,160,221)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER][/COLOR]<br><br>' +
"[CENTER]Вы ошиблись сервером. Подайте жалобу в разделе своего форума.[/CENTER]<br><br>" +
'[CENTER][COLOR=rgb(255,0,0)]Отказано, закрыто. [/COLOR][/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Качество докв',
content:
'[SIZE=4][COLOR=rgb(221,160,221)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER][/COLOR]<br><br>' +
"[CENTER]Пересоздайте жалобу и прикрепите туда доказательства в нормальном качестве[/CENTER]<br><br>" +
'[CENTER][COLOR=rgb(255,0,0)]Отказано, закрыто. [/COLOR][/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Док-ва предоставлены',
content:
'[SIZE=4][COLOR=rgb(221,160,221)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER][/COLOR]<br><br>' +
"[CENTER]Доказательства были предоставлены, наказание выдано верно. Нарушений со стороны администратора не найдено.[/CENTER]<br><br>" +
'[CENTER][COLOR=rgb(255,0,0)]Отказано, закрыто. [/COLOR][/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Док-ва предоставлены (в обжалование',
content:
'[SIZE=4][COLOR=rgb(221,160,221)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER][/COLOR]<br><br>' +
"[CENTER]Доказательства были предоставлены, наказание выдано верно. Нарушений со стороны администратора не найдено. Поробуйте обратиться в раздел [URL=/CENTERhttps://forum.blackrussia.online/forums/Обжалование-наказаний.1787/]'Обжалование наказаний'[/URLr>" +
'[CENTER][COLOR=rgb(255,0,0)]Отказано, закрыто. [/COLOR][/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Жалоба не по форме',
content:
'[SIZE=4][COLOR=rgb(221,160,221)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER][/COLOR]<br><br>' +
"[CENTER]Жалоба составлена не по форме. Создайте новую жалобу написан её по форме ниже. <br><br>" +
"[QUOTE][SIZE=4]1. Ваш Nick_Name:<br>2. Nick_Name администратора:<br>3. Дата выдачи/получения наказания:<br>4. Суть жалобы:<br>5. Доказательство: [/SIZE][/QUOTE][/CENTER]<br>"+
'[CENTER][COLOR=rgb(255,0,0)] Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Доква не в имгур япикс',
content:
'[SIZE=4][COLOR=rgb(221,160,221)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER][/COLOR]<br><br>' +
"[CENTER]Доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur). <br><br>" +
'[CENTER][COLOR=rgb(255,0,0)]Отказано, закрыто. [/COLOR][/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Отстутствуют доказательств',
content:
'[SIZE=4][COLOR=rgb(221,160,221)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER][/COLOR]<br><br>' +
"[CENTER]В вашей жалобе отсутствуют доказательства.<br><br>" +
'[CENTER][COLOR=rgb(255,0,0)]Отказано, закрыто. [/COLOR][/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Недостаточно доказательст',
content:
'[SIZE=4][COLOR=rgb(221,160,221)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER][/COLOR]<br><br>' +
"[CENTER]В вашей жалобе недостаточно доказательств на нарушение со стороный администратора.<br><br>" +
'[CENTER][COLOR=rgb(255,0,0)]Отказано, закрыто. [/COLOR][/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Технический раздел',
content:
'[SIZE=4][COLOR=rgb(221,160,221)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER][/COLOR]<br><br>' +
"[CENTER] Вам нужно обраться в [URL=https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9639-volgograd.1757/]'Раздел жалоб на Технических Специалистов'. [/URL][/CENTER]<br>" +
'[CENTER][COLOR=rgb(255,0,0)]Отказано, закрыто. [/COLOR][/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Более 48 часов',
content:
'[SIZE=4][COLOR=rgb(221,160,221)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER][/COLOR]<br><br>' +
"[CENTER]С момента выдачи наказания прошло более 48 часов.[/CENTER]<br><br>" +
'[CENTER][COLOR=rgb(255,0,0)]Отказано, закрыто. [/COLOR][/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
    {
title: 'Более 48 часов *нарушение*',
content:
'[SIZE=4][COLOR=rgb(221,160,221)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER][/COLOR]<br><br>' +
"[CENTER]С момента нарушения со стороны администратора прошло более 48 часов.[/CENTER]<br><br>" +
'[CENTER][COLOR=rgb(255,0,0)]Отказано, закрыто. [/COLOR][/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'отсутствует скриншот выдачи наказания.',
content:
'[SIZE=4][COLOR=rgb(221,160,221)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER][/COLOR]<br><br>' +
"[CENTER] Зайдите в игру и сделайте скриншот окна бана, после чего напишите новую жалобу.<br><br>" +
'[CENTER][COLOR=rgb(255,0,0)]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Передано ГА',
content:
'[SIZE=4][COLOR=rgb(221,160,221)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER][/COLOR]<br><br>' +
"[CENTER]Ваша жалоба передана на рассмотрение Главному Администратору - @Timofei_Oleinik . Ожидайте его ответа.<br><br>" ,
prefix: PIN_PREFIX,
status: true,
},
{
title: 'В обжалования',
content:
'[SIZE=4][COLOR=rgb(221,160,221)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER][/COLOR]<br><br>' +
"[CENTER]Внимательно ознакомившись с вашей жалобой, было решено, что вам нужно обраться в раздел [URL=https://forum.blackrussia.online/forums/Обжалование-наказаний.1787/]'Обжалование наказаний'.[/URL]<br><br>" +
'[CENTER][COLOR=rgb(255,0,0)]Отказано, закрыто. [/COLOR][/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Жалоба от 3 лица',
content:
'[SIZE=4][COLOR=rgb(221,160,221)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER][/COLOR]<br><br>' +
"[CENTER]Ваша жалоба составлена от 3-го лица.<br><br>" +
'[CENTER][COLOR=rgb(255,0,0)]Отказано, закрыто. [/COLOR][/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Доказательства отредактированы',
content:
'[SIZE=4][COLOR=rgb(221,160,221)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER][/COLOR]<br><br>' +
"[CENTER]Видеодоказательства, которые были отредактированы и на которых присутствует посторонняя музыка, неадекватная речь, нецензурные слова или выражения, могут быть не рассмотрены в качестве доказательств..<br><br>" +
'[CENTER][COLOR=rgb(255,0,0)]Отказано, закрыто. [/COLOR][/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Оскорбительная жалоба',
content:
'[SIZE=4][COLOR=rgb(221,160,221)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER][/COLOR]<br><br>' +
"[CENTER]В вашей жалобе имеется слова оскорбительного характера, данная тема рассмотрению не пожлежит.<br><br>" +
'[CENTER][COLOR=rgb(255,0,0)]Отказано, закрыто. [/COLOR][/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Не работают доказательства',
content:
'[SIZE=4][COLOR=rgb(221,160,221)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER][/COLOR]<br><br>' +
"[CENTER]Ссылка на ваши доказательства не работает, создайте новую тему с рабочей ссылкой на доказательства.<br><br>" +
'[CENTER][COLOR=rgb(255,0,0)]Отказано, закрыто. [/COLOR][/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Нарушений от адм нету',
content:
'[SIZE=4][COLOR=rgb(221,160,221)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER][/COLOR]<br><br>' +
"[CENTER]Нарушений со стороны администратора не найдено.[/CENTER]<br><br>" +
'[CENTER][COLOR=rgb(255,0,0)]Отказано, закрыто. [/COLOR][/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Замена наказания (Беседа проведена)',
content:
'[SIZE=4][COLOR=rgb(221,160,221)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER][/COLOR]<br><br>' +
"[CENTER]С администратором была проведена беседа, ваше наказание будет перевыдано. [/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Наказание снято',
content:
'[SIZE=4][COLOR=rgb(221,160,221)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER][/COLOR]<br><br>' +
"[CENTER]Ваше наказание было снято.<br><br>" +
'[CENTER][COLOR=rgb(255,0,0)]Закрыто. [/COLOR][/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Нету ссылки на жб',
content:
'[SIZE=4][COLOR=rgb(221,160,221)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER][/COLOR]<br><br>' +
"[CENTER]Создайте новую жалобу, где будет прикреплена ссылка на тему, в которой вас не устраивает вердикт. <br><br>" +
'[CENTER][COLOR=rgb(255,0,0)]Отказано, закрыто. [/COLOR][/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Нету /time',
content:
'[SIZE=4][COLOR=rgb(221,160,221)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER][/COLOR]<br><br>' +
"[CENTER]В вашей жалобе отсутствует /time.<br><br>" +
'[CENTER][COLOR=rgb(255,0,0)]Отказано, закрыто. [/COLOR][/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},

{
title: 'Жалоба оффтоп',
content:
'[SIZE=4][COLOR=rgb(221,160,221)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER][/COLOR]<br><br>' +
"[CENTER]Ваша тема никак не отностится к разделу жалобы на администрацию.<br><br>" +
'[CENTER][COLOR=rgb(255,0,0)]Отказано, закрыто. [/COLOR][/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Беседа с адм (снять наказание)',
content:
'[SIZE=4][COLOR=rgb(221,160,221)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER][/COLOR]<br><br>' +
"[CENTER]С администратором будет проведена беседа.<br>Ваше наказание будет снято в течение 24-х часов.[/CENTER]<br><br>" +
'[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Подделка докв',
content:
'[SIZE=4][COLOR=rgb(221,160,221)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER][/COLOR]<br><br>' +
"[CENTER]Ваши доказательства подделаны, форумный аккаунт будет заблокирован.[/CENTER]<br><br>" +
'[CENTER][COLOR=rgb(255,0,0)]Отказано, закрыто. [/COLOR][/CENTER][/FONT][/SIZE]',
prefix: WATCHED_PREFIX,
status: false,
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
addButton('Ответы', 'selectAnswer','border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0,0,255, 0.5)');

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