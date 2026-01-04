// ==UserScript==
// @name         BLACK RUSSIA PINK  || Скрипт Кураторов форума  by. S. Pavlinov
// @namespace    https://forum.blackrussia.online
// @version      1.0. 0.
// @description  Специально для BlackRussia || PINK
// @author       BlackRussia
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @collaborator QuenkM
// @icon https://icons.iconarchive.com/icons/google/noto-emoji-people-bodyparts/256/11960-victory-hand-light-skin-tone-icon.png
// @downloadURL https://update.greasyfork.org/scripts/523671/BLACK%20RUSSIA%20PINK%20%20%7C%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%20by%20S%20Pavlinov.user.js
// @updateURL https://update.greasyfork.org/scripts/523671/BLACK%20RUSSIA%20PINK%20%20%7C%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%20by%20S%20Pavlinov.meta.js
// ==/UserScript==

(function () {
  'use strict';
'@version 7' ;
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
      title: '|',
      content:
        '[SIZE=4][COLOR=rgb(0, 255, 255)][I][FONT=times new roman]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/I][/COLOR][/SIZE]',
      },
    {
      title: '🚫',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.19.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Jail 60 минут[/SIZE][/FONT][/COLOR]<br><br>" +
        "[LIST]<br><br>" +
        "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Примечание: [/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил.[/SIZE][/COLOR][/FONT][/LEFT]<br><br>" +
        "[*][LEFT][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]нанесение урона с целью защиты особняка или его территории, а также нанесение урона после ДТП не является веской IC причиной, для войны семей предусмотрено отдельное системное мероприятие.[/SIZE][/FONT][/COLOR][/LEFT]<br><br>" +
        "[/LIST]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'DM',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.19.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Jail 60 минут[/SIZE][/FONT][/COLOR]<br><br>" +
        "[LIST]<br><br>" +
        "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Примечание: [/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил.[/SIZE][/COLOR][/FONT][/LEFT]<br><br>" +
        "[*][LEFT][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]нанесение урона с целью защиты особняка или его территории, а также нанесение урона после ДТП не является веской IC причиной, для войны семей предусмотрено отдельное системное мероприятие.[/SIZE][/FONT][/COLOR][/LEFT]<br><br>" +
        "[/LIST]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'MG',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.18. [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Mute 30 минут[/SIZE][/FONT][/COLOR]<br><br>" +
        '[LIST]<br><br>' +
        "[*][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]использование смайлов в виде символов «))», «=D» запрещено в IC чате.[/SIZE][/FONT][/COLOR]<br><br>" +
        "[*][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Примечание:[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] телефонное общение также является IC чатом.[/SIZE][/FONT][/COLOR]<br><br>" +
        "[/LIST]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'ТК',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]2.15.[/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4][FONT=book antiqua] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua] | Jail 60 минут / Warn (за два и более убийства)[/FONT][/SIZE][/COLOR]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'SК',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]2.16. [/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4][FONT=book antiqua]Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua] | Jail 60 минут / Warn (за два и более убийства) [/FONT][/SIZE][/COLOR]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'CAPS',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]3.02. [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Mute 30 минут [/SIZE][/FONT][/COLOR]<br><br>" +
        "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)] ПрОдАм, куплю МАШИНУ.[/COLOR][/SIZE][/FONT]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
         title: 'Маты в VIP чат',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]3.23. [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]| Mute 30 минут [/SIZE][/FONT][/COLOR]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'DB',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)][FONT=book antiqua]2.13. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua]| Jail 60 минут[/FONT][/COLOR]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Помеха работе',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]2.15.[/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4][FONT=book antiqua] Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы.[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua] | Ban 10 дней / Обнуление аккаунта (при повторном нарушении) | [/FONT][/SIZE][/COLOR]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'NRP обман',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]2.05.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики[/COLOR][COLOR=rgb(255, 0, 0)] | PermBan[/COLOR][/SIZE][/FONT]<br><br>" +
        '[LIST]<br><br>' +
        "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]после IC договоренности получить денежные средства и сразу же выйти из игры с целью обмана игрока, или же, договорившись через OOC чат (/n), точно также получить денежные средства и сразу же выйти из игры и тому подобные ситуации.[/COLOR][/SIZE][/FONT]<br><br>" +
        "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]разблокировка игрового аккаунта нарушителя будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого имущества, которое было украдено (по решению обманутой стороны).[/COLOR][/SIZE][/FONT]<br><br>" +
        "[/LIST]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Деньги в долг',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]2.57.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещается брать в долг игровые ценности и не возвращать их[/COLOR][COLOR=rgb(255, 0, 0)] | Ban 30 дней / PermBan[/COLOR][/SIZE][/FONT]<br><br>" +
        '[LIST]<br><br>' +
        "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]займ может быть осуществлен только через зачисление игровых ценностей на банковский счет, максимальный срок займа 30 календарных дней, если займ не был возвращен, аккаунт должника блокируется;[/COLOR][/SIZE][/FONT]<br><br>" +
        "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]при невозврате игровых ценностей общей стоимостью менее 5 миллионов включительно аккаунт будет заблокирован на 30 дней, если более 5 миллионов, аккаунт будет заблокирован навсегда;[/COLOR][/SIZE][/FONT]<br><br>" +
        "[/LIST]<br><br>" +
        "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]жалоба на игрока, который занял игровые ценности и не вернул в срок, подлежит рассмотрению только при наличии подтверждения суммы и условий займа в игровом процессе, меры в отношении должника могут быть приняты только при наличии жалобы и доказательств. Жалоба на должника подается в течение 10 дней после истечения срока займа. Договоры вне игры не будут считаться доказательствами.[/COLOR][/SIZE][/FONT]<br><br>" +
        "[/LIST]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
        },
    {
         title: 'Ввод в заблуж.',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]3.11.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено введение игроков проекта в заблуждение путем злоупотребления командами[/COLOR][COLOR=rgb(255, 0, 0)] | Ban 15 - 30 дней / PermBan[/COLOR][/SIZE][/FONT]<br><br>" +
        '[LIST]<br><br>' +
        "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)] /me чтобы поднять кошелек введите /pay 228 5000. Для продажи автомобиля введите /sellmycar id 2828 (счёт в банке) цена.[/COLOR][/SIZE][/FONT]<br><br>" +
        "[/LIST]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
         title: 'Фейк',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]4.10.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию[/COLOR][COLOR=rgb(255, 0, 0)] | Устное замечание + смена игрового никнейма / PermBan[/COLOR][/SIZE][/FONT]<br><br>" +
        '[LIST]<br><br>' +
        "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]Подменять букву i на L и так далее, по аналогии..[/COLOR][/SIZE][/FONT]<br><br>" +
        "[/LIST]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
         title: 'Мат в Nick',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]4.09.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные)[/COLOR][COLOR=rgb(255, 0, 0)] | Устное замечание + смена игрового никнейма / PermBan[/COLOR][/SIZE][/FONT]<br><br>" +
        '[LIST]<br><br>' +
        "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]Подменять букву i на L и так далее, по аналогии..[/COLOR][/SIZE][/FONT]<br><br>" +
        "[/LIST]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'NRP поведение',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]2.01. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]Запрещено поведение, нарушающее нормы процессов Role Play режима игры[/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua] | Jail 30 минут[/FONT][/COLOR][/SIZE]<br><br>" +
        '[LIST]<br><br>' +
        "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]ездить на крышах транспортных средств, бегать или ходить по столам в казино, целенаправленная провокация сотрудников правоохранительных органов с целью развлечения, целенаправленная помеха в проведении различных собеседований и так далее.[/FONT][/COLOR][/SIZE]<br><br>" +
        "[/LIST]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Уход от RP',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]2.02. [/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4][FONT=book antiqua]Запрещено целенаправленно уходить от Role Play процесса всеразличными способами [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]| Jail 30 минут / Warn[/FONT][/SIZE][/COLOR]<br><br>" +
        '[LIST]<br><br>' +
        "[*][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]Примечание: [/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4][FONT=book antiqua]например, уходить в AFK при остановке транспортного средства правоохранительными органами, выходить из игры для избежания смерти, выходить из игры во время процесса задержания / ареста, полное игнорирование отыгровок другого игрока, которые так или иначе могут коснуться Вашего персонажа и так далее.[/FONT][/SIZE][/COLOR]<br><br>" +
        "[/LIST]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'NRP Drive',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.03. [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Jail 30 минут[/SIZE][/FONT][/COLOR]<br><br>" +
        '[LIST]<br><br>' +
        "[*][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Примечание:[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] езда на скутере по горам, езда на любом транспортном средстве по встречным полосам, нарушая все правила дорожного движения без какой-либо причины, намеренное создание аварийных ситуаций на дорогах и так далее.[/SIZE][/FONT][/COLOR]<br><br>" +
        "[/LIST]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Аморал',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[SIZE=4][FONT=book antiqua][COLOR=rgb(255, 0, 0)]2.08. [/COLOR][COLOR=rgb(209, 213, 216)]Запрещена любая форма аморальных действий сексуального характера в сторону игроков[/COLOR][COLOR=rgb(255, 0, 0)] | Jail 30 минут / Warn[/COLOR][/FONT][/SIZE]<br><br>" +
        '[LIST]<br><br>' +
        "[*][SIZE=4][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]обоюдное согласие обеих сторон.[/COLOR][/FONT][/SIZE]<br><br>" +
        "[/LIST]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Слив склада',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]2.09.[/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4][FONT=book antiqua] Запрещено сливать склад фракции / семьи путем взятия большого количества ресурсов или превышая допустимый лимит, установленный лидером[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua] | Ban 15 - 30 дней / PermBan[/FONT][/SIZE][/COLOR]<br><br>"+
        "[/LIST]<br><br>" +
        "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR][COLOR=rgb(209, 213, 216)] в описании семьи должны быть указаны условия взаимодействия со складом. Если лидер семьи предоставил неограниченный доступ к складу и забыл снять его, администрация не несет ответственности за возможные последствия. Жалобы по данному пункту правил принимаются только от лидера семьи.[/COLOR][/SIZE][/FONT]<br><br>" +
        "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR][COLOR=rgb(209, 213, 216)] исключение всех или части игроков из состава семьи без ведома лидера также считается сливом.[/COLOR][/SIZE][/FONT]<br><br>" +
        "[/LIST]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Mass DM',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]2.20. [/COLOR][COLOR=rgb(209, 213, 216)]Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более[/COLOR][COLOR=rgb(255, 0, 0)] | Warn / Ban 3 - 7 дней[/COLOR] [/SIZE][/FONT]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Bagouse',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[SIZE=4][FONT=book antiqua][COLOR=rgb(255, 0, 0)]2.21.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено пытаться обходить игровую систему или использовать любые баги сервера[/COLOR][COLOR=rgb(255, 0, 0)] | Ban 15 - 30 дней / PermBan[/COLOR][/FONT][/SIZE]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Сбив аним',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[SIZE=4][FONT=book antiqua][COLOR=rgb(255, 0, 0)]2.55. [/COLOR][COLOR=rgb(209, 213, 216)]Запрещается багоюз связанный с анимацией в любых проявлениях. [/COLOR][COLOR=rgb(255, 0, 0)]| Jail 60 / 120 минут[/COLOR][/FONT][/SIZE]<br><br>" +
        '[LIST]<br><br>' +
        "[*][SIZE=4][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]если игрок, используя баг, убирает ограничение на использование оружия в зеленой зоне, сбивает темп стрельбы, либо быстро перемещается во время войны за бизнес или во время перестрелки на мероприятии с семейными контейнерами, последует наказание в виде Jail на 120 минут. Данное наказание используется в случаях, когда, используя ошибку, было получено преимущество перед другими игроками.[/COLOR][/FONT][/SIZE]<br><br>" +
        "[*][SIZE=4][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]если игрок использует баги, связанные с анимацией, и при этом не влияет на игровой процесс других игроков, а также не получает преимущество перед другими игроками, последует наказание в виде Jail на 60 минут.[/COLOR][/FONT][/SIZE]<br><br>" +
        "[/LIST]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'OOC оск',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]3.03. [/COLOR][COLOR=rgb(209, 213, 216)]Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены[/COLOR][COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR] [/SIZE][/FONT]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Упом род',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]3.04. [/COLOR][COLOR=rgb(209, 213, 216)]Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [/COLOR][COLOR=rgb(255, 0, 0)]| Mute 120 минут / Ban 7 - 15 дней[/COLOR][/SIZE][/FONT]<br><br>" +
        '[LIST]<br><br>' +
        "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR][COLOR=rgb(209, 213, 216)] термин «MQ» расценивается, как упоминание родных.[/COLOR][/SIZE][/FONT]<br><br>" +
        "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]если упоминание родных было совершено в ходе Role Play процесса и не содержало в себе прямого или завуалированного оскорбления.[/COLOR][/SIZE][/FONT]<br><br>" +
        "[/LIST]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Оск нации',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.35.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Mute 120 минут / Ban 7 дней[/SIZE][/FONT][/COLOR]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Flood',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]3.05.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Mute 30 минут[/SIZE][/FONT][/COLOR]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
         title: 'Злоуп знаками',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]3.06.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено злоупотребление знаков препинания и прочих символов[/COLOR][COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR][/SIZE][/FONT]<br><br>" +
        '[LIST]<br><br>' +
        "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)] «???????», «!!!!!!!», «Дааааааааааааааааааааааа» и так далее.[/COLOR][/SIZE][/FONT]<br><br>" +
        "[/LIST]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Торговля на тт ГОСС',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]3.22.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC)[/COLOR][COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR][/SIZE][/FONT]<br><br>" +
        '[LIST]<br><br>' +
        "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)] в помещении центральной больницы писать в чат: Продам эксклюзивную шапку дешево!!![/COLOR][/SIZE][/FONT]<br><br>" +
        "[/LIST]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
          title: 'Продажа должности',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.01. [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Владельцу и менеджерам казино и ночного клуба запрещено принимать работников за денежные средства на должность охранника, крупье или механика. [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]| Ban 3 - 5 дней. [/SIZE][/FONT][/COLOR]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'ooc угрозы',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[SIZE=4][FONT=book antiqua][COLOR=rgb(255, 0, 0)]2.37.[/COLOR][COLOR=rgb(209, 213, 216)]  Запрещены OOC угрозы, в том числе и завуалированные [/COLOR][COLOR=rgb(255, 0, 0)]| Mute 120 минут / Ban 7 дней [/COLOR][/FONT][/SIZE]<br><br>" +
        "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR][COLOR=rgb(209, 213, 216)] Блокировка аккаунта выдаётся в случае, если есть прямые угрозы жизни, здоровью игрока или его близким. По решению главного администратора может быть выдана перманентная блокировка.[/COLOR][/SIZE][/FONT]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Выдача за адм',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]3.10.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещена выдача себя за администратора, если таковым не являетесь [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]| Ban 7 - 15[/SIZE][/FONT][/COLOR]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
       title: 'Введение в заблуж',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.32.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]|  Ban 7 - 15 дней[/SIZE][/FONT][/COLOR]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'польз уязв правил',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.33.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено пользоваться уязвимостью правил [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]| Ban 15 - 30 дней / PermBan[/SIZE][/FONT][/COLOR]<br><br>" +
        "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]Игрок сознательно берёт долг через трейд, не планируя его возвращать, считая, что по правилам это не считается долгом и наказания не будет.[/COLOR][/SIZE][/FONT]<br><br>" +
        "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]Игрок объясняет свою невиновность тем, что какой-либо пункт правил недостаточно расписан, но вина очевидна. Либо его действия формально не нарушают конкретного пункта, но всё же наносят ущерб другим игрокам или игровой системе.[/COLOR][/SIZE][/FONT]<br><br>" +
        "[/LIST]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Личная информация',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.38. [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено распространять личную информацию игроков и их родственников[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Ban 15 - 30 дней / PermBan + ЧС проекта[/SIZE][/FONT][/COLOR]<br><br>" +
        '[LIST]<br><br>' +
        "[*][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Примечание:[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Распространение личной информации пользователя без его согласия запрещено.[/SIZE][/FONT][/COLOR]<br><br>" +
        "[/LIST]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
          title: 'НонРП акс',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.52.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]| При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут (суммируется к общему наказанию дополнительно) [/SIZE][/FONT][/COLOR]<br><br>" +
        "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]Cлишком большие аксессуары на голове персонажа, имитация гитарой половых органов и тому подобное.[/COLOR][/SIZE][/FONT]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
 title: 'конфликты ooc и ic',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.35.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]| Mute 120 минут / Ban 7 дней [/SIZE][/FONT][/COLOR]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
