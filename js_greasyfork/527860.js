// ==UserScript==
// @name         Скрипт для сервера MURMANSK (Кураторам форума)
// @namespace    https://forum.blackrussia.online
// @version      1.0
// @description  Скрипт создан для сервера мурманск и его администраторов определенных должностей
// @author       A.Tropozoidov
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license    MIT
// @icon         https://sun9-76.userapi.com/impg/rEBGQfiaFZnbUofS8UOFXmokbnWSxJaLR-1Ycg/rxEn_aPc0wc.jpg?size=530x530&quality=95&sign=9ca94b62b95b588d510bc19a4290a530&type=album
// @downloadURL https://update.greasyfork.org/scripts/527860/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%B0%20MURMANSK%20%28%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%B0%D0%BC%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%29.user.js
// @updateURL https://update.greasyfork.org/scripts/527860/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%B0%20MURMANSK%20%28%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%B0%D0%BC%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%29.meta.js
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
     title: '- - - - - -  - - - - - - - - -  - - - - - - - - - - - - - - - - - Правила Role Play процесса - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
    {
      title: 'Игрок будет наказан',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан[/ICODE].[/COLOR][/CENTER]<br>" +
         '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
{
      title: 'Багоюз',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/img][/url]<br>' +
        "[CENTER][COLOR=#ffff00][ICODE]Игрок будет наказан по пункту правил: 2.21. Запрещено пытаться обходить игровую систему или использовать любые баги сервера | Ban 15 - 30 дней / PermBan (по согласованию с ГА, ЗГА, руководством тех. специалистов).[/ICODE] [/CENTER]" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/MKdRrVzK/1P76bnn.png[/img][/url]<br>'+
        '[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/img][/url]<br>'+
		'[Color=#00FF00][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'non-rp поведение',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/img][/url]<br>' +
        "[CENTER][COLOR=#ffff00][ICODE]Игрок будет наказан по пункту правил: 2.01. Запрещено поведение, нарушающее нормы процессов Role Play режима игры | Jail 30 минут.[/ICODE] [/CENTER] " +
        '[url=https://postimages.org/][img]https://i.postimg.cc/MKdRrVzK/1P76bnn.png[/img][/url]<br>'+
        '[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/img][/url]<br>'+
		'[Color=#00FF00][CENTER][I][ICODE]☆¦︎Одобрено✓, ↔︎ закрыто.¦︎☆[/ICODE][/I][/CENTER][/color]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Уход от РП',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }}. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
        "[CENTER][COLOR=#ffff00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.02. Запрещено целенаправленно уходить от Role Play процесса всеразличными способами | Jail 30 минут / Warn [/ICODE].[/COLOR] [/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/MKdRrVzK/1P76bnn.png[/img][/url]<br>'+
        '[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]Одобрено, закрыто.[/ICODE][/I][/CENTER][/color][/FONT]',

      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'non-rp вождение',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/img][/url]<br>' +
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.03. Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере | Jail 30 минут[/ICODE].[/COLOR][/CENTER]<br>"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/MKdRrVzK/1P76bnn.png[/img][/url]<br>'+
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
        {
      title: 'NonRP Обман',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.05. Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики | PermBan [/ICODE].[/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',

      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Аморал. действия',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.08. Запрещена любая форма аморальных действий сексуального характера в сторону игроков | Jail 30 минут / Warn [/ICODE].[/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',

      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Слив склада',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.09. Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле | Ban 15 - 30 дней / PermBan [/ICODE].[/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ДБ',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.13. Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта | Jail 60 минут [/ICODE].[/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'РК',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.14. Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти | Jail 30 минут [/ICODE].[/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ТК',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.15. Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины | Jail 60 минут / Warn (за два и более убийства) [/ICODE].[/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'СК',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>' +
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.16. Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них | Jail 60 минут / Warn (за два и более убийства) [/ICODE].[/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
	  status: false,
    },
    {
      title: 'ПГ',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.17. Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь | Jail 30 минут [/ICODE].[/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'MG',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.18. Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе | Mute 30 минут [/ICODE].[/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
        {
      title: 'ДМ',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/img][/url]<br>' +
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.19. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины | Jail 60 минут [/ICODE].[/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/MKdRrVzK/1P76bnn.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Масс ДМ',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.20. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины более трем игрокам | Warn / Ban 3 - 7 дней [/ICODE].[/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
        {
      title: 'Использование Читов',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по пункту правил:<br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками | Ban 15 - 30 дней / PermBan [/ICODE].[/COLOR][/CENTER]" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
	    '[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Реклама сторонних ресурсов',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.31. Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное | Ban 7 дней / PermBan [/ICODE].[/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Обман адм',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.32. Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта | Ban 7 - 15 дней. [/ICODE].[/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'IC и OCC угрозы',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.35. На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате | Mute 120 минут / Ban 7 дней [/ICODE].[/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Уход от наказания',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.34. Запрещен уход от наказания | Ban 15 - 30 дней (суммируется к общему наказанию дополнительно) [/ICODE].[/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Угрозы OOC',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по пункту правил:<br>2.37. Запрещены OOC угрозы, в том числе и завуалированные | Mute 120 минут / Ban 7 дней [/ICODE].[/COLOR][/CENTER]" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
         '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
         '[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Злоуп. наказаниями',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по пункту правил:<br>2.39. Злоупотребление нарушениями правил сервера | Ban 7 - 30 дней [/ICODE].[/COLOR][/CENTER]" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
         '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Оск проекта',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.40. Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе | Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором) [/ICODE].[/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Продажа промо',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.43. Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций | Mute 120 минут [/ICODE].[/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Помеха РП процессу 2.51',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.51. Запрещено вмешательство в Role Play процесс с целью помехи и препятствования дальнейшего развития Role Play процесса | Jail 30 минут [/ICODE].[/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нонрп акс',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.52. Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. | При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут [/ICODE].[/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Неув обр. к адм',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.54. Запрещено неуважительное обращение, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации | Mute 180 минут [/ICODE].[/COLOR][/CENTER]<br>" +
         '[url=https://postimages.org/][img]https://i.postimg.cc/3x6R1HBh/png-klev-club-q1md-p-dlya-foruma-png-21.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Баг аним',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.55. Запрещается багоюз связанный с анимацией в любых проявлениях. | Jail 60 / 120 минутПример: если игрок, используя баг, убирает ограничение на использование оружия в зеленой зоне, сбивает темп стрельбы, либо быстро перемещается во время войны за бизнес или во время перестрелки на мероприятии с семейными контейнерами, последует наказание в виде Jail на 120 минут. Данное наказание используется в случаях, когда, используя ошибку, было получено преимущество перед другими игроками. Пример: если игрок использует баги, связанные с анимацией, и при этом не влияет на игровой процесс других игроков, а также не получает преимущество перед другими игроками, последует наказание в виде Jail на 60 минут [/ICODE].[/COLOR][/CENTER]<br>" +
         '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Спасатели эко',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.04. Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. | Ban 10 дней / Обнуление аккаунта (при повторном нарушении) [/ICODE].[/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎Одобрено, ↔︎ закрыто.☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Не отдал Долг',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.57 Запрещается брать в долг игровые ценности и не возвращать их. | Ban 30 дней / permban. [/ICODE].[/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎Одобрено, ↔︎ закрыто.☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Помеха блогерам',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.12. Запрещена помеха в работе блогеров, стримеров (медиа лиц), которые находятся на официальном сотрудничестве с проектом | Ban 7 дней. [/ICODE].[/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆Одобрено, ↔︎ закрыто.☆[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Перенос конфликта',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.36. Запрещено переносить конфликты из IC в OOC и наоборот | Warn. [/ICODE].[/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]Одобрено, ↔︎ закрыто.[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Аррест в казино',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.50. Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий | Ban 7 - 15 дней + увольнение из организации. [/ICODE].[/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]Одобрено, ↔︎ закрыто.[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Игровые чаты​ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
    {
      title: 'Транслит',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>3.01. Общепризнанный язык сервера — русский. Общение в IC чатах во всех Role Play ситуациях обязательно должно проходить исключительно на русском языке | Устное замечание / Mute 30 минут [/ICODE].[/COLOR][/CENTER]<br>" +
         '[url=https://postimages.org/][img]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Капс',
	  content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>3.02. Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате | Mute 30 минут [/ICODE].[/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Оск в ООС',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>3.03. Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены | Mute 30 минут [/ICODE].[/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Оск/Упом родни',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>3.04. Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) | Mute 120 минут / Ban 7 - 15 дней [/ICODE].[/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Флуд',
	  content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>3.05. Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока | Mute 30 минут [/ICODE].[/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Злоуп. знаками',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>3.06. Запрещено злоупотребление знаков препинания и прочих символов | Mute 30 минут [/ICODE].[/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Оскорбление',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>3.07. Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата | Mute 30 минут [/ICODE].[/COLOR][/CENTER]<br>" +
         '[url=https://postimages.org/][img]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.☆︎[/ICODE][/I][/CENTER][/color][/FONT]',

      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Слив СМИ',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>3.08. Запрещены любые формы «слива» посредством использования глобальных чатов | PermBan [/ICODE].[/COLOR][/CENTER]<br>" +
		 '[url=https://postimages.org/][img]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Угрозы о наказании со стороны адм',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по пункту правил:<br>3.09. Запрещены любые угрозы о наказании игрока со стороны администрации | Mute 30 минут [/ICODE].[/COLOR][/CENTER]<br>" +
         '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Выдача себя за адм ',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>3.10. Запрещена выдача себя за администратора, если таковым не являетесь | Ban 7 - 15 + ЧС администрации [/ICODE].[/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.☆︎[/ICODE][/I][/CENTER][/color][/FONT]',

      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Ввод в заблуждение',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>3.11. Запрещено введение игроков проекта в заблуждение путем злоупотребления командами | Ban 15 - 30 дней / PermBan [/ICODE].[/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Музыка в войс',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>3.14. Запрещено включать музыку в Voice Chat | Mute 60 минут [/ICODE].[/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',

      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Оск/Упом род в войс',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>3.15. Запрещено оскорблять игроков или родных в Voice Chat | Mute 120 минут / Ban 7 - 15 дней [/ICODE].[/COLOR][/CENTER]<br>" +
		 '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Шум в войс',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>3.16. Запрещено создавать посторонние шумы или звуки | Mute 30 минут [/ICODE].[/COLOR][/CENTER]<br>" +
		 '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Реклама промо',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>3.21. Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. | Ban 30 дней [/ICODE].[/COLOR][/CENTER]<br>" +
         '[url=https://postimages.org/][img]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.☆︎[/ICODE][/I][/CENTER][/color][/FONT]',

      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Торговля на тт госс',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>3.22. Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) | Mute 30 минут [/ICODE].[/COLOR][/CENTER]<br>" +
         '[url=https://postimages.org/][img]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.☆︎[/ICODE][/I][/CENTER][/color][/FONT]',

      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Религиозное и политическая пропаганда',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>3.18. Запрещено политическое и религиозное пропагандирование | Mute 120 минут / Ban 10 дней [/ICODE].[/COLOR][/CENTER]<br>" +
         '[url=https://postimages.org/][img]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.☆︎[/ICODE][/I][/CENTER][/color][/FONT]',

      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Положение об игровых аккаунтах - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
    {
      title: 'Фейк аккаунт',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>4.10. Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию | Устное замечание + смена игрового никнейма / PermBan [/ICODE].[/COLOR][/CENTER]<br>" +
         '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',

      prefix: ACCСEPT_PREFIX,
	  status: false,
    },

    {
     title: '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Передачи жалобы - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
    {
      title: 'Техническому специалисту',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Ваша жалоба была передана на рассмотрение техническому специалисту.[/ICODE].[/COLOR][/CENTER]<br>" +
         '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Ожидайте ответа [/ICODE].[/CENTER][/COLOR]'+
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>',
      prefix: TEXY_PREFIX,
	  status: true,
    },
    {
      title: 'Передано ГА',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Ваша жалоба была передана на рассмотрение Главному Администратору.[/ICODE].[/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Ожидайте ответа [/ICODE].[/CENTER][/COLOR]'+
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>',
      prefix: GA_PREFIX,
	  status: true,
    },
    {
      title: 'Передано Главному куратору форума',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Ваша жалоба была передана на рассмотрение Главному куратору форума.[/ICODE].[/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Ожидайте ответа [/ICODE].[/CENTER][/COLOR]'+
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>',
    },
    {
      title: 'Передано Зам. Главному куратору форума',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Ваша жалоба была передана на рассмотрение Зам. Главному куратору форума.[/ICODE].[/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Ожидайте ответа [/ICODE].[/CENTER][/COLOR]'+
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>',
    },
    {
     title: '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Правила Гос.Структур - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ',
    },
    {
      title: 'Исп. фрак т/с в личных целях',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по пунтку правил: 1.08. Запрещено использование фракционного транспорта в личных целях | Jail 30 минут.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ДМ/Масс дм от МО',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по пунтку правил: 2.02. Наносить урон игрокам, которые находятся вне территории воинской части, запрещено | Jail 30 минут / Warn.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
		'[Color=#FF00FF][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Н/П/Р/О (Объявы)',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по пунтку правил: 4.01. Запрещено редактирование объявлений, не соответствующих ПРО | Mute 30 минут.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Н/П/П/Э (Эфиры)',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по пунтку правил: 4.02. Запрещено проведение эфиров, не соответствующих Role Play правилам и логике | Mute 30 минут [/ICODE].[/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ДМ/Масс от УМВД',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по пунтку правил: 6.01. Запрещено наносить урон игрокам без Role Play причины на территории УМВД | Jail 30 минут / Warn.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
		'[Color=#FF00FF][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Розыск без причины(УМВД)',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по пунтку правил: 6.02. Запрещено выдавать розыск без Role Play причины | Warn.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'nRP поведение (Умвд)',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по пунтку правил: 6.03. Запрещено nRP поведение | Warn.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/MKdRrVzK/1P76bnn.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,

    },
    {
      title: 'ДМ/Масс от ГИБДД',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по пунтку правил: 7.01. Запрещено наносить урон игрокам без Role Play причины на территории ГИБДД | Jail 30 минут / Warn.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'nRP розыск',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по пунтку правил: 7.02. Запрещено выдавать розыск, штраф без Role Play причины | Warn.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,

    },
    {
      title: 'Забирание В/У во время погони(ГИБДД)',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/GmmtwYtF/24728761-1.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по пунтку правил: 7.04. Запрещено отбирать водительские права во время погони за нарушителем | Warn.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/GmmtwYtF/24728761-1.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/GmmtwYtF/24728761-1.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ДМ/Масс от УФСБ',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по пунтку правил: 8.01. Запрещено наносить урон игрокам без Role Play причины на территории ФСБ | Jail 30 минут / Warn.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
		'[Color=#FF00FF][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,

    },
    {
     title: '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Правила ОПГ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
    {
      title: 'Нарушение правил В/Ч',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по пунтку правил: За нарушение правил нападения на Войсковую Часть выдаётся предупреждение | Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ).[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=##00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нападение на В/Ч через стену',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по пунтку правил: Нападение на военную часть разрешено только через блокпост КПП с последовательностью взлома | /Warn NonRP В/Ч.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Похищение/Ограбления нарушение правил',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00]Игрок будет наказан за Нонрп Ограбление\Похищениее в соответствии с этими правилами [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BE%D0%B3%D1%80%D0%B0%D0%B1%D0%BB%D0%B5%D0%BD%D0%B8%D0%B9-%D0%B8-%D0%BF%D0%BE%D1%85%D0%B8%D1%89%D0%B5%D0%BD%D0%B8%D0%B9.29/']Click[/URL][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Отсутствие пункта жалоб╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
	  title: 'Нарушений не найдено',
	  content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00][ICODE]Нарушений со стороны данного игрока не было найдено.[/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, ❖ Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]',

      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Ответ дан в прошлой ЖБ',
	  content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]hhttps://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00][ICODE]Ответ был дан в прошлой жалобе.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, ❖ Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Недостаточно доказательств',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
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
      title: 'Дублирование темы',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Дублирование темы.<br>Если вы дальше будете заниматься данной деятельностью (дублированием тем), то ваш форумный аккаунт будет заблокирован на 3 дня и более.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, ❖ Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'В жалобы на адм',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00]Вы ошиблись разделом.<br>Обратитесь в раздел [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1570/']Жалобы на администрацию[/URL].[/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, ❖ Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'В обжалования',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00]Вы ошиблись разделом.<br>Обратитесь в раздел [URL='https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.1573/']Обжалование наказаний[/URL].[/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, ❖ Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Форма темы',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00]Ваша жалоба составлена не по форме.<br>Убедительная просьба ознакомиться [URL='https://forum.blackrussia.online/index.php?threads/3429394/']с правилами подачи жалоб на игроков[/URL].[/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, ❖ Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
	{
	  title: 'Нету /time',
	  content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/GmmtwYtF/24728761-1.png[/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00][ICODE]На ваших доказательствах отсутствует /time.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/GmmtwYtF/24728761-1.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/GmmtwYtF/24728761-1.png[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, ❖ Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Укажите тайм-коды',
	  content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00][ICODE]В течении 24х часов укажите тайм-коды, иначе жалоба будет отказана.[/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]На рассмотрении...[/ICODE][/CENTER][/COLOR]'+
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>',
      prefix: PINN_PREFIX,
	  status: true,
	},
    {
      title: 'Жалоба на рассмотрении',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Ваша жалоба взята на рассмотрение.<br>Просьба ожидать ответа и не создавать дубликаты данной темы.[/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Ожидайте ответа.[/ICODE][/COLOR][/CENTER]'+
         '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>',
      prefix: PINN_PREFIX,
	  status: false,
    },
      {
      title: 'Заголовок не по форме',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00]Заголовок вашей жалобы составлен не по форме. Убедительная просьба ознакомиться [URL='https://forum.blackrussia.online/index.php?threads/3429394/']с правилами подачи жалоб на игроков[/URL].[/COLOR][/CENTER]" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, ❖ Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
      {
      title: 'Более 72 часов',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]С момента получения нарушение прошло более 72 часов.[/ICODE][/COLOR][/CENTER]" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, ❖ Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
      {
      title: 'Доква через запрет соц сети',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]3.6. Прикрепление доказательств обязательно. Примечание: загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/ICODE][/COLOR][/CENTER]" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, ❖ Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нету условий сделки',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]В данных доказательствах отсутствуют условия сделки.[/ICODE][/COLOR][/CENTER]" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, ❖ Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нужен фрапс',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]В таких случаях нужен фрапс.[/ICODE][/COLOR][/CENTER]" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, ❖ Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нужен фарпс + промотка чата',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]В таких случаях нужен фрапс + промотка чата.[/ICODE][/COLOR][[/CENTER]" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, ❖ Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нужна промотка чата',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]В таких случаях нужна промотка чата.[/ICODE][/COLOR][/CENTER]" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, ❖ Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Неполный фрапс',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Фрапс обрывается. Загрузите полный фрапс на ютуб.[/ICODE][/COLOR][/CENTER]" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, ❖ Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Не работают доква',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Не работают доказательства.[/icode][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, ❖ Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Док-ва отредактированы',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Ваши доказательства отредактированы.[/ICODE][/COLOR][/CENTER]" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, ❖ Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'От 3-го лица',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Жалобы от 3-их лиц не принимаются.[/ICODE][/COLOR][/CENTER]" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, ❖ Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Ответный ДМ',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]В случае ответного ДМ нужен видео-запись. Пересоздайте тему и прикрепите видео-запись.[/ICODE][/COLOR][/CENTER]" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, ❖ Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Ошиблись разделом',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Вы ошиблись сервером/разделом, переподайте жалобу в нужный раздел.[/ICODE][/COLOR][/CENTER]<br>" +
           '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, ❖ Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Док-ва не рабочие',
	  content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00][ICODE]Ваши доказательства не рабочие/обрезаные, перезалейте их правильно и без обрезаний.[/ICODE][/COLOR][/CENTER]<br>" +
		 '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, ❖ Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Фотохостинги',
	  content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00][ICODE]Доказательства должны быть загружены на Yapx/Imgur/YouTube.[/ICODE][/COLOR][/CENTER]<br>" +
		 '[url=https://postimages.org/][img]https://i.postimg.cc/GmmtwYtF/24728761-1.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, ❖ Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
	},
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴РП СИТУАЦИИ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
	  title: 'РП ситуация Одобрена',
	  content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00][ICODE]Ваша RolePlay ситуация была проверена и получает статус - Одобрено.[/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>',

      prefix: ODOBRENOBIO_PREFIX,
	  status: false,
    },
    {
	  title: 'РП ситуация на доработке',
	  content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00][ICODE]Вам дается 24 часа на дополнение Вашей РП ситуации [/ICODE][/COLOR][/CENTER]<br>" +
		 '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>',
       prefix: NARASSMOTRENIIRP_PREFIX,
	  status: false,
      },
    {
	  title: 'РП ситуация отказ',
	  content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
		"[CENTER][COLOR=#FF0000][ICODE]Ваша РП ситуация получает статус-Отказано.'Причиной отказа могло послужить какое-либо нарушение из Правила RP ситуаций.[/ICODE][/COLOR][/CENTER]<br>" +
		 '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>',
       prefix: OTKAZRP_PREFIX,
	  status: false,
     },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Неофицал.орг.╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
     },
    {
	  title: 'Неофицальная Орг Одобрено',
	  content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00][ICODE]Ваша неофицальная организация получает статус-Одобрено.[/ICODE][/COLOR][/CENTER]<br>" +
		 '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>',
       prefix: ODOBRENOORG_PREFIX,
	  status: false,
     },
    {
	  title: 'Неофицальная Орг на доработке',
	  content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00][ICODE]Вам дается 24 часа на дополнение Вашей неофицальной организации.[/ICODE][/COLOR][/CENTER]<br>" +
		 '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>',
       prefix: NARASSMOTRENIIORG_PREFIX ,
	  status: false,
     },
    {
	  title: 'Неофицальная Орг отказ',
	  content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00][ICODE]Ваша РП ситуация получает статус-Отказано.'Причиной отказа могло послужить какое-либо нарушение из Правила создания неофицальной RolePlay организации./ICODE][/COLOR][/CENTER]<br>" +
		 '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>',
       prefix:  OTKAZORG_PREFIX,
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
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-%D0%A0%D0%9F-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.5773819/']с правилами написания RolePlay биографий.[/URL][/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Орфографические и пунктуационные ошибки.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>',

      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
        title: 'Био от 1-го лица',
        content:
        "[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-%D0%A0%D0%9F-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.5773819/']с правилами написания RolePlay биографий[/URL].[/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Биография от 1-го лица.[/B][/COLOR]' +
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
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-%D0%A0%D0%9F-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.5773819/']с правилами написания RolePlay биографий[/URL].[/CENTER]<br>" +
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
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-%D0%A0%D0%9F-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.5773819/']с правилами написания RolePlay биографий[/URL].[/CENTER]<br>" +
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
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-%D0%A0%D0%9F-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.5773819/']с правилами написания RolePlay биографий[/URL].[/CENTER]<br>" +
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
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-%D0%A0%D0%9F-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.5773819/']с правилами написания RolePlay биографий[/URL].[/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Некорректен возраст (слишком молод).[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>',

      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
        title: 'Биография скопирована',
        content:
        "[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-%D0%A0%D0%9F-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.5773819/']с правилами написания RolePlay биографий[/URL].[/CENTER]<br>" +
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
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-%D0%A0%D0%9F-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.5773819/']с правилами написания RolePlay биографий[/URL].[/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Недостаточно РП информации.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>',

      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
        title: 'Не по форме bio',
        content:
        "[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-%D0%A0%D0%9F-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.5773819/']с правилами написания RolePlay биографий[/URL].[/CENTER]<br>" +
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
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-%D0%A0%D0%9F-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.5773819/']с правилами написания RolePlay биографий[/URL].[/CENTER]<br>" +
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
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-%D0%A0%D0%9F-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.5773819/']с правилами написания RolePlay биографий[/URL].[/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Заголовок темы не по форме.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>',

      prefix: OTKAZBIO_PREFIX,
      status: false,
    }

  ];

  $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    // Добавление кнопок при загрузке страницы
    addButton('На рассмотрение', 'pin');
    addButton('КП', 'teamProject');
    addButton('Га', 'Ga');
    addButton('Спецу', 'Spec');
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
})();