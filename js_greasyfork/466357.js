// ==UserScript==
// @name         Кураторы форума || Gold
// @namespace    https://forum.blackrussia.online
// @version      0.2.2
// @description  Скрипт создан для кураторов форума Black Russia Gold
// @author       Sasha_Legion | 15💕
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @grant        none
// @license    MIT
// @collaborator @BlackRussia#15
// @icon https://emoji.gg/assets/emoji/9372-blurple-boost-level-9.png
// @downloadURL https://update.greasyfork.org/scripts/466357/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%7C%7C%20Gold.user.js
// @updateURL https://update.greasyfork.org/scripts/466357/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%7C%7C%20Gold.meta.js
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
     title: 'Version: 0.1.6'
     },
     {
     title: 'Data: 22.11.2022'
     },
     {
     },
     {
     title: 'Black Russia GOLD 💛 by S.Legion🦎',
     },
     {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Правила Role Play процесса ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'nRp поведение',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]2.01 | [color=lavender] Запрещено поведение, нарушающее нормы процессов Role Play режима игры.Примечание: ездить на крышах транспортных средств, бегать или ходить по столам в казино, целенаправленная провокация сотрудников правоохранительных органов с целью развлечения, целенаправленная помеха в проведении различных собеседований и так далее.[color=red] | Jail 30 минут.[/Spoiler]<br>"+
  "[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
   status: false,
    },
    {
      title: 'Уход от RP',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]2.02 | [color=lavender] Запрещено целенаправленно уходить от Role Play процесса всеразличными способами [color=red] | Jail 30 минут / Warn.[/Spoiler]<br>"+
  "[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
   status: false,
    },
    {
      title: 'nRp вождение',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]2.03 | [color=lavender] Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере[color=red] | Jail 30 минут.[/Spoiler]<br>"+
  "[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
   status: false,
    },
        {
      title: 'Долг',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]2.57. | [color=lavender] Запрещается брать в долг игровые ценности и не возвращать их.  [color=red] | Ban 30 дней / permban [/Spoiler]<br>"+
  "[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
   status: false,
    },
        {
      title: 'nRp Обман',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]2.05 | [color=lavender] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики[color=red] | PermBan.[/Spoiler]<br>"+
  "[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
   status: false,
    },
 {
      title: 'Затягивание RP',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]2.12 | [color=lavender] Запрещено целенаправленное затягивание Role Play процесса[color=red] | Jail 30 минут.[/Spoiler]<br>"+
  "[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
   status: false,
    },
    {
      title: 'Аморальные действия',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]2.08 | [color=lavender] Запрещена любая форма аморальных действий сексуального характера в сторону игроков[color=red] | Jail 30 минут / Warn. [/Spoiler]<br>"+
  "[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
   status: false,
    },
    {
      title: 'Слив склада',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]2.09 | [color=lavender] Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле [color=red] | Ban 15 - 30 дней / PermBan. [/Spoiler]<br>"+

"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
   status: false,
    },
    {
      title: 'DB',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]2.13 | [color=lavender] Запрещен DB намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта[color=red] | Jail 60 Минут.[/Spoiler]<br>"+
  "[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
   status: false,
    },
    {
      title: 'РК',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]2.14 | [color=lavender] Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти [color=red] | Jail 30 минут. [/Spoiler]<br>"+
  "[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
   status: false,
    },
    {
      title: 'ТК',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]2.15 | [color=lavender] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины.[color=red] | Jail 60 минут / Warn (за два и более убийства)[/Spoiler]<br>"+
  "[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
   status: false,
    },
    {
   title: 'ЕПП',
   content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]2.47 | [color=lavender] Запрещено ездить по полям на легковые машины и мотоциклах. [color=red]  | Jail 30 минут[/Spoiler]<br>"+
  "[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
