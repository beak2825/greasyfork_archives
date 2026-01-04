// ==UserScript==
// @name         🌞FR | ГА | ЗГА | КУРАТОРЫ🌞
// @namespace    https://forum.fenixrp-mobile.ru
// @version      1.2.0
// @description  always remember who you are
// @author       crypton
// @match        https://forum.fenixrp-mobile.ru/index.php?threads/*
// @include      https://forum.fenixrp-mobile.ru/index.php?threads/
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/464827/%F0%9F%8C%9EFR%20%7C%20%D0%93%D0%90%20%7C%20%D0%97%D0%93%D0%90%20%7C%20%D0%9A%D0%A3%D0%A0%D0%90%D0%A2%D0%9E%D0%A0%D0%AB%F0%9F%8C%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/464827/%F0%9F%8C%9EFR%20%7C%20%D0%93%D0%90%20%7C%20%D0%97%D0%93%D0%90%20%7C%20%D0%9A%D0%A3%D0%A0%D0%90%D0%A2%D0%9E%D0%A0%D0%AB%F0%9F%8C%9E.meta.js
// ==/UserScript==

(function () {
 'use strict';

// АЙДИШНИКИ ПРЕФИКСОВ
const UNACCEPT_PREFIX = 4;
const ACCEPT_PREFIX = 8;
const RESHENO_PREFIX = 6;
const PIN_PREFIX = 2;
const GA_PREFIX = 12;
const CLOSE_PREFIX = 7;
const CA_PREFIX = 11;
const KP_PREFIX = 10;
const TEX_PREFIX = 23;

const buttons = [
   {
   title: '- - - - - - - - - - - - - - - - - - - - - | На рассмотрении | - - - - - - - - - - - - - - - - - - - - -',
 },
 {
     title: 'ЗАПРОСИЛ ДОК-ВА',
     content: '[CENTER][FONT=georgia][ICODE]{{ greeting }}, уважаемый [B]{{ user.mention }}[/ICODE][/B].[/CENTER]<br>' +
   "[CENTER]Запросил доказательства у данного администратора.[/CENTER]<br><br>" +
   "[CENTER][COLOR=rgb(251, 160, 38)]На рассмотрении[/COLOR].[/FONT][/CENTER]",
     prefix: PIN_PREFIX,
    status: true,
  },
  {
     title: 'НА РАССМОТРЕНИИ',
     content: '[CENTER][FONT=georgia][ICODE]{{ greeting }}, уважаемый [B]{{ user.mention }}[/ICODE][/B].[/CENTER]<br>' +
   "[CENTER]Ваша жалоба взята на рассмотрение.[/CENTER]<br><br>" +
   "[CENTER][COLOR=rgb(251, 160, 38)]Ожидайте ответа в данной теме и не создавайте дубликаты[/COLOR].[/FONT][/CENTER]",
     prefix: PIN_PREFIX,
    status: true,
  },
  {
   title: '- - - - - - - - - - - - - - - - - - - - - | ЖБ одобрено/решено | - - - - - - - - - - - - - - - - - - - - -',
 },
    {
     title: 'ПРОВЕДЕНА БЕСЕДА',
     content:
       '[CENTER][FONT=georgia][ICODE]{{ greeting }}, уважаемый [B]{{ user.mention }}[/ICODE][/B].[/CENTER]<br>' +
   "[CENTER]С администратором будет проведена [I]беседа[/I].[/CENTER]<br><br>" +
   '[CENTER][COLOR=#41a85f]Решено.[/COLOR][/FONT][/CENTER]',
   prefix: RESHENO_PREFIX,
   status: false,
   },
  {
     title: 'ПОЛУЧИТ НАКАЗАНИЕ',
     content: '[CENTER][FONT=georgia][ICODE]{{ greeting }}, уважаемый [B]{{ user.mention }}[/ICODE][/B].[/CENTER]<br>' +
   "[CENTER]Данный администратор будет [COLOR=rgb(255, 0, 0)]наказан[/COLOR].[/CENTER]<br><br>" +
   "[CENTER][COLOR=#41a85f]Одобрено.[/COLOR][/FONT][/CENTER]",
     prefix: ACCEPT_PREFIX,
    status: false,
  },
  {
     title: 'НАКАЗАНИЕ СНЯТО + БЕСЕДА',
     content:
       '[CENTER][FONT=georgia][ICODE]{{ greeting }}, уважаемый [B]{{ user.mention }}[/ICODE][/B].[/CENTER]<br>' +
   "[CENTER]С администратором будет проведена [I]беседа[/I].[/CENTER]<br><br>" +
   "[CENTER]Ваше наказание будет аннулировано.[/CENTER]<br>" +
   '[CENTER][COLOR=#41a85f]Решено.[/COLOR][/FONT][/CENTER]',
   prefix: RESHENO_PREFIX,
   status: false,
   },
   {
     title: 'НАКАЗАНИЕ СНЯТО',
     content:
       '[CENTER][FONT=georgia][ICODE]{{ greeting }}, уважаемый [B]{{ user.mention }}[/ICODE][/B].[/CENTER]<br><br>' +
   "[CENTER]Ваше наказание будет аннулировано в ближайшее время.[/CENTER]<br>" +
   '[CENTER][COLOR=rgb(251, 160, 38)]Закрыто.[/COLOR][/FONT][/CENTER]',
   prefix: CLOSE_PREFIX,
   status: false,
   },
   {
     title: 'БУДЕТ СНЯТ',
     content: '[CENTER][FONT=georgia][ICODE]{{ greeting }}, уважаемый [B]{{ user.mention }}[/ICODE][/B].[/CENTER]<br>' +
   "[CENTER]Данный администратор будет [COLOR=rgb(255, 0, 0)]снят[/COLOR] со своей должности.[/CENTER]<br><br>" +
   "[CENTER]Одобрено.[/FONT][/CENTER]",
     prefix: ACCEPT_PREFIX,
    status: false,
  },
  {
   title: '- - - - - - - - - - - - - - - - - - - - - | ЖБ закрыто/отклонено | - - - - - - - - - - - - - - - - - - - - -',
 },
 {
     title: 'НАКАЗАНИЕ ВЫДАНО ВЕРНО',
     content: '[CENTER][FONT=georgia][ICODE]{{ greeting }}, уважаемый [B]{{ user.mention }}[/ICODE][/B].[/CENTER]<br>' +
   "[CENTER]Наказание выдано [COLOR=rgb(0, 255, 0)][I]верно[/I][/COLOR].[/CENTER]<br><br>" +
   "[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/FONT][/CENTER]",
     prefix: UNACCEPT_PREFIX,
    status: false,
  },
  {
     title: 'ДОК-ВА НЕ РАБОТАЮТ ЛИБО ИХ НЕТ В ЖБ',
     content: '[CENTER][FONT=georgia][ICODE]{{ greeting }}, уважаемый [B]{{ user.mention }}[/ICODE][/B].[/CENTER]<br>' +
   "[CENTER]Пересоздайте по новой жалобу, прикрепив доказательства.[/COLOR].[/CENTER]<br><br>" +
   "[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/FONT][/CENTER]",
     prefix: UNACCEPT_PREFIX,
    status: false,
  },
 {
     title: 'НЕ ПО ТЕМЕ РАЗДЕЛА',
     content: '[CENTER][FONT=georgia][ICODE]{{ greeting }}, уважаемый [B]{{ user.mention }}[/ICODE][/B].[/CENTER]<br>' +
   "[CENTER]Ваша тема никаким образом не относится к жалобас на администрацию.[/CENTER]<br><br>" +
   "[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/FONT][/CENTER]",
     prefix: UNACCEPT_PREFIX,
    status: false,
  },
  {
     title: 'ПРИЗНАЛ ВИНУ, НО В ОБЖ НАКАЗ',
     content: '[CENTER][FONT=georgia][ICODE]{{ greeting }}, уважаемый [B]{{ user.mention }}[/ICODE][/B].[/CENTER]<br>' +
   "[CENTER]Если Вы признаете свою вину, то обратитесь в «[I]Обжалование наказаний[/I]».[/CENTER]<br><br>" +
   "[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/FONT][/CENTER]",
     prefix: UNACCEPT_PREFIX,
    status: false,
  },
 {
     title: 'ЗАКРЫТО | АДМ ПЕРЕВЫДАЛ НАКАЗАНИЕ',
     content: '[CENTER][FONT=georgia][ICODE]{{ greeting }}, уважаемый [B]{{ user.mention }}[/ICODE][/B].[/CENTER]<br>' +
   "[CENTER]Администратор ошибся ID/никнеймом.<br>Извиняемся за предоставленные неудобства.[/CENTER]<br><br>" +
   "[CENTER][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR].[/FONT][/CENTER]",
     prefix: CLOSE_PREFIX,
    status: false,
  },
  {
     title: 'АДМ ПРЕДОСТАВИЛ ДОК-ВА',
     content: '[CENTER][FONT=georgia][ICODE]{{ greeting }}, уважаемый [B]{{ user.mention }}[/ICODE][/B].[/CENTER]<br>' +
   "[CENTER]Администратор предоставил доказательства Вашего нарушения.[/CENTER]<br><br>" +
   "[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR].[/FONT][/CENTER]",
     prefix: UNACCEPT_PREFIX,
    status: false,
  },
  {
     title: 'ЖБ НА ТЕХОВ',
     content: '[CENTER][FONT=georgia][ICODE]{{ greeting }}, уважаемый [B]{{ user.mention }}[/ICODE][/B].[/CENTER]<br>' +
   "[CENTER]Обратитесь в раздел «[I]Жалобы на технических специалистов[/I]».[/CENTER]<br><br>" +
   '[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/FONT][/CENTER]',
     prefix: UNACCEPT_PREFIX,
    status: false,
  },
  {
     title: 'В ОБЖ НАКАЗАНИЙ',
     content: '[CENTER][FONT=georgia][ICODE]{{ greeting }}, уважаемый [B]{{ user.mention }}[/ICODE][/B].[/CENTER]<br>' +
   "[CENTER]Обратитесь в раздел «[I]Обжалование наказаний[/I]».[/CENTER]<br><br>" +
   '[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/FONT][/CENTER]',
     prefix: UNACCEPT_PREFIX,
    status: false,
  },
  {
     title: 'НЕ ПО ФОРМЕ',
     content: '[CENTER][FONT=georgia][ICODE]{{ greeting }}, уважаемый [B]{{ user.mention }}[/ICODE][/B].[/CENTER]<br>' +
   "[CENTER]Ваша жалоба составлена не по форме.[/CENTER]<br><br>" +
   "[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/FONT][/CENTER]",
     prefix: UNACCEPT_PREFIX,
    status: false,
  },
  {
     title: 'ИСТЁК СРОК ЖБ',
     content: '[CENTER][FONT=georgia][ICODE]{{ greeting }}, уважаемый [B]{{ user.mention }}[/ICODE][/B].[/CENTER]<br>' +
   "[CENTER]Срок подачи жалобы истёк.[/CENTER]<br><br>" +
   "[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/FONT][/CENTER]",
     prefix: UNACCEPT_PREFIX,
    status: false,
  },
  {
     title: 'ОТВЕТ В ПРОШЛОЙ ЖБ',
     content: '[CENTER][FONT=georgia][ICODE]{{ greeting }}, уважаемый [B]{{ user.mention }}[/ICODE][/B].[/CENTER]<br>' +
   "[CENTER]Вам уже был дан ответ в прошлой жалобе.[/CENTER]<br><br>" +
   "[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]",
     prefix: UNACCEPT_PREFIX,
    status: false,
  },
  {
     title: 'НЕТ НАРУШЕНИЙ',
     content: '[CENTER][FONT=georgia][ICODE]{{ greeting }}, уважаемый [B]{{ user.mention }}[/ICODE][/B].[/CENTER]<br>' +
   "[CENTER]Нарушений не было найдено со стороны администратора.[/CENTER]<br><br>" +
   "[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/FONT][/CENTER]",
     prefix: UNACCEPT_PREFIX,
    status: false,
  },
  {
     title: 'ДОК-ВА ОТРЕДАКТИРОВАНЫ',
     content: '[CENTER][FONT=georgia][ICODE]{{ greeting }}, уважаемый [B]{{ user.mention }}[/ICODE][/B].[/CENTER]<br>' +
   "[CENTER]Ваши доказательства были отредактированы, что не подлежит рассмотрению.[/CENTER]<br><br>" +
   "[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/FONT][/CENTER]",
     prefix: UNACCEPT_PREFIX,
    status: false,
  },
  {
     title: 'НЕТ ДОК-В',
     content: '[CENTER][FONT=georgia][ICODE]{{ greeting }}, уважаемый [B]{{ user.mention }}[/ICODE][/B].[/CENTER]<br>' +
   "[CENTER]В жалобе отсутствуют доказательства.[/CENTER]<br><br>" +
   "[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/FONT][/CENTER]",
     prefix: UNACCEPT_PREFIX,
    status: false,
  },
  {
     title: 'НЕТ /time',
     content: '[CENTER][FONT=georgia][ICODE]{{ greeting }}, уважаемый [B]{{ user.mention }}[/ICODE][/B].[/CENTER]<br>' +
   "[CENTER]На вашем скриншоте отсутствует /time для точного рассмотрения жалобы.[/CENTER]<br><br>" +
   "[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/FONT][/CENTER]",
     prefix: UNACCEPT_PREFIX,
    status: false,
  },
  {
     title: 'НЕТ СКРИНШОТА БАНА',
     content: '[CENTER][FONT=georgia][ICODE]{{ greeting }}, уважаемый [B]{{ user.mention }}[/ICODE][/B].[/CENTER]<br>' +
   "[CENTER]Как доказательство прикладывается скриншот окна бана при входе на сервер.<br>Подайте новую жалобу и прикрепите такой скриншот, если он у вас имеется.<br>Благодарим вас за обращение.[/CENTER]<br><br>" +
   "[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/FONT][/CENTER]",
     prefix: UNACCEPT_PREFIX,
    status: false,
  },
  {
     title: 'ДОКИ В СОЦ. СЕТЯХ',
     content: '[CENTER][FONT=georgia][ICODE]{{ greeting }}, уважаемый [B]{{ user.mention }}[/ICODE][/B].[/CENTER]<br>' +
   "[CENTER]Доказательства не принимаются, которые были оставлены в соц. сетях.[/CENTER]<br><br>" +
   "[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/FONT][/CENTER]",
     prefix: UNACCEPT_PREFIX,
    status: false,
  },
  {
     title: 'ПОПЫТКА ПОДСТАВИТЬ АДМИНА',
     content: '[CENTER][FONT=georgia][ICODE]{{ greeting }}, уважаемый [B]{{ user.mention }}[/ICODE][/B].[/CENTER]<br>' +
   "[CENTER]Ваши доказательства были отредактированы, что не подлежит рассмотрению.[/CENTER]<br>" +
   "[CENTER]Ваш форумный аккаунт получит наказание в виде блокировки.[/CENTER]<br><br>" +
   "[COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/FONT][/CENTER]",
     prefix: UNACCEPT_PREFIX,
    status: false,
  },
  {
     title: 'ЖБ ОТ 3-ГО ЛИЦА',
     content: '[CENTER][FONT=georgia][ICODE]{{ greeting }}, уважаемый [B]{{ user.mention }}[/ICODE][/B].[/CENTER]<br>' +
   "[CENTER]Жалоба составлена от 3-го лица, рассмотрению не подлежит.[/CENTER]<br><br>" +
   "[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/FONT][/CENTER]",
     prefix: UNACCEPT_PREFIX,
    status: false,
  },
  {
     title: 'ДУБЛИКАТ',
     content: '[CENTER][FONT=georgia][ICODE]{{ greeting }}, уважаемый [B]{{ user.mention }}[/ICODE][/B].[/CENTER]<br>' +
   "[CENTER]Ваша жалоба является дубликатом Вашей прошлой жалобы. Просьба перестать делать дубликаты, иначе Ваш форумный аккаунт может получить наказание.[/CENTER]<br><br>" +
   "[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/FONT][/CENTER]",
     prefix: UNACCEPT_PREFIX,
    status: false,
  },
  {
     title: 'НАКАЗАНИЕ БУДЕТ ПЕРЕВЫДАНО',
     content: '[CENTER][FONT=georgia][ICODE]{{ greeting }}, уважаемый [B]{{ user.mention }}[/ICODE][/B].[/CENTER]<br>' +
   "[CENTER]Ваше наказание будет перевыдано в ближайшее время на другое.[/CENTER]<br><br>" +
   "[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]",
     prefix: CLOSE_PREFIX,
    status: false,
  },
  {
   title: '- - - - - - - - - - - - - - - - - - - - - | ЖБ переадресовано | - - - - - - - - - - - - - - - - - - - - -',
 },
  {
     title: 'ГА',
     content: '[CENTER][FONT=georgia][ICODE]{{ greeting }}, уважаемый [B]{{ user.mention }}[/ICODE][/B].[/CENTER]<br>' +
   "[CENTER]Ваша жалоба была передана [COLOR=rgb(255, 0, 0)][I]Главной Администрации[/I][/COLOR].[/CENTER]<br><br>" +
   '[CENTER]Просьба ожидать ответа и не создавать дубликаты данной темы.[/CENTER]<br>' +
   "[CENTER]Ожидайте ответа.[/FONT][/CENTER]",
     prefix: GA_PREFIX,
    status: true,
  },
  {
     title: 'СПЕЦ АДМ',
     content: '[CENTER][FONT=georgia][ICODE]{{ greeting }}, уважаемый [B]{{ user.mention }}[/ICODE][/B].[/CENTER]<br>' +
   "[CENTER]Ваша жалоба была передана [COLOR=rgb(255, 0, 0)][I]Специальному Администратору[/I][/COLOR].[/CENTER]<br><br>" +
   '[CENTER]Просьба ожидать ответа и не создавать дубликаты данной темы.[/CENTER]<br>' +
   "[CENTER]Ожидайте ответа.[/FONT][/CENTER]",
     prefix: CA_PREFIX,
    status: true,
  },
  {
     title: 'ТЕХУ',
     content: '[CENTER][FONT=georgia][ICODE]{{ greeting }}, уважаемый [B]{{ user.mention }}[/ICODE][/B].[/CENTER]<br>' +
   "[CENTER]Ваша жалоба была передана [COLOR=rgb(255, 0, 0)][I] Техническому специалисту[/I][/COLOR].[/CENTER]<br><br>" +
   '[CENTER]Просьба ожидать ответа и не создавать дубликаты данной темы.[/CENTER]<br>' +
   "[CENTER]Ожидайте ответа.[/FONT][/CENTER]",
     prefix: TEX_PREFIX,
    status: true,
  },
  {
     title: 'КП',
     content: '[CENTER][FONT=georgia][ICODE]{{ greeting }}, уважаемый [B]{{ user.mention }}[/ICODE][/B].[/CENTER]<br>' +
   "[CENTER]Ваша жалоба была передана [COLOR=rgb(250, 197, 28)][I]Команде Проекта[/I][/COLOR].[/CENTER]<br><br>" +
   '[CENTER]Просьба ожидать ответа и не создавать дубликаты данной темы.[/CENTER]<br>' +
   "[CENTER]Ожидайте ответа.[/FONT][/CENTER]",
     prefix: KP_PREFIX,
    status: true,
  },
  {
   title: '- - - - - - - - - - - - - - - - - - - - - | Обжалования | - - - - - - - - - - - - - - - - - - - - -',
 },
 {
     title: 'НАКАЗАНИЕ БУДЕТ СНЯТО',
     content: '[CENTER][FONT=georgia][ICODE]{{ greeting }}, уважаемый [B]{{ user.mention }}[/ICODE][/B].[/CENTER]<br>' +
   "[CENTER]Наказние будет полностью снято.[/CENTER]<br><br>" +
   "[CENTER][COLOR=rgb(255, 0, 0)]Одобрено.[/COLOR][/FONT][/CENTER]",
     prefix: ACCEPT_PREFIX,
    status: false,
  },
  {
     title: 'БУДЕТ СНИЖЕНО ДО 15 ДНЕЙ',
     content: '[CENTER][FONT=georgia][ICODE]{{ greeting }}, уважаемый [B]{{ user.mention }}[/ICODE][/B].[/CENTER]<br>' +
   "[CENTER]Ваше наказание будет снижено до 15 дней в течение 24-х часов.[/CENTER]<br><br>" +
   "[CENTER][COLOR=rgb(255, 0, 0)]Одобрено.[/COLOR][/FONT][/CENTER]",
     prefix: ACCEPT_PREFIX,
    status: false,
  },
  {
     title: 'БУДЕТ СНИЖЕНО ДО 30 ДНЕЙ',
     content: '[CENTER][FONT=georgia][ICODE]{{ greeting }}, уважаемый [B]{{ user.mention }}[/ICODE][/B].[/CENTER]<br>' +
   "[CENTER]Ваше наказание будет снижено до 30 дней в течение 24-х часов.[/CENTER]<br><br>" +
   "[CENTER][COLOR=rgb(255, 0, 0)]Одобрено.[/COLOR][/FONT][/CENTER]",
     prefix: ACCEPT_PREFIX,
    status: false,
  },
  {
     title: 'НЕ ПОДЛЕЖИТ РАССМОТРЕНИЮ',
     content: '[CENTER][FONT=georgia][ICODE]{{ greeting }}, уважаемый [B]{{ user.mention }}[/ICODE][/B].[/CENTER]<br>' +
   "[CENTER]Ваше наказание не подлежит никакому обжалованию.[/CENTER]<br><br>" +
   "[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/FONT][/CENTER]",
     prefix: UNACCEPT_PREFIX,
    status: false,
  },
  {
     title: 'НЕУВЕРЕН В ОСОЗНАНИИ ОШИБКИ',
     content: '[CENTER][FONT=georgia][ICODE]{{ greeting }}, уважаемый [B]{{ user.mention }}[/ICODE][/B].[/CENTER]<br>' +
   "[CENTER]Мы не уверены, что Вы осознали вину своего нарушения, в обжаловании отказано.[/CENTER]<br><br>" +
   "[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/FONT][/CENTER]",
     prefix: UNACCEPT_PREFIX,
    status: false,
  },
  {
     title: 'УЖЕ ОБЖАЛОВАН РАНЕЕ',
     content: '[CENTER][FONT=georgia][ICODE]{{ greeting }}, уважаемый [B]{{ user.mention }}[/ICODE][/B].[/CENTER]<br>' +
   "[CENTER]Ранее вам уже было одобрено обжалование и ваше наказание было снижено - повторного обжалования не будет.[/CENTER]<br><br>" +
   "[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/FONT][/CENTER]",
     prefix: UNACCEPT_PREFIX,
    status: false,
  },
  {
     title: 'В ЖБ НА АДМИНОВ',
     content: '[CENTER][FONT=georgia][ICODE]{{ greeting }}, уважаемый [B]{{ user.mention }}[/ICODE][/B].[/CENTER]<br>' +
   "[CENTER]Вы написали не туда. Вам необходимо обратиться в раздел «[I]Жалобы на администрацию[/I]» согласно форме подач.[/CENTER]<br><br>" +
   "[CENTER]<u>Форма подачи</u>: [URL='https://forum.fenixrp-mobile.ru/forums/27/']Клик[/URL]<br><br>" +
   "[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/FONT][/CENTER]",
    prefix: UNACCEPT_PREFIX,
    status: false,
  },
];

$(document).ready(() => {
   $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

   addButton('|', '');
   addButton('Закрыто', 'close');
   addButton('Решено', 'decided');
   addButton('Одобрено', 'accepted');
   addButton('На рассмотрении', 'pin');
   addButton('Отказано', 'unaccept');
   addButton('СА', 'sander');
   addButton('КП', 'project');
   addButton('ГА/ЗГА', 'ga');
   addButton('Ответы', 'selectAnswer');
   addButton('|', '');

   const threadData = getThreadData();

   $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
   $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
   $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
   $('button#close').click(() => editThreadData(CLOSE_PREFIX, false));
   $('button#decided').click(() => editThreadData(RESHENO_PREFIX, false));
   $('button#sander').click(() => editThreadData(CA_PREFIX, false));
   $('button#project').click(() => editThreadData(KP_PREFIX, false));
   $('button#ga').click(() => editThreadData(GA_PREFIX, false));

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
   12 < hours && hours <= 18
     ? 'Доброе утро'
     : 18 < hours && hours <= 21
     ? 'Добрый день'
     : 21 < hours && hours <= 4
     ? 'Добрый вечер'
     : 'Доброй ночи',
};
}


function editThreadData(prefix, pin = false) {
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
