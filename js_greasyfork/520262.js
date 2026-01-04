// ==UserScript==
// @name  IZHEVSK 85 | Скрипт для Кураторов Форума
// @namespace https://forum.blackrussia.online
// @version 2.1
// @description Best Curators
// @author  by Wiston
// @updateversion Создан 9 декабря
// @match https://forum.blackrussia.online/threads/*
// @include https://forum.blackrussia.online/threads/
// @grant none
// @license MIT
// @copyright 2024,
// @icon https://forum.blackrussia.online/account/avatar
// @downloadURL https://update.greasyfork.org/scripts/520262/IZHEVSK%2085%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/520262/IZHEVSK%2085%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0.meta.js
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
    title: '----------------------------------------------------- Передача тем на рассмотрение --------------------------------------------------------',
    dpstyle: 'oswald: 3px;     color: #000; background: #FF0000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
     },
     {
	  title: 'Приветствие',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]'
	},
     {
	  title: 'Специальному Администратору',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
        "[CENTER]Ваша жалоба передана [COLOR=rgb(255, 255, 0)]на рассмотрение[/COLOR] [COLOR=rgb(255, 0, 0)]Специальному Администратору.[/CENTER][/COLOR]<br>" +
        "[CENTER]Убедительная просьба [COLOR=rgb(255, 0, 0)]не создавать копий данной темы.[/COLOR][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
        "[CENTER][COLOR=rgb(255, 255, 0)][ICODE]Специальной Администрации[/ICODE][/COLOR][/CENTER]<br><br>"+
		'[CENTER][COLOR=rgb(255, 0, 0)]Ожидайте ответа.[/COLOR][/CENTER]',
	  prefix: SA_PREFIX,
	  status: true,
	},
     {
	  title: 'Команде проекта',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
        "[CENTER]Ваша жалоба передана [COLOR=rgb(255, 255, 0)]на рассмотрение[/COLOR] [COLOR=rgb(255, 255, 0)]Команде Проекта.[/CENTER][/COLOR]<br>" +
        "[CENTER]Убедительная просьба [COLOR=rgb(255, 0, 0)]не создавать копий данной темы.[/COLOR][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
        "[CENTER][COLOR=rgb(255, 255, 0)][ICODE]Команде Проекта[/ICODE][/COLOR][/CENTER]<br><br>"+
		'[CENTER][COLOR=rgb(255, 0, 0)]Ожидайте ответа.[/COLOR][/CENTER]',
	  prefix: CP_PREFIX,
	  status: true,
	},
    {
	  title: 'Главному Администратору',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
        "[CENTER]Ваша жалоба передана [COLOR=rgb(255, 255, 0)]на рассмотрение[/COLOR] [COLOR=rgb(255, 0, 0)]Главному Администратору.[/CENTER][/COLOR]<br>" +
        "[CENTER]Убедительная просьба [COLOR=rgb(255, 0, 0)]не создавать копий данной темы.[/COLOR][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
         "[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Главному Администратору[/ICODE][/COLOR][/CENTER]<br><br>"+
		'[CENTER][COLOR=rgb(255, 0, 0)]Ожидайте ответа.[/COLOR][/CENTER]',
	  prefix: GA_PREFIX,
	  status: true,
	},
{
	  title: 'ОЗГА/ЗГА',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
        "[CENTER]Ваша жалоба передана [COLOR=rgb(255, 255, 0)]на рассмотрение[/COLOR] [COLOR=rgb(255, 0, 0)]Заместителю Главного Администратора.[/CENTER][/COLOR]<br>" +
        "[CENTER]Убедительная просьба [COLOR=rgb(255, 0, 0)]не создавать копий данной темы.[/COLOR][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
        "[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Заместителю Главного Администратора[/ICODE][/COLOR][/CENTER]<br><br>"+
		'[CENTER][COLOR=rgb(255, 0, 0)]Ожидайте ответа.[/COLOR][/CENTER]',
	  prefix: WAIT_PREFIX,
	  status: true,
	},
    {
	  title: 'Техническому специалисту',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 0, 255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
        "[CENTER]Ваша жалоба передана [COLOR=rgb(255, 255, 0)]на рассмотрение[/COLOR] [COLOR=rgb(0, 0, 255)]Техническому Специалисту.[/CENTER][/COLOR]<br>" +
        "[CENTER]Убедительная просьба [COLOR=rgb(255, 0, 0)]не создавать копий данной темы.[/COLOR][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
        "[CENTER][COLOR=rgb(0, 0, 255)][ICODE]Техническому Специалисту[/ICODE][/COLOR][/CENTER]<br><br>"+
		'[CENTER][COLOR=rgb(255, 0, 0)]Ожидайте ответа.[/COLOR][/CENTER]',
	  prefix: TECH_PREFIX,
	  status: true,
	},
     {
	  title: 'ГКФ|ЗГКФ',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 0, 255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
        "[CENTER]Ваша жалоба передана [COLOR=rgb(255, 255, 0)]на рассмотрение[/COLOR] [COLOR=rgb(0, 0, 255)]Главному/Заместителю Главного Куратора Форума.[/CENTER][/COLOR]<br>" +
        "[CENTER]Убедительная просьба не создавать копий данной темы.[/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
        "[CENTER][COLOR=rgb(0, 0, 255)][ICODE]ГКФ/ЗГКФ[/ICODE][/COLOR][/CENTER]<br><br>"+
		'[CENTER]Ожидайте ответа.[/CENTER][/FONT]',
	  prefix: WAIT_PREFIX,
	  status: true,
	},
     {
	  title: 'На рассмотрении',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
        "[CENTER]Ваша жалоба взята [COLOR=rgb(255, 255, 0)]на рассмотрение.[/CENTER][/COLOR]<br>" +
        "[CENTER]Убедительная просьба [COLOR=rgb(255, 0, 0)]не создавать копий данной темы.[/COLOR][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
        "[CENTER][COLOR=rgb(255, 255, 0)][ICODE]На рассмотрении[/ICODE][/COLOR][/CENTER]<br><br>"+
		'[CENTER][COLOR=rgb(255, 0, 0)]Ожидайте ответа.[/COLOR][/CENTER]',
	  prefix: WAIT_PREFIX,
	  status: true,
	},
{
    title: '---------------------------------------------------- Перенаправление в другие разделы --------------------------------------------------',
    dpstyle: 'oswald: 3px;     color: #fff; background: #8A2BE2; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #8A2BE2',
	},
    {
	  title: 'Offtop',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(186, 85, 211, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
        "[CENTER]Ваша тема не относится к данному разделу. [/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT] <br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
     {
	  title: 'В ЖБ на АДМ',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(186, 85, 211, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
        "[CENTER]Ваша жалоба получает статус [COLOR=rgb(255, 0, 0)]Отказано.[/CENTER][/COLOR]<br>" +
        "[CENTER]Внимательно ознакомившись с вашей жалобой, было решено, что[COLOR=rgb(255, 0, 0)] Вам нужно обраться в [URL=https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.3342/]'Раздел жалоб на Администрацию'. [/URL][/COLOR][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
        '[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
     {
	  title: 'В ЖБ на Тех спец',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(186, 85, 211, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
        "[CENTER]Ваша жалоба получает статус [COLOR=rgb(255, 0, 0)]Отказано.[/CENTER][/COLOR]<br>" +
        "[CENTER]Внимательно ознакомившись с вашей жалобой, было решено, что[COLOR=rgb(255, 0, 0)] Вам нужно обраться в [URL=https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2.490/]'Раздел жалоб на Технических Специалистов'. [/URL][/COLOR][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
        '[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
     {
	  title: 'В ЖБ на ЛД',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(186, 85, 211, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
        "[CENTER]Ваша жалоба получает статус [COLOR=rgb(255, 0, 0)]Отказано.[/CENTER][/COLOR]<br>" +
        "[CENTER]Внимательно ознакомившись с вашей жалобой, было решено, что[COLOR=rgb(255, 0, 0)] Вам нужно обраться в [URL=https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.3343/]'Раздел жалоб на Лидеров'. [/URL][/COLOR][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
      '[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
     {
	  title: 'В ЖБ на сотрудников',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(186, 85, 211, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
        "[CENTER]Обратитесь в раздел жалоб на сотрудников той или иной организации. [/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT] <br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
{
    title: '---------------------------------------------------------------------- Отказ жалоб ----------------------------------------------------------------------',
    dpstyle: 'oswald: 3px;     color: #fff; background: #FF0000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
	},
 {
	  title: 'Логирование (Нет нарушений)',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
        "[CENTER][COLOR=rgb(255, 0, 0)]Проверив систему Логирования, нарушения не были выявлены.[/COLOR][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
        "[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT] <br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
 {
	  title: 'Логирование (Не позволяет)',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
        "[CENTER][COLOR=rgb(255, 0, 0)]Система Логирования не позволяет выявить нарушения от игрока.[/COLOR][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
        "[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT] <br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Нет нарушений',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]На ваших доказательствах отсутствуют нарушения игрока.<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT] <br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Неадекватная ЖБ',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
        "[CENTER]Ваша жалоба составлена неадекватно. [/CENTER]<br>" +
        "[CENTER]Составьте жалобу адекватно и создайте новую тему. [/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT] <br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
{
      title: 'Условия',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
      content:
         '[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]"+
         "[CENTER][COLOR=rgb(255, 0, 0)]Отсутствуют условия сделки или они расписаны не корректно.[/COLOR][/CENTER]" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]"+
         '[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
      prefix: FAIL_PREFIX,
      status: false,
},
    {
	  title: 'Жалоба не по форме',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
        "[CENTER]Ваша жалоба составлена не по форме.<br>" +
		"[CENTER]Заполните данную форму и подайте новую заявку:<br>" +
        "[QUOTE][SIZE=8]1. Ваш Nick_Name:<br>2. Nick_Name игрока:<br>3. Суть жалобы:<br>4. Доказательство:[/QUOTE][/CENTER]<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Не тот сервер',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
        "[CENTER]При составлении жалобы, Вы ошиблись сервером.[/CENTER]<br>" +
		"[CENTER]Подайте жалобу в раздел Вашего сервера.[/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Нет тайма',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
        "[CENTER]На ваших доказательствах отсутствует /time.[/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT] <br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Нет таймкодов',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
        "[CENTER]Если видеодоказательство длится более 3 минут, Вы должны указать тайм-коды нарушений.[/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT] <br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: '3+ дня',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
        "[CENTER]Вашим доказательствам более трёх дней.[/CENTER]<br>" +
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT] <br>"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Жалоба от 3-го лица',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
        "[CENTER]Ваша жалоба составлена от третьего лица.[/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT] <br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Дубликат',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
        "[CENTER]Ваша тема является дубликатом предыдущей.[/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT] <br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Ответ был дан в предыдущей теме',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
        "[CENTER]Ответ на вашу жалобу был дан в предыдущей теме.[/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT] <br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
{
	  title: 'Слив склада семьи',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Лидер сам выдает определённое количество в разрешении на патроны/деньги/бронежилеты и тп. игрокам, с этой системой семей невозможно слить склад семьи.<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER][/FONT]" +
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
{
	  title: 'Обмен ИВ на BC',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Обменивать [COLOR=rgb(255, 0, 0)]Игровую Валюту[/COLOR] на [COLOR=rgb(255, 0, 0)]Донат Валюту[/COLOR] запрещено. [COLOR=rgb(255, 0, 0)]В последующих случаях[/COLOR] это будет приравниваться к пункту правил [COLOR=rgb(255, 0, 0)]2.28.[/COLOR]<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER][/FONT]" +
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
     {
    title: '------------------------------------------------------ Проблемы с доказательствами -------------------------------------------------------',
    dpstyle: 'oswald: 3px;     color: #000; background: #00FF7F; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #00FF7F',
     },
     {
	  title: 'Нужен фрапс',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 250, 154, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
        "[CENTER][COLOR=rgb(255, 0, 0)]В данном случае требуеться Видеодоказательство на нарушение от игрока.[/COLOR][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(255, 0, 0)]Создайте новую тему и прикрепите доказательства в виде видео, загруженные на любой хостинг.[/COLOR][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
{
	  title: 'Не те док-ва',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 250, 154, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]NickName в доказательствах не соответствует указанному в жалобе.[/CENTER]<br>" +
        "[CENTER]Составьте жалобу корректно и создайте новую тему.[/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT] <br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: FAIL_PREFIX,
	  status: false,
     },
 {
	  title: 'Док-ва в соц сетях',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 250, 154, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT] <br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: FAIL_PREFIX,
	  status: false,
 },
    {
	  title: 'Док-ва удалены',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 250, 154, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Доказательсва удалены или недоступны для просмотра.[/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT] <br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: FAIL_PREFIX,
	  status: false,
 },
    {
	  title: 'Недостаточно доказательств',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 250, 154, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]В вашей жалобе недостаточно доказательств на нарушение игрока.<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT] <br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
	    {
	  title: 'Ссылка не работает',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 250, 154, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Ссылка с доказательствами нерабочая. Проверьте работоспособность ссылки и напишите новую жалобу.<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT] <br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Доказательства отредактированы',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 250, 154, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Видеодоказательства, которые были отредактированы и на которых присутствует посторонняя музыка, неадекватная речь, нецензурные слова или выражения, могут быть не рассмотрены в качестве доказательств.<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT] <br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
     {
	  title: 'Фрапс обрывыется',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 250, 154, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Доказателства в вашей жалобе обрываются. Загрузите полный фрагмент нарушения игрока на платформу YouTube и создайте новую жалобу.<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT] <br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
        {
	  title: 'Отсутвуют док-ва',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 250, 154, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]В вашей жалобе не загружены доказательства на нарушение игрока. Создайте новую жалобу, загрузив доказательства с нарушениями игрока.<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT] <br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
 {
	  title: 'Док-ва приватны',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 250, 154, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]В вашей жалобе доказательства приватны. Создайте новую жалобу, загрузив доказательства с нарушениями игрока на любой другой хостинг.<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT] <br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
{
	  title: '---------------------------------------------------------- Правила Текстового Чата --------------------------------------------------------------',
      dpstyle: 'oswald: 3px;     color: #000; background: #00FFFF; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #00FFFF',
	},
     {
	  title: 'Язык',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(64, 224, 208, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=8]3.01. Общепризнанный язык сервера — русский. Общение в IC чатах во всех Role Play ситуациях обязательно должно проходить исключительно на русском языке. | [COLOR=rgb(255, 0, 0)][COLOR=rgb(255, 0, 0)]Устное замечание / Mute 30 минут. [/QUOTE][/COLOR][/CENTER]<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
     {
	  title: 'CapsLock',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(64, 224, 208, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=8]3.02. Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате | [COLOR=rgb(255, 0, 0)]Mute 30 минут. [/QUOTE][/COLOR][/CENTER]<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Расизм',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(64, 224, 208, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=8]3.03. Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены | [COLOR=rgb(255, 0, 0)]Mute 30 минут. [/QUOTE][/COLOR][/CENTER]<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Упом/Оск Родни',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(64, 224, 208, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=8]3.04. Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) | [COLOR=rgb(255, 0, 0)]Mute 120 минут / Ban 7 - 15 дней. [/QUOTE][/COLOR][/CENTER]<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'FLOOD',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(64, 224, 208, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=8]3.05. Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока | [COLOR=rgb(255, 0, 0)]Mute 30 минут. [/QUOTE][/COLOR][/CENTER]<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Злоуп Символами',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(64, 224, 208, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=8]3.06. Запрещено злоупотребление знаков препинания и прочих символов | [COLOR=rgb(255, 0, 0)]Mute 30 минут. [/QUOTE][/COLOR][/CENTER]<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'SEX ОСК',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(64, 224, 208, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=8]3.07. Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата | [COLOR=rgb(255, 0, 0)]Mute 30 минут. [/QUOTE][/COLOR][/CENTER]<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Слив Глоб Чатов',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(64, 224, 208, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=8]3.08. Запрещены любые формы «слива» посредством использования глобальных чатов | [COLOR=rgb(255, 0, 0)]PermBan. [/QUOTE][/COLOR][/CENTER]<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Угрозы о наказании',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(64, 224, 208, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=8]3.09. Запрещены любые угрозы о наказании игрока со стороны администрации | [COLOR=rgb(255, 0, 0)]Mute 30 минут. [/QUOTE][/COLOR][/CENTER]<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Выдача себя за адм',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(64, 224, 208, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=8]3.10. Запрещена выдача себя за администратора, если таковым не являетесь | [COLOR=rgb(255, 0, 0)]Ban 7 - 15 + ЧС администрации. [/QUOTE][/COLOR][/CENTER]<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Злоуп командами',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(64, 224, 208, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=8]3.11. Запрещено введение игроков проекта в заблуждение путем злоупотребления командами | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan. [/QUOTE][/COLOR][/CENTER]<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Наруш в репорт',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(64, 224, 208, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=8]3.12. Запрещено подавать репорт написанный транслитом, с сообщением не по теме (Offtop), с включенным Caps Lock и повторять обращение (если ответ был уже дан ранее) | [COLOR=rgb(255, 0, 0)]Report Mute 30 минут. [/QUOTE][/COLOR][/CENTER]<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Мат в репорт',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(64, 224, 208, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=8]3.13. Запрещено подавать репорт с использованием нецензурной брани | [COLOR=rgb(255, 0, 0)]Report Mute 30 минут. [/QUOTE][/COLOR][/CENTER]<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Музыка в Voice чат',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(64, 224, 208, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=8]3.14. Запрещено включать музыку в Voice Chat | [COLOR=rgb(255, 0, 0)]Mute 60 минут. [/QUOTE][/COLOR][/CENTER]<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'ОСК в Voice чат',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(64, 224, 208, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=8]3.15. Запрещено оскорблять игроков или родных в Voice Chat | [COLOR=rgb(255, 0, 0)]Mute 120 минут / Ban 7 - 15 дней. [/QUOTE][/COLOR][/CENTER]<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Шумы',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(64, 224, 208, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=8]3.16. Запрещено создавать посторонние шумы или звуки | [COLOR=rgb(255, 0, 0)]Mute 30 минут. [/QUOTE][/COLOR][/CENTER]<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Реклама в Voice чат',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(64, 224, 208, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=8]3.17. Запрещена реклама в Voice Chat не связанная с игровым процессом | [COLOR=rgb(255, 0, 0)]Ban 7 - 15 дней. [/QUOTE][/COLOR][/CENTER]<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Политика/Религия',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(64, 224, 208, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=8]3.18. Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов | [COLOR=rgb(255, 0, 0)]Mute 120 минут / Ban 10 дней. [/QUOTE][/COLOR][/CENTER]<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Софт для голоса',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(64, 224, 208, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=8]3.19. Запрещено использование любого софта для изменения голоса | [COLOR=rgb(255, 0, 0)]Mute 60 минут. [/QUOTE][/COLOR][/CENTER]<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Транслит',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(64, 224, 208, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=8]3.20. Запрещено использование транслита в любом из чатов | [COLOR=rgb(255, 0, 0)]Mute 30 минут. [/QUOTE][/COLOR][/CENTER]<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Реклама Промо',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(64, 224, 208, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=8]3.21. Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. | [COLOR=rgb(255, 0, 0)]Ban 30 дней. [/QUOTE][/COLOR][/CENTER]<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'ГОСС обьявления',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(64, 224, 208, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=8]3.22. Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) | [COLOR=rgb(255, 0, 0)]Mute 30 минут. [/QUOTE][/COLOR][/CENTER]<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Мат в VIP чат',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(64, 224, 208, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=8]3.23. Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате | [COLOR=rgb(255, 0, 0)]Mute 30 минут. [/QUOTE][/COLOR][/CENTER]<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
   {
	  title: '--------------------------------------------------------- Правила RolePlay Процесса -----------------------------------------------------------',
      dpstyle: 'oswald: 3px;     color: #000; background: #00FFFF; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #00FFFF',
       },
{
	  title: 'Помеха работе игрокам',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(64, 224, 208, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
        "[CENTER]Ваша жалоба получает статус [COLOR=rgb(0, 255, 0)]Одобрено.[/CENTER][/COLOR]<br>" +
        "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=8]2.04. Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. | [COLOR=rgb(255, 0, 0)]Ban 10 дней / Обнуление аккаунта (при повторном нарушении)[/QUOTE][/COLOR][/CENTER]<br>" +
        "[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Постороннее ПО',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(64, 224, 208, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
        "[CENTER]Ваша жалоба получает статус [COLOR=rgb(0, 255, 0)]Одобрено.[/CENTER][/COLOR]<br>" +
        "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=8]2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan.[/QUOTE][/COLOR][/CENTER]<br>" +
        "[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'nRP повидение',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(64, 224, 208, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=8]2.01. Запрещено поведение, нарушающее нормы процессов Role Play режима игры | [COLOR=rgb(255, 0, 0)]Jail 30 минут.[/QUOTE][/CENTER]<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Уход от RP',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(64, 224, 208, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=8]2.02. Запрещено целенаправленно уходить от Role Play процесса всеразличными способами | [COLOR=rgb(255, 0, 0)]Jail 30 минут / Warn.[/QUOTE][/CENTER]<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'NonRP Drive',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(64, 224, 208, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=8]2.03. Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере | [COLOR=rgb(255, 0, 0)]Jail 30 минут.[/QUOTE][/CENTER]<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Помеха RP',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(64, 224, 208, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=8]2.04. Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. | [COLOR=rgb(255, 0, 0)]Ban 10 дней / Обнуление аккаунта (при повторном нарушении).[/QUOTE][/CENTER]<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'nRP обман ',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(64, 224, 208, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=8]2.05.Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики | [COLOR=rgb(255, 0, 0)]PermBan.[/QUOTE][/CENTER]<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Отыгровки в личных целях ',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(64, 224, 208, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=8]2.06. Запрещены любые Role Play отыгровки в свою сторону или пользу | [COLOR=rgb(255, 0, 0)]Jail 30 минут.[/QUOTE][/CENTER]<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'AFK без ESC ',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(64, 224, 208, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=8]2.07. Запрещено нахождение в AFK без включенного ESC, создавая помеху другим игрокам | [COLOR=rgb(255, 0, 0)]Kick.[/QUOTE][/CENTER]<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Аморальные действия',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(64, 224, 208, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=8]2.08. Запрещена любая форма аморальных действий сексуального характера в сторону игроков | [COLOR=rgb(255, 0, 0)]Jail 30 минут / Warn.[/QUOTE][/CENTER]<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Обман в /do ',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(64, 224, 208, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=8]2.10. Запрещено в любой форме обманывать в /do, даже если это в дальнейшем негативно скажется на Вашем игровом персонаже | [COLOR=rgb(255, 0, 0)]Jail 30 минут / Warn[/QUOTE][/CENTER]<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Фракционный тс в личных целях ',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(64, 224, 208, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=8]2.11. Запрещено использование рабочего или фракционного транспорта в личных целях | [COLOR=rgb(255, 0, 0)]Jail 30 минут.[/QUOTE][/CENTER]<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Затягивание RP',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(64, 224, 208, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=8]2.12. Запрещено целенаправленное затягивание Role Play процесса | [COLOR=rgb(255, 0, 0)]Jail 30 минут.[/QUOTE][/CENTER]<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'DB ',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(64, 224, 208, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=8]2.13. Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта | [COLOR=rgb(255, 0, 0)]Jail 60 минут.[/QUOTE][/CENTER]<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'RK ',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(64, 224, 208, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=8]2.14. Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти | [COLOR=rgb(255, 0, 0)]Jail 30 минут.[/QUOTE][/CENTER]<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'TK ',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(64, 224, 208, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=8]2.15. Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины | [COLOR=rgb(255, 0, 0)]Jail 60 минут / Warn (за два и более убийства).[/QUOTE][/CENTER]<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'SK ',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(64, 224, 208, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=8]2.16. Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них | [COLOR=rgb(255, 0, 0)]Jail 60 минут / Warn (за два и более убийства).[/QUOTE][/CENTER]<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'PG',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(64, 224, 208, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=8]2.17. Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь | [COLOR=rgb(255, 0, 0)]Jail 30 минут.[/QUOTE][/CENTER]<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'MG',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(64, 224, 208, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=8]2.18. Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе | [COLOR=rgb(255, 0, 0)]Mute 30 минут.[/QUOTE][/CENTER]<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'DM',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(64, 224, 208, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=8]2.19. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины | [COLOR=rgb(255, 0, 0)]Jail 60 минут.[/QUOTE][/CENTER]<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Mass DM',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(64, 224, 208, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=8]2.20. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более | [COLOR=rgb(255, 0, 0)]Warn / Ban 3 - 7 дней.[/QUOTE][/CENTER]<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Скрытие багов',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(64, 224, 208, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=8]2.23. Запрещено скрывать от администрации баги системы, а также распространять их игрокам | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan.[/QUOTE][/CENTER]<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Скрытие от администрации нарушителей',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(64, 224, 208, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=8]2.24. Запрещено скрывать от администрации нарушителей или злоумышленников | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan + ЧС проекта.[/QUOTE][/CENTER]<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Вред репутиции проекта',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(64, 224, 208, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=8]2.25. Запрещены попытки или действия, которые могут навредить репутации проекта | [COLOR=rgb(255, 0, 0)]PermBan + ЧС проекта.[/QUOTE][/CENTER]<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Вред ресурсам проекта',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(64, 224, 208, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=8]2.26. Запрещено намеренно наносить вред ресурсам проекта (игровые серверы, форум, официальные Discord-серверы и так далее) | [COLOR=rgb(255, 0, 0)]PermBan + ЧС проекта.[/QUOTE][/CENTER]<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Cлив админ инфы',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(64, 224, 208, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=8]2.27. Запрещено распространение информации и материалов, которые имеют непосредственное отношение к работе администрации проекта | [COLOR=rgb(255, 0, 0)]PermBan + ЧС проекта.[/QUOTE][/CENTER]<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Реклама соц сетей',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(64, 224, 208, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=8]2.31. Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное | [COLOR=rgb(255, 0, 0)]Ban 7 дней / PermBan.[/QUOTE][/CENTER]<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: ' обман администрации',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(64, 224, 208, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=8]2.32. Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта | [COLOR=rgb(255, 0, 0)]Ban 7 - 15 дней.[/QUOTE][/CENTER]<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'уязвимость правил',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(64, 224, 208, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=8]2.33. Запрещено пользоваться уязвимостью правил | [COLOR=rgb(255, 0, 0)]Ban 15 дней.[/QUOTE][/CENTER]<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'уход от наказания',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(64, 224, 208, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=8]2.34. Запрещен уход от наказания | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней (суммируется к общему наказанию дополнительно).[/QUOTE][/CENTER]<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'конфликты о национальности',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(64, 224, 208, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=8]2.35. На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате | [COLOR=rgb(255, 0, 0)]Mute 120 минут / Ban 7 дней.[/QUOTE][/CENTER]<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'перенос конфликтов из IC в OOC',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(64, 224, 208, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=8]2.36. Запрещено переносить конфликты из IC в OOC и наоборот | [COLOR=rgb(255, 0, 0)]Warn.[/QUOTE][/CENTER]<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'OOC угрозы',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(64, 224, 208, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=8]2.37. Запрещены OOC угрозы, в том числе и завуалированные | [COLOR=rgb(255, 0, 0)]Mute 120 минут / Ban 7 дней.[/QUOTE][/CENTER]<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'распространение личной информации',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(64, 224, 208, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=8]2.38. Запрещено распространять личную информацию игроков и их родственников | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan.[/QUOTE][/CENTER]<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Злоупотребление нарушениями',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(64, 224, 208, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=8]2.39. Злоупотребление нарушениями правил сервера | [COLOR=rgb(255, 0, 0)]Ban 7 - 30 дней.[/QUOTE][/CENTER]<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Критика проекта',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(64, 224, 208, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=8]2.40. Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе | [COLOR=rgb(255, 0, 0)]Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором).[/QUOTE][/CENTER]<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'nRP сон',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(64, 224, 208, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=8]2.44. На серверах проекта запрещен Role Play сон (нахождение в AFK без ESC) | [COLOR=rgb(255, 0, 0)]Kick.[/QUOTE][/CENTER]<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'ЕПП',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(64, 224, 208, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=8]2.46. Запрещено ездить по полям на любом транспорте | [COLOR=rgb(255, 0, 0)]Jail 30 минут.[/QUOTE][/CENTER]<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'ЕПП инко/дальнобощика',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(64, 224, 208, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=8]2.47. Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) | [COLOR=rgb(255, 0, 0)]Jail 60 минут.[/QUOTE][/CENTER]<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Аресты в интерьере',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(64, 224, 208, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=8]2.50. Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий | [COLOR=rgb(255, 0, 0)]Ban 7 - 15 дней + увольнение из организации.[/QUOTE][/CENTER]<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'nRP аксессуар',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(64, 224, 208, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=8]2.52. Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. | [COLOR=rgb(255, 0, 0)]При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут.[/QUOTE][/CENTER]<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Оск адм',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(64, 224, 208, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=8]2.54. Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации | [COLOR=rgb(255, 0, 0)]Mute 180 минут.[/QUOTE][/CENTER]<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Багаюз с аним',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(64, 224, 208, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=8]2.55. Запрещается багоюз связанный с анимацией в любых проявлениях. | [COLOR=rgb(255, 0, 0)]Jail 60 / 120 минут.[/QUOTE][/CENTER]<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'NRP ВЧ',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(64, 224, 208, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=8]2. За нарушение правил нападения на Военную Часть выдаётся предупреждение | [COLOR=rgb(255, 0, 0)]Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ)[/QUOTE][/CENTER]<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
     {
    title: '-------------------------------------------------------------- RolePlay Биографии -------------------------------------------------------------------',
    dpstyle: 'oswald: 3px;     color: #fff; background: #9400D3; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #9400D3',
	},
     {
	  title: 'Биография одобрена',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(139, 0, 139, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Ваша RolePlay биография получает статус [COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR] <br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'Биография отказана',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(147, 112, 219, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Ваша RolePlay биография получает статус [COLOR=rgb(255, 0, 0)]Отказано.[/COLOR] <br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT] <br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Мало инфо',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(147, 112, 219, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Ваша RolePlay биография получает статус Отказано, т.к. она содержит мало информации. <br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT] <br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Дата несходится',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(147, 112, 219, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Ваша RolePlay биография получает статус Отказано, т.к. дата рождения не сходится с возрастом или написана не полностью. <br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT] <br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Дубликат',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(147, 112, 219, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Ваша RolePlay биография получает статус Отказано, т.к. можно иметь только 1 RolePlay биографию на один аккаунт. <br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT] <br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: '3-е лицо',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(147, 112, 219, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Ваша RolePlay биография получает статус Отказано, т.к. она написана от третьего лица. <br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT] <br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Супер способности',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(147, 112, 219, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Ваша RolePlay биография получает статус Отказано, т.к. вы присвоили своему персонажу супер-способности. <br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT] <br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
     {
	  title: 'Заголовок',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(147, 112, 219, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Ваша RolePlay биография получает статус Отказано, т.к. заголовок написан не по форме. <br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT] <br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Ошибки',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(147, 112, 219, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Ваша RolePlay биография получает статус Отказано, т.к. в ней содержится много грамматических ошибок. <br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT] <br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Коппипаст',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(147, 112, 219, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Ваша RolePlay биография получает статус Отказано, т.к. она скопирована. <br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT] <br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
     {
	  title: 'ОФФТОП',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(147, 112, 219, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Ваша тема не относится к данному разделу. <br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT] <br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
     {
	  title: 'Неадекватная Биография',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(147, 112, 219, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER] Ваша RolePlay биография получает статус Отказано, т.к. в ней присутвует нецензурная брань или же оскорбления. <br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT] <br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
   {
	  title: 'Повтор',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(147, 112, 219, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Ваша RolePlay биография получает статус Отказано, т.к. ответ был дан в предыдущей теме. <br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT] <br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
     {
	  title: 'не по форме',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(147, 112, 219, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
        "[CENTER]Ваша Role Play Биография составлена не по форме.<br>" +
		"[CENTER]Создайте новую Биографию по форме.<br>" +
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
     {
    title: '------------------------------------------------------------------ RolePlay Ситуации -----------------------------------------------------------------',
    dpstyle: 'oswald: 3px;     color: #fff; background: #9400D3; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #9400D3',
	},
    {
	  title: 'Ситуация одобрена',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(139, 0, 139, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Ваша RolePlay ситуация получает статус [COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR] <br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'Ситуация отказана',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(147, 112, 219, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Ваша RolePlay ситуация получает статус [COLOR=rgb(255, 0, 0)][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/COLOR] <br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT] <br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
     {
    title: '--------------------------------------------------------- Неоф. RolePlay организация -----------------------------------------------------------',
    dpstyle: 'oswald: 3px;     color: #fff; background: #9400D3; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #9400D3',
	},
     {
	  title: 'Орг-ция одобрена',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(139, 0, 139, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Ваша Неофициальная RolePlay организация получает статус [COLOR=rgb(0, 255, 0)][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/COLOR] <br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'Орг-ция отказана',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(147, 112, 219, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=8][FONT=Times New Roman][CENTER][COLOR=rgb(10, 171, 149)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER]Ваша Неофициальная RolePlay организация получает статус [COLOR=rgb(255, 0, 0)]Отказано.[/COLOR] <br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9MkyXPZQ/Picsart-24-05-10-13-21-41-387-1.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT] <br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(10, 171, 149)]IZHEVSK(85).[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: FAIL_PREFIX,
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