// ==UserScript==
// @name         YAKUTSK | Кураторы форума Black Russia | by F.Disney
// @namespace    https://forum.blackrussia.online
// @version      2.02
// @description  Для РП Биографии и РП Ситуации
// @author       Felix_Disney
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @collaborator QuenkM
// @icon https://icons.iconarchive.com/icons/google/noto-emoji-people-bodyparts/256/11960-victory-hand-light-skin-tone-icon.png
// @downloadURL https://update.greasyfork.org/scripts/490931/YAKUTSK%20%7C%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20Black%20Russia%20%7C%20by%20FDisney.user.js
// @updateURL https://update.greasyfork.org/scripts/490931/YAKUTSK%20%7C%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20Black%20Russia%20%7C%20by%20FDisney.meta.js
// ==/UserScript==

(function () {
  'use strict';
'esversion 6' ;
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
      title: '_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ RolePlay Биография _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _',
    },
{
   title: '| Одобрена✅️ |',
   content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
  "[FONT=georgia][SIZE=4][COLOR=aqua][I]{{ greeting }}, уважаемый {{ user.name }} [/I][/COLOR][/SIZE][/FONT]<br><br>"+
  "[SIZE=3][FONT=georgia][I]Ваша RolePlay - биография одобрена.[/I][/FONT][/SIZE]<br><br>"+
  "[SIZE=4][FONT=georgia][I]Приятной игры на сервере [/I][COLOR=aqua][I]YAKUTSK[/I][/COLOR][FONT=georgia][/SIZE]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/T2Ny8YF0/image.gif[/img][/url][/CENTER]<br>",
   prefix: ACCEPT_PREFIX,
   status: false,
},
{
   title: '| Откaзана❌️ |',
   content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
  "[FONT=georgia][SIZE=4][COLOR=aqua][I]{{ greeting }}, уважаемый {{ user.name }} [/I][/COLOR][/SIZE][/FONT]<br><br>"+
  "[SIZE=3][FONT=georgia][I]Ваша RolePlay - биография отказана.[/I][/FONT][/SIZE]<br><br>"+
  "[SIZE=3][FONT=georgia][I]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе[/I][/FONT][/SIZE]<br><br>"+
  "[SIZE=4][FONT=georgia][I]Приятной игры на сервере [/I][COLOR=aqua][I]YAKUTSK[/I][/COLOR][/FONT][/SIZE]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/K8ws2zPz/download-5.gif[/img][/url][/CENTER]<br>",
   prefix: UNACCEPT_PREFIX,
   status: false,
},
{
   title: '| На доработке👀 |',
   content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
  "[FONT=georgia][SIZE=4][COLOR=aqua][I]{{ greeting }}, уважаемый {{ user.name }} [/I][/COLOR][/SIZE][/FONT]<br><br>"+
  "[SIZE=3][FONT=georgia][I]Ваша RolePlay - биография отказана.[/I][/FONT][/SIZE]<br>"+
  "[FONT=georgia][SIZE=3][COLOR=red][I]Вам дается 24 часа на дополнение вашей RP биографии.[/I][/COLOR]<br><br>"+
  "[I]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе[/I][/SIZE]<br><br>"+
  "[SIZE=4][I]Приятной игры на сервере [/I][COLOR=aqua][I]YAKUTSK[/I][/COLOR][/SIZE][/FONT]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/cHF0bN0G/download.gif[/img][/url][/CENTER]<br>",
   prefix: PIN_PREFIX,
          status: open,
},
{
   title: '| Не дополнил❌️ |',
   content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
  "[FONT=georgia][SIZE=4][COLOR=aqua][I]{{ greeting }}, уважаемый {{ user.name }} [/I][/COLOR][/SIZE][/FONT]<br><br>"+
  "[SIZE=3][FONT=georgia][I]Ваша RolePlay - биография отказана.[/I][/FONT][/SIZE]<br>"+
  "[FONT=georgia][SIZE=3][COLOR=red][I]За 24 часа вы не дополнили свою биографию.[/I][/COLOR]<br><br>"+
  "[I]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе[/I][/SIZE]<br><br>"+
  "[SIZE=4][I]Приятной игры на сервере [/I][COLOR=aqua][I]YAKUTSK[/I][/COLOR][/SIZE][/FONT]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/K8ws2zPz/download-5.gif[/img][/url][/CENTER]<br>",
   prefix: UNACCEPT_PREFIX,
   status: false,
},
{
   title: '| Заголовок не по форме❌️ |',
   content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
  "[FONT=georgia][SIZE=4][COLOR=aqua][I]{{ greeting }}, уважаемый {{ user.name }} [/I][/COLOR][/SIZE][/FONT]<br><br>"+
  "[SIZE=3][FONT=georgia][I]Ваша RolePlay - биография отказана.[/I][/FONT][/SIZE]<br>"+
  "[FONT=georgia][SIZE=3][COLOR=red][I]Причиной тому послужило неправильное оформление заголовка.[/I][/COLOR]<br><br>"+
  "[I]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе[/I][/SIZE]<br><br>"+
  "[SIZE=4][I]Приятной игры на сервере [/I][COLOR=aqua][I]YAKUTSK[/I][/COLOR][/SIZE][/FONT]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/K8ws2zPz/download-5.gif[/img][/url][/CENTER]<br>",
   status: false,
},
{
   title: '| Не по форме❌️ |',
   content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
  "[FONT=georgia][SIZE=4][COLOR=aqua][I]{{ greeting }}, уважаемый {{ user.name }} [/I][/COLOR][/SIZE][/FONT]<br><br>"+
  "[SIZE=3][FONT=georgia][I]Ваша RolePlay - биография отказана.[/I][/FONT][/SIZE]<br>"+
  "[FONT=georgia][SIZE=3][COLOR=red][I]Причиной тому послужило неправильное оформление биографии (не по форме).[/I][/COLOR]<br><br>"+
  "[I]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе[/I][/SIZE]<br><br>"+
  "[SIZE=4][I]Приятной игры на сервере [/I][COLOR=aqua][I]YAKUTSK[/I][/COLOR][/SIZE][/FONT]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/K8ws2zPz/download-5.gif[/img][/url][/CENTER]<br>",
   status: false,
   status: false,
},
{
   title: '|  Мало информации ❌️ |',
   content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
  "[FONT=georgia][SIZE=4][COLOR=aqua][I]{{ greeting }}, уважаемый {{ user.name }} [/I][/COLOR][/SIZE][/FONT]<br><br>"+
  "[SIZE=3][FONT=georgia][I]Ваша RolePlay - биография отказана.[/I][/FONT][/SIZE]<br>"+
  "[FONT=georgia][SIZE=3][COLOR=red][I]Причиной тому послужило отсутствие информации в вашей биографии (мало информации).[/I][/COLOR]<br><br>"+
  "[I]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе[/I][/SIZE]<br><br>"+
  "[SIZE=4][I]Приятной игры на сервере [/I][COLOR=aqua][I]YAKUTSK[/I][/COLOR][/SIZE][/FONT]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/K8ws2zPz/download-5.gif[/img][/url][/CENTER]<br>",
   prefix: UNACCEPT_PREFIX,
   status: false,
},
{
   title: '| Детство не расписано❌️ |',
   content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
  "[FONT=georgia][SIZE=4][COLOR=aqua][I]{{ greeting }}, уважаемый {{ user.name }} [/I][/COLOR][/SIZE][/FONT]<br><br>"+
  "[SIZE=3][FONT=georgia][I]Ваша RolePlay - биография отказана.[/I][/FONT][/SIZE]<br>"+
  "[FONT=georgia][SIZE=3][COLOR=red][I]Причиной тому послужило не расписанное детство в вашей биографии.[/I][/COLOR]<br><br>"+
  "[I]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе[/I][/SIZE]<br><br>"+
  "[SIZE=4][I]Приятной игры на сервере [/I][COLOR=aqua][I]YAKUTSK[/I][/COLOR][/SIZE][/FONT]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/K8ws2zPz/download-5.gif[/img][/url][/CENTER]<br>",
   prefix: UNACCEPT_PREFIX,
   status: false,
},
{
   title: '| Юность/Взрослая жизнь не расписана❌️ |',
   content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
  "[FONT=georgia][SIZE=4][COLOR=aqua][I]{{ greeting }}, уважаемый {{ user.name }} [/I][/COLOR][/SIZE][/FONT]<br><br>"+
  "[SIZE=3][FONT=georgia][I]Ваша RolePlay - биография отказана.[/I][/FONT][/SIZE]<br>"+
  "[FONT=georgia][SIZE=3][COLOR=red][I]Причиной тому послужило не расписанная юность или взрослая жизнь в вашей биографии.[/I][/COLOR]<br><br>"+
  "[I]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе[/I][/SIZE]<br><br>"+
  "[SIZE=4][I]Приятной игры на сервере [/I][COLOR=aqua][I]YAKUTSK[/I][/COLOR][/SIZE][/FONT]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/K8ws2zPz/download-5.gif[/img][/url][/CENTER]<br>",
   prefix: UNACCEPT_PREFIX,
   status: false,
},
{
   title: '| От 3-его лица❌️ |',
   content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
  "[FONT=georgia][SIZE=4][COLOR=aqua][I]{{ greeting }}, уважаемый {{ user.name }} [/I][/COLOR][/SIZE][/FONT]<br><br>"+
  "[SIZE=3][FONT=georgia][I]Ваша RolePlay - биография отказана.[/I][/FONT][/SIZE]<br>"+
  "[FONT=georgia][SIZE=3][COLOR=red][I]Причиной тому послужило написание биографии от 3-го лица.[/I][/COLOR]<br><br>"+
  "[I]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе[/I][/SIZE]<br><br>"+
  "[SIZE=4][I]Приятной игры на сервере [/I][COLOR=aqua][I]YAKUTSK[/I][/COLOR][/SIZE][/FONT]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/K8ws2zPz/download-5.gif[/img][/url][/CENTER]<br>",
   prefix: UNACCEPT_PREFIX,
   status: false,
},
{
   title: '| Супергерой❌️ |',
   content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
  "[FONT=georgia][SIZE=4][COLOR=aqua][I]{{ greeting }}, уважаемый {{ user.name }} [/I][/COLOR][/SIZE][/FONT]<br><br>"+
  "[SIZE=3][FONT=georgia][I]Ваша RolePlay - биография отказана.[/I][/FONT][/SIZE]<br>"+
  "[FONT=georgia][SIZE=3][COLOR=red][I] Причиной тому послужило приписывание своему персонажу супер-способностей. [/I][/COLOR]<br><br>"+
  "[I]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе[/I][/SIZE]<br><br>"+
  "[SIZE=4][I]Приятной игры на сервере [/I][COLOR=aqua][I]YAKUTSK[/I][/COLOR][/SIZE][/FONT]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/K8ws2zPz/download-5.gif[/img][/url][/CENTER]<br>",
   prefix: UNACCEPT_PREFIX,
   status: false,
},
{
   title: '| Копипаст❌️ |',
   content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
  "[FONT=georgia][SIZE=4][COLOR=aqua][I]{{ greeting }}, уважаемый {{ user.name }} [/I][/COLOR][/SIZE][/FONT]<br><br>"+
  "[SIZE=3][FONT=georgia][I]Ваша RolePlay - биография отказана.[/I][/FONT][/SIZE]<br>"+
  "[FONT=georgia][SIZE=3][COLOR=red][I] Причиной тому послужило полное или частичное копирование биографий из данного раздела или из разделов RP биографий других серверов.[/I][/COLOR]<br><br>"+
  "[I]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе[/I][/SIZE]<br><br>"+
  "[SIZE=4][I]Приятной игры на сервере [/I][COLOR=aqua][I]YAKUTSK[/I][/COLOR][/SIZE][/FONT]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/K8ws2zPz/download-5.gif[/img][/url][/CENTER]<br>",
   prefix: UNACCEPT_PREFIX,
   status: false,
},
{
   title: '| Нонрп ник❌️ |',
   content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
  "[FONT=georgia][SIZE=4][COLOR=aqua][I]{{ greeting }}, уважаемый {{ user.name }} [/I][/COLOR][/SIZE][/FONT]<br><br>"+
  "[SIZE=3][FONT=georgia][I]Ваша RolePlay - биография отказана.[/I][/FONT][/SIZE]<br>"+
  "[FONT=georgia][SIZE=3][COLOR=red][I] Причиной тому послужило nRP имя указанное в биографии. [/I][/COLOR]<br><br>"+
  "[I]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе[/I][/SIZE]<br><br>"+
  "[SIZE=4][I]Приятной игры на сервере [/I][COLOR=aqua][I]YAKUTSK[/I][/COLOR][/SIZE][/FONT]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/K8ws2zPz/download-5.gif[/img][/url][/CENTER]<br>",
   prefix: UNACCEPT_PREFIX,
   status: false,
},
{
   title: '| Ник англ❌️ |',
   content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
  "[FONT=georgia][SIZE=4][COLOR=aqua][I]{{ greeting }}, уважаемый {{ user.name }} [/I][/COLOR][/SIZE][/FONT]<br><br>"+
  "[SIZE=3][FONT=georgia][I]Ваша RolePlay - биография отказана.[/I][/FONT][/SIZE]<br>"+
  "[FONT=georgia][SIZE=3][COLOR=red][I] Причиной тому послужил ник, написанный на английском. [/I][/COLOR]<br><br>"+
  "[I]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе[/I][/SIZE]<br><br>"+
  "[SIZE=4][I]Приятной игры на сервере [/I][COLOR=aqua][I]YAKUTSK[/I][/COLOR][/SIZE][/FONT]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/K8ws2zPz/download-5.gif[/img][/url][/CENTER]<br>",
   prefix: UNACCEPT_PREFIX,
   status: false,
},
{
   title: '| Ники родных англ❌️ |',
   content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
  "[FONT=georgia][SIZE=4][COLOR=aqua][I]{{ greeting }}, уважаемый {{ user.name }} [/I][/COLOR][/SIZE][/FONT]<br><br>"+
  "[SIZE=3][FONT=georgia][I]Ваша RolePlay - биография отказана.[/I][/FONT][/SIZE]<br>"+
  "[FONT=georgia][SIZE=3][COLOR=red][I] Причиной тому послужили ники ваших родственников, написанные на английском. [/I][/COLOR]<br><br>"+
  "[I]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе[/I][/SIZE]<br><br>"+
  "[SIZE=4][I]Приятной игры на сервере [/I][COLOR=aqua][I]YAKUTSK[/I][/COLOR][/SIZE][/FONT]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/K8ws2zPz/download-5.gif[/img][/url][/CENTER]<br>",
   prefix: UNACCEPT_PREFIX,
   status: false,
},
{
   title: '| Семья не полностью.❌️|',
   content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
  "[FONT=georgia][SIZE=4][COLOR=aqua][I]{{ greeting }}, уважаемый {{ user.name }} [/I][/COLOR][/SIZE][/FONT]<br><br>"+
  "[SIZE=3][FONT=georgia][I]Ваша RolePlay - биография отказана.[/I][/FONT][/SIZE]<br>"+
  "[FONT=georgia][SIZE=3][COLOR=red][I] Причиной тому послужила семья, расписанная не полностью. [/I][/COLOR]<br><br>"+
  "[I]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе[/I][/SIZE]<br><br>"+
  "[SIZE=4][I]Приятной игры на сервере [/I][COLOR=aqua][I]YAKUTSK[/I][/COLOR][/SIZE][/FONT]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/K8ws2zPz/download-5.gif[/img][/url][/CENTER]<br>",
   prefix: UNACCEPT_PREFIX,
   status: false,
},
{
   title: '| Не совпадает возрост❌️ |',
   content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
  "[FONT=georgia][SIZE=4][COLOR=aqua][I]{{ greeting }}, уважаемый {{ user.name }} [/I][/COLOR][/SIZE][/FONT]<br><br>"+
  "[SIZE=3][FONT=georgia][I]Ваша RolePlay - биография отказана.[/I][/FONT][/SIZE]<br>"+
  "[FONT=georgia][SIZE=3][COLOR=red][I] Причиной тому послужила не совпадающая дата рождения с возрастом. [/I][/COLOR]<br><br>"+
  "[I]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе[/I][/SIZE]<br><br>"+
  "[SIZE=4][I]Приятной игры на сервере [/I][COLOR=aqua][I]YAKUTSK[/I][/COLOR][/SIZE][/FONT]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/K8ws2zPz/download-5.gif[/img][/url][/CENTER]<br>",
   prefix: UNACCEPT_PREFIX,
   status: false,
},
{
   title: '| Не логично❌️ |',
   content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
  "[FONT=georgia][SIZE=4][COLOR=aqua][I]{{ greeting }}, уважаемый {{ user.name }} [/I][/COLOR][/SIZE][/FONT]<br><br>"+
  "[SIZE=3][FONT=georgia][I]Ваша RolePlay - биография отказана.[/I][/FONT][/SIZE]<br>"+
  "[FONT=georgia][SIZE=3][COLOR=red][I] Причиной тому послужила нелогичность вашей биографии. [/I][/COLOR]<br><br>"+
  "[I]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе[/I][/SIZE]<br><br>"+
  "[SIZE=4][I]Приятной игры на сервере [/I][COLOR=aqua][I]YAKUTSK[/I][/COLOR][/SIZE][/FONT]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/K8ws2zPz/download-5.gif[/img][/url][/CENTER]<br>",
   prefix: UNACCEPT_PREFIX,
   status: false,
},
{
   title: '| Национальность❌️ |',
   content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
  "[FONT=georgia][SIZE=4][COLOR=aqua][I]{{ greeting }}, уважаемый {{ user.name }} [/I][/COLOR][/SIZE][/FONT]<br><br>"+
  "[SIZE=3][FONT=georgia][I]Ваша RolePlay - биография отказана.[/I][/FONT][/SIZE]<br>"+
  "[FONT=georgia][SIZE=3][COLOR=red][I] Причиной тому послужила ошибка в пункте 'Национальность'. Вы указали гражданство вместо национальности. [/I][/COLOR]<br><br>"+
  "[I]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе[/I][/SIZE]<br><br>"+
  "[SIZE=4][I]Приятной игры на сервере [/I][COLOR=aqua][I]YAKUTSK[/I][/COLOR][/SIZE][/FONT]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/K8ws2zPz/download-5.gif[/img][/url][/CENTER]<br>",
   prefix: UNACCEPT_PREFIX,
   status: false,
},
{
   title: '| Не грамотная❌️ |',
   content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
  "[FONT=georgia][SIZE=4][COLOR=aqua][I]{{ greeting }}, уважаемый {{ user.name }} [/I][/COLOR][/SIZE][/FONT]<br><br>"+
  "[SIZE=3][FONT=georgia][I]Ваша RolePlay - биография отказана.[/I][/FONT][/SIZE]<br>"+
  "[FONT=georgia][SIZE=3][COLOR=red][I] Причиной тому послужили многочисленные грамматические и пунктуационные ошибки в биографии. [/I][/COLOR]<br><br>"+
  "[I]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе[/I][/SIZE]<br><br>"+
  "[SIZE=4][I]Приятной игры на сервере [/I][COLOR=aqua][I]YAKUTSK[/I][/COLOR][/SIZE][/FONT]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/K8ws2zPz/download-5.gif[/img][/url][/CENTER]<br>",
   prefix: UNACCEPT_PREFIX,
   status: false,
},
{
   title: '| Религиозные/Националистические высказывания❌️ |',
   content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
  "[FONT=georgia][SIZE=4][COLOR=aqua][I]{{ greeting }}, уважаемый {{ user.name }} [/I][/COLOR][/SIZE][/FONT]<br><br>"+
  "[SIZE=3][FONT=georgia][I]Ваша RolePlay - биография отказана.[/I][/FONT][/SIZE]<br>"+
  "[FONT=georgia][SIZE=3][COLOR=red][I] Причиной тому послужило пропагандирование религиозных или националистических взглядов. [/I][/COLOR]<br><br>"+
  "[I]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе[/I][/SIZE]<br><br>"+
  "[SIZE=4][I]Приятной игры на сервере [/I][COLOR=aqua][I]YAKUTSK[/I][/COLOR][/SIZE][/FONT]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/K8ws2zPz/download-5.gif[/img][/url][/CENTER]<br>",
   prefix: UNACCEPT_PREFIX,
   status: false,
},
{
   title: '| Нет даты/места❌️ |',
   content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
  "[FONT=georgia][SIZE=4][COLOR=aqua][I]{{ greeting }}, уважаемый {{ user.name }} [/I][/COLOR][/SIZE][/FONT]<br><br>"+
  "[SIZE=3][FONT=georgia][I]Ваша RolePlay - биография отказана.[/I][/FONT][/SIZE]<br>"+
  "[FONT=georgia][SIZE=3][COLOR=red][I] Причиной тому послужило отсутствие даты или места рождения в вашей биографии. [/I][/COLOR]<br><br>"+
  "[I]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе[/I][/SIZE]<br><br>"+
  "[SIZE=4][I]Приятной игры на сервере [/I][COLOR=aqua][I]YAKUTSK[/I][/COLOR][/SIZE][/FONT]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/K8ws2zPz/download-5.gif[/img][/url][/CENTER]<br>",
   prefix: UNACCEPT_PREFIX,
   status: false,
},
{
   title: '| Дата не по форме❌️ |',
   content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
  "[FONT=georgia][SIZE=4][COLOR=aqua][I]{{ greeting }}, уважаемый {{ user.name }} [/I][/COLOR][/SIZE][/FONT]<br><br>"+
  "[SIZE=3][FONT=georgia][I]Ваша RolePlay - биография отказана.[/I][/FONT][/SIZE]<br>"+
  "[FONT=georgia][SIZE=3][COLOR=red][I] Причиной тому послужила не правильно написанная дата рождения. Напишите дату в формате ДД/ММ/ГГГГ. [/I][/COLOR]<br><br>"+
  "[I]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе[/I][/SIZE]<br><br>"+
  "[SIZE=4][I]Приятной игры на сервере [/I][COLOR=aqua][I]YAKUTSK[/I][/COLOR][/SIZE][/FONT]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/K8ws2zPz/download-5.gif[/img][/url][/CENTER]<br>",
   prefix: UNACCEPT_PREFIX,
   status: false,
},
    {
      title: '_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ RolePlay Ситуация _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _',
    },
{
   title: '| Одобрена✅️ |',
   content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
  "[FONT=georgia][SIZE=4][COLOR=aqua][I]{{ greeting }}, уважаемый {{ user.name }} [/I][/COLOR][/SIZE][/FONT]<br><br>"+
  "[SIZE=3][FONT=georgia][I]Ваша RolePlay - ситуация одобрена.[/I][/FONT][/SIZE]<br><br>"+
  "[SIZE=4][I]Приятной игры на сервере [/I][COLOR=aqua][I]YAKUTSK[/I][/COLOR][/SIZE][/FONT]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/T2Ny8YF0/image.gif[/img][/url][/CENTER]<br>",
   status: false,
},
{
   title: '| Отказана❌️ |',
   content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
  "[FONT=georgia][SIZE=4][COLOR=aqua][I]{{ greeting }}, уважаемый {{ user.name }} [/I][/COLOR][/SIZE][/FONT]<br><br>"+
  "[SIZE=3][FONT=georgia][I]Ваша RolePlay - ситуация отказана.[/I][/FONT][/SIZE]<br><br>"+
  "[I]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе[/I][/SIZE]<br><br>"+
  "[SIZE=4][I]Приятной игры на сервере [/I][COLOR=aqua][I]YAKUTSK[/I][/COLOR][/SIZE][/FONT]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/K8ws2zPz/download-5.gif[/img][/url][/CENTER]<br>",
   prefix: UNACCEPT_PREFIX,
   status: false,
},
{
   title: '| На доработке👀 |',
   content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
  "[FONT=georgia][SIZE=4][COLOR=aqua][I]{{ greeting }}, уважаемый {{ user.name }} [/I][/COLOR][/SIZE][/FONT]<br><br>"+
  "[SIZE=3][FONT=georgia][I]Ваша RolePlay - ситуация отказана.[/I][/FONT][/SIZE]<br>"+
  "[FONT=georgia][SIZE=3][COLOR=red][I]Вам дается 24 часа на дополнение вашей RP биографии.[/I][/COLOR]<br><br>"+
  "[I]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе[/I][/SIZE]<br><br>"+
  "[SIZE=4][I]Приятной игры на сервере [/I][COLOR=aqua][I]YAKUTSK[/I][/COLOR][/SIZE][/FONT]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/cHF0bN0G/download.gif[/img][/url][/CENTER]<br>",
          status: open,
},
{
   title: '| Ошибка разделом❌ |',
   content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
  "[FONT=georgia][SIZE=4][COLOR=aqua][I]{{ greeting }}, уважаемый {{ user.name }} [/I][/COLOR][/SIZE][/FONT]<br><br>"+
  "[SIZE=3][FONT=georgia][I]Ваша RolePlay - ситуация отказана.[/I][/FONT][/SIZE]<br>"+
  "[FONT=georgia][SIZE=3][COLOR=red][I] Вы ошиблись с разделом, вам не сюда. [/I][/COLOR]<br><br>"+
  "[I]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе[/I][/SIZE]<br><br>"+
  "[SIZE=4][I]Приятной игры на сервере [/I][COLOR=aqua][I]YAKUTSK[/I][/COLOR][/SIZE][/FONT]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/K8ws2zPz/download-5.gif[/img][/url][/CENTER]<br>",
   status: false,
},
{
   title: '| Не по форме❌️ |',
   content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
  "[FONT=georgia][SIZE=4][COLOR=aqua][I]{{ greeting }}, уважаемый {{ user.name }} [/I][/COLOR][/SIZE][/FONT]<br><br>"+
  "[SIZE=3][FONT=georgia][I]Ваша RolePlay - ситуация отказана.[/I][/FONT][/SIZE]<br>"+
  "[FONT=georgia][SIZE=3][COLOR=red][I] Причиной тому послужила неправильное оформление RP - ситуации(не по форме). [/I][/COLOR]<br><br>"+
  "[I]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе[/I][/SIZE]<br><br>"+
  "[SIZE=4][I]Приятной игры на сервере [/I][COLOR=aqua][I]YAKUTSK[/I][/COLOR][/SIZE][/FONT]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/K8ws2zPz/download-5.gif[/img][/url][/CENTER]<br>",
   prefix: UNACCEPT_PREFIX,
   status: false,
},
{
   title: '| Не дополнил❌️ |',
   content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
  "[FONT=georgia][SIZE=4][COLOR=aqua][I]{{ greeting }}, уважаемый {{ user.name }} [/I][/COLOR][/SIZE][/FONT]<br><br>"+
  "[SIZE=3][FONT=georgia][I]Ваша RolePlay - ситуация отказана.[/I][/FONT][/SIZE]<br>"+
  "[FONT=georgia][SIZE=3][COLOR=red][I] За 24 часа вы не дополнили свою RP ситуацию. [/I][/COLOR]<br><br>"+
  "[I]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе[/I][/SIZE]<br><br>"+
  "[SIZE=4][I]Приятной игры на сервере [/I][COLOR=aqua][I]YAKUTSK[/I][/COLOR][/SIZE][/FONT]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/K8ws2zPz/download-5.gif[/img][/url][/CENTER]<br>",
   status: false,
},
{
   title: '| Не грамотная❌️ |',
   content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
  "[FONT=georgia][SIZE=4][COLOR=aqua][I]{{ greeting }}, уважаемый {{ user.name }} [/I][/COLOR][/SIZE][/FONT]<br><br>"+
  "[SIZE=3][FONT=georgia][I]Ваша RolePlay - ситуация отказана.[/I][/FONT][/SIZE]<br>"+
  "[FONT=georgia][SIZE=3][COLOR=red][I] Причиной тому послужили многочисленные грамматические и пунктуационные ошибки в биографии. [/I][/COLOR]<br><br>"+
  "[I]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе[/I][/SIZE]<br><br>"+
  "[SIZE=4][I]Приятной игры на сервере [/I][COLOR=aqua][I]YAKUTSK[/I][/COLOR][/SIZE][/FONT]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/K8ws2zPz/download-5.gif[/img][/url][/CENTER]<br>",
   prefix: UNACCEPT_PREFIX,
   status: false,
},
{
   title: '| Националистические высказывания❌️ |',
   content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
  "[FONT=georgia][SIZE=4][COLOR=aqua][I]{{ greeting }}, уважаемый {{ user.name }} [/I][/COLOR][/SIZE][/FONT]<br><br>"+
  "[SIZE=3][FONT=georgia][I]Ваша RolePlay - ситуация отказана.[/I][/FONT][/SIZE]<br>"+
  "[FONT=georgia][SIZE=3][COLOR=red][I] Причиной тому послужило пропагандирование религиозных или националистических взглядов. [/I][/COLOR]<br><br>"+
  "[I]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе[/I][/SIZE]<br><br>"+
  "[SIZE=4][I]Приятной игры на сервере [/I][COLOR=aqua][I]YAKUTSK[/I][/COLOR][/SIZE][/FONT]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/K8ws2zPz/download-5.gif[/img][/url][/CENTER]<br>",
   status: false,
},
{
   title: '| Нету смысловой нагрузки❌️ |',
   content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
  "[FONT=georgia][SIZE=4][COLOR=aqua][I]{{ greeting }}, уважаемый {{ user.name }} [/I][/COLOR][/SIZE][/FONT]<br><br>"+
  "[SIZE=3][FONT=georgia][I]Ваша RolePlay - ситуация отказана.[/I][/FONT][/SIZE]<br>"+
  "[FONT=georgia][SIZE=3][COLOR=red][I] Причиной тому послужила RP ситуация не имеющие смысловой нагрузки. [/I][/COLOR]<br><br>"+
  "[I]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе[/I][/SIZE]<br><br>"+
  "[SIZE=4][I]Приятной игры на сервере [/I][COLOR=aqua][I]YAKUTSK[/I][/COLOR][/SIZE][/FONT]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/K8ws2zPz/download-5.gif[/img][/url][/CENTER]<br>",
   prefix: UNACCEPT_PREFIX,
   status: false,
},
{
   title: '| NonRP поведение❌️ |',
   content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
  "[FONT=georgia][SIZE=4][COLOR=aqua][I]{{ greeting }}, уважаемый {{ user.name }} [/I][/COLOR][/SIZE][/FONT]<br><br>"+
  "[SIZE=3][FONT=georgia][I]Ваша RolePlay - ситуация отказана.[/I][/FONT][/SIZE]<br>"+
  "[FONT=georgia][SIZE=3][COLOR=red][I] Причиной тому послужила nonRP поведение или PG. [/I][/COLOR]<br><br>"+
  "[I]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе[/I][/SIZE]<br><br>"+
  "[SIZE=4][I]Приятной игры на сервере [/I][COLOR=aqua][I]YAKUTSK[/I][/COLOR][/SIZE][/FONT]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/K8ws2zPz/download-5.gif[/img][/url][/CENTER]<br>",
   prefix: UNACCEPT_PREFIX,
   status: false,
},
   ];


  $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    // Добавление кнопок при загрузке страницы
    addButton('Шаблоны📑', 'selectAnswer');
    addButton('Одобрено✅', 'accepted');
    addButton('На рассмотрение🚸', 'pin');
    addButton('Отказано⛔', 'unaccept');

    // Поиск информации о теме
    const threadData = getThreadData();

    $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
    $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
    $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
    $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
    $('button#Texy').click(() => editThreadData(TEX_PREFIX, false));
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
        5 < hours && hours <= 11 ?
        'Доброе утро' :
        11 < hours && hours <= 17 ?
        'Добрый день' :
        17 < hours && hours <= 21 ?
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
})()