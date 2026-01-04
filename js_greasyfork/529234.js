// ==UserScript==
// @name PODOLSK | Скрипт для Кураторов Форума
// @namespace https://forum.blackrussia.online
// @version 3.1
// @description Script
// @author V. Sloan
// @updateversion Создан 8 марта
// @match https://forum.blackrussia.online/threads/*
// @include https://forum.blackrussia.online/threads/
// @grant none
// @license MIT
// @copyright 2025,
// @icon https://forum.blackrussia.online/account/avatar
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/529234/PODOLSK%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/529234/PODOLSK%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0.meta.js
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
    dpstyle: 'Verdana: 3px;     color: #000; background: #FF0000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
     },
     {
	  title: 'Приветствие',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(255, 102, 178, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>'
	},
     {
	  title: 'Специальному Администратору',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(255, 102, 178, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER]Ваша жалоба передана [COLOR=rgb(255, 165, 0)]на рассмотрение[/COLOR] [COLOR=rgb(255, 165, 0)]Специальному Администратору.[/CENTER][/COLOR]<br>" +
        "[CENTER]Убедительная просьба не создавать копий данной темы.[/CENTER]<br>" +
        "[CENTER][COLOR=rgb(255,221,0)][ICODE]Специальной Администрации[/ICODE][/COLOR][/CENTER]<br><br>"+
		'[CENTER][COLOR=rgb(183, 166, 126)]Ожидайте ответа.[/COLOR][/CENTER]',
	  prefix: SA_PREFIX,
	  status: true,
	},
     {
	  title: 'Команде проекта',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(255, 255, 102, 178.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER]Ваша жалоба передана [COLOR=rgb(183, 166, 126)]на рассмотрение[/COLOR] [COLOR=rgb(255, 255, 0)]Команде Проекта.[/CENTER][/COLOR]<br>" +
        "[CENTER]Убедительная просьба [COLOR=rgb(183, 166, 126)]не создавать копий данной темы.[/COLOR][/CENTER]<br>" +
        "[CENTER][COLOR=rgb(255,221,0)][ICODE]Команде Проекта[/ICODE][/COLOR][/CENTER]<br><br>"+
		'[CENTER][COLOR=rgb(183, 166, 126)]Ожидайте ответа.[/COLOR][/CENTER]',
	  prefix: CP_PREFIX,
	  status: true,
	},
    {
	  title: 'Главному Администратору',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(255, 102, 178, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER]Ваша жалоба передана [COLOR=rgb(255,152,0)]на рассмотрение[/COLOR] [COLOR=rgb(211,47,47)]Главному Администратору @Shrek Empower .[/CENTER][/COLOR]<br>" +
        "[CENTER]Убедительная просьба не создавать копий данной темы.[/CENTER]<br>" +
        "[CENTER][COLOR=rgb(211,47,47)][ICODE]Главному Администратору[/ICODE][/COLOR][/CENTER]<br><br>"+
		'[CENTER][COLOR=rgb(183, 166, 126)]Ожидайте ответа.[/COLOR][/CENTER]',
	  prefix: GA_PREFIX,
	  status: true,
	},
{
	  title: 'ОЗГА/ЗГА',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(255, 102, 178, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER]Ваша жалоба передана [COLOR=rgb(255,152,0)]на рассмотрение[/COLOR] [COLOR=rgb(211,47,47)]Заместителю Главного Администратора @Samurai Kalashnikov или @Frank_Rolex.[/CENTER][/COLOR]<br>" +
        "[CENTER]Убедительная просьба [COLOR=rgb(183, 166, 126)]не создавать копий данной темы.[/COLOR][/CENTER]<br>" +
        "[CENTER][COLOR=rgb(211,47,47)][ICODE]Заместителю Главного Администратора[/ICODE][/COLOR][/CENTER]<br><br>"+
		'[CENTER][COLOR=rgb(183, 166, 126)]Ожидайте ответа.[/COLOR][/CENTER]',
	  prefix: WAIT_PREFIX,
	  status: true,
	},
    {
	  title: 'Техническому специалисту',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(0, 0, 255, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER]Ваша жалоба передана [COLOR=rgb(255,152,0)]на рассмотрение[/COLOR] [COLOR=rgb(65,105,217)]Техническому Специалисту @Pavel Gromov.[/CENTER][/COLOR]<br>" +
        "[CENTER]Убедительная просьба [COLOR=rgb(183, 166, 126)]не создавать копий данной темы.[/COLOR][/CENTER]<br>" +
        "[CENTER][COLOR=rgb(65,105,217)][ICODE]Техническому Специалисту[/ICODE][/COLOR][/CENTER]<br><br>"+
		'[CENTER][COLOR=rgb(183, 166, 126)]Ожидайте ответа.[/COLOR][/CENTER]',
	  prefix: TECH_PREFIX,
	  status: true,
	},
     {
	  title: 'На рассмотрении',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(255, 255, 102, 178.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER]Ваша жалоба взята [COLOR=rgb(255,152,0)]на рассмотрение.[/CENTER][/COLOR]<br>" +
        "[CENTER]Убедительная просьба [COLOR=rgb(183, 166, 126)]не создавать копий данной темы.[/COLOR][/CENTER]<br>" +
        "[CENTER][COLOR=rgb(255,152,0)][ICODE]На рассмотрении[/ICODE][/COLOR][/CENTER]<br><br>"+
		'[CENTER][COLOR=rgb(183, 166, 126)]Ожидайте ответа.[/COLOR][/CENTER]',
	  prefix: WAIT_PREFIX,
	  status: true,
	},
{
    title: '---------------------------------------------------- Перенаправление в другие разделы --------------------------------------------------',
    dpstyle: 'oswald: 3px;     color: #fff; background: #8A2BE2; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #8A2BE2',
	},
    {
	  title: 'Offtop',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(186, 85, 211, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER]Ваша тема не относится к данному разделу. [/CENTER]<br>" +
        "[CENTER][COLOR=rgb(211,47,47)][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
        "[CENTER][CENTER]<br>" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
     {
	  title: 'В ЖБ на АДМ',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(186, 85, 211, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER]Ваша жалоба получает статус [COLOR=rgb(211,47,47)]Отказано.[/CENTER][/COLOR]<br>" +
        "[CENTER]Внимательно ознакомившись с вашей жалобой, было решено, что[COLOR=rgb(183, 166, 126)] Вам нужно обраться в [URL=https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.3342/]'Раздел жалоб на Администрацию'. [/URL][/COLOR][/CENTER]<br>" +
        "[CENTER][COLOR=rgb(211,47,47)][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
        '[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
     {
	  title: 'В ЖБ на Тех спец',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(186, 85, 211, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER]Ваша жалоба получает статус [COLOR=rgb(211,47,47)]Отказано.[/CENTER][/COLOR]<br>" +
        "[CENTER]Внимательно ознакомившись с вашей жалобой, было решено, что[COLOR=rgb(183, 166, 126)] Вам нужно обраться в [URL=https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2.490/]'Раздел жалоб на Технических Специалистов'. [/URL][/COLOR][/CENTER]<br>" +
        "[CENTER][COLOR=rgb(211,47,47)][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
        '[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
     {
	  title: 'В ЖБ на ЛД',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(186, 85, 211, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER]Ваша жалоба получает статус [COLOR=rgb(211,47,47)]Отказано.[/CENTER][/COLOR]<br>" +
        "[CENTER]Внимательно ознакомившись с вашей жалобой, было решено, что[COLOR=rgb(183, 166, 126)] Вам нужно обраться в [URL=https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.3343/]'Раздел жалоб на Лидеров'. [/URL][/COLOR][/CENTER]<br>" +
        "[CENTER][COLOR=rgb(211,47,47)][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
        '[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
     {
	  title: 'В ЖБ на сотрудников',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(186, 85, 211, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER]Обратитесь в раздел жалоб на сотрудников той или иной организации. [/CENTER]<br>" +
		 "[CENTER][COLOR=rgb(211,47,47)][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
{
	  title: 'В Обжалование наказаний',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(186, 85, 211, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER]Обратитесь в раздел обжалований наказание. [/CENTER]<br>" +
		 "[CENTER][COLOR=rgb(211,47,47)][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
{
    title: '---------------------------------------------------------------------- Отказ жалоб ----------------------------------------------------------------------',
    dpstyle: 'oswald: 3px;     color: #fff; background: #FF0000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
	},
 {
	  title: 'Логирование (Нет нарушений)',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(255, 102, 178, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][COLOR=rgb(183, 166, 126)]Проверив систему Логирования, нарушения не были выявлены.[/COLOR][/CENTER]<br>" +
         "[CENTER][COLOR=rgb(211,47,47)][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
 {
	  title: 'Логирование (Не позволяет)',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(255, 102, 178, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][COLOR=rgb(183, 166, 126)]Система Логирования не позволяет выявить нарушения от игрока.[/COLOR][/CENTER]<br>" +
         "[CENTER][COLOR=rgb(211,47,47)][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Нет нарушений',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(255, 102, 178, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]На ваших доказательствах отсутствуют нарушения игрока.<br>" +
		 "[CENTER][COLOR=rgb(211,47,47)][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
{
	  title: 'Отдельная жалоба на игрока',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(255, 102, 178, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]На каждого игрока должна быть отдельная жалоба.<br>" +
		 "[CENTER][COLOR=rgb(211,47,47)][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
 {
	  title: 'Правило удалено',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(255, 102, 178, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Данное правило было удалено из общих правил серверов.<br>" +
		 "[CENTER][COLOR=rgb(211,47,47)][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Неадекватная ЖБ',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(255, 102, 178, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER]Ваша жалоба составлена неадекватно. [/CENTER]<br>" +
        "[CENTER]Составьте жалобу адекватно и создайте новую тему. [/CENTER]<br>" +
		 "[CENTER][COLOR=rgb(211,47,47)][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
{
      title: 'Условия',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(255, 102, 178, 0.5); font-family: Verdana',
      content:
         '[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]' +
         "[CENTER][CENTER]<br>" +
         "[CENTER] Отсутствуют условия сделки или они расписаны не корректно.[CENTER][/SIZE]<br>" +
         '[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
      prefix: FAIL_PREFIX,
      status: false,
},
    {
	  title: 'Жалоба не по форме',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(255, 102, 178, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER]Ваша жалоба составлена не по форме.<br>" +
		"[CENTER]Заполните данную форму и подайте новую заявку:<br>" +
        "[QUOTE][SIZE=4]1. Ваш Nick_Name:<br>2. Nick_Name игрока:<br>3. Суть жалобы:<br>4. Доказательство:[/SIZE][/QUOTE][/CENTER]<br>" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Не тот сервер',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(255, 102, 178, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER]При составлении жалобы, Вы ошиблись сервером.[/CENTER]<br>" +
		"[CENTER]Подайте жалобу в раздел Вашего сервера.[/CENTER]<br>" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Нет тайма',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(255, 102, 178, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER]На ваших доказательствах отсутствует /time.[/CENTER]<br>" +
		 "[CENTER][COLOR=rgb(211,47,47)][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Нет таймкодов',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(255, 102, 178, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +

        "[CENTER]Если видеодоказательство длится более 3 минут, Вы должны указать тайм-коды нарушений.[/CENTER]<br>" +

		 "[CENTER][COLOR=rgb(211,47,47)][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: '3+ дня',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(255, 102, 178, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER]Вашим доказательствам более трёх дней.[/CENTER]<br>" +
		 "[CENTER][COLOR=rgb(211,47,47)][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Жалоба от 3-го лица',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(255, 102, 178, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER]Ваша жалоба составлена от третьего лица.[/CENTER]<br>" +
		 "[CENTER][COLOR=rgb(211,47,47)][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Дубликат',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(255, 102, 178, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER]Ваша тема является дубликатом предыдущей.[/CENTER]<br>" +
		 "[CENTER][COLOR=rgb(211,47,47)][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Ответ был дан в предыдущей теме',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(255, 102, 178, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER]Ответ на вашу жалобу был дан в предыдущей теме.[/CENTER]<br>" +
		 "[CENTER][COLOR=rgb(211,47,47)][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
{
	  title: 'Слив склада семьи',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(255, 102, 178, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Лидер сам выдает определённое количество в разрешении на патроны/деньги/бронежилеты и тп. игрокам, с этой системой семей невозможно слить склад семьи.<br>" +
		"[CENTER][COLOR=rgb(183, 166, 126)]Закрыто.[/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
{
	  title: 'Обмен ИВ на BC',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(255, 102, 178, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Обменивать [COLOR=rgb(183, 166, 126)]Игровую Валюту[/COLOR] на [COLOR=rgb(183, 166, 126)]Донат Валюту[/COLOR] запрещено. [COLOR=rgb(183, 166, 126)]В последующих случаях[/COLOR] это будет приравниваться к пункту правил [COLOR=rgb(183, 166, 126)]2.28.[/COLOR]<br>" +
		"[CENTER][COLOR=rgb(183, 166, 126)]Закрыто.[/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
{
	  title: 'Долг',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(255, 102, 178, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Займ может быть осуществлен только через зачисление игровых ценностей на банковский счет, максимальный срок займа 30 календарных дней, если займ не был возвращен, аккаунт должника блокируется.[COLOR=rgb(183, 166, 126)] <br>" +
		"[CENTER][COLOR=rgb(183, 166, 126)]Закрыто.[/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
 {
	  title: 'Уже в блокировке',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(255, 102, 178, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER]Данный игрок уже находится в действующей блокировке[/CENTER]<br>" +
         "[CENTER][COLOR=rgb(211,47,47)][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
 {
	  title: 'Заголовок не по форме',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(255, 102, 178, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER]Ваш заголовок составлен не по форме.[/CENTER]<br>" +
        "[CENTER]Просьба ознакомиться с составлением заголовка при подаче жалобы ниже:[/CENTER]<br>" +
        "[CENTER][QUOTE][SIZE=4]В названии темы необходимо указать никнейм игрока, на которого подается жалоба, и суть жалобы: Nick_Name | Суть жалобы.<br>Пример:Bruce_Banner | nRP Drive.[/SIZE][/QUOTE][CENTER]<br>" +
		 "[CENTER][COLOR=rgb(211,47,47)][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
        "[CENTER][/CENTER]<br>" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
     {
    title: '------------------------------------------------------ Проблемы с доказательствами -------------------------------------------------------',
    dpstyle: 'oswald: 3px;     color: #000; background: #00FF7F; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #00FF7F',
     },
     {
	  title: 'Нужен фрапс',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(0, 250, 154, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER]В данном случае требуется Видеодоказательство на нарушение от игрока.[/CENTER]<br>" +
		"[CENTER]Создайте новую тему и прикрепите доказательства в виде видео, загруженные на любой хостинг.[/CENTER]<br>" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
{
	  title: 'Не те док-ва',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(0, 250, 154, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]NickName в доказательствах не соответствует указанному в жалобе.[/CENTER]<br>" +
        "[CENTER]Составьте жалобу корректно и создайте новую тему.[/CENTER]<br>" +
		 "[CENTER][COLOR=rgb(211,47,47)][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
     },
 {
	  title: 'Док-ва в соц сетях',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(0, 250, 154, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/CENTER]<br>" +
		 "[CENTER][COLOR=rgb(211,47,47)][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
 },
{
	  title: 'Удаление доказательств',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(0, 250, 154, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][QUOTE][SIZE=4]В ваших доказательствах установлен определённый срок храниения скриншотов<br>Просьба перезалить ваше доказательства в видеохостинг, который хранит скриншоты без срока(Imgur, Yandex Диск, Google Диск и тд.)<br>[/SIZE][/QUOTE][CENTER]<br>" +
        "[CENTER][COLOR=rgb(183, 166, 126)][ICODE]Отказано, закрыто[/ICODE][/COLOR][CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Док-ва удалены',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(0, 250, 154, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Доказательсва удалены или недоступны для просмотра.[/CENTER]<br>" +
		 "[CENTER][COLOR=rgb(211,47,47)][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
 },
    {
	  title: 'Недостаточно доказательств',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(0, 250, 154, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]В вашей жалобе недостаточно доказательств на нарушение игрока.<br>" +
		 "[CENTER][COLOR=rgb(211,47,47)][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
	    {
	  title: 'Ссылка не работает',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(0, 250, 154, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Ссылка с доказательствами нерабочая. Проверьте работоспособность ссылки и напишите новую жалобу.<br>" +
		 "[CENTER][COLOR=rgb(211,47,47)][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Доказательства отредактированы',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(0, 250, 154, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Видеодоказательства, которые были отредактированы и на которых присутствует посторонняя музыка, неадекватная речь, нецензурные слова или выражения, могут быть не рассмотрены в качестве доказательств.<br>" +
		 "[CENTER][COLOR=rgb(211,47,47)][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
     {
	  title: 'Фрапс обрывыется',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(0, 250, 154, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Доказателства в вашей жалобе обрываются. Загрузите полный фрагмент нарушения игрока на платформу YouTube и создайте новую жалобу.<br>" +
		 "[CENTER][COLOR=rgb(211,47,47)][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
        {
	  title: 'Отсутвуют док-ва',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(0, 250, 154, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]В вашей жалобе не загружены доказательства на нарушение игрока. Создайте новую жалобу, загрузив доказательства с нарушениями игрока.<br>" +
		"[CENTER][COLOR=rgb(211,47,47)][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
 {
	  title: 'Док-ва приватны',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(0, 250, 154, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]В вашей жалобе доказательства приватны. Создайте новую жалобу, загрузив доказательства с нарушениями игрока на любой другой хостинг.<br>" +
		 "[CENTER][COLOR=rgb(211,47,47)][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
{
	  title: 'Много игроков',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(0, 250, 154, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]В вашей жалобе указано более 2 двух нарушитель. На каждого игрока заливается отдельная жалоба. <br>" +
		"[CENTER][COLOR=rgb(211,47,47)][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
{
	  title: '---------------------------------------------------------- Правила Текстового Чата --------------------------------------------------------------',
      dpstyle: 'oswald: 3px;     color: #000; background: #00FFFF; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #00FFFF',
	},
     {
	  title: 'Редактирование в личных целях',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком |  [COLOR=rgb(183, 166, 126)][COLOR=rgb(183, 166, 126)]Ban 7 дней + ЧС организации. [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Слив глобал чата',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.08. Запрещены любые формы «слива» посредством использования глобальных чатов  |   [COLOR=rgb(183, 166, 126)][COLOR=rgb(183, 166, 126)]PermBan . [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
     {
	  title: 'CapsLock',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.02. Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате | [COLOR=rgb(183, 166, 126)]Mute 30 минут. [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'MG',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.18. Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе | [COLOR=rgb(183, 166, 126)]Mute 30 минут.[/SIZE][/QUOTE][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Оск адм / Неуваж к адм',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.54. Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации | [COLOR=rgb(183, 166, 126)]Mute 180 минут. [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Оскорбление в OCC',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.03. Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены  | [COLOR=rgb(183, 166, 126)]Mute 30 минут. [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Расизм',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.03. Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены | [COLOR=rgb(183, 166, 126)]Mute 30 минут. [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Упом/Оск Родни',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.04. Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) | [COLOR=rgb(183, 166, 126)]Mute 120 минут / Ban 7 - 15 дней. [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'FLOOD',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.05. Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока | [COLOR=rgb(183, 166, 126)]Mute 30 минут. [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Злоуп Символами',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.06. Запрещено злоупотребление знаков препинания и прочих символов | [COLOR=rgb(183, 166, 126)]Mute 30 минут. [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Заменя объявлений',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком | [COLOR=rgb(183, 166, 126)]Ban 7 дней + ЧС организации. [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Слив Глоб Чатов',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.08. Запрещены любые формы «слива» посредством использования глобальных чатов | [COLOR=rgb(183, 166, 126)]PermBan. [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Угрозы о наказании',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.09. Запрещены любые угрозы о наказании игрока со стороны администрации | [COLOR=rgb(183, 166, 126)]Mute 30 минут. [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},

 {
	  title: 'Выдача себя за адм',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.10. Запрещена выдача себя за администратора, если таковым не являетесь | [COLOR=rgb(183, 166, 126)]Ban 7 - 15 . [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Злоуп командами',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.11. Запрещено введение игроков проекта в заблуждение путем злоупотребления командами | [COLOR=rgb(183, 166, 126)]Ban 15 - 30 дней / PermBan. [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Наруш в репорт',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.12. Запрещено подавать репорт написанный транслитом, с сообщением не по теме (Offtop), с включенным Caps Lock и повторять обращение (если ответ был уже дан ранее) | [COLOR=rgb(183, 166, 126)]Report Mute 30 минут. [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Мат в репорт',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.13. Запрещено подавать репорт с использованием нецензурной брани | [COLOR=rgb(183, 166, 126)]Report Mute 30 минут. [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Музыка в Voice чат',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.14. Запрещено включать музыку в Voice Chat | [COLOR=rgb(183, 166, 126)]Mute 60 минут. [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'ОСК в Voice чат',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.15. Запрещено оскорблять игроков или родных в Voice Chat | [COLOR=rgb(183, 166, 126)]Mute 120 минут / Ban 7 - 15 дней. [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Шумы',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.16. Запрещено создавать посторонние шумы или звуки | [COLOR=rgb(183, 166, 126)]Mute 30 минут. [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Реклама в Voice чат',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.17. Запрещена реклама в Voice Chat не связанная с игровым процессом | [COLOR=rgb(183, 166, 126)]Ban 7 - 15 дней. [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Политика/Религия',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.18. Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов | [COLOR=rgb(183, 166, 126)]Mute 120 минут / Ban 10 дней. [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Софт для голоса',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.19. Запрещено использование любого софта для изменения голоса | [COLOR=rgb(183, 166, 126)]Mute 60 минут. [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Транслит',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.20. Запрещено использование транслита в любом из чатов | [COLOR=rgb(183, 166, 126)]Mute 30 минут. [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Реклама Промо',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.21. Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. | [COLOR=rgb(183, 166, 126)]Ban 30 дней. [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'ГОСС обьявления',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.22. Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) | [COLOR=rgb(183, 166, 126)]Mute 30 минут. [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Мат в VIP чат',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.23. Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате | [COLOR=rgb(183, 166, 126)]Mute 30 минут. [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
   {
	  title: '--------------------------------------------------------- Правила RolePlay Процесса -----------------------------------------------------------',
      dpstyle: 'oswald: 3px;     color: #000; background: #00FFFF; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #00FFFF',
       },
{
	  title: 'Помеха работе игрокам',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER]Ваша жалоба получает статус [COLOR=rgb(0, 255, 0)]Одобрено.[/CENTER][/COLOR]<br>" +
        "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.04. Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. | [COLOR=rgb(183, 166, 126)]Ban 10 дней / Обнуление аккаунта (при повторном нарушении)[/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
        "[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Сбив темпа стрельбы',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER]Ваша жалоба получает статус [COLOR=rgb(0, 255, 0)]Одобрено.[/CENTER][/COLOR]<br>" +
        "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.55. Запрещается багоюз связанный с анимацией в любых проявлениях. | [COLOR=rgb(183, 166, 126)]Jail 120 минут. [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
        "[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Помеха блогерам ',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER]Ваша жалоба получает статус [COLOR=rgb(0, 255, 0)]Одобрено.[/CENTER][/COLOR]<br>" +
        "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.12. Запрещена помеха в работе блогеров, стримеров (медиа лиц), которые находятся на официальном сотрудничестве с проектом  | [COLOR=rgb(183, 166, 126)]Ban 7 дней  [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
        "[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Постороннее ПО',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER]Ваша жалоба получает статус [COLOR=rgb(0, 255, 0)]Одобрено.[/CENTER][/COLOR]<br>" +
        "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками | [COLOR=rgb(183, 166, 126)]Ban 15 - 30 дней / PermBan.[/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
        "[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'nRP повидение',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.01. Запрещено поведение, нарушающее нормы процессов Role Play режима игры | [COLOR=rgb(183, 166, 126)]Jail 30 минут.[/SIZE][/QUOTE][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Уход от RP',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.02. Запрещено целенаправленно уходить от Role Play процесса всеразличными способами | [COLOR=rgb(183, 166, 126)]Jail 30 минут / Warn.[/SIZE][/QUOTE][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'NonRP Drive',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.03. Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере Примечание: нарушением считаются такие действия, как езда на скутере по горам, намеренное создание аварийных ситуаций при передвижении. Передвижение по полям на любом транспорте, за исключением кроссовых мотоциклов и внедорожников. | [COLOR=rgb(183, 166, 126)]Jail 30 минут.[/SIZE][/QUOTE][/CENTER] [/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Помеха RP',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.04. Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. | [COLOR=rgb(183, 166, 126)]Ban 10 дней / Обнуление аккаунта (при повторном нарушении).[/SIZE][/QUOTE][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Слив склада семьи',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.09. Запрещено сливать склад фракции / семьи путем взятия большого количества ресурсов или превышая допустимый лимит, установленный лидером | [COLOR=rgb(183, 166, 126)] Ban 15 - 30 дней / PermBan.[/SIZE][/QUOTE][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'nRP обман ',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.05.Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики | [COLOR=rgb(183, 166, 126)]PermBan.[/SIZE][/QUOTE][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Отыгровки в личных целях ',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.06. Запрещены любые Role Play отыгровки в свою сторону или пользу | [COLOR=rgb(183, 166, 126)]Jail 30 минут.[/SIZE][/QUOTE][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'AFK без ESC ',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.07. Запрещено нахождение в AFK без включенного ESC, создавая помеху другим игрокам | [COLOR=rgb(183, 166, 126)]Kick.[/SIZE][/QUOTE][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Аморальные действия',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.08. Запрещена любая форма аморальных действий сексуального характера в сторону игроков | [COLOR=rgb(183, 166, 126)]Jail 30 минут / Warn.[/SIZE][/QUOTE][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Провакация ГОСС/ ОПГ',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]Запрещена провокация ГОСС/ОПГ в различных формах | [COLOR=rgb(183, 166, 126)]Jail 30 минут.[/SIZE][/QUOTE][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Обман в /do ',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.10. Запрещено в любой форме обманывать в /do, даже если это в дальнейшем негативно скажется на Вашем игровом персонаже | [COLOR=rgb(183, 166, 126)]Jail 30 минут / Warn[/SIZE][/QUOTE][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Фракционный тс в личных целях ',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
	"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.11. Запрещено использование рабочего или фракционного транспорта в личных целях | [COLOR=rgb(183, 166, 126)]Jail 30 минут.[/SIZE][/QUOTE][/CENTER]<br>" +
	"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Затягивание RP',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
	"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.12. Запрещено целенаправленное затягивание Role Play процесса | [COLOR=rgb(183, 166, 126)]Jail 30 минут.[/SIZE][/QUOTE][/CENTER]<br>" +
	"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'DB ',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.13. Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта | [COLOR=rgb(183, 166, 126)]Jail 60 минут.[/SIZE][/QUOTE][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},

{
	  title: 'TK ',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.15. Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины | [COLOR=rgb(183, 166, 126)]Jail 60 минут / Warn (за два и более убийства).[/SIZE][/QUOTE][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'SK ',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.16. Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них | [COLOR=rgb(183, 166, 126)]Jail 60 минут / Warn (за два и более убийства).[/SIZE][/QUOTE][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'DM',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.19. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины | [COLOR=rgb(183, 166, 126)]Jail 60 минут.[/SIZE][/QUOTE][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Mass DM',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.20. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более | [COLOR=rgb(183, 166, 126)]Warn / Ban 3 - 7 дней.[/SIZE][/QUOTE][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Скрытие багов',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.23. Запрещено скрывать от администрации баги системы, а также распространять их игрокам | [COLOR=rgb(183, 166, 126)]Ban 15 - 30 дней / PermBan.[/SIZE][/QUOTE][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Скрытие от администрации нарушителей',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.24. Запрещено скрывать от администрации нарушителей или злоумышленников | [COLOR=rgb(183, 166, 126)]Ban 15 - 30 дней / PermBan + ЧС проекта.[/SIZE][/QUOTE][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Вред репутиции проекта',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.25. Запрещены попытки или действия, которые могут навредить репутации проекта | [COLOR=rgb(183, 166, 126)]PermBan + ЧС проекта.[/SIZE][/QUOTE][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Вред ресурсам проекта',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.26. Запрещено намеренно наносить вред ресурсам проекта (игровые серверы, форум, официальные Discord-серверы и так далее) | [COLOR=rgb(183, 166, 126)]PermBan + ЧС проекта.[/SIZE][/QUOTE][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Cлив админ инфы',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.27. Запрещено распространение информации и материалов, которые имеют непосредственное отношение к работе администрации проекта | [COLOR=rgb(183, 166, 126)]PermBan + ЧС проекта.[/SIZE][/QUOTE][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Реклама соц сетей',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.31. Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы, свой тег Telegram и Vkontakte. | [COLOR=rgb(183, 166, 126)]Ban 7 дней / PermBan.[/SIZE][/QUOTE][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: ' обман администрации',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.32. Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта | [COLOR=rgb(183, 166, 126)]Ban 7 - 15 дней.[/SIZE][/QUOTE][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'уязвимость правил',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.33. Запрещено пользоваться уязвимостью правил | [COLOR=rgb(183, 166, 126)]Ban 15 дней.[/SIZE][/QUOTE][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'уход от наказания',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.34. Запрещен уход от наказания | [COLOR=rgb(183, 166, 126)]Ban 15 - 30 дней (суммируется к общему наказанию дополнительно).[/SIZE][/QUOTE][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'конфликты о национальности',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.35. На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате | [COLOR=rgb(183, 166, 126)]Mute 120 минут / Ban 7 дней.[/SIZE][/QUOTE][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'перенос конфликтов из IC в OOC',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.36. Запрещено переносить конфликты из IC в OOC и наоборот | [COLOR=rgb(183, 166, 126)]Warn.[/SIZE][/QUOTE][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'OOC угрозы',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.37. Запрещены OOC угрозы, в том числе и завуалированные | [COLOR=rgb(183, 166, 126)]Mute 120 минут / Ban 7 дней.[/SIZE][/QUOTE][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'распространение личной информации',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.38. Запрещено распространять личную информацию игроков и их родственников | [COLOR=rgb(183, 166, 126)]Ban 15 - 30 дней / PermBan.[/SIZE][/QUOTE][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Злоупотребление нарушениями',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.39. Злоупотребление нарушениями правил сервера | [COLOR=rgb(183, 166, 126)]Ban 7 - 30 дней.[/SIZE][/QUOTE][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Критика проекта',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.40. Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе | [COLOR=rgb(183, 166, 126)]Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором).[/SIZE][/QUOTE][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'nRP сон',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.44. На серверах проекта запрещен Role Play сон (нахождение в AFK без ESC) | [COLOR=rgb(183, 166, 126)]Kick.[/SIZE][/QUOTE][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'ЕПП',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.46. Запрещено ездить по полям на любом транспорте | [COLOR=rgb(183, 166, 126)]Jail 30 минут.[/SIZE][/QUOTE][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'ЕПП инко/дальнобощика',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.47. Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) | [COLOR=rgb(183, 166, 126)]Jail 60 минут.[/SIZE][/QUOTE][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Аресты в интерьере',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.50. Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий | [COLOR=rgb(183, 166, 126)]Ban 7 - 15 дней + увольнение из организации.[/SIZE][/QUOTE][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'nRP аксессуар',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.52. Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. | [COLOR=rgb(183, 166, 126)]При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут.[/SIZE][/QUOTE][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Оск адм',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.54. Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации | [COLOR=rgb(183, 166, 126)]Mute 180 минут.[/SIZE][/QUOTE][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Багаюз с аним',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.55. Запрещается багоюз связанный с анимацией в любых проявлениях. | [COLOR=rgb(183, 166, 126)]Jail 60 / 120 минут.[/SIZE][/QUOTE][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'NRP ВЧ',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2. За нарушение правил нападения на Военную Часть выдаётся предупреждение | [COLOR=rgb(183, 166, 126)]Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ)[/SIZE][/QUOTE][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'NRP розыск штраф и тд',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]Запрещено выдавать розыск, штраф и изымать права без Role Play причины  | [COLOR=rgb(183, 166, 126)]Warn [/SIZE][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'NRP Поведение полицейский.',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]Запрещено NonRP поведение.<br>[QUOTE][SIZE=4]Пример: открытие огня по игрокам без причины, расстрел машин без причины, нарушение ПДД без причины, сотрудник на служебном транспорте кричит о наборе в свою семью на спавне  | [COLOR=rgb(183, 166, 126)]Warn [/SIZE][/QUOTE][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Одиночный Патруль ГОСС',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(64, 224, 208, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]Всем силовым структурам запрещен одиночный патруль или конвоирование, минимум 2 сотрудника | [COLOR=rgb(183, 166, 126)]Jail 30 минут  [/SIZE][/QUOTE][/CENTER]<br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
     {
    title: '-------------------------------------------------------------- RolePlay Биографии -------------------------------------------------------------------',
    dpstyle: 'oswald: 3px;     color: #fff; background: #9400D3; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #9400D3',
	},
     {
	  title: 'Биография одобрена',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(139, 0, 139, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Ваша RolePlay биография получает статус [COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR] <br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'Биография отказана',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(147, 112, 219, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		 "[CENTER][COLOR=rgb(211,47,47)][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Мало инфо',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(147, 112, 219, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Ваша RolePlay биография получает статус Отказано, т.к. она содержит мало информации. <br>" +
		 "[CENTER][COLOR=rgb(211,47,47)][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Дата несходится',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(147, 112, 219, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Ваша RolePlay биография получает статус Отказано, т.к. дата рождения не сходится с возрастом или написана не полностью. <br>" +
		 "[CENTER][COLOR=rgb(211,47,47)][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Дубликат',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(147, 112, 219, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Ваша RolePlay биография получает статус Отказано, т.к. можно иметь только 1 RolePlay биографию на один аккаунт. <br>" +
		 "[CENTER][COLOR=rgb(211,47,47)][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: '3-е лицо',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(147, 112, 219, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Ваша RolePlay биография получает статус Отказано, т.к. она написана от третьего лица. <br>" +
		 "[CENTER][COLOR=rgb(211,47,47)][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Супер способности',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(147, 112, 219, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Ваша RolePlay биография получает статус Отказано, т.к. вы присвоили своему персонажу супер-способности. <br>" +
		 "[CENTER][COLOR=rgb(211,47,47)][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
     {
	  title: 'Заголовок',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(147, 112, 219, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Ваша RolePlay биография получает статус Отказано, т.к. заголовок написан не по форме. <br>" +
		 "[CENTER][COLOR=rgb(211,47,47)][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Ошибки',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(147, 112, 219, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
	"[CENTER]Ваша RolePlay биография получает статус Отказано, т.к. в ней содержится много грамматических ошибок. <br>" +
	 "[CENTER][COLOR=rgb(211,47,47)][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Коппипаст',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(147, 112, 219, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
	"[CENTER]Ваша RolePlay биография получает статус Отказано, т.к. она скопирована. <br>" +
	 "[CENTER][COLOR=rgb(211,47,47)][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
     {
	  title: 'ОФФТОП',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(147, 112, 219, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
	"[CENTER]Ваша тема не относится к данному разделу. <br>" +
	 "[CENTER][COLOR=rgb(211,47,47)][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
     {
	  title: 'Неадекватная Биография',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(147, 112, 219, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
	 "[CENTER][COLOR=rgb(211,47,47)][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
   {
	  title: 'Повтор',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(147, 112, 219, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Ваша RolePlay биография получает статус Отказано, т.к. ответ был дан в предыдущей теме. <br>" +
		 "[CENTER][COLOR=rgb(211,47,47)][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
     {
	  title: 'не по форме',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(147, 112, 219, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER]Ваша Role Play Биография составлена не по форме.<br>" +
		"[CENTER]Создайте новую Биографию по форме.<br>" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
     {
    title: '------------------------------------------------------------------ RolePlay Ситуации -----------------------------------------------------------------',
    dpstyle: 'oswald: 3px;     color: #fff; background: #9400D3; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #9400D3',
	},
    {
	  title: 'Ситуация одобрена',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(139, 0, 139, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Ваша RolePlay ситуация получает статус [COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR] <br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'Ситуация отказана',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(147, 112, 219, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Ваша RolePlay ситуация получает статус [COLOR=rgb(183, 166, 126)][COLOR=rgb(211,47,47)]Отказано.[/COLOR][/COLOR] <br>" +
		 "[CENTER][COLOR=rgb(211,47,47)][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
     {
    title: '--------------------------------------------------------- Неоф. RolePlay организация -----------------------------------------------------------',
    dpstyle: 'oswald: 3px;     color: #fff; background: #9400D3; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #9400D3',
	},
     {
	  title: 'Орг-ция одобрена',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(139, 0, 139, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Ваша Неофициальная RolePlay организация получает статус [COLOR=rgb(0, 255, 0)][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/COLOR] <br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'Орг-ция отказана',
      dpstyle: 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(147, 112, 219, 0.5); font-family: Verdana',
	  content:
		'[SIZE=4][FONT=Verdana][CENTER][I][B][I][COLOR=rgb(183, 166, 126)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Ваша Неофициальная RolePlay организация получает статус [COLOR=rgb(211,47,47)]Отказано.[/COLOR] <br>" +
		 "[CENTER][COLOR=rgb(211,47,47)][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Verdana][CENTER]Приятной игры на сервере [COLOR=rgb(183, 166, 126)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
];

$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');


// addButton('На рассмотрение', 'pin');
// addButton('Тех. спецу', 'tech');
	addButton('На рассмотрении', 'pin', 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(255,165,0, 0.5);');
    addButton('Отказано', 'unaccept', 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(255, 36, 0, 0.5);')
    addButton('Одобрено', 'accepted', 'Verdana: 13px; margin-right: 5px;border: 2pxsolid; color: rgb(152, 251, 152, 0.5);')
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
		$('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswer" style="oswald: 3px; margin-left: 5px; margin-top: 10px; Verdana: 13px;">ОТВЕТЫ</button>`,
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
(function() {
    const imageUrl = 'https://i.postimg.cc/C50nsb6H/176172-vashe-imya-miyamizu-mitsuha-taki-tachibana-poster-anime-art-3840x2160.jpg' //сюда ссылку на фотку/гифку которую тебе надо на фон
    function changeBackground() {
        document.body.style.backgroundImage = `url('${imageUrl}')`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundAttachment = 'fixed';
    }
    changeBackground();
})();