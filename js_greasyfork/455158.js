// ==UserScript==
// @name         Forum Script for Leaders
// @namespace    https://forum.blackrussia.online
// @version      1.0
// @description  Always remember who you are!
// @author       Angel Persona
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @grant        none
// @license    MIT
// @collaborator 
// @icon https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @downloadURL https://update.greasyfork.org/scripts/455158/Forum%20Script%20for%20Leaders.user.js
// @updateURL https://update.greasyfork.org/scripts/455158/Forum%20Script%20for%20Leaders.meta.js
// ==/UserScript==
 
(function () {
  'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const TEX_PREFIX = 13;
const buttons = [
	{
	  title: '-----  Заявка на СС  --------------------------------------------------------------------------------------------------------------------------------',
	},
    {
      title: 'Открыть заявку',
      content:
		'[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman]Требования к кандидату[/FONT][/COLOR]<br>' +
		"[FONT=times new roman]- Иметь Discord и исправно работающий микрофон<br>" +
		'- Быть в возрасте не менее 14 лет<br>' +
		"- Не иметь действующих варнов/банов<br>" +
		'- Иметь RP NickName<br>' +
		"- Быть ознакомленным с правилами лидера/заместителя/опг и правилами BizWar[/FONT]<br><br>" +
		'[COLOR=rgb(209, 213, 216)][FONT=times new roman]Свободные места на должности[/FONT][/COLOR]<br>' +
		"[FONT=times new roman][9] Положенец - 2 места<br>" +
		'[8] Смотрящий - 4 места<br>' +
		"[7] Браток - 5 мест[/FONT]<br><br>" +
		'[SIZE=4][FONT=times new roman]Форма подачи заявления:[/FONT][/SIZE]<br><br>' +
		"[FONT=times new roman][B][COLOR=rgb(209, 213, 216)]OOC Информация[/COLOR][/B]<br>" +
		'1. Ваше Имя:<br>' +
		"2. Ваш возраст:<br>" +
		'3. Ваш часовой пояс ( от МСК ):<br>' +
		"4. Ваш средний онлайн в день:<br>" +
		'5. Имелись ли баны/варны:<br>' +
		"6. Расскажите о себе ( минимум 5 строк ):<br>" +
		'7. Ваша страница VK:<br>' +
		"8. Ваш Discord (пример: angelochek#7143):<br>" +
		'9. Скриншот вашей статистики (/time + /mm > Статистика):<br><br>' +
		"[B][COLOR=rgb(209, 213, 216)]IC Информация[/COLOR][/B]<br>" +
		'1. Ваш NickName:<br>' +
		"2. Почему именно вы должны занять пост Старшего Состава?:<br>" +
		'3. Имеется ли опыт в данной организации ( указать подробно ):<br>' +
		"4. Ваши предложения по улучшению фракции ( максимально подробно ):<br>" +
		'5. Были ли вы Старшим Составом в любой другой организации?:[/FONT][/CENTER]',
    },
    {
      title: 'Закрыть на рассмотрение',
      content:
		'[CENTER][FONT=times new roman]Здравствуйте<br><br>' +
		"Заявки [COLOR=#ff0000]закрыты[/COLOR] на рассмотрениe<br><br>" +
		'[icode]На рассмотрении[/icode][/CENTER][/FONT]',
    },
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
    $('button#Texy').click(() => editThreadData(TEX_PREFIX, true));
    $('button#close').click(() => editThreadData(CLOSE_PREFIX, false));
 
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