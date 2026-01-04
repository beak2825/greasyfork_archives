// ==UserScript==
// @name Скрипт для руководства cherepovets
// @namespace https://forum.blackrussia.online
// @version 4.0
// @description Предназначен для упрощения работы на форуме
// @author -
// @match https://forum.blackrussia.online/threads/*
// @include https://forum.blackrussia.online/threads/
// @grant none
// @license MIT
// @collaborator 
// @icon https://freepngimg.com/thumb/eagle/20-eagle-black-siluet-png-image-download-thumb.png
// @downloadURL https://update.greasyfork.org/scripts/543881/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%80%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20cherepovets.user.js
// @updateURL https://update.greasyfork.org/scripts/543881/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%80%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20cherepovets.meta.js
// ==/UserScript==
 
(function () {
	'use strict';
	const UNACCEPT_PREFIX = 4; // префикс отказано
	const ACCEPT_PREFIX = 8; // префикс одобрено
	const PIN_PREFIX = 2; //  префикс закрепить
	const COMMAND_PREFIX = 10; // команда проекта
	const SPECADM_PREFIX = 11; // специальному администратору
	const MAINADM_PREFIX = 12; // главному адамнистратору
	const CLOSE_PREFIX = 7; // префикс закрыто
	const buttons = [
		{
			title: 'Приветствие',
			color: '',
			content:
				"{{ greeting }}.<br><br>" +
				' текст ',
		},
		{
			title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ Раздел жалоб на администрацию ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ',
		},
		{
			title: 'На рассмотрение',
			color: ' #FF8C00',
			content:
				"{{ greeting }}.<br><br>" +
				"Ваша жалоба взята на рассмотрение, мы внимательно изучим ситуацию и вынесем вердикт, ожидайте.<br><br>",
			prefix: PIN_PREFIX,
			status: true,
		},
		{
			title: "Не по форме",
			color: '',
			content:
				"{{ greeting }}.<br><br>" +
				"Составьте вашу жалобу по следующей форме подачи:<br>" +
				"[QUOTE][COLOR=rgb(84, 172, 210)]1.[/COLOR] Ваш Nick_Name:<br>" +
                "[COLOR=rgb(84, 172, 210)]2.[/COLOR] Nick_Name администратора:<br>" +
                "[COLOR=rgb(84, 172, 210)]3.[/COLOR] Дата выдачи/получения наказания:<br>" +
                "[COLOR=rgb(84, 172, 210)]4.[/COLOR] Суть жалобы:<br>" +
                "[COLOR=rgb(84, 172, 210)]5.[/COLOR] Доказательство:[/QUOTE]<br><br>" +
                "Отказано, закрыто.",
			prefix: UNACCEPT_PREFIX,
			status: false,
		},
		{
			title: "Передано ГА/ЗГА",
			color: '',
			content:
				"{{ greeting }}.<br><br>" +
				'Ваша жалоба передана на рассмотрение руководству сервера.<br><br>Ожидайте вердикта.',
			prefix: MAINADM_PREFIX,
			status: true,
		},
		{
			title: "Передано Спец. Администрации",
			color: '',
			content:
				"{{ greeting }}.<br><br>" +
				"Ваша жалоба передана на рассмотрение специальной администрации.<br><br>Ожидайте вердикта.",
			prefix: SPECADM_PREFIX,
			status: true,
		},
		{
			title: "Передано Рук. Модерации",
			color: '',
			content:
				"{{ greeting }}.<br><br>" +
				"Ваша жалоба передана на рассмотрение руководству модерации.<br><br>Ожидайте вердикта.",
			prefix: COMMAND_PREFIX,
			status: true,
		},
		{
			title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ Раздел обжалований наказаний ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ',
		},
		{
			title: 'На рассмотрение',
			color: ' #FF8C00',
			content:
				"{{ greeting }}.<br><br>" +
				"Ваше обжалование взято на рассмотрение, мы внимательно изучим ситуацию и вынесем вердикт, ожидайте.",
			prefix: PIN_PREFIX,
			status: true,
		},
		{
			title: "Не по форме",
			color: '',
			content:
				"{{ greeting }}.<br><br>" +
				"Составьте ваше обжалование по следующей форме подачи:<br>" +
				"[QUOTE][COLOR=rgb(84, 172, 210)]1.[/COLOR] Ваш Nick_Name:<br>" +
                "[COLOR=rgb(84, 172, 210)]2.[/COLOR] Nick_Name администратора:<br>" +
                "[COLOR=rgb(84, 172, 210)]3.[/COLOR] Дата выдачи/получения наказания:<br>" +
                "[COLOR=rgb(84, 172, 210)]4.[/COLOR] Суть заявки:<br>" +
                "[COLOR=rgb(84, 172, 210)]5.[/COLOR] Доказательство:[/QUOTE]<br><br>" +
                "Отказано, закрыто.",
			prefix: UNACCEPT_PREFIX,
			status: false,
		},
		{
			title: "Отказано",
			color: '',
			content:
				"{{ greeting }}.<br><br>" +
				"На данный момент руководство сервера не рассматривает возможность о полном снятии либо смягчении вашего наказания.<br><br>" +
				"В обжаловании отказано, закрыто.",
			prefix: UNACCEPT_PREFIX,
			status: false,
		},
{
			title: "Не подлежит",
			color: '',
			content:
				"{{ greeting }}.<br><br>" +
				"Ваше нарушение обжалованию не подлежит.<br><br>" +
                "Отказано, закрыто.",
			prefix: UNACCEPT_PREFIX,
			status: false,
		},
		{
			title: "Передано ГА",
			color: '',
			content:
				"{{ greeting }}.<br><br>" +
				'Ваше обжалование передано на рассмотрение главному администратору.<br><br>Ожидайте вердикта.',
			prefix: MAINADM_PREFIX,
			status: true,
		},
		{
			title: "Передано Спец. Администрации",
			color: '',
			content:
				"{{ greeting }}.<br><br>" +
				"Ваше обжалование передано на рассмотрение специальной администрации.<br><br>Ожидайте вердикта.",
			prefix: SPECADM_PREFIX,
			status: true,
		},
		{
			title: "Передано Рук. Модерации",
			color: '',
			content:
				"{{ greeting }}.<br><br>" +
				"Ваше обжалование передано на рассмотрение руководству модерации.<br><br>Ожидайте вердикта.",
			prefix: COMMAND_PREFIX,
			status: true,
		},
				{
			title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ Переадресация в нужный раздел ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ',
		},
		{
			title: "В жалобы на администрацию",
			color: '',
			content:
				"{{ greeting }}.<br><br>" +
				"Вам необходимо обратиться в раздел жалоб на администрацию сервера ⭢ [URL='https://forum.blackrussia.online/forums/Жалобы-на-администрацию.3965/']*нажмите, чтобы перейти*[/URL]<br><br>" +
                "Закрыто.",
			prefix: CLOSE_PREFIX,
			status: false,
		},
		{
			title: "В раздел обжалований",
			color: '',
			content:
				"{{ greeting }}.<br><br>" +
				"Вам необходимо обратиться в раздел обжалований наказаний ⭢ [URL='https://forum.blackrussia.online/forums/Обжалование-наказаний.3968/']*нажмите, чтобы перейти*[/URL]<br><br>" +
                "Закрыто.",
			prefix: CLOSE_PREFIX,
			status: false,
		},
		{
			title: "В технический раздел",
			color: '',
			content:
				"{{ greeting }}.<br><br>" +
				"Вам необходимо обратиться в технический раздел сервера ⭢ [URL='https://forum.blackrussia.online/forums/Технический-раздел-cherepovets.3978/']*нажмите, чтобы перейти*[/URL]<br><br>" +
                "Закрыто.",
			prefix: CLOSE_PREFIX,
			status: false,
		},
		{
			title: "В жалобы на тех. специалистов",
			color: '',
			content:
				"{{ greeting }}.<br><br>" +
				"Вам необходимо обратиться в раздел жалоб на технических специалистов ⭢ [URL='https://forum.blackrussia.online/forums/Сервер-№89-cherepovets.3946/']*нажмите, чтобы перейти*[/URL]<br><br>" +
                "Закрыто.",
			prefix: CLOSE_PREFIX,
			status: false,
		},
	];
 
	$(document).ready(() => {
		// Загрузка скрипта для обработки шаблонов
		$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
		// Добавление кнопок при загрузке страницы
		
      addButton('Одобрено', 'accepted', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(110, 192, 113, 0.5);');
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
		$('button#closed').click(() => editThreadData(CLOSE_PREFIX, false));
 
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