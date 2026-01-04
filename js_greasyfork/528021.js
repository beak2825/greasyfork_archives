// ==UserScript==
// @name         King Russia | 03 By S.Pamirskiy
// @namespace    https://forum.kingrussia.com/index.php*
// @version      1.22
// @description  Работа с форумом
// @author       Володя Ушаков | Viper_Sano
// @match        https://forum.kingrussia.com/index.php*
// @include      https://forum.kingrussia.com/index.php
// @grant        none
// @license 	 MIT
// @icon https://icons.iconarchive.com/icons/thesquid.ink/free-flat-sample/128/support-icon.png
// @downloadURL https://update.greasyfork.org/scripts/528021/King%20Russia%20%7C%2003%20By%20SPamirskiy.user.js
// @updateURL https://update.greasyfork.org/scripts/528021/King%20Russia%20%7C%2003%20By%20SPamirskiy.meta.js
// ==/UserScript==

(function () {
    'use strict';
  const RASSMOTRENNO_PREFIX = 7; // Prefix that will be set when thread pins
  const UNACCEPT_PREFIX = 6; // Prefix that will be set when thread closes
  const ACCEPT_PREFIX = 5; // Prefix that will be set when thread solved
  const COMMAND_PREFIX = 9; // Prefix that will be set when thread solved
  const WATCHED_PREFIX = 4;
  const buttons = [
      {
        title: '-----------------------------------Работа с жалобами на игроков--------------------------------'
      },
      {
        title: 'Взять жалобу на рассмотрение',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51, 255, 0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Благодарим вас за ваше обращение. Ваша жалоба получает Статус: [Color=rgb(255, 155 ,0)]На рассмотрении.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация сервера [COLOR=rgb(255,200,0)]King Russia[/color].[/size][/font][/CENTER]',
        prefix: WATCHED_PREFIX,
      status: false,
      },
      {
        title: 'не по форме',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51, 255, 0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Жалобы не по форме мы не рассматриваем[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация сервера [COLOR=rgb(255,200,0)]King Russia[/color].[/size][/font][/CENTER]',
        prefix: UNACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'Нет док-в',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51, 255, 0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Без доказательств/недостатка доказательств мы помочь не можем[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация сервера [COLOR=rgb(255,200,0)]King Russia[/color].[/size][/font][/CENTER]',
        prefix: UNACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'Не относится',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51,255,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Ваше обращение не относится к данному разделу.[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация сервера [COLOR=rgb(255,200,0)]King Russia[/color].[/size][/font][/CENTER]',
        prefix: UNACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'Дубликат',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51,255,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Ваша тема является дубликатом предыдущей.[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация сервера [COLOR=rgb(255,200,0)]King Russia[/color].[/size][/font][/CENTER]',
        prefix: UNACCEPT_PREFIX,
      status: false,
      },
     {
        title: 'Отказано',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51,255,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Благодарим вас за ваше ожидание. Ваша жалоба получает Статус: [Color=rgb(255, 155 ,0)]Отказано.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация сервера [COLOR=rgb(255,200,0)]King Russia[/color].[/size][/font][/CENTER]',
        prefix: UNACCEPT_PREFIX,
      status: false,
      },
     {
        title: 'Одобрено',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51,255,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Благодарим вас за ваше ожидание. Ваша жалоба получает Статус: [Color=rgb(60,250,0)]Одобрено.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация сервера [COLOR=rgb(255,200,0)]King Russia[/color].[/size][/font][/CENTER]',
        prefix: ACCEPT_PREFIX,
      status: false,
      },

         {
        title: '-----------------------------------Работа с жб на адм--------------------------------'
      },
      {
        title: 'Взять жалобу на рассмотрение',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51,255,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Благодарим вас за ваше обращение. Ваша жалоба получает Статус: [Color=rgb(255, 155 ,0)]На рассмотрении.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, [COLOR=rgb(56,245,188)]Администрация сервера[/color].[/size][/font][/CENTER]',
        prefix: WATCHED_PREFIX,
      status: false,
      },
       {
        title: 'Одобрено на адм',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51,255,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Ознакомившись с доказательствами, администратор будет наказан. Ваша жалоба получает Статус: [Color=rgb(60, 250 ,0)]Одобрено.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением,[COLOR=rgb(56,245,188)]Администрация сервера[/color].[/size][/font][/CENTER]',
        prefix: ACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'Запрос докв у адм',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51,255,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Благодарим вас за ваше обращение. [Color=rgb(255,155,0)]Запросил доказательства у администратора[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением,[COLOR=rgb(56,245,188)]Администрация сервера[/color].[/size][/font][/CENTER]',
        prefix: WATCHED_PREFIX,
      status: false,
      },
      {
        title: 'Отказано на адм',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(255,0,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Администратор предоставил доказательства. Ваша жалоба получает Статус: [Color=rgb(255,0,0)]Отказано.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением,[COLOR=rgb(56,245,188)]Администрация сервера[/color].[/size][/font][/CENTER]',
        prefix: UNACCEPT_PREFIX,
      status: false,
      },
    {
        title: '-----------------------------------Рп биографии--------------------------------'
      },
    {
        title: 'Отказать рп био',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51, 255, 0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Ваша рп биография получает Статус: [Color=rgb(255, 0 ,0)]Отказано.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация сервера [COLOR=rgb(255,200,0)]King Russia[/color].[/size][/font][/CENTER]',
        prefix: WATCHED_PREFIX,
      status: false,
      },
    {
        title: 'Взять рп био на рассмотрение',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51, 255, 0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Ваша рп биография получает Статус: [Color=rgb(60, 250 ,0)]Одобрено.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация сервера [COLOR=rgb(255,200,0)]King Russia[/color].[/size][/font][/CENTER]',
        prefix: WATCHED_PREFIX,
      status: false,
      },
    {
        title: 'Одобрить рп био ',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51, 255, 0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Ваша рп биография получает Статус: [Color=rgb(51, 255 ,0)]Одобрено.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация сервера [COLOR=rgb(255,200,0)]King Russia[/color].[/size][/font][/CENTER]',
        prefix: WATCHED_PREFIX,
      status: false,
      },
    {
        title: 'Отказ по причине скопирована',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51,255,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Ваша рп биография является копией.[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация сервера [COLOR=rgb(255,200,0)]King Russia[/color].[/size][/font][/CENTER]',
        prefix: UNACCEPT_PREFIX,
      status: false,
      },
    {
        title: '-----------------------------------Рп ситуации--------------------------------'
      },
  ];

    $(document).ready(() => {
      // Загрузка скрипта для обработки шаблонов
      $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

      // Добавление кнопок при загрузке страницы
      addButton('Не рубит,фиксшю', 'pin');
      addButton('Тоже не рубит', 'accepted');
      addButton('Тоже не рубит', 'unaccept');
      addButton('Тоже не рубит', 'Ga');
      addButton('Тоже не рубит', 'teamProject');
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