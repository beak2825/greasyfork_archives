// ==UserScript==
// @name         Кураторы Форума/Кураторы/ЗГА | STAVROPOL (Раздел Жалоб) by Matvey Voronov
// @namespace    https://forum.blackrussia.online
// @version      1
// @description  Специально для Администрации, которая занимается рассмотрением жалоб на игроков.
// @author       Matvey_Voronov
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license 	 MIT
// @collaborator Quenk269
// @icon https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @downloadURL https://update.greasyfork.org/scripts/497870/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%D0%97%D0%93%D0%90%20%7C%20STAVROPOL%20%28%D0%A0%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB%20%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%29%20by%20Matvey%20Voronov.user.js
// @updateURL https://update.greasyfork.org/scripts/497870/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%D0%97%D0%93%D0%90%20%7C%20STAVROPOL%20%28%D0%A0%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB%20%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%29%20by%20Matvey%20Voronov.meta.js
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
const SPECIAL_PREFIX = 11;
const TEX_PREFIX = 13;
const CLOSE_PREFIX = 7;
const buttons = [
    {
      title: '- - - - - - - - - - - - - - - - - - - - - - - - -Для рассматривающих Жалобы на игроков- - - - - - - - - - - - - - - - - - - - - - - - - - -'
},
{
	  title: '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Правила RolePlay процесса- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -'
},
{
	  title: '| NonRP Поведение |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.01.[/color] Запрещено поведение, нарушающее нормы процессов Role Play режима игры [Color=#ff0000]| Jail 30 минут[/color].[/COLOR]<br><br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]ездить на крышах транспортных средств, бегать или ходить по столам в казино, целенаправленная провокация сотрудников правоохранительных органов с целью развлечения, целенаправленная помеха в проведении различных собеседований и так далее.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Уход от RP |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.02.[/color] Запрещено целенаправленно уходить от Role Play процесса всеразличными способами [Color=#ff0000]| Jail 30 минут / Warn[/color].[/COLOR]<br><br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]уходить в AFK при остановке транспортного средства правоохранительными органами, выходить из игры для избежания смерти, выходить из игры во время процесса задержания или ареста, полное игнорирование отыгровок другого игрока, которые так или иначе могут коснуться Вашего персонажа. Уходить в интерьер или зеленую зону во время перестрелки с целью избежать смерти или уйти от Role Play процесса и так далее.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| NonRP Drive |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.03.[/color] Запрещён NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере [Color=#ff0000]| Jail 30 минут[/color].[/COLOR]<br><br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] нарушением считаются такие действия, как езда на скутере по горам, намеренное создание аварийных ситуаций при передвижении. Передвижение по полям на любом транспорте, за исключением кроссовых мотоциклов и внедорожников.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Помеха RP |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.04.[/color] Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы [Color=#ff0000]| Ban 10 дней / Обнуление аккаунта (при повторном нарушении)[/color].[/COLOR]<br><br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Пример: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] таран дальнобойщиков, инкассаторов под разными предлогами.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| nRP обман |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.05.[/color] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [Color=#ff0000]| PermBan[/color].[/COLOR]<br><br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] после IC договоренности получить денежные средства и сразу же выйти из игры с целью обмана игрока, или же, договорившись через OOC чат (/n), точно также получить денежные средства и сразу же выйти из игры и тому подобные ситуации.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] разблокировка игрового аккаунта нарушителя будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого имущества, которое было украдено (по решению обманутой стороны).[/FONT][/COLOR][/SIZE][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| AFK без ESC |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.07.[/color] Запрещено нахождение в AFK без включенного ESC, создавая помеху другим игрокам [Color=#ff0000]| Kick[/color].[/COLOR]<br><br>" +
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Аморальные действия |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.08.[/color] Запрещена любая форма аморальных действий сексуального характера в сторону игроков [Color=#ff0000]| Jail 30 минут / Warn[/color].[/COLOR]<br><br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Исключение: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] обоюдное согласие обеих сторон.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Слив склада |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.09.[/color] Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле [Color=#ff0000]| Ban 15 - 30 дней / PermBan[/color].[/COLOR]<br><br>" +
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Обман в /do |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.10.[/color] Запрещено в любой форме обманывать в /do, даже если это в дальнейшем негативно скажется на Вашем игровом персонаже [Color=#ff0000]| Jail 30 минут / Warn[/color].[/COLOR]<br><br>" +
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Исп. фракц. т/с в лич. целях |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.11.[/color] Запрещено использование рабочего или фракционного транспорта в личных целях [Color=#ff0000]| Jail 30 минут[/color].[/COLOR]<br><br>" +
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Затягивание RP |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.12.[/color] Запрещено целенаправленное затягивание Role Play процесса [Color=#ff0000]| Jail 30 минут[/color].[/COLOR]<br><br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] /me начал доставать документы [1/100], начал доставать документы [2/100] и тому подобное.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| DB |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.13.[/color] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [Color=#ff0000]| Jail 60 минут[/color].[/COLOR]<br><br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Исключение: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] разрешается на территории проведения мероприятия по захвату упавшего семейного контейнера.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| TK |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.15.[/color] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины [Color=#ff0000]| Jail 60 минут / Warn (за два и более убийства)[/color].[/COLOR]<br><br>" +
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| SK |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.16.[/color] Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них [Color=#ff0000]| Jail 60 минут / Warn (за два и более убийства)[/color].[/COLOR]<br><br>" +
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| MG |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.18.[/color] Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] использование смайлов в виде символов «))», «=D» запрещено в IC чате.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] телефонное общение также является IC чатом.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br><br>"+
                "[B][CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Исключение: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] за написанный однократно вопросительный «?» или восклицательный «!» знак в IC чате, наказание не выдается.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| DM |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.19.[/color] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [Color=#ff0000]| Jail 60 минут[/color].[/COLOR]<br><br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] нанесение урона с целью защиты особняка или его территории, а также нанесение урона после ДТП не является веской IC причиной, для войны семей предусмотрено отдельное системное мероприятие.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Mass DM |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.20.[/color] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более [Color=#ff0000]| Warn / Ban 3 - 7 дней[/color].[/COLOR]<br><br>" +
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Обход системы |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.21.[/color] Запрещено пытаться обходить игровую систему или использовать любые баги сервера [Color=#ff0000]| Ban 15 - 30 дней /PermBan (по согласованию с ГА, ЗГА, руководством тех. специалистов)[/color].[/COLOR]<br><br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] под игровой системой подразумеваются функции и возможности, которые реализованы в игре для взаимодействия между игроками, а также взаимодействия игроков с функциями, у которых есть свое конкретное предназначение.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] аптечка предназначена для пополнения уровня здоровья, доступна всем игрокам по фиксированной цене в любом магазине. Но она не предназначена для перепродажи по завышенной цене с целью передачи виртуальной валюты между игроками;<br>Аксессуары предназначены для украшения внешнего вида персонажа, не предназначены для передачи виртуальной валюты между игроками;<br>Банк и личные счета предназначены для передачи денежных средств между игроками;<br>Транспортное средство предназначено для передвижения игроков, не предназначено для передачи денег тем или иным способом, включая обмен с завышенными доплатами.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Стороннее ПО |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.22.[/color] Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ff0000]| Ban 15 - 30 дней / PermBan[/color].[/COLOR]<br><br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] запрещено внесение любых изменений в оригинальные файлы игры.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Исключение: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] разрешено изменение шрифта, его размера и длины чата (кол-во строк).[/FONT][/COLOR][/SIZE][/CENTER][/B]<br><br>"+
                "[B][CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Исключение: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] блокировка за включенный счетчик FPS не выдается.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Скрытие/распространение багов |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.23.[/color] Запрещено скрывать от администрации ошибки игровых систем, а также распространять их игрокам [Color=#ff0000]| Ban 15 - 30 дней / PermBan[/color].[/COLOR]<br><br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] игрок, зная об ошибке, дающей преимущество, при обращении администрации вводит её в заблуждение, чтобы сохранить ошибку в тайне.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Сокрытие нарушителей |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.24.[/color] Запрещено скрывать от администрации нарушителей или злоумышленников [Color=#ff0000]| Ban 15 - 30 дней / PermBan + ЧС проекта[/color].[/COLOR]<br><br>" +
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Вред репутации проекта |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.25.[/color] Запрещены попытки или действия, которые могут навредить репутации проекта [Color=#ff0000]| PermBan + ЧС проекта[/color].[/COLOR]<br><br>" +
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Вред ресурсам проекта |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.26.[/color] Запрещено намеренно наносить вред ресурсам проекта (игровые серверы, форум, официальные Discord-серверы и так далее) [Color=#ff0000]| PermBan + ЧС проекта[/color].[/COLOR]<br><br>" +
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Слив Адм инф |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.27.[/color] Запрещено распространение информации и материалов, непосредственно связанных с деятельностью администрации проекта, которые могут повлиять на работу и систему администрации [Color=#ff0000]| PermBan + ЧС проекта[/color].[/COLOR]<br><br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Пример: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] публикация внутренней переписки администрации, использование и распространение внутренней информации, распространение видеозаписей, а также другие аналогичные действия.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Покупка/Продажа ИВ |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.28.[/color] Запрещена покупка, продажа внутриигровой валюты за реальные деньги в любом виде [Color=#ff0000]| PermBan с обнулением аккаунта + ЧС проекта[/color].[/COLOR]<br><br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] любые попытки купить или продать внутриигровую валюту, интересоваться этим у других игроков или обсуждать это – наказуемо.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] нельзя обменивать донат валюту (например, рубли, пополненные через сайт) на игровые ценности и наоборот.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br><br>"+
                "[B][CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Пример: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] пополнение донат-счёта другого игрока в обмен на игровую валюту или другие ценности запрещено.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br><br>"+
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] продавать или обменивать игровые ценности, которые были куплены за донат-валюту, не запрещено.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[B][CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Исключение: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] покупка игровой валюты или ценностей через официальный сайт разрешена.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Ущерб экономике |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.30.[/color] Запрещено пытаться нанести ущерб экономике сервера [Color=#ff0000]| Ban 15 - 30 дней / PermBan[/color].[/COLOR]<br><br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] имея достаточное количество денег и имущества игрок начинает раздавать денежные средства и имущество другим игрокам.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Реклама сторонних ссылок |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.31.[/color] Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube-каналы и тому подобное [Color=#ff0000]| Ban 7 дней / PermBan[/color].[/COLOR]<br><br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] если игрок не использует глобальный чат, чтобы дать свои контактные данные для связи, это не будет являться рекламой.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Обман Администрации |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.32.[/color] Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта [Color=#ff0000]| Ban 7 - 15 дней[/color].[/COLOR]<br><br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Пример: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] подделка доказательств, искажение информации в свою пользу, предоставление неполной информации о ситуации.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] по решению руководства сервера может быть выдана перманентная блокировка как на аккаунт, с которого совершен обман, так и на все аккаунты нарушителя. [Color=#ff0000]| PermBan[/color].[/FONT][/COLOR][/SIZE][/CENTER][/B]<br><br>"+
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] за предоставление услуг по прохождению обзвонов на различные должности, а также за услуги, облегчающие процесс обзвона, может быть выдан чёрный список проекта. [Color=#ff0000]| PermBan + ЧС проекта[/color].[/FONT][/COLOR][/SIZE][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Пользование уязвимостью правил |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.33.[/color] Запрещено пользоваться уязвимостью правил [Color=#ff0000]| Ban 15 - 30 дней / PermBan[/color].[/COLOR]<br><br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] игрок объясняет свою невиновность тем, что какой-либо пункт правил недостаточно расписан, но вина очевидна. Либо его действия формально не нарушают конкретного пункта, но всё же наносят ущерб другим игрокам или игровой системе.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br><br>"+
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Пример: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] игрок сознательно берёт долг через трейд, не планируя его возвращать, считая, что по правилам это не считается долгом и наказания не будет.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Розжиг межнац. конфликтов |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.35.[/color] На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате [Color=#ff0000]| Mute 120 минут / Ban 7 дней[/color].[/COLOR]<br><br>" +
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| OOC угрозы и угрозы от Адм|',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.37.[/color] Запрещены OOC-угрозы, в том числе и завуалированные, а также угрозы наказанием со стороны администрации [Color=#ff0000]| Mute 120 минут / Ban 7 - 15 дней.[/color].[/COLOR]<br><br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] блокировка аккаунта выдаётся в случае, если есть прямые угрозы жизни, здоровью игрока или его близким. По решению главного администратора может быть выдана перманентная блокировка.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Распространение личной информации |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.38.[/color] Запрещено распространять личную информацию игроков и их родственников [Color=#ff0000]| Ban 15 - 30 дней / PermBan + ЧС проекта[/color].[/COLOR]<br><br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] распространение личной информации пользователя без его согласия запрещено.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Злоупотребление нарушениями |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.39.[/color] Злоупотребление нарушениями правил сервера [Color=#ff0000]| Ban 7 - 15 дней[/color].[/COLOR]<br><br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] неоднократное (от шести и более) нарушение правил серверов, которые были совершены за прошедшие 7 дней, с момента проверки истории наказаний игрока.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[B][CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] наказания выданные за нарушения правил текстовых чатов, помеху (kick) не учитываются.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[B][CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Исключение: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] пункты правил: 2.54, 3.04 учитываются в качестве злоупотребления нарушениями правил серверов.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br><br>"+
                "[B][CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Пример: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] было получено пять наказаний за DM, шестое будет злоупотреблением. Если было получено одно наказание за упоминание родных, два наказания за DB и два наказания за DM, следующее будет считаться злоупотреблением.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Оск проекта |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.40.[/color] Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [Color=#ff0000]| Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором)[/color].[/COLOR]<br><br>" +
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Передача аккаунта |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.41.[/color] Передача своего личного игрового аккаунта третьим лицам [Color=#ff0000]| PermBan[/color].[/COLOR]<br><br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] передачей аккаунта является предоставление третьим лицам паролей, пин-кодов и данных, которые дают доступ к игровому аккаунту.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Трансфер имущества |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.41.[/color] Запрещена передача либо трансфер игровых ценностей, между игровыми аккаунтами либо серверами, а также в целях удержания имущества [Color=#ff0000]| Ban 15 - 30 дней / PermBan[/color].[/COLOR]<br><br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Пример: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] передать бизнес, АЗС, дом или любые другие игровые материальные ценности с одного аккаунта игрока на другой / используя свой твинк / договорившись заранее с игроком и иные способы удержания.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Продажа имущества/аккаунта |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.42.[/color] Попытка продажи любого игрового имущества или игрового аккаунта за реальные деньги [Color=#ff0000]| PermBan[/color].[/COLOR]<br><br>" +
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Владение бизнеса с одного акк |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]4.11.[/color] Владеть бизнесами разрешается с одного основного аккаунта [Color=#ff0000]| Обнуление твинк аккаунта.[/color].[/COLOR]<br><br>" +
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Неактивность при владении бизнесом |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]4.14.[/color] Запрещено, имея транспортную или строительную компанию, не проявлять активность в игре [Color=#ff0000]| Обнуление компании без компенсации.[/color].[/COLOR]<br><br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] если не заходить в игру в течение 5 дней, не чинить транспорт в ТК, не проявлять активность в СК – компания обнуляется автоматически.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Продажа промокодов |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.43.[/color] Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций [Color=#ff0000]| Mute 120 минутЁ[/color].[/COLOR]<br><br>" +
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| nRP сон |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.44.[/color] На серверах проекта запрещен Role Play сон (нахождение в AFK без ESC) [Color=#ff0000]| Kick[/color].[/COLOR]<br><br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Исключение: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] сон разрешается с 23:00 до 6:00 в совершенно любых местах, но только на соответствующих и привычных для этого объектах (скамейки, кровати и так далее).[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] сон запрещается в тех местах, где он может оказывать любую помеху другим игрокам сервера.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| nRP drive Дально/Инкас |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.47.[/color] Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) [Color=#ff0000]| Jail 60 минут[/color].[/COLOR]<br><br>" +
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Арест в казино/аукционе/мп |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.50.[/color] Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий [Color=#ff0000]| Ban 7 - 15 дней + увольнение из организации[/color].[/COLOR]<br><br>" +
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| nRP аксессуар |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.52.[/color] Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера [Color=#ff0000]| При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут[/color].[/COLOR]<br><br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Пример: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] слишком большие аксессуары на голове персонажа, имитация гитарой половых органов и тому подобное.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Оск Администрации |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.54.[/color] Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [Color=#ff0000]| Mute 180 минут[/color].[/COLOR]<br><br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Пример: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] оформление жалобы в игре с текстом: Быстро починил меня, Админы вы задрали уже когда работать будете меня тут ДБшат я 3 жалобы уже подал!!!!!!!!, МОЗГИ ВКЛЮЧИТЕ Я УВОЛЮ ВАС ЩА и т.д. и т.п., а также при взаимодействии с другими игроками.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Пример: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] оскорбление администрации в любой чат, включая репорт подлежит наказанию в виде блокировки доступа к использованию всех видов чатов[/FONT][/COLOR][/SIZE][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Багоюз анимации |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.55.[/color] Запрещается багоюз, связанный с анимацией в любых проявлениях. [Color=#ff0000]| Jail 60 / 120 минут[/color].[/COLOR]<br><br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] наказание применяется в случаях, когда, используя ошибку, игрок получает преимущество перед другими игроками.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Пример: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] если игрок, используя баг, убирает ограничение на использование оружия в зелёной зоне, сбивает темп стрельбы, либо быстро перемещается во время войны за бизнес, перестрелки на мероприятии с семейными контейнерами или на мероприятии от администрации.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br><br>"+
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Исключение: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] разрешается использование сбива темпа стрельбы в войне за бизнес при согласии обеих сторон и с уведомлением следящего администратора в соответствующей беседе.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Невозврат долга |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.57.[/color] Запрещается брать в долг игровые ценности и не возвращать их [Color=#ff0000]| Ban 30 дней / permban[/color].[/COLOR]<br><br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] неоднократное (от шести и более) займ может быть осуществлен только через зачисление игровых ценностей на банковский счет, максимальный срок займа 30 календарных дней, если займ не был возвращен, аккаунт должника блокируется;[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[B][CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] при невозврате игровых ценностей общей стоимостью менее 5 миллионов включительно аккаунт будет заблокирован на 30 дней, если более 5 миллионов, аккаунт будет заблокирован навсегда;[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[B][CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] жалоба на игрока, который занял игровые ценности и не вернул в срок, подлежит рассмотрению только при наличии подтверждения суммы и условий займа в игровом процессе, меры в отношении должника могут быть приняты только при наличии жалобы и доказательств. Жалоба на должника подается в течение 10 дней после истечения срока займа. Договоры вне игры не будут считаться доказательствами.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Правила Чатов- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - '
},
{
	  title: '| CapsLock |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.02.[/color] Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Пример: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] ПрОдАм, куплю МАШИНУ[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Оскорбления в OOC |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.03.[/color] Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>" +
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Упом/Оск родни |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.04.[/color] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [Color=#ff0000]| Mute 120 минут / Ban 7 - 15 дней[/color].[/COLOR]<br><br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] термины MQ, rnq расценивается, как упоминание родных.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Исключение: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] если упоминание родных было совершено в ходе Role Play процесса и не содержало в себе прямого или завуалированного оскорбления.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Flood |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.05.[/color] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>" +
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Злоупотребление символами |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.06.[/color] Запрещено злоупотребление знаков препинания и прочих символов [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Пример: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] «???????», «!!!!!!!», «Дааааааааааааааааааааааа» и так далее.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Слив глоб. чата |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.08.[/color] Запрещены любые формы «слива» посредством использования глобальных чатов [Color=#ff0000]| PermBan[/color].[/COLOR]<br><br>" +
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Выдача себя за Адм |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.10.[/color] Запрещена выдача себя за администратора, если таковым не являетесь [Color=#ff0000]| Ban 7 - 15[/color].[/COLOR]<br><br>" +
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Ввод в заблуждение |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.11.[/color] Запрещено введение игроков проекта в заблуждение путем злоупотребления командами [Color=#ff0000]| Ban 15 - 30 дней / PermBan[/color].[/COLOR]<br><br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] /me чтобы поднять кошелек введите /pay 228 5000. Для продажи автомобиля введите /sellmycar id 2828 (счёт в банке) цена.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Транслит/Offtop/Caps/Мат в репорт |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.12.[/color] Запрещено подавать репорт, написанный транслитом, с сообщением не по теме (Offtop), с включённым Caps Lock, с использованием нецензурной брани, и повторять обращение (если ответ уже был дан ранее) [Color=#ff0000]| Report Mute 30 минут[/color].[/COLOR]<br><br>" +
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Музыка в Voice |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.14.[/color] Запрещено включать музыку в Voice Chat [Color=#ff0000]| Mute 60 минут[/color].[/COLOR]<br><br>" +
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Шумы в Voice |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.16.[/color] Запрещено создавать посторонние шумы или звуки [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] Посторонние звуки на фоне речи, мешающие взаимодействию игроков посредством голосового чата. Сильное искажение звука, исходящее из микрофона плохого качества. Намеренно портить игру другим игрокам (кричать, перебивать)[/FONT][/COLOR][/SIZE][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Призыв к flood |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.18.[/color] Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов [Color=#ff0000]| Mute 120 минут / Ban 10 дней[/color].[/COLOR]<br><br>" +
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Софт голоса |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.19.[/color] Запрещено использование любого софта для изменения голоса [Color=#ff0000]| Mute 60 минут[/color].[/COLOR]<br><br>" +
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Транслит |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.20.[/color] Запрещено использование транслита в любом из чатов [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Пример: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] «Privet», «Kak dela», «Narmalna».[/FONT][/COLOR][/SIZE][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Реклама промокодов |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.21.[/color] Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах [Color=#ff0000]| Ban 30 дней[/color].[/COLOR]<br><br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] чаты семейные, строительных компаний, транспортных компаний, фракционные чаты, IC, OOC, VIP и так далее.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[B][CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Исключение: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] промокоды, предоставленные разработчиками, а также распространяемые через официальные ресурсы проекта.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[B][CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Пример: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] если игрок упомянет промокод, распространяемый через официальную публичную страницу ВКонтакте либо через официальный Discord в любом из чатов, наказание ему не выдается.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Объявления на тт госс |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.22.[/color] Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Пример: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] в помещении центральной больницы писать в чат: Продам эксклюзивную шапку дешево!!![/FONT][/COLOR][/SIZE][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Мат в VIP |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.23.[/color] Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>" +
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -Правила госс. структур- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -'
},
{
	  title: '| Работы в госс форме |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]1.07.[/color] Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, принадлежащей своей фракции[Color=#ff0000]| Jail 30 минут[/color].[/COLOR]<br><br>" +
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Исп фракц. т/с в лич. целях |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]1.08.[/color] апрещено использование фракционного транспорта в личных целях [Color=#ff0000]| Jail 30 минут[/color].[/COLOR]<br><br>" +
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Одиночный патруль |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]1.11.[/color] Всем силовым структурам запрещен одиночный патруль или конвоирование, минимум 2 сотрудника [Color=#ff0000]| Jail 30 минут[/color].[/COLOR]<br><br>" +
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Б/у/Казино в госс форме |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]1.13.[/color] Запрещено находиться в форме внутри казино, участвовать в битве за контейнеры, участвовать в захвате семейного контейнера, находится на Б/У рынке с целью покупки / продажи авто, а также устраиваться на сторонние работы в форме фракции [Color=#ff0000]| Jail 30 минут[/color].[/COLOR]<br><br>" +
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Задержание до BizWar |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]1.14.[/color] Сотрудникам правоохранительных органов запрещается задерживать состав участников войны за бизнес за 10 минут непосредственно до начала самого бизвара [Color=#ff0000]| Jail 30 минут[/color].[/COLOR]<br><br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Исключение: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] в случае, если состав участников войны за бизнес первый начал совершать действия, которые нарушают закон.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| DM на тт Армии |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]6.01.[/color] Наносить урон игрокам, которые находятся вне территории воинской части, запрещено [Color=#ff0000]| DM / Jail 60 минут / Warn[/color].[/COLOR]<br><br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] предупреждение (Warn) выдается только в случае Mass DM.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Нарушение редакт объяв |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]4.01.[/color] Запрещено редактирование объявлений, не соответствующих ПРО [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Пример: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] игрок отправил одно слово, а редактор вставил полноценное объявление.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| nRP эфир |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]4.02.[/color] Запрещено проведение эфиров, не соответствующих Role Play правилам и логике [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>" +
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Редак объяв в лич целях |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]4.04.[/color] Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком [Color=#ff0000]| Ban 7 дней + ЧС организации[/color].[/COLOR]<br><br>" +
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| DM на тт УМВД |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]6.01.[/color] Запрещено наносить урон игрокам без Role Play причины на территории УМВД [Color=#ff0000]| DM / Jail 60 минут / Warn[/color].[/COLOR]<br><br>" +
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| nRP розыск УМВД |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]6.02.[/color] Запрещено выдавать розыск без Role Play причины [Color=#ff0000]| Warn[/color].[/COLOR]<br><br>" +
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| nRP поведение УМВД |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]6.03.[/color] Запрещено nRP поведение [Color=#ff0000]| Warn[/color].[/COLOR]<br><br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] поведение, не соответствующее сотруднику УМВД.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Пример: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] - открытие огня по игрокам без причины,<br>- расстрел машин без причины,<br>- нарушение ПДД без причины,<br>- сотрудник на служебном транспорте кричит о наборе в свою семью на спавне.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| DM на тт ГИБДД |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]7.01.[/color] Запрещено наносить урон игрокам без Role Play причины на территории ГИБДД [Color=#ff0000]| DM / Jail 60 минут / Warn[/color].[/COLOR]<br><br>" +
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| nRP розыск ГИБДД |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]7.02.[/color] Запрещено выдавать розыск, штраф без Role Play причины [Color=#ff0000]| Warn[/color].[/COLOR]<br><br>" +
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| nRP лишение прав ГИБДД |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]7.04.[/color] Запрещено отбирать водительские права во время погони за нарушителем [Color=#ff0000]| Warn[/color].[/COLOR]<br><br>" +
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| DM на тт ФСБ |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]8.01.[/color] Запрещено наносить урон игрокам без Role Play причины на территории ФСБ [Color=#ff0000]| DM / Jail 60 минут / Warn[/color].[/COLOR]<br><br>" +
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| nRP розыск ФСБ |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]8.02.[/color] Запрещено выдавать розыск без Role Play причины [Color=#ff0000]| Warn[/color].[/COLOR]<br><br>" +
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| nRP обыск |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]8.05.[/color] Запрещено проводить обыск игрока без Role Play отыгровки [Color=#ff0000]| Warn[/color].[/COLOR]<br><br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] запрещено несоответствующее поведение по аналогии с пунктом 6.03.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| DM на тт ФСИН |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]9.01.[/color] Запрещено наносить урон игрокам без Role Play причины на территории ФСИН [Color=#ff0000]| DM / Jail 60 минут / Warn[/color].[/COLOR]<br><br>" +
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Правила ОПГ- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - '
},
{
	  title: '| Провокация госс |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.[/color] Запрещено провоцировать сотрудников государственных организаций [Color=#ff0000]| Jail 30 минут[/color].[/COLOR]<br><br>" +
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Провокация других ОПГ |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.[/color] Запрещено провоцировать сотрудников криминальных организаций возле или на территории вражеской группировки [Color=#ff0000]| Jail 30 минут[/color].[/COLOR]<br><br>" +
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| DM на тт ОПГ |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]4.[/color] Запрещено без причины наносить урон игрокам на территории ОПГ [Color=#ff0000]| Jail 60 минут[/color].[/COLOR]<br><br>" +
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Дуэли ОПГ |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]5.[/color] Запрещено устраивать дуэли где-либо, а также на территории ОПГ [Color=#ff0000]| Jail 30 минут[/color].[/COLOR]<br><br>" +
    "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Исключение: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] территория проведения войны за бизнес, когда мероприятие не проходит. [/FONT][/COLOR][/SIZE][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Перестрелки в людных местах |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]6.[/color] Запрещено устраивать перестрелки с другими ОПГ в людных местах [Color=#ff0000]| Jail 60 минут[/color].[/COLOR]<br><br>" +
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Реклама в чате ОПГ |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]7.[/color] Запрещена любая реклама (семей, транспортных и строительных компаний и т.д.), предложения о купле, продаже, обмене чего-либо в чате организации [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>" +
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Уход от погони на тт ОПГ |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]8.[/color] Запрещено уходить от погони со стороны правоохранительных органов путем заезда на территорию своей банды для того чтобы скрыться или получить численное преимущество [Color=#ff0000]| Jail 30 минут[/color].[/COLOR]<br><br>" +
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| nRP в/ч |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.[/color] За нарушение правил нападения на Войсковую Часть выдаётся предупреждение [Color=#ff0000]| Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ)[/color].[/COLOR]<br><br>" +
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| nRP похищение/ограбление |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]Общие правила ограблений и похищений.[/color] За нарушения правил похищений/ограблений игрок будет наказан [Color=#ff0000]| Kick/Jail (от 10 до 60 минут)/Warn/Ban (от 1 до 30 дней)/Строгий или устный выговор лидеру нелегальной организации[/color].[/COLOR]<br><br>" +
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -Передача на рассмотрение- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -'
},
{
	  title: '| На рассмотрение |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба взята на [COLOR=#ffff00]рассмотрение[/COLOR], пожалуйста ожидайте ответа.<br><br>",
	  prefix: PIN_PREFIX,
	  status: true,
},
{
	  title: '| Тех. спецу |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба передана на [COLOR=#ffff00]рассмотрение[/COLOR] [COLOR=#0000ff]Техническому специалисту[/COLOR], пожалуйста ожидайте ответа.<br><br>",
	  prefix: TEX_PREFIX,
	  status: true,
},
{
	  title: '| Главному администратору |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба передана на [COLOR=#ffff00]рассмотрение[/COLOR] [COLOR=#ff0000]Главному администратору[/COLOR], пожалуйста ожидайте ответа.<br><br>",
	  prefix: GA_PREFIX,
	  status: true,
},
{
	  title: '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - В другой раздел- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - '
},
{
	  title: '| В жб на Адм |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как вы ошиблись разделом. Обратитесь в раздел «Жалобы на администрацию». <br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| В жб на Лд |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как вы ошиблись разделом. Обратитесь в раздел «Жалобы на лидеров». <br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| В жб на сотрудников |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как вы ошиблись разделом. Обратитесь в раздел «Жалобы на сотрудников». <br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| В обжалования |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как вы ошиблись разделом. Обратитесь в раздел «Обжалование наказаний». <br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| В Тех раздел |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как вы ошиблись разделом. Обратитесь в технический раздел. <br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| В жб на Теха |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как вы ошиблись разделом. Обратитесь в раздел «Жалобы на технических специалистов». <br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
    	  title: '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Правила форума - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - '
},
{
	  title: '| Неадекват |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил пользования форумом:<br><br>"+
                "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.02.[/color] Запрещено неадекватное поведение в любой возможной форме, от оскорблений простых пользователей, до оскорбления администрации или других членов команды проекта.[/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Травля пользователя |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил пользования форумом:<br><br>"+
                "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.03.[/color] Запрещена массовая травля, то есть агрессивное преследование одного из пользователей данного форума.[/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Провокация, розжиг конфликта |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил пользования форумом:<br><br>"+
                "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.04.[/color] Запрещены латентные, то есть скрытные (завуалированные), саркастические сообщения/действия, созданные в целях оскорбления того или иного лица, либо для его провокации и дальнейшего розжига конфликта.[/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Реклама |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил пользования форумом:<br><br>"+
                "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.31.[/color] Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное.[/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| 18+ |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил пользования форумом:<br><br>"+
                "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.06.[/color] Запрещено размещение любого возрастного контента, которые несут в себе интимный, либо насильственный характер, также фотографии содержащие в себе шок-контент, на примере расчленения и тому подобного.[/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Flood , Offtop |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил пользования форумом:<br><br>"+
                "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.07.[/color] Запрещено флудить, оффтопить во всех разделах которые имеют строгое назначение.[/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Религия/политика |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил пользования форумом:<br><br>"+
                "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.09.[/color] Запрещены споры на тему религии/политики.[/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Помеха развитию проекта |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил пользования форумом:<br><br>"+
                "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.09.[/color] Запрещены деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе.[/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Попрошайничество |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил пользования форумом:<br><br>"+
                "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.16.[/color] Запрещено вымогательство или попрошайничество во всех возможных проявлениях.[/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Злоуп Caps/транслит |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил пользования форумом:<br><br>"+
                "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.17.[/color] Запрещено злоупотребление Caps Lock`ом или транслитом.[/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Дубликат тем (в случае если подали на игрока) |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил пользования форумом:<br><br>"+
                "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.18.[/color] Запрещена публикация дублирующихся тем.[/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Бесмысленный/оск Nik фа |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил пользования форумом:<br><br>"+
                "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.02.[/color] Запрещено регистрировать аккаунты с бессмысленными никнеймами и содержащие нецензурные выражения.[/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Feik Nik фа адм/лд |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил пользования форумом:<br><br>"+
                "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.03.[/color] Запрещено регистрировать аккаунты с никнеймами похожими на никнеймы администрации.[/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
title: '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Отказ жалобы - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -'
	},
    {
	  title: '| Дублирование |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ранее вы оставляли подобную тему и вам был дан ответ. Напоминаю, за дублирование тем ваш форумный аккаунт может быть заблокирован. <br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Нарушений не найдено |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как нарушений со стороны данного игрока не было найдено. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Возврат средств |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как администрация сервера не несёт ответственности за утраченные Вами средства при обмане и т.д. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Недостаточно док-в |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательств на нарушение от данного игрока  недостаточно. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Не фиксируется в логах |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как по данным доказательствам нельзя выдать наказание игроку. Все нарушения должны быть подтверждены через определенные ресурсы, а не только по предоставленным доказательствам. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Отсутствуют док-ва |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательств на нарушение от данного игрока  отсутствуют. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Док-ва отредактированы |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательств на нарушение от данного игрока  отредактированы. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Слив семьи |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как слив семьи никак не относится к правилам проекта, то есть если Лидер семьи дал игроку роль заместителя, то только он за это и отвечает, Администрация сервера не несет за это ответственность. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Не по форме |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как ваша жалоба составлена не по форме. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Заголовок не по форме |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как заголовок вашей жалобы составлен не по форме. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Нет /time |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как на ваших доказательствах отсутствует /time.  <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Нет time кодов|',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как отсутствует time коды. Если видео длится больше 3-ех минут - Вы должны указать time коды нарушений. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Более 72-х часов |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как с момента совершенного нарушения со стороны игрока прошло более 72 часов. Срок написания жалобы составляет три дня (72 часа) с момента совершенного нарушения со стороны игрока сервера.<br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Док-ва соц сеть |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательства загружены в соц. сетях. Загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur). <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Условия сделки |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как в Ваших доказательствах отсутствуют условия сделки. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Нужен фрапс |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательств недостаточно. В данной ситуации необходим фрапс(запись экрана). <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Фрапс обрывается |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как видео-доказательство обрывается. Загрузите полную видеозапись на видео-хостинг YouTube. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Док-ва не открываются |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как ваши доказательства не открываются. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Жалоба от 3-го лицо |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как Ваша жалоба написана от 3-го лица. Жалоба от третьего лица не принимается (жалоба должна быть подана участником ситуации). <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Был наказан ранее |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как игрок был наказан ранее в игре. <br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Ошиблись сервером |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как вы ошиблись сервером, подайте вашу жалобу на нужный сервер. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: UNACCEPT_PREFIX,
	  status: false,

},
{
    	  title: '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -Для Руководства сервера- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -'
    },
    {
	  title: '| Приветствие+свой ответ |',
	  content:
		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] [/CENTER][/COLOR][/B]",
},
{
	  title: '| На рассмотрение |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба взята [COLOR=#FFFF00]на рассмотрение[/COLOR]. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ожидать ответа и не создавать дубликаты данной темы.<br><br>",

	  prefix: PIN_PREFIX,
	  status: false,
},
{
	  title: '| Не по теме(Закрыто) |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как не имеет никакого отношения к данному разделу. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб, закрепленные в данном разделе.<br><br>"+
                "[B][CENTER][COLOR=#FF0000]Закрыто[/COLOR][COLOR=lavender].[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: CLOSE_PREFIX,
	  status: false,
},
{
    	  title: '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -Отказы- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -'
},
{
	  title: '| Не по форме(Закрыто) |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как составлена не по форме. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб, закрепленные в данном разделе.<br><br>"+
                "[B][CENTER][COLOR=#FF0000]Закрыто[/COLOR][COLOR=lavender].[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: '| Нет /time(Отказано) |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как в предоставленных доказательств отсутствует время (/time), соответственно, жалоба рассмотрению не подлежит. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб, закрепленные в данном разделе.<br><br>"+
                "[B][CENTER][COLOR=#FF0000]Закрыто[/COLOR][COLOR=lavender].[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| От 3 лица(Отказано) |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как она составлена от 3-го лица, соответственно, жалоба рассмотрению не подлежит. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб, закрепленные в данном разделе.<br><br>"+
                "[B][CENTER][COLOR=#FF0000]Закрыто[/COLOR][COLOR=lavender].[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Док-ва не открываются(Отказано) |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как ваши доказательства не открываются, соответственно, жалоба рассмотрению не подлежит. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб, закрепленные в данном разделе.<br><br>"+
                "[B][CENTER][COLOR=#FF0000]Закрыто[/COLOR][COLOR=lavender].[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Дока-во отредактированы(Отказано) |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательства отредактированы, соответственно, жалоба рассмотрению не подлежит. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб, закрепленные в данном разделе.<br><br>"+
                "[B][CENTER][COLOR=#FF0000]Закрыто[/COLOR][COLOR=lavender].[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Прошло более 48 часов(Отказано) |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как с момента выдачи наказания прошло более 48-ми часов, соответственно, жалоба рассмотрению не подлежит. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб, закрепленные в данном разделе.<br><br>"+
                "[B][CENTER][COLOR=#FF0000]Закрыто[/COLOR][COLOR=lavender].[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Отсутствуют док-ва(Отказано) |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как отсутствуют доказательства, соответственно, жалоба рассмотрению не подлежит. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб, закрепленные в данном разделе.<br><br>"+
                "[B][CENTER][COLOR=#FF0000]Закрыто[/COLOR][COLOR=lavender].[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Не рабочие док-ва(Отказано) |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как предоставленные доказательства не рабочие, либо же битая ссылка, пожалуйста, загрузите доказательства на фото/видео хостинге. Жалоба рассмотрению не подлежит. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб, закрепленные в данном разделе.<br><br>"+
                "[B][CENTER][COLOR=#FF0000]Закрыто[/COLOR][COLOR=lavender].[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Окно бана(Отказано) |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как отсутствует окно блокировки. Зайдите в игру и сделайте скриншот окна с блокировкой, после чего, заново составьте жалобу. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб, закрепленные в данном разделе.<br><br>"+
                "[B][CENTER][COLOR=#FF0000]Закрыто[/COLOR][COLOR=lavender].[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Бан по ip(Закрыто) |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Для решения данной проблемы, вы можете сменить wi-fi соединение или же ip адрес на тот с которого вы играли раньше, скорее всего дело именно в нем. Также вы можете перезагрузить ваш роутер или воспользоваться VPN. <br><br>"+
                "[B][CENTER][COLOR=#FF0000]Закрыто[/COLOR][COLOR=lavender].[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: '| Дублирование(Закрыто) |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как она является дубликатом прошлой.<br><br>Напоминаю, что за дублирование тем, ваш форумный аккаунт может быть заблокирован.<br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб, закрепленные в данном разделе.<br><br>"+
                "[B][CENTER][COLOR=#FF0000]Закрыто[/COLOR][COLOR=lavender].[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Ответ уже был дан |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как ответ на подобную жалобу был дан в прошлой вашей теме, прочитайте вердикт более внимательнее. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб, закрепленные в данном разделе.<br><br>"+
                "[B][CENTER][COLOR=#FF0000]Закрыто[/COLOR][COLOR=lavender].[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
    	  title: '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -Одобрение- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -'
},
{
	  title: '| Проведена работа с Адм |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Благодарим за ваше обращение! С администратором будет проведена необходимая работа. <br><br>"+
                "[B][CENTER][COLOR=#FF0000]Закрыто[/COLOR][COLOR=lavender].[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Неверный вердикт в жалобе, беседа |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR]. С администратором будет проведена необходимая работа по проверке жалоб. <br><br>"+
                "[B][CENTER][COLOR=#FF0000]Закрыто[/COLOR][COLOR=lavender].[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Неверный вердикт в жалобе, Наказание |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR]. Администратор будет наказан, в связи с некачественной проверкой жалоб. <br><br>"+
                "[B][CENTER][COLOR=#FF0000]Закрыто[/COLOR][COLOR=lavender].[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Беседа с админом |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR]. С Администратором будет проведена профилактическая беседа. <br><br>"+
                "[B][CENTER][COLOR=#FF0000]Закрыто[/COLOR][COLOR=lavender].[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Строгая беседа с админом |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR]. С Администратором будет проведена строгая беседа. <br><br>"+
                "[B][CENTER][COLOR=#FF0000]Закрыто[/COLOR][COLOR=lavender].[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Админ будет наказан |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR]. Администратор будет наказан. <br><br>"+
                "[B][CENTER][COLOR=#FF0000]Закрыто[/COLOR][COLOR=lavender].[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Нет нарушений |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как исходя из выше приложенных доказательств, нарушения со стороны администратора - не обнаружено! <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб, закрепленные в данном разделе.<br><br>"+
                "[B][CENTER][COLOR=#FF0000]Закрыто[/COLOR][COLOR=lavender].[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Наказание верное |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как администратор пердоставил доказательства на ваше науршение.<br><br>Наказание выдано верно. <br><br>"+
                "[B][CENTER][COLOR=#FF0000]Закрыто[/COLOR][COLOR=lavender].[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Наказание по ошибке |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR].<br><br>В ходе беседы с администратором, было выяснено, что наказание выдано по неверно.<br><br>Приносим свои извинения за пердоставленные неудобства. <br><br>"+
                "[B][CENTER][COLOR=#FF0000]Закрыто[/COLOR][COLOR=lavender].[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Админ Снят/ПСЖ |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как данный игрок больше не занимает пост администратора. <br><br>"+
                "[B][CENTER][COLOR=#FF0000]Закрыто[/COLOR][COLOR=lavender].[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Передано ГА |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба переадресована [COLOR=#FF0000]Главному Администратору[/COLOR]. <br><br>"+
        "[B][CENTER][COLOR=lavender]Убедительная просьба ожидать ответа и не создавать дубликаты данной темы.<br><br>"+
                "[B][CENTER][COLOR=#FFFF00]На рассмотрение[/COLOR][COLOR=lavender].[/COLOR]<br><br>",

	  prefix: GA_PREFIX,
	  status: false,
},
{
	  title: '| Передано ЗГА |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба переадресована [COLOR=#FF0000]Заместителю Главного Администратора[/COLOR]. <br><br>"+
        "[B][CENTER][COLOR=lavender]Убедительная просьба ожидать ответа и не создавать дубликаты данной темы.<br><br>"+
                "[B][CENTER][COLOR=#FFFF00]На рассмотрение[/COLOR][COLOR=lavender].[/COLOR]<br><br>",

	  prefix: PIN_PREFIX,
	  status: false,
},
{
	  title: '| Рук. Модерации Discord |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба переадресована [COLOR=#FF0000]Руководителю Модерации[/COLOR]. <br><br>"+
        "[B][CENTER][COLOR=lavender]Убедительная просьба ожидать ответа и не создавать дубликаты данной темы.<br><br>"+
                "[B][CENTER][COLOR=#FFFF00]На рассмотрение[/COLOR][COLOR=lavender].[/COLOR]<br><br>",

	  prefix: PIN_PREFIX,
	  status: false,
},
{
	  title: '| Передано КП |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба переадресована [COLOR=#FF0000]Команде Проекта[/COLOR]. <br><br>"+
        "[B][CENTER][COLOR=lavender]Убедительная просьба ожидать ответа и не создавать дубликаты данной темы.<br><br>"+
                "[B][CENTER][COLOR=#FFFF00]На рассмотрение[/COLOR][COLOR=lavender].[/COLOR]<br><br>",

	  prefix: COMMAND_PREFIX,
	  status: false,
},
{
	  title: '| Передано Спецу и Заму Спеца |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба переадресована [COLOR=#FF0000]Специальной Администрации[/COLOR]. <br><br>"+
        "[B][CENTER][COLOR=lavender]Убедительная просьба ожидать ответа и не создавать дубликаты данной темы.<br><br>"+
                "[B][CENTER][COLOR=#FFFF00]На рассмотрение[/COLOR][COLOR=lavender].[/COLOR]<br><br>",

	  prefix: SPECIAL_PREFIX,
	  status: false,
},
{
	  title: '| Отказ (Соц Сети) |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательства предоставлены в социальных сетях.<br><br>Убедительная просьба разместить доказательства на фото/видео хостинге. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб, закрепленные в данном разделе.<br><br>"+
                "[B][CENTER][COLOR=#FF0000]Закрыто[/COLOR][COLOR=lavender].[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| В Тех раздел |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как не имеет никакого отношения к данному разделу.<br><br>Пожалуйста составьте свою жалобу в Технический раздел сервера. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб, закрепленные в данном разделе.<br><br>"+
                "[B][CENTER][COLOR=#FF0000]Закрыто[/COLOR][COLOR=lavender].[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| В ЖБ на теха |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как не имеет никакого отношения к данному разделу.<br><br>Пожалуйста составьте свою жалобу в раздел Жалобы на Технических специалистов. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб, закрепленные в данном разделе.<br><br>"+
                "[B][CENTER][COLOR=#FF0000]Закрыто[/COLOR][COLOR=lavender].[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| В обжалования |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как не имеет никакого отношения к данному разделу.<br><br>Пожалуйста составьте свою жалобу в раздел Обжалований. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб, закрепленные в данном разделе.<br><br>"+
                "[B][CENTER][COLOR=#FF0000]Закрыто[/COLOR][COLOR=lavender].[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
             title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Обжалования ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
},
{
	  title: '| Обжалование отказано |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Администрация не готова сократить или снять вам наказание. <br><br>"+
                "[B][CENTER][COLOR=lavender]В обжаловании [COLOR=#FF0000]отказано[/COLOR].[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=lavender]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.<br><br>"+
                "[B][CENTER][COLOR=#FF0000]Закрыто[/COLOR][COLOR=lavender].[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Обжалованию не подлежит |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Данное нарушение обжалованию не подлежит. <br><br>"+
                "[B][CENTER][COLOR=lavender]Внимательно прочитайте правила подачи обжалования.<br><br>"+
                "[B][CENTER][COLOR=lavender]В обжаловании [COLOR=#FF0000]отказано[/COLOR].[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=#FF0000]Закрыто[/COLOR][COLOR=lavender].[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Отказ (Не по форме) |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваше обращение составлено не по форме. <br><br>"+
                "[B][CENTER][COLOR=lavender]Вы можете ознакомиться с правильной формулировкой темы в закрепленном сообщении данного раздела и повторно создать новую тему.<br><br>"+
                "[B][CENTER][COLOR=lavender]В обжаловании [COLOR=#FF0000]отказано[/COLOR].[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=#FF0000]Закрыто[/COLOR][COLOR=lavender].[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Обжалование передано ГА |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваше обжалование передано на [COLOR=#ffff00]рассмотрение[/COLOR] [COLOR=#ff0000]Главному Администратору[/COLOR].<br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ожидать ответа и не создавать дубликаты данной темы.<br><br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Обжалование одобрено |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender]В обжаловании [COLOR=#00FF00]одобрено[/COLOR].[/COLOR]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваше наказание будет снято / снижено в ближайшее время. <br><br>"+
                "[B][CENTER][COLOR=lavender]Пожалуйста, впредь не повторяйте ошибок, которые могут привести к таким последствиям, а также внимательно изучите общие правила серверов.<br><br>"+
                "[B][CENTER][COLOR=#FF0000]Закрыто[/COLOR][COLOR=lavender].[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Снижено до 30 дней |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender]В обжаловании [COLOR=#00FF00]одобрено[/COLOR].[/COLOR]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваше наказание будет снижено до 30 дней блокировки. <br><br>"+
                "[B][CENTER][COLOR=lavender]Пожалуйста, впредь не повторяйте ошибок, которые могут привести к таким последствиям, а также внимательно изучите общие правила серверов.<br><br>"+
                "[B][CENTER][COLOR=#FF0000]Закрыто[/COLOR][COLOR=lavender].[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Снижено до 15 дней |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender]В обжаловании [COLOR=#00FF00]одобрено[/COLOR].[/COLOR]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваше наказание будет снижено до 15 дней блокировки. <br><br>"+
                "[B][CENTER][COLOR=lavender]Пожалуйста, впредь не повторяйте ошибок, которые могут привести к таким последствиям, а также внимательно изучите общие правила серверов.<br><br>"+
                "[B][CENTER][COLOR=#FF0000]Закрыто[/COLOR][COLOR=lavender].[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Снижено до 7 дней |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender]В обжаловании [COLOR=#00FF00]одобрено[/COLOR].[/COLOR]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваше наказание будет снижено до 7 дней блокировки. <br><br>"+
                "[B][CENTER][COLOR=lavender]Пожалуйста, впредь не повторяйте ошибок, которые могут привести к таким последствиям, а также внимательно изучите общие правила серверов.<br><br>"+
                "[B][CENTER][COLOR=#FF0000]Закрыто[/COLOR][COLOR=lavender].[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Снижено до 120 мута |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender]В обжаловании [COLOR=#00FF00]одобрено[/COLOR].[/COLOR]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваше наказание будет снижено до 120 минут блокировки чата. <br><br>"+
                "[B][CENTER][COLOR=lavender]Пожалуйста, впредь не повторяйте ошибок, которые могут привести к таким последствиям, а также внимательно изучите общие правила серверов.<br><br>"+
                "[B][CENTER][COLOR=#FF0000]Закрыто[/COLOR][COLOR=lavender].[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Уже обжалован |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ранее вам уже было одобрено обжалование и ваше наказание было снижено/снято - повторного обжалования не будет. <br><br>"+
                "[B][CENTER][COLOR=lavender]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.<br><br>"+
                "[B][CENTER][COLOR=#FF0000]Закрыто[/COLOR][COLOR=lavender].[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| ОБЖ на рассмотрение |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваше обжалование взято на [COLOR=#FFFF00]рассмотрение[/COLOR], пожалуйста не создавайте дубликатов. Ожидайте ответа. <br><br>",

	  prefix: PIN_PREFIX,
	  status: false,
},
{
	  title: '| Просрочка ОБЖ |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] В вашем случае нужно было сразу реагировать на выданное наказание и обращаться в раздел жалоб на администрацию, в настоящий момент срок написания жалобы прошел. <br><br>"+
                "[B][CENTER][COLOR=lavender]Если вы все же согласны с решением администратора - составьте новую тему, предварительно прочитав правила подачи обжалований, закреплённые в данном разделе.<br><br>"+
                "[B][CENTER][COLOR=#FF0000]Закрыто[/COLOR][COLOR=lavender].[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| В жб на админов |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Если вы не согласны с выданным наказанием, то напишите в раздел Жалобы на Администрацию. <br><br>"+
                "[B][CENTER][COLOR=#FF0000]Закрыто[/COLOR][COLOR=lavender].[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| ОБЖ кинул обманщик NonRP обман |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Обжалование в вашу пользу должен писать игрок, которого вы обманули. <br><br>"+
                "[B][CENTER][COLOR=lavender]В доказательствах должны иметься: окно блокировки вашего аккаунта, переписка с обманутым игроком, где вы решили на какую компенсацию он согласен и ваше сообщение, в котором вы признаете совершенную ошибку и впредь обязуетесь не повторять ее.<br><br>"+
                "[B][CENTER][COLOR=lavender]После всего этого главная администрация рассмотрит обжалование, но это не гарантирует того, что вас обжалуют.<br><br>"+
                "[B][CENTER][COLOR=#FF0000]Закрыто[/COLOR][COLOR=lavender].[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| ОБЖ Использование ПО |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваш игровой акаунт был заблокирован навсегда за использование стороннего ПО. <br><br>"+
                "[B][CENTER][COLOR=lavender]В обжаловании [COLOR=#FF0000]отказано[/COLOR].[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=lavender]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.<br><br>"+
                "[B][CENTER][COLOR=#FF0000]Закрыто[/COLOR][COLOR=lavender].[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Окно бана |',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Прикрепите в доказательства скриншот окна блокировки, которое появляется сразу после входа в игру. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи обжалований, закрепленные в данном разделе.<br><br>"+
                "[B][CENTER][COLOR=#FF0000]Закрыто[/COLOR][COLOR=lavender].[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на BLACK RUSSIA | STAVROPOL.<br><br>",

	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Будете разблокированы на 24ч для смены ника|',
	  content:

		"[B][CENTER][SIZE=4][COLOR=WRITE][FONT=book antiqua]{{ greeting }}, уважаемый[/COLOR] [COLOR=RED]{{ user.name }}[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваш аккаунт будет разблокирован на 24 часа. <br><br>"+
                "[B][CENTER][COLOR=lavender]В течение этого времени вы должны сменить свой Nick_Name и предоставить скриншот /history.<br><br>"+
                "[B][CENTER][COLOR=#FFFF00]На рассмотрение[/COLOR][COLOR=lavender].[/COLOR]<br><br>",

	  prefix: PIN_PREFIX,
	  status: false,
},
];

$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
	addButton('Меню', 'selectAnswer');
	addButton('Одобрить✅', 'ACCEPT_PREFIX');
	addButton('Отказать⛔', 'UNACCEPT_PREFIX');
        addButton('Закрыто⛔', 'CLOSE_PREFIX');
        addButton('На рассмотрение💫', 'PIN_PREFIX');


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
  `<button type="button" class="button rippleButton" id="${id}" style="margin: 3px;">${name}</button>`
);
}

function buttonsMarkup(buttons) {
return `<div class="select_answer">${buttons
  .map(
	(btn, i) =>
	  `<button id="answers-${i}" class="button--primary button ` +
	  `rippleButton" style="margin:5px"><span class="button-text">${btn.title}</span></button>`
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