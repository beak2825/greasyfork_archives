// ==UserScript==
// @name         Скрипт для ГС/ЗГС ГОСС и ОПГ
// @namespace    https://forum.blackrussia.online
// @version      1.0.0
// @description  Description
// @author       Wortexxx Xenon
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license 	 none
// @collaborator none
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/534636/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%A1%D0%97%D0%93%D0%A1%20%D0%93%D0%9E%D0%A1%D0%A1%20%D0%B8%20%D0%9E%D0%9F%D0%93.user.js
// @updateURL https://update.greasyfork.org/scripts/534636/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%A1%D0%97%D0%93%D0%A1%20%D0%93%D0%9E%D0%A1%D0%A1%20%D0%B8%20%D0%9E%D0%9F%D0%93.meta.js
// ==/UserScript==

(function() {
    'use strict';
  const REVIEWED_PREFIX = 9; // Prefix that will be set when thread reviewed
  const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
  const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
  const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem
  const PIN_PREFIX = 2; // Prefix that will be set when thread pins
  const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
  const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
  const CLOSE_PREFIX = 7; // Prefix that will be set when thread closes.
  const VAJNO_PREFIX = 1;
  const WATCHED_PREFIX = 9;
  const TEX_PREFIX = 13;
  const PREFIKS = 0;
  const OTKAZRP_PREFIX = 4;
  const ODOBRENORP_PREFIX = 8;
  const NARASSMOTRENIIRP_PREFIX = 2;
  const NARASSMOTRENIIORG_PREFIX = 2;
  const buttons = [

      {
          title: '|-(--(->----------------- ОПГ/ГОСС ----------------<-)--)-|'
      },
      {
          title: `| Просмотр еженедельного отчета |`,
          content:
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
              "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
              "[B][CENTER][COLOR=lavender]Ваш отчет был [COLOR=green]Рассмотрен[/COLOR]. <br>"+
              "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>"+
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
          prefix: REVIEWED_PREFIX,
          status: true,
      },
      {
          title: `| Заявки на пост ЛД, рассмотрение |`,
          content:
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
              "[B][CENTER][COLOR=lavender]Закрываю заявки на [COLOR=orange]Рассмотрение[/COLOR]! <br>"+
              "[B][CENTER][COLOR=lavender]Ожидайте ответа. <br>"+
              "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>"+
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
          prefix: PIN_PREFIX,
          status: true,
      },

  ];

  $(document).ready(() => {
      // Загрузка скрипта для обработки шаблонов
      $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

      // Добавление кнопок при загрузке страницы
      addButton('Одобрено', 'accepted', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(110, 192, 113, 0.5);');
      addButton('Отказано', 'unaccept', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(220, 89, 89, 0.5);');
      addButton('📒 ШАБЛОНЧИКИ 📒', 'selectAnswer', 'border-radius: 13px; margin-right: 5px; border: 2px solid;  border-color: rgb(255, 240, 110, 0.5);');

      // Поиск информации о теме
      const threadData = getThreadData();

      $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
      $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
      $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
      $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
      $('button#Zakrito').click(() => editThreadData(UNACCEPT_PREFIX, false));

      $(`button#selectAnswer`).click(() => {
          XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
          buttons.forEach((btn, id) => {
              if(id > 1) {
                  $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
              } else {
                  $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
              }
          });
      });
  });

   function addButton(name, id, style) {
           $('.button--icon--reply').before(
      `<button type="button" class="button--primary button rippleButton" id="${id}" style="${style}">${name}</button>`,
      );
      }
    function addAnswers() {
          $('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswer" style="oswald: 3px; margin-left: 5px; margin-top: 10px; border-radius: 13px;">ОТВЕТЫ</button>`,
      );
      }

      function buttonsMarkup(buttons) {
      return `<div class="select_answer">${buttons
      .map(
      (btn, i) =>
      `<button id="answers-${i}" class="button--primary button ` +
      `rippleButton" style="margin:4px; ${btn.dpstyle}"><span class="button-text">${btn.title}</span></button>`,
      )
      .join('')}</div>`;
      }

  function pasteContent(id, data = {}, send = false) {
      const template = Handlebars.compile(buttons[id].content);
      if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

      $('span.fr-placeholder').empty();
      $('div.fr-element.fr-view p').append(template(data));
      $('a.overlay-titleCloser').trigger('click');

      if(send == true){
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
      }
      if(pin == true){
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
  }

  function getFormData(data) {
      const formData = new FormData();
      Object.entries(data).forEach(i => formData.append(i[0], i[1]));
      return formData;
    }
  })();