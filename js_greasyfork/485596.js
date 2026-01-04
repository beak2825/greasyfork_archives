// ==UserScript==
// @name         Скрипт для Кураторов Форума (Биографии) || SARATOV
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Скрипт для кураторов Форума
// @author       Tonny Empresso
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/
// @icon         https://i.ibb.co/HDz28xX/OTKSk-Lk5od-Q.jpg
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/485596/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%28%D0%91%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8%29%20%7C%7C%20SARATOV.user.js
// @updateURL https://update.greasyfork.org/scripts/485596/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%28%D0%91%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8%29%20%7C%7C%20SARATOV.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const UNACCСEPT_PREFIX = 4; // Prefix that will be set when thread closes
  const ACCСEPT_PREFIX = 8; // Prefix that will be set when thread accepted
  const PINN_PREFIX = 2; // Prefix that will be set when thread pins
  const buttons = [
{
      title: 'Биография одобрена',
	  content:
		"[B][CENTER][FONT=times new roman][COLOR=aqua][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/CENTER][/B]<br><br>" +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Рассмотрев вашу RolePlay биографию я готов вынести вердикт.<br><br>"+
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>"+
        "[B][CENTER][FONT=times new roman][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR][COLOR=RED]RUSSIA[/COLOR] [COLOR=#00BFFF]SARATOV[/COLOR].<br><br>",
      prefix: ACCСEPT_PREFIX,
      move: 1661,
	  status: false,
},
{
      title: 'Отказ (Не по форме)',
	  content:
		"[B][CENTER][FONT=times new roman][COLOR=aqua][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/CENTER][/B]<br><br>" +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Ваша RolePlay биография написана не по форме.<br><br>"+
        "[B][CENTER][FONT=times new roman][COLOR=#ff0000]Отказано.[/COLOR]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      move: 1663,
	  status: false,
},
{
      title: 'Отказ (Не заполнена)',
	  content:
		"[B][CENTER][FONT=times new roman][COLOR=aqua][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/CENTER][/B]<br><br>" +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Форма RolePlay биографии не заполнена частично либо вовсе не заполнена.<br><br>"+
        "[B][CENTER][FONT=times new roman][COLOR=#ff0000]Отказано.[/COLOR]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      move: 1663,
	  status: false,
},
{
      title: 'Отказ (Мало информации)',
	  content:
		"[B][CENTER][FONT=times new roman][COLOR=aqua][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/CENTER][/B]<br><br>" +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Недостаточное количество RolePlay информации о вашем персонаже. <br><br>"+
        "[B][CENTER][FONT=times new roman][COLOR=#ff0000]Отказано.[/COLOR]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      move: 1663,
	  status: false,
},
{
      title: 'Отказ (Скопирована)',
	  content:
		"[B][CENTER][FONT=times new roman][COLOR=aqua][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/CENTER][/B]<br><br>" +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Ваша RolePlay биография скопирована. <br><br>"+
        "[B][CENTER][FONT=times new roman][COLOR=#ff0000]Отказано.[/COLOR]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      move: 1663,
	  status: false,
},
{
      title: 'Отказ (Заголовок)',
	  content:
		"[B][CENTER][FONT=times new roman][COLOR=aqua][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/CENTER][/B]<br><br>" +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]У вашей RolePlay биографии не верный заголовок. <br><br>"+
        "[B][CENTER][FONT=times new roman][COLOR=#ff0000]Отказано.[/COLOR]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      move: 1663,
	  status: false,
},
{
      title: 'Отказ (От 1-го лица)',
	  content:
		"[B][CENTER][FONT=times new roman][COLOR=aqua][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/CENTER][/B]<br><br>" +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Ваша RolePlay биография написана от 1-го лица. <br><br>"+
        "[B][CENTER][FONT=times new roman][COLOR=#ff0000]Отказано.[/COLOR]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      move: 1663,
	  status: false,
},
{
  	  title: 'Отказ (Возраст не совпал)',
	  content:
		"[B][CENTER][FONT=times new roman][COLOR=aqua][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/CENTER][/B]<br><br>" +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Возраст не совпадает с датой рождения. <br><br>"+
        "[B][CENTER][FONT=times new roman][COLOR=#ff0000]Отказано.[/COLOR]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      move: 1663,
	  status: false,
},
{
   	  title: 'Отказ (Маленький возраст)',
	  content:
		"[B][CENTER][FONT=times new roman][COLOR=aqua][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/CENTER][/B]<br><br>" +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Возраст вашего персонажа слишком мал. <br><br>"+
        "[B][CENTER][FONT=times new roman][COLOR=#ff0000]Отказано.[/COLOR]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      move: 1663,
	  status: false,
},
{
      title: 'Отказ (Ошибки)',
	  content:
		"[B][CENTER][FONT=times new roman][COLOR=aqua][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/CENTER][/B]<br><br>" +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]В вашей RolePlay биографии присутствуют грамматические, речевые либо пунктуационные ошибки. <br><br>"+
        "[B][CENTER][FONT=times new roman][COLOR=#ff0000]Отказано.[/COLOR]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      move: 1663,
	  status: false,
},
{
      title: 'Отказ (НРП ник)',
	  content:
		"[B][CENTER][FONT=times new roman][COLOR=aqua][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/CENTER][/B]<br><br>" +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]У вас NonRP NickName. <br><br>"+
        "[B][CENTER][FONT=times new roman][COLOR=#ff0000]Отказано.[/COLOR]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      move: 1663,
	  status: false,
},
{
      title: 'Отказ (2 биографии)',
	  content:
		"[B][CENTER][FONT=times new roman][COLOR=aqua][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/CENTER][/B]<br><br>" +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]У вас уже существует действующая, одобренная RolePlay Биография на данном сервере. <br><br>"+
        "[B][CENTER][FONT=times new roman][COLOR=#ff0000]Отказано.[/COLOR]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      move: 1663,
	  status: false,
},
{
      title: 'Отказ (Супер-способности)',
	  content:
		"[B][CENTER][FONT=times new roman][COLOR=aqua][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/CENTER][/B]<br><br>" +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Вы приписали к своему персонажу супер-способности либо что то на подобии этого. <br><br>"+
        "[B][CENTER][FONT=times new roman][COLOR=#ff0000]Отказано.[/COLOR]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      move: 1663,
	  status: false,
},
{
      title: 'На дополнение',
	  content:
		"[B][CENTER][FONT=times new roman][COLOR=aqua][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/CENTER][/B]<br><br>" +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Ваша RolePlay биография нарушает правила подачи RolePlay биографий. У вас есть 24 часа на на исправление своей биографии.<br><br>"+
        "[B][CENTER][FONT=times new roman][COLOR=#ffff00]На дополнении.[/COLOR]<br><br>",
      prefix: PINN_PREFIX,
      move: 1662,
	  status: true,
},


];

  const tasks = [
      {
        title: 'В архив',
        prefix: 0,
        move: 1639,
      },
      {
        title: 'В одобренные био',
        prefix: ACCСEPT_PREFIX,
        move: 1661,
      },
      {
        title: 'Био на доработку',
        prefix: PINN_PREFIX,
        move: 1662,
      },
      {
        title: 'В отказанные био',
        prefix: UNACCСEPT_PREFIX,
        move: 1663,
      },

 ];

 $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    // Добавление кнопок при загрузке страницы
    addButton('『Куратор форума』', 'selectAnswer');

    // Поиск информации о теме
    const threadData = getThreadData();

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
        6 < hours && hours <= 11 ?
        'Доброе утро' :
        12 < hours && hours <= 17 ?
        'Добрый день' :
        18 < hours && hours <= 23 ?
        'Добрый вечер' :
        0 < hours && hours <= 5 ?
        'Доброй ночи' :
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