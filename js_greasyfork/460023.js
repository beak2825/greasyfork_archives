// ==UserScript==
// @name         Script Black Russia | для КФ  
// @namespace    https://forum.blackrussia.online
// @version      1.2
// @description 🏛️
// @author      J. Hoffm
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @grant        none
// @license    MIT
// @icon   https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @downloadURL https://update.greasyfork.org/scripts/460023/Script%20Black%20Russia%20%7C%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/460023/Script%20Black%20Russia%20%7C%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RASSMOTENO_PREFIX = 9; // Prefix that will be set when solving the problem
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const SPECY_PREFIX = 11;
const TEX_PREFIX = 13;
const buttons = [
    {
        title: '===================================================',
    },
    {
        title: '| Приветсвие | ',
        content: 
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/COLOR][/I][/CENTER]',
    },
    {
        title: '| Одобрено | ',
        content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/COLOR][/I][/CENTER]<br><br>' +
        '[CENTER][COLOR=rgb(0, 255, 0)][I][FONT=times new roman]Одобрено[/FONT][/I][/COLOR][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: ' | Отказано |',
        content: 
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/COLOR][/I][/CENTER]<br><br>' +
        "[CENTER][COLOR=rgb(255, 0, 0)][I][FONT=times new roman]Отказано[/FONT][/I][/COLOR][I][FONT=times new roman], Закрыто[COLOR=rgb(255, 0, 0)].[/COLOR][/FONT][/I][/CENTER]<br>" +
        '[CENTER][I][FONT=georgia]Приятной игры на [COLOR=rgb(0, 0, 0)]Black[/COLOR] Russia [COLOR=rgb(119, 255, 255)]Role Play[/COLOR][/FONT][/I][/CENTER]',
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: ' | На ГА | ',
        content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/COLOR][/I][/CENTER]<br><br>' +
        "[CENTER][I][FONT=georgia]Ваша жалоба передано на [COLOR=rgb(255, 0, 0)]Главному администратору[/COLOR][COLOR=rgb(255, 255, 255)].[/COLOR][/FONT][/I][/CENTER]<br><br>" +
        '[CENTER][I][FONT=georgia]Ожидайте ответа.[/FONT][/I][/CENTER]',
        prefix: GA_PREFIX,
        status: false,
    },
    {
        title: ' | На тех-спец | ',
        content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/COLOR][/I][/CENTER]<br><br>' +
        "[CENTER][I][FONT=georgia]Ваша жалоба передано на [COLOR=rgb(0, 0, 255)]техническому специалисту.[/COLOR][/FONT]<br><br>" +
        '[FONT=times new roman]Ожидайте ответа[/FONT][/I][/CENTER]',
        prefix: TEX_PREFIX,
        status: false,
    },
    {
        title: '|----------------------------------Одобреные ответы----------------------------- |',
    },
    {
        title: ' | Нрп поведение | ',
        content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/COLOR][/I][/CENTER]<br><br>' +
        "[CENTER][I][FONT=georgia]Игрок будет наказан по данному пункту правил: [/FONT][/I][/CENTER]<br>" +
        "[CENTER][I][FONT=georgia][COLOR=rgb(255, 0, 0)]2.01[/COLOR]. Запрещено поведение, нарушающее нормы процессов Role Play режима игры | Jail 30 минут.[/FONT][/I][/CENTER]<br><br>" +
        "[CENTER][I][FONT=times new roman][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], Закрыто[COLOR=rgb(0, 255, 0)].[/COLOR][/FONT][/I][FONT=times new roman][I][/I][/FONT]<br>" +
        '[I][FONT=times new roman]Приятной игры на [COLOR=rgb(0, 0, 0)]Black[/COLOR] Russia [COLOR=rgb(119, 255, 255)]Role Play[/COLOR].[/FONT][/I][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: ' | Уход от Role Play | ',
        content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/COLOR][/I][/CENTER]<br><br>' +
        "[CENTER][I][FONT=georgia]Игрок будет наказан по данному пункту правил[COLOR=rgb(204, 204, 204)]:[/COLOR]<br>" +
        "[COLOR=rgb(255, 0, 0)]2.02[/COLOR]. Запрещено целенаправленно уходить от Role Play процесса всеразличными способами | Jail 30 минут / Warn[COLOR=rgb(204, 204, 204)].[/COLOR]<br><br>" +
        "[COLOR=rgb(0, 255, 0)]Одобрено[/COLOR][COLOR=rgb(204, 204, 204)], [/COLOR][COLOR=rgb(255, 255, 255)]Закрыто[/COLOR][COLOR=rgb(204, 204, 204)].[/COLOR]<br>" +
        '[COLOR=rgb(255, 255, 255)]Приятной игры на Black Russia[/COLOR][COLOR=rgb(204, 204, 204)] [/COLOR][COLOR=rgb(119, 255, 255)]Role Play[/COLOR][COLOR=rgb(204, 204, 204)].[/COLOR][/FONT][/I][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: ' | Nrp Drive |',
        content: 
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/COLOR][/I][/CENTER]<br><br>' +
        "[CENTER][I][FONT=georgia]Игрок будет наказан по данному пункту правил[COLOR=rgb(204, 204, 204)]:[/COLOR] <br><br>" +
        "[COLOR=rgb(255, 0, 0)]2.02[/COLOR]. Запрещено целенаправленно уходить от Role Play процесса всеразличными способами | [COLOR=rgb(204, 0, 204)]Jail 30 минут / Warn.[/COLOR][/FONT][/I][FONT=georgia][I]<br><br>" +
        "[COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], Закрыто[COLOR=rgb(204, 204, 204)].[/COLOR][/I][/FONT]<br>" +
        '[I][FONT=georgia]Приятной игры на [COLOR=rgb(0, 0, 0)]Black[/COLOR] Russia [COLOR=rgb(119, 255, 255)]Role Play[/COLOR][COLOR=rgb(204, 204, 204)].[/COLOR][/FONT][/I][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: ' | NRP Обман | ',
        content: 
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/COLOR][/I][/CENTER]<br><br>' +
        "[CENTER][I][FONT=georgia]Игрок будет наказан по данному пункту правил[COLOR=rgb(204, 204, 204)]:[/COLOR] [/FONT][/I][FONT=georgia][I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)]2.05[/COLOR]. Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики | [COLOR=rgb(255, 0, 0)]PermBan[/COLOR]<br><br>" +
        "[COLOR=rgb(0, 255, 0)]Одобрено[/COLOR][COLOR=rgb(255, 255, 255)],[/COLOR] Закрыто[COLOR=rgb(204, 204, 204)].[/COLOR][/I][/FONT]<br>" +
        '[I][FONT=georgia]Приятной игры на [COLOR=rgb(0, 0, 0)]Black[/COLOR] Russia [COLOR=rgb(119, 255, 255)]Role Play[/COLOR][COLOR=rgb(204, 204, 204)].[/COLOR][/FONT][/I][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: ' | Аморал | ',
        content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/COLOR][/I][/CENTER]<br><br>' +
        "[CENTER][I][FONT=times new roman]Игрок будет наказан по данному пункту правил[COLOR=rgb(209, 213, 216)]:[/COLOR] [/FONT][/I][FONT=times new roman][I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)]2.08[/COLOR]. Запрещена любая форма аморальных действий сексуального характера в сторону игроков | [COLOR=rgb(255, 0, 0)]Jail 30 минут / Warn[/COLOR]<br><br>" +
        "[COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], Закрыто[COLOR=rgb(239, 239, 239)].[/COLOR]<br>" +
        '[CENTER][I][FONT=georgia]Приятной игры на [COLOR=rgb(0, 0, 0)]Black[/COLOR] Russia [COLOR=rgb(119, 255, 255)]Role Play[/COLOR][/FONT][/I][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: ' | DM | ',
        content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/COLOR][/I][/CENTER]<br><br>' +
        "[CENTER][I][FONT=times new roman]Игрок будет наказан по данному пункту правил[COLOR=rgb(239, 239, 239)]: [/COLOR][/FONT][/I][FONT=times new roman][I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)]2.[/COLOR][/I][/FONT][I][FONT=times new roman][COLOR=rgb(255, 0, 0)]19[/COLOR]. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины | [COLOR=rgb(255, 0, 0)]Jail 60 минут.[/COLOR][/FONT][/I][FONT=times new roman][I][/I][/FONT]<br><br>" +
        "[I][FONT=times new roman][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], Закрыто[COLOR=rgb(239, 239, 239)].[/COLOR][/FONT][/I][/CENTER]<br>" +
        '[CENTER][I][FONT=georgia]Приятной игры на [COLOR=rgb(0, 0, 0)]Black[/COLOR] Russia [COLOR=rgb(119, 255, 255)]Role Play[/COLOR][/FONT][/I][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: ' | DB | ',
        content: 
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/COLOR][/I][/CENTER]<br><br>' +
        "[CENTER][FONT=times new roman][I]Игрок будет наказан по данному пункту  правил[COLOR=rgb(239, 239, 239)]: [/COLOR][/I][/FONT][I][FONT=times new roman]<br><br>" +
        "[COLOR=rgb(255, 0, 0)]2.13[/COLOR]. Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта | [COLOR=rgb(255, 0, 0)]Jail 60 минут.[/COLOR][/FONT][/I]<br><br>" +
        "[FONT=times new roman][I][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], Закрыто[COLOR=rgb(239, 239, 239)].[/COLOR][/I][/FONT][/CENTER]<br>" +
        '[CENTER][I][FONT=georgia]Приятной игры на [COLOR=rgb(0, 0, 0)]Black[/COLOR] Russia [COLOR=rgb(119, 255, 255)]Role Play[/COLOR][/FONT][/I][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: ' | RK | ',
        content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/COLOR][/I][/CENTER]<br><br>' +
        "[CENTER][I][FONT=georgia]Игрок будет наказан по данному пункту правил[COLOR=rgb(239, 239, 239)]:[/COLOR] [/FONT][/I][FONT=georgia][I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)]2.14[/COLOR]. Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти | [COLOR=rgb(255, 0, 0)]Jail 30 минут[/COLOR][/I][/FONT]<br><br>" +
        "[I][FONT=georgia][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], Закрыто[COLOR=rgb(239, 239, 239)].[/COLOR][/FONT][/I][/CENTER]<br>" +
        '[CENTER][I][FONT=georgia]Приятной игры на [COLOR=rgb(0, 0, 0)]Black[/COLOR] Russia [COLOR=rgb(119, 255, 255)]Role Play[/COLOR][/FONT][/I][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: ' | TK | ',
        content: 
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/COLOR][/I][/CENTER]<br><br>' +
        "[CENTER][I][FONT=georgia]Игрок будет наказан по данному пункту правил[COLOR=rgb(239, 239, 239)]:[/COLOR] [/FONT][/I][FONT=georgia][I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)]2.15[/COLOR]. Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины | [COLOR=rgb(255, 0, 0)]Jail 60 минут / Warn (за два и более убийства)[/COLOR][/I][/FONT]<br><br>" +
        "[I][FONT=georgia][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], Закрыто[COLOR=rgb(239, 239, 239)].[/COLOR][/FONT][/I][/CENTER]<br>" +
        '[CENTER][I][FONT=georgia]Приятной игры на [COLOR=rgb(0, 0, 0)]Black[/COLOR] Russia [COLOR=rgb(119, 255, 255)]Role Play[/COLOR][/FONT][/I][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: ' | SK | ',
        content: 
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/COLOR][/I][/CENTER]<br><br>' +
        "[CENTER][I][FONT=georgia]Игрок будет наказан по данному пункту правил[COLOR=rgb(239, 239, 239)]:[/COLOR] [/FONT][/I][FONT=georgia][I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)]2.16[/COLOR]. Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них | [COLOR=rgb(255, 0, 0)]Jail 60 минут / Warn (за два и более убийства)[/COLOR][/I][/FONT]<br><br>" +
        "[I][FONT=georgia][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], Закрыто[COLOR=rgb(239, 239, 239)].[/COLOR][/FONT][/I][/CENTER]<br>" +
        '[CENTER][I][FONT=georgia]Приятной игры на [COLOR=rgb(0, 0, 0)]Black[/COLOR] Russia [COLOR=rgb(119, 255, 255)]Role Play[/COLOR][/FONT][/I][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: ' | PG |',
        content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/COLOR][/I][/CENTER]<br><br>' +
        "[CENTER][I][FONT=georgia]Игрок будет наказан по данному пункту правил[COLOR=rgb(239, 239, 239)]: [/COLOR][/FONT][/I][FONT=georgia][I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)]2.17[/COLOR]. Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь | [COLOR=rgb(255, 0, 0)]Jail 30 минут[/COLOR][/I][/FONT]<br><br>" +
        "[I][FONT=georgia][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], Закрыто[COLOR=rgb(239, 239, 239)].[/COLOR][/FONT][/I][/CENTER]<br>" +
        '[CENTER][I][FONT=georgia]Приятной игры на [COLOR=rgb(0, 0, 0)]Black[/COLOR] Russia [COLOR=rgb(119, 255, 255)]Role Play[/COLOR][/FONT][/I][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: ' | MG | ',
        content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/COLOR][/I][/CENTER]<br><br>' +
        "[CENTER][I][FONT=georgia]Игрок будет наказан по данному пункту правил[COLOR=rgb(239, 239, 239)]:[/COLOR][/FONT][/I][FONT=georgia][I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)]2.18[/COLOR]. Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе | [COLOR=rgb(255, 0, 0)]Mute 30 минут[/COLOR][/I][/FONT]<br><br>" +
        "[I][FONT=georgia][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], Закрыто[COLOR=rgb(239, 239, 239)].[/COLOR][/FONT][/I][/CENTER]<br>" +
        '[CENTER][I][FONT=georgia]Приятной игры на [COLOR=rgb(0, 0, 0)]Black[/COLOR] Russia [COLOR=rgb(119, 255, 255)]Role Play[/COLOR][/FONT][/I][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: ' | Масс DM | ',
        content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/COLOR][/I][/CENTER]<br><br>' +
        "[CENTER][I][FONT=georgia]Игрок будет наказан по данному пункту правил[COLOR=rgb(239, 239, 239)]: [/COLOR][/FONT][/I][FONT=georgia][I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)]2.20[/COLOR]. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более | [COLOR=rgb(255, 0, 0)]Warn / Ban 3 - 7 дней[/COLOR][/I][/FONT]<br><br>" +
        "[I][FONT=georgia][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], Закрыто[COLOR=rgb(239, 239, 239)].[/COLOR][/FONT][/I][/CENTER]<br>" + 
        '[CENTER][I][FONT=georgia]Приятной игры на [COLOR=rgb(0, 0, 0)]Black[/COLOR] Russia [COLOR=rgb(119, 255, 255)]Role Play[/COLOR][/FONT][/I][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: ' | Чит/Сборка/Софт | ',
        content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/COLOR][/I][/CENTER]<br><br>' +
        "[CENTER][I][FONT=times new roman]Нарушитель будет наказан по данному пункту правил[COLOR=rgb(239, 239, 239)]:[/COLOR] [/FONT][/I][FONT=times new roman][I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)]2.22[/COLOR]. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan[/COLOR]<br><br>" +
        "[/I][/FONT][I][FONT=times new roman][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], Закрыто[COLOR=rgb(239, 239, 239)].[/COLOR][/FONT][/I][/CENTER]<br>" +
        '[CENTER][I][FONT=georgia]Приятной игры на [COLOR=rgb(0, 0, 0)]Black[/COLOR] Russia [COLOR=rgb(119, 255, 255)]Role Play[/COLOR][/FONT][/I][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: ' | Нонрп коп | ',
        content: 
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/COLOR][/I][/CENTER]<br><br>' +
        "[CENTER][I][FONT=georgia]Игрок будет наказан по данному пункту правил:  [/FONT][/I][/CENTER]<br><br>" +
        "[CENTER][I][FONT=georgia][COLOR=rgb(255, 0, 0)]6.03[/COLOR]. Запрещено оказывать задержание без Role Play отыгровки | [COLOR=rgb(255, 0, 0)]Warn[/COLOR][COLOR=rgb(239, 239, 239)].[/COLOR]<br><br>" +
        "[COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], Закрыто[COLOR=rgb(239, 239, 239)].[/COLOR][/FONT][/I][/CENTER]<br>" +
        '[CENTER][I][FONT=georgia]Приятной игры на [COLOR=rgb(0, 0, 0)]Black[/COLOR] Russia [COLOR=rgb(119, 255, 255)]Role Play[/COLOR][/FONT][/I][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: ' | Розыск/Штраф без причины | ',
        content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/COLOR][/I][/CENTER]<br><br>' +
        "[CENTER][FONT=georgia][I]Игрок будет наказан по данному пункту [/I][/FONT][I][FONT=georgia]правил[COLOR=rgb(239, 239, 239)]:[/COLOR] <br><br>" +
        "[COLOR=rgb(255, 0, 0)]7.02[/COLOR]. Запрещено выдавать розыск,штраф без Role Play причины | [COLOR=rgb(255, 0, 0)]Warn[/COLOR][/FONT][/I]<br><br>" +
        "[FONT=georgia][I][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], Закрыто[COLOR=rgb(239, 239, 239)].[/COLOR][/I][/FONT][/CENTER]<br>" +
        '[CENTER][I][FONT=georgia]Приятной игры на [COLOR=rgb(0, 0, 0)]Black[/COLOR] Russia [COLOR=rgb(119, 255, 255)]Role Play[/COLOR][/FONT][/I][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title:' | Политика | ',
        content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/COLOR][/I][/CENTER]<br><br>' +
        "[CENTER][I][FONT=georgia]Игрок будет наказан по данному пункту правил[COLOR=rgb(239, 239, 239)]:[/COLOR][/FONT][/I][FONT=georgia][I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)]3.18[/COLOR]. Запрещено политическое и религиозное пропагандирование | [COLOR=rgb(255, 0, 0)]Mute 120 минут / Ban 10 дней[/COLOR]<br><br>" +
        "[/I][/FONT][I][FONT=georgia][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], Закрыто[COLOR=rgb(239, 239, 239)].[/COLOR][/FONT][/I][/CENTER]<br>" +
        '[CENTER][I][FONT=georgia]Приятной игры на [COLOR=rgb(0, 0, 0)]Black[/COLOR] Russia [COLOR=rgb(119, 255, 255)]Role Play[/COLOR][/FONT][/I][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: ' | Реклама | ',
        content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/COLOR][/I][/CENTER]<br><br>' +
        "[CENTER][I][FONT=times new roman]Игрок будет наказан по данному пункту правил[COLOR=rgb(239, 239, 239)]:[/COLOR] [/FONT][/I][FONT=times new roman][I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)]2.31[/COLOR]. Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное | [COLOR=rgb(255, 0, 0)]Ban 7 дней / PermBan[/COLOR][/I][/FONT]<br><br>" +
        "[I][FONT=times new roman][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], Закрыто[COLOR=rgb(239, 239, 239)].[/COLOR][/FONT][/I][/CENTER]<br>" +
        '[CENTER][I][FONT=georgia]Приятной игры на [COLOR=rgb(0, 0, 0)]Black[/COLOR] Russia [COLOR=rgb(119, 255, 255)]Role Play[/COLOR][/FONT][/I][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: ' | Уход от наказание | ',
        content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/COLOR][/I][/CENTER]<br><br>' +
        "[CENTER][I][FONT=georgia]Игрок будет наказан по данному пункту правил[COLOR=rgb(239, 239, 239)]: [/COLOR][/FONT][/I][FONT=georgia][I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)]2.34[/COLOR]. Запрещен уход от наказания | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней (суммируется к общему наказанию дополнительно)[/COLOR][/I][/FONT]<br><br>" +
        "[I][FONT=georgia][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], Закрыто[COLOR=rgb(239, 239, 239)].[/COLOR][/FONT][/I][/CENTER]<br>" +
        '[CENTER][I][FONT=georgia]Приятной игры на [COLOR=rgb(0, 0, 0)]Black[/COLOR] Russia [COLOR=rgb(119, 255, 255)]Role Play[/COLOR][/FONT][/I][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: ' | IC и ООС конфликты | ',
        content: 
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/COLOR][/I][/CENTER]<br><br>' +
        "[CENTER][I][FONT=georgia]Игрок будет наказан по данному пункту правил[COLOR=rgb(239, 239, 239)]: [/COLOR][/FONT][/I][FONT=georgia][I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)]2.35[/COLOR]. На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате | [COLOR=rgb(255, 0, 0)]Mute 120 минут / Ban 7 дней[/COLOR][/I][/FONT]<br><br>" +
        "[I][FONT=georgia][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], Закрыто[COLOR=rgb(239, 239, 239)].[/COLOR][/FONT][/I][/CENTER]<br>" +
        '[CENTER][I][FONT=georgia]Приятной игры на [COLOR=rgb(0, 0, 0)]Black[/COLOR] Russia [COLOR=rgb(119, 255, 255)]Role Play[/COLOR][/FONT][/I][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: ' | ЕПП | ',
        content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/COLOR][/I][/CENTER]<br><br>' +
        "[CENTER][I][FONT=georgia]Игрок будет наказан по данному пункту правил[COLOR=rgb(239, 239, 239)]:[/COLOR] [/FONT][/I][FONT=georgia][I]<br><br>" +
        "[COLOR=rgb(255, 0, 9)]2.46[/COLOR]. Запрещено ездить по полям на любом транспорте | [COLOR=rgb(255, 0, 0)]Jail 30 минут.[/COLOR][/I][/FONT]<br><br>" +
        "[I][FONT=georgia][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], Закрыто[COLOR=rgb(239, 239, 239)].[/COLOR][/FONT][/I][/CENTER]<br>" +
        '[CENTER][I][FONT=georgia]Приятной игры на [COLOR=rgb(0, 0, 0)]Black[/COLOR] Russia [COLOR=rgb(119, 255, 255)]Role Play[/COLOR][/FONT][/I][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: ' | ЕПП (инкос/фура) | ',
        content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/COLOR][/I][/CENTER]<br><br>' +
        "[CENTER][I][FONT=georgia]Игрок будет наказан по данному пункту правил[COLOR=rgb(239, 239, 239)]: [/COLOR][/FONT][/I][FONT=georgia][I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)]2.47[/COLOR]. Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) | [COLOR=rgb(255, 0, 0)]Jail 60 минут[/COLOR][/I][/FONT]<br><br>" +
        "[I][FONT=georgia][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], Закрыто[COLOR=rgb(239, 239, 239)].[/COLOR][/FONT][/I][/CENTER]<br>" +
        '[CENTER][I][FONT=georgia]Приятной игры на [COLOR=rgb(0, 0, 0)]Black[/COLOR] Russia [COLOR=rgb(119, 255, 255)]Role Play[/COLOR][/FONT][/I][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: ' | Арест в интерьере | ',
        content: 
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/COLOR][/I][/CENTER]<br><br>' +
        "[CENTER][I][FONT=georgia]Игрок будет наказа по данному пункту правил[COLOR=rgb(239, 239, 239)]: [/COLOR][/FONT][/I][FONT=georgia][I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)]2.50[/COLOR]. Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий | [COLOR=rgb(255, 0, 0)]Ban 7 - 15 дней + увольнение из организации[/COLOR][/I][/FONT]<br><br>" +
        "[I][FONT=georgia][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], Закрыто[COLOR=rgb(239, 239, 239)].[/COLOR][/FONT][/I][/CENTER]<br>" +
        '[CENTER][I][FONT=georgia]Приятной игры на [COLOR=rgb(0, 0, 0)]Black[/COLOR] Russia [COLOR=rgb(119, 255, 255)]Role Play[/COLOR][/FONT][/I][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: ' | Оск адм | ',
        content: 
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/COLOR][/I][/CENTER]<br><br>' +
        "[CENTER][I][FONT=georgia]Игрок будет наказан по данному пункту правил[COLOR=rgb(239, 239, 239)]:[/COLOR] [/FONT][/I][FONT=georgia][I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)]2.54[/COLOR]. Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации | [COLOR=rgb(255, 0, 0)]Mute 180 минут.[/COLOR][/I][/FONT]<br><br>" +
        "[I][FONT=georgia][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], Закрыто[COLOR=rgb(239, 239, 239)].[/COLOR][/FONT][/I][/CENTER]<br>" +
        '[CENTER][I][FONT=georgia]Приятной игры на [COLOR=rgb(0, 0, 0)]Black[/COLOR] Russia [COLOR=rgb(119, 255, 255)]Role Play[/COLOR][/FONT][/I][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: ' | Слив Склада | ',
        content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/COLOR][/I][/CENTER]<br><br>' +
        "[CENTER][I][FONT=georgia]Игрок будет наказан по данному пункту правил: [/FONT][/I][FONT=georgia][I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)]2.09[/COLOR]. Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan.[/COLOR][/I][/FONT]<br><br>" +
        "[I][FONT=georgia][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], Закрыто.[/FONT][/I][/CENTER]<br>" +
        '[CENTER][I][FONT=georgia]Приятной игры на [COLOR=rgb(0, 0, 0)]Black[/COLOR] Russia [COLOR=rgb(119, 255, 255)]Role Play[/COLOR][/FONT][/I][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: ' | Выдача себя за адм | ',
        content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/COLOR][/I][/CENTER]<br><br>' +
        "[CENTER][I][FONT=georgia]Игрок будет наказан по данному пункту правил[COLOR=rgb(239, 239, 239)]: [/COLOR][/FONT][/I]<br><br>" +
        "[FONT=georgia][I][COLOR=rgb(255, 0, 0)]3.10[/COLOR]. Запрещена выдача себя за администратора, если таковым не являетесь | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 + ЧС администрации[/COLOR][/I][/FONT]<br><br>" +
        "[I][FONT=georgia][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], Закрыто[COLOR=rgb(239, 239, 239)].[/COLOR][/FONT][/I][/CENTER]<br>" +
        '[CENTER][I][FONT=georgia]Приятной игры на [COLOR=rgb(0, 0, 0)]Black[/COLOR] Russia [COLOR=rgb(119, 255, 255)]Role Play[/COLOR][/FONT][/I][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: '|_________________________________ Игровые чаты_________________________________________|'
    },
    {
        title: '| CapsLock | ',
        content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/COLOR][/I][/CENTER]<br><br>' +
        "[CENTER][I][FONT=georgia]Игрок будет наказан по данному пункту[COLOR=rgb(239, 239, 239)]:[/COLOR][/FONT][/I][FONT=georgia][I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)]3.02[/COLOR]. Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате | [COLOR=rgb(255, 0, 0)]Mute 30 минут[/COLOR][/I][/FONT]<br><br>" +
        "[I][FONT=georgia][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], Закрыто[COLOR=rgb(239, 239, 239)].[/COLOR][/FONT][/I][/CENTER]<br>" +
        '[CENTER][I][FONT=georgia]Приятной игры на [COLOR=rgb(0, 0, 0)]Black[/COLOR] Russia [COLOR=rgb(119, 255, 255)]Role Play[/COLOR][/FONT][/I][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: ' | Упом род | ',
        content: 
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/COLOR][/I][/CENTER]<br><br>' +
        "[CENTER][I][FONT=georgia]Игрок будет наказан по данному пункту правил[COLOR=rgb(239, 239, 239)]: [/COLOR][/FONT][/I][FONT=georgia][I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)]3.04[/COLOR]. Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) | [COLOR=rgb(255, 0, 0)]Mute 120 минут / Ban 7 - 15 дней[/COLOR][/I][/FONT]<br><br>" +
        "[I][FONT=georgia][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], Закрыто[COLOR=rgb(239, 239, 239)].[/COLOR][/FONT][/I][/CENTER]<br>" +
        '[CENTER][I][FONT=georgia]Приятной игры на [COLOR=rgb(0, 0, 0)]Black[/COLOR] Russia [COLOR=rgb(119, 255, 255)]Role Play[/COLOR][/FONT][/I][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: ' | ООС оск | ',
        content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/COLOR][/I][/CENTER]<br><br>' +
        "[CENTER][I][FONT=georgia]Игрок будет наказан по данному пункту правил[COLOR=rgb(239, 239, 239)]:[/COLOR][/FONT][/I][FONT=georgia][I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)]3.03[/COLOR]. Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены | [COLOR=rgb(255, 0, 0)]Mute 30 минут[/COLOR][/I][/FONT]<br><br>" +
        "[I][FONT=georgia][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR],  Закрыто[COLOR=rgb(239, 239, 239)].[/COLOR][/FONT][/I][/CENTER]<br>" +
        '[CENTER][I][FONT=georgia]Приятной игры на [COLOR=rgb(0, 0, 0)]Black[/COLOR] Russia [COLOR=rgb(119, 255, 255)]Role Play[/COLOR][/FONT][/I][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: ' | Флуд | ',
        content: 
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/COLOR][/I][/CENTER]<br><br>' +
        "[CENTER][I][FONT=georgia]Игрок будет наказан по данному пункту правил:[/FONT][/I]<br><br>" +
        "[FONT=georgia][I][COLOR=rgb(255, 0, 0)]3.05[/COLOR]. Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока | [COLOR=rgb(255, 0, 0)]Mute 30 минут.[/COLOR][/I][/FONT]<br><br>" +
        "[I][FONT=georgia][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], Закрыто[COLOR=rgb(239, 239, 239)].[/COLOR][/FONT][/I][/CENTER]<br>" +
        '[CENTER][I][FONT=georgia]Приятной игры на [COLOR=rgb(0, 0, 0)]Black[/COLOR] Russia [COLOR=rgb(119, 255, 255)]Role Play[/COLOR][/FONT][/I][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title:  ' | Злоуп знаками | ',
        content: 
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/COLOR][/I][/CENTER]<br><br>' +
        "[CENTER][I][FONT=georgia]Игрок будет наказан по данному пункту правил[COLOR=rgb(239, 239, 239)]:[/COLOR] [/FONT][/I][FONT=georgia][I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)]3.06[/COLOR]. Запрещено злоупотребление знаков препинания и прочих символов | [COLOR=rgb(255, 0, 0)]Mute 30 минут[/COLOR][/I][/FONT]<br><br>" +
        "[I][FONT=georgia][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], Закрыто[COLOR=rgb(239, 239, 239)].[/COLOR][/FONT][/I][/CENTER]<br>" +
        '[CENTER][I][FONT=georgia]Приятной игры на [COLOR=rgb(0, 0, 0)]Black[/COLOR] Russia [COLOR=rgb(119, 255, 255)]Role Play[/COLOR][/FONT][/I][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: ' | Слив | ',
        content: 
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/COLOR][/I][/CENTER]<br><br>' +
        "[CENTER][I][FONT=georgia]Игрок будет наказан по данному пункту правил[COLOR=rgb(239, 239, 239)]:[/COLOR][/FONT][/I]<br><br>" +
        "[FONT=georgia][I][COLOR=rgb(255, 0, 0)]3.08[/COLOR]. Запрещены любые формы «слива» посредством использования глобальных чатов | [COLOR=rgb(255, 0, 0)]PermBan[/COLOR][/I][/FONT]<br><br>" +
        "[I][FONT=georgia][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], Закрыто[COLOR=rgb(239, 239, 239)].[/COLOR][/FONT][/I][/CENTER]<br>" +
        '[CENTER][I][FONT=georgia]Приятной игры на [COLOR=rgb(0, 0, 0)]Black[/COLOR] Russia [COLOR=rgb(119, 255, 255)]Role Play[/COLOR][/FONT][/I][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: ' | Угрозы | ',
        content: 
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/COLOR][/I][/CENTER]<br><br>' +
        "[CENTER][I][FONT=georgia]Игрок будет наказан по данному пункту правил[COLOR=rgb(239, 239, 239)]:[/COLOR] [/FONT][/I][FONT=georgia][I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)]3.09[/COLOR]. Запрещены любые угрозы о наказании игрока со стороны администрации | [COLOR=rgb(255, 0, 0)]Mute 30 минут[/COLOR][/I][/FONT]<br><br>" +
        "[I][FONT=georgia][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], Закрыто[COLOR=rgb(239, 239, 239)].[/COLOR][/FONT][/I][/CENTER]<br>" +
        '[CENTER][I][FONT=georgia]Приятной игры на [COLOR=rgb(0, 0, 0)]Black[/COLOR] Russia [COLOR=rgb(119, 255, 255)]Role Play[/COLOR][/FONT][/I][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: ' | Ввод заблуждение | ',
        content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/COLOR][/I][/CENTER]<br><br>' +
        "[CENTER][I][FONT=georgia]Игрок будет наказан по данному пункту правил[COLOR=rgb(239, 239, 239)]: [/COLOR][/FONT][/I][FONT=georgia][I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)]3.11[/COLOR]. Запрещено введение игроков проекта в заблуждение путем злоупотребления командами | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan[/COLOR][/I][/FONT]<br><br>" +
        "[I][FONT=georgia][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], Закрыто[COLOR=rgb(239, 239, 239)].[/COLOR][/FONT][/I][/CENTER]<br>" +
        '[CENTER][I][FONT=georgia]Приятной игры на [COLOR=rgb(0, 0, 0)]Black[/COLOR] Russia [COLOR=rgb(119, 255, 255)]Role Play[/COLOR][/FONT][/I][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false,
    }
   
    
];
 
$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
	// Добавление кнопок при загрузке страницы
    addButton('На рассмотрение 🍁', 'pin');
    addButton('КП', 'teamProject');
    addButton('Га', 'Ga');
    addButton('Спецу', 'Spec');
    addButton('Одобрено', 'accepted');
    addButton('Отказано', 'unaccept');
    addButton('Тех. Специалисту', 'Texy');
    addButton('Рассмотрено', 'Rasmotreno');
    addButton('Закрыто','Close');
    addButton('Вердикты', 'selectAnswer');
 
 
	// Поиск информации о теме
	const threadData = getThreadData();
 
	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
	$('button#Ga').click(() => editThreadData(GA_PREFIX, true));
	$('button#Spec').click(() => editThreadData(SPECY_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
	$('button#Texy').click(() => editThreadData(TEX_PREFIX, true));
	$('button#Rasmotreno').click(() => editThreadData(RASSMOTENO_PREFIX, false));
	$('button#Close').click(() => editThreadData(CLOSE_PREFIX, false));
 
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
       
   
    
   
       
        
        
        