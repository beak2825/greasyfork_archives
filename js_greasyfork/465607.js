// ==UserScript==
// @name         Forum Curator Script | Green
// @namespace    https://forum.blackrussia.online
// @version      1.2
// @description  Данный скрипт создан для помощи в закрытии жалоб на форуме. Предложения по улучшению писать сюда: https://vk.com/id494383766
// @author       D. Merphy
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @grant        none
// @license    MIT
// @collaborator
// @icon https://i.yapx.ru/V0IwZ.png
// @downloadURL https://update.greasyfork.org/scripts/465607/Forum%20Curator%20Script%20%7C%20Green.user.js
// @updateURL https://update.greasyfork.org/scripts/465607/Forum%20Curator%20Script%20%7C%20Green.meta.js
// ==/UserScript==

(function () {
  'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const CLOSE_PREFIX = 7;
const TEXY_PREFIX = 13;
const buttons = [
    {
      title: 'приветствие',
      content: '[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>',
    },
     {
         title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ  Правила Role Play процесса ᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ',
	},
    {
              title: 'nonrp поведение',
      content:
		'[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br> 2.01. Запрещено поведение, нарушающее нормы процессов Role Play режима игры | Jail 30 минут [COLOR=rgb(255, 0, 0)]| Jail 30 минут [/COLOR][/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], закрыто. [/CENTER][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'SK',
      content:
		'[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>2.16. Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них [COLOR=rgb(255, 0, 0)]| Jail 60 минут / Warn (за два и более убийства) [/COLOR][/CENTER]<br><br>" +
		'[CENTER][I][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'TK',
      content:
		'[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>2.15.Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины [COLOR=rgb(255, 0, 0)]| Jail 60 минут / Warn (за два и более убийства) [/COLOR][/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR][/COLOR], закрыто.[/CENTER][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
          },
          {
      title: 'DM',
      content:
		'[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>2.19. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [COLOR=rgb(255, 0, 0)]| Jail 60 минут [/COLOR][/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], закрыто.[/CENTER][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'DB',
      content:
		'[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>2.13. Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [COLOR=rgb(255, 0, 0)]| Jail 60 минут [/COLOR][/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], закрыто.[/CENTER][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Масс ДМ',

      content:
		'[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>2.20. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины более трем игрокам [COLOR=rgb(255, 0, 0)]| Warn / Ban 3 - 7 дней [/COLOR][/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], закрыто.[/CENTER][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
                title: 'сбив/багоюз аним',
      content:
        '[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>2.55. Запрещается багоюз связанный с анимацией в любых проявлениях. [COLOR=rgb(255, 0, 0)] | Jail 60 / 120 минут [/COLOR][/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], закрыто.[/CENTER][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
   },
   {
              title: 'nonrp обман',
      content:
		'[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>2.05. Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [COLOR=rgb(255, 0, 0)] | PermBan [/COLOR][/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], закрыто.[/CENTER][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
              title: 'Уход от РП',
      content:
		'[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>2.02. Запрещено целенаправленно уходить от Role Play процесса всеразличными способами [COLOR=rgb(255, 0, 0)] | Jail 30 минут / Warn [/COLOR][/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], закрыто.[/CENTER][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
              title: 'ГОСС подработка',
      content:
		'[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>1.07. Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, принадлежащей своей фракции [COLOR=rgb(255, 0, 0)]| Jail 30 минут [/COLOR][/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], закрыто. [/CENTER][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'слив склада',
      content:
		'[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>2.09. Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле[COLOR=rgb(255, 0, 0)]| Ban 15 - 30 дней / PermBan [/COLOR][/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], закрыто.[/CENTER][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Оск адм',
      content:
		'[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [COLOR=rgb(255, 0, 0)]| Mute 180 минут [/COLOR][/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], закрыто.[/CENTER][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Обман адм',
      content:
		'[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>2.32. Запрещено введение в заблуждение, обман, неконструктивная критика администрации на всех ресурсах проекта [COLOR=rgb(255, 0, 0)]| Ban 7 - 15 дней / PermBan [/COLOR][/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], закрыто.[/CENTER][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Читы/по',
      content:
        '[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
         "[CENTER]Игрок будет наказан по данному пункту правил:<br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [COLOR=rgb(255, 0, 0)]| Ban 15 - 30 дней / PermBan [/COLOR][/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], закрыто.[/CENTER][/FONT]',
         prefix: ACCEPT_PREFIX,
	  status: false,
   },
   {
        title: 'Оскорбление проекта',
      content:
        '[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>2.40. Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [COLOR=rgb(255, 0, 0)]| Mute 300 минут / Ban 30 дней  (Ban выдается по согласованию с главным администратором) [/COLOR][/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], закрыто.[/CENTER][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
   },
   {
        title: 'НонРП вождение',
      content:
     '[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
     "[CENTER]Игрок будет наказан по данному пункту правил:<br>2.03. Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере [COLOR=rgb(255, 0, 0)]| Jail 30 минут [/COLOR][/CENTER]<br><br>" +
     '[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], закрыто.[/CENTER][/FONT]',
      prefix: ACCEPT_PREFIX,
 	  status: false,
   },
   {
        title: 'Взломан',
      content: '[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
   "[CENTER]Игрок будет наказан по данному пункту правил:<br>4.03. Запрещена совершенно любая передача игровых аккаунтов третьим лицам [Color=#E25041]| PermBan [/COLOR][/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], закрыто.[/CENTER][/FONT]',
         prefix: ACCEPT_PREFIX,
       status: false,
    },
    {
                title: 'NRP вч',
      content: '[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
   "[CENTER]Игрок будет наказан по данному пункту правил:<br>За нарушение правил нападения на Войсковую Часть выдаётся предупреждение[Color=#E25041]| Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ)[/COLOR][/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], закрыто.[/CENTER][/FONT]',
         prefix: ACCEPT_PREFIX,
       status: false,
    },
    {
        title: 'Фейк',
      content: '[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
   "[CENTER]Игрок будет наказан по данному пункту правил:<br>4.10. Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию [COLOR=rgb(255, 0, 0)]| Устное замечание + смена игрового никнейма / PermBan [/COLOR][/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], закрыто.[/CENTER][/FONT]',
         prefix: ACCEPT_PREFIX,
       status: false,

    },
    {
         title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ  Игровые Чаты ᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ',
	},
    {
         title: 'Упоминание родни',
      content:
		'[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>3.04. Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [COLOR=rgb(255, 0, 0)]| Mute 120 минут / Ban 7 - 15 дней [/COLOR][/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], закрыто.[/CENTER][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
     title: 'Оск',
      content:
		'[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>3.03. Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены [COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR][/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], закрыто.[/CENTER][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
     title: 'MG',
      content:
		'[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>2.18. Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [COLOR=rgb(255, 0, 0)]| Mute 30 минут [/COLOR][/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], закрыто.[/CENTER][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Caps',
	  content:
		'[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
		"[CENTER]Игрок будет наказан по данному пункту правил:<br>3.02. Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате [COLOR=rgb(255, 0, 0)]| Mute 30 минут [/COLOR][/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], закрыто.[/CENTER][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
     },
     {
      title: 'Flood',
	  content:
		'[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
		"[CENTER]Игрок будет наказан по данному пункту правил:<br>3.05. Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [COLOR=rgb(255, 0, 0)]| Mute 30 минут [/COLOR][/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], закрыто.[/CENTER][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
	    },
        {
                    title: 'Торговля в больнице',
      content: '[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
  "[CENTER]Игрок будет наказан по данному пункту правил:<br>3.22. Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) [COLOR=rgb(255, 0, 0)]| Mute 30 минут [/COLOR][/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], закрыто.[/CENTER][/FONT]',
         prefix: ACCEPT_PREFIX,
       status: false,
  },
  {
                          title: 'Злоуп символами',
      content: '[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
  "[CENTER]Игрок будет наказан по данному пункту правил:<br>3.06. Запрещено злоупотребление знаков препинания и прочих символов [COLOR=rgb(255, 0, 0)]| Mute 30 минут [/COLOR][/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], закрыто.[/CENTER][/FONT]',
         prefix: ACCEPT_PREFIX,
       status: false,
  },
  {
                            title: 'Слив СМИ/Чата',
      content: '[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
  "[CENTER]Игрок будет наказан по данному пункту правил:<br>3.08. Запрещены любые формы «слива» посредством использования глобальных чатов [COLOR=rgb(255, 0, 0)]| Permban [/COLOR][/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], закрыто.[/CENTER][/FONT]',
         prefix: ACCEPT_PREFIX,
       status: false,
  },
  {
              title: 'Реклама',
      content: '[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
   "[CENTER]Игрок будет наказан по данному пункту правил:<br>2.31. Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное [COLOR=rgb(255, 0, 0)]| Ban 7 дней / PermBan [/COLOR][/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], закрыто.[/CENTER][/FONT]',
         prefix: ACCEPT_PREFIX,
       status: false,
    },
    {
                     title: 'выдача себя за адм',
      content: '[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
   "[CENTER]Игрок будет наказан по данному пункту правил:<br>3.10. Запрещена выдача себя за администратора, если таковым не являетесь [COLOR=rgb(255, 0, 0)]| Ban 7 - 15 + ЧС администрации [/COLOR][/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], закрыто.[/CENTER][/FONT]',
         prefix: ACCEPT_PREFIX,
       status: false,
    },
    {

             title: 'Упом промо',
      content: '[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
   "[CENTER]Игрок будет наказан по данному пункту правил:<br>3.21. Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах [COLOR=rgb(255, 0, 0)]| Ban 30 дней [/COLOR][/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], закрыто.[/CENTER][/FONT]',
         prefix: ACCEPT_PREFIX,
       status: false,
    },
    {
             title: 'Полит. пропаганда ',
     content: '[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
      "[CENTER]Игрок будет наказан по данному пункту правил:<br>3.18. Запрещено политическое и религиозное пропагандирование [COLOR=rgb(255, 0, 0)]| Mute 120 минут / Ban 10 дней [/COLOR][/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], закрыто.[/CENTER][/FONT]',
         prefix: ACCEPT_PREFIX,
       status: false,
     },
     {
      title: 'Транслит',
     content: '[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
      "[CENTER]Игрок будет наказан по данному пункту правил:<br>3.20. Запрещено использование транслита в любом из чатов [COLOR=rgb(255, 0, 0)]| Mute 30 минут [/COLOR][/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], закрыто.[/CENTER][/FONT]',
         prefix: ACCEPT_PREFIX,
       status: false,
     },
     {
        title: 'OOC угрозы',
     content: '[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
      "[CENTER]Игрок будет наказан по данному пункту правил:<br>2.37. Запрещены OOC угрозы, в том числе и завуалированные [COLOR=rgb(255, 0, 0)]| Mute 120 минут / Ban 7 дней [/COLOR][/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], закрыто.[/CENTER][/FONT]',
         prefix: ACCEPT_PREFIX,
       status: false,
       },
     {
                 title: 'угрозы о наказании со стороны адм',
     content: '[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
      "[CENTER]Игрок будет наказан по данному пункту правил:<br>3.09. Запрещены любые угрозы о наказании игрока со стороны администрации [COLOR=rgb(255, 0, 0)]| Mute 30 минут [/COLOR][/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], закрыто.[/CENTER][/FONT]',
         prefix: ACCEPT_PREFIX,
       status: false,
       },
     {
        title: 'Оск нации',
     content: '[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
      "[CENTER]Игрок будет наказан по данному пункту правил:<br>2.35. На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате [COLOR=rgb(255, 0, 0)]| Mute 120 минут / Ban 7 дней [/COLOR][/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], закрыто.[/CENTER][/FONT]',
         prefix: ACCEPT_PREFIX,
       status: false,
    },
    {
         title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠᅠ ᅠ ᅠ ᅠ ᅠ  ᅠ  Отказаноᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠ  ᅠ ᅠ ᅠ ',
	},
    {
      title: 'Предоставьте тайм-коды',
      content:'[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
		"[CENTER][FONT=times new roman]На ваших доказательствах более трех минут фрапса, прикрепите тайм коды в новой жалобе.[/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(255, 0, 0)]Отказано[/COLOR], закрыто.[/CENTER][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'Доква отредактированы',
      content:
		'[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/center][/COLOR]<br>' +
        "[CENTER][FONT=times new roman]Ваши доказательства отредактированы. Создайте жалобу с первоначальными доказательствами.[/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(255, 0, 0)]Отказано[/COLOR], закрыто.[/CENTER][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
         title: 'НЕТ НАРУШЕНИЙ (ОСК В РП ЧАТ)',
      content:'[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
		"[CENTER][FONT=times new roman]Нарушений нет, оскорбления в РП чат не наказуемы.[/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(255, 0, 0)]Отказано[/COLOR], закрыто.[/CENTER][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
              title: 'В жалобы на сотрудников',
      content:'[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
		"[CENTER][FONT=times new roman]Обратитесь в раздел жалоб на сотрудников.[/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(255, 0, 0)]Отказано[/COLOR], закрыто.[/CENTER][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
              title: 'более 3-х дней',
      content:
		'[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
        "[CENTER]Срок написания жалобы составляет три дня (72 часа) с момента совершенного нарушения со стороны игрока сервера.[/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(255, 0, 0)]Отказано[/COLOR], закрыто.[/CENTER][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
                title: 'Неадекватная жб',
      content:
		'[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
        "[CENTER][FONT=times new roman]Составьте жалобу адекватно, без добавления от себя. [/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(255, 0, 0)]Отказано[/COLOR], закрыто.[/CENTER][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'Нужна видеофиксация',
      content:
		'[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
        "[CENTER][FONT=times new roman]В таких случаях нужна видеофиксация нарушения. [/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(255, 0, 0)]Отказано[/COLOR], закрыто.[/CENTER][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'Нет условий сделки',
      content:
		'[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
        "[CENTER][FONT=times new roman]В данных доказательствах отсутствуют условия сделки[/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(255, 0, 0)]Отказано[/COLOR], закрыто.[/CENTER][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
         title: 'Нарушений не найдено',
	  content:
		'[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
		"[CENTER]Нарушений со стороны данного игрока не было найдено.[/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(255, 0, 0)]Отказано[/COLOR], закрыто.[/CENTER][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Недостаточно доказательств',
      content:
		'[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
        "[CENTER]Недостаточно доказательств на нарушение от данного игрока.<br>Доказательства должны быть предоставлены в хорошем качестве и с полным процессом сделки или нарушения от какого-либо игрока.[/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(255, 0, 0)]Отказано[/COLOR], закрыто.[/CENTER][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Дублирование темы',
      content:
		'[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
        "[CENTER]Дублирование темы.<br>Если вы дальше будете заниматься данной деятельностью (дублированием тем), то ваш форумный аккаунт будет заблокирован на 3 дня и более.[/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(255, 0, 0)]Отказано[/COLOR], закрыто.[/CENTER][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
             title: 'ПОДОЗРЕНИЯ БЕЗ ДОК-в',
      content:
		'[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
        "[CENTER][FONT=times new roman]В Вашей жалобе отсутствуют доказательства, а жалобы без доказательств не принимаются. Любые подозрения на любые нарушения от игрока должны быть хоть каким-то образом подтверждены. [/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(255, 0, 0)]Отказано[/COLOR], закрыто.[/CENTER][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'В жалобы на администрацию',
      content:
		'[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
        "[CENTER]Вы ошиблись разделом.<br>Обратитесь в раздел «Жалобы на администрацию».[/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(255, 0, 0)]Отказано[/COLOR], закрыто.[/CENTER][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Форма темы',
      content:
		'[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
        "[CENTER]Ваша жалоба составлена не по форме.<br>Убедительная просьба ознакомиться с правилами подачи жалоб, закреплённые в этом разделе.[/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(255, 0, 0)]Отказано[/COLOR], закрыто.[/CENTER][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
        },
	{
	  title: 'Нету /time',
	  content:
		'[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
		"[CENTER]На ваших доказательствах отсутствует /time.[/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(255, 0, 0)]Отказано[/COLOR], закрыто.[/CENTER][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
        {
                 title: 'Док-ва в соц. сетях',
      content: '[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
     "[CENTER]Загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(255, 0, 0)]Отказано[/COLOR], закрыто.[/CENTER][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'Доказательства отредактированы',
      content:
		'[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
        "[CENTER][FONT=times new roman]Ваши доказательства отредактированы. Создайте жалобу с первоначальными доказательствами.​[/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(255, 0, 0)]Отказано[/COLOR], закрыто.[/CENTER][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,

    },
    {
     title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ  На Рассмотрение ᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ',
	},
    {
          title: 'На рассмотрении',
      content:
        '[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
        "[CENTER]Ваша жалоба взята на рассмотрение.<br>Просьба ожидать ответа и не создавать дубликаты данной темы.[/CENTER]<br><br>" +
        '[Color=#FBA026][CENTER]Ожидайте ответа.[/CENTER][/FONT]',
prefix: PIN_PREFIX,
status: true,
    },
    {
      title: 'Тех. спецу',
      content:
		'[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
        "[CENTER]Ваша жалоба была передана на рассмотрение техническому специалисту.[/CENTER]<br><br>" +
		'[Color=#FBA026][CENTER]Ожидайте ответа.[/CENTER][/FONT]',
      prefix: TEXY_PREFIX,
	  status: false,
    },
    {
                         title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ  ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ  СМИ ᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ  ᅠ ᅠᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ',
    },
    {
                   title: 'НПРО',
     content: '[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
      "[CENTER]Игрок будет наказан по данному пункту правил:<br>4.01. Запрещено редактирование объявлений, не соответствующих ПРО [COLOR=rgb(255, 0, 0)] | Mute 30 минут [/COLOR][/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], закрыто.[/CENTER][/FONT]',
         prefix: ACCEPT_PREFIX,
       status: false,
    },
    {
                   title: 'исп функ в лич целях',
     content: '[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
      "[CENTER]Игрок будет наказан по данному пункту правил:<br> 4.04. Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком[COLOR=rgb(255, 0, 0)] | Ban 7 дней + ЧС организации  [/COLOR][/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], закрыто.[/CENTER][/FONT]',
         prefix: ACCEPT_PREFIX,
       status: false,
    },
    {
                 title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ  NONRP коп ᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ  ᅠ ᅠᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ',
    },
    {
                title: 'Обыск без РП',
     content: '[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
      "[CENTER]Игрок будет наказан по данному пункту правил:<br>8.06. Запрещено проводить обыск игрока без Role Play отыгровки. [COLOR=rgb(255, 0, 0)]| Warn [/COLOR][/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], закрыто.[/CENTER][/FONT]',
         prefix: ACCEPT_PREFIX,
       status: false,
    },
    {
                        title: 'NonRP поведение',
     content: '[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
      "[CENTER]Игрок будет наказан по данному пункту правил:<br>6.04. Запрещено nRP поведение [COLOR=rgb(255, 0, 0)]| Warn [/COLOR][/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], закрыто.[/CENTER][/FONT]',
         prefix: ACCEPT_PREFIX,
       status: false,
    },
    {
                    title: 'Розыск без причины',
     content: '[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
      "[CENTER]Игрок будет наказан по данному пункту правил:<br>6.02. Запрещено выдавать розыск без Role Play причины [COLOR=rgb(255, 0, 0)]| Warn [/COLOR][/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], закрыто.[/CENTER][/FONT]',
         prefix: ACCEPT_PREFIX,
       status: false,
    },
    {
                            title: 'Арест без РП',
     content: '[Color=Cyan][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
      "[CENTER]Игрок будет наказан по данному пункту правил:<br>6.03. Запрещено оказывать задержание без Role Play отыгровки [COLOR=rgb(255, 0, 0)]| Warn [/COLOR][/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], закрыто.[/CENTER][/FONT]',
         prefix: ACCEPT_PREFIX,
       status: false,
    }

       ];
  $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    // Добавление кнопок при загрузке страницы
    addButton('На рассмотрение', 'pin');
    addButton('Одобрено', 'accepted');
    addButton('Тех. Специалисту', 'Texy');
    addButton('Закрыто', 'close');
    addButton('Отказано', 'unaccept');
    addAnswers();

    // Поиск информации о теме
    const threadData = getThreadData();

    $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
    $('button#Texy').click(() => editThreadData(TEXY_PREFIX, false));
    $('button#close').click(() => editThreadData(CLOSE_PREFIX, false));
    $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
    $(`button#ff`).click(() => pasteContent(8, threadData, true));
	$(`button#selectAnswer`).click(() => {
	XF.alert(buttonsMarkup(buttons), null, 'ВЫБЕРИТЕ ОТВЕТ');
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

	function addButton(name, id) {
	$('.button--icon--reply').before(
	`<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 25px; margin-right: 5px;">${name}</button>`,
	);
	}
	function addAnswers() {
		$('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswer" style="oswald: 3px; margin-left: 15px; border-radius: 25px;">ОТВЕТЫ</button>`,
	);
	}

	function buttonsMarkup(buttons) {
	return `<div class="select_answer">${buttons
	.map(
	(btn, i) =>
	`<button id="answers-${i}" class="button--primary button ` +
	`rippleButton" style="margin:4px"><span class="button-text">${btn.title}</span></button>`,
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


  function editThreadData(prefix, pin = false, dmitry_merphy = true) {
    // Получаем заголовок темы, так как он необходим при запросе
    const threadTitle = $('.p-title-value')[0].lastChild.textContent;

    if (pin == false) {
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
    if (pin == true) {
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