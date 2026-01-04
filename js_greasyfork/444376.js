// ==UserScript==
// @name         Magenta | KF SKRIPT by T.Sotodzaki
// @namespace    https://forum.blackrussia.online
// @version      5.1
// @description  По вопросам и предложениям - vk: bilmosa
// @author       Takeru Sotodzaki
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @grant        none
// @license    MIT
// @icon https://kartinkin.net/uploads/posts/2021-02/1612367107_16-p-anime-tyanka-litso-art-kartinki-17.jpg
// @downloadURL https://update.greasyfork.org/scripts/444376/Magenta%20%7C%20KF%20SKRIPT%20by%20TSotodzaki.user.js
// @updateURL https://update.greasyfork.org/scripts/444376/Magenta%20%7C%20KF%20SKRIPT%20by%20TSotodzaki.meta.js
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
      title: 'Отказано, закрыто',
      content: '[Color=Red][CENTER][ICODE]Отказано, закрыто.[/CENTER][/color]',
    },
    {
      title: 'Одобрено, закрыто',
      content: '[Color=Green][CENTER][ICODE]Одобрено, закрыто.[/CENTER][/color]',
    },
    {
      title: 'На рассмотрении...',
      content: '[Color=Orange][FONT=times mew roman][i][CENTER]На рассмотрении...[/CENTER][/font][/i][/color]',
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Пункты 2.0-2.54╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Нонрп поведение',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Игрок будет наказан по пункту правил: 2.01. Запрещено поведение, нарушающее нормы процессов Role Play режима игры | Jail 30 минут [/FONT][/I][/B][/CENTER] " +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Уход от РП',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>2.02. Запрещено целенаправленно уходить от Role Play процесса всеразличными способами | Jail 30 минут / Warn[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нонрп вождение',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>2.03. Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере | Jail 30 минут[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
        {
      title: 'НонРП В/Ч',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пунтку правил: За нарушение правил нападения на Войсковую Часть выдаётся предупреждение | Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ)[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'NonRP Обман',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>2.05. Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики | PermBan.[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Аморал действия',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>2.08. Запрещена любая форма аморальных действий сексуального характера в сторону игроков | Jail 30 минут / Warn[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Слив склада',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>2.09. Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле | Ban 15 - 30 дней / PermBan[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ДБ',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br> 2.13. Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта | Jail 60 минут[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'РК',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br> 2.14. Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти | Jail 30 минут[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ТК',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>2.15. Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины | Jail 60 минут / Warn (за два и более убийства)[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'СК',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>2.16. Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них | Jail 60 минут / Warn (за два и более убийства)[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ПГ',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>2.17. Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь | Jail 30 минут[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'MG',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>2.18. Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе | Mute 30 минут.[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
        {
      title: 'ДМ',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>2.19. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины | Jail 60 минут.[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Масс ДМ',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>2.20. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более | Warn / Ban 3 - 7 дней[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
        {
      title: 'Сторонне ПО',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][B][I]Игрок будет наказан по пункту правил:[/I][/B][/FONT][B][I][FONT=georgia]2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками | Ban 15 - 30 дней / PermBan [/CENTER]" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
            {
      title: 'П/П/В',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][B][I]Игрок будет наказан по пункту правил:[/I][/B][/FONT][B][I][FONT=georgia]2.28. Запрещена покупка/продажа внутриигровой валюты в любых ее проявлениях за реальные деньги | PermBan с обнулением аккаунта Одобрено, закрыто[/CENTER]" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Реклама сторонние ресурсы',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>2.31. Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное | Ban 7 дней / PermBan[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'заблуждение/обман адм',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>2.32. Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта | Ban 7 - 15 дней[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'уязвимость правил',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>2.33. Запрещено пользоваться уязвимостью правил | Ban 15 дней[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'IC и OCC конф нации/религ',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>2.35. На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате | Mute 120 минут / Ban 7 дней[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
     {
      title: 'перенос конфл ООС IС',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил:<br>2.36. Запрещено переносить конфликты из IC в OOC и наоборот | Warn[/B][/I][/FONT]<br>" +
        '[B][I][FONT=georgia]Одобрено, закрыто[/FONT][/I][/B][/CENTER]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Угрозы OOC',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил:<br>2.37. Запрещены OOC угрозы, в том числе и завуалированные | Mute 120 минут / Ban 7 дней[/B][/I][/FONT]<br>" +
        '[B][I][FONT=georgia]Одобрено, закрыто[/FONT][/I][/B][/CENTER]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'епп инко, фура',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Игрок будет наказан по пункту правил:<br>2.47. Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) | Jail 60 минут[/CENTER]" +
        '[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'с проектом',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>2.40. Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе | Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором) [/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Продажа промо',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>2.43. Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций | Mute 120 минут[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Помеха РП процессу',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>2.51. Запрещено вмешательство в Role Play процесс с целью помехи и препятствования дальнейшего развития Role Play процесса | Jail 30 минут[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нонрп акс',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>2.52. Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. | При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Неув обр./оск адм',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>2.54. Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации | Mute 180 минут[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Баг аним',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>2.55. Запрещается багоюз связанный с анимацией в любых проявлениях. | Jail 60 / 120 минутПример: если игрок, используя баг, убирает ограничение на использование оружия в зеленой зоне, сбивает темп стрельбы, либо быстро перемещается во время войны за бизнес или во время перестрелки на мероприятии с семейными контейнерами, последует наказание в виде Jail на 120 минут. Данное наказание используется в случаях, когда, используя ошибку, было получено преимущество перед другими игроками.Пример: если игрок использует баги, связанные с анимацией, и при этом не влияет на игровой процесс других игроков, а также не получает преимущество перед другими игроками, последует наказание в виде Jail на 60 минут.[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Пункты 3.0-3.22╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Транслит',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>3.01. Общепризнанный язык сервера — русский. Общение в IC и OOC чатах во всех RolePlay ситуациях обязательно должно проходить исключительно на русском языке | Устное замечание / Mute 30 минут[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Капс',
	  content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		"[CENTER]Игрок будет наказан по данному пункту правил:<br>3.02. Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате | Mute 30 минут.[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Оск в ООС',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>3.03. Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены | Mute 30 минут[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Оск/Упом родни',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>3.04. Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) | Mute 120 минут / Ban 7 - 15 дней.[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Флуд',
	  content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		"[CENTER]Игрок будет наказан по данному пункту правил:<br>3.05. Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока | Mute 30 минут.[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Злоуп знаками',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>3.06. Запрещено злоупотребление знаков препинания и прочих символов | Mute 30 минут[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Оскорбление',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>3.07. Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата | Mute 30 минут[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Слив СМИ',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>3.08. Запрещены любые формы «слива» посредством использования глобальных чатов | PermBan[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Угрозы о наказании со стороны адм',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Игрок будет наказан по пункту правил:[/FONT][/I][/B][FONT=georgia][I][B]3.09. Запрещены любые угрозы о наказании игрока со стороны администрации | Mute 30 минут<br>" +
        '[Color=Green][CENTER][ICODE]Одобрено, закрыто[/FONT][/I][/B][/CENTER][/color]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Выдача себя за адм ',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>3.10. Запрещена выдача себя за администратора, если таковым не являетесь | Ban 7 - 15 + ЧС администрации[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Ввод в заблуждение',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>3.11. Запрещено введение игроков проекта в заблуждение путем злоупотребления командами | Ban 15 - 30 дней / PermBan[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Музыка в войс',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>3.14. Запрещено включать музыку в Voice Chat | Mute 60 минут[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Оск/Упом род в войс',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>3.15. Запрещено оскорблять игроков или родных в Voice Chat | Mute 120 минут / Ban 7 - 15 дней[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'реклама войс',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>3.17. Запрещена реклама в Voice Chat не связанная с игровым процессом | Ban 7 - 15 дней[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Шум в войс',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>3.16. Запрещено создавать посторонние шумы или звуки | Mute 30 минут[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Реклама промо',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>3.21. Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. | Ban 30 дней.[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Торговля на тт госс',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>3.22. Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) | Mute 30 минут[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Религиозное и политическая пропоганда',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>3.18. Запрещено политическое и религиозное пропагандирование | Mute 120 минут / Ban 10 дней[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Пункты 4.0-4.14╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Фейк аккаунт',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>4.10. Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию | Устное замечание + смена игрового никнейма / PermBan[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
         title: 'ТВИНК',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>4.04. Разрешается зарегистрировать максимально только три игровых аккаунта на сервере | PermBan[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Пункты передачи╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Тех. спецу',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба была передана на рассмотрение техническому специалисту.[/CENTER]<br>" +
		'[Color=Flame][CENTER]Ожидайте ответа.[/I][/CENTER][/color][/FONT]',
      prefix: TEXY_PREFIX,
	  status: true,
    },
    {
      title: 'Передано ГА',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба была передана на рассмотрение Главной Администрации.[/CENTER]<br>" +
		'[Color=Flame][CENTER]Ожидайте ответа.[/I][/CENTER][/color][/FONT]',
      prefix: GA_PREFIX,
	  status: true,
    },
    {
      title: 'Передано Сандеру',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба была передана на рассмотрение Специальному администратору.[/CENTER]<br>" +
		'[Color=Flame][CENTER]Ожидайте ответа.[/I][/CENTER][/color][/FONT]',
      prefix: SPECY_PREFIX,
	  status: true,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Правила Госс╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Потруль в одиночку или конв.',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пунтку правил: 1.11. Всем силовым структурам запрещен одиночный патруль или конвоирование, минимум 2 сотрудника | Jail 30 минут[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
    },
    {
      title: 'работа в форме',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пунтку правил: 1.07. Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, принадлежащей своей фракции | Jail 30 минут[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Исп. фракц. т/с в личных целях',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пунтку правил: 1.08. Запрещено использование фракционного транспорта в личных целях | Jail 30 минут[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ДМ/Масс дм за КПП (МО)',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пунтку правил: 2.02. Наносить урон игрокам, которые находятся вне территории воинской части, запрещено | Jail 30 минут / Warn[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Н/П/Р/О (Объявы)',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пунтку правил: 4.01. Запрещено редактирование объявлений, не соответствующих ПРО | Mute 30 минут[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Н/П/П/Э (Эфиры)',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пунтку правил: 4.02. Запрещено проведение эфиров, не соответствующих Role Play правилам и логике | Mute 30 минут[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Замена текста СМИ',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пунтку правил:4.04. Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком | Ban 7 дней + ЧС организации[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ДМ/Масс от УМВД',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пунтку правил: 6.01. Запрещено наносить урон игрокам без Role Play причины на территории УМВД | Jail 30 минут / Warn[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Розыск без причины(УМВД)',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пунтку правил: 6.02. Запрещено выдавать розыск без Role Play причины | Jail 30 минут[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Задержание без РП(Нонрп коп)(УМВД)',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пунтку правил: 6.03. Запрещено оказывать задержание без Role Play отыгровки | Warn[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нонрп поведение(УМВД)',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пунтку правил: 6.04. Запрещено nRP поведение | Warn[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Замена текста СМИ',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пунтку правил:4.04. Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком | Ban 7 дней + ЧС организации[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ДМ/Масс от ГИБДД',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пунтку правил: 7.01. Запрещено наносить урон игрокам без Role Play причины на территории ГИБДД | Jail 30 минут / Warn[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Штраф без рп(ГИБДД)',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пунтку правил: 7.02. Запрещено выдавать розыск, штраф без Role Play причины | Jail 30 минут[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Розыск без причины(ГИБДД)',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пунтку правил: 6.02. Запрещено выдавать розыск без Role Play причины | Jail 30 минут[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Задержание без РП(Нонрп коп)(ГИБДД)',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пунтку правил: 7.03. Запрещено оказывать задержание без Role Play отыгровки | Warn[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Забирание В/У во время погони(ГИБДД)',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пунтку правил: 7.05. Запрещено отбирать водительские права во время погони за нарушителем | Warn[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ДМ/Масс от УФСБ',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пунтку правил: 8.01. Запрещено наносить урон игрокам без Role Play причины на территории ФСБ | Jail 30 минут / Warn[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Розыск без причины(УФСБ)',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пунтку правил: 8.02. Запрещено выдавать розыск без Role Play причины | Jail 30 минут[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Задержание без РП(Нонрп коп)(УФСБ)',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пунтку правил: 8.03. Запрещено оказывать задержание без Role Play отыгровки | Warn[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нанесение урона без РП(Нонрп коп)(ФСИН)',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пунтку правил: 9.01. Запрещено наносить урон игрокам без Role Play причины на территории ФСИН | Jail 30 минут / Warn[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
    title: 'Обыск без РП (все госс)',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту: 8.06. Запрещено проводить обыск игрока без Role Play отыгровки | Warn[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Правила ОПГ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'НонРП В/Ч',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пунтку правил: За нарушение правил нападения на Войсковую Часть выдаётся предупреждение | Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ)[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нападение на В/Ч через стену',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пунтку правил: Нападение на военную часть разрешено только через блокпост КПП с последовательностью взлома (НонРП В/Ч) | Warn [/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Похищение/Ограбления нарушение правил',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан за Нонрп Ограбление\Похищениее в соответствии с этими правилами [URL='https://forum.blackrussia.online/index.php?threads/Правила-ограблений-и-похищений.29/']Тык[/URL][/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Без опр. пунтка╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
	  title: 'Нарушений не найдено',
	  content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		"[CENTER]Нарушений со стороны данного игрока не было найдено.[/CENTER]<br>" +
		'[Color=Red][CENTER]Отказано, закрыто.[/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
 },
    {
	  title: 'Восст. акка',
	  content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		"[CENTER]Вы можете самостоятельно восстановить свой игровой аккаунт с помощью привязок. Администрация не занимается восстановлением аккаунтов.[/CENTER]<br>" +
		'[Color=Red][CENTER]Отказано, закрыто.[/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
	},
    {
        title: 'Нет док-в',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]В вашей жалобе нет доказательств.[/CENTER]<br>" +
        '[Color=Red][CENTER]Отказано, закрыто.[/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
        {
      title: 'Недостаточно доказательств',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Недостаточно доказательств на нарушение от данного игрока.<br>Доказательства должны быть предоставлены в хорошем качестве и с полным процессом сделки или нарушения от какого-либо игрока.[/CENTER]<br>" +
		'[Color=Red][CENTER]Отказано, закрыто.[/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Дублирование темы',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Дублироване темы.<br>Если вы дальше будете заниматься данной деятельностью (дублированием тем), то ваш форумный аккаунт будет заблокирован на 3 дня и более.[/CENTER]<br>" +
		'[Color=Red][CENTER]Отказано, закрыто.[/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'В жалобы на адм',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Вы ошиблись разделом.<br>Обратитесь в раздел «Жалобы на администрацию».[/CENTER]<br>" +
		'[Color=Red][CENTER]Отказано, закрыто.[/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'В обжалования',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Вы ошиблись разделом.<br>Обратитесь в раздел «Обжалования наказаний».[/CENTER]<br>" +
		'[Color=Red][CENTER]Отказано, закрыто.[/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Форма темы',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба составлена не по форме.<br>Убедительная просьба ознакомиться с правилами подачи жалоб, закреплённые в этом разделе.[/CENTER]<br>" +
		'[Color=Red][CENTER]Отказано, закрыто.[/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Укажите таймкоды',
	  content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		"[CENTER]Укажите таймкоды[/CENTER]<br>" +
		'[Color=Flame][CENTER]На рассмотрении...[/I][/CENTER][/color][/FONT]',
      prefix: PINN_PREFIX,
	  status: true,
	},
    {
      title: 'Жалоба на рассмотрении',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба взята на рассмотрение.<br>Просьба ожидать ответа и не создавать дубликаты данной темы.[/CENTER]<br>" +
		'[Color=Flame][CENTER]Ожидайте ответа.[/I][/CENTER][/color][/FONT]',
      prefix: PINN_PREFIX,
	  status: false,
    },
      {
      title: 'Заголовок не по форме',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][FONT=times mew roman][I]Заголовок вашей жалобы составлен не по форме. Убедительная просьба ознакомиться с правилами подачи жалоб, закреплённые в этом разделе.[/CENTER]" +
		'[Color=Red][CENTER]Отказано, закрыто.[/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
      {
      title: 'Более 72 часов',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]3.1. Срок написания жалобы составляет три дня (72 часа) с момента совершенного нарушения со стороны игрока сервера.[/CENTER]" +
		'[Color=Red][CENTER]Отказано, закрыто.[/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
      {
        title: 'В ж/б на сотрудников',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Обратитесь в жалобы на сотрудников.[/CENTER]" +
		'[Color=Red][CENTER]Отказано, закрыто.[/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
      {
      title: 'Доква через запрет соц сети',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]3.6. Прикрепление доказательств обязательно.Примечание: загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/CENTER]" +
		'[Color=Red][CENTER]Отказано, закрыто.[/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нету условий сделки',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]В данных доказательствах отсутствуют условия сделки[/CENTER]" +
		'[Color=Red][CENTER]Отказано, закрыто.[/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нету /time',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]На докозательствах отсутствует /time[/CENTER]" +
		'[Color=Red][CENTER]Отказано, закрыто.[/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нужен фрапс',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]В таких случаях нужна видеозапись[/CENTER]" +
		'[Color=Red][CENTER]Отказано, закрыто.[/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нужен фрапс + промотка чата',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]В таких случаях нужна видеозапись + промотка чата.[/CENTER]" +
		'[Color=Red][CENTER]Отказано, закрыто.[/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нужна промотка чата',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]В таких случаях нужна промотка чата.[/CENTER]" +
		'[Color=Red][CENTER]Отказано, закрыто.[/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Неполный фрапс',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Видео запись обрывается. Если есть продолжение, загрузите полную видеозапись на ютуб.[/CENTER]" +
		'[Color=Red][CENTER]Отказано, закрыто.[/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Не работают доква',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Не работают докозательства[/CENTER]<br>" +
		'[Color=Flame][CENTER]Закрыто[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Доква отредактированы',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваши докозательства отредоктированы.[/CENTER]" +
		'[Color=Red][CENTER]Отказано, закрыто.[/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'маты / оск',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]В разделе жалоб запрещается: 2.1. нецензурная брань[/CENTER]<br>" +
        '[Color=Red][CENTER]Отказано, закрыто.[/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'оффтоп',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]В разделе жалоб запрещается: 2.6. сообщения не по теме (Offtop).[/CENTER]<br>" +
        '[Color=Red][CENTER]Отказано, закрыто.[/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'От 3-го лица',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Жалобы от 3-их лиц не принимаются[/CENTER]" +
		'[Color=Red][CENTER]Отказано, закрыто.[/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Ответный ДМ',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]В случае ответного ДМ нужен видиозапись. Пересоздайте тему и прекрепите видиозапись.[/CENTER]" +
		'[Color=Red][CENTER]Отказано, закрыто.[/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Ошиблись сервером / разделом',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Вы ошиблись сервером / разделом, подайте жалобу в нужной для вас теме.[/CENTER]<br>" +
        '[Color=Red][CENTER]Отказано, закрыто.[/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
 title: 'Ссылка на ФА',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Предоставьте ссылку на ФА.<br>" +
		'[Color=orange][CENTER]На рассмотрении...[/I][/CENTER][/color][/FONT]',
      prefix: PINN_PREFIX,
	  status: false,
    },
    {

     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴РП биографии╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
      {
      title: 'био одобрено',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Green]Одобрено.[/I][/CENTER][/color][/FONT]",
      prefix: ODOBRENOBIO_PREFIX,
	  status: false,
    },
    {
      title: 'био на дороботке',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Вам даётся 24 часа на дополнение вашей РП биографии. <br> По истечении даннго времени, РП биография будет закрыта. [/CENTER]",
      prefix: NARASSMOTRENIIBIO_PREFIX,
    },
    {
      title: 'био отказ',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Причиной отказа могло послужить какое-либо нарушение из [URL='https://forum.blackrussia.online/index.php?threads/magenta-Правила-создания-и-форма-role-play-биографии.1210047/']Правила создания и форма Role-Play биографии[/URL].[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
      title: 'Био Скопиравана',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Ваша RolePlay Биография Скоприрована.[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
      title: 'Био заголовок',
      content:
        '[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Причина: Заголовок вашей RolePlay Биографии составлен не по форме. Просьба ознакомиться с [URL='https://forum.blackrussia.online/index.php?threads/magenta-Правила-создания-и-форма-role-play-биографии.1210047/']Правила создания и форма Role-Play биографии. [/URL].[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
      title: 'Био форма',
      content:
        '[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Причина: Ваша RolePlay Биография составлена не по форме. Просьба ознакомиться с [URL='https://forum.blackrussia.online/index.php?threads/magenta-Правила-создания-и-форма-role-play-биографии.1210047/']Правила создания и форма Role-Play биографии. [/URL].[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
	  status: false,

    },
    {
     title: 'Прошло 24ч',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]По истечении 24-ех часов, в РП биографии не произошло изменений.[/CENTER]<br>[color=red] Закрыто.[/color] ",
      prefix: OTKAZRP_PREFIX,
	  status: false,
    },
    {
    title: 'Из англии ник',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Причина: Никнейм в заголовке/теме написан на английском языке. Внимательно изучите [URL='https://forum.blackrussia.online/index.php?threads/magenta-Правила-создания-и-форма-role-play-биографии.1210047/']Правила Role-Play биографий[/URL][/CENTER][/FONT]",
      prefix: OTKAZRP_PREFIX,
	  status: false,
    },
    {
    title: '1 лицо',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Причина: Ваша РП биография написана от 1-го лица. Внимательно изучите [URL='https://forum.blackrussia.online/index.php?threads/magenta-Правила-создания-и-форма-role-play-биографии.1210047/']Правила Role-Play биографий[/URL][/CENTER][/FONT]",
      prefix: OTKAZRP_PREFIX,
	  status: false,
    },
    {
    title: 'Возраст - дата',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Причина: Возраст Вашего персонажа не соответствует дате рождения, что является нелогичным.[/CENTER][/FONT]",
      prefix: OTKAZRP_PREFIX,
	  status: false,
    },
    {
    title: 'возраст - тема',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Причина: Возраст Вашего персонажа не соответствует истории, что является нелогичным.[/CENTER][/FONT]",
      prefix: OTKAZRP_PREFIX,
	  status: false,
    },
    {
    title: 'Некоторые пункты',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Причина:  Незаполнены некоторые пункты.[/CENTER][/FONT]",
      prefix: OTKAZRP_PREFIX,
	  status: false,
    },
    {
    title: 'nrp nick',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Причина: У вас NonRP NickName.[/CENTER][/FONT]",
      prefix: OTKAZRP_PREFIX,
	  status: false,
    },
    {
    title: 'Уже есть рп',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Причина: У Вас уже есть существующая РП биография.[/CENTER][/FONT]",
      prefix: OTKAZRP_PREFIX,
	  status: false,

     },
     {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴РП ситуации╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'РП ситуация одобрено',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП ситуация получает статус: [Color=Green]Одобрено.[/I][/CENTER][/color][/FONT]",
      prefix: ODOBRENORP_PREFIX,
	  status: false,
    },
    {
      title: 'РП ситуация на дороботке',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Вам даётся 24 часа на дополнение вашей РП ситуации[/CENTER]",
      prefix: NARASSMOTRENIIRP_PREFIX,
	  status: false,
    },
    {
      title: 'РП ситуация отказ',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП ситуация получает статус: [Color=Red]Отказано.[/color]<br>Причиной отказа могло послужить какое-либо нарушение из [URL='https://forum.blackrussia.online/index.php?threads/magenta-Правила-role-play-ситуаций.1210123/']Правила Role-Play ситуаций[/URL][/CENTER][/FONT]",
      prefix: OTKAZRP_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Неофициал. орг.╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Неофициальная Орг Одобрено',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП ситуация получает статус: [Color=Green]Одобрено.[/I][/CENTER][/color][/FONT]",
      prefix: ODOBRENOORG_PREFIX,
	  status: false,
    },
    {
      title: 'Неофициальная Орг на дороботке',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Вам даётся 24 часа на дополнение вашей Неофициальная Орг[/CENTER]",
      prefix: NARASSMOTRENIIORG_PREFIX,
	  status: false,
    },
    {
      title: 'Неофициальная Орг отказ',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП ситуация получает статус: [Color=Red]Отказано.[/color]<br>Причиной отказа могло послужить какое-либо нарушение из [URL='https://forum.blackrussia.online/index.php?threads/magenta-Правила-создания-неофициальной-roleplay-организации.1013432/'] создания неофициальной RolePlay организации[/URL].[/CENTER][/FONT]",
      prefix: OTKAZORG_PREFIX,
	  status: false,
    },
   {
      title: 'Неофициальная Орг запроси активности',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
          "[CENTER][B][I][FONT=georgia]Ваша неофициальная РП организация может быть закрыта по пункту правил: Неактив в топике организации более недели, он закрывается. Прекрипите отчёт о активности организации в виде скриншотов. Через 24 часа если отчёта не будет или он будет некорректный организация будет закрыта.[/CENTER]",
              prefix: PINN_PREFIX,
	  status: false,
    },
    {
      title: 'Неофициальная Орг закрытие активности',
      content:
		'[Color=violet][FONT=times mew roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
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