// ==UserScript==
// @name         Скрипт для меня
// @namespace    http://forum.blackrussia.online/
// @version      1.0
// @description  Скрипт для быстрых ответов в жалобах на игроков.
// @author       Илюшааааа
// @match        https://forum.blackrussia.online/threads/*
// @icon         https://img.icons8.com/nolan/452/beezy.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504788/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%BC%D0%B5%D0%BD%D1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/504788/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%BC%D0%B5%D0%BD%D1%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
	const UNACCEPT_PREFIX = 4; // префикс отказано
	const ACCEPT_PREFIX = 8; // префикс одобрено
	const PIN_PREFIX = 2; //  префикс закрепить
	const COMMAND_PREFIX = 10; // команде проекта
	const CLOSE_PREFIX = 7; // префикс закрыто
	const DECIDED_PREFIX = 6; // префикс решено
	const WATCHED_PREFIX = 9; // рассмотрено
	const TEX_PREFIX = 13; //  техническому специалисту
	const NO_PREFIX = 0;
	const buttons = [
	 {
          title: 'Приветствие',
        content:
          '[SIZE=3][COLOR=rgb(0, 255, 127)][I][FONT=times new roman]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/I][/COLOR][/SIZE]',
        },
        {
          title: '_________________________________Жалобы на игроков________________________________________',
        },
        {
          title: 'На рассмотрении',
          content:
            '[FONT=times new roman][SIZE=3]{{ greeting }}.[/SIZE][/FONT]<br><br>' +
            '[FONT=times new roman][SIZE=3]Ваша жалоба взята на рассмотрение.[/SIZE][/FONT]<br><br>' +
            "[FONT=times new roman][SIZE=3]Ожидайте ответа...[/SIZE][/FONT]",
          prefix: PIN_PREFIX,
          status: false,
        },
        {
          title: 'Одобрено',
          content:
            '[FONT=times new roman][SIZE=3]{{ greeting }}.[/SIZE][/FONT]<br><br>' +
            "[FONT=times new roman][SIZE=3]Ваша жалоба одобрена.[/SIZE][/FONT]",
          prefix: ACCEPT_PREFIX,
          status: false,
        },
        {
          title: '_________________________________RP биографии_________________________________',
        },
        {
          title: 'Одобрено',
          content:
            '[FONT=times new roman][SIZE=3]{{ greeting }}.[/SIZE][/FONT]<br><br>' +
            "[FONT=times new roman][SIZE=3]Ваша РП биография одобрена.[/SIZE][/FONT]",
          prefix: ACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Отказано',
          content:
            '[FONT=times new roman][SIZE=3]{{ greeting }}.[/SIZE][/FONT]<br><br>' +
            "[FONT=times new roman][SIZE=3]Ваша РП биография отказана.[/SIZE][/FONT]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Заголовок не по форме',
          content:
            '[FONT=times new roman][SIZE=3]{{ greeting }}.[/SIZE][/FONT]<br><br>' +
            '[FONT=times new roman][SIZE=3]В вашей РП биографии заголовок написан не по форме.[/SIZE][/FONT]<br><br>' +
            "[FONT=times new roman][SIZE=3]Отказано.[/SIZE][/FONT]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Не по форме',
          content:
            '[FONT=times new roman][SIZE=3]{{ greeting }}.[/SIZE][/FONT]<br><br>' +
            '[FONT=times new roman][SIZE=3]Ваша РП биография написана не по форме.[/SIZE][/FONT]<br><br>' +
            "[FONT=times new roman][SIZE=3]Отказано.[/SIZE][/FONT]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Пункт. ошибки',
          content:
            '[FONT=times new roman][SIZE=3]{{ greeting }}.[/SIZE][/FONT]<br><br>' +
            '[FONT=times new roman][SIZE=3]В вашей РП биографии присутствуют пунктуационные ошибки.[/SIZE][/FONT]<br><br>' +
            "[FONT=times new roman][SIZE=3]Отказано.[/SIZE][/FONT]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Грамм. ошибки',
          content:
           '[FONT]=times new roman][SIZE=3]{{ greeting }}.[/SIZE][/FONT]<br><br>' +
           '[FONT=times new roman][SIZE=3]В вашей РП биографии присутствуют грамматические ошибки.[/SIZE][/FONT]<br><br>' +
           "[FONT=times new roman][SIZE=3]Отказано.[/SIZE][/FONT]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Орфогр. ошибки',
          content:
            '[FONT=times new roman][SIZE=3]{{ greeting }}.[/SIZE][/FONT]<br><br>' +
            '[FONT=times new roman][SIZE=3]В вашей РП биографии присутствуют орфографические ошибки.[/SIZE][/FONT]<br><br>' +
            "[FONT=times new roman][SIZE=3]Отказано.[/SIZE][/FONT]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'От 3-го лица',
          content:
            '[FONT=times new roman][SIZE=3]{{ greeting }}.[/SIZE][/FONT]<br><br>' +
            '[FONT=times new roman][SIZE=3]Ваша РП биография написана от 3-го лица.[/SIZE][/FONT]<br><br>' +
            "[FONT=times new roman][SIZE=3]Отказано.[/SIZE][/FONT]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Уже одобрена',
          content:
            '[FONT=times new roman][SIZE=3]{{ greeting }}.[/SIZE][/FONT]<br><br>' +
            '[FONT=times new roman][SIZE=3]Ваша РП биография уже была одобрена ранее.[/SIZE][/FONT]<br><br>' +
            "[FONT=times new roman][SIZE=3]Отказано.[/SIZE][/FONT]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Уже был ответ',
          content:
            '[FONT=times new roman][SIZE=3]{{ greeting }}.[/SIZE][/FONT]<br><br>' +
            '[FONT=times new roman][SIZE=3]Ваша РП биография отказана, так как ранее уже был дан ответ.[/SIZE][/FONT]<br><br>' +
            "[FONT=times new roman][SIZE=3]Закрыто.[/SIZE][/FONT]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Супергерой',
          content:
            '[FONT=times new roman][SIZE=3]{{ greeting }}.[/SIZE][/FONT]<br><br>' +
            '[FONT=times new roman][SIZE=3]Ваша РП биография отказана, так как Вы приписали супер способности своему персонажу.[/SIZE][/FONT]<br><br>' +
            "[FONT=times new roman][SIZE=3]Закрыто.[/SIZE][/FONT]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Копипаст',
          content:
            '[FONT=times new roman][SIZE=3]{{ greeting }}.[/SIZE][/FONT]<br><br>' +
            '[FONT=times new roman][SIZE=3]Ваша РП биография скопирована у другого человека.[/SIZE][/FONT]<br><br>' +
            "[FONT=times new roman][SIZE=3]Отказано.[/SIZE][/FONT]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'NonRP имя',
          content:
            '[FONT=times new roman][SIZE=3]{{ greeting }}.[/SIZE][/FONT]<br><br>' +
            '[FONT=times new roman][SIZE=3]Ваша РП биография отказана, так так у вас NonRP никнейм.[/SIZE][/FONT]<br><br>' +
            "[FONT=times new roman][SIZE=3]Закрыто.[/SIZE][/FONT]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Ник на англ',
          content:
            '[FONT=times new roman][SIZE=3]{{ greeting }}.[/SIZE][/FONT]<br><br>' +
            '[FONT=times new roman][SIZE=3]Ваша РП биография отказана, так так Ваш никнейм болжен быть написан на русском языке.[/SIZE][/FONT]<br><br>' +
            "[FONT=times new roman][SIZE=3]Закрыто.[/SIZE][/FONT]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Дата рождения с годом',
          content:
            '[FONT=times new roman][SIZE=3]{{ greeting }}.[/SIZE][/FONT]<br><br>' +
            '[FONT=times new roman][SIZE=3]В вашей РП биографии дата рождения не совпадает с возрастом.[/SIZE][/FONT]<br><br>' +
            "[FONT=times new roman][SIZE=3]Отказано.[/SIZE][/FONT]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Семья не полностью',
          content:
            '[FONT=times new roman][SIZE=3]{{ greeting }}.[/SIZE][/FONT]<br><br>' +
            '[FONT=times new roman][SIZE=3]В вашей РП биографии семья расписана не полностью.[/SIZE][/FONT]<br><br>' +
            "[FONT=times new roman][SIZE=3]Отказано.[/SIZE][/FONT]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Дата рождения не полнос',
          content:
            '[FONT=times new roman][SIZE=3]{{ greeting }}.[/SIZE][/FONT]<br><br>' +
            '[FONT=times new roman][SIZE=3]В вашей РП биографии дата рождения расписана не полностью.[/SIZE][/FONT]<br><br>' +
            "[FONT=times new roman][SIZE=3]Отказано.[/SIZE][/FONT]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Нету места рождения',
          content:
            '[FONT=times new roman][SIZE=3]{{ greeting }}.[/SIZE][/FONT]<br><br>' +
            '[FONT=times new roman][SIZE=3]В вашей РП биографии пункт Дата и место рождения расписан не полностью.[/SIZE][/FONT]<br><br>' +
            "[FONT=times new roman][SIZE=3]Отказано.[/SIZE][/FONT]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'На доработке',
          content:
            '[FONT=times new roman][SIZE=3]{{ greeting }}.[/SIZE][/FONT]<br><br>' +
            '[FONT=times new roman][SIZE=3]Ваша РП биография взята на доработку.[/SIZE][/FONT]<br><br>' +
            "[FONT=times new roman][SIZE=3]У вас есть 24 часа.[/SIZE][/FONT]",
          prefix: PIN_PREFIX,
          status: false,

         },
        ];


  $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    // Добавление кнопок при загрузке страницы
    addButton('Закрыто', 'close');
    addButton('На рассмотрение', 'pin');
    addButton('Одобрено', 'accepted');
    addButton('Отказано', 'unaccept');
    addButton('Ответы', 'selectAnswer');

    // Поиск информации о теме
    const threadData = getThreadData();

    $('button#pin').click(() => editThreadData(PIN_PREFIX, false));
    $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
    $('button#Ga').click(() => editThreadData(GA_PREFIX, false));
    $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, false));
    $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
    $('button#Texy').click(() => editThreadData(TEX_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));

    $(`button#selectAnswer`).click(() => {
      XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
      buttons.forEach((btn, id) => {
        if (id > 0) {
          $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
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

    if (send == false) {
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
	} else  {
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
	} else  {
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