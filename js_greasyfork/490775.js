// ==UserScript==
// @name VOLGOGRAD | Для Славы
// @namespace https://forum.blackrussia.online
// @version 1.1
// @description Best Deputy
// @author James_Uzumaki
// @updateversion Создан 20 Марта
// @match https://forum.blackrussia.online/threads/*
// @include https://forum.blackrussia.online/threads/
// @grant none
// @license MIT
// @copyright 2024,
// @icon https://forum.blackrussia.online/account/avatar
// @downloadURL https://update.greasyfork.org/scripts/490775/VOLGOGRAD%20%7C%20%D0%94%D0%BB%D1%8F%20%D0%A1%D0%BB%D0%B0%D0%B2%D1%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/490775/VOLGOGRAD%20%7C%20%D0%94%D0%BB%D1%8F%20%D0%A1%D0%BB%D0%B0%D0%B2%D1%8B.meta.js
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
    title: '---------------------------------------- Рассмотрение заявок на Агента Поддержки ------------------------------------------',
    dpstyle: 'oswald: 3px;     color: #000; background: #008080; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #008080',
     },
{
	  title: 'Список',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 0, 255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемые игроки.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        "[CENTER]После проверки заявок,[COLOR=rgb(255, 0, 0)] вы разделились на 2 типа.[/COLOR][/CENTER]<br>" +
        "[CENTER]Ниже вы можете узнать[COLOR=rgb(255, 0, 0)] статус своей заявки.[/CENTER][/COLOR]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
     "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FHSvKFFp/standard-2.gif[/img][/url]<br>"+
    "[CENTER]NickName -[COLOR=rgb(0, 255, 0)] Одобрено.[/CENTER][/COLOR]<br>" +
    "[CENTER]NickName -[COLOR=rgb(0, 255, 0)] Одобрено.[/CENTER][/COLOR]<br>" +
    "[CENTER]NickName -[COLOR=rgb(0, 255, 0)] Одобрено.[/CENTER][/COLOR]<br>" +
    "[CENTER]NickName -[COLOR=rgb(0, 255, 0)] Одобрено.[/CENTER][/COLOR]<br>" +
    "[CENTER]NickName -[COLOR=rgb(0, 255, 0)] Одобрено.[/CENTER][/COLOR]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Pqpn7t9Y/standard-3.gif[/img][/url]<br>"+
    "[CENTER]NickName -[COLOR=rgb(255, 0, 0)] Отказано[/COLOR] - Причина.[/CENTER]<br>" +
    "[CENTER]NickName -[COLOR=rgb(255, 0, 0)] Отказано[/COLOR] - Причина.[/CENTER]<br>" +
    "[CENTER]NickName -[COLOR=rgb(255, 0, 0)] Отказано[/COLOR] - Причина.[/CENTER]<br>" +
    "[CENTER]NickName -[COLOR=rgb(255, 0, 0)] Отказано[/COLOR] - Причина.[/CENTER]<br>" +
    "[CENTER]NickName -[COLOR=rgb(255, 0, 0)] Отказано[/COLOR] - Причина.[/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)]В ближайнее время с вами свяжится Главный Следящий либо его Заместитель.[/COLOR][/CENTER]<br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)]Тема открыта для последующих заявок.[/COLOR][/CENTER]<br>"+
        '[CENTER][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] В данной теме находятся актуальные Страницы Вконтакте ГС/ЗГС АП - [URL=https://forum.blackrussia.online/threads/volgograd-%D0%A1%D0%B2%D1%8F%D0%B7%D1%8C-%D1%81-%D0%A0%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%BE%D0%BC-%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D0%BE%D0%B2-%D0%9F%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.7633272/]"Связь с Руководством Агентов Поддержки"[/URL][/CENTER][/FONT][/SIZE]',
	},
     {
	  title: 'На рассмотрении',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемые игроки.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        "[CENTER]Заявки находятся [COLOR=rgb(255, 255, 0)]на рассмотрении.[/CENTER][/COLOR]<br>" +
        "[CENTER][COLOR=rgb(255, 0, 0)]Ожидайте вердикта.[/COLOR][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nc3dpSzF/standard-4.gif[/img][/url]<br>" +
		 '[CENTER][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] В данной теме находятся актуальные Страницы Вконтакте ГС/ЗГС АП - [URL=https://forum.blackrussia.online/threads/volgograd-%D0%A1%D0%B2%D1%8F%D0%B7%D1%8C-%D1%81-%D0%A0%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%BE%D0%BC-%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D0%BE%D0%B2-%D0%9F%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.7633272/]"Связь с Руководством Агентов Поддержки"[/URL][/CENTER]',
	},
  {
    title: '------------------------------------------------- Передача тем на рассмотрение ----------------------------------------------------',
    dpstyle: 'oswald: 3px;     color: #000; background: #FF0000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
     },
     {
	  title: 'Специальному Администратору',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
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
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 255, 0, 0.5); font-family: UtromPressKachat',
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
	  title: 'Главному Администратору',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
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
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
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
    {
    title: '-------------------------------------------- Одобрение жалоб на администрацию ------------------------------------------------',
    dpstyle: 'oswald: 3px;     color: #fff; background: #FF0000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
	},
    {
	  title: 'Меры',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        "[CENTER]Ваша жалоба получает статус [COLOR=rgb(0, 255, 0)]Одобрено.[/CENTER][/COLOR]<br>" +
        "[CENTER][COLOR=rgb(255, 0, 0)]Необходимые меры в сторону администратора были приняты.[/COLOR][/CENTER]<br>" +
        "[CENTER][COLOR=rgb(255, 0, 0)]Ваше наказание будет снято в течении суток.[/COLOR][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtLFtZ6s/standard-6.gif[/img][/url]<br>" +
		'[CENTER][COLOR=rgb(255, 0, 0)]Приятной игры на сервере VOLGOGRAD (39).[/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'ПСЖ/Снят',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        "[CENTER]Ваша жалоба получает статус [COLOR=rgb(0, 255, 0)]Одобрено.[/CENTER][/COLOR]<br>" +
        "[CENTER][COLOR=rgb(255, 0, 0)]Администратор был Снят/Ушел по собстевенному желанию.[/COLOR][/CENTER]<br>" +
        "[CENTER][COLOR=rgb(255, 0, 0)]Наказание, если оно присутствует, будет снято.[/COLOR][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtLFtZ6s/standard-6.gif[/img][/url]<br>" +
		'[CENTER][COLOR=rgb(255, 0, 0)]Приятной игры на сервере VOLGOGRAD (39).[/COLOR][/CENTER]',
	  prefix: WATCH_PREFIX,
	  status: false,
	},
    {
    title: '-------------------------------------------------- Отказ жалоб на администрацию ----------------------------------------------------',
    dpstyle: 'oswald: 3px;     color: #fff; background: #FF0000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
	},
     {
	  title: 'В ОБЖ',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
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
	  title: 'В ЖБ на Тех спец',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        "[CENTER]Ваша жалоба получает статус [COLOR=rgb(255, 0, 0)]Отказано.[/CENTER][/COLOR]<br>" +
        "[CENTER]Внимательно ознакомившись с вашей жалобой, было решено, что[COLOR=rgb(255, 0, 0)] Вам нужно обраться в [URL=https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9639-volgograd.1757/]'Раздел жалоб на Технических Специалистов'. [/URL][/COLOR][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/y6SrPPkM/standard-5.gif[/img][/url]' ,
	  prefix: FAIL_PREFIX,
	  status: false,
	},
     {
	  title: 'В ЖБ на ЛД',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        "[CENTER]Ваша жалоба получает статус [COLOR=rgb(255, 0, 0)]Отказано.[/CENTER][/COLOR]<br>" +
        "[CENTER]Внимательно ознакомившись с вашей жалобой, было решено, что[COLOR=rgb(255, 0, 0)] Вам нужно обраться в [URL=https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.1785/]'Раздел жалоб на Лидеров'. [/URL][/COLOR][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/y6SrPPkM/standard-5.gif[/img][/url]' ,
	  prefix: FAIL_PREFIX,
	  status: false,
	},
     {
	  title: 'Айпи',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        "[CENTER]Ваша жалоба получает статус [COLOR=rgb(255, 0, 0)]Отказано.[/CENTER][/COLOR]<br>" +
        "[CENTER]Дело в вашем[COLOR=rgb(255, 0, 0)] Айпи Адресе. [/COLOR][/CENTER]<br>" +
        "[CENTER]Попробуйте[COLOR=rgb(255, 0, 0)] сменить его на старый с которого вы играли раньше, смените интернет соединение или же попробуйте использовать VPN. [/COLOR][/CENTER]<br>" +
        "[CENTER][COLOR=rgb(255, 0, 0)] Ваш аккаунт не в блокировке. [/COLOR][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/y6SrPPkM/standard-5.gif[/img][/url]' ,
	  prefix: FAIL_PREFIX,
	  status: false,
	},
     {
	  title: 'Окно Бана',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        "[CENTER]Ваша жалоба получает статус [COLOR=rgb(255, 0, 0)]Отказано.[/CENTER][/COLOR]<br>" +
        "[CENTER]Зайдите в игру и сделайте скриншот окна с блокировкой после чего[COLOR=rgb(255, 0, 0)] заново напишите жалобу. [/COLOR][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/y6SrPPkM/standard-5.gif[/img][/url]' ,
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Нет нарушений',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        "[CENTER]Ваша жалоба получает статус [COLOR=rgb(255, 0, 0)]Отказано.[/CENTER][/COLOR]<br>" +
        "[CENTER]В вашей жалобе [COLOR=rgb(255, 0, 0)]Отсутствуют нарушения со стороны Администрации.[/COLOR][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/y6SrPPkM/standard-5.gif[/img][/url]' ,
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Не по форме',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        "[CENTER]Ваша жалоба получает статус [COLOR=rgb(255, 0, 0)]Отказано.[/CENTER][/COLOR]<br>" +
        "[CENTER]Ваша жалоба составлена не по форме.<br>" +
		"[CENTER]Заполните данную форму и подайте новую заявку:<br>" +
        "[QUOTE][SIZE=4]1. Ваш Nick_Name:<br>2. Nick_Name администратора:<br>3. Дата выдачи/получения наказания:<br>4. Суть жалобы:<br>5. Доказательство:[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/y6SrPPkM/standard-5.gif[/img][/url]' ,
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Отсутствуют док-ва',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        "[CENTER]Ваша жалоба получает статус [COLOR=rgb(255, 0, 0)]Отказано.[/CENTER][/COLOR]<br>" +
        "[CENTER]В вашей жалобе [COLOR=rgb(255, 0, 0)]Отсутствуют доказательства на нарушения со стороны Администрации.[/COLOR][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/y6SrPPkM/standard-5.gif[/img][/url]' ,
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Док-ва отредактированы',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        "[CENTER]Ваша жалоба получает статус [COLOR=rgb(255, 0, 0)]Отказано.[/CENTER][/COLOR]<br>" +
        "[CENTER]Доказательства[COLOR=rgb(255, 0, 0)] отредактированы.[/COLOR][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/y6SrPPkM/standard-5.gif[/img][/url]' ,
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Док-ва не работают',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        "[CENTER]Ваша жалоба получает статус [COLOR=rgb(255, 0, 0)]Отказано.[/CENTER][/COLOR]<br>" +
        "[CENTER]Ссылка с Доказательствами[COLOR=rgb(255, 0, 0)] не работает. [/COLOR][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/y6SrPPkM/standard-5.gif[/img][/url]' ,
	  prefix: FAIL_PREFIX,
	  status: false,
	},
     {
	  title: 'Дубликат',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        "[CENTER]Ваша жалоба получает статус [COLOR=rgb(255, 0, 0)]Отказано.[/CENTER][/COLOR]<br>" +
        "[CENTER]Ответ был дан[COLOR=rgb(255, 0, 0)] в предыдущей теме. [/COLOR][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/y6SrPPkM/standard-5.gif[/img][/url]' ,
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Выдано верно',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        "[CENTER]Ваша жалоба получает статус [COLOR=rgb(255, 0, 0)]Отказано.[/CENTER][/COLOR]<br>" +
        "[CENTER]Проверив доказательства администратора, было принято решение, что[COLOR=rgb(255, 0, 0)] наказание выдано верно. [/COLOR][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/y6SrPPkM/standard-5.gif[/img][/url]' ,
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Прошло более 48-ми часов',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        "[CENTER]Ваша жалоба получает статус [COLOR=rgb(255, 0, 0)]Отказано.[/CENTER][/COLOR]<br>" +
        "[CENTER]С момента получения наказания[COLOR=rgb(255, 0, 0)] прошло более 48-ми часов. [/COLOR][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/y6SrPPkM/standard-5.gif[/img][/url]' ,
	  prefix: FAIL_PREFIX,
	  status: false,
	},
     {
	  title: 'OFFTOP',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        "[CENTER]Ваша жалоба получает статус [COLOR=rgb(255, 0, 0)]Отказано.[/CENTER][/COLOR]<br>" +
        "[CENTER]Ваша тема[COLOR=rgb(255, 0, 0)] не относится к данному разделу. [/COLOR][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/y6SrPPkM/standard-5.gif[/img][/url]' ,
	  prefix: FAIL_PREFIX,
	  status: false,
	},
     {
	  title: 'Жб от 3-его лица',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        "[CENTER]Ваша жалоба получает статус [COLOR=rgb(255, 0, 0)]Отказано.[/CENTER][/COLOR]<br>" +
        "[CENTER]Ваша жалоба[COLOR=rgb(255, 0, 0)] составлена от 3-его лица. [/COLOR][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/y6SrPPkM/standard-5.gif[/img][/url]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Неадекватная жб',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        "[CENTER]Ваша жалоба получает статус [COLOR=rgb(255, 0, 0)]Отказано.[/CENTER][/COLOR]<br>" +
        "[CENTER]Ваша жалоба[COLOR=rgb(255, 0, 0)] содержит нецензурную брань или составлена неадекватно. [/COLOR][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/y6SrPPkM/standard-5.gif[/img][/url]' ,
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Док-ва в соц сетях',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        "[CENTER]Ваша жалоба получает статус [COLOR=rgb(255, 0, 0)]Отказано.[/CENTER][/COLOR]<br>" +
        "[CENTER]Доказательства[COLOR=rgb(255, 0, 0)] должны быть загружены на платформы: (YouTube, Япикс, imgur). [/COLOR][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/y6SrPPkM/standard-5.gif[/img][/url]' ,
	  prefix: FAIL_PREFIX,
	  status: false,
	},
     {
    title: '--------------------------------------------------------- Обжалование наказаний ------------------------------------------------------------',
    dpstyle: 'oswald: 3px;     color: #000; background: #FFFF00; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FFFF00',
   },
      {
	  title: 'Главному Администратору',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        "[CENTER]Ваше обжалование передано [COLOR=rgb(255, 255, 0)]на рассмотрение[/COLOR] [COLOR=rgb(255, 0, 0)]Главному Администратору.[/CENTER][/COLOR]<br>" +
        "[CENTER]Убедительная просьба [COLOR=rgb(255, 0, 0)]не создавать копий данной темы.[/COLOR][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/j2Gqr1Sy/standard-3.gif[/img][/url]<br>" +
		'[CENTER][COLOR=rgb(255, 0, 0)]Ожидайте ответа.[/COLOR][/CENTER]',
	  prefix: GA_PREFIX,
	  status: true,
	},
     {
	  title: 'Руководителю ДС',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 255, 0, 0.5); font-family: UtromPressKachat',
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
	  title: 'Док-ва на возврат имущ',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        "[CENTER]Ваше обжалование находится [COLOR=rgb(255, 255, 0)]на рассмотрении[/COLOR].[/CENTER]<br>" +
        "[CENTER][COLOR=rgb(255, 0, 0)]У вас есть 24 часа чтобы прикрепить доказательство о передаче обманутому игроку Деньги/Имущество на которое вы обманули игрока.[/COLOR][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXLBDwCh/standard-7.gif[/img][/url]' ,
	  prefix: WAIT_PREFIX,
	  status: true,
	},
     {
	  title: 'NickName',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        "[CENTER][COLOR=rgb(255, 0, 0)]Аккаунт будет разблокирован на 24 часа для смены никнейма.[/CENTER][/COLOR]<br>" +
        "[CENTER]Ваша задача [COLOR=rgb(255, 0, 0)] отписать в данной теме Ваш новый NickName.[/COLOR][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXLBDwCh/standard-7.gif[/img][/url]<br>" +
		'[CENTER][COLOR=rgb(255, 0, 0)]Ожидаем ответ.[/COLOR][/CENTER]',
	  prefix: WAIT_PREFIX,
	  status: true,
	},
     {
	  title: 'Одобрено',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        "[CENTER]Ваше обжалование получает статус [COLOR=rgb(0, 255, 0)]Одобрено.[/CENTER][/COLOR]<br>" +
        "[CENTER] Ваше наказание будет[COLOR=rgb(255, 0, 0)] Снижено|Снято.[/COLOR][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/K840h9pv/standard-9.gif[/img][/url]<br>" +
		'[CENTER][COLOR=rgb(255, 0, 0)]Приятной игры на сервере VOLGOGRAD (39).[/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'Несогласен',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        "[CENTER]Ваша жалоба получает статус [COLOR=rgb(255, 0, 0)]Отказано.[/CENTER][/COLOR]<br>" +
        "[CENTER]Если вы не согласны с выданным наказанием, то напишите жалобу в раздел[COLOR=rgb(255, 0, 0)] [URL=https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1784/]'Жалобы на Администрацию'. [/URL][/COLOR][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mDGk7gPz/standard-10.gif[/img][/url]' ,
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Отказано',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        "[CENTER]Ваше обжалование получает статус [COLOR=rgb(255, 0, 0)]Отказано.[/CENTER][/COLOR]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mDGk7gPz/standard-10.gif[/img][/url]' ,
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Мы не готовы',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        "[CENTER][COLOR=rgb(255, 0, 0)]Администрация сервера не готова снизить вам наказание.[/CENTER][/COLOR]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mDGk7gPz/standard-10.gif[/img][/url]' ,
	  prefix: FAIL_PREFIX,
	  status: false,
	},
     {
	  title: 'Не подлежит ОБЖ',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        "[CENTER][COLOR=rgb(255, 0, 0)]Ваше наказание не подлежит обжалованию.[/CENTER][/COLOR]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mDGk7gPz/standard-10.gif[/img][/url]' ,
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
    title: '--------------------------------------------------------- Для остальных разделов ------------------------------------------------------------',
    dpstyle: 'oswald: 3px;     color: #000; background: #00FF00; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #00FF00',
     },
    {
	  title: 'Вина Лидера',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        "[CENTER]Ваша жалоба получает статус [COLOR=rgb(255, 0, 0)]Отказано.[/CENTER][/COLOR]<br>" +
        "[CENTER]Лидер сам несет ответственность[COLOR=rgb(255, 0, 0)] за своих Заместителей/Членов семьи. [/COLOR][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VN8nmrbJ/standard-2.gif[/img][/url]' ,
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Сумма незначительна',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        "[CENTER]Ваша жалоба получает статус [COLOR=rgb(255, 0, 0)]Отказано.[/CENTER][/COLOR]<br>" +
        "[CENTER]Сумма ущерба [COLOR=rgb(255, 0, 0)] Незначительна. [/COLOR][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VN8nmrbJ/standard-2.gif[/img][/url]' ,
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Продажа слотов',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        "[CENTER]Ваша жалоба получает статус [COLOR=rgb(255, 0, 0)]Отказано.[/CENTER][/COLOR]<br>" +
        "[CENTER]Покупать/Продавать слоты в семью[COLOR=rgb(255, 0, 0)] Запрещено. [/COLOR][/CENTER]<br>" +
        "[CENTER]В послудующих случаях это будет приравниваться к[COLOR=rgb(255, 0, 0)] пункту правил 2.28. [/COLOR][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VN8nmrbJ/standard-2.gif[/img][/url]' ,
	  prefix: FAIL_PREFIX,
	  status: false,
	},
   {
	  title: 'nrp обман',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        "[CENTER]Ваша жалоба получает статус [COLOR=rgb(0, 255, 0)]Одобрено.[/CENTER][/COLOR]<br>" +
        "[CENTER]2.05. Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики | [COLOR=rgb(255, 0, 0)]PermBan.[/COLOR][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RCd32CmT/standard-4.gif[/img][/url]<br>" +
		'[CENTER][COLOR=rgb(255, 0, 0)]Приятной игры на сервере VOLGOGRAD (39).[/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
     {
	  title: 'Слив склада',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        "[CENTER]Ваша жалоба получает статус [COLOR=rgb(0, 255, 0)]Одобрено.[/CENTER][/COLOR]<br>" +
        "[CENTER]2.09. Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan.[/COLOR][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RCd32CmT/standard-4.gif[/img][/url]<br>" +
		'[CENTER][COLOR=rgb(255, 0, 0)]Приятной игры на сервере VOLGOGRAD (39).[/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
     {
	  title: 'Упом/ОСК родни',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        "[CENTER]Ваша жалоба получает статус [COLOR=rgb(0, 255, 0)]Одобрено.[/CENTER][/COLOR]<br>" +
        "[CENTER]3.04. Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) | [COLOR=rgb(255, 0, 0)]Mute 120 минут / Ban 7 - 15 дней.[/COLOR][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RCd32CmT/standard-4.gif[/img][/url]<br>" +
		'[CENTER][COLOR=rgb(255, 0, 0)]Приятной игры на сервере VOLGOGRAD (39).[/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
     {
	  title: 'Постороннее ПО',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        "[CENTER]Ваша жалоба получает статус [COLOR=rgb(0, 255, 0)]Одобрено.[/CENTER][/COLOR]<br>" +
        "[CENTER]2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan.[/COLOR][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/CxdmtxzZ/image.png[/img][/url]<br>"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RCd32CmT/standard-4.gif[/img][/url]<br>" +
		'[CENTER][COLOR=rgb(255, 0, 0)]Приятной игры на сервере VOLGOGRAD (39).[/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
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