// ==UserScript==
// @name         Обжалование CHILLI
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Скрипт только для Влада
// @author       Santa_Aelpee
// @match        https://forum.blackrussia.online/threads/*
// @icon
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/476101/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%20CHILLI.user.js
// @updateURL https://update.greasyfork.org/scripts/476101/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%20CHILLI.meta.js
// ==/UserScript==

(function() {
    'use strict';
const UNACCСEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCСEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem
const PINN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const SPECY_PREFIX = 11;
const TEXY_PREFIX = 13;
const OJIDANIE_PREFIX = 14;
const OTKAZBIO_PREFIX = 4;
const ODOBRENOBIO_PREFIX = 8;
const NARASSMOTRENIIBIO_PREFIX = 2;
const REALIZOVANO_PREFIX = 5;
const VAJNO_PREFIX = 1;
const PREFIKS = 0;
const KACHESTVO = 15;
const RASSMOTRENO_PREFIX = 9;
const OTKAZRP_PREFIX = 4;
const ODOBRENORP_PREFIX = 8;
const NARASSMOTRENIIRP_PREFIX = 2;
const OTKAZORG_PREFIX = 4;
const ODOBRENOORG_PREFIX = 8;
const NARASSMOTRENIIORG_PREFIX = 2;
const buttons = [
     {
      title: 'Приветствие',
      content:
         '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' + '[CENTER]  [/CENTER][/FONT]',
     },
     {
      title: 'На рассмотрении...',
      content:
               '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
               '[Color=#ffff00][CENTER][ICODE]На рассмотрении...[/ICODE][/CENTER][/color]' + '[CENTER]  [/CENTER]<br>' +
               '[B][CENTER]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR]',
      prefix: PINN_PREFIX,
	  status: true,
    },
    {
      title: 'Обжалование отказано',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Администрация не готова сократить или снять вам наказание. [/CENTER] <br>" +
	    "[CENTER][COLOR=RED][B]В обжаловании отказано.[/COLOR] <br>" +
        "Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры на сервере CHILLI.[/B][/COLOR][/CENTER] ',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Обжалование не подлежит',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Данное нарушение обжалованию не подлежит[/COLOR][/CENTER] <br>" +
         "[CENTER][COLOR=RED][B]В обжаловании отказано.[/COLOR] <br>" +
        "Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры на сервере CHILLI.[/B][/COLOR][/CENTER] ',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
              title: 'Не по форме',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Ваше обжалование составлено не по форме.[/COLOR][/CENTER] <br>" +
		"[CENTER][COLOR=RED][B]В обжаловании отказано.[/COLOR] <br>" +
        "Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры на сервере CHILLI.[/B][/COLOR][/CENTER] ',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Обжалование одобрено',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Ваше наказание будет снято / снижено в ближайшее время.[/COLOR][/CENTER] <br>" +
       "[CENTER][COLOR=RED][B]Обжалование одобрено.[/COLOR] <br>" +
        "Пожалуйста, впредь не повторяйте ошибок, которые могут привести к таким последствиям, а также внимательно изучите общие правила серверов - [/I][URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']*Нажмите сюда*[/URL].[/B][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры на сервере CHILLI.[/B][/COLOR][/CENTER] ',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Снижено до 30 дней',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Ваше наказание будет снижено до бана на 30 дней в ближайшее время.[/COLOR][/CENTER] <br>" +
	    "[CENTER][COLOR=RED][B]Обжалование одобрено.[/COLOR] <br>" +
        "Пожалуйста, впредь не повторяйте ошибок, которые могут привести к таким последствиям, а также внимательно изучите общие правила серверов - [/I][URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']*Нажмите сюда*[/URL].[/B][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры на сервере CHILLI.[/B][/COLOR][/CENTER] ',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Снижено до 15 дней',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Ваше наказание будет снижено до бана на 15 дней в ближайшее время.[/COLOR][/CENTER] <br>" +
		"[CENTER][COLOR=RED][B]Обжалование одобрено.[/COLOR] <br>" +
        "Пожалуйста, впредь не повторяйте ошибок, которые могут привести к таким последствиям, а также внимательно изучите общие правила серверов - [/I][URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']*Нажмите сюда*[/URL].[/B][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры на сервере CHILLI.[/B][/COLOR][/CENTER] ',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Снижено до 7 дней',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Ваше наказание будет снижено до бана на 7 дней в ближайшее время.[/COLOR][/CENTER] <br>" +
		"[CENTER][COLOR=RED][B]Обжалование одобрено.[/COLOR] <br>" +
        "Пожалуйста, впредь не повторяйте ошибок, которые могут привести к таким последствиям, а также внимательно изучите общие правила серверов - [/I][URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']*Нажмите сюда*[/URL].[/B][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры на сервере CHILLI.[/B][/COLOR][/CENTER] ',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Снижено до 120 мута',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Ваше наказание будет снижено до мута в 120 минут в ближайшее время.[/COLOR][/CENTER] <br>" +
        "[CENTER][COLOR=RED][B]Обжалование одобрено.[/COLOR] <br>" +
        "Пожалуйста, впредь не повторяйте ошибок, которые могут привести к таким последствиям, а также внимательно изучите общие правила серверов - [/I][URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']*Нажмите сюда*[/URL].[/B][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры на сервере CHILLI.[/B][/COLOR][/CENTER] ',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Просрочка ЖБ',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]В вашем случае нужно было сразу реагировать на выданное наказание и обращаться в раздел жалоб на администрацию, в настоящий момент срок написания жалобы прошел.<br>" +
        "Если вы все же согласны с решением администратора - составьте новую тему, предварительно прочитав правила подачи обжалований, закреплённые в данном разделе.<br>" +
        "Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/COLOR][/CENTER] <br>" +
        "[CENTER][COLOR=RED][B]В обжаловании отказано.[/COLOR] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры на сервере CHILLI.[/B][/COLOR][/CENTER] ',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'В жб на админов',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Если вы не согласны с выданным наказанием, то напишите в раздел Жалобы на Администрацию.[/COLOR][/CENTER] <br>" +
	    "[CENTER][COLOR=RED][B]В обжаловании отказано.[/COLOR] <br>" +
        "Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры на сервере CHILLI.[/B][/COLOR][/CENTER] ',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'NonRP обман (2)',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Обжалование в вашу пользу должен писать игрок, которого вы обманули.<br>" +
	   "В доказательствах должны иметься: окно блокировки вашего аккаунта, переписка с обманутым игроком, где вы решили на какую компенсацию он согласен и ваше сообщение, в котором вы признаете совершенную ошибку и впредь обязуетесь не повторять ее.<br>" +
        "После всего этого главная администрация рассмотрит обжалование, но это не гарантирует того, что вас обжалуют.[/B][/COLOR][/CENTER]<br>" +
        "[CENTER][COLOR=RED][B]Отказано, закрыто.[/B][/COLOR][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры на сервере CHILLI.[/B][/COLOR][/CENTER] ',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Использование ПО',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Ваш игровой акаунт был заблокирован навсегда за использование стороннего ПО.[/COLOR][/CENTER] <br>" +
	    "[CENTER][COLOR=RED][B]В обжаловании отказано.[/COLOR] <br>" +
        "Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры на сервере CHILLI.[/B][/COLOR][/CENTER] ',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Окно бана',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Прикрепите в доказательства скриншот окна блокировки, которое появляется сразу после входа в игру.<br>" +
       "[CENTER][COLOR=RED][B]В обжаловании отказано.[/COLOR] <br>" +
        "Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры на сервере CHILLI.[/B][/COLOR][/CENTER] ',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
  ];

  $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    // Добавление кнопок при загрузке страницы
    addButton('На рассмотрение', 'pin');
    addButton('КП', 'teamProject');
    addButton('Га', 'Ga');
    addButton('Спецу', 'Spec');
    addButton('Ответы', 'selectAnswer');

    // Поиск информации о теме
    const threadData = getThreadData();

    $('button#pin').click(() => editThreadData(PINN_PREFIX, true));
    $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
    $('button#Spec').click(() => editThreadData(SPECY_PREFIX, true));
    $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));

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