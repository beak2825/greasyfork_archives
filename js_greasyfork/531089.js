// ==UserScript==
// @name         Own script
// @namespace    https://forum.blackrussia.online
// @version      2.4
// @author       Kostya Vagner
// @description  Always the best
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @grant        none
// @license 	 MIT
// @icon https://i.yapx.ru/RMTMT.png
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/531089/Own%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/531089/Own%20script.meta.js
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
  const COLOR = 'ff1212'

  const buttons = [
        {
          title: 'Приветствие',
          content:
            `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br><br><br>Закрыто.${END_DECOR}`
        },
        {
          title: 'Рассмотрение',
          content:
              `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
              "Ваша тема взята на рассмотрение. Пожалуйста, не создавайте её копии.<br><br>" +
              `Ожидайте ответа.${END_DECOR}`,
          prefix: WAIT_PREFIX,
          status: true,
        },
      {
          title: 'Никнейм',
          content:
              `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
              "Аккаунт разблокирован, у вас есть 24 часа на смену игрового никнейма.<br><br>" +
              `Ожидайте ответа.${END_DECOR}`,
          prefix: WAIT_PREFIX,
          status: true,
        },
      {
          title: 'Нрп обман (закреп)',
          content:
              `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
              "Аккаунт разблокирован, у вас есть 24 часа на возмещение полного объёма ущерба обманутой стороне.<br><br>" +
              `Ожидайте ответа.${END_DECOR}`,
          prefix: WAIT_PREFIX,
          status: true,
        },
      {
          title: 'Нрп обман (отказ)',
          content:
              `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
              "Для разблокировки аккаунта необходимо полностью возместить ущерб, нанесённый игроку. Для этого вы должны связаться с обманутой стороной на форуме в его профиле. Под вашим сообщением этот человек должен оставить комментарий о том, что согласен на возмещение ущерба.<br><br>" +
              `Закрыто.${END_DECOR}`,
          prefix: CLOSE_PREFIX,
          status: false,
        },
        {
          title: 'Отказано',
          content:
              `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
              "В обжаловании отказано.<br><br>" +
              `Закрыто.${END_DECOR}`,
          prefix: CLOSE_PREFIX,
          status: false,
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
          title: 'Передать ГА',
          content:
              `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
              "Ваша тема передана на рассмотрение Главному Администратору.<br><br>" +
              `Ожидайте ответа.${END_DECOR}`,
          prefix: GA_PREFIX,
          status: true,
        },
      {
          title: 'Передать СА',
          content:
              `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
              "Ваша тема передана на рассмотрение специальной администрации.<br><br>" +
              `Ожидайте ответа.${END_DECOR}`,
          prefix: SA_PREFIX,
          status: true,
        },
        {
          title: 'Выдано верно',
          content:
              `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
              "После проверки доказательств администратора было принято решение, что наказание выдано верно.<br><br>" +
              `Закрыто.${END_DECOR}`,
          prefix: CLOSE_PREFIX,
          status: false,
        },
        {
          title: 'ЖБ Не по форме',
          content:
              `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
              "Ваша жалоба составлена не по форме, ознакомьтесь с правилами подачи жалоб → *[URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.3429349/']Кликабельно[/URL]*<br><br>" +
              `Закрыто.${END_DECOR}`,
          prefix: CLOSE_PREFIX,
          status: false,
        },
      {
          title: 'ОБЖ Не по форме',
          content:
              `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
              "Ваше обжалование составлено не по форме, ознакомьтесь с правилами подачи обжалований → *[URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.3429398/']Кликабельно[/URL]*<br><br>" +
              `Закрыто.${END_DECOR}`,
          prefix: CLOSE_PREFIX,
          status: false,
        },
        {
          title: '48 часов',
          content:
              `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
              "С момента выдачи наказания прошло более 48-ми часов.<br><br>" +
              `Закрыто.${END_DECOR}`,
          prefix: CLOSE_PREFIX,
          status: false,
        },
      {
          title: '48 часов ОБЖ',
          content:
              `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
              "Если вы не согласны с наказанием, его можно оспорить в разделе жалоб на администрацию в течение 48-ми часов.<br><br>" +
              `Закрыто.${END_DECOR}`,
          prefix: CLOSE_PREFIX,
          status: false,
        },
      {
          title: 'Истёк срок',
          content:
              `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
              "Срок истёк. Аккаунт заблокирован навсегда без возможности обжалования.<br><br>" +
              `Закрыто.${END_DECOR}`,
          prefix: CLOSE_PREFIX,
          status: false,
        },
        {
          title: 'Нет нарушений',
          content:
              `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
              "Со стороны администратора нет нарушений.<br><br>" +
              `Закрыто.${END_DECOR}`,
          prefix: CLOSE_PREFIX,
          status: false,
        },
        {
          title: 'Недостаточно док-в',
          content:
              `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
              "В вашей теме не предоставлено достаточного объёма доказательств нарушений.<br><br>" +
              `Закрыто.${END_DECOR}`,
          prefix: CLOSE_PREFIX,
          status: false,
        },
        {
          title: 'Нет доказательств',
          content:
              `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
              "В вашей теме отсутствуют доказательства.<br><br>" +
              `Закрыто.${END_DECOR}`,
          prefix: CLOSE_PREFIX,
          status: false,
        },
        {
            title: 'Ссылка не работает',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                "Ссылка на ваши доказательства не работает, либо к доказательствам по ссылке закрыт доступ.<br><br>" +
                `Закрыто.${END_DECOR}`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
          title: 'Загрузка док-в',
          content:
              `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
              "Загрузите доказательства на любой фото/видео хостинг, например Imgur, Yapx, Youtube, и оставьте полученную ссылку в новой теме.<br><br>" +
              `Закрыто.${END_DECOR}`,
          prefix: CLOSE_PREFIX,
          status: false,
        },
        {
          title: 'Док-ва в соц сетях',
          content:
              `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
              "Загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, Imgur).<br><br>" +
              `Закрыто.${END_DECOR}`,
          prefix: CLOSE_PREFIX,
          status: false,
        },
        {
          title: 'Прикрепить ВК',
          content:
              `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
              "Пересоздайте тему, указав ссылку на ваш профиль ВКонтакте.<br><br>" +
              `Закрыто.${END_DECOR}`,
          prefix: CLOSE_PREFIX,
          status: false,
        },
        {
          title: 'Бан IP',
          content:
              `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
              "IP адрес был заблокирован не вам, вы случайно попали на заблокированный IP, перезагрузите роутер, либо же смените способ подключения к интернету.<br><br>" +
              `Закрыто.${END_DECOR}`,
          prefix: CLOSE_PREFIX,
          status: false,
        },
        {
          title: 'Жалобы на техов',
          content:
              `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
              "Пересоздайте тему в разделе жалоб на технических специалистов → *[URL='https://forum.blackrussia.online/index.php?forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%961-red.1182/']Кликабельно[/URL]*<br><br>" +
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
            title: 'Жалобы на хелперов',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                "Обратитесь в раздел жалоб на агентов поддержки → *[URL='https://forum.blackrussia.online/forums/%D0%A0%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-%D0%B4%D0%BB%D1%8F-%D1%85%D0%B5%D0%BB%D0%BF%D0%B5%D1%80%D0%BE%D0%B2-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%B0.166/']Кликабельно[/URL]*<br><br>" +
                `Закрыто.${END_DECOR}`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
      {
          title: 'Жалобы на админов',
          content:
              `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
              "Обратитесь в раздел жалоб на администрацию → *[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.86/']Кликабельно[/URL]*<br><br>" +
          `Закрыто.${END_DECOR}`,
          prefix: CLOSE_PREFIX,
          status: false,
        },
        {
          title: 'В обжалования',
          content:
              `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
              "Обратитесь в раздел обжалований наказаний → *[URL='https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.89/']Кликабельно[/URL]*<br><br>" +
          `Закрыто.${END_DECOR}`,
          prefix: CLOSE_PREFIX,
          status: false,
        },
        {
            title: 'Жалобы дискорда',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                "Жалобы на модерацию дискорда подаются в самом дискорде.<br><br>" +
                `Закрыто.${END_DECOR}`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
          title: 'Не по теме',
          content:
              `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
              "Ваше обращение не относится к теме данного раздела.<br><br>" +
              `Закрыто.${END_DECOR}`,
          prefix: CLOSE_PREFIX,
          status: false,
        },
        {
          title: 'Ошиблись сервером',
          content:
              `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
              "Пересоздайте тему в разделе нужного вам сервера → *[URL='https://forum.blackrussia.online/index.php#igrovye-servera.12']Кликабельно[/URL]*<br><br>" +
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
            title: 'Будет снято',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                "Ваше наказание будет снято в ближайшее время.<br><br>" +
                `Закрыто.${END_DECOR}`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
          title: 'Закрыто',
          content:
              `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
              "Будут приняты необходимые меры.<br><br>" +
              `Закрыто.${END_DECOR}`,
          prefix: CLOSE_PREFIX,
          status: false,
        },
        {
          title: 'ЖБ Одобрена',
          content:
              `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
              "Будут приняты необходимые меры.<br><br>" +
              `Одобрено.${END_DECOR}`,
          prefix: OKAY_PREFIX,
          status: false,
        },
        {
          title: 'ОБЖ Одобрено',
          content:
              `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
              "Ваше обжалование одобрено, наказание будет полностью снято.<br><br>" +
              `Одобрено.${END_DECOR}`,
          prefix: OKAY_PREFIX,
          status: false,
        },
        {
          title: 'Перебан 30',
          content:
              `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
              "Блокировка на вашем аккаунте будет снижена до 30-ти суток.<br><br>" +
              `Одобрено.${END_DECOR}`,
          prefix: OKAY_PREFIX,
          status: false,
        },
        {
          title: 'Перебан 15',
          content:
              `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
              "Блокировка на вашем аккаунте будет снижена до 15-ти суток.<br><br>" +
              `Одобрено.${END_DECOR}`,
          prefix: OKAY_PREFIX,
          status: false,
        },
        {
          title: 'Жб будет пересмотрена',
          content:
              `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
              "Жалоба будет пересмотрена в ближайшее время.<br><br>" +
              `Закрыто.${END_DECOR}`,
          prefix: CLOSE_PREFIX,
          status: false,
        },

  ];

  $(document).ready(() => {
      // Загрузка скрипта для обработки шаблонов
      $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

      // Добавление кнопок при загрузке страницы
    addButton('', 'deny', 'fa-times', COLOR);
    addButton('', 'lvlup', 'fa-level-up');
    addButton('', 'ras', 'fa-thumbtack');
    addButton('', 'approved', 'fa-check');
    addButton('', 'closed', 'fa-times');
    addButton('', 'selectAnswer', 'fa-home', COLOR);


      // Поиск информации о теме
      const threadData = getThreadData();

    $('button#ras').click(() => pasteContent(1, threadData, true));
    $('button#deny').click(() => pasteContent(5, threadData, true));
    $('button#lvlup').click(() => pasteContent(9, threadData, true));
    $('button#time').click(() => pasteContent(14, threadData, true));
    $('button#closed').click(() => editThreadData(CLOSE_PREFIX, false));
    $('button#approved').click(() => editThreadData(OKAY_PREFIX, false));

      $(`button#selectAnswer`).click(() => {
          XF.alert(buttonsMarkup(buttons), null, `<i class="fas fa-home-alt">`);
          buttons.forEach((btn, id) => {
              if(id > 0) {
                  $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
              } else {
                  $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
              }
          });
      });

  });

  function addButton(name, id, icon = '', color = '252525') {
    let margin = '10'

    if (name == 'Menu') { margin = '12' };
    if (icon) {
        icon = `<i class="fas ${icon}""></i>`
    };

  $('.button--icon--reply').before(
    `<button type="button" class="button rippleButton" id="${id}" style="margin-right: ${margin}px; margin-bottom: 8px; border-radius: 25px; width: 50px; background: #${color}">` +
    `<span class="button-text">${icon}${name}</span></button>`,
  );
  }

  function buttonsMarkup(buttons) {
  return `<div class="select_answer">${
    buttons.map(
      (btn, i) =>
        `<button id="answers-${i}" class="button--primary button ` +
        `rippleButton" style="margin: 5px; border-radius: 8px; background: #${btn.color || '202020'};"><span class="button-text">${btn.title}</span></button>`,
    ).join('')}</div>`;
  }

  (function loadTopBar() {
      $('.uix_adminTrigger').after('<a href="https://forum.blackrussia.online/forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.89/" class="p-staffBar-link">Обжалования</a>' +
                                   '<a href="https://forum.blackrussia.online/forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.89/?prefix_id=14&last_days=90&order=last_post_date&direction=asc" class="p-staffBar-link">С фильтром</a>' +
                                  '<a href="https://forum.blackrussia.online/forums/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.51/" class="p-staffBar-link">Правила серверов</a>' +
                                  '<a href="https://forum.blackrussia.online/admin.php?moderators/add" class="p-staffBar-link" target="_blank">Добавить модератора</a>'
      );
      $('[href="/approval-queue/"]').remove();
      $('[data-navigation-id="admins"]').after(`<li class="p-nav-el">
				<a href="/admin.php?moderators/add">Добавить модератора</a>
	</li>`);
  })();

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