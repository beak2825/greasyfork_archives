// ==UserScript==
// @name         Для кураторов форума INDIGO | 11.
// @namespace    https://forum.blackrussia.online
// @version      1.1
// @description  1.1 - фикс багов
// @author       N.Velovski(Holmov)
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license    MIT
// @icon         https://sun9-76.userapi.com/impg/rEBGQfiaFZnbUofS8UOFXmokbnWSxJaLR-1Ycg/rxEn_aPc0wc.jpg?size=530x530&quality=95&sign=9ca94b62b95b588d510bc19a4290a530&type=album
// @downloadURL https://update.greasyfork.org/scripts/526550/%D0%94%D0%BB%D1%8F%20%D0%BA%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20INDIGO%20%7C%2011.user.js
// @updateURL https://update.greasyfork.org/scripts/526550/%D0%94%D0%BB%D1%8F%20%D0%BA%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20INDIGO%20%7C%2011.meta.js
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
      title: 'Приветствие',
      content: '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' + '[CENTER]  [/CENTER][/FONT]',
     },
     {
      title: 'Отказано, закрыто',
      content: "[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/GmmtwYtF/24728761-1.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Недостаточно доказательств на нарушение от данного игрока.<br>Доказательства должны быть предоставлены в хорошем качестве и с полным процессом сделки или нарушения от какого-либо игрока.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/GmmtwYtF/24728761-1.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/GmmtwYtF/24728761-1.png[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, ❖ Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Одобрено, закрыто',
      content: "[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан[/ICODE].[/COLOR][/CENTER]<br>" +
         '[url=https://postimages.org/][img]https://i.postimg.cc/3x6R1HBh/png-klev-club-q1md-p-dlya-foruma-png-21.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
    {
      title: 'На рассмотрении...',
      content: "[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Ваша жалоба взята на рассмотрение.<br>Просьба ожидать ответа и не создавать дубликаты данной темы.[/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Ожидайте ответа.[/ICODE][/COLOR][/CENTER]'+
         '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>',
      prefix: PINN_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴РП биография.╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
        {
	  title: 'РП биография Одобрено',
	  content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00][ICODE]Ваша RolePlay биография была проверена и получает статус - Одобрено.[/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>',
 
      prefix: ODOBRENOBIO_PREFIX,
	  status: false,
    },
    {
        title: 'Орф и пунктуац ошибки',
        content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/indigo-%D0%A4%D0%BE%D1%80%D0%BC%D0%B0-%D0%BD%D0%B0%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D1%8F-%D0%B8-%D0%BE%D1%81%D0%BD%D0%BE%D0%B2%D0%BD%D1%8B%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.11325817/']с правилами написания RolePlay биографий.[/URL][/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Орфографические и пунктуационные ошибки.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>',
 
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
        title: 'Био от 3-го лица',
        content:
        "[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/indigo-%D0%A4%D0%BE%D1%80%D0%BC%D0%B0-%D0%BD%D0%B0%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D1%8F-%D0%B8-%D0%BE%D1%81%D0%BD%D0%BE%D0%B2%D0%BD%D1%8B%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.11325817/']с правилами написания RolePlay биографий[/URL].[/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Биография от 3-го лица.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>',
 
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
        title: 'Дата рождения некорректна',
        content:
        "[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/indigo-%D0%A4%D0%BE%D1%80%D0%BC%D0%B0-%D0%BD%D0%B0%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D1%8F-%D0%B8-%D0%BE%D1%81%D0%BD%D0%BE%D0%B2%D0%BD%D1%8B%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.11325817/']с правилами написания RolePlay биографий[/URL].[/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Дата рождения некорректна.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>',
 
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
        title: 'Информация не соответствует времени',
        content:
        "[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/indigo-%D0%A4%D0%BE%D1%80%D0%BC%D0%B0-%D0%BD%D0%B0%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D1%8F-%D0%B8-%D0%BE%D1%81%D0%BD%D0%BE%D0%B2%D0%BD%D1%8B%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.11325817/']с правилами написания RolePlay биографий[/URL].[/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Информация в пунктах не соответствует временным рамкам.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>',
 
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
        title: 'Возраст не совпал',
        content:
        "[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/indigo-%D0%A4%D0%BE%D1%80%D0%BC%D0%B0-%D0%BD%D0%B0%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D1%8F-%D0%B8-%D0%BE%D1%81%D0%BD%D0%BE%D0%B2%D0%BD%D1%8B%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.11325817/']с правилами написания RolePlay биографий[/URL].[/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Возраст не совпадает с датой рождения.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>',
 
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
        title: 'Слишком молод',
        content:
        "[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/indigo-%D0%A4%D0%BE%D1%80%D0%BC%D0%B0-%D0%BD%D0%B0%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D1%8F-%D0%B8-%D0%BE%D1%81%D0%BD%D0%BE%D0%B2%D0%BD%D1%8B%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.11325817/']с правилами написания RolePlay биографий[/URL].[/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Некорректен возраст (слишком молод).[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>',
 
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
        title: 'Копипаст',
        content:
        "[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/indigo-%D0%A4%D0%BE%D1%80%D0%BC%D0%B0-%D0%BD%D0%B0%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D1%8F-%D0%B8-%D0%BE%D1%81%D0%BD%D0%BE%D0%B2%D0%BD%D1%8B%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.11325817/']с правилами написания RolePlay биографий[/URL].[/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Биография скопирована.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>',
 
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
        title: 'Недостаточно РП информации',
        content:
        "[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/indigo-%D0%A4%D0%BE%D1%80%D0%BC%D0%B0-%D0%BD%D0%B0%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D1%8F-%D0%B8-%D0%BE%D1%81%D0%BD%D0%BE%D0%B2%D0%BD%D1%8B%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.11325817/']с правилами написания RolePlay биографий[/URL].[/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Недостаточно РП информации.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>',
 
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
        title: 'Не по форме',
        content:
        "[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/indigo-%D0%A4%D0%BE%D1%80%D0%BC%D0%B0-%D0%BD%D0%B0%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D1%8F-%D0%B8-%D0%BE%D1%81%D0%BD%D0%BE%D0%B2%D0%BD%D1%8B%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.11325817/']с правилами написания RolePlay биографий[/URL].[/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Биография не по форме.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>',
 
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
        title: 'Некоррект национальность',
        content:
        "[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/indigo-%D0%A4%D0%BE%D1%80%D0%BC%D0%B0-%D0%BD%D0%B0%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D1%8F-%D0%B8-%D0%BE%D1%81%D0%BD%D0%BE%D0%B2%D0%BD%D1%8B%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.11325817/']с правилами написания RolePlay биографий[/URL].[/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Некорректная национальность.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>',
 
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
        title: 'Заголовок не по форме bio',
        content:
        "[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/indigo-%D0%A4%D0%BE%D1%80%D0%BC%D0%B0-%D0%BD%D0%B0%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D1%8F-%D0%B8-%D0%BE%D1%81%D0%BD%D0%BE%D0%B2%D0%BD%D1%8B%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.11325817/']с правилами написания RolePlay биографий[/URL].[/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Заголовок темы не по форме.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>',
 
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
        title: 'Семья не полностью расписана',
        content:
        "[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/indigo-%D0%A4%D0%BE%D1%80%D0%BC%D0%B0-%D0%BD%D0%B0%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D1%8F-%D0%B8-%D0%BE%D1%81%D0%BD%D0%BE%D0%B2%D0%BD%D1%8B%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.11325817/']с правилами написания RolePlay биографий[/URL].[/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]В пункте "Семья" должны быть расписаны минимум мать и отец (сестра и брат при наличии) с указанием их имен и фамилий. Если в биографии расписаны другие родственники, то вы должны их указать в пункте "Семья"[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>',
 
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
        title: 'Юность с 13 лет',
        content:
        "[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/indigo-%D0%A4%D0%BE%D1%80%D0%BC%D0%B0-%D0%BD%D0%B0%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D1%8F-%D0%B8-%D0%BE%D1%81%D0%BD%D0%BE%D0%B2%D0%BD%D1%8B%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.11325817/']с правилами написания RolePlay биографий[/URL].[/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Юность с 13 лет[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>',
 
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
  ];
 
  $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
    // Добавление кнопок при загрузке страницы
    addButton('Одобрено', 'accepted');
    addButton('Отказано', 'unaccept');
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
})();