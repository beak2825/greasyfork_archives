// ==UserScript==
// @name         Скрипт для Кураторов Форума || GOLD
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Скрипт для Кураторов Форума
// @author       August Feretty
// @match        https://forum.blackrussia.online/threads/*
// @icon         https://sun6-22.userapi.com/s/v1/ig2/aORGB3HymEDAjWpHXVMFHI0tKDdntOLO_EkfmttSOy8B5ttH2AhaXFUTCfkoFlyhpAkE57rYo4mU7b8IEZj4PTkF.jpg?size=981x981&quality=95&crop=40,39,981,981&ava=1
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/478817/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%7C%7C%20GOLD.user.js
// @updateURL https://update.greasyfork.org/scripts/478817/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%7C%7C%20GOLD.meta.js
// ==/UserScript==

(function () {
	'use strict';
	const UNACCСEPT_PREFIX = 4; // префикс отказано
	const ACCСEPT_PREFIX = 8; // префикс одобрено
	const PINN_PREFIX = 2; //  префикс закрепить
	const SPECADM_PREFIX = 11; // специальному администратору
	const GA_PREFIX = 12; // главному администратору
    const CLOSE_PREFIX = 7;
    const TEXY_PREFIX = 13;
    const REALIZOVANO_PREFIX = 5;
    const VAJNO_PREFIX = 1;
    const OJIDANIE_PREFIX = 14;
const OTKAZBIO_PREFIX = 4;
const ODOBRENOBIO_PREFIX = 8;
const NARASSMOTRENIIBIO_PREFIX = 2;
const PREFIKS = 0;
const KACHESTVO = 15;
const RASSMOTRENO_PREFIX = 9;
const OTKAZRP_PREFIX = 4;
const ODOBRENORP_PREFIX = 8;
const NARASSMOTRENIIRP_PREFIX = 2;
const OTKAZORG_PREFIX = 4;
const ODOBRENOORG_PREFIX = 8;
const NARASSMOTRENIIORG_PREFIX = 2;
const buttons = [

     {
	  title: '|>>>>>>>>>>>>>>>>>>>>>>>>> Раздел: Правила RolePlay процесса <<<<<<<<<<<<<<<<<<<<<<<<<|'
},
{
	  title: '| NonRP Поведение |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=GREEN]одобрена[/COLOR], игрок будет наказан по следующему пункту правил: [/SIZE][/FONT]<br><br>"+
    "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.01.[/color] Запрещено поведение, нарушающее нормы процессов Role Play режима игры [Color=#ff0000]| Jail 30 минут[/color].[/COLOR]<br><br>" +
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]ездить на крышах транспортных средств, бегать или ходить по столам в казино, целенаправленная провокация сотрудников правоохранительных органов с целью развлечения, целенаправленная помеха в проведении различных собеседований и так далее.[/FONT][/COLOR][/SIZE][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=GREEN][ICODE]Одобрено, закрыто[/ICODE][/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Уход от RP |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=GREEN]одобрена[/COLOR], игрок будет наказан по следующему пункту правил: [/SIZE][/FONT]<br><br>"+
    "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.02.[/color] Запрещено целенаправленно уходить от Role Play процесса всеразличными способами [Color=#ff0000]| Jail 30 минут / Warn[/color].[/COLOR]<br><br>"+
                "[*][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]Примечание: [/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4][FONT=book antiqua]например, уходить в AFK при остановке транспортного средства правоохранительными органами, выходить из игры для избежания смерти, выходить из игры во время процесса задержания / ареста, полное игнорирование отыгровок другого игрока, которые так или иначе могут коснуться Вашего персонажа и так далее.[/FONT][/SIZE][/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=GREEN][ICODE]Одобрено, закрыто[/ICODE][/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| NonRP drive |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=GREEN]одобрена[/COLOR], игрок будет наказан по следующему пункту правил: [/SIZE][/FONT] <br><br>"+
    "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.03.[/color] Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере [Color=#ff0000]| Jail 30 минут[/color].[/COLOR]<br><br>"+
                "[*][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Примечание:[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] езда на скутере по горам, езда на любом транспортном средстве по встречным полосам, нарушая все правила дорожного движения без какой-либо причины, намеренное создание аварийных ситуаций на дорогах и так далее.[/SIZE][/FONT][/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                 "[B][CENTER][COLOR=GREEN][ICODE]Одобрено, закрыто[/ICODE][/COLOR]<br><br>"+
	"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
        prefix: ACCСEPT_PREFIX,
	  status: false,
 },
{
	  title: '| Помеха работе (инкассация/дально и др.) |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=GREEN]одобрена[/COLOR], игрок будет наказан по следующему пункту правил: [/SIZE][/FONT] <br><br>"+
    "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.04.[/color] Запрещены любые действия, способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. [Color=#ff0000]| Ban 10 дней / Обнуление аккаунта (при повторном нарушении) [/color].[/COLOR]<br><br>"+
                "[*][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Пример:[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] таран дальнобойщиков, инкассаторов под разными предлогами. [/SIZE][/FONT][/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                 "[B][CENTER][COLOR=GREEN][ICODE]Одобрено, закрыто[/ICODE][/COLOR]<br><br>"+
	"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| NonRP Обман |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=GREEN]одобрена[/COLOR], игрок будет наказан по следующему пункту правил: [/SIZE][/FONT]<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.05.[/color] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [Color=#ff0000]| PermBan[/color].[/COLOR]<br><br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]после IC договоренности получить денежные средства и сразу же выйти из игры с целью обмана игрока, или же, договорившись через OOC чат (/n), точно также получить денежные средства и сразу же выйти из игры и тому подобные ситуации.[/COLOR][/SIZE][/FONT]<br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]разблокировка игрового аккаунта нарушителя будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого имущества, которое было украдено (по решению обманутой стороны).[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                 "[B][CENTER][COLOR=GREEN][ICODE]Одобрено, закрыто[/ICODE][/COLOR]<br><br>"+
	"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
    	  title: '| Долг |',
	  content:
	   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=GREEN]одобрена[/COLOR], игрок будет наказан по следующему пункту правил: [/SIZE][/FONT] <br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.57.[/color] Запрещается брать в долг игровые ценности и не возвращать их. [Color=#ff0000]| Ban 30 дней / permban[/color].[/COLOR]<br><br>" +
        "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]займ может быть осуществлен только через зачисление игровых ценностей на банковский счет, максимальный срок займа 30 календарных дней, если займ не был возвращен, аккаунт должника блокируется;[/COLOR][/SIZE][/FONT]<br>" +
        "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]при невозврате игровых ценностей общей стоимостью менее 5 миллионов включительно аккаунт будет заблокирован на 30 дней, если более 5 миллионов, аккаунт будет заблокирован навсегда;[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]жалоба на игрока, который занял игровые ценности и не вернул в срок, подлежит рассмотрению только при наличии подтверждения суммы и условий займа в игровом процессе, меры в отношении должника могут быть приняты только при наличии жалобы и доказательств. Жалоба на должника подается в течение 10 дней после истечения срока займа. Договоры вне игры не будут считаться доказательствами.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
         "[B][CENTER][COLOR=GREEN][ICODE]Одобрено, закрыто[/ICODE][/COLOR]<br><br>"+
	"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Аморал |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=GREEN]одобрена[/COLOR], игрок будет наказан по следующему пункту правил: [/SIZE][/FONT]<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.08.[/color] Запрещена любая форма аморальных действий сексуального характера в сторону игроков [Color=#ff0000]| Jail 30 минут / Warn[/color].[/COLOR]<br><br>" +
                "[*][SIZE=4][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]обоюдное согласие обеих сторон.[/COLOR][/FONT][/SIZE][/Spoiler][/CENTER][/B]<br><br>"+
                 "[B][CENTER][COLOR=GREEN][ICODE]Одобрено, закрыто[/ICODE][/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Слив склада |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=GREEN]одобрена[/COLOR], игрок будет наказан по следующему пункту правил: [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.09.[/color] Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле [Color=#ff0000]| Ban 15 - 30 дней / PermBan[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=GREEN][ICODE]Одобрено, закрыто[/ICODE][/COLOR]<br><br>"+
	"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| DB |',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=GREEN]одобрена[/COLOR], игрок будет наказан по следующему пункту правил: [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.13.[/color] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [Color=#ff0000]| Jail 60 минут[/color].[/COLOR]<br><br>" +
                "[*][SIZE=4][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]разрешается на территории проведения мероприятия по захвату упавшего семейного контейнера.[/COLOR][/FONT][/SIZE][/Spoiler][/CENTER][/B]<br><br>"+
                 "[B][CENTER][COLOR=GREEN][ICODE]Одобрено, закрыто[/ICODE][/COLOR]<br><br>"+
	"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| RK |',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=GREEN]одобрена[/COLOR], игрок будет наказан по следующему пункту правил: [/SIZE][/FONT]<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.14.[/color] Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти [Color=#ff0000]| Jail 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                 "[B][CENTER][COLOR=GREEN][ICODE]Одобрено, закрыто[/ICODE][/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| TK |',
	  content:
	 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=GREEN]одобрена[/COLOR], игрок будет наказан по следующему пункту правил: [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.15.[/color] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины [Color=#ff0000]| Jail 60 минут / Warn (за два и более убийства)[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                 "[B][CENTER][COLOR=GREEN][ICODE]Одобрено, закрыто[/ICODE][/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| SK |',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=GREEN]одобрена[/COLOR], игрок будет наказан по следующему пункту правил: [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.16.[/color] Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них [Color=#ff0000]| Jail 60 минут / Warn (за два и более убийства)[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                 "[B][CENTER][COLOR=GREEN][ICODE]Одобрено, закрыто[/ICODE][/COLOR]<br><br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| PG |',
	  content:
	'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=GREEN]одобрена[/COLOR], игрок будет наказан по следующему пункту правил: [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.17.[/color] Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь [Color=#ff0000]| Jail 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=GREEN][ICODE]Одобрено, закрыто[/ICODE][/COLOR]<br><br>"+
	"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| PG |',
	  content:
	 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=GREEN]одобрена[/COLOR], игрок будет наказан по следующему пункту правил: [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.17.[/color] Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь [Color=#ff0000]| Jail 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=GREEN][ICODE]Одобрено, закрыто[/ICODE][/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| MG |',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=GREEN]одобрена[/COLOR], игрок будет наказан по следующему пункту правил: [/SIZE][/FONT]<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.18.[/color] Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>"+
"[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]использование смайлов в виде символов «))», «=D» запрещено в IC чате.[/COLOR][/SIZE][/FONT]<br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]телефонное общение также является IC чатом.[/COLOR][/SIZE][/FONT]<br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]за написанный однократно вопросительный «?» или восклицательный «!» знак в IC чате, наказание не выдается.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                 "[B][CENTER][COLOR=GREEN][ICODE]Одобрено, закрыто[/ICODE][/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| DM |',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=GREEN]одобрена[/COLOR], игрок будет наказан по следующему пункту правил: [/SIZE][/FONT]<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.19.[/color] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [Color=#ff0000]| Jail 60 минут[/color].[/COLOR]<br><br>"+
"[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил.[/COLOR][/SIZE][/FONT]<br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]нанесение урона с целью защиты особняка или его территории, а также нанесение урона после ДТП не является веской IC причиной, для войны семей предусмотрено отдельное системное мероприятие.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                 "[B][CENTER][COLOR=GREEN][ICODE]Одобрено, закрыто[/ICODE][/COLOR]<br><br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Mass DM |',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=GREEN]одобрена[/COLOR], игрок будет наказан по следующему пункту правил: [/SIZE][/FONT]<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.20. [/color] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более [Color=#ff0000]| Warn / Ban 3 - 7 дней[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
               "[B][CENTER][COLOR=GREEN][ICODE]Одобрено, закрыто[/ICODE][/COLOR]<br><br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
    title: '| Стороннее ПО - читы, сборки |',
	  content:
	   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=GREEN]одобрена[/COLOR], игрок будет наказан по следующему пункту правил: [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.22.[/color] Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ff0000]| Ban 15 - 30 дней / PermBan[/color].[/COLOR]<br><br>"+
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]запрещено внесение любых изменений в оригинальные файлы игры.[/COLOR][/SIZE][/FONT]<br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]разрешено изменение шрифта, его размера и длины чата (кол-во строк).[/COLOR][/SIZE][/FONT]<br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]блокировка за включенный счетчик FPS не выдается.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=GREEN][ICODE]Одобрено, закрыто[/ICODE][/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Злоуп наказаниями |',
	  content:
	'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=GREEN]одобрена[/COLOR], игрок будет наказан по следующему пункту правил: [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.39.[/color] Злоупотребление нарушениями правил сервера [Color=#ff0000]| Ban 7 - 30 дней[/color].[/COLOR]<br><br>"+
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]неоднократное (от шести и более) нарушение правил сервера, которые были совершены за прошедшие 7 дней.[/COLOR][/SIZE][/FONT]<br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]наказания выданные за нарушения правил текстовых чатов, помеху (kick) в учет не идут.[/COLOR][/SIZE][/FONT]<br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]было получено пять наказаний за DM, шестое будет злоупотреблением. Если было получено одно наказание за упоминание родных, два наказания за DB и два наказания за DM, следующее будет считаться злоупотреблением.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                 "[B][CENTER][COLOR=GREEN][ICODE]Одобрено, закрыто[/ICODE][/COLOR]<br><br>"+
	"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| ЕПП (фура/инк) |',
	  content:
	 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=GREEN]одобрена[/COLOR], игрок будет наказан по следующему пункту правил: [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.47.[/color] Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) [Color=#ff0000]| Jail 60 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                 "[B][CENTER][COLOR=GREEN][ICODE]Одобрено, закрыто[/ICODE][/COLOR]<br><br>"+
	"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
            prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Арест на аукционе |',
	  content:
	  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=GREEN]одобрена[/COLOR], игрок будет наказан по следующему пункту правил: [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.50.[/color] Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона [Color=#ff0000]| Ban 7 - 15 дней + увольнение из организации[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                 "[B][CENTER][COLOR=GREEN][ICODE]Одобрено, закрыто[/ICODE][/COLOR]<br><br>"+
	"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| NonRP аксессуар |',
	  content:
	'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=GREEN]одобрена[/COLOR], игрок будет наказан по следующему пункту правил: [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.52.[/color] Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера [Color=#ff0000]| При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут[/color].[/COLOR]<br><br>"+
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]слишком большие аксессуары на голове персонажа, имитация гитарой половых органов и тому подобное.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                 "[B][CENTER][COLOR=GREEN][ICODE]Одобрено, закрыто[/ICODE][/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| багоюз аним |',
	  content:
	  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=GREEN]одобрена[/COLOR], игрок будет наказан по следующему пункту правил: [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.55.[/color] Запрещается багоюз, связанный с анимацией, в любых проявлениях [Color=#ff0000]| Jail 60 / 120 минут[/color].[/COLOR]<br><br>"+
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]если игрок, используя баг, убирает ограничение на использование оружия в зеленой зоне, сбивает темп стрельбы, либо быстро перемещается во время войны за бизнес или во время перестрелки на мероприятии с семейными контейнерами, последует наказание в виде [Color=#ff0000]| Jail 120 минут[/color]. Данное наказание используется в случаях, когда, используя ошибку, было получено преимущество перед другими игроками.[/COLOR][/SIZE][/FONT]<br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]если игрок использует баги, связанные с анимацией, и при этом не влияет на игровой процесс других игроков, а также не получает преимущество перед другими игроками, последует наказание в виде [Color=#ff0000]| Jail 60 минут[/color].[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                 "[B][CENTER][COLOR=GREEN][ICODE]Одобрено, закрыто[/ICODE][/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Обход системы |',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=GREEN]одобрена[/COLOR], игрок будет наказан по следующему пункту правил: [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.21.[/color] Запрещено пытаться обходить игровую систему или использовать любые баги сервера [Color=#ff0000]| Ban 15 - 30 дней / PermBan[/color].[/COLOR]<br><br>"+
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]под игровой системой подразумеваются функции и возможности, которые реализованы в игре для взаимодействия между игроками, а также взаимодействия игроков с функциями, у которых есть свое конкретное предназначение.[/COLOR][/SIZE][/FONT]<br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]аптечка предназначена для пополнения уровня здоровья, доступна всем игрокам по фиксированной цене в любом магазине. Но она не предназначена для перепродажи по завышенной цене с целью передачи виртуальной валюты между игроками. Аксессуары предназначены для украшения внешнего вида персонажа, не предназначены для передачи виртуальной валюты между игроками. Банк и личные счета предназначены для передачи денежных средств между игроками. Транспортное средство предназначено для передвижения игроков, не предназначено для передачи денег тем или иным способом, включая обмен с завышенными доплатами.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=GREEN][ICODE]Одобрено, закрыто[/ICODE][/COLOR]<br><br>"+
	"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Тим Мертв. рука - только во время Хэллоуина |',
	  content:
	  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=GREEN]одобрена[/COLOR], игрок будет наказан по следующему пункту правил: [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.56.[/color] Запрещается объединение в команду между убийцей и выжившим на мини-игре «Мертвая рука» [Color=#ff0000]| Jail 30 минут[/color].[/COLOR]<br><br>"+
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]правило действует только на время Хэллоуинского ивента.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                 "[B][CENTER][COLOR=GREEN][ICODE]Одобрено, закрыто[/ICODE][/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
        prefix: ACCСEPT_PREFIX,
	  status: false,
      },
{
	  title: '|>>>>>>>>>>>>>>>>>>>>>>>>> Раздел: Передача на рассмотрение <<<<<<<<<<<<<<<<<<<<<<<<<|'
},
{
	  title: '| На рассмотрении |',
	  content:
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=#CCFF66]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба взята на [COLOR=#ffff00]рассмотрение[/COLOR], пожалуйста, ожидайте ответа и не создавайте копии данной темы. В противном случае Вы можете получить блокировку форумного аккаунта. [/SIZE][/FONT]<br><br>"+
                 "[B][CENTER][COLOR=YELLOW][ICODE]❖ На рассмотрении ❖[/ICODE][/COLOR]<br><br>",
        prefix: PINN_PREFIX,
	  status: true,
    },
{
	  title: '| На рассмотрении у ГКФ |',
	  content:
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=#CCFF66]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба передана на [COLOR=#ffff00]рассмотрение[/COLOR] [COLOR=RED]Главному куратору форума (@August_Feretty 🌊) [/COLOR], пожалуйста, ожидайте ответа и не создавайте копии данной темы. В противном случае Вы можете получить блокировку форумного аккаунта. [/SIZE][/FONT]<br><br>"+
                 "[B][CENTER][COLOR=YELLOW][ICODE]❖ На рассмотрении у ГКФ ❖[/ICODE][/COLOR]<br><br>",
        prefix: PINN_PREFIX,
	  status: true,
},
{
    	   title: '| Тех. спецу |',
	  content:
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=#CCFF66]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба передана на [COLOR=#ffff00]рассмотрение[/COLOR] [COLOR=RED]Техническому специалисту сервера[/COLOR], пожалуйста, ожидайте ответа и не создавайте копии данной темы. В противном случае Вы можете получить блокировку форумного аккаунта. [/SIZE][/FONT]<br><br>"+
                "[B][CENTER][COLOR=YELLOW][ICODE]❖ На рассмотрении у тех. специалиста ❖[/ICODE][/COLOR]<br><br>",
        prefix: TEXY_PREFIX,
	  status: true,
},
{
	  title: '|>>>>>>>>>>>>>>>>>>>>>>>>> Раздел: Перенаправление в другой раздел <<<<<<<<<<<<<<<<<<<<<<<<<|'
},
{
	  title: '| В жб на адм |',
	  content:
	  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[I][B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.mention }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[I][B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender]Обратитесь в раздел «Жалобы на администрацию».[/SIZE][/FONT] <br><br>"+
                "[B][CENTER][COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR]<br><br>"+
	"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
     prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: '| В жб на лд |',
	  content:
	'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[I][B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.mention }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[I][B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender]Обратитесь в раздел «Жалобы на лидеров».[/SIZE][/FONT] <br><br>"+
                 "[B][CENTER][COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR]<br><br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
     prefix: CLOSE_PREFIX,
	  status: false,
    },
{
	  title: '| В жб на сотрудников орг-ции |',
	  content:
	'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[I][B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.mention }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[I][B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender]Обратитесь в раздел жалоб на сотрудников той или иной организации.[/SIZE][/FONT] <br><br>"+
                 "[B][CENTER][COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR]<br><br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
     prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: '| В обжалования |',
	  content:
	'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[I][B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.mention }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[I][B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender]Обратитесь в раздел «Обжалование наказаний».[/SIZE][/FONT] <br><br>"+
                 "[B][CENTER][COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR]<br><br>"+
	"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
     prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: '| В тех раздел |',
	  content:
	  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[I][B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.mention }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[I][B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender]Обратитесь в технический раздел.[/SIZE][/FONT] <br><br>"+
                 "[B][CENTER][COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR]<br><br>"+
	"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
     prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: '| В жб на теха |',
	  content:
	'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[I][B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.mention }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[I][B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender]Обратитесь в раздел «Жалобы на технических специалистов».[/SIZE][/FONT] <br><br>"+
                 "[B][CENTER][COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR]<br><br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
     prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  	 title: '|>>>>>>>>>>>>>>>>>>>>>>>>> Раздел: Правила госс. структур <<<<<<<<<<<<<<<<<<<<<<<<<|'
},
{
	  title: '| Работа в форме |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=GREEN]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для государственных организаций: [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]1.07.[/color] Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, принадлежащей своей фракции [Color=#ff0000]| Jail 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                 "[B][CENTER][COLOR=GREEN][ICODE]Одобрено, закрыто[/ICODE][/COLOR]<br><br>"+
	"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Казино в форме |',
	  content:
	  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=GREEN]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для государственных организаций: [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]1.13.[/color] Запрещено находиться в форме внутри казино, а также устраиваться на сторонние работы в форме фракции [Color=#ff0000]| Jail 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                 "[B][CENTER][COLOR=GREEN][ICODE]Одобрено, закрыто[/ICODE][/COLOR]<br><br>"+
	"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Т/С в личных целях |',
	  content:
	  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=GREEN]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для государственных организаций: [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]1.08.[/color] Запрещено использование фракционного транспорта в личных целях [Color=#ff0000]| Jail 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                 "[B][CENTER][COLOR=GREEN][ICODE]Одобрено, закрыто[/ICODE][/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Розыск/штраф без причины |',
	  content:
	  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=GREEN]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для силовых структур: [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]7.02.[/color] Запрещено выдавать розыск, штраф без Role Play причины [Color=#ff0000]| Warn[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                 "[B][CENTER][COLOR=GREEN][ICODE]Одобрено, закрыто[/ICODE][/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Права в погоне (ГИБДД) |',
	  content:
	 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=GREEN]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для ГИБДД: [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]7.04.[/color] Запрещено отбирать водительские права во время погони за нарушителем [Color=#ff0000]| Warn[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=GREEN][ICODE]Одобрено, закрыто[/ICODE][/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Одиночный патруль |',
	  content:
	   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=GREEN]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для силовых структур: [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]1.11.[/color] Всем силовым структурам запрещен одиночный патруль или конвоирование, минимум 2 сотрудника [Color=#ff0000]| Jail 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                 "[B][CENTER][COLOR=GREEN][ICODE]Одобрено, закрыто[/ICODE][/COLOR]<br><br>"+
	"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| NRP Cop |',
	  content:
	 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=GREEN]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для силовых структур: [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]6.03.[/color] Запрещено оказывать задержание без Role Play отыгровки [Color=#ff0000]| Warn[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                 "[B][CENTER][COLOR=GREEN][ICODE]Одобрено, закрыто[/ICODE][/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '|>>>>>>>>>>>>>>>>>>>>>>>>> Раздел: Правила ОПГ <<<<<<<<<<<<<<<<<<<<<<<<<|'
},
{
	  title: '| NonRP В/Ч |',
	  content:
	   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=GREEN]одобрена[/COLOR], игрок будет наказан за нарушение правил нападения на воинскую часть [Color=#ff0000]| Warn[/color]. [/SIZE][/FONT] <br><br>"+
                 "[B][CENTER][COLOR=GREEN][ICODE]Одобрено, закрыто[/ICODE][/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| NonRP В/Ч (не ОПГ) |',
	  content:
	 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=GREEN]одобрена[/COLOR], игрок будет наказан за нарушение правил нападения на воинскую часть [Color=#ff0000]| Jail 30 минут[/color]. [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][COLOR=GREEN][ICODE]Одобрено, закрыто[/ICODE][/COLOR]<br><br>"+
	"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
       prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '|>>>>>>>>>>>>>>>>>>>>>>>>>> Раздел: Отказ жалобы <<<<<<<<<<<<<<<<<<<<<<<<<|'
},
{
	  title: '| Нарушений не найдено |',
	  content:
	   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как нарушений со стороны данного игрока не было найдено. Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленными в данном разделе. [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][COLOR=RED][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>"+
	"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Недостаточно док-в |',
	  content:
	'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательств на нарушение от данного игрока недостаточно. Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленными в данном разделе. [/SIZE][/FONT]<br><br>"+
"[B][CENTER][COLOR=RED][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>"+
	"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Отсутствуют док-ва |',
	  content:
	'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательства на нарушение от данного игрока  отсутствуют. Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленными в данном разделе. [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][COLOR=RED][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Док-ва отредактированы |',
	  content:
	 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательства на нарушение от данного игрока  отредактированы. Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленными в данном разделе. [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][COLOR=RED][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>"+
	"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Не по форме |',
	  content:
	 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как она составлена не по форме. Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленными в данном разделе. [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][COLOR=RED][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Заголовок не по форме |',
	  content:
	  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как ее заголовок составлен не по форме. Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленными в данном разделе. [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][COLOR=RED][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Нет /time |',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как на ваших доказательствах отсутствует /time. Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленными в данном разделе. [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][COLOR=RED][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>"+
	"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Нет time кодов|',
	  content:
	  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как отсутствуют time коды. Если видео длится больше 3-ех минут - Вы должны указать time коды нарушений. Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленными в данном разделе. [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][COLOR=RED][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Более 72-х часов |',
	  content:
	   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как с момента совершенного нарушения со стороны игрока прошло более 72 часов. Срок написания жалобы составляет три дня (72 часа) с момента совершенного нарушения со стороны игрока сервера. Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленными в данном разделе. [/SIZE][/FONT] <br><br>"+
               "[B][CENTER][COLOR=RED][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>"+
	"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Док-ва соц сеть |',
	  content:
	   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательства загружены в соц. сетях. Загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur). Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленными в данном разделе. [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][COLOR=RED][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Условия сделки |',
	  content:
	 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как в Ваших доказательствах отсутствуют условия сделки. Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленными в данном разделе. [/SIZE][/FONT] <br><br>"+
               "[B][CENTER][COLOR=RED][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Нужен фрапс |',
	  content:
	  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательств недостаточно. В данной ситуации необходим фрапс (запись экрана). Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленными в данном разделе. [/SIZE][/FONT] <br><br>"+
              "[B][CENTER][COLOR=RED][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
    	  title: '| Промотка чата |',
	  content:
	   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как нужен фрапс + промотка чата. Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленными в данном разделе. [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][COLOR=RED][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Фрапс обрывается |',
	  content:
	  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как видео-доказательство обрывается. Загрузите полную видеозапись на видео-хостинг YouTube. Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленными в данном разделе. [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][COLOR=RED][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>"+
	"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Док-ва не открываются |',
	  content:
	  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как ваши доказательства не открываются. Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленными в данном разделе. [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][COLOR=RED][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>"+
	"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Жалоба от 3-его лица |',
	  content:
	  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как она написана от 3-его лица. Жалоба от третьего лица не принимается (она должна быть подана участником ситуации). Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленными в данном разделе. [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][COLOR=RED][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Ошиблись сервером |',
	  content:
	  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как Вы ошиблись сервером, подайте жалобу на нужный Вам сервер. [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][COLOR=RED][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Дублирование темы |',
	  content:
	  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Вам уже был дан ответ в прошлой теме. Просьба не создавать темы-дубликаты, иначе Ваш форумный аккаунт будет заблокирован. [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][COLOR=RED][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
{
	  title: '| РП отыгровки для сотрудников не нужны |',
	  content:
	  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Нарушений со стороны игрока нет, так как RP отыгровки не обязательны для совершения обыска, надевания наручников и тд. За игрока это делает система со своими системными отыгровками. [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][COLOR=RED][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
{
	  title: '| Неадекватная жалоба |',
	  content:
	  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] В данном виде ваша жалоба не будет рассмотрена администрацией сервера. Составьте жалобу адекватно, создав новую тему. При повторных попытках дублирования данной темы Вы получите блокировку форумного аккаунта. [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][COLOR=RED][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
{
	  title: '| Док-ва в плохом качестве |',
	  content:
	  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как ваши доказательства представлены в плохом качестве. Доказательства на нарушение от игрока должны быть загружены в отличном формате, так, что бы все было видно без проблем. [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][COLOR=RED][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
    	  title: '|>>>>>>>>>>>>>>>>>>>>>>>>> Раздел: RolePlay Биографии <<<<<<<<<<<<<<<<<<<<<<<<<|'
},
{
        	  title: '| Био одобрена |',
	  content:
	  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша RolePlay-биография получает статус - [COLOR=GREEN]Одобрено[/COLOR][/SIZE][/FONT]<br><br>"+
                "[B][CENTER][COLOR=GREEN][ICODE]❖ Одобрено ❖[/ICODE][/COLOR]<br><br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
    prefix: ACCСEPT_PREFIX,
	  status: false,

},
  {
          	  title: '| Био отказ (Мало инфы) |',
	  content:
	   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша RolePlay-биография получает статус - [COLOR=#FF0000]Отказано[/COLOR], так как в ней содержится недостаточное количество информации о Вашем персонаже. Убедительная просьба ознакомиться с правилами подачи RolePlay-биографий, закрепленными в данном разделе. [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][COLOR=RED][ICODE]❖ Отказано ❖[/ICODE][/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Скопирована) |',
	  content:
	 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша RolePlay-биография получает статус - [COLOR=#FF0000]Отказано[/COLOR], так как она скопирована. Убедительная просьба ознакомиться с правилами подачи RolePlay-биографий, закрепленными в данном разделе. [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][COLOR=RED][ICODE]❖ Отказано ❖[/ICODE][/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
      },
  {
                	  title: '| Био отказ (возраст ниже 18 лет) |',
	  content:
	 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша RolePlay-биография получает статус - [COLOR=#FF0000]Отказано[/COLOR], так как вашему персонажу меньше 18 лет. [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][COLOR=RED][ICODE]❖ Отказано ❖[/ICODE][/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
      },
  {
                	  title: '| Био отказ (имя/фамилия не на русском) |',
	  content:
	 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша RolePlay-биография получает статус - [COLOR=#FF0000]Отказано[/COLOR], так как Имя/фамилия написаны не на русском языке. Убедительная просьба ознакомиться с правилами подачи RolePlay-биографий, закрепленными в данном разделе. [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][COLOR=RED][ICODE]❖ Отказано ❖[/ICODE][/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Заголовок) |',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша RolePlay-биография получает статус - [COLOR=#FF0000]Отказано[/COLOR], так как заголовок биографии написан не по форме. Убедительная просьба ознакомиться с правилами подачи RolePlay-биографий, закрепленными в данном разделе. [/SIZE][/FONT] <br><br>"+
      "[B][CENTER][COLOR=RED][ICODE]❖ Отказано ❖[/ICODE][/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (3-е лицо) |',
	  content:
	   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша RolePlay-биография получает статус - [COLOR=#FF0000]Отказано[/COLOR], так как она написана от 3-его лица. Убедительная просьба ознакомиться с правилами подачи RolePlay-биографий, закрепленными в данном разделе. [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][COLOR=RED][ICODE]❖ Отказано ❖[/ICODE][/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
      },
  {
                	  title: '| Био отказ (не по форме) |',
	  content:
	   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша RolePlay-биография получает статус - [COLOR=#FF0000]Отказано[/COLOR], так как она составлена не по форме. Убедительная просьба ознакомиться с правилами подачи RolePlay-биографий, закрепленными в данном разделе. [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][COLOR=RED][ICODE]❖ Отказано ❖[/ICODE][/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Возраст не совпал) |',
	  content:
	 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша RolePlay-биография получает статус - [COLOR=#FF0000]Отказано[/COLOR], так как Ваш возраст не совпадает с датой рождения. Убедительная просьба ознакомиться с правилами подачи RolePlay-биографий, закрепленными в данном разделе. [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][COLOR=RED][ICODE]❖ Отказано ❖[/ICODE][/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,

},
  {
                	  title: '| Био отказ (Ошибки) |',
	  content:
	  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша RolePlay-биография получает статус - [COLOR=#FF0000]Отказано[/COLOR], так как в ней допущено большое количество грамматических/пунктуационных ошибок. Убедительная просьба ознакомиться с правилами подачи RolePlay-биографий, закрепленными в данном разделе. [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][COLOR=RED][ICODE]❖ Отказано ❖[/ICODE][/COLOR]<br><br>"+
	"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
         },
  {
                	  title: '| Био отказ (nRP nick) |',
	  content:
	  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша RolePlay-биография получает статус - [COLOR=RED]Отказано[/COLOR], так как у Вас nRP Nick_Name. Убедительная просьба ознакомиться с правилами подачи RolePlay-биографий, закрепленными в данном разделе. [/SIZE][/FONT]  <br><br>"+
       "[B][CENTER][COLOR=RED][ICODE]❖ Отказано ❖[/ICODE][/COLOR]<br><br>"+
	"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
      },
  {
                	  title: '| Био отказ (присвоение супер-способностей) |',
	  content:
	  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша RolePlay-биография получает статус - [COLOR=RED]Отказано[/COLOR], так как Вы присвоили своему персонажу супер-способности (то, чего не может быть в данной ситуации). Убедительная просьба ознакомиться с правилами подачи RolePlay-биографий, закрепленными в данном разделе. [/SIZE][/FONT]   <br><br>"+
       "[B][CENTER][COLOR=RED][ICODE]❖ Отказано ❖[/ICODE][/COLOR]<br><br>"+
	"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
          },
  {
                	  title: '| Био отказ (только 1 био на 1 игровой акк) |',
	  content:
	  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша RolePlay-биография получает статус - [COLOR=RED]Отказано[/COLOR], так как у Вас уже есть биография, привязанная к данному игровому аккаунту (к игровому нику). Убедительная просьба ознакомиться с правилами подачи RolePlay-биографий, закрепленными в данном разделе. [/SIZE][/FONT]   <br><br>"+
       "[B][CENTER][COLOR=RED][ICODE]❖ Отказано ❖[/ICODE][/COLOR]<br><br>"+
	"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
          },
  {
                	  title: '| Био отказ (пропаганда политических и религиозных взглядов) |',
	  content:
	  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша RolePlay-биография получает статус - [COLOR=RED]Отказано[/COLOR], так как в ней присутствует пропаганда политических/религиозных взглядов. Убедительная просьба ознакомиться с правилами подачи RolePlay-биографий, закрепленными в данном разделе. [/SIZE][/FONT]  <br><br>"+
       "[B][CENTER][COLOR=RED][ICODE]❖ Отказано ❖[/ICODE][/COLOR]<br><br>"+
	"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
       },
  {
                	  title: '| Био отказ (дата рождения отсутствует/написана неполностью) |',
	  content:
	  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша RolePlay-биография получает статус - [COLOR=RED]Отказано[/COLOR], так как Ваша дата рождения отсутствует/написана неполностью. Убедительная просьба ознакомиться с правилами подачи RolePlay-биографий, закрепленными в данном разделе. [/SIZE][/FONT]  <br><br>"+
       "[B][CENTER][COLOR=RED][ICODE]❖ Отказано ❖[/ICODE][/COLOR]<br><br>"+
	"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
       },
  {
                	  title: '| Био отказ (OOC информация в био) |',
	  content:
	  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша RolePlay-биография получает статус - [COLOR=RED]Отказано[/COLOR], так как в ней присутствует OOC информация. Убедительная просьба ознакомиться с правилами подачи RolePlay-биографий, закрепленными в данном разделе. [/SIZE][/FONT]  <br><br>"+
       "[B][CENTER][COLOR=RED][ICODE]❖ Отказано ❖[/ICODE][/COLOR]<br><br>"+
	"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
      },
  {
                	  title: '| Био на доработке (мало информации) |',
	  content:
	  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша RolePlay-биография получает статус [COLOR=YELLOW]«На доработке»[/COLOR]. Добавьте в нее больше информации. Вам дается 24 часа на добавление/исправление данных в биографии (после добавления/исправления данных обязательно отписать в данной теме). Если биография не будет доработана, то она автоматически получит статус «отказано» [/SIZE][/FONT]  <br><br>"+
       "[B][CENTER][COLOR=YELLOW][ICODE]❖ На доработке ❖[/ICODE][/COLOR]<br><br>"+
	"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
     prefix: NARASSMOTRENIIBIO_PREFIX,
	  status: false,
        },
  {
                	  title: '| RP биография (на рассмотрении) |',
	  content:
	   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender]Ваша RP-биография находится на [COLOR=YELLOW]рассмотрении[/COLOR], ожидайте ответа.[/SIZE][/FONT]<br><br>"+
                "[B][CENTER][COLOR=YELLOW][ICODE]❖ На рассмотрении ❖[/ICODE][/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
     prefix: NARASSMOTRENIIRP_PREFIX,
	  status: false,
           },
  {
    	  title: '|>>>>>>>>>>>>>>>>>>>>>>>>> Раздел: RolePlay ситуации <<<<<<<<<<<<<<<<<<<<<<<<<|'
      },
{
        	  title: '| RP ситуация одобрена |',
	  content:
	  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша RolePlay-ситуация получает статус - [COLOR=GREEN]Одобрено[/COLOR][/SIZE][/FONT]<br><br>"+
                "[B][CENTER][COLOR=GREEN][ICODE]❖ Одобрено ❖[/ICODE][/COLOR]<br><br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
    prefix: ACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| RP ситуация (на рассмотрении) |',
	  content:
	   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender]Ваша RP-ситуация находится на [COLOR=YELLOW]рассмотрении[/COLOR], ожидайте ответа.[/SIZE][/FONT]<br><br>"+
                "[B][CENTER][COLOR=YELLOW][ICODE]❖ На рассмотрении ❖[/ICODE][/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
     prefix: NARASSMOTRENIIRP_PREFIX,
	  status: false,
       },
  {
                	  title: '| RP ситуация отказ |',
	  content:
	   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша RolePlay-ситуация получает статус - [COLOR=#FF0000]Отказано[/COLOR]. Убедительная просьба ознакомиться с правилами подачи RolePlay-ситуаций, закрепленными в данном разделе. [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][COLOR=RED][ICODE]❖ Отказано ❖[/ICODE][/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
      },
  {
                	  title: '| RP ситуация отказ (ошиблись разделом) |',
	  content:
	   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender]Обратитесь в нужный Вам раздел.[/SIZE][/FONT]<br><br>"+
                "[B][CENTER][COLOR=RED][ICODE]❖ Отказано ❖[/ICODE][/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
        },
  {
    	  title: '|>>>>>>>>>>>>>>>>>>>>>>>>> Раздел: Неофициальные RP организации <<<<<<<<<<<<<<<<<<<<<<<<<|'
      },
{
        	  title: '| RP организация одобрена |',
	  content:
	  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша Неофициальная RolePlay-организация получает статус - [COLOR=GREEN]Одобрено[/COLOR][/SIZE][/FONT]<br><br>"+
                "[B][CENTER][COLOR=GREEN][ICODE]❖ Одобрено ❖[/ICODE][/COLOR]<br><br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
    prefix: ACCСEPT_PREFIX,
	  status: false,
    },
{
        	  title: '| RP организация отказана |',
	  content:
	  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша Неофициальная RolePlay-организация получает статус - [COLOR=RED]Отказано[/COLOR][/SIZE][/FONT]<br><br>"+
                "[B][CENTER][COLOR=RED][ICODE]❖ Отказано ❖[/ICODE][/COLOR]<br><br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
    prefix: UNACCСEPT_PREFIX,
	  status: false,
     },
{
        	  title: '| RP организация на рассмотрении |',
	  content:
	  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#CCFF66][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша Неофициальная RolePlay-организация находится на [COLOR=YELLOW]рассмотрении[/COLOR], ожидайте ответа.[/SIZE][/FONT]<br><br>"+
                "[B][CENTER][COLOR=YELLOW][ICODE]❖ На рассмотрении ❖[/ICODE][/COLOR]<br><br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/xdvhzWPj/image.png[/img][/url]<br>",
    prefix: NARASSMOTRENIIRP_PREFIX,
	  status: false,

           },


];

	$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
	addButton('★ На рассмотрении ★', 'pin');
	addButton('★ Отказано ★', 'unaccept');
	addButton('★ Одобрено ★', 'accepted');
	addButton('★ Теху ★', 'Texy');
    addButton('★ Закрыто ★', 'Zakrito');
    addButton('★ Ожидание ★', 'Ojidanie');
 	addButton('★ Ответы ★', 'selectAnswer');

	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#unaccept').click(() => editThreadData(UNACCСEPT_PREFIX, false));
	$('button#pin').click(() => editThreadData(PINN_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCСEPT_PREFIX, false));
    $('button#Texy').click(() => editThreadData(TEXY_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));
    $('button#Realizovano').click(() => editThreadData(REALIZOVANO_PREFIX, false));
    $('button#Vajno').click(() => editThreadData(VAJNO_PREFIX, false));
    $('button#Rassmotreno').click(() => editThreadData(RASSMOTRENO_PREFIX, false));
    $('button#Ojidanie').click(() => editThreadData(OJIDANIE_PREFIX, false));
    $('button#Prefiks').click(() => editThreadData(PREFIKS, false));



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

	if (pin == false) {
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
	if (pin == true) {
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
	})();// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://vk.com/im?peers=c59
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vk.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();