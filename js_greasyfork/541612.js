// ==UserScript==
// @name         BLACK | Скрипт для Кураторов Форума by J.Murphy (Black + LightYellow)
// @namespace    https://forum.blackrussia.online/
// @version      1.2.2
// @description  Скрипт для кураторов форума by J.Murphy
// @author       J.Murphy (Скрипт обновлял Z.Litvinenko)
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @icon https://freepngimg.com/thumb/eagle/20-eagle-black-siluet-png-image-download-thumb.png
// @downloadURL https://update.greasyfork.org/scripts/541612/BLACK%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20by%20JMurphy%20%28Black%20%2B%20LightYellow%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541612/BLACK%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20by%20JMurphy%20%28Black%20%2B%20LightYellow%29.meta.js
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

        title: '----------------------------------------------------------| ROLEPLAY |---------------------------------------------------------',
        content:
       '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
      },
      {
      title: '| 2.19 DM',
      content:
      "[CENTER][IMG width=695px]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/IMG]<br>"+
     "[HEADING=3][CENTER][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
            "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[HEADING=3][SPOILER][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]2.19.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4] | Jail 60 минут[/SIZE][/FONT][/COLOR][/SPOILER][/HEADING]" +
            "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
     "[CENTER][I][B][FONT=georgia][COLOR=rgb(0, 0, 0)][SIZE=4]Примечание: [/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил.[/SIZE][/COLOR][/I][/B][/FONT]" +
            "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
     "[CENTER][I][B][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]нанесение урона с целью защиты особняка или его территории, а также нанесение урона после ДТП не является веской IC причиной, для войны семей предусмотрено отдельное системное мероприятие.[/SIZE][/I][/B][/FONT][/COLOR]" +
   "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]SERVER [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix: ACCEPT_PREFIX,
       status: false,
     },
 {
        title: '| 2.13 DB |',
      content:
      "[CENTER][IMG width=695px]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
        "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 0, 0)]2.13.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Jail 60 минут [/COLOR][/SIZE][/FONT][/SPOILER]" +
   "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]SERVER [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
   "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
 {
        title: '| 2.20 Mass DM |',
      content:
      "[CENTER][IMG width=695px]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
        "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 0, 0)]2.20.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Warn / Ban 3 - 7 дней [/COLOR][/SIZE][/FONT][/SPOILER]" +
     "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]SERVER [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
 {
        title: '| 2.15 TK |',
      content:
      "[CENTER][IMG width=695px]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/IMG]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
        "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 0, 0)]2.15.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Jail 60 минут / Warn (за два и более убийства)[/COLOR][/SIZE][/FONT][/SPOILER]" +
   "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]SERVER [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '| 2.16 SK |',
      content:
      "[CENTER][IMG width=695px]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
           "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 0, 0)]2.16.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Jail 60 минут / Warn (за два и более убийства) [/COLOR][/SIZE][/FONT][/SPOILER]" +

   "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]SERVER [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
     {
        title: '| 2.17 PG |',
      content:
      "[CENTER][IMG width=695px]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
            "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 0, 0)]2.17.[/COLOR]][COLOR=rgb(209, 213, 216)] Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia]  | Jail 30 минут [/COLOR][/SIZE][/FONT][/SPOILER]" +
      "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]SERVER [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
   "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
     {
      title: '| 2.04 помеха рп процессу |',
      content:
      "[CENTER][IMG width=695px]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/IMG]<br>"+
     "[HEADING=3][CENTER][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
            "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[HEADING=3][SPOILER][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]2.04.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4] Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4] | Ban 10 дней / Обнуление аккаунта (при повторном нарушении).[/SIZE][/FONT][/COLOR][/SPOILER][/HEADING]" +
            "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
     "[CENTER][I][B][FONT=georgia][COLOR=rgb(0, 0, 0)][SIZE=4]Пример: [/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Таран дальнобойщиков, инкассаторов под разными предлогами.[/SIZE][/COLOR][/I][/B][/FONT]<br><br>" +
    "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]SERVER [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
   "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix: ACCEPT_PREFIX,
       status: false,
     },
      {
      title: '| 2.54 NRP Аксессуар |',
      content:
      "[CENTER][IMG width=695px]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/IMG]<br>"+
     "[HEADING=3][CENTER][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
             "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[HEADING=3][SPOILER][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]2.52.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]  Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]| При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут.[/SIZE][/FONT][/COLOR][/SPOILER][/HEADING]" +
             "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
     "[CENTER][I][B][FONT=georgia][COLOR=rgb(0, 0, 0)][SIZE=4]Пример: [/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]слишком большие аксессуары на голове персонажа, имитация гитарой половых органов и тому подобное.[/SIZE][/COLOR][/I][/B][/FONT]" +
   "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]SERVER [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
   "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix: ACCEPT_PREFIX,
       status: false,
     },
  {
        title: '| 2.11 ФРАКЦИОННОЕ ТС В ЛИЧ ЦЕЛЯХ |',
      content:
      "[CENTER][IMG width=695px]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
         "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
    "[HEADING=3][SPOILER][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]2.11.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4] Запрещено использование рабочего или фракционного транспорта в личных целях[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia]  | Jail 30 минут [/COLOR][/SIZE][/FONT][/SPOILER]" +
   "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]SERVER [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
   "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },

    {
        title: '| 2.50 АРЕСТ В ИНТЕРЬЕРЕ |',
      content:
      "[CENTER][IMG width=695px]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/IMG]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
   "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
    "[HEADING=3][SPOILER][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]2.50.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4] Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4] | Ban 7 - 15 дней + увольнение из организации [/SIZE][/FONT][/COLOR][/SPOILER][/HEADING]" +
   "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]SERVER [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
   "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },

    {
      title: '| 6.02 розыск без причины |',
      content:
      "[CENTER][IMG width=695px]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/IMG]<br>"+
     "[HEADING=3][CENTER][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
           "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
     "[HEADING=3][SPOILER][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]6.02.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4] Запрещено выдавать розыск без Role Play причины.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4] | Warn[/SIZE][/FONT][/COLOR][/SPOILER][/HEADING]" +
   "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]SERVER [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
   "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix: ACCEPT_PREFIX,
       status: false,
     },
    {
        title: '| 2.01 Nrp поведение |',
      content:
      "[CENTER][IMG width=695px]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
   "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 0, 0)]2.01.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено поведение, нарушающее нормы процессов Role Play режима игры[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia]  | Jail 30 минут [/COLOR][/SIZE][/FONT][/SPOILER]" +
           "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[CENTER][I][B][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]ездить на крышах транспортных средств, бегать или ходить по столам в казино, целенаправленная провокация сотрудников правоохранительных органов с целью развлечения, целенаправленная помеха в проведении различных собеседований и так далее.[/SIZE][/FONT][/COLOR]" +
   "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]SERVER [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },

    {
        title: '| 2.03 NRP drive |',
      content:
      "[CENTER][IMG width=695px]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
  "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 0, 0)]2.03.[/COLOR][COLOR=rgb(209, 213, 216)]Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Jail 30 минут [/COLOR][/SIZE][/FONT][/SPOILER]" +
  "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[CENTER][I][B][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4] езда на скутере по горам, езда на любом транспортном средстве по встречным полосам, нарушая все правила дорожного движения без какой-либо причины, намеренное создание аварийных ситуаций на дорогах и так далее.[/SIZE][/FONT][/COLOR]" +
  "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]SERVER [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
   "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '| 2.47 fdrive |',
      content:
      "[CENTER][IMG width=695px]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/IMG]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
  "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 0, 0)]2.47.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора)[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Jail 60 минут [/COLOR][/SIZE][/FONT][/SPOILER]" +
  "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]SERVER [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
   "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
     {
       title: '| 2.21 Багоюз |',
      content:
      "[CENTER][IMG width=695px]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
          "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 0, 0)]2.21.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено пытаться обходить игровую систему или использовать любые баги сервера[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Ban 15 - 30 дней / PermBan [/COLOR][/SIZE][/FONT][/SPOILER]" +
  "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[CENTER][I][B][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4] под игровой системой подразумеваются функции и возможности, которые реализованы в игре для взаимодействия между игроками, а также взаимодействия игроков с функциями, у которых есть свое конкретное предназначение.[/SIZE][/FONT][/COLOR]<br>" +
     "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]SERVER [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '| 2.28 Аморал+ |',
      content:
      "[CENTER][IMG width=695px]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
  "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][I][B][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/CENTER][/HEADING]" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 0, 0)]2.08.[/COLOR][COLOR=rgb(209, 213, 216)]Запрещена любая форма аморальных действий сексуального характера в сторону игроков.[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia]  | Jail 30 минут [/COLOR][/SIZE][/FONT][/SPOILER]" +
  "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[CENTER][I][B][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]Исключение: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]обоюдное согласие обеих сторон.[/SIZE][/FONT][/COLOR]<br>" +
  "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]SERVER [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '| 2.55 Багоюз Аним |',
      content:
      "[CENTER][IMG width=695px]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
         "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 0, 0)]2.55.[/COLOR][COLOR=rgb(209, 213, 216)]Запрещается багоюз связанный с анимацией в любых проявлениях.[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Jail 60 / 120 минут [/COLOR][/SIZE][/FONT][/SPOILER]" +
  "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[CENTER][I][B][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]если игрок, используя баг, убирает ограничение на использование оружия в зеленой зоне, сбивает темп стрельбы, либо быстро перемещается во время войны за бизнес или во время перестрелки на мероприятии с семейными контейнерами, последует наказание в виде Jail на 120 минут. Данное наказание используется в случаях, когда, используя ошибку, было получено преимущество перед другими игроками. [/SIZE][/FONT][/COLOR]" +
          "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[CENTER][I][B][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]если игрок использует баги, связанные с анимацией, и при этом не влияет на игровой процесс других игроков, а также не получает преимущество перед другими игроками, последует наказание в виде Jail на 60 минут. [/SIZE][/FONT][/COLOR]" +
  "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]SERVER [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '| 6.03 Nrp коп |',
      content:
      "[CENTER][IMG width=695px]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
          "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 0, 0)]6.03.[/COLOR][COLOR=rgb(209, 213, 216)]Запрещено поведение не подражающее полицейскому[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Warn [/COLOR][/SIZE][/FONT][/SPOILER]<br>" +
  "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[CENTER][I][B][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/I][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4] поведение, не соответствующее сотруднику УМВД/ГИБДД/ФСБ.[/SIZE][/FONT][/COLOR]" +
          "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[CENTER][I][B][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]Пример: [/SIZE][/I][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Открытие огня по игрокам без причины[/SIZE][/FONT][/COLOR]" +
          "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
         "[CENTER][I][B][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]Пример: [/SIZE][/I][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Расстрел машин без причины[/SIZE][/FONT][/COLOR]" +
          "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
         "[CENTER][I][B][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]Пример: [/SIZE][/I][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Нарушение ПДД без причины[/SIZE][/FONT][/COLOR]" +
          "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
         "[CENTER][I][B][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]Пример: [/SIZE][/I][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Сотрудник на служебном транспорте кричит о наборе в свою семью на спавне[/SIZE][/FONT][/COLOR]" +
  "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]SERVER [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
   "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },

    {
        title: '| 1.13 Гос в каз/раб |',
      content:
      "[CENTER][IMG width=695px]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
          "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 0, 0)]1.13.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено работать или находится в казино/платных контейнерах в форме Гос.[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Jail 30 минут [/COLOR][/SIZE][/FONT][/SPOILER]" +
                  "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[CENTER][I][B][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]Исключение: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4] В форме ОПГ разрешается. [/SIZE][/FONT][/COLOR]" +
  "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]SERVER [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },


         {
        title: '----------------------------------------------------------| Передача жалобы |---------------------------------------------------------',
        content:
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
      },
      {
      title: '| ГКФ/ЗГКФ |',
      content:
      "[CENTER][IMG width=695px]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/IMG]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
    "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[COLOR=rgb(0, 0, 0)][I][FONT=georgia][SIZE=4]Ваша жалоба передана на рассмотрение [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(0, 0, 0)][I][FONT=georgia][SIZE=4]Главному Куратору Форума и Заместителю Главного Куратора Форума[/FONT][/I][/COLOR][COLOR=rgb(0, 0, 0)][I][FONT=georgia][SIZE=4][/SIZE][/FONT]" +
    "[SPOILER][I][FONT=georgia][SIZE=4][COLOR=rgb(0, 0, 0)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/SIZE][/FONT][/SPOILER]" +
      "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]SERVER[/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 255, 0)][I][B][FONT=georgia][SIZE=4]Ожидайте ответа![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: PIN_PREFIX,
      status: true,
      },
      {
      title: '| ГКФ |',
      content:
      "[CENTER][IMG width=695px]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/IMG]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
                   "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[COLOR=rgb(0, 0, 0)][I][FONT=georgia][SIZE=4]Ваша жалоба передана на рассмотрение [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(0, 0, 0)][I][FONT=georgia][SIZE=4]Главному Куратору Форума[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(0, 0, 0)][I][FONT=georgia][SIZE=4][/SIZE][/FONT]" +
    "[SPOILER][I][FONT=georgia][SIZE=4][COLOR=rgb(0, 0, 0)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/SIZE][/FONT][/SPOILER]" +
      "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]SERVER[/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 255, 0)][I][B][FONT=georgia][SIZE=4]Ожидайте ответа![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: PIN_PREFIX,
      status: true,
    },
 {
      title: '| Техническому специалисту |',
      content:
      "[CENTER][IMG width=695px]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/IMG]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
                   "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[COLOR=rgb(0, 0, 0)][I][FONT=georgia][SIZE=4]Ваша жалоба передана на рассмотрение [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(0, 0, 0)][I][FONT=georgia][SIZE=4]Техническому Специалисту[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(0, 0, 0)][I][FONT=georgia][SIZE=4][/SIZE][/FONT]" +
    "[SPOILER][I][FONT=georgia][SIZE=4][COLOR=rgb(0, 0, 0)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/SIZE][/FONT][/SPOILER]" +
      "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]SERVER[/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 255, 0)][I][B][FONT=georgia][SIZE=4]Ожидайте ответа![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: TEX_PREFIX,
      status: true,
    },
{
      title: '| Кураторам Администрации |',
      content:
      "[CENTER][IMG width=695px]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/IMG]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
                   "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[COLOR=rgb(0, 0, 0)][I][FONT=georgia][SIZE=4]Ваша жалоба передана на рассмотрение [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(0, 0, 0)][I][FONT=georgia][SIZE=4]Кураторам Администрации[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(0, 0, 0)][I][FONT=georgia][SIZE=4][/SIZE][/FONT]" +
    "[SPOILER][I][FONT=georgia][SIZE=4][COLOR=rgb(0, 0, 0)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/SIZE][/FONT][/SPOILER]" +
      "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]SERVER[/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 255, 0)][I][B][FONT=georgia][SIZE=4]Ожидайте ответа![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: PIN_PREFIX,
      status: true,
    },

{
      title: '| В жб на теха  |',
      content:
      "[CENTER][IMG width=695px]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/IMG]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
                   "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
     "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4] Вы ошиблись разделом, обратитесь в раздел жалоб на технических специалистов - [/I][URL='https://forum.blackrussia.online/index.php?forums/Сервер-№10-black.1191/']*Нажмите сюда*[/URL][/SIZE][/FONT][/COLOR][/B][/I][/CENTER][/HEADING]" +
    "[SPOILER][I][FONT=georgia][SIZE=4][COLOR=rgb(0, 0, 0)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/SIZE][/FONT][/SPOILER]" +
      "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]SERVER[/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
 "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  CLOSE_PREFIX,
      status:  false,
    },
{
      title: '| В жб на администрацию|',
      content:
      "[CENTER][IMG width=695px]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/IMG]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
                   "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
 "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4] Вы ошиблись разделом, обратитесь в раздел жалоб на администрацию - [/I][URL='https://forum.blackrussia.online/index.php?forums/Жалобы-на-администрацию.468/']*Нажмите сюда*[/URL][/SIZE][/FONT][/COLOR][/B][/I][/CENTER][/HEADING]" +
    "[SPOILER][I][FONT=georgia][SIZE=4][COLOR=rgb(0, 0, 0)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/SIZE][/FONT][/SPOILER]" +
      "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]SERVER[/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  CLOSE_PREFIX,
      status:  false,
    },
{
      title: '| В жБ на Агентов Поддержки |',
      content:
      "[CENTER][IMG width=695px]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/IMG]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
                   "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
     "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4] Вы ошиблись разделом, обратитесь в раздел жалоб на хелперов - [/I][URL='https://forum.blackrussia.online/threads/black-Жалобы-на-Агентов-Поддержки-Для-Игроков.4847458/page-3#post-22446785']*Нажмите сюда*[/URL][/SIZE][/FONT][/COLOR][/B][/I][/CENTER][/HEADING]" +
    "[SPOILER][I][FONT=georgia][SIZE=4][COLOR=rgb(0, 0, 0)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/SIZE][/FONT][/SPOILER]" +
      "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]SERVER[/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
  "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  CLOSE_PREFIX,
      status:  false,
    },
   {
      title: '| В ЖБ НА ЛИДЕРОВ |',
      content:
      "[CENTER][IMG width=695px]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/IMG]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
                   "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
      "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4] Вы ошиблись разделом, обратитесь в раздел жалоб на лидеров - [/I][URL='https://forum.blackrussia.online/index.php?forums/Жалобы-на-лидеров.469/']*Нажмите сюда*[/URL][/SIZE][/FONT][/COLOR][/B][/I][/CENTER][/HEADING]" +
    "[SPOILER][I][FONT=georgia][SIZE=4][COLOR=rgb(0, 0, 0)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/SIZE][/FONT][/SPOILER]" +
      "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]SERVER[/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
     "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  CLOSE_PREFIX,
      status:  false,
    },
 {
      title: '| В ЖБ на сотрудников |',
      content:
      "[CENTER][IMG width=695px]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/IMG]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
                   "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
        "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4] Вы ошиблись разделом, обратитесь в раздел жалоб на сотрудников в разделе вашей организации.[/SIZE][/FONT][/COLOR][/B][/I][/CENTER][/HEADING]" +
    "[SPOILER][I][FONT=georgia][SIZE=4][COLOR=rgb(0, 0, 0)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/SIZE][/FONT][/SPOILER]" +
      "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]SERVER[/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
     "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  CLOSE_PREFIX,
      status:  false,
    },
    {
      title: '| В ОБЖАЛОВАНИЕ |',
      content:
      "[CENTER][IMG width=695px]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/IMG]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
                   "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
     "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4] Вы ошиблись разделом, обратитесь в раздел обжалований наказаний - [/I][URL='https://forum.blackrussia.online/index.php?forums/Обжалование-наказаний.471/']*Нажмите сюда*[/URL][/SIZE][/FONT][/COLOR][/B][/I][/CENTER][/HEADING]" +
    "[SPOILER][I][FONT=georgia][SIZE=4][COLOR=rgb(0, 0, 0)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/SIZE][/FONT][/SPOILER]" +
      "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]SERVER[/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
     "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  CLOSE_PREFIX,
      status:  false,
    },
    {
      title: '| В ТЕХНИЧЕСКИЙ РАЗДЕЛ |',
      content:
      "[CENTER][IMG width=695px]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/IMG]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
                   "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
      "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4] Вы ошиблись разделом, обратитесь в технический раздел - [/I][URL='https://forum.blackrussia.online/index.php?forums/Технический-раздел-black.488/']*Нажмите сюда*[/URL][/SIZE][/FONT][/COLOR][/B][/I][/CENTER][/HEADING]" +
    "[SPOILER][I][FONT=georgia][SIZE=4][COLOR=rgb(0, 0, 0)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/SIZE][/FONT][/SPOILER]" +
      "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]SERVER[/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
     "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  CLOSE_PREFIX,
      status:  false,
    },



        {
      title: '----------------------------------------------------| Отказ жалоб на игроков |----------------------------------------------------',
      content:
          '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
      },
    {
        title: '| Недостаточно док-в |',
      content:
        "[CENTER][IMG width=695px]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
                          "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4] Ваша жалоба рассмотрена, но, к сожалению, представленных доказательств недостаточно для объективного решения. Чтобы мы могли принять меры, пожалуйста, добавьте дополнительные материалы (скриншоты, видео, и т. д.), подтверждающие ваши слова. Без достаточных доказательств жалоба не может быть удовлетворена. Вы можете подать новую жалобу с более полными данными. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
    "[SPOILER][FONT=georgia][I][SIZE=4][COLOR=rgb(0, 0, 0)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/SIZE][/I][/FONT][/SPOILER]" +
                  "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
  "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]SERVER[/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
           "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
     {
        title: '| нецензурный заголовок |',
      content:
      "[CENTER][IMG width=695px]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
                           "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4] Ваша жалоба отклонена, так как в заголовке содержится нецензурная лексика и некорректное оформление. Обратите внимание, что за подобные нарушения ваш форумный аккаунт будет заблокирован.  [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
    "[SPOILER][FONT=georgia][SIZE=4][I][COLOR=rgb(0, 0, 0)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/I][/SIZE][/FONT][/SPOILER]" +
                    "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
   "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]SERVER[/FONT][COLOR=rgb(0, 0, 0)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: '| Отсутствуют док-ва |',
      content:
     "[CENTER][IMG width=695px]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
                           "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4] Отсутствуют доказательства - следовательно, рассмотрению не подлежит. Загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx и так далее. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
    "[SPOILER][FONT=georgia][SIZE=4][I][COLOR=rgb(0, 0, 0)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/I][/SIZE][/FONT][/SPOILER]<br><br>" +
                      "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
  "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]SERVER[/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
           "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },

    {
        title: '| ДОК-ВА IMGUR |',
      content:
     "[CENTER][IMG width=695px]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
                                   "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4] Ваши доказательства не удалось открыть. Загрузите материалы на фото-видеохостинг Imgur и создайте новую жалобу с актуальными ссылками. Это позволит нам быстрее и точнее рассмотреть ваше обращение. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
    "[SPOILER][FONT=georgia][SIZE=4][I][COLOR=rgb(0, 0, 0)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/I][/SIZE][/FONT][/SPOILER]<br><br>" +
                           "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
  "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]SERVER[/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
           "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: '| ДОК-ВА В YAPX |',
      content:
        "[CENTER][IMG width=695px]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
                                   "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]Ваши доказательства не открываются. Пожалуйста, загрузите материалы на фотовидеохостинг YAPX и подайте новую жалобу с актуальными ссылками. Это позволит нам оперативно и точно рассмотреть ваше обращение.. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
    "[SPOILER][FONT=georgia][SIZE=4][I][COLOR=rgb(0, 0, 04)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/I][/SIZE][/FONT][/SPOILER]" +
                           "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
  "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]SERVER[/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
           "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: '| ДОК-ВА НА GOOGLE DISK |',
      content:
      "[CENTER][IMG width=695px]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
                                   "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4] Ваши доказательства не открываются. Пожалуйста, загрузите материалы на Google Диск и подайте новую жалобу с актуальными ссылками. Это поможет нам быстрее и точнее рассмотреть ваше обращение. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
    "[SPOILER][FONT=georgia][SIZE=4][I][COLOR=rgb(0, 0, 0)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/I][/SIZE][/FONT][/SPOILER]" +
                           "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
  "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]SERVER[/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
           "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
     {
        title: '| ДОК-ВА Не открывается |',
      content:
        "[CENTER][IMG width=695px]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
                                    "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4] Ваши доказательства не открываются, что делает невозможным их рассмотрение. Пожалуйста, загрузите материалы на такие платформы, как Imgur, Yandex Disk, YouTube, Google Диск или другие подобные видеохостинги и предоставьте ссылку. Только в этом случае мы сможем корректно рассмотреть вашу жалобу [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
    "[SPOILER][FONT=georgia][SIZE=4][I][COLOR=rgb(0, 0, 0)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/I][/SIZE][/FONT][/SPOILER]" +
                              "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
  "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]SERVER[/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
           "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
 {
        title: '| Подделка доказательств |',
      content:
     "[CENTER][IMG width=695px]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
                                "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4] После тщательной проверки предоставленных вами доказательств было установлено, что они являются поддельными и созданы с использованием графических редакторов (фотошоп). В связи с нарушением правил нашего форума, касающихся достоверности информации и честного взаимодействия, ваш форумный аккаунт будет  заблокирован. Мы призываем всех пользователей соблюдать правила и предоставлять только достоверные данные. Спасибо за понимание. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
    "[SPOILER][I][FONT=georgia][SIZE=4][COLOR=rgb(0, 0, 0)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
                           "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]SERVER [/FONT][COLOR=rgb(0, 0, 0)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
     {
        title: '| ДОК-ВА В СОЦ.СЕТЯХ |',
      content:
       "[CENTER][IMG width=695px]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
                                    "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4] Доказательства в социальных сетях и т.д. не принимаются. Пожалуйста, загрузите материалы на Imgur, YAPX или Google Диск и отправьте новую жалобу с актуальными ссылками. Это ускорит рассмотрение вашего обращения [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +

    "[SPOILER][FONT=georgia][SIZE=4][I][COLOR=rgb(0, 0, 0)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/I][/SIZE][/FONT][/SPOILER]" +
                           "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
  "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]SERVER[/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
           "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: '| Док-ва обрываются |',
      content:
     "[CENTER][IMG width=695px]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
                                   "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4] Ваша жалоба отказана, так как Видео-доказательства обрываются. Загрузите полную Видеозапись на видео-хостинг RUTUBE,IMGUR. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
    "[SPOILER][FONT=georgia][I][SIZE=4][COLOR=rgb(0, 0, 0)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/I][/SIZE][/FONT][/SPOILER]" +
                            "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
  "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]SERVER[/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
           "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: '| Док-ва отредакт |',
      content:
       "[CENTER][IMG width=695px]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
                                   "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4] Доказательства, предоставленные вами, были отредактированы, что делает их недействительными для рассмотрения. Жалоба не может быть рассмотрена в текущем виде. Пожалуйста, предоставьте новые, неизменённые доказательства. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
    "[SPOILER][FONT=georgia][I][SIZE=4][COLOR=rgb(0, 0, 0 )]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/I][/SIZE][/FONT][/SPOILER]" +
                           "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
  "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]SERVER[/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
           "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },

      {
        title: '| Док-ва в плохом качестве |',
      content:
         "[CENTER][IMG width=695px]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
                                     "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4] Предоставленные вами доказательства имеют плохое качество, что затрудняет их анализ и делает невозможным дальнейшее рассмотрение жалобы. Для корректного рассмотрения просьба предоставить более четкие и качественные материалы. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
    "[SPOILER][FONT=georgia][SIZE=4][I][COLOR=rgb(0, 0, 0)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/I][/SIZE][/FONT][/SPOILER]<br><br>" +
                               "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
  "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]SERVER[/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
           "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },

     {
        title: '| Нарушений нет |',
      content:
         "[CENTER][IMG width=695px]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
                                    "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4] Нарушений со стороны игрока не было замечено. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4] Внимательно изучите общие правила серверов - [/I][URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']*Нажмите сюда*[/URL][/SIZE][/FONT][/COLOR][/B][/I][/CENTER][/HEADING]" +
    "[FONT=georgia][SPOILER][SIZE=4][I][COLOR=rgb(0, 0, 0)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
                             "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
  "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]SERVER[/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
           "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: '| Нет условий сделки |',
      content:
     "[CENTER][IMG width=695px]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
                   "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4] На предоставленных доказательствах отсутствуют условия сделки, что делает невозможным их использование для анализа ситуации. Без этих данных жалоба не может быть рассмотрена. Пожалуйста, представьте новые доказательства, в которых будут указаны все условия сделки. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
    "[FONT=georgia][SPOILER][SIZE=4][I][COLOR=rgb(0, 0, 0)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/I][/SIZE][/FONT][/SPOILER]<br><br>" +
             "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
  "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]SERVER[/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
           "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: '| Нет time |',
      content:
         "[CENTER][IMG width=695px]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
                                             "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4] Ваша жалоба отказана так как на предоставленных доказательствах отсутствуют дата и время (/time), что делает их невозможными для корректного рассмотрения. Для дальнейшего анализа необходимо, чтобы все материалы содержали точные временные метки[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
    "[FONT=georgia][SPOILER][SIZE=4][I][COLOR=rgb(0, 0, 0)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/I][/SIZE][/FONT][/SPOILER]" +
                                     "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
  "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]SERVER[/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
           "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
      {
        title: '| Нет сервера |',
      content:
     "[CENTER][IMG width=695px]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
                                               "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4] На доказательствах отсутствует сервер. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
    "[FONT=georgia][SPOILER][SIZE=4][I][COLOR=rgb(0, 0, 0)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/I][/SIZE][/FONT][/SPOILER]" +
                                      "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
  "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]SERVER[/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
           "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },

    {
        title: '| Нет таймкодов |',
      content:
      "[CENTER][IMG width=695px]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
                                             "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4] В вашей жалобе отсутствуют таймкоды, что делает невозможным её рассмотрение. Если жалоба длится более 3-х минут, для корректного анализа нам необходимы точные временные метки событий. Например: 0:30 — условие сделки. 1:20 — обмен машинами. 2:20 — подмена машины на другую и выход из игры. Пожалуйста, укажите таймкоды в самой сути жалобы, чтобы мы могли корректно рассмотреть ваше обращение  [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
    "[FONT=georgia][SPOILER][SIZE=4][I][COLOR=rgb(0, 0, 0)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/I][/SIZE][/FONT][/SPOILER]" +
                                     "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
  "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]SERVER[/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
           "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: '| Прошло 3 дня |',
      content:
          "[CENTER][IMG width=695px]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
                                             "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4] Ваша жалоба отказана, т.к. с момента нарушения прошло более 72-ух часов. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
    "[FONT=georgia][SPOILER][SIZE=4][I][COLOR=rgb(0, 0, 0)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/I][/SIZE][/FONT][/SPOILER]" +
                                     "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
  "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]SERVER[/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
           "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: '| Уже был ответ |',
      content:
     "[CENTER][IMG width=695px]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
                                             "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]Ваша жалоба отклонена, так как по данному вопросу ранее уже был предоставлен полный и обоснованный ответ. Решение остается в силе, и повторные жалобы без новых значимых обстоятельств рассматриваться не будут. Рекомендуем ознакомиться с предыдущим ответом. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
    "[FONT=georgia][SPOILER][SIZE=4][I][COLOR=rgb(0, 0, 0)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/SIZE][/FONT][/SPOILER]" +
                                       "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
  "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]SERVER[/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
           "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: '| Не по форме |',
      content:
        "[CENTER][IMG width=695px]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
                                             "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4] Ваша жалоба составлена не по форме. Внимательно прочитайте правила подачи жалоб на игроков, закрепленные в этом разделе. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
    "[FONT=georgia][SPOILER][SIZE=4][I][COLOR=rgb(0, 0, 0)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/I][/SIZE][/FONT][/SPOILER]" +
                                     "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
  "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]SERVER[/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
           "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
     {
        title: '| NickName |',
      content:
        "[CENTER][IMG width=695px]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
                                              "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4] Никнейм, указанный в форме, отличается от никнейма, зафиксированного в доказательствах нарушения. Пожалуйста, уточните информацию. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
    "[FONT=georgia][SPOILER][SIZE=4][I][COLOR=rgb(0, 0, 0)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/I][/SIZE][/FONT][/SPOILER]" +
                                     "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
  "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]SERVER[/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
           "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },

    {
        title: '| жб на 2+ игроков |',
      content:
      "[CENTER][IMG width=695px]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
                                             "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4] Нельзя писать одну жалобу на двух и белее игроков ( на каждого игрока отдельная жалоба). [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
    "[SPOILER][FONT=georgia][I][SIZE=4][COLOR=rgb(251, 255, 254)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/SIZE][/I][/FONT][/SPOILER]" +
                                     "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
  "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]SERVER[/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
           "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: '| отказ долг |',
      content:
     "[CENTER][IMG width=695px]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
                                             "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4] Ваша жалоба не подлежит рассмотрению. жалоба на игрока, который занял игровые ценности и не вернул в срок, подлежит рассмотрению только при наличии подтверждения суммы и условий займа в игровом процессе, меры в отношении должника могут быть приняты только при наличии жалобы и доказательств. Жалоба на должника подается в течение 10 дней после истечения срока займа. Договоры вне игры не будут считаться доказательствами. Также игровой долго может быть осуществлен ТОЛЬКО через банковский счет. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
    "[SPOILER][I][FONT=georgia][SIZE=4][COLOR=rgb(251, 255, 254)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/SPOILER]" +
                                     "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]"+
  "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]SERVER[/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
           "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
 {
        title: '| вирт на донат |',
      content:
         "[CENTER][IMG width=695px]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4] Ваша жалоба отклонена, так как обмен автокейсов, покупка дополнительных слотов на машину для семьи и подобные операции за виртуальную валюту являются запрещёнными. Соответственно нарушений со стороны игрока отсутствуют. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][FONT=georgia][I][SIZE=4][COLOR=rgb(251, 255, 254)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/SIZE][/I][/FONT][/SPOILER]<br><br>" +
    "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]<br>"+
  "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]SERVER[/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
           "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
      status: false,
      },
      {
      title: '| Ошибка сервером |',
      content:
     "[CENTER][IMG width=695px]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/IMG]<br>"+
     "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) {{ user.name }}.[/FONT][/CENTER]<br><br>"+
     "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]<br>"+
     "[CENTER][FONT=georgia] Ошиблись сервером, переношу на нужный. [/FONT][/CENTER]",
     },
     {
     title: '| ОШИБКА РАЗДЕЛОМ |',
     content:
  "[CENTER][IMG width=695px]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4] Вы ошиблись разделом. Ваше обращение будет перенесено в соответствующий раздел для дальнейшего рассмотрения. Спасибо за понимание! [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][I][FONT=georgia][SIZE=4][COLOR=rgb(0, 0, 0)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
     "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]SERVER [/FONT][COLOR=rgb(0, 0, 0)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
  {
      title: '------------------------------------------------------------| РП Биографии |------------------------------------------------------------',
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
      title: '|скопирована|',
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
      title: '|скопирована со своей старой био |',
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
      title: '|мало инфо детство|',
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
      title: '|  скопирована  |',
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
      title: '------------------------------------------------------| INFORMATION |-------------------------------------------------------------------',
      content:
          '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
      },
         {
      title: '| РАЗРАБОТЧИК JOSEPH MURPHY  |',
      content:
          '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
      },
           {
      title: '| SERVER BLACK|',
      content:

"[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]SERVER BLACK [/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix: UNACCEPT_PREFIX,
        status: false,
        },
         {
      title: '| Telegram |',
      content:

"[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]@konvolf[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix: UNACCEPT_PREFIX,
        status: false,
        },
          {
      title: '|  VK  |',
      content:

"[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]https://vk.com/best_knight[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix: UNACCEPT_PREFIX,
        status: false,
        },
         {
      title: '| Форумный аккаунт |',
      content:

"[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]https://forum.blackrussia.online/members/joseph-murphy.837422/[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix: UNACCEPT_PREFIX,
        status: false,
        },
        {
      title: '|  Последняя дата обновления |',
      content:

"[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]04.07.2025 (Обновлял Zloy Litvinenko)[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix: UNACCEPT_PREFIX,
        status: false,
        },
        {
      title: '|  Другие скрипты |',
      content:

"[HEADING=3][CENTER][COLOR=rgb(255, 228, 181)][I][B][FONT=georgia][SIZE=4]https://greasyfork.org/ru/users/1409614-vladislav-starodubtsev[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix: UNACCEPT_PREFIX,
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