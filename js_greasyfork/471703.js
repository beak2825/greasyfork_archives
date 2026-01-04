// ==UserScript==
// @name         Black Russia Скрипт by Evgeniy_Yurievich | Khabarovsk <3
// @description  Для Кураторов Форума
// @namespace    https://forum.blackrussia.online
// @version      1.0.4
// @author       Evgeniy_Yurievich
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @icon https://icons.iconarchive.com/icons/thesquid.ink/free-flat-sample/128/support-icon.png
// @downloadURL https://update.greasyfork.org/scripts/471703/Black%20Russia%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20by%20Evgeniy_Yurievich%20%7C%20Khabarovsk%20%3C3.user.js
// @updateURL https://update.greasyfork.org/scripts/471703/Black%20Russia%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20by%20Evgeniy_Yurievich%20%7C%20Khabarovsk%20%3C3.meta.js
// ==/UserScript==
 
(function () {
  'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const buttons = [
	{
	  title: 'На рассмотрении',
      content:
'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Ваша Жалоба направляется на Рассмотрение.[/I]<br><br>' +
'[COLOR=rgb(255, 255, 255)][B][I]Ожидайте ответа...[/I][/B]<br><br>' +
'[B][CENTER][COLOR=yellow][ICODE]На рассмотрение[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: PIN_PREFIX,
	  status: true,
    },
    {
      title: 'отказано',
      content:
'[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color]<br><br>' +
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
          status: false,
    },
    {
      title: 'одобрено',
      content:
'[Color=Green][CENTER]Одобрено, закрыто.[/CENTER][/color]<br><br>' +
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '---------------------------------------------------------------RP Биографии---------------------------------------------------------------',
    },
    {
	  title: 'Одобрена',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография одобрена.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Биография получает статус: <br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Nf8P9sXH/1618083711121.png[/img][/url]<br>' +
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'На доработке',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]В вашей RolePlay - биографии недостаточно информации. Даю вам 24 часа на ее дополнение/ исправление, иначе РП биография будет отказана.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Биография получает статус: <br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Nf8P9sXH/1618083711121.png[/img][/url]<br>' +
'[B][CENTER][COLOR=yellow][ICODE]На рассмотрении[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: PIN_PREFIX,
	  status: false,
    },
    {
	  title: 'Скопрована',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография скопирована.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Биография получает статус: <br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Nf8P9sXH/1618083711121.png[/img][/url]<br>' +
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
	  title: 'Дата не подходит',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Ваш возраст не совпадает с датой рождения.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Биография получает статус: <br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Nf8P9sXH/1618083711121.png[/img][/url]<br>' +
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
	  title: 'Заголовок не по форме',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Заголовок в вашей биографии составлен не по форме.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Биография получает статус: <br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Nf8P9sXH/1618083711121.png[/img][/url]<br>' +
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
	  title: 'Не по форме',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к она составлена не по форме.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Биография получает статус: <br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Nf8P9sXH/1618083711121.png[/img][/url]<br>' +
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
	  title: 'Мало информации',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к в ней мало информации.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Биография получает статус: <br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Nf8P9sXH/1618083711121.png[/img][/url]<br>' +
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
	  title: 'Много ошибок',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к в ней много ошибок.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Биография получает статус: <br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Nf8P9sXH/1618083711121.png[/img][/url]<br>' +
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
	  title: 'От 3-его лица',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к она написана от 3-его лица.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Биография получает статус: <br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Nf8P9sXH/1618083711121.png[/img][/url]<br>' +
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
	  title: 'Уже одобрена',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к она уже одобрена.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Биография получает статус: <br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Nf8P9sXH/1618083711121.png[/img][/url]<br>' +
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
	  title: 'Ник на англ',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к ваш NickName должен быть написан на русском языке.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Биография получает статус: <br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Nf8P9sXH/1618083711121.png[/img][/url]<br>' +
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
	  title: 'Нон рп ник',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к у вас NonRP NickName.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Биография получает статус: <br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Nf8P9sXH/1618083711121.png[/img][/url]<br>' +
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
	  title: 'Дата рождения не дописана',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к ваша дата рождения расписана не полностью.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Биография получает статус: <br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Nf8P9sXH/1618083711121.png[/img][/url]<br>' +
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
	  title: 'Супергерой',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к вы приписали суперспособности своему персонажу.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Биография получает статус: <br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Nf8P9sXH/1618083711121.png[/img][/url]<br>' +
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
     title: '---------------------------------------------------------------RP Ситуэйшен---------------------------------------------------------------',
    },
    {
	  title: 'Одобрена',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация одобрена.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Ситуация получает статус: <br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Nf8P9sXH/1618083711121.png[/img][/url]<br>' +
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
          title: 'Не по форме',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация отказана т.к она составлена не по форме.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - ситуаций закрепленные в данном разделе.<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Ситуация получает статус: <br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Nf8P9sXH/1618083711121.png[/img][/url]<br>' +
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
          title: 'Отказано',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация отказана.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - ситуаций закрепленные в данном разделе.<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Ситуация получает статус: <br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Nf8P9sXH/1618083711121.png[/img][/url]<br>' +
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
	  title: 'Ник на англ',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация отказана т.к ваш NickName должен быть написан на русском языке.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - ситуаций закрепленные в данном разделе.<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Ситуация получает статус: <br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Nf8P9sXH/1618083711121.png[/img][/url]<br>' +
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
	  title: 'Скопрована',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация скопирована.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - ситуаций закрепленные в данном разделе.<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Ситуация получает статус: <br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Nf8P9sXH/1618083711121.png[/img][/url]<br>' +
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
	  title: 'Много ошибок',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация отказана т.к в ней много ошибок.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - ситуаций закрепленные в данном разделе.<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Ситуация получает статус: <br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Nf8P9sXH/1618083711121.png[/img][/url]<br>' +
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
	  title: 'Заголовок не по форме',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Заголовок в вашей ситуации составлен не по форме.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - ситуаций закрепленные в данном разделе.<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Ситуация получает статус: <br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Nf8P9sXH/1618083711121.png[/img][/url]<br>' +
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
          title: 'Не сюда',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Обратитесь в нужный вам раздел.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Ситуация получает статус: <br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Nf8P9sXH/1618083711121.png[/img][/url]<br>' +
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
     title: '---------------------------------------------------------------RP Организейшен---------------------------------------------------------------',
    },
    {
	  title: 'Одобрена',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay - организация одобрена.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Организация получает статус: <br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Nf8P9sXH/1618083711121.png[/img][/url]<br>' +
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
          title: 'Отказано',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay - организация отказана.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Организация получает статус: <br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Nf8P9sXH/1618083711121.png[/img][/url]<br>' +
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
];
 
$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
	// Добавление кнопок при загрузке страницы
	addButton('Click', 'selectAnswer');
 
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