// ==UserScript==
// @name         кураторы форумa общий скрипт black russia
// @namespace    https://forum.blackrussia.online
// @version      3.1
// @description  author Lemonte
// @author       Lemonte
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license    MIT
// @icon         https://sun9-76.userapi.com/impg/rEBGQfiaFZnbUofS8UOFXmokbnWSxJaLR-1Ycg/rxEn_aPc0wc.jpg?size=530x530&quality=95&sign=9ca94b62b95b588d510bc19a4290a530&type=album
// @downloadURL https://update.greasyfork.org/scripts/463606/%D0%BA%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D1%84%D0%BE%D1%80%D1%83%D0%BCa%20%D0%BE%D0%B1%D1%89%D0%B8%D0%B9%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20black%20russia.user.js
// @updateURL https://update.greasyfork.org/scripts/463606/%D0%BA%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D1%84%D0%BE%D1%80%D1%83%D0%BCa%20%D0%BE%D0%B1%D1%89%D0%B8%D0%B9%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20black%20russia.meta.js
// ==/UserScript==
(function () {
  'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 6; // Prefix that will be set when thread solved
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const buttons = [
{
	  title: 'Отказано',
	  content:
		'[CENTER][FONT=times new roman]{{ greeting }}<br>'+
        'Рассмотрел Ваше заявления и присвоил ему статус: [COLOR=rgb(235, 107, 86)]Отказано[/COLOR], т.к .<br>'+
        ' C уважением Подполковник Batya Evans.[/FONT][/CENTER]',
	},
 
    {
	  title: 'Отказано перевод',
	  content:
		'[CENTER][FONT=times new roman]{{ greeting }}<br>'+
        'Рассмотрел Ваше заявления на перевод и присвоил ему статус: [COLOR=rgb(235, 107, 86)]Отказано[/COLOR].<br>'+
        'Возможные причины отказа: У вас нет звания, Нет /time на скрине, и вы пытаетесь перевестись с организации с которой нет перевода.<br>'+
        ' C уважением Подполковник Batya Evans.[/FONT][/CENTER]',
	},
 
 
{
	  title: 'нет /time',
	  content:
		'[CENTER][FONT=times new roman]{{ greeting }}<br>'+
        'Рассмотрел Ваше заявления и присвоил ему статус: [COLOR=rgb(235, 107, 86)]Отказано[/COLOR], т.к не вижу /time на скринах.<br>'+
        ' C уважением Подполковник Batya Evans.[/FONT][/CENTER]',
	},
 
    {
	  title: 'Отказ восстановление',
	  content:
		'[CENTER][FONT=times new roman]{{ greeting }}<br>'+
        'Рассмотрел Ваше заявления на восстановление и присвоил ему статус: [COLOR=rgb(235, 107, 86)]Отказано[/COLOR], т.к прошло больше 30 дней.<br>'+
        ' C уважением Подполковник Batya Evans.[/FONT][/CENTER]',
	},
 
        {
	  title: 'Отказ жалобы',
	  content:
		'[CENTER][FONT=times new roman]{{ greeting }}<br>'+
        'Внимательно рассмотрев вашу жалобу присвоил ей статус: [COLOR=rgb(235, 107, 86)]Отказано[/COLOR]. Т.к не достаточно доказательств.<br>'+
        ' C уважением Подполковник Batya Evans.[/FONT][/CENTER]',
	},	
    	
 	
 
];
 
$(document).ready(() => {
// Загрузка скрипта для обработки шаблонов
$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
// Добавление кнопок при загрузке страницы
addButton('Отказ', 'selectAnswer');
 
// Поиск информации о теме
const threadData = getThreadData();
 
$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
$('button#watched').click(() => editThreadData(WATCHED_PREFIX, false));
$('button#closed').click(() => editThreadData(CLOSE_PREFIX, false));
 
$(`button#selectAnswer`).click(() => {
  XF.alert(buttonsMarkup(buttons), null, 'Добавьте ответ:');
  buttons.forEach((btn, id) => {
	$(`button#answers-${id}`).click(() => pasteContent(id, threadData));
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
 
function pasteContent(id, data = {}) {
const template = Handlebars.compile(buttons[id].content);
if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();
 
$('span.fr-placeholder').empty();
$('div.fr-element.fr-view p').append(template(data));
$('a.overlay-titleCloser').trigger('click');
}
 
// Приветствие и время суток
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
	  : 11 < hours && hours <= 17
	  ? 'Добрый день'
	  : 17 < hours && hours <= 23
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
            discussion_open: 1,
			sticky: 1,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
	}
	if(prefix == UNACCEPT_PREFIX || prefix == ACCEPT_PREFIX || prefix == CLOSE_PREFIX || prefix == WATCHED_PREFIX) {
		moveThread(prefix, 230);
	}
}
 
function moveThread(prefix, type) {
  }
})();