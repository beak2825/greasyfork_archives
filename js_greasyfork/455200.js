// ==UserScript==
// @name         Скрипт Для Кураторов Форума | Yellow
// @namespace    https://forum.blackrussia.online
// @description:ru Предложения по улучшению скрипта писать сюда ---> https://vk.com/artem_krassnov
// @version      2.7
// @description  Скрипт для кураторов форума YELLOW
// @author       Krassnov
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @grant        none
// @license    MIT
// @collaborator Krassnov
// @icon https://icons8.ru/icon/1wz85uEnm72R/id-проверен
// @downloadURL https://update.greasyfork.org/scripts/455200/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%94%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%7C%20Yellow.user.js
// @updateURL https://update.greasyfork.org/scripts/455200/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%94%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%7C%20Yellow.meta.js
// ==/UserScript==
 
(function () {
  'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const TEX_PREFIX = 13;
const buttons = [
    {
	  title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ Для жалоб на игроков ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ ',
	},
     {
      title: 'Приветствие',
     content:
        '[SIZE=4][COLOR=rgb(0, 255, 255)][I][FONT=times new roman]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/I][/COLOR][/SIZE]',
    },
    {
	  title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ Правила Role Play процесса ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ ',
	},
	{
 title: 'NonRP Поведение',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>[COLOR=#ff0000]2.01.[/COLOR] Запрещено поведение, нарушающее нормы процессов Role Play режима игры [Color=#ff0000]| Jail 30 минут[/COLOR].[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#00FF00]Одобрено.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Уход от RP',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>[COLOR=#ff0000]2.02.[/COLOR] Запрещено целенаправленно уходить от Role Play процесса всеразличными способами [Color=#ff0000]| Jail 30 минут / Warn[/COLOR] <br>[Color=#ff0000]Примечание:[/COLOR] например, уходить в AFK при остановке транспортного средства правоохранительными органами, выходить из игры для избежания смерти, выходить из игры во время процесса задержания / ареста, полное игнорирование отыгровок другого игрока, которые так или иначе могут коснутся Вашего персонажа и так далее<br>.[/CENTER]<br>" +
         "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#00FF00]Одобрено.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
 title: 'NonRP Drive',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>[COLOR=#ff0000]2.03.[/COLOR] Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере [Color=#ff0000]| Jail 30 минут.[/COLOR][/CENTER]<br>" +
        "[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)]· Примечание:[/COLOR] езда на скутере по горам, езда на любом транспортном средстве по встречным полосам, нарушая все правила дорожного движения без какой-либо причины, намеренное создание аварийных ситуаций на дорогах и так далее. [/SIZE]<br><br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#00FF00]Одобрено.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
    title: 'NonRP Обман',
      content:
       '[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER][SIZE=4]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:[/SIZE]<br><br>" +
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)]2.05.[/COLOR] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики[COLOR=#ff0000] | PermBan[/COLOR][/SIZE]<br><br>" +
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] после IC договоренности получить денежные средства и сразу же выйти из игры с целью обмана игрока, или же, договорившись через OOC чат (/n), точно также получить денежные средства и сразу же выйти из игры и тому подобные ситуации.[/SIZE]<br><br>" +
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] разблокировка игрового аккаунта нарушителя будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого имущества, которое было украдено (по решению обманутой стороны).[/SIZE]<br><br>" +
        "[CENTER][Color=#00FF00]Одобрено.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
    title: 'RP отыгровки в свою сторону/пользу',
      content:
       '[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
       "[CENTER][SIZE=4]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>[COLOR=#ff0000]2.06.[/COLOR] Запрещены любые Role Play отыгровки в свою сторону или пользу[COLOR=#ff0000] | Jail 30 минут[/COLOR][/SIZE][/CENTER]<br>" + 
       "[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)]· Примечание:[/COLOR] при остановке Вашего транспортного средства правоохранительными органами у Вас очень резко и неожиданно заболевает сердце, ломаются руки, блокируются двери машины или окна и так далее.[/SIZE][/CENTER]<br><br>" +
       "[CENTER][Color=#00FF00]Одобрено.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Аморальные действия',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>[COLOR=#ff0000]2.08.[/COLOR] Запрещена любая форма аморальных действий сексуального характера в сторону игроков[COLOR=#ff0000] | Jail 30 минут / Warn[/COLOR][/CENTER]<br>" +
        "[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)]· Исключение:[/COLOR] обоюдное согласие обеих сторон. [/SIZE][/CENTER]<br><br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#00FF00]Одобрено.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Слив склада',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>[COLOR=#ff0000]2.09.[/COLOR] Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле[COLOR=#ff0000] | Ban 15 - 30 дней / PermBan[/COLOR][/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#00FF00]Одобрено.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: ACCEPT_PREFIX,
	  status: false,
     },
     {
      title: 'Обман в /do | /me',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/COLOR]<br><br>' +
		"[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>[COLOR=#ff0000]2.10.[/COLOR] Запрещено в любой форме обманывать в /do, даже если это в дальнейшем негативно скажется на Вашем игровом персонаже[Color=#ff0000] | Jail 30 минут / Warn [/COLOR][/CENTER]<br>" +
		"[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#00FF00]Одобрено.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: ACCEPT_PREFIX,
	  status: false,
     },
     {
      title: 'Затягивание RP процесса',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/COLOR]<br><br>' +
		"[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>[COLOR=#ff0000]2.12.[/COLOR] Запрещено целенаправленное затягивание Role Play процесса[Color=#ff0000] | Jail 30 минут [/COLOR][/CENTER]<br>" +
		"[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)]· Примечание:[/COLOR] /me начал доставать документы [1/100], начал доставать документы [2/100] и тому подобное. [/SIZE][/CENTER]<br><br>" +
		"[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#00FF00]Одобрено.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: ACCEPT_PREFIX,
	  status: false,
     },
   {
      title: 'DB',
      content:
		"[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>" +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>[COLOR=#ff0000]2.13.[/COLOR] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [Color=#ff0000]| Jail 60 минут.[/COLOR][/CENTER]<br>" +
        "[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)]· Исключение:[/COLOR] разрешается на территории проведения мероприятия по захвату упавшего семейного контейнера. [/SIZE]<br><br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#00FF00]Одобрено.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: "RK",
      contetnt:
      "[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>" +
      "[CENTER]Игрок будет [COLOR=#ff0000]наказан[/COLOR] по данному пункту правил:<br>[COLOR=#ff0000]2.14.[/COLOR] Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти [Color=#ff0000]| Jail 30 минут [/COLOR].[/CENTER]<br>" +
      "[CENTER] [/CENTER]<br>" +
      "[CENTER][Color=#00FF00]Одобрено.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'TK',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>[COLOR=#ff0000]2.15.[/COLOR] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины [Color=#ff0000]| Jail 60 минут / Warn (за два и более убийства)[/COLOR].[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#00FF00]Одобрено.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'SK',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет [COLOR=#ff0000]наказан[/COLOR] по данному пункту правил:<br>[COLOR=#ff0000]2.16.[/COLOR] Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них [Color=#ff0000]| Jail 60 минут / Warn (за два и более убийства)[/COLOR].[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#00FF00]Одобрено.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'PG',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>[COLOR=#ff0000]2.17.[/COLOR] Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь [Color=#ff0000]| Jail 30 минут[/COLOR].[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#00FF00]Одобрено.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'MG',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>[COLOR=#ff0000]2.18.[/COLOR] Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [Color=#ff0000]| Mute 30 минут[/COLOR].[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#00FF00]Одобрено.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'DM',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>[COLOR=#ff0000]2.19.[/COLOR] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [Color=#ff0000]| Jail 60 минут[/COLOR].[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#00FF00]Одобрено.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Mass DM',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>[COLOR=#ff0000]2.20.[/COLOR] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более [Color=#ff0000]| Warn / Ban 3-7 дней[/COLOR].[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#00FF00]Одобрено.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
title: 'Постороннее ПО/Изм. Файлов игры',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>[COLOR=#ff0000]2.22.[/COLOR] Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ff0000]|  Ban 15 - 30 дней / PermBan[/COLOR].[/CENTER]<br>" +
        "[CENTER] [COLOR=#ff0000]Примечание:[/COLOR] запрещено внесение любых изменений в оригинальные файлы игры. [/CENTER]<br>" +
        "[CENTER] [COLOR=#ff0000]Исключение:[/COLOR] разрешено изменение шрифта, его размера и длины чата (кол-во строк). [/CENTER]<br>" +
        "[CENTER] [COLOR=#ff0000]Исключение:[/COLOR] блокировка за включенный счетчик FPS не выдается. [/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#00FF00]Одобрено.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Ущерб экономики',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>[COLOR=#ff0000]2.30.[/COLOR] Запрещено пытаться нанести ущерб экономике сервера [Color=#ff0000]| Ban 15 - 30 дней / PermBan[/COLOR].[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#00FF00]Одобрено.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Реклама ссылок/проектов и тд..',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>[COLOR=#ff0000]2.31.[/COLOR] Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное[Color=#ff0000] | Ban 7 дней / PermBan [/COLOR][/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#00FF00]Одобрено.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
title: 'Обман Адм',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>[COLOR=#ff0000]2.32.[/COLOR] Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта [Color=#ff0000]| Ban 7 - 15 дней / PermBan[/COLOR][/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#00FF00]Одобрено.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Уход от наказания',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>[COLOR=#ff0000]2.34.[/COLOR] Запрещен уход от наказания [Color=#ff0000]| Ban 15 - 30 дней (суммируется к общему наказанию дополнительно) [/COLOR].[/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] зная, что в данный момент игроку может быть выдано наказание за какое-либо нарушение, изменение никнейма или передача своего имущества на другие аккаунты и тому подобное.[/SIZE]<br><br>" +
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] выход игрока из игры не является уходом от наказания.[/SIZE]<br><br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#00FF00]Одобрено.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'IC/OOC Конфликты',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>[COLOR=#ff0000]2.35.[/COLOR] На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате[Color=#ff0000] | Mute 120 минут / Ban 7 дней [/COLOR][/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#00FF00]Одобрено.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'OOC Угрозы',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>[COLOR=#ff0000]2.37.[/COLOR] Запрещены OOC угрозы, в том числе и завуалированные [Color=#ff0000]| Mute 120 минут / Ban 7 дней[/COLOR].[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#00FF00]Одобрено.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Распространение личной инф.',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>[COLOR=#ff0000]2.38.[/COLOR] Запрещено распространять личную информацию игроков и их родственников[Color=#ff0000] | Ban 15 - 30 дней / PermBan [/COLOR][/CENTER]<br>" +
        "[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)]· Исключение:[/COLOR] личное предоставление данной информации, разрешение на распространение от владельца. [/SIZE][/CENTER]<br><br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#00FF00]Одобрено.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'МНПС',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>[COLOR=#ff0000]2.39.[/COLOR] Злоупотребление нарушениями правил сервера[Color=#ff0000] | Ban 7 - 30 дней [/COLOR][/CENTER]<br>" +
        "[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)]· Примечание:[/COLOR] неоднократное (от шести и более) нарушение правил сервера, которые были совершены за прошедшие 7 дней. [/SIZE][/CENTER]<br><br>" +
        "[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)]· Примечание:[/COLOR] наказания выданные за нарушения правил текстовых чатов, помеху (kick) в учет не идут. [/SIZE][/CENTER]<br><br>" +
        "[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)]· Пример:[/COLOR] было получено пять наказаний за DM, шестое будет злоупотреблением. Если было получено одно наказание за упоминание родных, два наказания за DB и два наказания за DM, следующее будет считаться злоупотреблением. [/SIZE][/CENTER]<br><br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#00FF00]Одобрено.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
 title: 'Оск/Призывы покинуть проект',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#FF0000] наказан [/COLOR]по данному пункту правил:<br>[COLOR=#ff0000]2.40.[/COLOR] Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [Color=#ff0000]|Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором)[/COLOR][/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#00FF00]Одобрено.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
 title: 'Продажа аккаунта/имущества за деньги',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#FF0000] наказан [/COLOR]по данному пункту правил:<br>[COLOR=#ff0000]2.42.[/COLOR] Попытка продажи любого игрового имущества или игрового аккаунта за реальные деньги[Color=#ff0000] | PermBan [/COLOR][/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#00FF00]Одобрено.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Продажа Промо',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>[COLOR=#ff0000]2.43.[/COLOR] Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций [Color=#ff0000]| Mute 120 минут[/Color].[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#00FF00]Одобрено.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Езда по полям',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>[COLOR=#ff0000]2.46.[/COLOR] Запрещено ездить по полям на любом транспорте[Color=#ff0000] | Jail 30 минут [/COLOR][/CENTER]<br>" +
        "[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)]· Исключение:[/COLOR] разрешено передвижение на кроссовых мотоциклах и внедорожниках. [/SIZE][/CENTER]<br><br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#00FF00]Одобрено.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
title: 'Езда по полям на Фуре/Инко',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>[COLOR=#ff0000]2.47.[/COLOR] Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) [Color=#ff0000]| Jail 60 минут[/COLOR].[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#00FF00]Одобрено.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
title: 'NonRP Аксесуар',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>[COLOR=#ff0000]2.52.[/COLOR] Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера.[Color=#ff0000] | При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут [/COLOR].[/CENTER]<br>" +
        "[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)]· Пример:[/COLOR] слишком большие аксессуары на голове персонажа, имитация гитарой половых органов и тому подобное. [/SIZE][/CENTER]<br><br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#00FF00]Одобрено.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Неув отнш к Адм',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>[COLOR=#ff0000]2.54.[/COLOR] Запрещено неуважительное обращение, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [Color=#ff0000]| Mute 180 минут[/COLOR][/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#00FF00]Одобрено.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
title: 'Багоюз анимации',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/COLOR]<br><br>' +
        "Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE]<br><br>" +
        "[COLOR=rgb(255, 0, 0)]2.55. [/COLOR]Запрещается багоюз связанный с анимацией в любых проявлениях. [COLOR=rgb(255, 0, 0)]| Jail 60 / 120 минут[/COLOR]<br><br>" +
        '[LIST]<br><br>' +
        "[*][COLOR=rgb(255, 0, 0)]Пример: [/COLOR]если игрок, используя баг, убирает ограничение на использование оружия в зеленой зоне, сбивает темп стрельбы, либо быстро перемещается во время войны за бизнес или во время перестрелки на мероприятии с семейными контейнерами, последует наказание в виде Jail на 120 минут. Данное наказание используется в случаях, когда, используя ошибку, было получено преимущество перед другими игроками.<br><br>" +
        "[*][COLOR=rgb(255, 0, 0)]Пример: [/COLOR]если игрок использует баги, связанные с анимацией, и при этом не влияет на игровой процесс других игроков, а также не получает преимущество перед другими игроками, последует наказание в виде Jail на 60 минут.<br><br>" +
        "[/LIST]<br><br>" +
        "[CENTER][Color=#00FF00]Одобрено.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Подделка ника',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>[COLOR=#ff0000]4.10.[/COLOR] Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию[COLOR=#ff0000] | Устное замечание + смена игрового никнейма / PermBan[/COLOR][/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#00FF00]Одобрено.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: ACCEPT_PREFIX,
	  status: false,
     },
     {
      title: 'Жалоба на шрифт',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER] [COLOR=#00FF00]Разрешено[/COLOR] изменение шрифта, его размера и длины чата (кол-во строк). [/CENTER]<br>" +
        "[CENTER] [COLOR=#ff0000]Блокировка[/COLOR] за включенный счетчик FPS не выдается. [/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#ff0000]Отказано.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
     },
    {
	  title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ Игровые чаты ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ ',
	},
    {
	  title: 'CapsLock',
	  content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
		"[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>[COLOR=#ff0000]3.02.[/COLOR] Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате [Color=#ff0000]| Mute 30 минут [/COLOR][/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#00FF00]Одобрено.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
      title: 'Оск в NonRP чат',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>[COLOR=#ff0000]3.03.[/COLOR] Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены [Color=#ff0000]| Mute 30 минут[/COLOR].[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#00FF00]Одобрено.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Оск/Упоминание родных',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>[COLOR=#ff0000]3.04.[/COLOR] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [Color=#ff0000]| Mute 120 минут / Ban 7 - 15 дней[/COLOR].[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#00FF00]Одобрено.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Flood',
	  content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
		"[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>[COLOR=#ff0000]3.05.[/COLOR] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [Color=#ff0000]| Mute 30 минут[/COLOR][/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#00FF00]Одобрено.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Злоупотребление знаков и тд..',
	  content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
		"[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>[COLOR=#ff0000]3.06.[/COLOR] Запрещено злоупотребление знаков препинания и прочих символов[Color=#ff0000] | Mute 30 минут [/COLOR][/CENTER]<br>" +
		"[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)]· Пример:[/COLOR] «???????», «!!!!!!!», «Дааааааааааааааааааааааа» и так далее. [/SIZE][/CENTER]<br><br>" +
		"[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#00FF00]Одобрено.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
      title: 'Оск в RP чат',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>[COLOR=#ff0000]3.07.[/COLOR]  Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата [Color=#ff0000]| Mute 30 минут[/COLOR][/CENTER]<br>" +
        "[CENTER][Color=#ff0000]Примечание:[/COLOR] «дырка», «шмара», «ведро», «мадагаскарский присосконог», «свиноногий бандикут», «скорострел» и так далее.[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#00FF00]Одобрено.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Слив чата',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>[COLOR=#ff0000]3.08.[/COLOR] Запрещены любые формы «слива» посредством использования глобальных чатов [Color=#ff0000]| PermBan[/COLOR][/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#00FF00]Одобрено.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Угрозы о выдачи наказания',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>[COLOR=#ff0000]3.09.[/COLOR] Запрещены любые угрозы о наказании игрока со стороны администрации[Color=#ff0000] | Mute 30 минут [/COLOR][/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#00FF00]Одобрено.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Выдача себя за Адм',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#FF0000] наказан [/COLOR]по данному пункту правил:<br>[COLOR=#ff0000]3.10.[/COLOR] Запрещена выдача себя за администратора, если таковым не являетесь [Color=#ff0000]| Ban 15 - 30 + ЧС администрации[/COLOR][/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#00FF00]Одобрено.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Ввод в заблуждение',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>[COLOR=#ff0000]3.11.[/COLOR] Запрещено введение игроков проекта в заблуждение путем злоупотребления командами[COLOR=#ff0000] | Ban 15 - 30 дней / PermBan.[/COLOR][/CENTER]<br>" +
        "[CENTER][Color=#ff0000]Примечание:[/color] /me чтобы поднять кошелек введите /pay 228 5000. Для продажи автомобиля введите /sellmycar id 2828 (счёт в банке) цена. [/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#00FF00]Одобрено.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: ACCEPT_PREFIX,
	  status: false,
     },
     {
      title: 'Музыка в ГЧ',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>[COLOR=#ff0000]3.14.[/COLOR] Запрещено включать музыку в Voice Chat[Color=#ff0000] | Mute 60 минут [/COLOR][/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#00FF00]Одобрено.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: ACCEPT_PREFIX,
	  status: false,
     },
     {
      title: 'Упом/оск родни в ГЧ',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>[COLOR=#ff0000]3.15.[/COLOR] Запрещено оскорблять игроков или родных в Voice Chat [Color=#ff0000]| Mute 120 минут / Ban 7 - 15 дней[/COLOR][/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#00FF00]Одобрено.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Посторонние звуки/шумы в ГЧ',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>[COLOR=#ff0000]3.16.[/COLOR] Запрещено создавать посторонние шумы или звуки[Color=#ff0000] | Mute 30 минут [/COLOR][/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#00FF00]Одобрено.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: ACCEPT_PREFIX,
	  status: false,
     },
      {
      title: 'Реклама в ГЧ',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>[COLOR=#ff0000]3.17.[/COLOR] Запрещена реклама в Voice Chat не связанная с игровым процессом[Color=#ff0000] | Ban 7-15 дней [/COLOR][/CENTER]<br>" +
        "[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)]· Пример:[/COLOR] реклама Discord серверов, групп, сообществ, ютуб каналов и т.д. [/SIZE][/CENTER]<br><br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#00FF00]Одобрено.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: ACCEPT_PREFIX,
	  status: false,
     },
     {
      title: 'Политика',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>[COLOR=#ff0000]3.18.[/COLOR] Запрещено политическое и религиозное пропагандирование [Color=#ff0000]| Mute 120 минут / Ban 10 дней[/COLOR][/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#00FF00]Одобрено.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Транслит',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>[COLOR=#ff0000]3.20.[/COLOR] Запрещено использование транслита в любом из чатов [Color=#ff0000] | Mute 30 минут [/COLOR][/CENTER]<br>" +
        "[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)]· Пример:[/COLOR] «Privet», «Kak dela», «Narmalna». [/SIZE][/CENTER]<br><br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#00FF00]Одобрено.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: ACCEPT_PREFIX,
	  status: false,
     },
     {
      title: 'Реклама промо',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>[COLOR=#ff0000]3.21.[/COLOR] Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. [Color=#ff0000]| Ban 30 дней[/Color].[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#00FF00]Одобрено.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Торговля на территории ГОСС',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>[COLOR=#ff0000]3.22.[/COLOR] Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) [Color=#ff0000] | Mute 30 минут [/COLOR][/CENTER]<br>" +
        "[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)]· Пример:[/COLOR] в помещении центральной больницы писать в чат: Продам эксклюзивную шапку дешево!!! [/SIZE][/CENTER]<br><br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#00FF00]Одобрено.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: ACCEPT_PREFIX,
	  status: false,
     },
     {
	  title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ Жалобы на сотрудников органов/казино ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ ',
	},
	{
title: 'Задержание без RP',
      content:
       '[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][SIZE=4]Нарушитель буден наказан по следующему пункту правил государственных структур:[/SIZE][/COLOR]<br><br>" +
        "[COLOR=rgb(255, 0, 0)][SIZE=4]6.03. [/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Запрещено оказывать задержание без Role Play отыгровки[/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4] | Warn[/SIZE][/COLOR]<br><br>" +
        "[CENTER] [/CENTER]<br>" +
        "[CENTER][Color=#00FF00]Одобрено.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
 title: 'Работа/Казино в форме ГОСС',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#FF0000] наказан [/COLOR]по данному пункту правил:<br>[COLOR=#ff0000]1.07.[/COLOR] Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, находится в интерьере казино [Color=#ff0000]| Jail 30 минут [/COLOR][/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
        "[CENTER][Color=#00FF00]Одобрено.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'NonRP Охранник',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>[COLOR=#ff0000]2.03.[/COLOR] Охраннику казино запрещено выгонять игрока без причины [Color=#ff0000]| Увольнение с должности | Jail 30 минут[/COLOR].[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#00FF00]Одобрено.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Редактирование не по П/Р/О',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>[COLOR=#ff0000]4.01.[/COLOR] Запрещено редактирование объявлений, не соответствующих ПРО[COLOR=#ff0000] | Mute 30 минут.[/COLOR][/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#00FF00]Одобрено.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: ACCEPT_PREFIX,
	  status: false,
     },
     {
      title: 'NonRP Поведения у сотрудников ГОСС',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>[COLOR=#ff0000]6.03.[/COLOR] Запрещено NonRP поведение [Color=#ff0000]| Warn[/COLOR].[/CENTER]<br>" +
        "[CENTER]Примечание: поведение, не соответствующее сотруднику госс. [/CENTER]<br>" +
        "[CENTER]Пример: [/CENTER]<br>" +
        "[CENTER]- открытие огня по игрокам без причины, [/CENTER]<br>" +
        "[CENTER]- расстрел машин без причины, [/CENTER]<br>" +
        "[CENTER]- нарушение ПДД без причины, [/CENTER]<br>" +
        "[CENTER]- сотрудник на служебном транспорте кричит о наборе в свою семью на спавне. [/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#00FF00]Одобрено.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Розыск без RP причины',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>[COLOR=#ff0000]6.02.[/COLOR] Запрещено выдавать розыск без Role Play причины [Color=#ff0000]| Warn[/COLOR].[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#00FF00]Одобрено.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Изъятие лиц на вождение (при погоне)',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>[COLOR=#ff0000]7.04.[/COLOR] Запрещено отбирать водительские права во время погони за нарушителем [Color=#ff0000]| Warn[/COLOR].[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#00FF00]Одобрено.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Редактирование в л/ц',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>[COLOR=#ff0000]4.04.[/COLOR] Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком[COLOR=#ff0000] | Ban 7 дней + ЧС организации[/COLOR][/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#00FF00]Одобрено.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: ACCEPT_PREFIX,
	  status: false,
     },
     {
	  title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ Доказательства/Форма темы ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ ',
	},
    {
title: 'Нету условий сделки',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER][B]В данных доказательствах отсутствуют условия сделки[/CENTER]" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#ff0000]Отказано.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
title: 'Укажите тайм-коды(Фрапс больше 3-х мин)',
	  content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваше видео более 3х минут. [/CENTER]<br>" +
        "[CENTER][COLOR=#ff0000]3.7[/COLOR] Если видеодоказательство длится более [COLOR=#ff0000]3 минут,[/COLOR] Вы должны указать [COLOR=#ff0000]тайм-коды[/COLOR] нарушений.[/CENTER]<br>" +
		"[CENTER]Укажите тайм коды нарушений игрока и создайте новую жалобу. [/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#ff0000]Отказано.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
title: 'Нужна видеофиксация',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER][B]В таких случаях нужна видеофиксация нарушения.[/CENTER]" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#ff0000]Отказано.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Нарушений не найдено',
	  content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
		"[CENTER]Нарушений со стороны данного игрока не было найдено.[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#ff0000]Отказано.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
{
      title: 'Недостаточно доказательств',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Недостаточно доказательств на нарушение от данного игрока.<br>Доказательства должны быть предоставлены в хорошем качестве и с полным процессом сделки или нарушения от какого-либо игрока.[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#ff0000]Отказано.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Дублирование',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "Ранее вам уже был дан ответ на подобную жалобу, просьба не создавать дубликаты этой темы, иначе ваш форумный аккаунт может быть заблокирован.<br>" +
        "[CENTER] [/CENTER]<br>" +
        "[CENTER][Color=#ff0000]Отказано.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Заполнено не по форме',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша жалоба составлена не по форме. Форма создания темы:[/CENTER]" +
        "[CENTER]1. Ваш Nick_Name: [/CENTER]<br>" +
        "[CENTER]2. Nick_Name игрока: [/CENTER]<br>" +
        "[CENTER]3. Суть жалобы: [/CENTER]<br>" +
        "[CENTER]4. Доказательство: [/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#ff0000]Отказано.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Нету /time',
	  content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER]На ваших доказательствах отсутствует [COLOR=#ffff00]/time[/COLOR].[/CENTER]<br>" +
		"[CENTER][Color=#ff0000]Отказано.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
title: 'Док-ва в соц. сетях',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[SIZE=4]Доказательства в социальных сетях и т.д. не принимаются. Загрузите доказательства на фото-видео хостинги YouTube,Imgur, Yapx и так далее.[/SIZE]<br><br>" +
        "[SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE]<br><br>" +
        "[CENTER] [/CENTER]<br>" +
        "[CENTER][Color=#ff0000]Отказано.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
title: 'Док-ва отредактированы',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваши доказательства отредактированы. Создайте жалобу с первоначальными доказательствами.[/CENTER]" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#ff0000]Отказано.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Отсутствуют док-ва',
	  content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
		"[CENTER]В вашей жалобе отсутствуют доказательства.[/CENTER]<br>" +
        "[CENTER]Создайте новую жалобу с доказательствами.[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#ff0000]Отказано.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Не работают док-ва',
	  content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
		"[CENTER]У вас не работают доказательства.[/CENTER]<br>" +
        "[CENTER]Создайте новую жалобу с рабочими доказательствами.[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#ff0000]Отказано.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Жалоба от 3-го лица',
	  content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
		"[CENTER]Ваша жалоба будет отказана.[/CENTER]<br>" +
        "[CENTER]3.3. Жалоба от третьего лица не принимается (жалоба должна быть подана участником ситуации).[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#ff0000]Отказано.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
	 },
	 {
	  title: 'Прошло больше 3-х суток',
	  content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
		"[CENTER][COLOR=#ff0000]3.1.[/COLOR] Срок написания жалобы составляет три дня (72 часа) с момента совершенного нарушения со стороны игрока сервера.[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#ff0000]Отказано.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Нет доступа к док-вам',
	  content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
		"[CENTER]Доступ к вашим доказательствам закрыт.[/CENTER]<br>" +
        "[CENTER]Пересоздайте жалобу с открытыми доказательствами.[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#ff0000]Отказано.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
	 },
	 {
     title: "Логи не док-ва",
     content: 
      '[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/COLOR]<br><br>' +
      "[CENTER]Слово[COLOR=#ff0000] Логи [/COLOR]<br>не является прямым доказательством, нужно иметь хотябы малейшие док-ва. [/CENTER]<br>" +
      "[CENTER] [/CENTER]<br>" +
      "[CENTER][Color=#ff0000]Отказано.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Неправильное название темы',
	  content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
		"[CENTER][Color=#ff0000]1.2.[/color] В названии темы необходимо указать никнейм игрока, на которого подается жалоба, и суть жалобы.[/CENTER]<br>" +
        "[CENTER][Color=#ff0000]Пример:[/color] Bruce_Banner | nRP Drive[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#ff0000]Отказано.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
	 },
	 {
	  title: 'Жалоба с другого сервера',
	  content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
		"[CENTER]Вы ошиблись разделом сервера, обратитесь в раздел жалоб своего сервера.[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#ff0000]Отказано.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
	 },
	 {
	  title: 'Прикрепите ссылку на док-ва а не на канал',
	  content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
		"[CENTER]Вам [COLOR=#ff0000]отказано[/COLOR] в жалобе. Прикрепите пожалуйста ссылку на доказательства, а не на ваш канал.[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#ff0000]Отказано.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
	 },
	 {
	  title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ На рассмотрение... ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ ',
	},
	{
      title: 'Для Гл.Адм',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша жалоба была передана [Color=#ff0000]Главной Администрации[/COLOR].<br>Просьба ожидать ответа и не создавать дубликаты данной темы.[/CENTER]<br>" +
         "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#FFB900]На рассмотрении.[/color] [Color=#FFFF00]Ожидайте ответа...[/color][/CENTER]",
      prefix: GA_PREFIX,
	  status: true,
    },
    {
      title: 'Для Тех. Спец.',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша жалоба была передана на рассмотрение [COLOR=#0000ff] Техническому Специалисту.[/color][/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#FFB900]На рассмотрении.[/color] [Color=#FFFF00]Ожидайте ответа...[/color][/CENTER]",
      prefix: TEX_PREFIX,
	  status: true,
    },
    {
 title: 'Для ГМ/ЗГМ',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша жалоба взята на [COLOR=#FFB900]рассмотрение[/COLOR] [COLOR=#ff0000]Главному Модератору форума/Заместителю Главного Модератора форума[/COLOR].<br>Просьба ожидать ответа и не создавать дубликаты данной темы.[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#FFB900]На рассмотрении.[/color] [Color=#FFFF00]Ожидайте ответа...[/color][/CENTER]",
      prefix: PIN_PREFIX,
	  status: true,
    },
    {
 title: 'Для ГС/ЗГС ГОСС',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша жалоба взята на [COLOR=#FFB900]рассмотрение[/COLOR] [COLOR=#ff0000]ГС ГОСС/Заместителю ГС ГОСС[/COLOR].<br>Просьба ожидать ответа и не создавать дубликаты данной темы.[/CENTER]<br>" +
		"[CENTER][Color=#FFB900]На рассмотрении.[/color] [Color=#FFFF00]Ожидайте ответа...[/color][/CENTER]",
      prefix: PIN_PREFIX,
	  status: true,
    },
     {
 title: 'На рассмотрении (Для себя)',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша жалоба взята на [COLOR=#FFB900]Рассмотрение[/COLOR].<br>Просьба ожидать ответа и не создавать дубликаты данной темы.[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#FFB900]На рассмотрении.[/color] [Color=#FFFF00]Ожидайте ответа...[/color][/CENTER]",
      prefix: PIN_PREFIX,
	  status: true,
    },
     {
	  title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ Перенаправление ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ ',
	},
    {
      title: 'В жалобы на адм',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Вы ошиблись разделом.<br>Обратитесь в раздел [Color=#ff0000]«Жалобы на администрацию»[/COLOR].[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#ff0000]Отказано.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'В обжалование',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Вы ошиблись разделом.<br>Обратитесь в раздел Обжалования: [URL='https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.195/']*Клик*[/URL].[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#ff0000]Отказано.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
title: 'В тех раздел',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER][SIZE=4]Вы ошиблись разделом. Обратитесь в Технический раздел.[/SIZE][/CENTER}<br><br>" +
        "[CENTER] [/CENTER]<br>" +
        "[CENTER][Color=#ff0000]Отказано.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
	  title: 'В жалобы во фракции',
	  content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
		"[CENTER]Вы ошиблись разделом, обратитесь в раздел жалоб на сотрудников[COLOR=#ffff00] фракции[/COLOR][/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#ff0000]Отказано.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'В Лидерский раздел',
	  content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
		"[CENTER]Вы ошиблись разделом, обратитесь в раздел жалоб на[COLOR=#ffff00] Лидеров/Заместителей[/COLOR][/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER][Color=#ff0000]Отказано.[/color] [Color=#ff0000]Закрыто.[/color][/CENTER]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ РП Биографии ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
	},
    {
      title: 'Био Одобрено',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=#00ff00]Одобрено.[/CENTER][/color]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
           title: '3-е лицо',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Причиной отказа могло послужить создание биографии от 3го лица.[/CENTER]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
title: 'Заголовок темы',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Причиной отказа могло послужить неправильное заполнение загловка темы.[/CENTER]",
      prefix:UNACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Био украдено',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток,  {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=#ff0000]Отказано.[/color]<br>РП Биография украдена.[/CENTER]",
      prefix:UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Био отказано',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток,  {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=#ff0000]Отказано.[/color]<br>Причиной отказа могло послужить какое-либо нарушение из правил для составления RP Биографий.[/CENTER]",
      prefix:UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Добавьте побольше информации',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток,  {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=#ff0000]Отказано.[/color]<br>Создайте новую РП биографию указав больше информации.[/CENTER]",
      prefix:UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Не по форме',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток,  {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша РП биография составлена не по форме. [Color=#ff0000]Отказано.[/color]",
      prefix:UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Возраст меньше 18 лет',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток,  {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=#ff0000]Отказано.[/color]<br>Минимальный возраст для составления РП биографии - 18 лет.[/CENTER]",
      prefix:UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ РП ситуации ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Одобрена',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/COLOR]<br><br>' +
        "Ваша РП ситуация получает статус: [Color=#00ff00]Одобрено.[/color<br><br>",
      prefix: ACCEPT_PREFIX,
      status: false,
    },
  {
title: 'Отказано',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/COLOR]<br><br>' +
        "[CENTER]Ваша РП ситуация получает статус: [Color=Red]Отказано.[/color]<br>Причиной отказа могло послужить какое-либо нарушение из Правил создания RolePlay ситуации.[/CENTER]",
      prefix:UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'На доработке',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/COLOR]<br><br>' +
        "В вашей РП ситуации недостаточно информации.<br><br>" +
        "Даю вам 24 часа на ее дополнение.[/COLOR]<br><br>",
      prefix: PIN_PREFIX,
    },
  ];
$(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
 
    // Добавление кнопок при загрузке страницы
    addButton('Закрыто', 'close');
    addButton('На рассмотрение', 'pin');
    addButton('Одобрено', 'accepted');
    addButton('Отказано', 'unaccept');
    addButton('Ответы', 'selectAnswer');
 
 
 
    // Поиск информации о теме
    const threadData = getThreadData();
 
 
    $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
    $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
    $('button#close').click(() => editThreadData(CLOSE_PREFIX, false));
 
 
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
    12 < hours && hours <= 18
      ? 'Доброе утро'
      : 18 < hours && hours <= 21
      ? 'Добрый день'
      : 21 < hours && hours <= 4
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
 