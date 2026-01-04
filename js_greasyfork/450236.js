// ==UserScript==
// @name BLACK RUSSIA Куратор
// @namespace https://forum.blackrussia.online
// @version 2.0
// @description Для кураторов.
// @author Semkas.
// @match https://forum.blackrussia.online/index.php?threads/*
// @include https://forum.blackrussia.online/index.php?threads/
// @grant none
// @license MIT
// @collaborator
// @icon https://icons.iconarchive.com/icons/thesquid.ink/free-flat-sample/128/support-icon.png
// @downloadURL https://update.greasyfork.org/scripts/450236/BLACK%20RUSSIA%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80.user.js
// @updateURL https://update.greasyfork.org/scripts/450236/BLACK%20RUSSIA%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80.meta.js
// ==/UserScript==

(function () {
	'use strict';
	const UNACCEPT_PREFIX = 4; // префикс отказано
	const PIN_PREFIX = 2; //  префикс закрепить
	const COMMAND_PREFIX = 10; // команде проекта
	const CLOSE_PREFIX = 7; // префикс закрыто
	const DECIDED_PREFIX = 6; // префикс решено
	const TECHADM_PREFIX = 13 // теху администратору
	const WATCHED_PREFIX = 9; // рассмотрено
	const WAIT_PREFIX = 14; // ожидание (для переноса в баг-трекер)
	const NO_PREFIX = 0;
	const buttons = [
        {
 	title: 'Приветсвие',
	content:
	'[CENTER][B]{{ greeting }}![/B][/CENTER]<br><br>' +
	'[CENTER]  [/CENTER]',
        },
        {
	title: 'НАЗВАНИЕ ТЕМЫ',
	content:
			'[CENTER][B]{{ greeting }}![/B][/CENTER]<br><br>' +
			'[CENTER]В названии вашей жалобы отсутствует NickName технического специалиста.<br>' +
			"[CENTER]Пожалуйста, ознакомьтесь с правилами подачи жалоб на технических специалистов 一 [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2.168934/'][I]кликабельно[/I][/URL]. <br><br>" +
			'[CENTER]Отказано. [/CENTER]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
    {
	title: 'НА РАССМОТРЕНИЕ',
	content:
			'[CENTER][B]{{ greeting }}![/B][/CENTER]<br><br>' +
			'[CENTER]На рассмотрении. [/CENTER]',
		prefix: PIN_PREFIX,
		status: true,
	},
	{
	title: 'ФОРМА ТЕМЫ',
	content:
			'[CENTER][B]{{ greeting }}![/B][/CENTER]<br><br>' +
			'[CENTER]В вашей жалобе некорректное форма написания.<br>' +
			"[CENTER]Пожалуйста, ознакомьтесь с правилами подачи жалоб на технических специалистов 一 [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2.168934/'][I]кликабельно[/I][/URL]. <br><br>" +
			'[CENTER]Отказано. [/CENTER]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
    {
	title: 'СРОК ПОДАЧИ',
	content:
			'[CENTER][B]{{ greeting }}![/B][/CENTER]<br><br>' +
			'[CENTER] Истек срок подачи жалобы.<br>' +
			'[CENTER]Отказано. [/CENTER]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
	title: 'НЕ ОТНОСИТСЯ',
	content:
			'[CENTER][B]{{ greeting }}![/B][/CENTER]<br><br>' +
			'[CENTER]Ваше обращение никоем образом не относится к жалобам на технических специалистов.<br>' +
			'[CENTER]Отказано [/CENTER]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
	title: 'ДУБЛИРОВАНИЕ',
	content:
			'[CENTER][B]{{ greeting }}![/B][/CENTER]<br><br>' +
			"[CENTER]Данная тема является дубликатом вашей предыдущей жалобы. <br>Пожалуйста, прекратите создавать идентичные или похожие темы - иначе Ваш форумный аккаунт может быть заблокирован.<br><br>" +
			'[CENTER]Отказано [/CENTER]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
{
	title: 'ОКНО БЛОКИРОВКИ',
	content:
			'[CENTER][B]{{ greeting }}![/B][/CENTER]<br><br>' +
			"[CENTER]В вашей жалобе отсутствует окно блокировки. Загрузите его с помощью фотохостинга..<br><br>" +
			'[CENTER] Отказано [/CENTER]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
    {
	title: 'ОБЖАЛОВАНИЕ ОДОБРЕНО',
	content:
			'[CENTER][B]{{ greeting }}![/B][/CENTER]<br><br>' +
			"[CENTER]Мы верим в то, что вы исправитесь. Срок блокировки будет снижен. <br><br>" +
			'[CENTER]Рассмотрено [/CENTER]',
		prefix: WATCHED_PREFIX,
		status: false,
	},
    {
	title: 'ОБЖАЛОВАНИЕ ОТКАЗАНО',
	content:
			'[CENTER][B]{{ greeting }}![/B][/CENTER]<br><br>' +
			"[CENTER]В обжаловании отказано.<br><br>" +
			'[CENTER]Отказано [/CENTER]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
    {
	title: 'ОБЖАЛОВАНИЕ НЕ ПОДЛЕЖИТ',
	content:
			'[CENTER][B]{{ greeting }}![/B][/CENTER]<br><br>' +
			"[CENTER]Ваше нарушение не подлежит обжалованию. <br><br>" +
			'[CENTER]Отказано [/CENTER]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
        {
	title: 'БЕСЕДА',
	content:
			'[CENTER][B]{{ greeting }}![/B][/CENTER]<br><br>' +
			'[CENTER]Проведу строгую беседу с тех.специалистом..<br>' +
			'[CENTER] Закрыто[/CENTER]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
    {
	title: 'ВЫДАНО ВЕРНО',
	content:
			'[CENTER][B]{{ greeting }}![/B][/CENTER]<br><br>' +
			"[CENTER]Блокировка выдана верно. <br><br>" +
			'[CENTER]Отказано [/CENTER]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
    {
	title: 'РАЗБАН',
	content:
			'[CENTER][B]{{ greeting }}![/B][/CENTER]<br><br>' +
			"[CENTER]Ваш игровой аккаунт будет разблокирован.<br><br>" +
			'[CENTER]Рассмотрено [/CENTER]',
		prefix: WATCHED_PREFIX,
		status: false,
	},
	];
	
	$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
	
	// Добавление кнопок при загрузке страницы

	addButton('На рассмотрение', 'pin');
	addButton('КП', 'teamProject');
	addButton('Рассмотрено', 'watched');
	addButton('Отказано', 'unaccept');
        addButton('Закрыто', 'closed');
	addButton('Меню', 'selectAnswer');
	
	// Поиск информации о теме
	const threadData = getThreadData();
	
	$(`button#ff`).click(() => pasteContent(8, threadData, true));
	$(`button#prr`).click(() => pasteContent(2, threadData, true));
	$(`button#zhb`).click(() => pasteContent(21, threadData, true));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
	$('button#watched').click(() => editThreadData(WATCHED_PREFIX, false));
	$('button#decided').click(() => editThreadData(DECIDED_PREFIX, false));
	$('button#closed').click(() => editThreadData(CLOSE_PREFIX, false));
	$('button#techspec').click(() => editThreadData(TECHADM_PREFIX, true));
	
	$(`button#selectAnswer`).click(() => {
	XF.alert(buttonsMarkup(buttons), null, 'ВЫБЕРИТЕ ОТВЕТ');
	buttons.forEach((btn, id) => {
	if (id > 1) {
	$(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
	}
	else {
	$(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
	}
	});
	});
	});
	
	function addButton(name, id) {
	$('.button--icon--reply').before(
	`<button type="button" class="button rippleButton" id="${id}" style="oswald: 3px;">${name}</button>`,
	);
	}
	
	function buttonsMarkup(buttons) {
	return `<div class="select_answer">${buttons
	.map(
	(btn, i) =>
	`<button id="answers-${i}" class="button--primary button ` +
	`rippleButton" style="margin:4px"><span class="button-text">${btn.title}</span></button>`,
	)
	.join('')}</div>`;
	}
	
	function pasteContent(id, data = {}, send = false) {
	const template = Handlebars.compile(buttons[id].content);
	if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();
	
	$('span.fr-placeholder').empty();
	$('div.fr-element.fr-view p').append(template(data));
	$('a.overlay-titleCloser').trigger('click');
	
	if (send == true) {
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
	4 < hours && hours <= 11 ?
	'Доброе утро' :
	11 < hours && hours <= 15 ?
	'Добрый день' :
	15 < hours && hours <= 21 ?
	'Добрый вечер' :
	'Доброй ночи',
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
		if(prefix == UNACCEPT_PREFIX || prefix == WATCHED_PREFIX || prefix == CLOSE_PREFIX || prefix == DECIDED_PREFIX) {
			moveThread(prefix, 230); }
	
		if(prefix == WAIT_PREFIX) {
			moveThread(prefix, 917);
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