// ==UserScript==
// @name         Северный Округ | Скрипт Прокуроров by R. Pirojkov
// @namespace    https://forum.rodina-rp.com/
// @version      1.00
// @description  Специально для Rodina RP | Северный Округ by R. Pirojkov
// @author       R. Pirojkov
// @match        https://forum.rodina-rp.com/threads/*
// @include      https://forum.rodina-rp.com/threads/
// @grant        none
// @license      MIT
// @collaborator none
// @icon https://icons.iconarchive.com/icons/google/noto-emoji-people-bodyparts/512/12003-OK-hand-light-skin-tone-icon.png
// @downloadURL https://update.greasyfork.org/scripts/491919/%D0%A1%D0%B5%D0%B2%D0%B5%D1%80%D0%BD%D1%8B%D0%B9%20%D0%9E%D0%BA%D1%80%D1%83%D0%B3%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%9F%D1%80%D0%BE%D0%BA%D1%83%D1%80%D0%BE%D1%80%D0%BE%D0%B2%20by%20R%20Pirojkov.user.js
// @updateURL https://update.greasyfork.org/scripts/491919/%D0%A1%D0%B5%D0%B2%D0%B5%D1%80%D0%BD%D1%8B%D0%B9%20%D0%9E%D0%BA%D1%80%D1%83%D0%B3%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%9F%D1%80%D0%BE%D0%BA%D1%83%D1%80%D0%BE%D1%80%D0%BE%D0%B2%20by%20R%20Pirojkov.meta.js
// ==/UserScript==

(function () {
  'use strict';
'esversion 6' ;
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7; // Prefix that will be set when thread closes.
const TEX_PREFIX = 13;
const GA_PREFIX = 12;
const V_PREFIX = 1;
const buttons = [
      {
      title: '|',
      content:
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
      },
    {
      title: '_____________________________________Прокуратура ответы____________________________________________',
    },
    {
      title: 'Иск одобрен',
      content:
        "[SIZE=4][FONT=times new roman][COLOR=rgb(255, 255, 0)][I]ОДОБРЕНО.[/COLOR][/FONT][/SIZE][/I]<br><br>" +
        '[FONT=book antiqua][SIZE=4][COLOR=rgb(255, 255, 255)][I]{{ greeting }}, уважаемый гражданин, Ваше обращение было рассмотрено, итоги Вы можете увидеть ниже.[/I][/SIZE][/FONT][/COLOR]',
    },
    {
      title : 'Иск не по форме',
      content:
        "[SIZE=4][FONT=times new roman][COLOR=rgb(128, 0, 0)][I]ОТКАЗАНО.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[FONT=book antiqua][SIZE=4][COLOR=rgb(255, 255, 255)][I]{{ greeting }}, уважаемый гражданин, Ваше обращение было рассмотрено, итоги Вы можете проверить внизу. [/I][/SIZE][/FONT][/COLOR]<br><br>" +
        '[FONT=book antiqua][SIZE=4][COLOR=rgb(165, 42, 42)][I]Отказано[/COLOR][COLOR=rgb(255, 255, 255)]. Прочитайте пожалуйста внимательно правила подачи иска. [/I][/SIZE][/FONT][/COLOR]',
    },
    {
      title: 'Одобренная заявка',
      content:
        '[FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]Окружная прокуратура Северного Округа информирует:[/SIZE][/FONT][/COLOR]<br><br>' +
        "[FONT=book antiqua][SIZE=4][COLOR=rgb(255, 255, 255)][I]1. Заявление гражданина, {{ user.mention }}, на трудоустройство в прокуратуру Северного Округа[/COLOR][COLOR=rgb(255, 255, 0)]одобрено.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
        "[FONT=book antiqua][SIZE=4][COLOR=rgb(255, 255, 255)][I]2. Просим явиться в здание правительственного аппарата г.Арзамаса для проведения дальнейших действий для трудоустройства.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
        '[FONT=times new roman][SIZE=4][COLOR=rgb(224, 255, 255)][I]Окружной прокурор.[/I][/SIZE][/FONT][/COLOR]',
    },
    {
      title: 'Отказанная заявка',
      content:
        '[FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]Окружная прокуратура Северного Округа информирует:[/SIZE][/FONT][/COLOR]<br><br>' +
        "[FONT=book antiqua][SIZE=4][COLOR=rgb(255, 255, 255)][I]Заявление гражданина, {{ user.mention }}, на трудоустройство в прокуратуру Северного Округа[/COLOR][COLOR=rgb(128, 0, 0)]отказано.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
        "[FONT=book antiqua][SIZE=4][COLOR=rgb(255, 255, 255)][I]Причина:[/I][/SIZE][/FONT][/COLOR]<br><br>" +
        '[FONT=times new roman][SIZE=4][COLOR=rgb(224, 255, 255)][I]Окружной прокурор.[/I][/SIZE][/FONT][/COLOR]',
    }
  ];
  $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
    // Добавление кнопок при загрузке страницы
    addButton('Ответы', 'selectAnswer');
    // Поиск информации о теме
    const threadData = getThreadData();
    $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
    $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
    $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
    $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
    $('button#Texy').click(() => editThreadData(TEX_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));
 
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