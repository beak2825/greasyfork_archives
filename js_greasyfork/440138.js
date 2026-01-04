// ==UserScript==
// @name         Black Russia Скрипт для Кураторов форума.
// @description  Для рассмотрения жалоб.
// @namespace    https://forum.blackrussia.online
// @version      1.1
// @author       Emiliano Jimenez
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @grant        none
// @license      MIT
// @icon https://icons.iconarchive.com/icons/thesquid.ink/free-flat-sample/128/support-icon.png
// @downloadURL https://update.greasyfork.org/scripts/440138/Black%20Russia%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/440138/Black%20Russia%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0.meta.js
// ==/UserScript==

(function () {
  'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const buttons = [
	{
	  title: 'На рассмотрении',
      content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Ваша жалоба взята на рассмотрение, не создавайте подобные темы, в противном случае Вы можете получить блокировку ФА.[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(251, 160, 38)]На рассмотрении[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
      title: 'Не по форме',
      content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Ваша жалоба написана не по форме или же не соответствует правилам подачи, ознакомьтесь с правилами в закрепленной теме.[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
	},
	{
	  title: 'Не достаточно док-ва',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]В вашей жалобе не достаточно доказательств.[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
	},
    {
	  title: '2.01 НРП действия',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>2.01. Запрещено поведение, нарушающее нормы процессов Role Play режима игры | Jail 30 минут.<br>Примечание: ездить на крышах транспортных средств, бегать или ходить по столам в казино, целенаправленная провокация сотрудников правоохранительных органов с целью развлечения, целенаправленная помеха в проведении различных собеседований и так далее.[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '2.02 Уход от РП',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>2.02. Запрещено целенаправленно уходить от Role Play процесса всеразличными способами | Jail 30 минут / Warn<br>Примечание: например, уходить в AFK при остановке транспортного средства правоохранительными органами, выходить из игры для избежания смерти, выходить из игры во время процесса задержания / ареста, полное игнорирование отыгровок другого игрока, которые так или иначе могут коснуться Вашего персонажа и так далее.[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '2.03. NonRP Drive',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>2.03. Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере | Jail 30 минут<br>Примечание: езда на скутере по горам, езда на любом транспортном средстве по встречным полосам, нарушая все правила дорожного движения без какой-либо причины, намеренное создание аварийных ситуаций на дорогах и так далее.[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '2.04. Уход от РП',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>2.04. Запрещено целенаправленно уходить в интерьер или зеленую зону во время перестрелки с целью избежать смерти или уйти от Role Play процесса | Warn[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '2.05. ООС and IC обман',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>2.05. Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики | PermBan<br>Примечание: после IC договоренности получить денежные средства и сразу же выйти из игры с целью обмана игрока, или же, договорившись через OOC чат (/n), точно также получить денежные средства и сразу же выйти из игры и тому подобные ситуации.<br>Примечание: разблокировка игрового аккаунта нарушителя будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого имущества, которое было украдено (по решению обманутой стороны).[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '2.06. Отыгровки в свою соторону',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>2.06. Запрещены любые Role Play отыгровки в свою сторону или пользу | Jail 30 минут<br>Примечание: при остановке Вашего транспортного средства правоохранительными органами у Вас очень резко и неожиданно заболевает сердце, ломаются руки, блокируются двери машины или окна и так далее.[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '2.07. АФК без ESC',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>2.07. Запрещено нахождение в AFK без включенного ESC, создавая помеху другим игрокам | Kick[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '2.08. Аморальные дей-я',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>2.08. Запрещена любая форма аморальных действий сексуального характера в сторону игроков | Jail 30 минут / Warn<br>Исключение: обоюдное согласие обеих сторон.[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '2.09. Слив склада',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>2.09. Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле | Ban 15 - 30 дней / PermBan<br>Примечание: разблокировка игрового аккаунта нарушителя будет возможна только в случае возврата полной суммы причиненного ущерба (по решению обманутой стороны).[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '2.10. Обман в /do',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>2.10. Запрещено в любой форме обманывать в /do, даже если это в дальнейшем негативно скажется на Вашем игровом персонаже | Jail 30 минут / Warn[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '2.11. Раб,фракционное т/с в личных',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>2.11. Запрещено использование рабочего или фракционного транспорта в личных целях | Jail 30 минут[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '2.12. Затягивание РП процесса',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>2.12. Запрещено целенаправленное затягивание Role Play процесса | Jail 30 минут<br>Примечание: /me начал доставать документы [1/100], начал доставать документы [2/100] и тому подобное.[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '2.13. DB (DriveBy)',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>2.13. Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта | Jail 30 минут[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '2.14. RK (Revenge Kill)',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>2.14. Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти | Jail 30 минут[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '2.15. TK (Team Kill)',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>2.15. Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины | Jail 30 минут / Warn (за два и более убийства)[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '2.16 (Spawn Kill)',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>2.16. Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них | Jail 30 минут / Warn (за два и более убийства)[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '2.17 PG (PowerGaming)',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>2.17. Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь | Jail 30 минут[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '2.18. MG (MetaGaming)',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>2.18. Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе | Mute 30 минут<br>Примечание: телефонное общение также является IC чатом.<br>Примечание: использование смайлов в виде символов «))», «=D» запрещено в IC чате.[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '2.19. DM (DeathMatch)',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>2.19. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины | Jail 60 минут<br>Примечание: разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил.<br>Примечание: нанесение урона с целью защиты особняка или его территории, а также нанесение урона после ДТП не является веской IC причиной, для войны семей предусмотрено отдельное системное мероприятие.[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '2.20. Mass DM',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>2.20. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более | Warn / Ban 7 - 15 дней[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '2.21 Обход системы',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>2.21. Запрещено пытаться обходить игровую систему или использовать любые баги сервера | Ban 15 - 30 дней / PermBan<br>Примечание: Под игровой системой подразумеваются функции и возможности, которые реализованы в игре для взаимодействия между игроками, а также взаимодействия игроков с функциями, у которых есть свое конкретное предназначение.<br>Пример: Аптечка предназначена для пополнения уровня здоровья, доступна всем игрокам по фиксированной цене в любом магазине. Но она не предназначена для перепродажи по завышенной цене с целью передачи виртуальной валюты между игроками; Аксессуары предназначены для украшения внешнего вида персонажа, не предназначены для передачи виртуальной валюты между игроками; Банк и личные счета предназначены для передачи денежных средств между игроками; Транспортное средство предназначено для передвижения игроков, не предназначено для передачи денег тем или иным способом, включая обмен с завышенными доплатами.[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '2.22 Исп постороннего ПО',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками | Ban 15 - 30 дней / PermBan<br>Примечание: запрещено внесение любых изменений в оригинальные файлы игры.[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '2.23 Скрытие багов',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>2.23. Запрещено скрывать от администрации баги системы, а также распространять их игрокам | Ban 15 - 30 дней / PermBan[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '2.24 Скрытие нарушителей',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>2.24. Запрещено скрывать от администрации нарушителей или злоумышленников | Ban 15 - 30 дней / PermBan + ЧС проекта[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '2.25 Вред проекту',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>2.25. Запрещены попытки или действия, которые могут навредить репутации проекта | PermBan + ЧС проекта[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '2.26 Вред ресурсам проекта',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>2.26. Запрещено намеренно наносить вред ресурсам проекта (игровые серверы, форум, официальные Discord-серверы и так далее) | PermBan + ЧС проекта[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '2.27 Распр адм инфы',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>2.27. Запрещено распространение информации и материалов, которые имеют непосредственное отношение к работе администрации проекта | PermBan + ЧС проекта<br>Примечание: команды администрации, видеозаписи и прочее.[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '2.28 Покупка ИВ',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>2.28. Запрещена покупка/продажа внутриигровой валюты в любых ее проявлениях за реальные деньги | PermBan с обнулением аккаунта + ЧС проекта<br>Примечание: любые попытки покупки/продажи, попытки поинтересоваться о ней у другого игрока и прочее - наказуемы.<br>Исключение: официальная покупка через сайт.[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '2.29 Трансфер между акк',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>2.29. Запрещен трансфер имущества между серверами проекта | PermBan с обнулением аккаунта<br>Примечание: обменять деньги с одного сервера на другой и так далее.[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '2.30 Вред экономике',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>2.30. Запрещено пытаться нанести ущерб экономике сервера | Ban 15 - 30 дней / PermBan<br>Пример: имея достаточное количество денег и имущества игрок начинает раздавать денежные средства и имущество другим игрокам.[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '2.31 Реклама',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>2.31. Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное | PermBan[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '2.32 Обман/оск адм',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>2.32. Запрещено введение в заблуждение, обман, оскорбление, неконструктивная критика администрации на всех ресурсах проекта | Ban 7 - 30 дней / PermBan<br>Пример: подделка доказательств, искажение информации в свою пользу, оскорбление администрации в репорт, обвинение администраторов без доказательств и т.д.[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '2.33 Польз. уязвимостью правил',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>2.33. Запрещено пользоваться уязвимостью правил | Ban 15 - 30 дней<br>Примечание: игрок объясняет свою невиновность тем, что какой-либо пункт правил недостаточно расписан, но вина очевидна.[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '2.34 Уход от наказания',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>2.34. Запрещен уход от наказания | Ban 15 - 30 дней (суммируется к общему наказанию дополнительно)<br>Примечание: зная, что в данный момент игроку может быть выдано наказание за какое-либо нарушение, запрещен целенаправленный выход из игры, изменение никнейма или передача всего своего имущества на другие аккаунты и тому подобное.[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '2.35 IC OOC кон/религия',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>2.35. На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате | Mute 30 минут / Ban 7 - 15 дней[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '2.36 перенос конф IC-OOC',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>2.36. Запрещено переносить конфликты из IC в OOC, и наоборот | Warn / Ban 15 - 30 дней<br>Примечание: все межфракционные конфликты решаются главными следящими администраторами.[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '2.37 ООС угрозы',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>2.37. Запрещены OOC угрозы, в том числе и завуалированные | Ban 15 - 30 дней / PermBan[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '2.38 Распр лич.инфы о игроках',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>2.38. Запрещено распространять личную информацию игроков и их родственников | Ban 15 - 30 дней / PermBan<br>Исключение: личное предоставление данной информации, разрешение на распространение от владельца.[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '2.39 Злоупот нарушениями',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>2.39. Злоупотребление нарушениями правил сервера | Ban 15 - 30 дней / PermBan<br>Примечание: неоднократное нарушение правил сервера (более 5 нарушений), которые были совершены за прошедшие 7 дней.<br>Пример: было получено пять наказаний за DM, шестое будет злоупотреблением. Если было получено одно наказание за CAPS, два наказания за МГ и два наказания за DM, следующее будет считаться злоупотреблением.[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '2.40 Деструктивные дей-я',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>2.40. Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе | Ban 15 - 30 дней / PermBan[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '2.41 Передача акк',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>2.41. Передача своего личного игрового аккаунта третьим лицам | PermBan[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '2.42 Продажа акк, имущ за реал',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>2.42. Попытка продажи любого игрового имущества или игрового аккаунта за реальные деньги | PermBan[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '2.43 Продажа промо от проекта',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>2.43. Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций | Mute 30 минут / Ban 7 - 15 дней[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '2.44 Запр РП сон',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>2.44. На серверах проекта запрещен Role Play сон (нахождение в AFK без ESC) | Kick<br>Исключение: сон разрешается с 23:00 до 6:00 в совершенно любых местах, но только на соответствующих и привычных для этого объектах (скамейки, кровати и так далее).<br>Примечание: сон запрещается в тех местах, где он может оказывать любую помеху другим игрокам сервера.[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '2.46 ЕПП',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>2.46. Запрещено ездить по полям на любом транспорте | Jail 30 минут<br>Исключение: разрешено передвижение на кроссовых мотоциклах и внедорожниках.[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '2.47 ЕПП на фуре',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>2.47. Запрещено ездить по полям на грузовом транспорте (работа дальнобойщика) | Jail 60 минут[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '2.48 Прод/покупка рейт.семьи',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>2.48. Продажа или покупка репутации семьи любыми способами. | Обнуление рейтинга семьи<br>Примечание: сокрытие информации о продаже репутации семьи приравнивается к пункту правил 2.24.[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '2.50 Аресты на аукционе',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>заголовок<br>2.50. Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона | Ban 7 - 15 дней + увольнение из организации[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '2.51 Вмешательство в РП процесс',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>2.51. Запрещено вмешательство в Role Play процесс с целью помехи и препятствования дальнейшего развития Role Play процесса | Jail 30 минут<br>}Пример: вмешательство в Role Play процесс при задержании игрока сотрудниками ГИБДД, вмешательство в проведение тренировки или мероприятия какой-либо фракции и тому подобные ситуации.[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '2.52 нонРП акс',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>2.52. Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. | При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут<br>Пример: слишком большие аксессуары на голове персонажа, имитация гитарой половых органов и тому подобное.[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '2.54 Неув отношение к адм',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>2.54. Запрещено неуважительное обращение, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации | Mute 120 минут<br>Пример: оформление жалобы в игре с текстом: Быстро починил меня, Админы вы задрали уже когда работать будете меня тут ДБшат я 3 жалобы уже подал!!!!!!!!, МОЗГИ ВКЛЮЧИТЕ Я УВОЛЮ ВАС ЩА и т.д. и т.п., а также при взаимодействии с другими игроками.[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '3.01 Общение не на русском',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>3.01. Общепризнанный язык сервера — русский. Общение в IC и OOC чатах во всех RolePlay ситуациях обязательно должно проходить исключительно на русском языке | Устное замечание / Mute 30 минут[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '3.02 Caps Lock',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>3.02. Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате | Mute 30 минут[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '3.03 Оск',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>3.03. Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены | Mute 30 минут[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '3.04 Оск/упом родных',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>3.04. Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) | Mute 120 минут / Ban 7 - 15 дней<br>Примечание: термин MQ расценивается, как упоминание родных.<br>Исключение: если упоминание родных было совершено в ходе Role Play процесса и не содержало в себе прямого или завуалированного оскорбления.[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '3.05 Флуд',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>3.05. Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока | Mute 30 минут[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '3.06 Злоупот знаками в чате',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>3.06. Запрещено злоупотребление знаков препинания и прочих символов | Mute 30 минут<br>Пример: «???????», «!!!!!!!», «Дааааааааааааааааааааааа» и так далее.[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '3.07 Оск порочащие честь/достоинства',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>3.07. Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата | Mute 30 минут<br>Примечание: «дырка», «шмара», «ведро», «мадагаскарский присосконог», «свиноногий бандикут», «скорострел» и так далее.[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '3.08 Слив с использованием глоб.чата',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>3.08. Запрещены любые формы «слива» посредством использования глобальных чатов | PermBan[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '3.09 Угрозы наказаниями',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>3.09. Запрещены любые угрозы о наказании игрока со стороны администрации | Mute 30 минут[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '3.10 Выдача себя за адм',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>3.10. Запрещена выдача себя за администратора, если таковым не являетесь | Ban 15 - 30 + ЧС администрации[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '3.11 Ввод в заблуждения командами',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>3.11. Запрещено введение игроков проекта в заблуждение путем злоупотребления командами | Ban 15 - 30 дней / PermBan<br>Примечание: /me чтобы поднять кошелек введите /pay 228 5000. Для продажи автомобиля введите /sellmycar id 2828 (счёт в банке) цена.[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '3.14 Музыка в войс',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>3.14. Запрещено включать музыку в Voice Chat | Mute 60 минут[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '3.15 Оск игроков или родных в войс',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>3.15. Запрещено оскорблять игроков или родных в Voice Chat | Mute 60 минут / Ban 15 - 30 дней[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '3.16 Шумы/посторонние звуки в войс',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>3.16. Запрещено создавать посторонние шумы или звуки | Mute 30 минут<br>Примечание: Посторонние звуки на фоне речи, мешающие взаимодействию игроков посредством голосового чата. Сильное искажение звука, исходящее из микрофона плохого качества. Намеренно портить игру другим игрокам (кричать, перебивать)[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '3.17 Реклама в войс',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>3.17. Запрещено рекламировать в Voice Chat | PermBan[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '3.18 Полит/религи пропагандирование',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>3.18. Запрещено политическое и религиозное пропагандирование | Ban 15 - 30 дней[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '3.19 Софт для изминения голоса',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>3.19. Запрещено использование любого софта для изменения голоса | Mute 60 минут[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '3.20 Транслит',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>3.20. Запрещено использование транслита в любом из чатов | Mute 30 минут<br>Пример: «Privet», «Kak dela», «Narmalna».[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '3.21 Реклама промо',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>3.21. Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. | Ban 30 дней<br>Примечание: чаты семейные, строительных компаний, транспортных компаний, фракционные чаты, IC, OOC, VIP и так далее.[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '3.22 Обьявления в гос помещениях',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>3.22. Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) | Mute 30 минут<br>Пример: в помещении центральной больницы писать в чат: Продам эксклюзивную шапку дешево!!![/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '4.03 Передача акк',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>4.03. Запрещена совершенно любая передача игровых аккаунтов третьим лицам | PermBan[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '4.04 Иметь только два акк',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>4.04. Разрешается зарегистрировать максимально только два игровых аккаунта на сервере | PermBan[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '4.05 Трансфер между акк',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>4.05. Запрещено передавать любые игровые ценности между игровыми аккаунтами игрока | Ban 15 - 30 дней / PermBan<br>Пример: перекинуть бизнес, АЗС, дом или любые другие игровые материальные ценности с одного аккаунта игрока на другой свой твинк и так далее.[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '4.09 В нике мат',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>4.09. Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные) | Устное замечание + смена игрового никнейма / PermBan[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
    },
    {
	  title: '4.10 Создавать повторяющиеся ники',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
"[FONT=courier new][SIZE=4][B]Игроку будет выдано наказание по пункту правил:<br>4.10. Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию | Устное замечание + смена игрового никнейма / PermBan<br>Пример: подменять букву i на L и так далее, по аналогии.[/B][/SIZE][/FONT]<br><br>" +
'[CENTER][B][FONT=courier new][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR].[/SIZE][/FONT][/B][/CENTER]',
	},
];

$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
	addButton('На рассмотрение', 'pin');
	addButton('Одобрено', 'accepted');
	addButton('Отказано', 'unaccept');
	addButton('Выбрать💥', 'selectAnswer');

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