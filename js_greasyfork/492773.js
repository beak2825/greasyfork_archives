// ==UserScript==
// @name VOLGOGRAD | Техническая Империя
// @namespace https://forum.blackrussia.online
// @version 1.0
// @description Best Deputy
// @author James_Uzumaki
// @updateversion Создан 24 Марта
// @match https://forum.blackrussia.online/threads/*
// @include https://forum.blackrussia.online/threads/
// @grant none
// @license MIT
// @copyright 2024,
// @icon https://forum.blackrussia.online/account/avatar
// @downloadURL https://update.greasyfork.org/scripts/492773/VOLGOGRAD%20%7C%20%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B0%D1%8F%20%D0%98%D0%BC%D0%BF%D0%B5%D1%80%D0%B8%D1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/492773/VOLGOGRAD%20%7C%20%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B0%D1%8F%20%D0%98%D0%BC%D0%BF%D0%B5%D1%80%D0%B8%D1%8F.meta.js
// ==/UserScript==
 
(function () {
'esversion 6' ;
const FAIL_PREFIX = 4;
const OKAY_PREFIX = 8;
const WAIT_PREFIX = 2;
const TECH_PREFIX = 13;
const WATCH_PREFIX = 9;
const CLOSE_PREFIX = 7;
const GA_PREFIX = 12;
const SA_PREFIX = 11;
const CP_PREFIX = 10;
const buttons = [
  {
    title: '---------------------------------------- Перенаправление в другие разделы ------------------------------------------',
    dpstyle: 'oswald: 3px;     color: #000; background: #FF4500; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF4500',
     },
     {
	  title: 'по приколу',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 140, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
        "[CENTER]Ваша жалоба получает статус [COLOR=rgb(255, 0, 0)]Отказано.[/CENTER][/COLOR]<br>" +
        "[CENTER]Внимательно ознакомившись с вашей жалобой, было решено, что[COLOR=rgb(255, 0, 0)] Вам нужно обраться в [URL=https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.1785/]'Раздел жалоб на Лидеров'. [/URL][/COLOR][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VN8nmrbJ/standard-2.gif[/img][/url]' ,
	  prefix: FAIL_PREFIX,
	  status: false,
	},
 {
	  title: 'В ЖБ на ЛД',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 140, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
        "[CENTER]Ваша жалоба получает статус [COLOR=rgb(255, 0, 0)]Отказано.[/CENTER][/COLOR]<br>" +
        "[CENTER]Внимательно ознакомившись с вашей жалобой, было решено, что[COLOR=rgb(255, 0, 0)] Вам нужно обраться в [URL=https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.1785/]'Раздел жалоб на Лидеров'. [/URL][/COLOR][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VN8nmrbJ/standard-2.gif[/img][/url]' ,
	  prefix: FAIL_PREFIX,
	  status: false,
	},
     {
	  title: 'В ОБЖ',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 140, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        "[CENTER]Ваша жалоба получает статус [COLOR=rgb(255, 0, 0)]Отказано.[/CENTER][/COLOR]<br>" +
        "[CENTER]Внимательно ознакомившись с вашей жалобой, было решено, что[COLOR=rgb(255, 0, 0)] Вам нужно обраться в [URL=https://forum.blackrussia.online/forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.1787/]'Раздел Обжалования Наказаний'. [/URL][/COLOR][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/y6SrPPkM/standard-5.gif[/img][/url]' ,
	  prefix: FAIL_PREFIX,
	  status: false,
	},
     {
	  title: 'Продажа слотов',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 140, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
        "[CENTER]Ваша жалоба получает статус [COLOR=rgb(255, 0, 0)]Отказано.[/CENTER][/COLOR]<br>" +
        "[CENTER]Покупать/Продавать слоты в семью[COLOR=rgb(255, 0, 0)] Запрещено. [/COLOR][/CENTER]<br>" +
        "[CENTER]В послудующих случаях это будет приравниваться к[COLOR=rgb(255, 0, 0)] пункту правил 2.28. [/COLOR][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VN8nmrbJ/standard-2.gif[/img][/url]' ,
	  prefix: FAIL_PREFIX,
	  status: false,
	},
     {
	  title: 'Донат',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 140, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
        "[CENTER]Ваша жалоба получает статус [COLOR=rgb(255, 0, 0)]Отказано.[/CENTER][/COLOR]<br>" +
        "[CENTER]Покупать/Продавать Донат Валюту[COLOR=rgb(255, 0, 0)] Запрещено. [/COLOR][/CENTER]<br>" +
        "[CENTER]В послудующих случаях это будет приравниваться к[COLOR=rgb(255, 0, 0)] пункту правил 2.28. [/COLOR][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VN8nmrbJ/standard-2.gif[/img][/url]' ,
	  prefix: FAIL_PREFIX,
	  status: false,
	},
     {
	  title: 'Долг трейд',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 140, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
        "[CENTER]Ваша жалоба получает статус [COLOR=rgb(255, 0, 0)]Отказано.[/CENTER][/COLOR]<br>" +
        "[CENTER]Брать/отдавать долг нужно строго через[COLOR=rgb(255, 0, 0)] Банковскую систему. [/COLOR][/CENTER]<br>" +
        "[CENTER]Жалоба не подлежит[COLOR=rgb(255, 0, 0)] дальнейшему рассмотрению. [/COLOR][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VN8nmrbJ/standard-2.gif[/img][/url]' ,
	  prefix: FAIL_PREFIX,
	  status: false,
	},
     {
    title: '---------------------------------------- Передача тем на рассмотрение ------------------------------------------',
    dpstyle: 'oswald: 3px;     color: #000; background: #FF4500; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF4500',
     },
     {
	  title: 'Специальному Администратору',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 140, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        "[CENTER]Ваша жалоба передана [COLOR=rgb(255, 255, 0)]на рассмотрение[/COLOR] [COLOR=rgb(255, 0, 0)]Специальному Администратору.[/CENTER][/COLOR]<br>" +
        "[CENTER]Убедительная просьба [COLOR=rgb(255, 0, 0)]не создавать копий данной темы.[/COLOR][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3N0xyhyk/standard-5.gif[/img][/url]<br>" +
		'[CENTER][COLOR=rgb(255, 0, 0)]Ожидайте ответа.[/COLOR][/CENTER]',
	  prefix: SA_PREFIX,
	  status: true,
	},
     {
	  title: 'Команде проекта',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 255, 140, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        "[CENTER]Ваша жалоба передана [COLOR=rgb(255, 255, 0)]на рассмотрение[/COLOR] [COLOR=rgb(255, 255, 0)]Команде Проекта.[/CENTER][/COLOR]<br>" +
        "[CENTER]Убедительная просьба [COLOR=rgb(255, 0, 0)]не создавать копий данной темы.[/COLOR][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nrhwTVKL/standard-1.gif[/img][/url]<br>" +
		'[CENTER][COLOR=rgb(255, 0, 0)]Ожидайте ответа.[/COLOR][/CENTER]',
	  prefix: CP_PREFIX,
	  status: true,
	},
     {
	  title: 'Руководителю ДС',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 255, 140, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        "[CENTER]Ваше обжалование передано [COLOR=rgb(255, 255, 0)]на рассмотрение[/COLOR] [COLOR=rgb(255, 0, 0)]Руководителю Модерации Discord Серверов.[/CENTER][/COLOR]<br>" +
        "[CENTER]Убедительная просьба [COLOR=rgb(255, 0, 0)]не создавать копий данной темы.[/COLOR][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cFHWs8Q/standard-8.gif[/img][/url]<br>" +
		'[CENTER][COLOR=rgb(255, 0, 0)]Ожидайте ответа.[/COLOR][/CENTER]',
	  prefix: WAIT_PREFIX,
	  status: true,
	},
    {
	  title: 'Главному Администратору',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 140, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        "[CENTER]Ваша жалоба передана [COLOR=rgb(255, 255, 0)]на рассмотрение[/COLOR] [COLOR=rgb(255, 0, 0)]Главному Администратору.[/CENTER][/COLOR]<br>" +
        "[CENTER]Убедительная просьба [COLOR=rgb(255, 0, 0)]не создавать копий данной темы.[/COLOR][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/j2Gqr1Sy/standard-3.gif[/img][/url]<br>" +
		'[CENTER][COLOR=rgb(255, 0, 0)]Ожидайте ответа.[/COLOR][/CENTER]',
	  prefix: GA_PREFIX,
	  status: true,
	},
{
	  title: 'ОЗГА/ЗГА',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 140, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        "[CENTER]Ваша жалоба передана [COLOR=rgb(255, 255, 0)]на рассмотрение[/COLOR] [COLOR=rgb(255, 0, 0)]Заместителю Главного Администратора.[/CENTER][/COLOR]<br>" +
        "[CENTER]Убедительная просьба [COLOR=rgb(255, 0, 0)]не создавать копий данной темы.[/COLOR][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pdwpvycm/standard.gif[/img][/url]<br>" +
		'[CENTER][COLOR=rgb(255, 0, 0)]Ожидайте ответа.[/COLOR][/CENTER]',
	  prefix: WAIT_PREFIX,
	  status: true,
	},
    {
	  title: 'Техническому специалисту',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 0, 255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        "[CENTER]Ваша жалоба передана [COLOR=rgb(255, 255, 0)]на рассмотрение[/COLOR] [COLOR=rgb(0, 0, 255)]Техническому Специалисту.[/CENTER][/COLOR]<br>" +
        "[CENTER]Убедительная просьба [COLOR=rgb(255, 0, 0)]не создавать копий данной темы.[/COLOR][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/YSvTgzNs/standard-7.gif[/img][/url]<br>" +
		'[CENTER][COLOR=rgb(255, 0, 0)]Ожидайте ответа.[/COLOR][/CENTER]',
	  prefix: TECH_PREFIX,
	  status: true,
	},
     {
	  title: 'На рассмотрении',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        "[CENTER]Ваша жалоба взята [COLOR=rgb(255, 255, 0)]на рассмотрение.[/CENTER][/COLOR]<br>" +
        "[CENTER]Убедительная просьба [COLOR=rgb(255, 0, 0)]не создавать копий данной темы.[/COLOR][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/52pRDC0m/standard-6.gif[/img][/url]<br>" +
		'[CENTER][COLOR=rgb(255, 0, 0)]Ожидайте ответа.[/COLOR][/CENTER]',
	  prefix: WAIT_PREFIX,
	  status: true,
	},
];
 
$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
 
// addButton('На рассмотрение', 'pin');
// addButton('Тех. спецу', 'tech');
	addButton('На рассмотрении', 'pin', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255,165,0, 0.5);');
    addButton('Отказано', 'unaccept', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5);')
    addButton('Одобрено', 'accepted', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5);')
	addAnswers();
 
	// Поиск информации о теме
	const threadData = getThreadData();
 
 $('button#pin').click(() => editThreadData(WAIT_PREFIX, true));
 $('button#tech').click(() => editThreadData(TECH_PREFIX, true));
 $('button#accepted').click(() => editThreadData(OKAY_PREFIX, false));
 $('button#watch').click(() => editThreadData(WATCH_PREFIX, false));
 $('button#close').click(() => editThreadData(CLOSE_PREFIX, false));
 $('button#unaccept').click(() => editThreadData(FAIL_PREFIX, false));
 
	$(`button#selectAnswer`).click(() => {
	XF.alert(buttonsMarkup(buttons), null, 'ОТВЕТЫ');
	buttons.forEach((btn, id) => {
	if (id > 1) {
	$(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
	}
	else {
	$(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
	}
	});
	});
	});
 
    function addButton(name, id, style) {
         $('.button--icon--reply').before(
	`<button type="button" class="button--primary button rippleButton" id="${id}" style="${style}">${name}</button>`,
	);
	}
	function addAnswers() {
		$('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswer" style="oswald: 3px; margin-left: 5px; margin-top: 10px; border-radius: 13px;">ОТВЕТЫ</button>`,
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
	6 < hours && hours <= 12
	  ? 'Доброе утро'
	  : 12 < hours && hours <= 17
	  ? 'Добрый день'
	  : 17 < hours && hours <= 6
	  ? 'Добрый вечер'
	  : 'Добрый вечер',
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