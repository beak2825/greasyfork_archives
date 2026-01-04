// ==UserScript==
// @name         Samara | Скрипт для Кураторов Форума by D.Alienov
// @namespace    https://forum.blackrussia.online
// @version      1.2
// @description  Специально для Samara
// @author       D.Alienov
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @collaborator D.Alienov
// @icon    https://icons.iconarchive.com/icons/google/noto-emoji-food-drink/256/32382-hamburger-icon.png
// @downloadURL https://update.greasyfork.org/scripts/534081/Samara%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20by%20DAlienov.user.js
// @updateURL https://update.greasyfork.org/scripts/534081/Samara%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20by%20DAlienov.meta.js
// ==/UserScript==

(function () {
  'use strict';
'esversion 6' ;
   const UNACCEPT_PREFIX = 4; // Префикс "Отказано"
const ACCEPT_PREFIX = 8; // Префикс "Одобрено"
const PIN_PREFIX = 2; // Префикс "На рассмотрении"
const COMMAND_PREFIX = 10; // Префикс "Команде Проекта"
const WATCHED_PREFIX = 9; // Префикс "Рассмотрено"
const CLOSE_PREFIX = 7; // Префикс "Закрыто"
const TEX_PREFIX = 13; // Префикс "Техническому специалисту"
const GA_PREFIX = 12; // Префикс "ГА"
const V_PREFIX = 1; // Префикс "Важно"
const buttons = [
      {
      title: '------------------------------------------------------| Ответы на жалобы игроков |------------------------------------------------------',
      content:
          '[COLOR=rgb(255, 0, 255)][FONT=times new roman][SIZE=4][I]{ greeting }, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
      },
    {
      title: 'помеха рп процессу',
      content:
    
     "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
     "[HEADING=3][CENTER][I][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
     "[HEADING=3][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]2.04.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4] Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4] | Ban 10 дней / Обнуление аккаунта (при повторном нарушении).[/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
     "[CENTER][I][B][FONT=georgia][COLOR=rgb(255, 0, 0)][SIZE=4]Пример: [/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Таран дальнобойщиков, инкассаторов под разными предлогами.[/SIZE][/COLOR][/I][/B][/FONT]<br><br>" +
     "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia][COLOR=rgb(255, 255, 255)]Приятной игры на серевре[/COLOR] [COLOR=rgb(255, 0, 0)][/COLOR] [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 255)][SIZE=5][FONT=georgia]SAMARA[/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]"+
     "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br><br>",

        prefix: ACCEPT_PREFIX,
       status: false,
     },
    {
      title: 'DM',
      content:
       
     "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
     "[HEADING=3][CENTER][I][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
     "[HEADING=3][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]2.19.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4] | Jail 60 минут[/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
     "[CENTER][I][B][FONT=georgia][COLOR=rgb(0, 0, 221)][SIZE=4]Примечание: [/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил.[/SIZE][/COLOR][/I][/B][/FONT]<br><br>" +
     "[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]нанесение урона с целью защиты особняка или его территории, а также нанесение урона после ДТП не является веской IC причиной, для войны семей предусмотрено отдельное системное мероприятие.[/SIZE][/I][/B][/FONT][/COLOR]<br><br>" +
     "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia][COLOR=rgb(255, 255, 255)]Приятной игры на серевре[/COLOR] [COLOR=rgb(255, 0, 0)][/COLOR] [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 255)][SIZE=5][FONT=georgia]SAMARA[/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]"+
     "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br><br>",
        prefix: ACCEPT_PREFIX,
       status: false,
     },
     {
      title: 'DM ВЧ',
      content:
       
     "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
     "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
     "[HEADING=3][I][B][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]2.02.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4] Наносить урон игрокам, которые находятся вне территории воинской части, запрещено[/SIZE][/I][/B][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4] | Jail 60 минут / Warn [/SIZE][/FONT][/COLOR][/HEADING]<br>" +
     "[CENTER][I][FONT=georgia][COLOR=rgb(0, 0, 221)][SIZE=4]Примечание: [/SIZE][/COLOR][/I][COLOR=rgb(209, 213, 216)][SIZE=4]предупреждение (Warn) выдается только в случае Mass DM.[/SIZE][/COLOR][/FONT]<br>" +
     "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>"+
     "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br><br>",
        prefix: ACCEPT_PREFIX,
       status: false,
     },
     {
      title: 'DM Полиц',
      content:
       
     "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
     "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
     "[HEADING=3][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]6.01.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4] Запрещено наносить урон игрокам без Role Play причины .[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4] | Jail 60 минут / Warn [/SIZE][/FONT][/COLOR][/HEADING]<br>" +
     "[CENTER][FONT=georgia][COLOR=rgb(0, 0, 221)][SIZE=4]Примечание: [/SIZE][/COLOR][/I][COLOR=rgb(209, 213, 216)][SIZE=4]разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил.[/SIZE][/COLOR][/FONT]<br>" +
     "[CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4] Запрещено наносить урон в целях быстрого задержания преступника.[/SIZE][/FONT][/COLOR]<br>" +
     "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
     "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br><br>",
        prefix: ACCEPT_PREFIX,
       status: false,
     },
     {
        title: 'DB',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]2.13.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Jail 60 минут [/COLOR][/SIZE][/FONT]<br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br><br>",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Mass DM',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]2.20.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Warn / Ban 3 - 7 дней [/COLOR][/SIZE][/FONT]<br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br><br>",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'TK',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]2.15.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Jail 60 минут / Warn (за два и более убийства)[/COLOR][/SIZE][/FONT]<br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
    "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>"+
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'SK',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]2.16.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Jail 60 минут / Warn (за два и более убийства) [/COLOR][/SIZE][/FONT]<br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
     {
        title: 'PG',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
    '[HEADING=3][CENTER][/CENTER][/HEADING]'+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]2.17.[/COLOR]][COLOR=rgb(209, 213, 216)] Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia]  | Jail 30 минут [/COLOR][/SIZE][/FONT]<br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
     {
        title: 'Nrp поведение',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
    '[HEADING=3][CENTER][/CENTER][/HEADING]'+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]2.01.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено поведение, нарушающее нормы процессов Role Play режима игры[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia]  | Jail 30 минут [/COLOR][/SIZE][/FONT]<br>" +
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]ездить на крышах транспортных средств, бегать или ходить по столам в казино, целенаправленная провокация сотрудников правоохранительных органов с целью развлечения, целенаправленная помеха в проведении различных собеседований и так далее.[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Уход от RP',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
    '[HEADING=3][CENTER][/CENTER][/HEADING]'+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]2.02.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено целенаправленно уходить от Role Play процесса всеразличными способами [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] |Jail 30 минут / Warn [/COLOR][/SIZE][/FONT]<br>" +
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]уходить в AFK при остановке транспортного средства правоохранительными органами, выходить из игры для избежания смерти, выходить из игры во время процесса задержания или ареста, полное игнорирование отыгровок другого игрока, которые так или иначе могут коснуться Вашего персонажа. Уходить в интерьер или зеленую зону во время перестрелки с целью избежать смерти или уйти от Role Play процесса и так далее.[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'NRP drive',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
    '[HEADING=3][CENTER][/CENTER][/HEADING]'+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]2.03.[/COLOR][COLOR=rgb(209, 213, 216)]Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Jail 30 минут [/COLOR][/SIZE][/FONT]<br>" +
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4] езда на скутере по горам, езда на любом транспортном средстве по встречным полосам, нарушая все правила дорожного движения без какой-либо причины, намеренное создание аварийных ситуаций на дорогах и так далее.[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'ЕПП',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
    '[HEADING=3][CENTER][/CENTER][/HEADING]'+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]2.46.[/COLOR][COLOR=rgb(209, 213, 216)]Запрещено ездить по полям на любом транспорте.[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Jail 30 минут [/COLOR][/SIZE][/FONT]<br>" +
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/I][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]разрешено передвижение на кроссовых мотоциклах и внедорожниках.[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'fdrive',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
    '[HEADING=3][CENTER][/CENTER][/HEADING]'+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]2.47.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора)[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Jail 60 минут [/COLOR][/SIZE][/FONT]<br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
     {
        title: 'Аморал+',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
    '[HEADING=3][CENTER][/CENTER][/HEADING]'+
    "[HEADING=3][CENTER][I][B][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/CENTER][/HEADING]<br>" +
    "[FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]2.08.[/COLOR][COLOR=rgb(209, 213, 216)]Запрещена любая форма аморальных действий сексуального характера в сторону игроков.[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia]  | Jail 30 минут [/COLOR][/SIZE][/FONT]<br>" +
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]Исключение: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]обоюдное согласие обеих сторон.[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Багоюз',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]2.21.[/COLOR][COLOR=rgb(0, 255, 127)] Запрещено пытаться обходить игровую систему или использовать любые баги сервера[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Ban 15 - 30 дней / PermBan [/COLOR][/SIZE][/FONT]<br>" +
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4] под игровой системой подразумеваются функции и возможности, которые реализованы в игре для взаимодействия между игроками, а также взаимодействия игроков с функциями, у которых есть свое конкретное предназначение.[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Багоюз Аним',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]2.55.[/COLOR][COLOR=rgb(209, 213, 216)]Запрещается багоюз связанный с анимацией в любых проявлениях.[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Jail 60 / 120 минут [/COLOR][/SIZE][/FONT]<br>" +
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]если игрок, используя баг, убирает ограничение на использование оружия в зеленой зоне, сбивает темп стрельбы, либо быстро перемещается во время войны за бизнес или во время перестрелки на мероприятии с семейными контейнерами, последует наказание в виде Jail на 120 минут. Данное наказание используется в случаях, когда, используя ошибку, было получено преимущество перед другими игроками. [/SIZE][/FONT][/COLOR]<br>" +
    "[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]если игрок использует баги, связанные с анимацией, и при этом не влияет на игровой процесс других игроков, а также не получает преимущество перед другими игроками, последует наказание в виде Jail на 60 минут. [/SIZE][/FONT][/COLOR]<br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Nrp коп',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]6.03.[/COLOR][COLOR=rgb(209, 213, 216)]Запрещено поведение не подражающее полицейскому[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Warn [/COLOR][/SIZE][/FONT]<br>" +
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/I][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4] поведение, не соответствующее сотруднику УМВД/ГИБДД/ФСБ.[/SIZE][/FONT][/COLOR]<br>" +
    "[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]Пример: [/SIZE][/FONT][/COLOR][/I]<br>" +
    "[FONT=georgia][SIZE=4][COLOR=rgb(209, 213, 216)]* Открытие огня по игрокам без причины;[/COLOR][/SIZE][/FONT]" +
    "[FONT=georgia][SIZE=4][COLOR=rgb(209, 213, 216)]* Расстрел машин без причины;[/COLOR][/SIZE][/FONT]" +
    "[FONT=georgia][SIZE=4][COLOR=rgb(209, 213, 216)]* Нарушение ПДД без причины;[/COLOR][/SIZE][/FONT]" +
    "[FONT=georgia][SIZE=4][COLOR=rgb(209, 213, 216)]* Сотрудник на служебном транспорте кричит о наборе в свою семью на спавне.[/COLOR][/SIZE][/FONT]<br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Розыск без причины',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 0, 221)]][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]6.02.[/COLOR][COLOR=rgb(209, 213, 216)]Запрещено выдавать розыск без Role Play причины. [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Warn [/COLOR][/SIZE][/FONT]<br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Nrp ВЧ',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[FONT=georgia][SIZE=4][COLOR=rgb(209, 213, 216)]2. За нарушение правил нападения на Войсковую Часть выдаётся предупреждение [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ) [/COLOR][/SIZE][/FONT]<br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Гос в каз/раб',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]1.13.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено работать или находится в казино/платных контейнерах в форме Гос.[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Jail 30 минут [/COLOR][/SIZE][/FONT]<br>" +
    "[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]Исключение: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4] В форме ОПГ разрешается. [/SIZE][/FONT][/COLOR]<br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'долг',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]3.04.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещается брать в долг игровые ценности и не возвращать их. [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Ban 30 дней / permban [/COLOR][/SIZE][/FONT]<br>" +
    "[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4] займ может быть осуществлен только через зачисление игровых ценностей на банковский счет, максимальный срок займа 30 календарных дней, если займ не был возвращен, аккаунт должника блокируется; [/SIZE][/FONT][/COLOR]<br>" +
    "[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4] при невозврате игровых ценностей общей стоимостью менее 5 миллионов включительно аккаунт будет заблокирован на 30 дней, если более 5 миллионов, аккаунт будет заблокирован навсегда; [/SIZE][/FONT][/COLOR]<br>" +
    "[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4] жалоба на игрока, который занял игровые ценности и не вернул в срок, подлежит рассмотрению только при наличии подтверждения суммы и условий займа в игровом процессе, меры в отношении должника могут быть приняты только при наличии жалобы и доказательств. Жалоба на должника подается в течение 10 дней после истечения срока займа. Договоры вне игры не будут считаться доказательствами. [/SIZE][/FONT][/COLOR]<br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
     {
      title: '-----------------------------------------------------| Жалобы на игроков с чатами |-----------------------------------------------------',
      content:
          '[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
    },
     {
      title: 'Оск религии/нации',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]2.35.[/COLOR][COLOR=rgb(209, 213, 216)] На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Mute 120 минут / Ban 7 дней [/COLOR][/SIZE][/FONT]<br>" +
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
     },
     {
       title: 'Мат в Vip chat',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]3.23.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Mute 30 минут [/COLOR][/SIZE][/FONT]<br>" +
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
     {
        title: 'Упом Родни',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]3.04.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Mute 120 минут / Ban 7-15 дней [/COLOR][/SIZE][/FONT]<br>" +
    "[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]Пример: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4] термины «MQ», «rnq» расценивается, как упоминание родных.[/SIZE][/FONT][/COLOR]<br>" +
    "[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]Пример: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4] если упоминание родных было совершено в ходе Role Play процесса и не содержало в себе прямого или завуалированного оскорбления.[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Flood',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]3.05.[/COLOR][COLOR=rgb(209, 213, 216)]Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Mute 30 минут [/COLOR][/SIZE][/FONT]<br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'MG',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]2.18.[/COLOR][COLOR=rgb(209, 213, 216)]Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Mute 30 минут [/COLOR][/SIZE][/FONT]<br>" +
    "[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]использование смайлов в виде символов «))», «=D» запрещено в IC чате.[/SIZE][/FONT][/COLOR]" +
    "[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]телефонное общение также является IC чатом.[/SIZE][/FONT][/COLOR]" +
    "[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]за написанный однократно вопросительный «?» или восклицательный «!» знак в IC чате, наказание не выдается.[/SIZE][/FONT][/COLOR]" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'CAPS',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]3.02.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Mute 30 минут [/COLOR][/SIZE][/FONT]<br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Язык',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]3.01.[/COLOR][COLOR=rgb(209, 213, 216)] Общепризнанный язык сервера — русский. Общение в IC чатах во всех Role Play ситуациях обязательно должно проходить исключительно на русском языке [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Mute 30 минут [/COLOR][/SIZE][/FONT]<br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
    "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Транслит',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]3.20.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено использование транслита в любом из чатов [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Mute 30 минут [/COLOR][/SIZE][/FONT]<br>" +
    "[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]Пример: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]«Privet», «Kak dela», «Narmalna».[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Злоуп знаком',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]3.06.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено злоупотребление знаков препинания и прочих символов [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)]][SIZE=4][FONT=georgia] | Mute 30 минут [/COLOR][/SIZE][/FONT]<br>" +
    "[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]Пример: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4] «???????», «!!!!!!!», «Дааааааааааааааааааааааа» и так далее.[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'объявы в гос',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]3.22.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC)[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Mute 30 минут [/COLOR][/SIZE][/FONT]<br>" +
    "[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]Пример: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4] в помещении центральной больницы писать в чат: «Продам эксклюзивную шапку дешево!! [/SIZE][/FONT][/COLOR]<br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'секс характ. Оск',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]3.07.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинтсва, несущие в себе подтекст сексуального характера вне зависимости чата. [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Mute 30 минут [/COLOR][/SIZE][/FONT]<br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'ООС Оск',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]3.03.[/COLOR][COLOR=rgb(209, 213, 216)] Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Mute 30 минут [/COLOR][/SIZE][/FONT]<br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Оск Адм',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]2.54.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено неуважительное обращение, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Mute 180 минут [/COLOR][/SIZE][/FONT]<br>" +
    "[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]Пример: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4] оформление жалобы в игре с текстом: «Быстро починил меня», «Админы вы задрали уже когда работать будете меня тут ДБшат я 3 жалобы уже подал!!!!!!!!», «МОЗГИ ВКЛЮЧИТЕ Я УВОЛЮ ВАС ЩА» и т.д. и т.п., а также при взаимодействии с другими игроками. [/SIZE][/FONT][/COLOR]<br>"+
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
    "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Оск Проекта',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]2.40.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором) [/COLOR][/SIZE][/FONT]<br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
    "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Полит Пропаганда',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]3.18.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено политическое и религиозное пропагандирование [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Mute 120 минут / Ban 10 дней [/COLOR][/SIZE][/FONT]<br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Политика',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]2.35.[/COLOR][COLOR=rgb(209, 213, 216)] На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Mute 120 минут / Ban 7 дней [/COLOR][/SIZE][/FONT]<br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Реклама Промо',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]3.21.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Ban 30 дней [/COLOR][/SIZE][/FONT]<br>" +
    "[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4] чаты семейные, строительных компаний, транспортных компаний, фракционные чаты, IC, OOC, VIP и так далее. [/SIZE][/FONT][/COLOR]" +
    "[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]Исключение: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4] промокоды, предоставленные разработчиками, а также распространяемые через официальные ресурсы проекта. [/SIZE][/FONT][/COLOR]" +
    "[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]Пример: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4] если игрок упомянет промокод, распространяемый через официальную публичную страницу ВКонтакте либо через официальный Discord в любом из чатов, наказание ему не выдается. [/SIZE][/FONT][/COLOR]" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Введение в заблуждение',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]3.11.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено введение игроков проекта в заблуждение путем злоупотребления командами [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Ban 15 - 30 дней / PermBan [/COLOR][/SIZE][/FONT]<br><br>" +
    "[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]Пример: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4] kiril_Leo[4]: Marshall_Tenside[399]: ВЫ ВСЕ дебилы.[/SIZE][/FONT][/COLOR]<br><br>"+
    "[CENTER][B][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]* Для продажи автомобиля введите /sellmycar id 2828 (цена в донат валюте) цена. [/SIZE][/FONT][/COLOR]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'ООС Угрозы',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]2.37.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещены OOC угрозы, в том числе и завуалированные [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Mute 120 минут / Ban 7 дней [/COLOR][/SIZE][/FONT]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Н/ПРО',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]4.01.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено редактирование объявлений, не соответствующих ПРО [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Mute 30 минут [/COLOR][/SIZE][/FONT]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Н/ППЭ',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]4.02.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено проведение эфиров, не соответствующих Role Play правилам и логике [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Mute 30 минут [/COLOR][/SIZE][/FONT]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Редактирование в лич целях',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]4.04.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Ban 7 дней + ЧС организации [/COLOR][/SIZE][/FONT]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Слив',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]3.08.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещены любые формы «слива» посредством использования глобальных чатов [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | PermBan [/COLOR][/SIZE][/FONT]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Слив склада',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]2.09.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Ban 15 - 30 дней / PermBan [/COLOR][/SIZE][/FONT]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Временные биз на аук',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]3.01.[/COLOR][COLOR=rgb(209, 213, 216)] После покупки казино владелец обязан ждать срока окончания владения Казино/СТО - 15 суток. Запрещено продавать и передавать казино/СТО третьим лицам, продавать бизнес в государство и выкупать обратно, любые другие виды и способы сохранения бизнеса у себя или выставления его на аукцион. [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Ban 15 дней [/COLOR][/SIZE][/FONT]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'NRP Oбман',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]2.05.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Permban [/COLOR][/SIZE][/FONT]<br><br>" +
    "[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4] после IC договоренности получить денежные средства и сразу же выйти из игры с целью обмана игрока, или же, договорившись через OOC чат (/n), точно также получить денежные средства и сразу же выйти из игры и тому подобные ситуации. [/SIZE][/FONT][/COLOR]<br><br>" +
    "[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4] разблокировка игрового аккаунта нарушителя будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого имущества, которое было украдено (по решению обманутой стороны). [/SIZE][/FONT][/COLOR]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Выдача себя за Адм',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]3.10.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещена выдача себя за администратора, если таковым не являетесь [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Ban 7 - 15 + ЧС администрации [/COLOR][/SIZE][/FONT]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Реклама',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]2.31.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Ban 7 дней / PermBan [/COLOR][/SIZE][/FONT]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Читы',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]2.22.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Ban 15 - 30 дней / PermBan [/COLOR][/SIZE][/FONT]<br><br>" +
    "[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4] запрещено внесение любых изменений в оригинальные файлы игры. [/SIZE][/FONT][/COLOR]<br><br>" +
    "[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]Исключение: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4] разрешено изменение шрифта, его размера и длины чата (кол-во строк). [/SIZE][/FONT][/COLOR]<br><br>" +
    "[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]Исключение: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4] блокировка за включенный счетчик FPS не выдается. [/SIZE][/FONT][/COLOR]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
     {
      title: 'Музыка в войс чате',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]3.14.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено включать музыку в Voice Chat  [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Mute 60 минут [/COLOR][/SIZE][/FONT]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
     },
     {
      title: 'Злоупом знаком',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]3.06.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено злоупотребление знаков препинания и прочих символов  [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Mute 30 минут [/COLOR][/SIZE][/FONT]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
   },
   {
       title: '----------------------------------------------------| Передача жалобы |----------------------------------------------------',
       content:
          '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
    },
    {
        title: 'Тех спецу',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[COLOR=rgb(0, 0, 221)][I][FONT=georgia][SIZE=4]Ваша жалоба переадресована [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(0, 0, 221)][I][FONT=georgia][SIZE=4]Техническому Специалисту [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(0, 0, 221)][I][FONT=georgia][SIZE=4], ожидайте ответа в данной теме.[/SIZE][/FONT]<br><br>" +
    "[I][FONT=georgia][SIZE=4][COLOR=rgb(0, 0, 221)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/SIZE][/FONT]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 255, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: TEX_PREFIX,
      status: false,
    },
    {
      title: 'ГКФ/ЗГКФ',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[COLOR=rgb(0, 0, 221)][I][FONT=georgia][SIZE=4]Ваша жалоба переадресована [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(0, 0, 221)][I][FONT=georgia][SIZE=4]ГКФ @Greenfield Stoyn , ЗГКФ @Joseph Murphy  [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(0, 0, 221)][I][FONT=georgia][SIZE=4], ожидайте ответа в данной теме.[/SIZE][/FONT]<br><br>" +
    "[I][FONT=georgia][SIZE=4][COLOR=rgb(0, 0, 221)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/SIZE][/FONT]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 255, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: PIN_PREFIX,
      status: false,
    },
    {
      title: 'Кураторам Адм',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[COLOR=rgb(0, 0, 221)][I][FONT=georgia][SIZE=4]Ваша жалоба переадресована [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 255)][I][FONT=georgia][SIZE=4]Кураторам @Daniel_Berkyt , @Jony Myrphyy ♡ [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(0, 0, 221)][I][FONT=georgia][SIZE=4], ожидайте ответа в данной теме.[/SIZE][/FONT]<br><br>" +
    "[I][FONT=georgia][SIZE=4][COLOR=rgb(0, 0, 221)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/SIZE][/FONT]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 255, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: PIN_PREFIX,
      status: false,
    },
    {
     title: 'В жб на тех',
     content:
        
     "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
     "[HEADING=3][CENTER][I][B][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Вы ошиблись разделом, обратитесь в раздел жалоб на технических специалистов - [/I][URL='https://forum.blackrussia.online/index.php?forums/Сервер-№10-black.1191/']*Нажмите сюда*[/URL][/SIZE][/FONT][/COLOR][/B][/I][/CENTER][/HEADING]<br><br>" +
     "[FONT=georgia][SIZE=4][I][COLOR=rgb(0, 0, 221)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/I][/SIZE][/FONT]<br><br>" +
     "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
     "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix: CLOSE_PREFIX,
        status: false,
   },
    {
        title: 'В жб на адм',
        content:
         
     "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
     "[HEADING=3][CENTER][I][B][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Вы ошиблись разделом, обратитесь в раздел жалоб на администрацию - [/I][URL='https://forum.blackrussia.online/index.php?forums/Жалобы-на-администрацию.468/']*Нажмите сюда*[/URL][/SIZE][/FONT][/COLOR][/B][/I][/CENTER][/HEADING]<br><br>" +
     "[FONT=georgia][SIZE=4][I][COLOR=rgb(0, 0, 221)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/I][/SIZE][/FONT]<br><br>" +
     "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
     "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
          prefix: CLOSE_PREFIX,
          status: false,
  },
    {
        title: 'В жб на АП',
        content:
         
          "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
          "[HEADING=3][CENTER][I][B][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Вы ошиблись разделом, обратитесь в раздел жалоб на хелперов - [/I][URL='https://forum.blackrussia.online/threads/black-Жалобы-на-Агентов-Поддержки-Для-Игроков.4847458/page-3#post-22446785']*Нажмите сюда*[/URL][/SIZE][/FONT][/COLOR][/B][/I][/CENTER][/HEADING]<br><br>" +
          "[FONT=georgia][SIZE=4][I][COLOR=rgb(0, 0, 221)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/SIZE][/FONT]<br><br>" +
          "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
          "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
          "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто![/SIZE][/FONT][/B][/COLOR][/CENTER][/HEADING]",
       prefix: CLOSE_PREFIX,
       status: false,
  },
    {
        title: 'В жб на ЛД',
        content:
       
        "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
        "[HEADING=3][CENTER][I][B][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Вы ошиблись разделом, обратитесь в раздел жалоб на лидеров - [/I][URL='https://forum.blackrussia.online/index.php?forums/Жалобы-на-лидеров.469/']*Нажмите сюда*[/URL][/SIZE][/FONT][/COLOR][/B][/I][/CENTER][/HEADING]<br><br>" +
        "[FONT=georgia][SIZE=4][I][COLOR=rgb(0, 0, 221)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/I][/SIZE][/FONT]<br><br>" +
        "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
        "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
        "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
         prefix: CLOSE_PREFIX,
         status: false,
   },
    {
        title: 'В жб на сотрудников',
        content:
          
           "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
           "[HEADING=3][CENTER][I][B][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Вы ошиблись разделом, обратитесь в раздел жалоб на сотрудников в разделе вашей организации.[/SIZE][/FONT][/COLOR][/B][/I][/CENTER][/HEADING]<br><br>" +
           "[FONT=georgia][SIZE=4][I][COLOR=rgb(0, 0, 221)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/I][/SIZE][/FONT]<br><br>" +
           "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
           "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
           "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
           prefix: CLOSE_PREFIX,
           status: false,
    },
    {
        title: 'В ОБЖ',
        content:
          
           "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
           "[HEADING=3][CENTER][I][B][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Вы ошиблись разделом, обратитесь в раздел обжалований наказаний - [/I][URL='https://forum.blackrussia.online/index.php?forums/Обжалование-наказаний.471/']*Нажмите сюда*[/URL][/SIZE][/FONT][/COLOR][/B][/I][/CENTER][/HEADING]<br><br>" +
           "[FONT=georgia][SIZE=4][I][COLOR=rgb(0, 0, 221)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/I][/SIZE][/FONT]<br><br>" +
           "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
           "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
           "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: CLOSE_PREFIX,
       status: false,
      },
    {
         title: 'В тех. раздел',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Вы ошиблись разделом, обратитесь в технический раздел - [/I][URL='https://forum.blackrussia.online/index.php?forums/Технический-раздел-black.488/']*Нажмите сюда*[/URL][/SIZE][/FONT][/COLOR][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[FONT=georgia][SIZE=4][I][COLOR=rgb(0, 0, 221)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/I][/SIZE][/FONT]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: '----------------------------------------------------| Другие ответы для жб на игроков |----------------------------------------------------',
      content:
          '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
      },
      {

      },
      {
      title: 'Оск ник',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]4.09.[/COLOR][COLOR=rgb(209, 213, 216)]   Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные) [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Устное замечание + смена игрового никнейма / PermBan. [/COLOR][/SIZE][/FONT]<br><br>" +
     "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
      },
      {
      title: 'Фейк акк',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]4.10.[/COLOR][COLOR=rgb(209, 213, 216)]  Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Устное замечание + смена игрового никнейма / PermBan. [/COLOR][/SIZE][/FONT]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'вирт на донат',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Обмен автокейса, покупка доп слота на машину в семью и тд на виртуальную валюту запрещен, соответственно никакого нарушения со стороны игрока нет.  [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[FONT=georgia][I][SIZE=4][COLOR=rgb(0, 0, 221)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/SIZE][/I][/FONT]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'в реп в игре',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Вам нужно было подать жалобу в игре в /report > 1, а не на форум. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[FONT=georgia][I][SIZE=4][COLOR=rgb(0, 0, 221)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/SIZE][/I][/FONT]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'жб на 2+ игроков',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Нельзя писать одну жалобу на двух и белее игроков ( на каждого игрока отдельная жалоба). [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[FONT=georgia][I][SIZE=4][COLOR=rgb(0, 0, 221)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/SIZE][/I][/FONT]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'отказ долг',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Ваша жалоба не подлежит рассмотрению. жалоба на игрока, который занял игровые ценности и не вернул в срок, подлежит рассмотрению только при наличии подтверждения суммы и условий займа в игровом процессе, меры в отношении должника могут быть приняты только при наличии жалобы и доказательств. Жалоба на должника подается в течение 10 дней после истечения срока займа. Договоры вне игры не будут считаться доказательствами. Также игровой долго может быть осуществлен ТОЛЬКО через банковский счет. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[I][FONT=georgia][SIZE=4][COLOR=rgb(0, 0, 221)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'На рассмотрении',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Ваша жалоба взята на рассмотрение, ожидайте ответа в данной теме. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[I][FONT=georgia][SIZE=4][COLOR=rgb(0, 0, 221)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 255, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: PIN_PREFIX,
      status: false,
    },
    {
        title: 'Не достаточно док-в',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Недостаточно доказательств для корректного рассмотрения вашей жалобы. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[FONT=georgia][I][SIZE=4][COLOR=rgb(0, 0, 221)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/SIZE][/I][/FONT]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Отсутствуют док-ва',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Отсутствуют доказательства - следовательно, рассмотрению не подлежит. Загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx и так далее. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[FONT=georgia][SIZE=4][I][COLOR=rgb(0, 0, 221)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/I][/SIZE][/FONT]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'жб от 3го лица',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Ваша жалоба отказана т.к написана от 3го лица. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[FONT=georgia][SIZE=4][I][COLOR=rgb(0, 0, 221)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/I][/SIZE][/FONT]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Док-ва не открывается',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Ваши доказательства не открываются. Загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx и так далее еще раз и сделайте новую жалобу. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[FONT=georgia][SIZE=4][I][COLOR=rgb(0, 0, 221)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/I][/SIZE][/FONT]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Док-ва обрываются',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Ваша жалоба отказана, так как Видео-доказательства обрываются. Загрузите полную Видеозапись на видео-хостинг YouTube. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[FONT=georgia][I][SIZE=4][COLOR=rgb(0, 0, 221)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/I][/SIZE][/FONT]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Док-ва отредакт',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Доказательства были подвергнуты редактированию - следовательно, рассмотрению не подлежит. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[FONT=georgia][I][SIZE=4][COLOR=rgb(0, 0, 221)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/I][/SIZE][/FONT]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Док-ва в соц сетях',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Доказательства в социальных сетях и т.д. не принимаются. Загрузите доказательства на фото-видео хостинги YouTube,Imgur, Yapx и так далее. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[FONT=georgia][SIZE=4][I][COLOR=rgb(0, 0, 221)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/I][/SIZE][/FONT]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
      {
        title: 'Док-ва в плохом качестве',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Ваши доказательства в плохом качестве. Загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx и так далее. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[FONT=georgia][SIZE=4][I][COLOR=rgb(0, 0, 221)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/I][/SIZE][/FONT]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Нарушений нет',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Нарушений со стороны игрока не было замечено. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Внимательно изучите общие правила серверов - [/I][URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']*Нажмите сюда*[/URL][/SIZE][/FONT][/COLOR][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[FONT=georgia][SIZE=4][I][COLOR=rgb(0, 0, 221)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/SIZE][/FONT]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Нет условий сделки',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] На доказательствах отсутствуют условия сделки - следовательно, рассмотрению не подлежит. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[FONT=georgia][SIZE=4][I][COLOR=rgb(0, 0, 221)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/I][/SIZE][/FONT]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Нет time',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] На доказательствах отсутствуют дата и время (/time). [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[FONT=georgia][SIZE=4][I][COLOR=rgb(0, 0, 221)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/I][/SIZE][/FONT]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Нет таймкодов',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Ваша жалоба отказана, т.к. в ней нет таймкодов. Если видео длится больше 3-ех минут - Вы должны указать таймкоды нарушений. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[FONT=georgia][SIZE=4][I][COLOR=rgb(0, 0, 221)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/I][/SIZE][/FONT]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Прошло 3 дня',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Ваша жалоба отказана, т.к. с момента нарушения прошло более 72-ух часов. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[FONT=georgia][SIZE=4][I][COLOR=rgb(0, 0, 221)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/I][/SIZE][/FONT]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Уже был ответ',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Ваша жалоба отказана, т.к. ранее уже был дан ответ. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[FONT=georgia][SIZE=4][I][COLOR=rgb(0, 0, 221)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/I][/SIZE][/FONT]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Не по форме',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Ваша жалоба составлена не по форме. Внимательно прочитайте правила подачи жалоб на игроков, закрепленные в этом разделе. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[FONT=georgia][SIZE=4][I][COLOR=rgb(0, 0, 221)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/I][/SIZE][/FONT]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: '------------------------------------------------------| RP Биографии |------------------------------------------------------',
      content:
          '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
      },
    {
        title: 'RP био одобрена',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Ваша RolePlay - биография одобрена. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
     "[FONT=georgia][SIZE=4][CENTER][I][B][COLOR=rgb(0, 221, 0)]Одобрено [/COLOR][/CENTER][/I][/SIZE][/FONT]<br><br>" ,
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'RP био отказана',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
      prefix: UNACCEPT_PREFIX,
       status: false,
    },
    {
        title: 'На доработке',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Ваша RolePlay - биография на доработке. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На доработке![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
      prefix: V_PREFIX,
    },
    {
        title: 'RP био nick',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к у вас NonRP NickName. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/B][/I][/COLOR][/CENTER][/HEADING]<br>",
      prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'RP био заголовок не по форме',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к. заголовок оформлен неправильно. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/B][/I][/COLOR][/CENTER][/HEADING]<br>",
      prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'более 1 рп био на ник',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к запрещено создавать более одной RP Биографии на один Nick. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
      prefix: UNACCEPT_PREFIX,
    },
    {
        title: 'RP био некоррект. возраст',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к. в ней указан некорректный возраст. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'RP био мало информации',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к. в ней написано мало информации. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'RP био нет 18 лет',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к. персонажу нет 18 лет. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'RP био от 1го лица',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к. написана от 1го лица. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/B][/I][/COLOR][/CENTER][/HEADING]<br>",
      prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'RP био не по форме',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к. она составлена не по форме. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'RP био не дополнил',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к. вы её не дополнили. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'RP био неграмотная',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к. она оформлена неграмотно. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/I][/B][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Тавтология — это риторическая фигура, представляющая собой необоснованное повторение одних и тех же (или однокоренных) или близких по смыслу слов.[/SIZE][/CENTER][/COLOR][/FONT]" +
    "[HEADING=3][CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/I][/B][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Грамматическая ошибка - это ошибка в структуре языковой единицы: в структуре слова, словосочетания или предложения; это нарушение какой-либо грамматической нормы - словообразовательной, морфологической, синтаксической.[/SIZE][/CENTER][/COLOR][/FONT]" +
    "[HEADING=3][CENTER][I][B][COLOR=rgb(0, 255, 255)][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/I][/B][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Пунктуационная ошибка - это неиспользование пишущим необходимого знака препинания или его употребление там, где он не требуется, а также необоснованная замена одного знака препинания другим.[/SIZE][/CENTER][/COLOR][/FONT]" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'RP био тавтология',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к. она оформлена неграмотно. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/I][/B][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Тавтология — это риторическая фигура, представляющая собой необоснованное повторение одних и тех же (или однокоренных) или близких по смыслу слов.[/SIZE][/CENTER][/COLOR][/FONT]" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'RP био знаки препинания',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к. она оформлена неграмотно. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][I][B][COLOR=rgb(0, 255, 255)][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/I][/B][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Пунктуационная ошибка - это неиспользование пишущим необходимого знака препинания или его употребление там, где он не требуется, а также необоснованная замена одного знака препинания другим.[/SIZE][/CENTER][/COLOR][/FONT]" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'RP био граммат. ошибки',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к. она оформлена неграмотно. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/I][/B][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Грамматическая ошибка - это ошибка в структуре языковой единицы: в структуре слова, словосочетания или предложения; это нарушение какой-либо грамматической нормы - словообразовательной, морфологической, синтаксической.[/SIZE][/CENTER][/COLOR][/FONT]" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'RP био скопирована',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к. она скопирована. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'скопирована со своей старой био',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к. она скопирована с вашей прошлой РП Биографии на другой ник. Нужно на новый ник писать новую историю. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'мало инфо детство',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к в пункте Детство мало информации. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
      prefix: UNACCEPT_PREFIX,
       status: false,
    },
    {
        title: 'мало инфо юность',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к в пункте Юность и Взрослая жизнь мало информации. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
      prefix: UNACCEPT_PREFIX,
       status: false,
    },
    {
        title: 'мало инфо',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к в пункте *Детство* и *Юность и Взрослая* жизнь мало информации. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
      prefix: UNACCEPT_PREFIX,
       status: false,
    },
    {
        title: 'нет города на проекте',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к. на проекте нет данного города/поселка. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'прибывание в городе которого нет',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к. в ней описывается прибывание в городе которого не существует на проекте. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
      title: '------------------------------------------------------| RP Ситуации |------------------------------------------------------',
      content:
          '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
      },
    {
        title: 'RP сит одобрена',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Ваша RolePlay Ситуация одобрена. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
     "[FONT=georgia][SIZE=4][CENTER][I][B][COLOR=rgb(0, 221, 0)]Одобрено [/COLOR][/CENTER][/I][/SIZE][/FONT]<br><br>" ,
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'RP сит отказана',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Ваша RolePlay Ситуация отказана. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP ситуаций закрепленные в данном разделе [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
     "[FONT=georgia][SIZE=4][CENTER][I][B][COLOR=rgb(255, 0, 0)]Отказано. [/COLOR][/CENTER][/I][/SIZE][/FONT]<br><br>" ,
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'RP сит скопирована',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Ваша RolePlay Ситуация отказана т.к она скопирована. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP ситуаций закрепленные в данном разделе [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
     "[FONT=georgia][SIZE=4][CENTER][I][B][COLOR=rgb(255, 0, 0,)]Отказано![/COLOR][/CENTER][/I][/SIZE][/FONT]<br><br>" ,
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'RP сит не по форме',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Ваша RolePlay Ситуация отказана т.к она составлена не по форме. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP ситуаций закрепленные в данном разделе [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
     "[FONT=georgia][SIZE=4][CENTER][I][B][COLOR=rgb(255, 0, 0,)]Отказано![/COLOR][/CENTER][/I][/SIZE][/FONT]<br><br>" ,
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'RP сит тег темы',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Ваша RolePlay Ситуация отказана т.к название темы указано не верно [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
     "[FONT=georgia][SIZE=4][CENTER][I][B][COLOR=rgb(255, 0, 0,)]Отказано![/COLOR][/CENTER][/I][/SIZE][/FONT]<br><br>" ,
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'RP сит нет смысла',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Ваша RolePlay Ситуация отказана т.к в ней нет имеющего смысла. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP ситуаций закрепленные в данном разделе [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
     "[FONT=georgia][SIZE=4][CENTER][I][B][COLOR=rgb(255, 0, 0,)]Отказано![/COLOR][/CENTER][/I][/SIZE][/FONT]<br><br>" ,
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: '---------------------------------------------------| Неофициальные RP организации |---------------------------------------------------',
      content:
          '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
      },
      {
        title: 'одобрена',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Ваша Неофициальная RolePlay организация одобрена. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
     "[FONT=georgia][SIZE=4][CENTER][I][B][COLOR=rgb(0, 221, 0)]Одобрено [/COLOR][/CENTER][/I][/SIZE][/FONT]<br><br>" ,
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'отказано',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Ваша Неофициальная RolePlay организация отказана. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
     "[FONT=georgia][SIZE=4][CENTER][I][B][COLOR=rgb(0, 221, 0)]Отказано! [/COLOR][/CENTER][/I][/SIZE][/FONT]<br><br>" ,
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'нет смысла',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Ваша Неофициальная RolePlay организация отказана т.к в ней нет имеющего смысла. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
     "[FONT=georgia][SIZE=4][CENTER][I][B][COLOR=rgb(0, 221, 0)]Отказано! [/COLOR][/CENTER][/I][/SIZE][/FONT]<br><br>" ,
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'нет старт состава 3+ человек',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Ваша Неофициальная RolePlay организация отказана т.к у вас нет стартового состава от 3ёх+ человек. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
     "[FONT=georgia][SIZE=4][CENTER][I][B][COLOR=rgb(0, 221, 0)]Отказано! [/COLOR][/CENTER][/I][/SIZE][/FONT]<br><br>" ,
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'не по форме',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Ваша Неофициальная RolePlay организация отказана т.к составлена не по форме. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
     "[FONT=georgia][SIZE=4][CENTER][I][B][COLOR=rgb(0, 221, 0)] Отказано! [/COLOR][/CENTER][/I][/SIZE][/FONT]<br><br>" ,
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'скопирована',
      content:
       
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(255, 255, 255)][FONT=georgia][SIZE=4] Ваша Неофициальная RolePlay организация отказана т.к она скопирована. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia]Приятной игры на сервере [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(255, 0, 255)][FONT=georgia] SAMARA[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
     "[FONT=georgia][SIZE=4][CENTER][I][B][COLOR=rgb(0, 221, 0)]Отказано! [/COLOR][/CENTER][/I][/SIZE][/FONT]<br><br>" ,
       prefix: UNACCEPT_PREFIX,
      status: false,
        },
        {
            title: '-------------------------------------------------------| Отказ жалобы |------------------------------------------------------',
      content:
          '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
        },
        {
            title: 'Ошибка сервером',
            content:
           
            "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) {{ user.name }}.[/FONT][/CENTER]<br><br>"+
            "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
            "[CENTER][FONT=georgia] Ошиблись сервером, переношу на нужный. [/FONT][/CENTER]",


    },





    ];
      $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

              // Добавление кнопок при загрузке страницы

          addButton('На рассмотрение', 'pin');
          addButton('Одобрить', 'accepted');
          addButton('Отказать', 'unaccept');
          addButton('Закрыть', 'closed');
          addButton('Ответы', 'selectAnswer');

              // Поиск информации о теме
    const threadData = getThreadData();

     $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
     $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
     $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
     $('button#Spec').click(() => editThreadData(SPECY_PREFIX, true));
    $(`button#closed`).click(() => editThreadData(CLOSE_PREFIX, false));
     $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
     $(`button#unaccept`).click(() => editThreadData(UNACCEPT_PREFIX, false));
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







