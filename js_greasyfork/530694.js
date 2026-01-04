// ==UserScript==
// @name         BLESS RUSSIA | Руководство
// @namespace    https://forum.blessrussia.com
// @version      1.80
// @description  Для сотрудников "Контроля Качества"
// @author       KING RUSSIA
// @match        https://forum.blessrussia.online/index.php*
// @include      https://forum.blessrussia.online/index.php
// @grant        none
// @license 	 MIT
// @collaborator Basis of Antonio Carrizo and consultant Rosenfeld
// @icon https://icons.iconarchive.com/icons/thesquid.ink/free-flat-sample/128/support-icon.png
// @downloadURL https://update.greasyfork.org/scripts/530694/BLESS%20RUSSIA%20%7C%20%D0%A0%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/530694/BLESS%20RUSSIA%20%7C%20%D0%A0%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%BE.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const PAQUA_PREFIX = 16; // Prefix that will be set when thread solved
  const PAQA_PREFIX = 15; // Prefix that will be set when thread solved
  const COMMAND_PREFIX = 9; // Prefix that will be set when thread send to project team
  const WATCHED_PREFIX = 4;
  const buttons = [
          {
        title: '----------------------------------- Работа с темами на отдел тестирование --------------------------------'
      },
	{
	  title: 'На рассмотрение',
	  content:
		'[CENTER][size=15px][font=Georgia]Приветствую, уважаемый(-ая) {{ user.mention }}![/size][/font][/CENTER]<br><br>' +
		"[CENTER][size=15px][font=Georgia][COLOR=rgb(255,255,255)]Ваша тема взята [COLOR=rgb(255,215,0)][B]на рассмотрение.[/B][/color][/size][/font][/CENTER]<br><br>" +
    '[CENTER][size=15px][font=Georgia][COLOR=rgb(0,255,255)]Проверено контролем качества![/color][/size][/font][/CENTER]',
    prefix: PAQA_PREFIX,
   status: true,
  },
  {
	  title: 'Обратно тех. спецу',
	  content:
		'[CENTER][size=15px][font=Georgia]Приветствую, уважаемый(-ая) {{ user.mention }}![/size][/font][/CENTER]<br><br>' +
		"[CENTER][size=15px][font=Georgia][COLOR=rgb(255,255,255)]К сожалению ваша тема не относится в [COLOR=rgb(0,255,255)][B]отдел тестирования.[/B][/color][/size][/font][/CENTER]<br><br>" +
    '[CENTER][size=15px][font=Georgia]Передано - [COLOR=rgb(255,69,0)][B]Техническому специалисту.[/B][/color][/size][/font][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][COLOR=rgb(0,255,255)]Проверено контролем качества![/color][/size][/font][/CENTER]',
    prefix: WATCHED_PREFIX,
   status: true,
  },

	{
	  title: 'Нарушение правил раздела',
	  content:
		'[CENTER][size=15px][font=Georgia]Приветствую, уважаемый(-ая) {{ user.mention }}![/size][/font][/CENTER]<br><br>' +
		"[CENTER][size=15px][font=Georgia]Пожалуйста, убедительная просьба, ознакомиться с назначением данного раздела в котором Вы создали тему, так как Ваш запрос никоим образом не относится к технической проблеме.[/size][/font][/CENTER]<br><br>" +
    '[CENTER][size=15px][font=Georgia][COLOR=rgb(255,0,0)][B]Отказано, закрыто.[/B][/color][/size][/font][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][COLOR=rgb(0,255,255)]Проверено контролем качества![/color][/size][/font][/CENTER]',
        prefix: PAQUA_PREFIX,
      status: true,
	},
	{
	  title: 'Краш / вылет',
	  content:
		'[CENTER][size=15px][font=Georgia]Приветствую, уважаемый(-ая) {{ user.mention }}![/size][/font][/CENTER]<br><br>' +
		"[CENTER][size=15px][font=Georgia]В том случае, если Вы вылетели из игры во время игрового процесса (произошел краш), в обязательном порядке необходимо обратиться в тех. поддержку в VK или Telegram:[/size][/font][/CENTER]<br><br>" +
    '[CENTER][size=15px][font=Georgia]VK - https://vk.com/kingcrmphelp | Telegram - https://t.me/tehkingrussia_bot[/size][/font][/CENTER]<br><br>' +
		'[CENTER][size=15px][font=Georgia][COLOR=rgb(255,215,0)]Решено, обратитесь в тех. поддержку, связи указанны выше.[/color][/size][/font][/CENTER]' +
    '[CENTER][size=15px][font=Georgia][COLOR=rgb(0,255,255)]Проверено контролем качества![/color][/size][/font][/CENTER]',
        prefix: PAQUA_PREFIX,
    status: false,
	},
	{
	  title: 'Дублирование темы',
	  content:
		'[CENTER][size=15px][font=Georgia]Приветствую, уважаемый(-ая) {{ user.mention }}![/size][/font][/CENTER]<br><br>' +
		"[CENTER][size=15px][font=Georgia]Ответ уже был дан в подобной теме. Пожалуйста, прекратите создавать идентичные или похожие темы - иначе Ваш форумный аккаунт может быть [COLOR=rgb(255,0,0)][B]заблокирован.[/B][/color][/size][/font][/CENTER]<br><br>" +
		'[CENTER][size=15px][font=Georgia][COLOR=rgb(255,0,0)][B]Закрыто.[/B][/color][/size][/font][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][COLOR=rgb(0,255,255)]Проверено контролем качества![/color][/size][/font][/CENTER]',
    prefix: PAQUA_PREFIX,
    status: false,
	},
  {
	  title: 'Проблема будет исправлена',
	  content:
		'[CENTER][size=15px][font=Georgia]Приветствую, уважаемый(-ая) {{ user.mention }}![/size][/font][/CENTER]<br><br>' +
		"[CENTER][size=15px][font=Georgia]Данная недоработка / ошибка будет [COLOR=rgb(0,255,0)][B]проверена и исправлена.[/B] [COLOR=rgb(255,255,255)]Спасибо за обращение, мы ценим Ваш огромный вклад в наш проект![/color][/size][/font][/CENTER]<br><br>" +
		'[CENTER][size=15px][font=Georgia][COLOR=rgb(0,255,0)][B]Рассмотрено.[/B][/color][/size][/font][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][COLOR=rgb(0,255,255)]Проверено контролем качества![/color][/size][/font][/CENTER]',
    prefix: PAQUA_PREFIX,
    status: false,
	},
  {
	  title: 'Уточните суть проблемы',
	  content:
		'[CENTER][size=15px][font=Georgia]Приветствую, уважаемый(-ая) {{ user.mention }}![/size][/font][/CENTER]<br><br>' +
		"[CENTER][size=15px][font=Georgia]Уточните более подробно суть вашего обращения.[/size][/font][/CENTER]<br><br>" +
		'[CENTER][size=15px][font=Georgia][COLOR=rgb(255,0,0)][B]Закрыто.[/B][/color][/size][/font][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][COLOR=rgb(0,255,255)]Проверено контролем качества![/color][/size][/font][/CENTER]',
    prefix: PAQUA_PREFIX,
    status: false,
	},
	{
	  title: 'Известно о проблеме',
	  content:
		'[CENTER][size=15px][font=Georgia]Приветствую, уважаемый(-ая) {{ user.mention }}![/size][/font][/CENTER]<br><br>' +
		"[CENTER][size=15px][font=Georgia]После проверки вашей темы, стало ясно, что данная ошибка/недоработка уже известна нам.[/size][/font][/CENTER]<br>" +
    '[CENTER][size=15px][font=Georgia]В скором времени баг будет исправлен.[/size][/font][/CENTER]<br><br>' +
		'[CENTER][size=15px][font=Georgia][COLOR=rgb(0,255,0)][B]Рассмотрено.[/B][/color][/size][/font][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][COLOR=rgb(0,255,255)]Проверено контролем качества![/color][/size][/font][/CENTER]',
    prefix: PAQUA_PREFIX,
    status: false,
},
  {
	  title: 'Передано на тестирование',
	  content:
		'[CENTER][size=15px][font=Georgia]Приветствую, уважаемый(-ая) {{ user.mention }}![/size][/font][/CENTER]<br><br>' +
		"[CENTER][size=15px][font=Georgia]Благодарим за уведомление о недоработке. Ваша тема находится в [COLOR=rgb(0,255,255)][B]процессе тестирования.[/B][/color][/size][/font]<br><br>" +
		'[CENTER][size=15px][font=Georgia][COLOR=rgb(255,215,0)][B]На рассмотрении.[/B][/size][/font][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][COLOR=rgb(0,255,255)]Проверено контролем качества![/color][/size][/font][/CENTER]',
        prefix: PAQUA_PREFIX,
    status: false,
	},
	{
	  title: 'Команде проекта',
	  content:
		'[CENTER][size=15px][font=Georgia]Приветствую, уважаемый(-ая) {{ user.mention }}![/size][/font][/CENTER]<br><br>' +
		"[CENTER][size=15px][font=Georgia][COLOR=rgb(255,255,255)]Ваша тема закреплена и находится [COLOR=rgb(255,215,0)][B]на рассмотрении.[/B] [COLOR=rgb(255,255,255)]Пожалуйста, ожидайте выноса вердикта [COLOR=rgb(255,215,0)][B]команды проекта.[/B][/color][/size][/font][/CENTER]<br><br>" +
		'[CENTER][size=15px][font=Georgia][COLOR=rgb(255,255,255)]Создавать новые темы с данной проблемой — [COLOR=rgb(255,0,0)][B]не нужно[/B][COLOR=rgb(255,255,255)], ожидайте ответа в данной теме. Если проблема решится - [COLOR=rgb(0,255,0)][B]Вы всегда можете уведомить нас о ее решении.[/B][/color][/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia][COLOR=rgb(0,255,255)]Проверено контролем качества![/color][/size][/font][/CENTER]',
    prefix: COMMAND_PREFIX,
   status: true,
  },
	{
	  title: 'Недостаточно доказательств',
	  content:
		'[CENTER][size=15px][font=Georgia]Приветствую, уважаемый(-ая) {{ user.mention }}![/size][/font][/CENTER]<br><br>' +
		"[CENTER][size=15px][font=Georgia][COLOR=rgb(255,255,255)]Без доказательств (в частности скриншоты или видео)[COLOR=rgb(255,0,0)] [B]– решить проблему не получится.[/B] [COLOR=rgb(255,255,255)]Если доказательства найдутся - создайте новую тему, приложив доказательства с фото-хостинга yapx.ru или imgur.com<br><br>" +
		'[CENTER][size=15px][font=Georgia][COLOR=rgb(0,255,0)][B]Рассмотрено, [COLOR=rgb(255,0,0)]закрыто.[/B][/color][/size][/font][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][COLOR=rgb(0,255,255)]Проверено контролем качества![/color][/size][/font][/CENTER]',
    prefix: PAQUA_PREFIX,
    status: false,
	},
];


    $(document).ready(() => {
      // Загрузка скрипта для обработки шаблонов
      $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');


// Добавление кнопок при загрузке страницы
addButton('На рассмотрении', 'pin');
addButton('КП', 'teamProject');
addButton('Отказано', 'unaccept');
addButton('Рассмотрено', 'watched');
addButton('Решено', 'accepted');
addButton('Закрыто', 'closed');
addButton('Ответы', 'selectAnswer');

      // Поиск информации о теме
      const threadData = getThreadData();

      $('button#pin').click(() => editThreadData(RASSMOTRENNO_PREFIX, true));
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