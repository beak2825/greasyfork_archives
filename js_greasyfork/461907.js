// ==UserScript==
// @name  Chilli - Обжалование наказание
// @namespace https://forum.blackrussia.online
// @version 0.0.3
// @description Наш
// @author Santa_Aelpee
// @match https://forum.blackrussia.online/threads/*
// @include https://forum.blackrussia.online/threads/
// @grant none
// @license MIT
// @collaborator FlorexTR
// @icon https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/461907/Chilli%20-%20%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%20%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/461907/Chilli%20-%20%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%20%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B5.meta.js
// ==/UserScript==
(function () {
'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const buttons = [
{
title: '-*- Отказ (Не по форме)',
content:
'[FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/COLOR][/FONT]<br><br>' +
"[FONT=Courier New]Благодарим Вас за потраченное время на обращение к нам в связи с ограничениями, наложенными на Ваш игровой аккаунт.[/FONT]<br>"+
"[FONT=Courier New][QUOTE][Color=#00FFFF]К несчастью, Вы использовали некорректную формулировку темы обращения, что не позволяет нам рассмотреть Ваше обращение.[/FONT]<br>"+
"[FONT=Courier New]Вы можете ознакомиться с правильной формулировкой темы в закрепленном сообщении данного раздела и повторно создать новую тему.[/QUOTE][/FONT]<br>"+
'[SIZE=17][FONT=Courier New][Color=Red]Тема была закрыта.',
prefix: WATCHED_PREFIX,
status: false,
},
{
title: '-*- Отказ (Соц Сети)',
content:
'[FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/COLOR][/FONT]<br><br>' +
"[FONT=Courier New]Благодарим Вас за потраченное время на обращение к нам в связи с ограничениями, наложенными на Ваш игровой аккаунт.[/FONT]<br><br>"+
"[FONT=Courier New][QUOTE][Color=#00FFFF]Мы сожалеем, но мы не можем принимать доказательства, размещенные в социальных сетях.[/FONT]<br>"+
"[FONT=Courier New]Но не волнуйтесь, у нас есть альтернативные варианты: Вы можете загрузить свои доказательства на известные фото-хостинги, такие как Imgur или PostIMG, или видео-хостинги, такие как Yandex, Google или YouTube, а также на другие доступные сервисы.[/FONT]<br><br>"+
"[FONT=Courier New]Как только вы загрузите свои доказательства на один из этих хостингов, создайте новую тему и мы с радостью её рассмотрим.[/QUOTE][/FONT]<br>"+
'[SIZE=17][FONT=Courier New][Color=Red]Тема была рассмотрена и закрыта.',
prefix: WATCHED_PREFIX,
status: false,
},
{
title: '-*- Отказ (Не готовы)',
content:
'[FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/COLOR][/FONT]<br><br>' +
"[FONT=Courier New]Благодарим Вас за потраченное время на обращение к нам в связи с ограничениями, наложенными на Ваш игровой аккаунт.[/FONT]<br><br>"+
"[FONT=Courier New][QUOTE][Color=#00FFFF]Мы внимательно изучили Ваше обращение, а также рассмотрели причину наложения ограничений на Ваш игровой аккаунт. К сожалению, после тщательного анализа мы не можем снизить наказание, наложенное на Ваш аккаунт.[/FONT]<br><br>"+
"[FONT=Courier New]Мы понимаем, что это может быть разочаровывающе, но наказание было наложено на основании наших правил, которые мы считаем важными для обеспечения безопасности и честной игры для всех наших пользователей. Мы хотели бы напомнить Вам, что правила проекта необходимо соблюдать, и прочтение их перед началом игры - обязательно.[/FONT]<br><br>"+
"[FONT=Courier New]Мы надеемся, что в будущем Вы будете более внимательны и осторожны, чтобы избежать нарушения правил проекта и получения наказаний.[/FONT]<br>"+
"[FONT=Courier New]Пожалуйста, примите во внимание, что создание дубликатов данной темы может повлечь за собой ограничение функционала Вашего аккаунта на нашем форуме.[/QUOTE][/FONT]<br><br>"+
'[SIZE=17][FONT=Courier New][Color=Red]Тема была рассмотрена и закрыта.',
prefix: WATCHED_PREFIX,
status: false,
},
{
title: '-*- Отказ (Нету докв)',
content:
'[FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/COLOR][/FONT]<br><br>' +
"[FONT=Courier New]Благодарим Вас за потраченное время на обращение к нам в связи с ограничениями, наложенными на Ваш игровой аккаунт.[/FONT]<br><br>"+
"[FONT=Courier New][QUOTE][Color=#00FFFF]Мы сожалеем, но мы не можем рассмотреть Ваше обращение, поскольку оно не содержит достаточных доказательств, подтверждающих Ваши слова.[/FONT]<br>"+
"[FONT=Courier New]Мы рекомендуем Вам приложить соответствующие доказательства к своему обращению и создать новую тему для дальнейшего рассмотрения Вашего вопроса.[/FONT]<br>"+
"[FONT=Courier New]Вы можете загрузить свои доказательства на известные фото-хостинги, такие как Imgur или PostIMG, или видео-хостинги, такие как Yandex, Google или YouTube, а также на другие доступные сервисы.[/QUOTE][/FONT]<br><br>"+
'[SIZE=17][FONT=Courier New][Color=Red]Тема была рассмотрена и закрыта.',
prefix: WATCHED_PREFIX,
status: false,
},
{
title: '-*- Отказ (НонрпОбман)',
content:
'[FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/COLOR][/FONT]<br><br>' +
"[FONT=Courier New]Благодарим Вас за потраченное время на обращение к нам в связи с ограничениями, наложенными на Ваш игровой аккаунт.[/FONT]<br><br>"+
"[FONT=Courier New][QUOTE][Color=#00FFFF]Мы внимательно изучили Ваше обращение, а также рассмотрели причину наложения ограничений на Ваш игровой аккаунт. К сожалению, мы вынуждены сообщить, что Ваш игровой аккаунт был ограничен за нарушение правила 2.05, связанного с обманом другого игрока.[/FONT]<br><br>"+
"[FONT=Courier New]Чтобы рассмотреть возможность снижения ограничений, мы настоятельно рекомендуем Вам договориться с пострадавшей стороной обо всем возмещении, включая имущество, которое Вы получили неправомерно.[/FONT]<br>"+
"[FONT=Courier New]После достижения соглашения, создайте новую тему и приложите доказательства, чтобы мы могли рассмотреть Ваше обращение.[/FONT]<br><br>"+
"[FONT=Courier New]Пожалуйста, примите во внимание, что создание дубликатов данной темы может повлечь за собой ограничение функционала Вашего аккаунта на нашем форуме.[/QUOTE][/FONT]<br><br>"+
'[SIZE=17][FONT=Courier New][Color=Red]Тема была рассмотрена и закрыта.',
prefix: WATCHED_PREFIX,
status: false,
},
{
title: '-*- Отказ (Дубликат)',
content:
'[FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/COLOR][/FONT]<br><br>' +
"[FONT=Courier New]Благодарим Вас за потраченное время на обращение к нам в связи с ограничениями, наложенными на Ваш игровой аккаунт.[/FONT]<br><br>"+
"[FONT=Courier New][QUOTE][Color=#00FFFF]Мы заметили, что Вы уже обращались ранее с похожим вопросом и получили ответ от нашей администрации.[/FONT]<br>"+
"[FONT=Courier New]Чтобы избежать дальнейших неудобств, мы просим Вас воздержаться от создания дубликатов данного обращения.[/FONT]<br>"+
"[FONT=Courier New]В противном случае, Ваш форумный аккаунт может быть ограничен.[/QUOTE][/FONT]<br><br>"+
'[SIZE=17][FONT=Courier New][Color=Red]Тема была рассмотрена и закрыта.',
prefix: WATCHED_PREFIX,
status: false,
},
{
title: '-*- Отказ (Тех)',
content:
'[FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/COLOR][/FONT]<br><br>' +
"[FONT=Courier New]Благодарим Вас за потраченное время на обращение к нам в связи с ограничениями, наложенными на Ваш игровой аккаунт.[/FONT]<br><br>"+
"[FONT=Courier New][QUOTE][Color=#00FFFF]Ваш аккаунт был ограничен нашим техническим специалистом. [/FONT]<br>"+
"[FONT=Courier New]Если вы желаете получить снижение ограничений, мы рекомендуем обратиться в соответствующий раздел 'Жалобы на технических специалистов' и составить грамотно оформленное обращение.[/QUOTE][/COLOR] [/FONT]<br>"+
"[FONT=Courier New]Вот ссылка на этот раздел: <br><br>"+
"[URL='https://forum.blackrussia.online/index.php?forums/Сервер-№21-chilli.1202/'][кликабельная ссылка][/URL].[/FONT]<br><br>"+
'[SIZE=17][FONT=Courier New][Color=Red]Тема была рассмотрена и закрыта.',
prefix: WATCHED_PREFIX,
status: false,
},
{
title: '-*- Отказ (Адм жб)',
content:
'[FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/COLOR][/FONT]<br><br>' +
"[FONT=Courier New]Благодарим Вас за потраченное время на обращение к нам в связи с ограничениями, наложенными на Ваш игровой аккаунт.[/FONT]<br><br>"+
"[FONT=Courier New][QUOTE][Color=#00FFFF]]Мы сожалеем о том, что ваш аккаунт был ограничен, однако данный раздел форума предназначен только для обжалования уже выданных наказаний.[/FONT]<br>"+
"[FONT=Courier New]Если вы не согласны с вынесенным решением, мы настоятельно рекомендуем вам обратиться в раздел жалоб на администрацию.[/FONT]<br>"+
"[FONT=Courier New]При составлении обращения, пожалуйста, следуйте формату, указанному в ссылке которую мы оставили для вас ниже.[/QUOTE][/COLOR][/FONT]<br>"+
"[URL='https://forum.blackrussia.online/index.php?forums/Жалобы-на-администрацию.992/'][Кликабельная ссылка][/URL]<br><br>"+
'[SIZE=17][FONT=Courier New][Color=Red]Тема была рассмотрена и закрыта.',
prefix: WATCHED_PREFIX,
status: false,
},
{
title: '-*- Отказ (Раздел)',
content:
'[FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/COLOR][/FONT]<br><br>' +
"[FONT=Courier New]Благодарим Вас за потраченное время на обращение к нам в связи с ограничениями, наложенными на Ваш игровой аккаунт.[/FONT]<br><br>"+
"[FONT=Courier New][QUOTE][Color=#00FFFF]После тщательного рассмотрения Вашего обращения мы вынуждены проинформировать Вас о том, что данное обращение не относится к данному разделу.[/QUOTE][/FONT]<br>"+
"[FONT=Courier New]Раздел 'Обжалование наказаний' предназначен исключительно для рассмотрения уже вынесенных наказаний, которые подлежат пересмотру.[/FONT]<br>"+
"[FONT=Courier New]Пожалуйста, примите во внимание, что создание дубликатов данной темы может повлечь за собой ограничение функционала Вашего аккаунта на нашем форуме.[/FONT]<br><br>"+
'[SIZE=17][FONT=Courier New][Color=Red]Тема была рассмотрена и закрыта.',
prefix: WATCHED_PREFIX,
status: false,
},
{
title: '｢ Для ГА 」',
content:
'[FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/COLOR][/FONT]<br><br>' +
"[Color=lightgray]Обжалование передано Главному Администратору.[/color]<br>"+
"[Color=lightsalmon][size=4][icode]Ожидайте окончательного ответа и не создавайте дубликатов.[/icode]<br>"+
'[color=orange][size=4][icode]На рассмотрение[/icode][icode]Главному Администратору',
prefix: GA_PREFIX,
status: true,
},
{
title: '｢ Для СА 」',
content:
'[FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/COLOR][/FONT]<br><br>' +
"[Color=lightgray]Обжалование передано Специальному Администратору.[/color]<br>"+
"[Color=lightsalmon][size=4][icode]Ожидайте окончательного ответа и не создавайте дубликатов.[/icode]<br>"+
'[color=orange][size=4][icode]На рассмотрение[/icode][icode]Специальному Администратору',
prefix: GA_PREFIX,
status: true,
},
{
title: '｢ Снизить 」',
content:
'[FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/COLOR][/FONT]<br><br>' +
"[Color=lightgray]Обжалование одобрено и ваше наказание будет снижено/снято в течение 24 часов.[/color]<br>"+
"[Color=lightsalmon][size=4][icode]Ознакомитесь с правилами сервера и не нарушайте впредь.[/icode]<br>"+
'[color=green][size=4][icode]Одобрено[/icode][icode]Закрыто',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '｢ ЖБ на игроков 」',
content:
'[FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/COLOR][/FONT]<br><br>' +
"[Color=lightgray]Вы ошиблись разделом вам нужно обратиться в раздел Жалобы на игроков.[/color]<br>"+
"[Color=lightsalmon][size=4][icode]Приятный игры на сервера CHILLI.[/icode]<br>"+
'[color=red][size=4][icode]Отказано[/icode][icode]Закрыто',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: '｢ ЖБ на админов 」',
content:
'[FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/COLOR][/FONT]<br><br>' +
"[Color=lightgray]Вы ошиблись разделом вам нужно обратиться в раздел Жалобы на администрацию.[/color]<br>"+
"[Color=lightsalmon][size=4][icode]Приятный игры на сервера CHILLI.[/icode]<br>"+
'[color=red][size=4][icode]Отказано[/icode][icode]Закрыто',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: '｢ ЖБ на теха 」',
content:
'[FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/COLOR][/FONT]<br><br>' +
"[Color=lightgray]Вы ошиблись разделом вам нужно обратиться в Технический раздел сервера.[/color]<br>"+
"[Color=lightsalmon][size=4][icode]Приятный игры на сервера CHILLI.[/icode]<br>"+
'[color=red][size=4][icode]Отказано[/icode][icode]Закрыто',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: '｢ Ошибка сервера 」',
content:
'[FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/COLOR][/FONT]<br><br>' +
"[Color=lightgray]Вы ошиблись сервером.[/color]<br>"+
"[Color=lightsalmon][size=4][icode]Жалоба будет перемещена в нужный раздел.[/icode]<br>"+
'[color=gray][size=4][icode]Ожидание[/icode][icode]Перемещено',
prefix: CLOSE_PREFIX,
status: false,
}
];
$(document).ready(() => {
// Загрузка скрипта для обработки шаблонов
$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

// Добавление кнопок при загрузке страницы
addButton('Расширенное меню (ОБЖ)', 'selectAnswer');


// Поиск информации о теме
const threadData = getThreadData();

$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
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
:
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