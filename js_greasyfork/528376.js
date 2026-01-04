// ==UserScript==
// @name         Кураторы Форума Мурманск общий by Novlev.
// @namespace    https://forum.blackrussia.online
// @version      1.1
// @description  Общий скрипт
// @author       E.Novlev
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license    MIT
// @icon         https://sun9-76.userapi.com/impg/rEBGQfiaFZnbUofS8UOFXmokbnWSxJaLR-1Ycg/rxEn_aPc0wc.jpg?size=530x530&quality=95&sign=9ca94b62b95b588d510bc19a4290a530&type=album
// @downloadURL https://update.greasyfork.org/scripts/528376/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%D0%9C%D1%83%D1%80%D0%BC%D0%B0%D0%BD%D1%81%D0%BA%20%D0%BE%D0%B1%D1%89%D0%B8%D0%B9%20by%20Novlev.user.js
// @updateURL https://update.greasyfork.org/scripts/528376/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%D0%9C%D1%83%D1%80%D0%BC%D0%B0%D0%BD%D1%81%D0%BA%20%D0%BE%D0%B1%D1%89%D0%B8%D0%B9%20by%20Novlev.meta.js
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
const OTKAZBIO_PREFIX = 4;
const ODOBRENOBIO_PREFIX = 8;
const NARASSMOTRENIIBIO_PREFIX = 2;
const OTKAZRP_PREFIX = 4;
const ODOBRENORP_PREFIX = 8;
const NARASSMOTRENIIRP_PREFIX = 2;
const OTKAZORG_PREFIX = 4;
const ODOBRENOORG_PREFIX = 8;
const NARASSMOTRENIIORG_PREFIX = 2;
const buttons = [
    {
     title: '- - - - - - - - - - - - - - - - - - - -  - - - - - - - - - ✈ Быстрые ответы ✈ - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
  {
      title: 'Отказано, закрыто',
      content:
    '[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FF0000][ICODE]Ваша жалоба отказана[/ICODE][/COLOR][/CENTER]<br>" +
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]★ Отказано, ❤ Закрытоッ ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Одобрено, закрыто',
      content:
'[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
       '[CENTER][COLOR=#FFD700][ICODE]Ваша жалоба одобренна[/ICODE][/COLOR][/CENTER]' +
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]★ Одобрено ✔ ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
    {
      title: 'На рассмотрении...',
      content:
      '[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
      "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
       '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        "[CENTER][COLOR=#7FFF00][ICODE]Взял вашу жалобу на рассмотрение.<br>Просьба ожидать ответа и не создавать дубликаты данной темы.[/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
		'[Color=#00FFFF][CENTER][ICODE]Ожидайте ответа.[/ICODE][/COLOR][/CENTER]'+
         '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
      '[B][Color=#00FFFF][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/COLOR][/CENTER][/B]'+
       '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>',
      prefix: PINN_PREFIX,
	  status: false,
    },
  {
      title: 'На рассмотрении вар 2',
      content:
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XN5GkbJT/2021-07-20-09-08-50.png[/img][/url][/CENTER]<br>'+
      "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
       '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        "[CENTER][COLOR=#7FFF00][ICODE]Взял вашу жалобу на рассмотрение.<br>Просьба ожидать ответа и не создавать дубликаты данной темы.[/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
		'[Color=#00FFFF][CENTER][ICODE]Ожидайте ответа.[/ICODE][/COLOR][/CENTER]'+
         '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
      '[B][Color=#00FFFF][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/COLOR][/CENTER][/B]'+
       '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>',
      prefix: PINN_PREFIX,
	  status: false,
    },
   {
     title: '- - - - - - - - - - - - - - - - - - - -  - - - - - - - - - 💙Передача жалобы💙 - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
    {
      title: 'Техническому специалисту',
      content:
	 '[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
      "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
       '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        "[CENTER][COLOR=#7FFF00][ICODE]Передал вашу жалобу на рассмотрение Техническому специалисту.<br>Просьба ожидать ответа и не создавать дубликаты данной темы.[/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
		'[Color=#00FFFF][CENTER][ICODE]Ожидайте ответа.[/ICODE][/COLOR][/CENTER]'+
         '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
      '[B][Color=#00FFFF][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/COLOR][/CENTER][/B]'+
       '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>',
      prefix: TEXY_PREFIX,
	  status: true,
    },
    {
      title: 'Передано ГКФ / ЗГКФ',
      content:
		 '[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
      "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
       '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        "[CENTER][COLOR=#7FFF00][ICODE]Передал вашу жалобу на рассмотрение ГКФ / ЗГКФ.<br>Просьба ожидать ответа и не создавать дубликаты данной темы.[/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
		'[Color=#00FFFF][CENTER][ICODE]Ожидайте ответа.[/ICODE][/COLOR][/CENTER]'+
         '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
      '[B][Color=#00FFFF][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/COLOR][/CENTER][/B]'+
       '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>',
      prefix: PINN_PREFIX,
	  status: false,
    },
   {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴❌Жалоба отказана❌╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
   {
      title: 'Не логируется',
      content: '[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        "[CENTER][COLOR=#7FFF00][ICODE]Проверив базу логирования, ничего не выявил.<br>Игрок не может быть наказан.[/ICODE][/COLOR][/CENTER]<br>" +
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]★ Отказано, ❤ Закрытоッ ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Нарушений не найдено',
	  content:
		'[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        "[CENTER][COLOR=#7FFF00][ICODE]Нарушений со стороны данного игрока не обнаружил.<br>Игрок не может быть наказан.[/ICODE][/COLOR][/CENTER]<br>" +
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]★ Отказано, ❤ Закрытоッ ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Ответ дан в прошлой ЖБ',
	  content:
	'[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        "[CENTER][COLOR=#7FFF00][ICODE]Ответ был дан в прошлой жалобе.[/ICODE][/COLOR][/CENTER]<br>" +
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]★ Закрытоッ ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Недостаточно доказательств',
      content:
	'[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        "[CENTER][COLOR=#7FFF00][ICODE]Недостаточно доказательств на нарушение от данного игрока.<br>Доказательства должны быть предоставлены в хорошем качестве и с полным процессом сделки или нарушения от какого-либо игрока.[/ICODE][/COLOR][/CENTER]<br>" +
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]★ Отказано, ❤ Закрытоッ ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Дублирование темы',
      content:
	'[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
       '[Color=AQUA][CENTER][ICODE]Дублирование темы[/ICODE][/CENTER][/color]' +
        "[CENTER][COLOR=#FF0000][ICODE]Если вы дальше будете заниматься данной деятельностью (дублированием тем), то ваш форумный аккаунт будет заблокирован.[/ICODE][/COLOR][/CENTER]<br>" +
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]★ Отказано, ❤ Закрытоッ ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'В жб на адм',
      content:
			'[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        "[CENTER][COLOR=#7FFF00]Вы ошиблись разделом.<br>Обратитесь в раздел [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.2372/']Жалобы на администрацию[/URL].[/COLOR][/CENTER]<br>" +
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]★ Закрытоッ ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'В обжалования',
      content:
		'[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        "[CENTER][COLOR=#7FFF00]Вы ошиблись разделом.<br>Обратитесь в раздел [URL='https://forum.blackrussia.online/forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.2375/']Обжалование наказаний[/URL].[/COLOR][/CENTER]<br>" +
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]★ Закрытоッ ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Форма темы',
      content:
	'[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        "[CENTER][COLOR=#7FFF00]Ваша жалоба составлена не по форме.<br>Убедительная просьба ознакомиться [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/']с правилами подачи жалоб на игроков[/URL].[/CENTER]<br>" +
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]★ Отказано, ❤ Закрытоッ ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
	{
	  title: 'Нету /time',
	  content:
			'[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        "[CENTER][COLOR=#7FFF00][ICODE]На ваших доказательствах отсутствует /time.[/ICODE][/COLOR][/CENTER]<br>" +
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]★ Отказано, ❤ Закрытоッ ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Укажите тайм-коды',
	  content:
		'[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FF0000][ICODE]В течении 24х часов укажите тайм-коды, иначе жалоба будет отказана.[/ICODE][/COLOR][/CENTER]<br>" +
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#00FFFF][FONT=times new roman][CENTER][I][ICODE]★ Ожидаю ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',
      prefix: PINN_PREFIX,
	  status: true,
	},
      {
      title: 'Заголовок не по форме',
      content:
			'[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
      "[CENTER][COLOR=#7FFF00]Заголовок вашей жалобы составлен не по форме. Убедительная просьба ознакомиться [URL='https://forum.blackrussia.online/index.php?threads/3429394/']с правилами подачи жалоб на игроков[/URL].[/COLOR][/CENTER]" +
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]★ Отказано, ❤ Закрытоッ ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
      {
      title: 'Более 72 часов',
      content:
			'[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FF0000][ICODE]С момента получения нарушение прошло более 72 часов.[/ICODE][/COLOR][/CENTER]<br>" +
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]★ Отказано, ❤ Закрыто ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
  {
	  title: 'Фотохостинги',
	  content:
		'[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
      '[CENTER][COLOR=#7FFF00][ICODE]Доказательства должны быть загружены на Yapx/Imgur/YouTube.[/ICODE][/COLOR][/CENTER]<br>' +
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]★ Отказано, ❤ Закрытоッ ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
	},
      {
      title: 'Доква через запрет соц сети',
      content:
	'[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FF0000][ICODE]Доказательства из соц. сетей (ВКонтакте, instagram) не принимаются.[/ICODE][/COLOR][/CENTER]<br>" +
         '[CENTER][COLOR=#7FFF00][ICODE]Загрузите доказательства на на фото/видео хостинги (YouTube, Япикс, imgur).[/ICODE][/COLOR][/CENTER]<br>' +
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]★ Отказано, ❤ Закрытоッ ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нету условий сделки',
      content:
		'[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
      '[CENTER][COLOR=#7FFF00][ICODE]В данных доказательствах отсутствуют условия сделки.[/ICODE][/COLOR][/CENTER]<br>' +
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]★ Отказано, ❤ Закрытоッ ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нужен фрапс',
      content:
		'[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
      '[CENTER][COLOR=#7FFF00][ICODE]В таких случаях нужен фрапс (видео-фиксация).[/ICODE][/COLOR][/CENTER]<br>' +
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]★ Отказано, ❤ Закрытоッ ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',
      prefix: UNACCСEPT_PREFIX,
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нужен фарпс + промотка чата',
      content:
		'[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
      '[CENTER][COLOR=#7FFF00][ICODE]В таких случаях нужен фрапс (видео-фиксация) + промотка чата.[/ICODE][/COLOR][/CENTER]<br>' +
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]★ Отказано, ❤ Закрытоッ ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Неполный фрапс',
      content:
		'[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
      '[CENTER][COLOR=#7FFF00][ICODE]Фрапс обрывается. Загрузите полный фрапс на YouTube.[/ICODE][/COLOR][/CENTER]<br>' +
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]★ Отказано, ❤ Закрытоッ ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Не работают доква',
      content:
		'[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
      '[CENTER][COLOR=#7FFF00][ICODE]Не работают доказательства.[/ICODE][/COLOR][/CENTER]<br>' +
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]★ Отказано, ❤ Закрытоッ ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Док-ва отредактированы',
      content:
	'[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
      '[CENTER][COLOR=#7FFF00][ICODE]Ваши доказательства отредактированы, подайте новую жалобу с исходными доказательствами.[/ICODE][/COLOR][/CENTER]<br>' +
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]★ Отказано, ❤ Закрытоッ ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'От 3-го лица',
      content:
		'[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
      '[CENTER][COLOR=#FF0000][ICODE]Жалобы от 3-их лиц не принимаются.[/ICODE][/COLOR][/CENTER]<br>' +
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]★ Отказано, ❤ Закрытоッ ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Ошиблись разделом',
      content:
		'[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
      '[CENTER][COLOR=#7FFF00][ICODE]Вы ошиблись сервером/разделом, переношу вас в нужный раздел[/ICODE][/COLOR][/CENTER]<br>' +
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#1E90FF][FONT=times new roman][CENTER][I][ICODE]★ Ожидайте ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Док-ва не рабочие',
	  content:
		'[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
      '[CENTER][COLOR=#7FFF00][ICODE]Ваши доказательства не рабочие, перезалейте жалобу.[/ICODE][/COLOR][/CENTER]<br>' +
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]★ Отказано, ❤ Закрытоッ ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
	},
   {
     title: '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -✅Игровые чаты✅ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
    {
       title: 'Транслит',
      content:
 	'[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FF0000][ICODE]Игрок будет наказан по пункту:[/ICODE][/COLOR][/CENTER]<br>" +
       "[CENTER][COLOR=#FF0000][ICODE]3.20.[/ICODE][/COLOR][/CENTER]" +
       '[CENTER][COLOR=#FFD700][ICODE]Запрещено использование транслита в любом из чатов [/ICODE][/COLOR][/CENTER]' +
       '[CENTER][COLOR=#FF0000][ICODE]| Mute 30 минут[/ICODE][/COLOR][/CENTER]<br>'+
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]★ Одобрено ✔ ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Капс',
	  content:
		'[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FF0000][ICODE]Игрок будет наказан по пункту:[/ICODE][/COLOR][/CENTER]<br>" +
       "[CENTER][COLOR=#FF0000][ICODE]3.02.[/ICODE][/COLOR][/CENTER]" +
       '[CENTER][COLOR=#FFFF00][ICODE]Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате [/ICODE][/COLOR][/CENTER]' +
       '[CENTER][COLOR=#FF0000][ICODE]| Mute 30 минут[/ICODE][/COLOR][/CENTER]<br>'+
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]★ Одобрено ✔ ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',
      prefix: ACCСEPT_PREFIX,
	  status: false,
	},
  {
      title: 'MG',
      content:
		'[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FF0000][ICODE]Игрок будет наказан по пункту:[/ICODE][/COLOR][/CENTER]<br>" +
       "[CENTER][COLOR=#FF0000][ICODE]2.18.[/ICODE][/COLOR][/CENTER]" +
       '[CENTER][COLOR=#FFFF00][ICODE]Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе[/ICODE][/COLOR][/CENTER]' +
       '[CENTER][COLOR=#FF0000][ICODE]| Mute 30 минут[/ICODE][/COLOR][/CENTER]<br>'+
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]★ Одобрено ✔ ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Оск в ООС',
      content:
	'[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FF0000][ICODE]Игрок будет наказан по пункту:[/ICODE][/COLOR][/CENTER]<br>" +
       "[CENTER][COLOR=#FF0000][ICODE]3.03.[/ICODE][/COLOR][/CENTER]" +
       '[CENTER][COLOR=#FFFF00][ICODE]Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены [/ICODE][/COLOR][/CENTER]' +
       '[CENTER][COLOR=#FF0000][ICODE]| Mute 30 минут[/ICODE][/COLOR][/CENTER]<br>'+
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]★ Одобрено ✔ ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Оск/Упом родни',
      content:
			'[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FF0000][ICODE]Игрок будет наказан по пункту:[/ICODE][/COLOR][/CENTER]<br>" +
       "[CENTER][COLOR=#FF0000][ICODE]3.04.[/ICODE][/COLOR][/CENTER]" +
       '[CENTER][COLOR=#FFFF00][ICODE]Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [/ICODE][/COLOR][/CENTER]' +
       '[CENTER][COLOR=#FF0000][ICODE]| Mute 120 минут / Ban 7 - 15 дней[/ICODE][/COLOR][/CENTER]<br>'+
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]★ Одобрено ✔ ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Флуд',
	  content:
	'[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FF0000][ICODE]Игрок будет наказан по пункту:[/ICODE][/COLOR][/CENTER]<br>" +
       "[CENTER][COLOR=#FF0000][ICODE]3.05.[/ICODE][/COLOR][/CENTER]" +
       '[CENTER][COLOR=#FFFF00][ICODE]Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока[/ICODE][/COLOR][/CENTER]' +
       '[CENTER][COLOR=#FF0000][ICODE]| Mute 30 минут[/ICODE][/COLOR][/CENTER]<br>'+
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]★ Одобрено ✔ ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',
      prefix: ACCСEPT_PREFIX,
	  status: false,
	},
   {
	  title: 'Злоуп символами',
	  content:
	'[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FF0000][ICODE]Игрок будет наказан по пункту:[/ICODE][/COLOR][/CENTER]<br>" +
       "[CENTER][COLOR=#FF0000][ICODE]3.07.[/ICODE][/COLOR][/CENTER]" +
       '[CENTER][COLOR=#FFFF00][ICODE]Запрещено злоупотребление знаков препинания и прочих символов[/ICODE][/COLOR][/CENTER]' +
       '[CENTER][COLOR=#FF0000][ICODE]| Mute 30 минут[/ICODE][/COLOR][/CENTER]<br>'+
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]★ Одобрено ✔ ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',
      prefix: ACCСEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Слив СМИ',
      content:
		'[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FF0000][ICODE]Игрок будет наказан по пункту:[/ICODE][/COLOR][/CENTER]<br>" +
       "[CENTER][COLOR=#FF0000][ICODE]3.08.[/ICODE][/COLOR][/CENTER]" +
       '[CENTER][COLOR=#FFFF00][ICODE]Запрещены любые формы «слива» посредством использования глобальных чатов[/ICODE][/COLOR][/CENTER]' +
       '[CENTER][COLOR=#FF0000][ICODE]| PermBan [/ICODE][/COLOR][/CENTER]<br>'+
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]★ Одобрено ✔ ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Угрозы о наказании со стороны адм',
      content:
		'[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FF0000][ICODE]Игрок будет наказан по пункту:[/ICODE][/COLOR][/CENTER]<br>" +
       "[CENTER][COLOR=#FF0000][ICODE]2.37.[/ICODE][/COLOR][/CENTER]" +
       '[CENTER][COLOR=#FFFF00][ICODE]Запрещены OOC-угрозы, в том числе и завуалированные, а также угрозы наказанием со стороны администрации[/ICODE][/COLOR][/CENTER]' +
       '[CENTER][COLOR=#FF0000][ICODE]| Mute 120 минут / Ban 7 - 15 дней. [/ICODE][/COLOR][/CENTER]<br>'+
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]★ Одобрено ✔ ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',
	  status: false,
    },
    {
      title: 'Выдача себя за адм ',
      content:
	'[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FF0000][ICODE]Игрок будет наказан по пункту:[/ICODE][/COLOR][/CENTER]<br>" +
       "[CENTER][COLOR=#FF0000][ICODE]3.10.[/ICODE][/COLOR][/CENTER]" +
       '[CENTER][COLOR=#FFFF00][ICODE]Запрещена выдача себя за администратора, если таковым не являетесь[/ICODE][/COLOR][/CENTER]' +
       '[CENTER][COLOR=#FF0000][ICODE]| Ban 7 - 15 дней. [/ICODE][/COLOR][/CENTER]<br>'+
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]★ Одобрено ✔ ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Ввод в заблуждение',
      content:
	'[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FF0000][ICODE]Игрок будет наказан по пункту:[/ICODE][/COLOR][/CENTER]<br>" +
       "[CENTER][COLOR=#FF0000][ICODE]3.11.[/ICODE][/COLOR][/CENTER]" +
       '[CENTER][COLOR=#FFFF00][ICODE]Запрещено введение игроков проекта в заблуждение путем злоупотребления командами[/ICODE][/COLOR][/CENTER]' +
       '[CENTER][COLOR=#FF0000][ICODE]| Ban 15 - 30 дней / PermBan [/ICODE][/COLOR][/CENTER]<br>'+
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]★ Одобрено ✔ ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Музыка в войс',
      content:
		'[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FF0000][ICODE]Игрок будет наказан по пункту:[/ICODE][/COLOR][/CENTER]<br>" +
       "[CENTER][COLOR=#FF0000][ICODE]3.14.[/ICODE][/COLOR][/CENTER]" +
       '[CENTER][COLOR=#FFFF00][ICODE]Запрещено включать музыку в Voice Chat[/ICODE][/COLOR][/CENTER]' +
       '[CENTER][COLOR=#FF0000][ICODE]| Mute 60 минут [/ICODE][/COLOR][/CENTER]<br>'+
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]★ Одобрено ✔ ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Шум в войс',
      content:
	'[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FF0000][ICODE]Игрок будет наказан по пункту:[/ICODE][/COLOR][/CENTER]<br>" +
       "[CENTER][COLOR=#FF0000][ICODE]3.16.[/ICODE][/COLOR][/CENTER]" +
       '[CENTER][COLOR=#FFFF00][ICODE]Запрещено создавать посторонние шумы или звуки[/ICODE][/COLOR][/CENTER]' +
       '[CENTER][COLOR=#FF0000][ICODE]| Mute 30 минут [/ICODE][/COLOR][/CENTER]<br>'+
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]★ Одобрено ✔ ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
   {
      title: 'Политика / Призыв к флуду',
      content:
     '[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FF0000][ICODE]Игрок будет наказан по пункту:[/ICODE][/COLOR][/CENTER]<br>" +
       "[CENTER][COLOR=#FF0000][ICODE]3.18.[/ICODE][/COLOR][/CENTER]" +
       '[CENTER][COLOR=#FFFF00][ICODE]Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов[/ICODE][/COLOR][/CENTER]' +
       '[CENTER][COLOR=#FF0000][ICODE]| Mute 120 минут / Ban 10 дней[/ICODE][/COLOR][/CENTER]<br>'+
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]★ Одобрено ✔ ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Реклама промо',
      content:
		 '[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FF0000][ICODE]Игрок будет наказан по пункту:[/ICODE][/COLOR][/CENTER]<br>" +
       "[CENTER][COLOR=#FF0000][ICODE]3.21.[/ICODE][/COLOR][/CENTER]" +
       '[CENTER][COLOR=#FFFF00][ICODE]Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах.[/ICODE][/COLOR][/CENTER]' +
       '[CENTER][COLOR=#FF0000][ICODE]| Ban 30 дней[/ICODE][/COLOR][/CENTER]<br>'+
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]★ Одобрено ✔ ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',

      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Торговля на тт госс',
      content:
	'[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FF0000][ICODE]Игрок будет наказан по пункту:[/ICODE][/COLOR][/CENTER]<br>" +
       "[CENTER][COLOR=#FF0000][ICODE]3.22.[/ICODE][/COLOR][/CENTER]" +
       '[CENTER][COLOR=#FFFF00][ICODE]Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC)[/ICODE][/COLOR][/CENTER]' +
       '[CENTER][COLOR=#FF0000][ICODE]| Mute 30 минут[/ICODE][/COLOR][/CENTER]<br>'+
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]★ Одобрено ✔ ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: '- - - - - -  - - - - - - - - -  - - - - - - - - - - - - - - - - - ✅Общие наказания✅ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
{
      title: 'Багоюз',
      content:
		'[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FF0000][ICODE]Игрок будет наказан по пункту:[/ICODE][/COLOR][/CENTER]<br>" +
       "[CENTER][COLOR=#FF0000][ICODE]2.21.[/ICODE][/COLOR][/CENTER]" +
       '[CENTER][COLOR=#FFFF00][ICODE]Запрещено пытаться обходить игровую систему или использовать любые баги сервера[/ICODE][/COLOR][/CENTER]' +
       '[CENTER][COLOR=#FF0000][ICODE]| Ban 15 - 30 дней / PermBan [/ICODE][/COLOR][/CENTER]<br>'+
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]★ Одобрено ✔ ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'non-rp поведение',
      content:
		'[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FF0000][ICODE]Игрок будет наказан по пункту:[/ICODE][/COLOR][/CENTER]<br>" +
       "[CENTER][COLOR=#FF0000][ICODE]2.01.[/ICODE][/COLOR][/CENTER]" +
       '[CENTER][COLOR=#FFFF00][ICODE]Запрещено поведение, нарушающее нормы процессов Role Play режима игры [/ICODE][/COLOR][/CENTER]' +
       '[CENTER][COLOR=#FF0000][ICODE]| Jail 30 минут [/ICODE][/COLOR][/CENTER]<br>'+
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]★ Одобрено ✔ ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Уход от РП',
       content:
  	'[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FF0000][ICODE]Игрок будет наказан по пункту:[/ICODE][/COLOR][/CENTER]<br>" +
       "[CENTER][COLOR=#FF0000][ICODE]2.02.[/ICODE][/COLOR][/CENTER]" +
       '[CENTER][COLOR=#FFFF00][ICODE]Запрещено целенаправленно уходить от Role Play процесса всеразличными способами[/ICODE][/COLOR][/CENTER]' +
       '[CENTER][COLOR=#FF0000][ICODE]| Jail 30 минут / Warn [/ICODE][/COLOR][/CENTER]<br>'+
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]★ Одобрено ✔ ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',

      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'NRP Drive',
      content:
		'[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FF0000][ICODE]Игрок будет наказан по пункту:[/ICODE][/COLOR][/CENTER]<br>" +
       "[CENTER][COLOR=#FF0000][ICODE]2.03.[/ICODE][/COLOR][/CENTER]" +
       '[CENTER][COLOR=#FFFF00][ICODE] Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере[/ICODE][/COLOR][/CENTER]' +
       '[CENTER][COLOR=#FF0000][ICODE]| Jail 30 минут[/ICODE][/COLOR][/CENTER]<br>'+
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]★ Одобрено ✔ ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
        {
      title: 'NonRP Обман',
      content:
				'[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FF0000][ICODE]Игрок будет наказан по пункту:[/ICODE][/COLOR][/CENTER]<br>" +
       "[CENTER][COLOR=#FF0000][ICODE]2.05.[/ICODE][/COLOR][/CENTER]" +
       '[CENTER][COLOR=#FFFF00][ICODE]Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики[/ICODE][/COLOR][/CENTER]' +
       '[CENTER][COLOR=#FF0000][ICODE]| PermBan[/ICODE][/COLOR][/CENTER]<br>'+
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]★ Одобрено ✔ ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',

      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Аморал. действия',
      content:
			'[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FF0000][ICODE]Игрок будет наказан по пункту:[/ICODE][/COLOR][/CENTER]<br>" +
       "[CENTER][COLOR=#FF0000][ICODE]2.08.[/ICODE][/COLOR][/CENTER]" +
       '[CENTER][COLOR=#FFFF00][ICODE]Запрещена любая форма аморальных действий сексуального характера в сторону игроков[/ICODE][/COLOR][/CENTER]' +
       '[CENTER][COLOR=#FF0000][ICODE]| Jail 30 минут / Warn[/ICODE][/COLOR][/CENTER]<br>'+
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]★ Одобрено ✔ ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',

      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Слив склада',
      content:
		'[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FF0000][ICODE]Игрок будет наказан по пункту:[/ICODE][/COLOR][/CENTER]<br>" +
       "[CENTER][COLOR=#FF0000][ICODE]2.09.[/ICODE][/COLOR][/CENTER]" +
       '[CENTER][COLOR=#FFFF00][ICODE] Запрещено сливать склад фракции / семьи путем взятия большого количества ресурсов или превышая допустимый лимит, установленный лидером[/ICODE][/COLOR][/CENTER]' +
       '[CENTER][COLOR=#FF0000][ICODE]| Ban 15 - 30 дней / PermBan[/ICODE][/COLOR][/CENTER]<br>'+
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]★ Одобрено ✔ ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
   {
      title: 'Помеха работе',
      content:
		'[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FF0000][ICODE]Игрок будет наказан по пункту:[/ICODE][/COLOR][/CENTER]<br>" +
       "[CENTER][COLOR=#FF0000][ICODE]2.04.[/ICODE][/COLOR][/CENTER]" +
       '[CENTER][COLOR=#FFFF00][ICODE] Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы.[/ICODE][/COLOR][/CENTER]' +
       '[CENTER][COLOR=#FF0000][ICODE]| Ban 10 дней / Обнуление аккаунта (при повторном нарушении)[/ICODE][/COLOR][/CENTER]<br>'+
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]★ Одобрено ✔ ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ДБ',
      content:
		'[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FF0000][ICODE]Игрок будет наказан по пункту:[/ICODE][/COLOR][/CENTER]<br>" +
       "[CENTER][COLOR=#FF0000][ICODE]2.13.[/ICODE][/COLOR][/CENTER]" +
       '[CENTER][COLOR=#FFFF00][ICODE]Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [/ICODE][/COLOR][/CENTER]' +
       '[CENTER][COLOR=#FF0000][ICODE]| Jail 60 минут[/ICODE][/COLOR][/CENTER]<br>'+
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]★ Одобрено ✔ ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ТК',
      content:
	'[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FF0000][ICODE]Игрок будет наказан по пункту:[/ICODE][/COLOR][/CENTER]<br>" +
       "[CENTER][COLOR=#FF0000][ICODE]2.15.[/ICODE][/COLOR][/CENTER]" +
       '[CENTER][COLOR=#FFFF00][ICODE]Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины[/ICODE][/COLOR][/CENTER]' +
       '[CENTER][COLOR=#FF0000][ICODE]| Jail 60 минут / Warn (за два и более убийства)[/ICODE][/COLOR][/CENTER]<br>'+
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]★ Одобрено ✔ ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'СК',
      content:
			'[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FF0000][ICODE]Игрок будет наказан по пункту:[/ICODE][/COLOR][/CENTER]<br>" +
       "[CENTER][COLOR=#FF0000][ICODE]2.16.[/ICODE][/COLOR][/CENTER]" +
       '[CENTER][COLOR=#FFFF00][ICODE]Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них[/ICODE][/COLOR][/CENTER]' +
       '[CENTER][COLOR=#FF0000][ICODE]| Jail 60 минут / Warn (за два и более убийства)[/ICODE][/COLOR][/CENTER]<br>'+
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]★ Одобрено ✔ ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
        {
      title: 'ДМ',
      content:
	'[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FF0000][ICODE]Игрок будет наказан по пункту:[/ICODE][/COLOR][/CENTER]<br>" +
       "[CENTER][COLOR=#FF0000][ICODE]2.19.[/ICODE][/COLOR][/CENTER]" +
       '[CENTER][COLOR=#FFFF00][ICODE]Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины[/ICODE][/COLOR][/CENTER]' +
       '[CENTER][COLOR=#FF0000][ICODE]| Jail 60 минут[/ICODE][/COLOR][/CENTER]<br>'+
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]★ Одобрено ✔ ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Масс ДМ',
      content:
		'[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FF0000][ICODE]Игрок будет наказан по пункту:[/ICODE][/COLOR][/CENTER]<br>" +
       "[CENTER][COLOR=#FF0000][ICODE]2.20.[/ICODE][/COLOR][/CENTER]" +
       '[CENTER][COLOR=#FFFF00][ICODE]Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более[/ICODE][/COLOR][/CENTER]' +
       '[CENTER][COLOR=#FF0000][ICODE]| Warn / Ban 3 - 7 дней[/ICODE][/COLOR][/CENTER]<br>'+
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]★ Одобрено ✔ ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
        {
      title: 'Читы',
      content:
	'[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FF0000][ICODE]Игрок будет наказан по пункту:[/ICODE][/COLOR][/CENTER]<br>" +
       "[CENTER][COLOR=#FF0000][ICODE]2.22.[/ICODE][/COLOR][/CENTER]" +
       '[CENTER][COLOR=#FFFF00][ICODE]Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками[/ICODE][/COLOR][/CENTER]' +
       '[CENTER][COLOR=#FF0000][ICODE]| Ban 15 - 30 дней / PermBan[/ICODE][/COLOR][/CENTER]<br>'+
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]★ Одобрено ✔ ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Реклама',
      content:
		'[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FF0000][ICODE]Игрок будет наказан по пункту:[/ICODE][/COLOR][/CENTER]<br>" +
       "[CENTER][COLOR=#FF0000][ICODE]2.31.[/ICODE][/COLOR][/CENTER]" +
       '[CENTER][COLOR=#FFFF00][ICODE] Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube-каналы и тому подобное[/ICODE][/COLOR][/CENTER]' +
       '[CENTER][COLOR=#FF0000][ICODE]| Ban 7 дней / PermBan[/ICODE][/COLOR][/CENTER]<br>'+
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]★ Одобрено ✔ ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Обман адм',
      content:
		'[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FF0000][ICODE]Игрок будет наказан по пункту:[/ICODE][/COLOR][/CENTER]<br>" +
       "[CENTER][COLOR=#FF0000][ICODE]2.32.[/ICODE][/COLOR][/CENTER]" +
       '[CENTER][COLOR=#FFFF00][ICODE]Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта[/ICODE][/COLOR][/CENTER]' +
       '[CENTER][COLOR=#FF0000][ICODE]| Ban 7 - 15 дней[/ICODE][/COLOR][/CENTER]<br>'+
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]★ Одобрено ✔ ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'IC и OCC угрозы',
      content:
		'[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FF0000][ICODE]Игрок будет наказан по пункту:[/ICODE][/COLOR][/CENTER]<br>" +
       "[CENTER][COLOR=#FF0000][ICODE]2.35.[/ICODE][/COLOR][/CENTER]" +
       '[CENTER][COLOR=#FFFF00][ICODE]На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате[/ICODE][/COLOR][/CENTER]' +
       '[CENTER][COLOR=#FF0000][ICODE]| Mute 120 минут / Ban 7 дней[/ICODE][/COLOR][/CENTER]<br>'+
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]★ Одобрено ✔ ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Оск проекта',
      content:
	'[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FF0000][ICODE]Игрок будет наказан по пункту:[/ICODE][/COLOR][/CENTER]<br>" +
       "[CENTER][COLOR=#FF0000][ICODE]2.40.[/ICODE][/COLOR][/CENTER]" +
       '[CENTER][COLOR=#FFFF00][ICODE]Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе[/ICODE][/COLOR][/CENTER]' +
       '[CENTER][COLOR=#FF0000][ICODE]| Mute 300 минут / Ban 30 дней[/ICODE][/COLOR][/CENTER]<br>'+
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]★ Одобрено ✔ ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Продажа промо',
      content:
		'[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FF0000][ICODE]Игрок будет наказан по пункту:[/ICODE][/COLOR][/CENTER]<br>" +
       "[CENTER][COLOR=#FF0000][ICODE]2.43.[/ICODE][/COLOR][/CENTER]" +
       '[CENTER][COLOR=#FFFF00][ICODE]Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций[/ICODE][/COLOR][/CENTER]' +
       '[CENTER][COLOR=#FF0000][ICODE]| Mute 120 минут[/ICODE][/COLOR][/CENTER]<br>'+
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]★ Одобрено ✔ ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нонрп акс',
      content:
		'[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FF0000][ICODE]Игрок будет наказан по пункту:[/ICODE][/COLOR][/CENTER]<br>" +
       "[CENTER][COLOR=#FF0000][ICODE]2.52.[/ICODE][/COLOR][/CENTER]" +
       '[CENTER][COLOR=#FFFF00][ICODE]Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера.[/ICODE][/COLOR][/CENTER]' +
       '[CENTER][COLOR=#FF0000][ICODE]| JAIL 30 минут[/ICODE][/COLOR][/CENTER]<br>'+
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]★ Одобрено ✔ ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Неув обр. к адм',
      content:
		'[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FF0000][ICODE]Игрок будет наказан по пункту:[/ICODE][/COLOR][/CENTER]<br>" +
       "[CENTER][COLOR=#FF0000][ICODE]2.54.[/ICODE][/COLOR][/CENTER]" +
       '[CENTER][COLOR=#FFFF00][ICODE]Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации[/ICODE][/COLOR][/CENTER]' +
       '[CENTER][COLOR=#FF0000][ICODE]| Mute 180 минут[/ICODE][/COLOR][/CENTER]<br>'+
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]★ Одобрено ✔ ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Баг аним',
      content:
			'[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FF0000][ICODE]Игрок будет наказан по пункту:[/ICODE][/COLOR][/CENTER]<br>" +
       "[CENTER][COLOR=#FF0000][ICODE]2.55.[/ICODE][/COLOR][/CENTER]" +
       '[CENTER][COLOR=#FFFF00][ICODE]Запрещается багоюз связанный с анимацией в любых проявлениях.[/ICODE][/COLOR][/CENTER]' +
       '[CENTER][COLOR=#FF0000][ICODE]| Jail 60 / 120 минут[/ICODE][/COLOR][/CENTER]<br>'+
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]★ Одобрено ✔ ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Помеха блогерам',
      content:
				'[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FF0000][ICODE]Игрок будет наказан по пункту:[/ICODE][/COLOR][/CENTER]<br>" +
       "[CENTER][COLOR=#FF0000][ICODE]2.12.[/ICODE][/COLOR][/CENTER]" +
       '[CENTER][COLOR=#FFFF00][ICODE]Запрещена помеха в работе блогеров, стримеров (медиа лиц), которые находятся на официальном сотрудничестве с проектом[/ICODE][/COLOR][/CENTER]' +
       '[CENTER][COLOR=#FF0000][ICODE]| Ban 7 дней[/ICODE][/COLOR][/CENTER]<br>'+
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]★ Одобрено ✔ ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Аррест в интерьере',
      content:
			'[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FF0000][ICODE]Игрок будет наказан по пункту:[/ICODE][/COLOR][/CENTER]<br>" +
       "[CENTER][COLOR=#FF0000][ICODE]2.50.[/ICODE][/COLOR][/CENTER]" +
       '[CENTER][COLOR=#FFFF00][ICODE]Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий[/ICODE][/COLOR][/CENTER]' +
       '[CENTER][COLOR=#FF0000][ICODE]| Ban 7 - 15 дней[/ICODE][/COLOR][/CENTER]<br>'+
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]★ Одобрено ✔ ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
{
      title: 'Фейк аккаунт',
      content:
		'[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FF0000][ICODE]Игрок будет наказан по пункту:[/ICODE][/COLOR][/CENTER]<br>" +
       "[CENTER][COLOR=#FF0000][ICODE]4.10.[/ICODE][/COLOR][/CENTER]" +
       '[CENTER][COLOR=#FFFF00][ICODE]Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию[/ICODE][/COLOR][/CENTER]' +
       '[CENTER][COLOR=#FF0000][ICODE]| PermBan[/ICODE][/COLOR][/CENTER]<br>'+
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]★ Одобрено ✔ ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
   {
      title: 'Исп. фрак т/с в личных целях',
      content:
	'[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FF0000][ICODE]Игрок будет наказан по пункту:[/ICODE][/COLOR][/CENTER]<br>" +
       "[CENTER][COLOR=#FF0000][ICODE]1.08.[/ICODE][/COLOR][/CENTER]" +
       '[CENTER][COLOR=#FFFF00][ICODE]Запрещено использование фракционного транспорта в личных целях[/ICODE][/COLOR][/CENTER]' +
       '[CENTER][COLOR=#FF0000][ICODE]| Jail 30 минут[/ICODE][/COLOR][/CENTER]<br>'+
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]★ Одобрено ✔ ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
   {
      title: 'Розыск без причины',
      content:
	'[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FF0000][ICODE]Игрок будет наказан по пункту:[/ICODE][/COLOR][/CENTER]<br>" +
       "[CENTER][COLOR=#FF0000][ICODE]6.02.[/ICODE][/COLOR][/CENTER]" +
       '[CENTER][COLOR=#FFFF00][ICODE]Запрещено выдавать розыск без Role Play причины[/ICODE][/COLOR][/CENTER]' +
       '[CENTER][COLOR=#FF0000][ICODE]| Warn[/ICODE][/COLOR][/CENTER]<br>'+
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]★ Одобрено ✔ ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
   {
      title: 'Забирание В/У во время погони',
      content:
'[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FF0000][ICODE]Игрок будет наказан по пункту:[/ICODE][/COLOR][/CENTER]<br>" +
       "[CENTER][COLOR=#FF0000][ICODE]7.04.[/ICODE][/COLOR][/CENTER]" +
       '[CENTER][COLOR=#FFFF00][ICODE]Запрещено отбирать водительские права во время погони за нарушителем[/ICODE][/COLOR][/CENTER]' +
       '[CENTER][COLOR=#FF0000][ICODE]| Warn[/ICODE][/COLOR][/CENTER]<br>'+
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]★ Одобрено ✔ ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Одиноч патруль',
      content:
