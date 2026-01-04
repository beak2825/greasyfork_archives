// ==UserScript==
// @name         Для ГС / ЗГС ГОСС
// @namespace    https://forum.blackrussia.online
// @version      0.0.8
// @description  kye
// @author       Maksim_Vitalievich
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @grant        none
// @license 	 MIT
// @collaborator !
// @icon https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @downloadURL https://update.greasyfork.org/scripts/455874/%D0%94%D0%BB%D1%8F%20%D0%93%D0%A1%20%20%D0%97%D0%93%D0%A1%20%D0%93%D0%9E%D0%A1%D0%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/455874/%D0%94%D0%BB%D1%8F%20%D0%93%D0%A1%20%20%D0%97%D0%93%D0%A1%20%D0%93%D0%9E%D0%A1%D0%A1.meta.js
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
const SA_PREFIX = 11;
const buttons = [
 
 {
    title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Жалобы на рассмотрении ╴╴╴╴ ╴╴╴╴╴╴╴╴╴╴'
    }, 
 { 
	  title: 'На рассмотрении',
	  content:
			'[FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+  
		"[CENTER]Ваша жалоба взята [Color=Orange]на рассмотрение[/Color]. Просьба не создавать подобных тем.[/CENTER]<br><br>"+
		'[CENTER]Ожидайте ответа.[/CENTER][/B]',
          prefix: PIN_PREFIX,
	  status: true,
	},
{ 
	  title: 'Запросил доказательства',
	  content:
			'[FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+  
		"[CENTER]Запросил доказательства у лидера. Просьба не создавать подобных тем.[/CENTER]<br><br>"+
	'[CENTER][Color=Orange]На рассмотрении.[/Color][/CENTER][/B]',
          prefix: PIN_PREFIX,
	  status: true,
	},
	{
     title: '╴╴╴╴╴╴╴╴╴╴╴╴Одобренные жалобы ╴╴╴╴╴╴╴╴╴╴╴╴'
    },
    {
	  title: 'Жалоба одобрена(с заявками)',
	  content:
		'[FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+  
		"[CENTER]Ваша жалоба была одобрена и будет проведена беседа с лидером, заявки будут рассмотрены.[/CENTER]<br>"+ 
		'[Color=Lime][CENTER][B]Закрыто.[/CENTER][/color][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	 {
	  title: 'Беседа(простая) с лидером',
	  content:
		'[FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+  
		"[CENTER]С лидером будет проведена беседа. [/CENTER]<br>"+
		'[Color=Lime][CENTER][B]Закрыто.[/CENTER][/color][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
		 {
	  title: 'Беседа(строгая) с лидером',
	  content:
		'[FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+  
		"[CENTER]С лидером будет проведена [Color=Red]строгая[/color] беседа. [/CENTER]<br>"+
		'[Color=Lime][CENTER][B]Закрыто.[/CENTER][/color][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
		 {
	  title: 'Беседа + обновление темы',
	  content:
		'[FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+  
		"[CENTER]С лидером будет проведена беседа, тема будет обновлена. [/CENTER]<br>"+
		'[Color=Lime][CENTER][B]Решено.[/CENTER][/color][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
		 {
	  title: 'Беседа + исправление ошибок',
	  content:
		'[FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+  
		"[CENTER]С лидером будет проведена беседа и ошибки будут исправлены. [/CENTER]<br>"+
		'[Color=Lime][CENTER][B]Закрыто.[/CENTER][/color][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
		 {
	  title: 'Благодарим за информацию',
	  content:
		'[FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+  
		"[CENTER]Благодарим за предоставленную информацию. [/CENTER]<br>"+
		'[Color=Lime][CENTER][B]Закрыто.[/CENTER][/color][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
		 {
	  title: 'Тема будет подкорректирована',
	  content:
		'[FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+  
		"[CENTER]Тема будет подкорректирована. [/CENTER]<br>"+
		'[Color=Lime][CENTER][B]Закрыто.[/CENTER][/color][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
		 {
	  title: 'Лидер был снят',
	  content:
		'[FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+  
		"[CENTER]Лидер был снят. [/CENTER]<br>"+
		'[Color=Lime][CENTER][B]Закрыто.[/CENTER][/color][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
		{
     title: '╴╴╴╴╴╴╴╴╴╴╴╴ Отказанные жалобы ╴╴╴╴╴╴╴╴╴╴╴╴ '
    },
	{
	  title: 'Нарушений со стороны лидера нет',
	  content:
		'[FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+  
		"[CENTER]Нарушений со стороны лидера нет.[/CENTER]<br>"+
		'[Color=Lime][CENTER][B]Закрыто.[/CENTER][/color][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
		 {
	  title: 'Не по форме',
	  content:
		'[FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+  
		"[CENTER]Ваша жалоба составлена не по форме. С формой подачи можно ознакомиться - [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.193378/']Правила подачи жалоб на лидеров.[/URL][/CENTER]<br>"+ 
		'[Color=Lime][CENTER][B]Закрыто.[/CENTER][/color][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: 'В жалобы на игроков',
	  content:
		'[FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+  
		"[CENTER] Обратитесь в раздел - [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.435/']Жалобы на игроков.[/URL][/CENTER]<br>"+
		'[Color=Lime][CENTER][B]Закрыто.[/CENTER][/color][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
		{
	  title: 'В жалобы на адм',
	  content:
		'[FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+  
		"[CENTER] Обратитесь в раздел - [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.433/']Жалобы на администрацию.[/URL][/CENTER]<br>"+
		'[Color=Lime][CENTER][B]Закрыто.[/CENTER][/color][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: 'в жалобы на сотрудников.',
	  content:
		'[FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+  
		"[CENTER]Вам в жалобы на сотрудников организации.[/CENTER]<br>"+
		'[Color=Lime][CENTER][B]Закрыто.[/CENTER][/color][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	
	]
 
$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
	// Добавление кнопок при загрузке страницы
	
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
				discussion_open: 1,
				sticky: 1,
				_xfToken: XF.config.csrf,
				_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
				_xfWithData: 1,
				_xfResponseType: 'json',
			  }),
			}).then(() => location.reload());
		}
		if(may_lens === true) {
			if(prefix == UNACCEPT_PREFIX) {
				moveThread(prefix, 440); }
 
			if(prefix == ACCEPT_PREFIX) {
				moveThread(prefix, 442);
			}
		}
	}
 
	function moveThread(prefix, type) {
	// Перемещение темы
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