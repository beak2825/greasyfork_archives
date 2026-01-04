// ==UserScript==
// @name         BLACK RUSSIA VOLGOGRAD
// @namespace    https://forum.blackrussia.online
// @version      1.0
// @description  Проверка отчетов для замов и лд.
// @author       Charles Addams
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @grant        none
// @license 	 MIT
// @collaborator Basis of Antonio Carrizo and consultant Rosenfeld
// @icon https://icons.iconarchive.com/icons/thesquid.ink/free-flat-sample/128/support-icon.png
// @copyright 2022, BLACK RUSSIA (https://vk.com/blackrussia.online)
// @downloadURL https://update.greasyfork.org/scripts/463492/BLACK%20RUSSIA%20VOLGOGRAD.user.js
// @updateURL https://update.greasyfork.org/scripts/463492/BLACK%20RUSSIA%20VOLGOGRAD.meta.js
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
	  title: 'Одобрено сержант',
	  content:
		'[CENTER][FONT=times new roman]{{ greeting }}<br>'+
        'Рассмотрел Ваше заявления на должность Сержанта [3] и присвоил ему статус: [COLOR=rgb(97, 189, 109)]Одобрено[/COLOR]. Ждем вас в холле офиса ФСБ.<br>'+
        ' C уважением Подполковник ФСБ Charles Addams.[/FONT][/CENTER]',
        
	},

    	{
	  title: 'Одобрено жалоба',
	  content:
		'[CENTER][FONT=times new roman]{{ greeting }}<br>'+
        'Внимательно рассмотрев вашу жалобу присвоил ей статус: [COLOR=rgb(97, 189, 109)]Одобрено[/COLOR]. Сотрудник будет наказан.<br>'+
        ' C уважением Подполковник ФСБ Charles Addams.[/FONT][/CENTER]',

	},

    {
    	  title: 'Одобрено для перевод',
	  content:
		'[CENTER][FONT=times new roman]{{ greeting }}<br>'+
        'Рассмотрел Ваше заявления на перевод и присвоил ему статус: [COLOR=rgb(97, 189, 109)]Одобрено[/COLOR], на звание . Ждем вас в холле офиса ФСБ.<br>'+
        ' C уважением Подполковник ФСБ Charles Addams.[/FONT][/CENTER]',

	},

 	{
	  title: 'Отказано',
	  content:
		'[CENTER][FONT=times new roman]{{ greeting }}<br>'+
        'Рассмотрел Ваше заявления и присвоил ему статус: [COLOR=rgb(235, 107, 86)]Отказано[/COLOR], т.к .<br>'+
        ' C уважением Подполковник ФСБ Charles Addams.[/FONT][/CENTER]',
	},

    {
	  title: 'Отказано перевод',
	  content:
		'[CENTER][FONT=times new roman]{{ greeting }}<br>'+
        'Рассмотрел Ваше заявления на перевод и присвоил ему статус: [COLOR=rgb(235, 107, 86)]Отказано[/COLOR].<br>'+
        'Возможные причины отказа: У вас нет звания звания Старшина[4], Нет /time на скрине, и вы пытаетесь перевестись с ФСИНА.<br>'+
        ' C уважением Подполковник ФСБ Charles Addams.[/FONT][/CENTER]',
	},


{
	  title: 'нет /time',
	  content:
		'[CENTER][FONT=times new roman]{{ greeting }}<br>'+
        'Рассмотрел Ваше заявления и присвоил ему статус: [COLOR=rgb(235, 107, 86)]Отказано[/COLOR], т.к не вижу /time на скринах.<br>'+
        ' C уважением Подполковник ФСБ Charles Addams.[/FONT][/CENTER]',
	},

    {
	  title: 'Отказ восстановление',
	  content:
		'[CENTER][FONT=times new roman]{{ greeting }}<br>'+
        'Рассмотрел Ваше заявления на восстановление и присвоил ему статус: [COLOR=rgb(235, 107, 86)]Отказано[/COLOR], т.к с момента вашего увольнения не прошло 30 дней.<br>'+
        ' C уважением Подполковник ФСБ Charles Addams.[/FONT][/CENTER]',
	},

        {
	  title: 'Отказ жалобы',
	  content:
		'[CENTER][FONT=times new roman]{{ greeting }}<br>'+
        'Внимательно рассмотрев вашу жалобу присвоил ей статус: [COLOR=rgb(235, 107, 86)]Отказано[/COLOR]. Т.к не достаточно доказательств.<br>'+
        ' C уважением Подполковник ФСБ Charles Addams.[/FONT][/CENTER]',
	},

];
 
$(document).ready(() => {
// Загрузка скрипта для обработки шаблонов
$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
// Добавление кнопок при загрузке страницы
addButton('На рассмотрении', 'pin');
addButton('КП', 'teamProject');
addButton('Отказано', 'unaccept');
addButton('Рассмотрено', 'watched');
addButton('Решено', 'accepted');
addButton('Закрыто', 'closed');
addButton('Ответы', 'selectAnswer');
 
 
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