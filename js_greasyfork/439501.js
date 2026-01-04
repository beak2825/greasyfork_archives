// ==UserScript==
// @name         For GS or ZGS | ADM Script
// @namespace    https://forum.blackrussia.online
// @version      1.0.0.00
// @description  Always remember who you are!
// @author       Richards
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @grant        none
// @license 	 MIT
// @collaborator Richardsssss
// @icon https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @downloadURL https://update.greasyfork.org/scripts/439501/For%20GS%20or%20ZGS%20%7C%20ADM%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/439501/For%20GS%20or%20ZGS%20%7C%20ADM%20Script.meta.js
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
	  title: 'Приветствие',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER]<br><br>' +
		"[CENTER]<br><br>",
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Уже снят лидер',
	  content:
		'[Color=Red][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/CENTER][/B]' +
		"[CENTER]Данный лидер уже является снятым.[/CENTER]<br><br>" +
		'[Color=Red][CENTER][B]Закрыто.[/CENTER][/color][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Провести беседу',
	  content:
		'[Color=Red][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/CENTER][/B]' +
		"[CENTER]С данным лидером будет проведена беседа по перечисленным ошибкам в вашей жалобе.[/CENTER]<br><br>" +
		'[Color=Red][CENTER][B]Закрыто.[/CENTER][/color][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Наказать лидера',
	  content:
		'[Color=Red][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/CENTER][/B]' +
		"[CENTER]Данному лидеру будет выдано соответствующее наказание исходя из перечисленных ошибок в вашей жалобе.[/CENTER]<br><br>" +
		'[Color=Red][CENTER][B]Закрыто.[/CENTER][/color][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Недостаточно доказательств',
	  content:
		'[Color=Red][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/CENTER][/B]' +
		"[CENTER]Недостаточно доказательств, чтобы корректно рассмотреть данную жалобу.[/CENTER]<br><br>" +
		'[Color=Red][CENTER][B]Закрыто.[/CENTER][/color][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Жалоба на рассмотрение',
	  content:
		'[Color=Red][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/CENTER][/B]' +
		"[CENTER]Ваша жалоба взята на рассмотрение.[/CENTER]<br><br>" +
		'[Color=Red][CENTER][B]Ожидайте ответа.[/CENTER][/color][/B]',
	  prefix: PIN_PREFIX,
	  status: true,
	},
	{
	  title: 'Нет такого лидера',
	  content:
		'[Color=Red][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/CENTER][/B]' +
		"[CENTER]Данный игрок не является лидером какой-либо фракции.[/CENTER]<br><br>" +
		'[Color=Red][CENTER][B]Закрыто.[/CENTER][/color][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: 'Направить в раздел ЖБ на сотрудников',
	  content:
		'[Color=Red][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/CENTER][/B]' +
		"[CENTER]Если заметили какое-либо нарушение со стороны сотрудников какой-либо фракции, то обратитесь в раздел «Жалобы на сотрудников» данной фракции.[/CENTER]<br><br>" +
		'[Color=Red][CENTER][B]Закрыто.[/CENTER][/color][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Направить на другой сервер',
	  content:
		'[Color=Red][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/CENTER][/B]' +
		"[CENTER]Обратитесь в раздел вашего сервера.[/CENTER]<br><br>" +
		'[Color=Red][CENTER][B]Закрыто.[/CENTER][/color][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: 'Жалоба не по форме',
	  content:
		'[Color=Red][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/CENTER][/B]' +
		"[CENTER]Жалоба составлена не по форме.<br>Внимательно прочитайте правила составления жалоб, которые написаны в [U][URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.1426115/unread']данной[/URL][/U] теме.[/CENTER]<br><br>" +
		'[Color=Red][CENTER][B]Закрыто.[/CENTER][/color][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: 'Не замечено нарушений',
	  content:
		'[Color=Red][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/CENTER][/B]' +
		"[CENTER]Со стороны данного лидера не замечено нарушений.[/CENTER]<br><br>" +
		'[Color=Red][CENTER][B]Закрыто.[/CENTER][/color][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Уже дан ответ',
	  content:
		'[Color=Red][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/CENTER][/B]' +
		"[CENTER]Вам уже был дан корректный ответ в прошлых темах.[/CENTER]<br><br>" +
		'[Color=Red][CENTER][B]Закрыто.[/CENTER][/color][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Соц. сети',
	  content:
		'[Color=Red][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/CENTER][/B]' +
		"[CENTER]Доказательства из каких-либо соц. сетей не принимаются.<br>Требуется загрузить доказательства на какой-либо фото/видео хостинг.[/CENTER<br><br>" +
		'[Color=Red][CENTER][B]Закрыто.[/CENTER][/color][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	}
];

$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
	addButton('На рассмотрение', 'pin');
	addButton('КП', 'teamProject');
	addButton('Одобрено', 'accepted');
	addButton('Отказано', 'unaccept');
	addButton('Ответы', 'selectAnswer');

	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
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