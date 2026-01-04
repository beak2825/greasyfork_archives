// ==UserScript==
// @name    Script
// @description  Suggestions for improving the script write here ---> https://vk.com/saidbublikov
// @description:ru Предложения по улучшению скрипта писать сюда ---> https://vk.com/saidbublikov
// @version 3.4.6
// @namespace https://forum.crime-russia.ru
// @match        https://forum.crime-russia.ru/index.php?threads/*
// @include      https://forum.crime-russia.ru/index.php?threads/
// @grant        none
// @license    MIT
// @supportURL https://vk.com/m4rittka
// @icon https://emoji.gg/assets/emoji/9372-blurple-boost-level-9.png
// @downloadURL https://update.greasyfork.org/scripts/477095/Script.user.js
// @updateURL https://update.greasyfork.org/scripts/477095/Script.meta.js
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
      content: '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER]<br>' + '[CENTER]  [/CENTER][/FONT]',
    },
     {
      title: 'Отказано, закрыто',
      content: '[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color]' + '[CENTER]  [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Одобрено, закрыто',
      content: '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color]' + '[CENTER]  [/CENTER]',
      prefix: ACCСEPT_PREFIX,
     status: false,
    },
    {
      title: 'На рассмотрении...',
      content: '[Color=Orange][CENTER]На рассмотрении.[/CENTER][/color]' + '[CENTER]  [/CENTER]',
      prefix: WATCHED_PREFIX,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Правила Role Play процесса ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Нонрп поведение',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][FONT=Times new roman][B]Нарушитель будет наказан по пункту правил: [Color=Red]2.01[/COLOR]. Запрещено поведение, нарушающее нормы процессов Role Play режима игры | [Color=Red]Jail 60 минут [/color][/FONT][/B][/CENTER] " +
        '[Color=Lime][CENTER]Одобрено, закрыто[/color].<br> ' +
        "[CENTER] Приятной игры на [Color=Red]Crime Russia [/CENTER][/color][/FONT]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Уход от РП',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:[Color=Red]2.02[/COLOR]. Запрещено целенаправленно уходить от Role Play процесса всеразличными способами | [Color=Red]Warn[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Crime Russia[/CENTER][/color][/FONT]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Нонрп вождение',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.03[/color]. Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере | [Color=Red]Jail 30 минут[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Crime Russia [/CENTER][/color][/FONT]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
        {
      title: 'NonRP Обман',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.05[/color]. Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики | [Color=Red]PermBan[/color].[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Crime Russia [/CENTER][/color][/FONT]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Аморал действия',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.08[/color]. Запрещена любая форма аморальных действий сексуального характера в сторону игроков | [Color=Red]Jail 30 минут / Warn[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Crime Russia [/CENTER][/color][/FONT]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Слив склада',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.09[/color]. Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле | [Color=Red]Ban 15 - 30 дней / PermBan[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color]<br>' +
        "[CENTER] Приятной игры на [Color=Red]Crime Russia [/CENTER][/color][/FONT]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'ДБ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.13[/color]. Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта | [Color=Red]Jail 60 минут / Jail 30 минут[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Crime Russia [/CENTER][/color][/FONT]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'РК',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.14[/color]. Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти | [Color=Red]Jail 60 минут[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Crime Russia [/CENTER][/color][/FONT]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'ТК',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.15[/color]. Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины | [Color=Red]Jail 60 минут / Warn[/color] ([Color=Orange]за два и более убийства[/color])[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Crime Russia [/CENTER][/color][/FONT]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'СК',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.16[/color]. Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них | [Color=Red]Jail 60 минут / Warn[/color] ([Color=Orange]за два и более убийства[/color]).[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Crime Russia [/CENTER][/color][/FONT]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'ПГ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.17[/color]. Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь | [Color=Red]Jail 30 минут[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Crime Russia [/CENTER][/color][/FONT]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'MG',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.18[/color]. Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе | [Color=Red]Mute 30 минут[/color].[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Crime Russia [/CENTER][/color][/FONT]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
        {
      title: 'ДМ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.19[/color]. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины | [Color=Red]Jail 60 минут[/color].[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Crime Russia [/CENTER][/color][/FONT]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Масс ДМ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.20[/color]. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более | [Color=Red]Warn / Ban 7 дней[/color].[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color]<br>' +
        "[CENTER] Приятной игры на [Color=Red]Crime Russia [/CENTER][/color][/FONT]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
        {
      title: 'Сторонне ПО',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][FONT=Times new roman][B][I]Нарушитель будет наказан по пункту правил: [Color=Red]2.22[/color]. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками | [Color=Red] Ban 15 - 30 дней / PermBan + ЧСП[/color] <br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Crime Russia [/CENTER][/color][/FONT]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Реклама сторонние ресурсы',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.31[/color]. Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное | [Color=Red]Ban 15 дней / PermBan[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Crime Russia [/CENTER][/color][/FONT]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Оск адм',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.32[/color]. Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта | [Color=Red]Ban 7 - 30 дней[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Crime Russia [/CENTER][/color][/FONT]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Уяз.правил',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.33[/color]. Запрещено пользоваться уязвимостью правил | [Color=Red]Ban 15 дней[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Crime Russia [/CENTER][/color][/FONT]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Уход от наказания',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.34[/color]. Запрещен уход от наказания | [Color=Red]Ban 15 - 30 дней[/color]([Color=Orange]суммируется к общему наказанию дополнительно[/color])[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Crime Russia [/CENTER][/color][/FONT]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'IC и OCC угрозы',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.35[/color]. На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате | [Color=Red]Mute 120 минут / Ban 7 дней[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Crime Russia [/I][/CENTER][/color][/FONT]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'IC конфликты в OOC',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.36[/color]. Запрещено переносить конфликты из IC в OOC и наоборот | [Color=Red]Warn[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Crime Russia [/CENTER][/color][/FONT]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
     {
      title: 'Угрозы OOC',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пункту правил: [Color=Red]2.37[/color]. Запрещены OOC угрозы, в том числе и завуалированные | [Color=Red]Mute 120 минут / Ban 7 дней [/color]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER]Приятной игры на [Color=Red]Crime Russia [/CENTER][/color][/FONT][/B]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Злоуп наказаниями',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][FONT=Times new roman]Нарушитель будет наказан по пункту правил: [Color=Red]2.39[/color]. Злоупотребление нарушениями правил сервера | [Color=Red]Ban 7 - 30 дней [/color][/CENTER]" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Crime Russia [/CENTER][/color][/FONT]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Оск проекта',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.40[/color]. Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе | [Color=Red]Mute 300 минут / Ban 30 дней[/color] ([Color=Cyan]Ban выдается по согласованию с главным администратором[/color])[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Crime Russia [/CENTER][/color][/FONT]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Продажа промо',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.43[/color]. Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций | [Color=Red]Mute 120 минут[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Crime Russia [/CENTER][/color][/FONT]",
    },
    {
      title: 'ЕПП Фура',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.47[/color]. Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) | [Color=Red]Jail 60 минут[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Crime Russia [/CENTER][/color][/FONT]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Покупка фам.репы',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.48[/color]. Продажа или покупка репутации семьи любыми способами, скрытие нарушителей, читеров лидером семьи. | [Color=Red]Обнуление семьи / Обнуление игрового аккаунта лидера семьи[/color]<br>" +
        "[CENTER][Color=Orange]Примечание[/color]: скрытие информации о продаже репутации семьи приравнивается к [Color=Red]пункту правил 2.24.[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Crime Russia [/CENTER][/color][/FONT]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Помеха РП процессу',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.51[/color]. Запрещено вмешательство в Role Play процесс с целью помехи и препятствования дальнейшего развития Role Play процесса | [Color=Red]Warn[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Crime Russia [/CENTER][/color][/FONT]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Нонрп акс',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.52[/color]. Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. | [Color=Red]При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Crime Russia [/CENTER][/color][/FONT]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: '2.53(Названия маты)',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.53[/color]. Запрещено устанавливать названия для внутриигровых ценностей с использованием нецензурной лексики, оскорблений, слов политической или религиозной наклонности | [Color=Red]Ban 1 день / При повторном нарушении обнуление бизнеса[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Crime Russia [/CENTER][/color][/FONT]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Неув обр. к адм',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.54[/color]. Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации | [Color=Red]Mute 180 минут[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color]<br>' +
        "[CENTER] Приятной игры на [Color=Red]Crime Russia [/CENTER][/color][/FONT]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Баг аним',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.55[/color]. Запрещается багоюз связанный с анимацией в любых проявлениях. | [Color=Red]Jail 60 / 120 минут [/color]<br>" +
            "[Color=Orange]Пример[/color]: если Нарушитель, используя баг, убирает ограничение на использование оружия в зеленой зоне, сбивает темп стрельбы, либо быстро перемещается во время войны за бизнес или во время перестрелки на мероприятии с семейными контейнерами, последует наказание в виде [Color=Red]Jail на 120 минут[/COLOR]. <br>" +
                "Данное наказание используется в случаях, когда, используя ошибку, было получено преимущество перед другими игроками. <br>" +
                    "[Color=Orange]Пример[/color]: если Нарушитель использует баги, связанные с анимацией, и при этом не влияет на игровой процесс других игроков, а также не получает преимущество перед другими игроками, последует наказание в виде [Color=Red]Jail на 60 минут[/color].[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Crime Russia [/CENTER][/color][/FONT]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Игровые чаты​ ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Транслит',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.01[/color]. Общепризнанный язык сервера — русский. Общение в IC чатах во всех Role Play ситуациях обязательно должно проходить исключительно на русском языке | [Color=Red]Устное замечание / Mute 30 минут[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER]<br>' +
        "[CENTER] Приятной игры на [Color=Red]Crime Russia [/CENTER][/color][/FONT]",

      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Капс',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.02[/color]. Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате | [Color=Red]Mute 30 минут[/color].[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color]<br>' +
        "[CENTER] Приятной игры на [Color=Red]Crime Russia [/CENTER][/color][/FONT]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Оск в ООС',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.03[/color]. Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены | [Color=Red]Mute 30 минут[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br> '+
        "[CENTER] Приятной игры на [Color=Red]Crime Russia [/CENTER][/color][/FONT]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Оск/Упом родни',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:[Color=Red]3.04[/color]. Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) | [Color=Red]Mute 120 минут / Ban 7 - 15 дней[/color].[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Crime Russia [/CENTER][/color][/FONT]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Флуд',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.05[/color]. Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока | [Color=Red]Mute 30 минут[/color].[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Crime Russia [/CENTER][/color][/FONT]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Злоуп знаками',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.06[/color]. Запрещено злоупотребление знаков препинания и прочих символов | [Color=Red]Mute 30 минут[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br> '+
        "[CENTER] Приятной игры на [Color=Red]Crime Russia [/CENTER][/color][/FONT]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Оскорбление',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.07[/color]. Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата | [Color=Red]Mute 30 минут[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Crime Russia [/CENTER][/color][/FONT]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Слив СМИ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.08[/color]. Запрещены любые формы «слива» посредством использования глобальных чатов | [Color=Red]PermBan[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Crime Russia [/CENTER][/color][/FONT]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Угрозы о наказании со стороны адм',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=Times new roman]Нарушитель будет наказан по пункту правил: [Color=Red]3.09[/color]. Запрещены любые угрозы о наказании игрока со стороны администрации | [Color=Red]Mute 30 минут[/color]. <br>" +
        "[CENTER][Color=Lime]Одобрено, закрыто[/I][/B][/CENTER] <br>" +
        "[CENTER][DON'T=Times new roman]Приятной игры на [Color=Red]Crime Russia [/CENTER][/color][/FONT]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Выдача себя за адм ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.10[/color]. Запрещена выдача себя за администратора, если таковым не являетесь | [Color=Red]Ban 7 - 15 + ЧС администрации[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Crime Russia [/CENTER][/color][/FONT]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Ввод в заблуждение',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил [Color=Red]3.11[/color]. Запрещено введение игроков проекта в заблуждение путем злоупотребления командами | [Color=Red]Ban 15 - 30 дней / PermBan[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Crime Russia [/CENTER][/color][/FONT]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
     title: 'Репорт Капс + Оффтоп + Транслит',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.12[/color]. Запрещено подавать репорт написанный транслитом, с сообщением не по теме (Offtop), с включенным Caps Lock и повторять обращение (если ответ был уже дан ранее) | [Color=Red]Report Mute 30 минут[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Crime Russia [/CENTER][/color][/FONT]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
     {
      title: 'Музыка в войс',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER][{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.14[/color]. Запрещено включать музыку в Voice Chat | [Color=Red]Mute 60 минут[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Crime Russia [/CENTER][/color][/FONT]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Оск/Упом род в войс',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.15[/color]. Запрещено оскорблять игроков или родных в Voice Chat | [Color=Red]Mute 120 минут / Ban 7 - 15 дней[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br> '+
        "[CENTER] Приятной игры на [Color=Red]Crime Russia [/CENTER][/color][/FONT]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Шум в войс',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.16[/color]. Запрещено создавать посторонние шумы или звуки | [Color=Red]Mute 30 минут[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Crime Russia [/CENTER][/color][/FONT]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Реклама в VOICE',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.17[/color]. Запрещена реклама в Voice Chat не связанная с игровым процессом | [Color=Red]Ban 7 - 15 дней[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Crime Russia [/CENTER][/color][/FONT]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Религиозное и политическая пропоганда',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.18[/color]. Запрещено политическое и религиозное пропагандирование | [Color=Red]Mute 120 минут / Ban 10 дней[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br> '+
        "[CENTER] Приятной игры на [Color=Red]Crime Russia [/CENTER][/color][/FONT]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Реклама промо',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.21[/color]. Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. | [Color=Red]Ban 30 дней[/color].[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Crime Russia [/CENTER][/color][/FONT]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Торговля на тт госс',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.22[/color]. Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) | [Color=Red]Mute 30 минут[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br> '+
        "[CENTER] Приятной игры на [Color=Red]Crime Russia [/CENTER][/color][/FONT]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Положение об игровых аккаунтах ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Мультиаккаунт (3+)',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]4.04[/color]. Разрешается зарегистрировать максимально только три игровых аккаунта на сервере | [Color=Red]PermBan[/color].<br>" +
            "[Color=Orange]Примечание[/color]: блокировке подлежат все аккаунты созданные после третьего твинка.[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Фейк аккаунт',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]4.10[/color]. Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию | [Color=Red]Устное замечание + смена игрового никнейма / PermBan[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Активность ТК',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br>4.14. Запрещено, имея транспортную или строительную компанию не проявлять активность в игре. | [Color=Red]Обнуление компании без компенсации[/color][/CENTER]<br>" +
            "[Color=Orange]Примечание[/color]: минимальный онлайн для владельцев строительных и транспортных компаний — 7 часов в неделю активной игры (нахождение в nRP сне не считается за активную игру).<br>" +
            "[Color=Orange]Примечание[/color]: если не заходить в игру в течении 5-ти дней, не чинить транспорт в ТК, не проявлять активность в СК - компания обнуляется автоматически.<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Передачи жалобы ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Техническому специалисту',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба была передана на рассмотрение техническому специалисту.[/CENTER]<br>" +
        '[Color=Flame][CENTER]Ожидайте ответа.[/CENTER][/color][/FONT]',
      prefix: TEXY_PREFIX,
      status: true,
    },
    {
      title: 'Передано ГА',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба была передана на рассмотрение Главному Администратору.[/CENTER]<br>" +
        '[Color=Flame][CENTER]Ожидайте ответа.[/CENTER][/color][/FONT]',
      prefix: GA_PREFIX,
      status: true,
    },
    {
      title: 'Спец.администратору',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба была передана на рассмотрение Специальному администратору.[/CENTER]<br>" +
        '[Color=Flame][CENTER]Ожидайте ответа.[/CENTER][/color][/FONT]',
      prefix: SPECY_PREFIX,
      status: true,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Правила Гос.Структур╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Прогул Р/Д',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил: [Color=Red]1.07[/color]. Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, принадлежащей своей фракции | [Color=Red]Jail 30 минут[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Исп. фрак т/с в личных целях',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил: [Color=Red]1.08[/color]. Запрещено использование фракционного транспорта в личных целях | [Color=Red]Jail 30 минут[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'ДМ/Масс дм от МО',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил: [Color=Red]2.02[/color]. Наносить урон игрокам, которые находятся вне территории воинской части, запрещено | [Color=Red]Jail 30 минут / Warn[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Н/П/Р/О (Объявы)',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил: [Color=Red]4.01[/color]. Запрещено редактирование объявлений, не соответствующих ПРО | [Color=Red]Mute 30 минут[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Н/П/П/Э (Эфиры)',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил: [Color=Red]4.02[/color]. Запрещено проведение эфиров, не соответствующих Role Play правилам и логике | [Color=Red]Mute 30 минут[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'ДМ/Масс от УМВД',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил: [Color=Red]6.01[/color]. Запрещено наносить урон игрокам без Role Play причины на территории УМВД | [Color=Red]Jail 30 минут / Warn[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Розыск без причины(УМВД)',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил: [Color=Red]6.02[/color]. Запрещено выдавать розыск без Role Play причины | [Color=Red]Jail 30 минут[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Задержание без РП(Нонрп коп)(УМВД)',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил: [Color=Red]6.03[/color]. Запрещено оказывать задержание без Role Play отыгровки | [Color=Red]Warn[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Нонрп поведение(УМВД)',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил: [Color=Red]6.04[/color]. Запрещено nRP поведение | [Color=Red]Warn[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'ДМ/Масс от ГИБДД',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил: [Color=Red]7.01[/color]. Запрещено наносить урон игрокам без Role Play причины на территории ГИБДД | [Color=Red]Jail 30[/color] минут / Warn[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Штраф без рп(ГИБДД)',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил: [Color=Red]7.02[/color]. Запрещено выдавать розыск, штраф без Role Play причины | [Color=Red]Jail 30 минут[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Розыск без причины(ГИБДД)',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил: [Color=Red]6.02[/color]. Запрещено выдавать розыск без Role Play причины | [Color=Red]Jail 30 минут[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Задержание без РП(Нонрп коп)(ГИБДД)',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил: [Color=Red]7.03[/color]. Запрещено оказывать задержание без Role Play отыгровки | [Color=Red]Warn[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Забирание В/У во время погони(ГИБДД)',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил: [Color=Red]7.05[/color]. Запрещено отбирать водительские права во время погони за нарушителем | [Color=Red]Warn[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'ДМ/Масс от УФСБ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил: [Color=Red]8.01[/color]. Запрещено наносить урон игрокам без Role Play причины на территории ФСБ | [Color=Red]Jail 30 минут / Warn[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Розыск без причины(УФСБ)',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил: [Color=Red]8.02[/color]. Запрещено выдавать розыск без Role Play причины | [Color=Red]Jail 30 минут[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Задержание без РП(Нонрп коп)(УФСБ)',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил: [Color=Red]8.03[/color]. Запрещено оказывать задержание без Role Play отыгровки | [Color=Red]Warn[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Задержание без РП(Нонрп коп)(ФСИН)',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил: [Color=Red]9.01[/color]. Запрещено наносить урон игрокам без Role Play причины на территории ФСИН | [Color=Red]Jail 30 минут / Warn[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Правила ОПГ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Нарушение правил В/Ч',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил: За нарушение правил нападения на [Color=Orange]Войсковую Часть[/color] выдаётся предупреждение | [Color=Red]Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ)[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Нападение на В/Ч через стену',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил: Нападение на [Color=Orange]военную часть[/color] разрешено только через блокпост КПП с последовательностью взлома | [Color=Red]Warn NonRP В/Ч[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Похищение/Ограбления нарушение правил',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан за Нонрп Ограбление\Похищениее в соответствии с этими правилами [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BE%D0%B3%D1%80%D0%B0%D0%B1%D0%BB%D0%B5%D0%BD%D0%B8%D0%B9-%D0%B8-%D0%BF%D0%BE%D1%85%D0%B8%D1%89%D0%B5%D0%BD%D0%B8%D0%B9.29/']Кликабельно[/URL][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Отсутствие пунка жалоб╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Нарушений не найдено',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушений со стороны данного игрока не было найдено.[/CENTER]<br>" +
        '[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Недостаточно доказательств',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Недостаточно доказательств на нарушение от данного игрока. Доказательства должны быть предоставлены в хорошем качестве и с полным процессом сделки или нарушения от какого-либо игрока.[/CENTER]<br>" +
        '[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Дублирование темы',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Дублироване темы. Если вы дальше будете заниматься данной деятельностью (дублированием тем), то ваш форумный аккаунт будет заблокирован на 3 дня и более.[/CENTER]<br>" +
        '[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'В жалобы на адм',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Вы ошиблись разделом. Обратитесь в раздел [Color=Red]Жалобы на администрацию[/color].[/CENTER]<br>" +
        '[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'В обжалования',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Вы ошиблись разделом. Обратитесь в раздел [Color=Red]Обжалование наказаний[/color].[/CENTER]<br>" +
        '[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Форма темы',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба составлена не по форме. Убедительная просьба ознакомиться [Color=Red]с правилами подачи жалоб на игроков[/color].[/CENTER]<br>" +
        '[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Нету /time',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]На ваших доказательствах отсутствует /time.[/CENTER]<br>" +
        '[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Требуются TimeCode',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба отказана, т.к в ней нету таймкодов. Если видео длится больше 3-ех минут - Вы должны указать таймкоды нарушений.[/CENTER]<br>" +
        '[Color=Red][CENTER]Отказано[/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Жалоба на рассмотрении',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба взята на рассмотрение.<br>Просьба ожидать ответа и не создавать дубликаты данной темы.[/CENTER]<br>" +
        '[Color=Flame][CENTER]Ожидайте ответа.[/CENTER][/color][/FONT]',
      prefix: PINN_PREFIX,
      status: false,
    },
      {
      title: 'Заголовок не по форме',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][FONT=Times new roman]Заголовок вашей жалобы составлен не по форме. Убедительная просьба ознакомиться [Color=Red]с правилами подачи жалоб на игроков[/color].[/CENTER]" +
        '[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
      {
      title: 'Более 72 часов',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][FONT=Times new roman]С момента получения наказания прошло более 72 часов[/CENTER]" +
        '[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
      {
      title: 'Доква через запрет соц сети',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=Times new roman]3.6. Прикрепление доказательств обязательно. <br>" +
            "[Color=Orange]Примечание[/color]: загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/CENTER]" +
        '[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Нету условий сделки',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][FONT=Times new roman]В данных доказательствах отсутствуют условия сделки[/CENTER]" +
        '[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Нету /time',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][FONT=Times new roman]На докозательствах отсутствует /time[/CENTER]" +
        '[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Нужен фарпс',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][FONT=Times new roman]В таких случаях нужнен фрапс[/CENTER]" +
        '[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Нужен фарпс + промотка чата',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][FONT=Times new roman]В таких случаях нужен фрапс + промотка чата.[/CENTER]" +
        '[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Нужна промотка чата',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][FONT=Times new roman]В таких случаях нужна промотка чата.[/CENTER]" +
        '[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Неполный фрапс',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][FONT=Times new roman]Фрапс обрывается. Загрузите полный фрапс на ютуб.[/CENTER]" +
        '[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Не работают доква',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Не работают докозательства[/CENTER]<br>" +
        '[Color=Flame][CENTER]Закрыто[/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Доква отредактированы',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][FONT=Times new roman]Ваши докозательства отредоктированы.[/CENTER]" +
        '[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'От 3-го лица',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][FONT=Times new roman]Жалобы от 3-их лиц не принимаются[/CENTER]" +
        '[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Ответный ДМ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][FONT=Times new roman]В случае ответного ДМ нужен видиозапись. Пересоздайте тему и прекрепите видиозапись.[/CENTER]" +
        '[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Ошиблись разделом',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Вы ошиблись сервером/разделом, переподайте жалобу в нужный раздел.[/CENTER]<br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Док-ва не рабочие',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваши доказательства не рабочие/обрезаные, перезалейте их правильно и без обрезаний.[/CENTER]<br>" +
        '[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Фотохостинги',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Доказательства должны быть загружены на Yapx/Imgur/YouTube.[/CENTER]<br>" +
        '[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
        {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴РП биографии╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
      {
      title: 'био одобрено',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Lime]Одобрено.[/CENTER][/color][/FONT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
    },
    {
      title: 'био на дороботке',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][FONT=Times new roman]Вам даётся 24 часа на дополнение вашей РП биографии, в случае если РП Био не требует доработки, напишите об этом данную тему.[/CENTER]",
      prefix: NARASSMOTRENIIBIO_PREFIX,
    },
    {
      title: 'био отказ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Причиной отказа могло послужить какое-либо нарушение из Правила написания RP биографии.[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
      title: 'био отказ(заголовок темы)',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Причиной отказа могло послужить неправильное заполнение загловка темы. Ознакомьтесь с правилам подачи .[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
      title: 'био отказ(3е лицо)',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Причиной отказа могло послужить создание биографии от 3го лица.[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
      title: 'био отказ(Ошибки)',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Причиной отказа могло послужить большое количество грамматических ошибок.[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
      title: 'био отказ(Возраст и Дата)',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Причиной отказа могло послужить несовпадение возраста и даты рождения.[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
      title: 'био отказ(18 лет)',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Причина отказа: минимальный возраст для составления биографии: 18 лет.[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
      title: 'био отказ(Инфа)',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Добавьте больше информации о себе в новой биографии.[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴РП ситуации╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'РП ситуация одобрено',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП ситуация получает статус: [Color=Lime]Одобрено.[/CENTER][/color][/FONT]",
      prefix: ODOBRENORP_PREFIX,
      status: false,
    },
    {
      title: 'РП ситуация на дороботке',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][FONT=Times new roman]Вам даётся 24 часа на дополнение вашей РП ситуации[/CENTER]",
      prefix: NARASSMOTRENIIRP_PREFIX,
      status: false,
    },
    {
      title: 'РП ситуация отказ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП ситуация получает статус: [Color=Red]Отказано.[/color]<br>Причиной отказа могло послужить какое-либо нарушение из Правила RP ситуаций[/CENTER][/FONT]",
      prefix: OTKAZRP_PREFIX,
      status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Неофициал. орг.╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Неофициальная Орг Одобрено',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП ситуация получает статус: [Color=Lime]Одобрено.[/CENTER][/color][/FONT]",
      prefix: ODOBRENOORG_PREFIX,
      status: false,
    },
    {
      title: 'Неофициальная Орг на дороботке',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][FONT=Times new roman]Вам даётся 24 часа на дополнение вашей Неофициальная Орг[/CENTER]",
      prefix: NARASSMOTRENIIORG_PREFIX,
      status: false,
    },
    {
      title: 'Неофициальная Орг отказ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП ситуация получает статус: [Color=Red]Отказано.[/color]<br>Причиной отказа могло послужить какое-либо нарушение из Правила создания неофициальной RolePlay организации.[/CENTER][/FONT]",
      prefix: OTKAZORG_PREFIX,
      status: false,
    },
      {
      title: 'Неофициальная Орг запроси активности',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
          "[CENTER][B][FONT=Times new roman]Ваша неофициальная РП организация может быть закрыта по пункту правил: Неактив в топике организации более недели, он закрывается. Прекрипите отчёт о активности организации в виде скриншотов. Через 24 часа если отчёта не будет или он будет некорректный организация будет закрыта.[/CENTER]",
              prefix: PINN_PREFIX,
      status: false,
    },
    {
      title: 'Неофициальная Орг закрытие активности',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][FONT=Times new roman]Активность небыла предоставлена. Организация закрыта.[/CENTER]",
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
    addButton('ГА', 'Ga');
    addButton('СА', 'Spec');
    addButton('Меню', 'selectAnswer');

    // Поиск информации о теме
    const threadData = getThreadData();

    $('button#pin').click(() => editThreadData(PINN_PREFIX, true));
    $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
    $('button#Spec').click(() => editThreadData(SPECY_PREFIX, true));
    $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));

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