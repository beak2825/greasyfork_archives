// ==UserScript==
// @name         Скрипт для КФ/ЗГСФ/ГСФ || Astrakhan
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Скрипт для КФ/ЗГСФ/ГСФ
// @author       Miny_Leted
// @match https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @icon         https://i.postimg.cc/13kkNtx3/12.jpg
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/497890/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4%D0%97%D0%93%D0%A1%D0%A4%D0%93%D0%A1%D0%A4%20%7C%7C%20Astrakhan.user.js
// @updateURL https://update.greasyfork.org/scripts/497890/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4%D0%97%D0%93%D0%A1%D0%A4%D0%93%D0%A1%D0%A4%20%7C%7C%20Astrakhan.meta.js
// ==/UserScript==
(function () {
  'use strict';
const UNACCСEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCСEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem
const PINN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const SPECY_PREFIX = 11;
const TEXY_PREFIX = 13;
const OJIDANIE_PREFIX = 14;
const OTKAZBIO_PREFIX = 4;
const ODOBRENOBIO_PREFIX = 8;
const NARASSMOTRENIIBIO_PREFIX = 2;
const REALIZOVANO_PREFIX = 5;
const VAJNO_PREFIX = 1;
const PREFIKS = 0;
const KACHESTVO = 15;
const RASSMOTRENO_PREFIX = 9;
const OTKAZRP_PREFIX = 4;
const ODOBRENORP_PREFIX = 8;
const NARASSMOTRENIIRP_PREFIX = 2;
const OTKAZORG_PREFIX = 4;
const ODOBRENOORG_PREFIX = 8;
const NARASSMOTRENIIORG_PREFIX = 2;
const buttons = [
	{
title: ' >╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Для ЗГСФ и ГСФ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴<-)-)-)-|'
},
{    

	  title: '| Одобрено |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/X7NHmW8Y/image.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан. <br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=blue]RUSSIA[/COLOR] [COLOR=RED]ASTRAKHAN[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/QCcBL2G0/image.gif [/img][/url]<br>",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{   
title: '| Нету в системе логирования |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/X7NHmW8Y/image.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как в данный момент мы не можем выдать наказание по данному пункту правил через жалобу, оставленную на форуме. <br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=blue]RUSSIA[/COLOR] [COLOR=RED]ASTRAKHAN[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
                 	  title: ' >╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Передача на рассмотрение╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴<-)-)-)-|'
},
{
	  title: '| На рассмотрение |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/X7NHmW8Y/image.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба взята на [COLOR=#ffff00]рассмотрение[/COLOR]. Пожалуйста, ожидайте ответа.<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=blue]RUSSIA[/COLOR] [COLOR=RED]ASTRAKHAN[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/bvzbc50C/download-4.gif[/img][/url]<br>",
        prefix: PINN_PREFIX,
	  status: true,
},
{
	  title: '| Тех. спецу |',
	  content:
		'[CENTER]	[url=https://postimages.org/][img]https://i.postimg.cc/X7NHmW8Y/image.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба передана на [COLOR=#ffff00]рассмотрение[/COLOR] [COLOR=#0000ff]Техническому специалисту сервера[/COLOR], пожалуйста, ожидайте ответа.<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=blue]RUSSIA[/COLOR] [COLOR=RED]ASTRAKHAN[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/jjvjcDcq/download-6.gif[/img][/url]<br>",
        prefix: TEXY_PREFIX,
	  status: true,
},
{
	  title: '|(-(-(--(->╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴В другой раздел╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴<-)--)-)-)-|'
},
{
	  title: '| В жб на адм |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/X7NHmW8Y/image.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как вы ошиблись разделом. Обратитесь в раздел «Жалобы на администрацию». <br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=blue]RUSSIA[/COLOR] [COLOR=RED]ASTRAKHAN[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| В жб на лд |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/X7NHmW8Y/image.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как вы ошиблись разделом. Обратитесь в раздел «Жалобы на лидеров». <br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=blue]RUSSIA[/COLOR] [COLOR=RED]ASTRAKHAN[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
title: '| В жб на Сотрудников Госс Орг.|',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/X7NHmW8Y/image.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как вы ошиблись разделом. Обратитесь в раздел «Жалобы на Сотрудников Госс Организаций». <br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=blue]RUSSIA[/COLOR] [COLOR=RED]ASTRAKHAN[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| В обжалования |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/X7NHmW8Y/image.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как вы ошиблись разделом. Обратитесь в раздел «Обжалование наказаний». <br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=blue]RUSSIA[/COLOR] [COLOR=RED]ASTRAKHAN[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| В тех раздел |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/X7NHmW8Y/image.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как вы ошиблись разделом. Обратитесь в технический раздел. <br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=blue]RUSSIA[/COLOR] [COLOR=RED]ASTRAKHAN[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| В жб на теха |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/X7NHmW8Y/image.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как вы ошиблись разделом. Обратитесь в раздел «Жалобы на технических специалистов». <br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=blue]RUSSIA[/COLOR] [COLOR=RED]ASTRAKHAN[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '|(-(-(-(-(->╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Отказ жалобы╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴<-)-)-)-)-)-|'
},
{
	  title: '| Нарушений не найдено |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/X7NHmW8Y/image.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как нарушений со стороны данного игрока не было найдено. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=blue]RUSSIA[/COLOR] [COLOR=RED]ASTRAKHAN[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Возврат средств |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/X7NHmW8Y/image.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как администрация сервера не несёт ответственности за утраченные Вами средства при обмане и т.д. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, которые закреплены в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=blue]RUSSIA[/COLOR] [COLOR=RED]ASTRAKHAN[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Недостаточно док-в |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/X7NHmW8Y/image.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательств на нарушение от данного игрока  недостаточно. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=blue]RUSSIA[/COLOR] [COLOR=RED]ASTRAKHAN[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
title: '| Док-ва не работают|',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/X7NHmW8Y/image.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательства на нарушение от данного игрока не работают. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=blue]RUSSIA[/COLOR] [COLOR=RED]ASTRAKHAN[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Отсутствуют док-ва |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/X7NHmW8Y/image.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательства на нарушение от данного игрока  отсутствуют. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=blue]RUSSIA[/COLOR] [COLOR=RED]ASTRAKHAN[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Док-ва отредактированы |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/X7NHmW8Y/image.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательства на нарушение от данного игрока  отредактированы. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=blue]RUSSIA[/COLOR] [COLOR=RED]ASTRAKHAN[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
title: '| Док-ва плохого качества |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/X7NHmW8Y/image.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как ваши доказательства плохого качества. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=blue]RUSSIA[/COLOR] [COLOR=RED]ASTRAKHAN[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
title: '| Ник нарушаемого не совпадает с док-вами |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/X7NHmW8Y/image.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как ник нарушаемого не совпадает с доказательствами. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=blue]RUSSIA[/COLOR] [COLOR=RED]ASTRAKHAN[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
title: '| Дублирование темы |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/X7NHmW8Y/image.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Если вы и дальше будете заниматься данной деятельностью (дублированием тем), то ваш форумный аккаунт будет заблокирован на 3 дня и более. <br><br>"+
                "[B][CENTER] [COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=blue]RUSSIA[/COLOR] [COLOR=RED]ASTRAKHAN[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{

title: '| Нужно 15 секунд до дма |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/X7NHmW8Y/image.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как требуется 15 секунд фрапса, до начала дма. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=blue]RUSSIA[/COLOR] [COLOR=RED]ASTRAKHAN[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{

title: '| Данный вид сделки, не является нонрп обманом |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/X7NHmW8Y/image.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как данный вид сделки, не является нонрп обманом. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=blue]RUSSIA[/COLOR] [COLOR=RED]ASTRAKHAN[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{

	  title: '| Слив семьи |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/X7NHmW8Y/image.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как слив семьи никак не относится к правилам проекта, то есть если Лидер семьи дал игроку роль заместителя, то только он за это и отвечает, Администрация сервера не несет за это ответственность. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=blue]RUSSIA[/COLOR] [COLOR=RED]ASTRAKHAN[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Не по форме |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/X7NHmW8Y/image.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как она составлена не по форме. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=blue]RUSSIA[/COLOR] [COLOR=RED]ASTRAKHAN[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Заголовок не по форме |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/X7NHmW8Y/image.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как заголовок составлен не по форме. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=blue]RUSSIA[/COLOR] [COLOR=RED]ASTRAKHAN[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Нет /time |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/X7NHmW8Y/image.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как на доказательствах отсутствует /time.  <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=blue]RUSSIA[/COLOR] [COLOR=RED]ASTRAKHAN[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Нет time кодов|',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/X7NHmW8Y/image.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как отсутствуют time коды. Если видео длится более 3-ех минут - Вы должны указать time коды нарушений. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=blue]RUSSIA[/COLOR] [COLOR=RED]ASTRAKHAN[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
title: '|Time коды не по форме|',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/X7NHmW8Y/image.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как time коды составлены не по форме. <br><br>"+
                "[B][CENTER] Пример правильных time кодов: <br>"+
                "[B][CENTER] 00:15-00:20 - Условия сделки. <br>"+
                "[B][CENTER] 00:35-00:50 - Процесс сделки. <br>"+
                "[B][CENTER] 01:00-3:00 - Игрок нарушает условия сделки. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=blue]RUSSIA[/COLOR] [COLOR=RED]ASTRAKHAN[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Более 72-х часов |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/X7NHmW8Y/image.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как с момента совершенного нарушения со стороны игрока прошло более 72 часов. Срок написания жалобы составляет три дня (72 часа) с момента совершенного нарушения со стороны игрока сервера.<br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=blue]RUSSIA[/COLOR] [COLOR=RED]ASTRAKHAN[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Док-ва соц сеть |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/X7NHmW8Y/image.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательства загружены в соц. сетях. Загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur). <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=blue]RUSSIA[/COLOR] [COLOR=RED]ASTRAKHAN[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Условия сделки |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/X7NHmW8Y/image.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как в Ваших доказательствах отсутствуют условия сделки. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=blue]RUSSIA[/COLOR] [COLOR=RED]ASTRAKHAN[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Нужен фрапс |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/X7NHmW8Y/image.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательств недостаточно. В данной ситуации необходим фрапс(запись экрана). <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=blue]RUSSIA[/COLOR] [COLOR=RED]ASTRAKHAN[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
    	  title: '| Промотка чата |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/X7NHmW8Y/image.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как нужен фрапс + промотка чата. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=blue]RUSSIA[/COLOR] [COLOR=RED]ASTRAKHAN[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Фрапс обрывается |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/X7NHmW8Y/image.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как видео-доказательство обрывается. Загрузите полную видеозапись на видео-хостинг YouTube. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=blue]RUSSIA[/COLOR] [COLOR=RED]ASTRAKHAN[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Док-ва не открываются |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/X7NHmW8Y/image.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как ваши доказательства не открываются. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=blue]RUSSIA[/COLOR] [COLOR=RED]ASTRAKHAN[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Жалоба от 3-го лицо |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/X7NHmW8Y/image.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как Ваша жалоба написана от 3-го лица. Жалоба от третьего лица не принимается (жалоба должна быть подана участником ситуации). <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=blue]RUSSIA[/COLOR] [COLOR=RED]ASTRAKHAN[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Ошиблись сервером|',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/X7NHmW8Y/image.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как вы ошиблись сервером. <br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=blue]RUSSIA[/COLOR] [COLOR=RED]ASTRAKHAN[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
title: '| Долг не через банк|',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/X7NHmW8Y/image.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как займ может быть осуществлен только через зачисление игровых ценностей на банковский счет. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=blue]RUSSIA[/COLOR] [COLOR=RED]ASTRAKHAN[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
title: '| 10 дней после срока долга|',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/X7NHmW8Y/image.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как прошло 10 дней, с момента срока возврата долга <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=blue]RUSSIA[/COLOR] [COLOR=RED]ASTRAKHAN[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '|(-(-(-(-(->╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴RolePlay Биографии╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴<-)-)-)-)-)-|'
},
{
        	  title: '| Био одобрена |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/X7NHmW8Y/image.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша Биография получает статус - [COLOR=#00FF00]Одобрено[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=blue]RUSSIA[/COLOR] [COLOR=RED]ASTRAKHAN[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/QCcBL2G0/image.gif[/img][/url]<br>'" ,
    prefix: ACCСEPT_PREFIX,
	  status: false,
},
  {
    	  title: '| Био отказ (Форма) |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/X7NHmW8Y/image.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]. Причина отказа: нарушение Правила написания RP биографии <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=blue]RUSSIA[/COLOR] [COLOR=RED]ASTRAKHAN[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
      		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
          	  title: '| Био отказ (Мало инфы) |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/X7NHmW8Y/image.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]. Причина отказа: Недостаточно количество RolePlay информации о вашем персонаже. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=blue]RUSSIA[/COLOR] [COLOR=RED]ASTRAKHAN[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
      		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Скопирована) |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/X7NHmW8Y/image.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]. Причина отказа: Биография скопирована <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=blue]RUSSIA[/COLOR] [COLOR=RED]ASTRAKHAN[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
      		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Заголовок) |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/X7NHmW8Y/image.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]. Причина отказа: Неправильное написание заголовка биографии. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=blue]RUSSIA[/COLOR] [COLOR=RED]ASTRAKHAN[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
      		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (1-ое лицо) |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/X7NHmW8Y/image.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]. Причина отказа: Написание Биографии от 1-го лица. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=blue]RUSSIA[/COLOR] [COLOR=RED]ASTRAKHAN[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
      		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Возраст не совпал) |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/X7NHmW8Y/image.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]. Причина отказа: Возраст не совпадает с датой рождения. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=blue]RUSSIA[/COLOR] [COLOR=RED]ASTRAKHAN[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
      		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Возраст мал) |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/X7NHmW8Y/image.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]. Причина отказа: Возраст слишком мал. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=blue]RUSSIA[/COLOR] [COLOR=RED]ASTRAKHAN[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
      		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
title: '| Био отказ (Возраст 66+) |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/X7NHmW8Y/image.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]. Причина отказа: Возраст превышает максимально допустимый возраст. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=blue]RUSSIA[/COLOR] [COLOR=RED]ASTRAKHAN[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
      		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Ошибки) |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/X7NHmW8Y/image.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]. Причина отказа: большое количество ошибок. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=blue]RUSSIA[/COLOR] [COLOR=RED]ASTRAKHAN[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
      		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
title: '| Био на дополнение |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/X7NHmW8Y/image.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Вам даётся 24 часа на дополнение информации в своей рп биографии. На [COLOR=#ffff00]рассмотрение.[/COLOR] <br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=blue]RUSSIA[/COLOR] [COLOR=RED]ASTRAKHAN[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/bvzbc50C/download-4.gif[/img][/url]<br>",
        prefix: PINN_PREFIX,
	  status: true,
},
  {
title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴РП ситуации╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
title: '| РП ситуация одобрено |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/X7NHmW8Y/image.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша РП ситуация получает статус - [COLOR=#00FF00]Одобрено[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=blue]RUSSIA[/COLOR] [COLOR=RED]ASTRAKHAN[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/QCcBL2G0/image.gif[/img][/url]<br>'",
    prefix: ACCСEPT_PREFIX,
	  status: false,
},
  {

 title: '| РП ситуация отказ. |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/X7NHmW8Y/image.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша РП ситуация получает статус - [COLOR=#FF0000]Отказано[/COLOR], Причиной отказа послужило - (свой ответ) <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи РП ситуаций, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=blue]RUSSIA[/COLOR] [COLOR=RED]ASTRAKHAN[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
      		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {

title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Неофициал. орг.╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
title: '| Неофициальная Орг. Одобрено|',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/X7NHmW8Y/image.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша Неофициальная Организация получает статус - [COLOR=#00FF00]Одобрено[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=blue]RUSSIA[/COLOR] [COLOR=RED]ASTRAKHAN[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/QCcBL2G0/image.gif[/img][/url]<br>'",
    prefix: ACCСEPT_PREFIX,
	  status: false,
},
  {

title: '| Неофициальная Орг. Отказ |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/X7NHmW8Y/image.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша Неофициальная Организация получает статус - [COLOR=#FF0000]Отказано[/COLOR], Причиной отказа послужило - (свой ответ) <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи Неофициальных Организаций, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=blue]RUSSIA[/COLOR] [COLOR=RED]ASTRAKHAN[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
      		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
},
 
];

$(document).ready(() => { 
 // Загрузка скрипта для обработки шаблонов 
 $(`body`).append(`<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`); 
 
 // Добавление кнопок при загрузке страницы 
 addButton(`Выбор ответов`, `selectAnswer`); 
 // Поиск информации о теме 
 const threadData = getThreadData(); 
 
 $(`button#pin`).click(() => editThreadData(PIN_PREFIX, true)); 
 $(`button#accepted`).click(() => editThreadData(ACCEPT_PREFIX, false)); 
 $(`button#teamProject`).click(() => editThreadData(COMMAND_PREFIX, true)); 
 $(`button#unaccept`).click(() => editThreadData(UNACCEPT_PREFIX, false)); 
 $(`button#watched`).click(() => editThreadData(WATCHED_PREFIX, false)); 
$(`button#closed`).click(() => editThreadData(CLOSE_PREFIX, false)); 
 $(`button#specialAdmin`).click(() => editThreadData(SPECIAL_PREFIX, true)); 
$(`button#mainAdmin`).click(() => editThreadData(GA_PREFIX, true)); 
$(`button#techspec`).click(() => editThreadData( TECH_PREFIX , true)); 
 
 
 $(`button#selectAnswer`).click(() => { 
 XF.alert(buttonsMarkup(buttons), null, `Выберите ответ:`); 
 buttons.forEach((btn, id) => { 
 if (id > 0) { 
 $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true)); 
 } else { 
 $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false)); 
 } 
 }); 
 }); 
 }); 
 
 function addButton(name, id) { 
 $(`.button--icon--reply`).before( 
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
 .join(``)}</div>`; 
 } 
 
 function pasteContent(id, data = {}, send = false) { 
 const template = Handlebars.compile(buttons[id].content); 
 if ($(`.fr-element.fr-view p`).text() === ``) $(`.fr-element.fr-view p`).empty(); 
 
 $(`span.fr-placeholder`).empty(); 
 $(`div.fr-element.fr-view p`).append(template(data)); 
 $(`a.overlay-titleCloser`).trigger(`click`); 
 
 if (send == true) { 
 editThreadData(buttons[id].prefix, buttons[id].status); 
 $(`.button--icon.button--icon--reply.rippleButton`).trigger(`click`); 
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
 const threadTitle = $(`.p-title-value`)[0].lastChild.textContent; 
 
 if (pin == false) { 
 fetch(`${document.URL}edit`, { 
 method: `POST`, 
 body: getFormData({ 
 prefix_id: prefix, 
 title: threadTitle, 
 _xfToken: XF.config.csrf, 
 _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1], 
 _xfWithData: 1, 
 _xfResponseType: `json`, 
 }), 
 }).then(() => location.reload()); 
 } 
 if (pin == true) { 
 fetch(`${document.URL}edit`, { 
 method: `POST`, 
 body: getFormData({ 
 prefix_id: prefix, 
 title: threadTitle, 
 sticky: 1, 
 _xfToken: XF.config.csrf, 
 _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1], 
 _xfWithData: 1, 
 _xfResponseType: `json`, 
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