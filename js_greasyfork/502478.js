// ==UserScript==
// @name         ГС/ЗГС
// @namespace    https://forum.blackrussia.online
// @version      1.0
// @description  Создан для ГС/ЗГС
// @author       Kirill_Orange
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license 	 MIT
// @collaborator Quenk269
// @icon https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @downloadURL https://update.greasyfork.org/scripts/502478/%D0%93%D0%A1%D0%97%D0%93%D0%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/502478/%D0%93%D0%A1%D0%97%D0%93%D0%A1.meta.js
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
const TEX_PREFIX = 13;
const CLOSE_PREFIX = 7;
const buttons = [



{
title: '-----------------------------------------------------------------------Одобрения-----------------------------------------------------------------------',
},
{
title: 'лидер будет наказан',
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br><br>"+
"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR][/I]<br><br>" +
"[COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4][/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Лидер получит наказание! [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>" +
"[B][CENTER][B][COLOR=lime][ICODE]Одобрено[/ICODE][/COLOR][/B]<br><br>"+
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B][/CENTER]<br>",

prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '-----------------------------------------------------------------------На рассмотрение------------------------------------------------------',
},
{
title: '| На рассмотрение |',
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br><br>"+
"[B][CENTER][COLOR=rgb(209, 213, 216)]Ваша жалоба взята на рассмотрение, пожалуйста не создавайте дубликатов. Ожидайте ответа.[/COLOR]<br>"+
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B][/CENTER]<br>",
prefix: PIN_PREFIX,
status: true,
},
{
title: '-----------------------------------------------------------------------Отказ------------------------------------------------------------------',
},
{
title: 'Не по форме',
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br><br>"+
    "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR][/I]<br><br>" +
"[COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4][/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Ваша жалоба составлена не по форме! [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>" +
"[B][CENTER][B][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/B]<br><br>"+
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B][/CENTER]<br>",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Предоставил доки, закрыто',
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br><br>"+
    "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR][/I]<br><br>" +
"[COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4][/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Проверив доказательства лидера, было принято решение, что наказание выдано верно. Нарушений со стороны лидера нет. [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>" +
"[B][CENTER][B][COLOR=red][ICODE]Закрыто[/ICODE][/COLOR][/B]<br><br>"+
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B][/CENTER]<br>",
prefix: CLOSE_PREFIX,
status: false,
},





	];

$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
	addButton('Меню', 'selectAnswer');

	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
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