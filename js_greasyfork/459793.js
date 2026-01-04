// ==UserScript==
// @name         Кураторы Форума | ICE
// @namespace    https://forum.blackrussia.online
// @version      2.1
// @description 🏛️
// @author      J. Hoffm
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @grant        none
// @license    MIT
// @icon https:<a href="https://ibb.co/9p4Gmzw"><img src="https://i.ibb.co/WHzsNqD/IMG-20230212-124130.jpg" alt="IMG-20230212-124130" border="0"></a>
// @downloadURL https://update.greasyfork.org/scripts/459793/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%7C%20ICE.user.js
// @updateURL https://update.greasyfork.org/scripts/459793/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%7C%20ICE.meta.js
// ==/UserScript==

(function () {
  'use strict';
const UNACCСEPT_PREFIX = 4; // Prefix that will be set when thread closes
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
        title: 'Приветсвия',
        content: 
              '[CENTER][COLOR=rgb(204, 0, 204)][SIZE=3][ICODE]Доброго времени суток, уважаемый {{ user.name }}[/ICODE][/SIZE][/COLOR][/CENTER]',
    },
    {
        title: 'Одобрено',
        content: 
               '[CENTER][COLOR=rgb(204, 0, 204)][SIZE=3][ICODE]Доброго времени суток, уважаемый {{ user.name }}[/ICODE][/SIZE][/COLOR][/CENTER]<br><br>' +
               "[CENTER][COLOR=rgb(0, 255, 0)][SIZE=3][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR][/CENTER]<br>" +
               '[SIZE=1][I][FONT=georgia]Приятной игры на BLACK RUSSIA[/FONT][/I] [/SIZE][COLOR=rgb(170, 255, 255)][SIZE=3][ICODE]ICE[/ICODE][/SIZE][/COLOR]',
               prefix: ACCEPT_PREFIX,
	  status: false,
	  
    },
    {
        title: 'Отказано',
        content: 
              '[CENTER][SIZE=4][COLOR=rgb(204, 0, 204)][ICODE]Доброго времени суток, уважаемый {{ user.name }}[/ICODE][/COLOR][/SIZE][/CENTER]<br><br>' +
              "[CENTER][COLOR=rgb(255, 0, 0)][SIZE=3][ICODE]Отказано.[/ICODE][/SIZE][/COLOR]<br><br>" +
              '[I][SIZE=3][FONT=times new roman]Приятной игры на BLACK RUSSIA [COLOR=rgb(170, 255, 255)][ICODE]ICE[/ICODE][/COLOR][/FONT][/SIZE][/I][/CENTER]',
              prefix: UNACCСEPT_PREFIX,
            status: false,
    },   
    {
        title: 'На рассмотрении',
        content: 
              '[CENTER][COLOR=rgb(204, 0, 204)][SIZE=3][ICODE]Доброго времени суток, уважаемый {{ user.name }}[/ICODE][/SIZE][/COLOR][/CENTER]<br><br>' +
              "[CENTER][SIZE=3][I][FONT=georgia]Ваша жалоба находиться на рассмотрении.[/FONT][/I][/SIZE]<br><br>" +
              '[COLOR=rgb(255, 255, 0)][SIZE=3][ICODE]Ожидайте ответа.[/ICODE][/SIZE][/COLOR][/CENTER]',
              prefix: PIN_PREFIX,
              status: true,
      },  
      {
         title: 'Передать на ГА',
         content: 
              '[CENTER][COLOR=rgb(204, 0, 204)][ICODE]Доброго времени суток, уважаемый {{ user.name }}[/ICODE][/COLOR][/CENTER]<br><br>' +
              "[CENTER][SIZE=3][I][FONT=times new roman]Ожидайте ответа от [COLOR=rgb(255, 0, 0)]руководства сервера.[/COLOR][/FONT]<br><br>" +
              '[COLOR=rgb(255, 255, 0)][FONT=times new roman][ICODE]Ожидайте ответа[/ICODE][/FONT][/COLOR][/I][/SIZE][/CENTER]',
              prefix: GA_PREFIX,
	          status: true,
	},
	{
         title: 'На тех-спец',
         content: 
               '[CENTER][COLOR=#cc00cc][ICODE]Доброго времени суток, уважаемый {{ user.name }}[/ICODE][/COLOR][/CENTER]<br><br>' +
               "[CENTER][SIZE=3][I][FONT=times new roman]Ваша жалоба передано на  [COLOR=rgb(0, 0, 128)]техническому специалисту.[/COLOR][/FONT][/I][/SIZE]<br><br>" +
               '[COLOR=rgb(255, 255, 0)][SIZE=3][ICODE]Ожидайте ответа[/ICODE][/SIZE][/COLOR][/CENTER]',
               prefix: TEX_PREFIX,
	           status: true,
	},
	{
        title: '__________________________________________________Одобреные ответы________________________________________________________',
       
	},
	{
       title: 'DM',
        content: 
              '[CENTER][I][FONT=times new roman][COLOR=rgb(204, 0, 204)][FONT=tahoma][ICODE]Здравствуйте, уважаемый {{ user.name }}[/ICODE][/FONT][/COLOR][/FONT][/I][/CENTER]<br><br>' +
              "[CENTER][FONT=times new roman][COLOR=#cc00cc][SIZE=4][I][COLOR=rgb(255, 255, 255)]Нарушитель буден наказан по следующему пункту общих правил серверов: 2.19. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины | Jail 60 минут[/COLOR][/I][/SIZE][/COLOR][/FONT][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR]<br>" +
              '[I][FONT=times new roman]Приятной игры на BLACK RUSSIA.[/FONT][/I][/CENTER]',
        prefix: ACCEPT_PREFIX,
	    status: false,
    },
	{
    
        title: 'ТК',
        content: 
              '[CENTER][COLOR=rgb(204, 0, 204)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый {{ user.name }}[/ICODE][/FONT][/COLOR][/CENTER]<br><br>' +
              "[CENTER][FONT=georgia][COLOR=#cc00cc][SIZE=3][I][COLOR=rgb(255, 255, 255)]Нарушитель буден наказан по следующему пункту общих правил серверов: 2.15. Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины | Jail 60 минут / Warn (за два и более убийства)[/COLOR][/I][/SIZE][/COLOR][/FONT][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено.[/ICODE][/COLOR]<br>" +
              '[I][FONT=times new roman]Приятной игры на BLACK RUSSIA.[/FONT][/I][/CENTER]',
        prefix: ACCEPT_PREFIX,
	    status: false,
    },
    {
        title: 'ДБ',
        content: 
        '[CENTER][SIZE=3][FONT=georgia][COLOR=rgb(204, 0, 204)][ICODE]Доброго времени суток, уважаемый {{ user.name }}[/ICODE][/COLOR][/FONT][/SIZE][/CENTER]<br><br>' +
        "[CENTER][I][SIZE=3][FONT=times new roman]Нарушитель буден наказан по следующему пункту общих правил серверов: [COLOR=rgb(255, 0, 0)]2.13[/COLOR]. Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта | [COLOR=rgb(255, 0, 0)]Jail 60 минут[/COLOR][/FONT][/SIZE][/I]<br><br>" +
        "[SIZE=3][COLOR=rgb(0, 255, 0)][FONT=times new roman][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/SIZE]<br>" +
        '[I][SIZE=3][FONT=times new roman]Приятной игры на BLACK RUSSIA [/FONT][/SIZE][/I][SIZE=3][FONT=times new roman][COLOR=#cc00cc][COLOR=rgb(170, 255, 255)][ICODE]ICE[/ICODE][/COLOR][/COLOR][/FONT][/SIZE][/CENTER]',
        prefix: ACCEPT_PREFIX,
	    status: false,
	},
   {
       title: 'CK',
       content: 
            '[CENTER][COLOR=rgb(204, 0, 204)][SIZE=4][ICODE]Доброго времени суток, уважаемый {{ user.name }}[/ICODE][/SIZE][/COLOR][/CENTER]<br><br>' +
            "[CENTER][FONT=times new roman][I][SIZE=3]Нарушитель буден наказан по следующему пункту общих правил серверов: [COLOR=rgb(255, 0, 0)]2.16[/COLOR]. Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них | [COLOR=rgb(255, 0, 0)]Jail 60 минут / Warn (за два и более убийства)[/COLOR][/SIZE][/I]<br><br>" +
            "[SIZE=3][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/SIZE]<br>" +
            '[COLOR=#00ff00][COLOR=rgb(255, 255, 255)][SIZE=3][I]Приятной игры на BLACK RUSSIA [/I][/SIZE][/COLOR][COLOR=rgb(170, 255, 255)][SIZE=3][ICODE]ICE[/ICODE][/SIZE][/COLOR][/COLOR][/FONT][/CENTER]',
        prefix: ACCEPT_PREFIX,
	    status: false,
	},
   {
       title: 'ПГ',
       content: 
             '[CENTER][COLOR=rgb(204, 0, 204)][SIZE=3][ICODE]Доброго времени суток, уважаемый {{ user.name }}[/ICODE][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][I][FONT=georgia][SIZE=3]Нарушитель буден наказан по следующему пункту общих правил серверов: [COLOR=rgb(255, 0, 0)]2.17[/COLOR]. Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь | [COLOR=rgb(255, 0, 0)]Jail 30 минут[/COLOR][/SIZE][/FONT][/I]<br><br>" +
             "[SIZE=3][COLOR=rgb(0, 255, 0)][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR]<br>" +
             '[COLOR=rgb(255, 255, 255)][FONT=georgia][I]Приятной игры на BLACK RUSSIA [/I][/FONT][/COLOR][COLOR=rgb(170, 255, 255)][FONT=georgia][ICODE]ICE[/ICODE][/FONT][/COLOR][/SIZE][/CENTER]',
          prefix: ACCEPT_PREFIX,
	      status: false,
	},
   {
       title: 'MG',
       content: 
             '[CENTER][COLOR=rgb(204, 0, 204)][SIZE=3][ICODE]Доброго времени суток, уважаемый {{ user.name }}[/ICODE][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][I][SIZE=3][FONT=georgia]Игрок будет наказан по данному пункту правил:[COLOR=rgb(255, 0, 0)]2.18[/COLOR]. Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе | [COLOR=rgb(255, 0, 0)]Mute 30 минут.[/COLOR][/FONT][/SIZE][/I][/CENTER]<br><br>" +
             "[CENTER][COLOR=rgb(0, 255, 0)][SIZE=3][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br>" +
             '[I][SIZE=3][FONT=times new roman]Приятной игры на BLACK RUSSIA [COLOR=rgb(170, 255, 255)][ICODE]ICE[/ICODE][/COLOR][/FONT][/SIZE][/I][/CENTER]',
        prefix: ACCEPT_PREFIX,
	    status: false,
	},
	{
	    title: 'Реклама',
	    content:
	          '[CENTER][COLOR=rgb(119, 255, 255)][SIZE=3][ICODE]Доброго времени суток, уважаемый {{ user.name }}[/ICODE][/SIZE][/COLOR][/CENTER]<br><br>' +
	          "[CENTER][SIZE=3][B][I][FONT=times new roman]Игрок будет наказан по данному пункту правил:[/FONT]<br>" +
              "[FONT=times new roman][COLOR=rgb(255, 0, 0)]2.31[/COLOR]. Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное | [COLOR=rgb(255, 0, 0)]Ban 7 дней / PermBan .[/COLOR][/FONT][/I][/B][/SIZE]<br><br>" +
              '[FONT=times new roman][COLOR=#ff0000][SIZE=3][I][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR][/I][/SIZE][/COLOR][/FONT][/CENTER]',
	    prefix: ACCEPT_PREFIX,
	    status: false,
	},
	{
	    title: 'Фейк',
	    content: 
	          '[CENTER][COLOR=rgb(119, 255, 255)][SIZE=3][ICODE]Доброго времени суток, уважаемый {{ user.name }}[/ICODE][/SIZE][/COLOR][/CENTER]<br><br>' +
	          "[CENTER][SIZE=3][B][FONT=georgia][I]Игрок будет наказан по данному пункту правил:[/I][/FONT][FONT=georgia][I][COLOR=rgb(255, 0, 0)]4.10[/COLOR]. [/I][/FONT][/B][/SIZE][B][SIZE=3][FONT=georgia][I]Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию | [COLOR=rgb(255, 0, 0)]Устное замечание + смена игрового никнейма / PermBan .[/COLOR]<br><br>" +
              '[COLOR=rgb(0, 255, 0)]Одобрено[/COLOR][/I][/FONT][/SIZE][/B][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false,
	},
	{
	    title: 'CapsLock',
	    content: 
	         '[CENTER][COLOR=rgb(204, 0, 204)][SIZE=3][ICODE]Доброго времени суток, уважаемый {{ user.name }}[/ICODE][/SIZE][/COLOR][/CENTER]<br><br>' +
	         "[CENTER][SIZE=3][I][FONT=times new roman]Нарушитель получит следующие наказание: [COLOR=rgb(255, 0, 0)]3.02[/COLOR] | Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом [/FONT][FONT=times new roman]чате | [COLOR=rgb(255, 0, 0)]Mute 30 минут[/COLOR][/FONT][/I][/SIZE][/CENTER]<br><br>" +
	         "[CENTER][COLOR=rgb(0, 255, 0)][SIZE=3][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br>" +
	         '[I][FONT=times new roman][SIZE=3]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/I][FONT=times new roman][COLOR=#aaffff][SIZE=3][ICODE]ICE[/ICODE][/SIZE][/COLOR][/FONT]',
	    prefix: ACCEPT_PREFIX,
	    status: false,
	},
	{
	    title: 'Уход от рп',
	    content: 
	          '[CENTER][COLOR=rgb(119, 255, 255)][SIZE=3][ICODE]Доброго времени суток, уважаемый {{ user.name }}[/ICODE][/SIZE][/COLOR][/CENTER]<br><br>' +
	          "[CENTER][B][FONT=georgia][SIZE=3][I]Нарушитель будет наказан по пункту правил: [/I][/SIZE][/FONT][/B]<br>" +
              "[SIZE=3][B][FONT=georgia][I][COLOR=rgb(255, 0, 0)]2.02[/COLOR]. Запрещено целенаправленно уходить от Role Play процесса всеразличными способами | [COLOR=rgb(255, 0, 0)]Jail 30 минут / Warn[/COLOR][/I][/FONT][/B][/SIZE]<br><br>" +
              '[I][COLOR=rgb(0, 255, 0)][SIZE=3][FONT=georgia]Одобрено[/FONT][/SIZE][/COLOR][/I][/CENTER]',
       prefix: ACCEPT_PREFIX,
       status: false,
	},
	{
	    title: 'Упом род',
	    content: 
	          '[CENTER][COLOR=rgb(204, 0, 204)][SIZE=3][ICODE]Доброго времени суток, уважаемый {{ user.name }}[/ICODE][/SIZE][/COLOR][/CENTER]<br><br>' +
	          "[CENTER][SIZE=3][I][FONT=times new roman]Нарушитель будет наказан по следующему пункту правил: [/FONT][FONT=times new roman][COLOR=rgb(255, 0, 0)]3.04[/COLOR]. Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) | [COLOR=rgb(255, 0, 0)]Mute 120 минут [/COLOR][COLOR=rgb(255, 255, 255)]/[/COLOR][COLOR=rgb(255, 0, 0)] Ban 7 - 15 дней[/COLOR][/FONT][/I][/SIZE][/CENTER]<br><br>" +
	          "[CENTER][SIZE=3][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/CENTER]<br>" +
	          '[CENTER][SIZE=3][I][FONT=times new roman]Приятной игры на BLACK RUSSIA [/FONT][/I][COLOR=rgb(170, 255, 255)][FONT=times new roman][ICODE]ICE[/ICODE][/FONT][/COLOR][/SIZE][/CENTER]',
	    prefix: ACCEPT_PREFIX,
	    status: false,
	},
	{
	    title: 'Нрп обман',
	    content: 
	          '[CENTER][COLOR=rgb(204, 0, 204)][SIZE=3][ICODE]Доброго времени суток, уважаемый {{ user.name }}[/ICODE][/SIZE][/COLOR][/CENTER]<br><br>' +
	          "[CENTER][SIZE=3][I][FONT=georgia]Нарушитель буден наказан по следующему пункту общих правил серверов: [/FONT][FONT=georgia][COLOR=rgb(255, 0, 0)]2.05[/COLOR]. Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики | [COLOR=rgb(255, 0, 0)]PermBan[/COLOR].[/FONT][/I][/SIZE][/CENTER]<br><br>" +
	          "[CENTER][SIZE=3][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/CENTER]<br>" +
	          '[CENTER][SIZE=3][I][FONT=times new roman]Приятной игры на BLACK RUSSIA [COLOR=rgb(170, 255, 255)][ICODE]ICE[/ICODE][/COLOR][/FONT][/I][/SIZE][/CENTER]',
	     prefix: ACCEPT_PREFIX,
	     status: false,
	},
	{
	    title: ' Политика',
	    content: 
	         '[CENTER][COLOR=rgb(204, 0, 204)][SIZE=3][ICODE]Доброго времени суток, уважаемый {{ user.name }}[/ICODE][/SIZE][/COLOR][/CENTER]<br><br>' +
	         "[CENTER][SIZE=3][I][FONT=times new roman]Игрок будет наказан по следующему пункту правил: [/FONT][FONT=times new roman][COLOR=rgb(255, 0, 0)]3.18[/COLOR]. Запрещено политическое и религиозное пропагандирование | [COLOR=rgb(255, 0, 0)]Mute 120 минут / Ban 10 дней[/COLOR][/FONT][/I][/SIZE][/CENTER]<br><br>" +
	         "[CENTER][SIZE=3][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/CENTER]<br>" +
	         '[CENTER][SIZE=3][I][FONT=times new roman]Приятной игры на BLACK RUSSIA [COLOR=rgb(170, 255, 255)][ICODE]ICE[/ICODE][/COLOR][/FONT][/I][/SIZE][/CENTER]',
	    prefix: ACCEPT_PREFIX,
	    status: false,
	},
	{
	    title: 'Чит/сборка/софт',
	    content: 
	          '[CENTER][COLOR=rgb(204, 0, 204)][FONT=times new roman][SIZE=3][ICODE]Доброго времени суток, уважаемый {{ user.name }}[/ICODE][/SIZE][/FONT][/COLOR][/CENTER]<br><br>' +
	          "[CENTER][SIZE=3][I][FONT=times new roman]Игрок будет наказан по следующему пункту правил: [/FONT][FONT=times new roman][COLOR=rgb(255, 0, 0)]2.22[/COLOR]. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan.[/COLOR][/FONT][/I][/SIZE][/CENTER]<br><br>" +
	          "[CENTER][COLOR=rgb(0, 255, 0)][SIZE=3][ICODE]Одобрено[/ICODE][/SIZE][/COLOR][/CENTER]<br>" +
	          '[I][FONT=georgia][SIZE=3]Приятной игры на BLACK RUSSIA [COLOR=rgb(170, 255, 255)][ICODE]ICE[/ICODE][/COLOR][/SIZE][/FONT][/I]',
	    prefix: ACCEPT_PREFIX,
	    status: false,
	},
	{
	    title: 'Нонрп коп',
	    content: 
	          '[CENTER][COLOR=rgb(204, 0, 204)][SIZE=3][ICODE]Доброго времени суток, уважаемый {{ user.name }}[/ICODE][/SIZE][/COLOR][/CENTER]<br><br>' +
	          "[CENTER][SIZE=3][I][FONT=georgia]Игрок будет наказан по следующему пункту правил: [/FONT][FONT=georgia][COLOR=rgb(255, 0, 0)]6.03[/COLOR]. Запрещено оказывать задержание без Role Play отыгровки | [COLOR=rgb(255, 0, 0)]Warn[/COLOR].[/FONT][/I][/SIZE][/CENTER]<br><br>" +
	          "[CENTER][COLOR=rgb(0, 255, 0)][SIZE=3][ICODE]Одобрено[/ICODE][/SIZE][/COLOR][/CENTER]<br>" +
	          '[CENTER][SIZE=3][I][FONT=times new roman]Приятной игры на BLACK RUSSIA [COLOR=rgb(170, 255, 255)][ICODE]ICE[/ICODE][/COLOR][/FONT][/I][/SIZE][/CENTER]',
	    prefix: ACCEPT_PREFIX,
	    status: false,
	},
	{
	    title: 'Розыск без причины',
	    content: 
	          '[CENTER][SIZE=3][COLOR=rgb(204, 0, 204)][FONT=georgia][ICODE]Доброго времени суток, уважаемый {{ user.name }}[/ICODE][/FONT][/COLOR][/SIZE][/CENTER]<br><br>' +
	          "[CENTER][FONT=times new roman][SIZE=3][I]Нарушитель будет наказан по следующему пункту правил:[COLOR=rgb(255, 0, 0)]7.02[/COLOR]. Запрещено выдавать розыск, штраф без Role Play причины | [COLOR=rgb(255, 0, 0)]Warn[/COLOR].[/I][/SIZE][/FONT][/CENTER]<br><br>" +
	          "[CENTER][FONT=georgia][COLOR=rgb(0, 255, 0)][SIZE=3][ICODE]Одобрено[/ICODE][/SIZE][/COLOR][/FONT][/CENTER]<br>" +
	          '[CENTER][SIZE=3][I][FONT=times new roman]Приятной игры на BLACK RUSSIA [COLOR=rgb(170, 255, 255)][ICODE]ICE[/ICODE][/COLOR][/FONT][/I][/SIZE][/CENTER]',
	    prefix: ACCEPT_PREFIX,
	    status: false,
	},
	{
	    title: 'Выдача себя за адм',
	    content: 
	          '[CENTER][COLOR=rgb(204, 0, 204)][SIZE=3][ICODE]Доброго времени суток, уважаемый {{ user.name }}[/ICODE][/SIZE][/COLOR][/CENTER]<br><br>' +
	          "[CENTER][SIZE=3][I][FONT=georgia]Нарушитель будет наказан по следующему пункту правил: [/FONT][FONT=georgia][COLOR=rgb(255, 0, 0)]3.10[/COLOR]. Запрещена выдача себя за администратора, если таковым не являетесь | [COLOR=rgb(255, 0, 0)]Ban 7 - 15 + ЧС администрации[/COLOR][/FONT][/I][/SIZE][/CENTER]<br><br>" +
	          "[CENTER][COLOR=rgb(0, 255, 0)][SIZE=3][ICODE]Одобрено[/ICODE][/SIZE][/COLOR][/CENTER]<br>" +
	          '[CENTER][SIZE=3][I][FONT=times new roman]Приятной игры на BLACK RUSSIA [COLOR=rgb(170, 255, 255)][ICODE]ICE[/ICODE][/COLOR][/FONT][/I][/SIZE][/CENTER]',
	    prefix: ACCEPT_PREFIX,
	    status: false,
	},
	{
	    title: 'Слив склада',
	    content: 
	          '[CENTER][COLOR=rgb(204, 0, 204)][SIZE=3][ICODE]Доброго времени суток, уважаемый {{ user.name }}[/ICODE][/SIZE][/COLOR][/CENTER]<br><br>' +
	          "[CENTER][SIZE=3][I][FONT=georgia]Нарушитель будет наказан по следующему пункту правил: [/FONT][FONT=georgia][COLOR=rgb(255, 0, 0)]2.09[/COLOR]. Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan[/COLOR][/FONT][/I][/SIZE][/CENTER]<br><br>" +
	          "[CENTER][COLOR=rgb(0, 255, 0)][SIZE=3][ICODE]Одобрено[/ICODE][/SIZE][/COLOR][/CENTER]<br>" +
	          '[CENTER][SIZE=3][I][FONT=times new roman]Приятной игры на BLACK RUSSIA [COLOR=rgb(170, 255, 255)][ICODE]ICE[/ICODE][/COLOR][/FONT][/I][/SIZE][/CENTER]',
	    prefix: ACCEPT_PREFIX,
	    status: false,
	},
	{
	    title: 'Аморал действия',
	    content: 
	          '[CENTER][COLOR=rgb(204, 0, 204)][SIZE=3][ICODE]Доброго времени суток, уважаемый {{ user.name }}[/ICODE][/SIZE][/COLOR][/CENTER]<br><br>' +
	          "[CENTER][SIZE=3][I][FONT=georgia]Нарушитель буден наказан по следующему пункту правил : [/FONT][FONT=georgia][COLOR=rgb(255, 0, 0)]2.08[/COLOR]. Запрещена любая форма аморальных действий сексуального характера в сторону игроков | [COLOR=rgb(255, 0, 0)]Jail 30 минут / Warn[/COLOR][/FONT][/I][/SIZE][/CENTER]<br><br>" +
	          "[CENTER][COLOR=rgb(0, 255, 0)][SIZE=3][ICODE]Одобрено[/ICODE][/SIZE][/COLOR][/CENTER]<br>" +
	          '[CENTER][SIZE=3][I][FONT=times new roman]Приятной игры на BLACK RUSSIA [COLOR=rgb(170, 255, 255)][ICODE]ICE[/ICODE][/COLOR][/FONT][/I][/SIZE][/CENTER]',
	    prefix: ACCEPT_PREFIX,
	    status: false,
	},
	{
	    title: 'ОСК',
	    content: 
	          '[CENTER][COLOR=rgb(204, 0, 204)][SIZE=3][ICODE]Доброго времени суток, уважаемый {{ user.name }}[/ICODE][/SIZE][/COLOR][/CENTER]<br><br>' +
	          "[CENTER][SIZE=3][I][FONT=georgia]Игрок будет наказан по данному пункту правил:[/FONT][FONT=georgia][COLOR=rgb(255, 0, 0)]3.07[/COLOR]. Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата | [COLOR=rgb(255, 0, 0)]Mute 30 минут[/COLOR][/FONT][/I][/SIZE][/CENTER]<br><br>" +
	          "[CENTER][COLOR=rgb(0, 255, 0)][SIZE=3][ICODE]Одобрено[/ICODE][/SIZE][/COLOR][/CENTER]<br>" +
	          '[CENTER][I][SIZE=3][FONT=times new roman]Приятной игры на BLACK RUSSIA [COLOR=rgb(170, 255, 255)][ICODE]ICE[/ICODE][/COLOR][/FONT][/SIZE][/I][/CENTER]',
	    prefix: ACCEPT_PREFIX,
	    status: false,
	},
	{      
        title: 'Flood',
        content:
              '[CENTER][SIZE=3][COLOR=rgb(204, 0, 204)][FONT=georgia][ICODE]Доброго времени суток, уважаемый {{ user.name }}[/ICODE][/FONT][/COLOR][/SIZE][/CENTER]<br><br>' +
              "[CENTER][SIZE=3][I][FONT=georgia]Нарушитель будет наказан по данному пункту правил: [COLOR=rgb(255, 0, 0)]3.05[/COLOR]. Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока | [COLOR=rgb(255, 0, 0)]Mute 30 минут.[/COLOR][/FONT][/I][/SIZE][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(0, 255, 0)][SIZE=3][ICODE]Одобрено[/ICODE][/SIZE][/COLOR][/CENTER]<br>" +
              '[CENTER][SIZE=3][I][FONT=georgia]Приятной игры на BLACK RUSSIA [COLOR=rgb(170, 255, 255)][ICODE]ICE[/ICODE][/COLOR][/FONT][/I][/SIZE][/CENTER]',
        prefix: ACCEPT_PREFIX,
	    status: false,
	},
	{
	    title: 'Масс дм',
	    content: 
	          '[CENTER][COLOR=rgb(119, 255, 255)][SIZE=3][ICODE]Доброго времени суток, уважаемый {{ user.name }}[/ICODE][/SIZE][/COLOR][/CENTER]<br><br>' +
	          "[CENTER][SIZE=3][B][I][FONT=georgia]Данный игрок получит наказание по пункту правил: [/FONT]<br>"+
              "[FONT=georgia][COLOR=rgb(255, 0, 0)]2.20[/COLOR]. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины более трем игрокам | [COLOR=rgb(255, 0, 0)]Warn / Ban 3 - 7[/COLOR][/FONT][/I][/B][/SIZE][COLOR=rgb(255, 0, 0)][SIZE=3][B][I][FONT=georgia]дней.[/FONT][/I][/B][/SIZE][/COLOR]<br><br>" +
              '[SIZE=3][B][I][FONT=georgia][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR][/FONT][/I][/B][/SIZE][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false,
	},
	{
	    title: 'Заблуждение (команды)',
	    content: 
	          '[CENTER][COLOR=rgb(204, 0, 204)][SIZE=3][ICODE]Доброго времени суток, уважаемый {{ user.name }}[/ICODE][/SIZE][/COLOR][/CENTER]<br><br>' +
	          "[CENTER][SIZE=3][I][FONT=georgia]Игрок будет наказан по данному пункту правил:[/FONT][FONT=georgia][COLOR=rgb(255, 0, 0)]3.11[/COLOR]. Запрещено введение игроков проекта в заблуждение путем злоупотребления командами | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan[/COLOR][/FONT][/I][/SIZE][/CENTER]<br><br>" +
              "[CENTER][SIZE=3][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/CENTER]<br>" +
              '[CENTER][SIZE=3][I][FONT=georgia]Приятной игры на BLACK RUSSIA [COLOR=rgb(170, 255, 255)][ICODE]ICE[/ICODE][/COLOR][/FONT][/I][/SIZE][/CENTER]',
        prefix: ACCEPT_PREFIX,
	    status: false,
	},
	{
	    title: 'IC и ООС конфликты',
	    content: 
	          '[CENTER][SIZE=3][B][COLOR=rgb(119, 255, 255)][ICODE]Доброго времени суток, уважаемый {{ user.name }}[/ICODE][/COLOR][/B][/SIZE][/CENTER]<br><br>' +
              "[CENTER][I][SIZE=3][FONT=georgia]Нарушитель будет наказан по данному пункту правил:<br>' + 2.35. На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате | Mute 120 минут / Ban 7 дней[/FONT][/SIZE][/I][/CENTER]<br><br>" +
              '[CENTER][SIZE=3][B][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/B][/SIZE][/CENTER]',
	    prefix: ACCEPT_PREFIX,
	    status: false,
	},
	{
	    title: 'ООС угрозы',
	    content: 
	          '[CENTER][SIZE=3][B][COLOR=rgb(119, 255, 255)][ICODE]Доброго времени суток, уважаемый {{ user.name }}[/ICODE][/COLOR][/B][/SIZE][/CENTER]<br><br>' +
              "[CENTER][SIZE=3][I][FONT=times new roman]Игрок будет наказан по данному пункту правил: [/FONT][FONT=times new roman]2.37. Запрещены OOC угрозы, в том числе и завуалированные | Mute 120 минут / Ban 7 дней[/FONT][/I][/SIZE][/CENTER]<br><br>" +
              '[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false,
	},
	{
	    title: 'ЕПП',
	    content: 
	          '[CENTER][SIZE=3][B][COLOR=rgb(119, 255, 255)][ICODE]Доброго времени суток, уважаемый {{ user.name }}[/ICODE][/COLOR][/B][/SIZE][/CENTER]<br><br>' +
              "[CENTER][SIZE=3][I][FONT=georgia]Игрок будет наказан по данному пункту правил: 2.46. Запрещено ездить по полям на любом транспорте | Jail 30 минут[/FONT][/I][/SIZE][/CENTER]<br><br>" +
              '[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false,
	},
	{
	    title: 'ЕПП (ФУРА/ИНКОС)',
	    content: 
	          '[CENTER][SIZE=3][B][COLOR=rgb(119, 255, 255)][ICODE]Доброго времени суток, уважаемый {{ user.name }}[/ICODE][/COLOR][/B][/SIZE][/CENTER]<br><br>' +
              "[CENTER][FONT=georgia][I]Нарушитель будет наказан по данному пункту правил: 2.47. Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) | Jail 60 минут[/I][/FONT][/CENTER]<br><br>" +
              '[CENTER][B][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/B][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false,
	},
    {
	    
	    title: 'Оск адм',
	    content: 
	          '[CENTER][COLOR=rgb(204, 0, 204)][SIZE=3][ICODE]Доброго времени суток, уважаемый {{ user.name }}[/ICODE][/SIZE][/COLOR][/CENTER]<br><br>' +
	          "[CENTER][SIZE=3][I][FONT=georgia]Игрок будет наказан по данному пункту правил: [/FONT][FONT=georgia][COLOR=rgb(255, 0, 0)]2.54[/COLOR]. Запрещено неуважительное обращение, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации | [COLOR=rgb(255, 0, 0)]Mute 180 минут[/COLOR][/FONT][/I][/SIZE][/CENTER]<br><br>" +
	          "[CENTER][COLOR=rgb(0, 255, 0)][SIZE=3][ICODE]Одобрено[/ICODE][/SIZE][/COLOR][/CENTER]<br>" +
	          '[CENTER][SIZE=3][I][FONT=georgia]Приятной игры на BLACK RUSSIA [COLOR=rgb(170, 255, 255)]ICE[/COLOR][/FONT][/I][/SIZE][/CENTER]',
	    prefix: ACCEPT_PREFIX,
	    status: false,
	},
	{
	    title: 'Арест в интерьере (аукцион/казино)',
	    content: 
	          '[CENTER][SIZE=3][B][COLOR=rgb(119, 255, 255)][ICODE]Доброго времени суток, уважаемый {{ user.name }}[/ICODE][/COLOR][/B][/SIZE][/CENTER]<br><br>' +
              "[CENTER][SIZE=3][I][FONT=times new roman]Нарушитель будет наказан по данному пункту правил: 2.50. Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий | Ban 7 - 15 дней + увольнение из организации[/FONT][/I][/SIZE][/CENTER]<br><br>" +
              '[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false,
	},
	{
	    title: 'Злоуп знаками',
	    content: 
	          '[CENTER][SIZE=3][B][COLOR=rgb(119, 255, 255)][ICODE]Доброго времени суток, уважаемый {{ user.name }}[/ICODE][/COLOR][/B][/SIZE][/CENTER]<br><br>' +
              "[CENTER][I][SIZE=4][FONT=georgia]Игрок будет наказан по данному пункту правил: 3.06. Запрещено злоупотребление знаков препинания и прочих символов | Mute 30 минут[/FONT][/SIZE][/I][/CENTER]<br><br>" +
              '[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false,
	},
	{
	   title: 'Слив',
	   content: 
	         '[CENTER][SIZE=3][B][COLOR=rgb(119, 255, 255)][ICODE]Доброго времени суток, уважаемый {{ user.name }}[/ICODE][/COLOR][/B][/SIZE][/CENTER]<br><br>' +
             "[CENTER][I][FONT=georgia]Игрок будет наказан по данному пункту правил: 3.08. Запрещены любые формы «слива» посредством использования глобальных чатов | PermBan[/FONT][/I][/CENTER]<br><br>" +
             '[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false,
	},
	{
	    title: 'Музыка в войсе',
	    content: 
	         '[CENTER][SIZE=3][B][COLOR=rgb(119, 255, 255)][ICODE]Доброго времени суток, уважаемый {{ user.name }}[/ICODE][/COLOR][/B][/SIZE][/CENTER]<br><br>' +
             "[CENTER][I][FONT=georgia]Игрок будет наказан по данному пункту правил: 3.14. Запрещено включать музыку в Voice Chat | Mute 60 минут.[/FONT][/I][/CENTER]<br><br>" +
             '[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false,
	},
	{
	    title: 'Оск род в войсе',
	    content: 
	         '[CENTER][SIZE=3][B][COLOR=rgb(119, 255, 255)][ICODE]Доброго времени суток, уважаемый {{ user.name }}[/ICODE][/COLOR][/B][/SIZE][/CENTER]<br><br>' +
             "[CENTER][I][FONT=georgia]Игрок будет наказан по данному пункту правил: 3.15. Запрещено оскорблять игроков или родных в Voice Chat | Mute 120 минут / Ban 7 - 15 дней[/FONT][/I][/CENTER]<br><br>" +
             '[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false,
	},
	{
	    title: 'Реклама промокоды',
	    content: 
	          '[CENTER][SIZE=3][B][COLOR=rgb(119, 255, 255)][ICODE]Доброго времени суток, уважаемый {{ user.name }}[/ICODE][/COLOR][/B][/SIZE][/CENTER]<br><br>' +
              "[CENTER][I][FONT=georgia]Игрок будет наказан по данному пункту правил: 3.21. Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. | Ban 30 дней[/FONT][/I][/CENTER]<br><br>" +
              '[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false,
	},
	{
	    
	    title: 'Сбив аним',
	    content: 
	          '[CENTER][COLOR=rgb(119, 255, 255)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый {{ user.name }}[/ICODE][/FONT][/COLOR][/CENTER]<br><br>' +
              "[CENTER][B][I][FONT=georgia]2.55. Запрещается багоюз связанный с анимацией в любых проявлениях. | Jail 60 / 120 минут[/FONT][/I][/B][/CENTER]<br><br>" +
              '[CENTER][B][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/B][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false,
	},
	{
	    title: 'Оск проекта',
	    content: 
	          '[CENTER][COLOR=rgb(204, 0, 204)][SIZE=3][ICODE]Доброго времени суток, уважаемый {{ user.name }}[/ICODE][/SIZE][/COLOR][/CENTER]<br><br>' +
	          "[CENTER][SIZE=3][I][FONT=georgia]Игрок будет наказан по данному пункту правил: [/FONT][FONT=georgia][COLOR=rgb(255, 0, 0)]2.40[/COLOR]. Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [COLOR=rgb(255, 0, 0)]|Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором)[/COLOR][/FONT][/I][/SIZE][/CENTER]<br><br>" +
	          "[CENTER][COLOR=rgb(0, 255, 0)][SIZE=3][ICODE]Одобрено[/ICODE][/SIZE][/COLOR][/CENTER]<br>" +
	          '[CENTER][SIZE=3][I][FONT=georgia]Приятной игры на BLACK RUSSIA [COLOR=rgb(170, 255, 255)][ICODE]ICE[/ICODE][/COLOR][/FONT][/I][/SIZE][/CENTER]',
	    prefix: ACCEPT_PREFIX,
	    status: false,
	},
	{
	    title: 'Nrp поведение',
	    content: 
	          '[CENTER][COLOR=rgb(204, 0, 204)][SIZE=3][ICODE]Доброго времени суток, уважаемый {{ user.name }}[/ICODE][/SIZE][/COLOR][/CENTER]<br><br>' +
	          "[CENTER][SIZE=3][I][FONT=georgia]Игрок будет наказан по данному пункту правил: [/FONT][FONT=georgia][COLOR=rgb(255, 0, 0)]2.01[/COLOR] Запрещено поведение, нарушающее нормы процессов Role Play режима игры | [COLOR=rgb(255, 0, 0)]Jail 30 минут.[/COLOR][/FONT][/I][/SIZE][/CENTER]<br><br>" +
	          "[CENTER][COLOR=rgb(0, 255, 0)][SIZE=3][ICODE]Одобрено[/ICODE][/SIZE][/COLOR][/CENTER]<br>" +
	          '[CENTER][SIZE=3][I][FONT=georgia]Приятной игры на BLACK RUSSIA [COLOR=rgb(170, 255, 255)]ICE[/COLOR][/FONT][/I][/SIZE][/CENTER]',
	    prefix: ACCEPT_PREFIX,
	    status: false,
	},
	{
	    title: 'Транслит',
	    content: 
	          '[CENTER][COLOR=rgb(204, 0, 204)][SIZE=3][ICODE]Доброго времени суток, уважаемый {{ user.name }}[/ICODE][/SIZE][/COLOR][/CENTER]<br><br>' +
	          "[CENTER][SIZE=3][I][FONT=times new roman]Игрок будет наказан по данному пункту правил: [/FONT][FONT=times new roman][COLOR=rgb(255, 0, 0)]3.20[/COLOR]. Запрещено использование транслита в любом из чатов | [COLOR=rgb(255, 0, 0)]Mute 30 минут[/COLOR][/FONT][/I][/SIZE][/CENTER]<br><br>" +
	          "[CENTER][COLOR=rgb(0, 255, 0)][SIZE=3][ICODE]Одобрено[/ICODE][/SIZE][/COLOR][/CENTER]<br>" +
	          '[CENTER][SIZE=3][I][FONT=georgia]Приятной игры на BLACK RUSSIA [COLOR=rgb(170, 255, 255)]ICE[/COLOR][/FONT][/I][/SIZE][/CENTER]',
	    prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	    title: 'Обход системы',
	    content: 
	          '[CENTER][COLOR=rgb(204, 0, 204)][SIZE=3][ICODE]Доброго времени суток, уважаемый {{ user.name }}[/ICODE][/SIZE][/COLOR][/CENTER]<br><br>' +
	          "[CENTER][SIZE=3][I][FONT=georgia]Нарушитель будет наказан по следующему пункту регламента:[/FONT][FONT=georgia][COLOR=rgb(255, 0, 0)]2.21[/COLOR]. Запрещено пытаться обходить игровую систему или использовать любые баги сервера | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan[/COLOR][/FONT][/I][/SIZE][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(0, 255, 0)][SIZE=3][ICODE]Одобрено[/ICODE][/SIZE][/COLOR][/CENTER]<br>" +
              '[CENTER][SIZE=3][I][FONT=georgia]Приятной игры на BLACK RUSSIA [COLOR=rgb(170, 255, 255)]ICE[/COLOR][/FONT][/I][/SIZE][/CENTER]',
        prefix: ACCEPT_PREFIX,
	    status: false,
	},
	{
	    title: '________________________________________________________________Отказ на жб__________________________________________________',
    },
    {
        title: 'Не по форме',
        content: 
              '[CENTER][COLOR=rgb(204, 0, 204)][SIZE=3][ICODE]Доброго времени суток, уважаемый {{ user.name }}[/ICODE][/SIZE][/COLOR][/CENTER]<br><br>' +
              "[CENTER][SIZE=3][I][FONT=georgia]Ваша жалоба составлена [U]не по форме[/U]. Внимательно прочитайте правила подачи жалоб на игроков, закрепленные в этом разделе.[/FONT][/I][/SIZE][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][SIZE=3][ICODE]Отказано[/ICODE][/SIZE][/COLOR][/CENTER]<br>" +
              '[CENTER][SIZE=3][I][FONT=georgia]Приятной игры на BLACK RUSSIA [COLOR=rgb(170, 255, 255)][ICODE]ICE[/ICODE][/COLOR][/FONT][/I][/SIZE][/CENTER]',
        prefix: UNACCСEPT_PREFIX,
        status: false,
    },
    {
        title: 'Мало Доказательства',
        content: 
              '[CENTER][COLOR=rgb(204, 0, 204)][SIZE=3][ICODE]Доброго времени суток, уважаемый {{ user.name }}[/ICODE][/SIZE][/COLOR][/CENTER]<br><br>' +
              "[CENTER][SIZE=3][I][FONT=georgia]Недостаточно доказательств для корректного рассмотрения вашей жалобы.[/FONT][/I][/SIZE][/CENTER]<br><br>" +
              "[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][ICODE]Отказано[/ICODE][/COLOR][/SIZE][/CENTER]<br>" +
              '[CENTER][SIZE=3][I][FONT=georgia]Приятной игры на BLACK RUSSIA [COLOR=rgb(170, 255, 255)][ICODE]ICE[/ICODE][/COLOR][/FONT][/I][/SIZE][/CENTER]',
        prefix: UNACCСEPT_PREFIX,
        status: false,
    },
    {
        title: 'Отсутствует доказательства',
        content:
              '[CENTER][COLOR=rgb(204, 0, 204)][SIZE=3][ICODE]Доброго времени суток, уважаемый {{ user.name }}[/ICODE][/SIZE][/COLOR][/CENTER]<br><br>' +
              "[CENTER][I][SIZE=3][FONT=georgia]Отсутствуют доказательства - следовательно, рассмотрению не подлежит. Загрузите доказательства на фото-видео хостинги [U]YouTube, Imgur, Yapx [/U]и так далее.[/FONT][/SIZE][/I][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][SIZE=3][ICODE]Отказано[/ICODE][/SIZE][/COLOR][/CENTER]<br>" +
              '[CENTER][SIZE=3][I][FONT=georgia]Приятной игры на BLACK RUSSIA [COLOR=rgb(170, 255, 255)][ICODE]ICE[/ICODE][/COLOR][/FONT][/I][/SIZE][/CENTER]',
        prefix: UNACCСEPT_PREFIX,
        status: false,
    },
    {
        title: 'Доказательства в соц-сетях',
        content: 
              '[CENTER][COLOR=rgb(204, 0, 204)][SIZE=3][ICODE]Доброго времени суток, уважаемый {{ user.name }}[/ICODE][/SIZE][/COLOR][/CENTER]<br><br>' +
              "[CENTER][SIZE=3][I][FONT=georgia]Доказательства в социальных сетях и т.д. не принимаются. Загрузите доказательства на фото-видео хостинги [U]YouTube,Imgur, Yapx[/U] и так далее.[/FONT][/I][/SIZE][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][SIZE=3][FONT=tahoma][ICODE]Отказано[/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br>" +
              '[CENTER][I][SIZE=3][FONT=georgia]Приятной игры на BLACK RUSSIA [COLOR=rgb(170, 255, 255)][ICODE]ICE[/ICODE][/COLOR][/FONT][/SIZE][/I][/CENTER]',
        prefix: UNACCСEPT_PREFIX,
        status: false,
    },
    {
        title: 'Нет нарушении',
        content: 
              '[CENTER][COLOR=rgb(204, 0, 204)][SIZE=3][ICODE]Доброго времени суток, уважаемый {{ user.name }}[/ICODE][/SIZE][/COLOR][/CENTER]<br><br>' +
              "[CENTER][SIZE=3][I][FONT=georgia]Нарушений со стороны игрока не было замечено.[/FONT][/I][/SIZE][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][SIZE=3][ICODE]Отказано[/ICODE][/SIZE][/COLOR][/CENTER]<br><br>" +
              '[CENTER][FONT=georgia][I][SIZE=3]Приятной игры на BLACK RUSSIA [COLOR=rgb(170, 255, 255)][ICODE]ICE[/ICODE][/COLOR][/SIZE][/I][/FONT][/CENTER]',
        prefix: UNACCСEPT_PREFIX,
        status: false,
    },
    {
        title: 'Уже наказан',
        content: 
             '[CENTER][SIZE=3][B][COLOR=rgb(119, 255, 255)][ICODE]Доброго времени суток, уважаемый {{ user.name }}[/ICODE][/COLOR][/B][/SIZE][/CENTER]<br><br>' +
             "[CENTER][I][FONT=georgia]Нарушитель уже наказан.[/FONT][/I][/CENTER]<br><br>" +
             '[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано[/ICODE][/COLOR][/CENTER]',
        prefix: UNACCСEPT_PREFIX,
        status: false,
    },
    {
        title: 'Был дан ответ',
        content:
             '[CENTER][SIZE=3][B][COLOR=rgb(119, 255, 255)][ICODE]Доброго времени суток, уважаемый {{ user.name }}[/ICODE][/COLOR][/B][/SIZE][/CENTER]<br><br>' +
             "[CENTER][FONT=georgia][I]Ответ на вашу жалобу уже был дан ранее, прекратите дублировать жалобы, либо ваш форумный аккаунт будет заблокирован.[/I][/FONT][/CENTER]<br><br>" +
             '[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано[/ICODE][/COLOR][/CENTER]',
        prefix: UNACCСEPT_PREFIX,
        status: false,
    },
    {
        
        title: 'Нет /time',
        content: 
              '[CENTER][COLOR=rgb(204, 0, 204)][SIZE=3][ICODE]Доброго времени суток, уважаемый {{ user.name }}[/ICODE][/SIZE][/COLOR][/CENTER]<br><br>' +
              "[CENTER][FONT=times new roman][COLOR=#cc00cc][SIZE=3][I][COLOR=rgb(255, 255, 255)]На доказательствах отсутствуют дата и время [U](/time)[/U] - следовательно, рассмотрению не подлежить.[/COLOR][/I][/SIZE][/COLOR][/FONT][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][SIZE=3][ICODE]Отказано[/ICODE][/SIZE][/COLOR][/CENTER]<br>" +
              '[CENTER][SIZE=3][I][FONT=georgia]Приятной игры на BLACK RUSSIA [COLOR=rgb(170, 255, 255)]ICE[/COLOR][/FONT][/I][/SIZE][/CENTER]',
        prefix: UNACCСEPT_PREFIX,
        status: false,
    },
    {
        title: 'Доказательства обрывается',
        content: 
              '[CENTER][COLOR=rgb(204, 0, 204)][SIZE=3][ICODE]Доброго времени суток, уважаемый {{ user.name }}[/ICODE][/SIZE][/COLOR][/CENTER]<br><br>' +
              "[CENTER][I][SIZE=3][FONT=georgia]Ваша видеозапись обрывается. Загрузите полную видеозапись на видео-хостинг [U]YouTube[/U].[/FONT][/SIZE][/I][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][SIZE=3][ICODE]Отказано[/ICODE][/SIZE][/COLOR][/CENTER]<br>" +
              '[CENTER][SIZE=3][I][FONT=georgia]Приятной игры на BLACK RUSSIA [COLOR=rgb(170, 255, 255)][ICODE]ICE[/ICODE][/COLOR][/FONT][/I][/SIZE][/CENTER]',
        prefix: UNACCСEPT_PREFIX,
        status: false,
    },
    {
        title: 'Нужен TimeCode',
        content: 
              '[CENTER][COLOR=rgb(204, 0, 204)][SIZE=3][ICODE]Доброго времени суток, уважаемый {{ user.name }}[/ICODE][/SIZE][/COLOR][/CENTER]<br><br>' +
              "[CENTER][SIZE=3][I][FONT=georgia]Ваша жалоба отказана, т.к в ней нету таймкодов. Если видео длится больше 3-ех минут - Вы должны указать таймкоды нарушений.[/FONT][/I][/SIZE][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][SIZE=3][FONT=arial][ICODE]Отказано[/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br>" +
              '[CENTER][SIZE=3][I][FONT=georgia]Приятной игры на BLACK RUSSIA [COLOR=rgb(170, 255, 255)][ICODE]ICE[/ICODE][/COLOR][/FONT][/I][/SIZE][/CENTER]',
        prefix: UNACCСEPT_PREFIX,
        status: false,
    },
    {
        title: 'Более 72 часов',
        content: 
              '[CENTER][COLOR=rgb(204, 0, 204)][SIZE=3][ICODE]Доброго времени суток, уважаемый {{ user.name }}[/ICODE][/SIZE][/COLOR][/CENTER]<br><br>' +
              "[CENTER][SIZE=3][I][FONT=georgia]Ваша жалоба отказана, т.к с момента нарушения прошло более 72-ух часов.[/FONT][/I][/SIZE][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][SIZE=3][ICODE]Отказано[/ICODE][/SIZE][/COLOR][/CENTER]<br>" +
              '[CENTER][I][SIZE=3][FONT=georgia]Приятной игры на BLACK RUSSIA [COLOR=rgb(170, 255, 255)][ICODE]ICE[/ICODE][/COLOR][/FONT][/SIZE][/I][/CENTER]',
        prefix: UNACCСEPT_PREFIX,
        status: false,
    },
    {
        title: 'Нужен фрапс',
        content: 
              '[CENTER][COLOR=rgb(204, 0, 204)][SIZE=3][ICODE]Доброго времени суток, уважаемый {{ user.name }}[/ICODE][/SIZE][/COLOR][/CENTER]<br><br>' +
              "[CENTER][SIZE=3][I][FONT=georgia]В данном случае нужен фрапс но скриншота тут недостаточно.[/FONT][/I][/SIZE][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][SIZE=3][ICODE]Отказано[/ICODE][/SIZE][/COLOR][/CENTER]<br>" +
              '[CENTER][SIZE=3][I][FONT=georgia]Приятной игры на BLACK RUSSIA [COLOR=rgb(170, 255, 255)][ICODE]ICE[/ICODE][/COLOR][/FONT][/I][/SIZE][/CENTER]',
        prefix: UNACCСEPT_PREFIX,
        status: false,
    },
    {      
        title: ' Нет условия сделки',
        content: 
             '[CENTER][COLOR=rgb(204, 0, 204)][SIZE=3][ICODE]Доброго времени суток, уважаемый {{ user.name }}[/ICODE][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][SIZE=3][I][FONT=georgia]В данных доказательствах отсутствуют условия сделки[/FONT][/I][/SIZE][/CENTER]<br><br>" +
             "[CENTER][COLOR=rgb(255, 0, 0)][SIZE=3][ICODE]Отказано[/ICODE][/SIZE][/COLOR][/CENTER]<br>" +
             '[CENTER][SIZE=3][I][FONT=georgia]Приятной игры на BLACK RUSSIA [COLOR=rgb(170, 255, 255)][ICODE]ICE[/ICODE][/COLOR][/FONT][/I][/SIZE][/CENTER]',
         prefix: UNACCСEPT_PREFIX,
         status: false,    
    },
    {
        title: '________________________________________________________________Раздел биографии_______________________________________________________',
    },
    {
        title: 'Биография одобрено',
        content:
              '[CENTER][COLOR=rgb(204, 0, 204)][SIZE=3][B]Доброго времени суток, уважаемый {{ user.name }}[/B][/SIZE][/COLOR][/CENTER]<br><br>' +
              "[CENTER][SIZE=3][B]Ваша рп биография [COLOR=rgb(0, 255, 0)][ICODE]одобрено.[/ICODE][/COLOR]<br><br>" +
              '[COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/B][/SIZE][/CENTER]',
        prefix: ACCEPT_PREFIX,
	    status: false,
	},
	{
	    title: 'Биография отказано',
	    content: 
	         '[CENTER][SIZE=3][B][COLOR=rgb(204, 0, 204)]Доброго времени суток, уважаемый {{ user.name }}[/COLOR][/B][/SIZE][/CENTER]<br><br>' +
	         "[CENTER][B][SIZE=3]Ваша рп биография [COLOR=rgb(255, 0, 0)][ICODE]отказано.[/ICODE][/COLOR][/SIZE]<br><br>" +
             '[COLOR=rgb(255, 0, 0)][SIZE=3]Закрыто[/SIZE][/COLOR][/B][/CENTER]',
        prefix: UNACCСEPT_PREFIX,
        status: false,
    },
    {
        title: 'Заголовок не по форме',
        content: 
              '[CENTER][SIZE=3][B][COLOR=rgb(204, 0, 204)]Доброго времени суток, уважаемый {{ user.name }}[/COLOR][/B][/SIZE][/CENTER]<br><br>' +
              "[CENTER][SIZE=3][B]Ваша рп биография [COLOR=rgb(255, 0, 0)][ICODE]отказано.[/ICODE][/COLOR][/B][/SIZE][/CENTER]<br><br>" +
              "[CENTER][SIZE=3][B]Причиной тому послужило неправильное оформление заголовка.[/B][/SIZE][/CENTER]<br><br>" +
              '[CENTER][COLOR=rgb(255, 0, 0)][B][SIZE=3]Закрыто[/SIZE][/B][/COLOR][/CENTER]',
              prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
       title: 'Не по форме',
       content: 
             '[CENTER][SIZE=3][B][COLOR=rgb(204, 0, 204)]Доброго времени суток, уважаемый {{ user.name }}[/COLOR][/B][/SIZE][/CENTER]<br><br>' +
             "[CENTER][B][SIZE=3]Ваша рп биография [COLOR=rgb(255, 0, 0)][ICODE]отказано.[/ICODE][/COLOR][/SIZE][/B][/CENTER]<br><br>" +
             "[CENTER][SIZE=3][B]Причиной тому послужило составлена не по форме.[/B][/SIZE][/CENTER]<br><br>" +
             '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3]Закрыто[/SIZE][/COLOR][/B][/CENTER]',
        prefix: UNACCСEPT_PREFIX,
	    status: false,
},
{ 
        title: 'Неправильная дата',
        content: 
              '[CENTER][SIZE=3][B][COLOR=rgb(204, 0, 204)]Доброго времени суток, уважаемый {{ user.name }}[/COLOR][/B][/SIZE][/CENTER]<br><br>' +
              "[CENTER][SIZE=3][B]Ваша рп биография [COLOR=rgb(255, 0, 0)][ICODE]отказано[/ICODE][/COLOR][/B][/SIZE][/CENTER]<br><br>" +
              "[CENTER][SIZE=3][B]Причиной тому послужила не правильно написанная дата рождения.[/B] [/SIZE][/CENTER]<br><br>" +
              '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3]Закрыто[/SIZE][/COLOR][/B][/CENTER]',
        prefix: UNACCСEPT_PREFIX,
	    status: false,      
    },
    {
        title: 'Возраст не совпадает',
        content: 
              '[CENTER][SIZE=3][B][COLOR=rgb(204, 0, 204)]Доброго времени суток, уважаемый {{ user.name }}[/COLOR][/B][/SIZE][/CENTER]<br><br>' +
              "[CENTER][FONT=tahoma][B][SIZE=3]Ваша рп биография [COLOR=rgb(255, 0, 0)][ICODE]отказано.[/ICODE][/COLOR][/SIZE][/B][/FONT][/CENTER]<br><br>" +
              "[CENTER][SIZE=3][B]Причиной тому послужила не совпадающая дата рождения с возрастом.[/B][/SIZE][/CENTER]<br><br>" +
              '[CENTER][SIZE=3][B][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/B][/SIZE][/CENTER]',
       prefix: UNACCСEPT_PREFIX,
	    status: false,
},
{
        title: 'Юность начинается с 13 лет.',
        content:
              '[CENTER][SIZE=3][B][COLOR=rgb(204, 0, 204)]Доброго времени суток, уважаемый {{ user.name }}[/COLOR][/B][/SIZE][/CENTER]<br><br>' +
              "[CENTER][SIZE=3][B]Ваша рп биография [COLOR=rgb(255, 0, 0)][ICODE]отказано.[/ICODE][/COLOR][/B][/SIZE][/CENTER]<br><br>" +
              "[CENTER][SIZE=3][B]Причиной тому послужила юность начинается с 13 лет.[/B][/SIZE][/CENTER]<br><br>" +
              '[CENTER][B][SIZE=3][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/SIZE][/B][/CENTER]',
        prefix: UNACCСEPT_PREFIX,
	    status: false,
},
{
        title: 'Детство до 13',
        content:
              '[CENTER][SIZE=3][B][COLOR=rgb(204, 0, 204)]Доброго времени суток, уважаемый {{ user.name }}[/COLOR][/B][/SIZE][/CENTER]<br><br>' +
              "[CENTER][B][SIZE=3]Ваша рп биография [COLOR=rgb(255, 0, 0)][ICODE]отказано.[/ICODE][/COLOR][/SIZE][/B][/CENTER]<br><br>" +
              "[CENTER][SIZE=3][B]Причиной тому послужило детство проходит до 13 лет.[/B][/SIZE][/CENTER]<br><br>" +
              '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3][ICODE]Закрыто[/ICODE][/SIZE][/COLOR][/B][/CENTER]',
        prefix: UNACCСEPT_PREFIX,
	    status: false,
},
{
        title: 'Копипаст',
        content: 
              '[CENTER][SIZE=3][B][COLOR=rgb(204, 0, 204)]Доброго времени суток, уважаемый {{ user.name }}[/COLOR][/B][/SIZE][/CENTER]<br><br>' +
              "[CENTER][SIZE=3][B]Ваша рп биография [/B][COLOR=rgb(255, 0, 0)][B][ICODE]отказано[/ICODE][/B][/COLOR][/SIZE][/CENTER]<br><br>" +
              "[CENTER][SIZE=3][B]Причиной тому послужило полное или частичное копирование биографий из данного раздела или из разделов RP биографий других серверов.[/B][/SIZE][/CENTER]<br><br>" +
              '[CENTER][B][SIZE=3][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/SIZE][/B][/CENTER]',
        prefix: UNACCСEPT_PREFIX,
	    status: false,      
     },
     {
         title: '____________________________________________________Раздел рп ситуации__________________________________________',
     },
     {
         title: 'Рп ситуация одобрено',
         content: 
               '[CENTER][COLOR=rgb(119, 255, 255)][SIZE=3][ICODE]Доброго времени суток, уважаемый {{ user.name }}[/ICODE][/SIZE][/COLOR][/CENTER]<br><br>' +
               "[CENTER][B][SIZE=3]Ваша RolePlay - ситуация [COLOR=rgb(255, 0, 0)][ICODE]отказано.[/ICODE][/COLOR][/SIZE][/B]<br><br>" +
               "[SIZE=3][B]Внимательно прочитайте правила создания RP - ситуаций, закрепленные в данном разделе.[/B][/SIZE]<br><br>" +
               '[B][COLOR=rgb(255, 0, 0)][SIZE=3]Закрыто[/SIZE][/COLOR][/B][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false, 
     },
     {
         title: 'Рп ситуация отказано',
         content: 
               '[CENTER][COLOR=rgb(119, 255, 255)][SIZE=3][ICODE]Доброго времени суток, уважаемый {{ user.name }}[/ICODE][/SIZE][/COLOR][/CENTER]<br><br>' +
               "[CENTER][SIZE=3][B]Ваша RolePlay - ситуация [COLOR=rgb(0, 255, 0)][ICODE]одобрена.[/ICODE][/COLOR]<br><br>" +
               '[COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/B][/SIZE][/CENTER]',
        prefix: UNACCСEPT_PREFIX,
        status: false, 
     },
     {
         title: 'Не туда',
         content: 
               '[CENTER][COLOR=rgb(119, 255, 255)][SIZE=3][ICODE]Доброго времени суток, уважаемый {{ user.name }}[/ICODE][/SIZE][/COLOR][/CENTER]<br><br>' +
               "[CENTER][SIZE=3][B][I][FONT=georgia]Ваша RolePlay  ситуация[/FONT][/I] [COLOR=rgb(255, 0, 0)][ICODE]отказана[/ICODE] [/COLOR] [I][FONT=georgia]т.к вы не туда попали.[/FONT][/I]<br><br>" +
               '[COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/B][/SIZE][/CENTER]',
        prefix: UNACCСEPT_PREFIX,
        status: false,
     },
     {
         title: 'Не по форме',
         content:
             '[CENTER][COLOR=rgb(119, 255, 255)][SIZE=3][ICODE]Доброго времени суток, уважаемый {{ user.name }}[/ICODE][/SIZE][/COLOR][/CENTER]<br><br>' + 
             "[CENTER][SIZE=3][B]Ваша RolePlay ситуация [COLOR=rgb(255, 0, 0)]отказано.[/COLOR][/B][/SIZE]<br><br>" +
             "[B][SIZE=3]Причина: составлено не по форме.[/SIZE][/B]<br><br>" +
             '[SIZE=3][B][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/B][/SIZE][/CENTER]',
        prefix: UNACCСEPT_PREFIX,
        status: false,
     },
     {
         title: '___________________________________________________________RolePlay Организации_______________________________________________________',
     },
     {
        
        title: 'Организация одобрено',
        content:
               '[CENTER][COLOR=rgb(119, 255, 255)][SIZE=3][ICODE]Доброго времени суток, уважаемый {{ user.name }}[/ICODE][/SIZE][/COLOR][/CENTER]<br><br>' +
               "[CENTER][SIZE=3][B]Ваша RolePlay  организация [COLOR=rgb(0, 255, 0)]одобрена.[/COLOR][/B][/SIZE]<br><br>" +
               '[B][COLOR=rgb(255, 0, 0)][SIZE=3]Закрыто[/SIZE][/COLOR][/B][/CENTER]',
       prefix: ACCEPT_PREFIX,
       status: false,
     },
     {
         title: 'Организация отказано',
         content:
               '[CENTER][COLOR=rgb(119, 255, 255)][SIZE=3][ICODE]Доброго времени суток, уважаемый {{ user.name }}[/ICODE][/SIZE][/COLOR][/CENTER]<br><br>' +
               "[CENTER][B][SIZE=3]Ваша RolePlay организация [/SIZE][/B][COLOR=rgb(255, 0, 0)][B][SIZE=3]отказано.[/SIZE][/B][/COLOR]<br><br>" +
               '[SIZE=3][B][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/B][/SIZE][/CENTER]',
        prefix: UNACCСEPT_PREFIX,
        status: false
     },

];
 
 $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
    // Добавление кнопок при загрузке страницы
    addButton('На рассмотрение', 'pin');
    addButton('Одобрено', 'accepted');
    addButton ('Отказано', 'unaccept');
    addButton('Закрыто', 'close');
    addButton('Click me', 'selectAnswer');
 
 
    // Поиск информации о теме
    const threadData = getThreadData();
 
     $('button#unaccept').click(() => editThreadData(OTKAZRP_PREFIX, true));
    $('button#pin').click(() => editThreadData(PINN_PREFIX, true));
    $('button#close').click(() => editThreadData(CLOSE_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ODOBRENORP_PREFIX, true));
 
 
 
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
