// ==UserScript==
// @name         BR | Script for ZGA
// @namespace    https://forum.blackrussia.online
// @version      1.1.1.5
// @description  Для наказания администрации 
// @author       Ermakov 
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @grant        none
// @license    MIT
// @collaborator ermakov
// @icon https://icons.iconarchive.com/icons/aha-soft/iron-man/48/Ironman-Mask-3-Old-icon.png
// @copyright 2021, Moiseeev (https://openuserjs.org/users/moiseeev)
// @downloadURL https://update.greasyfork.org/scripts/437950/BR%20%7C%20Script%20for%20ZGA.user.js
// @updateURL https://update.greasyfork.org/scripts/437950/BR%20%7C%20Script%20for%20ZGA.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
  const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
  const PIN_PREFIX = 2; // Prefix that will be set when thread pins
  const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
  const WATCHED_PREFIX = 9;
  const CLOSE_PREFIX = 7;
  const buttons = [{
      title: 'Приветствие',
      content: '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' + '[CENTER]  [/CENTER][/FONT]',
    },
    {
      title: 'Форма темы',
      content: '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>' +
        "[CCENTER]Ваша жалоба составлена не по форме, убедительная просьба, ознакомиться с правилами подачи жалобы на администрацию, которые закреплены в данном разделе.br><br>" +
		'[CENTER]Отказано, закрыто.[/CENTER]',
    },
    {
      title: 'Правила раздела',
      content: '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Пожалуйста,убедительная просьба,ознакомиться с назначением данного раздела,в котором вы создали тему. [/CENTER]<br>" +
        '[CENTER]Отказано,закрыто.[/CENTER][/FONT]',
    },
    {
      title: 'Дубль Тема',
      content: '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Дублирование темы. Напоминаем, при 3 дублированиях – форумный аккаунт будет заблокирован.<br>" +
        '[CENTER]Отказано, закрыто.[/CENTER][/FONT]',
    },
    { 
      title: 'Док-ва предоставлены',
      content: '[FONT=Courier New][CENTER]{{ greeting }},уважаемый {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Администратор предоставил доказательства, наказание выдано верно.<br>" +
        '[CENTER]Отказано, закрыто.[/CENTER]',
    },
    {
      title: 'Недостаточно доказательств',
      content: '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>' +
        '[CENTER]Ваша жалоба отказана по одной из следующих причин:<br' +
        "[CENTER]1.Недостаточно доказательств.<br>" +
        "[CENTER]2.На ваших доказательствах отсутствует /time (на одном из скриншотов).<br>"+
        "CENTER]3.Отсутствует никнейм Администратора, причина наказания и на какое время было выдано.<br>"+
        '[CENTER]Отказано, закрыто.[/CENTER][/FONT]',
    },
    {
      title: 'Жалоба одобрена',
      content: '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба одобрена, а с администратором будет проведена строгая беседа.<br>" +
        "[CENTER]Ваше наказание будет снято.<br>" +
        '[CENTER]Одобрено,закрыто.[/CENTER][/FONT]',
    },
    {
      title: 'Док-ва в соц.сети',
      content: '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Доказательства должны быть загружены только на фото/видео хостинг (YouTube, Imgur, yapx и тд)<br>"+
        "[CCENTER]Загрузка доказательств в соц.сети (ВКонтакте, Facebook, Instagram и т.д)запрещено.<br>"+
        '[CENTER]Отказано ,закрыто.[/CENTER][/FONT]',
    },
    {
      title: 'Запрос докв',
      content: '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба взята на рассмотрение.<br>"+
        '[CENTER]Oжидайте ответа от администрации и не нужно создавать копии этой темы.<br>' +
        '[CENTER]На рассмотрении.[/CENTER][/FONT]',
    },
    {
      title: 'Название темы',
      content: '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Название темы не по форме (Nick_Name администратора | Нарушение).<br>"+
        '[CENTER] Отказано, закрыто.[/CENTER][/FONT]',
    },
    {
      title: 'Окно бана',
      content: '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Даю Вам 24 часа на прикрепление скриншота окна блокировки.<br>"+
        '[CENTER]На рассмотрении.[/CENTER][/FONT]',
    },
    {
      title: 'Жб на техов',
      content: '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Обратитесь в раздел Жлобы на технических специалистов [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2.490/] [B] Нажмите [/B][/URL]<br>"+
        '[CENTER]Отказано, закрыто.[/CENTER][/FONT]',
    },
    ];
  $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    // Добавление кнопок при загрузке страницы
    addButton('На рассмотрении', 'pin');
    addButton('КП', 'teamProject');
    addButton('Одобрено', 'accepted');
    addButton('Отказано', 'unaccept');
    addButton('Ответы', 'selectAnswer');

    // Поиск информации о теме
    const threadData = getThreadData();

    $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
    $('button#teamProject').click(() => editThreadData 
        (COMMAND_PREFIX, true));
    $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));

    $(`button#selectAnswer`).click(() => {
      XF.alert(buttonsMarkup(buttons), null, 'Добавьте nullт:');
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
  }

  function getFormData(data) {
    const formData = new FormData();
    Object.entries(data).forEach(i => formData.append(i[0], i[1]));
    return formData;
  }
})();
