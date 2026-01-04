// ==UserScript==
// @name         obzhalovanie
// @namespace    http://tampermonkey.net/
// @version      1.0
// @require https://greasyfork.org/scripts/477850-obzhalovanie/code/obzhalovanie.js?version=1267697
// @description  да
// @author       krytiy
// @match        https://forum.blackrussia.online/threads/*
// @icon         https://forum.blackrussia.online/data/avatars/o/1163/1163713.jpg?1697801229
// @grant        none
// @license    MIT
// ==/UserScript==

(function() {
    'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RASSMOTENO_PREFIX = 9; // Prefix that will be set when solving the problem
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const SPECY_PREFIX = 11;
const TEX_PREFIX = 13;
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
	  title: 'Не по теме',
	  content:
		'[FONT=times new roman][Color=Red][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/CENTER][/B]' +
		"[CENTER]Ваша тема или контекст самой темы не относится к тематике данного раздела.<br>Пожалуйста, ознакомтесь с правилами создания обжалование в [U][URL='https://forum.blackrussia.online/index.php?threads/3429398/']данной[/URL][/U] теме.[/CENTER]<br><br>" +
		'[Color=Red][CENTER][B]Закрыто.[/CENTER][/color][/B][/FONT]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Отказ',
	  content:
		'[FONT=times new roman][Color=Red][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/CENTER][/B]' +
		"[CENTER]Ваше обжалование получает статус «Отказано».<br>Причиной этому [/CENTER]<br><br>" +
		'[Color=Red][CENTER][B]Закрыто.[/CENTER][/color][/B][/FONT]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'На рассмотрение',
	  content:
		'[FONT=times new roman][Color=Red][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/CENTER][/B]' +
		"[CENTER]Ваше обжалование взято на рассмотрение.<br>Чтобы принять корректное решение по поводу вашего обжалования необходимо некоторое количество времени.<br>Пожалуйста ожидайте.[/CENTER]<br><br>" +
		'[Color=Orange][CENTER][B]Закрыто на рассмотрение.[/CENTER][/color][/B][/FONT]',
	  prefix: PIN_PREFIX,
	  status: false,
	},
    {
	  title: 'ЖБ на техов',
	  content:
		'[FONT=times new roman][Color=Red][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/CENTER][/B]' +
		"[CENTER]Данное наказание выдал технический специалист. Следовательно, вам следует обратитится в [U][URL='https://forum.blackrussia.online/forums/Жалобы-на-технических-специалистов.490/']данную[/URL][/U]тему.[/CENTER]<br><br>" +
		'[Color=Red][CENTER][B]Закрыто.[/CENTER][/color][/B][/FONT]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Нет ссылки на доки',
	  content:
		'[FONT=times new roman][Color=Red][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/CENTER][/B]' +
		"[CENTER]Доказательства на выданное наказание предоставлены в плохом качестве или же вовсе отсутствуют.[/CENTER]<br><br>" +
		'[Color=Red][CENTER][B]Закрыто.[/CENTER][/color][/B][/FONT]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Нет окна блокировки',
	  content:
		'[FONT=times new roman][Color=Red][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/CENTER][/B]' +
		"[CENTER]В доказательствах вашего обжалование отсутвует окно блокировки.[/CENTER]<br><br>" +
		'[Color=Red][CENTER][B]Закрыто.[/CENTER][/color][/B][/FONT]',
	  prefix: CLOSE_PREFIX,
	  tatus: false,
	},
  ];

  $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    // Добавление кнопок при загрузке страницы
    addButton('На рассмотрение', 'pin');
    addButton('КП', 'teamProject');
    addButton('Га', 'Ga');
    addButton('Спецу', 'Spec');
    addButton('Одобрено', 'accepted');
    addButton('Отказано', 'unaccept');
    addButton('Тех. Специалисту', 'Texy');
    addButton('Рассмотрено', 'Rasmotreno');
    addButton('Закрыто', 'Close');
    addButton('Ответы', 'selectAnswer');



	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
	$('button#Ga').click(() => editThreadData(GA_PREFIX, true));
	$('button#Spec').click(() => editThreadData(SPECY_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
	$('button#Texy').click(() => editThreadData(TEX_PREFIX, true));
	$('button#Rasmotreno').click(() => editThreadData(RASSMOTENO_PREFIX, false));
	$('button#Close').click(() => editThreadData(CLOSE_PREFIX, false));

	$(`button#selectAnswer`).click(() => {
		XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
		buttons.forEach((btn, id) => {
			if(id > 1) {
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
	if(pin == 123){
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

}

function getFormData(data) {
	const formData = new FormData();
	Object.entries(data).forEach(i => formData.append(i[0], i[1]));
	return formData;
  }
})();

//Produces

// ==UserScript==
// ...
// @require https://greasyfork.org/scripts/477850-obzhalovanie/code/obzhalovanie.js?version=1267703//
// ...
// ==/UserScript==