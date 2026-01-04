// ==UserScript== Coffl
// @name         BR | Script forum 2.0
// @namespace    https://forum.blackrussia.online
// @version      2.0.0.0
// @description  Для помощи вурдалакам
// @author       erm.design
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @grant        none
// @license    MIT
// @collaborator ermakov
// @icon https://icons.iconarchive.com/icons/aha-soft/iron-man/48/Ironman-Mask-3-Old-icon.png
// @copyright 2021, Moiseeev (https://openuserjs.org/users/moiseeev)
// @downloadURL https://update.greasyfork.org/scripts/441286/BR%20%7C%20Script%20forum%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/441286/BR%20%7C%20Script%20forum%2020.meta.js
// ==/UserScript==

(function() {
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
        "[CENTER]Пожалуйста, заполните форму, создав новую тему: <br>[CODE]1. Ваш Nick_Name:<br> + 2.Nick_Name игрока:<br> + 3. Суть жалобы:<br> + 4. Доказательство:[/CODE]<br><br>" +
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
       title: 'Тех.Специалисту',
      content: '[FONT=Courier New][CENTER]{{ greeting }},уважаемый {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша тема закреплена и находится на рассмотрении у Технического Специалиста. Пожалуйста,ожидайте ответа в данной теме.<br>" +
        '[CENTER]Создавать новые темы — не нужно.[/CENTER]',
    },
    {
         title: 'Недостаточно доказательств',
      content: '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>' +
        "[CENTER] В вашей жалобе недостаточно доказательств на нарушение данного игрока.<br><br>" +
        '[CENTER]Отказано, закрыто.[/CENTER][/FONT]',
    },
    {
         title: 'SK',
      content: '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил:2.16. Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них | Jail 30 минут / Warn (за два и более убийства).<br><br>" +
        '[CENTER]Одобрено,закрыто.[/CENTER][/FONT]',
    },
    {
        title: 'ДМ',
      content: '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил:2.19. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины | Jail 60 минут.<br><br>" +
        '[CENTER]Одобрено,закрыто.[/CENTER][/FONT]',
    },
    {
        title: 'ДБ',
      content: '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил:2.13. Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта | Jail 30 минут.<br><br>" +
        '[CENTER]Одобрено,закрыто.[/CENTER][/FONT]',
    },
    {
        title: 'NonRP Обман',
      content: '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил:2.05. Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики | PermBan.<br><br>" +
        '[CENTER] Одобрено, закрыто.[/CENTER][/FONT]',
    },
    {
        title: 'MASS DM',
      content: '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил:2.20. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины более трем игрокам | Warn / Ban 7 - 15 дней.<br><br>" +
        '[CENTER]Одобрено,закрыто.[/CENTER][/FONT]',
    },
    {
         title: 'Оск/Упом родни',
      content: '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил: 3.04. Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) | Mute 120 минут / Ban 7 - 15 дней<br><br>" +
        '[CENTER]Одобрено,закрыто.[/CENTER][/FONT]',
    },
    {
 title: 'Оскорбление',
      content: '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил:3.03. Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены | Mute 30 минут.<br><br>" +
        '[CENTER]Одобрено,закрыто.[/CENTER][/FONT]',
    },
    {
        title: 'MG',
      content: '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил:2.18. Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе | Mute 30 минут.<br><br>" +
        '[CENTER]Одобрено,закрыто.[/CENTER][/FONT]',
    },
    {
        title: 'Реклама промо',
      content: '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил: 3.21. Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. | Ban 30 дней.<br><br>" +
        '[CENTER]Одобрено,закрыто.[/CENTER][/FONT]',
    },
    {
         title: 'Нарушений нет',
	  content:
		'[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>' +
		"[CENTER]Нарушений со стороны игрока нет.<br><br>" +
		'[CENTER]Отказано, закрыто.[/CENTER][/FONT]',
	},
	{
         title: 'CapsLock',
	  content:
		'[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>' +
		"[CENTER]Игрок будет наказан по пункту правил:3.02. Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате | Mute 30 минут.<br><br>" +
		'[CENTER]Одобрено, закрыто.[/CENTER][/FONT]',
	},
	{
        title: 'отсутствует /time',
	  content:
		'[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>' +
		"[CENTER]На ваших доказательствах отсутствует /time.<br><br>" +
		'[CENTER]Отказано, закрыто.[/CENTER][/FONT]',
	},
    {
        title: 'NonRP',
	  content:
		'[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>' +
		"[CENTER]Игрок будет наказан по пункту правил:2.01. Запрещено поведение, нарушающее нормы процессов Role Play режима игры | Jail 30 минут.<br><br>" +
		'[CENTER]Одобрено,закрыто.[/CENTER][/FONT]',
    },
    {
        title: 'Введение в заблуждение',
	  content:
       '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>' +
       "[CENTER]Данный игрок получит наказание, а именно 3.11. Запрещено введение игроков проекта в заблуждение путем злоупотребления командами | Ban 15 - 30 дней / PermBan<br><br>" +
       '[CENTER]Одобрено,закрыто.[/CENTER][/FONT]',
    },
    {
       title: 'Оскорбление администратора',
	  content:
        '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Данный игрок получит наказание, а именно 2.32. Запрещен обман администрации, ее оскорбление, неуважительное отношение, неконструктивная критика, унижение чести и достоинства и тому подобное | Ban 15 - 30 дней / PermBan/ mute 120  минут.<br><br>" +
        '[CENTER]Одобрено,закрыто.[/CENTER][/FONT]',
    },
    {
         title: 'Уход от РП процесса',
	  content:
        '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Данный игрок получит наказание, а именно 2.02. Запрещено целенаправленно уходить от Role Play процесса всеразличными способами | Jail 30 минут / Warn<br><br>" +
        '[CENTER]Одобрено,закрыто.[/CENTER][/FONT]',
    },
    {
        title: 'Угрозы',
	  content:
         '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>' +
         "[CENTER]Данный игрок получит наказание, а именно 2.37. Запрещены OOC угрозы, в том числе и завуалированные | Ban 15 - 30 дней / PermBan<br><br>" +
         '[CENTER]Одобрено,закрыто.[/CENTER][/FONT]'
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
      XF.alert(buttonsMarkup(buttons), null, 'Добавь ответ:');
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
