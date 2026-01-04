// // ==UserScript==
// @name         Скрипт для Кураторов форума UFA
// @namespace    https://forum.blackrussia.online
// @version      4.8.3
// @description  Скрипт для Кураторов Форума, сервер Ufa
// @author       Mihail_Tinkoff
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @collaborator Tinkoff
// @icon https://takocode.ru/assets/imgs/avatar.gif
// @downloadURL https://update.greasyfork.org/scripts/472855/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20UFA.user.js
// @updateURL https://update.greasyfork.org/scripts/472855/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20UFA.meta.js
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
      content: '[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]',
   },
   {
    title: 'Жалоба на рассмотрении',
    content:
		"[CENTER][FONT=times new roman][SIZE=4][url=https://postimages.org/][img]https://i.postimg.cc/9Q566tGB/dolorpavs-2.png[/img][/url]<br>" +
		'[Color=yellow]Здравствуйте, уважаемый игрок.[/color][/size]<br><br>' +
        "[size=4]Ваша жалоба взята на рассмотрение.<br>Просьба ожидать ответа и не создавать дубликаты данной темы.<br><br>" +
		'На рассмотрении.[/CENTER][/FONT]',
      prefix: PINN_PREFIX,
	  status: true,
    },
  
    {
  
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Пункты 2.0-2.54╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Нонрп поведение',
      content:
		"[CENTER][FONT=times new roman][SIZE=4][url=https://postimages.org/][img]https://i.postimg.cc/9Q566tGB/dolorpavs-2.png[/img][/url]<br>" +
		'[Color=yellow]Здравствуйте, уважаемый игрок.[/color][/size]<br><br>' +
        "[size=4]Игрок будет наказан по данному пункту правил:<br>[QUOTE][Color=red]2.01 [/color]Запрещено поведение, нарушающее нормы процессов Role Play режима игры[Color=red]| Jail 30.[/color][/quote]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/3RFjwh6R/1619558447629-2.png[/img][/url]<br><br>' +
       "[Color=lime]Одобрено.[/CENTER][/color][/FONT]",
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Уход от РП',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>[quote][color=red]2.02. [/color] Запрещено целенаправленно уходить от Role Play процесса всеразличными способами[Color=red] | Jail 30 минут / Warn[/Color][/quote]<br>" +
       "[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
       '[Color=springgreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нонрп вождение',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>[quote][color=red]2.03. [/color] Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере[Color=red] | Jail 30 минут.[/Color][/quote]<br>" +
        "[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
        '[Color=springgreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'NonRP Обман',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>[quote][color=red]2.05. [/color] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики[Color=red] | PermBan.[/Color][/quote]<br>" +
        "[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
        '[Color=springgreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
    title: 'Вмеш в рп процесс',
    content:
      '[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>[quote][color=red]2.51. [/color] Запрещено вмешательство в Role Play процесс с целью помехи и препятствования дальнейшего развития Role Play процесса[color=red] | Jail 30 минут.[/color][/quote]<br>" +
         "[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
         '[Color=springGreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Аморал действия',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>[quote][color=red]2.08. [/color] Запрещена любая форма аморальных действий сексуального характера в сторону игроков[color=red] | Jail 30 минут / Warn.[/Color][/quote]<br>" +
        "[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
        '[Color=springGreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Слив склада',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>[quote][color=red]2.09. [/color] Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле[Color=red] | Ban 15 - 30 дней / PermBan.[/Color][/quote]<br>" +
        "[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
        '[Color=springGreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ДБ',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>[quote][color=red]2.13. [/color] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта[Color=red] | Jail 60 минут.[/Color][/quote]<br>" +
        "[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
        '[Color=springGreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'РК',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>[quote][color=Revenge]2.14. [/color] Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти[Color=red] | Jail 30 минут.[/Color][/quote]<br>" +
        "[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
        '[Color=springGreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ТК',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>[quote][color=red]2.15. [/color] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины[Color=red] | Jail 60 минут / Warn (за два и более убийства).[/Color][/quote]<br>" +
        "[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
        '[Color=springGreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'СК',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>[quote][color=red]2.16. [/color] Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них[Color=red] | Jail 60 минут / Warn (за два и более убийства).[/Color][/quote]<br>" +
        "[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
        '[Color=springGreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ПГ',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>[quote][color=red]2.17. [/color] Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь[Color=red] | Jail 30 минут.[/Color][/quote]<br>" +
        "[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
        '[Color=springGreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'MG',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>[quote][color=red]2.18. [/color] Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе[Color=red] | Mute 30 минут.[/Color][/quote]<br>" +
        "[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
        '[Color=springGreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ДМ',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>[quote][color=red]2.19. [/color] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины[Color=red] | Jail 60 минут.[/Color][/quote]<br>" +
        "[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
        '[Color=springGreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Масс ДМ',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>[quote][color=red]2.20. [/color] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины более трем игрокам[Color=red] | Warn / Ban 3 - 7 дней.[/Color][/quote]<br>" +
        "[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
        '[Color=springGreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: 'Стороннее ПО',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>[quote][color=red]2.22. [/color] Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками[Color=red] | Ban 15 - 30 дней / PermBan.[/Color][/quote]<br>" +
        "[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
        '[Color=springGreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Багоюз',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил:<br>[quote][color=red]2.21. [/color] Запрещено пытаться обходить игровую систему или использовать любые баги сервера[Color=red] | Ban 15 - 30 дней / PermBan.[/Color][/quote]<br>" +
        "[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
        '[Color=springGreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Реклама сторонние ресурсы',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>[quote][color=red]2.31. [/color] Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное [Color=red] | Ban 7 дней / PermBan.[/Color][/quote]<br>" +
        "[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
        '[Color=springGreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Обман/Введение в заблуждение',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>[quote][color=red]2.32. [/color] Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта[Color=red] | Ban 7 - 15 дней.[/Color][/quote]<br>" +
        "[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
        '[Color=springGreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'IC и OCC угрозы',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>[quote][color=red]2.35. [/color]На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате[Color=red] | Mute 120 минут / Ban 7 дней.[/Color][/quote]<br>" +
        "[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
        '[Color=springGreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Уход от наказания',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>[quote][color=red]2.34. [/color] Запрещен уход от наказания[color=red] | Ban 15 - 30 дней (суммируется к общему наказанию дополнительно).[/Color][/quote]<br>" +
        "[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
        '[Color=springGreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
 {
      title: 'Угрозы OOC',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил:<br>[quote][color=red]2.37. [/color] Запрещены OOC угрозы, в том числе и завуалированные[color=red] | Mute 120 минут / Ban 7 дней.[/color][/quote]<br>" +
        "[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
        "[color=springGreen]Одобрено, закрыто[/FONT][/CENTER]",
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Злоуп наказаниями',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил:<br>[quote][color=red]2.39. [/color] Злоупотребление нарушениями правил сервера[color=red] | Ban 7 - 30 дней.[/Color][/quote]<br>" +
        "[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
        '[Color=springGreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Оск проекта',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>[quote][color=red]2.40. [/color] Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе[Color=red] | Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором).[/Color][/quote]<br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
		'[Color=springGreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Продажа промо',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>[quote][color=red]2.43. [/color] Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций[Color=red] | Mute 120 минут.[/Color][/quote]<br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
		'[Color=springGreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ЕПП фура (инк и дал)',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>[quote][color=red]2.47. [/color] Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора)[Color=red] | Jail 60 минут.[/Color][/quote]<br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
		'[Color=springGreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Помеха РП процессу',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>[quote][color=red]2.51. [/color] Запрещено вмешательство в Role Play процесс с целью помехи и препятствования дальнейшего развития Role Play процесса[Color=red] | Jail 30 минут.[/Color][/quote]<br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
		'[Color=springGreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нонрп акс',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>[quote][color=red]2.52. [/color] Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера[color=red] | При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + Jail 30 минут.[/Color][/quote]<br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
		'[Color=springGreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Оск адм',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>[quote][color=red]2.54. [/color] Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации[Color=red] | Mute 180 минут.[/Color][/quote]<br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
		'[Color=springGreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Баг аним',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>[quote][color=red]2.55. [/color] Запрещается багоюз связанный с анимацией в любых проявлениях[Color=red] | Jail 60 / 120.[/Color][/quote]<br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
		'[Color=springGreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: 'Покупка/продажа ИВ',
     content: '[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>[quote][color=red]2.28. [/color] Запрещена покупка/продажа внутриигровой валюты в любых ее проявлениях за реальные деньги[Color=red] | PermBan с обнулением аккаунта + ЧС проекта.[/Color][/quote]<br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
		'[Color=springGreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Пункты 3.0-3.22╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Общение не на русском',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>[quote][color=red]3.01. [/color] Общепризнанный язык сервера — русский. Общение в IC и OOC чатах во всех RolePlay ситуациях обязательно должно проходить исключительно на русском языке[Color=red] | Устное замечание / Mute 30 минут.[/Color][/quote]<br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
		'[Color=springGreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Капс',
	  content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		"[CENTER]Игрок будет наказан по данному пункту правил:<br>[quote][color=red]3.02. [/color] Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате[Color=red] | Mute 30 минут.[/Color][/quote]<br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
		'[Color=springGreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Оск в ООС',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>[quote][color=red]3.03. [/color]Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены[Color=red] | Mute 30 минут.[/Color][/quote]<br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
		'[Color=springGreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Оск/Упом родни',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>[quote][color=red]3.04. [/color] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC)[Color=red] | Mute 120 минут / Ban 7 - 15 дней.[/Color][/quote]<br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
		'[Color=springGreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Флуд',
	  content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		"[CENTER]Игрок будет наказан по данному пункту правил:<br>[quote][color=red]3.05. [/color] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока[Color=red] | Mute 30 минут.[/Color][/quote]<br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
		'[Color=springGreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Злоуп знаками',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>[quote][color=red]3.06. [/color] Запрещено злоупотребление знаков препинания и прочих символов[Color=red] | Mute 30 минут.[/Color][/quote]<br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
		'[Color=springGreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Оскорбление',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>[quote][color=red]3.07. [/color] Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата[Color=red] | Mute 30 минут.[/Color][/quote]<br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
		'[Color=springGreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Слив чата',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>[quote][color=red]3.08. [/color] Запрещены любые формы «слива» посредством использования глобальных чатов[Color=red] | PermBan.[/Color][/quote]<br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color<br><br>" +
		'[Color=springGreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Угрозы о наказании со стороны адм',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил:<br>[quote][color=red]3.09. [/color]Запрещены любые угрозы о наказании игрока со стороны администрации[Color=red] | Mute 30 минут.[/Color][/quote]<br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
		'[Color=springGreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Выдача себя за адм ',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>[quote][color=red]3.10. [/color] Запрещена выдача себя за администратора, если таковым не являетесь[Color=red] | Ban 7 - 15 + ЧС администрации.[/Color][/quote]<br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
		'[Color=springGreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Ввод в заблуждение',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>[quote][color=red]3.11. [/color] Запрещено введение игроков проекта в заблуждение путем злоупотребления командами[Color=red] | Ban 15 - 30 дней / PermBan.[/Color][/quote]<br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
		'[Color=springGreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Транслит',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>[quote][color=red]3.20. [/color] Запрещено использование транслита в любом из чатов[Color=red] | Mute 30 минут.[/Color][/quote]<br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
		'[Color=springGreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
     },
     {
      title: 'Музыка в войс',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>[quote][color=red]3.14. [/color] Запрещено включать музыку в Voice Chat[Color=red] | Mute 60 минут.[/Color][/quote]<br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
		'[Color=springGreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Оск/Упом род в войс',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>[quote][color=red]3.15. [/color] Запрещено оскорблять игроков или родных в Voice Chat[color=red] | Mute 120 минут / Ban 7 - 15 дней.[/Color][/quote]<br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
		'[Color=springGreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Шум в войс',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>[quote][color=red]3.16. [/color] Запрещено создавать посторонние шумы или звуки[Color=red] | Mute 30 минут.[/Color][/quote]<br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
		'[Color=springGreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Реклама промо',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>[quote][color=red]3.21. [/color] Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах[Color=red] | Ban 30 дней.[/Color][/quote]<br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
		'[Color=springGreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Торговля на тт госс',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>[quote][color=red]3.22. [/color] Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC)[Color=red] | Mute 30 минут.[/Color][/quote]<br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
		'[Color=springGreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Религиозное и политическая пропоганда',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>[quote][color=red]3.18. [/color] Запрещено политическое и религиозное пропагандирование[color=red] | Mute 120 минут / Ban 10 дней.[/Color][/quote]<br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
		'[Color=springGreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Пункты 4.0-4.14╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Фейк аккаунт',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>[quote][color=red]4.10. [/color] Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию[Color=red] | Устное замечание + смена игрового никнейма / PermBan.[/Color][/quote]<br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
		'[Color=springGreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
    title: 'Мультиаккаунт',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>[quote][color=red]4.04. [/color] Разрешается зарегистрировать максимально только три игровых аккаунта на сервере[Color=red] | PermBan.[/Color][/quote]<br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
		'[Color=springGreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Пункты передачи╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Тех. спецу',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба была передана на рассмотрение [color=skyblue]Техническому специалисту[/Color].[/CENTER]<br>" +
		'[Color=Flame][CENTER]Ожидайте ответ.[/I][/CENTER][/color][/FONT]',
      prefix: TEXY_PREFIX,
	  status: true,
    },
    {
      title: 'Передано ГКФ',
      content: '[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба была передана на рассмотрение[Color=palegreen] Главному Куратору форума[/Color].[/CENTER]<br>" +
		'[Color=Flame][CENTER]Ожидайте ответ.[/I][/CENTER][/color][/FONT]',
      prefix: PINN_PREFIX,
	  status: true,
    },
    {
    
      title: 'Передано ГА',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба была передана на рассмотрение[Color=Red] Главному Администратору[/Color].[/CENTER]<br>" +
		'[Color=Flame][CENTER]Ожидайте ответ.[/I][/CENTER][/color][/FONT]',
      prefix: GA_PREFIX,
	  status: true,
    },
    {
      title: 'Передано Спецу',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба была передана на рассмотрение[Color=Red] Специальному администратору[/Color].[/CENTER]<br>" +
		'[Color=Flame][CENTER]Ожидайте ответ.[/I][/CENTER][/color][/FONT]',
      prefix: SPECY_PREFIX,
	  status: true,
    },
    {
    title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ Жб на сотрудника╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Пра-во',
	  content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		"[CENTER] Оставьте жалобу на сотрудника правительства в разделе Правительство.[/CENTER]<br>" +
		"[Color=lightblue][CENTER] Приятной игры на UFA.[/color][/CENTER]<br><br>" +
		'[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
	},
    {
      title: 'ФСБ',
	  content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		"[CENTER] Оставьте жалобу на сотрудника ФСБ в разделе ФСБ.[/CENTER]<br>" +
		"[Color=lightblue][CENTER] Приятной игры на UFA.[/CENTER][/color]<br><br>" +
		'[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
	},
    {
      title: 'ГИБДД',
	  content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		"[CENTER] Оставьте жалобу на сотрудника ГИБДД в разделе ГИБДД.[/CENTER]<br>" +
		"[Color=lightblue][CENTER] Приятной игры на UFA.[/CENTER][/color]<br><br>" +
		'[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
	},
    {
      title: 'УМВД',
	  content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		"[CENTER] Оставьте жалобу на сотрудника УМВД в разделе УМВД.[/CENTER]<br>" +
	    "[Color=lightblue][CENTER] Приятной игры на UFA.[/CENTER][/color]<br><br>" +
	    '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Армия',
	  content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		"[CENTER] Оставьте жалобу на сотрудника армии в разделе Армия.[/CENTER]<br>" +
		"[Color=lightblue][CENTER] Приятной игры на UFA.[/CENTER][/color]<br><br>" +
		'[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Больница',
	  content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		"[CENTER] Оставьте жалобу на сотрудника больницы в разделе Больница.[/CENTER]<br>" +
		"[Color=lightblue][CENTER] Приятной игры на UFA.[/CENTER][/color]<br><br>" +
		'[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
	},
    {
      title: 'СМИ',
	  content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		"[CENTER] Оставьте жалобу на сотрудника СМИ в разделе СМИ.[/CENTER]<br>" +
		"[Color=lightblue][CENTER] Приятной игры на UFA.[/CENTER][/color]<br><br>" +
		'[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
	},
    {
      title: 'ФСИН',
	  content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		"[CENTER] Оставьте жалобу на сотрудника ФСИН в разделе ФСИН.[/CENTER]<br>" +
		"[Color=lightblue][CENTER] Приятной игры на UFA.[/CENTER][/color]<br><br>" +
		'[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
	},
    {
    title: 'А-ОПГ',
	  content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		"[CENTER] Оставьте жалобу на сотрудника Арзамасской ОПГ в разделе Арзамасская ОПГ.[/CENTER]<br>" +
		"[Color=lightblue][CENTER] Приятной игры на UFA.[/CENTER][/color]<br><br>" +
		'[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Б-ОПГ',
	  content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		"[CENTER] Оставьте жалобу на сотрудника Батыревской ОПГ в разделе Батыревская ОПГ.[/CENTER]<br>" +
		"[Color=lightblue][CENTER] Приятной игры на UFA.[/CENTER][/color]<br><br>" +
		'[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
	 },
	 {
	  title: 'Л-ОПГ',
	  content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		"[CENTER] Оставьте жалобу на сотрудника Лыткаринской ОПГ в разделе Лыткаринская ОПГ.[/CENTER]<br>" +
		"[Color=lightblue][CENTER] Приятной игры на UFA.[/CENTER][/color]<br><br>" +
		'[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
	{
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Правила ГОСС╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Госс дальнобой, подработка',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пунтку правил:<br>[quote][color=Red]1.07. [/color]Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, принадлежащей своей фракции[Color=Red] | Jail 30 минут.[/Color][/quote]<br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
		'[Color=springGreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Исп. фракю т/с в личных целях',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пунтку правил:<br>[quote][color=Red]1.08. [/color] Запрещено использование фракционного транспорта в личных целях[Color=Red] | Jail 30 минут.[/Color][/quote]<br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
		'[Color=springGreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: 'Одиночный патруль',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пунтку правил:<br>[quote][color=Red]1.11. [/color]Всем силовым структурам запрещен одиночный патруль или конвоирование, минимум 2 сотрудника[Color=Red] | Jail 30 минут.[/Color][/quote]<br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
		'[Color=springGreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: 'Госс казино, работа в форме',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пунтку правил:<br>[quote][color=Red]1.13. [/color] Запрещено находиться в форме внутри казино, участвовать в битве за контейнеры, участвовать в захвате семейного контейнера, находится на Б/У рынке с целью покупки / продажи авто, а также устраиваться на сторонние работы в форме фракции[Color=Red] | Jail 30 минут.[/Color][/quote]<br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
		'[Color=springGreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: 'Арресты в казино, аукц',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пунтку правил:<br>[quote][color=Red]2.50. [/color] Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий[Color=Red] | Ban 7 - 15 дней + увольнение из организации.[/Color][/quote]<br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
		'[Color=springGreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
	{ 
       title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Правила МО╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {  
    title: 'ДМ рядом с тт',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пунтку правил:<br>[quote][color=Red]2.02. [/color] Наносить урон игрокам, которые находятся вне территории воинской части, запрещено[Color=Red] | Jail 30 минут / Warn.[/Color][/quote]<br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
		'[Color=springGreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Правила СМИ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    { 
    title: 'Н/П/Р/О (Объявы)',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пунтку правил:<br>[quote][color=Red]4.01. [/color] Запрещено редактирование объявлений, не соответствующих ПРО[Color=Red] | Mute 30 минут.[/Color][/quote]<br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
		'[Color=springGreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Н/П/П/Э (Эфиры)',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пунтку правил:<br>[quote][color=Red]4.02. [/color] Запрещено проведение эфиров, не соответствующих Role Play правилам и логике[Color=Red] | Mute 30 минут.[/Color][/quote]<br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
		'[Color=springGreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Ред. в личных целях',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>[quote][color=Red]4.04. [/color] Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком[Color=Red] | Ban 7 дней + ЧС организации.[/Color][/quote]<br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
		'[Color=springGreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Правила УМВД╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {  
    title: 'ДМ на тт',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пунтку правил:<br>[quote][color=Red]6.01. [/color] Запрещено наносить урон игрокам без Role Play причины на территории УМВД[Color=Red] | Jail 30 минут / Warn.[/Color][/quote]<br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
		'[Color=springGreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Розыск без причины',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пунтку правил:<br>[quote][color=Red]6.02. [/color] Запрещено выдавать розыск без Role Play причины[Color=Red] | Warn.[/Color][/quote]<br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
		'[Color=springGreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нонрп поведение',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пунтку правил:<br>[quote][Color=Red]6.04. [/Color] Запрещено nRP поведение[Color=Red] | Warn.[/Color][/quote]<br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
		'[Color=springGreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Правила ГИБДД╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {  
    title: 'ДМ на тт',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пунтку правил:<br>[quote][color=Red]7.01. [/color] Запрещено наносить урон игрокам без Role Play причины на территории ГИБДД[Color=Red] | Jail 30 минут / Warn.[/Color][/quote]<br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
		'[Color=springGreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Штраф, розыск без причины',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пунтку правил:<br>[quote][color=Red]7.02. [/color] Запрещено выдавать розыск, штраф без Role Play причины[Color=Red] | Warn.[/Color][/quote]<br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
		'[Color=springGreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Забирание прав во время погони',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пунтку правил:<br>[quote][color=Red]7.05. [/color] Запрещено отбирать водительские права во время погони за нарушителем[Color=Red] | Warn.[/Color][/quote]<br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
		'[Color=springGreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Правила ФСБ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },  
    { 
      title: 'ДМ на тт',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пунтку правил:<br>[quote][color=Red]8.01. [/color] Запрещено наносить урон игрокам без Role Play причины на территории ФСБ[Color=Red] | Jail 30 минут / Warn.[/Color][/quote]<br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
		'[Color=springGreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Розыск без причины',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пунтку правил:<br>[quote][color=Red]8.02. [/color] Запрещено выдавать розыск без Role Play причины[Color=Red] | Warn.[/Color][/quote]<br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
		'[Color=springGreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Правила ФСИН╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },  
    { 
      title: 'ДМ на тт',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пунтку правил:<br>[quote][color=Red]9.01. [/color] Запрещено наносить урон игрокам без Role Play причины на территории ФСИН[Color=Red] | Jail 30 минут / Warn.[/Color][/quote]<br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
		'[Color=springGreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Правила ОПГ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Нарушение правил В/Ч',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пунтку правил:<br>[quote]За нарушение правил нападения на Войсковую Часть выдаётся предупреждение[Color=Red] | Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ).[/Color][/quote]<br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
		'[Color=springGreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нападение на В/Ч через стену',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пунтку правил:<br>[quote]Нападение на военную часть разрешено только через блокпост КПП с последовательностью взлома[Color=Red] | /Warn.[/Color][/quote]<br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
		'[Color=springGreen]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Основное╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
	  title: 'Нарушений не найдено',
	  content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		"[CENTER]Нарушений со стороны данного игрока не было найдено.<br><br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
		'[Color=Red]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
	},
    {
    title: 'Предоставьте док-ва',
	  content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		"[CENTER]Предоставьте доказательства, на основе которых Вы сделали вывод о данном нарушении.<br><br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
		'[Color=Red]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Недостаточно доказательств',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Недостаточно доказательств на нарушение от данного игрока.<br>Доказательства должны быть предоставлены в хорошем качестве и с полным процессом сделки или нарушения от какого-либо игрока.<br><br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
		'[Color=Red]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Дублирование темы',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ответ был дан в прошлой теме.<br>Если вы дальше будете заниматься дублированием тем,то ваш форумный аккаунт будет заблокирован на 3 дня и более.<br><br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
		'[Color=Red]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'В жалобы на адм',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Вы ошиблись разделом.<br>Обратитесь в раздел «Жалобы на администрацию».<br><br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
		'[Color=Red]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'В жалобы на лидеров',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Вы ошиблись разделом.<br>Обратитесь в раздел «Жалобы на лидеров».<br><br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
		'[Color=Red]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'В обжалования',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Вы ошиблись разделом.<br>Обратитесь в раздел «Обжалования наказаний».<br><br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
		'[Color=Red]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Жалоба не по форме',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба составлена не по форме.<br>[quote] 1. Ваш Nick_Name:<br>2. Nick_Name игрока:<br>3. Суть жалобы:<br>4. Доказательство:[/quote]<br Убедительная просьба ознакомиться с правилами подачи жалоб, закреплённые в этом разделе.<br><br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
		'[Color=Red]Отказано, закрыто.[/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
    title: 'Нет /time',
	  content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		"[CENTER]На ваших доказательствах отсутствует /time.<br><br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
		'[Color=Red]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Укажите таймкоды',
	  content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		"[CENTER]Укажите таймкоды.<br><br>" +
	    "[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +	
		'[Color=red]Закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Жалоба на рассмотрении',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба взята на рассмотрение.<br>Просьба ожидать ответа и не создавать дубликаты данной темы.<br><br>" +
		'[Color=Flame]Ожидайте ответ.[/I][/CENTER][/color][/FONT]',
      prefix: PINN_PREFIX,
	  status: false,
    },
    {
      title: 'Заголовок не по форме',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][FONT=times new roman][I]Заголовок вашей жалобы составлен не по форме:<br>[quote]Nick_Name | Нарушение[/quote]<br>Убедительная просьба ознакомиться с правилами подачи жалоб, закреплённые в этом разделе.<br><br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
		'[Color=Red]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Более 72 часов',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]С момента нарушения прошло более 72 часов.<br><br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
		'[Color=Red]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Доква через запрет соц сети',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Загрузите доказательства на фото/видео хостинги (YouTube, Япикс, imgur).<br><br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
		'[Color=Red]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нет условий сделки',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]В данных доказательствах отсутствуют условия сделки.<br><br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
		'[Color=Red]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нужен фрапс',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]В таких случаях нужна видеозапись.<br><br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
		'[Color=Red]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нужен фрапс + промотка чата',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]В таких случаях нужна видеозапись и полная промотка чата.<br><br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
		'[Color=Red]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нужна промотка чата',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]В таких случаях нужна полная промотка чата.<br><br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
		'[Color=Red]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Неполный фрапс',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Видео запись обрывается. Загрузите полную видеозапись на YouTube или другой хостинг.<br><br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
		'[Color=Red]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Не работают доква',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Доказательства не работают или нет доступа для их просмотра.<br><br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
		'[Color=Red]Закрыто[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Доква отредактированы',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваши докозательства отредоктированы.<br><br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
		'[Color=Red]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'от 3-го лица',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Жалобы от 3-их лиц не принимаются.<br><br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
		'[Color=Red]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Ответный ДМ',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]На ваших доказательствах был замечен ответный DM.<br><br>" +
		"[Color=lightblue] Приятной игры на UFA.[/color]<br><br>" +
		'[Color=Red]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Ошиблись сервером',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color]<br>' +
        "[CENTER]Вы ошиблись сервером, переношу вашу жалобу в нужный раздел.[/CENTER]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴РП биографии╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
      {
      title: 'био одобрена',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша RolePlay биография получает статус: [Color=springGreen]Одобрено.[/I][/CENTER][/color][/FONT]",
      prefix: ODOBRENOBIO_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴РП биографии дополнения╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'дополните детство',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Вам даётся 24 часа на дополнение пункта Детство.[/CENTER]",
      prefix: NARASSMOTRENIIBIO_PREFIX,
    },
    {
      title: 'дополните пункт юность',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Вам даётся 24 часа на дополнение пункта Юность.[/CENTER]",
      prefix: NARASSMOTRENIIBIO_PREFIX,
    },
    {
      title: 'дополните пункт Взросление',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Вам даётся 24 часа на дополнение пункта Взросление.[/CENTER]",
      prefix: NARASSMOTRENIIBIO_PREFIX,
    },
    {
      title: 'дополните пункт юность и взросление',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Вам даётся 24 часа на дополнение пункта Юность и Взросление.[/CENTER]",
      prefix: NARASSMOTRENIIBIO_PREFIX,
    },
    {
      title: 'доплните пункт зрелость',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Вам даётся 24 часа на дополнение пункта Зрелость.[/CENTER]",
      prefix: NARASSMOTRENIIBIO_PREFIX,
    },
    {
      title: 'доплните пункт наши дни',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Вам даётся 24 часа на дополнение пункта Наши дни.[/CENTER]",
      prefix: NARASSMOTRENIIBIO_PREFIX,
    },
    {
      title: 'дополнить от детства до наших дней',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Вам даётся 24 часа на дополнение пунктов: Детство, Юность, Взросление, Зрелость, Наши дни.[/CENTER]",
      prefix: NARASSMOTRENIIBIO_PREFIX,
    },
    {
      title: 'био на дороботке некорректный возраст',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Вам даётся 24 часа на исправление пункта Возраст.[/CENTER]",
      prefix: NARASSMOTRENIIBIO_PREFIX,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴РП биографии отказ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Не по форме',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография составлена не по форме.<br>Убедительная просьба ознакомиться с правилами подачи РП биографии, закреплённые в этом разделе.<br><br>[color=Red]Отказано.[/color][/CENTER]<br>",
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
      title: 'невыполнение условий',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Условия выше не были Вами выполнены.<br><br>[color=Red]Отказано.[/color][/I][/FONT][/CENTER]" ,
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
      title: 'заголовок не по форме',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Заголовок создаваемой РП биографии должен быть написан строго по данной форме:<br>[quote]RolePlay биография гражданина Имя Фамилия[/quote]<br>" +
        "[CENTER][Color=Red]Отказано.[/CENTER][/Color]",
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
      title: 'нонрп ник',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Запрещено создание Role Play биографии, если у Вас не RolePlay никнейм.<br><br>[Color=Red]Отказано.[/Color][/I][/FONT][/CENTER]" ,
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
      title: 'не от 1-го лица',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Биография должна быть написана от первого лица персонажа.<br><br>[color=Red]Отказано.[/color][/I][/FONT][/CENTER]" ,
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
      title: 'более 1 био на 1 аккаунт',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Запрещено создавать более чем одной РП биографии для одного игрового аккаунта.<br><br>[Color=Red]Отказано.[/Color][/I][/FONT][/CENTER]",
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
      title: 'био известных лиц',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Запрещено использовать биографии известных личностей, лидеров, администраторов сервера, разработчиков, руководителей.<br><br>[Color=Red]Отказано.[/Color][/I][/FONT][/CENTER]" ,
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
      title: 'копирование',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Запрещено полное или частичное копирование биографий из данного раздела или из разделов RP биографий других серверов.<br><br>[Color=Red]Отказано.[/Color][/I][/FONT][/CENTER]",
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
      title: 'приписывание супер способностей',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Запрещено приписывание своему персонажу супер-способностей.<br><br>[color=Red]Отказано.[/color][/I][/FONT][/CENTER]" ,
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
      title: 'много ошибок',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография содержит многочисленные грамматические ошибки.<br><br>[color=Red]Отказано.[/color][/I][/FONT][/CENTER]" ,
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴РП ситуации╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'РП ситуация одобрено',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП ситуация получает статус: [Color=springGreen]Одобрено.[/I][/CENTER][/color][/FONT]",
      prefix: ODOBRENORP_PREFIX,
	  status: false,
    },
    {
      title: 'РП ситуация на дороботке',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Вам даётся 24 часа на дополнение вашей РП ситуации.[/CENTER]",
      prefix: NARASSMOTRENIIRP_PREFIX,
	  status: false,
    },
    {
      title: 'РП ситуация отказ',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП ситуация получает статус: [Color=Red]Отказано.[/color]<br>Причиной отказа могло послужить какое-либо нарушение из [URL='https://forum.blackrussia.online/index.php?threads/ufa-Правила-написания-roleplay-ситуации.1967870/']Правил написания RP ситуации[/URL][/CENTER][/FONT]",
      prefix: OTKAZRP_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Неофициал. орг.╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Неофициальная Орг Одобрено',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша Неофициальная РП организация получает статус: [Color=springGreen]Одобрено.[/I][/CENTER][/color][/FONT]",
      prefix: ODOBRENOORG_PREFIX,
	  status: false,
    },
    {
      title: 'Неофициальная Орг на дороботке',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Вам даётся 24 часа на дополнение вашей Неофициальной организации.[/CENTER]",
      prefix: NARASSMOTRENIIORG_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Неофициал. орг. отказ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Неофициальная Орг отказ',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша Неофициальная РП организация получает статус: [Color=Red]Отказано.[/color]<br>Причиной отказа могло послужить какое-либо нарушение из [URL='https://forum.blackrussia.online/index.php?threads/ufa-Правила-подачи-заявления-на-Неофициальную-rp-организацию.1968426/']Правила создания Неофициальной RolePlay организации.[/URL].[/CENTER][/FONT]",
      prefix: OTKAZORG_PREFIX,
	  status: false,
    },
    {
      title: 'нет стартового состава',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша Неофициальная РП организация получает статус: [Color=Red]Отказано.[/color]<br>Причиной отказа послужило - Для создания своей организации, её лидер должен иметь стартовый состав от 3+ человек, которые уже зарегистрированы на проекте.[/CENTER][/FONT]",
      prefix: OTKAZORG_PREFIX,
	  status: false,
    },
    {
      title: 'нет истории орг',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша Неофициальная РП организация получает статус: [Color=Red]Отказано.[/color]<br>Причиной отказа послужило - В теме должна быть описана история появления организации, её дальнейшие занятия.[/CENTER][/FONT]",
      prefix: OTKAZORG_PREFIX,
	  status: false,
    },
    {
      title: 'плохое оформление',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша Неофициальная РП организация получает статус: [Color=Red]Отказано.[/color]<br>Причиной отказа послужило - Оформление темы должно быть опрятным, текст читабельным.[/CENTER][/FONT]",
      prefix: OTKAZORG_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Неофициал. орг. активность╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
      {
      title: 'Неофициальная Орг запроси активности',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
          "[CENTER][B][I][FONT=georgia]Ваша неофициальная РП организация может быть закрыта по пункту правил: Неактив в топике организации более недели, он закрывается. Прекрипите отчёт о активности организации в виде скриншотов. Через 24 часа если отчёта не будет или он будет некорректный организация будет закрыта.[/CENTER]",  // Roman_Marvanov написал скрипт, остальные тупо скопировали
              prefix: PINN_PREFIX,
	  status: false,
    },
    {
      title: 'Неофициальная Орг закрытие активности',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Активность небыла предоставлена. Организация закрыта.[/CENTER]",
              prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
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
        4 < hours && hours <= 12 ?
        'Доброе утро' :
        12 < hours && hours <= 18 ?
        'Добрый день' :
        18 < hours && hours <= 23 ?
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
	} 
	if(pin == true){
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
  })();
