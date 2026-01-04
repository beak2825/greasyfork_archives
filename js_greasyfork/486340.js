// // ==UserScript==
// @name Script by Staffi
// @namespace https://forum.blackrussia.online
// @version 1.2
// @description Always remember who you are!
// @author Ksenia
// @match https://forum.blackrussia.online/threads/*
// @include https://forum.blackrussia.online/threads/
// @grant none
// @license MIT
// @collaborator keitashi
// @icon https://icons.iconarchive.com/icons/google/noto-emoji-people-stories/256/10814-woman-fairy-light-skin-tone-icon.png
// @downloadURL https://update.greasyfork.org/scripts/486340/Script%20by%20Staffi.user.js
// @updateURL https://update.greasyfork.org/scripts/486340/Script%20by%20Staffi.meta.js
// ==/UserScript==

(function () {
'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7; // Prefix that will be set when thread closes.
const SA_PREFIX = 11;
const GA_PREFIX = 12;
const V_PREFIX = 1;
const buttons = [
{
title: '---------------------------------------------------------------------Перенаправление-----------------------------------------------------------------------',
},

{
      title: 'На рассмотрении',
      content:
        '[LEFT][SIZE=5][FONT=times new roman][I][COLOR=rgb(255, 0, 0)]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/I][/FONT][/SIZE]<br><br>' +
        "[I][SIZE=5][COLOR=rgb(209, 213, 216)][FONT=times new roman]Ваше обжалование взято на рассмотрение.[/FONT][/COLOR][/SIZE][/I]<br><br>" +
        "[FONT=times new roman][COLOR=#d1d5d8][SIZE=5][I]Поданная заявка не гарантирует одобрения со стороны руководства.<br>" +
        '[SIZE=5][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Не нужно создавать копии этой жалобы, ожидайте ответа в этой теме.[/COLOR][/I][/FONT][/SIZE][/LEFT]',
      prefix: PIN_PREFIX,
      status: true,
},

{
      title: 'Передано ГА',
      content:
        '[LEFT][SIZE=5][FONT=times new roman][I][COLOR=rgb(255, 0, 0)]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/I][/FONT][/SIZE]<br><br>' +
        "[I][SIZE=5][COLOR=rgb(209, 213, 216)][FONT=times new roman]Ваше обжалование взято на рассмотрение.[/FONT][/COLOR][/SIZE][/I]<br>" +
        "[FONT=times new roman][COLOR=#d1d5d8][SIZE=5][I]Поданная заявка не гарантирует одобрения со стороны руководства.<br>" +
        "[SIZE=5][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Не нужно создавать копии этой жалобы, ожидайте ответа в этой теме.[/COLOR][/FONT][/SIZE]<br><br>"+
        '[COLOR=rgb(209, 213, 216)][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=5][I]Передано Главному Администратору @Roma_Clever.[/I][/SIZE][/FONT][/COLOR][/LEFT]',
      prefix: GA_PREFIX,
      status: true,
},

{
title: 'Теху',
content:
'[LEFT][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=5][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
"[SIZE=5][FONT=times new roman][I][COLOR=rgb(209, 213, 216)] Вам было выдано наказание Техническим специалистом, вы можете написать жалобу здесь: [URL='https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9640-voronezh.1799/']*Нажмите сюда*[/URL][/COLOR][/I][/FONT][/SIZE]<br>" +
"[SIZE=5][FONT=times new roman][COLOR=rgb(209, 213, 216)][I]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/COLOR][/FONT][/SIZE]<br><br>" +
'[COLOR=rgb(209, 213, 216)][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=5][I]Закрыто.[/I][/SIZE][/COLOR][/FONT][/COLOR][/LEFT]',
prefix: CLOSE_PREFIX,
status: false,
},

{
title: '-----------------------------------------------------------------------Дополнительные-----------------------------------------------------------------------',
},

{
      title: 'Смена Nick_Name',
      content:
        '[LEFT][SIZE=5][FONT=times new roman][I][COLOR=rgb(255, 0, 0)]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/I][/FONT][/SIZE]<br><br>' +
        "[I][SIZE=5][COLOR=rgb(209, 213, 216)][FONT=times new roman] Аккаунт разблокиован.[/FONT][/COLOR][/SIZE][/I]<br>" +
        "[FONT=times new roman][I][SIZE=5][COLOR=rgb(209, 213, 216)] У вас есть 24 часа на смену Nick_Name. В противном случае ваш аккаунт будет [COLOR=#f00]заблокирован[/COLOR] навсегда.[/FONT][/COLOR][/SIZE][/I]<br><br>" +
        '[SIZE=5][FONT=times new roman][I][COLOR=rgb(209, 213, 216)] На рассмотрении, ожидайте ответа в этой теме.[/COLOR][/I][/FONT][/SIZE][/LEFT]',
      prefix: PIN_PREFIX,
      status: true,
},

{
title: 'Нрп обман отказ',
content:
'[LEFT][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=5][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
"[SIZE=5][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Обжалование в вашу пользу должен писать игрок, которого вы обманули. В доказательствах должны иметься: окно блокировки вашего аккаунта, переписка с обманутым игроком, где вы решили на какую компенсацию он согласен и ваше сообщение, в котором вы признаете совершенную ошибку и впредь обязуетесь не повторять ее. После всего этого главная администрация рассмотрит обжалование, но это не гарантирует того, что вас обжалуют.[/COLOR][/I][/FONT][/SIZE]<br><br>" +
"[SIZE=5][FONT=times new roman][COLOR=rgb(209, 213, 216)][I]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/COLOR][/FONT][/SIZE]<br><br>" +
'[COLOR=rgb(209, 213, 216)][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=5][I]Отказано.[/I][/SIZE][/COLOR][/FONT][/COLOR][/LEFT]',
prefix: UNACCEPT_PREFIX,
status: false,
},

{
title: 'Одобрение после разблокировки',
content:
'[LEFT][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=5][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
"[SIZE=5][FONT=times new roman][I][COLOR=rgb(209, 213, 216)] Ваш аккаунт будет [COLOR=#00CC00]разблокирован[/COLOR], впредь больше не нарушайте.[/COLOR][/I][/FONT][/SIZE]<br><br>" +
'[COLOR=#00CC00][FONT=times new roman][SIZE=5][I]Одобрено.[/I][/SIZE][/COLOR][/FONT][/LEFT]',
prefix: ACCEPT_PREFIX,
status: false,
},

{
title: '-----------------------------------------------------------------------Одобрено-----------------------------------------------------------------------',
},

{
title: 'Одобрено',
content:
'[LEFT][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=5][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
"[SIZE=5][FONT=times new roman][I][COLOR=rgb(209, 213, 216)] Обжалование было рассмотрено и одобрено.[/COLOR][/I][/FONT][/SIZE]<br>" +
"[FONT=times new roman][COLOR=#d1d5d8][SIZE=5][I]Ваше наказание будет снято/снижено в течение 24-ёх часов.<br><br>" +
'[COLOR=#00CC00][FONT=times new roman][SIZE=5][I]Одобрено.[/I][/SIZE][/COLOR][/FONT][/COLOR][/LEFT]',
prefix: ACCEPT_PREFIX,
status: false,
},



{
title: '-----------------------------------------------------------------------Отказано-----------------------------------------------------------------------',
},

{
title: 'Отказано',
content:
'[LEFT][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=5][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
"[SIZE=5][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]В обжаловании отказано.[/COLOR][/I][/FONT][/SIZE]<br>" +
"[FONT=times new roman][COLOR=#d1d5d8][SIZE=5][I]Поданная заявка не гарантирует одобрения со стороны руководства.<br>" +
"[SIZE=5][FONT=times new roman][COLOR=rgb(209, 213, 216)][I]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/COLOR][/FONT][/SIZE]<br><br>" +
'[COLOR=rgb(209, 213, 216)][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=5][I]Отказано.[/I][/SIZE][/COLOR][/FONT][/COLOR][/LEFT]',
prefix: UNACCEPT_PREFIX,
status: false,
},

{
title: 'Соц сети',
content:
'[LEFT][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=5][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
"[SIZE=5][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Доказательства в социальных сетях и т.д. не принимаются. Загрузите доказательства на фото-видео хостинги YouTube,Imgur, Yapx и так далее.[/COLOR][/I][/FONT][/SIZE]<br>" +
"[FONT=times new roman][COLOR=#d1d5d8][SIZE=5][I]В обжаловании отказано.<br>" +
"[SIZE=5][FONT=times new roman][COLOR=rgb(209, 213, 216)][I]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/COLOR][/FONT][/SIZE]<br><br>" +
'[COLOR=rgb(209, 213, 216)][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=5][I]Отказано.[/I][/SIZE][/COLOR][/FONT][/COLOR][/LEFT]',
prefix: UNACCEPT_PREFIX,
status: false,
},

{
title: 'Не готовы снизить',
content:
'[LEFT][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=5][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
"[SIZE=5][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Администрация сервера не готова снизить вам наказание. Вы сами виноваты в содеянном.[/COLOR][/I][/FONT][/SIZE]<br><br>" +
"[FONT=times new roman][COLOR=#d1d5d8][SIZE=5][I]Поданная заявка не гарантирует одобрения со стороны руководства.<br>" +
"[SIZE=5][FONT=times new roman][COLOR=rgb(209, 213, 216)][I]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/COLOR][/FONT][/SIZE]<br><br>" +
'[COLOR=rgb(209, 213, 216)][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=5][I]Отказано.[/I][/SIZE][/COLOR][/FONT][/COLOR][/LEFT]',
prefix: UNACCEPT_PREFIX,
status: false,
},

{
title: '3 дня',
content:
'[LEFT][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=5][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
"[SIZE=5][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]С момента получения наказания прошло более 72 часов, поэтому доказательства запрошены быть не могут.[/COLOR][/I][/FONT][/SIZE]<br>" +
"[FONT=times new roman][COLOR=#d1d5d8][SIZE=5][I] В обжаловании отказано.<br>" +
"[SIZE=5][FONT=times new roman][COLOR=rgb(209, 213, 216)][I]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/COLOR][/FONT][/SIZE]<br><br>" +
'[COLOR=rgb(209, 213, 216)][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=5][I]Отказано.[/I][/SIZE][/COLOR][/FONT][/COLOR][/LEFT]',
prefix: UNACCEPT_PREFIX,
status: false,
},

{
title: 'Окно бана',
content:
'[LEFT][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=5][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
"[SIZE=5][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Зайдите в игру и сделайте скрин окна с баном после чего, заново напишите жалобу.[/COLOR][/I][/FONT][/SIZE]<br><br>" +
"[FONT=times new roman][COLOR=#d1d5d8][SIZE=5][I]Поданная заявка не гарантирует одобрения со стороны руководства.<br>" +
"[SIZE=5][FONT=times new roman][COLOR=rgb(209, 213, 216)][I]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/COLOR][/FONT][/SIZE]<br><br>" +
'[COLOR=rgb(209, 213, 216)][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=5][I]Закрыто.[/I][/SIZE][/COLOR][/FONT][/COLOR][/LEFT]',
prefix: CLOSE_PREFIX,
status: false,
},

{
title: 'Дублирование',
content:
'[LEFT][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=5][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
"[SIZE=5][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ответ вам уже был дан в предыдущей теме.[/COLOR][/I][/FONT][/SIZE]<br>" +
"[SIZE=5][FONT=times new roman][COLOR=rgb(209, 213, 216)][I]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/COLOR][/FONT][/SIZE]<br><br>" +
"[FONT=times new roman][COLOR=#d1d5d8][SIZE=5][I]Поданная заявка не гарантирует одобрения со стороны руководства.<br><br>" +
'[COLOR=rgb(209, 213, 216)][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=5][I]Закрыто.[/I][/SIZE][/COLOR][/FONT][/COLOR][/LEFT]',
prefix: CLOSE_PREFIX,
status: false,
},


{
title: 'Не подлежит обж',
content:
'[LEFT][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=5][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
"[SIZE=5][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Данное нарушение не подлежит обжалованию, отказано.[/COLOR][/I][/FONT][/SIZE]<br>" +
"[SIZE=5][FONT=times new roman][COLOR=rgb(209, 213, 216)][I]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/COLOR][/FONT][/SIZE]<br><br>" +
'[COLOR=rgb(209, 213, 216)][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=5][I]Отказано.[/I][/SIZE][/COLOR][/FONT][/COLOR][/LEFT]',
prefix: UNACCEPT_PREFIX,
status: false,
},

{
title: 'Минимальное нак',
content:
'[LEFT][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=5][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
"[SIZE=5][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Вам было выдано минимальное наказание, обжалованию не подлежит.[/COLOR][/I][/FONT][/SIZE]<br>" +
"[SIZE=5][FONT=times new roman][COLOR=rgb(209, 213, 216)][I]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/COLOR][/FONT][/SIZE]<br><br>" +
'[COLOR=rgb(209, 213, 216)][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=5][I]Отказано.[/I][/SIZE][/COLOR][/FONT][/COLOR][/LEFT]',
prefix: UNACCEPT_PREFIX,
status: false,
},

{
title: 'Не по форме',
content:
'[LEFT][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=5][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
"[SIZE=5][FONT=times new roman][I][COLOR=rgb(209, 213, 216)] Ваше обжалование составлено не по форме, ознакомьтесь с правилами подачи обжалований:[URL='https://forum.blackrussia.online/forums/Правила-подачи-жалоб.202/']*Кликабельно*[/URL][/COLOR][/I][/FONT][/SIZE]<br>" +
"[SIZE=5][FONT=times new roman][COLOR=rgb(209, 213, 216)][I]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/COLOR][/FONT][/SIZE]<br><br>" +
'[COLOR=rgb(209, 213, 216)][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=5][I]Отказано.[/I][/SIZE][/COLOR][/FONT][/COLOR][/LEFT]',
prefix: UNACCEPT_PREFIX,
status: false,
},

{
title: 'Нет докв',
content:
'[LEFT][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=5][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
"[SIZE=5][FONT=times new roman][I][COLOR=rgb(209, 213, 216)] Отсутствуют доказательства для рассмотрения вашей жалобы.[/I][/FONT][/SIZE][/COLOR]<br>" +
"[FONT=times new roman][COLOR=#d1d5d8][SIZE=5][I]Прикрепите доказательсва в хорошем качестве на разрешенных платформах (Yapx/Imgur/YouTube/ImgBB).<br>" +
"[SIZE=5][FONT=times new roman][COLOR=rgb(209, 213, 216)][I]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/COLOR][/FONT][/SIZE]<br><br>" +
'[COLOR=rgb(209, 213, 216)][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=5][I]Закрыто.[/I][/SIZE][/COLOR][/FONT][/COLOR][/LEFT]',
prefix: CLOSE_PREFIX,
status: false,
},

{
title: 'Нет доступа',
content:
'[LEFT][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=5][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
"[SIZE=5][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваши доказательства не доступны к просмотру. Загрузите доказательства на фото-видео хостинги YouTube,Imgur, Yapx и так далее.[/COLOR][/I][/FONT][/SIZE]<br><br>" +
"[FONT=times new roman][COLOR=#d1d5d8][SIZE=5][I]Поданная заявка не гарантирует одобрения со стороны руководства.<br>" +
"[SIZE=5][FONT=times new roman][COLOR=rgb(209, 213, 216)][I]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/COLOR][/FONT][/SIZE]<br><br>" +
'[COLOR=rgb(209, 213, 216)][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=5][I]Закрыто.[/I][/SIZE][/COLOR][/FONT][/COLOR][/LEFT]',
prefix: CLOSE_PREFIX,
status: false,
},

{
title: 'Жалоба на рассмтр',
content:
'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
"[I][SIZE=4][FONT=times new roman][COLOR=rgb(209, 213, 216)]Ваша жалоба уже взята на рассмотрение, за создание дубликатов этой темы ваш форумный аккаунт может быть заблокирован.[/COLOR][/FONT][/SIZE][/I]<br><br>" +
'[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
prefix: CLOSE_PREFIX,
status: false,
},

{
title: 'Выдано верно',
content:
'[LEFT][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=5][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
"[SIZE=5][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Нарушений со стороны администратора нет. Наказание выдано верно.[/COLOR][/I][/FONT][/SIZE]<br>" +
"[SIZE=5][FONT=times new roman][I][COLOR=rgb(209, 213, 216)] В обжаловании отказано. [/COLOR][/I][/FONT][/SIZE]<br>" +
"[FONT=times new roman][COLOR=#d1d5d8][SIZE=5][I]Поданная заявка не гарантирует одобрения со стороны руководства.<br>" +
"[SIZE=5][FONT=times new roman][COLOR=rgb(209, 213, 216)][I]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/COLOR][/FONT][/SIZE]<br><br>" +
'[COLOR=rgb(209, 213, 216)][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=5][I]Отказано.[/I][/SIZE][/COLOR][/FONT][/COLOR][/LEFT]',
prefix: UNACCEPT_PREFIX,
status: false,
},

];


$(document).ready(() => {
// Загрузка скрипта для обработки шаблонов
$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');


// Добавление кнопок при загрузке страницы
addButton('Закрыто', 'close');
addButton('На рассмотрение', 'pin');
addButton('Одобрено', 'accepted');
addButton('Отказано', 'unaccept');
addButton('Ответы', 'selectAnswer');



// Поиск информации о теме
const threadData = getThreadData();


$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
$('button#close').click(() => editThreadData(CLOSE_PREFIX, false));


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
method:
  
'POST',
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