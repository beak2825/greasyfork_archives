// ==UserScript==
// @name         BLACK RUSSIA | Скрипт для ГКФ/ЗГКФ
// @namespace    https://forum.blackrussia.online
// @version      1.2.3.30
// @description  Специально для BARNAUL
// @author       Vlad_Anonim
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license 	 MIT
// @collaborator Quenk269
// @icon https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @downloadURL https://update.greasyfork.org/scripts/541363/BLACK%20RUSSIA%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%9A%D0%A4%D0%97%D0%93%D0%9A%D0%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/541363/BLACK%20RUSSIA%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%9A%D0%A4%D0%97%D0%93%D0%9A%D0%A4.meta.js
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
const TEX_PREFIX = 13;
const CLOSE_PREFIX = 7;
const buttons = [
{
	  title: '- - - - - - - - - - - - - - - - - - Правила RolePlay процесса - - - - - - - - - - - - - - - - - -'
},
{
	  title: '| NonRP Поведение |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.01.[/color] Запрещено поведение, нарушающее нормы процессов Role Play режима игры [Color=#ff0000]| Jail 30 минут.[/color][/COLOR]<br><br>" +
        "[B][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]ездить на крышах транспортных средств, бегать или ходить по столам в казино, целенаправленная провокация сотрудников правоохранительных органов с целью развлечения, целенаправленная помеха в проведении различных собеседований и так далее.[/FONT][/COLOR][/Spoiler][/CENTER][/B]<br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Уход от RP |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.02.[/color] Запрещено целенаправленно уходить от Role Play процесса всеразличными способами [Color=#ff0000]| Jail 30 минут / Warn.[/color][/COLOR]<br><br>"+
        "[B][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]например, уходить в AFK при остановке транспортного средства правоохранительными органами, выходить из игры для избежания смерти, выходить из игры во время процесса задержания / ареста, полное игнорирование отыгровок другого игрока, которые так или иначе могут коснуться Вашего персонажа. Уходить в интерьер или зеленую зону во время перестрелки с целью избежать смерти или уйти от Role Play процесса и так далее.[/FONT][/COLOR][/Spoiler][/CENTER][/B]<br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| NonRP drive |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.03.[/color] Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере [Color=#ff0000]| Jail 30 минут.[/color][/COLOR]<br><br>"+
        "[B][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание:[/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] нарушением считаются такие действия, как езда на скутере по горам, намеренное создание аварийных ситуаций при передвижении. Передвижение по полям на любом транспорте, за исключением кроссовых мотоциклов и внедорожников.[/FONT][/COLOR][/Spoiler][/CENTER][/B]<br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Помеха работе |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.04.[/color] Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы.[Color=#ff0000]| Ban 10 дней / Обнуление аккаунта (при повторном нарушении).[/color][/COLOR]<br><br>"+
        "[B][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Пример:[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] таран дальнобойщиков, инкассаторов под разными предлогами.[/SIZE][/FONT][/COLOR][/Spoiler][/CENTER][/B]<br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| NonRP Обман |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.05.[/color] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [Color=#ff0000]| PermBan.[/color][/COLOR]<br><br>" +
        "[B][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]после IC договоренности получить денежные средства и сразу же выйти из игры с целью обмана игрока, или же, договорившись через OOC чат (/n), точно также получить денежные средства и сразу же выйти из игры и тому подобные ситуации.[/COLOR][/FONT]<br>" +
        "[B][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]разблокировка игрового аккаунта нарушителя будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого имущества, которое было украдено (по решению обманутой стороны).[/COLOR][/FONT][/Spoiler][/CENTER][/B]<br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Долг |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.57.[/color] Запрещается брать в долг игровые ценности и не возвращать их. [Color=#ff0000] Ban 30 дней / PermBan. [/color][/COLOR]<br><br>" +
        "[B][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]займ может быть осуществлен только через зачисление игровых ценностей на банковский счет, максимальный срок займа 30 календарных дней, если займ не был возвращен, аккаунт должника блокируется.[/COLOR][/FONT]<br>" +
        "[B][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]при невозврате игровых ценностей общей стоимостью менее 5 миллионов включительно аккаунт будет заблокирован на 30 дней, если более 5 миллионов, аккаунт будет заблокирован навсегда.[/COLOR][/FONT]<br>"+
        "[B][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]жалоба на игрока, который занял игровые ценности и не вернул в срок, подлежит рассмотрению только при наличии подтверждения суммы и условий займа в игровом процессе, меры в отношении должника могут быть приняты только при наличии жалобы и доказательств. Жалоба на должника подается в течение 10 дней после истечения срока займа. Договоры вне игры не будут считаться доказательствами..[/COLOR][/FONT][/Spoiler][/CENTER][/B]<br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Аморал |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.08.[/color] Запрещена любая форма аморальных действий сексуального характера в сторону игроков [Color=#ff0000]| Jail 30 минут. / Warn[/color][/COLOR]<br><br>" +
        "[B][SIZE=4][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]обоюдное согласие обеих сторон.[/COLOR][/FONT][/SIZE][/Spoiler][/CENTER][/B]<br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Слив склада |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.09.[/color] Запрещено сливать склад фракции / семьи путем взятия большого количества ресурсов или превышая допустимый лимит, установленный лидером [Color=#ff0000]| Ban 15 - 30 дней / PermBan.[/color][/COLOR]<br><br>" +
        "[B][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]в описании семьи должны быть указаны условия взаимодействия со складом. Если лидер семьи предоставил неограниченный доступ к складу и забыл снять его, администрация не несет ответственности за возможные последствия. Жалобы по данному пункту правил принимаются только от лидера семьи.[/COLOR][/FONT]<br>" +
        "[B][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]исключение всех или части игроков из состава семьи без ведома лидера также считается сливом.[/COLOR][/FONT][/Spoiler][/CENTER][/B]<br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| DB |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.13.[/color] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [Color=#ff0000]| Jail 60 минут.[/color][/COLOR]<br><br>" +
        "[B][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]разрешается на территории проведения мероприятия по захвату упавшего семейного контейнера.[/COLOR][/FONT][/Spoiler][/CENTER][/B]<br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| TK |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.15.[/color] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины [Color=#ff0000]| Jail 60 минут / Warn (за два и более убийства).[/color][/COLOR][/Spoiler][/CENTER][/B]<br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| SK |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.16.[/color] Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них [Color=#ff0000]| Jail 60 минут / Warn (за два и более убийства).[/color][/COLOR][/Spoiler][/CENTER][/B]<br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| MG |',
	  content:
	        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.18.[/color] Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [Color=#ff0000]| Mute 30 минут.[/color][/COLOR]<br><br>"+
		"[B][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]использование смайлов в виде символов «))», «=D» запрещено в IC чате.[/COLOR][/FONT]<br>" +
        "[B][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]телефонное общение также является IC чатом.[/COLOR][/FONT]<br>" +
        "[B][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]за написанный однократно вопросительный «?» или восклицательный «!» знак в IC чате, наказание не выдается.[/COLOR][/FONT][/Spoiler][/CENTER][/B]<br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| DM |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.19.[/color] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [Color=#ff0000]| Jail 60 минут.[/color][/COLOR]<br><br>"+
		"[B][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил.[/COLOR][/FONT]<br>" +
        "[B][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]нанесение урона с целью защиты особняка или его территории, а также нанесение урона после ДТП не является веской IC причиной, для войны семей предусмотрено отдельное системное мероприятие.[/COLOR][/FONT][/Spoiler][/CENTER][/B]<br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Mass DM |',
	  content:
		'[CENTER][url=https://postimages.org/][img][/img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.20. [/color] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более [Color=#ff0000]| Warn / Ban 3 - 7 дней.[/color][/COLOR][/Spoiler][/CENTER][/B]<br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Читы |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.22.[/color] Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ff0000]| Ban 15 - 30 дней / PermBan.[/color][/COLOR]<br><br>"+
        "[B][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]запрещено внесение любых изменений в оригинальные файлы игры.[/COLOR][/FONT]<br>" +
        "[B][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]разрешено изменение шрифта, его размера и длины чата (кол-во строк).[/COLOR][/FONT]<br>" +
        "[B][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]блокировка за включенный счетчик FPS не выдается.[/COLOR][/FONT][/Spoiler][/CENTER][/B]<br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Угрозы |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.37.[/color] Запрещены OOC-угрозы, в том числе и завуалированные, а также угрозы наказанием со стороны администрации [Color=#ff0000]| Mute 120 минут / Ban 7 - 15 дней.[/color][/COLOR][/B]<br><br>"+
        "[B][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание:[/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] блокировка аккаунта выдаётся в случае, если есть прямые угрозы жизни, здоровью игрока или его близким. По решению главного администратора может быть выдана перманентная блокировка.[/FONT][/COLOR][/Spoiler][/CENTER][/B]<br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Злоуп наказаниями |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.39.[/color] Злоупотребление нарушениями правил сервера [Color=#ff0000]| Ban 7 - 30 дней.[/color][/COLOR]<br><br>"+
        "[B][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]неоднократное (от шести и более) нарушение правил сервера, которые были совершены за прошедшие 7 дней.[/COLOR][/FONT]<br>" +
        "[B][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]наказания выданные за нарушения правил текстовых чатов, помеху (kick) в учет не идут.[/COLOR][/FONT]<br>" +
        "[B][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]пункты правил: 2.54, 3.04 учитываются в качестве злоупотребления нарушениями правил серверов.[/COLOR][/FONT]<br>" +
        "[B][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]было получено пять наказаний за DM, шестое будет злоупотреблением. Если было получено одно наказание за упоминание родных, два наказания за DB и два наказания за DM, следующее будет считаться злоупотреблением.[/COLOR][/FONT][/Spoiler][/CENTER][/B]<br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Оск проекта |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.40.[/color] Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [Color=#ff0000]| Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором).[/color][/COLOR][/Spoiler][/CENTER][/B]<br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Продажа промо |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.43.[/color] Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций [Color=#ff0000]| Mute 120 минут.[/color][/COLOR][/Spoiler][/CENTER][/B]<br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| ЕПП (фура/инк) |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.47.[/color] Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) [Color=#ff0000]| Jail 60 минут.[/color][/COLOR][/Spoiler][/CENTER][/B]<br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Арест на аукционе |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.50.[/color] Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий[Color=#ff0000]| Ban 7 - 15 дней + увольнение из организации. [/color][/COLOR][/Spoiler][/CENTER][/B]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| NonRP аксессуар |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.52.[/color] Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера [Color=#ff0000]| При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + Jail 30 минут.[/color][/COLOR]<br><br>"+
                "[B][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]слишком большие аксессуары на голове персонажа, имитация гитарой половых органов и тому подобное.[/COLOR][/FONT][/Spoiler][/CENTER][/B]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Мат в названии (Бизнеса/Семьи) |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.53.[/color] Запрещено устанавливать названия для внутриигровых ценностей с использованием нецензурной лексики, оскорблений, слов политической или религиозной направленности [Color=#ff0000]| Принудительная смена названия семьи / Ban 1 день / При повторном нарушении – обнуление бизнеса.[/color][/COLOR]<br><br>"+
                "[B][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]названия семей, бизнесов, компаний и т.д.[/COLOR][/FONT][/Spoiler][/CENTER][/B]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Оск адм |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.54.[/color] Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [Color=#ff0000]| Mute 180 минут.[/color][/COLOR]<br><br>"+
                "[B][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]оформление жалобы в игре с текстом: Быстро починил меня, Админы вы задрали уже когда работать будете меня тут ДБшат я 3 жалобы уже подал!!!!!!!!, МОЗГИ ВКЛЮЧИТЕ Я УВОЛЮ ВАС ЩА и т.д. и т.п., а также при взаимодействии с другими игроками.[/COLOR][/FONT]<br>" +
                "[B][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]оскорбление администрации в любой чат, включая репорт подлежит наказанию в виде блокировки доступа к использованию всех видов чатов - [Color=#ff0000]Mute 180 минут[/color].[/COLOR][/FONT][/Spoiler][/CENTER][/B]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| сбив аним |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.55.[/color] Запрещается багоюз связанный с анимацией в любых проявлениях [Color=#ff0000]| Jail 120 минут.[/color][/COLOR]<br><br>"+
                "[B][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]наказание применяется в случаях, когда, используя ошибку, игрок получает преимущество перед другими игроками.[/COLOR][/FONT]<br>" +
                "[B][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]если игрок, используя баг, убирает ограничение на использование оружия в зелёной зоне, сбивает темп стрельбы, либо быстро перемещается во время войны за бизнес, перестрелки на мероприятии с семейными контейнерами или на мероприятии от администрации.[/COLOR][/FONT]<br>"+
                "[B][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]разрешается использование сбива темпа стрельбы в войне за бизнес при согласии обеих сторон и с уведомлением следящего администратора в соответствующей беседе.[/COLOR][/FONT][/Spoiler][/CENTER][/B]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
        "[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Реклама |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.31.[/color] Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube-каналы и тому подобное [Color=#ff0000]| Ban 7 дней / PermBan.[/color][/COLOR]<br><br>"+
                "[B][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]если игрок не использует глобальный чат, чтобы дать свои контактные данные для связи, это не будет являться рекламой.[/COLOR][/FONT][/Spoiler][/CENTER][/B]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Исп. Уязвимостью правил |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000] 2.33.[/color] Запрещено пользоваться уязвимостью правил  [Color=#ff0000]| Ban 15 - 30 дней / PermBan.[/color][/COLOR]<br><br>"+
        "[B][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]игрок объясняет свою невиновность тем, что какой-либо пункт правил недостаточно расписан, но вина очевидна. Либо его действия формально не нарушают конкретного пункта, но всё же наносят ущерб другим игрокам или игровой системе.[/COLOR][/FONT]<br>" +
        "[B][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]игрок сознательно берёт долг через трейд, не планируя его возвращать, считая, что по правилам это не считается долгом и наказания не будет.[/COLOR][/FONT][/Spoiler][/CENTER][/B]<br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| IC и OOC конфликт(нац/рел) |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.35.[/color] На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате [Color=#ff0000]| Mute 120 минут / Ban 7 дней.[/color][/COLOR][/Spoiler][/CENTER][/B]<br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Попытка продажи имущ/акка |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.42.[/color] Попытка продажи любого игрового имущества или игрового аккаунта за реальные деньги [Color=#ff0000]| PermBan.[/color][/COLOR][/Spoiler][/CENTER][/B]<br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '- - - - - - - - - - - - - - - - - - Chat Правила - - - - - - - - - - - - - - - - - - '
},
{
	  title: '| Caps |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.02.[/color] Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате [Color=#ff0000]| Mute 30 минут.[/color][/COLOR]<br><br>"+
                "[B][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]«ПрОдАм», «куплю МАШИНУ».[/COLOR][/FONT][/Spoiler][/CENTER][/B]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| OOC оск |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.03.[/color] Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены [Color=#ff0000]| Mute 30 минут.[/color][/COLOR][/Spoiler][/CENTER][/B]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Оск/Упом родни |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.04.[/color] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата [Color=#ff0000]| Mute 120 минут / Ban 7 - 15 дней.[/color][/COLOR]<br><br>"+
                "[B][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]термины «MQ», «rnq» расценивается, как упоминание родных.[/COLOR][/FONT]<br>" +
                "[B][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]если упоминание родных было совершено в ходе Role Play процесса и не содержало в себе прямого или завуалированного оскорбления.[/COLOR][/FONT][/Spoiler][/CENTER][/B]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Flood |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.05.[/color] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [Color=#ff0000]| Mute 30 минут.[/color][/COLOR][/Spoiler][/CENTER][/B]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Злоуп символами |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.06.[/color] Запрещено злоупотребление знаков препинания и прочих символов [Color=#ff0000]| Mute 30 минут.[/color][/COLOR]<br><br>"+
                "[B][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]«???????», «!!!!!!!», «Дааааааааааааааааааааааа» и так далее.[/COLOR][/FONT][/Spoiler][/CENTER][/B]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Слив гл. чата (СМИ) |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.08.[/color] Запрещены любые формы «слива» посредством использования глобальных чатов [Color=#ff0000]| PermBan.[/color][/COLOR][/Spoiler][/CENTER][/B]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Выдача себя за администратора |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.10.[/color] Запрещена выдача себя за администратора, если таковым не являетесь [Color=#ff0000]| Ban 7 - 15 дней.[/color][/COLOR][/Spoiler][/CENTER][/B]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Ввод в заблужд командами |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.11.[/color] Запрещено введение игроков проекта в заблуждение путем злоупотребления командами [Color=#ff0000]| Ban 15 - 30 дней / PermBan.[/color][/COLOR]<br><br>"+
                "[B][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]/me чтобы поднять кошелек введите /pay 228 5000. Для продажи автомобиля введите /sellmycar id 2828 (счёт в банке) цена.[/COLOR][/FONT][/Spoiler][/CENTER][/B]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Музыка в Voice |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.14.[/color] Запрещено включать музыку в Voice Chat [Color=#ff0000]| Mute 60 минут.[/color][/COLOR][/Spoiler][/CENTER][/B]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Шумы в Voice |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.16.[/color] Запрещено создавать посторонние шумы или звуки [Color=#ff0000]| Mute 30 минут.[/color][/COLOR]<br><br>"+
                "[B][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]Посторонние звуки на фоне речи, мешающие взаимодействию игроков посредством голосового чата. Сильное искажение звука, исходящее из микрофона плохого качества. Намеренно портить игру другим игрокам (кричать, перебивать).[/COLOR][/FONT][/Spoiler][/CENTER][/B]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Полит/религ пропоганда |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.18.[/color] Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов [Color=#ff0000]| Mute 120 минут / Ban 10 дней.[/color][/COLOR][/Spoiler][/CENTER][/B]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Изменение голоса софтом |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.19.[/color] Запрещено использование любого софта для изменения голоса [Color=#ff0000]| Mute 60 минут.[/color][/COLOR][/Spoiler][/CENTER][/B]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Транслит |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.20[/color] Запрещено использование транслита в любом из чатов [Color=#ff0000]| Mute 30 минут.[/color][/COLOR]<br><br>"+
                "[B][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]«Privet», «Kak dela», «Narmalna».[/COLOR][/FONT][/Spoiler][/CENTER][/B]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Реклама промо |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.21.[/color] ЗЗапрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах [Color=#ff0000]| Ban 30 дней.[/color][/COLOR]<br><br>"+
                "[B][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]чаты семейные, строительных компаний, транспортных компаний, фракционные чаты, IC, OOC, VIP и так далее.[/COLOR][/FONT]<br>" +
                "[B][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]промокоды, предоставленные разработчиками, а также распространяемые через официальные ресурсы проекта.[/COLOR][/FONT]<br>" +
                "[B][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]если игрок упомянет промокод, распространяемый через официальную публичную страницу ВКонтакте либо через официальный Discord в любом из чатов, наказание ему не выдается.[/COLOR][/FONT][/Spoiler][/CENTER][/B]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Обьявления в госс |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.22.[/color] Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) [Color=#ff0000]| Mute 30 минут.[/color][/COLOR]<br><br>"+
                "[B][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]в помещении центральной больницы писать в чат: «Продам эксклюзивную шапку дешево!!!»[/COLOR][/FONT][/Spoiler][/CENTER][/B]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Report |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.12.[/color] Запрещено подавать репорт, написанный транслитом, с сообщением не по теме (Offtop), с включённым Caps Lock, с использованием нецензурной брани, и повторять обращение (если ответ уже был дан ранее) [Color=#ff0000]| Report Mute 30 минут.[/color][/COLOR][/Spoiler][/CENTER][/B]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Мат VIP |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.23.[/color] Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате [Color=#ff0000]| Mute 30 минут.[/color][/COLOR][/Spoiler][/CENTER][/B]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '- - - - - - - - - - - - - - - - - - Передача на рассмотрение - - - - - - - - - - - - - - - - - -'
},
{
	  title: '| На рассмотрение |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба взята на [COLOR=#ffff00]Рассмотрение[/COLOR], пожалуйста ожидайте ответа.<br><br>"+
		"[B][CENTER][COLOR=YELLOW][ICODE] На рассмотрении.. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: PIN_PREFIX,
	  status: true,
},
{
	  title: '| Тех. спецу |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба передана на [COLOR=#ffff00]Рассмотрение[/COLOR] [COLOR=BLUE]Техническому специалисту[/COLOR], пожалуйста ожидайте ответа.<br><br>"+
		"[B][CENTER][COLOR=YELLOW][ICODE] Ожидайте ответа.. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: TEX_PREFIX,
	  status: true,
},
{
	  title: '| Главному администратору |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба передана на [COLOR=#ffff00]Рассмотрение[/COLOR] [COLOR=#ff0000]Главному администратору[/COLOR], пожалуйста ожидайте ответа.<br><br>"+
		"[B][CENTER][COLOR=YELLOW][ICODE] Ожидайте ответа.. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: GA_PREFIX,
	  status: true,
},
{
	  title: '- - - - - - - - - - - - - - - - - - NikName - - - - - - - - - - - - - - - - - -'
},
{
	  title: '| Oск Ник |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]4.09.[/color] Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе завуалированные), а также слова политической или религиозной направленности [Color=#ff0000]| Устное замечание + смена игрового никнейма / PermBan.[/color][/Spoiler]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Фейк |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]4.10.[/color] Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию [Color=#ff0000]| Устное замечание + смена игрового никнейма / PermBan.[/color]<br><br>"+
                "[B][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]подменять букву i на L и так далее, по аналогии.[/COLOR][/FONT][/Spoiler][/CENTER][/B]<br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '- - - - - - - - - - - - - - - - - - Правила Казино/Клуб - - - - - - - - - - - - - - - - - -'
},
{
	  title: '| Продажа должности |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил управления Казино/Ночным клубом:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.01.[/color] Владельцу и менеджерам казино и ночного клуба запрещено принимать работников за денежные средства на любые должности, связанные с деятельностью заведения[Color=#ff0000]| Ban 3 - 5 дней.[/color][/Spoiler]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Налоги у работников |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил управления Казино/Ночным клубом:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.02.[/color] Владельцу и менеджерам казино и ночного клуба [Color=#ff0000]запрещено[/Color] взимать у работников налоги в виде денежных средств за должность в казино [Color=#ff0000]| Ban 3 - 5 дней.[/color][/Spoiler]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '- - - - - - - - - - - - - - - - - - В другой раздел - - - - - - - - - - - - - - - - - -'
},
{
	  title: '| В жб на адм |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Вы ошиблись разделом. Обратитесь в раздел «Жалобы на администрацию» - [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.2957/']*Кликабельно*[/URL] <br><br>"+
                "[B][CENTER][COLOR=lavender][FONT=times new roman]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR][/FONT]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| В жб на лд |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Вы ошиблись разделом. Обратитесь в раздел «Жалобы на лидеров» - [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.2958/']*Кликабельно*[/URL] <br><br>"+
                "[B][CENTER][COLOR=lavender][FONT=times new  roman]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR][/FONT]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| В жб на сотрудников |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Вы ошиблись разделом. Обратитесь в раздел «Жалобы на сотрудников» нужной вам организации. <br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR][/FONT]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| В обжалования |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Вы ошиблись разделом. Обратитесь в раздел «Обжалование наказаний» - [URL='https://forum.blackrussia.online/forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.2960/']*Кликабельно*[/URL] <br><br>"+
                "[B][CENTER][COLOR=lavender][FONT=times new  roman]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR][/FONT]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| В тех раздел |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Вы ошиблись разделом. Обратитесь в технический раздел - [URL='https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-barnaul.2939/']*Кликабельно*[/URL] <br><br>"+
                "[B][CENTER][COLOR=lavender][FONT=times new  roman]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR][/FONT]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| В жб на теха |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Вы ошиблись разделом. Обратитесь в раздел «Жалобы на технических специалистов» - [URL='https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9669-barnaul.2938/']*Кликабельно*[/URL] <br><br>"+
                "[B][CENTER][COLOR=lavender][FONT=times new  roman]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR][/FONT]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '- - - - - - - - - - - - - - - - - - Правила госс. структур - - - - - - - - - - - - - - - - - -'
},
{
	  title: '| Работа в форме |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил для государственных организаций:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]1.07.[/color] Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, принадлежащей своей фракции [Color=#ff0000]| Jail 30 минут.[/color][/COLOR][/Spoiler][/CENTER][/B]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Казино в форме |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]1.13.[/color] Запрещено находиться в форме внутри казино, участвовать в битве за контейнеры, участвовать в семейных активностях, находится на Б/У рынке с целью покупки или продажи авто, находится на аукционе с целью покупки или продажи лота [Color=#ff0000]| Jail 30 минут.[/color][/COLOR]<br><br>"+
                "[B][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]Семейные активности — захват семейного контейнера, битва за территорию, битва семей[/COLOR][/FONT]<br>" +
                "[B][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]за участие в семейных активностях в форме организации, игроку по решению администрации может быть выдано предупреждение [Color=#ff0000]| Warn.[/COLOR][/FONT][/Spoiler][/CENTER][/B]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Т/С в личных целях |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил для государственных организаций:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]1.08.[/color] Запрещено использование фракционного транспорта в личных целях [Color=#ff0000]| Jail 30 минут.[/color][/COLOR][/Spoiler][/CENTER][/B]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Н/ПРО |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил для СМИ:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]4.01.[/color] Запрещено редактирование объявлений, не соответствующих ПРО [Color=#ff0000]| Mute 30 минут.[/color][/COLOR]<br><br>"+
                "[B][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]игрок отправил одно слово, а редактор вставил полноценное объявление.[/COLOR][/FONT][/Spoiler][/CENTER][/B]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| nRP эфир |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил для СМИ:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]4.02.[/color] Запрещено проведение эфиров, не соответствующих Role Play правилам и логике [Color=#ff0000]| Mute 30 минут.[/color][/COLOR][/Spoiler][/CENTER][/B]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Редактирование в лич. целях |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил для СМИ:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]4.04.[/color] Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком [Color=#ff0000]| Ban 7 дней + ЧС организации.[/color][/COLOR][/Spoiler][/CENTER][/B]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Розыск без причины (УМВД) |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил для УМВД:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]6.02.[/color] Запрещено выдавать розыск без Role Play причины [Color=#ff0000]| Warn.[/color][/COLOR][/Spoiler][/CENTER][/B]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Розыск/штраф без причины (ГИБДД) |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил для ГИБДД:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]7.02.[/color] Запрещено выдавать розыск, штраф без Role Play причины [Color=#ff0000]| Warn.[/color][/COLOR][/Spoiler][/CENTER][/B]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Розыск без причины (ФСБ) |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил для ФСБ:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]8.02.[/color] Запрещено выдавать розыск без Role Play причины [Color=#ff0000]| Warn.[/color][/COLOR][/Spoiler][/CENTER][/B]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| nRP поведение УМВД/ГИБДД/ФСБ |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил для государственных структур:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]6.03.[/color] Запрещено nRP поведение [Color=#ff0000]| Warn.[/color][/COLOR]<br><br>"+
                "[B][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]поведение, не соответствующее сотруднику УМВД/ГИБДД/ФСБ.[/COLOR][/FONT]<br>" +
                "[B][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][/FONT]<br>" +
                "[FONT=book antiqua][COLOR=rgb(209, 213, 216)]- открытие огня по игрокам без причины,[/COLOR][/FONT]<br>" +
                "[FONT=book antiqua][COLOR=rgb(209, 213, 216)]- расстрел машин без причины,[/COLOR][/FONT]<br>" +
                "[FONT=book antiqua][COLOR=rgb(209, 213, 216)]- нарушение ПДД без причины,[/COLOR][/FONT]<br>" +
                "[FONT=book antiqua][COLOR=rgb(209, 213, 216)]- сотрудник на служебном транспорте кричит о наборе в свою семью на спавне.[/COLOR][/FONT]<br>"+
                "[FONT=book antiqua][COLOR=rgb(209, 213, 216)]- сотрудник с целью облегчить процесс конвоирования, убивает преступника в наручниках.[/COLOR][/FONT][/Spoiler][/CENTER][/B]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Права в погоне (ГИБДД) |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил для ГИБДД:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]7.04.[/color] Запрещено отбирать водительские права во время погони за нарушителем [Color=#ff0000]| Warn.[/color][/COLOR][/Spoiler][/CENTER][/B]<br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Помеха машинами (ВЧ) |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил для Воинской части:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.03.[/color] Запрещено закрывать метку сбора автомобилями, с целью сохранения материалов на складе[Color=#ff0000]| Jail 30 минут.[/color][/COLOR][/Spoiler][/CENTER][/B]<br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| nRP Адвокат |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил для Правительства:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.01.[/color] Запрещено оказывать услуги адвоката на территории ФСИН находясь вне комнаты свиданий[Color=#ff0000]| Warn.[/color][/COLOR][/Spoiler][/CENTER][/B]<br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Ввод в забл (ЦБ) |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил для Центральной больницы:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]5.02.[/color] Запрещено вводить в заблуждение игроков, путем злоупотребления фракционными командами[Color=#ff0000]| Ban 3-5 дней + ЧС организации.[/color][/COLOR]<br><br>"+
                "[B][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]Игрок обращается к сотруднику больницы с просьбой о лечении. Сотрудник применяет команду лечения, а затем выполняет команду для смены пола.[/COLOR][/FONT][/Spoiler][/CENTER][/B]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Исп оруж в форме (ЦБ) |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил для Центральной больницы:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]5.01.[/color] Запрещено использование оружия в рабочей форме [Color=#ff0000]| Jail 30 минут.[/color][/COLOR]<br><br>"+
                "[B][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]защита в целях самообороны, обязательно иметь видео доказательство в случае наказания администрации. [/COLOR][/FONT][/Spoiler][/CENTER][/B]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| nRP ФСИН |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил для Государственных организаций:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]9.01.[/color] Запрещено освобождать заключённых, нарушая игровую логику организации [Color=#ff0000]| Warn.[/color][/COLOR]<br><br>"+
                "[B][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]Выводить заключённых за территорию, используя фракционные команды, или открывать ворота территории ФСИН для выхода заключённых. [/COLOR][/FONT]<br>" +
                "[B][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]Побег заключённого возможен только на системном уровне через канализацию.[/COLOR][/FONT][/Spoiler][/CENTER][/B]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Поощрение/Выговор ФСИН |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил для Государственных организаций:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]9.02.[/color] Запрещено выдавать выговор или поощрять заключенных, а также сажать их в карцер без особой IC причины [Color=#ff0000]| Warn.[/color][/COLOR]<br><br>"+
                "[B][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]сотруднику ФСИН не понравилось имя заключенного и он решил его наказать выговором или посадить в карцер. [/COLOR][/FONT][/Spoiler][/CENTER][/B]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '- - - - - - - - - - - - - - - - - - Правила ОПГ - - - - - - - - - - - - - - - - - -'
},
{
	  title: '| NonRP В/Ч |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан за нарушение правил нападения на воинскую часть [Color=#ff0000]| Warn.[/color]<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR][/FONT]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| NonRP В/Ч (не ОПГ) |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан за нарушение правил нападения на воинскую часть [Color=#ff0000]| Jail 30 минут.[/color]<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR][/FONT]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Провокация Госсников |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил для криминальных организаций:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.[/color] Запрещено провоцировать сотрудников государственных организаций [Color=#ff0000]| Jail 30 минут.[/color][/COLOR][/Spoiler][/CENTER][/B]<br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Провокация ОПГшников |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил для криминальных организаций:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.[/color] Запрещено провоцировать сотрудников криминальных организаций возле или на территории вражеской группировки [Color=#ff0000]| Jail 30 минут.[/color][/COLOR][/Spoiler][/CENTER][/B]<br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Дуэли |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил для криминальных организаций:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]5.[/color] Запрещено устраивать дуэли где-либо, а также на территории ОПГ [Color=#ff0000]| Jail 30 минут.[/color][/COLOR]<br><br>"+
        "[B][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]территория проведения войны за бизнес, когда мероприятие не проходит[/COLOR][/FONT][/Spoiler][/CENTER][/B]<br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Перестрелки |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил для криминальных организаций:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]6.[/color] Запрещено устраивать перестрелки с другими ОПГ в людных местах [Color=#ff0000]| Jail 60 минут.[/color][/COLOR][/Spoiler][/CENTER][/B]<br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Рекламирование в чате |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил для криминальных организаций:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]7.[/color] Запрещена любая реклама (семей, транспортных и строительных компаний и т.д.), предложения о купле, продаже, обмене чего-либо в чате организации [Color=#ff0000]| Mute 30 минут.[/color][/COLOR][/Spoiler][/CENTER][/B]<br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Уход от погони |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил для криминальных организаций:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]8.[/color] Запрещено уходить от погони со стороны правоохранительных органов путем заезда на территорию своей банды для того чтобы скрыться или получить численное преимущество [Color=#ff0000]| Jail 30 минут.[/color][/COLOR][/Spoiler][/CENTER][/B]<br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '- - - - - - - - - - - - - - - - - - Отказ жалобы - - - - - - - - - - - - - - - - - -'
},
{
	  title: '| Ответ был ранее |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender] Дублирование темы, ответ на вашу жалобу был дан ранее.<br>"+
		"[B][CENTER][COLOR=lavender]Напоминаю, за дублирование тем ваш форумный аккаунт может быть заблокирован. <br><br>"+
		"[B][CENTER][COLOR=RED][ICODE] Отказано, закрыто. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Нарушений не найдено |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Нарушений со стороны данного игрока не было найдено. <br><br>"+
		"[B][CENTER][COLOR=RED][ICODE] Отказано, закрыто. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Недостаточно док-в |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба содержит недостаточное количество доказательств на нарушение от данного игрока. <br><br>"+
		"[B][CENTER][COLOR=RED][ICODE] Отказано, закрыто. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Отсутствуют док-ва |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] В вашей жалобе отсутствуют доказательства о нарушении игрока. <br><br>"+
		"[B][CENTER][COLOR=RED][ICODE] Отказано, закрыто. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Док-ва отредактированы |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Доказательства в вашей жалобе подверглись редактированию.<br><br>"+
		"[B][CENTER][COLOR=RED][ICODE] Отказано, закрыто. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Не по форме |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба составлена не по форме. Ознакомьтесь с правилами подачи жалоб на игроков. <br><br>"+
		"[B][CENTER][COLOR=RED][ICODE] Отказано, закрыто. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Заголовок не по форме |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Заголовок вашей жалобы составлен не по форме. Ознакомитесь с правилами подачи жалоб на игроков.<br><br>"+
		"[B][CENTER][COLOR=RED][ICODE] Отказано, закрыто. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Нет /time |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] На ваших доказательствах отсутствует /time, рассмотрению не подлежит. <br><br>"+
		"[B][CENTER][COLOR=RED][ICODE] Отказано, закрыто. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Нет time кодов|',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] В ваших доказательствах отсутствуют time коды. Если видео длится больше 3-ех минут - Вы должны указать time коды нарушений. <br><br>"+
		"[B][CENTER][COLOR=RED][ICODE] Отказано, закрыто. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Более 72-х часов |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] С момента совершенного нарушения со стороны игрока прошло более 72 часов. Срок написания жалобы составляет три дня (72 часа) с момента совершенного нарушения со стороны игрока сервера.<br><br>"+
		"[B][CENTER][COLOR=RED][ICODE] Отказано, закрыто. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Док-ва соц сеть |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваши доказательства загружены в соц. сетях. Загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur). <br><br>"+
		"[B][CENTER][COLOR=RED][ICODE] Отказано, закрыто. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Условия сделки |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] В Ваших доказательствах отсутствуют условия сделки. <br><br>"+
		"[B][CENTER][COLOR=RED][ICODE] Отказано, закрыто. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Нужен фрапс |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] В данной ситуации необходим фрапс(запись экрана). <br><br>"+
		"[B][CENTER][COLOR=RED][ICODE] Отказано, закрыто. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Фрапс обрывается |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваше видео-доказательство обрывается. Загрузите полную видеозапись на видео-хостинг YouTube. <br><br>"+
		"[B][CENTER][COLOR=RED][ICODE] Отказано, закрыто. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Док-ва не открываются |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Доказательства в вашей жалобе не открываются, рассмотрению не подлежит. <br><br>"+
		"[B][CENTER][COLOR=RED][ICODE] Отказано, закрыто. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Док-ва в плохом качестве |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваши доказательства в плохом качестве. Загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx и так далее. <br><br>"+
		"[B][CENTER][COLOR=RED][ICODE] Отказано, закрыто. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Жалоба от 3-го лицо |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба написана от 3-го лица. Жалоба от третьего лица не принимается (жалоба должна быть подана участником ситуации). <br><br>"+
		"[B][CENTER][COLOR=RED][ICODE] Отказано, закрыто. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Жалоба на 2+ игроков |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Нельзя писать одну жалобу на двух и более игроков (на каждого игрока отдельная жалоба).  <br><br>"+
		"[B][CENTER][COLOR=RED][ICODE] Отказано, закрыто. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Ошиблись сервером |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Вы ошиблись сервером, перенаправляю  вашу жалобу на нужный сервер. <br><br>"+
		"[B][CENTER][COLOR=YELLOW][ICODE] Ожидайте ответа.. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: PIN_PREFIX,
	  status: true,
},
];
 
$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
	// Добавление кнопок при загрузке страницы
	addButton('Одобрено✅', 'accepted');
        addButton('Отказано❌', 'unaccept');
	addButton('Меню🗂️', 'selectAnswer');
 
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