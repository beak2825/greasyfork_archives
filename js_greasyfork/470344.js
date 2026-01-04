// ==UserScript==
// @name         Скрипт для Прохора
// @namespace    https://forum.blackrussia.online
// @version      2.2
// @author       Mikhail Pearson
// @description  Крепкая мужская дружба
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @grant        none
// @license 	 MIT
// @icon https://i.yapx.ru/RMTMT.png
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/470344/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9F%D1%80%D0%BE%D1%85%D0%BE%D1%80%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/470344/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9F%D1%80%D0%BE%D1%85%D0%BE%D1%80%D0%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';
  const FAIL_PREFIX = 4;
  const OKAY_PREFIX = 8;
  const WAIT_PREFIX = 2;
  const TECH_PREFIX = 13;
  const WATCH_PREFIX = 9;
  const CLOSE_PREFIX = 7;
  const GA_PREFIX = 12;
  const SA_PREFIX = 11;
  const CP_PREFIX = 10;
  
  const START_DECOR = `<div style="text-align: center"><span style="font-family: 'Courier New'">`
  const END_DECOR = `</span></div>`
  
  const buttons = [
        {
          title: 'Приветствие',
          content: `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br><br><br>${END_DECOR}`
        },
        {
          title: 'Передать ГА',
          content:
              `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
              "Ваше обжалование передано на рассмотрение Главному Администратору.<br><br>" +
              `Ожидайте ответа.${END_DECOR}`,
          prefix: GA_PREFIX,
          status: true,
        },
        {
          title: 'Передать кузю',
          content:
              `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
              "Ваше обжалование передано на прассмотрение руководителю модераторов Discord.<br><br>" +
              `Ожидайте ответа.${END_DECOR}`,
          prefix: WAIT_PREFIX,
          status: true,
        },
        {
          title: 'Не подлежит',
          content:
              `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
              "Ваше наказание обжалованию не подлежит.<br><br>" +
              `Закрыто.${END_DECOR}`,
          prefix: CLOSE_PREFIX,
          status: false,
        },
        {
          title: 'Грубое нарушение',
          content:
              `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
              "Вы совершили грубое нарушение правил проекта, в обжаловании отказано.<br><br>" +
              `Закрыто.${END_DECOR}`,
          prefix: CLOSE_PREFIX,
          status: false,
        },
        {
          title: 'Не осознал',
          content:
              `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
              "В данный момент я не уверен, что вы полностью осознали свой поступок.<br><br>" +
              `Закрыто.${END_DECOR}`,
          prefix: CLOSE_PREFIX,
          status: false,
        },
        {
          title: 'nRP Обман',
          content:
              `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
              "Для разблокировки аккаунта необходимо полностью возместить ущерб, нанесённый игроку. Для этого вы должны связаться с обманутой стороной на форуме в его профиле. Под вашим сообщением этот человек должен оставить комментарий о том, что согласен на возмещение ущерба.<br><br>" +
              `Закрыто.${END_DECOR}`,
          prefix: CLOSE_PREFIX,
          status: false,
        },
        {
          title: 'Возмещение ущерба',
          content:
              `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
              "Аккаунт разблокирован, у вас есть 24 часа на возмещение полного объёма ущерба обманутой стороне.<br><br>" +
              `Ожидайте ответа.${END_DECOR}`,
          prefix: WAIT_PREFIX,
          status: true,
          open: true,
        },
        {
          title: 'Итог возмещения',
          content:
              `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
              "Информация проверена, аккаунт останется разблокированным.<br><br>" +
              `Закрыто.${END_DECOR}`,
          prefix: CLOSE_PREFIX,
          status: false,
        },
        {
          title: 'Обжалование одобрено',
          content:
              `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
              "Ваше обжалование одобрено, наказание будет снято в ближайшее время.<br><br>" +
              `Одобрено.${END_DECOR}`,
          prefix: OKAY_PREFIX,
          status: false,
        },
        {
          title: 'Одобрено на 7',
          content:
              `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
              "Ваше обжалование одобрено, наказание будет снижено до 7-ми дней блокировки.<br><br>" +
              `Одобрено.${END_DECOR}`,
          prefix: OKAY_PREFIX,
          status: false,
        },
        {
          title: 'Одобрено на 15',
          content:
              `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
              "Ваше обжалование одобрено, наказание будет снижено до 15-ти дней блокировки.<br><br>" +
              `Одобрено.${END_DECOR}`,
          prefix: OKAY_PREFIX,
          status: false,
        },
        {
          title: 'Одобрено на 30',
          content:
              `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
              "Ваше обжалование одобрено, наказание будет снижено до 30-ти дней блокировки.<br><br>" +
              `Одобрено.${END_DECOR}`,
          prefix: OKAY_PREFIX,
          status: false,
        },
        {
          title: 'Не по форме',
          content:
              `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
              "Ваше обжалование составлена не по форме, ознакомьтесь с правилами подачи жалоб → *[URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.3429398/']Кликабельно[/URL]*<br><br>" +
              `Закрыто.${END_DECOR}`,
          prefix: CLOSE_PREFIX,
          status: false,
        },
        {
          title: 'Отсутствуют доказательства',
          content:
              `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
              "В вашем обжаловании отсутствуют доказательства.<br><br>" +
              `Закрыто.${END_DECOR}`,
          prefix: CLOSE_PREFIX,
          status: false,
        },
        {
          title: 'Куда загружать док-ва',
          content:
              `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
              "Загрузите доказательства на любой фото/видео хостинг, например Imgur, Yapx, Youtube, и оставьте полученную ссылку в новой теме.<br><br>" +
              `Закрыто.${END_DECOR}`,
          prefix: CLOSE_PREFIX,
          status: false,
        },
        {
          title: 'Не работает ссылка',
          content:
              `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
              "Ссылка на доказательства не работает, или к доказательствам по ссылке закрыт доступ.<br><br>" +
              `Закрыто.${END_DECOR}`,
          prefix: CLOSE_PREFIX,
          status: false,
        },
        {
          title: 'Бан IP',
          content:
              `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
              "IP адрес был заблокирован не вам, вы случайно попали на заблокированный IP. Перезагрузите роутер, либо же смените способ подключения к интернету.<br><br>" +
              `Закрыто.${END_DECOR}`,
          prefix: CLOSE_PREFIX,
          status: false,
        },
        {
          title: 'Жалобы на адм',
          content:
              `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
              "Обратитесь в раздел жалоб на администрацию → *[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.86/']Кликабельно[/URL]*<br><br>" +
              `Закрыто.${END_DECOR}`,
          prefix: CLOSE_PREFIX,
          status: false,
        },
        {
          title: 'Жалобы на техов',
          content:
              `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
              "Обратитесь в раздел жалоб на технических специалистов → *[URL='https://forum.blackrussia.online/index.php?forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%961-red.1182/']Кликабельно[/URL]*<br><br>" +
              `Закрыто.${END_DECOR}`,
          prefix: CLOSE_PREFIX,
          status: false,
        },
        {
          title: 'Жалобы на игроков',
          content:
              `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
              "Обратитесь в раздел жалоб на игроков → *[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.88/']Кликабельно[/URL]*<br><br>" +
              `Закрыто.${END_DECOR}`,
          prefix: CLOSE_PREFIX,
          status: false,
        },
        {
          title: 'Бред / Не по теме',
          content:
              `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
              "Ваше обращение никак не относится к теме данного раздела.<br><br>" +
              `Закрыто.${END_DECOR}`,
          prefix: CLOSE_PREFIX,
          status: false,
        },
        {
          title: 'Рассмотрено не будет',
          content:
              `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
              "В данном формате обжалование рассмотрено не будет.<br><br>" +
              `Закрыто.${END_DECOR}`,
          prefix: CLOSE_PREFIX,
          status: false,
        },
        {
          title: 'Ошиблись сервером',
          content:
              `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
              "Пересоздайте жалобу в разделе нужного вам сервера → *[URL='https://forum.blackrussia.online/index.php#igrovye-servera.12']Кликабельно[/URL]*<br><br>" +
              `Закрыто.${END_DECOR}`,
          prefix: CLOSE_PREFIX,
          status: false,
        },
        {
          title: 'Ответ ранее',
          content:
              `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
              "Ответ вы получили в одной из предыдущих тем.<br><br>" +
              `Закрыто.${END_DECOR}`,
          prefix: CLOSE_PREFIX,
          status: false,
        },
        {
          title: 'Было снято',
          content:
              `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
              "Ваше наказание уже было снято.<br><br>" +
              `Закрыто.${END_DECOR}`,
          prefix: CLOSE_PREFIX,
          status: false,
        },
        {
          title: 'Куратор самый пиздатый',
          content:
              `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
              "Нарушений со стороны куратора администрации нет.<br><br>" +
              `Закрыто.${END_DECOR}`,
          prefix: CLOSE_PREFIX,
          status: false,
        },
        {
          title: 'Ответ выше, идите нахуй',
          content:
              `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
              "Ответ вам был дан выше.<br><br>" +
              `Закрыто.${END_DECOR}`,
          prefix: CLOSE_PREFIX,
          status: false,
        },
        {
          title: 'Выдано верно, отъебитесь',
          content:
              `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
              "После проверки доказательств администратора было принято решение, что наказание выдано верно.<br><br>" +
              `Закрыто.${END_DECOR}`,
          prefix: CLOSE_PREFIX,
          status: false,
        },
  ];
  
  $(document).ready(() => {
      // Загрузка скрипта для обработки шаблонов
      $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
  
      // Добавление кнопок при загрузке страницы
    addButton('Skip', 'not');
    addButton('to GA', 'ga');
    addButton('Close', 'closed');
    addButton('|', '');
    addButton('Menu', 'selectAnswer');
    addButton('|', '');
  
      // Поиск информации о теме
      const threadData = getThreadData();
    
    $('button#not').click(() => pasteContent(5, threadData, true));
    $('button#ga').click(() => pasteContent(1, threadData, true));
    $('button#closed').click(() => editThreadData(CLOSE_PREFIX, false));
    $('button#checked').click(() => editThreadData(WATCH_PREFIX, false));
  
      $(`button#selectAnswer`).click(() => {
          XF.alert(buttonsMarkup(buttons), null, 'Main menu');
          buttons.forEach((btn, id) => {
              if (id > 0) { 
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
      $('a.overlay-titleCloser').trigger('click');
  
      if(send == true){
          editThreadData(buttons[id].prefix, buttons[id].status, buttons[id].open);
          // editThreadData(buttons[id].prefix, buttons[id].status);
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
  
  function editThreadData(prefix, pin = false, open = false) {
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
      else if(open == true){
        fetch(`${document.URL}edit`, {
          method: 'POST',
          body: getFormData({
          prefix_id: prefix,
          discussion_open: 1,
          title: threadTitle,
          sticky: 1,
          _xfToken: XF.config.csrf,
          _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
          _xfWithData: 1,
          _xfResponseType: 'json',
          }),
        }).then(() => location.reload());
      }
      else if (pin == true) {
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
  
  function moveThread(prefix, target) {
    // Функция перемещения тем
    const threadTitle = $('.p-title-value')[0].lastChild.textContent;
    
    fetch(`${document.URL}move`, {
      method: 'POST',
      body: getFormData({
        prefix_id: prefix,
        title: threadTitle,
        target_node_id: target,
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