prefix: ACCСEPT_PREFIX,
   status: false,
    },
    {
   title: 'ЕПП ФУРА',
   content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]2.47 | [color=lavender] Запрещено ездить по полям на грузовом транспорте (работа дальнобойщика) [color=red]  | Jail 60 минут[/Spoiler]<br>"+
  "[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
    },
    {
      title: 'SK',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]2.16 | [color=lavender] Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них.[color=red] | Jail 60 минут / Warn (за два и более убийства)[/Spoiler]<br>"+
  "[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
   status: false,
    },
    {
      title: 'PG',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]2.17 | [color=lavender] Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь[color=red] |  Jail 30 минут[/Spoiler]<br>"+
  "[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
   status: false,
    },
     {
      title: ' DM',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]2.19 | [color=lavender]Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [color=red]  | Jail 60 минут.[/Spoiler]<br>"+
  "[CENTER][COLOR=lavender] наказание будет выдано в течение 24 часов.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
   status: false,
    },
    {
      title: 'Mass DM',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]2.20 | [color=lavender] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более.[color=red]  | Warn / Бан 3-7 дней.[/Spoiler]<br>"+
  "[CENTER][COLOR=lavender] наказание будет выдано в течение 24 часов.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
   status: false,
    },
        {
      title: 'Сторонне ПО',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]2.22 | [color=lavender] Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками. [color=red]  | Ban 15 - 30 дней / PermBan.[/Spoiler]<br>"+
  "[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
   status: false,
    },
 {
      title: 'Админ информация',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]2.27 | [color=lavender] Запрещено распространение информации и материалов, которые имеют непосредственное отношение к работе администрации проекта [color=red] | PermBan + ЧС проекта.[/Spoiler]<br>"+
  "[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
   status: false,
    },
    {
      title: 'Реклама сторонних ресурсов',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]2.31 | [color=lavender] Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное. [color=red]  | Ban 7 дней / PermBan.[/Spoiler]<br>"+
