// ==UserScript==
// @name         Script for Forum Curator's | GREEN
// @namespace    https://forum.blackrussia.online
// @version      2.2
// @description  forward-only!
// @author       Jaden Young
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @icon         https://sun6-21.userapi.com/s/v1/ig2/oGqGPWAP3wW3Q13LUoUsJpo9M7yaq9JFQs-_x0Wg9PP1dfihP2Nwgzy4FzxxhVD3M5LEydgQcfni_GqFWZIz10wf.jpg?size=603x604&quality=95&crop=1,0,603,604&ava=1
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457911/Script%20for%20Forum%20Curator%27s%20%7C%20GREEN.user.js
// @updateURL https://update.greasyfork.org/scripts/457911/Script%20for%20Forum%20Curator%27s%20%7C%20GREEN.meta.js
// ==/UserScript==

(async function () {
  `use strict`;
  const UNACCEPT_PREFIX = 4;
  const ACCEPT_PREFIX = 8;
  const PIN_PREFIX = 2;
  const CLOSE_PREFIX = 7;
  const TECH_PREFIX = 13;
  const data = await getThreadData(),
    greeting = data.greeting,
    user = data.user;

  const buttonsOverlay = [
    {
      title: "Ответы с одобрением",
      content: "",
    },
    {
      title: "Ответы с отказом",
      content: "",
    },
    {
      title: "Поставить префикс",
      content: "",
    },
  ];
  const buttonsOverlayAnswers = [
    {
      title: "На рассмотрении",
      content:
        `[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]${greeting}, уважаемый (ая) ${user.mention}.[/CENTER][/FONT][/SIZE]<br/>` +
        `[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]На рассмотрении.[/CENTER][/FONT][/SIZE][/COLOR]`,
      prefix: PIN_PREFIX,
      status: false,
    },
  ];

  const buttonsAccept = [
    {
      title: "ДМ",
      content:
        `[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]${greeting}, уважаемый (ая) ${user.mention}.[/CENTER][/FONT][/SIZE]<br/>` +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]Нарушитель будет наказан по следующему пункту регламента:[/CENTER][/FONT][/SIZE][QUOTE]<br/><br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]2.19.[/COLOR][COLOR=rgb(255, 255, 255)] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины[/COLOR][COLOR=rgb(255, 0, 13)] | Jail 60 минут[/CENTER][/FONT][/SIZE][/COLOR]<br/>" +
        "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Примечание:[/COLOR][COLOR=rgb(255, 255, 255)] разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил.[/FONT][/SIZE]<br/><br/>" +
        "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Примечание:[/COLOR][COLOR=rgb(255, 255, 255)] нанесение урона с целью защиты особняка или его территории, а также нанесение урона после ДТП не является веской IC причиной, для войны семей предусмотрено отдельное системное мероприятие.[/QUOTE][/FONT][/SIZE]<br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Закрыто[/COLOR][COLOR=rgb(255, 255, 255)].[/SIZE][/FONT][/CENTER]",
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: "МАССОВЫЙ ДМ",
      content:
        `[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]${greeting}, уважаемый (ая) ${user.mention}.[/CENTER][/FONT][/SIZE]<br/>` +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]Нарушитель будет наказан по следующему пункту регламента:[/CENTER][/FONT][/SIZE][QUOTE]<br/><br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]2.20.[/COLOR][COLOR=rgb(255, 255, 255)] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более[/COLOR][COLOR=rgb(255, 0, 13)] | Warn / Ban 3 - 7 дней[/QUOTE][/CENTER][/FONT][/SIZE][/COLOR]<br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Закрыто[/COLOR][COLOR=rgb(255, 255, 255)].[/SIZE][/FONT][/CENTER]",
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: "НОНРП ВОЖДЕНИЕ (ЛЕГКОВОЕ АВТО)",
      content:
        `[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]${greeting}, уважаемый (ая) ${user.mention}.[/CENTER][/FONT][/SIZE]<br/>` +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]Нарушитель будет наказан по следующему пункту регламента:[/CENTER][/FONT][/SIZE][QUOTE]<br/><br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]2.03.[/COLOR][COLOR=rgb(255, 255, 255)] Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере[/COLOR][COLOR=rgb(255, 0, 13)] | Jail 30 минут[/CENTER][/FONT][/SIZE][/COLOR]<br/>" +
        "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Примечание:[/COLOR][COLOR=rgb(255, 255, 255)] езда на скутере по горам, езда на любом транспортном средстве по встречным полосам, нарушая все правила дорожного движения без какой-либо причины, намеренное создание аварийных ситуаций на дорогах и так далее.[/QUOTE][/FONT][/SIZE]<br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Закрыто[/COLOR][COLOR=rgb(255, 255, 255)].[/SIZE][/FONT][/CENTER]",
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: "НОНРП ВОЖДЕНИЕ (ФУРА / ИНКО)",
      content:
        `[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]${greeting}, уважаемый (ая) ${user.mention}.[/CENTER][/FONT][/SIZE]<br/>` +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]Нарушитель будет наказан по следующему пункту регламента:[/CENTER][/FONT][/SIZE][QUOTE]<br/><br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]2.47.[/COLOR][COLOR=rgb(255, 255, 255)] Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора)[/COLOR][COLOR=rgb(255, 0, 13)] | Jail 60 минут[/QUOTE][/CENTER][/FONT][/SIZE][/COLOR]<br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Закрыто[/COLOR][COLOR=rgb(255, 255, 255)].[/SIZE][/FONT][/CENTER]",
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: "ДБ",
      content:
        `[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]${greeting}, уважаемый (ая) ${user.mention}.[/CENTER][/FONT][/SIZE]<br/>` +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]Нарушитель будет наказан по следующему пункту регламента:[/CENTER][/FONT][/SIZE][QUOTE]<br/><br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]2.13.[/COLOR][COLOR=rgb(255, 255, 255)] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта[/COLOR][COLOR=rgb(255, 0, 13)] | Jail 60 минут[/CENTER][/FONT][/SIZE][/COLOR]<br/>" +
        "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Исключение:[/COLOR][COLOR=rgb(255, 255, 255)] разрешается на территории проведения мероприятия по захвату упавшего семейного контейнера.[/QUOTE][/FONT][/SIZE]<br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Закрыто[/COLOR][COLOR=rgb(255, 255, 255)].[/SIZE][/FONT][/CENTER]",
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: "ТК",
      content:
        `[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]${greeting}, уважаемый (ая) ${user.mention}.[/CENTER][/FONT][/SIZE]<br/>` +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]Нарушитель будет наказан по следующему пункту регламента:[/CENTER][/FONT][/SIZE][QUOTE]<br/><br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]2.15.[/COLOR][COLOR=rgb(255, 255, 255)] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины[/COLOR][COLOR=rgb(255, 0, 13)] | Jail 60 минут / Warn (за два и более убийства)[/QUOTE][/CENTER][/FONT][/SIZE][/COLOR]<br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Закрыто[/COLOR][COLOR=rgb(255, 255, 255)].[/SIZE][/FONT][/CENTER]",
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: "РК",
      content:
        `[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]${greeting}, уважаемый (ая) ${user.mention}.[/CENTER][/FONT][/SIZE]<br/>` +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]Нарушитель будет наказан по следующему пункту регламента:[/CENTER][/FONT][/SIZE][QUOTE]<br/><br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]2.14.[/COLOR][COLOR=rgb(255, 255, 255)] Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти[/COLOR][COLOR=rgb(255, 0, 13)] | Jail 30 минут[/QUOTE][/CENTER][/FONT][/SIZE][/COLOR]<br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Закрыто[/COLOR][COLOR=rgb(255, 255, 255)].[/SIZE][/FONT][/CENTER]",
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: "СК",
      content:
        `[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]${greeting}, уважаемый (ая) ${user.mention}.[/CENTER][/FONT][/SIZE]<br/>` +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]Нарушитель будет наказан по следующему пункту регламента:[/CENTER][/FONT][/SIZE][QUOTE]<br/><br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]2.16.[/COLOR][COLOR=rgb(255, 255, 255)] Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них[/COLOR][COLOR=rgb(255, 0, 13)] | Jail 60 минут / Warn (за два и более убийства)[/QUOTE][/CENTER][/FONT][/SIZE][/COLOR]<br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Закрыто[/COLOR][COLOR=rgb(255, 255, 255)].[/SIZE][/FONT][/CENTER]",
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: "ПГ",
      content:
        `[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]${greeting}, уважаемый (ая) ${user.mention}.[/CENTER][/FONT][/SIZE]<br/>` +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]Нарушитель будет наказан по следующему пункту регламента:[/CENTER][/FONT][/SIZE][QUOTE]<br/><br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]2.17.[/COLOR][COLOR=rgb(255, 255, 255)] Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь[/COLOR][COLOR=rgb(255, 0, 13)] | Jail 30 минут[/QUOTE][/CENTER][/FONT][/SIZE][/COLOR]<br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Закрыто[/COLOR][COLOR=rgb(255, 255, 255)].[/SIZE][/FONT][/CENTER]",
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: "ОСКОРБЛЕНИЕ",
      content:
        `[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]${greeting}, уважаемый (ая) ${user.mention}.[/CENTER][/FONT][/SIZE]<br/>` +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]Нарушитель будет наказан по следующему пункту регламента:[/CENTER][/FONT][/SIZE][QUOTE]<br/><br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]3.03.[/COLOR][COLOR=rgb(255, 255, 255)] Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены[/COLOR][COLOR=rgb(255, 0, 13)] | Mute 30 минут[/QUOTE][/CENTER][/FONT][/SIZE][/COLOR]<br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Закрыто[/COLOR][COLOR=rgb(255, 255, 255)].[/SIZE][/FONT][/CENTER]",
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: "МОРАЛЬНЫЕ ОСКОРБЛЕНИЯ",
      content:
        `[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]${greeting}, уважаемый (ая) ${user.mention}.[/CENTER][/FONT][/SIZE]<br/>` +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]Нарушитель будет наказан по следующему пункту регламента:[/CENTER][/FONT][/SIZE][QUOTE]<br/><br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]3.07.[/COLOR][COLOR=rgb(255, 255, 255)] Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата[/COLOR][COLOR=rgb(255, 0, 13)] | Mute 30 минут[/CENTER][/FONT][/SIZE][/COLOR]<br/>" +
        "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Примечание:[/COLOR][COLOR=rgb(255, 255, 255)] «дырка», «шмара», «ведро», «мадагаскарский присосконог», «свиноногий бандикут», «скорострел» и так далее.[/QUOTE][/FONT][/SIZE]<br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Закрыто[/COLOR][COLOR=rgb(255, 255, 255)].[/SIZE][/FONT][/CENTER]",
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: "КАПС",
      content:
        `[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]${greeting}, уважаемый (ая) ${user.mention}.[/CENTER][/FONT][/SIZE]<br/>` +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]Нарушитель будет наказан по следующему пункту регламента:[/CENTER][/FONT][/SIZE][QUOTE]<br/><br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]3.02.[/COLOR][COLOR=rgb(255, 255, 255)] Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате[/COLOR][COLOR=rgb(255, 0, 13)] | Mute 30 минут[/QUOTE][/CENTER][/FONT][/SIZE][/COLOR]<br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Закрыто[/COLOR][COLOR=rgb(255, 255, 255)].[/SIZE][/FONT][/CENTER]",
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: "ФЛУД",
      content:
        `[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]${greeting}, уважаемый (ая) ${user.mention}.[/CENTER][/FONT][/SIZE]<br/>` +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]Нарушитель будет наказан по следующему пункту регламента:[/CENTER][/FONT][/SIZE][QUOTE]<br/><br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]3.05.[/COLOR][COLOR=rgb(255, 255, 255)] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока[/COLOR][COLOR=rgb(255, 0, 13)] | Mute 30 минут[/QUOTE][/CENTER][/FONT][/SIZE][/COLOR]<br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Закрыто[/COLOR][COLOR=rgb(255, 255, 255)].[/SIZE][/FONT][/CENTER]",
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: "УПОМ / ОСК РОДНЫХ",
      content:
        `[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]${greeting}, уважаемый (ая) ${user.mention}.[/CENTER][/FONT][/SIZE]<br/>` +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]Нарушитель будет наказан по следующему пункту регламента:[/CENTER][/FONT][/SIZE][QUOTE]<br/><br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]3.04.[/COLOR][COLOR=rgb(255, 255, 255)] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC)[/COLOR][COLOR=rgb(255, 0, 13)] | Mute 120 минут / Ban 7 - 15 дней[/CENTER][/FONT][/SIZE][/COLOR]<br/>" +
        "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Примечание:[/COLOR][COLOR=rgb(255, 255, 255)] термины «MQ», «rnq» расценивается, как упоминание родных.[/FONT][/SIZE]<br/><br/>" +
        "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Исключение:[/COLOR][COLOR=rgb(255, 255, 255)] если упоминание родных было совершено в ходе Role Play процесса и не содержало в себе прямого или завуалированного оскорбления.[/QUOTE][/FONT][/SIZE]<br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Закрыто[/COLOR][COLOR=rgb(255, 255, 255)].[/SIZE][/FONT][/CENTER]",
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: "МГ",
      content:
        `[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]${greeting}, уважаемый (ая) ${user.mention}.[/CENTER][/FONT][/SIZE]<br/>` +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]Нарушитель будет наказан по следующему пункту регламента:[/CENTER][/FONT][/SIZE][QUOTE]<br/><br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]2.18.[/COLOR][COLOR=rgb(255, 255, 255)] Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе[/COLOR][COLOR=rgb(255, 0, 13)] | Mute 30 минут[/CENTER][/FONT][/SIZE][/COLOR]<br/>" +
        "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Примечание:[/COLOR][COLOR=rgb(255, 255, 255)] использование смайлов в виде символов «))», «=D» запрещено в IC чате.[/FONT][/SIZE]<br/><br/>" +
        "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Примечание:[/COLOR][COLOR=rgb(255, 255, 255)] телефонное общение также является IC чатом.[/FONT][/SIZE]<br/><br/>" +
        "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Исключение:[/COLOR][COLOR=rgb(255, 255, 255)] за написанный однократно вопросительный «?» или восклицательный «!» знак в IC чате, наказание не выдается.[/QUOTE][/FONT][/SIZE]<br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Закрыто[/COLOR][COLOR=rgb(255, 255, 255)].[/SIZE][/FONT][/CENTER]",
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: "ОСК ПРОЕКТА",
      content:
        `[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]${greeting}, уважаемый (ая) ${user.mention}.[/CENTER][/FONT][/SIZE]<br/>` +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]Нарушитель будет наказан по следующему пункту регламента:[/CENTER][/FONT][/SIZE][QUOTE]<br/><br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]2.40.[/COLOR][COLOR=rgb(255, 255, 255)] Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе[/COLOR][COLOR=rgb(255, 0, 13)] | Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором)[/QUOTE][/CENTER][/FONT][/SIZE][/COLOR]<br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Закрыто[/COLOR][COLOR=rgb(255, 255, 255)].[/SIZE][/FONT][/CENTER]",
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: "РЕКЛАМА",
      content:
        `[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]${greeting}, уважаемый (ая) ${user.mention}.[/CENTER][/FONT][/SIZE]<br/>` +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]Нарушитель будет наказан по следующему пункту регламента:[/CENTER][/FONT][/SIZE][QUOTE]<br/><br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]2.31.[/COLOR][COLOR=rgb(255, 255, 255)] Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное[/COLOR][COLOR=rgb(255, 0, 13)] | Ban 7 дней / PermBan[/QUOTE][/CENTER][/FONT][/SIZE][/COLOR]<br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Закрыто[/COLOR][COLOR=rgb(255, 255, 255)].[/SIZE][/FONT][/CENTER]",
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: "РЕКЛАМА ПРОМО",
      content:
        `[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]${greeting}, уважаемый (ая) ${user.mention}.[/CENTER][/FONT][/SIZE]<br/>` +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]Нарушитель будет наказан по следующему пункту регламента:[/CENTER][/FONT][/SIZE][QUOTE]<br/><br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]3.21.[/COLOR][COLOR=rgb(255, 255, 255)] Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах.[/COLOR][COLOR=rgb(255, 0, 13)] | Ban 30 дней[/CENTER][/FONT][/SIZE][/COLOR]<br/>" +
        "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Примечание:[/COLOR][COLOR=rgb(255, 255, 255)] чаты семейные, строительных компаний, транспортных компаний, фракционные чаты, IC, OOC, VIP и так далее.[/FONT][/SIZE]<br/><br/>" +
        "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Исключение:[/COLOR][COLOR=rgb(255, 255, 255)] промокоды, предоставленные разработчиками, а также распространяемые через официальные ресурсы проекта.[/FONT][/SIZE]<br/><br/>" +
        "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Пример:[/COLOR][COLOR=rgb(255, 255, 255)] если игрок упомянет промокод, распространяемый через официальную публичную страницу ВКонтакте либо через официальный Discord в любом из чатов, наказание ему не выдается.[/QUOTE][/FONT][/SIZE]<br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Закрыто[/COLOR][COLOR=rgb(255, 255, 255)].[/SIZE][/FONT][/CENTER]",
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: "ФЕЙК",
      content:
        `[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]${greeting}, уважаемый (ая) ${user.mention}.[/CENTER][/FONT][/SIZE]<br/>` +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]Нарушитель будет наказан по следующему пункту регламента:[/CENTER][/FONT][/SIZE][QUOTE]<br/><br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]4.10.[/COLOR][COLOR=rgb(255, 255, 255)] Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию[/COLOR][COLOR=rgb(255, 0, 13)] | Устное замечание + смена игрового никнейма / PermBan[/CENTER][/FONT][/SIZE][/COLOR]<br/>" +
        "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Пример:[/COLOR][COLOR=rgb(255, 255, 255)] подменять букву i на L и так далее, по аналогии.[/QUOTE][/FONT][/SIZE]<br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Закрыто[/COLOR][COLOR=rgb(255, 255, 255)].[/SIZE][/FONT][/CENTER]",
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: "НОНРП ОБМАН",
      content:
        `[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]${greeting}, уважаемый (ая) ${user.mention}.[/CENTER][/FONT][/SIZE]<br/>` +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]Нарушитель будет наказан по следующему пункту регламента:[/CENTER][/FONT][/SIZE][QUOTE]<br/><br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]2.05.[/COLOR][COLOR=rgb(255, 255, 255)] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики[/COLOR][COLOR=rgb(255, 0, 13)] | PermBan[/CENTER][/FONT][/SIZE][/COLOR]<br/>" +
        "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Примечание:[/COLOR][COLOR=rgb(255, 255, 255)] после IC договоренности получить денежные средства и сразу же выйти из игры с целью обмана игрока, или же, договорившись через OOC чат (/n), точно также получить денежные средства и сразу же выйти из игры и тому подобные ситуации.[/FONT][/SIZE]<br/><br/>" +
        "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Примечание:[/COLOR][COLOR=rgb(255, 255, 255)] разблокировка игрового аккаунта нарушителя будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого имущества, которое было украдено (по решению обманутой стороны).[/QUOTE][/FONT][/SIZE]<br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Закрыто[/COLOR][COLOR=rgb(255, 255, 255)].[/SIZE][/FONT][/CENTER]",
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: "НОНРП КОП",
      content:
        `[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]${greeting}, уважаемый (ая) ${user.mention}.[/CENTER][/FONT][/SIZE]<br/>` +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]Нарушитель будет наказан по следующему пункту регламента:[/CENTER][/FONT][/SIZE][QUOTE]<br/><br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]7.02.[/COLOR][COLOR=rgb(255, 255, 255)] Запрещено выдавать розыск, штраф без Role Play причины[/COLOR][COLOR=rgb(255, 0, 13)] | Warn[/QUOTE][/CENTER][/FONT][/SIZE][/COLOR]<br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Закрыто[/COLOR][COLOR=rgb(255, 255, 255)].[/SIZE][/FONT][/CENTER]",
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: "НОНРП КОП (ОТБИРАНИЕ ВОД. ПРАВ ВО ВРЕМЯ ПОГОНИ)",
      content:
        `[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]${greeting}, уважаемый (ая) ${user.mention}.[/CENTER][/FONT][/SIZE]<br/>` +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]Нарушитель будет наказан по следующему пункту регламента:[/CENTER][/FONT][/SIZE][QUOTE]<br/><br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]7.02.[/COLOR][COLOR=rgb(255, 255, 255)] Запрещено выдавать розыск, штраф без Role Play причины[/COLOR][COLOR=rgb(255, 0, 13)] | Warn[/QUOTE][/CENTER][/FONT][/SIZE][/COLOR]<br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Закрыто[/COLOR][COLOR=rgb(255, 255, 255)].[/SIZE][/FONT][/CENTER]",
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: "ЗАДЕРЖАНИЕ В ИНТЕРЬЕРЕ",
      content:
        `[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]${greeting}, уважаемый (ая) ${user.mention}.[/CENTER][/FONT][/SIZE]<br/>` +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]Нарушитель будет наказан по следующему пункту регламента:[/CENTER][/FONT][/SIZE][QUOTE]<br/><br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]2.50.[/COLOR][COLOR=rgb(255, 255, 255)] Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий[/COLOR][COLOR=rgb(255, 0, 13)] | Ban 7 - 15 дней + увольнение из организации[/QUOTE][/CENTER][/FONT][/SIZE][/COLOR]<br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Закрыто[/COLOR][COLOR=rgb(255, 255, 255)].[/SIZE][/FONT][/CENTER]",
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: "ПОСТОРОННЕЕ ПО",
      content:
        `[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]${greeting}, уважаемый (ая) ${user.mention}.[/CENTER][/FONT][/SIZE]<br/>` +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]Нарушитель будет наказан по следующему пункту регламента:[/CENTER][/FONT][/SIZE][QUOTE]<br/><br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]2.22.[/COLOR][COLOR=rgb(255, 255, 255)] Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками[/COLOR][COLOR=rgb(255, 0, 13)] | Ban 15 - 30 дней / PermBan[/CENTER][/FONT][/SIZE][/COLOR]<br/>" +
        "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Примечание:[/COLOR][COLOR=rgb(255, 255, 255)] запрещено внесение любых изменений в оригинальные файлы игры.[/FONT][/SIZE]<br/><br/>" +
        "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Исключение:[/COLOR][COLOR=rgb(255, 255, 255)] разрешено изменение шрифта, его размера и длины чата (кол-во строк).[/FONT][/SIZE]<br/><br/>" +
        "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Исключение:[/COLOR][COLOR=rgb(255, 255, 255)] блокировка за включенный счетчик FPS не выдается.[/QUOTE][/FONT][/SIZE]<br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Закрыто[/COLOR][COLOR=rgb(255, 255, 255)].[/SIZE][/FONT][/CENTER]",
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: "ВРЕД ЭКОНОМИКЕ",
      content:
        `[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]${greeting}, уважаемый (ая) ${user.mention}.[/CENTER][/FONT][/SIZE]<br/>` +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]Нарушитель будет наказан по следующему пункту регламента:[/CENTER][/FONT][/SIZE][QUOTE]<br/><br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]2.30.[/COLOR][COLOR=rgb(255, 255, 255)] Запрещено пытаться нанести ущерб экономике сервера[/COLOR][COLOR=rgb(255, 0, 13)] | Ban 15 - 30 дней / PermBan[/CENTER][/FONT][/SIZE][/COLOR]<br/>" +
        "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Пример:[/COLOR][COLOR=rgb(255, 255, 255)] имея достаточное количество денег и имущества игрок начинает раздавать денежные средства и имущество другим игрокам.[/QUOTE][/FONT][/SIZE]<br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Закрыто[/COLOR][COLOR=rgb(255, 255, 255)].[/SIZE][/FONT][/CENTER]",
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: "ОБХОД СИСТЕМЫ",
      content:
        `[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]${greeting}, уважаемый (ая) ${user.mention}.[/CENTER][/FONT][/SIZE]<br/>` +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]Нарушитель будет наказан по следующему пункту регламента:[/CENTER][/FONT][/SIZE][QUOTE]<br/><br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]2.21.[/COLOR][COLOR=rgb(255, 255, 255)] Запрещено пытаться обходить игровую систему или использовать любые баги сервера[/COLOR][COLOR=rgb(255, 0, 13)] | Ban 15 - 30 дней / PermBan[/CENTER][/FONT][/SIZE][/COLOR]<br/>" +
        "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Примечание:[/COLOR][COLOR=rgb(255, 255, 255)] под игровой системой подразумеваются функции и возможности, которые реализованы в игре для взаимодействия между игроками, а также взаимодействия игроков с функциями, у которых есть свое конкретное предназначение.[/FONT][/SIZE]<br/><br/>" +
        "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Пример:[/COLOR][COLOR=rgb(255, 255, 255)] аптечка предназначена для пополнения уровня здоровья, доступна всем игрокам по фиксированной цене в любом магазине. Но она не предназначена для перепродажи по завышенной цене с целью передачи виртуальной валюты между игроками; [/FONT][/SIZE]<br/>" +
        "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]Аксессуары предназначены для украшения внешнего вида персонажа, не предназначены для передачи виртуальной валюты между игроками;[/FONT][/SIZE]<br/>" +
        "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]Банк и личные счета предназначены для передачи денежных средств между игроками;[/FONT][/SIZE]<br/>" +
        "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]Транспортное средство предназначено для передвижения игроков, не предназначено для передачи денег тем или иным способом, включая обмен с завышенными доплатами.[/QUOTE][/FONT][/SIZE]<br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Закрыто[/COLOR][COLOR=rgb(255, 255, 255)].[/SIZE][/FONT][/CENTER]",
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: "МУЛЬТИАККАУНТ",
      content:
        `[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]${greeting}, уважаемый (ая) ${user.mention}.[/CENTER][/FONT][/SIZE]<br/>` +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]Нарушитель будет наказан по следующему пункту регламента:[/CENTER][/FONT][/SIZE][QUOTE]<br/><br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]4.04.[/COLOR][COLOR=rgb(255, 255, 255)] Разрешается зарегистрировать максимально только три игровых аккаунта на сервере[/COLOR][COLOR=rgb(255, 0, 13)] | PermBan[/CENTER][/FONT][/SIZE][/COLOR]<br/>" +
        "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Примечание:[/COLOR][COLOR=rgb(255, 255, 255)] блокировке подлежат все аккаунты созданные после третьего твинка.[/QUOTE][/FONT][/SIZE]<br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Закрыто[/COLOR][COLOR=rgb(255, 255, 255)].[/SIZE][/FONT][/CENTER]",
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: "ППВ",
      content:
        `[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]${greeting}, уважаемый (ая) ${user.mention}.[/CENTER][/FONT][/SIZE]<br/>` +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]Нарушитель будет наказан по следующему пункту регламента:[/CENTER][/FONT][/SIZE][QUOTE]<br/><br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]4.03.[/COLOR][COLOR=rgb(255, 255, 255)] Запрещена совершенно любая передача игровых аккаунтов третьим лицам[/COLOR][COLOR=rgb(255, 0, 13)] | PermBan[/QUOTE][/CENTER][/FONT][/SIZE][/COLOR]<br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Закрыто[/COLOR][COLOR=rgb(255, 255, 255)].[/SIZE][/FONT][/CENTER]",
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: "ТОРГОВЛЯ НА ГОСС ТЕРРИТОРИЯХ",
      content:
        `[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]${greeting}, уважаемый (ая) ${user.mention}.[/CENTER][/FONT][/SIZE]<br/>` +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]Нарушитель будет наказан по следующему пункту регламента:[/CENTER][/FONT][/SIZE][QUOTE]<br/><br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]3.22.[/COLOR][COLOR=rgb(255, 255, 255)] Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC)[/COLOR][COLOR=rgb(255, 0, 13)] | Mute 30 минут[/CENTER][/FONT][/SIZE][/COLOR]<br/>" +
        "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Пример:[/COLOR][COLOR=rgb(255, 255, 255)] в помещении центральной больницы писать в чат: «Продам эксклюзивную шапку дешево!!!»[/QUOTE][/FONT][/SIZE]<br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Закрыто[/COLOR][COLOR=rgb(255, 255, 255)].[/SIZE][/FONT][/CENTER]",
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: "ОСК АДМ",
      content:
        `[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]${greeting}, уважаемый (ая) ${user.mention}.[/CENTER][/FONT][/SIZE]<br/>` +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]Нарушитель будет наказан по следующему пункту регламента:[/CENTER][/FONT][/SIZE][QUOTE]<br/><br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]2.54.[/COLOR][COLOR=rgb(255, 255, 255)] Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации[/COLOR][COLOR=rgb(255, 0, 13)] | Mute 180 минут[/CENTER][/FONT][/SIZE][/COLOR]<br/>" +
        "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Пример:[/COLOR][COLOR=rgb(255, 255, 255)] оформление жалобы в игре с текстом: «Быстро починил меня», «Админы вы задрали уже когда работать будете меня тут ДБшат я 3 жалобы уже подал!!!!!!!!», «МОЗГИ ВКЛЮЧИТЕ Я УВОЛЮ ВАС ЩА» и т.д. и т.п., а также при взаимодействии с другими игроками.[/FONT][/SIZE]<br/><br/>" +
        "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Пример:[/COLOR][COLOR=rgb(255, 255, 255)] оскорбление администрации в любой чат, включая репорт подлежит наказанию в виде блокировки доступа к использованию всех видов чатов - [COLOR=rgb(255, 0, 13)]Mute 180 минут[/COLOR][COLOR=rgb(255, 255, 255)].[/QUOTE][/FONT][/SIZE]<br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Закрыто[/COLOR][COLOR=rgb(255, 255, 255)].[/SIZE][/FONT][/CENTER]",
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: "ВЫДАЧА СЕБЯ ЗА АДМ",
      content:
        `[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]${greeting}, уважаемый (ая) ${user.mention}.[/CENTER][/FONT][/SIZE]<br/>` +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]Нарушитель будет наказан по следующему пункту регламента:[/CENTER][/FONT][/SIZE][QUOTE]<br/><br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]3.10.[/COLOR][COLOR=rgb(255, 255, 255)] Запрещена выдача себя за администратора, если таковым не являетесь[/COLOR][COLOR=rgb(255, 0, 13)] | Ban 7 - 15 + ЧС администрации[/QUOTE][/CENTER][/FONT][/SIZE][/COLOR]<br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Закрыто[/COLOR][COLOR=rgb(255, 255, 255)].[/SIZE][/FONT][/CENTER]",
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: "СЛИВ СКЛАДА ФРАКЦИИ",
      content:
        `[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]${greeting}, уважаемый (ая) ${user.mention}.[/CENTER][/FONT][/SIZE]<br/>` +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]Нарушитель будет наказан по следующему пункту регламента:[/CENTER][/FONT][/SIZE][QUOTE]<br/><br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]2.09.[/COLOR][COLOR=rgb(255, 255, 255)] Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле[/COLOR][COLOR=rgb(255, 0, 13)] | Ban 15 - 30 дней / PermBan[/QUOTE][/CENTER][/FONT][/SIZE][/COLOR]<br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Закрыто[/COLOR][COLOR=rgb(255, 255, 255)].[/SIZE][/FONT][/CENTER]",
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: "СЛИВ СМИ",
      content:
        `[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]${greeting}, уважаемый (ая) ${user.mention}.[/CENTER][/FONT][/SIZE]<br/>` +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]Нарушитель будет наказан по следующему пункту регламента:[/CENTER][/FONT][/SIZE][QUOTE]<br/><br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]3.08.[/COLOR][COLOR=rgb(255, 255, 255)] Запрещены любые формы «слива» посредством использования глобальных чатов[/COLOR][COLOR=rgb(255, 0, 13)] | PermBan[/QUOTE][/CENTER][/FONT][/SIZE][/COLOR]<br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Закрыто[/COLOR][COLOR=rgb(255, 255, 255)].[/SIZE][/FONT][/CENTER]",
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: "ОСК ИГРОКОВ/УПОМ РОДНИ В ВОЙС",
      content:
        `[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]${greeting}, уважаемый (ая) ${user.mention}.[/CENTER][/FONT][/SIZE]<br/>` +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]Нарушитель будет наказан по следующему пункту регламента:[/CENTER][/FONT][/SIZE][QUOTE]<br/><br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]3.15.[/COLOR][COLOR=rgb(255, 255, 255)] Запрещено оскорблять игроков или родных в Voice Chat[/COLOR][COLOR=rgb(255, 0, 13)] | Mute 120 минут / Ban 7 - 15 дней[/QUOTE][/CENTER][/FONT][/SIZE][/COLOR]<br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Закрыто[/COLOR][COLOR=rgb(255, 255, 255)].[/SIZE][/FONT][/CENTER]",
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: "УХОД ОТ РП",
      content:
        `[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]${greeting}, уважаемый (ая) ${user.mention}.[/CENTER][/FONT][/SIZE]<br/>` +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]Нарушитель будет наказан по следующему пункту регламента:[/CENTER][/FONT][/SIZE][QUOTE]<br/><br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]2.02.[/COLOR][COLOR=rgb(255, 255, 255)] Запрещено целенаправленно уходить от Role Play процесса всеразличными способами[/COLOR][COLOR=rgb(255, 0, 13)] | Jail 30 минут / Warn[/CENTER][/FONT][/SIZE][/COLOR]<br/>" +
        "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Примечание:[/COLOR][COLOR=rgb(255, 255, 255)] уходить в AFK при остановке транспортного средства правоохранительными органами, выходить из игры для избежания смерти, выходить из игры во время процесса задержания или ареста, полное игнорирование отыгровок другого игрока, которые так или иначе могут коснуться Вашего персонажа. Уходить в интерьер или зеленую зону во время перестрелки с целью избежать смерти или уйти от Role Play процесса и так далее.[/QUOTE][/FONT][/SIZE]<br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Закрыто[/COLOR][COLOR=rgb(255, 255, 255)].[/SIZE][/FONT][/CENTER]",
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: "ОСК НАЦИИ",
      content:
        `[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]${greeting}, уважаемый (ая) ${user.mention}.[/CENTER][/FONT][/SIZE]<br/>` +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]Нарушитель будет наказан по следующему пункту регламента:[/CENTER][/FONT][/SIZE][QUOTE]<br/><br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]2.35.[/COLOR][COLOR=rgb(255, 255, 255)] На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате[/COLOR][COLOR=rgb(255, 0, 13)] | Mute 120 минут / Ban 7 дней[/QUOTE][/CENTER][/FONT][/SIZE][/COLOR]<br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Закрыто[/COLOR][COLOR=rgb(255, 255, 255)].[/SIZE][/FONT][/CENTER]",
      prefix: ACCEPT_PREFIX,
      status: false,
    },
  ];

  const buttonsUnaccept = [
    {
      title: "МАЛО ДОКАЗАТЕЛЬСТВ (ГОТОВОЕ)",
      content:
        `[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]${greeting}, уважаемый (ая) ${user.mention}.[/CENTER][/FONT][/SIZE]<br/>` +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]Вынужден отказать в рассматривании жалобы. Причиной является то, что Вы предоставили мало доказательств. А именно:[/CENTER][/FONT][/SIZE][QUOTE]<br/><br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)] Предоставьте полный фрапс, на котором зафиксированы нарушения данного игрока.[/QUOTE][/CENTER][/FONT][/SIZE][/COLOR]<br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Закрыто[/COLOR][COLOR=rgb(255, 255, 255)].[/SIZE][/FONT][/CENTER]",
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: "НЕ ПО ФОРМЕ",
      content:
        `[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]${greeting}, уважаемый (ая) ${user.mention}.[/CENTER][/FONT][/SIZE]<br/>` +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]Вынужден отказать в рассматривании жалобы. Причиной является то, что она написана не по форме. Под спойлером заключена форма подачи жалоб, ознакомьтесь с ней.[/CENTER][/FONT][/SIZE][QUOTE][ISPOILER]<br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]1.2. В названии темы необходимо указать никнейм игрока, на которого подается жалоба, и суть жалобы: «Nick_Name | Суть жалобы».[/CENTER][/FONT][/SIZE][/COLOR]<br/>" +
        "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Пример:[/COLOR][COLOR=rgb(255, 255, 255)] «Bruce_Banner | nRP Drive».[/FONT][/SIZE]<br/><br/><br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]1.5. В Ваша жалоба будет рассмотрена администрацией сервера, если она соответствует всем правилам подачи[/CENTER][/FONT][/SIZE][/COLOR]<br/>" +
        "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Примечание:[/COLOR][COLOR=rgb(255, 255, 255)] оставлять жалобу нужно в соответствии с примером, приведенном ниже:[/FONT][/SIZE][QUOTE]<br/><br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]1. Ваш Nick_Name:[/CENTER][/FONT][/SIZE][/COLOR]" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]2. Nick_Name игрока:[/CENTER][/FONT][/SIZE][/COLOR]" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]3. Суть жалобы:[/CENTER][/FONT][/SIZE][/COLOR]" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]4. Доказательство:[/CENTER][/FONT][/SIZE][/ISPOILER][/COLOR][/QUOTE][/QUOTE]<br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Закрыто[/COLOR][COLOR=rgb(255, 255, 255)].[/SIZE][/FONT][/CENTER]",
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: "Доказательство игрока - это слово «логи»",
      content:
        `[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]${greeting}, уважаемый (ая) ${user.mention}.[/CENTER][/FONT][/SIZE]<br/>` +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]Логи не являются доказательствами, нужно хоть малейшее доказательство на нарушение со стороны игрока.[/CENTER][/FONT][/SIZE][/COLOR]<br>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Закрыто[/COLOR][COLOR=rgb(255, 255, 255)].[/SIZE][/FONT][/CENTER]",
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: "Нет /time",
      content:
        `[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]${greeting}, уважаемый (ая) ${user.mention}.[/CENTER][/FONT][/SIZE]<br/>` +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]На ваших доказательствах отсутствует /time.[/CENTER][/FONT][/SIZE][/COLOR]<br>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Закрыто[/COLOR][COLOR=rgb(255, 255, 255)].[/SIZE][/FONT][/CENTER]",
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: "Нет видеофиксации нарушения",
      content:
        `[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]${greeting}, уважаемый (ая) ${user.mention}.[/CENTER][/FONT][/SIZE]<br/>` +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]В данном случае должна предоставляться видеофиксация, скриншоты являться доказательсвом не будут.[/CENTER][/FONT][/SIZE][/COLOR]<br>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Закрыто[/COLOR][COLOR=rgb(255, 255, 255)].[/SIZE][/FONT][/CENTER]",
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: "Просрочка",
      content:
        `[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]${greeting}, уважаемый (ая) ${user.mention}.[/CENTER][/FONT][/SIZE]<br/>` +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]Срок написания жалобы составляет три дня (72 часа) с момента совершенного нарушения со стороны игрока сервера.[/CENTER][/FONT][/SIZE][/COLOR]<br>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Закрыто[/COLOR][COLOR=rgb(255, 255, 255)].[/SIZE][/FONT][/CENTER]",
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: "Дублирование жалобы",
      content:
        `[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]${greeting}, уважаемый (ая) ${user.mention}.[/CENTER][/FONT][/SIZE]<br/>` +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]Если вы дальше будете заниматься созданием дублирования тем, то ваш форумный аккаунт будет заблокирован на 3 дня и более.[/CENTER][/FONT][/SIZE][/COLOR]<br>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Закрыто[/COLOR][COLOR=rgb(255, 255, 255)].[/SIZE][/FONT][/CENTER]",
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: "НЕПОЛНЫЙ ФРАПС / СКРИНЫ НА НОНРП ОБМАН",
      content:
        `[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]${greeting}, уважаемый (ая) ${user.mention}.[/CENTER][/FONT][/SIZE]<br/>` +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]Вынужден отказать в рассматривании жалобы. Причиной является то, что Вы предоставили мало доказательств. А именно:[/CENTER][/FONT][/SIZE][QUOTE]<br/><br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)] Предоставьте полный фрапс, где зафиксировано вашу сделку и обман со стороны данного игрока.[/QUOTE][/CENTER][/FONT][/SIZE][/COLOR]<br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Закрыто[/COLOR][COLOR=rgb(255, 255, 255)].[/SIZE][/FONT][/CENTER]",
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: "ДОКАЗАТЕЛЬСТВА БЫЛИ ЗАГРУЖЕНЫ В СОЦ. СЕТИ",
      content:
        `[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]${greeting}, уважаемый (ая) ${user.mention}.[/CENTER][/FONT][/SIZE]<br/>` +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]Вынужден отказать в рассматривании жалобы. Причиной является то, что Вы предоставили доказательство на неразрешенный хостинг (загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/CENTER][/FONT][/SIZE][/COLOR]<br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Закрыто[/COLOR][COLOR=rgb(255, 255, 255)].[/SIZE][/FONT][/CENTER]",
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: "НЕТ НАРУШЕНИЙ",
      content:
        `[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]${greeting}, уважаемый (ая) ${user.mention}.[/CENTER][/FONT][/SIZE]<br/>` +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]Вынужден отказать в рассматривании жалобы. Причиной является то, что нарушений со стороны игрока не было найдено.[/CENTER][/FONT][/SIZE][/COLOR]<br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Закрыто[/COLOR][COLOR=rgb(255, 255, 255)].[/SIZE][/FONT][/CENTER]",
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: "НЕТ НАРУШЕНИЙ (ОСК В РП ЧАТ)",
      content:
        `[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]${greeting}, уважаемый (ая) ${user.mention}.[/CENTER][/FONT][/SIZE]<br/>` +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]Вынужден отказать в рассматривании жалобы. Причиной является то, что нарушений со стороны игрока не было найдено. Оскорбления в РП-чат не наказуемы.[/CENTER][/FONT][/SIZE][/COLOR]<br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Закрыто[/COLOR][COLOR=rgb(255, 255, 255)].[/SIZE][/FONT][/CENTER]",
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: "ПОДОЗРЕНИЯ БЕЗ ДОКАЗАТЕЛЬСТВ",
      content:
        `[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]${greeting}, уважаемый (ая) ${user.mention}.[/CENTER][/FONT][/SIZE]<br/>` +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]Вынужден отказать в рассматривании жалобы. Любые подозрения на любые нарушения от игрока должны быть хоть каким-то образом обоснованы. Подозрения на пустом месте, без каких-либо подтверждений или минимальных доказательств - не принимаются.[/CENTER][/FONT][/SIZE][/COLOR]<br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Закрыто[/COLOR][COLOR=rgb(255, 255, 255)].[/SIZE][/FONT][/CENTER]",
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: "ДОК-ВА ОТРЕДАКТИРОВАНЫ",
      content:
        `[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]${greeting}, уважаемый (ая) ${user.mention}.[/CENTER][/FONT][/SIZE]<br/>` +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]Ваши доказательства отредактированы. Создайте жалобу с первоначальными доказательствами.[/CENTER][/FONT][/SIZE][/COLOR]<br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Закрыто[/COLOR][COLOR=rgb(255, 255, 255)].[/SIZE][/FONT][/CENTER]",
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: "НЕТ УСЛОВИЙ СДЕЛКИ",
      content:
        `[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]${greeting}, уважаемый (ая) ${user.mention}.[/CENTER][/FONT][/SIZE]<br/>` +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 255, 255)]В данных доказательствах отсутствуют условия сделки[/CENTER][/FONT][/SIZE][/COLOR]<br/>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 13)]Закрыто[/COLOR][COLOR=rgb(255, 255, 255)].[/SIZE][/FONT][/CENTER]",
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
  ];

  const buttonsPrefix = [
    {
      title: "На рассмотрении",
      content: "",
      prefix: PIN_PREFIX,
      status: true,
    },
    {
      title: "Одобрено",
      content: "",
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: "Отказано",
      content: "",
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: "Закрыто",
      content: "",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: "Тех. Специалисту",
      content: "",
      prefix: TECH_PREFIX,
      status: false,
    },
  ];

  $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $(`body`).append(
      `<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`,
      `<script
  src="https://code.jquery.com/jquery-migrate-3.3.1.min.js"
  integrity="sha256-APllMc0V4lf/Rb5Cz4idWUCYlBDG3b0EcN1Ushd3hpE="
  crossorigin="anonymous"></script>`,
      `<script src="http://css3-mediaqueries-js.googlecode.com/svn/trunk/css3-mediaqueries.js"></script>`
    );

    var styles = `.Folder {
      color: #fff;
      background: #46597f;
      box-shadow: 0 4px 15px 0 rgb(0 0 0 / 20%);
      border: none;
      border-color: #d15656;
      margin: 30px 15px;
      height: 100px;
      width: 55%;
  }
  .Answer {
    color: #fff;
    background: #c83637;
    box-shadow: 0 4px 15px 0 rgb(0 0 0 / 20%);
    border: none;
    background: linear-gradient(#c83637, #a02b2c);
    border-color: #d15656;
    margin: 30px 15px;
    height: 100px;
    width: 55%;
}
body.is-modalOpen .overlay-container, body.is-modalOpen .offCanvasMenu {
  overflow-y: scroll !important;
}
::-webkit-resizer {
  background-repeat: no-repeat;
  width: 10px;
  height: 0px;
}
::-webkit-scrollbar {
  width: 10px;
}
::-webkit-scrollbar-thumb {
  -webkit-border-radius: 0px;
  border-radius: 0px;
  background-color: #993435;
}
::-webkit-scrollbar-track {
  background-color: rgb(34,36,43);
}
.blockMessage {
  background: #22242b;
}
overlay-title {
  background: #31333a;
}
@media screen and (max-width: 980px) {
  .button, a.button {
    font-size: 9px
  }
  .Folder {
    color: #fff;
    background: #46597f;
    box-shadow: 0 4px 15px 0 rgb(0 0 0 / 20%);
    border: none;
    border-color: #d15656;
    margin: 20px 50px;
    height: 65px;
    width: 65%;
    font-size: 9px;
}
.Answer {
  color: #fff;
  background: #c83637;
  box-shadow: 0 4px 15px 0 rgb(0 0 0 / 20%);
  border: none;
  background: linear-gradient(#c83637, #a02b2c);
  border-color: #d15656;
  margin: 20px 50px;
  height: 100px;
  width: 65%;
  font-size: 9px;
}}
`;

    var styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // Добавление кнопок при загрузке страницы
    addButton(`Быстрые ответы`, `buttonAnswers`);

    // Поиск информации о теме
    const threadData = getThreadData();

    $(`button#buttonAnswers`).click(() => {
      XF.alert(
        buttonsMarkup(buttonsOverlay),
        null,
        `Выберите подходящую папку с ответами:`
      );
      buttonsOverlay.forEach((btn, id) => {
        if (id === 0) {
          $(`button#folders-${id}`).click(() => {
            XF.alert(
              buttonsMarkupAnswersAccept(buttonsAccept),
              null,
              `Выберите подходящий ответ:`
            );
            buttonsAccept.forEach((btn, id) => {
              if (id > 0) {
                $(`button#answers-${id}`).click(() =>
                  pasteContentAccept(id, threadData, true)
                );
              } else {
                $(`button#answers-${id}`).click(() =>
                  pasteContentAccept(id, threadData, false)
                );
              }
            });
          });
        } else if (id === 1) {
          $(`button#folders-${id}`).click(() => {
            XF.alert(
              buttonsMarkupAnswersUnaccept(buttonsUnaccept),
              null,
              `Выберите подходящий ответ:`
            );
            buttonsUnaccept.forEach((btn, id) => {
              if (id > 0) {
                $(`button#answers-${id}`).click(() =>
                  pasteContentUnaccept(id, threadData, true)
                );
              } else {
                $(`button#answers-${id}`).click(() =>
                  pasteContentUnaccept(id, threadData, false)
                );
              }
            });
          });
        } else {
          $(`button#folders-${id}`).click(() => {
            XF.alert(
              buttonsMarkupAnswersPrefix(buttonsPrefix),
              null,
              `Выберите подходящий префикс:`
            );
            buttonsPrefix.forEach((btn, id) => {
              if (id > 0) {
                $(`button#answers-${id}`).click(() =>
                  pasteContentPrefix(id, threadData, true)
                );
              } else {
                $(`button#answers-${id}`).click(() =>
                  pasteContentPrefix(id, threadData, false)
                );
              }
            });
          });
        }
      });
    });
  });

  function addButton(name, id) {
    $(`.button--icon--reply`).before(
      `<button type="button" class="button--primary button rippleButton" id="${id}" style="margin: 10px;">${name}</button>`
    );
  }

  function buttonsMarkupAnswersAccept(buttonsAccept) {
    return `${buttonsAccept
      .map(
        (btn, i) =>
          `<button id="answers-${i}" class="button button--icon rippleButton rippleButton Answer">` +
          `<span class="button-text">${btn.title}</span></button>`
      )
      .join(``)}</div>`;
  }

  function buttonsMarkupAnswersUnaccept(buttonsUnaccept) {
    return `${buttonsUnaccept
      .map(
        (btn, i) =>
          `<button id="answers-${i}" class="button button--icon rippleButton rippleButton Answer">` +
          `<span class="button-text">${btn.title}</span></button>`
      )
      .join(``)}</div>`;
  }

  function buttonsMarkupAnswersPrefix(buttonsPrefix) {
    return `${buttonsPrefix
      .map(
        (btn, i) =>
          `<button id="answers-${i}" class="button button--icon  rippleButton rippleButton Answer">` +
          `<span class="button-text">${btn.title}</span></button>`
      )
      .join(``)}</div>`;
  }

  function buttonsMarkup(buttonsOverlay) {
    return `${buttonsOverlay
      .map(
        (btn, i) =>
          `<button id="folders-${i}" class="button button--icon rippleButton rippleButton Folder">` +
          `<span class="button-text">${btn.title}</span></button>`
      )
      .join(``)}</div>`;
  }

  function pasteContentAccept(id, data = {}, send = false) {
    const templateAcceptPaste = Handlebars.compile(buttonsAccept[id].content);
    if ($(`.fr-element.fr-view p`).text() === ``)
      $(`.fr-element.fr-view p`).empty();

    $(`span.fr-placeholder`).empty();
    $(`div.fr-element.fr-view p`).append(templateAcceptPaste(data));
    $(`a.overlay-titleCloser`).trigger(`click`);
    $(`.button--icon.button--icon--reply.rippleButton`).trigger(`click`);
    if (send == true) {
      editThreadData(buttonsAccept[id].prefix, buttonsAccept[id].status);
      $(`.button--icon.button--icon--reply.rippleButton`).trigger(`click`);
    }
  }

  function pasteContentUnaccept(id, data = {}, send = false) {
    const templateUnacceptPaste = Handlebars.compile(
      buttonsUnaccept[id].content
    );
    if ($(`.fr-element.fr-view p`).text() === ``)
      $(`.fr-element.fr-view p`).empty();

    $(`span.fr-placeholder`).empty();
    $(`div.fr-element.fr-view p`).append(templateUnacceptPaste(data));
    $(`a.overlay-titleCloser`).trigger(`click`);
    $(`.button--icon.button--icon--reply.rippleButton`).trigger(`click`);
    if (send == true) {
      editThreadData(buttonsUnaccept[id].prefix, buttonsUnaccept[id].status);
      $(`.button--icon.button--icon--reply.rippleButton`).trigger(`click`);
    }
  }

  function pasteContentPrefix(id, data = {}, send = false) {
    editThreadData(buttonsPrefix[id].prefix, buttonsPrefix[id].status);
    if (send == true) {
      editThreadData(buttonsPrefix[id].prefix, buttonsPrefix[id].status);
      $(`.button--icon.button--icon--reply.rippleButton`).trigger(`click`);
    }
  }

  async function getThreadData() {
    const authorID = $(`a.username`)[0].attributes[`data-user-id`].nodeValue;
    const authorName = $(`a.username`).html();
    const hours = new Date().getHours();
    const greeting =
      4 < hours && hours <= 11
        ? `Доброе утро`
        : 11 < hours && hours <= 17
        ? `Добрый день`
        : 17 < hours && hours <= 21
        ? `Добрый вечер`
        : `Доброй ночи`;

    return {
      user: {
        id: authorID,
        name: authorName,
        mention: `[USER=${authorID}]${authorName}[/USER]`,
      },
      greeting: greeting,
    };
  }

  function editThreadData(prefix, pin = false) {
    // Получаем заголовок темы, так как он необходим при запросе
    const threadTitle = $(`.p-title-value`)[0].lastChild.textContent;

    if (pin == false) {
      fetch(`${document.URL}edit`, {
        method: `POST`,
        body: getFormData({
          prefix_id: prefix,
          title: threadTitle,
          _xfToken: XF.config.csrf,
          _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
          _xfWithData: 1,
          _xfResponseType: `json`,
        }),
      }).then(() => location.reload());
    }
    if (pin == true) {
      fetch(`${document.URL}edit`, {
        method: `POST`,
        body: getFormData({
          prefix_id: prefix,
          title: threadTitle,
          sticky: 1,
          _xfToken: XF.config.csrf,
          _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
          _xfWithData: 1,
          _xfResponseType: `json`,
        }),
      }).then(() => location.reload());
    }
  }

  function getFormData(data) {
    const formData = new FormData();
    Object.entries(data).forEach((i) => formData.append(i[0], i[1]));
    return formData;
  }
})();
