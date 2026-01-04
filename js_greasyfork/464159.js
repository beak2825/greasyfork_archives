// ==UserScript==
// @name         FAFF
// @namespace    https://forum.blackrussia.online
// @version      1.4
// @description  sasa
// @author       J
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @grant        none
// @license 	 MIT
// @collaborator Quenk269
// @icon https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @downloadURL https://update.greasyfork.org/scripts/464159/FAFF.user.js
// @updateURL https://update.greasyfork.org/scripts/464159/FAFF.meta.js
// ==/UserScript==


(function () {
  'use strict';
const UNACCСEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCСEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem
const PINN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const SPECY_PREFIX = 11;
const TEXY_PREFIX = 13;
const OTKAZBIO_PREFIX = 4;
const ODOBRENOBIO_PREFIX = 8;
const NARASSMOTRENIIBIO_PREFIX = 2;
const OTKAZRP_PREFIX = 4;
const ODOBRENORP_PREFIX = 8;
const NARASSMOTRENIIRP_PREFIX = 2;
const OTKAZORG_PREFIX = 4;
const ODOBRENOORG_PREFIX = 8;
const NARASSMOTRENIIORG_PREFIX = 2;
const buttons = [
     {
      title: 'Приветствие',
      content: '[COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/color][/CENTER]' + '',
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Под 9╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Одобрено, для юры.',
      content:
        '[COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4][CENTER][I] Доброго времени суток, уважаемый игрок![/color][/CENTER]' +
		'[COLOR=orange][FONT=georgia][SIZE=4][CENTER][I] Одобрено, сотрудник получит наказание.[/color][/CENTER]' +
        "[Color=rgb(0, 168, 133)][FONT=georgia][CENTER]С уважением Yura_Niceqanixess. [/I][/FONT][/color][/CENTER]" ,
       prefix: false,
	 status: false,
    },
    {
	  
      title: 'Отказано. - недостаточно доказательств ',
      content:
        '[COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4][CENTER][I] Доброго времени суток, уважаемый игрок![/color][/CENTER]' +
		'[COLOR=red][FONT=georgia][SIZE=4][CENTER][I] Отказано, недостаточно доказательств. [/color][/CENTER]' +
        "[Color=rgb(0, 168, 133)][FONT=georgia][CENTER]С уважением Yura_Niceqanixess.[/I][/FONT][/color][/CENTER] [/QUOTE]" ,
       prefix: false,
	 status: false,
    },
    {
         title: 'Отказано. - нет доказательств',
      content:
        '[COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4][CENTER][I] Доброго времени суток, уважаемый игрок![/color][/CENTER]' +
		'[COLOR=red][FONT=georgia][SIZE=4][CENTER][I] Отказано, нет доказательств. [/color][/CENTER]' +
        "[Color=rgb(0, 168, 133)][FONT=georgia][CENTER]С уважением Yura_Niceqanixess.[/I][/FONT][/color][/CENTER]" ,
     prefix: false,
	 status: false,
    },
    {
         title: 'Отказано. -Доказательства не грузят',
      content:
        '[COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4][CENTER][I] Доброго времени суток, уважаемый игрок![/color][/CENTER]' +
		'[COLOR=red][FONT=georgia][SIZE=4][CENTER][I] Отказано, Доказательства не грузят. [/color][/CENTER]' +
        "[Color=rgb(0, 168, 133)][FONT=georgia][CENTER]С уважением Yura_Niceqanixess.[/I][/FONT][/color][/CENTER]" ,
      prefix: false,
	 status: false,
    },
    {
         title: 'Отказано. -Неполный фрапс ',
      content:
        '[COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4][CENTER][I] Доброго времени суток, уважаемый игрок![/color][/CENTER]' +
		'[COLOR=red][FONT=georgia][SIZE=4][CENTER][I] Отказано, Неполный фрапс. [/color][/CENTER]' +
        "[Color=rgb(0, 168, 133)][FONT=georgia][CENTER]С уважением Yura_Niceqanixess.[/I][/FONT][/color][/CENTER]" ,
      prefix: false,
	 status: false,
    },
    {
        title: 'Отказано. - Заявка составлена не по форме ',
      content:
        '[COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4][CENTER][I] Доброго времени суток, уважаемый игрок![/color][/CENTER]' +
		'[COLOR=red][FONT=georgia][SIZE=4][CENTER][I] Отказано, Заявка составлена не по форме. [/color][/CENTER]' +
        "[Color=rgb(0, 168, 133)][FONT=georgia][CENTER]С уважением Yura_Niceqanixess.[/I][/FONT][/color][/CENTER]" ,
       prefix: false,
	 status: false,
    },
    {
        title: 'Отказано. - Выше дан уже ответ ',
      content:
        '[COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4][CENTER][I] Доброго времени суток, уважаемый игрок![/color][/CENTER]' +
		'[COLOR=red][FONT=georgia][SIZE=4][CENTER][I] Отказано, Выше дан уже ответ. [/color][/CENTER]' +
        "[Color=rgb(0, 168, 133)][FONT=georgia][CENTER]С уважением Yura_Niceqanixess.[/I][/FONT][/color][/CENTER]" ,
      prefix: false,
	 status: false,
    },
    {
        title: 'Отказано. - Нету /time ',
      content:
        '[COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4][CENTER][I] Доброго времени суток, уважаемый игрок![/color][/CENTER]' +
		'[COLOR=red][FONT=georgia][SIZE=4][CENTER][I] Отказано, Нету /time. [/color][/CENTER]' +
        "[Color=rgb(0, 168, 133)][FONT=georgia][CENTER]С уважением Yura_Niceqanixess.[/I][/FONT][/color][/CENTER]" ,
      prefix: false,
	 status: false,
    },
  ];



  $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    // Добавление кнопок при загрузке страницы
    addButton('На рассмотрение','pin');
    addButton('Тех. Специалисту', 'Texy');
    addButton('Закрыто', 'Zakrito');
    addButton('Ответы', 'selectAnswer');

    // Поиск информации о теме
    const threadData = getThreadData();

    $('button#pin').click(() => editThreadData(PINN_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ACCСEPT_PREFIX, true));
    $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
    $('button#Spec').click(() => editThreadData(SPECY_PREFIX, true));
    $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
    $('button#unaccept').click(() => editThreadData(UNACCСEPT_PREFIX, true));
    $('button#Texy').click(() => editThreadData(TEXY_PREFIX, true));
    $('button#Resheno').click(() => editThreadData(RESHENO_PREFIX, true));
    $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, true));

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

	if(pin == true){
		fetch(`${document.URL}edit`, {
		  method: 'POST',
		  body: getFormData({
			prefix_id: prefix,
			title: threadTitle,
              discussion_open: 1,
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
               discussion_open: 1,
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
	      discussion_open: 1,
	target_node_id: type,
	FireBrickirect_type: 'none',
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