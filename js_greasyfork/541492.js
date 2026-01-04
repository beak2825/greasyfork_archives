// ==UserScript==
// @name         BLACK | Скрипт для Кураторов Форума by J.Murphy and Z.Litvinenko (LightYellow)
// @namespace    https://forum.blackrussia.online/
// @version      1.1.4
// @description  Скрипт для кураторов форума сервера BLACK by J.Murphy and Z.Litvinenko
// @author       J.Murphy and Z.Litvinenko
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @icon         https://i.postimg.cc/T1Psg2nN/T7-Z4-OWeh-Cbq-Afmzo-U2o-Hz-Z5ur-Vb3-HQ-Nfho-Tqp-E8wwh-v-KYBpl-Wv-JLt-MDb-Fxl9-KZi9-B-178-S-PPi-Ornizh4o4-Dh.webp
// @downloadURL https://update.greasyfork.org/scripts/541492/BLACK%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20by%20JMurphy%20and%20ZLitvinenko%20%28LightYellow%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541492/BLACK%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20by%20JMurphy%20and%20ZLitvinenko%20%28LightYellow%29.meta.js
// ==/UserScript==

(function () {
    'use strict';
    6

    const ACCEPT_PREFIX = 8; // префикс одобрено
    const UNACCEPT_PREFIX = 4; // префикс отказано
	const PIN_PREFIX = 2; //  префикс закрепить
	const COMMAND_PREFIX = 10; // команде проекта
	const CLOSE_PREFIX = 7; // префикс закрыто
	const DECIDED_PREFIX = 6; // префикс решено
	const TECHADM_PREFIX = 13 // тех администратору
    const GA_PREFIX = 12 // главному администратору
    const SPEC_PREFIX = 11 // спец админу
	const WATCHED_PREFIX = 9; // рассмотрено
	const WAIT_PREFIX = 14; // ожидание
	const NO_PREFIX = 0;
const TEX_PREFIX = 13; // Префикс "Техническому специалисту"
    const ZB_TECH = 1191;
    const TECH = 488;
    const ZB_PLAYER = 470;
    const ZB_LEADER = 469;
    const OBJ = 471;

    const buttons = [
    {
        title: '----------------------------------------------------------|ROLEPLAY|---------------------------------------------------------',
        content:
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
      },
      {
      title: '| 2.19 DM |',
      content:
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(255, 222, 173)] 2.19. [/COLOR] Запрещен DM (DeathMatch) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [COLOR=rgb(255, 222, 173)] | Jail 60 минут [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(255, 222, 173)]Примечание:[/COLOR] разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил.  [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(255, 222, 173)]Примечание:[/COLOR] нанесение урона с целью защиты особняка или его территории, а также нанесение урона после ДТП не является веской IC причиной, для войны семей предусмотрено отдельное системное мероприятие. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Одобрено[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
         prefix: ACCEPT_PREFIX,
       status: false,
      },
      {
      title: '| 2.13 DB |',
      content:
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(255, 222, 173)] 2.13. [/COLOR] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта[COLOR=rgb(255, 222, 173)] | Jail 60 минут [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Одобрено[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
         prefix: ACCEPT_PREFIX,
       status: false,
      },
      {
      title: '| 2.20 Mass DM |',
      content:
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(255, 222, 173)] 2.20. [/COLOR] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более [COLOR=rgb(255, 222, 173)] | Warn / Ban 3 - 7 дней [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Одобрено[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
         prefix: ACCEPT_PREFIX,
       status: false,
      },
      {
      title: '| 2.15 TK |',
      content:
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(255, 222, 173)] 2.15. [/COLOR] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины[COLOR=rgb(255, 222, 173)] | Jail 60 минут / Warn (за два и более убийства) [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Одобрено[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
         prefix: ACCEPT_PREFIX,
       status: false,
      },
      {
      title: '| 2.16 SK |',
      content:
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(255, 222, 173)] 2.16. [/COLOR] Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них[COLOR=rgb(255, 222, 173)] | Jail 60 минут / Warn (за два и более убийства) [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Одобрено[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
         prefix: ACCEPT_PREFIX,
       status: false,
      },
      {
      title: '| 2.17 PG  |',
      content:
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(255, 222, 173)] 2.17. [/COLOR] Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь[COLOR=rgb(255, 222, 173)] | Jail 30 минут[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Одобрено[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
         prefix: ACCEPT_PREFIX,
       status: false,
      },
      {
      title: '| 2.01 Nrp поведение |',
      content:
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(255, 222, 173)] 2.01. [/COLOR] Запрещено поведение, нарушающее нормы процессов Role Play режима игры [COLOR=rgb(255, 222, 173)] | Jail 30 минут [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(255, 222, 173)]Примечание:[/COLOR] ездить на крышах транспортных средств, бегать или ходить по столам в казино, целенаправленная провокация сотрудников правоохранительных органов с целью развлечения, целенаправленная помеха в проведении различных собеседований и так далее [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Одобрено[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
         prefix: ACCEPT_PREFIX,
       status: false,
      },
      {
      title: '| 2.03 NRP drive |',
      content:
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(255, 222, 173)] 2.03. [/COLOR] Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере [COLOR=rgb(255, 222, 173)] | Jail 30 минут [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(255, 222, 173)]Примечание:[/COLOR] езда на скутере по горам, езда на любом транспортном средстве по встречным полосам, нарушая все правила дорожного движения без какой-либо причины, намеренное создание аварийных ситуаций на дорогах и так далее [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Одобрено[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
         prefix: ACCEPT_PREFIX,
       status: false,
      },
      {
      title: '| 2.47 fdrive|',
      content:
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(255, 222, 173)] 2.47. [/COLOR] Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) [COLOR=rgb(255, 222, 173)] | Jail 60 минут [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Одобрено[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
         prefix: ACCEPT_PREFIX,
       status: false,
      },
      {
      title: '| 2.21 Багоюз |',
      content:
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(255, 222, 173)] 2.21. [/COLOR] Запрещено пытаться обходить игровую систему или использовать любые баги сервера [COLOR=rgb(255, 222, 173)] | Ban 15 - 30 дней / PermBan  [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(255, 222, 173)]Примечание:[/COLOR] под игровой системой подразумеваются функции и возможности, которые реализованы в игре для взаимодействия между игроками, а также взаимодействия игроков с функциями, у которых есть свое конкретное предназначение [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Одобрено[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
         prefix: ACCEPT_PREFIX,
       status: false,
      },
      {
      title: '| 2.55 Багоюз Аним |',
      content:
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(255, 222, 173)] 2.19. [/COLOR] Запрещается багоюз связанный с анимацией в любых проявлениях [COLOR=rgb(255, 222, 173)] | Jail 60 / 120 минут [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(255, 222, 173)]Примечание:[/COLOR] если игрок, используя баг, убирает ограничение на использование оружия в зеленой зоне, сбивает темп стрельбы, либо быстро перемещается во время войны за бизнес или во время перестрелки на мероприятии с семейными контейнерами, последует наказание в виде Jail на 120 минут. Данное наказание используется в случаях, когда, используя ошибку, было получено преимущество перед другими игроками  [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(255, 222, 173)]Примечание:[/COLOR] если игрок использует баги, связанные с анимацией, и при этом не влияет на игровой процесс других игроков, а также не получает преимущество перед другими игроками, последует наказание в виде Jail на 60 минут. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Одобрено[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
         prefix: ACCEPT_PREFIX,
       status: false,
      },
      {
      title: '| 2.54 NRP АКСЕССУАР |',
      content:
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(255, 222, 173)] 2.54. [/COLOR] Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера [COLOR=rgb(255, 222, 173)] | При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(255, 222, 173)]Пример:[/COLOR] слишком большие аксессуары на голове персонажа, имитация гитарой половых органов и тому подобное. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Одобрено[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
         prefix: ACCEPT_PREFIX,
       status: false,
      },
      {
      title: '|  2.04 помеха рп процессу  |',
      content:
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(255, 222, 173)] 2.04. [/COLOR] Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы [COLOR=rgb(255, 222, 173)] | Ban 10 дней / Обнуление аккаунта (при повторном нарушении). [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(255, 222, 173)]Пример:[/COLOR] Таран дальнобойщиков, инкассаторов под разными предлогами [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Одобрено[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
         prefix: ACCEPT_PREFIX,
       status: false,
      },
      {
      title: '| 2.11 ФРАКЦИОННОЕ ТС В ЛИЧ ЦЕЛЯХ |',
      content:
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(255, 222, 173)] 2.11. [/COLOR] Запрещено использование рабочего или фракционного транспорта в личных целях [COLOR=rgb(255, 222, 173)]  | Jail 30 минут [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Одобрено[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
         prefix: ACCEPT_PREFIX,
       status: false,
      },
      {
      title: '| 2.50 АРЕСТ В ИНТЕРЬЕРЕ |',
      content:
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(255, 222, 173)] 2.50. [/COLOR] Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий[COLOR=rgb(255, 222, 173)]  | Ban 7 - 15 дней + увольнение из организации[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Одобрено[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
         prefix: ACCEPT_PREFIX,
       status: false,
      },
      {
      title: '| 6.02 розыск без причины  |',
      content:
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(255, 222, 173)] 6.02. [/COLOR] Запрещено выдавать розыск без Role Play причины [COLOR=rgb(255, 222, 173)] | Warn[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Одобрено[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
         prefix: ACCEPT_PREFIX,
       status: false,
      },
      {
      title: '|  1.13 Гос в каз/раб  |',
      content:
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(255, 222, 173)] 1.13. [/COLOR]  Запрещено работать или находится в казино/платных контейнерах в форме ГОС [COLOR=rgb(255, 222, 173)]  | Jail 30 минут  [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(255, 222, 173)]Исключение:[/COLOR] В форме ОПГ разрешается [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Одобрено[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
         prefix: ACCEPT_PREFIX,
       status: false,
      },
      {
      title: '| 6.03 Nrp коп |',
      content:
     "[HEADING=3][CENTER][I][COLOR=rgb(250, 235, 215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][COLOR=rgb(250, 235, 215)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][FONT=georgia][SIZE=4][COLOR=rgb(255, 222, 173)][I]6.03.[/COLOR][COLOR=rgb(250, 235, 215)]Запрещено поведение не подражающее полицейскому[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 222, 173)][SIZE=4][FONT=georgia] | Warn [/COLOR][/SIZE][/FONT][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(250, 235, 215)][FONT=georgia][SIZE=4] поведение, не соответствующее сотруднику УМВД/ГИБДД/ФСБ.[/SIZE][/FONT][/COLOR][/HEADING]" +
     "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=georgia][SIZE=4]Пример: [/SIZE][/FONT][/COLOR][/HEADING]" +
     "[HEADING=3][FONT=georgia][SIZE=4][COLOR=rgb(250, 235, 215)]* Открытие огня по игрокам без причины;[/COLOR][/SIZE][/FONT][/HEADING]" +
     "[HEADING=3][FONT=georgia][SIZE=4][COLOR=rgb(250, 235, 215)]* Расстрел машин без причины;[/COLOR][/SIZE][/FONT][/HEADING]" +
     "[HEADING=3][FONT=georgia][SIZE=4][COLOR=rgb(250, 235, 215)]* Нарушение ПДД без причины;[/COLOR][/SIZE][/FONT][/HEADING]" +
     "[HEADING=3][FONT=georgia][SIZE=4][COLOR=rgb(250, 235, 215)]* Сотрудник на служебном транспорте кричит о наборе в свою семью на спавне.[/COLOR][/SIZE][/FONT][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Одобрено[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
         prefix: ACCEPT_PREFIX,
       status: false,
      },
      {
      title: '| Nrp ВЧ |',
      content:
     "[HEADING=3][CENTER][I][COLOR=rgb(250, 235, 215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250, 235, 215)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][FONT=georgia][SIZE=4][I][COLOR=rgb(255, 222, 173)][/COLOR][COLOR=rgb(250, 235, 215)] За нарушение правил нападения на Войсковую Часть выдаётся предупреждение [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 222, 173)][SIZE=4][FONT=georgia] | Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ) [/COLOR][/SIZE][/FONT][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Одобрено[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
         prefix: ACCEPT_PREFIX,
      status: false,
      },

         {
        title: '----------------------------------------------------------| Передача жалобы |---------------------------------------------------------',
        content:
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
      },
      {
      title: '| передать ГКФ/ЗГКФ |',
      content:
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG][/CENTER]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]Ваша жалоба переадресована Главному Куратору Форума и Заместителю Главного Куратора Форума[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG][/CENTER]"+
     "[HEADING=3][CENTER][I][FONT=georgia][SIZE=4][COLOR=rgb(255, 222, 173)]Примечание:[/I][/FONT][/SIZE][/COLOR][COLOR=rgb(250,235,215)][FONT=georgia][I][SIZE=4] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG][/CENTER]"+
     "[CENTER][COLOR=rgb(255, 228, 181)][I][FONT=georgia][SIZE=4]Ожидайте ответа[/SIZE][/FONT][/I][/COLOR][/CENTER]",
        prefix: PIN_PREFIX,
      status: true,
      },
      {
      title: '| передать Тех.специалисту |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
      "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]Ваша жалоба передана техническому специалисту[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
      "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
             "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(255, 222, 173)]Примечание:[/COLOR] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.  [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
              "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
    "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Ожидайте ответа[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:TEX_PREFIX,
      status: true,
        },
         {
      title: '| передать ГКФ  |',
      content:
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG][/CENTER]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]Ваша жалоба переадресована [USER=2081259]Главному Куратору Форума[/USER][/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG][/CENTER]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(255, 222, 173)]Примечание:[/COLOR] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.  [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG][/CENTER]"+
     "[CENTER][COLOR=rgb(255, 228, 181)][I][FONT=georgia][SIZE=4]Ожидайте ответа[/SIZE][/FONT][/I][/COLOR][/CENTER]",
        prefix: PIN_PREFIX,
      status: true,
        },
  {
      title: '| передать Кураторам Администрации |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
      "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]Ваша жалоба передана Кураторам Администрации @Joseph Murphy, и @Andranik Dmitrev [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
      "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
             "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(255, 222, 173)]Примечание:[/COLOR] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.  [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
              "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
    "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Ожидайте ответа[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix: PIN_PREFIX,
      status: true,
        },
         {
      title: '| В жалобы на технического специалиста |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
      "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4] Вы ошиблись разделом, обратитесь в раздел жалоб на технических специалистов [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
      "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
             "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(255, 222, 173)]Примечание:[/COLOR] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.  [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
              "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
    "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Закрыто[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
               prefix: CLOSE_PREFIX,
        status: false,
        },
       {
      title: '| В жалобы на администрацию  |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
      "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4] Вы ошиблись разделом, обратитесь в раздел жалоб на администрацию[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
      "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
             "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(255, 222, 173)]Примечание:[/COLOR] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.  [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
              "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
    "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Закрыто[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
               prefix: CLOSE_PREFIX,
        status: false,
        },
    {
      title: '| В жалобы на Агентов Поддержки  |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
      "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4] Вы ошиблись разделом, обратитесь в раздел жалоб на хелперов[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
      "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
             "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(255, 222, 173)]Примечание:[/COLOR] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.  [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
              "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
    "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Закрыто[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
               prefix: CLOSE_PREFIX,
        status: false,
        },
     {
      title: '| В жалобы на ЛИДЕРОВ  |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
      "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4] Вы ошиблись разделом, обратитесь в раздел жалоб на лидеров[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
      "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
             "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(255, 222, 173)]Примечание:[/COLOR] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.  [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
              "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
    "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Закрыто[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
               prefix: CLOSE_PREFIX,
        status: false,
        },
    {
      title: '| В жалобы на сотрудников|',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
      "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4] Вы ошиблись разделом, обратитесь в раздел жалоб на сотрудников в разделе вашей организации[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
      "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
             "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(255, 222, 173)]Примечание:[/COLOR] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.  [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
              "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
    "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Закрыто[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
               prefix: CLOSE_PREFIX,
        status: false,
        },
   {
      title: '| В ОБЖАЛОВАНИЕ |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
      "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]Вы ошиблись разделом, обратитесь в раздел обжалований наказаний[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
      "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
             "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(255, 222, 173)]Примечание:[/COLOR] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.  [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
              "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
    "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Закрыто[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
               prefix: CLOSE_PREFIX,
        status: false,
        },
         {
      title: '| В ТЕХ РАЗДЕЛ |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
      "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4] Вы ошиблись разделом, обратитесь в технический раздел[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
      "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
             "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(255, 222, 173)]Примечание:[/COLOR] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.  [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
              "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
    "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Закрыто[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
               prefix: CLOSE_PREFIX,
        status: false,
        },


         {
      title: '----------------------------------------------------| Отказ жалоб на игроков |----------------------------------------------------',
      content:
          '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
      },
     {
      title: '| Подделка доказательств  |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
      "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]После тщательной проверки предоставленных вами доказательств было установлено, что они являются поддельными и созданы с использованием графических редакторов (фотошоп). В связи с нарушением правил нашего форума, касающихся достоверности информации и честного взаимодействия, ваш форумный аккаунт будет  заблокирован. Мы призываем всех пользователей соблюдать правила и предоставлять только достоверные данные. Спасибо за понимание.[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
      "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
             "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(255, 222, 173)]Примечание:[/COLOR] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.  [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
              "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
    "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
               prefix: UNACCEPT_PREFIX,
        status: false,
        },
{
      title: '| Недостаточно док |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
      "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]Ваша жалоба рассмотрена, но, к сожалению, представленных доказательств недостаточно для объективного решения. Чтобы мы могли принять меры, пожалуйста, добавьте дополнительные материалы (скриншоты, видео, и т. д.), подтверждающие ваши слова. Без достаточных доказательств жалоба не может быть удовлетворена. Вы можете подать новую жалобу с более полными данными.[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
      "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
             "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(255, 222, 173)]Примечание:[/COLOR] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.  [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
              "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
    "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
               prefix: UNACCEPT_PREFIX,
        status: false,
        },
{
      title: '| Недостаточно док |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
      "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]Ваша жалоба рассмотрена, но, к сожалению, представленных доказательств недостаточно для объективного решения. Чтобы мы могли принять меры, пожалуйста, добавьте дополнительные материалы (скриншоты, видео, и т. д.), подтверждающие ваши слова. Без достаточных доказательств жалоба не может быть удовлетворена. Вы можете подать новую жалобу с более полными данными.[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
      "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
             "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(255, 222, 173)]Примечание:[/COLOR] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.  [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
              "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
    "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
               prefix: UNACCEPT_PREFIX,
        status: false,
        },

   {
      title: '| Никнейм  |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
      "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]Никнейм, указанный в форме, отличается от никнейма, зафиксированного в доказательствах нарушения. Пожалуйста, уточните информацию..[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
      "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
             "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(255, 222, 173)]Примечание:[/COLOR] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.  [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
              "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
    "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
               prefix: UNACCEPT_PREFIX,
        status: false,
        },
  {
      title: '| нецензурный заголовок   |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
      "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]Ваша жалоба отклонена, так как в заголовке содержится нецензурная лексика и некорректное оформление. Обратите внимание, что за подобные нарушения ваш форумный аккаунт будет заблокирован[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
      "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
             "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(255, 222, 173)]Примечание:[/COLOR] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.  [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
              "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
    "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
               prefix: UNACCEPT_PREFIX,
        status: false,
        },
{
      title: '| Отсутствуют док-ва  |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
      "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]Отсутствуют доказательства - следовательно, рассмотрению не подлежит. Загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx и так далее.[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
      "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
             "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(255, 222, 173)]Примечание:[/COLOR] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.  [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
              "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
    "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
               prefix: UNACCEPT_PREFIX,
        status: false,
        },
{
      title: '| ДОК-ВА IMGUR|',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
      "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]Ваши доказательства не удалось открыть. Загрузите материалы на фото-видеохостинг Imgur и создайте новую жалобу с актуальными ссылками. Это позволит нам быстрее и точнее рассмотреть ваше обращение.[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
      "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
             "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(255, 222, 173)]Примечание:[/COLOR] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.  [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
              "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
    "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
               prefix: UNACCEPT_PREFIX,
        status: false,
        },
{
      title: '| ДОК-ВА В YAPX |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
      "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]Ваши доказательства не открываются. Пожалуйста, загрузите материалы на фотовидеохостинг YAPX и подайте новую жалобу с актуальными ссылками. Это позволит нам оперативно и точно рассмотреть ваше обращение[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
      "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
             "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(255, 222, 173)]Примечание:[/COLOR] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.  [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
              "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
    "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
               prefix: UNACCEPT_PREFIX,
        status: false,
        },
{
      title: '| ДОК-ВА НА GOOGLE DISK |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
      "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4] Ваши доказательства не открываются. Пожалуйста, загрузите материалы на Google Диск и подайте новую жалобу с актуальными ссылками. Это поможет нам быстрее и точнее рассмотреть ваше обращение.[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
      "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
             "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(255, 222, 173)]Примечание:[/COLOR] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.  [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
              "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
    "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
               prefix: UNACCEPT_PREFIX,
        status: false,
        },
{
      title: '| ДОК-ВА не открывается |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
      "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]Ваши доказательства не открываются, что делает невозможным их рассмотрение. Пожалуйста, загрузите материалы на такие платформы, как Imgur, Yandex Disk, YouTube, Google Диск или другие подобные видеохостинги и предоставьте ссылку. Только в этом случае мы сможем корректно рассмотреть вашу жалобу[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
      "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
             "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(255, 222, 173)]Примечание:[/COLOR] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.  [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
              "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
    "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
               prefix: UNACCEPT_PREFIX,
        status: false,
        },

{
      title: '|  ДОК-ВА В СОЦ.СЕТЯХ  |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
      "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4] Доказательства в социальных сетях и т.д. не принимаются. Пожалуйста, загрузите материалы на Imgur, YAPX или Google Диск и отправьте новую жалобу с актуальными ссылками. Это ускорит рассмотрение вашего обращения.[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
      "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
             "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(255, 222, 173)]Примечание:[/COLOR] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.  [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
              "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
    "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
               prefix: UNACCEPT_PREFIX,
        status: false,
        },
{
      title: '|  Док-ва обрываются |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
      "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4] Ваша жалоба отказана, так как Видео-доказательства обрываются. Загрузите полную Видеозапись на видео-хостинг YouTube, IMGUR.[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
      "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
             "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(255, 222, 173)]Примечание:[/COLOR] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.  [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
              "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
    "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
               prefix: UNACCEPT_PREFIX,
        status: false,
        },
{
      title: '|  Док-ва отредакт|',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
      "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4] Доказательства, предоставленные вами, были отредактированы, что делает их недействительными для рассмотрения.Жалоба не может быть рассмотрена в текущем виде. Пожалуйста, предоставьте новые, неизменённые доказательства. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
      "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
             "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(255, 222, 173)]Примечание:[/COLOR] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.  [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
              "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
    "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
               prefix: UNACCEPT_PREFIX,
        status: false,
        },
{
      title: '|  Док-ва в соц сетях  |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
      "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]Доказательства в социальных сетях и т.д. не принимаются. Загрузите доказательства на фото-видео хостинги YouTube,Imgur, Yapx и так далее. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
      "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
             "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(255, 222, 173)]Примечание:[/COLOR] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.  [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
              "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
    "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
               prefix: UNACCEPT_PREFIX,
        status: false,
        },
{
      title: '|  Док-ва в плохом качестве  |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
      "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]Предоставленные вами доказательства имеют плохое качество, что затрудняет их анализ и делает невозможным дальнейшее рассмотрение жалобы. Для корректного рассмотрения просьба предоставить более четкие и качественные материалы. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
      "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
             "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(255, 222, 173)]Примечание:[/COLOR] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.  [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
              "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
    "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
               prefix: UNACCEPT_PREFIX,
        status: false,
        },
{
      title: '|  Нарушений нет |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
      "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4] Нарушений со стороны игрока не было замечено [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
      "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
             "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(255, 222, 173)]Примечание:[/COLOR] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.  [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
              "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
    "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
               prefix: UNACCEPT_PREFIX,
        status: false,
        },
{
      title: '| Нет условий сделки |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
      "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4] На предоставленных доказательствах отсутствуют условия сделки, что делает невозможным их использование для анализа ситуации. Без этих данных жалоба не может быть рассмотрена. Пожалуйста, представьте новые доказательства, в которых будут указаны все условия сделки[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
      "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
             "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(255, 222, 173)]Примечание:[/COLOR] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.  [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
              "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
    "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
               prefix: UNACCEPT_PREFIX,
        status: false,
        },
{
      title: '| Нет time |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
      "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]  Ваша жалоба отказана так как на предоставленных доказательствах отсутствуют дата и время (/time), что делает их невозможными для корректного рассмотрения. Для дальнейшего анализа необходимо, чтобы все материалы содержали точные временные метки[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
      "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
             "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(255, 222, 173)]Примечание:[/COLOR] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.  [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
              "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
    "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
               prefix: UNACCEPT_PREFIX,
        status: false,
        },


{
      title: '|  Нет таймкодов  |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
      "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4] В вашей жалобе отсутствуют таймкоды, что делает невозможным её рассмотрение. Если жалоба длится более 3-х минут, для корректного анализа нам необходимы точные временные метки событий. Например: 0:30 — условие сделки. 1:20 — обмен машинами. 2:20 — подмена машины на другую и выход из игры. Пожалуйста, укажите таймкоды в самой сути жалобы, чтобы мы могли корректно рассмотреть ваше обращение [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
      "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
             "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(255, 222, 173)]Примечание:[/COLOR] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.  [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
              "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
    "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
               prefix: UNACCEPT_PREFIX,
        status: false,
        },

{
      title: '|  Прошло 3 дня |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
      "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4] Ваша жалоба отказана, т.к. с момента нарушения прошло более 72-ух часов [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
      "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
             "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(255, 222, 173)]Примечание:[/COLOR] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.  [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
              "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
    "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
               prefix: UNACCEPT_PREFIX,
        status: false,
        },

{
      title: '|  Уже был ответ |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
      "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4] Ваша жалоба отклонена, так как по данному вопросу ранее уже был предоставлен полный и обоснованный ответ. Решение остается в силе, и повторные жалобы без новых значимых обстоятельств рассматриваться не будут. Рекомендуем ознакомиться с предыдущим ответом.[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
      "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
             "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(255, 222, 173)]Примечание:[/COLOR] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.  [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
              "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
    "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
               prefix: UNACCEPT_PREFIX,
        status: false,
        },
{
      title: '|   Не по форме |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
      "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4] Ваша жалоба составлена не по форме. Внимательно прочитайте правила подачи жалоб на игроков, закрепленные в этом разделе [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
      "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
             "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(255, 222, 173)]Примечание:[/COLOR] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.  [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
              "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
    "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
               prefix: UNACCEPT_PREFIX,
        status: false,
        },
   {
      title: '|   жб на 2+ игроков  |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
      "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]  Нельзя писать одну жалобу на двух и белее игроков ( на каждого игрока отдельная жалоба) [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
      "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
             "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(255, 222, 173)]Примечание:[/COLOR] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.  [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
              "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
    "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
               prefix: UNACCEPT_PREFIX,
        status: false,
        },

   {
      title: '|   вирт на донат |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
      "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]  Ваша жалоба отклонена, так как обмен автокейсов, покупка дополнительных слотов на машину для семьи и подобные операции за виртуальную валюту являются запрещёнными. Соответственно нарушений со стороны игрока отсутствуют [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
      "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
             "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(255, 222, 173)]Примечание:[/COLOR] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.  [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
              "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
    "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
               prefix: UNACCEPT_PREFIX,
        status: false,
      },
      {
      title: '|   ОШИБКА РАЗДЕЛОМ |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
      "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4] Вы ошиблись разделом. Ваше обращение будет перенесено в соответствующий раздел для дальнейшего рассмотрения. Спасибо за понимание [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
      "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
             "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(255, 222, 173)]Примечание:[/COLOR] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.  [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
              "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
    "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Закрыто[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
               prefix: CLOSE_PREFIX ,
        status: false,
        },
  {
      title: '----------------------------------------------------| РП Биографии |----------------------------------------------------',
      content:
          '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
      },
      {
      title: '| одобрена |',
      content:
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4] Ваша ролевая биография успешно прошла проверку и получила одобрение. История вашего персонажа соответствует всем требованиям, грамотно оформлена и имеет интересный, связный сюжет. На основании этого вы получаете право подать заявление на лидерскую должность [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Одобрено[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
         prefix: ACCEPT_PREFIX,
       status: false,
      },
      {
      title: '| NRP Nick |',
      content:
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]Ваша биография отклонена по причине использования некорректного (nonRP) никнейма. На сервере допускаются только реалистичные имена и фамилии, которые соответствуют правилам RolePlay.[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(255, 222, 173)]Для продолжения необходимо: [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(255, 222, 173)]Изменить ник на правильный формат (например, Андрей Зотов) [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(255, 222, 173)]После внесения изменений вы сможете повторно подать заявку на рассмотрение. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
     status: false,
      },
      {
      title: '| заголовок не по форме|',
      content:
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4] Ваша биография была отклонена из-за неверного оформления заголовка. Заголовок должен быть оформлен в следующем виде: RolePlay биография гражданина Имя_Фамилия без дополнительных символов, сокращений или ненужных слов [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix: UNACCEPT_PREFIX,
      status: false,
      },
      {
      title: '| более 1 рп био на ник |',
      content:
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к запрещено создавать более одной RP Биографии на один Nick [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix: UNACCEPT_PREFIX,
      status: false,
      },
      {
      title: '| некоррект. возраст |',
      content:
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]Ваша биография была отклонена, так как дата рождения не соответствует заявленному возрасту персонажа. Пожалуйста, убедитесь, что возраст персонажа соответствует указанной дате рождения. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix: UNACCEPT_PREFIX,
      status: false,
      },
      {
      title: '| мало информации |',
      content:
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]Ваша биография была отклонена, так как в ней недостаточно информации для полноценного рассмотрения. Для того чтобы биография соответствовала требованиям, необходимо предоставить более детальное описание персонажа [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix: UNACCEPT_PREFIX,
      status: false,
      },
      {
      title: '| нет 18 лет |',
      content:
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]Ваша биография была отклонена, так как персонажу не исполнилось 18 лет, что противоречит правилам сервера. Для участия в проекте персонаж должен быть старше 18 лет. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix: UNACCEPT_PREFIX,
      status: false,
      },
      {
      title: '| от 1го лица |',
      content:
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]Ваша RolePlay - биография отказана т.к. написана от 1 го лица[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix: UNACCEPT_PREFIX,
      status: false,
      },
      {
      title: '| не по форме |',
      content:
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]Ваша биография была отклонена, так как она составлена не по установленной форме. Для корректной подачи биографии необходимо соблюдать правила оформления, которые указаны на нашем сервере.[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix: UNACCEPT_PREFIX,
      status: false,
      },
      {
      title: '| неграмотная |',
      content:
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]Ваша биография была отклонена из-за наличия тавтологии, грамматических и пунктуационных ошибок. Каждая ошибка влияет на общую читаемость и восприятие текста.[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(250,235,215)] Тавтология — это риторическая фигура, представляющая собой необоснованное повторение одних и тех же (или однокоренных) или близких по смыслу слов.[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(250,235,215)] Грамматическая ошибка - это ошибка в структуре языковой единицы: в структуре слова, словосочетания или предложения; это нарушение какой-либо грамматической нормы - словообразовательной, морфологической, синтаксической  [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(250,235,215)]Пунктуационная ошибка - это неиспользование пишущим необходимого знака препинания или его употребление там, где он не требуется, а также необоснованная замена одного знака препинания другим [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
          prefix: UNACCEPT_PREFIX,
        status: false,
      },
      {
      title: '| тавтология |',
      content:
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]Ваша биография была отклонена из-за наличия тавтологии. Это избыточное повторение слов или выражений, которые по смыслу обозначают одно и то же. Тавтология нарушает правила оформления текста и снижает его читаемость.[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix: UNACCEPT_PREFIX,
      status: false,
      },
      {
      title: '| знаки препинания |',
      content:
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]Ваша биография была отклонена из-за наличия пунктуационных ошибок. Пунктуация играет ключевую роль в организации текста, разделении предложений и обеспечении правильной интонации. Неверное использование знаков препинания нарушает структуру текста и затрудняет восприятие информации..[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(250,235,215)]Пунктуационная ошибка - это неиспользование пишущим необходимого знака препинания или его употребление там, где он не требуется, а также необоснованная замена одного знака препинания другим [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix: UNACCEPT_PREFIX,
      status: false,
      },
      {
      title: '| граммат. ошибки |',
      content:
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]Ваша биография отклонена по причине наличия грамматических ошибок. Грамматические ошибки негативно влияют на восприятие текста, делают его трудным для чтения и понимания, нарушают логику повествования и могут полностью искажать передаваемый смысл.[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(250,235,215)] Грамматическая ошибка - это ошибка в структуре языковой единицы: в структуре слова, словосочетания или предложения; это нарушение какой-либо грамматической нормы - словообразовательной, морфологической, синтаксической  [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix: UNACCEPT_PREFIX,
      status: false,
      },
      {
      title: '| скопирована |',
      content:
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]Ваша биография была отклонена, поскольку выявлен факт полного или частичного копирования текста из сторонних источников. На нашем проекте недопустимо использование готовых биографий без самостоятельной переработки или авторского изложения.[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix: UNACCEPT_PREFIX,
      status: false,
      },
      {
      title: '| скопирована со своей старой био |',
      content:
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]Ваша биография была отклонена, так как установлено, что она полностью или частично скопирована с вашей ранее поданной (старой) биографии. На проекте требуется предоставлять новую, уникально составленную биографию для каждого нового персонажа или при каждой новой подаче.[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix: UNACCEPT_PREFIX,
      status: false,
      },
      {
      title: '| мало инфо детство |',
      content:
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4] Ваша биография была отклонена, так как в пункте детство предоставлено недостаточно информации. Пункт детство является важной частью биографии персонажа, так как именно в этом периоде формируются его черты характера, привычки, взгляды на жизнь и мотивация.[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix: UNACCEPT_PREFIX,
     status: false,
      },
      {
      title: '| мало инфо юность |',
      content:
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4] Ваша биография была отклонена, так как в пункте детство предоставлено недостаточно информации. Пункт детство является важной частью биографии персонажа, так как именно в этом периоде формируются его черты характера, привычки, взгляды на жизнь и мотивация.[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix: UNACCEPT_PREFIX,
      status: false,
      },
      {
      title: '| мало инфо  |',
      content:
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4] Ваша биография отклонена по причине недостаточного объёма и содержания в пунктах Детстао и Юность - Взрослая жизнь. Для утверждения биографии необходимо более подробно раскрыть ключевые события, личностное развитие, опыт и достижения, связанные с указанными этапами жизни. Текст должен соответствовать примеру по объёму и содержательной насыщенности.[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix: UNACCEPT_PREFIX,
      status: false,
      },
      {
      title: '| Ошибка разделом |',
      content:
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]Вы ошиблись разделом [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix: UNACCEPT_PREFIX,
      status: false,
      },
      {
      title: '------------------------------------------------------| RP Ситуации |-------------------------------------------------------------------',
      content:
          '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
      },
      {
      title: '| одобрена |',
      content:
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4] Ваша RolePlay ситуация одобрена. Отыгровка на высоком уровне: всё логично, последовательно и живо. Выделяются творческий подход и отличная реакция на события. Хорошая работа. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Одобрено[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
         prefix: ACCEPT_PREFIX,
       status: false,
      },
      {
      title: '| отказана |',
      content:
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]Ваша RolePlay ситуация отклонена. Отыгровка недостаточно проработана, рекомендуем пересмотреть подход и уделить больше внимания деталям.[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix: UNACCEPT_PREFIX,
      status: false,
      },
      {
      title: '| не зарегистрированы NickName |',
      content:
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]Ваша RolePlay ситуация отклонена. Указанные NickName участников не зарегистрированы на сервере, что делает отыгровку недействительной. Пожалуйста, проверьте корректность данных и при необходимости повторите отправку[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix: UNACCEPT_PREFIX,
      status: false,
      },
      {
      title: '| скопирована |',
      content:
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]Ваша RolePlay ситуация отклонена. Выявлено полное или частичное копирование материалов. Отыгровки должны быть исключительно оригинальными. Повторная подача возможна только при создании уникального контента.[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix: UNACCEPT_PREFIX,
      status: false,
      },
      {
      title: '| не по форме |',
      content:
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]Ваша RolePlay ситуация отказана т.к она составлена не по форме..[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix: UNACCEPT_PREFIX,
      status: false,
      },
      {
      title: '| НАЗВАНИЕ ТЕМЫ не верно |',
      content:
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]Ваша RolePlay ситуация отказана. Название темы не соответствует установленным требованиям. Пожалуйста, убедитесь в правильности оформления и повторно отправьте отыгровку с исправленным названием.[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix: UNACCEPT_PREFIX,
      status: false,
      },
      {
      title: '| не имеет смысла |',
      content:
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]Ваша RolePlay ситуация отказана, так как она не имеет смысла. Рекомендуем пересмотреть ситуацию и учесть все логические моменты перед повторной отправкой.[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix: UNACCEPT_PREFIX,
      status: false,
      },
      {
      title: '| Ошибка разделом |',
      content:
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]Вы ошиблись разделом [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix: UNACCEPT_PREFIX,
      status: false,
      },
      {
      title: '------------------------------------------------------| Неофициальные RP организации  |-------------------------------------------------------------------',
      content:
          '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
      },

      {
      title: '| одобрить |',
      content:
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]Ваша неофициальная ролевая организация одобрена. Для сохранения статуса активной организации необходимо проявлять активность не реже одного раза в неделю.[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(250,235,215)] Прикрепляйте в эту тему любые подтверждения вашей активности — скриншоты, видеозаписи или иные материалы, отражающие действия вашей организации.[COLOR=rgb(255, 222, 173)] [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4][COLOR=rgb(250,235,215)]В случае отсутствия активности организация может быть закрыта.  [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Одобрено[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
         prefix: ACCEPT_PREFIX,
       status: false,
      },
      {
      title: '| Отказать |',
      content:
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]Ваша неофициальная RolePlay организация отклонена. На данный момент она не соответствует требованиям для одобрения. Вы можете доработать концепцию и подать заявку повторно.  [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix: UNACCEPT_PREFIX,
      status: false,
      },
      {
      title: '| Отсутствует смысл |',
      content:
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]Ваша неофициальная RolePlay организация отклонена, так как представленная концепция не имеет достаточной смысловой основы для реализации в рамках проекта. Вы можете пересмотреть идею и подать новую заявку.   [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix: UNACCEPT_PREFIX,
      status: false,
      },
      {
      title: '| отсутствует состав +3 |',
      content:
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]Ваша неофициальная RolePlay организация отклонена, так как отсутствует стартовый состав из минимум трёх участников. Вы можете доукомплектовать состав и подать заявку повторно.  [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix: UNACCEPT_PREFIX,
      status: false,
      },
      {
      title: '| не по форме |',
      content:
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]Ваша неофициальная RolePlay организация отклонена, так как заявка составлена не по установленной форме и не может быть рассмотрена. Пожалуйста, исправьте оформление согласно требованиям и подайте заявку повторно  [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix: UNACCEPT_PREFIX,
      status: false,
      },
      {
      title: '| скопирована |',
      content:
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]Ваша неофициальная RolePlay организация отклонена, так как она является копией уже поданной заявки. Пожалуйста, представьте оригинальную концепцию, чтобы ваша организация могла быть рассмотрена.  [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix: UNACCEPT_PREFIX,
      status: false,
      },
      {
      title: '| Ошибка разделом |',
      content:
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(250,235,215)][FONT=georgia][SIZE=4]Вы ошиблись разделом [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
     "[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix: UNACCEPT_PREFIX,
       status: false,
        },
        {
          title: '-------------------------------------------------------| Отказ жалобы |------------------------------------------------------',
          content:

          '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
        },
        {
        title: '| Ошибка сервером |',
        content:
       "[HEADING=3][CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(250,235,215)]Доброго времени суток, уважаемый(-ая) {{ user.name }}.[/SIZE][/COLOR][/I][/FONT][/CENTER][/HEADING]" +
       "[CENTER][IMG width=695px]https://i.postimg.cc/nVj6Zm9v/112-20250428005036.png[/IMG]"+
       "[HEADING=3][CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(250,235,215)]Ошиблись сервером, переношу на нужный.[/SIZE][/COLOR][/I][/FONT][/CENTER][/HEADING]",
           prefix: WAIT_PREFIX,
         status: false,

    },
];

$(document).ready(() => {
// Загрузка скрипта для обработки шаблонов
$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

// Добавление кнопок при загрузке страницы
addButton('На рассмотрение', 'pin');
addButton('Одобрено', 'accepted');
addButton('Отказано', 'unaccept');
addButton('Закрыто', 'close');
addButton('Ответы КФ', 'selectAnswer');

// Поиск информации о теме
const threadData = getThreadData();

$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
$('button#close').click(() => editThreadData(CLOSE_PREFIX, false));
$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));

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
        editThreadData(buttons[id].prefix, buttons[id].status, buttons[id].thread);
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
4 < hours && hours <= 11
? 'Доброе утро'
: 11 < hours && hours <= 15
? 'Добрый день'
: 15 < hours && hours <= 21
? 'Добрый вечер'
: 'Доброй ночи',
};
}

function editThreadData(prefix, pin = false, thread = 0) {
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

    if(thread != 0) {
        moveThread(prefix, thread)
    }

}

function moveThread(prefix, type) {
	// Перемещение темы
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
})();