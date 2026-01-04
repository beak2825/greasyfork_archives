// ==UserScript==
// @name ORANGE 05 | Скрипт для Кураторов Форума
// @namespace https://forum.blackrussia.online
// @version 1.3
// @author by M.Freeze
// @updateversion Создан 22 марта 
// @match https://forum.blackrussia.online/threads/*
// @include https://forum.blackrussia.online/threads/
// @description none
// @license MIT
// @icon https://forum.blackrussia.online/account/avatar
// @downloadURL https://update.greasyfork.org/scripts/530565/ORANGE%2005%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/530565/ORANGE%2005%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0.meta.js
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
    title: '--------------------------------------------------- Передача тем на рассмотрение ------------------------------------------------------',
    dpstyle: 'oswald: 3px;     color: #000; background: #FF8C00; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
     },
     {
	  title: 'Приветствие',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]'
	},
     {
	  title: 'Специальному Администратору',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
        "[CENTER]Ваша жалоба передана на рассмотрение[COLOR=rgb(255, 0, 0)]Специальному Администратору.[/CENTER][/COLOR]<br>" +
        "[CENTER]Убедительная просьба не создавать копий данной темы.[/CENTER]<br>" +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
        "[CENTER][COLOR=rgb(255, 255, 0)][ICODE]Специальной Администрации[/ICODE][/COLOR][/CENTER]<br><br>"+
		'[CENTER]Ожидайте ответа.[/CENTER]',
	  prefix: SA_PREFIX,
	  status: true,
	},
    {
	  title: 'Главному Администратору',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
        "[CENTER]Ваша жалоба передана на рассмотрение [COLOR=rgb(255, 0, 0)]Главному Администратору.[/CENTER][/COLOR]<br>" +
        "[CENTER]Убедительная просьба не создавать копий данной темы.[/CENTER]<br>" +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
         "[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Главному Администратору[/ICODE][/COLOR][/CENTER]<br><br>"+
		'[CENTER]Ожидайте ответа.[/CENTER]',
	  prefix: GA_PREFIX,
	  status: true,
	},
{
	  title: 'ЗГА',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
        "[CENTER]Ваша жалоба передана на рассмотрение [COLOR=rgb(255, 0, 0)]Заместителю Главного Администратора.[/CENTER][/COLOR]<br>" +
        "[CENTER]Убедительная просьба не создавать копий данной темы.[/CENTER]<br>" +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
        "[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Заместителю Главного Администратора[/ICODE][/COLOR][/CENTER]<br><br>"+
		'[CENTER]Ожидайте ответа.[/CENTER]',
	  prefix: WAIT_PREFIX,
	  status: true,
	},
    {
	  title: 'Техническому специалисту',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
        "[CENTER]Ваша жалоба передана на рассмотрение [COLOR=rgb(0, 0, 255)]Техническому Специалисту.[/CENTER][/COLOR]<br>" +
        "[CENTER]Убедительная просьба не создавать копий данной темы.[/CENTER]<br>" +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
        "[CENTER][COLOR=rgb(0, 0, 255)][ICODE]Техническому Специалисту[/ICODE][/COLOR][/CENTER]<br><br>"+
		'[CENTER]Ожидайте ответа.[/CENTER]',
	  prefix: TECH_PREFIX,
	  status: true,
	},
     {
	  title: 'ГКФ|ЗГКФ',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
        "[CENTER]Ваша жалоба передана на рассмотрение [COLOR=rgb(0, 0, 255)]Главному/Заместителю Главного Куратора Форума.[/CENTER][/COLOR]<br>" +
        "[CENTER]Убедительная просьба не создавать копий данной темы.[/CENTER]<br>" +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
        "[CENTER][COLOR=rgb(0, 0, 255)][ICODE]ГКФ/ЗГКФ[/ICODE][/COLOR][/CENTER]<br><br>"+
		'[CENTER]Ожидайте ответа.[/CENTER][/FONT]',
	  prefix: WAIT_PREFIX,
	  status: true,
	},
     {
	  title: 'На рассмотрении',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
        "[CENTER]Ваша жалоба взята [COLOR=rgb(255, 255, 0)]на рассмотрение.[/CENTER][/COLOR]<br>" +
        "[CENTER]Убедительная просьба не создавать копий данной темы.[/CENTER]<br>" +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
        "[CENTER][COLOR=rgb(255, 255, 0)][ICODE]На рассмотрении[/ICODE][/COLOR][/CENTER]<br><br>"+
		'[CENTER]Ожидайте ответа.[/CENTER]',
	  prefix: WAIT_PREFIX,
	  status: true,
	},
{
    title: '-------------------------------------------------- Перенаправление в другие разделы ------------------------------------------------',
    dpstyle: 'oswald: 3px;     color: #000; background: #FF8C00; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #8A2BE2',
	},
     {
	  title: 'В ЖБ на АДМ',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
        "[CENTER]Ваша жалоба получает статус [COLOR=rgb(255, 0, 0)]Отказано.[/CENTER][/COLOR]<br>" +
        "[CENTER]Внимательно ознакомившись с вашей жалобой, было решено, что[COLOR=rgb(255, 0, 0)] Вам нужно обраться в [URL=https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.3342/]'Раздел жалоб на Администрацию'. [/URL][/COLOR][/CENTER]<br>" +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
        "[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: FAIL_PREFIX,
	  status: false,
	},
     {
	  title: 'В ЖБ на Тех спец',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
        "[CENTER]Ваша жалоба получает статус [COLOR=rgb(255, 0, 0)]Отказано.[/CENTER][/COLOR]<br>" +
        "[CENTER]Внимательно ознакомившись с вашей жалобой, было решено, что[COLOR=rgb(255, 0, 0)] Вам нужно обраться в [URL=https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2.490/]'Раздел жалоб на Технических Специалистов'. [/URL][/COLOR][/CENTER]<br>" +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
        "[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: FAIL_PREFIX,
	  status: false,
	},
     {
	  title: 'В ЖБ на ЛД',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
        "[CENTER]Ваша жалоба получает статус [COLOR=rgb(255, 0, 0)]Отказано.[/CENTER][/COLOR]<br>" +
        "[CENTER]Внимательно ознакомившись с вашей жалобой, было решено, что[COLOR=rgb(255, 0, 0)] Вам нужно обраться в [URL=https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.3343/]'Раздел жалоб на Лидеров'. [/URL][/COLOR][/CENTER]<br>" +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
      "[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
	  "[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: FAIL_PREFIX,
	  status: false,
	},
     {
	  title: 'В ЖБ на сотрудников',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
        "[CENTER]Обратитесь в раздел жалоб на сотрудников той или иной организации. [/CENTER]<br>" +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT] <br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: FAIL_PREFIX,
	  status: false,
	},
{
    title: '---------------------------------------------------------------------- Отказ жалоб ----------------------------------------------------------------------',
    dpstyle: 'oswald: 3px;     color: #000; background: #FF8C00; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #8A2BE2',
	},
{
	  title: 'Нарушения не найдены',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Нарушения игрока небыли обнаружены<br>" +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT] <br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: FAIL_PREFIX,
	  status: false,
	},

    {
	  title: 'Нет нарушений',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]На ваших доказательствах отсутствуют нарушения игрока.<br>" +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT] <br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Неадекватная ЖБ',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
        "[CENTER]Ваша жалоба составлена неадекватно. [/CENTER]<br>" +
        "[CENTER]Составьте жалобу адекватно и создайте новую тему. [/CENTER]<br>" +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT] <br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: FAIL_PREFIX,
	  status: false,
	},
{
      title: 'Условия',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
      content:
         '[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]"+
         "[CENTER][COLOR=rgb(255, 0, 0)]Отсутствуют условия сделки или они расписаны не корректно.[/COLOR][/CENTER]" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]"+
         "[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		 "[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
      prefix: FAIL_PREFIX,
      status: false,
},
    {
	  title: 'Жалоба не по форме',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
        "[CENTER]Ваша жалоба составлена не по форме.<br>" +
		"[CENTER]Заполните данную форму и подайте новую заявку:<br>" +
        "[QUOTE][SIZE=5]1. Ваш Nick_Name:<br>2. Nick_Name игрока:<br>3. Суть жалобы:<br>4. Доказательство:[/QUOTE][/CENTER]<br>" +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Не тот сервер',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
        "[CENTER]При составлении жалобы, Вы ошиблись сервером.[/CENTER]<br>" +
		"[CENTER]Переношу вашу жалобу в нужны раздел.[/CENTER]<br>" +
		  
	 "[CENTER]Ожидайте ответа от администрации.[/CENTER]<br>" +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: WAIT_PREFIX,
	  status: true,
	},
    {
	  title: 'Нет тайма',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
        "[CENTER]На ваших доказательствах отсутствует /time.[/CENTER]<br>" +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT] <br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Нет таймкодов',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
        "[CENTER]Если видеодоказательство длится более 3 минут, Вы должны указать тайм-коды нарушений.[/CENTER]<br>" +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT] <br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: '3+ дня',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
        "[CENTER]Вашим доказательствам более трёх дней.[/CENTER]<br>" +
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT] <br>"+
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Жалоба от 3-го лица',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
        "[CENTER]Ваша жалоба составлена от третьего лица.[/CENTER]<br>" +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT] <br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Дубликат',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
        "[CENTER]Ваша тема является дубликатом предыдущей.[/CENTER]<br>" +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT] <br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Ответ был дан в предыдущей теме',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
        "[CENTER]Ответ на вашу жалобу был дан в предыдущей теме.[/CENTER]<br>" +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT] <br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: FAIL_PREFIX,
	  status: false,
	},
{
	  title: 'Обмен ИВ на BC',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Обменивать [COLOR=rgb(255, 0, 0)]Игровую Валюту[/COLOR] на [COLOR=rgb(255, 0, 0)]Донат Валюту[/COLOR] запрещено. [COLOR=rgb(255, 0, 0)]В последующих случаях[/COLOR] это будет приравниваться к пункту правил [COLOR=rgb(255, 0, 0)]2.28.[/COLOR]<br>" +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER][/FONT]" +
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: FAIL_PREFIX,
	  status: false,
	},
        {
	  title: 'Игрок в бане',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
        "[CENTER]Нарушитель уже наказан.[/CENTER]<br>" +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
     {
    title: '---------------------------------------------------- Проблемы с доказательствами -----------------------------------------------------',
    dpstyle: 'oswald: 3px;     color: #000; background: #FF8C00; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #00FF7F',
     },
     {
	  title: 'Нужен фрапс',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
        "[CENTER]В данном случае требуеться Видеодоказательство на нарушение от игрока.[/CENTER]<br>" +
		"[CENTER]Создайте новую тему и прикрепите доказательства в виде видео, загруженные на хостинги (Rutube, Япикс, imgur).[/CENTER]<br>" +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: FAIL_PREFIX,
	  status: false,
	},
{
	  title: 'Не те док-ва',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]NickName в доказательствах не соответствует указанному в жалобе.[/CENTER]<br>" +
        "[CENTER]Составьте жалобу корректно и создайте новую тему.[/CENTER]<br>" +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT] <br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: FAIL_PREFIX,
	  status: false,
     },
 {
	  title: 'Док-ва в соц сетях',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (Rutube, Япикс, imgur).[/CENTER]<br>" +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT] <br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: FAIL_PREFIX,
	  status: false,
 },
    {
	  title: 'Док-ва удалены',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Доказательства удалены или недоступны для просмотра.[/CENTER]<br>" +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT] <br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: FAIL_PREFIX,
	  status: false,
 },
    {
	  title: 'Недостаточно доказательств',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]В вашей жалобе недостаточно доказательств на нарушение игрока.<br>" +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT] <br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: FAIL_PREFIX,
	  status: false,
	},
	    {
	  title: 'Ссылка не работает',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color:rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Ссылка с доказательствами нерабочая. Проверьте работоспособность ссылки или загрузите на фото/видео хостинги (Rutube, Япикс, imgur) и напишите новую жалобу.<br>" +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT] <br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Доказательства отредактированы',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Видеодоказательства, которые были отредактированы и на которых присутствует посторонняя музыка, неадекватная речь, нецензурные слова или выражения, могут быть не рассмотрены в качестве доказательств.<br>" +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT] <br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: FAIL_PREFIX,
	  status: false,
	},
        {
	  title: 'Отсутвуют док-ва',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]В вашей жалобе не загружены доказательства на нарушение игрока. Создайте новую жалобу, загрузив доказательства с нарушениями игрока.<br>" +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT] <br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: FAIL_PREFIX,
	  status: false,
	},
 {
	  title: 'Док-ва приватны',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]В вашей жалобе доказательства приватны. Создайте новую жалобу, загрузив доказательства с нарушениями игрока на любой другой хостинг.<br>" +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT] <br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: FAIL_PREFIX,
	  status: false,
	},
	     {
	  title: 'Длинные доказательства',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
        "[CENTER]Нам необходимо загрузить ваш доказательства на солеующие платформы: (YouTube, RuTube). [/CENTER]<br>" +
		"[CENTER]Так как хостинг lmgur не пропускает длинные видео. [/CENTER]<br>" +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: FAIL_PREFIX,
	  status: false,
	},
	{
		  title: 'Лидер семьи',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]На ваших доказательствах отсутствует показ лидера. Создайте новую жалобу, загрузив доказательства с лидером семьи на любой другой хостинг.<br>" +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT] <br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
    	  title: 'Долг отказ',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Исходя из общих правил проекта, нарушений от игрока нет. Подобные долги никак не наказуемые со стороны администрации. Долги, которые были выданы через трейд, полностью ваша ответственность. По правилам, выдача в долг должна быть начислена через банковский счет и на возврат долга дается 30 календарных дней.[QUOTE][SIZE=5]2.57. Запрещается брать в долг игровые ценности и не возвращать их. | [COLOR=rgb(255, 0, 0)][COLOR=rgb(255, 0, 0)] Ban 30 дней / permban [/QUOTE][/COLOR][/CENTER]<br>" +
