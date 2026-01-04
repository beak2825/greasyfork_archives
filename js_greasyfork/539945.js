// ==UserScript==
// @name         KALININGRAD | Скрипт для КФ от Werty
// @namespace    https://forum.blackrussia.online/
// @version      11
// @description  Скрипт для Кураторов форума на ответы на жалобы игроков/RP био/RP ситуация | Black Russia kaliningrad
// @author       Как Всегда Тут Верти
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @icon
// @downloadURL https://update.greasyfork.org/scripts/539945/KALININGRAD%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4%20%D0%BE%D1%82%20Werty.user.js
// @updateURL https://update.greasyfork.org/scripts/539945/KALININGRAD%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4%20%D0%BE%D1%82%20Werty.meta.js
// ==/UserScript==
(function () {
  'use strict';
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
        title: 'Приветствие',
        content:
          '[SIZE=4][COLOR=rgb(0, 255, 127)][I][FONT=times new roman]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/I][/COLOR][/SIZE]',
        },
        {
            title: 'На рассмотрении',
            content:
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
              '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.name }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4]Ваша жалоба взята на рассмотрение, ожидайте ответа в данной теме.[/SIZE][/FONT]<br><br>" +
              "[FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/I][/COLOR][/CENTER]<br><br>" +
              '[url=https://postimages.org/][img]https://i.postimg.cc/zByWk0xc/giphy-3.gif[/img][/url]',
            prefix: PIN_PREFIX,
            status: true,
          },
          {
            title: 'Одобрено',
            content:
              '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][CENTER]{{ greeting }}, уважаемый[/COLOR] [COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/CENTER][/SIZE][/FONT]<br><br>' +
              '[CENTER][B]Нарушитель будет [/B][COLOR=rgb(184, 49, 47)][B]наказан[/B][/COLOR][B] в течении 3-х часов[/B]<br><br>' +
              "[COLOR=rgb(65, 168, 95)][B]Одобрено[/B][/COLOR][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=3]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]<br><br>",
              prefix: ACCEPT_PREFIX,
              status: false,
          },
          {
            title: 'DM',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][CENTER]{{ greeting }}, уважаемый[/COLOR] [COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/CENTER][/SIZE][/FONT]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет [COLOR=rgb(255, 0, 0)][B]наказан[/B][/COLOR] по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][SPOILER][CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.19.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Jail 60 минут[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[LIST]<br>" +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Примечание: [/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[*][LEFT][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]нанесение урона с целью защиты особняка или его территории, а также нанесение урона после ДТП не является веской IC причиной, для войны семей предусмотрено отдельное системное мероприятие.[/SIZE][/FONT][/COLOR][/LEFT]<br>" +
              "[/LIST][/SPOILER][/CENTER]<br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=3]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Читы',
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет [COLOR=rgb(255, 0, 0)][B]наказан[/B][/COLOR] по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              "[CENTER][SPOILER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.22.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] |  Ban 15 - 30 дней / PermBan[/SIZE][/FONT][/COLOR]<br><br>" +
              "[LIST]<br><br>" +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Примечание: [/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Запрещено внесение любых изменений в оригинальные файлы игры.[/SIZE][/COLOR][/FONT][/LEFT]<br><br>" +
              "[*][LEFT][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Исключение: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Разрешено изменение шрифта, его размера и длины чата (кол-во строк).[/SIZE][/FONT][/COLOR][/LEFT]<br><br>" +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Исключение: [/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Блокировка за включенный счетчик FPS не выдается.[/SIZE][/COLOR][/FONT][/LEFT]<br><br>" +
              "[/LIST][/SPOILER][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=3]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
              '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Mass DM',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][CENTER]{{ greeting }}, уважаемый[/COLOR] [COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/CENTER][/SIZE][/FONT]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет [COLOR=rgb(255, 0, 0)][B]наказан[/B][/COLOR] по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][SPOILER][CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.20. [/COLOR][COLOR=rgb(209, 213, 216)]Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более[/COLOR][COLOR=rgb(255, 0, 0)] | Warn / Ban 3 - 7 дней[/SIZE][/FONT][/COLOR][/CENTER][/SPOILER][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=3]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://media.discordapp.net/attachments/1115566790790098944/1115597676717801482/standard_2.gif?width=514&height=66[/img][/url][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Дм от ГОСС',
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил госс организаций:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              "[CENTER][SPOILER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]6.01. [/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4][FONT=book antiqua]Запрещено наносить урон игрокам без  причины на территории госс.[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua] | Ban 7 дней / PermBan [/FONT][/SIZE][/COLOR][/SPOILER][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=3]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
              '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'DB',
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет [COLOR=rgb(255, 0, 0)][B]наказан[/B][/COLOR] по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              "[CENTER][SPOILER][COLOR=rgb(255, 0, 0)][FONT=book antiqua]2.13. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua]| Jail 60 минут[/FONT][/COLOR][/SPOILER][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=3]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
              '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
          }, 
          {
            title: 'ТК',
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет [COLOR=rgb(255, 0, 0)][B]наказан[/B][/COLOR] по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              "[CENTER][SPOILER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]2.15.[/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4][FONT=book antiqua] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua] | Jail 60 минут / Warn (за два и более убийства)[/FONT][/SIZE][/COLOR][/SPOILER][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=3]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
              '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'SК',
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет [COLOR=rgb(255, 0, 0)][B]наказан[/B][/COLOR] по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              "[CENTER][SPOILER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]2.16. [/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4][FONT=book antiqua]Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua] | Jail 60 минут / Warn (за два и более убийства) [/FONT][/SIZE][/COLOR][/SPOILER][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=3]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
              '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'PG',
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет [COLOR=rgb(255, 0, 0)][B]наказан[/B][/COLOR] по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              "[CENTER][SPOILER][SIZE=4][FONT=book antiqua][COLOR=rgb(255, 0, 0)]2.17. [/COLOR][COLOR=rgb(209, 213, 216)]Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь [/COLOR][COLOR=rgb(255, 0, 0)]| Jail 30 минут[/COLOR][/FONT][/SIZE][/SPOILER][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=3]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
              '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {      
            title: '_____________________________________________Наказания в чатах_____________________________________________',
          },
          {
            title: 'MG',
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет [COLOR=rgb(255, 0, 0)][B]наказан[/B][/COLOR] по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              "[CENTER][SPOILER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.18. [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Mute 30 минут[/SIZE][/FONT][/COLOR]<br><br>" +
              '[LIST]<br><br>' +
              "[*][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]использование смайлов в виде символов «))», «=D» запрещено в IC чате.[/SIZE][/FONT][/COLOR]<br><br>" +
              "[*][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Примечание:[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] телефонное общение также является IC чатом.[/SIZE][/FONT][/COLOR]<br><br>" +
              "[/LIST][/SPOILER][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=3]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
              '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'CAPS',
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет [COLOR=rgb(255, 0, 0)][B]наказан[/B][/COLOR] по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              "[CENTER][SPOILER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]3.02. [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Mute 30 минут [/SIZE][/FONT][/COLOR][/SPOILER][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=3]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
              '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Flood',
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет [COLOR=rgb(255, 0, 0)][B]наказан[/B][/COLOR] по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              "[CENTER][SPOILER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]3.05.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Mute 30 минут[/SIZE][/FONT][/COLOR][/SPOILER][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=3]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
              '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Политика',
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет [COLOR=rgb(255, 0, 0)][B]наказан[/B][/COLOR] по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              "[CENTER][SPOILER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]3.18.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещено политическое и религиозное пропагандирование.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Mute 120 минут / Ban 10 дней[/SIZE][/FONT][/COLOR][/SPOILER][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=3]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
              '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Рынок в ГОСС',
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет [COLOR=rgb(255, 0, 0)][B]наказан[/B][/COLOR] по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              "[CENTER][SPOILER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]3.22. [/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4][FONT=book antiqua]Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]| Mute 30 минут[/FONT][/SIZE][/COLOR]<br><br>" +
              '[LIST]<br><br>' +
              "[*][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]Пример: [/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4][FONT=book antiqua]в помещении центральной больницы писать в чат: «Продам эксклюзивную шапку дешево!!!»[/FONT][/SIZE][/COLOR]<br><br>" +
              "[/LIST][/SPOILER][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=3]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
              '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Упом род',
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет [COLOR=rgb(255, 0, 0)][B]наказан[/B][/COLOR] по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              "[CENTER][SPOILER][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]3.04. [/COLOR][COLOR=rgb(209, 213, 216)]Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [/COLOR][COLOR=rgb(255, 0, 0)]| Mute 120 минут / Ban 7 - 15 дней[/COLOR][/SIZE][/FONT]<br><br>" +
              '[LIST]<br><br>' +
              "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR][COLOR=rgb(209, 213, 216)] термин «MQ» расценивается, как упоминание родных.[/COLOR][/SIZE][/FONT]<br><br>" +
              "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]если упоминание родных было совершено в ходе  процесса и не содержало в себе прямого или завуалированного оскорбления.[/COLOR][/SIZE][/FONT]<br><br>" +
              "[/LIST][/SPOILER][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=3]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
              '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'оск род войс',
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет [COLOR=rgb(255, 0, 0)][B]наказан[/B][/COLOR] по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              "[CENTER][SPOILER][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]3.15. [/COLOR][COLOR=rgb(209, 213, 216)] Запрещено оскорблять игроков или родных в Voice Chat [/COLOR][COLOR=rgb(255, 0, 0)]| Mute 120 минут / Ban 7 - 15 дней[/COLOR][/SIZE][/FONT]<br><br>" +
              '[LIST]<br><br>' +
              "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR][COLOR=rgb(209, 213, 216)] термин «MQ» расценивается, как упоминание родных.[/COLOR][/SIZE][/FONT]<br><br>" +
              "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]если упоминание родных было совершено в ходе  процесса и не содержало в себе прямого или завуалированного оскорбления.[/COLOR][/SIZE][/FONT]<br><br>" +
              "[/LIST][/SPOILER][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=3]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
              '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'OOC оск',
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет [COLOR=rgb(255, 0, 0)][B]наказан[/B][/COLOR] по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              "[CENTER][SPOILER][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]3.03. [/COLOR][COLOR=rgb(209, 213, 216)]Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены[/COLOR][COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR] [/SIZE][/FONT][/SPOILER][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=3]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
              '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'IC оск (секс. хар-ра)',
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет [COLOR=rgb(255, 0, 0)][B]наказан[/B][/COLOR] по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              "[CENTER][SPOILER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]3.07.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Mute 30 минут[/SIZE][/FONT][/COLOR]<br><br>" +
              '[LIST]<br><br>' +
              "[*][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]«дырка», «шмара», «ведро», «мадагаскарский присосконог», «свиноногий бандикут», «скорострел» и так далее.[/SIZE][/FONT][/COLOR]<br><br>" +
              "[/LIST][/SPOILER][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=3]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
              '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Аморал',
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет [COLOR=rgb(255, 0, 0)][B]наказан[/B][/COLOR] по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              "[CENTER][SPOILER][SIZE=4][FONT=book antiqua][COLOR=rgb(255, 0, 0)]2.08. [/COLOR][COLOR=rgb(209, 213, 216)]Запрещена любая форма аморальных действий сексуального характера в сторону игроков[/COLOR][COLOR=rgb(255, 0, 0)] | Jail 30 минут / Warn[/COLOR][/FONT][/SIZE]<br><br>" +
              '[LIST]<br><br>' +
              "[*][SIZE=4][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]обоюдное согласие обеих сторон.[/COLOR][/FONT][/SIZE]<br><br>" +
              "[/LIST][/SPOILER][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=3]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
              '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'мат в назв. фам/биз',
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет [COLOR=rgb(255, 0, 0)][B]наказан[/B][/COLOR] по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              "[CENTER][SPOILER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]2.53.[/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4][FONT=book antiqua] Запрещено устанавливать названия для внутриигровых ценностей с использованием нецензурной лексики, оскорблений, слов политической или религиозной наклонности.[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua] | Ban 1 день / При повторном нарушении обнуление бизнеса[/FONT][/SIZE][/COLOR][/SPOILER][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=3]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
              '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'не на русском в чате',
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет [COLOR=rgb(255, 0, 0)][B]наказан[/B][/COLOR] по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              "[CENTER][SPOILER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]3.01.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Общепризнанный язык сервера — русский. Общение в IC чатах во всех  ситуациях обязательно должно проходить исключительно на русском языке[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]| Устное замечание / Mute 30 минут [/SIZE][/FONT][/COLOR][/SPOILER][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=3]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
              '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'неув к адм',
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет [COLOR=rgb(255, 0, 0)][B]наказан[/B][/COLOR] по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              "[CENTER][SPOILER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.54.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]|  Mute 180 минут [/SIZE][/FONT][/COLOR][/SPOILER][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=3]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
              '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Выдача за адм',
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет [COLOR=rgb(255, 0, 0)][B]наказан[/B][/COLOR] по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              "[CENTER][SPOILER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]3.10.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещена выдача себя за администратора, если таковым не являетесь [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]| Ban 7 - 15 + ЧС администрации[/SIZE][/FONT][/COLOR][/SPOILER][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=3]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
              '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Оск/обман адм',
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет [COLOR=rgb(255, 0, 0)][B]наказан[/B][/COLOR] по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              "[CENTER][SPOILER][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]2.32. [/COLOR][COLOR=rgb(209, 213, 216)]Запрещено введение в заблуждение, обман, оскорбление, неконструктивная критика администрации на всех ресурсах проекта [/COLOR][COLOR=rgb(255, 0, 0)]| Ban 7 - 30 дней / PermBan[/COLOR][/SIZE][/FONT]<br><br>" +
              '[LIST]<br><br>' +
              "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]подделка доказательств, искажение информации в свою пользу, оскорбление администрации в репорт, обвинение администраторов без доказательств и т.д.[/COLOR][/SIZE][/FONT]<br><br>" +
              "[/LIST][/SPOILER][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=3]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
              '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Введение в заблуждения',
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет [COLOR=rgb(255, 0, 0)][B]наказан[/B][/COLOR] по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              "[CENTER][SPOILER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.32.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]|  Ban 7 - 15 дней[/SIZE][/FONT][/COLOR][/SPOILER][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=3]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
              '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
            rgbEffect: true,
          },
          {
            title: 'ooc угрозы',
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет [COLOR=rgb(255, 0, 0)][B]наказан[/B][/COLOR] по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              "[CENTER][SPOILER][SIZE=4][FONT=book antiqua][COLOR=rgb(255, 0, 0)]2.37.[/COLOR][COLOR=rgb(209, 213, 216)]  Запрещены OOC угрозы, в том числе и завуалированные [/COLOR][COLOR=rgb(255, 0, 0)]| Mute 120 минут / Ban 7 дней [/COLOR][/FONT][/SIZE][/SPOILER][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=3]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
              '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'польз уязв правил',
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет [COLOR=rgb(255, 0, 0)][B]наказан[/B][/COLOR] по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              "[CENTER][SPOILER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.33.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено пользоваться уязвимостью правил [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]|  Ban 15 дней [/SIZE][/FONT][/COLOR][/SPOILER][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=3]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
              '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url][/CENTER][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'конфликты ooc и ic',
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет [COLOR=rgb(255, 0, 0)][B]наказан[/B][/COLOR] по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              "[CENTER][SPOILER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.35.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]| Mute 120 минут / Ban 7 дней [/SIZE][/FONT][/COLOR][/SPOILER][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=3]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
              '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'переносить конфликты',
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет [COLOR=rgb(255, 0, 0)][B]наказан[/B][/COLOR] по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              "[CENTER][SPOILER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.36.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено переносить конфликты из IC в OOC и наоборот[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]| Warn [/SIZE][/FONT][/COLOR][/SPOILER][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=3]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
              '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'злоуп нарушениями',
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет [COLOR=rgb(255, 0, 0)][B]наказан[/B][/COLOR] по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              "[CENTER][SPOILER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.39.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Злоупотребление нарушениями правил сервера[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]| Ban 7 - 30 дней [/SIZE][/FONT][/COLOR][/SPOILER][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=3]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
              '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'злоуп символами',
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет [COLOR=rgb(255, 0, 0)][B]наказан[/B][/COLOR] по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              "[CENTER][SPOILER][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]3.06.[/COLOR][COLOR=rgb(209, 213, 216)]Запрещено злоупотребление знаков препинания и прочих символов[/COLOR][COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR][/SIZE][/FONT]<br><br>" +
              '[LIST]<br><br>' +
              "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)] «???????», «!!!!!!!», «Дааааааааааааааааааааааа» и так далее.[/COLOR][/SIZE][/FONT]<br><br>" +
              "[/LIST][/SPOILER][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=3]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
              '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {      
            title: '_____________________________________________Наказания за рекламу_____________________________________________',
          },
          {
            title: 'реклама войс',
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет [COLOR=rgb(255, 0, 0)][B]наказан[/B][/COLOR] по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              "[CENTER][SPOILER][SIZE=4][FONT=book antiqua][COLOR=rgb(255, 0, 0)]3.09.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещена реклама в Voice Chat не связанная с игровым процессом  [/COLOR][COLOR=rgb(255, 0, 0)]| Ban 7 - 15 дней[/COLOR][/FONT][/SIZE][/SPOILER][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=3]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
              '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Реклама промо',
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет [COLOR=rgb(255, 0, 0)][B]наказан[/B][/COLOR] по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              "[CENTER][SPOILER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]3.21.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]| Ban 30 дней[/SIZE][/FONT][/COLOR]<br><br>" +
              '[LIST]<br><br>' +
              "[*][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]чаты семейные, строительных компаний, транспортных компаний, фракционные чаты, IC, OOC, VIP и так далее.[/SIZE][/FONT][/COLOR]<br><br>" +
              "[*][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Исключение: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]промокоды, предоставленные разработчиками, а также распространяемые через официальные ресурсы проекта.[/SIZE][/FONT][/COLOR]<br><br>" +
              "[*][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Пример: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]если игрок упомянет промокод, распространяемый через официальную публичную страницу ВКонтакте либо через официальный Discord в любом из чатов, наказание ему не выдается.[/SIZE][/FONT][/COLOR]<br><br>" +
              "[/LIST][/SPOILER][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=3]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
              '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Системный промо',
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
             "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]Данный промокод является системным, или был выпущен  разработчиками[/I][/SIZE][/FONT]<br><br>" +
             "[I][FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/I][/COLOR]<br><br>" +
             "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=3]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
             '[url=https://postimages.org/][img]https://s4.hostingkartinok.com/uploads/images/2013/05/1a612be953e1187f103dc4ae3f1d2b32.gif[/img][/url]',
            prefix: UNACCEPT_PREFIX,
            status: false
          },
          {
            title: 'Реклама',
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет [COLOR=rgb(255, 0, 0)][B]наказан[/B][/COLOR] по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              "[CENTER][SPOILER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]2.31. [/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4][FONT=book antiqua]Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua] | Ban 7 дней / PermBan [/FONT][/SIZE][/COLOR][/SPOILER][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=3]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
              '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: '_____________________________________________Наказание за NonRp_____________________________________________'
          },
          {
            title: 'NRP обман',
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет [COLOR=rgb(255, 0, 0)][B]наказан[/B][/COLOR] по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              "[CENTER][SPOILER][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]2.05.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением  правил и логики[/COLOR][COLOR=rgb(255, 0, 0)] | PermBan[/COLOR][/SIZE][/FONT]<br><br>" +
              '[LIST]<br><br>' +
              "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]после IC договоренности получить денежные средства и сразу же выйти из игры с целью обмана игрока, или же, договорившись через OOC чат (/n), точно также получить денежные средства и сразу же выйти из игры и тому подобные ситуации.[/COLOR][/SIZE][/FONT]<br><br>" +
              "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]разблокировка игрового аккаунта нарушителя будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого имущества, которое было украдено (по решению обманутой стороны).[/COLOR][/SIZE][/FONT]<br><br>" +
              "[/LIST][/SPOILER][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=3]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
              '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
           },
           {
            title: 'NonRp ограб/похищение',
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет наказан по общим правилам ограблений и похищений.[/SIZE][/FONT][/COLOR]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=3]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
              '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'NonRp Cop',
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту правил государственных структур:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              "[CENTER][SPOILER][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]6.03. [/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Запрещено оказывать задержание без  отыгровки[/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4] | Warn[/SIZE][/COLOR][/FONT][/SPOILER][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=3]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
              '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'NonRp Обыск',
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту правил государственных структур:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              "[CENTER][SPOILER][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]8.06. [/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Запрещено проводить обыск игрока без  отыгровки.[/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4] | Warn[/SIZE][/COLOR][/FONT][/SPOILER][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=3]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
              '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'NonRp Розыск',
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту правил государственных структур:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              "[CENTER][SPOILER][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]6.02. [/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Запрещено выдавать розыск без  причины.[/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4] | Warn[/SIZE][/COLOR][/FONT][/SPOILER][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=3]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
              '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },  
          {
            title: 'NonRp В/Ч',
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту правил нападения на военную часть:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              "[CENTER][SPOILER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2. [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]За нарушение правил нападения на Военную Часть выдаётся предупреждение [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]| Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ)[/SIZE][/FONT][/COLOR][/SPOILER][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=3]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
              '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Н/П/Р/О',
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет [COLOR=rgb(255, 0, 0)][B]наказан[/B][/COLOR] по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              "[CENTER][SPOILER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]3.08. [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено писать по своему, не по правилам редактирования.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]| Mute 30 Минут[/SIZE][/FONT][/COLOR][/SPOILER][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=3]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
              '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'NRP поведение',
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет [COLOR=rgb(255, 0, 0)][B]наказан[/B][/COLOR] по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              "[CENTER][SPOILER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]2.01. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]Запрещено поведение, нарушающее нормы процессов  режима игры[/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua] | Jail 30 минут[/FONT][/COLOR][/SIZE]<br><br>" +
              '[LIST]<br><br>' +
              "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]ездить на крышах транспортных средств, бегать или ходить по столам в казино, целенаправленная провокация сотрудников правоохранительных органов с целью развлечения, целенаправленная помеха в проведении различных собеседований и так далее.[/FONT][/COLOR][/SIZE]<br><br>" +
              "[/LIST][/SPOILER][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=3]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
              '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'NRP АКС',
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет [COLOR=rgb(255, 0, 0)][B]наказан[/B][/COLOR] по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              "[CENTER][SPOILER][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]2.52.[/COLOR][COLOR=rgb(209, 213, 216)]Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера.[/COLOR][COLOR=rgb(255, 0, 0)] | При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут[/COLOR][/SIZE][/FONT]<br><br>" +
              '[LIST]<br><br>' +
              "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)] слишком большие аксессуары на голове персонажа, имитация гитарой половых органов и тому подобное.[/COLOR][/SIZE][/FONT]<br><br>" +
              "[/LIST][/SPOILER][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=3]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
              '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
           },
           {
            title: 'GM',
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
             "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I]На данный момент существует некая техническая проблема, по которой у игрока может не отниматься здоровье.<br>Приносим свои извинения за неудобство[/I][/FONT][/SIZE]<br><br>" + 
             "[FONT=times new roman][SIZE=4][I]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
             "[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][I]Закрыто.[/I][/FONT][/SIZE][/COLOR]<br><br>" +
             '[FONT=book antiqua][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT]',
            prefix: UNACCEPT_PREFIX,
            status: false,
           },
           {      
            title: '_____________________________________________Перенаправление_____________________________________________',
           },       
           {
            title: 'Техническому специалисту',
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
             "[COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4]Ваша жалоба переадресована [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 102, 0)][I][FONT=times new roman][SIZE=4]Техническому Специалисту[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4], ожидайте ответа в данной теме.[/SIZE][/FONT]<br><br>" +
             "[FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/I][/COLOR]<br><br>" +
             '[FONT=book antiqua][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT]',
            prefix: TEX_PREFIX,
            status: true,
           },
           {
            title: 'Передаю ГА',
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
             "[COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4]Ваша жалоба переадресована [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Главному администратору[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4], ожидайте ответа в данной теме.[/SIZE][/FONT]<br><br>" +
             "[FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/I][/COLOR]<br><br>" +
             '[url=https://postimages.org/][img]https://i.servimg.com/u/f52/20/33/14/69/12.gif[/img][/url]',
            prefix: TEX_PREFIX,
            status: true,
           },
           {
            title: 'В ЖБ на адм',
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
              "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I]Вы ошиблись разделом, обратитесь в раздел жалоб на администрацию - [/I][URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.2036/']*Нажмите сюда*[/URL][/FONT][/SIZE]<br><br>" +
              "[FONT=times new roman][SIZE=4][I]Просьба не создавать дубликаты данной темы в этом разделе, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=3]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
              '[url=https://postimages.org/][img]https://sun9-13.userapi.com/c627229/v627229095/1dbf2/niBXXem02v4.jpg[/img][/url]',
             prefix: UNACCEPT_PREFIX,
             status: false,
            },
           {
            title: 'В ЖБ на Лидеров',
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
             "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I]Вы ошиблись разделом, обратитесь в раздел жалоб на лидеров - [/I][URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.2037/']*Нажмите сюда*[/URL][/FONT][/SIZE]<br><br>" +
             "[FONT=times new roman][SIZE=4][I]Просьба не создавать дубликаты данной темы в этом разделе, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
             "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=3]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
             '[url=https://postimages.org/][img]https://sun9-13.userapi.com/c627229/v627229095/1dbf2/niBXXem02v4.jpg[/img][/url]',
            prefix: UNACCEPT_PREFIX,
            status: false, 
           },
           {
            title: 'В ЖБ на Хелперов',
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
              "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I]Вы ошиблись разделом, обратитесь в раздел жалоб на Агентов поддержки - [/I][URL='https://forum.blackrussia.online/threads/kaliningrad-%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B3%D0%B5%D0%BD%D1%82%D0%BE%D0%B2-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.12629374/']*Нажмите сюда*[/URL][/FONT][/SIZE]<br><br>" +
              "[FONT=times new roman][SIZE=4][I]Просьба не создавать дубликаты данной темы в этом разделе, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=3]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
              '[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][I]Отказано.[/I][/FONT][/SIZE][/COLOR]',
             prefix: UNACCEPT_PREFIX,
             status: false,
            },   
           {      
            title: 'В ЖБ на сотрудников',
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
             "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I]Обратитесь в раздел на сотрудников фракции. [/FONT][/SIZE]<br><br>" +
             "[FONT=times new roman][SIZE=4][I]Просьба не создавать дубликаты данной темы в этом разделе, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
             "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=3]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
             '[url=https://postimages.org/][img]https://i.yapx.cc/OBTvg.jpg[/img][/url]',
           prefix: UNACCEPT_PREFIX,
           status: false,      
           },
           {      
            title: 'В обжалование наказаний',
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
             "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I]Вы ошиблись разделом, обратитесь в раздел Обжалование наказаний - [/I][URL='https://forum.blackrussia.online/forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.2039/']*Нажмите сюда*[/URL][/FONT][/SIZE]<br><br>" +
             "[FONT=times new roman][SIZE=4][I]Просьба не создавать дубликаты данной темы в этом разделе, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
             "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=3]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
             '[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][I]Отказано.[/I][/FONT][/SIZE][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,      
           },
           {      
            title: '_____________________________________________Доказательства_____________________________________________',
           },
           {
            title: 'Недостаточно док-в',
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
             "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]Недостаточно доказательств для корректного рассмотрения вашей жалобы.[/I][/SIZE][/FONT]<br><br>" +
             "[I][FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/I][/COLOR]<br><br>" +
             "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=3]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
             '[url=https://postimages.org/][img]https://s4.hostingkartinok.com/uploads/images/2013/05/1a612be953e1187f103dc4ae3f1d2b32.gif[/img][/url]',
            prefix: UNACCEPT_PREFIX,
            status: false
           },
           {   
            title: 'Отсутствуют док-ва',
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
             "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I]Отсутствуют доказательства - следовательно, рассмотрению не подлежит. Загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx и так далее.[/I][/FONT][/SIZE]<br><br>" +
             "[I][FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/I][/COLOR]<br><br>" +
             "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=3]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
             '[url=https://postimages.org/][img]https://s4.hostingkartinok.com/uploads/images/2013/05/1a612be953e1187f103dc4ae3f1d2b32.gif[/img][/url]',
            prefix: UNACCEPT_PREFIX,
            status: false,
           },   
           {
            title: 'Не работает док-во',
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
             "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]]Ваши доказательства не рабочие или же битая ссылка.[/I][/SIZE][/FONT]<br><br>" +
             "[I][FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/I][/COLOR]<br><br>" +
             "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=3]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
             '[url=https://postimages.org/][img]https://s4.hostingkartinok.com/uploads/images/2013/05/1a612be953e1187f103dc4ae3f1d2b32.gif[/img][/url]',
            prefix: UNACCEPT_PREFIX,
            status: false
           }, 
           {
            title: 'Док-ва отредакт',
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
             "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]Доказательства были подвергнуты редактированию - следовательно, рассмотрению не подлежит.<br><br>" +
             "Загрузите оригиналы видеозаписи/скриншотов, создав новую тему в данном разделе.<br><br>" +
             "Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
             "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=3]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
             '[url=https://postimages.org/][img]https://s4.hostingkartinok.com/uploads/images/2013/05/1a612be953e1187f103dc4ae3f1d2b32.gif[/img][/url]',
            prefix: UNACCEPT_PREFIX,
            status: false,
           }, 
           {
            title: 'Док-ва обрываются',
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
            "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]Ваша видеозапись обрывается. Загрузите полную видеозапись на видео-хостинг YouTube.<br><br>" +
            "Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=3]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
            '[url=https://postimages.org/][img]https://s4.hostingkartinok.com/uploads/images/2013/05/1a612be953e1187f103dc4ae3f1d2b32.gif[/img][/url]',
            prefix: UNACCEPT_PREFIX,
            status: false,
           }, 
           {
            title: 'Док-ва в соц. сетях',
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
             "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I]Доказательства в социальных сетях и т.д. не принимаются. Загрузите доказательства на фото-видео хостинги YouTube,Imgur, Yapx и так далее.[/I][/FONT][/SIZE]<br><br>" +
             "[FONT=times new roman][SIZE=4][I]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
             "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=3]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
             '[url=https://postimages.org/][img]https://s4.hostingkartinok.com/uploads/images/2013/05/1a612be953e1187f103dc4ae3f1d2b32.gif[/img][/url]',
            prefix: UNACCEPT_PREFIX,
            status: false,
           },
           {
            title: 'Нужен Фрапс',
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
             "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]В данной ситуации обязательнодолжен быть фрапс(видео фиксация)всех моментов.[/I][/SIZE][/FONT]<br><br>" +
             "[I][FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/I][/COLOR]<br><br>" +
             "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=3]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
             '[url=https://postimages.org/][img]https://s4.hostingkartinok.com/uploads/images/2013/05/1a612be953e1187f103dc4ae3f1d2b32.gif[/img][/url]',
            prefix: UNACCEPT_PREFIX,
            status: false
           },
           {
            title: 'Неполный Фрапс',
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
             "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]Видео фиксация не полная либо же нет условий сделки.[/I][/SIZE][/FONT]<br><br>" +
             "[I][FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/I][/COLOR]<br><br>" +
             "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=3]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
             '[url=https://postimages.org/][img]https://s4.hostingkartinok.com/uploads/images/2013/05/1a612be953e1187f103dc4ae3f1d2b32.gif[/img][/url]',
            prefix: UNACCEPT_PREFIX,
            status: false
           },
           {
            title: 'Нет time',
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
             "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]На доказательствах отсутствуют дата и время [/I]([/SIZE][/FONT][FONT=courier new][SIZE=4]/time[/SIZE][/FONT][FONT=times new roman][SIZE=4])[I] - следовательно, рассмотрению не подлежит.<br><br>" +
             "Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
             "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=3]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
             '[url=https://postimages.org/][img]https://s4.hostingkartinok.com/uploads/images/2013/05/1a612be953e1187f103dc4ae3f1d2b32.gif[/img][/url]',
            prefix: UNACCEPT_PREFIX,
            status: false,
           },
           {
            title : 'Нет таймкодов'  ,
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
             "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I]Ваша жалоба отказана, т.к в ней нету таймкодов. Если видео длится больше 3-ех минут - Вы должны указать таймкоды нарушений.[/FONT][/SIZE]<br><br>" + 
             "[FONT=times new roman][SIZE=4][I]Просьба не создавать дубликаты этой темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br> <br>" + 
             "[FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE]" +
             '[url=https://postimages.org/][img]https://s4.hostingkartinok.com/uploads/images/2013/05/1a612be953e1187f103dc4ae3f1d2b32.gif[/img][/url]',
             prefix: UNACCEPT_PREFIX,
             status: false,
           },
           {
            title: 'Нет условий сделки',
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
             "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]В предоставленных доказательствах отсутствуют условия сделки.[/I][/SIZE][/FONT]<br><br>" +
             "[I][FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/I][/COLOR]<br><br>" +
             "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=3]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
             '[url=https://postimages.org/][img]https://s4.hostingkartinok.com/uploads/images/2013/05/1a612be953e1187f103dc4ae3f1d2b32.gif[/img][/url]',
            prefix: UNACCEPT_PREFIX,
            status: false
           },
           {
            title: 'Нарушений нет',
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
            "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]Нарушений со стороны игрока не было замечено на вашем доказательство.<br><br>" +
            "Внимательно изучите общие правила серверов - [/I][URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']*Нажмите сюда*[/URL]<br><br>" +
            "[I]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=3]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
            '[url=https://postimages.org/][img]https://s4.hostingkartinok.com/uploads/images/2013/05/1a612be953e1187f103dc4ae3f1d2b32.gif[/img][/url]',
            prefix: UNACCEPT_PREFIX,
            status: false,
           },
           {      
            title: '__________________________________________________________Прочее_____________________________________________',
           },
           {
            title: 'Уход от RP',
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
            "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет [COLOR=rgb(255, 0, 0)][B]наказан[/B][/COLOR] по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
            "[CENTER][SPOILER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]2.02. [/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4][FONT=book antiqua]Запрещено целенаправленно уходить от  процесса всеразличными способами [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]| Jail 30 минут / Warn[/FONT][/SIZE][/COLOR]<br><br>" +
            '[LIST]<br><br>' +
            "[*][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]Примечание: [/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4][FONT=book antiqua]например, уходить в AFK при остановке транспортного средства правоохранительными органами, выходить из игры для избежания смерти, выходить из игры во время процесса задержания / ареста, полное игнорирование отыгровок другого игрока, которые так или иначе могут коснуться Вашего персонажа и так далее.[/FONT][/SIZE][/COLOR]<br><br>" +
            "[/LIST][/SPOILER][/CENTER]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=3]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
            '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
           },
           {
            title: 'Bagouse',
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
            "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет [COLOR=rgb(255, 0, 0)][B]наказан[/B][/COLOR] по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
            "[CENTER][SPOILER][SIZE=4][FONT=book antiqua][COLOR=rgb(255, 0, 0)]2.21.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено пытаться обходить игровую систему или использовать любые баги сервера[/COLOR][COLOR=rgb(255, 0, 0)] | Ban 15 - 30 дней / PermBan[/COLOR][/FONT][/SIZE][/SPOILER][/CENTER]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=3]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
            '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
           },
           {
            title: 'Bagouse Anim',
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
            "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет [COLOR=rgb(255, 0, 0)][B]наказан[/B][/COLOR] по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
            "[CENTER][SPOILER][SIZE=4][FONT=book antiqua][COLOR=rgb(255, 0, 0)]2.55. [/COLOR][COLOR=rgb(209, 213, 216)]Запрещается багоюз связанный с анимацией в любых проявлениях. [/COLOR][COLOR=rgb(255, 0, 0)]| Jail 60 / 120 минут[/COLOR][/FONT][/SIZE]<br><br>" +
            '[LIST]<br><br>' +
            "[*][SIZE=4][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]если игрок, используя баг, убирает ограничение на использование оружия в зеленой зоне, сбивает темп стрельбы, либо быстро перемещается во время войны за бизнес или во время перестрелки на мероприятии с семейными контейнерами, последует наказание в виде Jail на 120 минут. Данное наказание используется в случаях, когда, используя ошибку, было получено преимущество перед другими игроками.[/COLOR][/FONT][/SIZE]<br><br>" +
            "[*][SIZE=4][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]если игрок использует баги, связанные с анимацией, и при этом не влияет на игровой процесс других игроков, а также не получает преимущество перед другими игроками, последует наказание в виде Jail на 60 минут.[/COLOR][/FONT][/SIZE]<br><br>" +
            "[/LIST][/SPOILER][/CENTER]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=3]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
            '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
           },
           {
            title : 'Заголовок неправильный'  ,
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
             "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I]Ваш заголовок составлен не по форме. Внимательно прочтите правила создания темы, прикрепленные в этом разделе.[/FONT][/SIZE]<br><br>" + 
             "[FONT=times new roman][SIZE=4][I]Просьба не создавать дубликаты этой темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br> <br>" + 
             "[FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE]" +
             '[url=https://postimages.org/][img]https://s4.hostingkartinok.com/uploads/images/2013/05/1a612be953e1187f103dc4ae3f1d2b32.gif[/img][/url]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'ФЕЙК',
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
             "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]Игрок будет наказан по пунтку правил: 4.10. Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию | Устное замечание + смена игрового никнейма / PermBan[/I][/SIZE][/FONT]<br><br>" +
             "[I][FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/I][/COLOR]<br><br>" +
             "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=3]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
             '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false
          },
          {
            title : '2 и более игрока'  ,
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
             "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I]Ваша жалоба отказана по причине: нельзя писать одну жалобу на двух и белее игроков ( на каждого игрока отдельная жалоба)[/FONT][/SIZE]<br><br>" + 
             "[FONT=times new roman][SIZE=4][I]Просьба не создавать дубликаты этой темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br> <br>" + 
             "[FONT=book antiqua][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT]" +
             '[url=https://postimages.org/][img]https://s4.hostingkartinok.com/uploads/images/2013/05/1a612be953e1187f103dc4ae3f1d2b32.gif[/img][/url]',
            prefix: UNACCEPT_PREFIX,
            status: false, 
          },
          {
            title: 'Не по форме',
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
             "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I]Ваша жалоба составлена не по форме. Внимательно прочитайте правила подачи жалоб на игроков, закрепленные в этом разделе.[/I][/FONT][/SIZE]<br><br>" +
             "[FONT=times new roman][SIZE=4][I]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
             "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=3]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
             '[url=https://postimages.org/][img]https://s4.hostingkartinok.com/uploads/images/2013/05/1a612be953e1187f103dc4ae3f1d2b32.gif[/img][/url]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title : 'уже был наказан'  ,
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
             "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I]Ваша жалоба отказана, т.к нарушитель уже был наказан ранее.[/FONT][/SIZE]<br><br>" + 
             "[FONT=times new roman][SIZE=4][I]Просьба не создавать дубликаты этой темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br> <br>" + 
             "[FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE]" +
             '[url=https://postimages.org/][img]https://s4.hostingkartinok.com/uploads/images/2013/05/1a612be953e1187f103dc4ae3f1d2b32.gif[/img][/url]',
            prefix: UNACCEPT_PREFIX,
            status: false, 
          },
          {
            title : 'уже был ответ'  ,
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
             "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I]Ваша жалоба отказана, т.к ранее уже был дан ответ.[/FONT][/SIZE]<br><br>" + 
             "[FONT=times new roman][SIZE=4][I]Просьба не создавать дубликаты этой темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br> <br>" + 
             "[FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE]" +
             '[url=https://postimages.org/][img]https://s4.hostingkartinok.com/uploads/images/2013/05/1a612be953e1187f103dc4ae3f1d2b32.gif[/img][/url]',
            status: false, 
          },
          {
            title : 'прошло 3 дня'  ,
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
             "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I]Ваша жалоба отказана, т.к с момента нарушения прошло более 72-ух часов.[/FONT][/SIZE]<br><br>" + 
             "[FONT=times new roman][SIZE=4][I]Просьба не создавать дубликаты этой темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br> <br>" + 
             "[FONT=book antiqua][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT]" +
             '[url=https://postimages.org/][img]https://s4.hostingkartinok.com/uploads/images/2013/05/1a612be953e1187f103dc4ae3f1d2b32.gif[/img][/url]',
            prefix: UNACCEPT_PREFIX,
            status: false, 
          },
          {
            title : 'от 3-его лица'  ,
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
             "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I]Ваша жалоба отказана, т.к она написана от 3-его лица.[/FONT][/SIZE]<br><br>" + 
             "[FONT=times new roman][SIZE=4][I]Просьба не создавать дубликаты этой темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br> <br>" + 
             "[FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE]" +
             '[url=https://postimages.org/][img]https://s4.hostingkartinok.com/uploads/images/2013/05/1a612be953e1187f103dc4ae3f1d2b32.gif[/img][/url]',
            prefix: UNACCEPT_PREFIX,
            status: false, 
          },
          {
            title: 'Слив ГЧ',
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
            "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет [COLOR=rgb(255, 0, 0)][B]наказан[/B][/COLOR] по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
            "[CENTER][SPOILER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]3.08. [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещены любые формы «слива» посредством использования глобальных чатов [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]| PermBan[/SIZE][/FONT][/COLOR][/SPOILER][/CENTER]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=3]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
            '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Слив склада',
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
            "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет [COLOR=rgb(255, 0, 0)][B]наказан[/B][/COLOR] по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
            "[CENTER][SPOILER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]2.09.[/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4][FONT=book antiqua] Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua] | Ban 15 - 30 дней / PermBan[/FONT][/SIZE][/COLOR]<br><br>"+
            "[/LIST][/SPOILER][/CENTER]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=3]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
            '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
           title : 'Заголовок неправильный'  ,
           content:
           '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
            "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I]Ваш заголовок составлен не по форме. Внимательно прочтите правила создания темы, прикрепленные в этом разделе.[/FONT][/SIZE]<br><br>" + 
            "[FONT=times new roman][SIZE=4][I]Просьба не создавать дубликаты этой темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br> <br>" + 
            "[FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE]" +
            '[url=https://postimages.org/][img]https://s4.hostingkartinok.com/uploads/images/2013/05/1a612be953e1187f103dc4ae3f1d2b32.gif[/img][/url]',
           prefix: UNACCEPT_PREFIX,
           status: false,
          },
          {      
           title: '_____________________________________________RolePlay биографии_____________________________________________',
          },
          {
           title: 'Одобрена',
           content:
           '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография получил вердикт:[/COLOR] [COLOR=rgb(0, 255, 0)]Одобрено[/COLOR][COLOR=rgb(209, 213, 216)].[/COLOR][/I][/FONT][/SIZE]<br><br>" +
            "[FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE]" +
            '[url=https://postimages.org/][img]https://img-host.ru/BQB3y.png[/img][/url]',
           prefix: ACCEPT_PREFIX,
           status: false,
          },
          {
           title: 'Отказана',
           content:
           '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография получил вердикт:[/COLOR] [COLOR=rgb(255, 0, 0)]Отказано[/COLOR][COLOR=rgb(209, 213, 216)].[/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            "[FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE]" +
            '[url=https://postimages.org/][img]https://img-host.ru/BQB3y.png[/img][/url]',
           prefix: UNACCEPT_PREFIX,
           status: false,
          },
          {
            title: 'Дополните информацию',
            content:
            '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
             "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография получил вердикт:[/COLOR] [COLOR=rgb(255, 0, 0)]Отказано[/COLOR][COLOR=rgb(209, 213, 216)], Добавьте больше информации в новой RolePlay биографии.[/COLOR]<br><br>" +
             "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
             "[FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE]" +
             '[url=https://postimages.org/][img]https://img-host.ru/BQB3y.png[/img][/url]',
            prefix: UNACCEPT_PREFIX,
            status: false,
           },
          {
           title : 'Заголовок не по форме'  ,
           content:
           '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография получил вердикт:[/COLOR] [COLOR=rgb(255, 0, 0)]Отказано[/COLOR][COLOR=rgb(209, 213, 216)] т.к заголовок оформлен неправильно. [/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            "[FONT=book antiqua][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT]" +
            '[url=https://postimages.org/][img]https://img-host.ru/BQB3y.png[/img][/url]',
           prefix: UNACCEPT_PREFIX,
           status: false, 
          },
          {
           title : 'Не по форме'  ,
           content:
           '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография получил вердикт:[/COLOR] [COLOR=rgb(255, 0, 0)]Отказано[/COLOR][COLOR=rgb(209, 213, 216)] т.к она составлена не по форме. [/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            "[FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE]" +
            '[url=https://postimages.org/][img]https://img-host.ru/BQB3y.png[/img][/url]',
           prefix: UNACCEPT_PREFIX,
           status: false, 
          },
          {
           title : 'Не дополнил'  ,
           content:
           '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография получил вердикт:[/COLOR] [COLOR=rgb(255, 0, 0)]Отказано[/COLOR][COLOR=rgb(209, 213, 216)] т.к вы ее не дополнили. [/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            "[FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE]" +
            '[url=https://postimages.org/][img]https://img-host.ru/BQB3y.png[/img][/url]',
           prefix: UNACCEPT_PREFIX,
           status: false,
          },
          {
           title : 'Неграмотная'  ,
           content:
           '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография получил вердикт:[/COLOR] [COLOR=rgb(255, 0, 0)]Отказано[/COLOR][COLOR=rgb(209, 213, 216)] т.к она оформлена неграмотно. [/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            "[FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE]" +
            '[url=https://postimages.org/][img]https://img-host.ru/BQB3y.png[/img][/url]',
           prefix: UNACCEPT_PREFIX,
           status: false,
          },
          {
           title : 'От 3-его лица'  ,
           content:
           '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография получил вердикт:[/COLOR] [COLOR=rgb(255, 0, 0)]Отказано[/COLOR][COLOR=rgb(209, 213, 216)] т.к она написана от 3-его лица. [/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            "[FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE]" +
            '[url=https://postimages.org/][img]https://img-host.ru/BQB3y.png[/img][/url]',
           prefix: UNACCEPT_PREFIX,
           status: false,
          },
          {
           title : 'Уже одобрена'  ,
           content:
           '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография получил вердикт:[/COLOR] [COLOR=rgb(255, 0, 0)]Отказано[/COLOR][COLOR=rgb(209, 213, 216)] т.к она уже была одобрена. [/COLOR]<br><br>" +
            "[FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE]" +
            '[url=https://postimages.org/][img]https://img-host.ru/BQB3y.png[/img][/url]',
           prefix: UNACCEPT_PREFIX,
           status: false, 
          },
          {
           title : 'Супергерой'  ,
           content:
           '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография получил вердикт:[/COLOR] [COLOR=rgb(255, 0, 0)]Отказано[/COLOR][COLOR=rgb(209, 213, 216)] т.к вы приписали суперспособности своему персонажу. [/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            "[FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE]" +
            '[url=https://postimages.org/][img]https://img-host.ru/BQB3y.png[/img][/url]',
           prefix: UNACCEPT_PREFIX,
           status: false,
          },
          {
           title: 'Копипаст',
           content:
           '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография получил вердикт:[/COLOR] [COLOR=rgb(255, 0, 0)]Отказано[/COLOR][COLOR=rgb(209, 213, 216)] т.к вы ее скопировали у другого человека.[/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            "[FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE]" +
            '[url=https://postimages.org/][img]https://img-host.ru/BQB3y.png[/img][/url]',
           prefix: UNACCEPT_PREFIX,
           status: false,
          },
          {
           title : 'нонрп ник'  ,
           content:
           '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография получил вердикт:[/COLOR] [COLOR=rgb(255, 0, 0)]Отказано[/COLOR][COLOR=rgb(209, 213, 216)] т.к у вас NonRP NickName. [/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            "[FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE]" +
            '[url=https://postimages.org/][img]https://img-host.ru/BQB3y.png[/img][/url]',
           prefix: UNACCEPT_PREFIX,
           status: false,
          },
          {
           title : 'ник англ'  ,
           content:
           '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография получил вердикт:[/COLOR] [COLOR=rgb(255, 0, 0)]Отказано[/COLOR][COLOR=rgb(209, 213, 216)] т.к ваш NickName должен быть написан на русском языке. [/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            "[FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE]" +
            '[url=https://postimages.org/][img]https://img-host.ru/BQB3y.png[/img][/url]',
           prefix: UNACCEPT_PREFIX,
           status: false,
          },
          {
           title : 'дата рождения с годом'  ,
           content:
           '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография получил вердикт:[/COLOR] [COLOR=rgb(255, 0, 0)]Отказано[/COLOR][COLOR=rgb(209, 213, 216)] т.к дата рождения не совпадает с возрастом. [/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            "[FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE]" +
            '[url=https://postimages.org/][img]https://img-host.ru/BQB3y.png[/img][/url]',
           prefix: UNACCEPT_PREFIX,
           status: false,
          },
          {
           title : 'семья не полнос.'  ,
           content:
           '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография получил вердикт:[/COLOR] [COLOR=rgb(255, 0, 0)]Отказано[/COLOR][COLOR=rgb(209, 213, 216)] т.к ваша семья расписана не полностью. [/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            "[FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE]" +
            '[url=https://postimages.org/][img]https://img-host.ru/BQB3y.png[/img][/url]',
           prefix: UNACCEPT_PREFIX,
           status: false,
          },
          {
           title : 'дата рождения не полнос.'  ,
           content:
           '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография получил вердикт:[/COLOR] [COLOR=rgb(255, 0, 0)]Отказано[/COLOR][COLOR=rgb(209, 213, 216)] т.к ваша дата рождения расписана не полностью. [/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            "[FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE]" +
            '[url=https://postimages.org/][img]https://img-host.ru/BQB3y.png[/img][/url]',
           prefix: UNACCEPT_PREFIX,
           status: false,
          },
         {
          title: '_____________________________________________RolePlay ситуации_____________________________________________'
         },
         {
          title: 'одобрено',
          content:
          '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация получил вердикт:[/COLOR] [COLOR=rgb(0, 255, 0)]Одобрено[/COLOR][COLOR=rgb(209, 213, 216)].[/COLOR][/I][/FONT][/SIZE]<br><br>" +
            '[CENTER][FONT=book antiqua][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]',
          prefix: ACCEPT_PREFIX,
          status: false,
         },
         {
          title : 'не туда'  ,
          content:
          '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация получил вердикт:[/COLOR] [COLOR=rgb(255, 0, 0)]Отказано[/COLOR][COLOR=rgb(209, 213, 216)], т.к вы не туда попали. [/COLOR]<br><br>" +
            '[CENTER][FONT=book antiqua][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]',
          prefix: UNACCEPT_PREFIX,
          status: false,
         },
         {
          title : 'не по форме'  ,
          content:
          '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация получил вердикт:[/COLOR] [COLOR=rgb(255, 0, 0)]Отказано[/COLOR][COLOR=rgb(209, 213, 216)], т.к она составлена не по форме. [/COLOR]<br><br>" +
            '[CENTER][FONT=book antiqua][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]',
          prefix: UNACCEPT_PREFIX,
          status: false,
         },
         {
          title : 'отказ'  ,
          content:
          '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация получил вердикт:[/COLOR] [COLOR=rgb(255, 0, 0)]Отказано[/COLOR][COLOR=rgb(209, 213, 216)]. [/COLOR]<br><br>" +
            '[CENTER][FONT=book antiqua][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]',
          prefix: UNACCEPT_PREFIX,
          status: false,
         },
         {
          title: 'На доработке',
          content:
          '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
            "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]В вашей RolePlay - ситуации недостаточно информации.<br><br>" +
            "Даю вам 24 часа на ее дополнение.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
            '[CENTER][FONT=book antiqua][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]',
          prefix: PIN_PREFIX,
          status: true,
         },
         {
          title : 'ник англ'  ,
          content:
          '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация получил вердикт:[/COLOR] [COLOR=rgb(255, 0, 0)]Отказано[/COLOR][COLOR=rgb(209, 213, 216)], т.к ваш все никнеймы должны быть написаны на русском языке. [/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - ситуаций закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            '[CENTER][FONT=book antiqua][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]',
          prefix: UNACCEPT_PREFIX,
          status: false,
         },
         {
          title : 'Неграмотная'  ,
          content:
          '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация получил вердикт:[/COLOR] [COLOR=rgb(255, 0, 0)]Отказано[/COLOR][COLOR=rgb(209, 213, 216)], т.к она оформлена неграмотно. [/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - ситуаций закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            '[CENTER][FONT=book antiqua][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]',
          prefix: UNACCEPT_PREFIX,
          status: false,
         },
         {
          title : 'Копипаст'  ,
          content:
          '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация получил вердикт:[/COLOR] [COLOR=rgb(255, 0, 0)]Отказано[/COLOR][COLOR=rgb(209, 213, 216)], т.к вы ее скопировали у другого человека. [/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - ситуаций закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            '[CENTER][FONT=book antiqua][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]',
          prefix: UNACCEPT_PREFIX,
          status: false, 
         },
         {
          title : 'Не дополнил'  ,
          content:
          '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация получил вердикт:[/COLOR] [COLOR=rgb(255, 0, 0)]Отказано[/COLOR][COLOR=rgb(209, 213, 216)], т.к вы ее не дополнили. [/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - ситуаций закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            '[CENTER][FONT=book antiqua][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]',
          prefix: UNACCEPT_PREFIX,
          status: false,
         },
         {
          title : 'Заголовок не по форме'  ,
          content:
          '[CENTER][COLOR=rgb(0,255,255)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 255, 255)]{{ user.name }}.[/COLOR][/SIZE][/FONT]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация получил вердикт:[/COLOR] [COLOR=rgb(255, 0, 0)]Отказано[/COLOR][COLOR=rgb(209, 213, 216)], т.к заголовок оформлен неправильно. [/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - ситуаций закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            '[CENTER][FONT=book antiqua][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]BLACK[/COLOR] [COLOR=rgb(255, 255, 255)]RU[/COLOR][COLOR=rgb(0, 0, 255)]SS[/COLOR][COLOR=rgb(255, 0, 0)]IA[/COLOR][/SIZE][/FONT][/CENTER]',
          prefix: UNACCEPT_PREFIX,
          status: false, 
         },
        ];
 
 
  $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
    // Добавление кнопок при загрузке страницы
    addButton('Закрыто', 'close', '#ff0000');
    addButton('На рассмотрение', 'pin', '#c4751d');
    addButton('Одобрено', 'accepted', '#80b52a');
    addButton('Отказано', 'unaccept', 'ff0000');
    addButton('Ответы', 'selectAnswer', '#555555');
 
    // Поиск информации о теме
    const threadData = getThreadData();
 
    $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
    $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
    $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
    $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
    $('button#Texy').click(() => editThreadData(TEX_PREFIX, false));
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
 
function addButton(name, id, color = '#3498db') {
  $('.button--icon--reply').before(
    `<button
      type="button"
      class="button rippleButton"
      id="${id}"
      style="
        margin: 3px;
        background-color: ${color};
        color: white;
        border: none;
        padding: 1px 6px;
        border-radius: 3px;
        cursor: pointer;
        transition: background-color 0.1s ease;
      "
      onmouseover="this.style.backgroundColor='${darkenColor(color, 20)}'"
      onmouseout="this.style.backgroundColor='${color}'"
    >
      ${name}
    </button>`
  );
}

// Функция для затемнения цвета (для эффекта hover)
function darkenColor(color, percent) {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max((num >> 16) - amt, 0);
  const G = Math.max((num >> 8 & 0x00FF) - amt, 0);
  const B = Math.max((num & 0x0000FF) - amt, 0);
  return `#${(1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1)}`;
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

        if (buttons[id].rgbEffect) {
        let hue = 0;
        function animateText() {
            hue = (hue + 1) % 360;
            $('.fr-element.fr-view p [color]').css('color', `hsl(${hue}, 100%, 50%)`);
            requestAnimationFrame(animateText);
        }
        animateText();
    }

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
        mention: `[USER=${authorName}[/USER]`,
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