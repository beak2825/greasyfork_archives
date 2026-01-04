// ==UserScript==
// @name Для Кураторов Форума | VORONEZH (40)
// @namespace https://forum.blackrussia.online
// @version 0.2.5
// @description kye
// @author Maksim_Vitalievich
// @match https://forum.blackrussia.online/index.php?threads/*
// @include https://forum.blackrussia.online/index.php?threads/
// @grant none
// @license MIT
// @collaborator !
// @icon https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @downloadURL https://update.greasyfork.org/scripts/462415/%D0%94%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%7C%20VORONEZH%20%2840%29.user.js
// @updateURL https://update.greasyfork.org/scripts/462415/%D0%94%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%7C%20VORONEZH%20%2840%29.meta.js
// ==/UserScript==
 
(function () {
'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const SA_PREFIX = 11;
const buttons = [
{
title: 'СВОЙ ОТВЕТ',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"Твой текст <br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
},
{
title: '============ жалобы на игроков ============'
}, 
{
title:'-------- Правила RP процесса --------'
},
{
title: 'NonRP Поведение',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[COLOR=RED]2.01.[/COLOR] Запрещено поведение, нарушающее нормы процессов Role Play режима игры [COLOR=RED]| Jail 30 минут[/COLOR]<br><br>Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Уход от RP процесса',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[COLOR=RED]2.02.[/COLOR]  Запрещено целенаправленно уходить от Role Play процесса всеразличными способами [COLOR=RED]| Jail 30 минут / Warn[/COLOR] <br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'NonRP Drive',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[COLOR=RED]2.03. [/COLOR] Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере [COLOR=RED]| Jail 30 минут[/COLOR] <br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'NonRP обман',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[COLOR=RED]2.05. [/COLOR] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [COLOR=RED]| PermBan[/COLOR] <br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'RP отыгровки в свою пользу',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[COLOR=RED]2.06.[/COLOR]  Запрещены любые Role Play отыгровки в свою сторону или пользу [COLOR=RED]| Jail 30 минут[/COLOR] <br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'AFK no ESC',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[COLOR=RED]2.07.[/COLOR]  Запрещено нахождение в AFK без включенного ESC, создавая помеху другим игрокам [COLOR=RED]| Kick[/COLOR] <br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Аморальные поведения',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+

"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[COLOR=RED]2.08.[/COLOR]  Запрещена любая форма аморальных действий сексуального характера в сторону игроков [COLOR=RED]| Jail 30 минут / Warn[/COLOR] <br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Слив склада',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[COLOR=RED]2.09.[/COLOR]  Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле [COLOR=RED]| Ban 15 - 30 дней / PermBan[/COLOR] <br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Обман в /do',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+

"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[COLOR=RED]2.10.[/COLOR]  Запрещено в любой форме обманывать в /do, даже если это в дальнейшем негативно скажется на Вашем игровом персонаже [COLOR=RED]| Jail 30 минут / Warn[/COLOR] <br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Фракц тс в л/ц',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+

"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
" [COLOR=RED]2.11.[/COLOR]  Запрещено использование рабочего или фракционного транспорта в личных целях [COLOR=RED]| Jail 30 минут[/COLOR] <br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Затягивание RP процесса',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[COLOR=RED]2.12.[/COLOR]  Запрещено целенаправленное затягивание Role Play процесса [COLOR=RED]| Jail 30 минут[/COLOR] <br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'DB',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[COLOR=RED]2.13.[/COLOR]  Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [COLOR=RED]| Jail 60 минут[/COLOR] <br><br>"+
'[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'RK',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[COLOR=RED]2.14. [/COLOR] Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти [COLOR=RED]| Jail 30 минут[/COLOR] <br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'TK',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[COLOR=RED]2.15.[/COLOR]  Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины [COLOR=RED]| Jail 60 минут / Warn[/COLOR]  (за два и более убийства)<br><br>"+
'[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'SK',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[COLOR=RED]2.16.[/COLOR]  Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них [COLOR=RED]| Jail 60 минут / Warn[/COLOR]  (за два и более убийства)<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'PG',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[COLOR=RED]2.17.[/COLOR]  Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь [COLOR=RED]| Jail 30 минут[/COLOR] <br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'MG',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[COLOR=RED]2.18.[/COLOR]  Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [COLOR=RED]| Mute 30 минут[/COLOR] <br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'DM',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[COLOR=RED]2.19.[/COLOR]  Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [COLOR=RED]| Jail 60 минут[/COLOR] <br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Mass DM',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[COLOR=RED]2.20.[/COLOR]  Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более [COLOR=RED]| Warn / Ban 3 - 7 дней[/COLOR] <br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Попытка обхода багов',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[COLOR=RED]2.21.[/COLOR]  Запрещено пытаться обходить игровую систему или использовать любые баги сервера [COLOR=RED]| Ban 15 - 30 дней / PermBan[/COLOR] <br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'СБОРКА',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[COLOR=RED]2.22.[/COLOR]  Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [COLOR=RED]| Ban 15 - 30 дней / PermBan[/COLOR] <br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Сокрытие багов от администрации',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[COLOR=RED]2.23.[/COLOR]  Запрещено скрывать от администрации баги системы, а также распространять их игрокам [COLOR=RED]| Ban 15 - 30 дней / PermBan[/COLOR] <br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Сокрытие нарушителей',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[COLOR=RED]2.24.[/COLOR]  Запрещено скрывать от администрации нарушителей или злоумышленников [COLOR=RED]| Ban 15 - 30 дней / PermBan + ЧС проект[/COLOR] <br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Репутация проекта',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[COLOR=RED]2.25.[/COLOR]  Запрещены попытки или действия, которые могут навредить репутации проекта [COLOR=RED]| PermBan + ЧС проекта[/COLOR] <br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Вред ресурсам',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[COLOR=RED]2.26.[/COLOR]  Запрещено намеренно наносить вред ресурсам проекта (игровые серверы, форум, официальные Discord-серверы и так далее) [COLOR=RED]| PermBan + ЧС проекта[/COLOR] <br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Распространение информации',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[COLOR=RED]2.27.[/COLOR]  Запрещено распространение информации и материалов, которые имеют непосредственное отношение к работе администрации проекта [COLOR=RED]| PermBan + ЧС проекта[/COLOR] <br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'покупка/продажа внутриигровой',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[COLOR=RED]2.28.[/COLOR]  Запрещена покупка/продажа внутриигровой валюты в любых ее проявлениях за реальные деньги [COLOR=RED]| PermBan с обнулением аккаунта + ЧС проекта[/COLOR] <br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Трансфер',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[COLOR=RED]2.29.[/COLOR]  Запрещен трансфер имущества между серверами проекта [COLOR=RED]| PermBan с обнулением аккаунта[/COLOR] <br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Ущерб экономике',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[COLOR=RED]2.30.[/COLOR]  Запрещено пытаться нанести ущерб экономике сервера [COLOR=RED]| Ban 15 - 30 дней / PermBan[/COLOR] <br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Реклама серверов, дискорд',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[COLOR=RED]2.31.[/COLOR]  Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное [COLOR=RED]| Ban 7 дней / PermBan[/COLOR] <br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Введение в заблуждение обман информации',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[COLOR=RED]2.32.[/COLOR]  Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта [COLOR=RED]| Ban 7 - 15 дней[/COLOR] <br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'IC и OOC конфликты о нац или религ',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[COLOR=RED]2.35.[/COLOR]  На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате [COLOR=RED]| Mute 120 минут / Ban 7 дней[/COLOR] <br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'OOC угрозы',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[COLOR=RED]2.37.[/COLOR]  Запрещены OOC угрозы, в том числе и завуалированные [COLOR=RED]| Mute 120 минут / Ban 7 дней[/COLOR] <br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Оск проекта',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[COLOR=RED]2.40.[/COLOR]  Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [COLOR=RED]| Mute 300 минут / Ban 30 дней[/COLOR]  (Ban выдается по согласованию с главным администратором)<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'ЕПП на любом виде транспорта',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[COLOR=RED]2.46.[/COLOR]  Запрещено ездить по полям на любом транспорте [COLOR=RED]| Jail 30 минут[/COLOR] <br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'ЕПП инко / фура',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[COLOR=RED]2.47.[/COLOR]  Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) [COLOR=RED]| Jail 60 минут[/COLOR] <br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Зад-е в каз,аукц,мп',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[COLOR=RED]2.50.[/COLOR]  Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий [COLOR=RED]| Ban 7 - 15 дней + увольнение из организации[/COLOR] <br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Неув общение к адм',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[COLOR=RED]2.54.[/COLOR]  Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [COLOR=RED]| Mute 180 минут[/COLOR] <br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Багаюз с аним',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[COLOR=RED]2.55. [/COLOR] Запрещается багоюз связанный с анимацией в любых проявлениях. [COLOR=RED]| Jail 60 / 120 минут[/COLOR] <br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '------- игровые чаты -------'
},
{
title: 'ЯЗЫК',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[COLOR=RED]3.01. [/COLOR] Общепризнанный язык сервера — русский. Общение в IC чатах во всех Role Play ситуациях обязательно должно проходить исключительно на русском языке [COLOR=RED]| Устное замечание / Mute 30 минут[/COLOR] <br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'CAPSLOCK',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[COLOR=RED]3.02.[/COLOR]  Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате [COLOR=RED]| Mute 30 минут[/COLOR]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'любой оск сексизма в OOC',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[COLOR=RED]3.03.[/COLOR] Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены [COLOR=RED]| Mute 30 минут[/COLOR]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Упоминание / оск род',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[COLOR=RED]3.04.[/COLOR] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [COLOR=RED]| Mute 120 минут / Ban 7 - 15 дней[/COLOR]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Флуд',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[COLOR=RED]3.05.[/COLOR] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [COLOR=RED]| Mute 30 минут[/COLOR]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Злоуп.знаков',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[COLOR=RED]3.06.[/COLOR] Запрещено злоупотребление знаков препинания и прочих символов [COLOR=RED]| Mute 30 минут[/COLOR]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Оск секс',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[COLOR=RED]3.07.[/COLOR] Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата [COLOR=RED]| Mute 30 минут[/COLOR]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Слив ГЧ',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[COLOR=RED]3.08. [/COLOR]Запрещены любые формы «слива» посредством использования глобальных чатов [COLOR=RED]| PermBan[/COLOR]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Угрозы со стороны админ',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[COLOR=RED]3.09.[/COLOR] Запрещены любые угрозы о наказании игрока со стороны администрации [COLOR=RED]| Mute 30 минут[/COLOR]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Выдача адм',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[COLOR=RED]3.10.[/COLOR] Запрещена выдача себя за администратора, если таковым не являетесь [COLOR=RED]| Ban 7 - 15 + ЧС администрации[/COLOR]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Введение игроков путем злоуп ком',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[COLOR=RED]3.11.[/COLOR] Запрещено введение игроков проекта в заблуждение путем злоупотребления командами [COLOR=RED]| Ban 15 - 30 дней / PermBan[/COLOR]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'нарушение в репорт',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[COLOR=RED]3.12. [/COLOR]Запрещено подавать репорт написанный транслитом, с сообщением не по теме (Offtop), с включенным Caps Lock и повторять обращение (если ответ был уже дан ранее) [COLOR=RED]| Report Mute 30 минут[/COLOR]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Нецензурная брань в репорт',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[COLOR=RED]3.13.[/COLOR] Запрещено подавать репорт с использованием нецензурной брани[COLOR=RED] | Report Mute 30 минут[/COLOR]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Музыка в войс',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[COLOR=RED]3.14.[/COLOR] Запрещено включать музыку в Voice Chat [COLOR=RED]| Mute 60 минут[/COLOR]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Оск игроков / родню в войс ',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[COLOR=RED]3.15.[/COLOR] Запрещено оскорблять игроков или родных в Voice Chat [COLOR=RED]| Mute 120 минут / Ban 7 - 15 дней[/COLOR]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Шумы в войс',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[COLOR=RED]3.16.[/COLOR] Запрещено создавать посторонние шумы или звуки [COLOR=RED]| Mute 30 минут[/COLOR]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Реклама в войс',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
" [COLOR=RED]3.17.[/COLOR] Запрещена реклама в Voice Chat не связанная с игровым процессом[COLOR=RED] | Ban 7 - 15 дней[/COLOR]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Политика',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[COLOR=RED]3.18.[/COLOR] Запрещено политическое и религиозное пропагандирование [COLOR=RED]| Mute 120 минут / Ban 10 дней[/COLOR]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Транслит',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[COLOR=RED]3.20.[/COLOR]Запрещено использование транслита в любом из чатов [COLOR=RED]| Mute 30 минут[/COLOR]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Реклама промо',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[COLOR=RED]3.21.[/COLOR] Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. [COLOR=RED]| Ban 30 дней [/COLOR]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'торговля в помещении',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[COLOR=RED]3.22.[/COLOR] Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) [COLOR=RED]| Mute 30 минут[/COLOR]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'ппв',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[COLOR=RED]4.03.[/COLOR] Запрещена совершенно любая передача игровых аккаунтов третьим лицам [COLOR=RED]| PermBan[/COLOR]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
 
{
title: 'НИК',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[COLOR=RED]4.09.[/COLOR] Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные) [COLOR=RED]| Устное замечание + смена игрового никнейма / PermBan[/COLOR]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'ФЕЙК',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[COLOR=RED]4.10.[/COLOR] Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию [color=red]| Устное замечание + смена игрового никнейма / PermBan[/color]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '--------------- госс --------------- '
},
{
title: 'ДМ вне тт вч',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[COLOR=RED]2.02. Наносить урон игрокам, которые находятся вне территории воинской части, запрещено [COLOR=RED]| DM / Jail 60 минут / Warn[/COLOR]<BR>Примечание: предупреждение (Warn) выдается только в случае Mass DM.<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'НПРО',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[COLOR=RED]4.01.[/COLOR] Запрещено редактирование объявлений, не соответствующих ПРО [COLOR=RED]| Mute 30 минут[/COLOR]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'НППЭ',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[COLOR=RED]4.02.[/COLOR] Запрещено проведение эфиров, не соответствующих Role Play правилам и логике [COLOR=RED]| Mute 30 минут[/COLOR]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'редакт в лц',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[COLOR=RED]4.04.[/COLOR] Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком [COLOR=RED]| Ban 7 дней + ЧС организации[/COLOR]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Розыск без причины',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[COLOR=RED]7.02.[/COLOR] Запрещено выдавать розыск, штраф без Role Play причины [COLOR=RED]| Warn[/COLOR]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'нон рп поведение (ГОСС)',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[COLOR=RED]6.03.[/COLOR] Запрещено nRP поведение [COLOR=RED]| Warn[/COLOR]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Отб в погоне (ГИБДД)',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[COLOR=RED]7.04.[/COLOR] Запрещено отбирать водительские права во время погони за нарушителем [COLOR=RED]| Warn[/COLOR]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '--------------- ОПГ ---------------'
},
{
title: 'НОН РП НАПАДЕНИЕ',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"Запрещено нарушение правил нападения на Войсковую Часть выдаётся предупреждение | Jail 30 минут (Игроку) / Warn (Для сотрудников ОПГ)<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '--------- отказанные ---------'
},
{
title: 'Не по форме',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Жалобы составлена не по форме. Ознакомьтесь с [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/'][COLOR=rgb(255,0,0)]«правилами подачи жалоб на игроков».[/color][/URL][/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Жалоба от 3-его лица',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER] Ваша жалоба от 3-го лица, что не подлежит рассмотрению.<br>"+
"• [color=red]Примечание:[/COLOR] 3.3. Жалоба должна быть подана участником ситуации.<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Три дня',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]С момента нарушения от игрока прошло три дня. Жалоба рассмотрению не подлежит.<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Нет /time',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Если в доказательствах жалобы отсутствует /time. Жалоба рассмотрению не подлежит.<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Нужен фрапс',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]В данном случае нужна видеофиксация.<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Нужен фрапс + промотка чата',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]В данном случае нужна видеофиксация и промотка чата.<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Нет доказательств',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]В жалобе отсутствуют доказательства. Жалоба рассмотрению не подлежит.<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Доки из соц сети',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Доказательства в социальных сетях и т.д. не принимаются. Загрузите доказательства на фото-видео хостинги:<br>[URL='https://imgur.com/']IMGUR[/URL]<br>[URL='https://yapx.ru/']Yapix[/URL]<br>[URL='https://postimages.org/']postimages[/URL]<br>[URL='https://ru.imgbb.com/']IBB[/URL]<br>[URL='https://clck.ru/8pxGW']YouTube[/URL] и.т.д<br><br>Все ссылки [COLOR=rgb(255,0,0)]кликабельны[/color].[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Доказательства отредактированы',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Ваши доказательства подверглись редактированию, создайте повторную тему и прикрепите доказательства в первоначальном виде.<br>[COLOR=RED]Примечание:[/COLOR]видеодоказательства, которые были отредактированы и на которых присутствует посторонняя музыка, неадекватная речь, нецензурные слова или выражения, могут быть не рассмотрены в качестве доказательств.<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Доказательства обрезанные',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Предоставленные доказательства обрезанные. Загрузите доказательства без обрезаний.<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Больше трех минут',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Ваши доказательства больше трех минут. Укажите таймкоды нарушений от игрока.<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Не работает ссылка',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Ссылка на доказательства не работает.<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Доказательства не работают',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Предоставленные доказательства не работают.<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Смайлик клоуна, оск в жб',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Жалобы с подобным содержанием не подлежат рассмотрению.[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Нет доступа к доказ (Гугл)',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Доступ к доказательствам закрыт - <br> [url=https://postimages.org/][img]https://i.postimg.cc/BvxnD9yw/image.png[/img][/url][/CENTER]<br>"+
"[CENTER]Создайте новую жалобу и загрузите доказательства на фото/видео хостинги (YouTube, Япикс, imgur).[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Нет доступа к доказ (Ютуб)',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Доступ к доказательствам закрыт - <br> [url=https://postimages.org/][img]https://i.postimg.cc/131G5gqy/image.png[/img][/url][/CENTER]<br>"+
"[CENTER]Создайте новую жалобу и загрузите доказательства на фото/видео хостинги (YouTube, Япикс, imgur).[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Нет доступа к доказ (Япикс)',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Доступ к доказательствам закрыт - <br> [url=https://postimg.cc/v4ZXXCx3][img]https://i.postimg.cc/W1MKpvNL/IMG-20230413-210406.jpg[/img][/url][/CENTER]<br>"+
"[CENTER]Создайте новую жалобу и загрузите доказательства на фото/видео хостинги (YouTube, Япикс, imgur).[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'На другой хостинг',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Загрузите доказательства на другой хостинг.<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Слив склада ( но не лидер)',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER] Нужен фрапс, где будет видно, что именно Вы являетесь лидером семьи, информация о том сколько можно брать патронов, логирование количества взятия патронов/материалов игрока и /time.<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Слив склада (если написал не лд)',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Подавать жалобу должен лидер семьи.<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Недостаточно доков',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Недостаточно доказательств о нарушении от игрока.<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Обман на замку',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Обман на заместителя строительной компании - не NRP обман.<br>Нарушений нет.<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Обман на долг',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Долг - Role Play процесс. Игрок, который дал в долг, берет на себя ответственность.<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Обман в тру',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Не является NRP Обманом.<br>Нарушений нет.<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Сборка на док-вах',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Вы используете не оригинальные файлы игры (ПО), поэтому Ваша жалоба не подлежит рассмотрению. А Вы отправляетесь в блокировку согласно регламенту:<br>[COLOR=RED]2.22.[/COLOR]  Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [COLOR=RED]| Ban 15 - 30 дней / PermBan[/COLOR]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Нет условий сделки',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Отсутствует условия сделки.<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Нету ника подавшего жб',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Вашего ника нет.<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Нет ника нарушителя',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нет ника игрока, который нарушил.<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'БАГ ГМ',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]У игрока читов нет, дефолтный баг с ГМ. Нарушений нет.<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Нарушений нет',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Нарушений со стороны игрока найдено не было.<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Удаление аккаунта не возможно',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Удалить игровой аккаунт не возможно.<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Дубликат темы',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Если Вы продолжите создавать похожие жалобы, форумный аккаунт будет заблокирован.<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Неполный фрапс',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Фрапс обрывается,загрузите на ютуб<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '╴╴╴╴╴╴╴╴╴╴╴╴ПЕРЕДАННЫЕ ╴╴╴╴╴╴╴╴╴╴╴'
},
{
title: 'ГА',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Ваша жалоба передана [COLOR=RED]Главному администратору[/COLOR].<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Теху',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER] Ваша жалоба будет передана [Color=Orange]на рассмотрение[/Color] [COLOR=rgb(255,69,0)]техническому специалисту[/COLOR] нашего сервера<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: WATCHED_PREFIX,
status: false,
},
{
title: 'На рассмотрении',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Ваша жалоба взята [COlOR=ORANGE]на рассмотрение[/COLOR]Ожидайте ответа тут.<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: PIN_PREFIX,
status: false,
},
{
title: 'В ЖБ на адм',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Вам в раздел «[COLOR=RED]Жалобы на администрацию[/COLOR]».<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},

{
title: 'В ЖБ на лд',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Вам в раздел «[COLOR=RED]Жалобы на лидеров[/COLOR]».<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'В свой сервер',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Напишите в свой сервер.<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},

{
title: 'ГКФ',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Ваша жалоба передана на рассмотрение ГКФ.<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: PIN_PREFIX,
status: false,
},
{
title: '------------------------------ РП БИОГРАФИИ ------------------------------'
},
{
title: 'Одобрено',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Ваша Role Play биография получает статус: [COLOR=rgb(76,175,80)]одобрено[/COLOR].<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Заголовок не по форме',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Заголовок Role Play Биографии составлен не по форме.<br>-Заголовок создаваемой темы должен быть написан строго по данной форме: “ RolePlay биография гражданина Имя Фамилия. “<br><br>"+
"[CENTER][COLOR=rgb(255,0,0)]Отказано[/COLOR].<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Ник с _ и русс',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Никнейм должен быть указан без нижнего подчеркивания на русском как в заголовке, так и в самой теме.<br><br>"+
"[CENTER][COLOR=rgb(255,0,0)]Отказано[/COLOR].<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '3 лицо',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Role Play Биография должна быть написана от первого лица персонажа.<br><br>"+
"[CENTER][COLOR=rgb(255,0,0)]Отказано[/COLOR].<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Вторая био для акка',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER] Запрещено создавать более чем одной биографии для одного игрового аккаунта.<br><br>"+
"[CENTER][COLOR=rgb(255,0,0)]Отказано[/COLOR].<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Скопирована',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Ваша Role Play Биография украдена или скопирована.<br>- Запрещено полное и частичное копирование биографий из данного раздела или из разделов RP биографий других серверов.<br><br>"+
"[CENTER][COLOR=rgb(255,0,0)]Отказано[/COLOR].<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Супер способ',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Запрещено приписывание своему персонажу супер-способностей.<br><br>"+
"[CENTER][COLOR=rgb(255,0,0)]Отказано[/COLOR].<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Не по форме',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Ваша Role Play Биография составлена не по форме. <br><br> [CODE]Заголовок:  “ RolePlay биография гражданина Имя Фамилия.<br><br>Форма создания темы:<br>Имя Фамилия:<br>Пол:<br>Национальность:<br>Возраст:<br>Дата и место рождения:<br>Семья:<br>Место текущего проживания:<br>Описание внешности:<br>Особенности характера:<br>( От сюда требуется расписать каждый из пунктов ) Детство:<br>Юность и взрослая жизнь:<br>Настоящее время:<br>Хобби:[/CODE]<br><br>"+
"[CENTER][COLOR=rgb(255,0,0)]Отказано[/COLOR].<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Пустая',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Добавьте побольше информации о Вашем персонаже.<br><br>"+
"[CENTER][COLOR=rgb(255,0,0)]Отказано[/COLOR].<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '18 лет',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Минимальный возраст для составления биографии: 18 лет.<br><br>"+
"[CENTER][COLOR=rgb(255,0,0)]Отказано[/COLOR].<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Дата рож с возр',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Возраст  подсчитан неверно.<br><br>"+
"[CENTER][COLOR=rgb(255,0,0)]Отказано[/COLOR].<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '------------------------------ РП СИТУАЦИИ ------------------------------'
},
{
title: 'Одобрено',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Ваша Role Play ситуация получает статус: [COLOR=rgb(76,175,80)]одобрено[/COLOR].<br><br>"+
"[CENTER][COLOR=rgb(255,0,0)]Отказано[/COLOR].<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Инфа',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Добавьте побольше информации. <br><br>"+
"[CENTER][COLOR=rgb(255,0,0)]Отказано[/COLOR].<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '------------------------------ НЕОФ ОРГ ------------------------------'
},
{
title: 'Одобрена',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Ваша Неофициальная организация получает статус: [COLOR=rgb(76,175,80)]одобрено[/COLOR].<br>Не забывайте, если не будет активности от Вашей организации, она может быть закрыта.<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
},
{
title: 'Не по форме',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER] Ваша неофициальная организация составлена не по форме.<br><br>"+
"[CENTER][COLOR=rgb(255,0,0)]Отказано[/COLOR].<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Проверка активности',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Я бы хотел увидеть активность вашей организации и в игре, и на форуме.<br>Так же хочу удостовериться, что Вы не забыли про нее и продолжаете о не заботиться.<br>Прошу Вас сделать небольшой отчет о проделанной работе. Например: рп ситуация, набор и.т.п. На отставление отчета дается 7 дней.<br> Ответ отставляете тут. Если не будет отчета, организация - закрывается.<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Есть отчет',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Увидел отчет. Благодарим, за то что Вы продолжаете работать со свой организацией.<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Нет отчета',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[CENTER]Отчета не увидел. Организация закрывается.<br><br>"+
"[CENTER][COLOR=rgb(255,0,0)]Закрыто/COLOR].<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},

]
 
 
$(document).ready(() => {
// Загрузка скрипта для обработки шаблонов
$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
// Добавление кнопок при загрузке страницы
 
 
addButton('На рассмотрение', 'pin');
addButton('Одобрено', 'accepted');
addButton('Отказано', 'unaccept');
addButton('Закрыто', 'Zakrito');
addButton('ГА', 'GA');
addButton('Ответы КА', 'selectAnswer');
// Поиск информации о теме
const threadData = getThreadData();
 
$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
$('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));
$('button#Ga').click(() => editThreadData(GA_PREFIX, true));
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
? 'Доброго времени суток'
: 18 < hours && hours <= 21
? 'Доброго времени суток'
: 21 < hours && hours <= 4
? 'Доброго времени суток'
: 'Доброго времени суток',
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