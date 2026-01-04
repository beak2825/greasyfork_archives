// ==UserScript==
// @name    FC | KEMEROVO | A.Goodman
// @name:ru КФ | KEMEROVO | A.Goodman
// @name:uk КФ | KEMEROVO | A.Goodman
// @version 0.0.1
// @description  Suggestions for improving the script write here > не
// @description:ru Предложения по улучшению скрипта писать сюда > не
// @description:uk Пропозиції щодо покращення скрипту писати сюди > не
// @namespace https://forum.blackrussia.online
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license    MIT
// @supportURL https://vk.com/vinni_shock
// @icon https://emoji.gg/assets/emoji/9372-blurple-boost-level-9.png
// @downloadURL https://update.greasyfork.org/scripts/501867/FC%20%7C%20KEMEROVO%20%7C%20AGoodman.user.js
// @updateURL https://update.greasyfork.org/scripts/501867/FC%20%7C%20KEMEROVO%20%7C%20AGoodman.meta.js
// ==/UserScript==
(function () {
  'use strict';
const UNACCСEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCСEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const PINN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
const CLOSE_PREFIX = 7;
const ERWART_PREFIX = 14;
const TEXY_PREFIX = 13;
const OTKAZBIO_PREFIX = 4;
const ODOBRENOBIO_PREFIX = 8;
const NARASSMOTRENIIBIO_PREFIX = 2;
const OTKAZRP_PREFIX = 4;
const ODOBRENORP_PREFIX = 8;
const NARASSMOTRENIIRP_PREFIX = 2;
const OTKAZORG_PREFIX = 4;
const ODOBRENOORG_PREFIX = 8;
const NARASSMOTRENIIORG_PREFIX = 2;
const buttons = [
    {
     title: '★----★----★---RP био/сит/орг---★----★----★----★----★----★----★----★----★----★----★----★----★----★----★----★----★',
    },
    {
      title: 'био +',
      content:
        '[Color=rgb(255, 128, 0)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша RolePlay биография получает статус: [Color=Lime]Одобрено[/COLOR].[/I][/CENTER][/FONT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
    },
    {
      title: 'био отказ(мало о себе)',
      content:
        '[Color=rgb(255, 128, 0)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br><br>" +
        "Добавьте больше информации о себе в новой биографии.[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
      title: 'био отказ плагиат',
      content:
        '[Color=rgb(255, 128, 0)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br><br>" +
        "Ваша биография/квента скопирована, создайте собственную.[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
      title: 'био -',
      content:
        '[Color=rgb(255, 128, 0)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша RolePlay биография получает статус: [Color=Red]Отказано[/color].<br><br>" +
        "Причиной отказа могло послужить какое-либо нарушение из [URL='https://forum.blackrussia.online/threads/Правила-составления-РП-биографий-kemerovo.6156947/'][Color=Red][U]Правил написания RP биографий[/U][/color][/URL].[/I][/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
     {
      title: 'био отказ(Ошибки)',
      content:
        '[Color=rgb(255, 128, 0)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br><br>" +
        "Причиной отказа могло послужить большое количество грамматических ошибок.[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
     {
      title: 'био отказ(Возраст и Дата)',
      content:
        '[Color=rgb(255, 128, 0)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br><br>" +
        "Причиной отказа могло послужить несовпадение возраста и даты рождения.[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
      title: 'био отказ(Нет даты)',
      content:
        '[Color=rgb(255, 128, 0)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br><br>" +
        "Причиной отказа могло послужить отсутвие даты рождения.[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
   {
      title: 'био отказ(18 лет)',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br><br>" +
        "Причина отказа: минимальный возраст для составления биографии: 18 лет.[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
      title: 'био-(форма)',
      content:
        '[Color=rgb(255, 128, 0)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша RolePlay биография получает статус: [Color=Red]Отказано[/color].<br><br>" +
        "Причиной отказа послужило несоответствие форме подачи RolePlay биографий.<br>" +
        "С формой подачи Вы можете ознакомиться здесь - [URL='https://forum.blackrussia.online/threads/Правила-составления-РП-биографий-kemerovo.6156947/'][Color=Red][U]Правил написания RP биографий[/U][/color][/URL].[/I][/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
      title: 'сит +',
      content:
        '[Color=rgb(255, 128, 0)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша RolePlay ситуация получает статус: [Color=Lime]Одобрено[/COLOR].[/CENTER]<br>" +
        "[CENTER]Вознаграждение за RP ситуацию [Color=Red]не выдаётся[/COLOR].[/I][/CENTER][/FONT]",
      prefix: ODOBRENORP_PREFIX,
      status: false,
    },
    {
      title: 'сит -',
      content:
        '[Color=rgb(255, 128, 0)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша RolePlay ситуация получает статус: [Color=Red]Отказано[/color].<br><br>" +
        "Причиной отказа могло послужить какое-либо нарушение из [URL='https://forum.blackrussia.online/threads/Правила-roleplay-ситуаций-kemerovo.6157950/'][Color=Red][U]Правил написания RP ситуаций[/U][/color][/URL].[/I][/CENTER][/FONT]",
      prefix: OTKAZRP_PREFIX,
      status: false,
    },
    {
      title: 'сит-(форма)',
      content:
        '[Color=rgb(255, 128, 0)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша RolePlay ситуация получает статус: [Color=Red]Отказано[/color].<br><br>" +
        "Причиной отказа послужило несоответствие форме подачи RolePlay ситуаций.<br>" +
        "С формой подачи Вы можете ознакомиться здесь - [URL='https://forum.blackrussia.online/threads/Правила-roleplay-ситуаций-kemerovo.6157950/'][Color=Red][U]Правил написания RP ситуаций[/U][/color][/URL].[/I][/CENTER][/FONT]",
      prefix: OTKAZRP_PREFIX,
      status: false,
    },
    {
      title: 'орг +',
      content:
        '[Color=rgb(255, 128, 0)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша RolePlay организация получает статус: [Color=Lime]Одобрено[/color].<br><br>" +
        "Если вам понадобится отредактировать информацию, свяжитесь со мной через Форумный Аккаунт или ВКонтакте.[/I][/CENTER][/FONT]",
      prefix: ODOBRENOORG_PREFIX,
      status: false,
    },
    {
      title: 'орг -',
      content:
        '[Color=rgb(255, 128, 0)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша RolePlay орагнизация получает статус: [Color=Red]Отказано[/color].<br><br>" +
        "Причиной отказа могло послужить какое-либо нарушение из [URL='https://forum.blackrussia.online/threads/Основные-правила-неофициальной-организации-kemerovo.6157057/'][Color=Red][U]Основных правил RP организаций[/U][/color][/URL].[/I][/CENTER][/FONT]",
      prefix: OTKAZORG_PREFIX,
      status: false,
    },
    {
      title: 'орг-(форма)',
      content:
        '[Color=rgb(255, 128, 0)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша RolePlay организация получает статус: [Color=Red]Отказано[/color].<br><br>" +
        "Причиной отказа послужило несоответствие форме подачи RolePLay организаций.<br>"+
        "С формой подачи Вы можете ознакомиться здесь - [URL='https://forum.blackrussia.online/threads/Основные-правила-неофициальной-организации-kemerovo.6157057/'][Color=Red][U]Основных правил RP организаций[/U][/color][/URL].[/I][/CENTER][/FONT]",
      prefix: OTKAZRP_PREFIX,
      status: false,
    }
  ];
 $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
    // Добавление кнопок при загрузке страницы
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