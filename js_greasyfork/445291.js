// ==UserScript==
// @name         Triloge RP ||  Moders
// @namespace    https://santrope-trilogy.ru/index.php
// @version      0.2
// @description  Always remember who you are!
// @author       Roman_Marvanov
// @match        https://f.santrope-trilogy.ru/index.php?threads/*
// @include      https://santrope-trilogy.ru/index.php
// @grant        none
// @license    MIT
// @collaborator Richardsssss
// @icon https://icons.iconarchive.com/icons/google/noto-emoji-animals-nature/256/22235-pig-face-icon.png
// @downloadURL https://update.greasyfork.org/scripts/445291/Triloge%20RP%20%7C%7C%20%20Moders.user.js
// @updateURL https://update.greasyfork.org/scripts/445291/Triloge%20RP%20%7C%7C%20%20Moders.meta.js
// ==/UserScript==

(function () {
	'use strict';

	const UNACCСEPT_PREFIX = 3; // Prefix that will be set when thread closes
	const ACCСEPT_PREFIX = 2; // Prefix that will be set when thread accepted
	const PINN_PREFIX = 1; // Prefix that will be set when thread pins
    const RASSMOTRENO_PREFIX = 4;
    const INFO = 5;
    const FAQ = 6;
    const GOLOSOVANIE_PREFIX = 7;
    const PEREDANO_PREFIX = 10;
    const VASNO_PREFIX = 13;
    const NOVOE_PREFIX = 11;
	const buttons = [
		{
			title: 'Приветствие',
			content: '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' + '[CENTER]  [/CENTER][/FONT]',
		},
        {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Баги╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
        {
      title: 'Баг на проверку',
      content:
		'[COLOR=rgb(245, 217, 169)][FONT=times new roman][CENTER][I][B]{{ greeting }}, уважаемый игрок.[/B][/color][/CENTER]<br>' +
        "[COLOR=rgb(255, 176, 173)][CENTER][FONT=georgia][I][B]Данный баг будет проверен и передан на доработку.[/FONT][/I][/B][/CENTER][/COLOR] <br>" +
		'[COLOR=rgb(204, 173, 211)][CENTER][B]С уважением администрация проекта![/I][/B][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
        {
      title: 'Не по форме баг',
      content:
		'[COLOR=rgb(245, 217, 169)][FONT=times new roman][CENTER][I][B]{{ greeting }}, уважаемый игрок.[/B][/color][/CENTER]<br>' +
        "[COLOR=rgb(255, 176, 173)][CENTER][FONT=georgia][I][B]Ваша тема создана не по форме. Убедительная просьба ознакомиться с правилами подачи, закреплённые в этом разделе.[/FONT][/I][/B][/CENTER][/COLOR] <br>" +
		'[COLOR=rgb(204, 173, 211)][CENTER][B]С уважением администрация проекта![/I][/B][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
        {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Предложения по улучшению╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
        {
      title: 'Улучшение на голосование',
      content:
		'[COLOR=rgb(245, 217, 169)][FONT=times new roman][CENTER][I][B]{{ greeting }}, уважаемый игрок. Ваше предложение одобрено командой модерации.[/B][/color][/CENTER]<br>' +
        "[COLOR=rgb(255, 176, 173)][CENTER][FONT=georgia][I][B]- Тема открыта на 30 дней для голосования игроков проекта за данное улучшение.[/FONT][/I][/B][/CENTER][/COLOR] <br>" +
            "[COLOR=rgb(255, 176, 173)][CENTER][FONT=georgia][I][B]- В случае, если предложение не наберёт необходимое количество голосов, будет отклонена и перемещена в Архив.[/FONT][/I][/B][/CENTER][/COLOR] <br>" +
		'[COLOR=rgb(204, 173, 211)][CENTER][B]Спасибо! С уважением администрация проекта![/I][/B][/CENTER][/color][/FONT]',
      prefix: GOLOSOVANIE_PREFIX,
	  status: false,
    },
        {
      title: 'Улучшение на голосование на рассмотрение',
      content:
		'[COLOR=rgb(245, 217, 169)][FONT=times new roman][CENTER][I][B]{{ greeting }}, уважаемый игрок.[/B][/color][/CENTER]<br>' +
        "[COLOR=rgb(255, 176, 173)][CENTER][FONT=georgia][I][B]Тема набрала нужное количество голосов и отправляется на рассмотрение.[/FONT][/I][/B][/CENTER][/COLOR] <br>" +
		'[COLOR=rgb(204, 173, 211)][CENTER][B]С уважением администрация проекта![/I][/B][/CENTER][/color][/FONT]',
      prefix: PINN_PREFIX,
	  status: false,
    },
        {
      title: 'Не по форме улучшение',
      content:
		'[COLOR=rgb(245, 217, 169)][FONT=times new roman][CENTER][I][B]{{ greeting }}, уважаемый игрок.[/B][/color][/CENTER]<br>' +
        "[COLOR=rgb(255, 176, 173)][CENTER][FONT=georgia][I][B]Ваше предложение по улучшению создано не по форме. Убедительная просьба ознакомиться с правилами подачи, закреплённые в этом разделе.[/FONT][/I][/B][/CENTER][/COLOR] <br>" +
		'[COLOR=rgb(204, 173, 211)][CENTER][B]С уважением администрация проекта![/I][/B][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
        {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Мультимедиа╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
        {
      title: 'Музыка одобрена',
      content:
		'[COLOR=rgb(245, 217, 169)][FONT=times new roman][CENTER][I][B]{{ greeting }}, уважаемый игрок.[/B][/color][/CENTER]<br>' +
        "[COLOR=rgb(255, 176, 173)][CENTER][FONT=georgia][I][B]Ваша музыка была одобрена[/FONT][/I][/B][/CENTER][/COLOR] <br>" +
		'[COLOR=rgb(204, 173, 211)][CENTER][B]С уважением администрация проекта![/I][/B][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
        {
      title: 'Фильм одобрен',
      content:
		'[COLOR=rgb(245, 217, 169)][FONT=times new roman][CENTER][I][B]{{ greeting }}, уважаемый игрок.[/B][/color][/CENTER]<br>' +
        "[COLOR=rgb(255, 176, 173)][CENTER][FONT=georgia][I][B]Ваш фильм был одобрен[/FONT][/I][/B][/CENTER][/COLOR] <br>" +
		'[COLOR=rgb(204, 173, 211)][CENTER][B]С уважением администрация проекта![/I][/B][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
        {
      title: 'Не по форме музыка',
      content:
		'[COLOR=rgb(245, 217, 169)][FONT=times new roman][CENTER][I][B]{{ greeting }}, уважаемый игрок.[/B][/color][/CENTER]<br>' +
        "[COLOR=rgb(255, 176, 173)][CENTER][FONT=georgia][I][B]Ваша музыка создана не по форме. Убедительная просьба ознакомиться с правилами подачи, закреплённые в этом разделе.[/FONT][/I][/B][/CENTER][/COLOR] <br>" +
		'[COLOR=rgb(204, 173, 211)][CENTER][B]С уважением администрация проекта![/I][/B][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
        {
      title: 'Не по форме фильм',
      content:
		'[COLOR=rgb(245, 217, 169)][FONT=times new roman][CENTER][I][B]{{ greeting }}, уважаемый игрок.[/B][/color][/CENTER]<br>' +
        "[COLOR=rgb(255, 176, 173)][CENTER][FONT=georgia][I][B]Ваш фильм создан не по форме. Убедительная просьба ознакомиться с правилами подачи, закреплённые в этом разделе.[/FONT][/I][/B][/CENTER][/COLOR] <br>" +
		'[COLOR=rgb(204, 173, 211)][CENTER][B]С уважением администрация проекта![/I][/B][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
        {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴RolePlay╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
        {
      title: 'Биография одобрена',
      content:
		'[COLOR=rgb(245, 217, 169)][FONT=times new roman][CENTER][I][B]{{ greeting }}, уважаемый игрок.[/B][/color][/CENTER]<br>' +
        "[COLOR=rgb(255, 176, 173)][CENTER][FONT=georgia][I][B]Ваша RolePlay биография была одобрена[/FONT][/I][/B][/CENTER][/COLOR] <br>" +
		'[COLOR=rgb(204, 173, 211)][CENTER][B]С уважением администрация проекта![/I][/B][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
        {
      title: 'Ситуация одобрена',
      content:
		'[COLOR=rgb(245, 217, 169)][FONT=times new roman][CENTER][I][B]{{ greeting }}, уважаемый игрок.[/B][/color][/CENTER]<br>' +
        "[COLOR=rgb(255, 176, 173)][CENTER][FONT=georgia][I][B]Ваша RolePlay ситуация была одобрена[/FONT][/I][/B][/CENTER][/COLOR] <br>" +
		'[COLOR=rgb(204, 173, 211)][CENTER][B]С уважением администрация проекта![/I][/B][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
        {
      title: 'Не по форме био',
      content:
		'[COLOR=rgb(245, 217, 169)][FONT=times new roman][CENTER][I][B]{{ greeting }}, уважаемый игрок.[/B][/color][/CENTER]<br>' +
        "[COLOR=rgb(255, 176, 173)][CENTER][FONT=georgia][I][B]Ваша RolePlay биография создана не по форме. Убедительная просьба ознакомиться с правилами подачи, закреплённые в этом разделе.[/FONT][/I][/B][/CENTER][/COLOR] <br>" +
		'[COLOR=rgb(204, 173, 211)][CENTER][B]С уважением администрация проекта![/I][/B][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
        {
      title: 'Не по форме ситуация',
      content:
		'[COLOR=rgb(245, 217, 169)][FONT=times new roman][CENTER][I][B]{{ greeting }}, уважаемый игрок.[/B][/color][/CENTER]<br>' +
        "[COLOR=rgb(255, 176, 173)][CENTER][FONT=georgia][I][B]Ваша RolePlay ситуация создана не по форме. Убедительная просьба ознакомиться с правилами подачи, закреплённые в этом разделе.[/FONT][/I][/B][/CENTER][/COLOR] <br>" +
		'[COLOR=rgb(204, 173, 211)][CENTER][B]С уважением администрация проекта![/I][/B][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
        {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Игры╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
        {
      title: 'Игра одобрена',
      content:
		'[COLOR=rgb(245, 217, 169)][FONT=times new roman][CENTER][I][B]{{ greeting }}, уважаемый игрок.[/B][/color][/CENTER]<br>' +
        "[COLOR=rgb(255, 176, 173)][CENTER][FONT=georgia][I][B]Ваша игра была одобрена[/FONT][/I][/B][/CENTER][/COLOR] <br>" +
		'[COLOR=rgb(204, 173, 211)][CENTER][B]С уважением администрация проекта![/I][/B][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
        {
      title: 'Не по форме игра',
      content:
		'[COLOR=rgb(245, 217, 169)][FONT=times new roman][CENTER][I][B]{{ greeting }}, уважаемый игрок.[/B][/color][/CENTER]<br>' +
        "[COLOR=rgb(255, 176, 173)][CENTER][FONT=georgia][I][B]Ваша игра создана не по форме. Убедительная просьба ознакомиться с правилами подачи, закреплённые в этом разделе.[/FONT][/I][/B][/CENTER][/COLOR] <br>" +
		'[COLOR=rgb(204, 173, 211)][CENTER][B]С уважением администрация проекта![/I][/B][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
        {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Форумные Игры╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
        {
      title: 'Форумная Игра не по форме',
      content:
		'[COLOR=rgb(245, 217, 169)][FONT=times new roman][CENTER][I][B]{{ greeting }}, уважаемый игрок.[/B][/color][/CENTER]<br>' +
        "[COLOR=rgb(255, 176, 173)][CENTER][FONT=georgia][I][B]Ваша Форумная игра отклонена т.к. составлена не по форме. Ознакомьтесь с правилами подачи.[/FONT][/I][/B][/CENTER][/COLOR] <br>" +
		'[COLOR=rgb(204, 173, 211)][CENTER][B]С уважением администрация проекта![/I][/B][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
        {
      title: 'Форумная Игра нарушение правил раздела',
      content:
		'[COLOR=rgb(245, 217, 169)][FONT=times new roman][CENTER][I][B]{{ greeting }}, уважаемый игрок.[/B][/color][/CENTER]<br>' +
        "[COLOR=rgb(255, 176, 173)][CENTER][FONT=georgia][I][B]Ваша Форумная игра закрыта из-за нарушение правил раздела[/FONT][/I][/B][/CENTER][/COLOR] <br>" +
		'[COLOR=rgb(204, 173, 211)][CENTER][B]С уважением администрация проекта![/I][/B][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
        {
      title: 'Не по форме форумная игра',
      content:
		'[COLOR=rgb(245, 217, 169)][FONT=times new roman][CENTER][I][B]{{ greeting }}, уважаемый игрок.[/B][/color][/CENTER]<br>' +
        "[COLOR=rgb(255, 176, 173)][CENTER][FONT=georgia][I][B]Ваша форумная игра создана не по форме. Убедительная просьба ознакомиться с правилами подачи, закреплённые в этом разделе.[/FONT][/I][/B][/CENTER][/COLOR] <br>" +
		'[COLOR=rgb(204, 173, 211)][CENTER][B]С уважением администрация проекта![/I][/B][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
        {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Курилка╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },

        {
      title: 'Курилка нарушение правил раздела',
      content:
		'[COLOR=rgb(245, 217, 169)][FONT=times new roman][CENTER][I][B]{{ greeting }}, уважаемый игрок.[/B][/color][/CENTER]<br>' +
        "[COLOR=rgb(255, 176, 173)][CENTER][FONT=georgia][I][B]Ваша тема закрыта из-за нарушение правил раздела[/FONT][/I][/B][/CENTER][/COLOR] <br>" +
		'[COLOR=rgb(204, 173, 211)][CENTER][B]С уважением администрация проекта![/I][/B][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
        {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴None Раздел╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },

        {
      title: 'Нарушение правил форума',
      content:
		'[COLOR=rgb(245, 217, 169)][FONT=times new roman][CENTER][I][B]{{ greeting }}, уважаемый игрок.[/B][/color][/CENTER]<br>' +
        "[COLOR=rgb(255, 176, 173)][CENTER][FONT=georgia][I][B]Ваша тема закрыта из-за нарушение правил форума[/FONT][/I][/B][/CENTER][/COLOR] <br>" +
		'[COLOR=rgb(204, 173, 211)][CENTER][B]С уважением администрация проекта![/I][/B][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
	];

	$(document).ready(() => {
		// Загрузка скрипта для обработки шаблонов
		$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

		// Добавление кнопок при загрузке страницы
        addButton('На рассмотрение', 'pin');
        addButton('Рассмотрено', 'Rassmotreno');
        addButton('Одобрено', 'accepted');
        addButton('Отказано', 'unaccept');
        addButton('Голосоание', 'golosovan');
        addButton('Передано', 'peredano');
        addButton('Новое', 'new');
		addButton('Ответы', 'selectAnswer');

		// Поиск информации о теме
		const threadData = getThreadData();

		$('button#unaccept').click(() => editThreadData(UNACCСEPT_PREFIX, false));
		$('button#pin').click(() => editThreadData(PINN_PREFIX, true));
		$('button#accepted').click(() => editThreadData(ACCСEPT_PREFIX, false));
		$('button#Rassmotreno').click(() => editThreadData(RASSMOTRENO_PREFIX, false));
		$('button#golosovan').click(() => editThreadData(GOLOSOVANIE_PREFIX, false));
		$('button#peredano').click(() => editThreadData(PEREDANO_PREFIX, false));
		$('button#new').click(() => editThreadData(NOVOE_PREFIX, false));

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
				7 < hours && hours <= 11 ?
					'Доброе утро' :
					11 < hours && hours <= 16 ?
						'Добрый день' :
						16 < hours && hours <= 23 ?
							'Добрый вечер' :
            23 < hours && hours <= 7?
							'Доброй ночи':
            ''
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
		} else {
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
		} else {
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
	}
})();