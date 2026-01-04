// ==UserScript==
// @name   Скрипт Кураторов форума by A.Benassy
// @name:ru Кураторы Форума 1.0
// @description  Suggestions for improving the script write here ---> https://vk.com/id188245429
// @description:ru Предложения по улучшению скрипта писать сюда ---> https://vk.com/id188245429
// @version 1.1
// @namespace https://forum.blackrussia.online
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license    MIT
// @supportURL https://vk.com/id188245429
// @icon https://emoji.gg/assets/emoji/9372-blurple-boost-level-9.png
// @downloadURL https://update.greasyfork.org/scripts/515653/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20by%20ABenassy.user.js
// @updateURL https://update.greasyfork.org/scripts/515653/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20by%20ABenassy.meta.js
// ==/UserScript==
(function() {
    'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread close
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const SPEC_PREFIX = 11; // Prefix that will be set when thread special administrator
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const GA_PREFIX = 12;
const TEX_PREFIX = 13;
const V_PREFIX = 1;
const buttons = [
    {
        title: 'Приветствие',
        content:
        '[SIZE=4][FONT=Tahoma][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>',
    },
    {
        title: '________________________________________Правила Role Play процесса________________________________________'
    },
    {
        title: 'Попытка Nrp обмана',
        content:
        '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
"[CENTER][SIZE=4][FONT=verdana]Игрок будет наказан по следующему пункту регламента:<br>" +
"[COLOR=rgb(184, 49, 47)]2.05.[/COLOR] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики | PermBan[/FONT][/SIZE][/CENTER][LIST]<br>" +
"[*][SIZE=4][FONT=verdana][CENTER][COLOR=rgb(184, 49, 47)]Примечание:[/COLOR] после IC договоренности получить денежные средства и сразу же выйти из игры с целью обмана игрока, или же, договорившись через OOC чат (/n), точно также получить денежные средства и сразу же выйти из игры и тому подобные ситуации.[/CENTER][/FONT][/SIZE]<br" +
"[*][SIZE=4][FONT=verdana][CENTER][COLOR=rgb(184, 49, 47)]Примечание:[/COLOR] разблокировка игрового аккаунта нарушителя будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого имущества, которое было украдено (по решению обманутой стороны).<br>" +
"[CENTER][FONT=verdana][SIZE=4]Одобрено,закрыто.<br>",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
{
        title: 'NonRP поведение',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[FONT=verdana][COLOR=rgb(209, 72, 65)]2.01.[/COLOR] Запрещено поведение, нарушающее нормы процессов Role Play режима игры | [COLOR=rgb(209, 72, 65)]Jail 30 минут [/COLOR][/FONT][/I][/B][/CENTER][LIST]<br>" +
        "[*][LEFT][COLOR=rgb(209, 72, 65)]Примечание: [/COLOR]ездить на крышах транспортных средств, бегать или ходить по столам в казино, целенаправленная провокация сотрудников правоохранительных органов с целью развлечения, целенаправленная помеха в проведении различных собеседований и так далее.[/LEFT][/LIST]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][FONT=verdana].[/FONT]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'Уход от Р',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[FONT=verdana][COLOR=rgb(209, 72, 65)]2.02.[/COLOR] Запрещено целенаправленно уходить от Role Play процесса всеразличными способами | [COLOR=rgb(209, 72, 65)]Jail 30 минут / Warn [/COLOR][/FONT][/I][/B][/CENTER][LIST]<br>" +
        "[*][COLOR=rgb(209, 72, 65)]Примечание: [/COLOR]уходить в AFK при остановке транспортного средства правоохранительными органами, выходить из игры для избежания смерти, выходить из игры во время процесса задержания или ареста, полное игнорирование отыгровок другого игрока, которые так или иначе могут коснуться Вашего персонажа. Уходить в интерьер или зеленую зону во время перестрелки с целью избежать смерти или уйти от Role Play процесса и так далее.[/LIST]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(204, 204, 204)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]<br>",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'NonRP Drive',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[FONT=verdana][COLOR=rgb(209, 72, 65)]2.03.[/COLOR] Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере | [COLOR=rgb(209, 72, 65)]Jail 30 минут [/COLOR][/FONT][/I][/B][/CENTER][LIST]<br>" +
        "[*][COLOR=rgb(209, 72, 65)]Примечание:[/COLOR] езда на скутере по горам, езда на любом транспортном средстве по встречным полосам, нарушая все правила дорожного движения без какой-либо причины, намеренное создание аварийных ситуаций на дорогах и так далее.[/LIST]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(204, 204, 204)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'NonRp обман',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[FONT=verdana][COLOR=rgb(209, 72, 65)]2.05. [/COLOR]Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики | [COLOR=rgb(209, 72, 65)]PermBan[/COLOR] [/FONT][/I][/B][/CENTER][LIST]<br>" +
        "[*][COLOR=rgb(209, 72, 65)]Примечание: [/COLOR]после IC договоренности получить денежные средства и сразу же выйти из игры с целью обмана игрока, или же, договорившись через OOC чат (/n), точно также получить денежные средства и сразу же выйти из игры и тому подобные ситуации.<br>" +
        "[*][COLOR=rgb(209, 72, 65)]Примечание:[/COLOR] разблокировка игрового аккаунта нарушителя будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого имущества, которое было украдено (по решению обманутой стороны).[/LIST]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'RP отыгровки в свою сторону',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]2.06.[/COLOR] Запрещены любые Role Play отыгровки в свою сторону или пользу |[COLOR=rgb(209, 72, 65)] Jail 30 минут [/COLOR][/FONT][/I][/B][/CENTER][LIST]<br>" +
        "[*][COLOR=rgb(209, 72, 65)]Примечание:[/COLOR] при остановке Вашего транспортного средства правоохранительными органами у Вас очень резко и неожиданно заболевает сердце, ломаются руки, блокируются двери машины или окна и так далее.[/LIST]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'Аморальные действия',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]2.08.[/COLOR] Запрещена любая форма аморальных действий сексуального характера в сторону игроков |[COLOR=rgb(209, 72, 65)] Jail 30 минут / Warn [/COLOR][/FONT][/I][/B][/CENTER][LIST]<br>" +
        "[*][COLOR=rgb(209, 72, 65)]Исключение:[/COLOR] обоюдное согласие обеих сторон.[/LIST]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'Слив склада',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]2.09.[/COLOR] Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле | [COLOR=rgb(209, 72, 65)]Ban 15 - 30 дней / PermBan[/COLOR][/FONT][/I][/B][/CENTER]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'Обман в /do',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]2.10. [/COLOR]Запрещено в любой форме обманывать в /do, даже если это в дальнейшем негативно скажется на Вашем игровом персонаже | [COLOR=rgb(209, 72, 65)]Jail 30 минут / Warn[/COLOR][/FONT][/I][/B][/CENTER]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'Исп.фрак.тс.в.личн.цел',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]2.11. [/COLOR]Запрещено использование рабочего или фракционного транспорта в личных целях | [COLOR=rgb(209, 72, 65)]Jail 30 минут[/COLOR][/FONT][/I][/B][/CENTER]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'Затягивание RP процесса',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]2.12.[/COLOR] Запрещено целенаправленное затягивание Role Play процесса | [COLOR=rgb(209, 72, 65)]Jail 30 минут [/COLOR][/FONT][/I][/B][/CENTER][LIST]<br>" +
        "[*][COLOR=rgb(209, 72, 65)]Примечание:[/COLOR] /me начал доставать документы [1/100], начал доставать документы [2/100] и тому подобное.[/LIST]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'DB',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]2.13. [/COLOR]Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта | [COLOR=rgb(209, 72, 65)]Jail 60 минут [/COLOR][/FONT][/I][/B][/CENTER][LIST]<br>" +
        "[*][COLOR=rgb(209, 72, 65)]Исключение[/COLOR]: разрешается на территории проведения мероприятия по захвату упавшего семейного контейнера.[/LIST]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'RK',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]2.14. [/COLOR]Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти | [COLOR=rgb(209, 72, 65)]Jail 30 минут[/COLOR][/FONT][/I][/B][/CENTER]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'TK',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]2.15.[/COLOR] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины | [COLOR=rgb(209, 72, 65)]Jail 60 минут / Warn (за два и более убийства)[/COLOR][/FONT][/I][/B][/CENTER]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'SK',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]2.16. [/COLOR]Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них | [COLOR=rgb(209, 72, 65)]Jail 60 минут / Warn (за два и более убийства)[/COLOR][/FONT][/I][/B][/CENTER]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'PG',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]2.17.[/COLOR] Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь |[COLOR=rgb(209, 72, 65)] Jail 30 минут[/COLOR][/FONT][/I][/B][/CENTER]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'MG',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]2.18.[/COLOR] Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе | [COLOR=rgb(209, 72, 65)]Mute 30 минут [/COLOR][/FONT][/I][/B][/CENTER][LIST]<br>" +
        "[*][COLOR=rgb(209, 72, 65)]Примечание: [/COLOR]использование смайлов в виде символов «))», «=D» запрещено в IC чате.<br>" +
        "[*][COLOR=rgb(209, 72, 65)]Примечание: [/COLOR]телефонное общение также является IC чатом.<br>" +
        "[*][COLOR=rgb(209, 72, 65)]Исключение: [/COLOR]за написанный однократно вопросительный «?» или восклицательный «!» знак в IC чате, наказание не выдается.[/LIST]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'DM',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]2.19. [/COLOR]Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины | [COLOR=rgb(209, 72, 65)]Jail 60 минут [/COLOR][/FONT][/I][/B][/CENTER][LIST]<br>" +
        "[*][COLOR=rgb(209, 72, 65)]Примечание:[/COLOR] разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил.<br>" +
        "[*][COLOR=rgb(209, 72, 65)]Примечание:[/COLOR] нанесение урона с целью защиты особняка или его территории, а также нанесение урона после ДТП не является веской IC причиной, для войны семей предусмотрено отдельное системное мероприятие.[/LIST]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'Масс.Дм',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]2.20. [/COLOR]Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более | [COLOR=rgb(209, 72, 65)]Warn / Ban 3 - 7 дней[/COLOR][/FONT][/I][/B][/CENTER]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'Обход системы',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]2.21.[/COLOR] Запрещено пытаться обходить игровую систему или использовать любые баги сервера | [COLOR=rgb(209, 72, 65)]Ban 15 - 30 дней / PermBan [/COLOR][/FONT][/I][/B][/CENTER][LIST]<br>" +
        "[*][COLOR=rgb(184, 49, 47)]Примечание:[/COLOR] под игровой системой подразумеваются функции и возможности, которые реализованы в игре для взаимодействия между игроками, а также взаимодействия игроков с функциями, у которых есть свое конкретное предназначение.<br>" +
        "[*][COLOR=rgb(209, 72, 65)]Пример: [/COLOR]аптечка предназначена для пополнения уровня здоровья, доступна всем игрокам по фиксированной цене в любом магазине. Но она не предназначена для перепродажи по завышенной цене с целью передачи виртуальной валюты между игроками;Аксессуары предназначены для украшения внешнего вида персонажа, не предназначены для передачи виртуальной валюты между игроками;Банк и личные счета предназначены для передачи денежных средств между игроками;Транспортное средство предназначено для передвижения игроков, не предназначено для передачи денег тем или иным способом, включая обмен с завышенными доплатами.[/LIST]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'Любые читы без бана',
        content:
        '[FONT=Georgia][B][CENTER][COLOR=rgb(255, 0, 255)][I] {{ greeting }}, уважаемый[/I][/B][/COLOR] {{ user.mention }} [/CENTER]<br>' +
"[CENTER][FONT=Georgia]Информация передана разработчикам на проверку. В случае выявления нарушений,игрок будет заблокирован.[/CENTER][/FONT]<br>" +
'[CENTER][FONT=Georgia][COLOR=rgb(255, 0, 0)]Закрыто.[/CENTER][/FONT][/COLOR]<br>', 
        prefix: CLOSE_PREFIX,
        status: false,
    },
     {
        title: 'Скрытие багов',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]2.23. [/COLOR]Запрещено скрывать от администрации баги системы, а также распространять их игрокам | [COLOR=rgb(209, 72, 65)]Ban 15 - 30 дней / PermBan[/COLOR][/FONT][/I][/B][/CENTER]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'Скрытие нарушителей',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]2.24.[/COLOR] Запрещено скрывать от администрации нарушителей или злоумышленников | [COLOR=rgb(209, 72, 65)]Ban 15 - 30 дней / PermBan + ЧС проекта[/COLOR][/FONT][/I][/B][/CENTER]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'Вред репутации проекта',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]2.25.[/COLOR] Запрещены попытки или действия, которые могут навредить репутации проекта | [COLOR=rgb(209, 72, 65)]PermBan + ЧС проекта[/COLOR][/FONT][/I][/B][/CENTER]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'Вред ресурсам проекта',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][FONT=verdana][I][COLOR=rgb(209, 72, 65)]2.26.[/COLOR] Запрещено намеренно наносить вред ресурсам проекта (игровые серверы, форум, официальные Discord-серверы и так далее) | [COLOR=rgb(209, 72, 65)]PermBan + ЧС проекта[/COLOR][/I][/FONT][/B][/CENTER]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'Распрост.адм.инфы',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]2.27.[/COLOR] Запрещено распространение информации и материалов, которые имеют непосредственное отношение к работе администрации проекта | [COLOR=rgb(209, 72, 65)]PermBan + ЧС проекта [/COLOR][/FONT][/I][/B][/CENTER][LIST]<br>" +
        "[*][COLOR=rgb(209, 72, 65)]Примечание: [/COLOR]команды администрации, видеозаписи и прочее.[/LIST]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'Продажа/покупка вирт',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]2.28.[/COLOR] Запрещена покупка/продажа внутриигровой валюты в любых ее проявлениях за реальные деньги | [COLOR=rgb(209, 72, 65)]PermBan с обнулением аккаунта + ЧС проекта [/COLOR][/FONT][/I][/B][/CENTER][LIST]<br>" +
        "[*][COLOR=rgb(209, 72, 65)]Примечание: [/COLOR]любые попытки покупки/продажи, попытки поинтересоваться о ней у другого игрока и прочее - наказуемы.<br>" +
        "[*][COLOR=rgb(209, 72, 65)]Исключение:[/COLOR] официальная покупка через сайт.[/LIST]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'Трансф.имущ',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]2.29. [/COLOR]Запрещен трансфер имущества между серверами проекта | [COLOR=rgb(209, 72, 65)]PermBan с обнулением аккаунта [/COLOR][/FONT][/I][/B][/CENTER][LIST]<br>" +
        "[*][COLOR=rgb(209, 72, 65)]Примечание:[/COLOR] обменять деньги с одного сервера на другой и так далее.[/LIST]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'Ущерб.Эконом',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]2.30.[/COLOR] Запрещено пытаться нанести ущерб экономике сервера | [COLOR=rgb(209, 72, 65)]Ban 15 - 30 дней / PermBan[/COLOR][/FONT][/I][/B][/CENTER][LIST]<br>" +
        "[*][COLOR=rgb(209, 72, 65)]Пример:[/COLOR] имея достаточное количество денег и имущества игрок начинает раздавать денежные средства и имущество другим игрокам.[/LIST]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'Реклама стор.рес',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]2.31.[/COLOR] Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное | [COLOR=rgb(209, 72, 65)]Ban 7 дней / PermBan[/COLOR][/FONT][/I][/B][/CENTER]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'Обман/забл адм',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]2.32.[/COLOR] Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта | [COLOR=rgb(209, 72, 65)]Ban 7 - 15 дней[/COLOR][/FONT][/I][/B][/CENTER][LIST]<br>" +
        "[*][COLOR=rgb(209, 72, 65)]Пример: [/COLOR]подделка доказательств, искажение информации в свою пользу, предоставление неполной информации о ситуации.[/LIST]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'Уязвим.правил',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]2.33. [/COLOR]Запрещено пользоваться уязвимостью правил | [COLOR=rgb(209, 72, 65)]Ban 15 дней[/COLOR][/FONT][/I][/B][/CENTER][LIST]<br>" +
        "[*][COLOR=rgb(209, 72, 65)]Примечание:[/COLOR] игрок объясняет свою невиновность тем, что какой-либо пункт правил недостаточно расписан, но вина очевидна.[/LIST]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'Уход от нак',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]2.34.[/COLOR] Запрещен уход от наказания | [COLOR=rgb(209, 72, 65)]Ban 15 - 30 дней (суммируется к общему наказанию дополнительно)[/COLOR][/FONT][/I][/B][/CENTER][LIST]<br>" +
        "[*][COLOR=rgb(209, 72, 65)]Примечание:[/COLOR] зная, что в данный момент игроку может быть выдано наказание за какое-либо нарушение, изменение никнейма или передача своего имущества на другие аккаунты и тому подобное.<br>" +
        "[*][COLOR=rgb(209, 72, 65)]Примечание:[/COLOR] выход игрока из игры не является уходом от наказания.[/LIST]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'IC и OOC конфл',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]2.35.[/COLOR] На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате | [COLOR=rgb(209, 72, 65)]Mute 120 минут / Ban 7 дней[/COLOR][/FONT][/I][/B][/CENTER]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'Перенос IC и OOC конфл',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]2.36. [/COLOR]Запрещено переносить конфликты из IC в OOC и наоборот | [COLOR=rgb(209, 72, 65)]Warn[/COLOR][/FONT][/I][/B][/CENTER][LIST]<br>" +
        "[*][COLOR=rgb(209, 72, 65)]Примечание: [/COLOR]все межфракционные конфликты решаются главными следящими администраторами.[/LIST]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'OOC угрозы',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]2.37.[/COLOR] Запрещены OOC угрозы, в том числе и завуалированные | [COLOR=rgb(209, 72, 65)]Mute 120 минут / Ban 7 дней[/COLOR][/FONT][/I][/B][/CENTER]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'Распрост.личн.инф',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]2.38.[/COLOR] Запрещено распространять личную информацию игроков и их родственников | [COLOR=rgb(209, 72, 65)]Ban 15 - 30 дней / PermBan[/COLOR][/FONT][/I][/B][/CENTER][LIST]<br>" +
        "[*][COLOR=rgb(209, 72, 65)]Исключение:[/COLOR] личное предоставление данной информации, разрешение на распространение от владельца.[/LIST]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'Злоуп.Нар',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]2.39. [/COLOR]Злоупотребление нарушениями правил сервера | [COLOR=rgb(209, 72, 65)]Ban 7 - 30 дней[/COLOR][/FONT][/I][/B][/CENTER][LIST]<br>" +
        "[*][COLOR=rgb(209, 72, 65)]Примечание:[/COLOR] неоднократное (от шести и более) нарушение правил сервера, которые были совершены за прошедшие 7 дней.<br>" +
        "[*][COLOR=rgb(209, 72, 65)]Примечание: [/COLOR]наказания выданные за нарушения правил текстовых чатов, помеху (kick) в учет не идут.<br>" +
        "[*][COLOR=rgb(209, 72, 65)]Пример: [/COLOR]было получено пять наказаний за DM, шестое будет злоупотреблением. Если было получено одно наказание за упоминание родных, два наказания за DB и два наказания за DM, следующее будет считаться злоупотреблением.[/LIST]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'Оск.Проекта',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]2.40. [/COLOR]Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе | [COLOR=rgb(209, 72, 65)]Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором)[/COLOR][/FONT][/I][/B][/CENTER]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'ППВ',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]2.41.[/COLOR] Передача своего личного игрового аккаунта третьим лицам | [COLOR=rgb(209, 72, 65)]PermBan[/COLOR][/FONT][/I][/B][/CENTER]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'ППИВ',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][FONT=verdana][COLOR=rgb(209, 72, 65)]2.42.[/COLOR] Попытка продажи любого игрового имущества или игрового аккаунта за реальные деньги | [COLOR=rgb(209, 72, 65)]PermBan[/COLOR][/FONT][/B][/CENTER]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'Продажа промо',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]2.43.[/COLOR] Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций | [COLOR=rgb(209, 72, 65)]Mute 120 минут[/COLOR][/FONT][/I][/B][/CENTER]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'ЕПП(легк.тс)',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]2.46.[/COLOR] Запрещено ездить по полям на любом транспорте | [COLOR=rgb(209, 72, 65)]Jail 30 минут[/COLOR][/FONT][/I][/B][/CENTER][LIST]<br>" +
        "[*][COLOR=rgb(209, 72, 65)]Исключение:[/COLOR] разрешено передвижение на кроссовых мотоциклах и внедорожниках.[/LIST]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'ЕПП(груз.тс)',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]2.47.[/COLOR] Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) | [COLOR=rgb(209, 72, 65)]Jail 60 минут[/COLOR][/FONT][/I][/B][/CENTER]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'Покуп.реп.семьи.скр.нар',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]2.48.[/COLOR] Продажа или покупка репутации семьи любыми способами, скрытие нарушителей, читеров лидером семьи. | [COLOR=rgb(209, 72, 65)]Обнуление рейтинга семьи / Обнуление игрового аккаунта лидера семьи[/COLOR][/FONT][/I][/B][/CENTER][LIST]<br>" +
        "[*][COLOR=rgb(209, 72, 65)]Примечание: [/COLOR]сокрытие информации о продаже репутации семьи приравнивается к пункту правил 2.24.[/LIST]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'Мног.пок./прод реп.семьи',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]2.49.[/COLOR] Многократная продажа или покупка репутации семьи любыми способами. | [COLOR=rgb(209, 72, 65)]Ban 15 - 30 дней / PermBan + удаление семьи[/COLOR][/FONT][/I][/B][/CENTER]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'Задержание в интерьере',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]2.50. [/COLOR]Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий | [COLOR=rgb(209, 72, 65)]Ban 7 - 15 дней + увольнение из организации[/COLOR][/FONT][/I][/B][/CENTER]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'Вмешательство в РП процесс',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]2.51. [/COLOR]Запрещено вмешательство в Role Play процесс с целью помехи и препятствования дальнейшего развития Role Play процесса |[COLOR=rgb(209, 72, 65)] Jail 30 минут[/COLOR][/FONT][/I][/B][/CENTER][LIST]<br>" +
        "[*][COLOR=rgb(209, 72, 65)]Пример:[/COLOR] вмешательство в Role Play процесс при задержании игрока сотрудниками ГИБДД, вмешательство в проведение тренировки или мероприятия какой-либо фракции и тому подобные ситуации.[/LIST]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'NonRP акс',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]2.52.[/COLOR] Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. |[COLOR=rgb(209, 72, 65)] При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут[/COLOR][/FONT][/I][/B][/CENTER][LIST]<br>" +
        "[*][COLOR=rgb(209, 72, 65)]Пример:[/COLOR] слишком большие аксессуары на голове персонажа, имитация гитарой половых органов и тому подобное.[/LIST]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'Нецен.назв.биз',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]2.53. [/COLOR]Запрещено устанавливать названия для внутриигровых ценностей с использованием нецензурной лексики, оскорблений, слов политической или религиозной наклонности | [COLOR=rgb(209, 72, 65)]Ban 1 день / При повторном нарушении обнуление бизнеса[/COLOR][/FONT][/I][/B][/CENTER][LIST]<br>" +
        "[*][COLOR=rgb(209, 72, 65)]Примечание:[/COLOR] названия семей, бизнесов, компаний и т.д.[/LIST]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'Неуваж.к.адм',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]2.54. [/COLOR]Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации | [COLOR=rgb(209, 72, 65)]Mute 180 минут[/COLOR][/FONT][/I][/B][/CENTER][LIST]<br>" +
        "[*][COLOR=rgb(209, 72, 65)]Пример:[/COLOR] оскорбление администрации в любой чат, включая репорт подлежит наказанию в виде блокировки доступа к использованию всех видов чатов - Mute 180 минут.[/LIST]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'Баг аним',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]2.55. [/COLOR]Запрещается багоюз связанный с анимацией в любых проявлениях. | [COLOR=rgb(209, 72, 65)]Jail 60 / 120 минут[/COLOR][/FONT][/I][/B][/CENTER][LIST]<br>" +
        "[*][COLOR=rgb(209, 72, 65)]Пример: [/COLOR]если игрок, используя баг, убирает ограничение на использование оружия в зеленой зоне, сбивает темп стрельбы, либо быстро перемещается во время войны за бизнес или во время перестрелки на мероприятии с семейными контейнерами, последует наказание в виде Jail на 120 минут. Данное наказание используется в случаях, когда, используя ошибку, было получено преимущество перед другими игроками.<br>" +
        "[*][COLOR=rgb(209, 72, 65)]Пример:[/COLOR] если игрок использует баги, связанные с анимацией, и при этом не влияет на игровой процесс других игроков, а также не получает преимущество перед другими игроками, последует наказание в виде Jail на 60 минут.[/LIST]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
   
     {
        title: '__________________________________________________Игровые чаты__________________________________________________'
    },
     {
        title: 'Общение на иностр',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]3.01.[/COLOR] Общепризнанный язык сервера — русский. Общение в IC чатах во всех Role Play ситуациях обязательно должно проходить исключительно на русском языке | [COLOR=rgb(209, 72, 65)]Устное замечание / Mute 30 минут[/COLOR][/FONT][/I][/B][/CENTER]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'Caps',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]3.02. [/COLOR]Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате | [COLOR=rgb(209, 72, 65)]Mute 30 минут[/COLOR][/FONT][/I][/B][/CENTER]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'Оск в OOC',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]3.03. [/COLOR]Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены | [COLOR=rgb(209, 72, 65)]Mute 30 минут[/COLOR][/FONT][/I][/B][/CENTER]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'Оск.Упом.Род',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]3.04.[/COLOR] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) | [COLOR=rgb(209, 72, 65)]Mute 120 минут / Ban 7 - 15 дней[/COLOR][/FONT][/I][/B][/CENTER][LIST]<br>" +
        "[*][COLOR=rgb(209, 72, 65)]Примечание:[/COLOR] термины *MQ* , *rnq* расценивается, как упоминание родных.<br>" +
        "[*][COLOR=rgb(209, 72, 65)]Исключение:[/COLOR] если упоминание родных было совершено в ходе Role Play процесса и не содержало в себе прямого или завуалированного оскорбления.[/LIST]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'Флуд',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]3.05. [/COLOR]Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока | [COLOR=rgb(209, 72, 65)]Mute 30 минут[/COLOR][/FONT][/I][/B][/CENTER]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'Злоуп.сим.знак',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]3.06.[/COLOR] Запрещено злоупотребление знаков препинания и прочих символов | [COLOR=rgb(209, 72, 65)]Mute 30 минут[/COLOR][/FONT][/I][/B][/CENTER][LIST]<br>" +
        "[*][COLOR=rgb(209, 72, 65)]Пример:[/COLOR] «???????», «!!!!!!!», «Дааааааааааааааааааааааа» и так далее.[/LIST]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'Оск пороч.чест',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]3.07.[/COLOR] Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата | [COLOR=rgb(209, 72, 65)]Mute 30 минут[/COLOR][/FONT][/I][/B][/CENTER][LIST]<br>" +
        "[*][COLOR=rgb(209, 72, 65)]Примечание:[/COLOR] «дырка», «шмара», «ведро», «мадагаскарский присосконог», «свиноногий бандикут», «скорострел» и так далее.[/LIST]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'Слив',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]3.08. [/COLOR]Запрещены любые формы «слива» посредством использования глобальных чатов | [COLOR=rgb(209, 72, 65)]PermBan[/COLOR][/FONT][/I][/B][/CENTER]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'Угр.нак.с.стор.адм',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]3.09.[/COLOR] Запрещены любые угрозы о наказании игрока со стороны администрации | [COLOR=rgb(209, 72, 65)]Mute 30 минут[/COLOR][/FONT][/I][/B][/CENTER]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'Выдача себя за адм',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]3.10.[/COLOR] Запрещена выдача себя за администратора, если таковым не являетесь | [COLOR=rgb(209, 72, 65)]Ban 7 - 15 + ЧС администрации[/COLOR][/FONT][/I][/B][/CENTER]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'Введ.в.забд.коман',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]3.11.[/COLOR] Запрещено введение игроков проекта в заблуждение путем злоупотребления командами | [COLOR=rgb(209, 72, 65)]Ban 15 - 30 дней / PermBan[/COLOR][/FONT][/I][/B][/CENTER][LIST]<br>" +
        "[*][COLOR=rgb(209, 72, 65)]Примечание:[/COLOR] /me чтобы поднять кошелек введите /pay 228 5000. Для продажи автомобиля введите /sellmycar id 2828 (счёт в банке) цена.[/LIST]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'Музыка в Voice Chat',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]3.14. [/COLOR]Запрещено включать музыку в Voice Chat | [COLOR=rgb(209, 72, 65)]Mute 60 минут[/COLOR][/FONT][/I][/B][/CENTER]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'Оск игрок/упом-оск род в Voice Chat',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]3.15. [/COLOR]Запрещено оскорблять игроков или родных в Voice Chat | [COLOR=rgb(209, 72, 65)]Mute 120 минут / Ban 7 - 15 дней[/COLOR][/FONT][/I][/B][/CENTER]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'Шум в Voice Chat',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]3.16.[/COLOR] Запрещено создавать посторонние шумы или звуки | [COLOR=rgb(209, 72, 65)]Mute 30 минут[/COLOR][/FONT][/I][/B][/CENTER][LIST]<br>" +
        "[*][COLOR=rgb(209, 72, 65)]Примечание: [/COLOR]Посторонние звуки на фоне речи, мешающие взаимодействию игроков посредством голосового чата. Сильное искажение звука, исходящее из микрофона плохого качества. Намеренно портить игру другим игрокам (кричать, перебивать)[/LIST]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'Реклама в Voice Chat',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]3.17.[/COLOR] Запрещена реклама в Voice Chat не связанная с игровым процессом | [COLOR=rgb(209, 72, 65)]Ban 7 - 15 дней[/COLOR][/FONT][/I][/B][/CENTER][LIST]<br>" +
        "[*][COLOR=rgb(209, 72, 65)]Пример:[/COLOR] реклама Discord серверов, групп, сообществ, ютуб каналов и т.д.[/LIST]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'Полит.Розжиг',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]3.18.[/COLOR] Запрещено политическое и религиозное пропагандирование | [COLOR=rgb(209, 72, 65)]Mute 120 минут / Ban 10 дней[/COLOR][/FONT][/I][/B][/CENTER]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'Софт для измен.голос',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]3.19. [/COLOR]Запрещено использование любого софта для изменения голоса | [COLOR=rgb(209, 72, 65)]Mute 60 минут[/COLOR][/FONT][/I][/B][/CENTER]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'Транслит',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]3.20.[/COLOR] Запрещено использование транслита в любом из чатов | [COLOR=rgb(209, 72, 65)]Mute 30 минут[/COLOR][/FONT][/I][/B][/CENTER][LIST]<br>" +
        "[*][COLOR=rgb(209, 72, 65)]Пример:[/COLOR] «Privet», «Kak dela», «Narmalna».[/LIST]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'Реклама промо',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]3.21. [/COLOR]Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. | [COLOR=rgb(209, 72, 65)]Ban 30 дней[/COLOR][/FONT][/I][/B][/CENTER][LIST]<br>" +
        "[*][COLOR=rgb(209, 72, 65)]Примечание:[/COLOR] чаты семейные, строительных компаний, транспортных компаний, фракционные чаты, IC, OOC, VIP и так далее.<br>" +
        "[*][COLOR=rgb(209, 72, 65)]Исключение: [/COLOR]промокоды, предоставленные разработчиками, а также распространяемые через официальные ресурсы проекта.<br>" +
        "[*][COLOR=rgb(209, 72, 65)]Пример:[/COLOR] если игрок упомянет промокод, распространяемый через официальную публичную страницу ВКонтакте либо через официальный Discord в любом из чатов, наказание ему не выдается.[/LIST]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'Объявление на тер.госс',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]3.22. [/COLOR]Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) | [COLOR=rgb(209, 72, 65)]Mute 30 минут[/COLOR][/FONT][/I][/B][/CENTER][LIST]<br>" +
        "[*][COLOR=rgb(209, 72, 65)]Пример:[/COLOR] в помещении центральной больницы писать в чат: *Продам эксклюзивную шапку дешево!!!*[/LIST]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {  title: 'Мат.в.вип',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]3.18.[/COLOR] Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов| [COLOR=rgb(209, 72, 65)]Mute 120 минут / Ban 10 дней[/COLOR][/FONT][/I][/B][/CENTER]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false
},
    {
        title: '______________________________________Положение об игровых аккаунтах______________________________________'
    },
     {
        title: 'Мультиаккаунт',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]4.04.[/COLOR] Разрешается зарегистрировать максимально только три игровых аккаунта на сервере | [COLOR=rgb(209, 72, 65)]PermBan[/COLOR][/FONT][/I][/B][/CENTER][LIST]<br>" +
        "[*][COLOR=rgb(209, 72, 65)]Примечание:[/COLOR] блокировке подлежат все аккаунты созданные после третьего твинка.[/LIST]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'Передача имущ.межд.твинк',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]4.05.[/COLOR] Запрещено передавать любые игровые ценности между игровыми аккаунтами, а также в целях удержания имущества |[COLOR=rgb(209, 72, 65)] Ban 15 - 30 дней / PermBan[/COLOR][/FONT][/I][/B][/CENTER][LIST]<br>" +
        "[*][COLOR=rgb(209, 72, 65)]Пример:[/COLOR] перекинуть бизнес, АЗС, дом или любые другие игровые материальные ценности с одного аккаунта игрока на другой / используя свой твинк / договорившись заранее с игроком и иные способы удержания.[/LIST]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'Мат в нике',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]4.09.[/COLOR] Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные) | [COLOR=rgb(209, 72, 65)]Устное замечание + смена игрового никнейма / PermBan[/COLOR][/FONT][/I][/B][/CENTER]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'Фэйк аккаунт',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]4.10. [/COLOR]Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию |[COLOR=rgb(209, 72, 65)] Устное замечание + смена игрового никнейма / PermBan[/COLOR][/FONT][/I][/B][/CENTER][LIST]<br>" +
        "[*][COLOR=rgb(209, 72, 65)]Пример:[/COLOR] подменять букву i на L и так далее, по аналогии.[/LIST]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'Влад.биз.с.твинк',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]4.11.[/COLOR] Владеть бизнесами разрешается с одного основного аккаунта | [COLOR=rgb(209, 72, 65)]Обнуление аккаунта[/COLOR][/FONT][/I][/B][/CENTER]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'Имея азс - мал.актив в игре',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]4.13.[/COLOR] Запрещено, имея бизнес или автозаправочную станцию (АЗС), заходить в игру только ради его оплаты и не проявлять активность в игре. | [COLOR=rgb(209, 72, 65)]Обнуление владения бизнесом[/COLOR][/FONT][/I][/B][/CENTER][LIST]<br>" +
        "[*][COLOR=rgb(209, 72, 65)]Примечание:[/COLOR] минимальный онлайн для владельцев бизнесов, автозаправочных станций — 7 часов в неделю активной игры (нахождение в nRP сне не считается за активную игру).[/LIST]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'Имея ТК - мал.актив в игре',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]4.14. [/COLOR]Запрещено, имея транспортную или строительную компанию не проявлять активность в игре. | [COLOR=rgb(209, 72, 65)]Обнуление компании без компенсации[/COLOR][/FONT][/I][/B][/CENTER][LIST]<br>" +
        "[*][COLOR=rgb(209, 72, 65)]Примечание: [/COLOR]минимальный онлайн для владельцев строительных и транспортных компаний — 7 часов в неделю активной игры (нахождение в nRP сне не считается за активную игру).<br>" +
        "[*][COLOR=rgb(209, 72, 65)]Примечание: [/COLOR]если не заходить в игру в течении 5-ти дней, не чинить транспорт в ТК, не проявлять активность в СК - компания обнуляется автоматически.[/LIST]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'Фэйк промо',
        content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/color][/CENTER]' +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Нарушитель буден наказан по следующему пункту общих правил серверов:[/FONT][/COLOR]<br>" +
        "[CENTER][B][I][FONT=verdana][COLOR=rgb(209, 72, 65)]4.15.[/COLOR] Запрещено создавать промокод, идентичный промокоду блогера проекта, а также любой промокод, который не относится к рефералу и имеет возможность пассивного заработка.[/FONT][/I][/B][/CENTER][LIST]<br>" +
        "[*][COLOR=rgb(209, 72, 65)]Наказание: [/COLOR]перманентная блокировка аккаунта или обнуление имущества, заработанного с помощью промокода, а также самого промокода.[/LIST]<br>" +
        "[CENTER][B][I][COLOR=rgb(204, 204, 204)][FONT=verdana]Приятной игры на BlackRussia [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=verdana]Platinum[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana].[/FONT][/COLOR]<br>" +
        "[COLOR=rgb(26, 188, 156)][FONT=verdana]Одобрено,закрыто.[/FONT][/COLOR][/I][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
     title: '__________________________________________Правила Гос.Структур__________________________________________',
    },
    {
      title: 'Прогул Р/Д',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил: [Color=Red]1.07[/color]. Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, принадлежащей своей фракции | [Color=Red]Jail 30 минут[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'ДМ/Масс дм от МО',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил: [Color=Red]2.02[/color]. Наносить урон игрокам, которые находятся вне территории воинской части, запрещено | [Color=Red]Jail 30 минут / Warn[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Н/П/Р/О (Объявы)',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил: [Color=Red]4.01[/color]. Запрещено редактирование объявлений, не соответствующих ПРО | [Color=Red]Mute 30 минут[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Н/П/П/Э (Эфиры)',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил: [Color=Red]4.02[/color]. Запрещено проведение эфиров, не соответствующих Role Play правилам и логике | [Color=Red]Mute 30 минут[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Ред.объяв.лич.цел',
      content:
       '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил: [Color=Red]4.04.[/color]. Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком | [Color=Red]Ban 7 дней + ЧС организации[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'ДМ/Масс от УМВД',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил: [Color=Red]6.01[/color]. Запрещено наносить урон игрокам без Role Play причины на территории УМВД | [Color=Red]Jail 30 минут / Warn[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Розыск без причины(УМВД)',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил: [Color=Red]6.02[/color]. Запрещено выдавать розыск без Role Play причины | [Color=Red]Warn[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Задержание без РП(Нонрп коп)(УМВД)',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил: [Color=Red]6.03[/color]. Запрещено оказывать задержание без Role Play отыгровки | [Color=Red]Warn[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Нонрп поведение(УМВД)',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил: [Color=Red]6.04[/color]. Запрещено nRP поведение | [Color=Red]Warn[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'ДМ/Масс от ГИБДД',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил: [Color=Red]7.01[/color]. Запрещено наносить урон игрокам без Role Play причины на территории ГИБДД | [Color=Red]Jail 30[/color] минут / Warn[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Штраф без рп(ГИБДД)',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил: [Color=Red]7.02[/color]. Запрещено выдавать розыск, штраф без Role Play причины | [Color=Red]Jail 30 минут[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Розыск без причины(ГИБДД)',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил: [Color=Red]6.02[/color]. Запрещено выдавать розыск без Role Play причины | [Color=Red]Jail 30 минут[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Задержание без РП(Нонрп коп)(ГИБДД)',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил: [Color=Red]7.03[/color]. Запрещено оказывать задержание без Role Play отыгровки | [Color=Red]Warn[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Забирание В/У во время погони(ГИБДД)',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил: [Color=Red]7.05[/color]. Запрещено отбирать водительские права во время погони за нарушителем | [Color=Red]Warn[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'ДМ/Масс от УФСБ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил: [Color=Red]8.01[/color]. Запрещено наносить урон игрокам без Role Play причины на территории ФСБ | [Color=Red]Jail 30 минут / Warn[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Розыск без причины(УФСБ)',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил: [Color=Red]8.02[/color]. Запрещено выдавать розыск без Role Play причины | [Color=Red]Jail 30 минут[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Задержание без РП(Нонрп коп)(УФСБ)',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил: [Color=Red]8.03[/color]. Запрещено оказывать задержание без Role Play отыгровки | [Color=Red]Warn[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Задержание без РП(Нонрп коп)(ФСИН)',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил: [Color=Red]9.01[/color]. Запрещено наносить урон игрокам без Role Play причины на территории ФСИН | [Color=Red]Jail 30 минут / Warn[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
     title: '__________________________________________Правила ОПГ__________________________________________',
    },
    {
      title: 'Нарушение правил В/Ч',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил: За нарушение правил нападения на [Color=Orange]Войсковую Часть[/color] выдаётся предупреждение | [Color=Red]Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ)[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Нападение на В/Ч через стену',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил: Нападение на [Color=Orange]военную часть[/color] разрешено только через блокпост КПП с последовательностью взлома | [Color=Red]Warn NonRP В/Ч[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Похищение/Ограбления нарушение правил',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан за Нонрп Ограбление\Похищениее в соответствии с этими правилами [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BE%D0%B3%D1%80%D0%B0%D0%B1%D0%BB%D0%B5%D0%BD%D0%B8%D0%B9-%D0%B8-%D0%BF%D0%BE%D1%85%D0%B8%D1%89%D0%B5%D0%BD%D0%B8%D0%B9.29/']Кликабельно[/URL][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
     {
     title: '___________________________________Передача/перенаправление жалоб___________________________________',
    },
    {
      title: 'Жалоба на рассмотрении',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба взята на рассмотрение.<br>Просьба ожидать ответа и не создавать дубликаты данной темы.[/CENTER]<br>" +
        '[Color=Flame][CENTER]Ожидайте ответа.[/I][/CENTER][/color][/FONT]',
      prefix: PIN_PREFIX,
      status: false,
    },
    {
	  title: 'Передать жалобу Спец.Администратору',
	  content:
		'[SIZE=4][FONT=Tahoma][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>' +
		"[CENTER][I][B][color=red]Передаю вашу жалобу Специальному Администратору." +
        "[CENTER][I][B][color=yellow]Ожидайте вынесения вердикта." +
        "[CENTER][color=orange]На рассмотрении..." ,
	  prefix: SPEC_PREFIX,
	  status: true,
	},
    {
	  title: 'Передать жалобу Главному Администратору',
	  content:
		'[SIZE=4][FONT=Tahoma][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>' +
        "[CENTER][I][B][color=red]Передаю вашу жалобу Главному Администратору." +
        "[CENTER][I][B][color=yellow]Ожидайте вынесения вердикта." +
        "[CENTER][color=orange]На рассмотрении..." ,
	  prefix: GA_PREFIX,
	  status: true,
	},
     {
        title: 'Передать жалобу Тех.Специалисту',
        content:
        '[SIZE=4][FONT=Tahoma][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>' +
        "[CENTER][I][B][color=white]Передаю вашу жалобу [I][B][color=orange]Техническому Специалисту." +
        "[CENTER][I][B][color=yellow]Ожидайте вынесения вердикта" +
        "[CENTER][B][I][color=orange]На рассмотрении..." ,
        prefix: TEX_PREFIX,
        status: true,
    },
    {
        title: 'Передать жалобу Куратору',
        content:
        '[SIZE=4][FONT=Tahoma][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>' +
        "[CENTER][I][B][color=white]Передаю вашу жалобу [I][B][color=orange]Куратору за администрацией." +
        "[CENTER][I][B][color=yellow]Ожидайте вынесения вердикта" +
        "[CENTER][B][I][color=orange]На рассмотрении..." ,
       prefix: PIN_PREFIX,
	   status: true,
    },
    {
	  title: 'Перенаправить в жалобы на администрацию',
	  content:
		'[SIZE=4][FONT=Tahoma][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>' +
		"[CENTER][I][B][color=orange]Если вы не согласны с выданным наказанием оставьте жалобу на данного администратора в раздел [U][URL=https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.783/]Жалобы на Администрацию[/URL] [/U]" +
		'[CENTER][I][B][color=lime]Спасибо за обращение,[I][B][color=red]закрыто.',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Перенаправить в раздел с Обжалованиями',
	  content:
		'[SIZE=4][FONT=Tahoma][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>' +
		"[CENTER][I][B][color=orange]Если вы хотите смягчить наказание, обратитесь в раздел [U][URL=https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.786/]Обжалование наказаний[/URL] [/U]" +
		'[CENTER][I][B][color=lime]Спасибо за обращение,[I][B][color=red]закрыто.',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Перенаправить в жалобы на Тех.Специалиста',
	  content:
		'[SIZE=4][FONT=Tahoma][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>' +
		"[CENTER][I][B][color=orange]Обратитесь в Технический Раздел ---> Жалобы на [color=red]Технических специалистов[/color]" +
		'[CENTER][color=lime]Спасибо за обращение,[I][B][color=red]закрыто.[/color][/CENTER][/FONT][/SIZE][/B][/I]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
       {
       title: 'Перенаправить в жалобы на Сотрудников',
       content:
              	'[SIZE=4][FONT=Tahoma][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>' +
		"[CENTER][I][B][color=orange]Обратитесь в раздел Государственные организации ---> Жалобы на [color=red]Жалобы на сотрудников[/color]" +
		'[CENTER][color=lime]Спасибо за обращение,[I][B][color=red]закрыто.[/color][/CENTER][/FONT][/SIZE][/B][/I]',
	  prefix: CLOSE_PREFIX,
	  status: false,
        },
     {
        title: 'Передать ГКФ',
        content:
        '[SIZE=4][FONT=Tahoma][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>' +
        "[CENTER][I][B][color=white]Передаю вашу жалобу [I][B][color=orange]Главному Куратору Форума." +
        "[CENTER][I][B][color=yellow]Ожидайте вынесения вердикта" +
        "[CENTER][B][I][color=orange]На рассмотрении..." ,
       prefix: PIN_PREFIX,
	   status: true,
    },
    {
     title: '___________________________________Отсутствие чего либо в жалобе___________________________________',
    },
    {
      title: 'Отсутствуют тайм-коды',
      content:
'[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
"[CENTER][SIZE=4][FONT=verdana]В вашей жалобе отсутствуют тайм-коды.<br>" +
"Напишите новую жалобу и укажите в ней тайм-коды.<br>" +
"Отказано,закрыто.[/FONT][/SIZE][/CENTER]<br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
     },
     {
      title: 'Нарушений со стороны игрока нет',
      content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>' +
        "[CENTER][I][B][color=orange]Не вижу нарушений со стороны игрока." +
        '[CENTER][color=red][I][B]Отказано,закрыто.',
      prefix: UNACCEPT_PREFIX,
	  status: false,
     },
    {
      title: 'Недостаточно доказательств для рассмотрения жалобы',
      content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>' +
        "[CENTER][I][B][color=orange]Недостаточно доказательств для коректного рассмотрения вашей жалобы." +
        '[CENTER][I][B][color=red]Отказано,закрыто.',
      prefix: UNACCEPT_PREFIX,
	  status: false,
     },
    {
      title: 'Ответ был дан в прошой жалобе',
      content:
        '[FONT=Tahoma][SIZE=4][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>' +
        "[CENTER][I][B][color=orange]Ответ уже был дан в прошлой жалобе" +
        "[CENTER][I][B][color=#9365B8]Просьба не создавать повторные темы,иначе ваш форумный аккаунт может быть [U]заблокирован[/U]" +
        '[CENTER][color=red][I][B]Отказано,закрыто.',
     prefix: CLOSE_PREFIX,
	 status: false,
     },
    {
      title: 'Доказательства с Соц.Сетей',
      content:
        '[B][SIZE=4][COLOR=black][I][FONT=Tahoma][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>' +
        "[CENTER][I][B][color=orange]Доказательства с Соц.Сетей не принимаются." +
        '[CENTER][I][B][color=red]Отказано,закрыто.',
    prefix: UNACCEPT_PREFIX,
	status: false,
    },
    {
      title: 'Жалоба не по форме',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба составлена не по форме. Убедительная просьба ознакомиться [U][URL=https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/]с правилами подачи жалоб на игроков[/URL][/U].[/CENTER]<br>" +
        '[CENTER][FONT=Georgia]Отправлять жалобу нужно в соответствии с примером, приведенном ниже:[/CENTER]<br>' +
        "[CENTER][FONT=Georgia][QUOTE]1. Ваш Nick_Name:[/CENTER]<br>" +
        '[CENTER][FONT=Georgia] 2. Nick_Name игрока:[/CENTER]<br>' +
        "[CENTER][FONT=Georgia] 3. Суть жалобы:[/CENTER]<br>" +
        '[CENTER][FONT=Georgia] 4. Доказательство:[/CENTER][/QUOTE]<br>' +
        "[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]",
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
     {
      title: 'Заголовок не по форме',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][FONT=Georgia][I]Заголовок вашей жалобы составлен не по форме. Убедительная просьба ознакомиться [U][URL=https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/]с правилами подачи жалоб на игроков[/URL][/U].[/CENTER]<br>" +
'[CENTER][FONT=Georgia] Пример правильного заголовка:[/CENTER]<br>' +
"[CENTER][FONT=Georgia][QUOTE] {{ user.mention }} // Суть жалобы [/CENTER][/QUOTE]<br>" +
        '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]<br>',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },

    {
      title: 'Отсутствует /time',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]На ваших доказательствах отсутствует /time.[/CENTER]<br>" +
        '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
      status: false,
   },
   {
      title:'Подстава',  
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER] {{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваши доказательства подделаны.[/CENTER]<br>" +
        '[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
      status: false,
   },
     {
      title: 'Доказательства с Соц.Сетей',
      content:
        '[B][SIZE=4][COLOR=black][I][FONT=Tahoma][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>' +
        "[CENTER][I][B][color=orange]Доказтельства с Соц.Сетей не принимаются." +
        '[CENTER][I][B][color=red]Отказано,закрыто.',
    prefix: UNACCEPT_PREFIX,
	status: false,
     },
     {
      title: 'Требуются TimeCode',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба отказана, т.к в ней нету таймкодов. Если видео длится больше 3-ех минут - Вы должны указать таймкоды нарушений.[/CENTER]<br>" +
        '[Color=Red][CENTER]Отказано[/I][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
      {
      title: 'Более 72 часов',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]С момента получения наказания прошло более 72 часов[/CENTER]" +
        '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
     {
      title: 'Нету условий сделки',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]В данных доказательствах отсутствуют условия сделки[/CENTER]" +
        '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Нужен фарпс',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]В таких случаях нужнен фрапс[/CENTER]" +
        '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Нужен фарпс + промотка чата',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]В таких случаях нужен фрапс + промотка чата.[/CENTER]" +
        '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Нужна промотка чата',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]В таких случаях нужна промотка чата.[/CENTER]" +
        '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Неполный фрапс',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Фрапс обрывается. Загрузите полный фрапс на ютуб.[/CENTER]" +
        '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Отсутствуют/не работают доказательства',
        content:
        '[SIZE=4][FONT=Tahoma][color=black][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>' +
        "[CENTER][I][B][color=orange]В вашей жалобе отсутствуют/не работают доказательства." +
        "[CENTER][I][B][color=#9365B8]Рассмотрению не подлежит." +
        '[CENTER][I][B][color=red]Отказано,закрыто.',
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
      title: 'Доква отредактированы',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваши доказательства отредактированы.[/CENTER]" +
        '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'От 3-го лица',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Жалобы от 3-их лиц не принимаются[/CENTER]" +
        '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Ответный ДМ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]В случае ответного ДМ нужен видиозапись. Пересоздайте тему и прекрепите видиозапись.[/CENTER]" +
        '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Ошиблись разделом',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Вы ошиблись сервером/разделом, переподайте жалобу в нужный раздел.[/CENTER]<br>",
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
     title: '__________________________________________РП биографии__________________________________________',
    },
      {
      title: 'Био одобрено',
      content:
        '[Color=rgb(255, 0, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Lime]Одобрено.[/I][/CENTER][/color][/FONT]",
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Био пусть дополнит',
      content:
        '[Color=rgb(255, 0, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Вам даётся 24 часа на дополнение вашей RolePlay биографии.[/CENTER]",
      prefix: PIN_PREFIX,
    },
    {
      title: ' Био Не дополнил',
      content:
      "[FONT=Georgia][B][CENTER][COLOR=rgb(255, 0, 255)][I] {{ greeting }}, уважаемый[/I][/B][/COLOR] {{ user.mention }} [/CENTER]<br>" +
      '[CENTER][B][I][FONT=georgia] Увы данные вам 24 часа прошли, вы не дополнили вашу RolePlay биографию.[/CENTER]<br>' +
      "[CENTER][FONT=Georgia][Color=rgb(255, 0, 0)]Отказано.[/color][/CENTER][/FONT]<br>",
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Био отказ',
      content:
        '[Color=rgb(255, 0, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Причиной отказа могло послужить какое-либо нарушение из Правила написания RP биографии.[/CENTER][/FONT]",
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Био отказ(загол темы)',
      content:
        '[Color=rgb(255, 0, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Причиной отказа послужило неправильное заполнение заголовка темы.<br>Заголовок RP биографии должен быть оформлен по форме ниже:<br>[QUOTE]RolePlay биография гражданина Имя Фамилия (в родительном падеже) [/QUOTE][/CENTER][/FONT]",
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Био отказ(3е лицо)',
      content:
        '[Color=rgb(255, 0, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Причиной отказа могло послужить создание биографии от 3го лица.[/CENTER][/FONT]",
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Био отказ(Грамм.Ошибки)',
      content:
        '[Color=rgb(255, 0, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Причиной отказа могло послужить большое количество грамматических ошибок.[/CENTER][/FONT]",
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Био отказ(Возраст и Дата)',
      content:
        '[Color=rgb(255, 0, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Причиной отказа могло послужить несовпадение возраста и даты рождения.[/CENTER][/FONT]",
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Био отказ(Мало информации)',
      content:
        '[Color=rgb(255, 0, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Добавьте больше информации о себе в новой биографии.[/CENTER][/FONT]",
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
{
      title: 'Био нет даты рождения-возраста',
      content:
        '[Color=rgb(255, 0, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>В вашей RP биографии отсутствует дата рождения или возраст, исправьте данный недочёт в новой RP биографии.[/CENTER][/FONT]",
      prefix: UNACCEPT_PREFIX,
      status: false,
},
{
    title: 'Био отказ супер герой',
    content:
    "[FONT=Georgia][B][CENTER][COLOR=rgb(255, 0, 255)][I] {{ greeting }}, уважаемый[/I][/B][/COLOR] {{ user.mention }} [/CENTER]<br>" +
    '[CENTER][FONT=Georgia]Ваш персонаж является Супер Героем что запрещено по правилам RolePlay процесса и логики.[/CENTER][/FONT]<br>' +
    "[CENTER][FONT=Georgia]Ознакомьтесь с правилами [URL=https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BD%D0%B0%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D1%8F-%D0%B8-%D1%84%D0%BE%D1%80%D0%BC%D0%B0-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8-platinum.4811017/][U]написания RP биографий.[/U][/URL][/CENTER][/FONT]<br>" +
    '[CENTER][FONT=Georgia][COLOR=rgb(255, 0, 0)][B]Отказано,закрыто.[/B][/CENTER][/FONT][/COLOR]<br>',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
        title: 'Био отказ(копипаст)',
        content:
        '[SIZE=4][FONT=Georgia][COLOR=rgb(255, 0, 255)][I][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>'+
        '[color=#FFFFFF][CENTER][B]Ваша RolePlay биография является копией,напишите новую биографию,в которой постарайтесь изложить свою идею.<br>' +
        '[CENTER][COLOR=rgb(255, 0, 0)]Отказано[/COLOR][/B]<br>',
        prefix: UNACCEPT_PREFIX,
    status: false,
},
    {
     title: '__________________________________________РП ситуации__________________________________________',
    },
    {
      title: 'РП ситуация одобрено',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП ситуация получает статус: [Color=Lime]Одобрено.[/I][/CENTER][/color][/FONT]",
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'РП ситуация на дороботке',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Вам даётся 24 часа на дополнение вашей РП ситуации[/CENTER]",
      prefix: PIN_PREFIX,
    },
    {
      title: 'РП ситуация отказ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП ситуация получает статус: [Color=Red]Отказано.[/color]<br>Причиной отказа могло послужить какое-либо нарушение из Правила RP ситуаций[/CENTER][/FONT]",
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
     title: '__________________________________________Неофициал. организации__________________________________________',
    },
    {
      title: 'Неофициальная Орг Одобрено',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП ситуация получает статус: [Color=Lime]Одобрено.[/I][/CENTER][/color][/FONT]",
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Неофициальная Орг на дороботке',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Вам даётся 24 часа на дополнение вашей Неофициальная Орг[/CENTER]",
      prefix: PIN_PREFIX,
    },
    {
      title: 'Неофициальная Орг отказ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП ситуация получает статус: [Color=Red]Отказано.[/color]<br>Причиной отказа могло послужить какое-либо нарушение из Правила создания неофициальной RolePlay организации.[/CENTER][/FONT]",
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
      {
      title: 'Неофициальная Орг запроси активности',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
          "[CENTER][B][I][FONT=georgia]Ваша неофициальная РП организация может быть закрыта по пункту правил: Неактив в топике организации более недели, он закрывается. Прекрипите отчёт о активности организации в виде скриншотов. Через 24 часа если отчёта не будет или он будет некорректный организация будет закрыта.[/CENTER]",
      prefix: PIN_PREFIX,
      status: false,
    },
    {
      title: 'Неофициальная Орг закрытие активности',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Активность небыла предоставлена. Организация закрыта.[/CENTER]",
      prefix: UNACCEPT_PREFIX,
      status: false,
      },
      {
      title: 'Неофициальная Орг не по форме',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП ситуация получает статус: [Color=Red]Отказано.[/color]<br>Заявление подано не по форме[/CENTER][/FONT]" +
        '[CENTER][FONT=Georgia]Ознакомьтесь с правилами создания [U][URL=https://forum.blackrussia.online/index.php?threads/platinum-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-%D0%BD%D0%B5%D0%BE%D1%84%D0%B8%D1%86%D0%B8%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE%D0%B9-roleplay-%D0%BE%D1%80%D0%B3%D0%B0%D0%BD%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D0%B8.4834910/][Color=Red]неофициальных RP организаций[/color][/URL][U].[/CENTER][/FONT]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    ];
    

     $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
    // Добавление кнопок при загрузке страницы
    addButton('На рассмотрение', 'pin');
    addButton('КП', 'teamProject');
    addButton('Га', 'Ga');
    addButton('Спецу', 'Spec');
    addButton('Click me', 'selectAnswer');
 
    // Поиск информации о теме
    const threadData = getThreadData();
 
    $('button#pin').click(() => editThreadData(PINN_PREFIX, true));
    $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
    $('button#Spec').click(() => editThreadData(SPECY_PREFIX, true));
    $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
 
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