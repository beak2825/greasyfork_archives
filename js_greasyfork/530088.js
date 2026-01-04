// ==UserScript==
// @name   Moders DS
// @name:ru script Руководство дискорда
// @description  Author Belarus RP | Director Moders DS
// @description:ru Author Belarus RP | Director Moders DS
// @autor Belarus RP | Director Moders DS
// @version 1.1.2
// @namespace https://forum.belarus-rp.wh21526.web5.maze-tech.ru/index.php
// @match        https://forum.belarus-rp.wh21526.web5.maze-tech.ru/index.php
// @include      https://forum.belarus-rp.wh21526.web5.maze-tech.ru/index.php
// @grant        none
// @license   MIT
// @icon https://emoji.gg/assets/emoji/9372-blurple-boost-level-9.png
// @downloadURL https://update.greasyfork.org/scripts/530088/Moders%20DS.user.js
// @updateURL https://update.greasyfork.org/scripts/530088/Moders%20DS.meta.js
// ==/UserScript==
 
(function () {
  'use strict';
const UNACCСEPT_PREFIX = 3; // Prefix that will be set when thread closes
const ACCСEPT_PREFIX = 2; // Prefix that will be set when thread accepted
const RESHENO_PREFIX = 11; // Prefix that will be set when solving the problem
const PINN_PREFIX = 8; // Prefix that will be set when thread pins
const LD_PREFIX = 6; // Prefix that will be set when thread send to ld
const WATCHED_PREFIX = 16;
const CLOSE_PREFIX = 9;
const ODOBRENOBIO_PREFIX = 2;
const NARASSMOTRENIIBIO_PREFIX = 8;
const OTKAZBIO_PREFIX = 3;
const buttons = [
    {
    	  title: '|(-(-(-(-(->╴Ответы ╴<-)-)-)-)-)-|'
    },
    {
      title: '| Не по форме |',
      content:
"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба составлена [COLOR=rgb(255, 0, 0)]не по форме[/color].[/CENTER]<br><br>" +
            "[CENTER][SPOILER=Форма подачи жалобы][COLOR=rgb(255, 0, 0)]1.[/color] Ваш Nick_Name:[/CENTER]<br><br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)]2.[/color] Nick_Name модератора:[/CENTER]<br><br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)]3.[/color] Суть жалобы:[/CENTER]<br><br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)]4.[/color] Доказательство:[/SPOILER][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  [/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
    },
    {
      title: '| Прошло 3 дня |',
      content:
"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]С момента возможного нарушения со стороны модератора прошло более 72 часов, жалоба рассмотрению не подлежит.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  [/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
    },
    {
       title: '| Неуважение в жалобе |',
       content:
"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]В вашей жалобе присутствует неуважение к модератору, жалоба рассмотрена не будет.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  [/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
    },
    {
     title: '| Фотохостинги |',
     content:
"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Доказательства должны быть загружены на Yapx/Imgur/YouTube.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  [/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
    },
    {
     title: '| Видеозапись |',
     content:
"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]В данном случае, для выдачи наказания модератору, требуется видеозапись[/CENTER]<br><br>" +                       
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  [/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
    },
    {
     title: '| Видео обрывается |',
     content:
"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваше видеодоказательство обрывается. Видеохостинг YouTube загружает видео без ограничений, рекомендуем использовать его.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  [/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
    },
    {     
      title: '| Нет доказательств |',
      content:
"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нет каких-либо доказательств на совершенное нарушение от данного модератора.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  [/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
    },
    {
     title: '| Недостаточно доказательств |',
     content:
"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Доказательств, предоставленных Вами, недостаточно для выдачи наказания данному модератору.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  [/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
    },
    {
     title: '| Не работают док-ва |',
     content:
"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Доказательства, предоставленные Вами, нерабочие.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  [/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
    },
    {
      title: '| Плохое качество |',
      content:
"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Качество доказательств, предоставленными Вами низкое, в связи с этим, мы не можем принять их.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  [/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
    },
    {
     title: '| От 3-го лица |',
     content:
"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Жалобы, написанные от 3-го лица рассмотрению не подлежат.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  [/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
    },
    {
     title: '| Нет нарушений |',
     content:
"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Нарушений со стороны модератора нет.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  [/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
    },
    {
     title: '| Ошиблись разделом |',
     content:
"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]К сожалению, Вы ошиблись разделом. [/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  [/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
    },
    {
     title: '| Таймкоды |',
     content:
"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша видеозапись длится более 3-х минут. У Вас есть 24 часа, чтобы прикрепить таймкоды нарушений, в ином случае жалоба будет закрыта.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  [/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
    },
        {
    	  title: '|(-(-(-(-(->╴Одобренные жалобы ╴<-)-)-)-)-)-|'
    },
        {
     title: '| разговор с модером+снято наказание |',
     content:
"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Извиняемся за неудобства. Наказание будет снято, с модератором будет проведена беседа.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(0, 255, 0)][FONT=times new roman]Одобрено ❖  [/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
    },
            {
     title: '| разговор с модером |',
     content:
"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]С модератором будет проведена беседа.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(0, 255, 0)][FONT=times new roman]Одобрено ❖  [/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
    },
    
  ];
 
 $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
    // Добавление кнопок при загрузке страницы
    addButton('💖 Script by. DM DS 💖', 'selectAnswer');
 
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
      `<button type="button" class="button rippleButton" id="${id}" style="border-radius: 13px; margin-right: 5px; border: 2px solid #BF40BF;">${name}</button>`,
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
                              sticky: 1,
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