'[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FF0000][ICODE]Игрок будет наказан по пункту:[/ICODE][/COLOR][/CENTER]<br>" +
       "[CENTER][COLOR=#FF0000][ICODE]1.11.[/ICODE][/COLOR][/CENTER]" +
       '[CENTER][COLOR=#FFFF00][ICODE]Всем силовым структурам запрещен одиночный патруль или конвоирование, минимум 2 сотрудника[/ICODE][/COLOR][/CENTER]' +
       '[CENTER][COLOR=#FF0000][ICODE]| Jail 30 минут[/ICODE][/COLOR][/CENTER]<br>'+
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]★ Одобрено ✔ ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
  {
      title: 'NRP В/Ч',
      content:
	'[CENTER][url=https://postimg.cc/crZDw282][img]https://i.postimg.cc/crZDw282/P0ZTE.png[/img][/url][/CENTER]<br>'+
     "[B][CENTER][COLOR=#00FFFF][ICODE]Приветствую уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FF0000][ICODE]Игрок будет наказан по пункту:[/ICODE][/COLOR][/CENTER]<br>" +
       "[CENTER][COLOR=#FF0000][ICODE]1.[/ICODE][/COLOR][/CENTER]" +
       '[CENTER][COLOR=#FFFF00][ICODE]Нарушение правил нападения на Войсковую Часть выдаётся предупреждение[/ICODE][/COLOR][/CENTER]' +
       '[CENTER][COLOR=#FF0000][ICODE]|Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ).[/ICODE][/COLOR][/CENTER]<br>'+
     '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]С уважением Администрация сервера ッ[/ICODE][/CENTER][/color]' +
        '[url=https://postimg.cc/62hc9srC][img]https://i.postimg.cc/62hc9srC/OXMgDyr.png[/img][/url]<br>'+
        '[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]★ Одобрено ✔ ★[/ICODE][/I][/CENTER][/color][/FONT]' +
     '[url=https://postimg.cc/F7v3M1kY][img]https://i.postimg.cc/F7v3M1kY/945737.png[/img][/url]<br>'+
     '[url=https://postimages.org/][img]https://i.postimg.cc/d39bZ56Q/1740590560170.webp[/img][/url]<br>',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },

  ];

  $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    // Добавление кнопок при загрузке страницы
    addButton('На рассмотрение', 'pin');
    addButton('Га', 'Ga');
    addButton('Одобрено', 'accepted');
    addButton('Отказано', 'unaccept');
    addButton('Тех. Специалисту', 'Texy');
    addButton('Решено', 'Resheno');
    addButton('Закрыто', 'Zakrito');
    addButton('Ответы', 'selectAnswer');

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
})();// ==UserScript==
// @name        New script
// @namespace   Violentmonkey Scripts
// @match       *://example.org/*
// @grant       none
// @version     1.0
// @author      -
// @description 28.02.2025, 21:45:34
// ==/UserScript==