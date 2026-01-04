// ==UserScript==
// @name         [BR] Кураторы форума (Bio) | INDIGO💜
// @namespace    https://forum.blackrussia.online
// @version      2.1
// @description  Специально для Black Russia || INDIGO by Movsar_Shakh🖤 | Andrey_Mal
// @author       Кураторы форума
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @collaborator QuenkM
// @icon https://icons.iconarchive.com/icons/google/noto-emoji-people-bodyparts/256/11960-victory-hand-light-skin-tone-icon.png
// @downloadURL https://update.greasyfork.org/scripts/479025/%5BBR%5D%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%28Bio%29%20%7C%20INDIGO%F0%9F%92%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/479025/%5BBR%5D%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%28Bio%29%20%7C%20INDIGO%F0%9F%92%9C.meta.js
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
      title: '|(-(-(-(-(->RP Bio💜<-)-)-)-)-)-|',
    },
{
   title: '| Одобрена |',
   content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/img][/url]<br>' +
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender] Ваша RolePlay - биография одобрена.<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]INDIGO[/COLOR].<br><br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]<br>",
   prefix: ACCEPT_PREFIX,
   status: false,
},
{
   title: '| Отказана |',
   content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/img][/url]<br>' +
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender] Ваша RolePlay - биография отказана.<br><br>"+
                "[B][CENTER][COLOR=lavender]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]INDIGO[/COLOR].<br><br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/K8ws2zPz/download-5.gif[/img][/url]<br>",
   prefix: UNACCEPT_PREFIX,
   status: false,
},
{
   title: '| Заголовок не по форме |',
   content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/img][/url]<br>' +
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender] Ваша RolePlay - биография отказана.<br><br>"+
                "[B][CENTER][Spoiler][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Причиной тому послужило неправильное оформление заголовка.[/Spoiler]<br>"+
                "[B][CENTER][COLOR=lavender]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]INDIGO[/COLOR].<br><br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/K8ws2zPz/download-5.gif[/img][/url]<br>",
   prefix: UNACCEPT_PREFIX,
   status: false,
},
{
   title: '| Не по форме |',
   content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/img][/url]<br>' +
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender] Ваша RolePlay - биография отказана.<br><br>"+
                "[B][CENTER][Spoiler][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Причиной тому послужило неправильное оформление биографии(не по форме).[/Spoiler]<br>"+
                "[B][CENTER][COLOR=lavender]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]INDIGO[/COLOR].<br><br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/K8ws2zPz/download-5.gif[/img][/url]<br>",
   prefix: UNACCEPT_PREFIX,
   status: false,
},
{
   title: '| Не все пункты расписаны |',
   content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/img][/url]<br>' +
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender] Ваша RolePlay - биография отказана.<br><br>"+
                "[B][CENTER][Spoiler][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Причиной тому послужило отсутствие информации в некоторых пунктах вашей биографии.[/Spoiler]<br>"+
                "[B][CENTER][COLOR=lavender]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]INDIGO[/COLOR].<br><br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/K8ws2zPz/download-5.gif[/img][/url]<br>",
   prefix: UNACCEPT_PREFIX,
   status: false,
},
{
   title: '| Детство не расписано |',
   content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/img][/url]<br>' +
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender] Ваша RolePlay - биография отказана.<br><br>"+
                "[B][CENTER][Spoiler][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Причиной тому послужило не расписанное детство в вашей биографии.[/Spoiler]<br>"+
                "[B][CENTER][COLOR=lavender]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]INDIGO[/COLOR].<br><br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/K8ws2zPz/download-5.gif[/img][/url]<br>",
   prefix: UNACCEPT_PREFIX,
   status: false,
},
{
   title: '| Юность не расписана |',
   content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/img][/url]<br>' +
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender] Ваша RolePlay - биография отказана.<br><br>"+
                "[B][CENTER][Spoiler][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Причиной тому послужило не расписанная юность и взрослая жизнь в вашей биографии.[/Spoiler]<br>"+
                "[B][CENTER][COLOR=lavender]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]INDIGO[/COLOR].<br><br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/K8ws2zPz/download-5.gif[/img][/url]<br>",
   prefix: UNACCEPT_PREFIX,
   status: false,
},
{
   title: '| Не дополнил |',
   content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/img][/url]<br>' +
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender] Ваша RolePlay - биография отказана.<br><br>"+
                "[B][CENTER][Spoiler][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]За 24 часа вы не дополнили свою биографию.[/Spoiler]<br>"+
                "[B][CENTER][COLOR=lavender]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]INDIGO[/COLOR].<br><br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/K8ws2zPz/download-5.gif[/img][/url]<br>",
   prefix: UNACCEPT_PREFIX,
   status: false,
},
{
   title: '| От 3-его лица |',
   content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/img][/url]<br>' +
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Ваша RolePlay - биография отказана.<br><br>"+
                "[B][CENTER][Spoiler][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Причиной тому послужило написание биографии от 3-го лица.[/Spoiler]<br>"+
                "[B][CENTER][COLOR=lavender]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]INDIGO[/COLOR].<br><br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/K8ws2zPz/download-5.gif[/img][/url]<br>",
   prefix: UNACCEPT_PREFIX,
   status: false,
},
{
   title: '| Уже одобрена |',
   content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/img][/url]<br>' +
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender] Ваша RolePlay - биография отказана.<br><br>"+
                "[B][CENTER][Spoiler][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Причиной тому послужило наличие у вас одобренной биографии.[/Spoiler]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]INDIGO[/COLOR].<br><br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/K8ws2zPz/download-5.gif[/img][/url]<br>",
   prefix: UNACCEPT_PREFIX,
   status: false,
},
{
   title: '| Уже на доработке |',
   content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/img][/url]<br>' +
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/img][/url]<br>' +
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender] Ваша RolePlay - биография отказана.<br><br>"+
                "[B][CENTER][Spoiler][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]У вас уже есть биография на доработке.[/Spoiler]<br>"+
                "[B][CENTER][COLOR=lavender]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]INDIGO[/COLOR].<br><br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/K8ws2zPz/download-5.gif[/img][/url]<br>",
   prefix: UNACCEPT_PREFIX,
   status: false,
},
{
   title: '| Супергерой |',
   content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/img][/url]<br>' +
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender] Ваша RolePlay - биография отказана.<br><br>"+
                "[B][CENTER][Spoiler][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Причиной тому послужило приписывание своему персонажу супер-способностей.[/Spoiler]<br>"+
                "[B][CENTER][COLOR=lavender]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]INDIGO[/COLOR].<br><br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/K8ws2zPz/download-5.gif[/img][/url]<br>",
   prefix: UNACCEPT_PREFIX,
   status: false,
},
{
   title: '| Копипаст |',
   content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/img][/url]<br>' +
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender] Ваша RolePlay - биография отказана.<br><br>"+
                "[B][CENTER][Spoiler][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Причиной тому послужило полное или частичное копирование биографий из данного раздела или из разделов RP биографий других серверов.[/Spoiler]<br>"+
                "[B][CENTER][COLOR=lavender]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]INDIGO[/COLOR].<br><br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/K8ws2zPz/download-5.gif[/img][/url]<br>",
   prefix: UNACCEPT_PREFIX,
   status: false,
},
{
   title: '| Нонрп ник |',
   content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/img][/url]<br>' +
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender] Ваша RolePlay - биография отказана.<br><br>"+
                "[B][CENTER][Spoiler][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Причиной тому послужило nRP имя указанное в биографии.[/Spoiler]<br>"+
           "[B][CENTER][COLOR=lavender]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]INDIGO[/COLOR].<br><br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/K8ws2zPz/download-5.gif[/img][/url]<br>",
   prefix: UNACCEPT_PREFIX,
   status: false,
},
{
   title: '| Ник англ |',
   content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/img][/url]<br>' +
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender] Ваша RolePlay - биография отказана.<br><br>"+
                "[B][CENTER][Spoiler][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Причиной тому послужил ник, написанный на английском.[/Spoiler]<br>"+
                "[B][CENTER][COLOR=lavender]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]INDIGO[/COLOR].<br><br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/K8ws2zPz/download-5.gif[/img][/url]<br>",
   prefix: UNACCEPT_PREFIX,
   status: false,
},
{
   title: '| Ники родных англ |',
   content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/img][/url]<br>' +
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender] Ваша RolePlay - биография отказана.<br><br>"+
                "[B][CENTER][Spoiler][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Причиной тому послужили ники ваших родственников, написанные на английском. Все ники в биографии должны быть написаны на русском, в формате Имя Фамилия.[/Spoiler]<br>"+
                "[B][CENTER][COLOR=lavender]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]INDIGO[/COLOR].<br><br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/K8ws2zPz/download-5.gif[/img][/url]<br>",
   prefix: UNACCEPT_PREFIX,
   status: false,
},
{
   title: '| Aнгл ник в теме |',
   content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/img][/url]<br>' +
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender] Ваша RolePlay - биография отказана.<br><br>"+
                "[B][CENTER][Spoiler][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Причиной тому послужил NickName в заголовке, написанный на английском.[/Spoiler]<br>"+
                "[B][CENTER][COLOR=lavender]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]INDIGO[/COLOR].<br><br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/K8ws2zPz/download-5.gif[/img][/url]<br>",
   prefix: UNACCEPT_PREFIX,
   status: false,
},
{
   title: '| Семья не полнос. |',
   content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/img][/url]<br>' +
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender] Ваша RolePlay - биография отказана.<br><br>"+
                "[B][CENTER][Spoiler][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Причиной тому послужила семья, расписанная не полностью.[/Spoiler]<br>"+
                "[B][CENTER][COLOR=lavender]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]INDIGO[/COLOR].<br><br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/K8ws2zPz/download-5.gif[/img][/url]<br>",
   prefix: UNACCEPT_PREFIX,
   status: false,
},
{
   title: '| Дата рождения с годом |',
   content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/img][/url]<br>' +
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender] Ваша RolePlay - биография отказана.<br><br>"+
                "[B][CENTER][Spoiler][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Причиной тому послужила не совпадающая дата рождения с возрастом.[/Spoiler]<br>"+
                "[B][CENTER][COLOR=lavender]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]INDIGO[/COLOR].<br><br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/K8ws2zPz/download-5.gif[/img][/url]<br>",
   prefix: UNACCEPT_PREFIX,
   status: false,
},
{
   title: '| Семья не полнос. |',
   content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/img][/url]<br>' +
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender] Ваша RolePlay - биография отказана.<br><br>"+
                "[B][CENTER][Spoiler][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Причиной тому послужила семья, расписанная не полностью.[/Spoiler]<br>"+
                "[B][CENTER][COLOR=lavender]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]INDIGO[/COLOR].<br><br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/K8ws2zPz/download-5.gif[/img][/url]<br>",
   prefix: UNACCEPT_PREFIX,
   status: false,
},
{
   title: '| Родственники не указаны |',
   content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/img][/url]<br>' +
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender] Ваша RolePlay - биография отказана.<br><br>"+
                "[B][CENTER][Spoiler][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Причиной тому послужили жена или другие родственники, не указанные в пункте Семья.[/Spoiler]<br>"+
                "[B][CENTER][COLOR=lavender]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]INDIGO[/COLOR].<br><br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/K8ws2zPz/download-5.gif[/img][/url]<br>",
   prefix: UNACCEPT_PREFIX,
   status: false,
},
{
   title: '| Дата рождения не полнос. |',
   content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/img][/url]<br>' +
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender] Ваша RolePlay - биография отказана.<br><br>"+
                "[B][CENTER][Spoiler][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Причиной тому послужила дата рождения, расписанная не полностью.[/Spoiler]<br>"+
                "[B][CENTER][COLOR=lavender]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]INDIGO[/COLOR].<br><br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/K8ws2zPz/download-5.gif[/img][/url]<br>",
   prefix: UNACCEPT_PREFIX,
   status: false,
},
{
   title: '| Нелогичность |',
   content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/img][/url]<br>' +
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender] Ваша RolePlay - биография отказана.<br><br>"+
                "[B][CENTER][Spoiler][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Причиной тому послужила нелогичность вашей биографии.[/Spoiler]<br>"+
                "[B][CENTER][COLOR=lavender]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]INDIGO[/COLOR].<br><br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/K8ws2zPz/download-5.gif[/img][/url]<br>",
   prefix: UNACCEPT_PREFIX,
   status: false,
},
{
   title: '| Национальность |',
   content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/img][/url]<br>' +
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender] Ваша RolePlay - биография отказана.<br><br>"+
                "[B][CENTER][Spoiler][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Причиной тому послужила ошибка в пункте 'Национальность'. Вы указали гражданство вместо национальности.[/Spoiler]<br>"+
                "[B][CENTER][COLOR=lavender]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]INDIGO[/COLOR].<br><br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/K8ws2zPz/download-5.gif[/img][/url]<br>",
   prefix: UNACCEPT_PREFIX,
   status: false,
},
{
   title: '| Нелогичность(Детство) |',
   content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/img][/url]<br>' +
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender] Ваша RolePlay - биография отказана.<br><br>"+
                "[B][CENTER][Spoiler][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Причиной тому послужила нелогичность вашей биографии. Вы не можете в точности помнить то, что происходило в вашем глубоком детстве.[/Spoiler]<br>"+
                "[B][CENTER][COLOR=lavender]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]INDIGO[/COLOR].<br><br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/K8ws2zPz/download-5.gif[/img][/url]<br>",
   prefix: UNACCEPT_PREFIX,
   status: false,
},
{
   title: '| Неграмотная |',
   content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/img][/url]<br>' +
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender] Ваша RolePlay - биография отказана.<br><br>"+
                "[B][CENTER][Spoiler][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Причиной тому послужили многочисленные грамматические и пунктуационные ошибки в биографии.[/Spoiler]<br>"+
                "[B][CENTER][COLOR=lavender]Внимательно прочитайте правила создания RP - ситуаций, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]INDIGO[/COLOR].<br><br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/K8ws2zPz/download-5.gif[/img][/url]<br>",
   prefix: UNACCEPT_PREFIX,
   status: false,
},
{
   title: '| Националистические высказывания |',
   content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/img][/url]<br>' +
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender] Ваша RolePlay - биография отказана.<br><br>"+
                "[B][CENTER][Spoiler][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Причиной тому послужило пропагандирование религиозных или националистических взглядов.[/Spoiler]<br>"+
                "[B][CENTER][COLOR=lavender]Внимательно прочитайте правила создания RP - ситуаций, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]INDIGO[/COLOR].<br><br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/K8ws2zPz/download-5.gif[/img][/url]<br>",
   prefix: UNACCEPT_PREFIX,
   status: false,
},
{
   title: '| Юность c 13 |',
   content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/img][/url]<br>' +
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender] Ваша RolePlay - биография отказана.<br><br>"+
                "[B][CENTER][Spoiler][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Причиной тому послужила нелогичность вашей биографии. Юность начинается с 13 лет.[/Spoiler]<br>"+
                "[B][CENTER][COLOR=lavender]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]INDIGO[/COLOR].<br><br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/K8ws2zPz/download-5.gif[/img][/url]<br>",
   prefix: UNACCEPT_PREFIX,
   status: false,
},
{
   title: '| Детство до 13 |',
   content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/img][/url]<br>' +
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender] Ваша RolePlay - биография отказана.<br><br>"+
                "[B][CENTER][Spoiler][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Причиной тому послужила нелогичность вашей биографии. детство проходит до 13 лет.[/Spoiler]<br>"+
                "[B][CENTER][COLOR=lavender]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]INDIGO[/COLOR].<br><br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/K8ws2zPz/download-5.gif[/img][/url]<br>",
   prefix: UNACCEPT_PREFIX,
   status: false,
},
{
   title: '| Нет даты/места |',
   content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/img][/url]<br>' +
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender] Ваша RolePlay - биография отказана.<br><br>"+
                "[B][CENTER][Spoiler][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Причиной тому послужило отсутствие даты или места рождения в вашей биографии.[/Spoiler]<br>"+
                "[B][CENTER][COLOR=lavender]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]INDIGO[/COLOR].<br><br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/K8ws2zPz/download-5.gif[/img][/url]<br>",
   prefix: UNACCEPT_PREFIX,
   status: false,
},
{
   title: '| Дата не по форме |',
   content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/img][/url]<br>' +
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender] Ваша RolePlay - биография отказана.<br><br>"+
                "[B][CENTER][Spoiler][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Причиной тому послужила не правильно написанная дата рождения. Напишите дату в формате ДД/ММ/ГГГГ.[/Spoiler]<br>"+
                "[B][CENTER][COLOR=lavender]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]INDIGO[/COLOR].<br><br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/K8ws2zPz/download-5.gif[/img][/url]<br>",
   prefix: UNACCEPT_PREFIX,
   status: false,
},
{
   title: '| На доработке |',
   content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/img][/url]<br>' +
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender] В вашей RolePlay биографии недостаточно информации.<br><br>"+
                "[B][CENTER][Spoiler][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Вам дается 24 часа на дополнение вашей RP биографии.[/Spoiler]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]INDIGO[/COLOR].<br><br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/cHF0bN0G/download.gif[/img][/url]<br>",
   prefix: PIN_PREFIX,
          status: open,
},
{
   title: '| ОГЭ на оценку |',
   content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/img][/url]<br>' +
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender] Ваша RolePlay - биография отказана.<br><br>"+
                "[B][CENTER][Spoiler][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Причиной тому послужила ОГЭ не сдаёться на балл.[/Spoiler]<br>"+
                "[B][CENTER][COLOR=lavender]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]INDIGO[/COLOR].<br><br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/K8ws2zPz/download-5.gif[/img][/url]<br>",
   prefix: UNACCEPT_PREFIX,
   status: false,
},
{
   title: '| Одежда в описании внешн |',
   content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/img][/url]<br>' +
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender] Ваша RolePlay - биография отказана.<br><br>"+
                "[B][CENTER][Spoiler][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Причиной тому послужила в описании внешности присутствует одежда.[/Spoiler]<br>"+
                "[B][CENTER][COLOR=lavender]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]INDIGO[/COLOR].<br><br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/K8ws2zPz/download-5.gif[/img][/url]<br>",
   prefix: UNACCEPT_PREFIX,
   status: false,
},
   ];


  $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    // Добавление кнопок при загрузке страницы
    addButton('Ответы📑', 'selectAnswer');
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