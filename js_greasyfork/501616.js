// ==UserScript==
// @name    ГС/ЗГС | E.Puaro
// @namespace https://forum.blackrussia.online
// @version 1.7
// @description  Скрипт для рассмотрения жалоб на лидеров на Black Russia.
// @author       Ercule_Puaro
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license    MIT
// @icon https://emoji.gg/assets/emoji/9372-blurple-boost-level-9.png
// @downloadURL https://update.greasyfork.org/scripts/501616/%D0%93%D0%A1%D0%97%D0%93%D0%A1%20%7C%20EPuaro.user.js
// @updateURL https://update.greasyfork.org/scripts/501616/%D0%93%D0%A1%D0%97%D0%93%D0%A1%20%7C%20EPuaro.meta.js
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
        title: '__________________________________________________Закрепы_________________________________________________',
    },
    {
      title: 'Главной Администрации',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба передана [COLOR=rgb(255, 0, 0)]Главной Администрации[/COLOR] @Andrey_Mal @Angel_Brown 𓆩♡𓆪 @Rick Kalashnikov.[/CENTER]<br><br>" +
        '[Color=Flame][CENTER]Ожидайте окончательного вердикта...[/CENTER][/color][/FONT]',
      prefix: GA_PREFIX,
      status: false,
    },
    {
      title: 'ГСу ГОСС',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба передана [COLOR=rgb(25, 25, 112)]Главному Следящему за Государственными Структурами[/COLOR] @Bismarck Fonberz.[/CENTER]<br><br>" +
        
        '[Color=Flame][CENTER]Ожидайте окончательного вердикта...[/CENTER][/color][/FONT]',
      prefix: PINN_PREFIX,
      status: false,
    },
        {
      title: 'ГСу ОПГ',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба передана [COLOR=rgb(139, 0, 0)]Главному Следящему за Организованными Преступными Группировками[/COLOR] @Ayanakodji_Kinders.[/CENTER]<br><br>" +
        
        '[Color=Flame][CENTER]Ожидайте окончательного вердикта...[/CENTER][/color][/FONT]',
      prefix: PINN_PREFIX,
      status: false,
    },
    {
       title: 'На рассмотрении',
       content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br><br>' +
        "[CENTER]Ваша жалоба взята на [COLOR=rgb(255, 102, 0)]рассмотрение.[/CENTER]<br>" +
        
        '[Color=Flame][CENTER][COLOR=rgb(255, 255, 255)]Ожидайте окончательного вердикта...[/CENTER][/color][/FONT]',
      prefix: PINN_PREFIX,
      status: false,
    },
        {
       title: 'Запрошу доквы',
       content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Запрошу доказательства у лидера.[/CENTER]<br><br>" +
        '[Color=Flame][CENTER][COLOR=rgb(255, 255, 255)]Ожидайте окончательного вердикта...[/CENTER][/color][/FONT]',
      prefix: PINN_PREFIX,
      status: false,
    },
    {
        title: '__________________________________________________Одобрения______________________________________________',
    },
            {
      title: 'Лидер получит наказание',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Лидер получит наказание![/CENTER]<br><br>" +
 
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено.[/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
        {
      title: 'Зам получит наказание',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Заместитель получит наказание![/CENTER]<br><br>" +
 
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено.[/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Беседа с лидером',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]С лидером будет проведена беседа![/CENTER]<br><br>" +
 
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено.[/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
        {
      title: 'Беседа с замом',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]С заместителем будет проведена беседа![/CENTER]<br><br>" +
 
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено.[/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
             {
      title: 'Лидер снят',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Лидер был снят с поста![/CENTER]<br><br>" +
 
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено.[/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
              {
      title: 'Заместитель снят',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Заместитель был снят с поста![/CENTER]<br><br>" +
 
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено.[/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
        {
        title: '__________________________________________________Отказы__________________________________________________',
    },
        {
      title: 'Выдано верно',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Доказательство лидером были предоставлены и наказание выдано верно[/CENTER]<br><br>" +
 
        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Закрыто.[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
        {
      title: 'Не лидер',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Данный игрок не является лидером[/CENTER]<br><br>" +
 
        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Закрыто.[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
        {
      title: 'Не заместитель',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Данный игрок не является заместителем[/CENTER]<br><br>" +
 
        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Закрыто.[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
        {
      title: 'Нарушений нет',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушений со стороны руководителей организации- нет.[/CENTER]<br><br>" +
 
        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано.[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
        {
      title: 'Недостаточно доказательств',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Недостаточно доказательств на нарушения со стороны руководства организации.[/CENTER]<br><br>" +
 
        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано.[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
          title: 'Ответ дан ранее',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ответ на вашу жалобу был дан в предыдущей теме.[/CENTER]<br><br>" +
 
        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано.[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
        {
      title: 'Не по форме',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба составлена не по форме. Убедительная просьба ознакомиться с [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.3429391/'][Color=Red][U]правилами подачи жалоб на лидеров[/U][/color][/URL].[/CENTER]<br><br>" +
 
        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано.[/FONT][/COLOR][/SIZE][/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
        {
      title: 'Offtop',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба ни коим образом не относится к теме раздела.[/CENTER]<br><br>" +
 
        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано.[/FONT][/COLOR][/SIZE][/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
        {
      title: 'Нет /time',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]На Ваших доказательствах отсутствует /time.[/CENTER]<br><br>" +
 
        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано.[/FONT][/COLOR][/SIZE][/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
        {
      title: 'Докв нет',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Доказательства в жалобе отсутсвуют. Прикрепите опровержение на нарушения лидера, используя фото и видео хостинги.[/CENTER]<br><br>" +
 
        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано.[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
          {
      title: 'Более 3 дней',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][FONT=georgia]Срок подачи жалобы истек.[/CENTER]<br><br>" +
 
        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано.[/FONT][/COLOR][/SIZE][/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
        {
      title: 'Доква отредактированы',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][FONT=georgia]Ваши доказательства отредактированы.[/CENTER]<br><br>" +
 
        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано.[/FONT][/COLOR][/SIZE][/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'От 3-го лица',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][FONT=georgia]Жалобы от 3-их лиц не принимаются[/CENTER]<br>" +
 
        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано.[/FONT][/COLOR][/SIZE][/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
        {
      title: 'Неадекват',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][FONT=georgia]Жалоба в таком формате рассматриваться не будет.[/CENTER]<br><br>" +
        "[CENTER][B][FONT=georgia]Пересоздайте жалобу без оскорблений и завуалированных предлогов, несущих оскорбительный характер.[/CENTER]<br></br>" +
 
        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано.[/FONT][/COLOR][/SIZE][/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
        {
      title: 'В жалобы на адм',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][FONT=georgia]Ошиблись разделом, обратитесь в Жалобы на администраторов[/CENTER]<br>" +
        "[CENTER][B][FONT=georgia]Не забудьте ознакомиться с [COLOR=rgb(255, 0, 0)]правилами подачи жалоб на администраторов[/COLOR][/CENTER]<br><br>" +
 
        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано.[/FONT][/COLOR][/SIZE][/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
        {
      title: 'Ошиблись разделом серверов',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][FONT=georgia]Жалоба подана в раздел другого сервера.[/CENTER]<br>" +
        "[CENTER][B][FONT=georgia]Ваша жалоба будет перенесена в нужный раздел.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 165, 0)][FONT=times new roman]Ожидайте рассмотрения администрацией вашего сервера...[/FONT][/COLOR][/SIZE][/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    
      ];
 $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
    // Добавление кнопок при загрузке страницы
    addButton('Ответы ГС/ЗГС', 'selectAnswer');
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