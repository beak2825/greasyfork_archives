// ==UserScript==
// @name BRATSK | Скрипт для проверки РП разделов (ОНЛИ ТЕЛЕФОН)
// @namespace https://forum.blackrussia.online
// @version 2.3
// @description Best Curators
// @author Clarence Lemonte
// @updateversion Создан 10 Мая
// @match https://forum.blackrussia.online/threads/*
// @include https://forum.blackrussia.online/threads/
// @grant none
// @license MIT
// @copyright 2024,
// @icon https://forum.blackrussia.online/account/avatar
// @downloadURL https://update.greasyfork.org/scripts/500002/BRATSK%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%BF%D1%80%D0%BE%D0%B2%D0%B5%D1%80%D0%BA%D0%B8%20%D0%A0%D0%9F%20%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB%D0%BE%D0%B2%20%28%D0%9E%D0%9D%D0%9B%D0%98%20%D0%A2%D0%95%D0%9B%D0%95%D0%A4%D0%9E%D0%9D%29.user.js
// @updateURL https://update.greasyfork.org/scripts/500002/BRATSK%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%BF%D1%80%D0%BE%D0%B2%D0%B5%D1%80%D0%BA%D0%B8%20%D0%A0%D0%9F%20%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB%D0%BE%D0%B2%20%28%D0%9E%D0%9D%D0%9B%D0%98%20%D0%A2%D0%95%D0%9B%D0%95%D0%A4%D0%9E%D0%9D%29.meta.js
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
    title: '-------------------- RolePlay Биографии ---------------------',
    dpstyle: 'oswald: 3px;     color: #fff; background: #9400D3; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #9400D3',
	},
     {
	  title: 'Биография одобрена',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(139, 0, 139, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Times New Roman][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimg.cc/bszyDf1G][img]https://i.postimg.cc/fTdJPwLv/Picsart-24-05-10-13-21-41-387.png[/img][/url]<br>"+
		"[CENTER]Ваша RolePlay биография получает статус [COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR] <br>" +
        "[CENTER][url=https://postimg.cc/bszyDf1G][img]https://i.postimg.cc/fTdJPwLv/Picsart-24-05-10-13-21-41-387.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(222, 184, 135)]Bratsk(74).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'Биография отказана',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(147, 112, 219, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Times New Roman][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimg.cc/bszyDf1G][img]https://i.postimg.cc/fTdJPwLv/Picsart-24-05-10-13-21-41-387.png[/img][/url]<br>"+
		"[CENTER]Ваша RolePlay биография получает статус [COLOR=rgb(255, 0, 0)]Отказано.[/COLOR] <br>" +
        "[CENTER][url=https://postimg.cc/bszyDf1G][img]https://i.postimg.cc/fTdJPwLv/Picsart-24-05-10-13-21-41-387.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(222, 184, 135)]Bratsk(74).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Мало инфо',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(147, 112, 219, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Times New Roman][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimg.cc/bszyDf1G][img]https://i.postimg.cc/fTdJPwLv/Picsart-24-05-10-13-21-41-387.png[/img][/url]<br>"+
		"[CENTER]Ваша RolePlay биография получает статус Отказано, т.к. она содержит мало информации. <br>" +
        "[CENTER][url=https://postimg.cc/bszyDf1G][img]https://i.postimg.cc/fTdJPwLv/Picsart-24-05-10-13-21-41-387.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(222, 184, 135)]Bratsk(74).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Дата несходится',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(147, 112, 219, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Times New Roman][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimg.cc/bszyDf1G][img]https://i.postimg.cc/fTdJPwLv/Picsart-24-05-10-13-21-41-387.png[/img][/url]<br>"+
		"[CENTER]Ваша RolePlay биография получает статус Отказано, т.к. дата рождения не сходится с возрастом или написана не полностью. <br>" +
        "[CENTER][url=https://postimg.cc/bszyDf1G][img]https://i.postimg.cc/fTdJPwLv/Picsart-24-05-10-13-21-41-387.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(222, 184, 135)]Bratsk(74).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Дубликат',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(147, 112, 219, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Times New Roman][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimg.cc/bszyDf1G][img]https://i.postimg.cc/fTdJPwLv/Picsart-24-05-10-13-21-41-387.png[/img][/url]<br>"+
		"[CENTER]Ваша RolePlay биография получает статус Отказано, т.к. можно иметь только 1 RolePlay биографию на один аккаунт. <br>" +
        "[CENTER][url=https://postimg.cc/bszyDf1G][img]https://i.postimg.cc/fTdJPwLv/Picsart-24-05-10-13-21-41-387.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(222, 184, 135)]Bratsk(74).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: '3-е лицо',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(147, 112, 219, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Times New Roman][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimg.cc/bszyDf1G][img]https://i.postimg.cc/fTdJPwLv/Picsart-24-05-10-13-21-41-387.png[/img][/url]<br>"+
		"[CENTER]Ваша RolePlay биография получает статус Отказано, т.к. она написана от третьего лица. <br>" +
        "[CENTER][url=https://postimg.cc/bszyDf1G][img]https://i.postimg.cc/fTdJPwLv/Picsart-24-05-10-13-21-41-387.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(222, 184, 135)]Bratsk(74).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Супер способности',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(147, 112, 219, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Times New Roman][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimg.cc/bszyDf1G][img]https://i.postimg.cc/fTdJPwLv/Picsart-24-05-10-13-21-41-387.png[/img][/url]<br>"+
		"[CENTER]Ваша RolePlay биография получает статус Отказано, т.к. вы присвоили своему персонажу супер-способности. <br>" +
        "[CENTER][url=https://postimg.cc/bszyDf1G][img]https://i.postimg.cc/fTdJPwLv/Picsart-24-05-10-13-21-41-387.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(222, 184, 135)]Bratsk(74).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
     {
	  title: 'Заголовок',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(147, 112, 219, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Times New Roman][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimg.cc/bszyDf1G][img]https://i.postimg.cc/fTdJPwLv/Picsart-24-05-10-13-21-41-387.png[/img][/url]<br>"+
		"[CENTER]Ваша RolePlay биография получает статус Отказано, т.к. заголовок написан не по форме. <br>" +
        "[CENTER][url=https://postimg.cc/bszyDf1G][img]https://i.postimg.cc/fTdJPwLv/Picsart-24-05-10-13-21-41-387.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(222, 184, 135)]Bratsk(74).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Ошибки',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(147, 112, 219, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Times New Roman][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimg.cc/bszyDf1G][img]https://i.postimg.cc/fTdJPwLv/Picsart-24-05-10-13-21-41-387.png[/img][/url]<br>"+
		"[CENTER]Ваша RolePlay биография получает статус Отказано, т.к. в ней содержится много грамматических ошибок. <br>" +
        "[CENTER][url=https://postimg.cc/bszyDf1G][img]https://i.postimg.cc/fTdJPwLv/Picsart-24-05-10-13-21-41-387.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(222, 184, 135)]Bratsk(74).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Коппипаст',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(147, 112, 219, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Times New Roman][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimg.cc/bszyDf1G][img]https://i.postimg.cc/fTdJPwLv/Picsart-24-05-10-13-21-41-387.png[/img][/url]<br>"+
		"[CENTER]Ваша RolePlay биография получает статус Отказано, т.к. она скопирована. <br>" +
        "[CENTER][url=https://postimg.cc/bszyDf1G][img]https://i.postimg.cc/fTdJPwLv/Picsart-24-05-10-13-21-41-387.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(222, 184, 135)]Bratsk(74).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
     {
	  title: 'ОФФТОП',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(147, 112, 219, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Times New Roman][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimg.cc/bszyDf1G][img]https://i.postimg.cc/fTdJPwLv/Picsart-24-05-10-13-21-41-387.png[/img][/url]<br>"+
		"[CENTER]Ваша тема не относится к данному разделу. <br>" +
        "[CENTER][url=https://postimg.cc/bszyDf1G][img]https://i.postimg.cc/fTdJPwLv/Picsart-24-05-10-13-21-41-387.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(222, 184, 135)]Bratsk(74).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
     {
	  title: 'Неадекватная Биография',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(147, 112, 219, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Times New Roman][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimg.cc/bszyDf1G][img]https://i.postimg.cc/fTdJPwLv/Picsart-24-05-10-13-21-41-387.png[/img][/url]<br>"+
		"[CENTER] Ваша RolePlay биография получает статус Отказано, т.к. в ней присутвует нецензурная брань или же оскорбления. <br>" +
        "[CENTER][url=https://postimg.cc/bszyDf1G][img]https://i.postimg.cc/fTdJPwLv/Picsart-24-05-10-13-21-41-387.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(222, 184, 135)]Bratsk(74).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
   {
	  title: 'Повтор',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(147, 112, 219, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Times New Roman][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimg.cc/bszyDf1G][img]https://i.postimg.cc/fTdJPwLv/Picsart-24-05-10-13-21-41-387.png[/img][/url]<br>"+
		"[CENTER]Ваша RolePlay биография получает статус Отказано, т.к. ответ был дан в предыдущей теме. <br>" +
        "[CENTER][url=https://postimg.cc/bszyDf1G][img]https://i.postimg.cc/fTdJPwLv/Picsart-24-05-10-13-21-41-387.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(222, 184, 135)]Bratsk(74).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
     {
	  title: 'не по форме',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(147, 112, 219, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Times New Roman][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimg.cc/bszyDf1G][img]https://i.postimg.cc/fTdJPwLv/Picsart-24-05-10-13-21-41-387.png[/img][/url]<br>"+
        "[CENTER]Ваша Role Play Биография составлена не по форме.<br>" +
		"[CENTER]Создайте новую Биографию по форме.<br>" +
         "[CENTER][url=https://postimg.cc/bszyDf1G][img]https://i.postimg.cc/fTdJPwLv/Picsart-24-05-10-13-21-41-387.png[/img][/url]<br>"+
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(222, 184, 135)]Bratsk(74).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
     {
    title: '---------------------- RolePlay Ситуации ---------------------',
    dpstyle: 'oswald: 3px;     color: #fff; background: #9400D3; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #9400D3',
	},
    {
	  title: 'Ситуация одобрена',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(139, 0, 139, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Times New Roman][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimg.cc/bszyDf1G][img]https://i.postimg.cc/fTdJPwLv/Picsart-24-05-10-13-21-41-387.png[/img][/url]<br>"+
		"[CENTER]Ваша RolePlay ситуация получает статус [COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR] <br>" +
        "[CENTER][url=https://postimg.cc/bszyDf1G][img]https://i.postimg.cc/fTdJPwLv/Picsart-24-05-10-13-21-41-387.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(222, 184, 135)]Bratsk(74).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'Ситуация отказана',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(147, 112, 219, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Times New Roman][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimg.cc/bszyDf1G][img]https://i.postimg.cc/fTdJPwLv/Picsart-24-05-10-13-21-41-387.png[/img][/url]<br>"+
		"[CENTER]Ваша RolePlay ситуация получает статус [COLOR=rgb(255, 0, 0)][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/COLOR] <br>" +
        "[CENTER][url=https://postimg.cc/bszyDf1G][img]https://i.postimg.cc/fTdJPwLv/Picsart-24-05-10-13-21-41-387.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(222, 184, 135)]Bratsk(74).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
     {
    title: '------------- Неоф. RolePlay организация -------------',
    dpstyle: 'oswald: 3px;     color: #fff; background: #9400D3; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #9400D3',
	},
     {
	  title: 'Орг-ция одобрена',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(139, 0, 139, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Times New Roman][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimg.cc/bszyDf1G][img]https://i.postimg.cc/fTdJPwLv/Picsart-24-05-10-13-21-41-387.png[/img][/url]<br>"+
		"[CENTER]Ваша Неофициальная RolePlay организация получает статус [COLOR=rgb(0, 255, 0)][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/COLOR] <br>" +
        "[CENTER][url=https://postimg.cc/bszyDf1G][img]https://i.postimg.cc/fTdJPwLv/Picsart-24-05-10-13-21-41-387.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(222, 184, 135)]Bratsk(74).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'Орг-ция отказана',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(147, 112, 219, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Times New Roman][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimg.cc/bszyDf1G][img]https://i.postimg.cc/fTdJPwLv/Picsart-24-05-10-13-21-41-387.png[/img][/url]<br>"+
		"[CENTER]Ваша Неофициальная RolePlay организация получает статус [COLOR=rgb(255, 0, 0)]Отказано.[/COLOR] <br>" +
        "[CENTER][url=https://postimg.cc/bszyDf1G][img]https://i.postimg.cc/fTdJPwLv/Picsart-24-05-10-13-21-41-387.png[/img][/url]<br>"+
		"[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Times New Roman][CENTER]Приятной игры на сервере [COLOR=rgb(222, 184, 135)]Bratsk(74).[/COLOR][/CENTER][/FONT]',
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