"[CENTER] Примечание:[COLOR=rgb(255, 255, 255)] займ может быть осуществлен только через зачисление игровых ценностей на банковский счет, максимальный срок займа 30 календарных дней, если займ не был возвращен, аккаунт должника блокируется; [/COLOR][/CENTER]<br>" +
"[CENTER] Примечание: [COLOR=rgb(255, 255, 255)]при невозврате игровых ценностей общей стоимостью менее 5 миллионов включительно аккаунт будет заблокирован на 30 дней, если более 5 миллионов, аккаунт будет заблокирован навсегда;[/COLOR][/CENTER]<br>" +
"[CENTER] Примечание: [COLOR=rgb(255, 255, 255)]жалоба на игрока, который занял игровые ценности и не вернул в срок, подлежит рассмотрению только при наличии подтверждения суммы и условий займа в игровом процессе, меры в отношении должника могут быть приняты только при наличии жалобы и доказательств. Жалоба на должника подается в течение 10 дней после истечения срока займа. Договоры вне игры не будут считаться доказательствами.[/COLOR][/CENTER]<br>" +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: FAIL_PREFIX,
	  status: false,
	},
{
	  title: '-------------------------------------------------------- Правила Текстового Чата ------------------------------------------------------------',
      dpstyle: 'oswald: 3px;     color: #000; background: #FF8C00; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #00FFFF',
	},
     {
	  title: 'CapsLock',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=5]3.02. Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате | [COLOR=rgb(255, 0, 0)]Mute 30 минут. [/QUOTE][/COLOR][/CENTER]<br>" +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Расизм',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=5]3.03. Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены | [COLOR=rgb(255, 0, 0)]Mute 30 минут. [/QUOTE][/COLOR][/CENTER]<br>" +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Упом/Оск Родни',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=5]3.04. Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) | [COLOR=rgb(255, 0, 0)]Mute 120 минут / Ban 7 - 15 дней. [/QUOTE][/COLOR][/CENTER]<br>" +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'FLOOD',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=5]3.05. Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока | [COLOR=rgb(255, 0, 0)]Mute 30 минут. [/QUOTE][/COLOR][/CENTER]<br>" +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Злоуп Символами',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=5]3.06. Запрещено злоупотребление знаков препинания и прочих символов | [COLOR=rgb(255, 0, 0)]Mute 30 минут. [/QUOTE][/COLOR][/CENTER]<br>" +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Слив Глоб Чатов',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=5]3.08. Запрещены любые формы «слива» посредством использования глобальных чатов | [COLOR=rgb(255, 0, 0)]PermBan. [/QUOTE][/COLOR][/CENTER]<br>" +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Выдача себя за адм',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=5]3.10. Запрещена выдача себя за администратора, если таковым не являетесь | [COLOR=rgb(255, 0, 0)]Ban 7 - 15. [/QUOTE][/COLOR][/CENTER]<br>" +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Ввод в заблуждение командами',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=5]3.11. Запрещено введение игроков проекта в заблуждение путем злоупотребления командами | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan. [/QUOTE][/COLOR][/CENTER]<br>" +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Музыка в Voice чат',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=5]3.14. Запрещено включать музыку в Voice Chat | [COLOR=rgb(255, 0, 0)]Mute 60 минут. [/QUOTE][/COLOR][/CENTER]<br>" +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Шумы',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=5]3.16. Запрещено создавать посторонние шумы или звуки | [COLOR=rgb(255, 0, 0)]Mute 30 минут. [/QUOTE][/COLOR][/CENTER]<br>" +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Политика/Религия',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=5]3.18. Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов | [COLOR=rgb(255, 0, 0)]Mute 120 минут / Ban 10 дней. [/QUOTE][/COLOR][/CENTER]<br>" +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Софт для голоса',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=5]3.19. Запрещено использование любого софта для изменения голоса | [COLOR=rgb(255, 0, 0)]Mute 60 минут. [/QUOTE][/COLOR][/CENTER]<br>" +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Транслит',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=5]3.20. Запрещено использование транслита в любом из чатов | [COLOR=rgb(255, 0, 0)]Mute 30 минут. [/QUOTE][/COLOR][/CENTER]<br>" +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Реклама Промо',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=5]3.21. Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. | [COLOR=rgb(255, 0, 0)]Ban 30 дней. [/QUOTE][/COLOR][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR]чаты семейные, строительных компаний, транспортных компаний, фракционные чаты, IC, OOC, VIP и так далее.<br>"+
        "[CENTER][COLOR=rgb(255, 0, 0)] Исключение:[/COLOR] промокоды, предоставленные разработчиками, а также распространяемые через официальные ресурсы проекта.<br>"+
        "[CENTER][COLOR=rgb(255, 0, 0)]Пример:[/COLOR] если игрок упомянет промокод, распространяемый через официальную публичную страницу ВКонтакте либо через официальный Discord в любом из чатов, наказание ему не выдается.[/CENTER]<br>" +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Обьявления на тт ГОСС',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=5]3.22. Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) | [COLOR=rgb(255, 0, 0)]Mute 30 минут. [/QUOTE][/COLOR][/CENTER]<br>" +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Мат в VIP чат',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=5]3.23. Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате | [COLOR=rgb(255, 0, 0)]Mute 30 минут. [/QUOTE][/COLOR][/CENTER]<br>" +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
   {
	  title: '------------------------------------------------------- Правила RolePlay Процесса ---------------------------------------------------------',
      dpstyle: 'oswald: 3px;     color: #000; background: #FF8C00; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #00FFFF',
       },
{
	  title: 'Постороннее ПО',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
        "[CENTER]Ваша жалоба получает статус [COLOR=rgb(0, 255, 0)]Одобрено.[/CENTER][/COLOR]<br>" +
        "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=5]2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan.[/QUOTE][/COLOR][/CENTER]<br>" +
        "[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'nRP повeдение',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=5]2.01. Запрещено поведение, нарушающее нормы процессов Role Play режима игры | [COLOR=rgb(255, 0, 0)]Jail 30 минут.[/QUOTE][/CENTER]<br>" +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'nRP /edit',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Нарушитель будет наказан исходя из основных правил государственных организацый по пункту правил:[QUOTE][SIZE=5] 4.01. Запрещено редактирование объявлений, не соответствующих ПРО [Color=Red]| Mute 30 минут[/QUOTE][/CENTER]<br>" +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
     {
	  title: 'nRP Эфир',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Нарушитель будет наказан исходя из основных правил государственных организацый по пункту правил:[QUOTE][SIZE=5] 4.02. Запрещено проведение эфиров, не соответствующих Role Play правилам и логике [Color=Red]| Mute 30 минут[/QUOTE][/CENTER]<br>" +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
     {
	  title: 'Замена текста',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Нарушитель будет наказан исходя из основных правил государственных организацый по пункту правил:[QUOTE][SIZE=5] 4.04. Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком [Color=Red]| Ban 7 дней + ЧС организации[/color][/QUOTE][/CENTER]<br>" +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Уход от RP',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=5]2.02. Запрещено целенаправленно уходить от Role Play процесса всеразличными способами | [COLOR=rgb(255, 0, 0)]Jail 30 минут / Warn.[/QUOTE][/CENTER]<br>" +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Помеха RP',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=5]2.04. Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. | [COLOR=rgb(255, 0, 0)]Ban 10 дней / Обнуление аккаунта (при повторном нарушении).[/QUOTE][/CENTER]<br>" +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'nRP обман(Попытка) ',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=5]2.05.Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики | [COLOR=rgb(255, 0, 0)]PermBan.[/QUOTE][/CENTER]<br>" +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Аморальные действия',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=5]2.08. Запрещена любая форма аморальных действий сексуального характера в сторону игроков | [COLOR=rgb(255, 0, 0)]Jail 30 минут / Warn.[/QUOTE][/CENTER]<br>" +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Обман в /do ',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=5]2.10. Запрещено в любой форме обманывать в /do, даже если это в дальнейшем негативно скажется на Вашем игровом персонаже | [COLOR=rgb(255, 0, 0)]Jail 30 минут / Warn[/QUOTE][/CENTER]<br>" +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Фракционный тс в личных целях ',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=5]2.11. Запрещено использование рабочего или фракционного транспорта в личных целях | [COLOR=rgb(255, 0, 0)]Jail 30 минут.[/QUOTE][/CENTER]<br>" +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
	"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'DB ',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=5]2.13. Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта | [COLOR=rgb(255, 0, 0)]Jail 60 минут.[/QUOTE][/CENTER]<br>" +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'TK ',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=5]2.15. Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины | [COLOR=rgb(255, 0, 0)]Jail 60 минут / Warn (за два и более убийства).[/QUOTE][/CENTER]<br>" +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'SK ',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=5]2.16. Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них | [COLOR=rgb(255, 0, 0)]Jail 60 минут / Warn (за два и более убийства).[/QUOTE][/CENTER]<br>" +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'MG',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=5]2.18. Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе | [COLOR=rgb(255, 0, 0)]Mute 30 минут.[/QUOTE][/CENTER]<br>" +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'DM',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=5]2.19. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины | [COLOR=rgb(255, 0, 0)]Jail 60 минут.[/QUOTE][/CENTER]<br>" +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Mass DM',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=5]2.20. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более | [COLOR=rgb(255, 0, 0)]Warn / Ban 3 - 7 дней.[/QUOTE][/CENTER]<br>" +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  status: false,
	},
{
	  title: 'Скрытие багов',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=5]2.23. Запрещено скрывать от администрации баги системы, а также распространять их игрокам | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan.[/QUOTE][/CENTER]<br>" +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Скрытие от администрации нарушителей',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=5]2.24. Запрещено скрывать от администрации нарушителей или злоумышленников | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan + ЧС проекта.[/QUOTE][/CENTER]<br>" +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Вред репутиции проекта',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=5]2.25. Запрещены попытки или действия, которые могут навредить репутации проекта | [COLOR=rgb(255, 0, 0)]PermBan + ЧС проекта.[/QUOTE][/CENTER]<br>" +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Вред ресурсам проекта',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=5]2.26. Запрещено намеренно наносить вред ресурсам проекта (игровые серверы, форум, официальные Discord-серверы и так далее) | [COLOR=rgb(255, 0, 0)]PermBan + ЧС проекта.[/QUOTE][/CENTER]<br>" +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  status: false,
	},
{
	  title: 'Реклама соц сетей',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=5]2.31. Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное | [COLOR=rgb(255, 0, 0)]Ban 7 дней / PermBan.[/QUOTE][/CENTER]<br>" +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Обман администрации',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=5]2.32. Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта | [COLOR=rgb(255, 0, 0)]Ban 7 - 15 дней.[/QUOTE][/CENTER]<br>" +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Уязвимость правил',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=5]2.33. Запрещено пользоваться уязвимостью правил | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan[/QUOTE][/CENTER]<br>" +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Конфликты о национальности',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=5]2.35. На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате | [COLOR=rgb(255, 0, 0)]Mute 120 минут / Ban 7 дней.[/QUOTE][/CENTER]<br>" +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'OOC угрозы',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=5]2.37. Запрещены OOC угрозы, в том числе и завуалированные | [COLOR=rgb(255, 0, 0)]Mute 120 минут / Ban 7-15 дней.[/QUOTE][/CENTER]<br>" +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Распространение личной информации',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=5]2.38. Запрещено распространять личную информацию игроков и их родственников | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan +ЧС проекта.[/QUOTE][/CENTER]<br>" +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Злоупотребление нарушениями',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=5]2.39. Злоупотребление нарушениями правил сервера | [COLOR=rgb(255, 0, 0)]Ban 7 - 15 дней.[/QUOTE][/COLOR][/CENTER]<br>" +
  "[CENTER][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] неоднократное (от шести и более) нарушение правил серверов, которые были совершены за прошедшие 7 дней, с момента проверки истории наказаний игрока.[/CENTER]<br>" +
  "[CENTER][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] наказания выданные за нарушения правил текстовых чатов, помеху (kick) не учитываются.[/CENTER]<br>" +
  "[CENTER][COLOR=rgb(255, 0, 0)]Исключение:[/COLOR] пункты правил: 2.54, 3.04 учитываются в качестве злоупотребления нарушениями правил серверов.[/CENTER]<br>" +
  "[CENTER][COLOR=rgb(255, 0, 0)]Пример:[/COLOR] было получено пять наказаний за DM, шестое будет злоупотреблением. Если было получено одно наказание за упоминание родных, два наказания за DB и два наказания за DM, следующее будет считаться злоупотреблением.[/CENTER]<br>" +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Критика проекта',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=5]2.40. Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе | [COLOR=rgb(255, 0, 0)]Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором).[/QUOTE][/CENTER]<br>" +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'ЕПП',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=5]2.46. Запрещено ездить по полям на любом транспорте | [COLOR=rgb(255, 0, 0)]Jail 30 минут.[/QUOTE][/CENTER]<br>" +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'ЕПП инко/дальнобощика',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=5]2.47. Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) | [COLOR=rgb(255, 0, 0)]Jail 60 минут.[/QUOTE][/CENTER]<br>" +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Аресты в интерьере',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=5]2.50. Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий | [COLOR=rgb(255, 0, 0)]Ban 7 - 15 дней + увольнение из организации.[/QUOTE][/CENTER]<br>" +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'nRP аксессуар',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=5]2.52. Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. | [COLOR=rgb(255, 0, 0)]При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут.[/QUOTE][/CENTER]<br>" +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
		prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Оск адм',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=5]2.54. Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации | [COLOR=rgb(255, 0, 0)]Mute 180 минут.[/QUOTE][/CENTER]<br>" +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
		prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Багаюз с аним',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=5]2.55. Запрещается багоюз связанный с анимацией в любых проявлениях. | [COLOR=rgb(255, 0, 0)]Jail 60 / 120 минут.[/QUOTE][/CENTER]<br>" +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
		prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'NRP ВЧ',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Нарушитель будет наказан исходя  из правил нападания на военную часть по пункту:[QUOTE][SIZE=5]2. За нарушение правил нападения на Военную Часть выдаётся предупреждение | [COLOR=rgb(255, 0, 0)]Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ)[/QUOTE][/CENTER]<br>" +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
		prefix: OKAY_PREFIX,
	  status: false,
	},
     {
    title: '------------------------------------------------------------ RolePlay Биографии -----------------------------------------------------------------',
    dpstyle: 'oswald: 3px;     color: #000; background: #FF8C00; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #9400D3',
	},
     {
	  title: 'Биография одобрена',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Ваша RolePlay биография получает статус [COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR] <br>" +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
		prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'Биография отказана',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Ваша RolePlay биография получает статус [COLOR=rgb(255, 0, 0)]Отказано.[/COLOR] <br>" +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT] <br>"+
"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
		prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Мало инфо',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Ваша RolePlay биография получает статус Отказано, так как она содержит мало информации. <br>" +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT] <br>"+
"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
		prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Дата несходится',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Ваша RolePlay биография получает статус Отказано, так как дата рождения не сходится с возрастом или написана не полностью. <br>" +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT] <br>"+
"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
		prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Дубликат',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Ваша RolePlay биография получает статус Отказано, так как можно иметь только 1 RolePlay биографию на один аккаунт. <br>" +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT] <br>"+
"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
		prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: '3-е лицо',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Ваша RolePlay биография получает статус Отказано, так как она написана от третьего лица. <br>" +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT] <br>"+
"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
		prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Супер способности',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Ваша RolePlay биография получает статус Отказано, так как вы присвоили своему персонажу супер-способности. <br>" +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT] <br>"+
"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
		prefix: FAIL_PREFIX,
	  status: false,
	},
     {
	  title: 'Заголовок',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Ваша RolePlay биография получает статус Отказано, так как заголовок написан не по форме. <br>" +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT] <br>"+
"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
		prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Ошибки',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Ваша RolePlay биография получает статус Отказано, так как в ней содержится много грамматических ошибок. <br>" +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT] <br>"+
"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
		prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Коппипаст',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Ваша RolePlay биография получает статус Отказано, так как она скопирована. <br>" +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT] <br>"+
"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
		prefix: FAIL_PREFIX,
	  status: false,
	},
     {
	  title: 'ОФФТОП',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Ваша тема не относится к данному разделу. <br>" +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT] <br>"+
"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
		prefix: FAIL_PREFIX,
	  status: false,
	},
     {
	  title: 'Неадекватная Биография',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER] Ваша RolePlay биография получает статус Отказано, так как в ней присутвует нецензурная брань или же оскорбления. <br>" +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT] <br>"+
