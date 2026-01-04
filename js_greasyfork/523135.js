// ==UserScript==
// @name         PODOLSK | Скрипт для Кураторов Форума | 1.1 версия
// @namespace    https://forum.blackrussia.online
// @version      1.0
// @description  Специально для BlackRussia | PODOLSK |  R.Abduragimov
// @author       R.Abduragimov
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MITblackrussia
// @collaborator R.Abduragimov
// @icon https://icons.iconarchive.com/icons/google/noto-emoji-people-bodyparts/512/12003-OK-hand-light-skin-tone-icon.png
// @downloadURL https://update.greasyfork.org/scripts/523135/PODOLSK%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%7C%2011%20%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/523135/PODOLSK%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%7C%2011%20%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F.meta.js
// ==/UserScript==

(function () {
  'use strict';
'esversion 6' ;
const UNACCEPT_PREFIX = 4; // Префикс, который будет установлен при закрытии потока
const ACCEPT_PREFIX = 8; // Префикс, который будет установлен при принятии потока
const PIN_PREFIX = 2; // Префикс, который будет установлен при намотке штифтов
const COMMAND_PREFIX = 10; // Префикс, который будет установлен при отправке потока команде проекта
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7; // Префикс, который будет установлен при закрытии потока.
const TEX_PREFIX = 13;
const GA_PREFIX = 12;
const V_PREFIX = 1;
const buttons = [
      {
      title: '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| RP Биографии |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
      content:
          '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
      },
    {
        title: 'RP био одобрена',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография одобрена. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] PODOLSK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
     "[FONT=georgia][SIZE=4][CENTER][SPOILER][I][B][COLOR=rgb(0, 221, 0)]Одобрено [/COLOR][/CENTER][/SPOILER][/I][/SIZE][/FONT]<br><br>" ,
       prefix: ACCEPT_PREFIX,
      status: false,
    },
     {
        title: 'На рассмотрение к ГКФ/ЗГКФ',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[COLOR=rgb(252, 15, 192)][I][FONT=georgia][SIZE=4]Ваша Role Play Биография переадресована [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(252, 15, 192)][I][FONT=georgia][SIZE=4]ГКФ , ЗГКФ [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(252, 15, 192)][I][FONT=georgia][SIZE=4], ожидайте ответа в данной теме.[/SIZE][/FONT]<br><br>" +
    "[SPOILER][I][FONT=georgia][SIZE=4][COLOR=rgb(252, 15, 192)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] PODOLSK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 255, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: PIN_PREFIX,
      status: false,
    },
    {
        title: 'На доработке',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография на доработке. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/podolsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.11034857/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] PODOLSK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На доработке!![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
      prefix: PIN_PREFIX,
    },
     {
      title: '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| RP Био Отказы |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
      content:
          '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
      },
    {
        title: 'RP био NonRP nick',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к у вас NonRP NickName. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/podolsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.11034857/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] PODOLSK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/B][/I][/COLOR][/CENTER][/HEADING]<br>",
      prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'Мало инфо в пункте семья',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к мало информации в пункте семья. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/podolsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.11034857/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] PODOLSK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/B][/I][/COLOR][/CENTER][/HEADING]<br>",
      prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'RP био заголовок не по форме',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к. заголовок оформлен неправильно. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/podolsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.11034857/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] PODOLSK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/B][/I][/COLOR][/CENTER][/HEADING]<br>",
      prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'более 1 рп био на ник',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к запрещено создавать более одной RP Биографии на один Nick. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/podolsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.11034857/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] PODOLSK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
      prefix: UNACCEPT_PREFIX,
    },
    {
        title: 'RP био некоррект. возраст',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к. в ней указан некорректный возраст. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/podolsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.11034857/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] PODOLSK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'RP био мало информации',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к. в ней написано мало информации. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/podolsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.11034857/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] PODOLSK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'RP био нет 18 лет',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к. персонажу нет 18 лет. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/podolsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.11034857/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] PODOLSK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'RP био от 3го лица',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к. написана от 3-го лица. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/podolsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.11034857/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] PODOLSK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/B][/I][/COLOR][/CENTER][/HEADING]<br>",
      prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'RP био не по форме',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к. она составлена не по форме. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/podolsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.11034857/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] PODOLSK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'RP био не дополнил',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к. вы её не дополнили. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/podolsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.11034857/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] PODOLSK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'RP био неграмотная',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к. она оформлена неграмотно. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/podolsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.11034857/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][I][B][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/I][/B][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Тавтология — это риторическая фигура, представляющая собой необоснованное повторение одних и тех же (или однокоренных) или близких по смыслу слов.[/SIZE][/CENTER][/COLOR][/FONT]" +
    "[HEADING=3][CENTER][I][B][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/I][/B][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Грамматическая ошибка - это ошибка в структуре языковой единицы: в структуре слова, словосочетания или предложения; это нарушение какой-либо грамматической нормы - словообразовательной, морфологической, синтаксической.[/SIZE][/CENTER][/COLOR][/FONT]" +
    "[HEADING=3][CENTER][I][B][COLOR=rgb(0, 255, 255)][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/I][/B][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Пунктуационная ошибка - это неиспользование пишущим необходимого знака препинания или его употребление там, где он не требуется, а также необоснованная замена одного знака препинания другим.[/SIZE][/CENTER][/COLOR][/FONT]" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] PODOLSK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'RP био тавтология',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к. она оформлена неграмотно. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/podolsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.11034857/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][I][B][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/I][/B][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Тавтология — это риторическая фигура, представляющая собой необоснованное повторение одних и тех же (или однокоренных) или близких по смыслу слов.[/SIZE][/CENTER][/COLOR][/FONT]" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] PODOLSK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'RP био знаки препинания',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к. она оформлена неграмотно. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/podolsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.11034857/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][I][B][COLOR=rgb(0, 255, 255)][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/I][/B][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Пунктуационная ошибка - это неиспользование пишущим необходимого знака препинания или его употребление там, где он не требуется, а также необоснованная замена одного знака препинания другим.[/SIZE][/CENTER][/COLOR][/FONT]" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] PODOLSK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'RP био граммат. ошибки',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к. она оформлена неграмотно. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/podolsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.11034857/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][I][B][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/I][/B][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Грамматическая ошибка - это ошибка в структуре языковой единицы: в структуре слова, словосочетания или предложения; это нарушение какой-либо грамматической нормы - словообразовательной, морфологической, синтаксической.[/SIZE][/CENTER][/COLOR][/FONT]" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] PODOLSK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'RP био скопирована',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к. она скопирована. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/podolsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.11034857/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] PODOLSK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'скопирована со своей старой био',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к. она скопирована с вашей прошлой РП Биографии на другой ник. Нужно на новый ник писать новую историю. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/podolsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.11034857/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] PODOLSK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'мало инфо детство',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к в пункте Детство мало информации. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/podolsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.11034857/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] PODOLSK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
      prefix: UNACCEPT_PREFIX,
       status: false,
    },
    {
        title: 'мало инфо юность',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к в пункте Юность и Взрослая жизнь мало информации. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/podolsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.11034857/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] PODOLSK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
      prefix: UNACCEPT_PREFIX,
       status: false,
    },
    {
        title: 'мало инфо Взрослая жизнь',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к в пункте Взрослая жизнь мало информации. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/podolsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.11034857/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] PODOLSK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
      prefix: UNACCEPT_PREFIX,
       status: false,
    },
    {
        title: 'мало инфо',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к в пункте *Детство* и *Юность и Взрослая* жизнь мало информации. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/podolsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.11034857/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] PODOLSK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
      prefix: UNACCEPT_PREFIX,
       status: false,
    },
     {
        title: 'Пункт Армия не правильный',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к в пункте 8. Период воинской службы (для мужчин) сделано не правельно. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/podolsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.11034857/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимание: Период воинской службы (для мужчин, дата должна быть полностью развернутой) [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] PODOLSK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
      prefix: UNACCEPT_PREFIX,
       status: false,
    },
     {
        title: 'Нет логики в пункте детсва и юности',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к в пункте Детство и юность сделан не логично. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/podolsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.11034857/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 182, 193)][FONT=georgia][SIZE=4] Внимание:10.3. Взрослая жизнь (рассказываете о своей взрослой жизни): С 18-20 лет. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] PODOLSK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
      prefix: UNACCEPT_PREFIX,
       status: false,
    },
      {
        title: 'Нет логики в пункте взрослой жизни',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к пункт Взрослая жизнь сделан не логично. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/podolsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.11034857/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 182, 193)][FONT=georgia][SIZE=4] Внимание:10.2. Юность (рассказываете о своей подростковой жизни); -С 13-15 лет до 18.. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] PODOLSK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
      prefix: UNACCEPT_PREFIX,
       status: false,
    },
     {
        title: 'Нет логики в пункте ностоящее время',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к пункт Ностоящее время сделан не логично. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/podolsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.11034857/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 182, 193)][FONT=georgia][SIZE=4] [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] PODOLSK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
      prefix: UNACCEPT_PREFIX,
       status: false,
    },
     {
        title: 'Нет логики в пункте внешности',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к в пункте 5 сделана не логично. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/podolsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.11034857/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 182, 193)][FONT=georgia][SIZE=4] Внимание: В пункте описание внешности у вас должно стоять хотябы рост 150+ так как у вас будет всегда отказано из-за роста, Пример: Рост:183 См. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] PODOLSK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
      prefix: UNACCEPT_PREFIX,
       status: false,
    },
     {
        title: 'Пункт имени не совподает с семьей',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к в пункте 1 Не совпадает с пунктом 3. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/podolsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.11034857/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 182, 193)][FONT=georgia][SIZE=4] Внимание: Фамилия Имя Отчество игрового персонажа. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 182, 193)][FONT=georgia][SIZE=4] Примичание: Если отчество будет не соответствовать Имени отца – Нет логики. Исключение: Если вы обыграете смену отчества через смену данных в паспорте.. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 182, 193)][FONT=georgia][SIZE=4] Примичание: Если в пункте будет записано выдуманный Nrp Nick-Name, кличка и тому подобное – Не по форме. . [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
     "[HEADING=3][CENTER][I][COLOR=rgb(255, 182, 193)][FONT=georgia][SIZE=4] Примичание: Сведения о родителях: . [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
     "[HEADING=3][CENTER][I][COLOR=rgb(255, 182, 193)][FONT=georgia][SIZE=4] Примичание: Если отчество будет не соответствовать имени отца – Нет логики. Исключение: Если вы обыграете смену отчества через смену данных в паспорте. . [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 182, 193)][FONT=georgia][SIZE=4] Примичание: Если в пункте 3 будет записана посторонняя информация про ваших других родственников – Не по форме. . [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] PODOLSK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
      prefix: UNACCEPT_PREFIX,
       status: false,
    },
    {
        title: 'Нет логики в пункте образование',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к в пункте 4 сделана не логично. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/podolsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.11034857/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 182, 193)][FONT=georgia][SIZE=4] Внимание: Если вы указали в пункте образование, на которое вы не отучились через текст в пунктах 10.1-10.3 – Нет логики.. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
     "[HEADING=3][CENTER][I][COLOR=rgb(255, 182, 193)][FONT=georgia][SIZE=4] Внимание: Пример: Игрок указал в пункте образования Высшее профессиональное образование, а в биографии написал, что окончил всего 11 классов и не пошёл в университет.. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] PODOLSK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
      prefix: UNACCEPT_PREFIX,
       status: false,
    },
    {
        title: 'Пункт 2 не совпадает с пунктом детства и юность',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к в пункт 11.1 не совпадает с пунктом 2, тоесть  сделана не логично. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/podolsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.11034857/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 182, 193)][FONT=georgia][SIZE=4] Внимание: Дата и место рождения: . [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
     "[HEADING=3][CENTER][I][COLOR=rgb(255, 182, 193)][FONT=georgia][SIZE=4] Если ваш возраст от даты рождения в биографии до даты написания биографии будет меньше 18-20 лет – Нет логики. . [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
     "[HEADING=3][CENTER][I][COLOR=rgb(255, 182, 193)][FONT=georgia][SIZE=4] Если ваше место рождения не будет совпадать с местом рождения, которое вы вероятнее всего напишите в пункте 10.1-10.3 – Нет логики.. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
      "[HEADING=3][CENTER][I][COLOR=rgb(255, 182, 193)][FONT=georgia][SIZE=4] Пример: 10.05.2000 - 10.05.2018. . [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
      "[HEADING=3][CENTER][I][COLOR=rgb(255, 182, 193)][FONT=georgia][SIZE=4] Детство и Юность (описываете все, что случилось с Вашим персонажем в детстве);  [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
      "[HEADING=3][CENTER][I][COLOR=rgb(255, 182, 193)][FONT=georgia][SIZE=4] Юность (рассказываете о своей подростковой жизни); -С 13-15 лет до 18. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
      "[HEADING=3][CENTER][I][COLOR=rgb(255, 182, 193)][FONT=georgia][SIZE=4] Взрослая жизнь (рассказываете о своей взрослой жизни): [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
      "[HEADING=3][CENTER][I][COLOR=rgb(255, 182, 193)][FONT=georgia][SIZE=4] С 18-20 лет . [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] PODOLSK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
      prefix: UNACCEPT_PREFIX,
       status: false,
    },
    {
        title: 'Пункт Взрослая жизнь Нету армии',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к. в вашем пункте взрослая жизнь не написано про Армию, расспишите более подробно про нее. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/podolsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.11034857/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] PODOLSK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'био отказ(Возраст и Дата)',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к. Причиной отказа могло послужить несовпадение возраста и даты рождения. . [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/podolsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.11034857/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] PODOLSK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'RP био только исполнилось 18 лет',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к. вам только исполнилось 18 лет и вас забрать не смогут ( максимум через дней 4 ). [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/podolsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.11034857/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] PODOLSK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
     {
      title: '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| ЕСЛИ ВЫ ХОТИТЕ ЧТОТО УЛУДЩИТЬ ПИШИТЕ СОЗДАТЕЛЮ СКРИПТА @lo_0000 |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
      },






    ];
      $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

              // Добавление кнопок при загрузке страницы
          addButton('Ответы для Кураторов Форума', 'selectAnswer');

              // Поиск информации о теме
    const threadData = getThreadData();

    $('button#pin').click(() => editThreadData(PINN_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ACCСEPT_PREFIX, false));
    $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
    $('button#Spec').click(() => editThreadData(SPECY_PREFIX, true));
    $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
    $('button#unaccept').click(() => editThreadData(UNACCСEPT_PREFIX, false));
    $('button#Texy').click(() => editThreadData(TEXY_PREFIX, false));
    $('button#Resheno').click(() => editThreadData(RESHENO_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));

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