title: 'злоуп нарушениями',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.39.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Злоупотребление нарушениями правил сервера[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]| Ban 7 - 15 дней [/SIZE][/FONT][/COLOR]<br><br>" +
        "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]Неоднократное (от шести и более) нарушение правил серверов, которые были совершены за прошедшие 7 дней, с момента проверки истории наказаний игрока.[/FONT][/COLOR][/SIZE]<br><br>" +
        "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]Наказания выданные за нарушения правил текстовых чатов, помеху (kick) не учитываются.[/FONT][/COLOR][/SIZE]<br><br>" +
        "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Исключение: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]Пункты правил: 2.54, 3.04 учитываются в качестве злоупотребления нарушениями правил серверов.[/FONT][/COLOR][/SIZE]<br><br>" +
        "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Пример: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]Было получено пять наказаний за DM, шестое будет злоупотреблением. Если было получено одно наказание за упоминание родных, два наказания за DB и два наказания за DM, следующее будет считаться злоупотреблением.[/FONT][/COLOR][/SIZE]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
title: 'продажа промо',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.43.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]| Mute 120 минут [/SIZE][/FONT][/COLOR]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
title: 'Неув к адм',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.54.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]|  Mute 180 минут [/SIZE][/FONT][/COLOR]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
 },
    {
      title: 'Полит/религ пропаганда',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]3.18.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещено политическое и религиозное пропагандирование [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]| Mute 120 минут / Ban 10 дней[/SIZE][/FONT][/COLOR]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Транслит',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]3.20.[/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] Запрещено использование транслита в любом из чатов[/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua] | Mute 30 минут[/FONT][/COLOR][/SIZE]<br><br>" +
        '[LIST]<br><br>' +
        "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Пример: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]«Privet», «Kak dela», «Narmalna».[/FONT][/COLOR][/SIZE]<br><br>" +
        "[/LIST]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Реклама промо',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]3.21.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]| Ban 30 дней[/SIZE][/FONT][/COLOR]<br><br>" +
        '[LIST]<br><br>' +
        "[*][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]чаты семейные, строительных компаний, транспортных компаний, фракционные чаты, IC, OOC, VIP и так далее.[/SIZE][/FONT][/COLOR]<br><br>" +
        "[*][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Исключение: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]промокоды, предоставленные разработчиками, а также распространяемые через официальные ресурсы проекта.[/SIZE][/FONT][/COLOR]<br><br>" +
        "[*][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Пример: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]если игрок упомНянет промокод, распространяемый через официальную публичную страницу ВКонтакте либо через официальный Discord в любом из чатов, наказание ему не выдается.[/SIZE][/FONT][/COLOR]<br><br>" +
        "[/LIST]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Сборка/Читы',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.22. [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Ban 15 - 30 дней / PermBan[/SIZE][/FONT][/COLOR]<br><br>" +
        '[LIST]<br><br>' +
        "[*][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]запрещено внесение любых изменений в оригинальные файлы игры.[/SIZE][/FONT][/COLOR]<br><br>" +
        "[/LIST]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Покупка/Продажа ИВ',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.28. [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещена покупка/продажа внутриигровой валюты за реальные деньги в любом виде[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | PermBan с обнулением аккаунта + ЧС проекта[/SIZE][/FONT][/COLOR]<br><br>" +
        '[LIST]<br><br>' +
        "[*][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Любые попытки купить или продать внутриигровую валюту, интересоваться этим у других игроков или обсуждать это – наказуемо.[/SIZE][/FONT][/COLOR]<br><br>" +
        "[/LIST]<br><br>" +
        "[*][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Нельзя обменивать донат валюту (например, рубли, пополненные через сайт) на игровые ценности и наоборот.[/SIZE][/FONT][/COLOR]<br><br>" +
        "[/LIST]<br><br>" +
        "[*][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Пример: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Пополнение донат-счёта другого игрока в обмен на игровую валюту или другие ценности запрещено.[/SIZE][/FONT][/COLOR]<br><br>" +
        "[/LIST]<br><br>" +
        "[*][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Продавать или обменивать игровые ценности, которые были куплены за донат-валюту, не запрещено.[/SIZE][/FONT][/COLOR]<br><br>" +
        "[/LIST]<br><br>" +
        "[*][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Покупка игровой валюты или ценностей через официальный сайт разрешена.[/SIZE][/FONT][/COLOR]<br><br>" +
        "[/LIST]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Реклама',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.31. [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube-каналы и тому подобное[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Ban 7 дней / PermBan[/SIZE][/FONT][/COLOR]<br><br>" +
        '[LIST]<br><br>' +
        "[*][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]если игрок не использует глобальный чат, чтобы дать свои контактные данные для связи, это не будет являться рекламой.[/SIZE][/FONT][/COLOR]<br><br>" +
        "[/LIST]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'подделка докв/обман адм',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]2.32. [/COLOR][COLOR=rgb(209, 213, 216)]Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта [/COLOR][COLOR=rgb(255, 0, 0)]| Ban 7 - 15 дней[/COLOR][/SIZE][/FONT]<br><br>" +
        '[LIST]<br><br>' +
        "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]Подделка доказательств, искажение информации в свою пользу, предоставление неполной информации о ситуации.[/COLOR][/SIZE][/FONT]<br><br>" +
        "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]За подделку доказательств по решению руководства сервера может быть выдана перманентная блокировка, как на аккаунт с которого совершен обман, так и на все аккаунты нарушителя.[/COLOR][COLOR=rgb(255, 0, 0)]| PermBan[/COLOR][/SIZE][/FONT]<br><br>" +
        "[/LIST]<br><br>" +
         "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]За предоставление услуг по прохождению обзвонов на различные должности, а также за услуги, облегчающие процесс обзвона, может быть выдан чёрный список проекта.[/COLOR][COLOR=rgb(255, 0, 0)]| PermBan + ЧС проекта[/COLOR][/SIZE][/FONT]<br><br>" +
        "[/LIST]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title : 'Оск проекта' ,
     content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Здравствуйте, уважаемый {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту строгих правил серверов:[/SIZE][/FONT][/COLOR] [/I]<br><br>" +
        "[FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]2.40. [/COLOR][COLOR=rgb(209, 213, 216)]Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе  [/COLOR][COLOR=rgb(255, 0, 0)]| Mute 300 минут / Ban 30 дней[/COLOR][/SIZE][/FONT]<br><br> " +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb( 0, 255, 255)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman ][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]' ,
        prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'ЕПП',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.46. [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено ездить по полям на любом транспорте[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Jail 30 минут[/SIZE][/FONT][/COLOR]<br><br>" +
        '[LIST]<br><br>' +
        "[*][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Исключение:[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] разрешено передвижение на кроссовых мотоциклах и внедорожниках.[/SIZE][/FONT][/COLOR]<br><br>" +
        "[/LIST]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'ЕПП Фура и инкос',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]2.47. [/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора)[/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4] | Jail 60 минут[/SIZE][/COLOR][/FONT]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'NRP В/Ч',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту правил нападения на военную часть:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2. [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]За нарушение правил нападения на Военную Часть выдаётся предупреждение [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]| Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ)[/SIZE][/FONT][/COLOR]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'NRP ограб/похищение',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет наказан по общим правилам ограблений и похищений.[/SIZE][/FONT][/COLOR]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
     title: 'Системные отыгровки',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]Системных отыгровок достаточно при задержании.[/I][/SIZE][/FONT]<br><br>" +
        "[I][FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/I][/COLOR]<br><br>" +
        "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][I]Отказано.[/I][/FONT][/SIZE][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
         title: 'работа/казино в форме',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту правил государственных структур:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]1.13.[/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4][FONT=book antiqua] Запрещено находиться в форме внутри казино, а также устраиваться на сторонние работы в форме фракции[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua] | Jail 30 минут[/FONT][/SIZE][/COLOR]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
         title: 'DM от полиции на тт УМВД',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту правил государственных структур:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]6.01.[/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4][FONT=book antiqua] Запрещено наносить урон игрокам без Role Play причины на территории УМВД[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]| DM / Jail 60 минут / Warn[/FONT][/SIZE][/COLOR]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Штраф без причины',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту правил государственных структур:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]7.02.[/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4][FONT=book antiqua] Запрещено выдавать розыск, штраф без Role Play причины[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]| Warn[/FONT][/SIZE][/COLOR]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Одиноч. Патруль',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту правил государственных структур:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]1.11.[/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4][FONT=book antiqua] Всем силовым структурам запрещен одиночный патруль или конвоирование, минимум 2 сотрудника[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]| Jail 30 минут[/FONT][/SIZE][/COLOR]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
 {
        title: 'права без причины',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту правил государственных структур:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua][/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4][FONT=book antiqua] Запрещено забирать водительское удостоверение без причины[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]| Warn[/FONT][/SIZE][/COLOR]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
         title: 'НонРП РОЗЫСК',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту правил государственных структур:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]6.02.[/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4][FONT=book antiqua] Запрещено выдавать розыск без Role Play причины[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]| Warn[/FONT][/SIZE][/COLOR]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
          title: 'NonRP EDIT',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту правил государственных структур:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]4.01.[/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4][FONT=book antiqua] Запрещено редактирование объявлений, не соответствующих ПРО[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]| Mute 30 минут[/FONT][/SIZE][/COLOR]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
          title: 'Замена текста СМИ',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту правил государственных структур:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]4.04.[/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4][FONT=book antiqua] Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]| Ban 7 дней + ЧС организации[/FONT][/SIZE][/COLOR]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
           title: 'Слив Глоб чат',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]3.08. [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещены любые формы «слива» посредством использования глобальных чатов [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]| PermBan[/SIZE][/FONT][/COLOR]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'На рассмотрении',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4]Ваша жалоба взята на рассмотрение, ожидайте ответа в данной теме.[/SIZE][/FONT]<br><br>" +
        "[FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/I][/COLOR]<br><br>" +
        '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]',
      prefix: PIN_PREFIX,
      status: true,
    },
    {
      title: 'Тех. спецу',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4]Ваша жалоба переадресована [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 102, 0)][I][FONT=times new roman][SIZE=4]Техническому Специалисту[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4], ожидайте ответа в данной теме.[/SIZE][/FONT]<br><br>" +
        "[FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/I][/COLOR]<br><br>" +
        '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]',
      prefix: TEX_PREFIX,
      status: true,
    },
    {
      title: 'Недостаточно док-в',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]Недостаточно доказательств для корректного рассмотрения вашей жалобы.[/I][/SIZE][/FONT]<br><br>" +
        "[I][FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/I][/COLOR]<br><br>" +
        "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][I]Отказано.[/I][/FONT][/SIZE][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Оск в РП',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]Оскорбление в RolePlay чат не наказуемо.[/I][/SIZE][/FONT]<br><br>" +
        "[*][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Исключение:[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Оскорбление Секс. Хар-ра в RolePlay чат[/SIZE][/FONT][/COLOR]<br><br>" +
        "[/LIST]<br><br>" +
        "[I][FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/I][/COLOR]<br><br>" +
        "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][I]Отказано.[/I][/FONT][/SIZE][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Требуются видео',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]Недостаточно доказательств. Для корректного рассмотрения вашей жалобы требуются видео-доказательства.[/I][/SIZE][/FONT]<br><br>" +
        "[I][FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/I][/COLOR]<br><br>" +
        "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][I]Отказано.[/I][/FONT][/SIZE][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Отсутствуют док-ва',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I]Отсутствуют доказательства - следовательно, рассмотрению не подлежит. Загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx и так далее.[/I][/FONT][/SIZE]<br><br>" +
        "[I][FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/I][/COLOR]<br><br>" +
        "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][I]Отказано.[/I][/FONT][/SIZE][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Ник не соответствует',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I] Nick_Name игрока поданной жалобы не соответствует тому который предоставлен в ваших доказательствах.[/I][/FONT][/SIZE]<br><br>" +
        "[I][FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/I][/COLOR]<br><br>" +
        "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][I]Отказано.[/I][/FONT][/SIZE][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Нет доступа',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I] На ваших доказательствах стоит приватный доступ, снимите его и заново подайте жалобу.[/I][/FONT][/SIZE]<br><br>" +
        "[I][FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/I][/COLOR]<br><br>" +
        "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][I]Отказано.[/I][/FONT][/SIZE][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Плохое качество',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I] Ваши доказательства были предоставлены в плохом качестве, загрузите их в более лучшем качестве и заново подайте жалобу.[/I][/FONT][/SIZE]<br><br>" +
        "[I][FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/I][/COLOR]<br><br>" +
        "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][I]Отказано.[/I][/FONT][/SIZE][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Док-ва в соц. сетях',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I]Доказательства в социальных сетях и т.д. не принимаются. Загрузите доказательства на фото-видео хостинги YouTube,Imgur, Yapx и так далее.[/I][/FONT][/SIZE]<br><br>" +
        "[FONT=times new roman][SIZE=4][I]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
        "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][I]Отказано.[/I][/FONT][/SIZE][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Нарушений нет',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]Нарушений со стороны игрока не было замечено.<br><br>" +
        "Внимательно изучите общие правила серверов - [/I][URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']*Нажмите сюда*[/URL]<br><br>" +
        "[I]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
        "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][I]Отказано.[/I][/FONT][/SIZE][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Правило не действительное',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]Правила игры были изменены и в ходе этого, данное правило больше не действительно.<br><br>" +
        "Внимательно изучите общие правила серверов - [/I][URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']*Нажмите сюда*[/URL]<br><br>" +
        "[I]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
        "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][I]Отказано.[/I][/FONT][/SIZE][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Нет time',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]На доказательствах отсутствуют дата и время [/I]([/SIZE][/FONT][FONT=courier new][SIZE=4]/time[/SIZE][/FONT][FONT=times new roman][SIZE=4])[I] - следовательно, рассмотрению не подлежит.<br><br>" +
        "Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
        "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][I]Отказано.[/I][/FONT][/SIZE][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Нет иконки',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]На ваших доказательствах отсутствует иконка сервера  [/I]([/SIZE][/FONT][FONT=courier new][SIZE=4]PINK[/SIZE][/FONT][FONT=times new roman][SIZE=4])[I] - следовательно, рассмотрению не подлежит.<br><br>" +
        "Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
        "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][I]Отказано.[/I][/FONT][/SIZE][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Слив склада(Лидер)',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]Недостаточно доказательств. Для корректного рассмотрения жалобы лидер должен подать жалобу на игроков со сливом склада, прикрепив доказательства из логов семейного склада.[/I][/FONT][/SIZE]<br><br>" +
        "Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
        "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][I]Отказано.[/I][/FONT][/SIZE][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Док-ва отредакт',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]Доказательства были подвергнуты редактированию - следовательно, рассмотрению не подлежит.<br><br>" +
        "Загрузите оригиналы видеозаписи/скриншотов, создав новую тему в данном разделе.<br><br>" +
        "Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
        "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][I]Отказано.[/I][/FONT][/SIZE][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Док-ва обрываются',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]Ваша видеозапись обрывается. Загрузите полную видеозапись на видео-хостинг YouTube.<br><br>" +
        "Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
        "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][I]Отказано.[/I][/FONT][/SIZE][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title : 'Заголовок оск',
     content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I]В вашем заголовке присутствует нецензурная(Оскорбительная) брань. Внимательно прочтите правила создания темы, прикрепленные в этом разделе.[/FONT][/SIZE]<br><br>" +
        "[FONT=times new roman][SIZE=4][I]Просьба не создавать дубликаты этой темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br> <br>" +
        "[FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][I]Отказано.[/I][/FONT][/SIZE][/COLOR]' ,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title : 'Нет таймкодов',
     content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I]Ваша жалоба отказана, т.к в ней нету таймкодов. Если видео длится больше 3-ех минут - Вы должны указать таймкоды нарушений.[/FONT][/SIZE]<br><br>" +
        "[FONT=times new roman][SIZE=4][I]Просьба не создавать дубликаты этой темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br> <br>" +
        "[FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][I]Отказано.[/I][/FONT][/SIZE][/COLOR]' ,
     prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title : 'прошло 3 дня',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE ][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I]Ваша жалоба отказана, т.к с момента нарушения прошло более 72-ух часов.[/FONT][/SIZE]<br><br>" +
        "[FONT=times new roman][SIZE=4][I]Просьба не создавать дубликаты этой темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br> <br>" +
        "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][I]Отказано.[/I][/FONT][/SIZE][/COLOR]' ,
     prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title : 'от 3-его лица',
     content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I]Ваша жалоба отказана, т.к она написана от 3-его лица.[/FONT][/SIZE]<br><br>" +
        "[FONT=times new roman][SIZE=4][I]Просьба не создавать дубликаты этой темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br> <br>" +
        "[FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][I]Отказано.[/I][/FONT][/SIZE][/COLOR]' ,
     prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title : 'уже был ответ',
     content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I]Ваша жалоба отказана, т.к ранее уже был дан ответ.[/FONT][/SIZE]<br><br>" +
        "[FONT=times new roman][SIZE=4][I]Просьба не создавать дубликаты этой темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br> <br>" +
        "[FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][I]Отказано.[/I][/FONT][/SIZE][/COLOR]' ,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title : 'уже был наказан',
     content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I]Ваша жалоба отказана, т.к нарушитель уже был наказан ранее.[/FONT][/SIZE]<br><br>" +
        "[FONT=times new roman][SIZE=4][I]Просьба не создавать дубликаты этой темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br> <br>" +
        "[FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][I]Отказано.[/I][/FONT][/SIZE][/COLOR]' ,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Не по форме',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I]Ваша жалоба составлена не по форме. Внимательно прочитайте правила подачи жалоб на игроков, закрепленные в этом разделе.[/I][/FONT][/SIZE]<br><br>" +
        "[FONT=times new roman][SIZE=4][I]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
        "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][I]Отказано.[/I][/FONT][/SIZE][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
             title : 'Без условий',
     content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I]В ваших доказательствах не было оговорено условий сделки или в них не было дополнительных условий о сделке.[/FONT][/SIZE]<br><br>" +
        "[FONT=times new roman][SIZE=4][I]Просьба не создавать дубликаты этой темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br> <br>" +
        "[FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][I]Отказано.[/I][/FONT][/SIZE][/COLOR]' ,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
         title : 'Нерабочая ссылка',
     content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I]Ваши доказательства не рабочие или же не работает ссылка.[/FONT][/SIZE]<br><br>" +
        "[FONT=times new roman][SIZE=4][I]Просьба не создавать дубликаты этой темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br> <br>" +
        "[FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][I]Отказано.[/I][/FONT][/SIZE][/COLOR]' ,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title : 'Займ через трейд',
     content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I]Займ может быть осуществлен только через зачисление игровых ценностей на банковский счет.[/FONT][/SIZE]<br><br>" +
        "[FONT=times new roman][SIZE=4][I]Просьба не создавать дубликаты этой темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br> <br>" +
        "[FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][I]Отказано.[/I][/FONT][/SIZE][/COLOR]' ,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
         title : 'Донат не обман покупка',
     content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I]Донат ровно как и невнутриигровые вещи не могут быть предметом сделки в игре.[/FONT][/SIZE]<br><br>" +
        "[FONT=times new roman][SIZE=4][I]Просьба не создавать дубликаты этой темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br> <br>" +
        "[FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][I]Отказано.[/I][/FONT][/SIZE][/COLOR]' ,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
          title: '_________________________________Разделы________________________________________',
    },
    {
          title: 'Не тот сервер',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I]Вы ошиблись сервером, перемещаю вашу тему на нужный сервер...[/FONT][/SIZE]<br><br>" +
        "[FONT=times new roman][SIZE=4][I]Просьба не создавать дубликаты данной темы в этом разделе, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
        "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]<br><br>",
      prefix: UNACCEPT_PREFIX,
      status: true,
    },
     {
         title: 'В ЖБ на адм',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I]Вы ошиблись разделом, обратитесь в раздел жалоб на администрацию - [/I][URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.392/']*Нажмите сюда*[/URL][/FONT][/SIZE]<br><br>" +
        "[FONT=times new roman][SIZE=4][I]Просьба не создавать дубликаты данной темы в этом разделе, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
        "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][I]Отказано.[/I][/FONT][/SIZE][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
         title: 'В ЖБ на хелперов',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I]Вы ошиблись разделом, обратитесь в раздел жалобы на агентов поддержки - [/I][URL='https://forum.blackrussia.online/threads/pink-%D0%90%D0%9F-%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B3%D0%B5%D0%BD%D1%82%D0%BE%D0%B2-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.7547286/page-2#post-37482751/']*Нажмите сюда*[/URL][/FONT][/SIZE]<br><br>" +
        "[FONT=times new roman][SIZE=4][I]Просьба не создавать дубликаты данной темы в этом разделе, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
        "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][I]Отказано.[/I][/FONT][/SIZE][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
     {
          title: 'В жб на игроков',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I]Вы ошиблись разделом, обратитесь в раздел жалоб на игроков- [/I][URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.394/']*Нажмите сюда*[/URL][/FONT][/SIZE]<br><br>" +
        "[FONT=times new roman][SIZE=4][I]Просьба не создавать дубликаты данной темы в этом разделе, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
        "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][I]Отказано.[/I][/FONT][/SIZE][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
     {
           title: 'В жб на Лидеров',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I]Вы ошиблись разделом, обратитесь в раздел жалоб на лидеров- [/I][URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.393/']*Нажмите сюда*[/URL][/FONT][/SIZE]<br><br>" +
        "[FONT=times new roman][SIZE=4][I]Просьба не создавать дубликаты данной темы в этом разделе, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
        "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][I]Отказано.[/I][/FONT][/SIZE][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
     {
            title: 'Обжалование',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I]Вы ошиблись разделом, обратитесь в раздел обжалование наказаний- [/I][URL='https://forum.blackrussia.online/forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.395/']*Нажмите сюда*[/URL][/FONT][/SIZE]<br><br>" +
        "[FONT=times new roman][SIZE=4][I]Просьба не создавать дубликаты данной темы в этом разделе, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
        "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][I]Отказано.[/I][/FONT][/SIZE][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
     {
           title: 'В неофиц RP орг',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I]Вы ошиблись разделом, обратитесь в раздел Неофициальные RP организации- [/I][URL='https://forum.blackrussia.online/forums/%D0%9D%D0%B5%D0%BE%D1%84%D0%B8%D1%86%D0%B8%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5-rp-%D0%BE%D1%80%D0%B3%D0%B0%D0%BD%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D0%B8.372/']*Нажмите сюда*[/URL][/FONT][/SIZE]<br><br>" +
        "[FONT=times new roman][SIZE=4][I]Просьба не создавать дубликаты данной темы в этом разделе, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
        "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][I]Отказано.[/I][/FONT][/SIZE][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
     {
           title: 'В РП ситуации',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I]Вы ошиблись разделом, обратитесь в раздел РП ситуации- [/I][URL='https://forum.blackrussia.online/forums/%D0%A0%D0%9F-%D1%81%D0%B8%D1%82%D1%83%D0%B0%D1%86%D0%B8%D0%B8.374/']*Нажмите сюда*[/URL][/FONT][/SIZE]<br><br>" +
        "[FONT=times new roman][SIZE=4][I]Просьба не создавать дубликаты данной темы в этом разделе, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
        "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][I]Отказано.[/I][/FONT][/SIZE][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
     {
           title: 'В РП биографии',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I]Вы ошиблись разделом, обратитесь в раздел РП биографии - [/I][URL='https://forum.blackrussia.online/forums/%D0%A0%D0%9F-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.375/']*Нажмите сюда*[/URL][/FONT][/SIZE]<br><br>" +
        "[FONT=times new roman][SIZE=4][I]Просьба не создавать дубликаты данной темы в этом разделе, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
        "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][I]Отказано.[/I][/FONT][/SIZE][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
     {
      title: 'ЖБ на сотрудников',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Вы обратились не в тот раздел, обратитесь в раздел для жалоб на сотрудников. [/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
           title: 'В тех. раздел',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3xhzxbYX/05l-ZPyaok-2lp5-SAQ-d-QKRYk-ZNGe-N6pl-Pio8-R1-SSSUJT-TWCLq-AHr-V598-Cabu3-LO6nm5td5wg2-M.webp[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I]Вы ошиблись разделом, обратитесь в технический раздел - [/I][URL='https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-pink.396/']*Нажмите сюда*[/URL][/FONT][/SIZE]<br><br>" +
        "[FONT=times new roman][SIZE=4][I]Просьба не создавать дубликаты данной темы в этом разделе, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
        "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][I]Отказано.[/I][/FONT][/SIZE][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
     {
      title: '_________________________________RP биографии________________________________________',
    },
    {
      title: 'Одобрена',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Kvgnr7WN/a6-KBa2-Epw0-1.jpg[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография одобрена.[/COLOR][/I][/FONT][/SIZE]<br><br>" +
        '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      move: 400,
      status: false,
    },
    {
      title: 'Отказана',
      content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Kvgnr7WN/a6-KBa2-Epw0-1.jpg[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана.[/COLOR]<br><br>" +
          "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
        '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
         title: 'Не логично',
      content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Kvgnr7WN/a6-KBa2-Epw0-1.jpg[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана, т.к не соответствует логике реальной жизни.[/COLOR]<br><br>" +
          "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
        '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title : 'Заголовок не по форме',
    content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Kvgnr7WN/a6-KBa2-Epw0-1.jpg[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к заголовок оформлен неправильно. [/COLOR]<br><br>" +
          "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
        '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title : 'Не по форме',
    content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Kvgnr7WN/a6-KBa2-Epw0-1.jpg[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к она составлена не по форме. [/COLOR]<br><br>" +
        "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
        '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title : 'Не дополнил',
    content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Kvgnr7WN/a6-KBa2-Epw0-1.jpg[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к вы ее не дополнили. [/COLOR]<br><br>" +
          "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
        '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title : 'Неграмотная',
     content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Kvgnr7WN/a6-KBa2-Epw0-1.jpg[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к она оформлена неграмотно, в ней присутствуют грамматические либо пунктуационные ошибки [/COLOR]<br><br>" +
        "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
        '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title : 'От 3-его лица',
    content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Kvgnr7WN/a6-KBa2-Epw0-1.jpg[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к она написана от 3-его лица. [/COLOR]<br><br>" +
         "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
        '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title : 'Уже одобрена',
    content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Kvgnr7WN/a6-KBa2-Epw0-1.jpg[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к она уже была одобрена. [/COLOR]<br><br>" +
        '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title : 'Супергерой',
     content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Kvgnr7WN/a6-KBa2-Epw0-1.jpg[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к вы приписали суперспособности своему персонажу. [/COLOR]<br><br>" +
  "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
        '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
     prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title :'Копипаст',
     content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Kvgnr7WN/a6-KBa2-Epw0-1.jpg[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к вы скопировали её у другого игрока. [/COLOR]<br><br>" +
  "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
        '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
     prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title : 'нонрп ник',
     content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Kvgnr7WN/a6-KBa2-Epw0-1.jpg[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к у вас NonRP NickName. [/COLOR]<br><br>" +
         "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
        '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title : 'ник англ',
     content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Kvgnr7WN/a6-KBa2-Epw0-1.jpg[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к ваш NickName должен быть написан на русском языке. [/COLOR]<br><br>" +
       "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
        '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      move: 402,
      status: false,
    },
    {
         title : 'дата рождения с годом',
     content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Kvgnr7WN/a6-KBa2-Epw0-1.jpg[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к дата рождения не совпадает с возрастом. [/COLOR]<br><br>" +
       "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
        '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title : 'Одежда во внешности',
     content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Kvgnr7WN/a6-KBa2-Epw0-1.jpg[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана, т.к в пункте Внешность не может быть логически одежды. [/COLOR]<br><br>" +
        "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
        '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title : 'семья не полностью',
     content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Kvgnr7WN/a6-KBa2-Epw0-1.jpg[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к ваша семья расписана не полностью или не соответствует семейным нормам логике. [/COLOR]<br><br>" +
       "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
        '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title : 'дата рождения не полностью',
     content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Kvgnr7WN/a6-KBa2-Epw0-1.jpg[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к ваша дата рождения и местом рождения расписана не полностью. [/COLOR]<br><br>" +
       "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
        '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title : 'Меньше 18',
     content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Kvgnr7WN/a6-KBa2-Epw0-1.jpg[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к вашему персонажу меньше 18 лет.[/COLOR]<br><br>" +
       "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
        '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'На доработке',
      content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Kvgnr7WN/a6-KBa2-Epw0-1.jpg[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]В вашей RolePlay - биографии недостаточно информации.<br><br>" +
        "Даю вам 24 часа на ее дополнение.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
        '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
      prefix: PIN_PREFIX,
      status: true,
    },
    {
      title: '_________________________________RP организации________________________________________'
    },
    {
      title: 'одобрено',
      content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Kv5ztRNz/a1b-qqq-medium-1280pxx1920x1080.jpg[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша неофициальная RP организация одобрена.[/COLOR][/I][/FONT][/SIZE]<br><br>" +
        '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,

    },
    {
      title : 'не по форме',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Kv5ztRNz/a1b-qqq-medium-1280pxx1920x1080.jpg[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша неофициальная RP организация отказана т.к она составлена не по форме. [/COLOR]<br><br>"+
        '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
     prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title : 'отсутствует средство связи',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Kv5ztRNz/a1b-qqq-medium-1280pxx1920x1080.jpg[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша неофициальная RP организация отказана т.к в ней отсутствуют средства связи с вами. [/COLOR]<br><br>"+
        '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
     prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title : 'отказ',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Kv5ztRNz/a1b-qqq-medium-1280pxx1920x1080.jpg[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша неофициальная RP организация отказана. [/COLOR]<br><br>" +
        '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
     prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
     title: 'На доработке',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Kv5ztRNz/a1b-qqq-medium-1280pxx1920x1080.jpg[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]В вашей неофициальной RP организации недостаточно информации.<br><br>" +
        "Даю вам 24 часа на ее дополнение.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
        '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
      prefix: PIN_PREFIX,
      status: true,
    },
    {
        title : 'ник англ'  ,
     content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Kv5ztRNz/a1b-qqq-medium-1280pxx1920x1080.jpg[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша неофициальная RP организация отказана т.к ваш все никнеймы должны быть написаны на русском языке. [/COLOR]<br><br>" +
       "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - организаций закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
        '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title : 'Неграмотная',
     content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Kv5ztRNz/a1b-qqq-medium-1280pxx1920x1080.jpg[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша неофициальная RP организаций отказана т.к она оформлена неграмотно. [/COLOR]<br><br>" +
        "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - организаций закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
        '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title : 'Копипаст',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Kv5ztRNz/a1b-qqq-medium-1280pxx1920x1080.jpg[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{{ greeting }}, уважаемый {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша неофициальная RP организация отказана т.к вы ее скопировали у другого человека. [/COLOR]<br><br>" +
       "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - организаций закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
        '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
         title : 'Не дополнил',
    content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Kv5ztRNz/a1b-qqq-medium-1280pxx1920x1080.jpg[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша Rнеофициальная RP организация отказана т.к вы ее не дополнили. [/COLOR]<br><br>" +
          "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - организаций закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
        '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
         title : 'Заголовок не по форме',
    content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Kv5ztRNz/a1b-qqq-medium-1280pxx1920x1080.jpg[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша неофициальная RP организация отказана т.к заголовок оформлен неправильно. [/COLOR]<br><br>" +
          "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - организаций закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
        '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
          title : 'Неактивна',
     content:
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Kv5ztRNz/a1b-qqq-medium-1280pxx1920x1080.jpg[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I]Ваша неофициальная RP организация была закрыта по следующему пункту правил:[/FONT][/SIZE]<br><br>" +
        "[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]1.4  [/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4][FONT=book antiqua]Организация должна проявлять активность, если таковой не будет, организация будет закрыта.[/FONT][/SIZE][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][I]Отказано.[/I][/FONT][/SIZE][/COLOR]' ,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: '_________________________________RP ситуации________________________________________'
    },
    {
              title: 'одобрено',
      content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/g2rM36Wq/i-Zs-R65zw-X2.jpg[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация одобрена.[/COLOR][/I][/FONT][/SIZE]<br><br>" +
        '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
  title : 'не по форме',
     content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/g2rM36Wq/i-Zs-R65zw-X2.jpg[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация отказана т.к она составлена не по форме. [/COLOR]<br><br>" +
        '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title : 'отказ',
      content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/g2rM36Wq/i-Zs-R65zw-X2.jpg[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация отказана. [/COLOR]<br><br>" +
        '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
     prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
     title: 'На доработке',
      content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/g2rM36Wq/i-Zs-R65zw-X2.jpg[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]В вашей RolePlay - ситуации недостаточно информации.<br><br>" +
        "Даю вам 24 часа на ее дополнение.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
        '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
      prefix: PIN_PREFIX,
      status: true,
    },
    {
        title : 'ник англ'  ,
     content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/g2rM36Wq/i-Zs-R65zw-X2.jpg[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация отказана т.к ваш все никнеймы должны быть написаны на русском языке. [/COLOR]<br><br>" +
       "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - ситуаций закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
        '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
       title : 'Неграмотная'  ,
     content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/g2rM36Wq/i-Zs-R65zw-X2.jpg[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация отказана т.к она оформлена неграмотно. [/COLOR]<br><br>" +
        "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - ситуаций закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
        '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title : 'Скопированно'  ,
     content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/g2rM36Wq/i-Zs-R65zw-X2.jpg[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация отказана т.к вы ее скопировали полностью или частично у другого человека. [/COLOR]<br><br>" +
       "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - ситуаций закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
        '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
         title : 'Не дополнил'  ,
    content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/g2rM36Wq/i-Zs-R65zw-X2.jpg[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация отказана т.к вы ее не дополнили. [/COLOR]<br><br>" +
          "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - ситуаций закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
        '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
         title : 'Заголовок не по форме'  ,
    content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/g2rM36Wq/i-Zs-R65zw-X2.jpg[/img][/url]<br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация отказана т.к заголовок оформлен неправильно. [/COLOR]<br><br>" +
          "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - ситуаций закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
        '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PINK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    ];
$(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

        // Добавление кнопок при загрузке страницы

    addButton('Закрыто', 'close');
    addButton('На рассмотрение', 'pin');
    addButton('Одобрено', 'accepted');
    addButton('Отказано', 'unaccept');
    addButton('Ответы', 'selectAnswer');



        // Поиск информации о теме
        const threadData = getThreadData();

        $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
        $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
        $(`button#teamProject`).click(() => editThreadData(COMMAND_PREFIX, true));
        $(`button#watched`).click(() => editThreadData(WATCHED_PREFIX, false));
        $(`button#unaccept`).click(() => editThreadData(UNACCEPT_PREFIX, false));
        $(`button#mainAdmin`).click(() => editThreadData(GA_PREFIX, true));

        $(`button#specialAdmin`).click(() => editThreadData(SPECIAL_PREFIX, true));

        $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));

        $(`button#selectAnswer`).click(() => {
            XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
            buttons.forEach((btn, id) => {
                if(id > 1) {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
                } else {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
                }
            });
        });
    });

    function addButton(name, id) {
        $('.button--icon--reply').before(
            `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 30px; margin-right: 7px;">${name}</button>`,
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
            4 < hours && hours <= 11
            ? 'Доброе утро'
            : 11 < hours && hours <= 18
            ? 'Добрый день'
            : 18 < hours && hours <= 21
            ? 'Добрый вечер'
            : 'Доброй ночи',
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
    }

    function getFormData(data) {
        const formData = new FormData();
        Object.entries(data).forEach(i => formData.append(i[0], i[1]));
        return formData;
    }
})();