"[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
   status: false,
    },
    {
      title: 'Национальность/Религия',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]2.35 | [color=lavender] На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате[color=red] | Mute 120 минут / Ban 7 дней.[/Spoiler]<br>"+
  "[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
   status: false,
    },
    {
      title: 'Уход от наказания',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]2.34 | [color=lavender] Запрещен уход от наказания. [color=red]  | Ban 15 - 30 дней (суммируется к общему наказанию дополнительно).[/Spoiler]<br>"+
  "[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
   status: false,
    },
     {
      title: 'Угрозы OOC',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]2.37 | [color=lavender] Запрещены OOC угрозы, в том числе и завуалированные. [color=red]  | Mute 120 минут / Ban 7 дней.[/Spoiler]<br>"+
  "[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
   status: false,
    },
    {
      title: 'Злоуп наказаниями',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]2.39 | [color=lavender] Злоупотребление нарушениями правил сервера.Пример: было получено пять наказаний за DM, шестое будет злоупотреблением. Если было получено одно наказание за упоминание родных, два наказания за DB и два наказания за DM, следующее будет считаться злоупотреблением. [color=red]  | Ban 7-15 дней.[/Spoiler]<br>"+
  "[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
   status: false,
    },
    {
      title: 'Оск проекта',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]2.40 | [color=lavender]  Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе. [color=red]  | Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором).[/Spoiler]<br>"+
  "[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
   status: false,
    },
    {
      title: 'Продажа/покупка промо',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]2.43 | [color=lavender] Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций. [color=red]  | Mute 120 минут.[/Spoiler]<br>"+
  "[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
   status: false,
    },
    {
     title: 'Конфликт из IC в OOC',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]2.36 | [color=lavender] Запрещено переносить конфликты из IC в OOC и наоборот [color=red] | Warn.[/Spoiler]<br>"+
  "[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
   status: false,
    },
    {
      title: 'Помеха RP процессу',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]2.51 | [color=lavender]  Запрещено вмешательство в Role Play процесс с целью помехи и препятствования дальнейшего развития Role Play процесса. [color=red]  | Jail 30 минут[/Spoiler]<br>"+
  "[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
   status: false,
    },
    {
      title: 'nRp аксессуар',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]2.52 | [color=lavender]  Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. [color=red]  | При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут[/Spoiler]<br>"+
  "[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
   status: false,
    },
    {
      title: 'Оск администрации',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]2.54 | [color=lavender]  Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации[color=red]  | Mute 180 минут[/Spoiler]<br>"+
  "[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
   status: false,
    },
    {
      title: 'Багоюз аним',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]2.55 | [color=lavender]Запрещается багоюз связанный с анимацией в любых проявлениях.[color=red]  | jail 60/120 минут[/Spoiler]<br>"+
  "[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
   status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Игровые чаты ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Translit',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]3.20 | [color=lavender] Запрещено использование транслита в любом из чатов[color=red]  | Mute 30 минут[/Spoiler]<br>"+
  "[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
   status: false,
    },
     {
      title: 'MG',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]2.18 | [color=lavender]  Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе[color=red]  | Mute 30 минут[/Spoiler]<br>"+
  "[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
   status: false,
    },
    {
      title: 'Политика',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]3.18 | [color=lavender] Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов [color=red]  |  Mute 120 минут / Ban 10 дней [/Spoiler]<br>"+
  "[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
   status: false,
    },
    {
   title: 'CapsLock',
   content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]3.02 | [color=lavender] Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате [color=red]  | Mute 30 минут[/Spoiler]<br>"+
  "[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
   status: false,
 },
    {
      title: 'Оск/Упом родных',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]3.04 | [color=lavender] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC)  [color=red]  | Mute 120 минут / Ban 7-15 дней.[/Spoiler]<br>"+
  "[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
   status: false,
    },
    {
   title: 'Flood',
   content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]3.05 | [color=lavender] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [color=red]  | Mute 30 минут.[/Spoiler]<br>"+
  "[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
   status: false,
 },
    {
      title: 'Злоуп знаками',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]3.06 | [color=lavender] Запрещено злоупотребление знаков препинания и прочих символов [color=red]  | Mute 30 минут.[/Spoiler]<br>"+
  "[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
   status: false,
    },
{
      title: 'Оскорбления(секс характера)',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red] 3.07. | [color=lavender] Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата[color=red] | Mute 30 минут [/Spoiler]<br>"+
  "[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
   status: false,
    },
    {
      title: 'Оскорбление OOC(/n)',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]3.03 | [color=lavender] Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены[color=red]  | Mute 30 минут[/Spoiler]<br>"+
  "[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
   status: false,
    },
    {
      title: 'Слив СМИ',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]3.08 | [color=lavender] Запрещены любые формы «слива» посредством использования глобальных чатов [color=red]  | PermBan[/Spoiler]<br>"+
  "[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
   status: false,
    },
    {
      title: 'Угрозы о наказании со стороны адм',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]3.09 | [color=lavender]  Запрещены любые угрозы о наказании игрока со стороны администрации [color=red]  | Mute 30 минут[/Spoiler]<br>"+
  "[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
   status: false,
    },
    {
      title: 'Выдача себя за адм ',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]3.10 | [color=lavender] Запрещена выдача себя за администратора, если таковым не являетесь[color=red]  | Ban 7-15 + ЧС администрации.[/Spoiler]<br>"+
"[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
   status: false,
    },
    {
     },
     {
     title: '- - - - - - - - - - - - - - - Казино/СТО - - - - - - - - - - - - - - -',
},
 {
      title: 'Принятие игроков за деньги',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red] 2.01. | [color=lavender] Владельцу и менеджерам казино и ночного клуба запрещено принимать работников за денежные средства на должность охранника, крупье или механика.[color=red] | Ban 3 - 5 дней.[/Spoiler]<br>"+
  "[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
   status: false,
    },
 {
      title: 'Взятие денег за работу',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red] 2.02. | [color=lavender] Владельцу и менеджерам казино и ночного клуба запрещено взимать у работников налоги в виде денежных средств за должность в казино.[color=red] | Ban 3 - 5 дней.[/Spoiler]<br>"+
  "[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
   status: false,
    },
 {
      title: 'nRp Охранник(казино)',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red] 2.03. | [color=lavender] Охраннику казино запрещено выгонять игрока без причины.[color=red] | Увольнение с должности + Jail 30 минут.[/Spoiler]<br>"+
  "[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
   status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Игровые аккаунты ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Fake аккаунт',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]4.10 | [color=lavender] Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию. [color=red]  | PermBan.[/Spoiler]<br>"+
