// ==UserScript==
// @name       Скрипт Алина Свидская
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  просто скрипт
// @author       Alina Svidskaya
// @match        https://forum.blackrussia.online/threads/*
// @icon         https://klike.net/uploads/posts/2021-12/1638345168_12.jpg
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/498530/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%90%D0%BB%D0%B8%D0%BD%D0%B0%20%D0%A1%D0%B2%D0%B8%D0%B4%D1%81%D0%BA%D0%B0%D1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/498530/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%90%D0%BB%D0%B8%D0%BD%D0%B0%20%D0%A1%D0%B2%D0%B8%D0%B4%D1%81%D0%BA%D0%B0%D1%8F.meta.js
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
                                        	  title: '| Приветствие |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.pinimg.com/564x/fb/50/c7/fb50c719e9b97ada05d243303eaacd6f.jpg[/img][/url]<br>' +
		"[B][CENTER][COLOR=CRIMSON]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
            "[url=https://i.postimg.cc/C1LHkF3K/razdelitelnaya-liniya-animatsionnaya-kartinka-0098-1-1.gif][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[B][CENTER] Текст <br>"+
            "[url=https://i.postimg.cc/C1LHkF3K/razdelitelnaya-liniya-animatsionnaya-kartinka-0098-1-1.gif][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
        "[B][CENTER][COLOR=CRIMSON]С уважением Основной Заместитель Главного администратора.[/COLOR]<br>",
               },
    {
                                        	  title: '| На рассмотрении |',
	  content:
				'[CENTER][url=https://postimages.org/][img]https://i.pinimg.com/564x/fb/50/c7/fb50c719e9b97ada05d243303eaacd6f.jpg[/img][/url]<br>' +
		"[B][CENTER][COLOR=CRIMSON]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
                 "[url=https://i.postimg.cc/C1LHkF3K/razdelitelnaya-liniya-animatsionnaya-kartinka-0098-1-1.gif][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[B][CENTER] Ваша жалоба взята на рассмотрение.<br>Ожидайте ответа в данной теме. Не создавайте повторные темыm в противном случае Вы можете получить блокировку форумного аккаунта. <br>"+
              "[url=https://i.postimg.cc/C1LHkF3K/razdelitelnaya-liniya-animatsionnaya-kartinka-0098-1-1.gif][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
    "[B][CENTER][COLOR=CRIMSON]С уважением Основной Заместитель Главного администратора.[/COLOR]<br>",
                    prefix: PINN_PREFIX,
      status: true,
    },
    {
                                	  title: '| Наказание полностью снято |',
	  content:
			'[CENTER][url=https://postimages.org/][img]https://i.pinimg.com/564x/fb/50/c7/fb50c719e9b97ada05d243303eaacd6f.jpg[/img][/url]<br>' +
		"[B][CENTER][COLOR=CRIMSON]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
 "[url=https://i.postimg.cc/C1LHkF3K/razdelitelnaya-liniya-animatsionnaya-kartinka-0098-1-1.gif][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[B][CENTER] После рассмотрения темы было принято решение о снятии вашего наказания полностью.<br>Наказание будет снято в течении 12 часов. <br>"+
 "[url=https://i.postimg.cc/C1LHkF3K/razdelitelnaya-liniya-animatsionnaya-kartinka-0098-1-1.gif][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
        "[B][CENTER][COLOR=CRIMSON]С уважением Основной Заместитель Главного администратора.[/COLOR]<br>",
                       prefix: ACCСEPT_PREFIX,
	  status: false,
                 },
    {
                                	  title: '| Наказание сокращено |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.pinimg.com/564x/fb/50/c7/fb50c719e9b97ada05d243303eaacd6f.jpg[/img][/url]<br>' +
		"[B][CENTER][COLOR=CRIMSON]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
      "[url=https://i.postimg.cc/C1LHkF3K/razdelitelnaya-liniya-animatsionnaya-kartinka-0098-1-1.gif][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[B][CENTER]После рассмотрения темы было принято решение о сокарщении вашего наказания полностью.<br>Наказание будет заменено в течении 24 часов. <br>"+
 "[url=https://i.postimg.cc/C1LHkF3K/razdelitelnaya-liniya-animatsionnaya-kartinka-0098-1-1.gif][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
     "[B][CENTER][COLOR=CRIMSON]С уважением Основной Заместитель Главного администратора.[/COLOR]<br>",
                       prefix: ACCСEPT_PREFIX,
	  status: false,
                           },
    {
             title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Передача обжалования ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
                                	  title: '| Главному Администратору |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.pinimg.com/564x/fb/50/c7/fb50c719e9b97ada05d243303eaacd6f.jpg[/img][/url]<br>' +
		"[B][CENTER][COLOR=CRIMSON]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
       "[url=https://i.postimg.cc/C1LHkF3K/razdelitelnaya-liniya-animatsionnaya-kartinka-0098-1-1.gif][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[B][CENTER] Ваше обжалование передано на рассмотрение Главному Администратору @Egor_Kristofer.<br>Ожидайте ответа в данной теме. Не создавайте повторные темы, в противном случае Вы можете получить блокировку форумного аккаунта.<br>"+
    "[url=https://i.postimg.cc/C1LHkF3K/razdelitelnaya-liniya-animatsionnaya-kartinka-0098-1-1.gif][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
"[B][CENTER][COLOR=CRIMSON]С уважением Основной Заместитель Главного администратора.[/COLOR]<br>",
               prefix: GA_PREFIX,
      status: true,
               },
    {
                                        	  title: '| Специальному Администратору |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.pinimg.com/564x/fb/50/c7/fb50c719e9b97ada05d243303eaacd6f.jpg[/img][/url]<br>' +
		"[B][CENTER][COLOR=CRIMSON]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
       "[url=https://i.postimg.cc/C1LHkF3K/razdelitelnaya-liniya-animatsionnaya-kartinka-0098-1-1.gif][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[B][CENTER] Ваше обжалование передано на рассмотрение Специальному Администратору. <br>Ожидайте ответа в данной теме. Не создавайте повторные темы в противном случае Вы можете получить блокировку форумного аккаунта<br>"+
     "[url=https://i.postimg.cc/C1LHkF3K/razdelitelnaya-liniya-animatsionnaya-kartinka-0098-1-1.gif][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
      "[B][CENTER][COLOR=CRIMSON]С уважением Основной Заместитель Главного администратора.[/COLOR]<br>",
               prefix: SPECY_PREFIX,
      status: true,
               },
    {
                                        	  title: '| Руководителю Модераторов |',
	  content:
			'[CENTER][url=https://postimages.org/][img]https://i.pinimg.com/564x/fb/50/c7/fb50c719e9b97ada05d243303eaacd6f.jpg[/img][/url]<br>' +
		"[B][CENTER][COLOR=CRIMSON]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
 "[url=https://i.postimg.cc/C1LHkF3K/razdelitelnaya-liniya-animatsionnaya-kartinka-0098-1-1.gif][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[B][CENTER] Ваше обжалование передано на рассмотрение @sakaro.<br>Ожидайте ответа в данной теме. Не создавайте повторные темы в противном случае Вы можете получить блокировку форумного аккаунта.<br>"+
      "[url=https://i.postimg.cc/C1LHkF3K/razdelitelnaya-liniya-animatsionnaya-kartinka-0098-1-1.gif][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
       "[B][CENTER][COLOR=CRIMSON]С уважением Основной Заместитель Главного администратора.[/COLOR]<br>",
               prefix: PINN_PREFIX,
      status: true,
    },
    {
                     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Отказ обжалования ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
        title: '| В обжаловании отказано |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.pinimg.com/564x/fb/50/c7/fb50c719e9b97ada05d243303eaacd6f.jpg[/img][/url]<br>' +
		"[B][CENTER][COLOR=CRIMSON]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
     "[url=https://i.postimg.cc/C1LHkF3K/razdelitelnaya-liniya-animatsionnaya-kartinka-0098-1-1.gif][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[B][CENTER] После рассмотрения темы было принято решение не сокращать Вам наказание. <br>"+
        "[url=https://i.postimg.cc/C1LHkF3K/razdelitelnaya-liniya-animatsionnaya-kartinka-0098-1-1.gif][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
    "[B][CENTER][COLOR=CRIMSON]С уважением Основной Заместитель Главного администратора.[/COLOR]<br>",
    prefix: CLOSE_PREFIX,
      status: false,
    },
	{
                title: '| Обжалованию не подлежит |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.pinimg.com/564x/fb/50/c7/fb50c719e9b97ada05d243303eaacd6f.jpg[/img][/url]<br>' +
		"[B][CENTER][COLOR=CRIMSON]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
  "[url=https://i.postimg.cc/C1LHkF3K/razdelitelnaya-liniya-animatsionnaya-kartinka-0098-1-1.gif][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[B][CENTER] После рассмотрения темы было выяснено, что ваше наказание обжалованию не подлежит.<br>Не создавайте повторные темы в противном случае Вы можете получить блокировку форумного аккаунта.<br>Прочитайте внимательно эту тему:<br>[URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.3429398/'] [COLOR=RED]Важно - Правила подачи обжалования. [/COLOR] [/URL]<br>Прежде чем написать обжалование. <br>"+
     "[url=https://i.postimg.cc/C1LHkF3K/razdelitelnaya-liniya-animatsionnaya-kartinka-0098-1-1.gif][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
      "[B][CENTER][COLOR=CRIMSON]С уважением Основной Заместитель Главного администратора.[/COLOR]<br>",
    prefix: CLOSE_PREFIX,
      status: false,
    },
	{
                title: '| Дублирование |',
	  content:
			'[CENTER][url=https://postimages.org/][img]https://i.pinimg.com/564x/fb/50/c7/fb50c719e9b97ada05d243303eaacd6f.jpg[/img][/url]<br>' +
		"[B][CENTER][COLOR=CRIMSON]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
  "[url=https://i.postimg.cc/C1LHkF3K/razdelitelnaya-liniya-animatsionnaya-kartinka-0098-1-1.gif][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[B][CENTER] После рассмотрения темы было выяснено, что тема была продублирована.<br>Не создавайте повторные темы, в противном случае Вы можете получить блокировку форумного аккаунта.<br>Прочитайте внимательно эту тему:<br>[URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.3429398/'] [COLOR=RED]Важно - Правила подачи обжалования. [/COLOR] [/URL]<br>Прежде чем написать обжалование. <br>"+
     "[url=https://i.postimg.cc/C1LHkF3K/razdelitelnaya-liniya-animatsionnaya-kartinka-0098-1-1.gif][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
      "[B][CENTER][COLOR=CRIMSON]С уважением Основной Заместитель Главного администратора.[/COLOR]<br>",
    prefix: CLOSE_PREFIX,
      status: false,
    },
	{
                        title: '| Обжалование не по форме |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.pinimg.com/564x/fb/50/c7/fb50c719e9b97ada05d243303eaacd6f.jpg[/img][/url]<br>' +
		"[B][CENTER][COLOR=CRIMSON]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
       "[url=https://i.postimg.cc/C1LHkF3K/razdelitelnaya-liniya-animatsionnaya-kartinka-0098-1-1.gif][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[B][CENTER] К сожалению, вам отказано, Вы допустили ошибку в правилах подачи обжалования.<br>Прочитайте внимательно эту тему:<br>[URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.3429398/'][COLOR=RED]Важно - Правила подачи обжалования. [/COLOR] [/URL]<br>Прежде чем написать обжалование. <br>"+
     "[url=https://i.postimg.cc/C1LHkF3K/razdelitelnaya-liniya-animatsionnaya-kartinka-0098-1-1.gif][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
     "[B][CENTER][COLOR=CRIMSON]С уважением Основной Заместитель Главного администратора.[/COLOR]<br>",
    prefix: CLOSE_PREFIX,
      status: false,
    },
	{
                                title: '| Обратитесь в жалобы на адм. |',
	  content:
			'[CENTER][url=https://postimages.org/][img]https://i.pinimg.com/564x/fb/50/c7/fb50c719e9b97ada05d243303eaacd6f.jpg[/img][/url]<br>' +
		"[B][CENTER][COLOR=CRIMSON]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
      "[url=https://i.postimg.cc/C1LHkF3K/razdelitelnaya-liniya-animatsionnaya-kartinka-0098-1-1.gif][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[B][CENTER] Если Вы не согласны с решением Администратора, обратитесь в раздел Жалобы на администрацию. <br>"+
        "[url=https://i.postimg.cc/C1LHkF3K/razdelitelnaya-liniya-animatsionnaya-kartinka-0098-1-1.gif][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
      "[B][CENTER][COLOR=CRIMSON]С уважением Основной Заместитель Главного администратора.[/COLOR]<br>",
    prefix: CLOSE_PREFIX,
      status: false,
    },
	{
                                                        	  title: '| В другой раздел |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.pinimg.com/564x/fb/50/c7/fb50c719e9b97ada05d243303eaacd6f.jpg[/img][/url]<br>' +
		"[B][CENTER][COLOR=CRIMSON]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        "[url=https://i.postimg.cc/C1LHkF3K/razdelitelnaya-liniya-animatsionnaya-kartinka-0098-1-1.gif][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[B][CENTER] Ваше сообщение никоим образом не относится к предназначению данного раздела. <br>"+
 "[url=https://i.postimg.cc/C1LHkF3K/razdelitelnaya-liniya-animatsionnaya-kartinka-0098-1-1.gif][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
        "[B][CENTER][COLOR=CRIMSON]С уважением Основной Заместитель Главного администратора.[/COLOR]<br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                	  title: '| Недостаточно док-ев |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.pinimg.com/564x/fb/50/c7/fb50c719e9b97ada05d243303eaacd6f.jpg[/img][/url]<br>' +
		"[B][CENTER][COLOR=CRIMSON]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
       "[url=https://i.postimg.cc/C1LHkF3K/razdelitelnaya-liniya-animatsionnaya-kartinka-0098-1-1.gif][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[B][CENTER]Недостаточно доказательств для корректного рассмотрения вашего обращения. <br>"+
 "[url=https://i.postimg.cc/C1LHkF3K/razdelitelnaya-liniya-animatsionnaya-kartinka-0098-1-1.gif][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
"[B][CENTER][COLOR=CRIMSON]С уважением Основной Заместитель Главного администратора.[/COLOR]<br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                	  title: '| Отсутствуют док-ва |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.pinimg.com/564x/fb/50/c7/fb50c719e9b97ada05d243303eaacd6f.jpg[/img][/url]<br>' +
		"[B][CENTER][COLOR=CRIMSON]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
 "[url=https://i.postimg.cc/C1LHkF3K/razdelitelnaya-liniya-animatsionnaya-kartinka-0098-1-1.gif][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[B][CENTER]В вашем обжаловании отсутствуют Доказательства.<br>Следовательно обжалование рассмотрению не подлежит. <br>"+
         "[url=https://i.postimg.cc/C1LHkF3K/razdelitelnaya-liniya-animatsionnaya-kartinka-0098-1-1.gif][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
        "[B][CENTER][COLOR=CRIMSON]С уважением Основной Заместитель Главного администратора.[/COLOR]<br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                	  title: '| Смена NikName |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.pinimg.com/564x/fb/50/c7/fb50c719e9b97ada05d243303eaacd6f.jpg[/img][/url]<br>' +
		"[B][CENTER][COLOR=CRIMSON]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
 "[url=https://i.postimg.cc/C1LHkF3K/razdelitelnaya-liniya-animatsionnaya-kartinka-0098-1-1.gif][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[B][CENTER] Ваш аккаунт будет разблокирован на 24 часа для смены NikName.<br>После смены NikName Вы должны будете закрепить в данной теме доказательства. <br>"+
  "[url=https://i.postimg.cc/C1LHkF3K/razdelitelnaya-liniya-animatsionnaya-kartinka-0098-1-1.gif][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
      "[B][CENTER][COLOR=CRIMSON]С уважением Основной Заместитель Главного администратора.[/COLOR]<br>",
                    prefix: PINN_PREFIX,
      status: true,
    },
    {
                                                        	  title: '| NonRP Обман |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.pinimg.com/564x/fb/50/c7/fb50c719e9b97ada05d243303eaacd6f.jpg[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    "[url=https://i.postimg.cc/C1LHkF3K/razdelitelnaya-liniya-animatsionnaya-kartinka-0098-1-1.gif][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[B][CENTER] Аккаунт будет разблокирован на 24 часа, у Вас есть время, чтобы возместить ущерб и предоставить доказательства. <br>"+
      "[url=https://i.postimg.cc/C1LHkF3K/razdelitelnaya-liniya-animatsionnaya-kartinka-0098-1-1.gif][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
     "[B][CENTER][COLOR=RED]С уважением Основной Заместитель Главного администратора.[/COLOR]<br>",
                    prefix: PINN_PREFIX,
      status: true,
    },
    {
                                                        	  title: '| Отсутствует /time |',
	  content:
			'[CENTER][url=https://postimages.org/][img]https://i.pinimg.com/564x/fb/50/c7/fb50c719e9b97ada05d243303eaacd6f.jpg[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
      "[url=https://i.postimg.cc/C1LHkF3K/razdelitelnaya-liniya-animatsionnaya-kartinka-0098-1-1.gif][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[B][CENTER]В ваших доказательствах отсутствует /time.<br>Следовательно, обжалование рассмотрению не подлежит. <br>"+
      "[url=https://i.postimg.cc/C1LHkF3K/razdelitelnaya-liniya-animatsionnaya-kartinka-0098-1-1.gif][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
      "[B][CENTER][COLOR=RED]С уважением Основной Заместитель Главного администратора.[/COLOR]<br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                        	  title: '| Невозврат ущерба |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.pinimg.com/564x/fb/50/c7/fb50c719e9b97ada05d243303eaacd6f.jpg[/img][/url]<br>' +
		"[B][CENTER][COLOR=CRIMSON]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
       "[url=https://i.postimg.cc/C1LHkF3K/razdelitelnaya-liniya-animatsionnaya-kartinka-0098-1-1.gif][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[B][CENTER]У вас было 24 часа на возмещение ущерба, время истекло, аккаунт будет заблокирован навсегда. <br>"+
       "[url=https://i.postimg.cc/C1LHkF3K/razdelitelnaya-liniya-animatsionnaya-kartinka-0098-1-1.gif][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
        "[B][CENTER][COLOR=CRIMSON]С уважением Основной Заместитель Главного администратора.[/COLOR]<br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                        	  title: '| Док-ва в соц. сетях |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.pinimg.com/564x/fb/50/c7/fb50c719e9b97ada05d243303eaacd6f.jpg[/img][/url]<br>' +
		"[B][CENTER][COLOR=CRIMSON]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    "[url=https://i.postimg.cc/C1LHkF3K/razdelitelnaya-liniya-animatsionnaya-kartinka-0098-1-1.gif][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[B][CENTER]Доказательства в социальных сетях (VK,Instagram,FaceBook) не принимаются.<br>Загрузите доказательства на фохостинг (Imgur,Yapix,Youtube). <br>"+
       "[url=https://i.postimg.cc/C1LHkF3K/razdelitelnaya-liniya-animatsionnaya-kartinka-0098-1-1.gif][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
       "[B][CENTER][COLOR=CRIMSON]С уважением Основной Заместитель Главного администратора.[/COLOR]<br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                	  title: '| Окно бана |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.pinimg.com/564x/fb/50/c7/fb50c719e9b97ada05d243303eaacd6f.jpg[/img][/url]<br>' +
		"[B][CENTER][COLOR=CRIMSON]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
 "[url=https://i.postimg.cc/C1LHkF3K/razdelitelnaya-liniya-animatsionnaya-kartinka-0098-1-1.gif][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[B][CENTER]Прикрепите в следующей теме пожалуйста окно бана. <br>"+
    "[url=https://i.postimg.cc/C1LHkF3K/razdelitelnaya-liniya-animatsionnaya-kartinka-0098-1-1.gif][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
        "[B][CENTER][COLOR=CRIMSON]С уважением Основной Заместитель Главного администратора.[/COLOR]<br>",
                	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                	  title: '| В жалобы на тех. специалистов |',
	  content:
			'[CENTER][url=https://postimages.org/][img]https://i.pinimg.com/564x/fb/50/c7/fb50c719e9b97ada05d243303eaacd6f.jpg[/img][/url]<br>' +
		"[B][CENTER][COLOR=CRIMSON]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    "[url=https://i.postimg.cc/C1LHkF3K/razdelitelnaya-liniya-animatsionnaya-kartinka-0098-1-1.gif][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[B][CENTER]Если Вы не согласны с решением Технического Специалиста.<br>Обратитесь в раздел жалоб на Технических специалистов. <br>"+
     "[url=https://i.postimg.cc/C1LHkF3K/razdelitelnaya-liniya-animatsionnaya-kartinka-0098-1-1.gif][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
        "[B][CENTER][COLOR=CRIMSON]С уважением Основной Заместитель Главного администратора.[/COLOR]<br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                        	  title: '| Ошиблись сервером |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.pinimg.com/564x/fb/50/c7/fb50c719e9b97ada05d243303eaacd6f.jpg[/img][/url]<br>' +
		"[B][CENTER][COLOR=CRIMSON]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
       "[url=https://i.postimg.cc/C1LHkF3K/razdelitelnaya-liniya-animatsionnaya-kartinka-0098-1-1.gif][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[B][CENTER]Вы ошиблись сервером, напишите обжалование наказания на форуме Вашего сервера. <br>"+
       "[url=https://i.postimg.cc/C1LHkF3K/razdelitelnaya-liniya-animatsionnaya-kartinka-0098-1-1.gif][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
        "[B][CENTER][COLOR=CRIMSON]С уважением Основной Заместитель Главного администратора.[/COLOR]<br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
    },
];
         $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    // Добавление кнопок при загрузке страницы
    addButton('На рассмотрение💫', 'pin');
    addButton('Важно💥', 'Vajno');
    addButton('Команде Проекта💥', 'teamProject');
    addButton('ГА', 'Ga');
    addButton('Спецу💥', 'Spec');
    addButton('Одобрено✅', 'accepted');
    addButton('Отказано⛔', 'unaccept');
    addButton('Теху', 'Texy');
    addButton('Решено✅', 'Resheno');
    addButton('Закрыто⛔', 'Zakrito');
    addButton('Реализовано💫', 'Realizovano');
    addButton('Рассмотрено✅', 'Rassmotreno');
    addButton('Ожидание', 'Ojidanie');
    addButton('Без префикса⛔', 'Prefiks');
    addButton('Проверено контролем качества', 'Kachestvo');
    addButton('Ответ💥', 'selectAnswer');

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
    $('button#Realizovano').click(() => editThreadData(REALIZOVANO_PREFIX, false));
    $('button#Vajno').click(() => editThreadData(VAJNO_PREFIX, false));
    $('button#Rassmotreno').click(() => editThreadData(RASSMOTRENO_PREFIX, false));
    $('button#Ojidanie').click(() => editThreadData(OJIDANIE_PREFIX, false));
    $('button#Prefiks').click(() => editThreadData(PREFIKS, false));
    $('button#Kachestvo').click(() => editThreadData(KACHESTVO, false));

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