// ==UserScript==
// @name         Скрипт by dLuciKb
// @namespace    https://forum.blackrussia.online
// @version      1.0
// @description  Скрипт для Кураторов Форума by Люцифер
// @author       Dmitriy Lucifer
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license    MIT
// @icon https://forum.blackrussia.online/data/avatars/o/11/11193.jpg
// @downloadURL https://update.greasyfork.org/scripts/474671/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20by%20dLuciKb.user.js
// @updateURL https://update.greasyfork.org/scripts/474671/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20by%20dLuciKb.meta.js
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
      title: 'NonRP поведение',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#FFFFFF][CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:[/Color]<br><ins><b>[Color=#FF0000]2.01.[/Color] Запрещено поведение, нарушающее нормы процессов Role Play режима игры [Color=#FF0000]| Jail 30 минут [/CENTER]<br><b><ins>" +
                '[Color=#FF0000][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
		'<br>[Color=#00FF00][FONT=times new roman][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Уход от RP',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#FFFFFF][CENTER][FONT=times new roman][I]Игрок будет наказан по данному пункту правил:[/Color]<br><ins><b>[Color=#FF0000]2.02.[/Color] Запрещено целенаправленно уходить от Role Play процесса всеразличными способами [Color=#FF0000]| Jail 30 минут / Warn[/CENTER]<br><b><ins>" +
                '[Color=#FF0000][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
		'<br>[Color=#00FF00][FONT=times new roman][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'NonRP вождение',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/Color]' +
        "[Color=#FFFFFF][CENTER]Игрок будет наказан по данному пункту правил:[/Color]<br>[Color=#FF0000]2.03.[/Color] Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере [Color=#FF0000]| Jail 30 минут / 60 минут (Для дальнобойщиков/инкассаторов)[/CENTER]<br>" +
		'[Color=#FF0000][CENTER]Спасибо за Ваше обращение![/CENTER][/color]<br>' +
		'<br>[Color=#00FF00][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
        {
      title: 'NonRP Обман',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#FFFFFF][CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:[/Color]<br>[Color=#FF0000]2.05.[/Color] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [Color=#FF0000]| PermBan[/CENTER]<br>" +
		'[Color=#FF0000][CENTER]Спасибо за Ваше обращение![/color][/CENTER][/FONT]' +
		'<br>[Color=#00FF00][FONT=times new roman][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Аморал. действия',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#FFFFFF][CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:[/Color]<br>[Color=#FF0000]2.08.[/Color] Запрещена любая форма аморальных действий сексуального характера в сторону игроков [Color=#FF0000]| Jail 30 минут / Warn[/CENTER]<br>" +
		'[Color=#FF0000][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
		'<br>[Color=#00FF00][FONT=times new roman][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Слив склада',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:[/Color]<br>[Color=#FF0000]2.09.[/Color] Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле |[Color=#FF0000] Ban 15 - 30 дней / PermBan[/CENTER]<br>" +
		'[Color=#FFFF00][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
		'<br>[Color=#00FF00][FONT=times new roman][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'DB',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:[/Color]<br>[Color=#FF0000]2.13.[/Color] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [Color=#FF0000]| Jail 60 минут.[/CENTER]<br>" +
		'[Color=#FFFF00][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
		'<br>[Color=#00FF00][FONT=times new roman][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'RK',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:[/Color]<br>[Color=#FF0000]2.14.[/Color] Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти [Color=#FF0000]| Jail 30 минут[/CENTER]<br>" +
		'[Color=#FFFF00][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
		'<br>[Color=#00FF00][FONT=times new roman][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ТК',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:[/Color]<br>[Color=#FF0000]2.15.[/Color] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины [Color=#FF0000]| Jail 60 минут / Warn (за два и более убийства)[/CENTER]<br>" +
		'[Color=#FFFF00][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
		'<br>[Color=#00FF00][FONT=times new roman][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'SK',
      content:
	    '[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:[/Color]<br>[Color=#FF0000]2.16.[/Color] Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них [Color=#FF0000]| Jail 60 минут / Warn (за два и более убийства).[/CENTER]<br>" +
		'[Color=#FFFF00][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
		'<br>[Color=#00FF00][FONT=times new roman][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'PG',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:[/Color]<br>[Color=#FF0000]2.17.[/Color] Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь [Color=#FF0000]| Jail 30 минут[/CENTER]<br>" +
		'[Color=#FFFF00][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
		'<br>[Color=#00FF00][FONT=times new roman][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'MG',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:[/Color]<br>[Color=#FF0000]2.18.[/Color] Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [Color=#FF0000]| Mute 30 минут.[/CENTER]<br>" +
		'[Color=#FFFF00][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
		'<br>[Color=#00FF00][FONT=times new roman][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
        {
      title: 'DM',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:[/Color]<br>[Color=#FF0000]2.19.[/Color] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [Color=#FF0000]| Jail 60 минут.[/CENTER]<br>" +
		'[Color=#FFFF00][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
		'<br>[Color=#00FF00][FONT=times new roman][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Mass DM',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:[/Color]<br>[Color=#FF0000]2.20.[/Color] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины более трем игрокам [Color=#FF0000]| Warn / Ban 3 - 7 дней.[/CENTER]<br>" +
		'[Color=#FFFF00][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
		'<br>[Color=#00FF00][FONT=times new roman][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
        {
      title: 'Стороннее ПО',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>[CENTER][/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman][I]Игрок будет наказан по пункту правил:[/Color]<br>[/I][/FONT][I][FONT=times new roman][Color=#FF0000]2.22.[/Color] Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#FF0000]| Ban 15 - 30 дней / PermBan [/CENTER]<br>" +
		'[Color=#FFFF00][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
		'<br>[Color=#00FF00][FONT=times new roman][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Реклама сторон. ресурсов',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>[CENTER][/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:[/Color]<br>[Color=#FF0000]2.31.[/Color] Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное [Color=#FF0000]| Ban 7 дней / PermBan[/CENTER]<br>" +
		'[Color=#FFFF00][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
		'<br>[Color=#00FF00][FONT=times new roman][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Оск. адм',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>[CENTER][/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:[/Color]<br>[Color=#FF0000]2.32.[/Color] Запрещено введение в заблуждение, обман, оскорбление, неконструктивная критика администрации на всех ресурсах проекта [Color=#FF0000]| Ban 7 - 15 дней / PermBan[/CENTER]<br>" +
		'[Color=#FFFF00][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
		'<br>[Color=#00FF00][FONT=times new roman][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Угрозы IC и OOC',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>[CENTER][/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:[/Color]<br>[Color=#FF0000]2.35.[/Color] На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате [Color=#FF0000]| Mute 120 минут / Ban 7 дней[/CENTER]<br>" +
		'[Color=#FFFF00][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
		'<br>[Color=#00FF00][FONT=times new roman][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Уход от наказания',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>[CENTER][/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:[/Color]<br>[Color=#FF0000]2.34.[/Color] Запрещен уход от наказания [Color=#FF0000]| Ban 15 - 30 дней (суммируется к общему наказанию дополнительно)[/CENTER]<br>" +
		'[Color=#FFFF00][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
		'<br>[Color=#00FF00][FONT=times new roman][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Угрозы ООС',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>[CENTER][/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][B][I][FONT=times new roman]Игрок будет наказан по пункту правил:[/Color]<br>[Color=#FF0000]2.37.[/Color] Запрещены OOC угрозы, в том числе и завуалированные [Color=#FF0000]| Mute 120 минут / Ban 7 дней[/CENTER]<br>" +
       '[Color=#FFFF00][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
		'<br>[Color=#00FF00][FONT=times new roman][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Злоуп. наказаниями',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>[CENTER][/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][B][I][FONT=times new roman]Игрок будет наказан по пункту правил:[/Color]<br>[Color=#FF0000]2.39.[/Color] Злоупотребление нарушениями правил сервера [Color=#FF0000]| Ban 7 - 30 дней[/CENTER]" +
        '[Color=#FFFF00][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
		'<br>[Color=#00FF00][FONT=times new roman][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Оск. проекта',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>[CENTER][/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:[/Color]<br>[Color=#FF0000]2.40.[/Color] Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [Color=#FF0000]| Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором)[/CENTER]<br>" +
		'[Color=#FFFF00][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
		'<br>[Color=#00FF00][FONT=times new roman][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Продажа промо',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>[CENTER][/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:[/Color]<br>[Color=#FF0000]2.43.[/Color] Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций [Color=#FF0000]| Mute 120 минут[/CENTER]<br>" +
		'[Color=#FFFF00][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
		'<br>[Color=#00FF00][FONT=times new roman][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Помеха RP процессу',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>[CENTER][/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:[/Color]<br>[Color=#FF0000]2.51.[/Color] Запрещено вмешательство в Role Play процесс с целью помехи и препятствования дальнейшего развития Role Play процесса [Color=#FF0000]| Jail 30 минут[/CENTER]<br>" +
		'[Color=#FFFF00][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
		'<br>[Color=#00FF00][FONT=times new roman][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'NonRP акс',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>[CENTER][/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:[/Color]<br>[Color=#FF0000]2.52.[/Color] Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. [Color=#FF0000]| При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут[/CENTER]<br>" +
		'[Color=#FFFF00][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
		'<br>[Color=#00FF00][FONT=times new roman][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Неув. к адм.',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>[CENTER][/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:[/Color]<br>[Color=#FF0000]2.54.[/Color] Запрещено неуважительное обращение, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [Color=#FF0000]| Mute 180 минут[/CENTER]<br>" +
		'[Color=#FFFF00][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
		'<br>[Color=#00FF00][FONT=times new roman][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Баг. аним',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>[CENTER][/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:[/Color]<br>[Color=#FF0000]2.55.[/Color] Запрещается багоюз связанный с анимацией в любых проявлениях. [Color=#FF0000]| Jail 60 / 120 минут[/CENTER]<br>" +
		'[Color=#FFFF00][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
		'<br>[Color=#00FF00][FONT=times new roman][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Долг',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>[CENTER][/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:[/Color]<br>[Color=#FF0000]2.57.[/Color] Запрещается брать в долг игровые ценности и не возвращать их. [Color=#FF0000]| Ban 30 дней / permban[/CENTER]<br>" +
		'[Color=#FFFF00][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
		'<br>[Color=#00FF00][FONT=times new roman][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴•Игровые чаты•╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Транслит',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:[/Color]<br>[Color=#FF0000]3.01.[/Color] Общепризнанный язык сервера — русский. Общение в IC чатах во всех Role Play ситуациях обязательно должно проходить исключительно на русском языке [Color=#FF0000]| Устное замечание / Mute 30 минут[/CENTER]<br>" +
		'[Color=#FFFF00][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
		'<br>[Color=#00FF00][FONT=times new roman][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'CapsLock',
	  content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
		"[Color=#F0E68C][CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:[/Color]<br>[Color=#FF0000]3.02.[/Color] Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате [Color=#FF0000]| Mute 30 минут.[/CENTER]<br>" +
		'[Color=#FFFF00][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
		'<br>[Color=#00FF00][FONT=times new roman][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Оск в ООС',
      content:
	    '[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:[/Color]<br>[Color=#FF0000]3.03.[/Color] Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены [Color=#FF0000]| Mute 30 минут[/CENTER]<br>" +
		'[Color=#FFFF00][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
		'<br>[Color=#00FF00][FONT=times new roman][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Упом/оск род',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:[/Color]<br>[Color=#FF0000]3.04.[/Color] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [Color=#FF0000]| Mute 120 минут / Ban 7 - 15 дней.[/CENTER]<br>" +
		'[Color=#FFFF00][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
		'<br>[Color=#00FF00][FONT=times new roman][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Мат в VIP чат',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:[/Color]<br>[Color=#FF0000]3.23.[/Color] Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате  [Color=#FF0000]| Mute 30 минут[/CENTER]<br>" +
		'[Color=#FFFF00][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
		'<br>[Color=#00FF00][FONT=times new roman][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Flood',
	  content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
		"[Color=#F0E68C][CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:[/Color]<br>[Color=#FF0000]3.05.[/Color] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [Color=#FF0000]| Mute 30 минут.[/CENTER]<br>" +
		'[Color=#FFFF00][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
		'<br>[Color=#00FF00][FONT=times new roman][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Злоуп. символами',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:[/Color]<br>[Color=#FF0000]3.06.[/Color] Запрещено злоупотребление знаков препинания и прочих символов [Color=#FF0000]| Mute 30 минут[/CENTER]<br>" +
		'[Color=#FFFF00][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
		'<br>[Color=#00FF00][FONT=times new roman][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Оскорбление',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:[/Color]<br>[Color=#FF0000]3.07.[/Color] Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата [Color=#FF0000]| Mute 30 минут[/CENTER]<br>" +
		'[Color=#FFFF00][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
		'<br>[Color=#00FF00][FONT=times new roman][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Слив СМИ',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:[/Color]<br>[Color=#FF0000]3.08.[/Color] Запрещены любые формы «слива» посредством использования глобальных чатов [Color=#FF0000]| PermBan[/CENTER]<br>" +
		'[Color=#FFFF00][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
		'<br>[Color=#00FF00][FONT=times new roman][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Угрозы о наказании со стороны адм ',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:[/Color]<br>[Color=#FF0000]3.09.[/Color] Запрещены любые угрозы о наказании игрока со стороны администрации [Color=#FF0000]| Mute 30 минут[/CENTER]<br>" +
		'[Color=#FFFF00][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
		'<br>[Color=#00FF00][FONT=times new roman][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Выдача себя за адм ',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:[/Color]<br>[Color=#FF0000]3.10.[/Color] Запрещена выдача себя за администратора, если таковым не являетесь [Color=#FF0000]| Ban 7 - 15 + ЧС администрации[/CENTER]<br>" +
		'[Color=#FFFF00][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
		'<br>[Color=#00FF00][FONT=times new roman][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Ввод в забл.',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:[/Color]<br>[Color=#FF0000]3.11.[/Color] Запрещено введение игроков проекта в заблуждение путем злоупотребления командами [Color=#FF0000]| Ban 15 - 30 дней / PermBan[/CENTER]<br>" +
		'[Color=#FFFF00][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
		'<br>[Color=#00FF00][FONT=times new roman][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Музыка в войс',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:[/Color]<br>[Color=#FF0000]3.14.[/Color] Запрещено включать музыку в Voice Chat [Color=#FF0000]| Mute 60 минут[/CENTER]<br>" +
		'[Color=#FFFF00][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
		'<br>[Color=#00FF00][FONT=times new roman][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Упом/Оск род в войс',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:[/Color]<br>[Color=#FF0000]3.15.[/Color] Запрещено оскорблять игроков или родных в Voice Chat [Color=#FF0000]| Mute 120 минут / Ban 7 - 15 дней[/CENTER]<br>" +
		'[Color=#FFFF00][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
		'<br>[Color=#00FF00][FONT=times new roman][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Шум в войс',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:[/Color]<br>[Color=#FF0000]3.16.[/Color] Запрещено создавать посторонние шумы или звуки [Color=#FF0000]| Mute 30 минут[/CENTER]<br>" +
		'[Color=#FFFF00][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
		'<br>[Color=#00FF00][FONT=times new roman][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Рекл. промо',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:[/Color]<br>[Color=#FF0000]3.21.[/Color] Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. [Color=#FF0000]| Ban 30 дней.[/CENTER]<br>" +
		'[Color=#FFFF00][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
		'<br>[Color=#00FF00][FONT=times new roman][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Торговля на ТТ госс',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:[/Color]<br>[Color=#FF0000]3.22.[/Color] Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) [Color=#FF0000]| Mute 30 минут[/CENTER]<br>" +
		'[Color=#FFFF00][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
		'<br>[Color=#00FF00][FONT=times new roman][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Религиозное и политическая пропаганда',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:[/Color]<br>[Color=#FF0000]3.18.[/Color] Запрещено политическое и религиозное пропагандирование [Color=#FF0000]| Mute 120 минут / Ban 10 дней[/CENTER]<br>" +
		'[Color=#FFFF00][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
		'<br>[Color=#00FF00][FONT=times new roman][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
        title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴•Раздел хелперов•╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
     },
    {
        title: 'Беседа с АП',
        content:
        '[Color=#FF0000][FONT=times new roman][CENTER][I]Здравствуйте, уважаемый игрок![/CENTER][/Color][/FONT]<br>' +
        "[Color=#F0E68C][FONT=times new roman][CENTER]С Агентом Поддержки будет проведена беседа.[/CENTER][/FONT]<br>" +
        '<br>[Color=#FFFF00][FONT=times new roman][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/I][/FONT]'
     },
    {
        title: 'Недостаточно док-в АП',
        content:
        '[Color=#FF0000][FONT=times new roman][CENTER][I]Здравствуйте, уважаемый игрок![CENTER][/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Нет прикрепленных доказательств или недостаточно на нарушение Агента Поддержки.[/I][/CENTER][/FONT]"
            },
    {
        title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴•Положение об игровых аккаунтах•╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Фейк аккаунт',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:[/Color]<br>[Color=#FF0000]4.10.[/Color] Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию [Color=#FF0000]| Устное замечание + смена игрового никнейма / PermBan[/CENTER]<br>" +
		'[Color=#FFFF00][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
		'<br>[Color=#00FF00][FONT=times new roman][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
 
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴•Передачи жалобы•╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Передано ГКФ/ЗГКФ',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#FFA500][CENTER][FONT=times new roman]Ваша жалоба была передана на рассмотрение Главному Куратору и его заместителю. [/Color] [/CENTER]" +
		'[Color=#FFFFFF][CENTER][FONT=times new roman]Просьба не создавать подобных тем.[/Color]<br>[Color=Flame][CENTER][Color=#FFFF00][I]Ожидайте ответа...[/I][/CENTER][/color][/FONT]',
      prefix: WATCHED_PREFIX,
	  status: true,
    },
    {
      title: 'Тех. специалисту',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#00BFFF][CENTER][FONT=times new roman]Ваша жалоба была передана на рассмотрение техническому специалисту.[/Color][/CENTER]" +
		'[Color=#FFFFFF][CENTER][FONT=times new roman]Просьба не создавать подобных тем.[/Color]<br>[Color=Flame][CENTER][Color=#FFFF00][I]Ожидайте ответа...[/I][/CENTER][/color][/FONT]',
      prefix: TEXY_PREFIX,
	  status: true,
    },
    {
      title: 'Передано ГА',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#FF0000][CENTER][FONT=times new roman]Ваша жалоба была передана на рассмотрение Главному Администратору.[/Color][/CENTER]" +
		'[Color=#FFFFFF][CENTER][FONT=times new roman]Просьба не создавать подобных тем.[/Color]<br>[Color=Flame][CENTER][Color=#FFFF00][I]Ожидайте ответа...[/I][/CENTER][/color][/FONT]',
      prefix: GA_PREFIX,
	  status: true,
    },
    {
      title: 'Передано Спец. администратору',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#FFFF00][CENTER][FONT=times new roman]Ваша жалоба была передана на рассмотрение Специальному администратору.[/Color][/CENTER]" +
		'[Color=#FFFFFF][CENTER][FONT=times new roman]Просьба не создавать подобных тем.[/Color]<br>[Color=Flame][CENTER][Color=#FFFF00][I]Ожидайте ответа...[/I][/CENTER][/color][/FONT]',
      prefix: SPECY_PREFIX,
	  status: true,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴•Правила Госс. Структур•╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Прогул Р/Д',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Игрок будет наказан по пункту правил:[/Color]<br>[Color=#FF0000]1.07.[/Color] Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, принадлежащей своей фракции [Color=#FF0000]| Jail 30 минут[/CENTER]<br>" +
		'[Color=#FFFF00][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
		'<br>[Color=#00FF00][FONT=times new roman][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Исп. фрак т/с в личных целях',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Игрок будет наказан по пункту правил:[/Color]<br>[Color=#FF0000]1.08.[/Color] Запрещено использование фракционного транспорта в личных целях [Color=#FF0000]| Jail 30 минут[/CENTER]<br>" +
		'[Color=#FFFF00][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
		'<br>[Color=#00FF00][FONT=times new roman][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Н/П/Р/О (Объявы)',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Игрок будет наказан по пункту правил:[/Color]<br>[Color=#FF0000]4.01.[/Color] Запрещено редактирование объявлений, не соответствующих ПРО [Color=#FF0000]| Mute 30 минут[/CENTER]<br>" +
		'[Color=#FFFF00][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
		'<br>[Color=#00FF00][FONT=times new roman][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Н/П/П/Э (Эфиры)',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Игрок будет наказан по пункту правил: [/Color]<br>[Color=#FF0000]4.02.[/Color] Запрещено проведение эфиров, не соответствующих Role Play правилам и логике [Color=#FF0000]| Mute 30 минут[/CENTER]<br>" +
		'[Color=#FFFF00][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
		'<br>[Color=#00FF00][FONT=times new roman][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Редакт. в личных целях(СМИ)',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Игрок будет наказан по пункту правил:[/Color]<br>[Color=#FF0000]4.04.[/Color] Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком  [Color=#FF0000]| Ban 7 дней + ЧС организации [/CENTER]<br>" +
		'[Color=#FFFF00][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
		'<br>[Color=#00FF00][FONT=times new roman][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'NonRP поведение',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Игрок будет наказан по пункту правил:[/Color]<br>[Color=#FF0000]6.04.[/Color] Запрещено nRP поведение [Color=#FF0000]| Warn[/CENTER]<br>" +
		'[Color=#FFFF00][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
		'<br>[Color=#00FF00][FONT=times new roman][CENTER][I]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Розыск без RP причины',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Игрок будет наказан по пункту правил:[/Color]<br>[Color=#FF0000]7.02.[/Color] Запрещено выдавать розыск, штраф без RolePlay причины  [Color=#FF0000]| Warn [/CENTER]<br>" +
		'[Color=#FFFF00][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
		'<br>[Color=#00FF00][FONT=times new roman][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Забирание В/У (ГИБДД)',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Игрок будет наказан по пункту правил:[/Color]<br>[Color=#FF0000]7.05.[/Color] Запрещено отбирать водительские права во время погони за нарушителем или без RolePlay причины [Color=#FF0000]| Warn[/CENTER]<br>" +
		'[Color=#FFFF00][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
		'<br>[Color=#00FF00][FONT=times new roman][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴•Правила ОПГ•╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Нарушение правил В/Ч',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Игрок будет наказан по пункту правил:[/Color]<br> За нарушение правил нападения на Войсковую Часть выдаётся предупреждение [Color=#FF0000]| Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ)[/CENTER]<br>" +
		'[Color=#FFFF00][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
		'<br>[Color=#00FF00][FONT=times new roman][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нападение на В/Ч через стену',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Игрок будет наказан по пункту правил:[/Color]<br> Нападение на военную часть разрешено только через блокпост КПП с последовательностью взлома [Color=#FF0000]| /Warn NonRP В/Ч[/CENTER]<br>" +
		'[Color=#FFFF00][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
		'<br>[Color=#00FF00][FONT=times new roman][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴•Отсутствие пункта жалоб•╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
	  title: 'Нарушений не найдено',
	  content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
		"[Color=#F0E68C][CENTER][FONT=times new roman]Нарушений со стороны данного игрока не было найдено.[/Color][/CENTER]" +
		'[Color=#FF0000][FONT=times new roman][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Ответ уже дан в прошл. ЖБ',
	  content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
		"[Color=#F0E68C][CENTER][FONT=times new roman]Ответ был дан в прошлой жалобе.[/Color][/CENTER]<" +
		'[Color=#FF0000][FONT=times new roman][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Недостаточно док-в',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Недостаточно доказательств на нарушение от данного игрока.<br>Доказательства должны быть предоставлены в хорошем качестве и с полным процессом сделки или нарушения от какого-либо игрока.[/Color][/CENTER]" +
		'[Color=#FF0000][FONT=times new roman][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Дублир. темы',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Дублирование темы.[/Color]<br>[Color=#FFFF00]Если вы дальше будете дублировать темы, то ваш форумный аккаунт будет заблокирован на 3 дня и более.<br>[/Color][/CENTER]"+
		'[Color=#FF0000][FONT=times new roman][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'В жалобы на адм',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Вы ошиблись разделом.<br>Обратитесь в раздел:[/color]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1826/'][Color=#FFFF00]<<Жалобы на администрацию>>.<br>(Кликабельно)<br>[/URL][/Color][/CENTER]" +
		'[Color=#FF0000][FONT=times new roman][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'В обжалования',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Вы ошиблись разделом.<br>Обратитесь в раздел:[/color]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.1829/'][Color=#FFFF00]<<Обжалование наказаний>>.<br>(Кликабельно)<br>[/URL][/Color][/CENTER]" +
		'[Color=#FF0000][FONT=times new roman][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Форма темы',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Ваша жалоба составлена не по форме.<br>Убедительная просьба ознакомиться:[/color]<br>[URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/'][Color=#FFFF00]<<С правилами подачи жалоб на игроков>>.<br>(Кликабельно)<br>[/URL][/color][/CENTER]" +
		'[Color=#FF0000][FONT=times new roman][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
	{
	  title: 'Нет /time',
	  content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
		"[Color=#F0E68C][CENTER][FONT=times new roman]На ваших доказательствах отсутствует /time.[/Color][/CENTER]" +
		'[Color=#FF0000][FONT=times new roman][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Укажите тайм-коды',
	  content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
		"[Color=#F0E68C][CENTER][FONT=times new roman]В течение 24-х часов укажите тайм-коды, иначе жалоба будет отказана.[/Color][/CENTER]" +
		'[Color=Flame][CENTER][Color=#FFFF00]На рассмотрении...[/I][/CENTER][/color][/FONT]',
      prefix: PINN_PREFIX,
	  status: true,
	},
    {
      title: 'Жалоба на рассмотрении',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Ваша жалоба взята на рассмотрение.[/Color]<br>Просьба ожидать ответа и не создавать дубликаты данной темы.[/CENTER]<br>" +
		'[Color=Flame][CENTER][Color=#FFFF00]Ожидайте ответа.[/I][/CENTER][/color][/FONT]',
      prefix: PINN_PREFIX,
	  status: false,
    },
    {
	  title: 'Форма заголовка',
	  content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
		"[Color=#F0E68C][CENTER][FONT=times new roman]Заголовок вашей жалобы составлен не по форме.<br>Убедительная просьба ознакомиться:[/color]<br>[URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/'][Color=#FFFF00]<<С правилами подачи жалоб на игроков>>.<br>(Кликабельно)<br>[/URL][/color][/CENTER]" +
		'[Color=#FF0000][FONT=times new roman][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Более 72 часов',
	  content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
		"[Color=#F0E68C][CENTER][FONT=times new roman]С момента получения наказания прошло более 72 часов.[/Color][/CENTER]" +
		'[Color=#FF0000][FONT=times new roman][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
	},
      {
      title: 'Док-ва через запрет соц. сети',
      content:
	    '[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается.<br>Доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/Color][/CENTER]" +
		'[Color=#FF0000][FONT=times new roman][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нет условий сделки',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]В данных доказательствах отсутствуют условия сделки.[/Color][/CENTER]" +
		'[Color=#FF0000][FONT=times new roman][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нужен фрапс',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]В таких случаях нужна видеофиксация.[/Color][/CENTER]" +
		'[Color=#FF0000][FONT=times new roman][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нужен фрапс + промотка чата',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]В таких случаях нужен фрапс + промотка чата.[/Color][/CENTER]" +
		'[Color=#FF0000][FONT=times new roman][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нужна промотка чата',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]В таких случаях нужна промотка чата.[/Color][/CENTER]" +
		'[Color=#FF0000][FONT=times new roman][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Неполный фрапс',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Предоставленное видео обрывается.<br>Загрузите полные видеодоказательства на разрешенные соц. сети.[/Color][/CENTER]" +
		'[Color=#FF0000][FONT=times new roman][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нет док-в',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Нет доказательств.[/Color][/CENTER]" +
		'[Color=#FF0000][FONT=times new roman][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Док-ва отредактированы',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Ваши доказательства отредактированы.[/Color][/CENTER]" +
		'[Color=#FF0000][FONT=times new roman][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'От 3-го лица',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Жалобы от 3-их лиц не рассматриваются.[/Color][/CENTER]" +
		'[Color=#FF0000][FONT=times new roman][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Ответ DM',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]В случае ответного ДМ нужна видеозапись.<br>Пересоздайте тему и прикрепите доказательства.[/Color][/CENTER]" +
		'[Color=#FF0000][FONT=times new roman][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    { title: 'В тех. раздел',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#FFFF00][CENTER][FONT=times new roman]Вы ошиблись разделом.<br>Переподайте жалобу по ссылке ниже: [/Color]<br>[Color=#00BFFF][FONT=times new roman] [CENTER][URL='https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-voronezh.1800/'][Color=#00BFFF][FONT=times new roman][CENTER]<<Технический раздел>>. (Кликабельно)[/URL][/CENTER][/FONT][/Color]<br>" +
        '[Color=#FF0000][FONT=times new roman][CENTER]Закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Ошиблись разделом/сервером',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#FFFF00][CENTER][FONT=times new roman]Вы ошиблись сервером/разделом.<br><br>Переподайте жалобу в нужный раздел.[/Color][/CENTER]" +
		'[Color=#FF0000][FONT=times new roman][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Не написан ник',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Игровой ник автора жалобы и ник игрока на которого подается жалоба, должны быть указаны обязательно.[/Color][/CENTER]<br>" +
		'[Color=#FF0000][FONT=times new roman][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Нет подтверждения усл. сделки',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Игрок не подтвердил условия вашей сделки.[/Color][/CENTER]<br>" +
		'[Color=#FF0000][FONT=times new roman][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Не указаны тайм-коды',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Тайм-коды не были указаны за 24 часа.[/Color][/CENTER]<br>" +
		'[Color=#FF0000][FONT=times new roman][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Док-ва не рабочие',
	  content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
		"[Color=#F0E68C][CENTER][FONT=times new roman]Ваши доказательства не рабочие или битая ссылка, пожалуйста загрузите доказательства на фото/видео хостинге.[/Color][/CENTER]<br>" +
		'[Color=#FF0000][FONT=times new roman][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Фотохостинги',
	  content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
		"[Color=#F0E68C][CENTER][FONT=times new roman]Доказательства должны быть загружены на Yapx/Imgur/YouTube.[/Color][/CENTER]<br>" +
		'[Color=#FF0000][FONT=times new roman][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
	},
        {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴•RolePlay биографии•╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
      {
      title: 'Био одобрено',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Ваша RolePlay биография была проверена и получает статус:[/color]<br>[Color=#00FF00]Одобрено.<br>[/CENTER][/color][/FONT]" +
        '[Color=#FF0000][FONT=times new roman][CENTER]Закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ODOBRENOBIO_PREFIX,
	  status: false,
    },
    {
      title: 'Био на доработке',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Вам даётся 24 часа на дополнение вашей RolePlay биографии.[/Color][/CENTER]" +
        '[Color=#FFFF00][FONT=times new roman][CENTER]На рассмотрении...[/I][/CENTER][/color][/FONT]',
      prefix: NARASSMOTRENIIBIO_PREFIX,
    },
    {
      title: 'Био отказ',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Ваша RolePlay биография была проверена и получает статус:<br>[/Color][Color=#FF0000]Отказано.[/color]<br>[Color=#F0E68C]<br>Причиной отказа могло послужить какое-либо нарушение из<br>[/Color][URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-rp-%D0%91%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.4597417/'][Color=#FFFF00][FONT=times new roman][CENTER]<br>Правил написания RP биографии. (Кликабельно)[/URL][/Color][/FONT][/CENTER]" +
        '[Color=#FF0000][FONT=times new roman][CENTER]Закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
      title: 'Био отказ (заголовок темы)',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Ваша RolePlay биография была проверена и получает статус:<br>[/Color][Color=#FF0000]Отказано.[/color]<br>[Color=#F0E68C]<br>Причиной отказа могло послужить неправильное заполнение заголовка темы. Ознакомьтесь с правилам подачи:<br>[/Color][URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-rp-%D0%91%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.4597417/'][Color=#FFFF00][FONT=times new roman][CENTER]<br>Правила написания RP биографии. (Кликабельно)[/URL][/Color][/FONT][/CENTER]" +
        '[Color=#FF0000][FONT=times new roman][CENTER]Закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
      title: 'Био отказ(3-е лицо)',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Ваша RolePlay биография была проверена и получает статус:<br>[/Color][Color=#FF0000]Отказано.[/color]<br>[Color=#F0E68C]<br>Причиной отказа могло послужить создание биографии от 3-го лица.[/Color][/CENTER][/FONT]" +
        '<br>[Color=#FF0000][FONT=times new roman][CENTER]Закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
      title: 'Био украдена',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Ваша RolePlay биография была проверена и получает статус:<br>[/Color][Color=#FF0000]Отказано.[/color]<br>[Color=#F0E68C]<br>Запрещена полная или частичная кража чужих RolePlay биографий.[/Color][/CENTER][/FONT]" +
        '<br>[Color=#FF0000][FONT=times new roman][CENTER]Закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
      title: 'Возраст не совпадает',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Ваша RolePlay биография была проверена и получает статус:<br>[/Color][Color=#FF0000]Отказано.[/color]<br>[Color=#F0E68C]<br>Указанный возраст не совпадает с датой рождения.[/Color][/CENTER][/FONT]" +
        '<br>[Color=#FF0000][FONT=times new roman][CENTER]Закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
     {
      title: 'Меньше 18 лет',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Ваша RolePlay биография была проверена и получает статус:<br>[/Color][Color=#FF0000]Отказано.[/color]<br>[Color=#F0E68C]<br>Данному персонажу меньше 18 лет.[/Color][/CENTER][/FONT]" +
         '<br>[Color=#FF0000][FONT=times new roman][CENTER]Закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
      title: 'Ник с "_"/Англ',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Ваша RolePlay биография была проверена и получает статус:[/Color]<br>[Color=#FF0000]Отказано.[/color]<br>[Color=#F0E68C]<br>Никнейм должен быть указан без нижнего подчеркивания и на русском языке как в заголовке, так и в самой теме.[/Color][/CENTER][/FONT]" +
        '<br>[Color=#FF0000][FONT=times new roman][CENTER]Закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
      title: 'Супер способности',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Ваша RolePlay биография была проверена и получает статус:[/Color]<br>[Color=#FF0000]Отказано.[/color]<br>[Color=#F0E68C]<br>Запрещено приписывание своему персонажу супер-способностей.[/Color][/CENTER][/FONT]" +
        '<br>[Color=#FF0000][FONT=times new roman][CENTER]Закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
      title: 'Недостаточно RolePlay информации',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Ваша RolePlay биография получает статус:[/Color]<br>[Color=#FF0000]Отказано.[/color]<br>[Color=#F0E68C]<br>В вашей биографии недостаточно информации.[/Color][/CENTER][/FONT]" +
        '<br>[Color=#FF0000][FONT=times new roman][CENTER]Закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: OTKAZBIO_PREFIX,
	  status: false,
       },
    {
      title: 'Грамм. и орфогр. ошибки',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Ваша RolePlay биография получает статус:[/Color]<br>[Color=#FF0000]Отказано.[/color]<br>[Color=#F0E68C]<br>В вашей RP биографии были допущены грамматические или орфографические ошибки.[/Color][/CENTER][/FONT]<br>" +
        "[Color=#FFFF00][CENTER][FONT=times new roman]Убедительная просьба переписать вашу RolePlay Биографию без ошибок![/Color][/CENTER][/FONT]" +
        '[Color=#FF0000][FONT=times new roman][CENTER]Закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
      title: 'Не по форме',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Ваша RolePlay биография была проверена и получает статус:<br>[/Color][Color=#FF0000]Отказано.[/color]<br>[Color=#F0E68C]<br>Ваша Role Play биография составлена не по форме.[/Color][/CENTER][/FONT]" +
        '<br>[Color=#FF0000][FONT=times new roman][CENTER]Закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴•RolePlay ситуации•╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'RolePlay ситуация одобрена',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Ваша RolePlay ситуация была проверена и получает статус:<br>[/Color][Color=#00FF00]Одобрено.[/CENTER][/color][/FONT]" +
        '<br>[Color=#FF0000][FONT=times new roman][CENTER]Закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ODOBRENORP_PREFIX,
	  status: false,
    },
    {
      title: 'RolePlay ситуация на доработке',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Вам даётся 24 часа на дополнение вашей RolePlay ситуации.[/Color][/CENTER]" +
        '[Color=#FFFF00][FONT=times new roman][CENTER]На рассмотрении...[/I][/CENTER][/color][/FONT]',
      prefix: NARASSMOTRENIIRP_PREFIX,
	  status: false,
    },
    {
      title: 'RolePlay ситуация отказ',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Ваша RolePlay ситуация была проверена и получает статус:<br>[/Color][Color=#FF0000]Отказано.[/color]<br>[Color=#F0E68C]<br>Причиной отказа могло послужить какое-либо нарушение из<br><br>[/Color][URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D1%81%D0%B8%D1%82%D1%83%D0%B0%D1%86%D0%B8%D0%B9.4597427/'][Color=#FFFF00][FONT=times new roman][CENTER]Правил RP ситуаций | VORONEZH. (Кликабельно)[/URL][/CENTER][/FONT]" +
        '[Color=#FF0000][FONT=times new roman][CENTER]Закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: OTKAZRP_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Неофиц. RP орг.╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Неофиц. Орг. Одобрена',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Ваша Неофициальная организация была проверена и получает статус:<br>[/Color][Color=#00FF00][I]Одобрено.[/I][/CENTER][/color][/FONT]" +
        '<br>[Color=#F0E68C][FONT=times new roman][CENTER]Предупреждаю вас о том, что вы должны проявлять активность как в игре, так и в данной теме.[/CENTER][/color][/FONT]' +
         '<br>[Color=#FFFF00][FONT=times new roman][CENTER]Тема открыта.[/I][/CENTER][/color][/FONT]',
      prefix: ODOBRENOORG_PREFIX,
	  status: true,
    },
    {
      title: 'Неофиц. Орг. на доработке',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Вам даётся 24 часа на дополнение вашей Неофициальной Организации.[/Color][/CENTER]" +
        '[Color=#FFFF00][FONT=times new roman][CENTER]На рассмотрении...[/I][/CENTER][/color][/FONT]',
      prefix: NARASSMOTRENIIORG_PREFIX,
	  status: true,
    },
    {
      title: 'Неофиц. Орг. отказ',
      content:
		'[Color=#FF0000][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/Color]' +
        "[Color=#F0E68C][CENTER][FONT=times new roman]Ваша Неофициальная организация была проверена и получает статус:<br>[/Color][Color=#FF0000]Отказано.[/color]<br>[Color=#F0E68C]<br>Причиной отказа могло послужить какое-либо нарушение из<br><br>[/Color][URL='https://forum.blackrussia.online/index.php?threads/voronezh-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-%D0%BD%D0%B5%D0%BE%D1%84%D0%B8%D1%86%D0%B8%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE%D0%B9-roleplay-%D0%BE%D1%80%D0%B3%D0%B0%D0%BD%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D0%B8.4778286/']<br>[Color=#FFFF00][FONT=times new roman][CENTER]Правил создания неофициальной RolePlay организации | VORONEZH [/URL][/CENTER][/FONT]" +
        '[Color=#FF0000][FONT=times new roman][CENTER]Закрыто.[/I][/CENTER][/color][/FONT]',
        prefix: OTKAZORG_PREFIX,
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
    addButton('Решено', 'Resheno');
    addButton('Вердикты', 'selectAnswer');
    addButton('Скрипт от Люцифера');
 
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
        23 < hours && hours <= 7 ?
        'Доброе утро' :
        7 < hours && hours <= 14 ?
        'Добрый день' :
        14 < hours && hours <= 23 ?
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