"[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
   status: false,
    },

    {
      title: 'Взлом ссылки[Forum]',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red] Данный форумный аккаунт будет заблокирован.Спасибо за информацию.[/Spoiler]<br>"+
  "[CENTER][COLOR=lavender] Наказания будет выдано в течение 12 часов.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
   status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Внутриигровые ценности ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
{
      title: 'Нецензурное название',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]2.53 | [color=lavender] Запрещено устанавливать названия для внутриигровых ценностей с использованием нецензурной лексики, оскорблений, слов политической или религиозной наклонности | [color=red] Ban 1 день / При повторном нарушении обнуление бизнеса.[/Spoiler]<br>"+
  "[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
   status: false,
    },

    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Передачи жалоб ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Техническому специалисту',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Ваша жалоба была передана Техническому специалисту сервера.Ожидайте окончательного ответа.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=blue][ICODE]Передано Тех.спец[/ICODE][/COLOR][/CENTER][/B]',
       prefix: TEXY_PREFIX,
   status: true,
    },
    {
      title: 'Передано ГКФ(Konakov)',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Ваша жалоба была передана Главному куратору форума,ожидайте окончательного вердикта. Иногда подобные жалобы требуют больше времени для рассмотрения.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=lime][ICODE]Передано ГКФ[/ICODE][/COLOR][/CENTER][/B]',
    prefix: PINN_PREFIX,
   status: true,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Правила Гос.Структур╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'nRp Goss',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]1.07 | [color=lavender] Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, находится в интерьере казино [color=red]  | Jail 30 минут.[/Spoiler]<br>"+
  "[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
   status: false,
    },
    {
      title: 'Фрак.Т/С в личных целях. ',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]1.08 | [color=lavender] Запрещено использование фракционного транспорта в личных целях [color=red]  | Jail 30 минут.[/Spoiler]<br>"+
  "[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
   status: false,
    },
    {
      title: 'Н/П/Р/О (Объявы)',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]4.01 | [color=lavender] Запрещено редактирование объявлений, не соответствующих ПРО [color=red]  | Mute 30 минут.[/Spoiler]<br>"+
  "[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
   status: false,
    },
    {
      title: 'nRp Обьявы(в своих целях)',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]4.04 | [color=lavender] Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком [color=red]  | Ban 7 дней + ЧС организации.[/Spoiler]<br>"+
  "[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
   status: false,
    },
    {
      title: 'Н/П/П/Э (Эфиры)',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]4.02 | [color=lavender] Запрещено проведение эфиров, не соответствующих Role Play правилам и логике [color=red]  | Mute 30 минут.[/Spoiler]<br>"+
