// ==UserScript==
// @name        Полный скрипт для Кураторов Форума || WHITE
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Скрипт для Кураторов Форума WHITE
// @author       Masha_Viktorova
// @match        https://forum.blackrussia.online/threads/*
// @icon         https://i.postimg.cc/yxnTbvdQ/zastavki-gas-kvas-com-2ynk-p-zastavki-blek-rasha-9.jpg
// @grant        none
// @license    MIT
// @downloadURL
// @downloadURL https://update.greasyfork.org/scripts/545062/%D0%9F%D0%BE%D0%BB%D0%BD%D1%8B%D0%B9%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%7C%7C%20WHITE.user.js
// @updateURL https://update.greasyfork.org/scripts/545062/%D0%9F%D0%BE%D0%BB%D0%BD%D1%8B%D0%B9%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%7C%7C%20WHITE.meta.js
// ==/UserScript==

(function () {
	'use strict';
	const UNACCСEPT_PREFIX = 4; // префикс отказано
	const ACCСEPT_PREFIX = 8; // префикс одобрено
	const PINN_PREFIX = 2; //  префикс закрепить
	const SPECADM_PREFIX = 11; // специальному администратору
	const GA_PREFIX = 12; // главному адамнистратору
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
                        	  title: '| Приветствие |',
	  content:
	       "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
        "[B][CENTER][COLOR=white][FONT=courier new] Текст <br><br>"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
},
{
	 title: '| На рассмотрении |',
	  content:
	    	"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>'+
                "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=pink]на рассмотрении[/COLOR],<br><br>"+
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Ожидайте ответа в данной теме. Не создавайте повторные темы в противном случае Вы можете получить блокировку форумного аккаунта.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
		 prefix: NARASSMOTRENIIRP_PREFIX,
	  status: false,
},
{
    title: '|Жалоба от лидера  |',
	  content:
	    	"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>'+
                "[B][CENTER][COLOR=white][FONT=courier new] Мы принимаем жалобы только от лидеров семьи,прошу вас в течении 24-х часов предоставить доказательства,что вы являетесь лидером семьи [COLOR=pink]иначе жалоба будет отказана[/COLOR],<br><br>"+
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
		 prefix: NARASSMOTRENIIRP_PREFIX,
	  status: false,
},
{
	  title: '| Передать Руководству сервера|',
	  content:
	    	"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>'+
                "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=yellow]передана на рассмотрение Руководству сервера WHITE[/COLOR],<br><br>"+
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Ожидайте ответа в данной теме. Не создавайте повторные темы в противном случае Вы можете получить блокировку форумного аккаунта.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
		 prefix: NARASSMOTRENIIRP_PREFIX,
	  status: false,
},
{
    title: '|╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ღ Правила RolePlay процесса ღ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴|',
},
{
	  title: '| NonRP Поведение |',
	  content:
	    	"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>'+
                "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]2.01.[/color] Запрещено поведение, нарушающее нормы процессов Role Play режима игры [Color=#ff0000]| Jail 30 минут[/color].[/COLOR]<br><br>" +
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]ездить на крышах транспортных средств, бегать или ходить по столам в казино, целенаправленная провокация сотрудников правоохранительных органов с целью развлечения, целенаправленная помеха в проведении различных собеседований и так далее.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
     title: '| NonRP Drive |',
	  content:
	    	"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>'+
                "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]2.03.[/color] Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере [Color=#ff0000]| Jail 30 минут[/color].[/COLOR]<br><br>" +
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]нарушением считаются такие действия, как езда на скутере по горам, намеренное создание аварийных ситуаций при передвижении. Передвижение по полям на любом транспорте, за исключением кроссовых мотоциклов и внедорожников..[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Помеха РП |',
	  content:
	    	"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>'+
                "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]2.04.[/color] Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. [Color=#ff0000]| Ban 10 дней / Обнуление аккаунта (при повторном нарушении)[/color].[/COLOR]<br><br>" +
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]таран дальнобойщиков, инкассаторов под разными предлогами.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| NonRP обман |',
	  content:
	    	"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>'+
                "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]2.05.[/color] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [Color=#ff0000]| PermBan[/color].[/COLOR]<br><br>" +
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]после IC договоренности получить денежные средства и сразу же выйти из игры с целью обмана игрока, или же, договорившись через OOC чат (/n), точно также получить денежные средства и сразу же выйти из игры и тому подобные ситуации.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]разблокировка игрового аккаунта нарушителя будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого имущества, которое было украдено (по решению обманутой стороны).[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Аморал |',
	  content:
	    	"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>'+
                "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]2.08.[/color] Запрещена любая форма аморальных действий сексуального характера в сторону игроков [Color=#ff0000]| Jail 30 минут / Warn[/color].[/COLOR]<br><br>" +
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]ИСключение: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]обоюдное согласие обеих сторон.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Слив склада фракции/семьи |',
	  content:
	    	"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>'+
                "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]2.09.[/color]  Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле [Color=#ff0000]| Ban 15 - 30 дней / PermBan[/color].[/COLOR]<br><br>" +
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
     title: '| Помеха работе блогеров |',
	  content:
	    	"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>'+
                "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]2.12.[/color] Запрещена помеха в работе блогеров, стримеров (медиа лиц), которые находятся на официальном сотрудничестве с проектом [Color=#ff0000]| Ban 7 дней[/color].[/COLOR]<br><br>" +
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| DB |',
	  content:
	    	"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>'+
                "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]2.13.[/color] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [Color=#ff0000]| Jail 60 минут[/color].[/COLOR]<br><br>" +
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| TK |',
	  content:
	    	"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>'+
                "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]2.15.[/color] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины [Color=#ff0000]| Jail 60 минут / Warn (за два и более убийства)[/color].[/COLOR]<br><br>" +
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| SK |',
	  content:
	    	"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>'+
                "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]2.16.[/color] Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них [Color=#ff0000]| Jail 60 минут / Warn (за два и более убийства)[/color].[/COLOR]<br><br>" +
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| MG |',
	  content:
	    	"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>'+
                "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]2.18.[/color] Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>" +
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]использование смайлов в виде символов «))», «=D» запрещено в IC чате.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]телефонное общение также является IC чатом.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Исключение: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]за написанный однократно вопросительный «?» или восклицательный «!» знак в IC чате, наказание не выдается.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| DM |',
	  content:
	    	"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>'+
                "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]2.19.[/color] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [Color=#ff0000]| Jail 60 минут[/color].[/COLOR]<br><br>" +
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]нанесение урона с целью защиты особняка или его территории, а также нанесение урона после ДТП не является веской IC причиной, для войны семей предусмотрено отдельное системное мероприятие.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Mass DM |',
	  content:
	    	"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>'+
                "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]2.20.[/color] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более [Color=#ff0000]| Warn / Ban 3 - 7 дней[/color].[/COLOR]<br><br>" +
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Обход системы/Багоюз |',
	  content:
	    	"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>'+
                "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]2.21.[/color] Запрещено пытаться обходить игровую систему или использовать любые баги сервера [Color=#ff0000]| Ban 15 - 30 дней /PermBan (по согласованию с ГА, ЗГА, руководством тех. специалистов)[/color].[/COLOR]<br><br>" +
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]под игровой системой подразумеваются функции и возможности, которые реализованы в игре для взаимодействия между игроками, а также взаимодействия игроков с функциями, у которых есть свое конкретное предназначение.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Стороннее ПО |',
	  content:
	    	"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>'+
                "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]2.22.[/color] Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ff0000]|  Ban 15 - 30 дней / PermBan[/color].[/COLOR]<br><br>" +
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]запрещено внесение любых изменений в оригинальные файлы игры.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Исключение: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]разрешено изменение шрифта, его размера и длины чата (кол-во строк), блокировка за включенный счетчик FPS не выдается.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Сокрытие ошибок системы |',
	  content:
	    	"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>'+
                "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]2.23.[/color] Запрещено скрывать от администрации ошибки игровых систем, а также распространять их игрокам  [Color=#ff0000]|  Ban 15 - 30 дней / PermBan[/color].[/COLOR]<br><br>" +
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]запрещено внесение любых изменений в оригинальные файлы игры.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Исключение: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]разрешено изменение шрифта, его размера и длины чата (кол-во строк), блокировка за включенный счетчик FPS не выдается.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Сокрытие нарушителей |',
	  content:
	    	"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>'+
                "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]2.24.[/color] Запрещено скрывать от администрации нарушителей или злоумышленников[Color=#ff0000]| Ban 15 - 30 дней / PermBan + ЧС Проекта[/color].[/COLOR]<br><br>" +
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]запрещено внесение любых изменений в оригинальные файлы игры.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Исключение: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]разрешено изменение шрифта, его размера и длины чата (кол-во строк), блокировка за включенный счетчик FPS не выдается.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
     title: '| Реклама |',
	  content:
	    	"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>'+
                "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]2.31.[/color] Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное [Color=#ff0000]| Ban 7 дней / PermBan[/color].[/COLOR]<br><br>" +
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
     title: '| Конфликт религия |',
	  content:
	    	"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>'+
                "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]2.35.[/color] На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате [Color=#ff0000]| Mute 120 минут / Ban 7 дней[/color].[/COLOR]<br><br>" +
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| OOC угрозы/о наказании от АДМ |',
	  content:
	    	"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>'+
                "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]2.37.[/color] Запрещены OOC-угрозы, в том числе и завуалированные, а также угрозы наказанием со стороны администрации [Color=#ff0000]|  Mute 120 минут / Ban 7 - 15 дней[/color].[/COLOR]<br><br>" +
                 "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new] блокировка аккаунта выдаётся в случае, если есть прямые угрозы жизни, здоровью игрока или его близким. По решению главного администратора может быть выдана перманентная блокировка. [Color=#ff0000]| PermBan[/color][/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Оск проекта |',
	  content:
	    	"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>'+
                "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]2.40.[/color] Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [Color=#ff0000]| Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором)[/color].[/COLOR]<br><br>" +
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| ЕПП Инко |',
	  content:
	    	"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>'+
                "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]2.47.[/color] Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) [Color=#ff0000]| Jail 60 минут[/color].[/COLOR]<br><br>" +
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Арест в интерьере |',
	  content:
	    	"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>'+
                "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]2.50.[/color] Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий [Color=#ff0000]| Ban 7 - 15 дней + увольнение из организации[/color].[/COLOR]<br><br>" +
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| NonRp акс |',
	  content:
	    	"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>'+
                "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]2.51.[/color] Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. [Color=#ff0000]| При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут[/color].[/COLOR]<br><br>" +
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Пример: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]слишком большие аксессуары на голове персонажа, имитация гитарой половых органов и тому подобное.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Оск.адм.|',
	  content:
	    	"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>'+
                "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]2.54.[/color] Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [Color=#ff0000]| Mute 180 минут[/color].[/COLOR]<br><br>" +
                 "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Багоюз аним. |',
	  content:
	    	"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>'+
                "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]2.55.[/color] Запрещается багоюз связанный с анимацией в любых проявлениях. [Color=#ff0000]| Jail 120 минут[/color].[/COLOR]<br><br>" +
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]если игрок, используя баг, убирает ограничение на использование оружия в зеленой зоне, сбивает темп стрельбы, либо быстро перемещается во время войны за бизнес или во время перестрелки на мероприятии с семейными контейнерами, последует наказание в виде [Color=#ff0000]Jail на 120 минут[/color]. Данное наказание используется в случаях, когда, используя ошибку, было получено преимущество перед другими игроками.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]если игрок использует баги, связанные с анимацией, и при этом не влияет на игровой процесс других игроков, а также не получает преимущество перед другими игроками, последует наказание в виде [Color=#ff0000]Jail на 60 минут[/color].[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
     title: '| Невозврат долга |',
	  content:
	    	"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>'+
                "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]2.57.[/color] Запрещается брать в долг игровые ценности и не возвращать их. [Color=#ff0000]| Ban 30 дней / permban[/color].[/COLOR]<br><br>" +
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]займ может быть осуществлен только через зачисление игровых ценностей на банковский счет, максимальный срок займа 30 календарных дней, если займ не был возвращен, аккаунт должника блокируется;[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]при невозврате игровых ценностей общей стоимостью менее 5 миллионов включительно аккаунт будет заблокирован на 30 дней, если более 5 миллионов, аккаунт будет заблокирован навсегда;[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]жалоба на игрока, который занял игровые ценности и не вернул в срок, подлежит рассмотрению только при наличии подтверждения суммы и условий займа в игровом процессе, меры в отношении должника могут быть приняты только при наличии жалобы и доказательств. Жалоба на должника подается в течение 10 дней после истечения срока займа. Договоры вне игры не будут считаться доказательствами.[/FONT][/COLOR][/SIZE][/CENTER]<br>"+
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	                  title: '|╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ღ Правила игровых чатов ღ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴|',
},
{
	  title: '| CapsLock |',
	  content:
	    	"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>'+
                "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]3.02.[/color] Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>" +
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Оск. |',
	  content:
	    	"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>'+
                "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]3.03.[/color] Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>" +
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]PURPLE[/COLOR].<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Упом/оск родни |',
	  content:
	    	"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>'+
                "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]3.04.[/color] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [Color=#ff0000]| Mute 120 минут / Ban 7 - 15 дней[/color].[/COLOR]<br><br>" +
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]термины MQ, rnq расценивается, как упоминание родных.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Исключение: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]если упоминание родных было совершено в ходе Role Play процесса и не содержало в себе прямого или завуалированного оскорбления.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Flood |',
	  content:
	    	"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>'+
                "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]3.05.[/color] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>" +
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Злоуп.символами |',
	  content:
	    	"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>'+
                "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]3.06.[/color] Запрещено злоупотребление знаков препинания и прочих символов [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>" +
               "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]PURPLE[/COLOR].<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
    title: '| Слив глоб чата |',
	  content:
	    	"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>'+
                "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]3.08.[/color] Запрещены любые формы «слива» посредством использования глобальных чатов [Color=#ff0000]| PermBan[/color].[/COLOR]<br><br>" +
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]PURPLE[/COLOR].<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
      title: '| Выдача за Адм |',
	  content:
	    	"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>'+
                "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]3.10.[/color] Запрещена выдача себя за администратора, если таковым не являетесь [Color=#ff0000]| Ban 7 - 15[/color].[/COLOR]<br><br>" +
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Ввод в забл |',
	  content:
	    	"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>'+
                "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]3.11.[/color] Запрещено введение игроков проекта в заблуждение путем злоупотребления командами [Color=#ff0000]| Ban 15 - 30 дней / PermBan[/color].[/COLOR]<br><br>" +
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]/me чтобы поднять кошелек введите /pay 228 5000. Для продажи автомобиля введите /sellmycar id 2828 (счёт в банке) цена.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Музыка в воис |',
	  content:
	    	"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>'+
                "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]3.14.[/color] Запрещено включать музыку в Voice Chat [Color=#ff0000]| Mute 60 минут[/color].[/COLOR]<br><br>" +
               "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Масс флуд, политика |',
	  content:
	    	"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>'+
                "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]3.18.[/color] Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов [Color=#ff0000]| Mute 120 минут / Ban 10 дней[/color].[/COLOR]<br><br>" +
               "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
     title: '| Реклама промо |',
	  content:
	    	"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>'+
                "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]3.21.[/color] Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. [Color=#ff0000]| Ban 30 дней[/color].[/COLOR]<br><br>" +
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]промокоды, предоставленные разработчиками, а также распространяемые через официальные ресурсы проекта.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Исключение: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]разрешено изменение шрифта, его размера и длины чата (кол-во строк), блокировка за включенный счетчик FPS не выдается.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Реклама ГОСС |',
	  content:
	    	"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>'+
                "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]3.22.[/color] Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>" +
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Мат в VIP чат |',
	  content:
	    	"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>'+
                "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]3.23.[/color] Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>" +
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
    title: '|╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ღ Положение об игровых аккаунтах ღ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴|',
},
{
	  title: '| Оск ник |',
	  content:
	    	"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>'+
                "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]4.09.[/color] Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные) [Color=#ff0000]| Устное замечание + смена игрового никнейма / PermBan[/color].[/COLOR]<br><br>" +
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Фейк ник |',
	  content:
	    	"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>'+
                "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]4.10.[/color] Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию [Color=#ff0000]| Устное замечание + смена игрового никнейма / PermBan[/color].[/COLOR]<br><br>" +
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
     title: '|╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ღ Правила ГОСС организаций ღ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴|',
},
{
	  title: '| Работа в форме |',
	  content:
	    	"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>'+
                "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]1.07.[/color] Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, принадлежащей своей фракции [Color=#ff0000]|Jail 30 минут[/color].[/COLOR]<br><br>" +
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
     title: '| ГОСС Казино, Авторынок |',
	  content:
	    	"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>'+
                "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]1.13.[/color] Запрещено находиться в форме внутри казино, участвовать в битве за контейнеры, участвовать в захвате семейного контейнера, находится на Б/У рынке с целью покупки / продажи авто, а также устраиваться на сторонние работы в форме фракции. [Color=#ff0000]| Jail 30 минут[/color].[/COLOR]<br><br>" +
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
     title: '| СМИ НПРО |',
	  content:
	    	"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>'+
                "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]4.01.[/color] Запрещено редактирование объявлений, не соответствующих ПРО [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>" +
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| СМИ Замена объяв |',
	  content:
	    	"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>'+
                "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]4.04.[/color] Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком [Color=#ff0000]| Ban 7 дней + ЧС организации[/color].[/COLOR]<br><br>" +
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
      title: '| УМВД,ГИБДД,ФСБ розыск без причины |',
	  content:
	    	"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>'+
                "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]6.02.[/color] Запрещено выдавать розыск без Role Play причины. [Color=#ff0000]| Warn[/color].[/COLOR]<br><br>" +
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| ГИБДД Права в погоне |',
	  content:
	    	"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>'+
                "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]7.04.[/color] Запрещено отбирать водительские права во время погони за нарушителем. [Color=#ff0000]| Warn[/color].[/COLOR]<br><br>" +
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Non Rp адвокат |',
	  content:
	    	"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>'+
                "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]7.04.[/color] 3.01. Запрещено оказывать услуги адвоката на территории ФСИН находясь вне комнаты свиданий [Color=#ff0000]| Warn[/color].[/COLOR]<br><br>" +
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Non Rp Врач |',
	  content:
	    	"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>'+
                "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]7.04.[/color] 5.01. Запрещено использование оружия в рабочей форме [Color=#ff0000]| Jail 30 минут [/color].[/COLOR]<br><br>" +
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Исключение: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new] защита в целях самообороны, обязательно иметь видео доказательство в случае наказания администрации.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Non Rp Врач(ban) |',
	  content:
	    	"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>'+
                "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]7.04.[/color] 5.02. Запрещено вводить в заблуждение игроков, путем злоупотребления фракционными командами [Color=#ff0000]| Ban 3-5 дней + ЧС организации [/color].[/COLOR]<br><br>" +
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Пример: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new] Игрок обращается к сотруднику больницы с просьбой о лечении. Сотрудник применяет команду лечения, а затем выполняет команду для смены пола.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Non Rp УМВД |',
	  content:
	    	"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>'+
                "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]7.04.[/color] 6.03. Запрещено nRP поведение [Color=#ff0000]| Warn [/color].[/COLOR]<br><br>" +
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new] поведение, не соответствующее сотруднику УМВД.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Пример: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new] - открытие огня по игрокам без причины,<br>"+
                " асстрел машин без причины,<br>"+
                " нарушение ПДД без причины,<br>"+
                " сотрудник на служебном транспорте кричит о наборе в свою семью на спавне,,<br>"+
                " сотрудник с целью облегчить процесс конвоирования, убивает преступника в наручниках.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Non Rp ГИБДД |',
	  content:
	    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>'+
                "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]7.04.[/color] 7.02. Запрещено выдавать розыск, штраф без IC причины [Color=#ff0000]| Warn [/color].[/COLOR]<br><br>" +
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Non Rp ГИБДД остоновка |',
	  content:
	    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>'+
                "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]7.04.[/color] 7.03. Запрещено останавливать и осматривать транспортное средство без IC причины.[/COLOR]<br><br>" +
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new] Нарушения данного пункта правил регулируются лидером, в случае обращения к нему напрямую или через специальные темы на форуме.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Non Rp ГИБДД ВУ |',
	  content:
	    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>'+
                "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]7.04.[/color] 7.04. Запрещено отбирать водительские права во время погони за нарушителем [Color=#ff0000]| Warn [/color].[/COLOR]<br><br>" +
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new] запрещено несоответствующее поведение по аналогии с пунктом 6.03.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Non Rp ФСИН |',
	  content:
	    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>'+
                "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]7.04.[/color] 9.01. Запрещено освобождать заключённых, нарушая игровую логику организации [Color=#ff0000]| Warn [/color].[/COLOR]<br><br>" +
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Пример: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new] Выводить заключённых за территорию, используя фракционные команды, или открывать ворота территории ФСИН для выхода заключённых.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new] Побег заключённого возможен только на системном уровне через канализацию.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Non Rp ФСИН |',
	  content:
	    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>'+
                "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]7.04.[/color] 9.02. Запрещено выдавать выговор или поощрять заключенных, а также сажать их в карцер без особой IC причины [Color=#ff0000]| Warn [/color].[/COLOR]<br><br>" +
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Пример: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new] сотруднику ФСИН не понравилось имя заключенного и он решил его наказать выговором или посадить в карцер[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Слив склада |',
	  content:
	    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>'+
                "[B][CENTER][COLOR=white][FONT=courier new] В данном случае необходимо предоставить фрапс с /time, подтверждающий, что Вы являетесь владельцем семьи.<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000][/color] Также в видео должны быть зафиксированы:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]Также в видео должны быть зафиксированы:<br><br>"+
"[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]• уведомления семьи, где указаны условия взаимодействия со складом (патроны, деньги);<br><br>"+
"[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]• логи семьи, в которых отображаются нарушения со стороны игрока.<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
     title: '|╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ღ  Правила ОПГ ღ ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴|',
},
{
	  title: '| NonRp вч |',
	  content:
	    	"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>'+
                "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]2.00.[/color] Запрещается нарушение правил нападения на Войсковую Часть. [Color=#ff0000]| Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ)[/color].[/COLOR]<br><br>" +
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
      title: '|╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ღ  В другой раздел ღ ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴|',
},
{
	  title: '| В жалобы на администрацию |',
	  content:
	        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как вы ошиблись разделом. Обратитесь в раздел «Жалобы на администрацию». <br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Тех.спецу |',
	  content:
	        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба была передана [COLOR=yellow]на рассмотрение[/COLOR] [COLOR=orange]Техническому Специалисту[/COLOR].<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
     prefix: TEXY_PREFIX,
	  status: false,
},
{
	  title: '| В жалобы на Лд |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как вы ошиблись разделом. Обратитесь в раздел «Жалобы на лидеров». <br><br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| В обжалования |',
	  content:
	   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как вы ошиблись разделом. Обратитесь в раздел «Обжалование наказаний». <br><br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| В тех.раздел |',
	  content:
	   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как вы ошиблись разделом. Обратитесь в технический раздел. <br><br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| В жалобы на теха |',
	  content:
	   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как вы ошиблись разделом. Обратитесь в раздел «Жалобы на технических специалистов». <br><br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| В жалобы Организации |',
	  content:
	   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как вы ошиблись разделом. Обратитесь в раздел Жалобы на сотрудников организации. <br><br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
      title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ღ  Казино/ночной клуб ღ ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: ' | Принятие за деньги |',
      content:
          	"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>'+
                "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR],Игрок будет наказан по пункту правил:<br>2.01. Владельцу и менеджерам казино и ночного клуба запрещено принимать работников за денежные средства на должность охранника, крупье или механика [Color=#00FF00] | Ban 3 - 5 дней. [/color] [/COLOR][/FONT][/CENTER] <br>" +
                  "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
      title: '|╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ღ  Отказ жалобы ღ ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴|'
},
{
	  title: '| Нарушений не найдено |',
	  content:
	   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как нарушений со стороны данного игрока не было найдено. <br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Долг не через банк |',
	  content:
	    	"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>'+
                "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=red]отказана[/COLOR], так как все долговые перечисление должны перечисляться через банковскую систему.<br><br>",
		 prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Возврат средств |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как администрация сервера не несёт ответственности за утраченные Вами средства при обмане и т.д. <br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Недостаточно док-в |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательств на нарушение от данного игрока  недостаточно. <br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Отсутствуют док-ва |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательств на нарушение от данного игрока  отсутствуют. <br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Док-ва отредактированы |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательств на нарушение от данного игрока  отредактированы. <br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
               '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
       prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Слив семьи |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как слив семьи никак не относится к правилам проекта, то есть если Лидер семьи дал игроку роль заместителя, то только он за это и отвечает, Администрация сервера не несет за это ответственность. <br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Не по форме |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как ваша жалоба составлена не по форме. <br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Нет /time |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как на ваших доказательствах отсутствует /time.  <br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Нет time кодов|',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как отсутствует time коды. Если видео длится больше 3-ех минут - Вы должны указать time коды нарушений. <br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
               '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Более 72-х часов |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как с момента совершенного нарушения со стороны игрока прошло более 72 часов. Срок написания жалобы составляет три дня (72 часа) с момента совершенного нарушения со стороны игрока сервера.<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Док-ва через соц.сеть |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательства загружены в соц. сетях. Загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur). <br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Нет условий сделки |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как в Ваших доказательствах отсутствуют условия сделки. <br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Нужен фрапс |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательств недостаточно. В данной ситуации необходим фрапс(запись экрана). <br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
    	  title: '| Нет промотки чата |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как нужен фрапс + промотка чата. <br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
    title: '| Фрапс обрывается |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как видео-доказательство обрывается. Загрузите полную видеозапись на видео-хостинг YouTube. <br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
      title: '| Док-ва не открываются |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как ваши доказательства не открываются. <br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
               '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
     title: '| Жалоба от 3-го лица |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new]Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как Ваша жалоба написана от 3-го лица. Жалоба от третьего лица не принимается (жалоба должна быть подана участником ситуации). <br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
               '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Ошиблись сервером |',
	  content:
	     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как вы ошиблись сервером, перенаправляю  вашу жалобу на нужный сервер. <br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
               '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
      title: '|╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ღ  RolePlay Биографии ღ ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴|'
},
{
        	  title: '| Биография одобрена |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша RP Биография получает статус - [COLOR=#00FF00]Одобрено[/COLOR]<br><br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
    prefix: ACCСEPT_PREFIX,
	  status: false,
},
  {
      title: '| Биография не по форме |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Причиной отказа послужило нарушение формы подачи RP биографии. <br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
     title: '| Биография уже была одобрена |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new]Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Причиной отказа послужило то, что Ваша предыдущая Биография уже получила статус Одобрено.  <br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
          	  title: '| Мало информации в Биографии|',
	  content:
	   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR] <br><br>"+
