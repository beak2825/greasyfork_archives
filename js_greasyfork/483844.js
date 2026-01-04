// ==UserScript==
// @name         [BR] | Кураторы Форума (Bio) INDIGO
// @namespace    https://forum.blackrussia.online
// @version      1.5.6.
// @description  Специально для кураторов форума за биографиями INDIGO. При копировании скрипта обязательно указывать авторов!!!
// @author       Vova_Rublevskeu / Movsar_Shakh.
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license 	 MIT
// @collaborator Quenk269
// @icon https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @downloadURL https://update.greasyfork.org/scripts/483844/%5BBR%5D%20%7C%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%28Bio%29%20INDIGO.user.js
// @updateURL https://update.greasyfork.org/scripts/483844/%5BBR%5D%20%7C%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%28Bio%29%20INDIGO.meta.js
// ==/UserScript==

(function () {
  'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const TEX_PREFIX = 13;
const CLOSE_PREFIX = 7;
const buttons = [
{
	  title: '|(-(-(-(-(-> Раздел RolePlay биографии <-)-)-)-)-)-|'
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
                "[B][CENTER][Spoiler][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Причиной тому послужили жена или родственники, не указанные в пункте Семья.[/Spoiler]<br>"+
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
          status: false,
},
{
	  title: '|(-(-(-(-(-> Раздел RolePlay ситуации <-)-)-)-)-)-|'
},
{
	  title: '| Одобрена |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay - ситуация одобрена.<br><br>"+

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
		"[B][CENTER][COLOR=lavender] Ваша RolePlay - ситуация отказана.<br><br>"+
                "[B][CENTER][COLOR=lavender]Внимательно прочитайте правила создания RP - ситуаций, закрепленные в данном разделе.<br>"+

                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]INDIGO[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/K8ws2zPz/download-5.gif[/img][/url]<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Не туда |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay - ситуация отказана, так как вы не туда попали.<br><br>"+

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
		"[B][CENTER][COLOR=lavender] Ваша RolePlay - ситуация отказана.<br><br>"+
                "[B][CENTER][Spoiler][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Причиной тому послужило неправильное составление ситуации(не по форме).[/Spoiler]<br>"+
                "[B][CENTER][COLOR=lavender]Внимательно прочитайте правила создания RP - ситуаций, закрепленные в данном разделе.<br>"+

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
		"[B][CENTER][COLOR=lavender] Ваша RolePlay - ситуация отказана.<br><br>"+
                "[B][CENTER][Spoiler][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Причиной тому послужил неправильно составленный заголовок RP ситуации.[/Spoiler]<br>"+
                "[B][CENTER][COLOR=lavender]Внимательно прочитайте правила создания RP - ситуаций, закрепленные в данном разделе.<br>"+

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
		"[B][CENTER][COLOR=lavender] Ваша RolePlay - ситуация отказана.<br><br>"+
                "[B][CENTER][Spoiler][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Причиной тому послужили ники, написанные на английском. Все никнеймы должны быть написаны на русском языке.[/Spoiler]<br>"+
                "[B][CENTER][COLOR=lavender]Внимательно прочитайте правила создания RP - ситуаций, закрепленные в данном разделе.<br>"+

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
		"[B][CENTER][COLOR=lavender] Ваша RolePlay - ситуация отказана.<br><br>"+
                "[B][CENTER][Spoiler][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Причиной тому послужили многочисленные грамматические и пунктуационные ошибки в оформленной ситуации.[/Spoiler]<br>"+
                "[B][CENTER][COLOR=lavender]Внимательно прочитайте правила создания RP - ситуаций, закрепленные в данном разделе.<br>"+

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
		"[B][CENTER][COLOR=lavender] Ваша RolePlay - ситуация отказана.<br><br>"+
                "[B][CENTER][Spoiler][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Причиной тому послужило полное или частичное копирование ситуаций из данного раздела или из разделов RP ситуаций других серверов.[/Spoiler]<br>"+
                "[B][CENTER][COLOR=lavender]Внимательно прочитайте правила создания RP - ситуаций, закрепленные в данном разделе.<br>"+

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
		"[B][CENTER][COLOR=lavender] Ваша RolePlay - ситуация отказана.<br><br>"+
                "[B][CENTER][Spoiler][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]За 24 часа вы не дополнили свою ситуацию.[/Spoiler]<br>"+
                "[B][CENTER][COLOR=lavender]Внимательно прочитайте правила создания RP - ситуаций, закрепленные в данном разделе.<br>"+

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
		"[B][CENTER][COLOR=lavender] В вашей RolePlay - ситуации недостаточно информации.<br><br>"+
                "[B][CENTER][Spoiler][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Вам дается 24 часа на дополнение вашей RP ситуации .[/Spoiler]<br>"+
                "[B][CENTER][COLOR=lavender]Внимательно прочитайте правила создания RP - ситуаций, закрепленные в данном разделе.<br>"+

                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]INDIGO[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/cHF0bN0G/download.gif[/img][/url]<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '|(-(-(-(-(-> Раздел RolePlay организации <-)-)-)-)-)-|'
},
{
	  title: '| Одобрена |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay - организация одобрена.<br><br>"+

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
		"[B][CENTER][COLOR=lavender] Ваша RolePlay - организация отказана.<br><br>"+
                "[B][CENTER][COLOR=lavender]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br>"+

                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]INDIGO[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/K8ws2zPz/download-5.gif[/img][/url]<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Не туда |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay - организация отказана, так как вы не туда попали.<br><br>"+

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
		"[B][CENTER][COLOR=lavender] Ваша RolePlay - организация отказана.<br><br>"+
                "[B][CENTER][Spoiler][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Причиной тому послужило неправильное составление организации(не по форме).[/Spoiler]<br>"+
                "[B][CENTER][COLOR=lavender]Внимательно прочитайте правила создания RP - организаций закрепленные в данном разделе.<br>"+

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
		"[B][CENTER][COLOR=lavender] Ваша RolePlay - организация отказана.<br><br>"+
                "[B][CENTER][Spoiler][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Причиной тому послужил неправильно составленный заголовок организации.[/Spoiler]<br>"+
                "[B][CENTER][COLOR=lavender]Внимательно прочитайте правила создания RP - организаций закрепленные в данном разделе.<br>"+

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
		"[B][CENTER][COLOR=lavender] Ваша RolePlay - организация отказана.<br><br>"+
                "[B][CENTER][Spoiler][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Причиной тому послужили ники, написанные на английском. Все никнеймы должны быть написаны на русском языке.[/Spoiler]<br>"+
                "[B][CENTER][COLOR=lavender]Внимательно прочитайте правила создания RP - организаций закрепленные в данном разделе.<br>"+

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
		"[B][CENTER][COLOR=lavender] Ваша RolePlay - организация отказана.<br><br>"+
                "[B][CENTER][Spoiler][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Причиной тому послужили многочисленные грамматические и пунктуационные ошибки в оформленной организации.[/Spoiler]<br>"+
                "[B][CENTER][COLOR=lavender]Внимательно прочитайте правила создания RP - организаций закрепленные в данном разделе.<br>"+

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
		"[B][CENTER][COLOR=lavender] Ваша RolePlay - организация отказана.<br><br>"+
                "[B][CENTER][Spoiler][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Причиной тому послужило полное или частичное копирование организаций из данного раздела или из разделов RP организаций других серверов.[/Spoiler]<br>"+
                "[B][CENTER][COLOR=lavender]Внимательно прочитайте правила создания RP - организаций закрепленные в данном разделе.<br>"+

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
		"[B][CENTER][COLOR=lavender] Ваша RolePlay - организация отказана.<br><br>"+
                "[B][CENTER][Spoiler][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]За 24 часа вы не дополнили свою организацию.[/Spoiler]<br>"+
                "[B][CENTER][COLOR=lavender]Внимательно прочитайте правила создания RP - организаций, закрепленные в данном разделе.<br>"+

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
		"[B][CENTER][COLOR=lavender]В вашей RolePlay - организации недостаточно информации.<br><br>"+
                "[B][CENTER][Spoiler][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Вам дается 24 часа на дополнение вашей RP организации.[/Spoiler]<br>"+

                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]INDIGO[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/cHF0bN0G/download.gif[/img][/url]<br>",
	  prefix: PIN_PREFIX,
          status: false,
},
];

$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
	addButton('Меню', 'selectAnswer');
	addButton('Одобрить✅', 'ACCEPT_PREFIX');
	addButton('Отказать⛔', 'UNACCEPT_PREFIX');
        addButton('Закрыто⛔', 'CLOSE_PREFIX');
        addButton('На рассмотрение💫', 'PIN_PREFIX');


	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));

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
  `<button type="button" class="button rippleButton" id="${id}" style="margin: 3px;">${name}</button>`
);
}

function buttonsMarkup(buttons) {
return `<div class="select_answer">${buttons
  .map(
	(btn, i) =>
	  `<button id="answers-${i}" class="button--primary button ` +
	  `rippleButton" style="margin:5px"><span class="button-text">${btn.title}</span></button>`
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