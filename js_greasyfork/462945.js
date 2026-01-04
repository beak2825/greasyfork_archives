// ==UserScript==
// @name         Кураторы форума | Yellow
// @namespace    http://tampermonkey.net/
// @version      2.63
// @description  Скрипт для Кураторов Форума
// @author       Amir Shafigullin
// @match        https://forum.blackrussia.online/index.php?threads/*
// @icon         https://klike.net/uploads/posts/2023-01/1674797344_3-58.jpg
// @grant        none
// @license    AMI
// @downloadURL https://update.greasyfork.org/scripts/462945/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%7C%20Yellow.user.js
// @updateURL https://update.greasyfork.org/scripts/462945/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%7C%20Yellow.meta.js
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
const OJIDANIE_PREFIX = 14;
const OTKAZBIO_PREFIX = 4;
const ODOBRENOBIO_PREFIX = 8;
const NARASSMOTRENIIBIO_PREFIX = 2;
const REALIZOVANO_PREFIX = 5;
const VAJNO_PREFIX = 1;
const PREFIKS = 0;
const KACHESTVO = 15;
const RASSMOTRENO_PREFIX = 9;
const OTKAZRP_PREFIX = 4;
const ODOBRENORP_PREFIX = 8;
const NARASSMOTRENIIRP_PREFIX = 2;
const OTKAZORG_PREFIX = 4;
const ODOBRENOORG_PREFIX = 8;
const NARASSMOTRENIIORG_PREFIX = 2;
const buttons = [
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Правила RolePlay процесса╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'NonRP Поведение',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=times new roman]Игрок будет наказан по пункту правил:<br>2.01. Запрещено поведение, нарушающее нормы процессов Role Play режима игры [Color=#ff0000]| Jail 30 минут[/color]. [/COLOR][/I][/FONT][/CENTER]<br><br>" +
		'[CENTER][Color=#00ff00][FONT=times new roman] Одобрено,закрыто.[/COLOR][/I][/FONT][/CENTER]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Уход от RP',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][FONT=times new roman]Игрок будет наказан по пункту правил:<br>2.02. Запрещено целенаправленно уходить от Role Play процесса всеразличными способами [Color=#ff0000]| Jail 30 минут / Warn[/color]. [/COLOR][/I][/FONT][/CENTER]<br><br>" +
        '[CENTER][I][Color=#00ff00][FONT=times new roman] Одобрено,закрыто.[/COLOR][/I][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'NonRP Вождение',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=times new roman]Игрок будет наказан по пункту правил:<br>2.03. Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере [Color=#ff0000]| Jail 30 минут[/color]. [/COLOR][/FONT][/I][/CENTER]<br><br>" +
        '[CENTER][I][Color=#00ff00][FONT=times new roman] Одобрено,закрыто.[/COLOR][/I][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'NonRP Обман',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=times new roman]Игрок будет наказан по пункту правил:<br>2.05. Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [Color=#ff0000]| PermBan[/color] [/COLOR][/I][/FONT][/CENTER]<br><br>" +
        '[CENTER][I][Color=#00ff00][FONT=times new roman] Одобрено,закрыто.[/COLOR][/I][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Аморальные действия',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=times new roman]Игрок будет наказан по пункту правил:<br>2.08. Запрещена любая форма аморальных действий сексуального характера в сторону игроков [Color=#ff0000]| Jail 30 минут / Warn[/color]. [/COLOR][/I][/FONT][/CENTER]<br><br>" +
        '[CENTER][I][Color=#00ff00][FONT=times new roman] Одобрено,закрыто.[/COLOR][/I][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Слив склада',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=times new roman]Игрок будет наказан по пункту правил:<br>2.09. Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле [Color=#ff0000]| Ban 15 - 30 дней / PermBan[/color]. [/COLOR][/FONT][/I][/CENTER]<br><br>" +
        '[CENTER][I][Color=#00ff00][FONT=times new roman] Одобрено,закрыто.[/COLOR][/I][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'DB',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=times new roman]Игрок будет наказан по пункту правил:<br>2.13. Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [Color=#ff0000] | Jail 60 минут[/color] [/COLOR][/FONT][/I][/CENTER]<br><br>" +
        '[CENTER][I][Color=#00ff00][FONT=times new roman] Одобрено,закрыто.[/COLOR][/I][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'RK',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=times new roman]Игрок будет наказан по пункту правил:<br>2.14. Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти [Color=#ff0000] | Jail 30 минут[/color]. [/COLOR][/I][/FONT][/CENTER]<br><br>" +
        '[CENTER][Color=#00ff00][FONT=times new roman] Одобрено,закрыто.[/COLOR][/I][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'TK',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=times new roman]Игрок будет наказан по пункту правил:<br>2.15. Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины [Color=#ff0000] | Jail 60 минут / Warn (за два и более убийства)[/color] [/COLOR][/FONT][/I][/CENTER]<br><br>" +
        '[CENTER][I][Color=#00ff00][FONT=times new roman] Одобрено,закрыто.[/COLOR][/I][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'SK',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=times new roman]Игрок будет наказан по пункту правил:<br>2.16. Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них [Color=#ff0000] | Jail 60 минут / Warn (за два и более убийства)[/color] [/COLOR][/FONT][/I][/CENTER]<br><br>" +
         '[CENTER][I][Color=#00ff00][FONT=times new roman] Одобрено,закрыто.[/COLOR][/I][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'PG',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=times new roman]Игрок будет наказан по пункту правил:<br>2.17. Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь [Color=#ff0000] | Jail 30 минут [/color] [/COLOR][/I][/FONT][/CENTER]<br><br>" +
        '[CENTER][I][Color=#00ff00][FONT=times new roman] Одобрено,закрыто.[/COLOR][/I][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'MG',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=times new roman]Игрок будет наказан по пункту правил:<br>2.18. Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [Color=#ff0000] | Mute 30 минут [/color] [/COLOR][/FONT][/I][/CENTER]<br><br>" +
        '[CENTER][I][Color=#00ff00][FONT=times new roman] Одобрено,закрыто.[/COLOR][/I][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'DM',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=times new roman]Игрок будет наказан по пункту правил:<br>2.19. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [Color=#ff0000] | Jail 60 минут [/color] [/COLOR][/I][/FONT][/CENTER]<br><br>" +
        '[CENTER][I][Color=#00ff00][FONT=times new roman] Одобрено,закрыто.[/COLOR][/I][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Масс DM',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=times new roman]Игрок будет наказан по пункту правил:<br>2.20. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более [Color=#ff0000] | Warn / Ban 3 - 7 дней [/color] [/COLOR][/FONT][/I][/CENTER]<br><br>" +
        '[CENTER][I][Color=#00ff00][FONT=times new roman] Одобрено,закрыто.[/COLOR][/I][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Чит/Пост. ПО',
      content:
        '[CENTER][I][COLOR=#FFFFFF][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][FONT=times new roman]Игрок будет наказан по пункту правил:<br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ff0000] | Ban 15 - 30 дней / PermBan [/color] [/COLOR][/I][/FONT][/CENTER]<br><br>" +
        '[CENTER][I][Color=#00ff00][FONT=times new roman] Одобрено,закрыто.[/COLOR][/I][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'OОC угрозы',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=times new roman]Игрок будет наказан по пункту правил:<br>2.37. Запрещены OOC угрозы, в том числе и завуалированные [Color=#ff0000] | Mute 120 минут / Ban 7 дней [/color] [/COLOR][/FONT][/I][/CENTER]<br><br>" +
        '[CENTER][I][Color=#00ff00][FONT=times new roman] Одобрено,закрыто.[/COLOR][/I][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Оск проекта',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=times new roman]Игрок будет наказан по пункту правил:<br>2.40. Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [Color=#ff0000] | Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором) [/color] [/COLOR][/I][/FONT][/CENTER]<br><br>" +
        '[CENTER][I][Color=#00ff00][FONT=times new roman] Одобрено,закрыто.[/COLOR][/I][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ЕПП (фура,инко)',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=times new roman]Игрок будет наказан по пункту правил:<br>2.47. Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) [Color=#ff0000] |  Jail 60 минут [/color] [/COLOR][/FONT][/I][/CENTER]<br><br>" +
        '[CENTER][I][Color=#00ff00][FONT=times new roman] Одобрено,закрыто.[/COLOR][/I][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Арест на аукционе',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=times new roman]Игрок будет наказан по пункту правил:<br>2.50. Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона [Color=ff0000] |  Ban 7 - 15 дней + увольнение из организации [/color] [/COLOR][/I][/FONT][/CENTER] <br>" +
        '[CENTER][I][Color=#00ff00][FONT=times new roman] Одобрено,закрыто.[/COLOR][/I][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'NonRP аксессуар',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=times new roman]Игрок будет наказан по пункту правил:<br>2.52. Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. [Color=#ff0000] | При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут [/color] [/COLOR][/I][/FONT][/CENTER]<br><br>" +
        '[CENTER][I][Color=#00ff00][FONT=times new roman] Одобрено,закрыто.[/COLOR][/I][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Оск/неув к адм',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=times new roman]Игрок будет наказан по пункту правил:<br>2.54. Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [Color=#ff0000] | Mute 180 минут [/color] [/COLOR][/I][/FONT][/CENTER]<br><br>" +
        '[CENTER][I][Color=#00ff00][FONT=times new roman] Одобрено,закрыто.[/COLOR][/I][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Сбив аним',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=times new roman]Игрок будет наказан по пункту правил:<br>2.55. Запрещается багоюз связанный с анимацией в любых проявлениях. [Color=#ff0000] | Jail 60 / 120 минут [/color] [/COLOR][/I][/FONT][/CENTER]<br><br>" +
        '[CENTER][I][Color=#00ff00][FONT=times new roman] Одобрено,закрыто.[/COLOR][/I][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
              title: 'Обход системы',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=times new roman] Игроку будет выдано наказание по пункту правил:<br>2.21 Запрещено пытаться обходить игровую систему или использовать любые баги сервера.[Color=#ff0000] | Ban 15 - 30 дней / PermBan [/color] [/COLOR][/FONT][/I][/CENTER]<br><br>" +
        '[CENTER][I][Color=#00ff00][FONT=times new roman] Одобрено,закрыто.[/COLOR][/I][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
              title: 'Реклама(сайт,ютуб)',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=times new roman]Игрок будет наказан по пункту правил:<br>2.31. Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное [Color=#ff0000] | Ban 7 / PermBan [/color] [/COLOR][/I][/FONT][/CENTER] <br>" +
        '[CENTER][I][Color=#00ff00][FONT=times new roman] Одобрено,закрыто.[/COLOR][/I][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Chat ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Разговор не на русском',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=times new roman]Игрок будет наказан по пункту правил:<br>3.01. Общепризнанный язык сервера — русский. Общение в IC чатах во всех Role Play ситуациях обязательно должно проходить исключительно на русском языке [Color=#ff0000] | Устное замечание / Mute 30 минут [/color] [/COLOR][/FONT][/I][/CENTER] <br>" +
            '[CENTER][I][Color=#00ff00][FONT=times new roman] Одобрено,закрыто.[/COLOR][/I][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Caps',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=times new roman]Игрок будет наказан по пункту правил:<br>3.02. Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате [Color=#ff0000] | Mute 30 минут [/color] [/COLOR][/FONT][/I][/CENTER]<br><br>" +
        '[CENTER][I][Color=#00ff00][FONT=times new roman] Одобрено,закрыто.[/COLOR][/I][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Оск в OOC',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=times new roman]Игрок будет наказан по пункту правил:<br>3.03. Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены [Color=#FF0000] | Mute 30 минут [/color] [/COLOR][/FONT][/I][/CENTER]<br><br>" +
        '[CENTER][I][Color=#00ff00][FONT=times new roman] Одобрено,закрыто.[/COLOR][/I][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'оск/упом родни',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=times new roman]Игрок будет наказан по пункту правил:<br>3.04. Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [Color=#FF0000] | Mute 120 минут / Ban 7 - 15 дней [/color] [/COLOR][/FONT][/I][/CENTER]<br><br>" +
        '[CENTER][I][Color=#00ff00][FONT=times new roman] Одобрено,закрыто.[/COLOR][/I][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Flood',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=times new roman]Игрок будет наказан по пункту правил:<br>3.05. Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [Color=#FF0000] | Mute 30 минут [/color] [/COLOR][/I][/FONT][/CENTER]<br><br>" +
        '[CENTER][I][Color=#00ff00][FONT=times new roman] Одобрено,закрыто.[/COLOR][/I][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Злоуп символами',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=times new roman]Игрок будет наказан по пункту правил:<br>3.06. Запрещено злоупотребление знаков препинания и прочих символов [Color=#FF0000] | Mute 30 минут [/color] [/COLOR][/I][/FONT][/CENTER]<br><br>" +
        '[CENTER][I][Color=#00ff00][FONT=times new roman] Одобрено,закрыто.[/COLOR][/I][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Оск в РП чат',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=times new roman]Игрок будет наказан по пункту правил:<br>3.07. Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата [Color=#FF0000] | Mute 30 минут [/color] [/COLOR][/I][/FONT][/CENTER]<br><br>" +
        '[CENTER][I][Color=#00ff00][FONT=times new roman] Одобрено,закрыто.[/COLOR][/I][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Угроза бана',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=times new roman]Игрок будет наказан по пункту правил:<br>3.09. Запрещены любые угрозы о наказании игрока со стороны администрации [Color=#FF0000] | Mute 30 минут [/color] [/COLOR][/FONT][/I][/CENTER]<br><br>" +
        '[CENTER][I][Color=#00ff00][FONT=times new roman] Одобрено,закрыто.[/COLOR][/I][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Выдача себя за администратора',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.10. Запрещена выдача себя за администратора, если таковым не являетесь [Color=#FF0000] | Ban 7 - 15 + ЧС администрации[/color] [/COLOR][/I][/FONT][/CENTER]<br><br>" +
        '[CENTER][I][Color=#00ff00][FONT=times new roman] Одобрено,закрыто.[/COLOR][/I][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Ввод в забл командами',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=times new roman]Игрок будет наказан по пункту правил:<br>3.11. Запрещено введение игроков проекта в заблуждение путем злоупотребления командами [Color=#FF0000] | Ban 15 - 30 дней / PermBan[/color] [/COLOR][/I][/FONT][/CENTER]<br><br>" +
        '[CENTER][I][Color=#00ff00][FONT=times new roman] Одобрено,закрыто.[/COLOR][/I][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Музыка в Voice',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=times new roman]Игрок будет наказан по пункту правил:<br>3.14. Запрещено включать музыку в Voice Chat [Color=#FF0000] | Mute 60 минут [/color] [/COLOR][/FONT][/I][/CENTER] <br>" +
        '[CENTER][I][Color=#00ff00][FONT=times new roman] Одобрено,закрыто.[/COLOR][/I][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'оск/упом род в Voice',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=times new roman]Игрок будет наказан по пункту правил:<br>3.15. Запрещено оскорблять игроков или родных в Voice Chat [Color=#FF0000]| | Mute 120 минут / Ban 7 - 15 дней [/color] [/COLOR][/FONT][/I][/CENTER] <br>" +
        '[CENTER][I][Color=#00ff00][FONT=times new roman] Одобрено,закрыто.[/COLOR][/I][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Шум в Voice',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=times new roman]Игрок будет наказан по пункту правил:<br>3.16. Запрещено создавать посторонние шумы или звуки [Color=#FF0000] | Mute 30 минут [/color] [/COLOR][/I][/FONT][/CENTER] <br>" +
        '[CENTER][I][Color=#00ff00][FONT=times new roman] Одобрено,закрыто.[/COLOR][/I][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'полит/религ пропоганда',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=times new roman]Игрок будет наказан по пункту правил:<br>3.18. Запрещено политическое и религиозное пропагандирование [Color=#FF0000] | Mute 120 минут / Ban 10 дней [/color] [/COLOR][/I][/FONT][/CENTER]<br><br>" +
        '[CENTER][I][Color=#00ff00][FONT=times new roman] Одобрено,закрыто.[/COLOR][/I][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Транслит',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=times new roman]Игрок будет наказан по пункту правил:<br>3.20. Запрещено использование транслита в любом из чатов [Color=#FF0000] | Mute 30 минут [/color] [/COLOR][/I][/FONT][/CENTER]<br><br>" +
        '[CENTER][I][Color=#00ff00][FONT=times new roman] Одобрено,закрыто.[/COLOR][/I][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Реклама промо',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=times new roman]Игрок будет наказан по пункту правил:<br>3.21. Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. [Color=#FF0000] | Ban 30 дней [/color] [/COLOR][/FONT][/I][/CENTER]<br><br>" +
        '[CENTER][I][Color=#00ff00][FONT=times new roman] Одобрено,закрыто.[/COLOR][/I][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Объявления в госс орг',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=times new roman]Игрок будет наказан по пункту правил:<br>3.22. Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) [Color=#FF0000] | Mute 30 минут [/color] [/COLOR][/FONT][/I][/CENTER]<br><br>" +
           '[CENTER][I][Color=#00ff00][FONT=times new roman] Одобрено,закрыто.[/COLOR][/I][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
             title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Передать ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'ГКФ/ЗГКФ',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=times new roman]Ваша жалоба была передана на рассмотрение [Color=#FBA026]Главному Куратору Форума/Заместителю Главного Куратора Форума. [/COLOR][/I][/FONT][/CENTER] <br>" +
        '[FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ожидайте ответа от администрации.[/COLOR][/I][/FONT][/CENTER]<br><br>' +
        '[CENTER][I][FONT=times new roman[COLOR=rgb(250, 197, 28)]На рассмотрение... [/COLOR].[/I][/FONT][/CENTER]',
        prefix: PINN_PREFIX,
	  status: false,
     },
     {
     title: 'На рассмотрение(Себе)',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=times new roman]Ваша жалоба была взята на [Color=#FBA026]рассмотрение.[/Color][/COLOR][/I][/FONT][/CENTER]<br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FBA026]Ожидайте ответа.[/COLOR][/I][/FONT][/CENTER]<br><br>' +
        '[CENTER][I][FONT=times new roman][COLOR=rgb(250, 197, 28)]На рассмотрение... [/COLOR][/I].[/FONT][/CENTER]',
        prefix: PINN_PREFIX,
	  status: false,
     }, 
     {
     title: 'ГС ГОСС',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=times new roman]Ваша жалоба была передана на [Color=#FBA026]рассмотрение ГС ГОСС.[/COLOR][/I][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ожидайте ответа от администрации.[/COLOR][/I][/FONT] [/CENTER]<br>' +
         '[CENTER][FONT=times new roman][ISPOILER]@Stas_Mikhnyk[/FONT][/ISPOILER][/CENTER]', 
        prefix: PINN_PREFIX,
	  status: false,
    },
    {
      title: 'Теху',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=times new roman]Ваша жалоба была передана на рассмотрение [Color=#0000ff]Техническому специалисту. [/COLOR][/I][/FONT][/CENTER] <br>" +
        '[FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ожидайте ответа от администрации.[/COLOR][/I][/FONT][/SIZE][/I][/CENTER]<br>' +
  '[CENTER][COLOR=rgb(250, 197, 28)]Ожидайте ответа...[/COLOR].[/FONT][/CENTER]',
        prefix: TEXY_PREFIX,
	  status: true,
    },
    {
      title: 'ГА',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=times new roman]Ваша жалоба была передана на рассмотрение [Color=#ff0000]Главному Администратору. [/COLOR][/I][/FONT][/CENTER] <br>" +
        '[FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ожидайте ответа от администрации.[/COLOR][/I][/FONT][/CENTER]<br><br>' +
       '[CENTER][I][FONT=times new roman][COLOR=rgb(250, 197, 28)]На рассмотрение... [/COLOR].[/I][/FONT][/CENTER]<br>' +
     '[CENTER][ISPOILER][FONT=times new roman][COLOR=rgb(250, 197, 28)]@Sarra_Svidskaya[/COLOR][/ISPOILER][/FONT][/CENTER]',
        prefix: GA_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴NickName ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'оск ник',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=times new roman]Игрок будет наказан по пункту правил:<br>4.09. Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные) [Color=#FF0000] | Устное замечание + смена игрового никнейма / PermBan [/color] [/COLOR][/FONT][/I][/CENTER] <br>" +
        '[CENTER][I][Color=#00ff00][FONT=times new roman] Одобрено,закрыто.[/COLOR][/I][/FONT][/CENTER]',
   prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Фейк ник',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=times new roman]Игрок будет наказан по пункту правил:<br>4.10. Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию [Color=#FF0000] | Устное замечание + смена игрового никнейма / PermBan [/color] [/COLOR][/I][/FONT][/CENTER] <br>" +
           '[CENTER][I][Color=#00ff00][FONT=times new roman] Одобрено,закрыто.[/COLOR][/I][/FONT][/CENTER]',
   prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴В другой раздел ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'В жб на администратора',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][Color=#FFFFFF][FONT=times new roman]Вы ошиблись разделом.<br>Обратитесь в раздел [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.192/']Жалобы на администрацию[/URL]. [/COLOR][/I][/FONT][/CENTER] <br>" +
                '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано,закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
    prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'В жб на лидера',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#FFFFFF][FONT=courier new]Вы ошиблись разделом.<br>Обратитесь в раздел [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.193/']Жалобы на лидеров[/URL]. [/COLOR][/FONT][/CENTER] <br>" +
                 '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано,закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
   prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'В обжалования',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][Color=#FFFFFF][FONT=times new roman]Вы ошиблись разделом.<br>Обратитесь в раздел [URL='https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.195/']Обжалование наказаний[/URL]. [/COLOR][/FONT][/I][/CENTER] <br>" +
               '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано,закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
     prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Правила госс ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Работа в форме',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=times new roman]Игрок будет наказан по пункту правил:<br>1.07. Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, принадлежащей своей фракции [Color=#FF0000] | Jail 30 минут [/color] [/COLOR][/I][/FONT][/CENTER] <br>" +
        '[CENTER][I][Color=#00ff00][FONT=times new roman] Одобрено,закрыто.[/COLOR][/I][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'т/с в лич целях',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=times new roman]Игрок будет наказан по пункту правил:<br>1.08. Запрещено использование фракционного транспорта в личных целях [Color=#FF0000] | Jail 30 минут [/color] [/COLOR][/I][/FONT][/CENTER] <br>" +
         '[CENTER][I][Color=#00ff00][FONT=times new roman] Одобрено,закрыто.[/COLOR][/I][/FONT][/CENTER]',
     prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Госс в казино',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=times new roman]Игрок будет наказан по пункту правил:<br>1.13. Запрещено находиться в форме внутри казино, а также устраиваться на сторонние работы в форме фракции [Color=#FF0000] | Jail 30 минут [/color] [/COLOR][/FONT][/I][/CENTER] <br>" +
         '[CENTER][I][Color=#00ff00][FONT=times new roman] Одобрено,закрыто.[/COLOR][/I][/FONT][/CENTER]',
     prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Н/П/Р/О (СМИ)',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=times new roman]Игрок будет наказан по пункту правил:<br>4.01. Запрещено редактирование объявлений, не соответствующих ПРО | [Color=#FF0000] | Mute 30 минут [/color] [/COLOR][/I][/FONT][/CENTER] <br>" +
         '[CENTER][I][Color=#00ff00][FONT=times new roman] Одобрено,закрыто.[/COLOR][/I][/FONT][/CENTER]',
     prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Розыск без RP причины',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=times new roman]Игрок будет наказан по пункту правил:<br> 7.02 Запрещено выдавать розыск без Role Play причины [Color=#FF0000] | Warn[/color] [/COLOR][/FONT][/I][/CENTER] <br>" +
         '[CENTER][I][Color=#00ff00][FONT=times new roman] Одобрено,закрыто.[/COLOR][/I][/FONT][/CENTER]',
     prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'NonRP поведение (УМВД)',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br> 6.03 Запрещено nRP поведение [Color=#FF0000] |  Warn [/color] [/COLOR][/FONT][/I][/CENTER] <br>" +
        '[CENTER][I][Color=#00ff00][FONT=times new roman] Одобрено,закрыто.[/COLOR][/I][/FONT][/CENTER]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Забрал права при погоне (ГИБДД)',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=times new roman]Игрок будет наказан по пункту правил:<br> 7.05. Запрещено отбирать водительские права во время погони за нарушителем [Color=#FF0000] |  Warn [/color] [/COLOR][/FONT][/CENTER] <br>" +
         '[CENTER][I][Color=#00ff00][FONT=times new roman] Одобрено,закрыто.[/COLOR][/I][/FONT][/CENTER]',
     prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Правила опг ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'NonRP В/Ч',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=times new roman]Игрок будет наказан по пункту правил:<br> За нарушение правил нападения на Войсковую Часть выдаётся предупреждение [Color=#FF0000] | Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ) [/color] [/COLOR][/I][/FONT][/CENTER] <br>" +
          '[CENTER][I][Color=#00ff00][FONT=times new roman] Одобрено,закрыто.[/COLOR][/I][/FONT][/CENTER]',
    prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Отказ жалобы ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Нарушений не найдено',
      content:
     '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=times new roman]Нарушений со стороны данного игрока не было найдено. [/COLOR][/FONT][/CENTER] <br>" +
               '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано,закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
     prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Недостаточно док-ев',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        '[CENTER][I][COLOR=#FFFFFF][FONT=times new roman]Недостаточно доказательств на нарушение от данного игрока. [/COLOR][/I][/FONT][/CENTER] <br>' +
               '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано,закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
     prefix: UNACCСEPT_PREFIX,
	  status: false
    },
    {
      title: 'Дублирование',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=times new roman]Дублирование темы.<br>Если вы дальше будете заниматься данной деятельностью (дублированием тем), то ваш форумный аккаунт будет заблокирован. [/I][/FONT][/CENTER] <br>" +
               '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано,закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
     prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Не по форме',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=times new roman]Ваша жалоба составлена не по форме.<br>Убедительная просьба ознакомиться с [URL='https://forum.blackrussia.online/index.php?threads/yellow-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.193395/'] правилами подачи жалоб на игроков[/URL]. [/FONT][/CENTER] <br>" +
		"[CENTER][I][FONT=times new roman] И впредь не нарушать данные правила. [/COLOR][/FONT][/I][/CENTER] <br>" +
              '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано,закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нету /time',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=times new roman]На ваших доказательствах отсутствует[Color=#FAC51C] /time.[/Color] [/COLOR][/I][/FONT][/CENTER] <br>" +
               '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано,закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
     prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Укажите таймкоды',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=times new roman]Ваше видеодоказательство длится более 3-х минут, поэтому укажите тайм-коды нарушения. [/COLOR][/I][/FONT][/CENTER] <br>" +
            '[CENTER][COLOR=rgb(250, 197, 28)]Отказано ,закрыто. [/COLOR]. [/FONT][/SIZE][/CENTER]',
     prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Более 72-х часов',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=times new roman]Срок написания жалобы составляет три дня (72 часа) с момента совершенного нарушения со стороны игрока. [/COLOR][/FONT][/I][/CENTER] <br>" +
               '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано,закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
     prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Док-ва соц сеть',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=times new roman]Загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur). [/COLOR][/FONT][/I][/CENTER] <br>" +
              '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано,закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нету условий сделки',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=times new roman]В ваших доказательствах отсутствуют условия сделки. [/COLOR][/I][/FONT][/CENTER] <br>" +
              '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано,закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нужна видеофиксация ',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=times new roman]В таких случаях нужна видеофиксация нарушения. [/COLOR][/I][/FONT][/CENTER] <br>" +
              '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано,закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Видео обрывается',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=times new roman]Ваше видео обрывается, загрузите полное видео на YouTube. [/COLOR][/I][/FONT][/CENTER] <br>" +
               '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано,закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
     prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Не работают док-ва',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=times new roman]Доказательства не работают, прикрепите в следующей жалобе рабочие доказательства. [/COLOR][/FONT][/I][/CENTER] <br>" +
              '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано,закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нет док-ев',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=times new roman]В вашей жалобе отсутствуют доказательства. [/COLOR][/I][/FONT][/CENTER] <br>" +
              '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано,закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Док-ва отредактированы',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=times new roman]Ваши доказательства отредактированы. Доказательство должны быть предоставлены в первоначальном виде. [/COLOR][/I][/FONT][/CENTER]}<br><br>" +
              '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано,закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Жалоба от 3-го лицо',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=times new roman]Жалоба от третьего лица не принимается (жалоба должна быть подана участником ситуации). [/COLOR][/I][/FONT][/CENTER] <br>" +
                ',[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано,закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
    prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Дал в долг',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=times new roman]Долг - это РП процесс и администрация не несет за него ответственность. [/COLOR][/I][/FONT][/CENTER]<br><br>" +
               '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано,закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
     prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Ошиблись сервером',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        '[CENTER][I][Color=#FFFFF][QUOTE][FONT=courier new]Вы ошиблись сервером. Обратитесь в раздел жалоб своего сервера. [/COLOR][/I][/QUOTE][/FONT][/CENTER] <br>' +
               ',[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано,закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
   prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴RolePlay биографии ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Био одобрена',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        '[CENTER][I][Color=#FFFFFF][FONT=times new roman] Ваша РП биография получает статус - [Color=#00FF00]Одобрено[/color][/I][/FONT][/CENTER]',
     prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Био на доработке',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=FFFFFF][FONT=times new roman]Вам даётся 24 часа на дополнение вашей РП биографии, в противном случае она получит статус - [Color=#FF0000]Отказано[/color][/I][/COLOR][/FONT][/CENTER] <br>"+
         '[CENTER][COLOR=rgb(250, 197, 28)]На доработке...[/COLOR]. [/FONT][/SIZE][/CENTER]',
        prefix: PINN_PREFIX,
    },
    {
      title: 'Био отказ (форма)',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][COLOR=#FFFFFF][FONT=times new roman]Ваша РП биография получает статус - [Color=#FF0000]Отказано[/color].<br>РП биография составлена не по форме. [/COLOR][/I][/FONT][/CENTER] <br>"+
              '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано,закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
   prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Био отказ (не дополнил)',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][Color=#FFFFFF][FONT=times new roman]Ваша РП биография получает статус - [Color=#FF0000]Отказано[/color].<br>Причиной отказа послужило - Не дополнили биографию в течение 24-х часов. [/COLOR][/I][/FONT][/CENTER] <br>"+
            '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано,закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
     prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
              title: 'Био отказ (Мало инфы)',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][I][Color=#FFFFFF][FONT=times new roman]Ваша РП биография получает статус - [Color=#FF0000]Отказано[/color].<br>В вашей РП биографии мало информации. [/COLOR][/I][/FONT][/CENTER] <br>"+
            '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано,закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
     prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Био отказ (Украдена)',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        '[CENTER][I][Color=#FFFFFF][FONT=times new roman]Ваша РП биография получает статус - [Color=#FF0000]Отказано[/color].<br>РП биография украдена. [/COLOR][/I][/FONT][/CENTER]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Био отказ (заголовок)',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        '[CENTER][I][Color=#FFFFFF][FONT=times new roman]Ваша РП биография получает статус - [Color=#FF0000]Отказано[/color].<br>Заголовок темы составлен неверно. [/COLOR][/I][/FONT][/CENTER]',
    prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Био отказ (3-е лицо)',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        '[CENTER][I][Color=#FFFFFF][FONT=courier new]Ваша РП биография получает статус - [Color=#FF0000]Отказано[/color].<br>Ваша РП биография написана от 3-го лица. [/COLOR][/FONT][/CENTER]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Био отказ (возраст несовпадает)',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        '[CENTER][I][Color=#FFFFFF][FONT=times new roman]Ваша РП биография получает статус - [Color=#FF0000]Отказано[/color].<br>Возраст персонажа и дата рождения не совпадает. [/COLOR][/I][/FONT][/CENTER]',
     prefix: UNACCСEPT_PREFIX,
	  status: false,
            },
    {
              title: 'Био отказ (Нет 18-ти лет)',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        '[CENTER][I][Color=#FFFFFF][FONT=courier new]Ваша РП биография получает статус - [Color=#FF0000]Отказано[/color].<br>Минимальный возраст персонажа для составления биографии - 18 лет. [/COLOR][/I][/FONT][/CENTER]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
            },
    {
      title: 'Био отказ (Грамм ошибки)',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        '[CENTER][I][Color=#FFFFFF][FONT=times new roman]Ваша РП биография получает статус - [Color=#FF0000]Отказано[/color].<br>В вашей биографии допущено много грамматических ошибок. [/COLOR][/FONT][/CENTER]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
        {
         title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴RolePlay ситуациии ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Одобрено',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        '[CENTER][I][Color=#FFFFFF][FONT=times new roman] Ваша РП ситуация получает статус - [Color=#00FF00]Одобрено[/color][/COLOR][/I][/FONT][/CENTER]',
 
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Не по форме',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        '[CENTER][I][Color=#FFFFFF][FONT=courier new]Ваша РП ситуация получает статус - [Color=#FF0000]Отказано[/color].<br>Причиной отказа послужило написание ситиации не по форме. [/COLOR][/I][/FONT][/CENTER]',
    prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
              title: 'Мало инфы',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        '[CENTER][I][Color=#FFFFFF][FONT=courier new]Ваша РП биография получает статус - [Color=#FF0000]Отказано[/color].<br>В вашей РП ситуации мало информации. [/COLOR][/I][/FONT][/CENTER]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
  ];
 
  $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
    // Добавление кнопок при загрузке страницы
    addButton('На рассмотрение💫', 'pin');
    addButton('ГА', 'Ga');
    addButton('Одобрено', 'accepted');
    addButton('Отказано', 'unaccept');
    addButton('Теху', 'Texy');
    addButton('Закрыто', 'Zakrito');
    addButton('Ожидание', 'Ojidanie');
    addButton('Ответы❇️', 'selectAnswer');
 
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
    $('button#Realizovano').click(() => editThreadData(REALIZOVANO_PREFIX, false));
    $('button#Vajno').click(() => editThreadData(VAJNO_PREFIX, false));
    $('button#Rassmotreno').click(() => editThreadData(RASSMOTRENO_PREFIX, false));
    $('button#Ojidanie').click(() => editThreadData(OJIDANIE_PREFIX, false));
    $('button#Prefiks').click(() => editThreadData(PREFIKS, false));
    $('button#Kachestvo').click(() => editThreadData(KACHESTVO, false));
 
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