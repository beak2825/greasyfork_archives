// ==UserScript==
// @name    КФ | M.Sotka
// @namespace https://forum.blackrussia.online
// @version 2.0
// @description  Скрипт для рассмотрения жалоб на Black Russia.
// @author       Montana_Sotka
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        noneо
// @license    MIT
// @icon https://emoji.gg/assets/emoji/9372-blurple-boost-level-9.png
// @downloadURL https://update.greasyfork.org/scripts/515193/%D0%9A%D0%A4%20%7C%20MSotka.user.js
// @updateURL https://update.greasyfork.org/scripts/515193/%D0%9A%D0%A4%20%7C%20MSotka.meta.js
// ==/UserScript==
(function () {
  'use strict';
const UNACCСEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCСEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const PINN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
const CLOSE_PREFIX = 7;
const ERWART_PREFIX = 14;
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
     title: '★----★----★---ПЕРЕАДРЕСАЦИЯ---★----★----★----★----★----★----★----★----★----★----★----★----★----★----★----★----★',
    },
    {
      title: 'ГКФ/ЗГКФ',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба переадресована [COLOR=rgb(255, 215, 0)]руководству модерации форума[/COLOR] @Jerry_Crown @Knyaz_Shakh .[/CENTER]<br>" +
        '[Color=Flame][CENTER]Ожидайте, когда администрация вынесет окончательный вердикт.[/CENTER][/color][/FONT]',
      prefix: PINN_PREFIX,
      status: false,
    },
    {
      title: 'Техническому специалисту',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба переадресована [COLOR=rgb(65, 105, 255)]Техническому Специалисту[/COLOR].[/CENTER]<br>" +
        '[Color=Flame][CENTER]Ожидайте, когда администрация вынесет окончательный вердикт.[/CENTER][/color][/FONT]',
      prefix: TEXY_PREFIX,
      status: false,
    },
    {
      title: 'Главному администратору',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба переадресована [COLOR=rgb(255, 0, 0)]Главной Администрации[/COLOR] @Andrey_Mal @Andrey Tvardovsky @Eva Moore ♡.[/CENTER]<br>" +
        '[Color=Flame][CENTER]Ожидайте, когда администрация вынесет окончательный вердикт.[/CENTER][/color][/FONT]',
      prefix: GA_PREFIX,
      status: false,
    },
    {
      title: 'На рассмотрении',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба взята на [COLOR=rgb(255, 102, 0)]рассмотрение.[/CENTER]<br>" +
        '[Color=Flame][CENTER][COLOR=rgb(255, 255, 255)]Ожидайте, когда администрация вынесет окончательный вердикт.[/CENTER][/color][/FONT]',
      prefix: PINN_PREFIX,
      status: false,
    },
    {
     title: '★----★----★---ПРАВИЛА ROLE-PLAY ПРОЦЕССА---★----★----★----★----★----★----★----★----★----★----★----★----★',
    },
    {
      title: 'nRP поведение',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][B]Нарушитель будет наказан по пункту правил:<br> [Color=Red]2.01[/COLOR]. Запрещено поведение, нарушающее нормы процессов Role Play режима игры | [Color=Red]Jail 30 минут [/color][/FONT][/B][/CENTER] " +

        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено. Закрыто.[/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Уход от RP',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.02[/COLOR]. Запрещено целенаправленно уходить от Role Play процесса всеразличными способами | [Color=Red]Jail 30 минут / Warn[/color][/CENTER]<br>" +

        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено. Закрыто.[/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'nRP drive',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.03[/color]. Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере | [Color=Red]Jail 30 минут[/color][/CENTER]<br>" +

        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено. Закрыто.[/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Спасатель эко',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.04[/COLOR]. Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. | [Color=Red]Ban 10 дней / Обнуление аккаунта при повторном нарушении[/color][/CENTER]<br>" +

        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено. Закрыто.[/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
        {
      title: 'nRP Обман',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.05[/color]. Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики | [Color=Red]PermBan[/color].[/CENTER]<br><br>" +

        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено. Закрыто.[/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
{
      title: 'Софт',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.22[/color]. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущества над другими игроками | [Color=Red]Ban 15 - 30 дней / PermBan[/color].[/CENTER]<br><br>" +

        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено. Закрыто.[/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Аморал действия',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.08[/color]. Запрещена любая форма аморальных действий сексуального характера в сторону игроков | [Color=Red]Jail 30 минут / Warn[/color][/CENTER]<br><br>" +

        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено. Закрыто.[/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Слив склада',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.09[/color]. Запрещено сливать склад фракции / семьи путем взятия большого количества ресурсов или превышая допустимый лимит, установленный лидером | [Color=Red]Ban 15 - 30 дней / PermBan[/color][/CENTER]<br>" +
        "[CENTER][Color=Red]Примечание:[/color] в описании семьи должны быть указаны условия взаимодействия со складом. Если лидер семьи предоставил неограниченный доступ к складу и забыл снять его, администрация не несет ответственности за возможные последствия. Жалобы по данному пункту правил принимаются только от лидера семьи.[/CENTER]<br>" +
        "[CENTER][Color=Red]Примечание:[/color] исключение всех или части игроков из состава семьи без ведома лидера также считается сливом.[/CENTER]<br><br>" +

        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено. Закрыто.[/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Уход от наказания',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.34[/color]. Запрещен уход от наказания | [Color=Red]Ban 15 - 30 дней суммируется к общему наказанию дополнительно[/color][/CENTER]<br><br>" +

        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено. Закрыто.[/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'DB',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.13[/color]. Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта | [Color=Red]Jail 60 минут[/color][/CENTER]<br><br>" +

        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено. Закрыто.[/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'RK',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.14[/color]. Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти | [Color=Red]Jail 30 минут[/color][/CENTER]<br><br>" +

        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено. Закрыто.[/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'TK',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.15[/color]. Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины | [Color=Red]Jail 60 минут / Warn[/color] ([Color=Vladikavkaz]за два и более убийства[/color])[/CENTER]<br><br>" +

        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено. Закрыто.[/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'SK',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.16[/color]. Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них | [Color=Red]Jail 60 минут / Warn[/color] ([Color=Vladikavkaz]за два и более убийства[/color]).[/CENTER]<br><br>" +

        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено. Закрыто.[/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'PG',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.17[/color]. Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь | [Color=Red]Jail 30 минут[/CENTER]<br><br>" +

        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено. Закрыто.[/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'MG',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.18[/color]. Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе | [Color=Red]Mute 30 минут[/color].[/CENTER]<br><br>" +

        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено. Закрыто.[/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
        {
      title: 'DM',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.19[/color]. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины | [Color=Red]Jail 60 минут[/color].[/CENTER]<br>" +
        "[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman]Примечание: [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=times new roman]разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил. [/FONT][/SIZE][/COLOR][/B][/CENTER]<br>" +
        "[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman]Примечание: [/FONT][/SIZE][/COLOR][SIZE=4][FONT=times new roman][COLOR=rgb(255, 255, 255)]нанесение урона с целью защиты особняка или его территории, а также нанесение урона после ДТП не является веской IC причиной, для войны семей предусмотрено отдельное системное мероприятие. [/COLOR][/FONT][/SIZE][/B][/CENTER]<br><br>" +

        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено. Закрыто.[/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Mass DM',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.20[/color]. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более | [Color=Red]Warn / Ban 3 - 7 дней[/color].[/CENTER]<br><br>" +

        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено. Закрыто.[/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
        {
      title: 'Стороннее ПО',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][B]Нарушитель будет наказан по пункту правил:<br> [Color=Red]2.22[/color]. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками | [Color=Red] Ban 15 - 30 дней / PermBan[/color] <br><br>" +

        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено. Закрыто.[/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Неуплата долга',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.57[/color]. Запрещается брать в долг игровые ценности и не возвращать их. | [Color=Red]Ban 30 дней / permban[/color].[/CENTER]<br><br>" +

        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено. Закрыто.[/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Реклама',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.31[/color]. Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное | [Color=Red]Ban 7 дней / PermBan[/color][/CENTER]<br><br>" +

        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено. Закрыто.[/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Обман адм',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.32[/color]. Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта | [Color=Red]Ban 7 - 15 дней[/CENTER]<br><br>" +

        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено. Закрыто.[/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Нац/Религ конфликт',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.35[/color]. На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате | [Color=Red]Mute 120 минут / Ban 7 дней[/color][/CENTER]<br><br>" +

        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено. Закрыто.[/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Угрозы OOC',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пункту правил:<br> [Color=Red]2.37[/color]. Запрещены OOC угрозы, в том числе и завуалированные | [Color=Red]Mute 120 минут / Ban 7 дней [/color]<br><br>" +

        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено. Закрыто.[/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Злоуп нарушениями',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][FONT=georgia]Нарушитель будет наказан по пункту правил:<br> [Color=Red]2.39[/color]. Злоупотребление нарушениями правил сервера | [Color=Red]Ban 7 - 30 дней [/color][/CENTER]<br><br>" +

        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено. Закрыто.[/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Оск проекта',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.40[/color]. Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе | [Color=Red]Mute 300 минут / Ban 30 дней[/color] ([Color=Cyan]Ban выдается по согласованию с главным администратором[/color])[/CENTER]<br><br>" +

        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено. Закрыто.[/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Продажа промо',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.43[/color]. Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций | [Color=Red]Mute 120 минут[/color][/CENTER]<br><br>" +

        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено. Закрыто.[/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'ЕПП Фура, инкассатор',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.47[/color]. Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) | [Color=Red]Jail 60 минут[/color][/CENTER]<br><br>" +

        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено. Закрыто.[/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Задержание в интерьере',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.50[/color]. Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий | [Color=Red]Ban 7 - 15 дней + увольнение из организации[/color][/CENTER]<br><br>" +

        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено. Закрыто.[/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Помеха RP',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.51[/color]. Запрещено вмешательство в Role Play процесс с целью помехи и препятствования дальнейшего развития Role Play процесса | [Color=Red]Jail 30 минут[/color][/CENTER]<br><br>" +

        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено. Закрыто.[/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'nRP акс',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.52[/color]. Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. | [Color=Red]При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут[/color][/CENTER]<br><br>" +

        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено. Закрыто.[/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Оск адм',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.54[/color]. Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации | [Color=Red]Mute 180 минут[/color][/CENTER]<br><br>" +

        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено. Закрыто.[/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Баг аним',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.55[/color]. Запрещается багоюз связанный с анимацией в любых проявлениях. | [Color=Red]Jail 60 / 120 минут [/color]<br>" +
            "[Color=Red]Пример:[/color] если нарушитель, используя баг, убирает ограничение на использование оружия в зеленой зоне, сбивает темп стрельбы, либо быстро перемещается во время войны за бизнес или во время перестрелки на мероприятии с семейными контейнерами, последует наказание в виде [Color=Red]Jail на 120 минут[/COLOR]. <br>" +
                "Данное наказание используется в случаях, когда, используя ошибку, было получено преимущество перед другими игроками. <br>" +
                    "[Color=Red]Пример:[/color] если Нарушитель использует баги, связанные с анимацией, и при этом не влияет на игровой процесс других игроков, а также не получает преимущество перед другими игроками, последует наказание в виде [Color=Red]Jail на 60 минут[/color].[/CENTER]<br><br>" +

        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено. Закрыто.[/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Долг',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.57[/color]. Запрещается брать в долг игровые ценности и не возвращать их. | [Color=Red]Ban 30 дней / Permban [/color]<br>" +
            "[Color=Red]Примечание:[/color] займ может быть осуществлен только через зачисление игровых ценностей на банковский счет, максимальный срок займа 30 календарных дней, если займ не был возвращен, аккаунт должника блокируется; <br>" +
            "[Color=Red]Примечание:[/color] при невозврате игровых ценностей общей стоимостью менее 5 миллионов включительно аккаунт будет заблокирован на 30 дней, если более 5 миллионов, аккаунт будет заблокирован навсегда; <br>" +
            "[Color=Red]Примечание:[/color] жалоба на игрока, который занял игровые ценности и не вернул в срок, подлежит рассмотрению только при наличии подтверждения суммы и условий займа в игровом процессе, меры в отношении должника могут быть приняты только при наличии жалобы и доказательств. Жалоба на должника подается в течение 10 дней после истечения срока займа. Договоры вне игры не будут считаться доказательствами.[/CENTER]<br><br>" +

        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено. Закрыто.[/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
     title: '★----★----★---ИГРОВЫЕ ЧАТЫ-★----★----★----★----★----★----★----★----★----★----★----★----★----★----★----★----★',
    },
    {
      title: 'Разговор на другом языке',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.01[/color]. Общепризнанный язык сервера — русский. Общение в IC чатах во всех Role Play ситуациях обязательно должно проходить исключительно на русском языке | [Color=Red]Устное замечание / Mute 30 минут[/color][/CENTER]<br><br>" +

        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено. Закрыто.[/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'CAPS',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.02[/color]. Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате | [Color=Red]Mute 30 минут[/color].[/CENTER]<br><br>" +

        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено. Закрыто.[/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Оск в ООС',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.03[/color]. Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены | [Color=Red]Mute 30 минут[/color][/CENTER]<br><br>" +
        '[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(48, 213, 200)][SIZE=4][FONT=courier new]Vladikavkaz[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>'+
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено. Закрыто.[/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'ООС угрозы',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.37[/color]. Запрещены OOC угрозы, в том числе и завуалированные | [Color=Red]Mute 120 минут / Ban 7 дней[/color][/CENTER]<br><br>" +
        '[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(48, 213, 200)][SIZE=4][FONT=courier new]Vladikavkaz[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>'+
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено. Закрыто.[/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Оск/Упом родни',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.04[/color]. Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) | [Color=Red]Mute 120 минут / Ban 7 - 15 дней[/color].[/CENTER]<br><br>" +

        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено. Закрыто.[/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Флуд',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.05[/color]. Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока | [Color=Red]Mute 30 минут[/color].[/CENTER]<br><br>" +

        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено. Закрыто.[/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Злоуп знаками',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.06[/color]. Запрещено злоупотребление знаков препинания и прочих символов | [Color=Red]Mute 30 минут[/color][/CENTER]<br><br>" +
        '[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(48, 213, 200)][SIZE=4][FONT=courier new]Vladikavkaz[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>'+
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено. Закрыто.[/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Оск сексуального характера',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.07[/color]. Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата | [Color=Red]Mute 30 минут[/color][/CENTER]<br><br>" +

        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено. Закрыто.[/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Слив СМИ',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.08[/color]. Запрещены любые формы «слива» посредством использования глобальных чатов | [Color=Red]PermBan[/color][/CENTER]<br><br>" +

        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено. Закрыто.[/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Угрозы о наказании адм',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][FONT=georgia]Нарушитель будет наказан по пункту правил:<br> [Color=Red]3.09[/color]. Запрещены любые угрозы о наказании игрока со стороны администрации | [Color=Red]Mute 30 минут[/color].<br><br>" +

        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено. Закрыто.[/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Выдача за адм',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.10[/color]. Запрещена выдача себя за администратора, если таковым не являетесь | [Color=Red]Ban 7 - 15 + ЧС администрации[/color][/CENTER]<br><br>" +

        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено. Закрыто.[/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Ввод в заблуждение',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.11[/color]. Запрещено введение игроков проекта в заблуждение путем злоупотребления командами | [Color=Red]Ban 15 - 30 дней / PermBan[/color][/CENTER]<br><br>" +

        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено. Закрыто.[/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
     {
      title: 'Музыка в войс',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.14[/color]. Запрещено включать музыку в Voice Chat | [Color=Red]Mute 60 минут[/color][/CENTER]<br><br>" +

        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено. Закрыто.[/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Оск/Упом род в войс',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.15[/color]. Запрещено оскорблять игроков или родных в Voice Chat | [Color=Red]Mute 120 минут / Ban 7 - 15 дней[/color][/CENTER]<br><br>" +
        '[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(48, 213, 200)][SIZE=4][FONT=courier new]Vladikavkaz[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>'+
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено. Закрыто.[/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Шум в войс',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.16[/color]. Запрещено создавать посторонние шумы или звуки | [Color=Red]Mute 30 минут[/color][/CENTER]<br><br>" +

        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено. Закрыто.[/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Реклама в войс',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.17[/color]. Запрещена реклама в Voice Chat не связанная с игровым процессом | [Color=Red]Ban 7 - 15 дней[/color][/CENTER]<br><br>" +

        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено. Закрыто.[/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Религ/полит пропаганда + ПРИЗЫВ К ФЛУДУ',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.18[/color]. Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов | [Color=Red]Mute 120 минут / Ban 10 дней[/color][/CENTER]<br><br>" +
        '[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(48, 213, 200)][SIZE=4][FONT=courier new]Vladikavkaz[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>'+
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено. Закрыто.[/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Транслит',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.55[/color]. Запрещается багоюз связанный с анимацией в любых проявлениях. | [Color=Red]Mute 30 минут [/color]<br>" +
            "[Color=Vladikavkaz]Пример[/color]: «Privet», «Kak dela», «Narmalna». <br>" +

        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено. Закрыто.[/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Реклама промо',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.21[/color]. Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. | [Color=Red]Ban 30 дней[/color].[/CENTER]<br><br>" +

        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено. Закрыто.[/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Торговля на тт госс',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.22[/color]. Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) | [Color=Red]Mute 30 минут[/color][/CENTER]<br><br>" +
        '[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(48, 213, 200)][SIZE=4][FONT=courier new]Vladikavkaz[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>'+
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено. Закрыто.[/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Мат в VIP',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.23[/color]. Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате | [Color=Red]Mute 30 минут[/color][/CENTER]<br><br>" +
        '[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(48, 213, 200)][SIZE=4][FONT=courier new]Vladikavkaz[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>'+
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено. Закрыто.[/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
     title: '★----★----★---ИГРОВЫЕ АККАУНТЫ-★----★----★----★----★----★----★----★----★----★----★----★----★----★----★----★----★',
    },
    {
      title: 'Fake',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]4.10[/color]. Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию | [Color=Red]Устное замечание + смена игрового никнейма / PermBan[/color][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено. Закрыто.[/FONT][/SIZE][/COLOR][/B][/CENTER]',
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Оск ник',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]4.09[/color]. Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные) | [Color=Red]Устное замечание + смена игрового никнейма / PermBan[/color][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено. Закрыто.[/FONT][/SIZE][/COLOR][/B][/CENTER]',
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
     title: '★----★----★---ПРАВИЛА ГОС. СТРУКТУР---★----★----★----★----★----★----★----★----★----★----★----★----★----★----★',
    },
    {
      title: 'Прогул Р/Д',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил:<br> [Color=Red]1.07[/color]. Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, принадлежащей своей фракции | [Color=Red]Jail 30 минут[/color][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено. Закрыто.[/FONT][/SIZE][/COLOR][/B][/CENTER]',
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Исп. фрак т/с в личных целях',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил:<br> [Color=Red]1.08[/color]. Запрещено использование фракционного транспорта в личных целях | [Color=Red]Jail 30 минут[/color][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено. Закрыто.[/FONT][/SIZE][/COLOR][/B][/CENTER]',
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'nRP /edit',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил:<br> [Color=Red]4.01[/color]. Запрещено редактирование объявлений, не соответствующих ПРО | [Color=Red]Mute 30 минут[/color][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено. Закрыто.[/FONT][/SIZE][/COLOR][/B][/CENTER]',
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'nRP эфир',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил:<br> [Color=Red]4.02[/color]. Запрещено проведение эфиров, не соответствующих Role Play правилам и логике | [Color=Red]Mute 30 минут[/color][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено. Закрыто.[/FONT][/SIZE][/COLOR][/B][/CENTER]',
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Замена текста',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил:<br> [Color=Red]4.04[/color]. Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком | [Color=Red]Ban 7 дней + ЧС организации[/color][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено. Закрыто.[/FONT][/SIZE][/COLOR][/B][/CENTER]',
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'nRP ГОСС',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил:<br> [Color=Red]6.03[/color]. Запрещено nRP поведение | [Color=Red]Warn[/color][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено. Закрыто.[/FONT][/SIZE][/COLOR][/B][/CENTER]',
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'DM на ТТ',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил:<br> [Color=Red]6.01[/color]. Запрещено наносить урон игрокам без Role Play причины на территории гос. структур | [Color=Red]Jail 60 минут / Warn[/color][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено. Закрыто.[/FONT][/SIZE][/COLOR][/B][/CENTER]',
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Розыск/Штраф без причины',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил:<br> [Color=Red]6.02[/color]. Запрещено выдавать розыск, штраф без Role Play причины | [Color=Red]Warn[/color][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено. Закрыто.[/FONT][/SIZE][/COLOR][/B][/CENTER]',
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'В/У во время погони(ГИБДД)',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил:<br> [Color=Red]7.05[/color]. Запрещено отбирать водительские права во время погони за нарушителем | [Color=Red]Warn[/color][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено. Закрыто.[/FONT][/SIZE][/COLOR][/B][/CENTER]',
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
     title: '★----★----★---ПРАВИЛА ОПГ-★----★----★----★----★----★----★----★----★----★----★----★----★----★----★----★----★',
    },
    {
      title: 'Нарушение правил В/Ч',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил:<br> За нарушение правил нападения на [Color=Vladikavkaz]Войсковую Часть[/color] выдаётся предупреждение | [Color=Red]Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ)[/color][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено. Закрыто.[/FONT][/SIZE][/COLOR][/B][/CENTER]',
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Нападение на В/Ч через стену',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил:<br> Нападение на [Color=Vladikavkaz]военную часть[/color] разрешено только через блокпост КПП с последовательностью взлома | [Color=Red]Warn NonRP В/Ч[/color][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено. Закрыто.[/FONT][/SIZE][/COLOR][/B][/CENTER]',
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Похищение/Ограбления нарушение правил',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан за Нонрп Ограбление/Похищениее в соответствии с данными правилами - [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BE%D0%B3%D1%80%D0%B0%D0%B1%D0%BB%D0%B5%D0%BD%D0%B8%D0%B9-%D0%B8-%D0%BF%D0%BE%D1%85%D0%B8%D1%89%D0%B5%D0%BD%D0%B8%D0%B9.29/']Кликабельно[/URL][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено. Закрыто.[/FONT][/SIZE][/COLOR][/B][/CENTER]',
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
     title: '★----★----★---Отказы--★----★----★----★----★----★----★----★----★----★----★----★----★----★----★',
    },
    {
      title: 'Долг под процент',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][FONT=georgia]Долги с процентной ставкой возврата запрещены.[/CENTER]<br><br>" +

        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. Закрыто.[/FONT][/COLOR][/SIZE][/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Не является обменом',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][FONT=georgia]Подобные покупки и обмены не практикуются на проекте, т.к. законным путем передать донат валюту или недвижимые вещи за нее же нельзя.[/CENTER]<br><br>" +

        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. Закрыто.[/FONT][/COLOR][/SIZE][/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Нарушений нет',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушений от игрока на данных доказательствах нет.[/CENTER]<br><br>" +

        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. Закрыто.[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Недостаточно доказательств',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Недостаточно доказательств на нарушение от данного игрока. Доказательства должны быть предоставлены в полном формате.[/CENTER]<br><br>" +

        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. Закрыто.[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
       {
      title: 'Несовпадение ника',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игровой ник в доказательствах не совпадает с именем в игре.[/CENTER]<br><br>" +

        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. Закрыто.[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Ответ дан ранее',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ответ на вашу жалобу был дан в предыдущей теме.[/CENTER]<br><br>" +

        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. Закрыто.[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Не по форме',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба составлена не по форме. Убедительная просьба ознакомиться с [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.3429394/'][Color=Red][U]правилами подачи жалоб на игроков[/U][/color][/URL].[/CENTER]<br><br>" +

        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. Закрыто.[/FONT][/COLOR][/SIZE][/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Нет /time',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]На Ваших доказательствах отсутствует /time.[/CENTER]<br><br>" +

        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. Закрыто.[/FONT][/COLOR][/SIZE][/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Тайм-кодов нет',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба отказана, т.к в ней нету таймкодов. Если видео длится больше 3-ех минут - Вы должны указать таймкоды нарушений. Пример:[/CENTER]<br><br>" +
        "[CENTER]2:37- условия сделки.[/CENTER]<br><br>" +
        "[CENTER]3:44- условия сделки нарушены/игрок вышел из игры.[/CENTER]<br><br>" +

        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. Закрыто.[/FONT][/COLOR][/SIZE][/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
      {
      title: 'Более 3 дней',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][FONT=georgia]С момента нарушения прошло более 72 часов[/CENTER]<br><br>" +

        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. Закрыто.[/FONT][/COLOR][/SIZE][/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
      {
      title: 'Доква в соц.сети',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][FONT=georgia]3.6. Прикрепление доказательств обязательно.<br>" +
            "[Color=Vladikavkaz]Примечание[/color]: загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/CENTER]<br><br>" +

        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. Закрыто.[/FONT][/COLOR][/SIZE][/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Нет условий сделки',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][FONT=georgia]В данных доказательствах отсутствуют условия сделки[/CENTER]<br><br>" +

        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. Закрыто.[/FONT][/COLOR][/SIZE][/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Нужен фрапс',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][FONT=georgia]В таких случаях нужна видеозапись.[/CENTER]<br><br>" +

        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. Закрыто.[/FONT][/COLOR][/SIZE][/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Фрапс обрывается',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][FONT=georgia]Видеозапись обрывается, загрузите доказательства на YouTube.[/CENTER]<br><br>" +

        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. Закрыто.[/FONT][/COLOR][/SIZE][/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Докв нет',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Доказательства в жалобе отсутсвуют. Прикрепите опровержение на нарушения игрока, используя фото и видео хостинги.[/CENTER]<br><br>" +

        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. Закрыто.[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Не работают доква',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Не работают доказательства.[/CENTER]<br>" +
        "[CENTER]Убедитесь в том что отправленная вами ссылка рабочая, а к доказательствам открыт доступ.[/CENTER]<br><br>" +

        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. Закрыто.[/FONT][/COLOR][/SIZE][/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Плохое качество',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваши доказательства предоставлены в плохом качестве.[/CENTER]<br><br>" +

        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. Закрыто.[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Доква отредактированы',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][FONT=georgia]Ваши доказательства отредактированы.[/CENTER]<br><br>" +

        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. Закрыто.[/FONT][/COLOR][/SIZE][/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'От 3-го лица',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][FONT=georgia]Жалобы от 3-их лиц не принимаются[/CENTER]<br>" +

        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. Закрыто.[/FONT][/COLOR][/SIZE][/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Баг игрока(на читы)',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][FONT=georgia]Вероятнее всего у игрока был баг, вследствие чего его поведение казалось аномальным и было схожим с использованием стороннего ПО.<br>" +
        "Сообщайте в /report о подобных инцидентах, администрация может на месте проверить игрока на читы.[/CENTER]<br><br>" +

        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. Закрыто.[/FONT][/COLOR][/SIZE][/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Неадекват',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][FONT=georgia]Неадекватное составление жалобы, создайте новую жалобу без использования прямых или заувалированных оскорблений, смайликов подобных оскорблению.[/CENTER]<br><br>" +

        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. Закрыто.[/FONT][/COLOR][/SIZE][/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'В жалобы на адм',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][FONT=georgia]Для написания жалобы на администрацию, обратитесь в Жалобы на администраторов[/CENTER]<br>" +
        "[CENTER][B][FONT=georgia]Не забудьте ознакомиться с [COLOR=rgb(255, 0, 0)]правилами подачи жалоб на администраторов[/COLOR][/CENTER]<br><br>" +

        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. Закрыто.[/FONT][/COLOR][/SIZE][/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'В жалобы на лд/зам',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][FONT=georgia]Для написания жалобы на лидера/заместителя обратитесь в Жалобы на лидеров[/CENTER]<br>" +
        "[CENTER][B][FONT=georgia]Не забудьте ознакомиться с [COLOR=rgb(255, 0, 0)]правилами подачи жалоб на лидеров[/COLOR][/CENTER]<br><br>" +

        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. Закрыто.[/FONT][/COLOR][/SIZE][/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'В обж',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][FONT=georgia]Для написания обжалования, подайте ваше письмо в раздел Обжалование наказаний.[/CENTER]<br>" +
        "[CENTER][B][FONT=georgia]Не забудьте ознакомиться с [COLOR=rgb(255, 0, 0)]правилами подачи обжалований[/COLOR][/CENTER]<br><br>" +

        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. Закрыто.[/FONT][/COLOR][/SIZE][/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'В жалобы орг',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][FONT=georgia]Нарушений от игрока исходя из общих правил серверов нет.[/CENTER]<br>" +
        "[CENTER][B][FONT=georgia]Оставьте жалобу в разделе организации игрока.[/CENTER]<br><br>" +

        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. Закрыто.[/FONT][/COLOR][/SIZE][/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Ошиблись разделом серверов',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][FONT=georgia]Жалоба подана в раздел другого сервера.[/CENTER]<br>" +
        "[CENTER][B][FONT=georgia]Внимательно изучите список игровых серверов и выберите свой.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. Закрыто.[/FONT][/COLOR][/SIZE][/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
     title: '★----★----★---RP биографии---★----★----★----★----★----★----★----★----★----★----★----★----★----★----★----★----★',
    },
    {
      title: 'Одобрено',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша RolePlay биография получает статус: [Color=Lime]Одобрено[/COLOR].[/CENTER][/FONT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
    },
    {
      title: 'Не тот раздел',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша RolePlay биография получает статус: [Color=Red]Отказано[/color].<br><br>" +
        "Причиной отказа послужила ошибка раздела.<br><br>" +
        "С правилами подачи Вы можете ознакомиться здесь - [URL='https://forum.blackrussia.online/threads/%E2%9E%A5-vladikavkaz-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D0%B5-%D0%A0%D0%9F-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.5061672/'][Color=Red][U]Правила написания RP биографий[/U][/color][/URL].[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
      title: 'Не по форме содержание',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша RolePlay биография получает статус: [Color=Red]Отказано[/color].<br><br>" +
        "Причиной отказа послужило несоответствие формы подачи RolePlay Биографий.<br><br>" +
        "С правилами подачи Вы можете ознакомиться здесь - [URL='https://forum.blackrussia.online/threads/%E2%9E%A5-vladikavkaz-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D0%B5-%D0%A0%D0%9F-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.5061672/'][Color=Red][U]Правила написания RP биографий[/U][/color][/URL].[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
      title: 'Не по форме заголовок',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша RolePlay биография получает статус: [Color=Red]Отказано[/color].<br><br>" +
        "Причиной отказа послужило несоответствие заголовка с формой подачи RolePlay Биографий.<br><br>" +
        "С правилами подачи Вы можете ознакомиться здесь - [URL='https://forum.blackrussia.online/threads/%E2%9E%A5-vladikavkaz-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D0%B5-%D0%A0%D0%9F-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.5061672/'][Color=Red][U]Правила написания RP биографий[/U][/color][/URL].[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
      title: 'Копипаст',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша RolePlay биография получает статус: [Color=Red]Отказано[/color].<br><br>" +
        "Причиной отказа послужило копирование биографии у другого человека.<br><br>" +
        "С правилами подачи Вы можете ознакомиться здесь - [URL='https://forum.blackrussia.online/threads/%E2%9E%A5-vladikavkaz-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D0%B5-%D0%A0%D0%9F-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.5061672/'][Color=Red][U]Правила написания RP биографий[/U][/color][/URL].[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
      title: 'Орфография',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша RolePlay биография получает статус: [Color=Red]Отказано[/color].<br><br>" +
        "Причиной отказа послужило большое количество орфографических или пунктуационных.<br><br>" +
        "С правилами подачи Вы можете ознакомиться здесь - [URL='https://forum.blackrussia.online/threads/%E2%9E%A5-vladikavkaz-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D0%B5-%D0%A0%D0%9F-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.5061672/'][Color=Red][U]Правила написания RP биографий[/U][/color][/URL].[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
      title: 'Англ ники',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша RolePlay биография получает статус: [Color=Red]Отказано[/color].<br><br>" +
        "Причина отказа- Ники должны быть на русском языке.<br>" +
        "С правилами подачи Вы можете ознакомиться здесь - [URL='https://forum.blackrussia.online/threads/%E2%9E%A5-vladikavkaz-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D0%B5-%D0%A0%D0%9F-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.5061672/'][Color=Red][U]Правила написания RP биографий[/U][/color][/URL].[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
      title: 'Недостаточно инфы',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша RolePlay биография получает статус: [Color=Red]Отказано[/color].<br><br>" +
        "Причиной отказа послужил недосток информации.<br><br>" +
        "С правилами подачи Вы можете ознакомиться здесь - [URL='https://forum.blackrussia.online/threads/%E2%9E%A5-vladikavkaz-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D0%B5-%D0%A0%D0%9F-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.5061672/'][Color=Red][U]Правила написания RP биографий[/U][/color][/URL].[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
      title: 'От 3 лица',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша RolePlay биография получает статус: [Color=Red]Отказано[/color].<br><br>" +
        "Причиной отказа послужило написание биографии от 3-его лица.<br><br>" +
        "С правилами подачи Вы можете ознакомиться здесь - [URL='https://forum.blackrussia.online/threads/%E2%9E%A5-vladikavkaz-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D0%B5-%D0%A0%D0%9F-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.5061672/'][Color=Red][U]Правила написания RP биографий[/U][/color][/URL].[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
      title: 'nRP Nick',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша RolePlay биография получает статус: [Color=Red]Отказано[/color].<br><br>" +
        "Причиной отказа послужил ваш Non RP Ник.<br><br>" +
        "С правилами подачи Вы можете ознакомиться здесь - [URL='https://forum.blackrussia.online/threads/%E2%9E%A5-vladikavkaz-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D0%B5-%D0%A0%D0%9F-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.5061672/'][Color=Red][U]Правила написания RP биографий[/U][/color][/URL].[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
      title: 'Возраст с датой',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша RolePlay биография получает статус: [Color=Red]Отказано[/color].<br><br>" +
        "Причиной отказа послужило несовпадение возраста, с датой рождения.<br><br>" +
        "С правилами подачи Вы можете ознакомиться здесь - [URL='https://forum.blackrussia.online/threads/%E2%9E%A5-vladikavkaz-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D0%B5-%D0%A0%D0%9F-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.5061672/'][Color=Red][U]Правила написания RP биографий[/U][/color][/URL].[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
      title: 'Супергерой',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша RolePlay биография получает статус: [Color=Red]Отказано[/color].<br><br>" +
        "Причиной отказа послужило супергеройство игрока.<br><br>" +
        "С правилами подачи Вы можете ознакомиться здесь - [URL='https://forum.blackrussia.online/threads/%E2%9E%A5-vladikavkaz-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D0%B5-%D0%A0%D0%9F-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.5061672/'][Color=Red][U]Правила написания RP биографий[/U][/color][/URL].[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
      title: 'Нет 18',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша RolePlay биография получает статус: [Color=Red]Отказано[/color].<br><br>" +
        "Причиной отказа послужил возраст персонажа.<br><br>" +
        "С правилами подачи Вы можете ознакомиться здесь - [URL='https://forum.blackrussia.online/threads/%E2%9E%A5-vladikavkaz-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D0%B5-%D0%A0%D0%9F-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.5061672/'][Color=Red][U]Правила написания RP биографий[/U][/color][/URL].[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
      title: 'Недостат. Детство',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша RolePlay биография получает статус: [Color=Red]Отказано[/color].<br><br>" +
        "Причиной отказа послужило мало информации в пункте- Детство.<br><br>" +
        "С правилами подачи Вы можете ознакомиться здесь - [URL='https://forum.blackrussia.online/threads/%E2%9E%A5-vladikavkaz-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D0%B5-%D0%A0%D0%9F-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.5061672/'][Color=Red][U]Правила написания RP биографий[/U][/color][/URL].[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
      title: 'Недостат. Юность',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша RolePlay биография получает статус: [Color=Red]Отказано[/color].<br><br>" +
        "Причиной отказа послужило мало информации в пункте- Юность и взрослая жизнь.<br><br>" +
        "С правилами подачи Вы можете ознакомиться здесь - [URL='https://forum.blackrussia.online/threads/%E2%9E%A5-vladikavkaz-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D0%B5-%D0%A0%D0%9F-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.5061672/'][Color=Red][U]Правила написания RP биографий[/U][/color][/URL].[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
      title: 'Недостат. Наст.Вр',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша RolePlay биография получает статус: [Color=Red]Отказано[/color].<br><br>" +
        "Причиной отказа послужило мало информации в пункте- Настоящее время.<br><br>" +
        "С правилами подачи Вы можете ознакомиться здесь - [URL='https://forum.blackrussia.online/threads/%E2%9E%A5-vladikavkaz-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D0%B5-%D0%A0%D0%9F-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.5061672/'][Color=Red][U]Правила написания RP биографий[/U][/color][/URL].[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
     title: '★----★----★---RP ситуации---★----★----★----★----★----★----★----★----★----★----★----★----★----★----★----★----★',
    },
    {
      title: 'Одобрено',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша RolePlay ситуация получает статус: [Color=Lime]Одобрено[/COLOR].[/CENTER]<br>" +
        "[CENTER]Вознаграждение за RP ситуацию [Color=Red]не выдаётся[/COLOR].[/CENTER][/FONT]",
      prefix: ODOBRENORP_PREFIX,
      status: false,
    },
    {
      title: 'Не тот раздел',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша RolePlay ситуация получает статус: [Color=Red]Отказано[/color].<br><br>" +
        "Причиной отказа послужила ошибка раздела.<br><br>" +
        "С правилами подачи Вы можете ознакомиться здесь - [URL='https://forum.blackrussia.online/threads/%E2%9E%A5-vladikavkaz-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D1%81%D0%B8%D1%82%D1%83%D0%B0%D1%86%D0%B8%D0%B9.5064060/'][Color=Red][U]Правил написания RP ситуаций[/U][/color][/URL].[/CENTER][/FONT]",
      prefix: OTKAZRP_PREFIX,
      status: false,
    },
    {
      title: 'Не по форме',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша RolePlay ситуация получает статус: [Color=Red]Отказано[/color].<br><br>" +
        "Причиной отказа послужило несоответствие форме подачи RolePlay ситуаций.<br>" +
        "С правилами подачи Вы можете ознакомиться здесь - [URL='https://forum.blackrussia.online/threads/%E2%9E%A5-vladikavkaz-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D1%81%D0%B8%D1%82%D1%83%D0%B0%D1%86%D0%B8%D0%B9.5064060/'][Color=Red][U]Правил написания RP ситуаций[/U][/color][/URL].[/CENTER][/FONT]",
      prefix: OTKAZRP_PREFIX,
      status: false,
    },
    {
      title: 'Копипаст',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша RolePlay ситуация получает статус: [Color=Red]Отказано[/color].<br><br>" +
        "Причиной отказа послужило копирование ситуации у другого человека.<br><br>" +
        "С правилами подачи Вы можете ознакомиться здесь - [URL='https://forum.blackrussia.online/threads/%E2%9E%A5-vladikavkaz-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D1%81%D0%B8%D1%82%D1%83%D0%B0%D1%86%D0%B8%D0%B9.5064060/'][Color=Red][U]Правил написания RP ситуаций[/U][/color][/URL].[/CENTER][/FONT]",
      prefix: OTKAZRP_PREFIX,
      status: false,
    },
    {
      title: 'Орфография',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша RolePlay ситуация получает статус: [Color=Red]Отказано[/color].<br><br>" +
        "Причиной отказа послужило неграмотное оформление ситуации.<br><br>" +
        "С правилами подачи Вы можете ознакомиться здесь - [URL='https://forum.blackrussia.online/threads/%E2%9E%A5-vladikavkaz-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D1%81%D0%B8%D1%82%D1%83%D0%B0%D1%86%D0%B8%D0%B9.5064060/'][Color=Red][U]Правил написания RP ситуаций[/U][/color][/URL].[/CENTER][/FONT]",
      prefix: OTKAZRP_PREFIX,
      status: false,
    },
    {
      title: 'Англ ники',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша RolePlay ситуация получает статус: [Color=Red]Отказано[/color].<br><br>" +
        "Причина отказа- Ники должны быть написаны на русском языке.<br><br>" +
        "С правилами подачи Вы можете ознакомиться здесь - [URL='https://forum.blackrussia.online/threads/%E2%9E%A5-vladikavkaz-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D1%81%D0%B8%D1%82%D1%83%D0%B0%D1%86%D0%B8%D0%B9.5064060/'][Color=Red][U]Правил написания RP ситуаций[/U][/color][/URL].[/CENTER][/FONT]",
      prefix: OTKAZRP_PREFIX,
      status: false,
    },
    {
     title: '★----★----★---RP организации---★----★----★----★----★----★----★----★----★----★----★----★----★----★----★----★----★',
    },
    {
      title: 'Одобрено',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша RolePlay организация получает статус: [Color=Lime]Одобрено[/color].<br><br>" +
        "Если вам понадобится отредактировать информацию, свяжитесь со мной через Форумный Аккаунт или ВКонтакте.[/CENTER][/FONT]",
      prefix: ODOBRENOORG_PREFIX,
      status: false,
    },
    {
      title: 'Не тот раздел',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша RolePlay организация получает статус: [Color=Red]Отказано[/color].<br><br>" +
        "Причиной отказа послужила ошибка раздела.<br><br>" +
        "С правилами подачи Вы можете ознакомиться здесь - [URL='https://forum.blackrussia.online/threads/%E2%9E%A5-vladikavkaz-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-%D1%82%D0%B5%D0%BC%D1%8B.5068990/'][Color=Red][U]Правил написания RP ситуаций[/U][/color][/URL].[/CENTER][/FONT]",
      prefix: OTKAZORG_PREFIX,
      status: false,
    },
    {
      title: 'Не по форме',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша RolePlay организация получает статус: [Color=Red]Отказано[/color].<br><br>" +
        "Причиной отказа послужило несоответствие форме подачи RolePlay ситуаций.<br>" +
        "С правилами подачи Вы можете ознакомиться здесь - [URL='https://forum.blackrussia.online/threads/%E2%9E%A5-vladikavkaz-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-%D1%82%D0%B5%D0%BC%D1%8B.5068990/'][Color=Red][U]Правил написания RP ситуаций[/U][/color][/URL].[/CENTER][/FONT]",
      prefix: OTKAZORG_PREFIX,
      status: false,
    },
    {
      title: 'Копипаст',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша RolePlay организация получает статус: [Color=Red]Отказано[/color].<br><br>" +
        "Причиной отказа послужило копирование ситуации у другого человека.<br><br>" +
        "С правилами подачи Вы можете ознакомиться здесь - [URL='https://forum.blackrussia.online/threads/%E2%9E%A5-vladikavkaz-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-%D1%82%D0%B5%D0%BC%D1%8B.5068990/'][Color=Red][U]Правил написания RP ситуаций[/U][/color][/URL].[/CENTER][/FONT]",
      prefix: OTKAZORG_PREFIX,
      status: false,
    },
    {
      title: 'Орфография',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша RolePlay организация получает статус: [Color=Red]Отказано[/color].<br><br>" +
        "Причиной отказа послужило неграмотное оформление ситуации.<br><br>" +
        "С правилами подачи Вы можете ознакомиться здесь - [URL='https://forum.blackrussia.online/threads/%E2%9E%A5-vladikavkaz-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-%D1%82%D0%B5%D0%BC%D1%8B.5068990/'][Color=Red][U]Правил написания RP ситуаций[/U][/color][/URL].[/CENTER][/FONT]",
      prefix: OTKAZORG_PREFIX,
      status: false,
    },
    {
      title: 'Англ ники',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша RolePlay организация получает статус: [Color=Red]Отказано[/color].<br><br>" +
        "Причина отказа- Ники должны быть написаны на русском языке.<br><br>" +
        "С правилами подачи Вы можете ознакомиться здесь - [URL='https://forum.blackrussia.online/threads/%E2%9E%A5-vladikavkaz-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-%D1%82%D0%B5%D0%BC%D1%8B.5068990/'][Color=Red][U]Правил написания RP ситуаций[/U][/color][/URL].[/CENTER][/FONT]",
      prefix: OTKAZORG_PREFIX,
      status: false,
    },
  ];
 $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
    // Добавление кнопок при загрузке страницы
    addButton('Ответы КФ', 'selectAnswer');
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