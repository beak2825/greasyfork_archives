// ==UserScript==
// @name         BLACK | Скрипт для Кураторов Форума by M.Tenside
// @namespace    https://forum.blackrussia.online
// @version      1.17
// @description  Специально для BlackRussia | BLACK M.Tenside
// @author       M.Tenside
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @collaborator M.Tenside
// @icon https://icons.iconarchive.com/icons/google/noto-emoji-people-bodyparts/512/12003-OK-hand-light-skin-tone-icon.png
// @downloadURL https://update.greasyfork.org/scripts/468292/BLACK%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20by%20MTenside.user.js
// @updateURL https://update.greasyfork.org/scripts/468292/BLACK%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20by%20MTenside.meta.js
// ==/UserScript==

(function () {
  'use strict';
'esversion 6' ;
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7; // Prefix that will be set when thread closes.
const TEX_PREFIX = 13;
const GA_PREFIX = 12;
const V_PREFIX = 1;
const buttons = [
      {
      title: '~~~~~~~~~~~~~~~~~~~~~~~~~~| Ответы на жалобы игроков |~~~~~~~~~~~~~~~~~~~~~~~~~~',
      content:
          '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
      },
    {
      title: 'DM',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
     "[HEADING=3][CENTER][I][B][I][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Здравствуйте уважаемый Игрок.[/COLOR][/FONT][/SIZE][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
     '[HEADING=3][CENTER][/CENTER][/HEADING]'+
     "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
     "[HEADING=3][SPOILER][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]2.19.[/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 127)][FONT=book antiqua][SIZE=4] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины[/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 127)][FONT=book antiqua][SIZE=4] | Jail 60 минут[/SIZE][/FONT][/COLOR][/SPOILER][/HEADING]<br><br>" +
     "[CENTER][FONT=georgia][COLOR=rgb(0, 255, 127)][SIZE=4]Примечание: [/SIZE][/COLOR][COLOR=rgb(0, 255, 127)][SIZE=4]разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил.[/SIZE][/COLOR][/FONT]<br><br>" +
     "[CENTER][COLOR=rgb(0, 255, 127)][FONT=book antiqua][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 127)][FONT=book antiqua][SIZE=4]нанесение урона с целью защиты особняка или его территории, а также нанесение урона после ДТП не является веской IC причиной, для войны семей предусмотрено отдельное системное мероприятие.[/SIZE][/FONT][/COLOR]<br><br>" +
     "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]"+
     "[HEADING=3][CENTER][/CENTER][/HEADING]" +
     "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Приятной игры на[/COLOR] [COLOR=rgb(255, 0, 0)]Black Russia[/COLOR] [/FONT][/SIZE][/COLOR][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]BLACK[/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]"+
     "[HEADING=3][CENTER][/CENTER][/HEADING]" +
     "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix: ACCEPT_PREFIX,
       status: false,
     },
     {
        title: 'DB',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][B][I][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Здравствуйте уважаемый Игрок.[/COLOR][/FONT][/SIZE][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    '[HEADING=3][CENTER][/CENTER][/HEADING]'+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]2.13.[/COLOR][COLOR=rgb(0, 255, 127)] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта[/FONT][/SIZE][/COLOR][COLOR=rgb(0, 255, 127)][SIZE=4][FONT=book antiqua] | Jail 60 минут [/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Приятной игры на[/COLOR] [COLOR=rgb(255, 0, 0)]Black Russia[/COLOR] [/FONT][/SIZE][/COLOR][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]BLACK[/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Mass DM',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][B][I][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Здравствуйте уважаемый Игрок.[/COLOR][/FONT][/SIZE][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    '[HEADING=3][CENTER][/CENTER][/HEADING]'+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]2.20.[/COLOR][COLOR=rgb(0, 255, 127)] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более[/COLOR][COLOR=rgb(0, 255, 127)] | Warn / Ban 3 - 7 дней[/COLOR] [/SIZE][/FONT][/SPOILER]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Приятной игры на[/COLOR] [COLOR=rgb(255, 0, 0)]Black Russia[/COLOR] [/FONT][/SIZE][/COLOR][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]BLACK[/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'TK',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][B][I][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Здравствуйте уважаемый Игрок.[/COLOR][/FONT][/SIZE][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    '[HEADING=3][CENTER][/CENTER][/HEADING]'+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]2.15.[/COLOR][COLOR=rgb(0, 255, 127)] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины[/FONT][/SIZE][/COLOR][COLOR=rgb(0, 255, 127)][SIZE=4][FONT=book antiqua] | Jail 60 минут / Warn (за два и более убийства)[/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Приятной игры на[/COLOR] [COLOR=rgb(255, 0, 0)]Black Russia[/COLOR] [/FONT][/SIZE][/COLOR][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]BLACK[/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'SK',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][B][I][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Здравствуйте уважаемый Игрок.[/COLOR][/FONT][/SIZE][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    '[HEADING=3][CENTER][/CENTER][/HEADING]'+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]2.16.[/COLOR][COLOR=rgb(0, 255, 127)] Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них[/FONT][/SIZE][/COLOR][COLOR=rgb(0, 255, 127)][SIZE=4][FONT=book antiqua] | Jail 60 минут / Warn (за два и более убийства) [/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Приятной игры на[/COLOR] [COLOR=rgb(255, 0, 0)]Black Russia[/COLOR] [/FONT][/SIZE][/COLOR][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]BLACK[/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
     {
        title: 'PG',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][B][I][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Здравствуйте уважаемый Игрок.[/COLOR][/FONT][/SIZE][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    '[HEADING=3][CENTER][/CENTER][/HEADING]'+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]2.17.[/COLOR][COLOR=rgb(0, 255, 127)]Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь[/FONT][/SIZE][/COLOR][COLOR=rgb(0, 255, 127)][SIZE=4][FONT=book antiqua]  | Jail 30 минут [/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Приятной игры на[/COLOR] [COLOR=rgb(255, 0, 0)]Black Russia[/COLOR] [/FONT][/SIZE][/COLOR][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]BLACK[/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
     {
        title: 'Nrp поведение',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][B][I][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Здравствуйте уважаемый Игрок.[/COLOR][/FONT][/SIZE][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    '[HEADING=3][CENTER][/CENTER][/HEADING]'+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]2.01.[/COLOR][COLOR=rgb(0, 255, 127)]Запрещено поведение, нарушающее нормы процессов Role Play режима игры[/FONT][/SIZE][/COLOR][COLOR=rgb(0, 255, 127)][SIZE=4][FONT=book antiqua]  | Jail 30 минут [/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[CENTER][I][B][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]ездить на крышах транспортных средств, бегать или ходить по столам в казино, целенаправленная провокация сотрудников правоохранительных органов с целью развлечения, целенаправленная помеха в проведении различных собеседований и так далее.[/SIZE][/FONT][/COLOR]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Приятной игры на[/COLOR] [COLOR=rgb(255, 0, 0)]Black Russia[/COLOR] [/FONT][/SIZE][/COLOR][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]BLACK[/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Уход от RP',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][B][I][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Здравствуйте уважаемый Игрок.[/COLOR][/FONT][/SIZE][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    '[HEADING=3][CENTER][/CENTER][/HEADING]'+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]2.02.[/COLOR][COLOR=rgb(0, 255, 127)]Запрещено целенаправленно уходить от Role Play процесса всеразличными способами [/FONT][/SIZE][/COLOR][COLOR=rgb(0, 255, 127)][SIZE=4][FONT=book antiqua] |Jail 30 минут / Warn [/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[CENTER][I][B][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]уходить в AFK при остановке транспортного средства правоохранительными органами, выходить из игры для избежания смерти, выходить из игры во время процесса задержания или ареста, полное игнорирование отыгровок другого игрока, которые так или иначе могут коснуться Вашего персонажа. Уходить в интерьер или зеленую зону во время перестрелки с целью избежать смерти или уйти от Role Play процесса и так далее.[/SIZE][/FONT][/COLOR]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Приятной игры на[/COLOR] [COLOR=rgb(255, 0, 0)]Black Russia[/COLOR] [/FONT][/SIZE][/COLOR][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]BLACK[/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'NRP drive',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][B][I][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Здравствуйте уважаемый Игрок.[/COLOR][/FONT][/SIZE][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    '[HEADING=3][CENTER][/CENTER][/HEADING]'+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]2.03.[/COLOR][COLOR=rgb(0, 255, 127)]Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере[/FONT][/SIZE][/COLOR][COLOR=rgb(0, 255, 127)][SIZE=4][FONT=book antiqua] | Jail 30 минут [/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[CENTER][I][B][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4] езда на скутере по горам, езда на любом транспортном средстве по встречным полосам, нарушая все правила дорожного движения без какой-либо причины, намеренное создание аварийных ситуаций на дорогах и так далее.[/SIZE][/FONT][/COLOR]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Приятной игры на[/COLOR] [COLOR=rgb(255, 0, 0)]Black Russia[/COLOR] [/FONT][/SIZE][/COLOR][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]BLACK[/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'ЕПП',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][B][I][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Здравствуйте уважаемый Игрок.[/COLOR][/FONT][/SIZE][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    '[HEADING=3][CENTER][/CENTER][/HEADING]'+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]2.46.[/COLOR][COLOR=rgb(0, 255, 127)]Запрещено ездить по полям на любом транспорте.[/FONT][/SIZE][/COLOR][COLOR=rgb(0, 255, 127)][SIZE=4][FONT=book antiqua] | Jail 30 минут [/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[CENTER][I][B][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4] разрешено передвижение на кроссовых мотоциклах и внедорожниках.[/SIZE][/FONT][/COLOR]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Приятной игры на[/COLOR] [COLOR=rgb(255, 0, 0)]Black Russia[/COLOR] [/FONT][/SIZE][/COLOR][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]BLACK[/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'fdrive',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][B][I][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Здравствуйте уважаемый Игрок.[/COLOR][/FONT][/SIZE][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    '[HEADING=3][CENTER][/CENTER][/HEADING]'+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]2.47.[/COLOR][COLOR=rgb(0, 255, 127)]Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора)[/FONT][/SIZE][/COLOR][COLOR=rgb(0, 255, 127)][SIZE=4][FONT=book antiqua] | Jail 60 минут [/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Приятной игры на[/COLOR] [COLOR=rgb(255, 0, 0)]Black Russia[/COLOR] [/FONT][/SIZE][/COLOR][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]BLACK[/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
     {
        title: 'Аморал+',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][B][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Здравствуйте уважаемый Игрок.[/COLOR][/FONT][/SIZE][/I][/B][/CENTER][/HEADING]<br><br>" +
    '[HEADING=3][CENTER][/CENTER][/HEADING]'+
    "[HEADING=3][CENTER][I][B][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]2.08.[/COLOR][COLOR=rgb(0, 255, 127)]Запрещена любая форма аморальных действий сексуального характера в сторону игроков.[/FONT][/SIZE][/COLOR][COLOR=rgb(0, 255, 127)][SIZE=4][FONT=book antiqua]  | Jail 30 минут [/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[CENTER][I][B][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]Исключение: [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]обоюдное согласие обеих сторон.[/SIZE][/FONT][/COLOR]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Приятной игры на[/COLOR] [COLOR=rgb(255, 0, 0)]Black Russia[/COLOR] [/FONT][/SIZE][/COLOR][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]BLACK[/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Багоюз',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][B][I][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Здравствуйте уважаемый Игрок.[/COLOR][/FONT][/SIZE][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    '[HEADING=3][CENTER][/CENTER][/HEADING]'+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]2.21.[/COLOR][COLOR=rgb(0, 255, 127)] Запрещено пытаться обходить игровую систему или использовать любые баги сервера[/FONT][/SIZE][/COLOR][COLOR=rgb(0, 255, 127)][SIZE=4][FONT=book antiqua] | Ban 15 - 30 дней / PermBan [/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[CENTER][I][B][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4] под игровой системой подразумеваются функции и возможности, которые реализованы в игре для взаимодействия между игроками, а также взаимодействия игроков с функциями, у которых есть свое конкретное предназначение.[/SIZE][/FONT][/COLOR]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Приятной игры на[/COLOR] [COLOR=rgb(255, 0, 0)]Black Russia[/COLOR] [/FONT][/SIZE][/COLOR][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]BLACK[/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Багоюз Аним',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][B][I][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Здравствуйте уважаемый Игрок.[/COLOR][/FONT][/SIZE][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    '[HEADING=3][CENTER][/CENTER][/HEADING]'+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]2.55.[/COLOR][COLOR=rgb(0, 255, 127)]Запрещается багоюз связанный с анимацией в любых проявлениях.[/FONT][/SIZE][/COLOR][COLOR=rgb(0, 255, 127)][SIZE=4][FONT=book antiqua] | Jail 60 / 120 минут [/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[CENTER][I][B][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]если игрок, используя баг, убирает ограничение на использование оружия в зеленой зоне, сбивает темп стрельбы, либо быстро перемещается во время войны за бизнес или во время перестрелки на мероприятии с семейными контейнерами, последует наказание в виде Jail на 120 минут. Данное наказание используется в случаях, когда, используя ошибку, было получено преимущество перед другими игроками. [/SIZE][/FONT][/COLOR]<br><br>" +
    "[CENTER][I][B][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]если игрок использует баги, связанные с анимацией, и при этом не влияет на игровой процесс других игроков, а также не получает преимущество перед другими игроками, последует наказание в виде Jail на 60 минут. [/SIZE][/FONT][/COLOR]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Приятной игры на[/COLOR] [COLOR=rgb(255, 0, 0)]Black Russia[/COLOR] [/FONT][/SIZE][/COLOR][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]BLACK[/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Nrp коп',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][B][I][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Здравствуйте уважаемый Игрок.[/COLOR][/FONT][/SIZE][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    '[HEADING=3][CENTER][/CENTER][/HEADING]'+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]3.04.[/COLOR][COLOR=rgb(0, 255, 127)]Запрещено поведение не подражающее полицейскому[/FONT][/SIZE][/COLOR][COLOR=rgb(0, 255, 127)][SIZE=4][FONT=book antiqua] | Warn [/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[CENTER][I][B][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4] поведение, не соответствующее сотруднику УМВД/ГИБДД/ФСБ.[/SIZE][/FONT][/COLOR]<br><br>" +
    "[CENTER][I][B][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]Пример: [/SIZE][/FONT][/COLOR]<br><br>" +
    "[FONT=georgia][SIZE=4][COLOR=rgb(209, 213, 216)]открытие огня по игрокам без причины,[/COLOR][/SIZE][/FONT]<br><br>" +
    "[FONT=georgia][SIZE=4][COLOR=rgb(209, 213, 216)]расстрел машин без причины,[/COLOR][/SIZE][/FONT]<br><br>" +
    "[FONT=georgia][SIZE=4][COLOR=rgb(209, 213, 216)]нарушение ПДД без причины,[/COLOR][/SIZE][/FONT]<br><br>" +
    "[FONT=georgia][SIZE=4][COLOR=rgb(209, 213, 216)]сотрудник на служебном транспорте кричит о наборе в свою семью на спавне.[/COLOR][/SIZE][/FONT]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Приятной игры на[/COLOR] [COLOR=rgb(255, 0, 0)]Black Russia[/COLOR] [/FONT][/SIZE][/COLOR][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]BLACK[/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Розыск без причины',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][B][I][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Здравствуйте уважаемый Игрок.[/COLOR][/FONT][/SIZE][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    '[HEADING=3][CENTER][/CENTER][/HEADING]'+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]6.02.[/COLOR][COLOR=rgb(0, 255, 127)]Запрещено выдавать розыск без Role Play причины. [/FONT][/SIZE][/COLOR][COLOR=rgb(0, 255, 127)][SIZE=4][FONT=book antiqua] | Warn [/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Приятной игры на[/COLOR] [COLOR=rgb(255, 0, 0)]Black Russia[/COLOR] [/FONT][/SIZE][/COLOR][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]BLACK[/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Патруль без напарника',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][B][I][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Здравствуйте уважаемый Игрок.[/COLOR][/FONT][/SIZE][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    '[HEADING=3][CENTER][/CENTER][/HEADING]'+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]1.11.[/COLOR][COLOR=rgb(0, 255, 127)]Всем силовым структурам запрещен одиночный патруль или конвоирование, минимум 2 сотрудника [/FONT][/SIZE][/COLOR][COLOR=rgb(0, 255, 127)][SIZE=4][FONT=book antiqua] | Jail 30 минут [/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Приятной игры на[/COLOR] [COLOR=rgb(255, 0, 0)]Black Russia[/COLOR] [/FONT][/SIZE][/COLOR][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]BLACK[/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
     {
      title: '~~~~~~~~~~~~~~~~~~~~~~~~| Жалобы на игроков с чатами |~~~~~~~~~~~~~~~~~~~~~~~~',
      content:
          '[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
      },
      {
        title: 'Flood',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][B][I][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Здравствуйте уважаемый Игрок.[/COLOR][/FONT][/SIZE][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    '[HEADING=3][CENTER][/CENTER][/HEADING]'+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]3.05.[/COLOR][COLOR=rgb(0, 255, 127)]Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [/FONT][/SIZE][/COLOR][COLOR=rgb(0, 255, 127)][SIZE=4][FONT=book antiqua] | Mute 30 минут [/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Приятной игры на[/COLOR] [COLOR=rgb(255, 0, 0)]Black Russia[/COLOR] [/FONT][/SIZE][/COLOR][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]BLACK[/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
     {
        title: 'MG',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][B][I][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Здравствуйте уважаемый Игрок.[/COLOR][/FONT][/SIZE][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    '[HEADING=3][CENTER][/CENTER][/HEADING]'+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]2.18.[/COLOR][COLOR=rgb(0, 255, 127)]Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [/FONT][/SIZE][/COLOR][COLOR=rgb(0, 255, 127)][SIZE=4][FONT=book antiqua] | Mute 30 минут [/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
    "[CENTER][I][B][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]использование смайлов в виде символов «))», «=D» запрещено в IC чате.[/SIZE][/FONT][/COLOR]<br><br>" +
    "[CENTER][I][B][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]телефонное общение также является IC чатом.[/SIZE][/FONT][/COLOR]<br><br>" +
    "[CENTER][I][B][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]за написанный однократно вопросительный «?» или восклицательный «!» знак в IC чате, наказание не выдается.[/SIZE][/FONT][/COLOR]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Приятной игры на[/COLOR] [COLOR=rgb(255, 0, 0)]Black Russia[/COLOR] [/FONT][/SIZE][/COLOR][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]BLACK[/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'CAPS',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][B][I][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Здравствуйте уважаемый Игрок.[/COLOR][/FONT][/SIZE][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    '[HEADING=3][CENTER][/CENTER][/HEADING]'+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]3.02.[/COLOR][COLOR=rgb(0, 255, 127)]Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате [/FONT][/SIZE][/COLOR][COLOR=rgb(0, 255, 127)][SIZE=4][FONT=book antiqua] | Mute 30 минут [/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Приятной игры на[/COLOR] [COLOR=rgb(255, 0, 0)]Black Russia[/COLOR] [/FONT][/SIZE][/COLOR][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]BLACK[/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Язык',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][B][I][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Здравствуйте уважаемый Игрок.[/COLOR][/FONT][/SIZE][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    '[HEADING=3][CENTER][/CENTER][/HEADING]'+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]3.01.[/COLOR][COLOR=rgb(0, 255, 127)] Общепризнанный язык сервера — русский. Общение в IC чатах во всех Role Play ситуациях обязательно должно проходить исключительно на русском языке [/FONT][/SIZE][/COLOR][COLOR=rgb(0, 255, 127)][SIZE=4][FONT=book antiqua] | Mute 30 минут [/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Приятной игры на[/COLOR] [COLOR=rgb(255, 0, 0)]Black Russia[/COLOR] [/FONT][/SIZE][/COLOR][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]BLACK[/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Транслит',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][B][I][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Здравствуйте уважаемый Игрок.[/COLOR][/FONT][/SIZE][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    '[HEADING=3][CENTER][/CENTER][/HEADING]'+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]3.20.[/COLOR][COLOR=rgb(0, 255, 127)] Запрещено использование транслита в любом из чатов [/FONT][/SIZE][/COLOR][COLOR=rgb(0, 255, 127)][SIZE=4][FONT=book antiqua] | Mute 30 минут [/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
    "[CENTER][I][B][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]Пример: [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]«Privet», «Kak dela», «Narmalna».[/SIZE][/FONT][/COLOR]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Приятной игры на[/COLOR] [COLOR=rgb(255, 0, 0)]Black Russia[/COLOR] [/FONT][/SIZE][/COLOR][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]BLACK[/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Злоуп знаком',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][B][I][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Здравствуйте уважаемый Игрок.[/COLOR][/FONT][/SIZE][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    '[HEADING=3][CENTER][/CENTER][/HEADING]'+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]3.06.[/COLOR][COLOR=rgb(0, 255, 127)] Запрещено злоупотребление знаков препинания и прочих символов [/FONT][/SIZE][/COLOR][COLOR=rgb(0, 255, 127)][SIZE=4][FONT=book antiqua] | Mute 30 минут [/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
    "[CENTER][I][B][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]Пример: [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4] «???????», «!!!!!!!», «Дааааааааааааааааааааааа» и так далее.[/SIZE][/FONT][/COLOR]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Приятной игры на[/COLOR] [COLOR=rgb(255, 0, 0)]Black Russia[/COLOR] [/FONT][/SIZE][/COLOR][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]BLACK[/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Упом Родни',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][B][I][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Здравствуйте уважаемый Игрок.[/COLOR][/FONT][/SIZE][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    '[HEADING=3][CENTER][/CENTER][/HEADING]'+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]3.04.[/COLOR][COLOR=rgb(0, 255, 127)] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [/FONT][/SIZE][/COLOR][COLOR=rgb(0, 255, 127)][SIZE=4][FONT=book antiqua] | Mute 120 минут [/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
    "[CENTER][I][B][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]Пример: [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4] термины «MQ», «rnq» расценивается, как упоминание родных.[/SIZE][/FONT][/COLOR]<br><br>" +
    "[CENTER][I][B][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]Пример: [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4] если упоминание родных было совершено в ходе Role Play процесса и не содержало в себе прямого или завуалированного оскорбления.[/SIZE][/FONT][/COLOR]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Приятной игры на[/COLOR] [COLOR=rgb(255, 0, 0)]Black Russia[/COLOR] [/FONT][/SIZE][/COLOR][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]BLACK[/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'объявы в гос',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][B][I][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Здравствуйте уважаемый Игрок.[/COLOR][/FONT][/SIZE][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    '[HEADING=3][CENTER][/CENTER][/HEADING]'+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]3.22.[/COLOR][COLOR=rgb(0, 255, 127)] Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC)  [/FONT][/SIZE][/COLOR][COLOR=rgb(0, 255, 127)][SIZE=4][FONT=book antiqua] | Mute 30 минут [/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
    "[CENTER][I][B][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]Пример: [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4] в помещении центральной больницы писать в чат: «Продам эксклюзивную шапку дешево!! [/SIZE][/FONT][/COLOR]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Приятной игры на[/COLOR] [COLOR=rgb(255, 0, 0)]Black Russia[/COLOR] [/FONT][/SIZE][/COLOR][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]BLACK[/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'ООС Оск',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][B][I][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Здравствуйте уважаемый Игрок.[/COLOR][/FONT][/SIZE][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    '[HEADING=3][CENTER][/CENTER][/HEADING]'+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]3.03.[/COLOR][COLOR=rgb(0, 255, 127)] Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены [/FONT][/SIZE][/COLOR][COLOR=rgb(0, 255, 127)][SIZE=4][FONT=book antiqua] | Mute 30 минут [/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Приятной игры на[/COLOR] [COLOR=rgb(255, 0, 0)]Black Russia[/COLOR] [/FONT][/SIZE][/COLOR][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]BLACK[/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Оск Адм',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][B][I][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Здравствуйте уважаемый Игрок.[/COLOR][/FONT][/SIZE][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    '[HEADING=3][CENTER][/CENTER][/HEADING]'+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]2.54.[/COLOR][COLOR=rgb(0, 255, 127)] Запрещено неуважительное обращение, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [/FONT][/SIZE][/COLOR][COLOR=rgb(0, 255, 127)][SIZE=4][FONT=book antiqua] | Mute 180 минут [/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
    "[CENTER][I][B][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]Пример: [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4] оформление жалобы в игре с текстом: «Быстро починил меня», «Админы вы задрали уже когда работать будете меня тут ДБшат я 3 жалобы уже подал!!!!!!!!», «МОЗГИ ВКЛЮЧИТЕ Я УВОЛЮ ВАС ЩА» и т.д. и т.п., а также при взаимодействии с другими игроками. [/SIZE][/FONT][/COLOR]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Приятной игры на[/COLOR] [COLOR=rgb(255, 0, 0)]Black Russia[/COLOR] [/FONT][/SIZE][/COLOR][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]BLACK[/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Оск Проекта',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][B][I][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Здравствуйте уважаемый Игрок.[/COLOR][/FONT][/SIZE][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    '[HEADING=3][CENTER][/CENTER][/HEADING]'+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]2.40.[/COLOR][COLOR=rgb(0, 255, 127)] Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [/FONT][/SIZE][/COLOR][COLOR=rgb(0, 255, 127)][SIZE=4][FONT=book antiqua] | Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором) [/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Приятной игры на[/COLOR] [COLOR=rgb(255, 0, 0)]Black Russia[/COLOR] [/FONT][/SIZE][/COLOR][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]BLACK[/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Полит Пропаганда',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][B][I][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Здравствуйте уважаемый Игрок.[/COLOR][/FONT][/SIZE][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    '[HEADING=3][CENTER][/CENTER][/HEADING]'+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]3.18.[/COLOR][COLOR=rgb(0, 255, 127)] Запрещено политическое и религиозное пропагандирование [/FONT][/SIZE][/COLOR][COLOR=rgb(0, 255, 127)][SIZE=4][FONT=book antiqua] | Mute 120 минут / Ban 10 дней [/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Приятной игры на[/COLOR] [COLOR=rgb(255, 0, 0)]Black Russia[/COLOR] [/FONT][/SIZE][/COLOR][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]BLACK[/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Политика',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][B][I][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Здравствуйте уважаемый Игрок.[/COLOR][/FONT][/SIZE][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    '[HEADING=3][CENTER][/CENTER][/HEADING]'+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]2.35.[/COLOR][COLOR=rgb(0, 255, 127)] На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате [/FONT][/SIZE][/COLOR][COLOR=rgb(0, 255, 127)][SIZE=4][FONT=book antiqua] | Mute 120 минут / Ban 7 дней [/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Приятной игры на[/COLOR] [COLOR=rgb(255, 0, 0)]Black Russia[/COLOR] [/FONT][/SIZE][/COLOR][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]BLACK[/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Реклама Промо',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][B][I][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Здравствуйте уважаемый Игрок.[/COLOR][/FONT][/SIZE][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    '[HEADING=3][CENTER][/CENTER][/HEADING]'+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]3.21.[/COLOR][COLOR=rgb(0, 255, 127)] Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. [/FONT][/SIZE][/COLOR][COLOR=rgb(0, 255, 127)][SIZE=4][FONT=book antiqua] | Ban 30 дней [/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
    "[CENTER][I][B][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4] чаты семейные, строительных компаний, транспортных компаний, фракционные чаты, IC, OOC, VIP и так далее. [/SIZE][/FONT][/COLOR]<br><br>" +
    "[CENTER][I][B][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]Исключение: [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4] промокоды, предоставленные разработчиками, а также распространяемые через официальные ресурсы проекта. [/SIZE][/FONT][/COLOR]<br><br>" +
    "[CENTER][I][B][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]Пример: [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4] если игрок упомянет промокод, распространяемый через официальную публичную страницу ВКонтакте либо через официальный Discord в любом из чатов, наказание ему не выдается. [/SIZE][/FONT][/COLOR]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Приятной игры на[/COLOR] [COLOR=rgb(255, 0, 0)]Black Russia[/COLOR] [/FONT][/SIZE][/COLOR][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]BLACK[/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Введение в заблуждение',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][B][I][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Здравствуйте уважаемый Игрок.[/COLOR][/FONT][/SIZE][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    '[HEADING=3][CENTER][/CENTER][/HEADING]'+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]3.11.[/COLOR][COLOR=rgb(0, 255, 127)] Запрещено введение игроков проекта в заблуждение путем злоупотребления командами [/FONT][/SIZE][/COLOR][COLOR=rgb(0, 255, 127)][SIZE=4][FONT=book antiqua] | Ban 15 - 30 дней / PermBan [/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
    "[CENTER][I][B][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4] kiril_Leo[4]: Marshall_Tenside[399]: ВЫ ВСЕ ПУСЬКИ. Для продажи автомобиля введите /sellmycar id 2828 (цена в донат валюте) цена. [/SIZE][/FONT][/COLOR]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Приятной игры на[/COLOR] [COLOR=rgb(255, 0, 0)]Black Russia[/COLOR] [/FONT][/SIZE][/COLOR][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]BLACK[/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'ООС Угрозы',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][B][I][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Здравствуйте уважаемый Игрок.[/COLOR][/FONT][/SIZE][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    '[HEADING=3][CENTER][/CENTER][/HEADING]'+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]2.37.[/COLOR][COLOR=rgb(0, 255, 127)] Запрещены OOC угрозы, в том числе и завуалированные [/FONT][/SIZE][/COLOR][COLOR=rgb(0, 255, 127)][SIZE=4][FONT=book antiqua] | Mute 120 минут / Ban 7 дней [/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Приятной игры на[/COLOR] [COLOR=rgb(255, 0, 0)]Black Russia[/COLOR] [/FONT][/SIZE][/COLOR][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]BLACK[/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Н/ПРО',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][B][I][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Здравствуйте уважаемый Игрок.[/COLOR][/FONT][/SIZE][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    '[HEADING=3][CENTER][/CENTER][/HEADING]'+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]4.01.[/COLOR][COLOR=rgb(0, 255, 127)] Запрещено редактирование объявлений, не соответствующих ПРО [/FONT][/SIZE][/COLOR][COLOR=rgb(0, 255, 127)][SIZE=4][FONT=book antiqua] | Mute 30 минут [/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Приятной игры на[/COLOR] [COLOR=rgb(255, 0, 0)]Black Russia[/COLOR] [/FONT][/SIZE][/COLOR][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]BLACK[/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Н/ППЭ',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][B][I][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Здравствуйте уважаемый Игрок.[/COLOR][/FONT][/SIZE][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    '[HEADING=3][CENTER][/CENTER][/HEADING]'+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]4.02.[/COLOR][COLOR=rgb(0, 255, 127)] Запрещено проведение эфиров, не соответствующих Role Play правилам и логике [/FONT][/SIZE][/COLOR][COLOR=rgb(0, 255, 127)][SIZE=4][FONT=book antiqua] | Mute 30 минут [/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Приятной игры на[/COLOR] [COLOR=rgb(255, 0, 0)]Black Russia[/COLOR] [/FONT][/SIZE][/COLOR][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]BLACK[/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Редактирование в лич целях',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][B][I][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Здравствуйте уважаемый Игрок.[/COLOR][/FONT][/SIZE][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    '[HEADING=3][CENTER][/CENTER][/HEADING]'+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]4.04.[/COLOR][COLOR=rgb(0, 255, 127)] Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком [/FONT][/SIZE][/COLOR][COLOR=rgb(0, 255, 127)][SIZE=4][FONT=book antiqua] | Ban 7 дней + ЧС организации [/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Приятной игры на[/COLOR] [COLOR=rgb(255, 0, 0)]Black Russia[/COLOR] [/FONT][/SIZE][/COLOR][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]BLACK[/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Слив',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][B][I][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Здравствуйте уважаемый Игрок.[/COLOR][/FONT][/SIZE][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    '[HEADING=3][CENTER][/CENTER][/HEADING]'+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]3.08.[/COLOR][COLOR=rgb(0, 255, 127)] Запрещены любые формы «слива» посредством использования глобальных чатов [/FONT][/SIZE][/COLOR][COLOR=rgb(0, 255, 127)][SIZE=4][FONT=book antiqua] | PermBan [/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Приятной игры на[/COLOR] [COLOR=rgb(255, 0, 0)]Black Russia[/COLOR] [/FONT][/SIZE][/COLOR][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]BLACK[/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Слив склада',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][B][I][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Здравствуйте уважаемый Игрок.[/COLOR][/FONT][/SIZE][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    '[HEADING=3][CENTER][/CENTER][/HEADING]'+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]2.09.[/COLOR][COLOR=rgb(0, 255, 127)] Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле [/FONT][/SIZE][/COLOR][COLOR=rgb(0, 255, 127)][SIZE=4][FONT=book antiqua] | Ban 15 - 30 дней / PermBan [/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Приятной игры на[/COLOR] [COLOR=rgb(255, 0, 0)]Black Russia[/COLOR] [/FONT][/SIZE][/COLOR][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]BLACK[/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'NRP Oбман',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][B][I][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Здравствуйте уважаемый Игрок.[/COLOR][/FONT][/SIZE][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    '[HEADING=3][CENTER][/CENTER][/HEADING]'+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]2.05.[/COLOR][COLOR=rgb(0, 255, 127)] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [/FONT][/SIZE][/COLOR][COLOR=rgb(0, 255, 127)][SIZE=4][FONT=book antiqua] | Permban [/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
    "[CENTER][I][B][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4] после IC договоренности получить денежные средства и сразу же выйти из игры с целью обмана игрока, или же, договорившись через OOC чат (/n), точно также получить денежные средства и сразу же выйти из игры и тому подобные ситуации. [/SIZE][/FONT][/COLOR]<br><br>" +
    "[CENTER][I][B][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4] разблокировка игрового аккаунта нарушителя будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого имущества, которое было украдено (по решению обманутой стороны). [/SIZE][/FONT][/COLOR]<br><br>" +    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia][COLOR=rgb(0, 221, 0)]Приятной игры на[/COLOR] [COLOR=rgb(255, 0, 0)]Black Russia[/COLOR] [/FONT][/SIZE][/COLOR][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]BLACK[/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]"+
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
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