"[B][CENTER][COLOR=white][FONT=courier new]Причиной отказа послужило - Недостаточно количество RolePlay информации о вашем персонаже.<br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Биография скопирована |',
	  content:
	   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]<br><br>"+
"[B][CENTER][COLOR=white][FONT=courier new]Причиной отказа послужило - Биография скопирована <br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]нарушением считаются такие действия, как езда на скутере по горам, намеренное создание аварийных ситуаций при передвижении. Передвижение по полям на любом транспорте, за исключением кроссовых мотоциклов и внедорожников.[/COLOR].<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Заголовок) |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]<br><br>"+
"[B][CENTER][COLOR=white][FONT=courier new]Причиной отказа послужило - Неправильное написание заголовка биографии. <br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
       title: '| Био отказ (Заголовок) |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]<br><br>"+
"[B][CENTER][COLOR=white][FONT=courier new]Причиной отказа послужило - Неправильное написание заголовка биографии. <br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (3-е лицо) |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]<br><br>"+
"[B][CENTER][COLOR=white][FONT=courier new]Причиной отказа послужило - Написание Биографии от 3-го лица.  <br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Возраст не совпал) |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR] <br><br>"+
"[B][CENTER][COLOR=white][FONT=courier new]Причиной отказа послужило - Возраст не совпадает с датой рождения.<br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Возраст) |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR] <br><br>"+
"[B][CENTER][COLOR=white][FONT=courier new]Причиной отказа послужило - Ваш возраст не подходит для составления RP Биографии.<br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Смысл несостык) |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]<br><br>"+
                 "[B][CENTER][COLOR=white][FONT=courier new]Причиной отказа послужило присутствие смысловых несостыковок в вашей RP биографии. <br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| В Биографии имя на английском |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white] [FONT=courier new]Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Причиной отказа послужило нарушение пункта правил - NickName должен быть указан на русском языке, как в заголовке, так и в самой теме.<br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (ООС инфа) |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR][/B][/CENTER][/COLOR=lavender]<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Причиной отказа послужило написание информации из реального мира (OOC).<br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Реалист) |',
	  content:
	      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Причиной отказа послужила нереалистичность Вашей биографии (OOC). <br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Несовпад мест рожд) |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Причиной отказа послужила разница между местом рождения в Информации и в самой Биографии. <br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},

  {
                	  title: '| Био отказ (Несовпад образов) |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white] [FONT=courier new]Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Причиной отказа послужила разница в образовании указанном в Информации и в Биографии. <br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| В Биографии ошибки |',
	  content:
	    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>" +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Причиной отказа послужило большое количество ошибок. <br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
     prefix: UNACCСEPT_PREFIX,
      status: false,
},
  {
                     title: '| На доработке |',
	  content:
	      "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>" +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] В вашей RolePlay - биографии недостаточно информации. Даю вам 24 часа на ее дополнение/ исправление, иначе РП биография будет отказана.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
		 "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
		 prefix: NARASSMOTRENIIRP_PREFIX,
	  status: false,
},
 {
                   title: '| Не дополнил в течении 24 часов |',
	  content:
	      "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>" +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша RolePlay - биография отказана т.к вы ее не дополнили.[/COLOR]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
     prefix: UNACCСEPT_PREFIX,
      status: false,
},
  {
      title: '|╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ღ RolePlay Ситуации ღ ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴|'
},
 {
                   title: '| Ситуация одобрена |',
	  content:
	     "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>" +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new]  Ваша RolePlay Ситуация  получает статус - [COLOR=#00FF00]Одобрено[/COLOR]<br><br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
    prefix: ACCСEPT_PREFIX,
	  status: false,
},
  {
                  title: '| Ситуация отказана |',
	  content:
	       "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>" +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша RolePlay - ситуация отказана.[/COLOR]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи RP Ситуаций, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
     prefix: UNACCСEPT_PREFIX,
      status: false,
},
  {
                  title: '| Ситуация не по форме |',
	  content:
	       "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>" +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша RolePlay - ситуация отказана т.к она составлена не по форме. <br>"+
			"[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи RP Ситуаций, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
     prefix: UNACCСEPT_PREFIX,
      status: false,
},
  {
                 title: '| Заголовок не по форме |',
	  content:
	      "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>" +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Заголовок вашей RolePlay ситуации составлен не по форме.<br>"+
			"[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи RP Ситуаций, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
     prefix: UNACCСEPT_PREFIX,
      status: false,
},
  {
     title: '|╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ღ Неофиц. RolePlay организации ღ ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴|'
},
 {
                 title: '|Организация одобрена |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша неофиц.RP Организация  получает статус - [COLOR=#00FF00]Одобрено[/COLOR]<br><br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
    prefix: ACCСEPT_PREFIX,
	  status: false,
},
  {
      title: '| Не по форме |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Причиной отказа послужило нарушение формы подачи Неофиц.RP Организаций.<br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=WHITE]WHITE[/COLOR].<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
 ];
 
	$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
	// Добавление кнопок при загрузке страницы
	addButton('На рассмотрение', 'pin');
	addButton('Отказано⛔', 'unaccept');
	addButton('Одобрено✅', 'accepted');
	addButton('Ответы💥', 'selectAnswer');
 
	// Поиск информации о теме
	const threadData = getThreadData();
 
	$('button#unaccept').click(() => editThreadData(UNACCСEPT_PREFIX, false));
	$('button#pin').click(() => editThreadData(PINN_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCСEPT_PREFIX, false));
	
 
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
// Функция для создания элемента с подсчетом
function createCountElement(className, count, text) {
  // Создаем новый элемент для отображения количества
  var countElement = document.createElement('div');
  // Устанавливаем класс для нового элемента
  countElement.className = 'count-element';
  // Записываем количество в новый элемент
  countElement.textContent = text + ': ' + count;
  // Применяем стили к новому элементу
  countElement.style.fontFamily = 'Arial';
  countElement.style.fontSize = '16px';
  countElement.style.color = 'red';

  return countElement;
}

