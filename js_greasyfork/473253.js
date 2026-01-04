// ==UserScript==
// @name         кураторам форума GRAND RUSSIA
// @namespace    http://forum.wh10621.web2.maze-host.ru
// @version      1.0
// @description  Идет тест
// @author       Iciro
// @match        http://forum.wh10621.web2.maze-host.ru/index.php*
// @include      http://forum.wh10621.web2.maze-host.ru/index.php/
// @icon         none
// @grant        none
// @license 	 MIT
// @downloadURL https://update.greasyfork.org/scripts/473253/%D0%BA%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%B0%D0%BC%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20GRAND%20RUSSIA.user.js
// @updateURL https://update.greasyfork.org/scripts/473253/%D0%BA%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%B0%D0%BC%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20GRAND%20RUSSIA.meta.js
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
const TEX_PREFIX = 13;
const buttons = [
{
	  title: '_____________________________________________? RolePlay Ситуации ?_____________________________________________ ',
	},
{
        title: 'RP ситуация Одобрена',
        content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша RP ситуация получает статус - [COLOR=#00FF00]Одобрено.[/CENTER][/COLOR]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
 {
        title: 'RP ситуация Отказана',
        content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша RP ситуация получает статус - [COLOR=#FF0000]Отказано[/COLOR]. Пожалуйста ознакомьтесь с закреплеными темами [COLOR=#FF0000]| Если вы не согласны напишите жалобу на администрацию[/CENTER][/COLOR]",
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
 {
	  title: '_____________________________________________? RolePlay Биография ?_____________________________________________ ',
     },
    {
        title: 'Биография Одобрена',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша РП биография получает статус - [Color=#00ff00]Одобрено.[/CENTER][/color]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
title: 'Биография (Мало информации)',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша РП биография получает статус - [Color=Red]Отказано.[/color]<br>Укажите больше информации в РП биографии[/CENTER]",
      prefix:UNACCEPT_PREFIX,
	  status: false,
     },
     {
title: 'Биография (Не совпал возраст)',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша РП биография получает статус - [Color=Red]Отказано.[/color]<br>В вашей РП биографии возраст и дата рождения не совпадают.[/CENTER]",
      prefix:UNACCEPT_PREFIX,
	  status: false,
    },
    {
           title: 'Биография (3 лицо)',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша РП биография получает статус - [Color=Red]Отказано.[/color]<br>Причиной отказа могло послужить создание биографии от 3-го лица.[/CENTER]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
title: 'Биография (Заголовок темы)',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша РП биография получает статус - [Color=Red]Отказано.[/color]<br>Причиной отказа могло послужить неправильное заполнение загловка темы.[/CENTER]" ,
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Биография отказана',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша РП биография получает статус - [Color=#ff0000]Отказано.[/color]<br>Причиной отказа могло послужить какое-либо нарушение из правил для составления RP Биографий.[/CENTER]",
	  status: false,
    },
 {
	  title: '_____________________________________________? Жалобы на игроков ?_____________________________________________ ',
	},
 {
      title: 'NonRP поведение',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br> [COLOR=#ff0000] 2.01 [/COLOR]. Запрещено поведение, нарушающее нормы процессов Role Play режима игры [Color=#ff0000] | Jail 25 минут[/COLOR].[/CENTER]<br>" +
	    "[CENTER][I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на GRAND RUSSIA [Color=#FFFF00] | Удачи [Color=#FFFFFF].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
 {
      title: 'СК',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет [COLOR=#ff0000]наказан[/COLOR] по данному пункту правил:<br> [COLOR=#ff0000] 2.16 [/COLOR].  4.1 SK  [Color=#ff0000] | Warn [/COLOR].[/CENTER]<br>" +
		"[CENTER][I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на GRAND RUSSIA[Color=#FFFF00] | Удачи [Color=#FFFFFF].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
{
      title: 'ДМ',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br> [COLOR=#ff0000] 2.19 [/COLOR]. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [Color=#ff0000] | Jail 60 минут[/COLOR].[/CENTER]<br>" +
		"[CENTER][I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на GRAND RUSSIA [Color=#FFFF00] | Удачи [Color=#FFFFFF].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
{
      title: 'ДБ',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br> [COLOR=#ff0000] 2.13 [/COLOR]. Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [Color=#ff0000] | Деморган на 30 минут.[/COLOR].[/CENTER]<br>" +
		"[CENTER][I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на GRAND RUSSIA [Color=#FFFF00] | Удачи [Color=#FFFFFF].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'MG',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br> [COLOR=#ff0000] 2.18 [/COLOR]. Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [Color=#ff0000] | Блокировка чата на 30 минут.[/COLOR].[/CENTER]<br>" +
		"[CENTER][I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на GRAND RUSSIA [Color=#FFFF00] |Удачи  [Color=#FFFFFF].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
 {
	  title: 'Флуд',
	  content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
		"[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br> [COLOR=#ff0000] 3.05 [/COLOR]. Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [Color=#ff0000] | Mute 30 минут[/COLOR].[/CENTER]<br>" +
		"[CENTER][I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA RolePlay [Color=#FFFF00] | Yellow [Color=#FFFFFF].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
	},
 ];
$(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
 
    // Добавление кнопок при загрузке страницы
    addButton('Закрыто', 'close');
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
    6 < hours && hours <= 12
      ? 'Доброе утро'
      : 12 < hours && hours <= 18
      ? 'Добрый день'
      : 18 < hours && hours <= 24
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