// ==UserScript==
// @name Жалобы на АДМ+Обж
// @namespace https://forum.blackrussia.online
// @version 0.6.3.3
// @description For GA_89
// @author Mihail_Fererra
// @match https://forum.blackrussia.online/threads/*
// @include https://forum.blackrussia.online/threads/
// @grant none
// @license MIT
// @collaborator 
// @icon https://icons.iconarchive.com/icons/thesquid.ink/free-flat-sample/128/support-icon.png
// @downloadURL https://update.greasyfork.org/scripts/543586/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B%20%D0%BD%D0%B0%20%D0%90%D0%94%D0%9C%2B%D0%9E%D0%B1%D0%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/543586/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B%20%D0%BD%D0%B0%20%D0%90%D0%94%D0%9C%2B%D0%9E%D0%B1%D0%B6.meta.js
// ==/UserScript==

(function () {
	'use strict';
	const UNACCEPT_PREFIX = 4; // префикс отказано
	const ACCEPT_PREFIX = 8; // префикс одобрено
	const PIN_PREFIX = 2; //  префикс закрепить
	const COMMAND_PREFIX = 10; // Команда Проекта
	const SPECADM_PREFIX = 11; // специальному администратору
	const MAINADM_PREFIX = 12; // главному адамнистратору
	const buttons = [
		{
			title: 'Приветсвие',
			color: '',
			content:
				"{{ greeting }}, уважаемый [COLOR=rgb(84, 172, 210)]{{ user.name }}[/COLOR].<br><br>" +
				' текст ',
		},
		{
			title: "Фотохостинги",
			color: '',
			content:
				"{{ greeting }}, уважаемый [COLOR=rgb(84, 172, 210)]{{ user.name }}[/COLOR].<br><br>" +
				"Требуется разместить ваши доказательства на одной из следующих платформах: [URL='https://imgur.com/'][COLOR=rgb(84, 172, 210)]imgur.com[/COLOR][/URL], [URL='https://yapx.ru/'][COLOR=rgb(84, 172, 210)]yapx.ru[/COLOR][/URL], [URL='https://ru.imgbb.com/'][COLOR=rgb(84, 172, 210)]imgbb.com[/COLOR][/URL], [URL='https://radikal.cloud/'][COLOR=rgb(84, 172, 210)]radikal.cloud[/COLOR][/URL], [URL='https://postimages.org/ru/'][COLOR=rgb(84, 172, 210)]postimages.org[/COLOR][/URL], [URL='https://ltdfoto.ru/'][COLOR=rgb(84, 172, 210)]ltdfoto.ru[/COLOR][/URL], [URL='https://www.youtube.com/'][COLOR=rgb(84, 172, 210)]youtube.com[/COLOR][/URL], [URL='https://rutube.ru/'][COLOR=rgb(84, 172, 210)]rutube.ru[/COLOR][/URL]. (кликабельно).<br>" +
				"В ином случае, ваша тема рассмотрению не подлежит.",
			prefix: UNACCEPT_PREFIX,
			status: false,
		},
		{
			title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ Жалобы на Администрацию ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ',
		},
		{
			title: 'ЖБ На рассмотрении',
			color: ' #FF8C00',
			content:
				"{{ greeting }}, уважаемый [COLOR=rgb(84, 172, 210)]{{ user.name }}[/COLOR].<br><br>" +
				"Ваша жалоба взята на рассмотрение, мы внимательно изучим ситуацию и вынесем вердикт, ожидайте.<br><br>",
			prefix: PIN_PREFIX,
			status: true,
		},
		{
			title: "Не по форме",
			color: '',
			content:
				"{{ greeting }}, уважаемый [COLOR=rgb(84, 172, 210)]{{ user.name }}[/COLOR].<br><br>" +
				"В вашей жалобе форма подачи не соответствует установленным требованиям и правилам, что препятствует её рассмотрению.<br><br>" +
				"Создайте новую жалобу с актуальной формой подачи:<br><br>" +
				"1. Ваш Nick_Name:<br>" +
				"2. Nick_Name администратора:<br>" +
				"3. Дата выдачи/ получения наказания:<br>" +
				"4. Суть жалобы:<br>" +
				"5. Доказательство: ",
			prefix: UNACCEPT_PREFIX,
			status: false,
		},
		{
			title: "Передано ГА",
			color: '',
			content:
				"{{ greeting }}, уважаемый [COLOR=rgb(84, 172, 210)]{{ user.name }}[/COLOR].<br><br>" +
				'Ваша жалоба передана на рассмотрение главному администратору.<br>Ожидайте вердикта.',
			prefix: MAINADM_PREFIX,
			status: true,
		},
		{
			title: "Передано Спец.Адм",
			color: '',
			content:
				"{{ greeting }}, уважаемый [COLOR=rgb(84, 172, 210)]{{ user.name }}[/COLOR].<br><br>" +
				"Ваша жалоба передана на рассмотрение специальной администрации.<br>Ожидайте вердикта.",
			prefix: SPECADM_PREFIX,
			status: true,
		},
		{
			title: "Передано Рук.Модер",
			color: '',
			content:
				"{{ greeting }}, уважаемый [COLOR=rgb(84, 172, 210)]{{ user.name }}[/COLOR].<br><br>" +
				"Ваша жалоба передана на рассмотрение Руководству Модерации.<br>Ожидайте вердикта.",
			prefix: COMMAND_PREFIX,
			status: true,
		},
		{
			title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠРаздел Обжалования ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ',
		},
		{
			title: 'ОБЖ на рассмотрении',
			color: ' #FF8C00',
			content:
				"{{ greeting }}, уважаемый [COLOR=rgb(84, 172, 210)]{{ user.name }}[/COLOR].<br><br>" +
				"Ваше обжалование взято на рассмотрение, мы внимательно изучим ситуацию и вынесем вердикт, ожидайте.",
			prefix: PIN_PREFIX,
			status: true,
		},
		{
			title: "Не по форме",
			color: '',
			content:
				"{{ greeting }}, уважаемый [COLOR=rgb(84, 172, 210)]{{ user.name }}[/COLOR].<br><br>" +
				"В вашей жалобе форма подачи не соответствует установленным требованиям и правилам, что препятствует её рассмотрению.<br><br>" +
				"Создайте новую жалобу с актуальной формой подачи:<br><br>" +
				"1. Ваш Nick_Name:<br>" +
				"2. Nick_Name администратора:<br>" +
				"3. Дата выдачи/ получения наказания:<br>" +
				"4. Суть заявки:<br>" +
				"5. Доказательство: ",
			prefix: UNACCEPT_PREFIX,
			status: false,
		},
		{
			title: "Передано ГА",
			color: '',
			content:
				"{{ greeting }}, уважаемый [COLOR=rgb(84, 172, 210)]{{ user.name }}[/COLOR].<br><br>" +
				'Ваше обжалование передано на рассмотрение главному администратору.<br>Ожидайте вердикта.',
			prefix: MAINADM_PREFIX,
			status: true,
		},
		{
			title: "Передано Спец.АДМ",
			color: '',
			content:
				"{{ greeting }}, уважаемый [COLOR=rgb(84, 172, 210)]{{ user.name }}[/COLOR].<br><br>" +
				"Ваше обжалование передано на рассмотрение специальной администрации.<br>Ожидайте вердикта.",
			prefix: SPECADM_PREFIX,
			status: true,
		},
		{
			title: "Передано Рук.Модер",
			color: '',
			content:
				"{{ greeting }}, уважаемый [COLOR=rgb(84, 172, 210)]{{ user.name }}[/COLOR].<br><br>" +
				"Ваше обжалование передано на рассмотрение Руководству Модерации.<br>Ожидайте вердикта.",
			prefix: COMMAND_PREFIX,
			status: true,
		},
	];

	$(document).ready(() => {
		// Загрузка скрипта для обработки шаблонов
		$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

		// Добавление кнопок при загрузке страницы

		addButton('Одобрено', 'accept', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(110, 192, 113, 0.5);');
		addButton('Отказано', 'unaccept', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(220, 89, 89, 0.5);');
		addButton('Выбрать ответ', 'selectAnswer', 'border-radius: 20px; margin-right: 100x; border: 2px solid;  border-color: #3885e9;');

		// Поиск информации о теме
		const threadData = getThreadData();

		$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
		$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
		$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
		$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
		$('button#specadm').click(() => editThreadData(SPECADM_PREFIX, true));
		$('button#mainadm').click(() => editThreadData(MAINADM_PREFIX, true));
		$('button#watched').click(() => editThreadData(WATCHED_PREFIX, false));
		$('button#decided').click(() => editThreadData(DECIDED_PREFIX, false));

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

	function addButton(name, id, hex = "grey") {
		$('.button--icon--reply').before(
			`<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 25px; margin-right: 5px; background-color: ${hex}">${name}</button>`,
		);
	}
	function addAnswers() {
		$('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswer" style="oswald: 3px; margin-left: 15px; border-radius: 25px;">ОТВЕТЫ</button>`,
		);
	}
	function buttonsMarkup(buttons) {
		return `<div class="select_answer">${buttons
			.map(
				(btn, i) =>
					`<button id="answers-${i}" class="button--primary button ` +
					`rippleButton" style="margin:5px; background-color: ${btn.color || "grey"}"><span class="button-text">${btn.title}</span></button>`,
			)
			.join('')}</div>`;
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