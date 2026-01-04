// ==UserScript==
// @name         RP BIO
// @namespace    https://forum.blackrussia.online
// @version      1.10
// @description  try to take over the world!
// @author       Marcano
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @grant        none
// @license 	 MIT
// @collaborator Marcano
// @icon https://icons.iconarchive.com/icons/aha-soft/iron-man/48/Ironman-Mask-3-Old-icon.png
// @downloadURL https://update.greasyfork.org/scripts/438743/RP%20BIO.user.js
// @updateURL https://update.greasyfork.org/scripts/438743/RP%20BIO.meta.js
// ==/UserScript==

(function () {
  'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const buttons = [
	{
	  title: 'Приветствие',
	  content:
		'[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' + '[CENTER]  [/CENTER][/FONT]',
	},
	{
	  title: 'Одобрено',
	  content:
		'[FONT=georgia]Здравствуйте.<br>' +
		"Ваше заявление на  RP биографию была рассмотрена и ей дан следующий статус:<br>[COLOR=rgb(97, 189, 109)][U]Одобрено[/U][/COLOR][COLOR=rgb(255, 255, 255)].[/COLOR]<br>" +
		'Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(255, 215, 0)]GOLD[/COLOR][/FONT]',
		prefix: ACCEPT_PREFIX,
		status: false,
	},
	{
	  title: 'На рассмотрении',
	  content:
		'[FONT=georgia]Здравствуйте.<br>' +
		"Ваше заявление на  RP биографию была рассмотрена и ей дан следующий статус:[COLOR=rgb(97, 189, 109)][U]На рассмотрении[/U][/COLOR][COLOR=rgb(255, 255, 255)].[/COLOR]<br>" +
		'Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(255, 215, 0)]GOLD[/COLOR][/FONT]',
		prefix: PIN_PREFIX,
		status: true,
	},
	{
	  title: 'Отказано',
	  content:
		'[FONT=georgia]Здравствуйте.<br>' +
		"Ваше заявление на RP биографию была рассмотрена и ей дан следующий статус:<br>[COLOR=rgb(184, 49, 47)][U]Отказано[/U][/COLOR][COLOR=rgb(255, 255, 255)].[/COLOR]<br>" +
		'Благодарим вас за обращение. Приятной игры на сервере[COLOR=rgb(255, 215, 0)] GOLD[/COLOR]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
];

$(document).ready(() => {
// Загрузка скрипта для обработки шаблонов
$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

// Добавление кнопок при загрузке страницы
addButton('На рассмотрение', 'pin');
addButton('Отказ', 'unaccept');
addButton('Одобрено', 'accepted');
addButton('Ответы', 'selectAnswer');

// Поиск информации о теме
const threadData = getThreadData();

$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
$(`button#selectAnswer`).click(() => {
  XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
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
	} else  {
		fetch(`${document.URL}edit`, {
		  method: 'POST',
		  body: getFormData({
			prefix_id: prefix,
			title: threadTitle,
			pin: 1,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
		   }
 if(prefix == ACCEPT_PREFIX) {
  moveThread(prefix,685);
 }
	}
if(prefix == UNACCEPT_PREFIX) {
		moveThread(prefix,691);
	}
     if(prefix == PIN_PREFIX) {
  moveThread(prefix,690);
     }
 
function moveThread(prefix, type) {
// Получаем заголовок темы, так как он необходим при запросе
const threadTitle = $('.p-title-value')[0].lastChild.textContent;

fetch(`${document.URL}move`, {
  method: 'POST',
  body: getFormData({
	prefix_id: prefix,
	title: threadTitle,
	target_node_id: type,
	redirect_type: 'none',
	notify_watchers: 1,
	starter_alert: 1,
	starter_alert_reason: "",
	_xfToken: XF.config.csrf,
	_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
	_xfWithData: 1,
	_xfResponseType: 'json',
  }),
}).then(() => location.reload());
}

function getFormData(data) {
	const formData = new FormData();
	Object.entries(data).forEach(i => formData.append(i[0], i[1]));
	return formData;
  }
})();
