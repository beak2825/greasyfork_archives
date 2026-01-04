// // ==UserScript==
// @name         GREEN | КФ
// @namespace    https://forum.blackrussia.online
// @version      4.0
// @description  Скрипт для упрощения работы КФ
// @author       Nikita_Welcom
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/*
// @grant        none
// @license      MIT
// @icon https://phonoteka.org/uploads/posts/2023-02/1675404036_phonoteka-org-p-blek-rasha-oboi-vkontakte-65.png
// @downloadURL https://update.greasyfork.org/scripts/464172/GREEN%20%7C%20%D0%9A%D0%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/464172/GREEN%20%7C%20%D0%9A%D0%A4.meta.js
// ==/UserScript==

(function () {
  'use strict';
const UNACCEPT_PREFIX = 4; // Префикс ОТКАЗАНО.
const ACCEPT_PREFIX = 8; // Префикс ОДОБРЕНО.
const PIN_PREFIX = 2; // Для закрепления.
const COMMAND_PREFIX = 10; // Префикс для передачи темы команде проекта.
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7; // Префикс ЗАКРЫТО.
const TEX_PREFIX = 13; // Префикс ТЕХНИЧЕСКОМУ СПЕЦИАЛИСТУ.
const GA_PREFIX = 12; // Префикс ГЛАВНОМУ АДМИНИСТРАТОРУ.
const V_PREFIX = 1;
const buttons = [
    {
      title: '|',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR][/SIZE]<br><br>',
    },
    {
      title: 'ᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠ2.00ᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠ',
    },
    {
      title: 'DM',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]2.19. [/COLOR]Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [COLOR=rgb(255, 0, 0)]| Jail 60 минут[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'DB',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]2.13. [/COLOR]Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [COLOR=rgb(255, 0, 0)]| Jail 60 минут[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'RK',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]2.14. [/COLOR]Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти [COLOR=rgb(255, 0, 0)]| Jail 30 минут[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'ТК',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]2.15. [/COLOR]Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины [COLOR=rgb(255, 0, 0)]| Jail 60 минут / Warn (за два и более убийства)[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'SК',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]2.16. [/COLOR]Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них [COLOR=rgb(255, 0, 0)]| Jail 60 минут / Warn (за два и более убийства)[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'PG',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]2.17. [/COLOR]Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь [COLOR=rgb(255, 0, 0)]| Jail 30 минут[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'MG',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]2.18. [/COLOR]Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'ЕПП',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]2.46. [/COLOR]Запрещено ездить по полям на любом транспорте [COLOR=rgb(255, 0, 0)]| Jail 30 минут[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'ЕПП фура / инко',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]2.47. [/COLOR]Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) [COLOR=rgb(255, 0, 0)]| Jail 60 минут[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Сбив аним',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]2.55. [/COLOR]Запрещается багоюз связанный с анимацией в любых проявлениях [COLOR=rgb(255, 0, 0)]| Jail 60 / 120 минут[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'ООС угрозы',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]2.37. [/COLOR]Запрещены OOC угрозы, в том числе и завуалированные [COLOR=rgb(255, 0, 0)]| Mute 120 минут / Ban 7 дней[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'NRP поведение',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]2.01. [/COLOR]Запрещено поведение, нарушающее нормы процессов Role Play режима игры [COLOR=rgb(255, 0, 0)]| Jail 30 минут[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'NRP вождение',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]2.03. [/COLOR]Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере [COLOR=rgb(255, 0, 0)]| Jail 30 минут[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'NRP обман',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]2.05. [/COLOR]Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [COLOR=rgb(255, 0, 0)]| PermBan[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'NRP аксы',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]2.52. [/COLOR]Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера [COLOR=rgb(255, 0, 0)]| При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + Jail 30 минут[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Аморал',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]2.08. [/COLOR]Запрещена любая форма аморальных действий сексуального характера в сторону игроков [COLOR=rgb(255, 0, 0)]| Jail 30 минут / Warn[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Mass DM',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]2.20. [/COLOR]Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более [COLOR=rgb(255, 0, 0)]| Warn / Ban 3 - 7 дней[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Реклама СОЦ',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]2.31. [/COLOR]Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное [COLOR=rgb(255, 0, 0)]| Ban 7 дней / PermBan[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Продажа промо',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]2.43. [/COLOR]Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций [COLOR=rgb(255, 0, 0)]| Mute 120 минут[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Уход от РП',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]2.02. [/COLOR]Запрещено целенаправленно уходить от Role Play процесса всеразличными способами [COLOR=rgb(255, 0, 0)]| Jail 30 минут / Warn[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Помеха РП',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]2.51. [/COLOR]Запрещено вмешательство в Role Play процесс с целью помехи и препятствования дальнейшего развития Role Play процесса [COLOR=rgb(255, 0, 0)]| Jail 30 минут[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Слив склада',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]2.09. [/COLOR]Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле [COLOR=rgb(255, 0, 0)]| Ban 15 - 30 дней / PermBan[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Злоуп (6+)',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]2.39. [/COLOR]Злоупотребление нарушениями правил сервера [COLOR=rgb(255, 0, 0)]| Ban 7 - 30 дней[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Обход / багоюз',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]2.21. [/COLOR]Запрещено пытаться обходить игровую систему или использовать любые баги сервера [COLOR=rgb(255, 0, 0)]| Ban 15 - 30 дней / PermBan (по согласованию с ГА, ЗГА, руководством тех. специалистов)[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Фракц / раб ТС в ЛЦ',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]2.11. [/COLOR]Запрещено использование рабочего или фракционного транспорта в личных целях [COLOR=rgb(255, 0, 0)]| Jail 30 минут[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Сокрытие нарушителей',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]2.24. [/COLOR]Запрещено скрывать от администрации нарушителей или злоумышленников [COLOR=rgb(255, 0, 0)]| Ban 15 - 30 дней / PermBan + ЧС проекта[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Слив АДМ инфы',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]2.27. [/COLOR]Запрещено распространение информации и материалов, которые имеют непосредственное отношение к работе администрации проекта [COLOR=rgb(255, 0, 0)]| PermBan + ЧС проекта[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Слив лич инфы',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]2.38. [/COLOR]Запрещено распространять личную информацию игроков и их родственников [COLOR=rgb(255, 0, 0)]| Ban 15 - 30 дней / PermBan[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Ущерб экономике',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]2.30. [/COLOR]Запрещено пытаться нанести ущерб экономике сервера [COLOR=rgb(255, 0, 0)]| Ban 15 - 30 дней / PermBan[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Уход от наказания',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]2.34. [/COLOR]Запрещен уход от наказания [COLOR=rgb(255, 0, 0)]| Ban 15 - 30 дней (суммируется к общему наказанию дополнительно)[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Попытка продажи за реал',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]2.42. [/COLOR]Попытка продажи любого игрового имущества или игрового аккаунта за реальные деньги [COLOR=rgb(255, 0, 0)]| PermBan[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Покупка / продажа рейтинга',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]2.48. [/COLOR]Продажа или покупка репутации семьи любыми способами, скрытие нарушителей, читеров лидером семьи [COLOR=rgb(255, 0, 0)]| Обнуление рейтинга семьи / Обнуление игрового аккаунта лидера семьи[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Арест в аук / каз / МП',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]2.50. [/COLOR]Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий [COLOR=rgb(255, 0, 0)]| Ban 7 - 15 дней + увольнение из организации[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Сборка / читы',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]2.22. [/COLOR]Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [COLOR=rgb(255, 0, 0)]| Ban 15 - 30 дней / PermBan[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'П/П ИВ',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]2.28. [/COLOR]Запрещена покупка/продажа внутриигровой валюты в любых ее проявлениях за реальные деньги [COLOR=rgb(255, 0, 0)]| PermBan с обнулением аккаунта + ЧС проекта[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Религ / нац конфликт',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]2.35. [/COLOR]На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате [COLOR=rgb(255, 0, 0)]| Mute 120 минут / Ban 7 дней[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Обман адм',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]2.32. [/COLOR]Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта [COLOR=rgb(255, 0, 0)]| Ban 7 - 15 дней / PermBan[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Оск АДМ',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]2.54. [/COLOR]Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [COLOR=rgb(255, 0, 0)]| Mute 180 минут[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Деструктив к проекту',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]2.40. [/COLOR]Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [COLOR=rgb(255, 0, 0)]| Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором)[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Займ',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]2.57. [/COLOR]Запрещается брать в долг игровые ценности и не возвращать их [COLOR=rgb(255, 0, 0)]| Ban 30 дней / PermBan[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'ᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠ3.00ᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠ',
    },
    {
      title: 'CAPS',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]3.02. [/COLOR]Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате [COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Flood',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]3.05. [/COLOR]Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Translit',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]3.20. [/COLOR]Запрещено использование транслита в любом из чатов [COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Spam',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]3.06. [/COLOR]Запрещено злоупотребление знаков препинания и прочих символов [COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'English',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]3.01. [/COLOR]Общепризнанный язык сервера — русский. Общение в IC чатах во всех Role Play ситуациях обязательно должно проходить исключительно на русском языке [COLOR=rgb(255, 0, 0)]| Устное замечание / Mute 30 минут[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'ООС оск',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]3.03. [/COLOR]Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены [COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Угроза о наказании',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]3.09. [/COLOR]Запрещены любые угрозы о наказании игрока со стороны администрации [COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Мат в VIP',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]3.23. [/COLOR]Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате [COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'IC оск (секс. хар-ра)',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]3.07. [/COLOR]Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата [COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Объявы в инт',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]3.22. [/COLOR]Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) [COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Упом род',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]3.04. [/COLOR]Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [COLOR=rgb(255, 0, 0)]| Mute 120 минут / Ban 7 - 15 дней[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Слив чата',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]3.08. [/COLOR]Запрещены любые формы «слива» посредством использования глобальных чатов [COLOR=rgb(255, 0, 0)]| PermBan[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Ввод в заблуж',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]3.11. [/COLOR]Запрещено введение игроков проекта в заблуждение путем злоупотребления командами [COLOR=rgb(255, 0, 0)]| Ban 15 - 30 дней / PermBan[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Выдача за АДМ',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]3.10. [/COLOR]Запрещена выдача себя за администратора, если таковым не являетесь [COLOR=rgb(255, 0, 0)]| Ban 7 - 15 + ЧС администрации[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Пиар промо',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]3.21. [/COLOR]Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах [COLOR=rgb(255, 0, 0)]| Ban 30 дней[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Полит / религ пропаганда • призыв ко флуду',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]3.18. [/COLOR]Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов [COLOR=rgb(255, 0, 0)]| Mute 120 минут / Ban 10 дней[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'ᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠ4.00ᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠ',
    },
    {
      title: 'FAKE ник',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]4.10. [/COLOR]Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию [COLOR=rgb(255, 0, 0)]| Устное замечание + смена игрового никнейма / PermBan[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Передача аккаунта',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]4.03. [/COLOR]Запрещена совершенно любая передача игровых аккаунтов третьим лицам [COLOR=rgb(255, 0, 0)]| PermBan[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Мульти-акк',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]4.04. [/COLOR]Разрешается зарегистрировать максимально только три игровых аккаунта на сервере [COLOR=rgb(255, 0, 0)]| PermBan[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Оск Nick_Name',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]4.09. [/COLOR]Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные) [COLOR=rgb(255, 0, 0)]| Устное замечание + смена игрового никнейма / PermBan[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Трансфер / удержание имущества',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]4.05. [/COLOR]Запрещено передавать любые игровые ценности между игровыми аккаунтами, а также в целях удержания имущества [COLOR=rgb(255, 0, 0)]| Ban 15 - 30 дней / PermBan[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'ᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠПРОЧЕЕᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠ',
    },
    {
      title: 'Прогул Р/Д',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]1.13. [/COLOR]Запрещено находиться в форме внутри казино, участвовать в битве за контейнеры, участвовать в захвате семейного контейнера, находится на Б/У рынке с целью покупки / продажи авто, а также устраиваться на сторонние работы в форме фракции [COLOR=rgb(255, 0, 0)]| Jail 30 минут[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Госс подработка',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]1.07. [/COLOR]Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, принадлежащей своей фракции [COLOR=rgb(255, 0, 0)]| Jail 30 минут[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Одиночный патруль',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]1.11. [/COLOR]Всем силовым структурам запрещен одиночный патруль или конвоирование, минимум 2 сотрудника [COLOR=rgb(255, 0, 0)]| Jail 30 минут[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'NRP В/Ч',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]2. [/COLOR]За нарушение правил нападения на Войсковую Часть выдаётся предупреждение [COLOR=rgb(255, 0, 0)]| Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ)[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'NRP edit',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]4.01. [/COLOR]Запрещено редактирование объявлений, не соответствующих ПРО [COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'NRP эфир',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]4.02. [/COLOR]Запрещено проведение эфиров, не соответствующих Role Play правилам и логике [COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'NRP коп (поведение)',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]6.03. [/COLOR]Запрещено nRP поведение [COLOR=rgb(255, 0, 0)]| Warn[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'NRP коп (зведзы)',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]6.02. [/COLOR]Запрещено выдавать розыск без Role Play причины [COLOR=rgb(255, 0, 0)]| Warn[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'NRP коп (штраф)',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]7.02. [/COLOR]Запрещено выдавать розыск, штраф без Role Play причины [COLOR=rgb(255, 0, 0)]| Warn[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Реклама СОЦ (voice)',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]3.17. [/COLOR]Запрещена реклама в Voice Chat не связанная с игровым процессом [COLOR=rgb(255, 0, 0)]| Ban 7 - 15 дней[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Музыка (voice)',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]3.14. [/COLOR]Запрещено включать музыку в Voice Chat [COLOR=rgb(255, 0, 0)]| Mute 60 минут[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Шумы (voice)',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]3.16. [/COLOR]Запрещено создавать посторонние шумы или звуки [COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Оск / упом (voice)',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]3.15. [/COLOR]Запрещено оскорблять игроков или родных в Voice Chat [COLOR=rgb(255, 0, 0)]| Mute 120 минут / Ban 7 - 15 дней[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Замена объяв',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(204, 204, 204)]Нарушитель буден наказан по следующему пункту правил:[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[TABLE][TR][TD][LEFT][FONT=times new roman][SIZE=3][COLOR=rgb(255, 0, 0)]4.04. [/COLOR]Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком [COLOR=rgb(255, 0, 0)]| Ban 7 дней + ЧС организации[/COLOR][/SIZE][/FONT][/LEFT][/TD][/TR][/TABLE]<br><br>" +
    '[CENTER][SIZE=3][COLOR=rgb(204, 204, 204)][FONT=times new roman]Решено.[/FONT][/COLOR][/SIZE][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'ᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠОТКАЗАНОᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠ',
    },
    {
      title: 'Недостаточно док-в',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR][/SIZE]<br><br>' +
        "[FONT=times new roman][SIZE=3][COLOR=rgb(204, 204, 204)]Недостаточно предоставленных доказательств для рассмотрения жалобы.[/COLOR][/SIZE]<br><br>" +
        "[SIZE=3][COLOR=rgb(204, 204, 204)]Не создавайте дубликатов темы, иначе Ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT]<br><br>" +
    '[COLOR=rgb(255, 0, 0)][SIZE=3][FONT=times new roman]Отказано.[/FONT][/SIZE][/COLOR][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Отсутствуют док-ва',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR][/SIZE]<br><br>' +
        "[FONT=times new roman][SIZE=3][COLOR=rgb(204, 204, 204)]Отсутствуют доказательства / либо не рабочая ссылка.[/COLOR][/SIZE]<br><br>" +
        "[SIZE=3][COLOR=rgb(204, 204, 204)]Загрузите доказательства на фото-видео хостинги: YouTube, Imgur, Yapx и так далее.[/COLOR][/SIZE][/FONT]<br><br>" +
    '[COLOR=rgb(255, 0, 0)][SIZE=3][FONT=times new roman]Отказано.[/FONT][/SIZE][/COLOR][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Док-ва отредактированы',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR][/SIZE]<br><br>' +
        "[FONT=times new roman][SIZE=3][COLOR=rgb(204, 204, 204)]Доказательства были отредактированы - следовательно, рассмотрению не подлежит.[/COLOR][/SIZE]<br><br>" +
        "[SIZE=3][COLOR=rgb(204, 204, 204)]Не создавайте дубликатов темы, иначе Ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT]<br><br>" +
    '[COLOR=rgb(255, 0, 0)][SIZE=3][FONT=times new roman]Отказано.[/FONT][/SIZE][/COLOR][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Док-ва плохого качества',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR][/SIZE]<br><br>' +
        "[FONT=times new roman][SIZE=3][COLOR=rgb(204, 204, 204)]Предоставленные доказательства плохого качества - следовательно, рассмотрению не подлежит.[/COLOR][/SIZE]<br><br>" +
        "[SIZE=3][COLOR=rgb(204, 204, 204)]Не создавайте дубликатов темы, иначе Ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT]<br><br>" +
    '[COLOR=rgb(255, 0, 0)][SIZE=3][FONT=times new roman]Отказано.[/FONT][/SIZE][/COLOR][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Док-ва в соц. сетях',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR][/SIZE]<br><br>' +
        "[FONT=times new roman][SIZE=3][COLOR=rgb(204, 204, 204)]Доказательства в социальных сетях не принимаются.[/COLOR][/SIZE]<br><br>" +
        "[SIZE=3][COLOR=rgb(204, 204, 204)]Загрузите доказательства на фото-видео хостинги: YouTube, Imgur, Yapx и так далее.[/COLOR][/SIZE][/FONT]<br><br>" +
    '[COLOR=rgb(255, 0, 0)][SIZE=3][FONT=times new roman]Отказано.[/FONT][/SIZE][/COLOR][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Нарушений нет',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR][/SIZE]<br><br>' +
        "[FONT=times new roman][SIZE=3][COLOR=rgb(204, 204, 204)]Нарушений со стороны игрока не было замечено. Ознакомьтесь с правилами проекта по ссылке - [URL='https://forum.blackrussia.online/index.php?categories/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.50/'][U]Тык[/U][/URL].[/COLOR][/SIZE]<br><br>" +
        "[COLOR=rgb(204, 204, 204)][FONT=times new roman][SIZE=3][COLOR=rgb(204, 204, 204)]Не создавайте дубликатов темы, иначе Ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT]<br><br>" +
    '[SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано.[/FONT][/COLOR][/SIZE][/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Нет /time',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR][/SIZE]<br><br>' +
        "[FONT=times new roman][SIZE=3][COLOR=rgb(204, 204, 204)]На доказательствах отсутствует команда /time - следовательно, рассмотрению не подлежит.[/COLOR][/SIZE]<br><br>" +
        "[SIZE=3][COLOR=rgb(204, 204, 204)]Не создавайте дубликатов темы, иначе Ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT]<br><br>" +
    '[COLOR=rgb(255, 0, 0)][SIZE=3][FONT=times new roman]Отказано.[/FONT][/SIZE][/COLOR][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Не по форме',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR][/SIZE]<br><br>' +
        "[FONT=times new roman][SIZE=3][COLOR=rgb(204, 204, 204)]Жалоба составлена не по форме. Ознакомтьесь с правилами подачи жалоб по ссылке - [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/'][U]Тык[/U][/URL].[/COLOR][/SIZE]<br><br>" +
        "[COLOR=rgb(204, 204, 204)][FONT=times new roman][SIZE=3][COLOR=rgb(204, 204, 204)]Не создавайте дубликатов темы, иначе Ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT]<br><br>" +
    '[SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано.[/FONT][/COLOR][/SIZE][/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'В ЖБ на АДМ',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR][/SIZE]<br><br>' +
        "[FONT=times new roman][SIZE=3][COLOR=rgb(204, 204, 204)]Вы ошиблись разделом. Обратитесь в раздел жалоб на администрацию по ссылке - [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.117/'][U]Тык[/U][/URL].[/COLOR][/SIZE]<br><br>" +
        "[COLOR=rgb(204, 204, 204)][FONT=times new roman][SIZE=3][COLOR=rgb(204, 204, 204)]Не создавайте дубликатов темы, иначе Ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT]<br><br>" +
    '[SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано.[/FONT][/COLOR][/SIZE][/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'В ЖБ на сотрудников',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR][/SIZE]<br><br>' +
        "[FONT=times new roman][SIZE=3][COLOR=rgb(204, 204, 204)]Обратитесь в раздел жалоб на сотрудников.[/COLOR][/SIZE]<br><br>" +
        "[SIZE=3][COLOR=rgb(204, 204, 204)]Не создавайте дубликатов темы, иначе Ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT]<br><br>" +
    '[COLOR=rgb(255, 0, 0)][SIZE=3][FONT=times new roman]Отказано.[/FONT][/SIZE][/COLOR][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Дубликат',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR][/SIZE]<br><br>' +
        "[FONT=times new roman][SIZE=3][COLOR=rgb(204, 204, 204)]Ранее был дан ответ на Вашу жалобу.[/COLOR][/SIZE]<br><br>" +
        "[SIZE=3][COLOR=rgb(204, 204, 204)]Не создавайте дубликатов темы, иначе Ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT]<br><br>" +
    '[COLOR=rgb(255, 0, 0)][SIZE=3][FONT=times new roman]Отказано.[/FONT][/SIZE][/COLOR][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: '72ч',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR][/SIZE]<br><br>' +
        "[FONT=times new roman][SIZE=3][COLOR=rgb(204, 204, 204)]Срок написания жалобы составляет три дня (72 часа) с момента совершенного нарушения со стороны игрока сервера.[/COLOR][/SIZE]<br><br>" +
        "[SIZE=3][COLOR=rgb(204, 204, 204)]Не создавайте дубликатов темы, иначе Ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT]<br><br>" +
    '[COLOR=rgb(255, 0, 0)][SIZE=3][FONT=times new roman]Отказано.[/FONT][/SIZE][/COLOR][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Ошибка сервером',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR][/SIZE]<br><br>' +
        "[FONT=times new roman][SIZE=3][COLOR=rgb(204, 204, 204)]Вы ошиблись сервером, подайте жалобу повторно уже на нужный Вам сервер.[/COLOR][/SIZE]<br><br>" +
        "[SIZE=3][COLOR=rgb(204, 204, 204)]Не создавайте дубликатов темы, иначе Ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT]<br><br>" +
    '[COLOR=rgb(255, 0, 0)][SIZE=3][FONT=times new roman]Отказано.[/FONT][/SIZE][/COLOR][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Тайм-коды',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR][/SIZE]<br><br>' +
        "[FONT=times new roman][SIZE=3][COLOR=rgb(204, 204, 204)]Если видеодоказательство длится более 3 минут, Вы должны указать тайм-коды нарушений.[/COLOR][/SIZE]<br><br>" +
        "[SIZE=3][COLOR=rgb(204, 204, 204)]Не создавайте дубликатов темы, иначе Ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT]<br><br>" +
    '[COLOR=rgb(255, 0, 0)][SIZE=3][FONT=times new roman]Отказано.[/FONT][/SIZE][/COLOR][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'От 3-го',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR][/SIZE]<br><br>' +
        "[FONT=times new roman][SIZE=3][COLOR=rgb(204, 204, 204)]Жалоба от третьего лица не принимается (жалоба должна быть подана участником ситуации).[/COLOR][/SIZE]<br><br>" +
        "[SIZE=3][COLOR=rgb(204, 204, 204)]Не создавайте дубликатов темы, иначе Ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT]<br><br>" +
    '[COLOR=rgb(255, 0, 0)][SIZE=3][FONT=times new roman]Отказано.[/FONT][/SIZE][/COLOR][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Читы ХП',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR][/SIZE]<br><br>' +
        "[FONT=times new roman][SIZE=3][COLOR=rgb(204, 204, 204)]В связи с существующими багами в игре - блокировку за GM временно не выдаем.[/COLOR][/SIZE]<br><br>" +
        "[SIZE=3][COLOR=rgb(204, 204, 204)]Не создавайте дубликатов темы, иначе Ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT]<br><br>" +
    '[COLOR=rgb(255, 0, 0)][SIZE=3][FONT=times new roman]Отказано.[/FONT][/SIZE][/COLOR][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Логи не доква',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR][/SIZE]<br><br>' +
        "[FONT=times new roman][SIZE=3][COLOR=rgb(204, 204, 204)]Логи не являются доказательством, нужно иметь малейшее свидетельство о нарушении игрока.[/COLOR][/SIZE]<br><br>" +
        "[SIZE=3][COLOR=rgb(204, 204, 204)]Не создавайте дубликатов темы, иначе Ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT]<br><br>" +
    '[COLOR=rgb(255, 0, 0)][SIZE=3][FONT=times new roman]Отказано.[/FONT][/SIZE][/COLOR][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Видео-фиксация',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR][/SIZE]<br><br>' +
        "[FONT=times new roman][SIZE=3][COLOR=rgb(204, 204, 204)]В данном случае должна присутствовать видео-фиксация, скриншоты не будут являться доказательством.[/COLOR][/SIZE]<br><br>" +
        "[SIZE=3][COLOR=rgb(204, 204, 204)]Не создавайте дубликатов темы, иначе Ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT]<br><br>" +
    '[COLOR=rgb(255, 0, 0)][SIZE=3][FONT=times new roman]Отказано.[/FONT][/SIZE][/COLOR][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Условия сделки',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR][/SIZE]<br><br>' +
        "[FONT=times new roman][SIZE=3][COLOR=rgb(204, 204, 204)]Не хватает условий сделки / либо их вовсе нет - следовательно, рассмотрению не подлежит.[/COLOR][/SIZE]<br><br>" +
        "[SIZE=3][COLOR=rgb(204, 204, 204)]Не создавайте дубликатов темы, иначе Ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT]<br><br>" +
    '[COLOR=rgb(255, 0, 0)][SIZE=3][FONT=times new roman]Отказано.[/FONT][/SIZE][/COLOR][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Проверив логи',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR][/SIZE]<br><br>' +
        "[FONT=times new roman][SIZE=3][COLOR=rgb(204, 204, 204)]После проверки логов, вердикт - нарушений не найдено.[/COLOR][/SIZE]<br><br>" +
        "[SIZE=3][COLOR=rgb(204, 204, 204)]Не создавайте дубликатов темы, иначе Ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT]<br><br>" +
    '[COLOR=rgb(255, 0, 0)][SIZE=3][FONT=times new roman]Отказано.[/FONT][/SIZE][/COLOR][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Не можем наказать',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR][/SIZE]<br><br>' +
        "[FONT=times new roman][SIZE=3][COLOR=rgb(204, 204, 204)]Не можем выдать наказание по предоставленным доказательствам, из-за отсутствия логов.[/COLOR][/SIZE]<br><br>" +
        "[SIZE=3][COLOR=rgb(204, 204, 204)]Не создавайте дубликатов темы, иначе Ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT]<br><br>" +
    '[COLOR=rgb(255, 0, 0)][SIZE=3][FONT=times new roman]Отказано.[/FONT][/SIZE][/COLOR][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'ᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠПереданоᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠ',
    },
    {
      title: 'На рассмотрении',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR][/SIZE]<br><br>' +
        "[FONT=times new roman][SIZE=3][COLOR=rgb(204, 204, 204)]Жалоба взята на рассмотрение, не создавайте дубликатов.[/COLOR][/SIZE][COLOR=rgb(204, 204, 204)][/COLOR]<br><br>" +
        "[SIZE=3][COLOR=rgb(204, 204, 204)]Ожидайте дальнейших ответов в данной теме.[/COLOR][/SIZE][COLOR=rgb(204, 204, 204)] [/COLOR][/FONT]<br><br>" +
    '[COLOR=rgb(255, 152, 0)][SIZE=3][FONT=times new roman]На рассмотрении.[/FONT][/SIZE][/COLOR][/CENTER]',
      prefix: PIN_PREFIX,
      status: true,
    },
    {
      title: 'Тех. спецу',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR][/SIZE]<br><br>' +
        "[FONT=times new roman][SIZE=3][COLOR=rgb(204, 204, 204)]Жалоба передана [COLOR=rgb(41, 105, 176)]Техническому специалисту[/COLOR].[/COLOR][/SIZE][/FONT]<br><br>" +
    '[COLOR=rgb(255, 0, 0)][SIZE=3][FONT=times new roman]Ожидайте дальнейших ответов в данной теме.[/FONT][/SIZE][/COLOR][/CENTER]',
      prefix: TEX_PREFIX,
      status: true,
    },
    {
      title: 'Команде',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR][/SIZE]<br><br>' +
        "[FONT=times new roman][SIZE=3][COLOR=rgb(204, 204, 204)]Жалоба передана [COLOR=rgb(255, 213, 51)]Команде проекта[/COLOR].[/COLOR][/SIZE][COLOR=rgb(204, 204, 204)] [/COLOR][/FONT]<br><br>" +
    '[COLOR=rgb(255, 0, 0)][SIZE=3][FONT=times new roman]Ожидайте дальнейших ответов в данной теме.[/FONT][/SIZE][/COLOR][/CENTER]',
      prefix: COMMAND_PREFIX,
      status: true,
    },
    {
      title: 'ГА',
      content:
    '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)][FONT=times new roman]Доброго времени суток уважаемый игрок.[/FONT][/COLOR][/SIZE]<br><br>' +
        "[FONT=times new roman][SIZE=3][COLOR=rgb(204, 204, 204)]Жалоба передана [COLOR=rgb(255, 0, 0)][URL='https://forum.blackrussia.online/members/alexander-lobanov.41376/']Главному администратору[/URL][/COLOR][/COLOR][COLOR=rgb(204, 204, 204)].[/COLOR][/SIZE][/FONT]<br><br>" +
    '[COLOR=rgb(255, 0, 0)][SIZE=3][FONT=times new roman]Ожидайте дальнейших ответов в данной теме.[/FONT][/SIZE][/COLOR][/CENTER]',
      prefix: GA_PREFIX,
      status: true,
    }
  ];
$(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');


    // Добавление кнопок при загрузке страницы
    addButton('~', 'pin');
    addButton('☑', 'accepted');
    addButton('☒', 'unaccept');
    addButton('│');
    addButton('卍', 'selectAnswer');



    // Поиск информации о теме
    const threadData = getThreadData();


    $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
    $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
    $('button#close').click(() => editThreadData(CLOSE_PREFIX, false));


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
    12 < hours && hours <= 18
      ? 'Доброе утро'
      : 18 < hours && hours <= 21
      ? 'Добрый день'
      : 21 < hours && hours <= 4
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


