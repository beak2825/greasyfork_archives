// ==UserScript==
// @name         ГА/ЗГА/КУРАТОРАМ
// @namespace    https://forum.blackrussia.online
// @version      3.24
// @description  always remember who you are
// @author       Persona_Slivko
// @match       https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/464850/%D0%93%D0%90%D0%97%D0%93%D0%90%D0%9A%D0%A3%D0%A0%D0%90%D0%A2%D0%9E%D0%A0%D0%90%D0%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/464850/%D0%93%D0%90%D0%97%D0%93%D0%90%D0%9A%D0%A3%D0%A0%D0%90%D0%A2%D0%9E%D0%A0%D0%90%D0%9C.meta.js
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
      title: 'Приветствие',
      content: '[Color=turquoise][FONT=Courier New][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' + '[CENTER]  [/CENTER][/FONT]',
    },
    {
   title: '- - - - - - - - - - - - - - - - - - - - - | На рассмотрении | - - - - - - - - - - - - - - - - - - - - -',
 },
 {
     title: 'ЗАПРОСИЛ ДОК-ВА',
     content:
     '[Color=turquoise][FONT=Courier New][CENTER][I]{{ greeting }}, уважаемый уважаемый [B]{{ user.mention }}[/B].[/color][/CENTER]<br>' +
   "[CENTER]Запросил доказательства у данного администратора.[/CENTER]<br><br>" +
   "[CENTER][COLOR=Orange]На рассмотрении[/COLOR].[/FONT][/CENTER]",
     prefix: PIN_PREFIX,
    status: true,
  },
  {
     title: 'НА РАССМОТРЕНИИ',
      content:
     '[Color=turquoise][FONT=Courier New][CENTER][I]{{ greeting }}, уважаемый уважаемый [B]{{ user.mention }}[/B].[/color][/CENTER]<br>' +
   "[CENTER][COLOR=Orange]Ваша жалоба взята на рассмотрение.[/CENTER]<br><br>" +
   "[CENTER][COLOR=White]Ожидайте ответа в данной теме и не создавайте дубликаты[/COLOR].[/FONT][/CENTER]",
     prefix: PIN_PREFIX,
    status: true,
  },
  {
   title: '- - - - - - - - - - - - - - - - - - - - - | ЖБ одобрено/решено | - - - - - - - - - - - - - - - - - - - - -',
 },
    {
     title: 'ПРОВЕДЕНА БЕСЕДА',
     content:
      '[Color=turquoise][FONT=Courier New][CENTER][I]{{ greeting }}, уважаемый уважаемый [B]{{ user.mention }}[/B].[/color][/CENTER]<br>' +
   "[CENTER]С администратором будет проведена [I]беседа[/I].[/CENTER]<br><br>" +
   '[CENTER][COLOR=Lightgreen]Решено.[/COLOR].[/FONT][/CENTER]',
   prefix: RESHENO_PREFIX,
   status: false,
   },
  {
     title: 'ПОЛУЧИТ НАКАЗАНИЕ',
     content:
      '[Color=turquoise][FONT=Courier New][CENTER][I]{{ greeting }}, уважаемый уважаемый [B]{{ user.mention }}[/B].[/color][/CENTER]<br>' +
   "[CENTER]Данный администратор будет [COLOR=red]наказан[/COLOR].[/CENTER]<br><br>" +
   "[CENTER][COLOR=Lightgreen]Одобрено.[/COLOR].[/FONT][/CENTER]",
     prefix: ACCEPT_PREFIX,
    status: false,
  },
  {
     title: 'НАКАЗАНИЕ СНЯТО + БЕСЕДА',
     content:
       '[Color=turquoise][FONT=Courier New][CENTER][I]{{ greeting }}, уважаемый уважаемый [B]{{ user.mention }}[/B].[/color][/CENTER]<br>' +
   "[CENTER]С администратором будет проведена [I]беседа[/I].[/CENTER]<br><br>" +
   "[CENTER]Ваше наказание будет аннулировано.[/CENTER]<br>" +
   '[CENTER][COLOR=Lightgreen]Решено.[/COLOR][/FONT][/CENTER]',
   prefix: RESHENO_PREFIX,
   status: false,
   },
   {
     title: 'НАКАЗАНИЕ СНЯТО',
     content:
        '[Color=turquoise][FONT=Courier New][CENTER][I]{{ greeting }}, уважаемый уважаемый [B]{{ user.mention }}[/B].[/color][/CENTER]<br>' +
   "[CENTER]Ваше наказание будет аннулировано в ближайшее время.[/CENTER]<br>" +
   "[CENTER][COLOR=red]Закрыто.[/COLOR].[/CENTER]<br><br>"+
   '[CENTER][COLOR=Lightgreen]Решено.[/CENTER]',
   prefix: RESHENO_PREFIX,
   status: false,
   },
   {
     title: 'БУДЕТ СНЯТ',
       content:
     '[Color=turquoise][FONT=Courier New][CENTER][I]{{ greeting }}, уважаемый уважаемый [B]{{ user.mention }}[/B].[/color][/CENTER]<br>' +
   "[CENTER]Данный администратор будет [COLOR=rgb(255, 0, 0)]снят[/COLOR] со своей должности.[/CENTER]<br><br>" +
   "[CENTER][COLOR=Lightgreen]Одобрено.[/FONT][/CENTER]",
     prefix: ACCEPT_PREFIX,
    status: false,
  },
  {
   title: '- - - - - - - - - - - - - - - - - - - - - | ЖБ закрыто/отклонено | - - - - - - - - - - - - - - - - - - - - -',
 },
 {
     title: 'НАКАЗАНИЕ ВЫДАНО ВЕРНО',
     content:
     '[Color=turquoise][FONT=Courier New][CENTER][I]{{ greeting }}, уважаемый уважаемый [B]{{ user.mention }}[/B].[/color][/CENTER]<br>' +
   "[CENTER]Наказание выдано [COLOR=rgb(0, 255, 0)][I]верно[/I][/COLOR].[/CENTER]<br><br>" +
   "[CENTER][COLOR=red]Отказано.[/COLOR][/FONT][/CENTER]",
     prefix: UNACCEPT_PREFIX,
    status: false,
  },
  {
     title: 'ДОК-ВА НЕ РАБОТАЮТ ЛИБО ИХ НЕТ В ЖБ',
     content:  '[Color=turquoise][FONT=Courier New][CENTER][I]{{ greeting }}, уважаемый уважаемый [B]{{ user.mention }}[/B].[/color][/CENTER]<br>' +
   "[CENTER]Пересоздайте по новой жалобу, прикрепив доказательства(тому послужило плохое качество/не открываются док-ва).[/CENTER]<br><br>" +
   "[CENTER][COLOR=red]Отказано.[/COLOR][/FONT][/CENTER]",
     prefix: UNACCEPT_PREFIX,
    status: false,
  },
 {
     title: 'НЕ ПО ТЕМЕ РАЗДЕЛА',
     content:
     '[Color=turquoise][FONT=Courier New][CENTER][I]{{ greeting }}, уважаемый уважаемый [B]{{ user.mention }}[/B].[/color][/CENTER]<br>' +
   "[CENTER]Ваша тема никаким образом не относится к жалобам на администрацию.[/CENTER]<br><br>" +
     "[CENTER][COLOR=red]Отказано.[/COLOR][/FONT][/CENTER]",
     prefix: UNACCEPT_PREFIX,
    status: false,
  },
  {
     title: 'ПРИЗНАЛ ВИНУ, НО В ЖБ НА АДМ',
     content: '[Color=turquoise][FONT=Courier New][CENTER][I]{{ greeting }}, уважаемый уважаемый [B]{{ user.mention }}[/B].[/color][/CENTER]<br>' +
   "[CENTER]Если Вы признаете свою вину, то обратитесь в «[I]Обжалование наказаний[/I]».[/CENTER]<br><br>" +
   '[CENTER][COLOR=Lightgreen]Решено.[/CENTER]',
     prefix: RESHENO_PREFIX,
    status: false,
  },
 {
     title: 'ЗАКРЫТО | АДМ ПЕРЕВЫДАЛ НАКАЗАНИЕ',
     content: '[Color=turquoise][FONT=Courier New][CENTER][I]{{ greeting }}, уважаемый уважаемый [B]{{ user.mention }}[/B].[/color][/CENTER]<br>' +
   "[CENTER]Администратор ошибся ID/никнеймом.<br>Извиняемся за предоставленные неудобства.[/CENTER]<br><br>" +
  '[CENTER][COLOR=Lightgreen]Решено.[/CENTER]',
     prefix: RESHENO_PREFIX,
    status: false,
  },
  {
     title: 'АДМ ПРЕДОСТАВИЛ ДОК-ВА',
     content: '[Color=turquoise][FONT=Courier New][CENTER][I]{{ greeting }}, уважаемый уважаемый [B]{{ user.mention }}[/B].[/color][/CENTER]<br>' +
   "[CENTER]Администратор предоставил доказательства Вашего нарушения.[/CENTER]<br><br>" +
   "[CENTER][COLOR=red]Отказано.[/COLOR].[/FONT][/CENTER]",
     prefix: UNACCEPT_PREFIX,
    status: false,
  },
  {
     title: 'ЖБ НА ТЕХОВ',
     content: '[Color=turquoise][FONT=Courier New][CENTER][I]{{ greeting }}, уважаемый уважаемый [B]{{ user.mention }}[/B].[/color][/CENTER]<br>' +
   "[CENTER]Обратитесь в раздел «[I]Жалобы на технических специалистов[/I]».[/CENTER]<br><br>" +
   '[CENTER][COLOR=red]Отказано.[/COLOR][/FONT][/CENTER]',
     prefix: UNACCEPT_PREFIX,
    status: false,
  },
  {
     title: 'В ОБЖ НАКАЗАНИЙ',
     content: '[Color=turquoise][FONT=Courier New][CENTER][I]{{ greeting }}, уважаемый уважаемый [B]{{ user.mention }}[/B].[/color][/CENTER]<br>' +
   "[CENTER]Обратитесь в раздел «[I]Обжалование наказаний[/I]».[/CENTER]<br><br>" +
   '[CENTER][COLOR=red]Отказано.[/COLOR][/FONT][/CENTER]',
     prefix: UNACCEPT_PREFIX,
    status: false,
  },
  {
     title: 'НЕ ПО ФОРМЕ',
     content: '[Color=turquoise][FONT=Courier New][CENTER][I]{{ greeting }}, уважаемый уважаемый [B]{{ user.mention }}[/B].[/color][/CENTER]<br>' +
   "[CENTER]Ваша жалоба составлена не по форме.[/CENTER]<br><br>" +
   "[CENTER][COLOR=red]Отказано.[/COLOR][/FONT][/CENTER]",
     prefix: UNACCEPT_PREFIX,
    status: false,
  },
  {
     title: 'ИСТЁК СРОК ЖБ',
     content: '[Color=turquoise][FONT=Courier New][CENTER][I]{{ greeting }}, уважаемый уважаемый [B]{{ user.mention }}[/B].[/color][/CENTER]<br>' +
   "[CENTER]Срок подачи жалобы истёк.[/CENTER]<br><br>" +
   "[CENTER][COLOR=red]Отказано.[/COLOR][/FONT][/CENTER]",
     prefix: UNACCEPT_PREFIX,
    status: false,
  },
  {
     title: 'ОТВЕТ В ПРОШЛОЙ ЖБ',
     content: '[Color=turquoise][FONT=Courier New][CENTER][I]{{ greeting }}, уважаемый уважаемый [B]{{ user.mention }}[/B].[/color][/CENTER]<br>' +
   "[CENTER]Вам уже был дан ответ в прошлой жалобе.[/CENTER]<br><br>" +
   "[CENTER][COLOR=red]Отказано.[/COLOR][/CENTER]",
     prefix: UNACCEPT_PREFIX,
    status: false,
  },
  {
     title: 'НЕТ НАРУШЕНИЙ',
     content: '[Color=turquoise][FONT=Courier New][CENTER][I]{{ greeting }}, уважаемый уважаемый [B]{{ user.mention }}[/B].[/color][/CENTER]<br>' +
   "[CENTER]Нарушений не было найдено со стороны администратора.[/CENTER]<br><br>" +
   "[CENTER][COLOR=red]Отказано.[/COLOR][/FONT][/CENTER]",
     prefix: UNACCEPT_PREFIX,
    status: false,
  },
  {
     title: 'ДОК-ВА ОТРЕДАКТИРОВАНЫ',
     content: '[Color=turquoise][FONT=Courier New][CENTER][I]{{ greeting }}, уважаемый уважаемый [B]{{ user.mention }}[/B].[/color][/CENTER]<br>' +
   "[CENTER]Ваши доказательства были отредактированы, что не подлежит рассмотрению.[/CENTER]<br><br>" +
   "[CENTER][COLOR=red]Отказано.[/COLOR][/FONT][/CENTER]",
     prefix: UNACCEPT_PREFIX,
    status: false,
  },
  {
     title: 'НЕТ ДОК-В',
     content: '[Color=turquoise][FONT=Courier New][CENTER][I]{{ greeting }}, уважаемый уважаемый [B]{{ user.mention }}[/B].[/color][/CENTER]<br>' +
   "[CENTER]В жалобе отсутствуют доказательства.[/CENTER]<br><br>" +
   "[CENTER][COLOR=red]Отказано.[/COLOR][/FONT][/CENTER]",
     prefix: UNACCEPT_PREFIX,
    status: false,
  },
  {
     title: 'НЕТ /time',
     content: '[Color=turquoise][FONT=Courier New][CENTER][I]{{ greeting }}, уважаемый уважаемый [B]{{ user.mention }}[/B].[/color][/CENTER]<br>' +
   "[CENTER]На вашем скриншоте отсутствует /time для точного рассмотрения жалобы.[/CENTER]<br><br>" +
   "[CENTER][COLOR=red]Отказано.[/COLOR][/FONT][/CENTER]",
     prefix: UNACCEPT_PREFIX,
    status: false,
  },
  {
     title: 'НЕТ СКРИНШОТА БАНА',
     content:'[Color=turquoise][FONT=Courier New][CENTER][I]{{ greeting }}, уважаемый уважаемый [B]{{ user.mention }}[/B].[/color][/CENTER]<br>' +
   "[CENTER]Как доказательство прикладывается скриншот окна бана при входе на сервер.<br>Подайте новую жалобу и прикрепите такой скриншот, если он у вас имеется.<br>Благодарим вас за обращение.[/CENTER]<br><br>" +
   "[CENTER][COLOR=red]Отказано.[/COLOR][/FONT][/CENTER]",
     prefix: UNACCEPT_PREFIX,
    status: false,
  },
  {
     title: 'ДОКИ В СОЦ. СЕТЯХ',
     content:'[Color=turquoise][FONT=Courier New][CENTER][I]{{ greeting }}, уважаемый уважаемый [B]{{ user.mention }}[/B].[/color][/CENTER]<br>' +
   "[CENTER]Доказательства не принимаются, которые были оставлены в соц. сетях.[/CENTER]<br><br>" +
   "[CENTER][COLOR=red]Отказано.[/COLOR][/FONT][/CENTER]",
     prefix: UNACCEPT_PREFIX,
    status: false,
  },
  {
     title: 'ПОПЫТКА ПОДСТАВИТЬ АДМИНА',
     content: '[Color=turquoise][FONT=Courier New][CENTER][I]{{ greeting }}, уважаемый уважаемый [B]{{ user.mention }}[/B].[/color][/CENTER]<br>' +
   "[CENTER]Ваши доказательства были отредактированы, что не подлежит рассмотрению.[/CENTER]<br>" +
   "[CENTER]Ваш форумный аккаунт получит наказание в виде блокировки.[/CENTER]<br><br>" +
   "[COLOR=red]Отказано.[/COLOR][/FONT][/CENTER]",
     prefix: UNACCEPT_PREFIX,
    status: false,
  },
  {
     title: 'ЖБ ОТ 3-ГО ЛИЦА',
     content: '[Color=turquoise][FONT=Courier New][CENTER][I]{{ greeting }}, уважаемый уважаемый [B]{{ user.mention }}[/B].[/color][/CENTER]<br>' +
   "[CENTER]Жалоба составлена от 3-го лица, рассмотрению не подлежит.[/CENTER]<br><br>" +
   "[CENTER][COLOR=red]Отказано.[/COLOR][/FONT][/CENTER]",
     prefix: UNACCEPT_PREFIX,
    status: false,
  },
  {
     title: 'ДУБЛИКАТ',
     content: '[Color=turquoise][FONT=Courier New][CENTER][I]{{ greeting }}, уважаемый уважаемый [B]{{ user.mention }}[/B].[/color][/CENTER]<br>' +
   "[CENTER]Ваша жалоба является дубликатом Вашей прошлой жалобы. Просьба перестать делать дубликаты, иначе Ваш форумный аккаунт может получить наказание.[/CENTER]<br><br>" +
   "[CENTER][COLOR=red]Отказано.[/COLOR][/FONT][/CENTER]",
     prefix: UNACCEPT_PREFIX,
    status: false,
  },
  {
     title: 'НАКАЗАНИЕ БУДЕТ ПЕРЕВЫДАНО',
     content: '[Color=turquoise][FONT=Courier New][CENTER][I]{{ greeting }}, уважаемый уважаемый [B]{{ user.mention }}[/B].[/color][/CENTER]<br>' +
   "[CENTER]Ваше наказание будет перевыдано в ближайшее время на другое.[/CENTER]<br><br>" +
   '[CENTER][COLOR=Lightgreen]Решено.[/CENTER]',
     prefix: RESHENO_PREFIX,
    status: false,
  },
  {
   title: '- - - - - - - - - - - - - - - - - - - - - | ЖБ переадресовано | - - - - - - - - - - - - - - - - - - - - -',
 },
  {
     title: 'ГА',
     content:'[Color=turquoise][FONT=Courier New][CENTER][I]{{ greeting }}, уважаемый уважаемый [B]{{ user.mention }}[/B].[/color][/CENTER]<br>' +
   "[CENTER]Ваша жалоба была передана [COLOR=rgb(255, 0, 0)][I]Главной Администрации[/I][/COLOR].[/CENTER]<br><br>" +
   '[CENTER]Просьба ожидать ответа и не создавать дубликаты данной темы.[/CENTER]<br>' +
   "[CENTER]Ожидайте ответа.[/FONT][/CENTER]",
     prefix: GA_PREFIX,
    status: true,
  },
 {
     title: 'ОЗГА',
     content:
     '[Color=turquoise][FONT=Courier New][CENTER][I]{{ greeting }}, уважаемый уважаемый [B]{{ user.mention }}[/B].[/color][/CENTER]<br>' +
   "[CENTER][Color=red]Ваша жалоба передана Основному Заместителю Главного Администратора .[/CENTER]<br><br>" +
   "[CENTER][COLOR=Orange]На рассмотрении[/COLOR].[/FONT][/CENTER]",
     prefix: PIN_PREFIX,
    status: true,
  },
    {
     title: 'ЗГА ГОСС/ОПГ',
     content:
     '[Color=turquoise][FONT=Courier New][CENTER][I]{{ greeting }}, уважаемый уважаемый [B]{{ user.mention }}[/B].[/color][/CENTER]<br>' +
   "[CENTER][Color=red]Ваша жалоба передана Заместителю Главного Администратора по направлению ОПГ/ГОСС.[/CENTER]<br><br>" +
   "[CENTER][COLOR=Orange]На рассмотрении[/COLOR].[/FONT][/CENTER]",
     prefix: PIN_PREFIX,
    status: true,
  },
  {
     title: 'СПЕЦ АДМ',
     content: '[Color=turquoise][FONT=Courier New][CENTER][I]{{ greeting }}, уважаемый уважаемый [B]{{ user.mention }}[/B].[/color][/CENTER]<br>' +
   "[CENTER]Ваша жалоба была передана [COLOR=rgb(255, 0, 0)][I]Специальному Администратору[/I][/COLOR].[/CENTER]<br><br>" +
   '[CENTER]Просьба ожидать ответа и не создавать дубликаты данной темы.[/CENTER]<br>' +
   "[CENTER]Ожидайте ответа.[/FONT][/CENTER]",
     prefix: CA_PREFIX,
    status: true,
  },
  {
     title: 'ТЕХУ',
     content: '[Color=turquoise][FONT=Courier New][CENTER][I]{{ greeting }}, уважаемый уважаемый [B]{{ user.mention }}[/B].[/color][/CENTER]<br>' +
   "[CENTER]Ваша жалоба была передана [COLOR=rgb(255, 0, 0)][I] Техническому специалисту[/I][/COLOR].[/CENTER]<br><br>" +
   '[CENTER]Просьба ожидать ответа и не создавать дубликаты данной темы.[/CENTER]<br>' +
   "[CENTER]Ожидайте ответа.[/FONT][/CENTER]",
     prefix: TEX_PREFIX,
    status: true,
  },
  {
     title: 'КП',
     content:'[Color=turquoise][FONT=Courier New][CENTER][I]{{ greeting }}, уважаемый уважаемый [B]{{ user.mention }}[/B].[/color][/CENTER]<br>' +
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
     content:'[Color=turquoise][FONT=Courier New][CENTER][I]{{ greeting }}, уважаемый уважаемый [B]{{ user.mention }}[/B].[/color][/CENTER]<br>' +
   "[CENTER]Наказние будет полностью снято.[/CENTER]<br><br>" +
   "[CENTER][COLOR=rgb(255, 0, 0)]Одобрено.[/COLOR][/FONT][/CENTER]",
     prefix: ACCEPT_PREFIX,
    status: false,
  },
  {
     title: 'БУДЕТ СНИЖЕНО ДО 15 ДНЕЙ',
     content: '[Color=turquoise][FONT=Courier New][CENTER][I]{{ greeting }}, уважаемый уважаемый [B]{{ user.mention }}[/B].[/color][/CENTER]<br>' +
   "[CENTER]Ваше наказание будет снижено до 15 дней в течение 24-х часов.[/CENTER]<br><br>" +
   "[CENTER][COLOR=rgb(255, 0, 0)]Одобрено.[/COLOR][/FONT][/CENTER]",
     prefix: ACCEPT_PREFIX,
    status: false,
  },
  {
     title: 'БУДЕТ СНИЖЕНО ДО 30 ДНЕЙ',
     content: '[Color=turquoise][FONT=Courier New][CENTER][I]{{ greeting }}, уважаемый уважаемый [B]{{ user.mention }}[/B].[/color][/CENTER]<br>' +
   "[CENTER]Ваше наказание будет снижено до 30 дней в течение 24-х часов.[/CENTER]<br><br>" +
   "[CENTER][COLOR=rgb(255, 0, 0)]Одобрено.[/COLOR][/FONT][/CENTER]",
     prefix: ACCEPT_PREFIX,
    status: false,
  },
  {
     title: 'НЕ ПОДЛЕЖИТ РАССМОТРЕНИЮ',
     content:'[Color=turquoise][FONT=Courier New][CENTER][I]{{ greeting }}, уважаемый уважаемый [B]{{ user.mention }}[/B].[/color][/CENTER]<br>' +
   "[CENTER]Ваше наказание не подлежит никакому обжалованию.[/CENTER]<br><br>" +
   "[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/FONT][/CENTER]",
     prefix: UNACCEPT_PREFIX,
    status: false,
  },
  {
     title: 'НЕУВЕРЕН В ОСОЗНАНИИ ОШИБКИ',
     content: '[Color=turquoise][FONT=Courier New][CENTER][I]{{ greeting }}, уважаемый уважаемый [B]{{ user.mention }}[/B].[/color][/CENTER]<br>' +
   "[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/FONT][/CENTER]",
     prefix: UNACCEPT_PREFIX,
    status: false,
  },
  {
     title: 'УЖЕ ОБЖАЛОВАН РАНЕЕ',
     content:'[Color=turquoise][FONT=Courier New][CENTER][I]{{ greeting }}, уважаемый уважаемый [B]{{ user.mention }}[/B].[/color][/CENTER]<br>' +
   "[CENTER]Ранее вам уже было одобрено обжалование и ваше наказание было снижено - повторного обжалования не будет.[/CENTER]<br><br>" +
   "[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/FONT][/CENTER]",
     prefix: UNACCEPT_PREFIX,
    status: false,
  },
  {
     title: 'В ЖБ НА АДМИНОВ',
     content: '[Color=turquoise][FONT=Courier New][CENTER][I]{{ greeting }}, уважаемый уважаемый [B]{{ user.mention }}[/B].[/color][/CENTER]<br>' +
   "[CENTER]Вы написали не туда. Вам необходимо обратиться в раздел «[I]Жалобы на администрацию[/I]» согласно форме подач.[/CENTER]<br><br>" +
   "[CENTER]<u>Форма подачи</u>: [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.3429349/']клик[/URL]<br><br>" +
   "[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/FONT][/CENTER]",
    prefix: UNACCEPT_PREFIX,
    status: false,
  },
  {
     title: 'ОБРАТИТЬСЯ НА СВОЙ СЕРВЕР',
     content:'[Color=turquoise][FONT=Courier New][CENTER][I]{{ greeting }}, уважаемый уважаемый [B]{{ user.mention }}[/B].[/color][/CENTER]<br>' +
   "[CENTER]Вы написали обжалование/жалобу не на свой сервер.[/CENTER]<br><br>" +
   "[CENTER]Сервер №1: RED - [URL='https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.89/']клик[/URL]<br>" +
   "[CENTER]Сервер №2: GREEN - [URL='https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.120/']клик[/URL]<br>" +
   "[CENTER]Сервер №3: BLUE - [URL='https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.157/']клик[/URL]<br>" +
   "[CENTER]Сервер №4: YELLOW - [URL='https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.195/']клик[/URL]<br>" +
   "[CENTER]Сервер №5: ORANGE - [URL='https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.274/']клик[/URL]<br>" +
   "[CENTER]Сервер №6: PURPLE - [URL='https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.313/']клик[/URL]<br>" +
   "[CENTER]Сервер №7: LIME - [URL='https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.353/']клик[/URL]<br>" +
   "[CENTER]Сервер №8: PINK - [URL='https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.395/']клик[/URL]<br>" +
   "[CENTER]Сервер №9: CHERRY - [URL='https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.436/']клик[/URL]<br>" +
   "[CENTER]Сервер №10: BLACK - [URL='https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.471/']клик[/URL]<br>" +
   "[CENTER]Сервер №11: INDIGO - [URL='https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.520/']клик[/URL]<br>" +
   "[CENTER]Сервер №12: WHITE - [URL='https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.561/']клик[/URL]<br>" +
   "[CENTER]Сервер №13: MAGENTA - [URL='https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.600/']клик[/URL]<br>" +
   "[CENTER]Сервер №14: CRIMSON - [URL='https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.641/']клик[/URL]<br>" +
   "[CENTER]Сервер №15: GOLD - [URL='https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.683/']клик[/URL]<br>" +
   "[CENTER]Сервер №16: AZURE - [URL='https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.724/']клик[/URL]<br>" +
   "[CENTER]Сервер №17: PLATINUM - [URL='https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.786/']клик[/URL]<br>" +
   "[CENTER]Сервер №18: AQUA - [URL='https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.845/']клик[/URL]<br>" +
   "[CENTER]Сервер №19: GRAY - [URL='https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.886/']клик[/URL]<br>" +
   "[CENTER]Сервев №20: ICE - [URL='https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.955/']клик[/URL]<br>" +
   "[CENTER]Сервер №21: CHILLI - [URL='https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.995/']клик[/URL]<br>" +
   "[CENTER]Сервер №22: CHOCO - [URL='https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.1037/']клик[/URL]<br>" +
   "[CENTER]Сервер №23: MOSCOW - [URL='https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.1083/']клик[/URL]<br>" +
   "[CENTER]Сервер №24: SPB - [URL='https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.1125/']клик[/URL]<br>" +
   "[CENTER]Сервер №25: UFA - [URL='https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.1168/']клик[/URL]<br>" +
   "[CENTER]Сервер №26: SOCHI - [URL='https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.1235/']клик[/URL]<br>" +
   "[CENTER]Сервер №27: KAZAN - [URL='https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.1277/']клик[/URL]<br>" +
   "[CENTER]Сервер №28: SAMARA - [URL='https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.1321/']клик[/URL]<br>" +
   "[CENTER]Сервер №29: ROSTOV - [URL='https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.1363/']клик[/URL]<br>" +
   "[CENTER]Сервер №30: ANAPA - [URL='https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.1403/']клик[/URL]<br>" +
   "[CENTER]Сервер №31: EKB - [URL='https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.1145/']клик[/URL]<br>" +
   "[CENTER]Сервер №32: KRASNODAR - [URL='https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.1489/']клик[/URL]<br>" +
   "[CENTER]Сервер №33: ARZAMAS - [URL='https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.1528/']клик[/URL]<br>" +
   "[CENTER]Сервер №34: NOVOSIBIRSK - [URL='https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.1573/']клик[/URL]<br>" +
   "[CENTER]Сервер №35: GROZNY - [URL='https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.1615/']клик[/URL]<br>" +
   "[CENTER]Сервер №36: SARATOV - [URL='https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.1657/']клик[/URL]<br>" +
   "[CENTER]Сервер №37: OMSK - [URL='https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.1699/']клик[/URL]<br>" +
   "[CENTER]Сервер №38: IRKUTSK - [URL='https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.1741/']клик[/URL]<br><br>" +
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
