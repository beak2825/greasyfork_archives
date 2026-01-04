// ==UserScript==
// @name         Кураторы форума /КФ/ YELLOW
// @namespace    http://tampermonkey.net/
// @version      0.30
// @description  По вопросам в ВК - https://vk.com/id636046107
// @author       Angel_Sakurai
// @match        https://forum.blackrussia.online/threads/*
// @grant        none
// @license 	 MIT
// @icon https://icons.iconarchive.com/icons/dapino/people/256/black-man-icon.png
// @downloadURL https://update.greasyfork.org/scripts/461753/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%D0%9A%D0%A4%20YELLOW.user.js
// @updateURL https://update.greasyfork.org/scripts/461753/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%D0%9A%D0%A4%20YELLOW.meta.js
// ==/UserScript==

(function() {
    'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const SPECY_PREFIX = 11;
const TEX_PREFIX = 13;
const buttons = [
    {
      title: 'свой ответ',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][Color=#DC143C]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/I][/FONT][/SIZE]<br><br>' +
        "[CENTER][I][FONT=courier new][SIZE=5][COLOR=rgb(0, 255, 255)] *ТЕКСТ* [/COLOR][/SIZE][/FONT][/I][/CENTER]<br>" +
		'[CENTER][I][SIZE=4][FONT=arial][Color=#DC143C]Закрыто.[/COLOR][/I][/FONT][/SIZE]',
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Поооооооооооооооооооон ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'На рассмотрении',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=rgb(255, 140, 0)]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/I][/FONT][/SIZE]<br><br>' +
        "[SIZE=4][I][COLOR=rgb(0, 255, 255)][FONT=courier new]Ваша жалоба взята на рассмотрение.[/FONT][/COLOR][/SIZE][/I]<br>" +
        "[SIZE=4][I][COLOR=rgb(0, 255, 255)][FONT=courier new]Не нужно создавать копии этой жалобы, ожидайте ответа в этой теме.[/COLOR][/I][/FONT][/SIZE][/CENTER] <br>" +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zByWk0xc/giphy-3.gif[/img][/url][/CENTER]',
        prefix: PIN_PREFIX,
      status: true,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Правила рп процесса ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'нрп поведение',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.01. Запрещено поведение, нарушающее нормы процессов Role Play режима игры [Color=#00FF00]| Jail 30 минут[/color]. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'уход от рп',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.02. Запрещено целенаправленно уходить от Role Play процесса всеразличными способами [Color=#00FF00]| Jail 30 минут / Warn[/color]. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нрп драйв',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.03. Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере [Color=#00FF00]| Jail 30 минут[/color]. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нрп развод',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.05. Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [Color=#00FF00]| PermBan[/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'рп в свою сторону/пользу',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.06. Запрещены любые Role Play отыгровки в свою сторону или пользу [Color=#00FF00]| Jail 30 минут[/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'аморал действия',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.08. Запрещена любая форма аморальных действий сексуального характера в сторону игроков [Color=#00FF00]| Jail 30 минут / Warn[/color]. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'слив склада',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.09. Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color]. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'затягивание рп',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.12. Запрещено целенаправленное затягивание Role Play процесса [Color=#00FF00] | Jail 30 минут[/color]. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ДБ',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.13. Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [Color=#00FF00] | Jail 60 минут[/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'РК',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.14. Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти [Color=#00FF00] | Jail 30 минут[/color]. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ТК',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.15. Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины [Color=#00FF00] | Jail 60 минут / Warn (за два и более убийства)[/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'СК',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.16. Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них [Color=#00FF00] | Jail 60 минут / Warn (за два и более убийства)[/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ПГ',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.17. Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь [Color=#00FF00] | Jail 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'МГ',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.18. Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [Color=#00FF00] | Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ДМ',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.19. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [Color=#00FF00] | Jail 60 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'масс ДМ',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.20. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более [Color=#00FF00] | Warn / Ban 3 - 7 дней [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'богоюз',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.21. Запрещено пытаться обходить игровую систему или использовать любые баги сервера [Color=#00FF00] | Ban 15 - 30 дней / PermBan [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'сторонее по',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00] | Ban 15 - 30 дней / PermBan [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'реклама',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.31. Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное [Color=#00FF00] | Ban 7 дней / PermBan [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'уход от наказания',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.34. Запрещен уход от наказания [Color=#00FF00] | Ban 15 - 30 дней (суммируется к общему наказанию дополнительно) [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'OОC угрозы',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.37. Запрещены OOC угрозы, в том числе и завуалированные [Color=#00FF00] | Mute 120 минут / Ban 7 дней [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'злоуп наказаниями',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.39. Злоупотребление нарушениями правил сервера [Color=#00FF00] | Ban 7 - 30 дней [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'оск проекта',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.40. Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [Color=#00FF00] | Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором) [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'продажа промо',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.43. Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций [Color=#00FF00] |  Mute 120 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ЕПП фура',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.47. Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) [Color=#00FF00] |  Jail 60 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'арест в инте',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.50. Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий [Color=#00FF00] |  Ban 7 - 15 дней + увольнение из организации [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нрп аксесуар',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.52. Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. [Color=#00FF00] | При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'мат в названии',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.53. Запрещено устанавливать названия для внутриигровых ценностей с использованием нецензурной лексики, оскорблений, слов политической или религиозной наклонности [Color=#00FF00] | Ban 1 день / При повторном нарушении обнуление бизнеса [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'оск адм',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.54. Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [Color=#00FF00] | Mute 180 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'баг с аним',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.55. Запрещается багоюз связанный с анимацией в любых проявлениях. [Color=#00FF00] | Jail 60 / 120 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴казик/ночной клуб╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'принятие за деньги',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.01. Владельцу и менеджерам казино и ночного клуба запрещено принимать работников за денежные средства на должность охранника, крупье или механика [Color=#00FF00] | Ban 3 - 5 дней. [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'налог за должность',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.02. Владельцу и менеджерам казино и ночного клуба запрещено взимать у работников налоги в виде денежных средств за должность в казино [Color=#00FF00] | Ban 3 - 5 дней. [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'выгонять без причины',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.03. Охраннику казино запрещено выгонять игрока без причины [Color=#00FF00] | Увольнение с должности | Jail 30 минут. [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ставка больше чем просят',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.03. Крупье запрещено делать ставку выше, чем просят игроки [Color=#00FF00] | Увольнение с должности. [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Чат ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'разговор не на русском',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.01. Общепризнанный язык сервера — русский. Общение в IC чатах во всех Role Play ситуациях обязательно должно проходить исключительно на русском языке [Color=#00FF00] | Устное замечание / Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'капс',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.02. Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате [Color=#00FF00] | Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'оск в OOC',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.03. Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены [Color=#00FF00] | Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'оск/упом род',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.04. Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [Color=#00FF00] | Mute 120 минут / Ban 7 - 15 дней [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'флуд',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.05. Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [Color=#00FF00] | Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'злоуп символами',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.06. Запрещено злоупотребление знаков препинания и прочих символов [Color=#00FF00] | Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'оск 18+',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.07. Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата [Color=#00FF00] | Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'слив',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.08. Запрещены любые формы «слива» посредством использования глобальных чатов [Color=#00FF00] | PermBan [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'угроза наказанием со стороны адм',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.09. Запрещены любые угрозы о наказании игрока со стороны администрации [Color=#00FF00] | Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'выдача себя за адм',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.10. Запрещена выдача себя за администратора, если таковым не являетесь [Color=#00FF00] | Ban 7 - 15 + ЧС администрации[/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ввод в заблуждение',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.11. Запрещено введение игроков проекта в заблуждение путем злоупотребления командами [Color=#00FF00] | Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ввод в заблуждение адм',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.32. Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта [Color=#00FF00] | Ban 7 - 15 дней  / PermBan[/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'оффтоп в реп',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.12. Запрещено подавать репорт написанный транслитом, с сообщением не по теме (Offtop), с включенным Caps Lock и повторять обращение (если ответ был уже дан ранее) [Color=#00FF00] | Report Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url]][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'помеха игровому процессу',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.40. Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [Color=#00FF00] | Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором)  [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url]][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нецензурная брань в реп',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.13. Запрещено подавать репорт с использованием нецензурной брани [Color=#00FF00] | Report Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'музыка',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.14. Запрещено включать музыку в Voice Chat [Color=#00FF00] | Mute 60 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'оск/упом род в воис',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.15. Запрещено оскорблять игроков или родных в Voice Chat [Color=#00FF00]| | Mute 120 минут / Ban 7 - 15 дней [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'шумы в воис',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.16. Запрещено создавать посторонние шумы или звуки [Color=#00FF00] | Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'реклама в воис',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.17. Запрещена реклама в Voice Chat не связанная с игровым процессом [Color=#00FF00] | Ban 7 - 15 дней [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'полит/религ пропоганда',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.18. Запрещено политическое и религиозное пропагандирование [Color=#00FF00] | Mute 120 минут / Ban 10 дней [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'изменение голоса софтом',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.19. Запрещено использование любого софта для изменения голоса [Color=#00FF00] | Mute 60 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'транслит',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.20. Запрещено использование транслита в любом из чатов [Color=#00FF00] | Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'реклама промо',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.21. Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. [Color=#00FF00] | Ban 30 дней [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'обьява в гос орг',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.22. Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) [Color=#00FF00] | Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ники ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'нрп ник',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>4.06. Никнейм игрового аккаунта должен быть в формате Имя_Фамилия на английском языке [Color=#00FF00] | Устное замечание + смена игрового никнейма [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url]][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'оск ник',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>4.09. Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные) [Color=#00FF00] | Устное замечание + смена игрового никнейма / PermBan [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'фейк',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>4.10. Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию [Color=#00FF00] | Устное замечание + смена игрового никнейма / PermBan [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴правила форума ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'неадекват',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил пользования форумом:<br>2.02. Запрещено неадекватное поведение в любой возможной форме, от оскорблений простых пользователей, до оскорбления администрации или других членов команды проекта. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'травля пользователя',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил пользования форумом:<br>2.03. Запрещена массовая травля, то есть агрессивное преследование одного из пользователей данного форума. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'провокация, розжик конфликта',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил пользования форумом:<br>2.04. Запрещены латентные, то есть скрытные (завуалированные), саркастические сообщения/действия, созданные в целях оскорбления того или иного лица, либо для его провокации и дальнейшего розжига конфликта. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'реклама',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил пользования форумом:<br>2.05. Запрещена совершенно любая реклама любого направления. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: '18+',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил пользования форумом:<br>2.06. Запрещено размещение любого возрастного контента, которые несут в себе интимный, либо насильственный характер, также фотографии содержащие в себе шок-контент, на примере расчленения и тому подобного. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'флуд, оффтоп',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил пользования форумом:<br>2.07. Запрещено флудить, оффтопить во всех разделах которые имеют строгое назначение. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'религия/политика',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил пользования форумом:<br>2.09. Запрещены споры на тему религии/политики. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'помеха развитию проекта',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил пользования форумом:<br>2.14. Запрещены деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'попрошайничество',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил пользования форумом:<br>2.16. Запрещено вымогательство или попрошайничество во всех возможных проявлениях. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'злоуп капсом/транслитом',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил пользования форумом:<br>2.17. Запрещено злоупотребление Caps Lock`ом или транслитом. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'дубликат тем',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил пользования форумом:<br>2.18. Запрещена публикация дублирующихся тем. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'бесмысленый/оск ник фа',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил пользования форумом:<br>3.02. Запрещено регистрировать аккаунты с бессмысленными никнеймами и содержащие нецензурные выражения. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'похож ник фа на адм',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил пользования форумом:<br>3.03. Запрещено регистрировать аккаунты с никнеймами похожими на никнеймы администрации. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴правила гос ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'работа в форме',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>1.07. Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, принадлежащей своей фракции [Color=#00FF00] | Jail 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'т/с в личн целях',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>1.08. Запрещено использование фракционного транспорта в личных целях [Color=#00FF00] | Jail 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'патруль в одинучку',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>1.11. Всем силовым структурам запрещен одиночный патруль или конвоирование, минимум 2 сотрудника [Color=#00FF00] | Jail 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'прогул рд',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>1.13. Запрещено находиться в форме внутри казино, участвовать в битве за контейнеры, участвовать в захвате семейного контейнера, находится на Б/У рынке с целью покупки / продажи авто, а также устраиваться на сторонние работы в форме фракции [Color=#00FF00] | Jail 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'урон вне теры военки (армия)',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.02. Наносить урон игрокам, которые находятся вне территории воинской части, запрещено [Color=#00FF00] | DM / Jail 60 минут / Warn [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'лицензия без рп (право)',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.01. Запрещена выдача лицензий без Role Play отыгровок; [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'адвокат без рп (право)',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.02. Запрещено оказание услуг адвоката без Role Play отыгровок. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Не по ПРО (СМИ)',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>4.01. Запрещено редактирование объявлений, не соответствующих ПРО | [Color=#00FF00] | Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Не по ППЭ (СМИ)',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>4.02. Запрещено проведение эфиров, не соответствующих Role Play правилам и логике [Color=#00FF00] | Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url]][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'замена текста обьявки (СМИ)',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>4.04. Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком [Color=#00FF00] | Ban 7 дней + ЧС организации [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'оружие в форме (цб)',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>5.01. Запрещено использование оружия в рабочей форме.; [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Урон без рп причины (УМВД/ГИБДД/ФСБ/ФСИН)',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br> Запрещено наносить урон игрокам без Role Play причины на территории УМВД/ГИБДД/ФСБ/ФСИН [Color=#00FF00] | DM / Jail 60 минут / Warn [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'розыск без причины (УМВД/ФСБ/ГИБДД)',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br> 7.02. Запрещено выдавать розыск, штраф без Role Play причины [Color=#00FF00] | Warn [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нрп поведение (УМВД/ГИБДД/ФСБ)',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br> Запрещено nRP поведение [Color=#00FF00] |  Warn [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'отбор вод прав при погоне (ГИБДД)',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br> 7.05. Запрещено отбирать водительские права во время погони за нарушителем [Color=#00FF00] |  Warn [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'остановка и осмотр т/с без рп (ГИБДД)',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br> 7.04. Запрещено останавливать и осматривать транспортное средство без Role Play отыгровки; [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'маскировка в лич целях (ФСБ)',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br> 8.04. Запрещено использовать маскировку в личных целях; [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'обыск без рп (ФСБ)',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br> 8.06. Запрещено проводить обыск игрока без Role Play отыгровки. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴правила опг ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'провокация гос',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br> 2. Запрещено провоцировать сотрудников государственных организаций [Color=#00FF00] |  Jail 30 минут [/color][/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'провокация опг на их тере',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br> 3. Запрещено провоцировать сотрудников криминальных организаций возле или на территории вражеской группировки [Color=#00FF00] |  Jail 30 минут [/color][/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'урон без причины на тере',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br> 4. Запрещено без причины наносить урон игрокам на территории ОПГ [Color=#00FF00] |  Jail 60 минут [/color][/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'дуэли',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br> 5. Запрещено устраивать дуэли где-либо, а также на территории ОПГ [Color=#00FF00] |  Jail 30 минут [/color][/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'перестрелки в людных местах',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br> 6. Запрещено устраивать перестрелки с другими ОПГ в людных местах [Color=#00FF00] |  Jail 60 минут [/color][/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'реклама в /f',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br> 7. Запрещена любая реклама (семей, транспортных и строительных компаний и т.д.), предложения о купле, продаже, обмене чего-либо в чате организации [Color=#00FF00] |  Mute 30 минут [/color][/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'cкрыться от копа на базе',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br> 8. Запрещено уходить от погони со стороны правоохранительных органов путем заезда на территорию своей банды для того чтобы скрыться или получить численное преимущество [Color=#00FF00] |  Jail 30 минут [/color][/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нон рп вч',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br> За нарушение правил нападения на Войсковую Часть выдаётся предупреждение [Color=#00FF00] | Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ) [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'находится на тере бв лишний',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br> 1.06. На территории проведения бизвара может находиться только сторона атаки и сторона защиты [Color=#00FF00] | Jail 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нон рп ограбление/похищение(джаил)',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок получит наказание в виде деморгана за нарушение правил ограблений/похищений [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нон рп ограбление/похищение(варн)',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок получит наказание в виде предупреждения за нарушение правил ограблений/похищений [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нон рп ограбление/похищение(бан)',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок получит наказание в виде блокировки аккаунта за нарушение правил ограблений/похищений [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Fz4HDK8p/image.jpg[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴другой раздел ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'в жб на адм',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Вы ошиблись разделом.<br>Обратитесь в раздел [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.192/']Жалобы на администрацию[/URL]. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'в жб на лд',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Вы ошиблись разделом.<br>Обратитесь в раздел [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.193/']Жалобы на лидеров[/URL]. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'в обжалования',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Вы ошиблись разделом.<br>Обратитесь в раздел [URL='https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.195/']Обжалование наказаний[/URL]. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'в тех раздел',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Вы ошиблись разделом.<br>Обратитесь в [URL='https://forum.blackrussia.online/index.php?forums/Технический-раздел.22/']Технический раздел[/URL]. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'в жб на теха',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Вы ошиблись разделом.<br>Обратитесь в [URL='https://forum.blackrussia.online/index.php?forums/Жалобы-на-технических-специалистов.490/']Жалобы на технических специалистов[/URL]. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'в жб на сотрудников орги',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Вы ошиблись разделом.<br>Обратитесь в раздел жалоб на сотрудников данной организации. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴передам ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'для згкф/гкф',
      content:
		'[Color=#FFA500][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Ваша жалоба была передана на рассмотрение [Color=#00FF00]Заместителю Главного Куратора форума/[/COLOR][Color=#1E90FF]Главному Куратору Форума.[/COLOR]  [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][size=1][ISPOILER]@Sky_Hennessy , @Perryn Bossard [/ISPOILER][/size][/CENTER]<br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/WzS9J9zf/giphy-2.gif[/img][/url][/CENTER]',
      prefix: PIN_PREFIX,
	  status: true,
    },
    {
      title: 'для куратора',
      content:
		'[Color=#FFA500][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Ваша жалоба была передана на рассмотрение [Color=#9365B8]Куратору Администрации.[/COLOR] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/WzS9J9zf/giphy-2.gif[/img][/url][/CENTER]',
      prefix: PIN_PREFIX,
	  status: true,
    },

     {
      title: 'Для ГС ГОСС',
      content:
		'[Color=#FFA500][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Ваша жалоба была передана на рассмотрение ГС ГОСС. [/COLOR][/FONT][/CENTER] <br>" +
		'[Color=#ff4500][CENTER]Ожидайте ответа.[/CENTER][/color]' +
        "[CENTER][ISPOILER]@John_Blaze [/ISPOILER][/CENTER]<br>" ,
      prefix: PIN_PREFIX,
	  status: true,
    },
    {
      title: 'для зга',
      content:
		'[Color=#FFA500][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Ваша жалоба была передана на рассмотрение Заместителю Главного Администратора. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/WzS9J9zf/giphy-2.gif[/img][/url][/CENTER]',
      prefix: PIN_PREFIX,
	  status: true,
    },
    {
      title: 'для теха',
      content:
		'[Color=#FFA500][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Ваша жалоба была передана на рассмотрение [Color=#FF4500]техническому специалисту.[/COLOR] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/WzS9J9zf/giphy-2.gif[/img][/url][/CENTER]',
      prefix: TEX_PREFIX,
	  status: true,
    },
    {
      title: 'для га',
      content:
		'[Color=#FFA500][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Ваша жалоба была передана на рассмотрение [Color=#DC143C]Главному Администратору.[/COLOR]  [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/WzS9J9zf/giphy-2.gif[/img][/url][/CENTER]',
      prefix: GA_PREFIX,
	  status: true,
    },
    {
      title: 'для спеца',
      content:
		'[Color=#FFA500][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Ваша жалоба была передана на рассмотрение [Color=#FF0000]Специальной Администрации.[/COLOR] <br> [ISPOILER]@Sander_Kligan @Clarence Crown[/ISPOILER] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/WzS9J9zf/giphy-2.gif[/img][/url][/CENTER]',
      prefix: SPECY_PREFIX,
	  status: true,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴отказ жб ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'нарушений не найдено',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Нарушений со стороны данного игрока не было найдено. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/bJF3mxS0/images-1.gif[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Плохое качество',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]У ваших доказатесльств плохое качество. [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#00FFFF][FONT=courier new]Создайте новую жалобу с хорошым качеством. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/bJF3mxS0/images-1.gif[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'мало докв',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Недостаточно доказательств на нарушение от данного игрока. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/bJF3mxS0/images-1.gif[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'дубликат',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Дублироване темы.<br>Если вы дальше будете заниматься данной деятельностью (дублированием тем), то ваш форумный аккаунт будет заблокирован. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/bJF3mxS0/images-1.gif[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'не по форме',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Ваша жалоба составлена не по форме.<br>Убедительная просьба ознакомиться [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/']с правилами подачи жалоб на игроков[/URL]. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/bJF3mxS0/images-1.gif[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нет тайма',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]На ваших доказательствах отсутствует /time. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/bJF3mxS0/images-1.gif[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'видео более 3х минут.',
      content:
		'[Color=#FFA500][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Ваше видео более 3х минут.3.7 Если видеодоказательство длится более 3 минут, Вы должны указать тайм-коды нарушений.<br>Укажите тайм коды нарушений игрока и создайте новую жалобу. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/bJF3mxS0/images-1.gif[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'более 72 часов',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Срок написания жалобы составляет три дня (72 часа) с момента совершенного нарушения со стороны игрока сервера. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/bJF3mxS0/images-1.gif[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'соц сеть',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur). [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/bJF3mxS0/images-1.gif[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нет условий сделки',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]В ваших доказательствах отсутствуют условия сделки [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/bJF3mxS0/images-1.gif[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нужен фрапс',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]В таких случаях нужен фрапс. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/bJF3mxS0/images-1.gif[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нужен фрапс + промотка чата',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]В таких случаях нужен фрапс + промотка чата. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/bJF3mxS0/images-1.gif[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нужна промотка чата',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]В таких случаях нужна промотка чата. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/bJF3mxS0/images-1.gif[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'фрапс обрывается',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Ваш фрапс обрывается, загрузите полный фрапс на ютуб. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/bJF3mxS0/images-1.gif[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'не работают доки',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Доказательства не работают. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нет докв',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]В вашей жалобе отсутствуют доказательства. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'доква отредактированы',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Ваши доказательства отредактированы. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: '3-е лицо',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Жалоба от третьего лица не принимается (жалоба должна быть подана участником ситуации). [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'долг',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Долг дается на ваш страх и риск. Невозврат долга не наказуем [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'не тот сервер',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Вы ошиблись сервером.<br> Обратитесь в раздел жалоб на игроков вашего сервера. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'не написал ник',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игровой ник автора жалобы, ник игрока, на которого подается жалоба, должны быть указаны в соответствии с правилами подачи жалоб, даже если эта информация присутствует на доказательствах или в тексте жалобы. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'не подтвердил условия сделки',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок не подтвердил условия вашей сделки. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'закрыт доступ к гугл диску',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]К гугл диску закрыт доступ, пожалуйста откройте доступ, либо загрузите доказательства на фотохостинг(YouTube, Япикс, imgur). <br> [SPOILER=Скрин][url=https://postimages.org/][img]https://i.postimg.cc/FRpfsF2k/image.png[/img][/url][/SPOILER] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'закрыт доступ к яндекс диску',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]К яндекс диску закрыт доступ, пожалуйста откройте доступ, либо загрузите доказательства на фотохостинг(YouTube, Япикс, imgur). <br> [SPOILER=Скрин][url=https://postimages.org/][img]https://i.postimg.cc/7YvGNcwR/image.png[/img][/url][/SPOILER] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'не доказал что владелец фамы',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Нет доказательств того, что вы являетесь владельцем семьи. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'премия в тк/ск',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Владелец сам выбирает какую премию будет платить и что нужно сделать, что бы ее получить, не нравятся условия - уходите из этой компании. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'не указал тайм-коды',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Тайм-коды не были указаны за 24 часа, соответственно жалоба получает статус - [Color=#DC143C]Отказано.[/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
];
const buttons2 = [

    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴биографии ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'био одобрено',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Ваша РП биография получает статус - [Color=#00FF00]Одобрено[/color]. [/COLOR][/FONT][/CENTER] <br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'био на доработке',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Вам даётся 24 часа на дополнение вашей РП биографии, в противном случае она получит статус - [Color=#DC143C]Отказано[/color]. [/COLOR][/FONT][/CENTER] <br>",
      prefix: PIN_PREFIX,
    },
    {
      title: 'био отказ',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Ваша РП биография получает статус - [Color=#DC143C]Отказано[/color].<br>Причиной отказа послужило нарушение [URL='https://forum.blackrussia.online/index.php?threads/crimson-Правила-составления-РП-Биографий.463667/']Правила написания RP биографии[/URL]. [/COLOR][/FONT][/CENTER] <br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
           title: 'био отказ (3е лицо)',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Ваша РП биография получает статус - [Color=#DC143C]Отказано[/color].<br>Причиной отказа могло послужить создание биографии от 3го лица.[/COLOR][/FONT][/CENTER] <br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
           title: 'био отказ (заголовок темы)',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Ваша РП биография получает статус - [Color=#DC143C]Отказано[/color].<br>Причиной отказа могло послужить неправильное заполнение заголовка темы.[/COLOR][/FONT][/CENTER] <br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'био отказ(плагиат)',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Ваша РП биография получает статус - [Color=#DC143C]Отказано[/color].<br>Причиной отказа послужило - Плагиат. [/COLOR][/FONT][/CENTER] <br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'био отказ(не дополнил)',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Ваша РП биография получает статус - [Color=#DC143C]Отказано[/color].<br>Причиной отказа послужило - Не дополнили биографию в течение 24-х часов. [/COLOR][/FONT][/CENTER] <br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'био отказ (не совпадает возвраст)',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Ваша РП биография получает статус - [Color=#DC143C]Отказано[/color].<br>Возвраст персонажа и дата рождения не совпадают.[/COLOR][/FONT][/CENTER] <br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'био отказ (мало инфы)',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Ваша РП биография получает статус - [Color=#DC143C]Отказано[/color].<br>В вашей Биографии мало информации.[/COLOR][/FONT][/CENTER] <br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'био отказ (меньше 18)',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Ваша РП биография получает статус - [Color=#DC143C]Отказано[/color].<br>Вашему персонажу меньше 18-ти лет.[/COLOR][/FONT][/CENTER] <br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'био отказ (нету даты рождения)',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Ваша РП биография получает статус - [Color=#DC143C]Отказано[/color].<br>В вашей Биографии не указана Дата рождения.[/COLOR][/FONT][/CENTER] <br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'био отказ (нет места рождения)',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Ваша РП биография получает статус - [Color=#DC143C]Отказано[/color].<br>В вашей Биографии не указано место рождения'.[/COLOR][/FONT][/CENTER] <br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'био отказ (ник на разных языках)',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Ваша РП биография получает статус - [Color=#DC143C]Отказано[/color].<br>В названии биографии и в самой биографии Имя Фамилия указаны на разных языках.[/COLOR][/FONT][/CENTER] <br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Ник с нижнем подчеркиванием',
      content:
        '[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Ваша РП биография получает статус - [Color=#DC143C]Отказано[/color].<br>В нике присуствует нижнее подчеркивание.[/COLOR][/FONT][/CENTER] <br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нету пункта настоящее время',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Ваша РП биография получает статус - [Color=#DC143C]Отказано[/color].<br>Нету пункта 'Настоящее время'.[/COLOR][/FONT][/CENTER] <br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нету пункта юность и взрослая жизнь',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Ваша РП биография получает статус - [Color=#DC143C]Отказано[/color].<br>Нету пункта 'Юность и взрослая жизнь'.[/COLOR][/FONT][/CENTER] <br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нету пункта детство',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Ваша РП биография получает статус - [Color=#DC143C]Отказано[/color].<br>Нету пункта 'Детство'.[/COLOR][/FONT][/CENTER] <br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'нету пункта хобби',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Ваша РП биография получает статус - [Color=#DC143C]Отказано[/color].<br>Нету пункта 'Хобби'.[/COLOR][/FONT][/CENTER] <br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'био отказ (не по форме)',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]РП биография получает статус - [Color=#DC143C]Отказано[/color].<br>Биография не по форме.[/COLOR][/FONT][/CENTER] <br>",
      prefix:UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'био отказ (в нике нижнее подчеркивание)',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Ваша РП биография получает статус - [Color=#DC143C]Отказано[/color].<br>В названии биографии или в самой биографии Имя Фамилия указаны с нижним подчеркиванием.[/COLOR][/FONT][/CENTER] <br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
];
    const buttons3 = [
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ситуации ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'сита одобрена',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Ваша РП ситуация получает статус - [Color=#00FF00]Одобрено[/color]. [/COLOR][/FONT][/CENTER] <br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'сита на доработке',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Вам даётся 24 часа на дополнение вашей РП ситуации, в противном случае она получит статус - [Color=#DC143C]Отказано[/color]. [/COLOR][/FONT][/CENTER] <br>",
      prefix: PIN_PREFIX,
    },
    {
      title: 'сита отказ',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Ваша РП ситуация получает статус - [Color=#DC143C]Отказано[/color]. [/COLOR][/FONT][/CENTER] <br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'сита отказ(не тот сервер)',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Вы ошиблись разделом. Напишите в тот раздел который вам нужен! - [Color=#DC143C]Отказано[/color]. [/COLOR][/FONT][/CENTER] <br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'сита одобрена+денег не дам',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        '[CENTER][Color=#00FFFF][FONT=courier new]Ваша РП ситуация получает статус - [Color=#00FF00]Одобрено[/color]. [/COLOR][/FONT][/CENTER] <br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Так же хочу отметить, что игровую валюту вы не получите за ограбление чего-либо по РП. [/COLOR][/FONT][/CENTER] <br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'сита отказ+денег не дам',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        '[CENTER][Color=#00FFFF][FONT=courier new]Ваша РП ситуация получает статус - [Color=#DC143C]Отказано[/color]. [/COLOR][/FONT][/CENTER] <br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Так же хочу отметить, что игровую валюту вы не получите за ограбление чего-либо по РП. [/COLOR][/FONT][/CENTER] <br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Неофициальные RP организации ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'неоф орг одобрена',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Ваша Неофициальная RP организация получает статус - [Color=#00FF00]Одобрено[/color]. [/COLOR][/FONT][/CENTER] <br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'неоф орг отказ(не тот сервер)',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Вы ошиблись разделом. Напишите в тот раздел который вам нужен! - [Color=#DC143C]Отказано[/color]. [/COLOR][/FONT][/CENTER] <br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'неоф орг на доработке',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Вам даётся 24 часа на дополнение вашей Неофициальной RP организации, в противном случае она получит статус - [Color=#DC143C]Отказано[/color]. [/COLOR][/FONT][/CENTER] <br>",
      prefix: PIN_PREFIX,
    },
    {
      title: 'неоф орг отказ',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Ваша Неофициальная RP организация получает статус - [Color=#DC143C]Отказано[/color]. [/COLOR][/FONT][/CENTER] <br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
];
const xp = [

    {
        title: '🎃 Жалобы на игроков 🎃'
    },
    {
        title: '💎 Биографии 💎'
    },

    {
        title: '⋙ Ситуации и Неоф орги ⋘'
    },

    {
        title: '♥Скрипт от Angel_Sakurai♥'
    },
];
$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
    addButton('🎃 Жалобы на игроков 🎃', 'selectAnswer');
    addButton('💎 Биографии 💎', 'selectAnswer2');
    addButton('⋙ Ситуации и Неоф орги ⋘', 'selectAnswer3');
    addButton('🎃 Меню 💎', 'xp');


	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
	$('button#Ga').click(() => editThreadData(GA_PREFIX, true));
	$('button#Spec').click(() => editThreadData(SPECY_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
	$('button#Texy').click(() => editThreadData(TEX_PREFIX, true));
	$('button#Resheno').click(() => editThreadData(RESHENO_PREFIX, false));
	$('button#Close').click(() => editThreadData(CLOSE_PREFIX, false));

	$(`button#selectAnswer`).click(() => {
		XF.alert(buttonsMarkup(buttons), null, '🎃 Жалобы на игроков 🎃');
		buttons.forEach((btn, id) => {
			if(id > 1) {
				$(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
			} else {
				$(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
			}
		});
	});


	$(`button#selectAnswer2`).click(() => {
		XF.alert(buttonsMarkup2(buttons2), null, '💎 Биографии и т.д. 💎:');
		buttons2.forEach((btn, id) => {
			if(id > 0) {
				$(`button#answers2-${id}`).click(() => pasteContent2(id, threadData, true));
			} else {
				$(`button#answers2-${id}`).click(() => pasteContent2(id, threadData, false));
			}
		});
	});

	$(`button#selectAnswer3`).click(() => {
		XF.alert(buttonsMarkup3(buttons3), null, '⋙ Ситуации и Неоф орги ⋘');
		buttons3.forEach((btn, id) => {
			if(id > 0) {
				$(`button#answers3-${id}`).click(() => pasteContent3(id, threadData, true));
			} else {
				$(`button#answers3-${id}`).click(() => pasteContent3(id, threadData, false));
			}
		});
	});

	$(`button#xp`).click(() => {
		XF.alert(buttonsMarkupxp(xp), null, 'Инфа о скрипте:');
		xp.forEach((btn, id) => {
			if(id > 0) {
				$(`xp-${id}`).click(() => xp(xp, xp, true));
			} else {
				$(`xp-${id}`).click(() => xp(xp, xp, false));
			}
		});
	});
});

function addButton(name, id) {
$('.button--icon--reply').before(
  `<button type="button"" class="button--reply button" id="${id}" style="margin: 3px; color: yellow; ">${name}</button>`,
);
}

function buttonsMarkup(buttons) {
return `<div class="select_answer">${buttons
  .map(
	(btn, i) =>
	  `<button id="answers-${i}" class="button--primary button ` +
	  `rippleButton" style="margin: 3px; color: red; background-color:black;"><span class="button-text">${btn.title}</span></button>`,
  )
  .join('')}</div>`;
}

function buttonsMarkup2(buttons2) {
return `<div class="select_answer2">${buttons2
  .map(
	(btn, i) =>
	  `<button id="answers2-${i}" class="button--primary button ` +
	  `rippleButton" style="margin: 3px; color: yellow; background-color:black;"><span class="button-text">${btn.title}</span></button>`,
  )
  .join('')}</div>`;
}



function buttonsMarkup3(buttons3) {
return `<div class="select_answer3">${buttons3
  .map(
  (btn, i) =>
    `<button id="answers3-${i}" class="button--primary button ` +
    `rippleButton" style="margin: 3px; color: blue; background-color:black;"><span class="button-text">${btn.title}</span></button>`,
  )
  .join('')}</div>`;
}

function buttonsMarkupxp(xp) {
return `<div class="xp">${xp
  .map(
  (btn, i) =>
    `<button id="xp-${i}" class="button--primary button ` +
    `rippleButton" style="margin: 3px; color: purple; background-color:black;"><span class="button-text">${btn.title}</span></button>`,
  )
  .join('')}</div>`;
}

function pasteContent3(id, data = {}, send = false) {
	const template = Handlebars.compile(buttons3[id].content);
	if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

	$('span.fr-placeholder').empty();
	$('div.fr-element.fr-view p').append(template(data));
	$('a.overlay-titleCloser').trigger('click');

	if(send == true){
		editThreadData(buttons3[id].prefix, buttons3[id].status);
		$('.button--icon.button--icon--reply.rippleButton').trigger('click');
	}
  }

function pasteContent2(id, data = {}, send = false) {
	const template = Handlebars.compile(buttons2[id].content);
	if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

	$('span.fr-placeholder').empty();
	$('div.fr-element.fr-view p').append(template(data));
	$('a.overlay-titleCloser').trigger('click');

	if(send == true){
		editThreadData(buttons2[id].prefix, buttons2[id].status);
		$('.button--icon.button--icon--reply.rippleButton').trigger('click');
	}
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