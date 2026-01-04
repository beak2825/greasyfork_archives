// ==UserScript==
// @name         Скрипт для Лидеров | by K. Gogolev
// @namespace    https://forum.blackrussia.online
// @version      1.2
// @description  VK | @noloveyou_777 
// @author       K.Gogolev
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @collaborator K.Gogolev 
// @icon         https://icons.iconarchive.com/icons/google/noto-emoji-people-bodyparts/512/12003-OK-hand-light-skin-tone-icon.png
// @downloadURL https://update.greasyfork.org/scripts/470554/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2%20%7C%20by%20K%20Gogolev.user.js
// @updateURL https://update.greasyfork.org/scripts/470554/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2%20%7C%20by%20K%20Gogolev.meta.js
// ==/UserScript==

(function () {
  'use strict';
'esversion 6' ;
 const UNACCEPT_PREFIX = 4; // Префикс "Отказано"
 const ACCEPT_PREFIX = 8; // Префикс "Одобрено"
 const PIN_PREFIX = 2; // Префикс "На рассмотрении"
 const COMMAND_PREFIX = 10; // Префикс "Команде проекта"
 const WATCHED_PREFIX = 9; //Префикс "Рассмотрено"
 const CLOSE_PREFIX = 7; // Префикс "Закрыто"
 const TEX_PREFIX = 13; // Префикс "Тех. специалисту"
 const GA_PREFIX = 12; // Префикс "Главному администратору"
 const V_PREFIX = 1;
 const buttons = [
     {
    title: `--------------------------------------------------------->>>>>   На доработке <<<<<---------------------------------------------------------`,
 },
 {
     title: `------------------------------------------------------>>>>>   Одобрение заявок <<<<<------------------------------------------------------`,
 },
 {
     title: "Заявка одобрена",
     content:
     "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG][/CENTER]<br>"+
     "[CENTER][I][B][COLOR=AQUA][FONT=georgia][SIZE=4][ICODE]Доброго времени суток уважаемый.[/ICODE][/SIZE][/I][/B][/FONT][/COLOR][/CENTER]<br>" +
     "[HEADING=3][CENTER][/CENTER][/HEADING]<br>" +
     "[CENTER][COLOR=YELLOW][SIZE=4][FONT=georgia]Ваша заявка получает статус Одобрено. [/FONT][/SIZE][/COLOR][/CENTER]<br>" +
     "[SIZE=4][FONT=georgia][CENTER]Приятной игры на [COLOR=BLACK] BLACK[COLOR=RED] RUSSIA [COLOR=ORANGE]CHELYABINSK"
 },
 {
     title: "Заявка отказана",
     content:
     "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG][/CENTER]<br>"+
     "[CENTER][I][B][COLOR=AQUA][FONT=georgia][SIZE=4][ICODE]Доброго времени суток уважаемый.[/ICODE][/SIZE][/I][/B][/FONT][/COLOR][/CENTER]<br>" +
     "[HEADING=3][CENTER][/CENTER][/HEADING]<br>" +
     "[CENTER][COLOR=YELLOW][SIZE=4][FONT=georgia]Ваша заявка получает статус Отказано. [/FONT][/SIZE][/COLOR][/CENTER]<br>" +
     "[SIZE=4][FONT=georgia][CENTER]Приятной игры на [COLOR=BLACK] BLACK[COLOR=RED] RUSSIA [COLOR=ORANGE]CHELYABINSK"
 }, 
 
   ];
      $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

              // Добавление кнопок при загрузке страницы
          addButton('Ответы для ЛД', 'selectAnswer');

              // Поиск информации о теме
    const threadData = getThreadData();

    $('button#pin').click(() => editThreadData(PINN_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ACCСEPT_PREFIX, false));
    $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
    $('button#Spec').click(() => editThreadData(SPECY_PREFIX, true));
    $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
    $('button#unaccept').click(() => editThreadData(UNACCСEPT_PREFIX, false));
    $('button#Texy').click(() => editThreadData(TEXY_PREFIX, false));
    $('button#Resheno').click(() => editThreadData(RESHENO_PREFIX, false));
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