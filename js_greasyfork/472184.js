// ==UserScript==
// @name         Адмтулс |ANAPA
// @namespace    https://forum.blackrussia.online
// @version      1.2
// @description  Данный скрипт создан для помощи в закрытии РП биографий
// @author       Boris_Laptev
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license    MIT
// @collaborator
// @icon https://i.yapx.ru/V0IwZ.png
// @downloadURL https://update.greasyfork.org/scripts/472184/%D0%90%D0%B4%D0%BC%D1%82%D1%83%D0%BB%D1%81%20%7CANAPA.user.js
// @updateURL https://update.greasyfork.org/scripts/472184/%D0%90%D0%B4%D0%BC%D1%82%D1%83%D0%BB%D1%81%20%7CANAPA.meta.js
// ==/UserScript==

(function () {
  'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const CLOSE_PREFIX = 7;
const TEXY_PREFIX = 13;
const OTKAZBIO_PREFIX = 4; // Prefix that will be set when thread closes
const ODOBRENOBIO_PREFIX = 8; // Prefix that will be set when thread accepted
const NARASSMOTRENIIBIO_PREFIX = 2; // Prefix that will be set when thread pins
const buttons = [
    {
      title: 'приветствие',
      content: '[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>',
    },
     {
         title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ  Для РП био и ситуаций ᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ',
    },
    {
              title: 'Биография одобрена',
      content:
		'[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
        "[CENTER]Ваша РП биография получает статус: [COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/CENTER][/FONT]",
      prefix: ODOBRENOBIO_PREFIX,
	  status: false,
    },
    {
               title: 'био отказ',
      content:
		'[Color=Fuchsia][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]",
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
title: 'био отказ(заголовок темы)',
      content:
		'[Color=Fuchsia][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Причиной отказа могло послужить неправельный заголовок темы.[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
      title: 'био не по форме',
      content:
		'[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
        "[CENTER]Ваша РП биография получает статус: [COLOR=rgb(255, 0, 0)]Отказано[/COLOR].<br>Ваша биография составлена не по форме. Убедительная просьба ознакомится с формой подач РП биографий тут:  [URL='https://forum.blackrussia.online/index.php?threads/green-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.3167261/']Правил создания RolePlay биографии[/URL].[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
              title: 'орф ошибки',
      content:
		'[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
        "[CENTER]Ваша РП биография получает статус: [COLOR=rgb(255, 0, 0)]Отказано[/COLOR].<br>В Вашей РП биографии присутствуют орфографические/пунктуационные ошибки.[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
              title: 'не скрыт худ',
      content:
		'[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br><br>' +
        "[CENTER]В Вашей РП биографии не скрыт интерфейс. У Вас есть 24 часа на то, чтобы его скрыть. (команда для его скрытия: /cameditgui)<br> <br> [Color=#FF8C00] На доработке.[/COLOR][/CENTER][/FONT]",
      prefix: NARASSMOTRENIIBIO_PREFIX,
	  status: false,
    },
    {
              title: 'нет лич фото',
      content:
		'[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
        "[CENTER]В Вашей РП биографии нет личного фото. У Вас есть 24 часа на то, чтобы дополнить этот пункт.<br> <br> [Color=#FF8C00] На доработке.[/COLOR][/CENTER][/FONT]",
      prefix: NARASSMOTRENIIBIO_PREFIX,
	  status: false,
    },
    {
title: 'био отказ(3е лицо)',
      content:
		'[Color=Fuchsia][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Причиной отказа могло послужить создание биографии от 3го лица.[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
      title: 'био украдена',
      content:
		'[Color=Fuchsia][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Биография украдена у другого игрока.[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
      title: 'возраст не совпадает',
      content:
		'[Color=Fuchsia][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Возраст не совпадает с датой рождения.[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
                      title: 'мало расписано(детство)',
      content:
		'[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
        "[CENTER]В Вашей РП биографии мало расписан пункт детство. У Вас есть 24 часа на то, чтобы дополнить данный пункт.<br> <br> [Color=#FF8C00] На доработке.[/COLOR][/CENTER][/FONT]",
      prefix: NARASSMOTRENIIBIO_PREFIX,
	  status: false,
    },
    {
                              title: 'мало расписано(юность)',
      content:
		'[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
        "[CENTER]В Вашей РП биографии мало расписан пункт юность. У Вас есть 24 часа на то, чтобы дополнить данный пункт.<br> <br> [Color=#FF8C00] На доработке.[/COLOR][/CENTER][/FONT]",
      prefix: NARASSMOTRENIIBIO_PREFIX,
	  status: false,
    },
    {
                                      title: 'мало расписано(взросление)',
      content:
		'[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
        "[CENTER]В Вашей РП биографии мало расписан пункт взросление. У Вас есть 24 часа на то, чтобы дополнить данный пункт.<br> <br> [Color=#FF8C00] На доработке.[/COLOR][/CENTER][/FONT]",
      prefix: NARASSMOTRENIIBIO_PREFIX,
	  status: false,
    },
    {
                                      title: 'мало расписано(зрелость)',
      content:
		'[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
        "[CENTER]В Вашей РП биографии мало расписан пункт зрелость. У Вас есть 24 часа на то, чтобы дополнить данный пункт.<br> <br> [Color=#FF8C00] На доработке.[/COLOR][/CENTER][/FONT]",
      prefix: NARASSMOTRENIIBIO_PREFIX,
	  status: false,
    },
    {
                                              title: 'мало расписано(наши дни)',
      content:
		'[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
        "[CENTER]В Вашей РП биографии мало расписан пункт наши дни. У Вас есть 24 часа на то, чтобы дополнить данный пункт.<br> <br> [Color=#FF8C00] На доработке.[/COLOR][/CENTER][/FONT]",
      prefix: NARASSMOTRENIIBIO_PREFIX,
	  status: false,
    },
    {
              title: 'копипаст',
      content:
		'[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
        "[CENTER]Ваша РП биография получает статус: [COLOR=rgb(255, 0, 0)]Отказано[/COLOR].<br>Вы скопировали, либо написали похожую РП биографию другого человека.[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
      title: 'Ситуация одобрена',
      content:
		'[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
        "[CENTER]Ваша РП ситуация получает статус: [COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/CENTER][/FONT]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {

      title: 'Ситуация отказана',
      content:
		'[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
        "[CENTER]Ваша РП ситуация получает статус: [COLOR=rgb(255, 0, 0)]Отказано[/COLOR].[/COLOR]<br>Причиной отказа могло послужить какое-либо нарушение из [URL='https://forum.blackrussia.online/index.php?threads/green-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BD%D0%B0%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D1%81%D0%B8%D1%82%D1%83%D0%B0%D1%86%D0%B8%D0%B9.264809/']Правил создания RolePlay ситуации[/URL].[/CENTER][/FONT]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    }

       ];
  $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    // Добавление кнопок при загрузке страницы
    addAnswers();

    // Поиск информации о теме
    const threadData = getThreadData();

    $('button#narassmotrenii').click(() => editThreadData(NARASSMOTRENIIBIO_PREFIX, true));
    $('button#odobrenobio').click(() => editThreadData(ODOBRENOBIO_PREFIX, false));
    $('button#otkazbio').click(() => editThreadData(OTKAZBIO_PREFIX, false));
	$(`button#selectanswer`).click(() => {
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
	`<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 25px; margin-right: 5px;">${name}</button>`,
	);
	}
	function addAnswers() {
		$('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectanswer" style="oswald: 3px; margin-left: 15px; border-radius: 25px;">Био и ситуации</button>`,
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


  function editThreadData(prefix, pin = false, dmitry_merphy = true) {
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
          discussion_open: 1,
          sticky: 1,
          _xfToken: XF.config.csrf,
          _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
          _xfWithData: 1,
          _xfResponseType: 'json',
        }),
      }).then(() => location.reload());
    }
		if(dmitry_merphy === true) {
			if(prefix == OTKAZBIO_PREFIX) {
				moveThread(prefix, 1409); }

            			if(prefix == NARASSMOTRENIIBIO_PREFIX) {
				moveThread(prefix, 1408); }

			if(prefix == ODOBRENOBIO_PREFIX) {
				moveThread(prefix, 1407);
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