// Функция для подсчета элементов и отображения их количества
function countElements() {
  // Получаем все элементы с классом 'structItem structItem--thread is-prefix14'
  var elements1 = document.querySelectorAll('.structItem.structItem--thread.is-prefix14');
  // Получаем все элементы с классом 'structItem structItem--thread is-prefix2'
  var elements2 = document.querySelectorAll('.structItem.structItem--thread.is-prefix2');

  // Подсчитываем количество найденных элементов
  var count1 = elements1.length;
  var count2 = elements2.length;

  // Находим элемент с классом 'filterBar'
  var filterBar = document.querySelector('.filterBar');

  // Проверяем, существует ли элемент 'filterBar'
  if (filterBar) {
    // Добавляем новый элемент перед элементом 'filterBar'
    filterBar.insertAdjacentElement('beforebegin', createCountElement('.structItem.structItem--thread.is-prefix14', count1, 'ТЕМЫ НА ОЖИДАНИИ'));
    filterBar.insertAdjacentElement('beforebegin', createCountElement('.structItem.structItem--thread.is-prefix2', count2, 'ТЕМЫ НА РАССМОТРЕНИИ'));
  } else {
    console.log('Элемент с классом "filterBar" не найден.');
  }
}

// Вызываем функцию при загрузке страницы
window.onload = function() {
  countElements();
};
	})();
  