"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
		prefix: FAIL_PREFIX,
	  status: false,
	},
   {
	  title: 'Повтор',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Ваша RolePlay биография получает статус Отказано, так как ответ был дан в предыдущей теме. <br>" +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT] <br>"+
"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
		prefix: FAIL_PREFIX,
	  status: false,
	},
     {
	  title: 'Не по форме',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
        "[CENTER]Ваша Role Play Биография составлена не по форме.<br>" +
		"[CENTER]Создайте новую Биографию по форме.<br>" +
          "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
		prefix: FAIL_PREFIX,
	  status: false,
	},
     {
    title: '---------------------------------------------------------------- RolePlay Ситуации ---------------------------------------------------------------',
    dpstyle: 'oswald: 3px;     color: #000; background: #FF8C00; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #9400D3',
	},
    {
	  title: 'Ситуация одобрена',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Ваша RolePlay ситуация получает статус [COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR] <br>" +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
		prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'Ситуация отказана',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Ваша RolePlay ситуация получает статус [COLOR=rgb(255, 0, 0)][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/COLOR] <br>" +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT] <br>"+
"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
		prefix: FAIL_PREFIX,
	  status: false,
	},
     {
    title: '------------------------------------------------------- Неоф. RolePlay организация ---------------------------------------------------------',
    dpstyle: 'oswald: 3px;     color: #000; background: #FF8C00; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #9400D3',
	},
     {
	  title: 'Орг-ция одобрена',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Ваша Неофициальная RolePlay организация получает статус [COLOR=rgb(0, 255, 0)][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/COLOR] <br>" +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
		prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'Орг-ция отказана',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=5][FONT=verdana][CENTER][COLOR=rgb(255, 165, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER]Ваша Неофициальная RolePlay организация получает статус [COLOR=rgb(255, 0, 0)]Отказано.[/COLOR] <br>" +
         "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/IMG][/URL]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT] <br>"+
"[FONT=verdana][CENTER]Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR][/CENTER][/FONT]<br>"+
		"[FONT=verdana][CENTER]С уважением администратор сервера - Morti_Freeze! [/CENTER][/FONT][/SIZE]<br>",
		prefix: FAIL_PREFIX,
	  status: false,
	},
];

$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');


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
