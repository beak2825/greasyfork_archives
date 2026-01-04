// ==UserScript==
// @name         BLACK RUSSIA | Testers QA
// @namespace    https://forum.blackrussia.online/
// @version      1.20
// @description  Для сотрудников "Контроля Качества"
// @author       KING RUSSIA
// @match https://forum.blackrussia.online/index.php?threads/*
// @include https://forum.blackrussia.online/index.php?threads/
// @grant        none
// @license 	 MIT
// @collaborator Basis of Antonio Carrizo and consultant Rosenfeld
// @icon https://icons.iconarchive.com/icons/thesquid.ink/free-flat-sample/128/support-icon.png
// @downloadURL https://update.greasyfork.org/scripts/530812/BLACK%20RUSSIA%20%7C%20Testers%20QA.user.js
// @updateURL https://update.greasyfork.org/scripts/530812/BLACK%20RUSSIA%20%7C%20Testers%20QA.meta.js
// ==/UserScript==
(function () {
  'use strict';
const PAQUA_PREFIX = 15; // Prefix that will be set when thread solved
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const buttons = [
  {
	  title: 'На рассмотрение',
	  content:
		'[CENTER]{{ greeting }}, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваше обращение .<br><br>" +
		'[CENTER]Отказано, закрыто.[/CENTER]',
    prefix: PAQUA_PREFIX,
    status: false,
	},
	{
	  title: 'Нарушение правил раздела',
	  content:
		'[CENTER][size=15px][font=Georgia][COLOR=rgb(0,255,255)]{{ greeting }}, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
		"[CENTER][size=15px][font=Georgia][COLOR=rgb(255,255,255)]Пожалуйста, убедительная просьба, [COLOR=rgb(255,215,0)][B][U]ознакомиться с назначением данного раздела[/B][/U] [COLOR=rgb(255,255,255)]в котором Вы создали тему, так как Ваш запрос никоим образом [COLOR=rgb(255,215,0)][B][U]не относится к технической проблеме.[/B][/U][/CENTER]<br><br>" +
    '[CENTER][size=15px][font=Georgia][COLOR=rgb(255,0,0)][B]Отказано, закрыто.[/B][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][COLOR=rgb(0,255,255)]С уважение от отдела контроля качества![/CENTER]',
        prefix: PAQUA_PREFIX,
        status: false,
	},
	{
	  title: 'Краш / вылет',
	  content:
		'[CENTER][size=15px][font=Georgia][COLOR=rgb(0,255,255)]{{ greeting }}, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
		"[CENTER][size=15px][font=Georgia][COLOR=rgb(255,255,255)]В том случае, если Вы [COLOR=rgb(255,215,0)][B][U]вылетели из игры[/U][/B] [COLOR=rgb(255,255,255)]во время игрового процесса [COLOR=rgb(255,0,0)]([B][U]произошел краш[/U][/B]), [COLOR=rgb(255,255,255)]в обязательном порядке [COLOR=rgb(255,0,0)][B][U]необходимо[/U][/B] [COLOR=rgb(255,255,255)]обратиться в [COLOR=rgb(255,215,0)][B][U]тех. поддержку[/U][/B] [COLOR=rgb(255,255,255)]в VK или Telegram:[/CENTER]<br><br>" +
    '[CENTER][size=15px][font=Georgia]VK - https://vk.com/kingcrmphelp | Telegram - https://t.me/tehkingrussia_bot[/CENTER]<br><br>' +
		'[CENTER][size=15px][font=Georgia][COLOR=rgb(255,215,0)]Решено, обратитесь в тех. поддержку, связи указанны выше.[/CENTER]' +
    '[CENTER][size=15px][font=Georgia][CENTER][COLOR=rgb(0,255,255)]С уважение от отдела контроля качества![/CENTER]',
    prefix: PAQUA_PREFIX,
    status: false,
	},
	{
	  title: 'Дублирование темы',
	  content:
		'[CENTER]{{ greeting }}, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ответ уже был дан в подобной теме. Пожалуйста, прекратите создавать идентичные или похожие темы - иначе Ваш форумный аккаунт может быть заблокирован.<br><br>" +
		'[CENTER]Отказано, закрыто.[/CENTER]',
    prefix: PAQUA_PREFIX,
    status: false,
	},
  {
	  title: 'Проблема будет исправлена',
	  content:
		'[CENTER][size=15px][font=Georgia][COLOR=rgb(0,255,255)]{{ greeting }}, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
		"[CENTER][size=15px][font=Georgia][COLOR=rgb(255,255,255)]Данная недоработка будет [COLOR=rgb(0,255,0)][B][U]проверена и исправлена.[/U][/B] [COLOR=rgb(255,0,0)][B][U]Спасибо[/U][/B], [COLOR=rgb(255,255,255)]ценим Ваш вклад!<br><br>" +
		'[CENTER][size=15px][font=Georgia][COLOR=rgb(0,255,255)][B][U]Рассмотрено.[/U][/B][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][CENTER][COLOR=rgb(0,255,255)]С уважение от отдела контроля качества![/CENTER]',
    prefix: PAQUA_PREFIX,
    status: false,
	},
  {
	  title: 'Уточните суть проблемы',
	  content:
		'[CENTER][size=15px][font=Georgia][COLOR=rgb(0,255,255)]{{ greeting }}, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
		"[CENTER][size=15px][font=Georgia][COLOR=rgb(255,215,0)][U] Уточните более подробно[/U] [COLOR=rgb(255,255,255)]суть вашей проблемы.[/CENTER]<br><br>" +
    '[CENTER][size=15px][font=Georgia][CENTER][COLOR=rgb(0,255,255)][COLOR=rgb(255,215,0)]На рассмотрение.[/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][CENTER][COLOR=rgb(0,255,255)]С уважение от отдела контроля качества![/CENTER]',
    prefix: PAQUA_PREFIX,
    status: false,
	},
	{
	  title: 'Известно о проблеме',
	  content:
		'[CENTER][size=15px][font=Georgia][COLOR=rgb(0,255,255)]{{ greeting }}, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
		"[CENTER][size=15px][font=Georgia][COLOR=rgb(255,215,0)]Команде разработчиков [COLOR=rgb(255,255,255)]уже известно о данной проблеме, она обязательно будет рассмотрена и исправлена. [COLOR=rgb(255,0,0)]Спасибо [COLOR=rgb(255,255,255)]за Ваше обращение!<br><br>" +
		'[CENTER][size=15px][font=Georgia][COLOR=rgb(0,255,255)]Рассмотрено.[/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][CENTER][COLOR=rgb(0,255,255)]С уважение от отдела контроля качества![/CENTER]',
    prefix: PAQUA_PREFIX,
    status: false,
},
  {
	  title: 'Передано на тестирование',
	  content:
		'[CENTER][size=15px][font=Georgia][COLOR=rgb(0,255,255)]{{ greeting }}, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
		"[CENTER][size=15px][font=Georgia][COLOR=rgb(255,255,0)]Благодарим за уведомление о недоработке. [COLOR=rgb(255,255,255)]Ваша тема  находится в процессе тестирования.<br><br>" +
		'[CENTER][size=15px][font=Georgia][COLOR=rgb(255,215,0)]На рассмотрении.[/CENTER]' +
    '[CENTER][size=15px][font=Georgia][CENTER][COLOR=rgb(0,255,255)]С уважение от отдела контроля качества![/CENTER]',
        prefix: PAQUA_PREFIX,
    status: false,
	},
	{
	  title: 'Команде проекта',
	  content:
		'[CENTER][size=15px][font=Georgia][COLOR=rgb(0,255,255)]{{ greeting }}, уважаемый(-ая)[B] {{ user.name }}![/B][/CENTER]<br><br>' +
		"[CENTER][size=15px][font=Georgia][COLOR=rgb(255,255,255)]Ваша тема закреплена и находится [COLOR=rgb(255,215,0)][B][U]на рассмотрении.[/B][/U] [COLOR=rgb(255,255,255)]Пожалуйста, ожидайте выноса вердикта [COLOR=rgb(255,215,0)][B][U]команды проекта.[/B][/U]<br><br>" +
		'[CENTER][size=15px][font=Georgia][COLOR=rgb(255,255,255)]Создавать новые темы с данной проблемой — [COLOR=rgb(255,0,0)][B][U]не нужно[/U][/B][COLOR=rgb(255,255,255)], ожидайте ответа в данной теме. Если проблема решится - [COLOR=rgb(0,255,0)][B][U]Вы всегда можете уведомить нас о ее решении.[/U][/B][/CENTER]',
    prefix: COMMAND_PREFIX,
   status: false,
  },
	{
	  title: 'Недостаточно доказательств',
	  content:
		'[CENTER][size=15px][font=Georgia][COLOR=rgb(0,255,255)]{{ greeting }}, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
		"[CENTER][size=15px][font=Georgia][COLOR=rgb(255,255,255)]Без доказательств (в частности скриншоты или видео)[COLOR=rgb(255,0,0)] – решить проблему не получится. [COLOR=rgb(255,255,255)]Если доказательства найдутся - создайте новую тему, приложив доказательства с фото-хостинга yapx.ru или imgur.com<br><br>" +
		'[CENTER][size=15px][font=Georgia][COLOR=rgb(0,255,255)]Рассмотрено, [COLOR=rgb(255,0,0)]закрыто.[/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][CENTER][COLOR=rgb(0,255,255)]С уважение от отдела контроля качества![/CENTER]',
    prefix: PAQUA_PREFIX,
    status: false,
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