// ==UserScript==
// @name         Leader
// @namespace    https://forum.blackrussia.online
// @version      1.2
// @description  Проверка отчетов для лд.
// @author       Batya Evans
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @grant        none
// @license 	 MIT
// @collaborator Basis of Antonio Carrizo and consultant Rosenfeld
// @icon https://icons.iconarchive.com/icons/thesquid.ink/free-flat-sample/128/support-icon.png
// @copyright 2022, BLACK RUSSIA (https://vk.com/blackrussia.online)
// @downloadURL https://update.greasyfork.org/scripts/463652/Leader.user.js
// @updateURL https://update.greasyfork.org/scripts/463652/Leader.meta.js
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
	  title: 'Одобрено жалоба',
	  content:
		'[COLOR=rgb(0, 255, 153)][CENTER][FONT=times new roman]{{ greeting }}[/COLOR]<br>'+
        '[COLOR=rgb(255, 0, 102)]Внимательно рассмотрев вашу жалобу присвоил ей статус[/COLOR]: [COLOR=rgb(0, 255, 0)]Одобрено[/COLOR]. [COLOR=rgb(204, 0, 0)]Сотрудник будет наказан.[/COLOR]<br>'+
        ' [COLOR=rgb(0, 255, 153)]C уважением Полковник Рафаэль Винстон.[/FONT][/CENTER][/COLOR]',
 
	},
 
    {
    	  title: 'Одобрено для перевод',
	  content:
		'[CENTER][FONT=times new roman]{{ greeting }}<br>'+
        '[COLOR=rgb(255, 0, 102)]Рассмотрел Ваше заявления на перевод и присвоил ему статус[/COLOR]: [COLOR=rgb(0, 255, 0)]Одобрено[/COLOR]. [COLOR=rgb(51, 204, 255)]Ждем вас в отделе ГИБДД[/COLOR].<br>'+
        ' [COLOR=rgb(0, 255, 153)]C уважением Полковник Рафаэль Винстон.[/FONT][/CENTER][/COLOR]',
 
	},
 
 	{
	  title: 'Одобрение Восстановление',
	  content:
		'[COLOR=rgb(0, 255, 153)][CENTER][FONT=times new roman]{{ greeting }}[/COLOR]<br>'+
        '[COLOR=rgb(255, 0, 102)]Внимательно рассмотрев вашу заявление на восстановление присвоил ему статус[/COLOR]: [COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].<br>'+
        ' [COLOR=rgb(0, 255, 153)]C уважением Полковник Рафаэль Винстон.[/FONT][/CENTER][/COLOR]',
 
	},
        {
	  title: 'Одобрение Повышение',
	  content:
		'[COLOR=rgb(0, 255, 153)][CENTER][FONT=times new roman]{{ greeting }}[/COLOR]<br>'+
        '[COLOR=rgb(255, 0, 102)]Внимательно рассмотрев вашу заявление на повышение присвоил ему статус[/COLOR]: [COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].<br>'+
        ' [COLOR=rgb(0, 255, 153)]C уважением Полковник Рафаэль Винстон.[/FONT][/CENTER][/COLOR]',
 
	},
        {
	  title: 'одобрение выговор',
	  content:
		'[COLOR=rgb(0, 255, 153)][CENTER][FONT=times new roman]{{ greeting }}[/COLOR]<br>'+
        '[COLOR=rgb(255, 0, 102)]Внимательно рассмотрев вашу заявление на снятие выговора присвоил ему статус[/COLOR]: [COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].<br>'+
        ' [COLOR=rgb(0, 255, 153)]C уважением Полковник Рафаэль Винстон.[/FONT][/CENTER][/COLOR]',
 
	},
        {
     title: 'Нет тайм',
	  content:
		'[COLOR=rgb(0, 255, 153)][CENTER][FONT=times new roman]{{ greeting }}[/COLOR]<br>'+
        '[COLOR=rgb(255, 0, 102)] Отсутствует /time получает статус [/COLOR]: [COLOR=rgb(204, 0, 0)] Отказано[/COLOR].<br>'+
        ' [COLOR=rgb(0, 255, 153)]C уважением Полковник Рафаэль Винстон.[/FONT][/CENTER][/COLOR]',
 
	},
    	{
	  title: 'Отказана жалоба',
	  content:
		'[COLOR=rgb(0, 255, 153)][CENTER][FONT=times new roman]{{ greeting }}[/COLOR]<br>'+
        '[COLOR=rgb(255, 0, 102)]Внимательно рассмотрев вашу жалобу присвоил ей статус[/COLOR]: [COLOR=rgb(204, 0, 0)]Одобрено[/COLOR]. [COLOR=rgb(0, 255, 255)]Причиной может быть нет нарушения;не по форме;нет доказательств[/COLOR]<br>'+
        ' [COLOR=rgb(0, 255, 153)]C уважением Полковник Рафаэль Винстон.[/FONT][/CENTER][/COLOR]',
 
	},
    {
    	  title: 'Отказано для перевод',
	  content:
		'[CENTER][FONT=times new roman]{{ greeting }}<br>'+
        '[COLOR=rgb(255, 0, 102)]Рассмотрел Ваше заявления на перевод и присвоил ему статус[/COLOR]: [COLOR=rgb(204, 0, 0)] Отказано[/COLOR]. [COLOR=rgb(0, 255, 255)]Причиной могло быть не по форме; нарушение критериев;нет доказательств;не полные критерии [/COLOR].<br>'+
        ' [COLOR=rgb(0, 255, 153)]C уважением Полковник Рафаэль Винстон.[/FONT][/CENTER][/COLOR]',
 
	},
    {
    	  title: 'Отказано повышение',
	  content:
		'[CENTER][FONT=times new roman]{{ greeting }}<br>'+
        '[COLOR=rgb(255, 0, 102)]Рассмотрел Ваше заявления на повышение и присвоил ему статус[/COLOR]: [COLOR=rgb(204, 0, 0)] Отказано[/COLOR]. [COLOR=rgb(0, 255, 255)]Причиной могло быть не по форме; нарушение критериев;нет доказательств;не полные критерии [/COLOR].<br>'+
        ' [COLOR=rgb(0, 255, 153)]C уважением Полковник Рафаэль Винстон.[/FONT][/CENTER][/COLOR]',
       },
    {
    	  title: 'Отказано выговор',
	  content:
		'[CENTER][FONT=times new roman]{{ greeting }}<br>'+
        '[COLOR=rgb(255, 0, 102)]Рассмотрел Ваше заявления на снятие выговора и присвоил ему статус[/COLOR]: [COLOR=rgb(204, 0, 0)] Отказано[/COLOR]. [COLOR=rgb(0, 255, 255)]Причиной могло быть не по форме; нарушение критериев;нет доказательств;не полные критерии [/COLOR].<br>'+
        ' [COLOR=rgb(0, 255, 153)]C уважением Полковник Рафаэль Винстон.[/FONT][/CENTER][/COLOR]',
 
	},
    {
    	  title: 'Отказано восстановление',
	  content:
		'[CENTER][FONT=times new roman]{{ greeting }}<br>'+
        '[COLOR=rgb(255, 0, 102)]Рассмотрел Ваше заявления на восстановление и присвоил ему статус[/COLOR]: [COLOR=rgb(204, 0, 0)] Отказано[/COLOR]. [COLOR=rgb(0, 255, 255)]Причиной могло быть не по форме; нарушение критериев;нет доказательств;не полные критерии [/COLOR].<br>'+
        ' [COLOR=rgb(0, 255, 153)]C уважением Полковник Рафаэль Винстон.[/FONT][/CENTER][/COLOR]',
 
	},
];
 
$(document).ready(() => {
// Загрузка скрипта для обработки шаблонов
$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
// Добавление кнопок при загрузке страницы
addButton('Форум ГИБДД', 'selectAnswer');
 
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