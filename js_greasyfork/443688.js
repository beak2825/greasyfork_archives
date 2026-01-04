// ==UserScript==
// @name         BLUE Moderators 
// @namespace    https://forum.blackrussia.online
// @version      6.66660
// @description  Для настоящих ценителей форума, а Мираббос 0
// @author       BR BLUE
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @grant        none
// @license    MIT
// @collaborator I
// @icon https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @downloadURL https://update.greasyfork.org/scripts/443688/BLUE%20Moderators.user.js
// @updateURL https://update.greasyfork.org/scripts/443688/BLUE%20Moderators.meta.js
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
      title: 'Нонрп поведение',
      content:
		'[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' + '[CENTER]  [/CENTER][/FONT]' +
        "[CENTER][FONT=georgia][I][B]Игрок будет наказан по пункту правил: 2.01. Запрещено поведение, нарушающее нормы процессов Role Play режима игры | Jail 30 минут [/FONT][/I][/B][/CENTER] " +
		'[Color=Green][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Угрозы OOC',
      content: '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' + '[CENTER]  [/CENTER][/FONT]' +
        "[CENTER][B][I][FONT=georgia]Игрок будет наказан по пункту правил:[/FONT][/I][/B][FONT=georgia][I][B]2.37. Запрещены OOC угрозы, в том числе и завуалированные | Ban 15 - 30 дней / PermBan[/B][/I][/FONT][B][I][FONT=georgia]Одобрено, закрыто[/FONT][/I][/B][/CENTER]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Сторонне ПО',
      content:
		'[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' + '[CENTER]  [/CENTER][/FONT]' +
        "[CENTER][FONT=georgia][B][I]Игрок будет наказан по пункту правил:[/I][/B][/FONT][B][I][FONT=georgia]2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками | Ban 15 - 30 дней / PermBan Одобрено, закрыто[/CENTER]" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'СК',
      content:
		'[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' + '[CENTER]  [/CENTER][/FONT]' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>2.16. Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них | Jail 30 минут / Warn (за два и более убийства).[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ТК',
      content:
		'[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' + '[CENTER]  [/CENTER][/FONT]' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>2.15. Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины | Jail 30 минут / Warn (за два и более убийства)[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ПГ',
      content:
		'[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' + '[CENTER]  [/CENTER][/FONT]' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>2.17. Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь | Jail 30 минут[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'РК',
      content:
		'[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' + '[CENTER]  [/CENTER][/FONT]' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>2.14. Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти | Jail 30 минут[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ДМ',
      content:
		'[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' + '[CENTER]  [/CENTER][/FONT]' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>2.19. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины | Jail 60 минут.[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ЕПП',
      content:
		'[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' + '[CENTER]  [/CENTER][/FONT]' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>2.46. Запрещено ездить по полям на любом транспорте | Jail 30 минут.[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ЕПП Фура',
      content:
		'[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' + '[CENTER]  [/CENTER][/FONT]' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>2.47. Запрещено ездить по полям на грузовом транспорте (работа дальнобойщика) | Jail 60 минут.[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'багоюз',
      content:
		'[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' + '[CENTER]  [/CENTER][/FONT]' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>2.21. Запрещено пытаться обходить игровую систему или использовать любые баги сервера | Ban 15 - 30 дней / PermBan.[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Сбив стрельбы аним',
      content:
         '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' + '[CENTER]  [/CENTER][/FONT]' + 
         "[CENTER]Игрок будет наказан по данному пункту правил:<br>2.55. Запрещается багоюз связанный с анимацией в любых проявлениях. | Jail 60 / 120 минут.[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ДБ',
      content:
         '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' + '[CENTER]  [/CENTER][/FONT]' + 
         "[CENTER]Игрок будет наказан по данному пункту правил:<br>2.13. Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта | Jail 30 минут.[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'NonRP Обман',
      content:
		'[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' + '[CENTER]  [/CENTER][/FONT]' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>2.05. Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики | PermBan.[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Масс ДМ',
      content:
		'[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' + '[CENTER]  [/CENTER][/FONT]' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>2.20. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины более трем игрокам | Warn / Ban 7 - 15 дней.[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Оск/Упом родни',
      content:
		'[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' + '[CENTER]  [/CENTER][/FONT]' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>3.04. Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) | Mute 120 минут / Ban 7 - 15 дней.[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Оскорбление',
      content:
		'[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' + '[CENTER]  [/CENTER][/FONT]' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>3.07. Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата | Mute 30 минут[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Угроза о наказании',
      content:
		'[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' + '[CENTER]  [/CENTER][/FONT]' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>3.09. Запрещены любые угрозы о наказании игрока со стороны администрации | Mute 30 минут.[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Оск в ООС',
      content:
		'[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' + '[CENTER]  [/CENTER][/FONT]' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>3.03. Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены | Mute 30 минут[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'MG',
      content:
		'[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' + '[CENTER]  [/CENTER][/FONT]' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>2.18. Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе | Mute 30 минут.[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ПОлит пропаганда',
      content:
		'[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' + '[CENTER]  [/CENTER][/FONT]' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>3.18. Запрещено политическое и религиозное пропагандирование | Mute 120 минут / Ban 10 дней.[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Транслит',
      content:
		'[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' + '[CENTER]  [/CENTER][/FONT]' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>3.01. Общепризнанный язык сервера — русский. Общение в IC и OOC чатах во всех RolePlay ситуациях обязательно должно проходить исключительно на русском языке | Устное замечание / Mute 30 минут[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Злоупотребление знаками',
      content:
		'[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' + '[CENTER]  [/CENTER][/FONT]' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>3.06. Запрещено злоупотребление знаков препинания и прочих символов | Mute 30 минут[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
     {
	  title: 'Капс',
	  content:
		'[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' + '[CENTER]  [/CENTER][/FONT]' +
		"[CENTER]Игрок будет наказан по данному пункту правил:<br>3.02. Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате | Mute 30 минут.[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Флуд',
	  content:
		'[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' + '[CENTER]  [/CENTER][/FONT]' +
		"[CENTER]Игрок будет наказан по данному пункту правил:<br>3.05. Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока | Mute 30 минут.[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Реклама промо',
      content:
		'[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' + '[CENTER]  [/CENTER][/FONT]' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>3.21. Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. | Ban 30 дней.[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Неув обр. к адм',
      content:
		'[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' + '[CENTER]  [/CENTER][/FONT]' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>2.54. Запрещено неуважительное обращение, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации | Mute 120 минут[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Ввод в заблуждение',
      content:
		'[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' + '[CENTER]  [/CENTER][/FONT]' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>3.11. Запрещено введение игроков проекта в заблуждение путем злоупотребления командами | Ban 15 - 30 дней / PermBan[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Уход от РП',
      content:
		'[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' + '[CENTER]  [/CENTER][/FONT]' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>2.02. Запрещено целенаправленно уходить от Role Play процесса всеразличными способами | Jail 30 минут / Warn[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Уход от наказания',
      content:
		'[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' + '[CENTER]  [/CENTER][/FONT]' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>2.34. Запрещен уход от наказания | Ban 15 - 30 дней (суммируется к общему наказанию дополнительно)[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Аморал действия',
      content:
		'[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' + '[CENTER]  [/CENTER][/FONT]' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>2.08. Запрещена любая форма аморальных действий сексуального характера в сторону игроков | Jail 30 минут / Warn[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Слив глоб. чата',
      content:
		'[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' + '[CENTER]  [/CENTER][/FONT]' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>3.08. Запрещены любые формы «слива» посредством использования глобальных чатов | PermBan[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Слив склада',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>2.09. Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле | Ban 15 - 30 дней / PermBan[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Оск проекта',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>2.40. Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе | Ban 15 - 30 дней / PermBan/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Оск адм',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>2.32. Запрещено введение в заблуждение, обман, оскорбление, неконструктивная критика администрации на всех ресурсах проекта | Ban 7 - 30 дней / PermBan[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.][/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Выдача себя за адм',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>3.10. Запрещена выдача себя за администратора, если таковым не являетесь | Ban 15 - 30 + ЧС администрации[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
},
 
 
    {
     title: '╴╴╴╴╴╴╴╴╴ОШИБКИ В ЗАПОЛНЕНИИ И ТД╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
 
 
    {
	  title: 'Нарушений не найдено',
	  content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		"[CENTER]Нарушений со стороны данного игрока не было найдено.[/CENTER]<br>" +
		'[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Недостаточно доказательств',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Недостаточно доказательств на нарушение от данного игрока.<br>Доказательства должны быть предоставлены в хорошем качестве и с полным процессом сделки или нарушения от какого-либо игрока.[/CENTER]<br>" +
		'[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Дублирование темы',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Дублироване темы.<br>Если вы дальше будете заниматься данной деятельностью (дублированием тем), то ваш форумный аккаунт будет заблокирован на 3 дня и более.[/CENTER]<br>" +
		'[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'В жалобы на адм',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Вы ошиблись разделом.<br>Обратитесь в раздел «Жалобы на администрацию».[/CENTER]<br>" +
		'[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'В обжалования',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Вы ошиблись разделом.<br>Обратитесь в раздел «Обжалования наказаний».[/CENTER]<br>" +
		'[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Форма темы',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба составлена не по форме.<br>Ознакомиться с правилами подачи можно тут - https://clck.ru/Wv89w. [/CENTER]<br>" +
		'[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	{
	  title: 'Нету /time',
	  content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		"[CENTER]На ваших доказательствах отсутствует /time.[/CENTER]<br>" +
		'[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color]]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Укажите таймкоды',
	  content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		"[CENTER]Укажите таймкоды[/CENTER]<br>" +
		'[Color=Flame][CENTER]На рассмотрении...[/CENTER][/color]',
      prefix: PIN_PREFIX,
	  status: false,
	},
    {
      title: 'Жалоба на рассмотрении',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба взята на рассмотрение.<br>Просьба ожидать ответа и не создавать дубликаты данной темы.[/CENTER]<br>" +
		'[Color=Flame][CENTER]Ожидайте ответа.[/CENTER][/color]',
      prefix: PIN_PREFIX,
	  status: false,
    },
    {
      title: 'Тех. спецу',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба была передана на рассмотрение техническому специалисту.[/CENTER]<br>" +
		'[Color=Flame][CENTER]Ожидайте ответа.[/CENTER][/color]',
      prefix: TEXY_PREFIX,
	  status: false,
    },
      {
      title: 'Заголовок не по форме',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][FONT=times new roman][I]Заголовок вашей жалобы составлен не по форме. Ознакомиться с правилами подачи можно тут - https://clck.ru/Wv89w. [/CENTER]" +
		'[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
      {
      title: 'Более 72 часов',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]С момента нарушения прошло более 72 часов[/CENTER]" +
		'[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
      {
      title: 'Доква в соц сетях',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Запрещено выкладывать доказательства в социальные сети [/CENTER]" +
		'[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нету условий сделки',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]На данной видеозаписи нету уловий сделки[/CENTER]" +
		'[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нету /time',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]На докозательствах отсутствует /time[/CENTER]" +
		'[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нужен фарпс',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]В таких случаях нужна видеозапись[/CENTER]" +
		'[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Неполный фрапс',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Видео запись обрывается. Загрузите полную видеозапись на ютуб.[/CENTER]" +
		'[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Не работают доква',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Не работают докозательства[/CENTER]<br>" +
		'[Color=Flame][CENTER]Закрыто[/CENTER][/color]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Бред причина жб',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Бредовая причина жалоба(оффтоп).[/CENTER]<br>" +
		'[Color=Flame][CENTER]Закрыто[/CENTER][/color]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ники жалобы отличаются',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]NickName в заголовке отличается от NickName в жалобе.[/CENTER]<br>" +
		'[Color=Flame][CENTER]Закрыто[/CENTER][/color]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Доква отредактированы',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваши доказательства отредактированы.[/CENTER]" +
		'[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'От 3-го лица',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Жалобы от 3-их лиц не принимаются[/CENTER]" +
		'[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Ответный ДМ',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]В случае ответного ДМ нужен видиозапись. Пересоздайте тему и прекрепите видиозапись.[/CENTER]" +
		'[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
 
 
    {
     title: '╴╴╴╴╴╴╴╴╴ГОСС ПРАВИЛА╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
 
 
    {
      title: 'Розыск без причины',
      content:
		'[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' + '[CENTER]  [/CENTER][/FONT]' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>6.02. Запрещено выдавать розыск без Role Play причины | Jail 30 минут[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'НРП поведение ГОСС',
      content:
		'[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' + '[CENTER]  [/CENTER][/FONT]' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>6.04. Запрещено nRP поведение | Warn[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Задержание без РП',
      content:
		'[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' + '[CENTER]  [/CENTER][/FONT]' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>6.03. Запрещено оказывать задержание без Role Play отыгровки | Warn[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Штраф просто так',
      content:
		'[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' + '[CENTER]  [/CENTER][/FONT]' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>7.02. Запрещено выдавать розыск, штраф без Role Play причины | Jail 30 минут[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
},
 
 
    {
     title: '╴╴╴╴╴╴╴╴╴ОПГ ПРАВИЛА╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
 
 
    {
      title: 'НонРП в/ч',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан за NonRP в/ч. | Jail 30 минут / Warn<br>Со всеми правилами нападения на военную часть можно ознакомиться тут - https://clck.ru/U6TrB[/CENTER][/FONT]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'НонРП ограбление',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан за NonRP ограбление | Jail 30 минут / Warn<br>Со всеми правилами ограблений и похищений можно ознакомиться тут - https://clck.ru/RcyDz[/CENTER][/FONT]",
      prefix: ACCEPT_PREFIX,
	  status: false,
 
    },
 
 
    {
     title: '╴╴╴╴╴╴╴╴╴БИОГРАФИИ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
 
 
      {
      title: 'био одобрено',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Green]Одобрено.[/CENTER][/color]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'био на дороботке',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Слишком мало информации. Вам даётся 24 часа на дополнение вашей РП биографии[/CENTER]",
      prefix: PIN_PREFIX,
    },
    {
      title: 'био не по форме',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Биография составлена не по форме, ознакомиться с правилами подачи можно тут - https://clck.ru/aeGVr[/CENTER][/FONT]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'био украдена',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Биография украдена у другого игрока[/CENTER][/FONT]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'био меньше 18 лет',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Вашему персонажу меньше 18-ти лет.[/CENTER][/FONT]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'био с англ никами',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>NickName должен быть написан на русском языке.[/CENTER][/FONT]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'био от 3 лица',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Биография должна быть заполнена от 1 лица.[/CENTER][/FONT]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ники не совпадают',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>NickName в заголовке отличается от NickName в Биографии.[/CENTER][/FONT]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'возраст не совпадает',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Возраст не совпадает с датой рождения.[/CENTER][/FONT]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'OOC информация',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>В вашей РП Биографии присутствует OOC информация.[/CENTER][/FONT]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
 
 
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴РП СИТУАЦИИ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
 
 
    {
      title: 'РП ситуация одобрено',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП ситуация получает статус: [Color=Green]Одобрено.[/CENTER][/color]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'РП ситуация на дороботке',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Вам даётся 24 часа на дополнение вашей РП ситуации[/CENTER]",
      prefix: PIN_PREFIX,
	  status: false,
    },
    {
      title: 'РП ситуация отказ',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП ситуация получает статус: [Color=Red]Отказано.[/color]<br>Причиной отказа могло послужить какое-либо нарушение из [URL='https://forum.blackrussia.online/index.php?threads/Общие-правила-role-play-ситуации.463789/']Правила Role-Play ситуаций[/URL][/CENTER][/FONT]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
 
 
    {
     title: '╴╴╴╴╴╴╴╴НЕОФИЦИАЛЬНЫЕ ОРГАНИЗАЦИИ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
 
 
    {
      title: 'Неофициальная Орг Одобр',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП ситуация получает статус: [Color=Green]Одобрено.[/CENTER][/color]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Неофициальная Орг на дороботке',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Вам даётся 24 часа на дополнение вашей Неофициальная Орг[/CENTER]",
      prefix: PIN_PREFIX,
	  status: false,
    },
    {
      title: 'Неофициальная Орг отказ',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП ситуация получает статус: [Color=Red]Отказано.[/color]<br>Причиной отказа могло послужить какое-либо нарушение из [URL='https://forum.blackrussia.online/index.php?threads/Правила-раздела-Неофициальные-rp-организации.39469/']Правила создания неофициальной RolePlay организации[/URL].[/CENTER][/FONT]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
 
 
  ];
 
  $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
    // Добавление кнопок при загрузке страницы
    addButton('На рассмотрение', 'pin');
    addButton('КП', 'teamProject');
    addButton('Одобрено', 'accepted');
    addButton('Отказано', 'unaccept');
    addButton('Тех. Специалисту', 'Texy');
    addButton('Решено', 'Resheno');
    addButton('Закрыто', 'Zakrito');
    addButton('Ответы', 'selectAnswer');
 
    // Поиск информации о теме
    const threadData = getThreadData();
 
    $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
    $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
    $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
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
} else {
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
if(prefix == ACCEPT_PREFIX) {
moveThread(prefix,685);
}
if(prefix == PIN_PREFIX) {
moveThread(prefix,690);
}
if(prefix == UNACCEPT_PREFIX) {
moveThread(prefix,691);
}
 
  function editThreadData(prefix, pin = false) {
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