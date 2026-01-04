// ==UserScript==
// @name         Скрипт для RolePlay биографий
// @namespace    https://forum.blackrussia.online
// @version      2.1
// @description  Comfort moderation
// @author       Mikhail Pearson
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @grant        none
// @license 	 MIT
// @copyright 2023,
// @downloadURL https://update.greasyfork.org/scripts/455136/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20RolePlay%20%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/455136/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20RolePlay%20%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
  const FAIL_PREFIX = 4;
  const OKAY_PREFIX = 8;
  const WAIT_PREFIX = 2;
  const TECH_PREFIX = 13;
  const WATCH_PREFIX = 9;
  const CLOSE_PREFIX = 7;

  const FONT = "Courier New"
  const SIZE = "4"

  const buttons = [
      {
        title: 'Приветствие',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER][/CENTER]<br>" +
          '[CENTER][/CENTER][/FONT][/SIZE]',
      },
      {
        title: 'На доработку',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]При рассмотрении вашей темы, были выявлены следующие ошибки:[/CENTER]<br>" +
          "[CENTER][/CENTER]<br><br>" +
          '[CENTER]На доработку у вас есть 24 часа.[/CENTER][/FONT][/SIZE]',
      },
      {
        title: 'Биография одобрена',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Ваша RolePlay биография проверена и одобрена.[/CENTER]<br><br>" +
          '[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]',
        prefix: OKAY_PREFIX,
        status: false,
      },
      {
        title: '_____________________ДОРАБОТКА_____________________',
      },
      {
        title: '_____________________ДОРАБОТКА_____________________',
      },
      {
        title: 'Заголовок биографии',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Название темы должно быть строго по данной форме: «RolePlay биография гражданина Имя Фамилия».[/CENTER]<br>" +
          "[CENTER]Подробнее о правилах составления RolePlay биографий можно ознакомиться тут → *[URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%B4%D0%BB%D1%8F-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.207481/']Кликабельно[/URL]*[/CENTER]<br><br>" +
          '[CENTER]На доработку у вас есть 24 часа.[/CENTER][/FONT][/SIZE]',
        prefix: WAIT_PREFIX,
        status: true,
      },
      {
        title: 'От третьего лица',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Повествование в вашей RolePlay биографии составлено от третьего лица.[/CENTER]<br>" +
          "[CENTER]Подробнее о правилах составления RolePlay биографий можно ознакомиться тут → *[URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%B4%D0%BB%D1%8F-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.207481/']Кликабельно[/URL]*[/CENTER]<br><br>" +
          '[CENTER]На доработку у вас есть 24 часа.[/CENTER][/FONT][/SIZE]',
        prefix: WAIT_PREFIX,
        status: true,
      },
      {
        title: 'Грамматические ошибки',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]В вашей теме допущены грамматические ошибки.[/CENTER]<br><br>" +
          '[CENTER]На доработку у вас есть 24 часа.[/CENTER][/FONT][/SIZE]',
        prefix: WAIT_PREFIX,
        status: true,
      },
      {
        title: 'Дата рождения',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Дата рождения персонажа не сходится с его возрастом в текущий момент.[/CENTER]<br><br>" +
          '[CENTER]На доработку у вас есть 24 часа.[/CENTER][/FONT][/SIZE]',
        prefix: WAIT_PREFIX,
        status: true,
      },
      {
        title: 'Проблемы с возрастом',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Дата рождения персонажа не сходится с его возрастом в текущий момент.[/CENTER]<br>" +
          '[CENTER]На доработку у вас есть 24 часа.[/CENTER][/FONT][/SIZE]',
        prefix: WAIT_PREFIX,
        status: true,
      },
      {
        title: 'Заголовок не соотв. имени',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Имя в форме биографии не соответствует заголовку.[/CENTER]<br>" +
          '[CENTER]На доработку у вас есть 24 часа.[/CENTER][/FONT][/SIZE]',
        prefix: WAIT_PREFIX,
        status: true,
      },
      {
        title: '______________________ОТКАЗЫ______________________',
      },
      {
        title: '______________________ОТКАЗЫ______________________',
      },
      {
        title: 'Истёк срок рассмотрения',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]По истечению 24-х часов полного объёма изменений не последовало.[/CENTER]<br><br>" +
          '[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]',
        prefix: FAIL_PREFIX,
        status: false,
      },
      {
        title: 'Сообщение не по теме',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Ваше сообщение никаким образом не относится к теме данного раздела.[/CENTER]<br><br>" +
          '[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]',
        prefix: FAIL_PREFIX,
        status: false,
      },
      {
        title: 'Ответ ранее',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Ответ вам был дан в предыдущей теме.[/CENTER]<br><br>" +
          '[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]',
        prefix: FAIL_PREFIX,
        status: false,
      },
      {
        title: 'Форма биографии',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Ваша RolePlay биография составлена не по форме. Ниже представлена актуальная форма: Имя Фамилия:<br>Пол:<br>Национальность:<br>Возраст:<br>Дата и место рождения:<br>Семья:<br>Место текущего проживания:<br>Описание внешности:<br>Особенности характера:<br>(Отсюда требуется расписать каждый из пунктов) Детство:<br>Юность и взрослая жизнь:<br>Настоящее время:<br>Хобби:[/CENTER]<br>" +
          "[CENTER]Подробнее о правилах составления RolePlay биографий можно ознакомиться тут → *[URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%B4%D0%BB%D1%8F-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.207481/']Кликабельно[/URL]*[/CENTER]<br><br>" +
          '[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]',
        prefix: FAIL_PREFIX,
        status: false,
      },
      {
        title: 'Биография скопирована',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Ваша RolePlay биография скопирована или слишком схожа с одной из предыдущих.[/CENTER]<br>" +
          "[CENTER]Подробнее о правилах составления RolePlay биографий можно ознакомиться тут → *[URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%B4%D0%BB%D1%8F-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.207481/']Кликабельно[/URL]*[/CENTER]<br><br>" +
          '[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]',
        prefix: FAIL_PREFIX,
        status: false,
      },
      {
        title: 'Слишком много ошибок',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]В вашей теме допущено слишком много грамматических ошибок.[/CENTER]<br><br>" +
          '[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]',
        prefix: FAIL_PREFIX,
        status: false,
      },
  ];
   
  $(document).ready(() => {
      // Загрузка скрипта для обработки шаблонов
      $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
   
      addButton('МЕНЮ БИОГРАФИЙ', 'selectAnswer1');
      addButton('|', '');
   
      // Поиск информации о теме
      const threadData = getThreadData();
   
   $('button#pin').click(() => editThreadData(WAIT_PREFIX, true));
   $('button#tech').click(() => editThreadData(TECH_PREFIX, true));
   $('button#accepted').click(() => editThreadData(OKAY_PREFIX, false));
   $('button#watch').click(() => editThreadData(WATCH_PREFIX, false));
   $('button#close').click(() => editThreadData(CLOSE_PREFIX, false));
   $('button#unaccept').click(() => editThreadData(FAIL_PREFIX, false));
   
      $(`button#selectAnswer1`).click(() => {
          XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
          buttons.forEach((btn, id) => {
              if(id > 2) {
                  $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
              } else {
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

      if (buttons[id].status == false) {
        $('a.overlay-titleCloser').trigger('click');
      }
   
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
      4 < hours && hours <= 11
        ? 'Доброе утро'
        : 11 < hours && hours <= 15
        ? 'Добрый день'
        : 15 < hours && hours <= 21
        ? 'Добрый вечер'
        : 'Доброй ночи',
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
              discussion_open: 1,
              sticky: 1,
              _xfToken: XF.config.csrf,
              _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
              _xfWithData: 0,
              _xfResponseType: 'json',
            }),
          }).then(() => location.reload());
      }
      if (prefix == FAIL_PREFIX) {
        moveThread(prefix, 63)
      }
      if (prefix == OKAY_PREFIX) {
        moveThread(prefix, 61)
      }
      if (prefix == WAIT_PREFIX) {
        moveThread(prefix, 62)
      }
  }
   
  function moveThread(prefix, type) {
  // Перемещение темы в раздел окончательных ответов
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
  })();