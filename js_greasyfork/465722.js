// ==UserScript==
// @name         GREEN | Био / ситуации
// @namespace    https://forum.blackrussia.online
// @version      2.0
// @description  Скрипт для ускорения ответов на RP биографии / ситуации
// @author       Nikita_Welcom
// @match        https://forum.blackrussia.online/index.php?threads/*
// @grant        none
// @license    MIT
// @collaborator D. Merphy
// @icon https://phonoteka.org/uploads/posts/2023-02/1675404036_phonoteka-org-p-blek-rasha-oboi-vkontakte-65.png
// @downloadURL https://update.greasyfork.org/scripts/465722/GREEN%20%7C%20%D0%91%D0%B8%D0%BE%20%20%D1%81%D0%B8%D1%82%D1%83%D0%B0%D1%86%D0%B8%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/465722/GREEN%20%7C%20%D0%91%D0%B8%D0%BE%20%20%D1%81%D0%B8%D1%82%D1%83%D0%B0%D1%86%D0%B8%D0%B8.meta.js
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
const OTKAZBIO_PREFIX = 4;
const ODOBRENOBIO_PREFIX = 8;
const NARASSMOTRENIIBIO_PREFIX = 2;
const buttons = [
    {
      title: '|',
      content: '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR][/SIZE]<br><br>',
    },
    {
      title: 'ᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠ',
    },
    {
      title: 'Одобрено',
      content:
		'[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR][/SIZE]<br><br>' +
        "[CENTER][FONT=times new roman][COLOR=rgb(204, 204, 204)]Ваша RolePlay биография получает статус - [COLOR=rgb(255, 255, 255)]Одобрено[/COLOR].[/COLOR][/FONT]<br><br>" +
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman]Приятной игры на сервере.[/FONT][/COLOR][/CENTER]',
      prefix: ODOBRENOBIO_PREFIX,
	  status: false,
    },
    {
      title: 'Отказано',
      content:
		'[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR][/SIZE]<br><br>' +
        "[CENTER][FONT=times new roman][COLOR=rgb(204, 204, 204)]Ваша RolePlay биография получает статус - [COLOR=rgb(255, 255, 255)]Отказано[/COLOR].[/COLOR][/FONT]<br><br>" +
        "[CENTER][FONT=times new roman][COLOR=rgb(204, 204, 204)]Внимательно ознакомьтесь с правилами создания RolePlay биографии по ссылке - [URL='https://forum.blackrussia.online/index.php?threads/green-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.3167261/'][U]Тык[/U][/URL].<br><br>" +
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman]Приятной игры на сервере.[/FONT][/COLOR][/CENTER]',
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
      title: 'Орф ошибки (отказано)',
      content:
		'[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR][/SIZE]<br><br>' +
        "[CENTER][FONT=times new roman][COLOR=rgb(204, 204, 204)]Ваша RolePlay биография получает статус - [COLOR=rgb(255, 255, 255)]Отказано[/COLOR].[/COLOR][/FONT]<br><br>" +
        "[CENTER][FONT=times new roman][COLOR=rgb(204, 204, 204)]Причина тому - в биографии орфографические ошибки. <br><br>" +
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman]Приятной игры на сервере.[/FONT][/COLOR][/CENTER]',
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
      title: 'Худ (отказано)',
      content:
		'[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR][/SIZE]<br><br>' +
        "[CENTER][FONT=times new roman][COLOR=rgb(204, 204, 204)]Ваша RolePlay биография получает статус - [COLOR=rgb(255, 255, 255)]Отказано[/COLOR].[/COLOR][/FONT]<br><br>" +
        "[CENTER][FONT=times new roman][COLOR=rgb(204, 204, 204)]Причина тому - на фотографии не скрыт игровой интерфейс (/cameditgui). <br><br>" +
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman]Приятной игры на сервере.[/FONT][/COLOR][/CENTER]',
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
      title: 'Фото (отказано)',
      content:
		'[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR][/SIZE]<br><br>' +
        "[CENTER][FONT=times new roman][COLOR=rgb(204, 204, 204)]Ваша RolePlay биография получает статус - [COLOR=rgb(255, 255, 255)]Отказано[/COLOR].[/COLOR][/FONT]<br><br>" +
        "[CENTER][FONT=times new roman][COLOR=rgb(204, 204, 204)]Причина тому - нет личной фотографии / либо не рабочая ссылка. <br><br>" +
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman]Приятной игры на сервере.[/FONT][/COLOR][/CENTER]',
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
      title: 'Мало расписано (отказано)',
      content:
		'[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR][/SIZE]<br><br>' +
        "[CENTER][FONT=times new roman][COLOR=rgb(204, 204, 204)]Ваша RolePlay биография получает статус - [COLOR=rgb(255, 255, 255)]Отказано[/COLOR].[/COLOR][/FONT]<br><br>" +
        "[CENTER][FONT=times new roman][COLOR=rgb(204, 204, 204)]Причина тому - недостаточно информации в пунктах (Детство; Юность; Взросление; Зрелость; Наши дни). <br><br>" +
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman]Приятной игры на сервере.[/FONT][/COLOR][/CENTER]',
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
      title: 'Копипаст (отказано)',
      content:
		'[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR][/SIZE]<br><br>' +
        "[CENTER][FONT=times new roman][COLOR=rgb(204, 204, 204)]Ваша RolePlay биография получает статус - [COLOR=rgb(255, 255, 255)]Отказано[/COLOR].[/COLOR][/FONT]<br><br>" +
        "[CENTER][FONT=times new roman][COLOR=rgb(204, 204, 204)]Причина тому - информация в биографии скопирована, либо схожа с чужой. <br><br>" +
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman]Приятной игры на сервере.[/FONT][/COLOR][/CENTER]',
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
      title: 'НРП ник (отказано)',
      content:
		'[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR][/SIZE]<br><br>' +
        "[CENTER][FONT=times new roman][COLOR=rgb(204, 204, 204)]Ваша RolePlay биография получает статус - [COLOR=rgb(255, 255, 255)]Отказано[/COLOR].[/COLOR][/FONT]<br><br>" +
        "[CENTER][FONT=times new roman][COLOR=rgb(204, 204, 204)]Причина тому - у Вас NonRP Nick_Name. <br><br>" +
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman]Приятной игры на сервере.[/FONT][/COLOR][/CENTER]',
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
      title: 'От 1-го лица (отказано)',
      content:
		'[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR][/SIZE]<br><br>' +
        "[CENTER][FONT=times new roman][COLOR=rgb(204, 204, 204)]Ваша RolePlay биография получает статус - [COLOR=rgb(255, 255, 255)]Отказано[/COLOR].[/COLOR][/FONT]<br><br>" +
        "[CENTER][FONT=times new roman][COLOR=rgb(204, 204, 204)]Причина тому - биография должна быть составлена от 1-го лица. <br><br>" +
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman]Приятной игры на сервере.[/FONT][/COLOR][/CENTER]',
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },

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
		$('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectanswer" style="oswald: 3px; margin-left: 15px; border-radius: 25px;">Био</button>`,
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
				moveThread(prefix, 128); }

            			if(prefix == NARASSMOTRENIIBIO_PREFIX) {
				moveThread(prefix, 127); }

			if(prefix == ODOBRENOBIO_PREFIX) {
				moveThread(prefix, 125);
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