"[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
   status: false,
    },
    {
      title: 'nRp Розыск',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]6.02 | [color=lavender] Запрещено выдавать розыск без Role Play причины [color=red]  | Warn.[/Spoiler]<br>"+
  "[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
   status: false,
    },
    {
      title: 'Задержание без RP',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]6.03 | [color=lavender] Запрещено оказывать задержание без Role Play отыгровки [color=red]  | Warn.[/Spoiler]<br>"+
  "[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
   status: false,
    },
 {
      title: 'Задержание в интерьере',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]2.50 | [color=lavender] Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий[color=red] |  Ban 7 - 15 дней + увольнения из организации. [/Spoiler]<br>"+
  "[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
   status: false,
    },
    {
      title: 'Розыск,Штраф без причины',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]7.02 | [color=lavender] Запрещено выдавать розыск, штраф без Role Play причины [color=red]  | Warn.[/Spoiler]<br>"+
  "[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
   status: false,
    },
    {
      title: 'В/У во время погони',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]7.04 | [color=lavender] Запрещено отбирать водительские права во время погони за нарушителем [color=red]  | Warn.[/Spoiler]<br>"+
  "[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
   status: false,
    },
    {
    title: 'Патруль в одиночку',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]1.11 | [color=lavender] Всем силовым структурам запрещен одиночный патруль или конвоирование, минимум 2 сотрудника [color=red]  | Jail 30 минут.[/Spoiler]<br>"+
  "[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
   status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Правила В/Ч ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Нарушение правил В/Ч',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]1 | [color=lavender] За нарушение правил нападения на Войсковую Часть выдаетьса [color=red]  | Jail 30 минут / Warn (Для сотрудников ОПГ).[/Spoiler]<br>"+
  "[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
   status: false,
    },
    {
      title: 'Нападение на В/Ч через стену',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]15 | [color=lavender] Нападение на военную часть разрешено только через блокпост КПП с последовательностью взлома [color=red]  | Warn.[/Spoiler]<br>"+
  "[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
   status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Отсутствие пункта в жалобе╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
   title: 'Нарушений не найдено',
   content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Со стороны игрока не найдено каких либо нарушений,пожалуйста ознакомьтесь с правилами проекта.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
      prefix: UNACCСEPT_PREFIX,
   status: false,
 },
    {
      title: 'Недостаточно доказательств',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender] Предоставленных доказательств недостаточно для принятия решения, если у вас имеються дополнительные доказательства,прикрепите в новой жалобе.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
      prefix: UNACCСEPT_PREFIX,
   status: false,
    },
    {
      title: 'Дублирование темы',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Вам уже был дан ответ ниже, пожалуйста перестаньте делать дубликаты, иначе Ваш форумный аккаунт будет заблокирован.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
      prefix: UNACCСEPT_PREFIX,
   status: false,
    },
    {
      title: 'В жалобы на администрацию',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Вы ошиблись разделом, пожалуйста отправте свою жалобу в Жалобы на администрацию.<br><br>"+
  "[CENTER][B][COLOR=RED]| [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.680/'][Color=lavender]Жалобы на администрацию[/URL] [COLOR=RED]|<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
      prefix: UNACCСEPT_PREFIX,
   status: false,
    },
    {
      title: 'В раздел обжалований',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Вы ошиблись разделом, пожалуйста отправте свою жалобу в обжалование наказаний.<br><br>"+
  "[CENTER][B][COLOR=RED]| [URL='https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.683/'][Color=lavender]Раздел обжалований[/URL] [COLOR=RED]|<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
      prefix: UNACCСEPT_PREFIX,
   status: false,
    },
    {
      title: 'Форма темы',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Ваша жалоба составлена не по форме, пожалуйста ознакомьтесь с правилами подачи жалоб.<br><br>"+
  "[CENTER][B][COLOR=RED]| [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.559810/'][Color=lavender]Правила подачи жалоб[/URL] [COLOR=RED]|<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
      prefix: UNACCСEPT_PREFIX,
   status: false,
    },
 {
   title: 'Нет /time',
   content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]В предоставленных доказательствах отсутствует время (/time) , жалоба получает статус [COLOR=red] Отказано. [/COLOR]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=green][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
      prefix: UNACCСEPT_PREFIX,
   status: false,
 },
    {
   title: 'Нужны тайм-коды',
   content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Ваша видеофиксация нарушения длится более 3-х минут,укажите тайм-коды ниже в течение 24 часов,в случае если вы не укажите в период времени жалоба получит статус [COLOR=red] Отказано. [/COLOR]<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=orange][ICODE]На рассмотрение[/ICODE][/COLOR][/CENTER][/B]',
      prefix: PINN_PREFIX,
   status: false,
 },
    {
      title: 'Жалоба на рассмотрении',content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br>" +
  "[B][CENTER][COLOR=lavender]Ваша жалоба взята на рассмотрение, пожалуйста не создавайте дубликатов и ожидайте ответ в этой форумной теме.<br>" +
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=yellow][ICODE]На рассмотрение[/ICODE][/COLOR][/CENTER][/B]',
      prefix: PINN_PREFIX,
   status: false,
    },
      {
      title: 'Заголовок не по форме',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Ваш заголовок темы составлена не по форме, пожалуйста ознакомьтесь с правилами подачи жалоб/заголовков.<br><br>"+
  "[CENTER][B][COLOR=RED]| [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.559810/'][Color=lavender]Правила подачи жалоб[/URL] [COLOR=RED]|<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
prefix: UNACCСEPT_PREFIX,
   status: false,
    },
      {
      title: 'Более 72 часов',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]С момента совершения нарушения прошло более 72 часа, жалоба не подлежит рассмотрению.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
      prefix: UNACCСEPT_PREFIX,
   status: false,
    },
    {
      title: 'Нету условий сделки',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  '[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]В данных доказательствах отсутствуют условия сделки[/CENTER]" +
  '[Color=Red][CENTER]Отказано[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
   status: false,
    },
    {
      title: 'Нужен фрапс',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]В данной ситуации обязательно должна быть видео фиксация всех моментов нарушения.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
      prefix: UNACCСEPT_PREFIX,
   status: false,
    },
    {
      title: 'Нужен фрапс + промотка чата',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  '[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]В таких случаях нужна видеозапись + промотка чата.[/CENTER]" +
  '[Color=Red][CENTER]Отказано.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
   status: false,
    },
    {
      title: 'Нужна промотка чата',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  '[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]В таких случаях нужна промотка чата.[/CENTER]" +
  '[Color=Red][CENTER]Отказано[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
   status: false,
    },
    {
   title: 'Неадекватная жалоба',
   content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender] Ваша жалоба составлена с оскорбительным контекстом.Оформите новую жалобу адекватно.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
      prefix: UNACCСEPT_PREFIX,
   status: false,
 },
    {
      title: 'Неполный фрапс',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Видео запись не полная, загрузите полную видеофиксацию на YouTube.<br>"+"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
      prefix: UNACCСEPT_PREFIX,
   status: false,
    },
    {
      title: 'Доказательства в плохом качестве',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender] Представленные доказательства в плохом качестве, пожалуйста загрузите в хорошем на YouTube или других фотохостингах.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
      prefix: UNACCСEPT_PREFIX,
   status: false,
    },
    {
      title: 'От 3-го лица',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Жалоба составлена от 3-го лица, не подлежит рассмотрению со стороны администрации сервера.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
      prefix: UNACCСEPT_PREFIX,
   status: false,
    },
    {
      title: 'Монтаж',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]В ваших доказательствах присутствует монтаж, жалоба не подлежит рассмотрению.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
      prefix: UNACCСEPT_PREFIX,
   status: false,
    },
    {
      title: 'Ответный DM',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]На доказательствах был замечен ответный DM,в таких случаях жалоба отклоняется.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
      prefix: UNACCСEPT_PREFIX,
   status: false,
    },
    {
      title: 'Нету доказательств',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]В вашей жалобе отсутствуют какие-либо доказательства,загрузите доказательства в новой жалобе.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
      prefix: UNACCСEPT_PREFIX,
   status: false,
    },
    {
      title: 'Ошиблись разделом',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Вы ошиблись разделом или сервером, подайте жалобу в нужный форумный раздел.<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
   status: false,
    },
    {
   title: 'Доказательства не работают',
   content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]В вашей жалобе доказательства не работают, загрузите рабочие доказательства в новой жалобе.<br>"+
  "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
   status: false,
 },
 {
   title: 'Доказательства в соц.сетях',
   content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Доказательства должны быть загружены на фотохостинги,а именно : Imgur, Япикс, YouTube, Ibb, postimages или другие.<br>"+
  "[url=https://postimages.or/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
      prefix: UNACCСEPT_PREFIX,
   status: false,
 },
    {
      title: 'Ошиблись разделом(фракционные жалобы)',
      content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
  "[B][CENTER][COLOR=lavender]Вы ошиблись разделом,обратитесь в жалобы на сотрудников в данной фракции или группировке.<br>"+
  "[url=https://postimages.or/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
  '[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
      prefix: UNACCСEPT_PREFIX,
   status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Role Play биографии╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
      {
      title: 'Одобрено',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  '[CENTER][COLOR=cyan][ICODE]Доброго времени суток уважаемый {{ user.name }}[/ICODE][/COLOR][/CENTER]<br>' +
'[CENTER][ICODE]Ваша RP биография получает статус:[/ICODE]<br>' +
"[COLOR=green][ICODE]Одобрено.[/ICODE]",
      prefix: ODOBRENOBIO_PREFIX,
   status: false,
    },
    {
      title: 'На доработку',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  '[CENTER][COLOR=cyan][ICODE]Доброго времени суток уважаемый {{ user.name }}[/ICODE][/COLOR][/CENTER]<br>' +
        "[CENTER][COLOR=orange][ICODE]Вам даётся 24 часа на дополнение вашей РП биографии.[/ICODE][/COLOR][/CENTER]",
      prefix: NARASSMOTRENIIBIO_PREFIX,
    },
    {
      title: 'Отказ(дата)',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  '[CENTER][COLOR=cyan][ICODE]Доброго времени суток уважаемые {{ user.name }} [/ICODE][/COLOR][/CENTER]<br>' +
        "[CENTER][ICODE]Ваша RP биография получает статус:[/ICODE] [COLOR=red][ICODE]Отказано.[/ICODE][/COLOR]<br>[COLOR=orange][ICODE]Причина отказа: Ваш возраст не совпадает с годом и датой рождения.[/ICODE][/COLOR][/CENTER]",
      prefix: OTKAZBIO_PREFIX,
   status: false,
    },
    {
      title: 'Отказ(копия)',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
'[CENTER][COLOR=cyan][ICODE]Доброго времени суток уважаемые {{ user.name }} [/ICODE][/COLOR][/CENTER]<br>' +
        "[CENTER][ICODE]Ваша RP биография получает статус:[/ICODE] [COLOR=red][ICODE]Отказано.[/ICODE][/COLOR]<br>[COLOR=orange][ICODE]Причина отказа: Биография скопирована.[/ICODE][/COLOR][/CENTER]",
      prefix: OTKAZBIO_PREFIX,
   status: false,
    },
    {
      title: 'Отказ(заголовок)',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  '[CENTER][COLOR=cyan][ICODE]Доброго времени суток уважаемые {{ user.name }} [/ICODE][/COLOR][/CENTER]<br>' +
   "[CENTER][ICODE]Ваша RP биография получает статус:[/ICODE] [COLOR=red][ICODE]Отказано.[/ICODE][/COLOR]<br>[COLOR=orange][ICODE]Причина отказа: У вашей биографии заголовок состоит не по форме.[/ICODE][/COLOR][/CENTER]",

      prefix: OTKAZBIO_PREFIX,
   status: false,
    },
    {
      title: 'Отказ(ник на анг)',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  '[CENTER][COLOR=cyan][ICODE]Доброго времени суток уважаемые {{ user.name }} [/ICODE][/COLOR][/CENTER]<br>' +
        "[CENTER][ICODE]Ваша RP биография получает статус:[/ICODE] [COLOR=red][ICODE]Отказано.[/color]<br>[COLOR=orange][ICODE]Причина отказа:  Nick_Name написан на английском языке.[/ICODE][/COLOR][/CENTER]",
      prefix: OTKAZBIO_PREFIX,
   status: false,
    },
    {
      title: 'Отказ(мало информации)',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  '[CENTER][COLOR=cyan][ICODE]Доброго времени суток уважаемые {{ user.name }} [/ICODE][/COLOR][/CENTER]<br>' +
        "[CENTER][ICODE]Ваша RP биография получает статус:[/ICODE] [COLOR=red][ICODE]Отказано.[/ICODE][/COLOR]<br>[COLOR=orange][ICODE]Причина отказа: У вашей биографии  мало информации.[/ICODE][/COLOR][/CENTER]",
      prefix: OTKAZBIO_PREFIX,
   status: false,
    },
    {
      title: 'Отказ(орф ошибки)',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  '[CENTER][COLOR=cyan][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br>' +
        "[CENTER][ICODE]Ваша RP биография получает статус:[/ICODE] [COLOR=red][ICODE]Отказано.[/ICODE][/COLOR]<br>[COLOR=orange][ICODE]Причина отказа:  орфографические ошибки.[/ICODE][/COLOR][/CENTER]",
      prefix: OTKAZBIO_PREFIX,
   status: false,
    },
    {
      title: 'Отказ(от 3-го лица)',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  '[CENTER][COLOR=cyan][ICODE]Доброго времени суток уважаемые {{ user.name }} [/ICODE][/COLOR][/CENTER]<br>' +
        "[CENTER][ICODE]Ваша RP биография получает статус:[/ICODE] [COLOR=red][ICODE]Отказано.[/ICODE][/COLOR]<br>[COLOR=orange][ICODE]Причина отказа: Ваша биограция написана от 3-го лица.[/ICODE][/COLOR][/CENTER]",
      prefix: OTKAZBIO_PREFIX,
   status: false,
    },
    {
      title: 'Отказ(Меньше 18)',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  '[CENTER][COLOR=cyan][ICODE]Доброго времени суток уважаемые {{ user.name }} [/ICODE][/COLOR][/CENTER]<br>' +
        "[CENTER][ICODE]Ваша RP биография получает статус:[/ICODE] [COLOR=red][ICODE]Отказано.[/ICODE][/COLOR]<br>[COLOR=orange][ICODE]Причина отказа: Вашему персонажу меньше 18 лет.[/ICODE][/COLOR][/CENTER]",
      prefix: OTKAZBIO_PREFIX,
   status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Role Play ситуации╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Одобрено',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  '[CENTER][COLOR=cyan][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br>' +
        "[CENTER][ICODE]Ваша РП ситуация получает статус:[/ICODE][COLOR=green][ICODE]Одобрено.[/ICODE][/COLOR][/CENTER]",
      prefix: ODOBRENORP_PREFIX,
   status: false,
    },
    {
      title: 'На дороботке',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  '[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Вам даётся 24 часа на дополнение вашей РП ситуации[/CENTER]",
      prefix: NARASSMOTRENIIRP_PREFIX,
   status: false,
    },
    {
      title: 'Отказ',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  '[CENTER][COLOR=cyan][ICODE]Доброго времени суток уважаемые {{ user.name }} [/ICODE][/COLOR]<br>' +
'[ICODE]Ваша РП ситуация получает статус:[/ICODE][COLOR=red][ICODE]Отказано.[/ICODE][/COLOR]<br>'+
"[COLOR=orange][ICODE] Причиной отказа являетя какое-либо нарушение правил.[/ICODE][/COLOR][/CENTER]",
      prefix: OTKAZRP_PREFIX,
   status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Неофициальные  организации╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Одобрено',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  '[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша Неофицальная РП организация получает статус: [Color=Green]Одобрено.[/I][/CENTER][/color][/FONT]",
      prefix: ODOBRENOORG_PREFIX,
   status: false,
    },
    {
      title: 'На доработке',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  '[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Вам даётся 24 часа на дополнение вашей Неофициальная Орг[/CENTER]",
      prefix: NARASSMOTRENIIORG_PREFIX,
   status: false,
    },
    {
      title: 'Отказ',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
  '[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша Неофицальная РП организация получает статус: [Color=Red]Отказано.[/color]<br>Причиной отказа могло послужить какое либо нарушение правил.[/CENTER][/FONT]",
      prefix: OTKAZORG_PREFIX,
   status: false,
    },];

$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
	addButton('На рассмотрение', 'pin');
    addButton('Одобрено', 'accepted');
    addButton('Отказано', 'unaccept');
    addButton('Тех. Специалисту', 'Texy');
    addButton('Решено', 'Resheno');
    addButton('Закрыто', 'Zakrito');
    addButton('Меню', 'selectAnswer');

	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
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
	  : 11 < hours && hours <= 15
	  ? 'Добрый день'
	  : 15 < hours && hours <= 21
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