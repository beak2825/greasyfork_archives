// // ==UserScript==
// @name         Скрипт ответов КФ (БЕЗ ЖАЛОБ) CHELYABINSK
// @namespace    https://forum.blackrussia.online
// @version      1.3
// @description  Always remember who you are!
// @author       Maga_Rahimow
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @collaborator Maga_Rahimow
// @icon https://icons.iconarchive.com/icons/google/noto-emoji-people-bodyparts/256/11960-victory-hand-light-skin-tone-icon.png
// @downloadURL https://update.greasyfork.org/scripts/478270/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%BE%D1%82%D0%B2%D0%B5%D1%82%D0%BE%D0%B2%20%D0%9A%D0%A4%20%28%D0%91%D0%95%D0%97%20%D0%96%D0%90%D0%9B%D0%9E%D0%91%29%20CHELYABINSK.user.js
// @updateURL https://update.greasyfork.org/scripts/478270/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%BE%D1%82%D0%B2%D0%B5%D1%82%D0%BE%D0%B2%20%D0%9A%D0%A4%20%28%D0%91%D0%95%D0%97%20%D0%96%D0%90%D0%9B%D0%9E%D0%91%29%20CHELYABINSK.meta.js
// ==/UserScript==

(function () {
  'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7; // Prefix that will be set when thread closes.
const TEX_PREFIX = 13;
const GA_PREFIX = 12;
const V_PREFIX = 1;
const buttons = [

{
 title: '____________________________________________________ | ПЕРЕАДРЕСАЦИЯ | ____________________________________________',
},
{
  title: 'ГКФ-у',
  content:
  '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
  "[I][FONT=times new roman][B][CENTER][SIZE=4]Ваша заявка будет передана главному куратору форума.[/SIZE][/FONT][/I][/B][/CENTER]<br>" +
  "[I][FONT=times new roman][B][CENTER][SIZE=4][/SIZE]Ожидайте ответа в данной теме.[/FONT][/I][/B][/CENTER]<br>" +
  '[CENTER][I][B][COLOR=rgb(0, 0, 255)][FONT=times new roman]Главному куратору форума.[/FONT][/COLOR]<br>'+
  '[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',
  prefix: PIN_PREFIX,
  status: true,
},
{
  title: 'НА РАССМОТРЕНИИ',
  content:
  '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
  "[I][FONT=times new roman][B][CENTER][SIZE=4]На рассмотрении.[/SIZE][/FONT][/I][/B][/CENTER]<br>" +
  "[I][FONT=times new roman][B][CENTER][SIZE=4]Ожидайте ответов в этой теме. [/SIZE][/FONT][/I][/B][/CENTER]<br>" +
  '[CENTER][I][B][COLOR=rgb(250, 197, 28)][FONT=times new roman]Рассматривается.[/FONT][/COLOR]<br>'+
  '[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',
  prefix: PIN_PREFIX,
  status: true,
},
{
 title: '____________________________________________________ | НЕОФИЦИАЛЬНЫЕ RP ОРГАНИЗАЦИИ | ____________________________________________'
},
{
  title: 'ОДОБРЕНО',
  content:

  '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
  "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша организация одобрена.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
  '[CENTER][I][B][COLOR=rgb(0, 255, 0)][FONT=times new roman]Одобрено[/COLOR],[COLOR=rgb(255, 0, 0)] закрыто.[/COLOR][/B][/I][/CENTER]<br>'+
  '[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

  prefix: ACCEPT_PREFIX,
  status: false,
},
{
  title: 'НА ДОПОЛНЕНИЕ(НАПИШИТЕ ЧТО НУЖНО ДОПОЛНИТЬ)',
  content:

  '[CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
},
{
  title: 'ОТКАЗАНО(НАПИШИТЕ ЧТО НУЖНО ДОПОЛНИТЬ)',
  content:

  '[CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
},
{
  title: 'НЕ ПО ФОРМЕ',
  content:

  '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
  "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша организация составлена не по форме.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
  '[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано,[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman] закрыто.[/COLOR][/FONT][/B][/I][/CENTER]<br>'+
  '[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

  prefix: UNACCEPT_PREFIX,
  status: false,
},
{
  title: 'МАЛО ИНФОРМАЦИИ',
  content:

  '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
  "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Мало информации об организации.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
  '[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано,[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman] закрыто.[/COLOR][/FONT][/B][/I][/CENTER]<br>'+
  '[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

  prefix: UNACCEPT_PREFIX,
  status: false,
},
{
  title: 'НАРУШЕНЫ ПРАВИЛА ПОДАЧИ(ЛЮБЫЕ)',
  content:

  '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
  "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушены правила подачи. Ознакомьтесь с ними в закрепленной теме в этом разделе.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
  '[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано,[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman] закрыто.[/COLOR][/FONT][/B][/I][/CENTER]<br>'+
  '[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

  prefix: UNACCEPT_PREFIX,
  status: false,
},
{
  title: 'НЕТ СТАРТОГО СОСТАВА',
  content:

  '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
  "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]В вашей РП организации отсутвует минимальный стартовый состав. Ознакомьтесь с правилами подачи закрепленными в данном разделе.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
  '[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано,[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman] закрыто.[/COLOR][/FONT][/B][/I][/CENTER]<br>'+
  '[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

  prefix: UNACCEPT_PREFIX,
  status: false,
},
{
  title: 'ВЫХОДИТ ЗА РАМКИ РЕАЛЬНОГО',
  content:

  '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
  "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша РП организации выходит за рамки РП процесса. Ознакомьтесь с правилами подачи закрепленными в данном разделе.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
  '[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано,[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman] закрыто.[/COLOR][/FONT][/B][/I][/CENTER]<br>'+
  '[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

  prefix: UNACCEPT_PREFIX,
  status: false,
},
{
 title: '____________________________________________________ | RP СИТУАЦИИ | ____________________________________________'
},
{
  title: 'ОДОБРЕНО',
  content:

  '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
  "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша ситуация одобрена.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
  '[CENTER][I][B][COLOR=rgb(0, 255, 0)][FONT=times new roman]Одобрено[/COLOR],[COLOR=rgb(255, 0, 0)] закрыто.[/COLOR][/B][/I][/CENTER]<br>'+
  '[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

  prefix: ACCEPT_PREFIX,
  status: false,
},
{
  title: 'НА ДОПОЛНЕНИЕ(НАПИШИТЕ ЧТО НУЖНО ДОПОЛНИТЬ)',
  content:

  '[CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
},
{
  title: 'ОТКАЗАНО(НАПИШИТЕ ЧТО НУЖНО ДОПОЛНИТЬ)',
  content:

  '[CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
},
{
  title: 'НЕ ПО ФОРМЕ',
  content:

  '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
  "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша ситуация составлена не по форме.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
  '[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано,[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman] закрыто.[/COLOR][/FONT][/B][/I][/CENTER]<br>'+
  '[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

  prefix: UNACCEPT_PREFIX,
  status: false,
},
{
  title: 'МАЛО ИНФОРМАЦИИ',
  content:

  '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
  "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Мало информации об ситуации.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
  '[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано,[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman] закрыто.[/COLOR][/FONT][/B][/I][/CENTER]<br>'+
  '[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

  prefix: UNACCEPT_PREFIX,
  status: false,
},
{
  title: 'НАРУШЕНЫ ПРАВИЛА ПОДАЧИ(ЛЮБЫЕ)',
  content:

  '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
  "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушены правила подачи. Ознакомьтесь с ними в закрепленной теме в этом разделе.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
  '[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано,[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman] закрыто.[/COLOR][/FONT][/B][/I][/CENTER]<br>'+
  '[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

  prefix: UNACCEPT_PREFIX,
  status: false,
},
{
  title: 'ВЫХОДИТ ЗА РАМКИ РЕАЛЬНОГО',
  content:

  '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
  "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша РП ситуация выходит за рамки РП процесса. Ознакомьтесь с правилами подачи закрепленными в данном разделе.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
  '[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано,[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman] закрыто.[/COLOR][/FONT][/B][/I][/CENTER]<br>'+
  '[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

  prefix: UNACCEPT_PREFIX,
  status: false,
},
{
 title: '____________________________________________________ | RP БИОГРАФИИ | ____________________________________________'
},
{
  title: 'ОДОБРЕНО',
  content:

  '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
  "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша биография одобрена.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
  '[CENTER][I][B][COLOR=rgb(0, 255, 0)][FONT=times new roman]Одобрено[/COLOR],[COLOR=rgb(255, 0, 0)] закрыто.[/COLOR][/B][/I][/CENTER]<br>'+
  '[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

  prefix: ACCEPT_PREFIX,
  status: false,
},
{
  title: 'НА ДОПОЛНЕНИЕ(НАПИШИТЕ ЧТО НУЖНО ДОПОЛНИТЬ)',
  content:

  '[CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
},
{
  title: 'ОТКАЗАНО(НАПИШИТЕ ПОЧЕМУ ОТКАЗАНО)',
  content:

  '[CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
},

{
  title: 'НЕ ПО ФОРМЕ',
  content:

  '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
  "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша биография составлена не по форме.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
  '[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано,[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman] закрыто.[/COLOR][/FONT][/B][/I][/CENTER]<br>'+
  '[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

  prefix: UNACCEPT_PREFIX,
  status: false,
},
{
  title: 'МАЛО ИНФОРМАЦИИ',
  content:

  '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
  "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Мало информации.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
  '[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано,[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman] закрыто.[/COLOR][/FONT][/B][/I][/CENTER]<br>'+
  '[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

  prefix: UNACCEPT_PREFIX,
  status: false,
},
{
  title: 'НАРУШЕНЫ ПРАВИЛА ПОДАЧИ(ЛЮБЫЕ)',
  content:

  '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
  "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушены правила подачи. Ознакомьтесь с ними в закрепленной теме в этом разделе.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
  '[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано,[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman] закрыто.[/COLOR][/FONT][/B][/I][/CENTER]<br>'+
  '[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

  prefix: UNACCEPT_PREFIX,
  status: false,
},
{
  title: 'ВЫХОДИТ ЗА РАМКИ РЕАЛЬНОГО',
  content:

  '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
  "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша РП биография выходит за рамки РП процесса. Ознакомьтесь с правилами подачи закрепленными в данном разделе.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
  '[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано,[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman] закрыто.[/COLOR][/FONT][/B][/I][/CENTER]<br>'+
  '[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

  prefix: UNACCEPT_PREFIX,
  status: false,
},
{
  title: 'НЕТ ЛИЧНОГО ФОТО',
  content:

  '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
  "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]В вашей РП биографии отсутвует личное фото. Ознакомьтесь с правилами подачи закрепленными в данном разделе.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
  '[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано,[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman] закрыто.[/COLOR][/FONT][/B][/I][/CENTER]<br>'+
  '[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

  prefix: UNACCEPT_PREFIX,
  status: false,
},

];
$(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
  $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');


    // Добавление кнопок при загрузке страницы
  addButton('Закрыто', 'close');
  addButton('На рассмотрение', 'pin');
  addButton('Одобрено', 'accepted');
  addButton('Отказано', 'unaccept');
  addButton('Ответы', 'selectAnswer');



    // Поиск информации о теме
  const threadData = getThreadData();


  $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
  $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
  $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
  $('button#close').click(() => editThreadData(CLOSE_PREFIX, false));


  $(`button#selectAnswer`).click(() => {
    XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
    buttons.forEach((btn, id) => {
      if(id > 0) {
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


function getFormData(data) {
  const formData = new FormData();
  Object.entries(data).forEach(i => formData.append(i[0], i[1]));
  return formData;
}
})();
