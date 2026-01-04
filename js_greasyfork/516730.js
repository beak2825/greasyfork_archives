// ==UserScript==
// @name         SCRIPT | Заявки | VERSION = Hellsing - VOLGOGRAD
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  SCRIPT для закрытия заявок
// @author       V.Oleinik VERSION = Hellsing
// @match        https://forum.blackrussia.online/threads/*
// @icon         https://sun9-3.userapi.com/impg/GZy29ANLWXVTMSVKo3QHE10eGbWldcLUa2S7eA/tSGyZ25sYU8.jpg?size=2560x2560&quality=95&sign=06e2ed62b4c0f981ab3a6f90be84892c&type=album
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/516730/SCRIPT%20%7C%20%D0%97%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8%20%7C%20VERSION%20%3D%20Hellsing%20-%20VOLGOGRAD.user.js
// @updateURL https://update.greasyfork.org/scripts/516730/SCRIPT%20%7C%20%D0%97%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8%20%7C%20VERSION%20%3D%20Hellsing%20-%20VOLGOGRAD.meta.js
// ==/UserScript==

(function () {
	'use strict';
	const UNACCEPT_PREFIX = 4; // префикс отказано
	const ACCEPT_PREFIX = 8; // префикс одобрено
	const PIN_PREFIX = 2; //  префикс закрепить
	const SPECADM_PREFIX = 11; // специальному администратору
	const MAINADM_PREFIX = 12; // главному адамнистратору
    const CLOSE_PREFIX = 7;
    const TEXY_PREFIX = 13;
    const REALIZOVANO_PREFIX = 5;
    const VAJNO_PREFIX = 1;
    const OJIDANIE_PREFIX = 14;
const OTKAZBIO_PREFIX = 4;
const ODOBRENOBIO_PREFIX = 8;
const NARASSMOTRENIIBIO_PREFIX = 2;
const PREFIKS = 0;
const KACHESTVO = 15;
const RASSMOTRENO_PREFIX = 9;
const OTKAZRP_PREFIX = 4;
const ODOBRENORP_PREFIX = 8;
const NARASSMOTRENIIRP_PREFIX = 2;
const OTKAZORG_PREFIX = 4;
const ODOBRENOORG_PREFIX = 8;
const NARASSMOTRENIIORG_PREFIX = 2;
const buttons = [
    {
	title: '✅Вердикт✅',
	content:
	'[CENTER][SIZE=14][FONT=Georgia][COLOR=RED]Доброго времени суток, уважаемые игроки.<br><br>' +
	'Список допущенных к обзвону: [/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
    '[CENTER][SIZE=4][FONT=Georgia][COLOR=WHITE]Ник.[/FONT][/SIZE][/COLOR][/CENTER]<br>' +
    '[CENTER][SIZE=4][FONT=Georgia][COLOR=WHITE]Ник.[/FONT][/SIZE][/COLOR][/CENTER]<br>' +
    '[CENTER][SIZE=4][FONT=Georgia][COLOR=WHITE]Ник.[/FONT][/SIZE][/COLOR][/CENTER]<br>' +
    '[CENTER][SIZE=4][FONT=Georgia][COLOR=WHITE]Ник.[/FONT][/SIZE][/COLOR][/CENTER]<br>' +
    '[CENTER][SIZE=4][FONT=Georgia][COLOR=WHITE]Ник.[/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
    '[CENTER][SIZE=14][FONT=Georgia][COLOR=RED]Список отказанных заявок: [/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
    '[CENTER][SIZE=4][FONT=Georgia][COLOR=WHITE]Ник[/FONT][/SIZE][/COLOR][/CENTER]<br>' +
    '[CENTER][SIZE=4][FONT=Georgia][COLOR=WHITE]Ник[/FONT][/SIZE][/COLOR][/CENTER]<br>' +
    '[CENTER][SIZE=4][FONT=Georgia][COLOR=WHITE]Ник[/FONT][/SIZE][/COLOR][/CENTER]<br>' +
    '[CENTER][SIZE=4][FONT=Georgia][COLOR=WHITE]Ник[/FONT][/SIZE][/COLOR][/CENTER]<br>' +
    '[CENTER][SIZE=4][FONT=Georgia][COLOR=WHITE]Ник[/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
    "[CENTER][SIZE=4][FONT=Georgia][COLOR=WHITE]Обзвон состоится день.12.2024 в хх:хх по МСК в официальном Discord канале BLACK RUSSIA VOLGOGRAD - [URL='https://discord.com/invite/tuTmvDK38A'][COLOR=BLUE]Кликабельно.[/URL]<br><br>"+
        "[CENTER][SIZE=4][FONT=Georgia][COLOR=WHITE]Кандидатам связаться со мной в ВК, для дальнейшего обзвона. Не ведитесь на мошенников! Связь со мной - [URL='vk.com/id540778638'][COLOR=BLUE]Кликабельно.[/URL]<br><br>"+
        '[FONT=Georgia][/SIZE][/COLOR][/CENTER]Приятной игры на сервере VOLGOGRAD.[FONT=Georgia][/SIZE][/COLOR][/CENTER]',


            	prefix: CLOSE_PREFIX,
	status: false,
        },
{
    	title: '⌛️На рассмотрение⌛️',
	content:
	'[CENTER][SIZE=14][FONT=Georgia][COLOR=RED]Доброго времени суток, уважаемые игроки.<br><br>' +
	'Заявки закрыты на рассмотрение. [/FONT][/SIZE][/COLOR][/CENTER]<br><br>'+
        "[CENTER][SIZE=14][FONT=Georgia][COLOR=RED]Не ведитесь на мошенников! Связь со мной - [URL='vk.com/id540778638'][COLOR=BLUE]Кликабельно.[/URL]<br><br>",
    	prefix: PIN_PREFIX,
	status: true,
 },
];


	$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
	addButton('📝ВЕРДИКТ В ЗАЯВКАХ📝', 'selectAnswer');

	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#specadm').click(() => editThreadData(SPECADM_PREFIX, true));
	$('button#mainadm').click(() => editThreadData(MAINADM_PREFIX, true));
     $('button#Texy').click(() => editThreadData(TEXY_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));
	$('button#watched').click(() => editThreadData(WATCHED_PREFIX, false));
	$('button#decided').click(() => editThreadData(DECIDED_PREFIX, false));
    $('button#Resheno').click(() => editThreadData(RESHENO_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));
    $('button#Realizovano').click(() => editThreadData(REALIZOVANO_PREFIX, false));
    $('button#Vajno').click(() => editThreadData(VAJNO_PREFIX, false));
    $('button#Rassmotreno').click(() => editThreadData(RASSMOTRENO_PREFIX, false));
    $('button#Ojidanie').click(() => editThreadData(OJIDANIE_PREFIX, false));
    $('button#Prefiks').click(() => editThreadData(PREFIKS, false));
    $('button#Kachestvo').click(() => editThreadData(KACHESTVO, false));


	$(`button#selectAnswer`).click(() => {
	XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
	buttons.forEach((btn, id) => {
	if (id > 0) {
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

	if (pin == false) {
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
	if (pin == true) {
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



